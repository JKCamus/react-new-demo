/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Upload, message, Progress, Table, Button } from 'antd';
import { useReactive } from 'utils/hooks';
import styled from 'styled-components';
const { Dragger } = Upload;
import { InboxOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import { verifyUploadTest } from 'src/http/upload';
import SparkMD5 from 'spark-md5';
interface IRequest {
  url: string;
  method?: string;
  data: any;
  headers?: any;
  onProgress?: any;
  requests?: any;
}

const SIZE = 20 * 1024 * 1024; // 切片大小

const Status = {
  wait: 'wait',
  pause: 'pause',
  uploading: 'uploading',
};

const UploadDemo: React.FC = (props) => {
  const [status, setStatus] = useState(Status);
  const [fileList, setFileList] = useState([]);
  const [container, setContainer] = useState<any>({
    file: null,
    hash: '',
    worker: null,
  });
  const [hashPercentage, setHashPercentage] = useState(0);
  const [fileChunkList, setFileChunkList] = useState<any[]>([]);
  const [requestList, setRequestList] = useState([]);
  const [fakeStatus, setFakeStatus] = useState(Status.wait);
  const [fakeUploadPercentage, setFakeUploadPercentage] = useState(0);
  const [uploadDisabled, setUploadDisabled] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  useEffect(() => {
    const disabled = !container.file || [Status.pause, Status.uploading].includes(fakeStatus);
    setUploadDisabled(disabled);
  }, [container.file, Status]);

  useEffect(() => {
    if (!container.file || !fileChunkList.length) {
      setUploadPercentage(0);
    }
    const loaded = fileChunkList.map((item) => item.size * item.percentage).reduce((acc, cur) => acc + cur, 0);
    console.log('loaded', loaded);
    console.log('container.file?.size', container.file?.size);
    const percentage = parseInt((loaded / container.file?.size).toFixed(2), 10);
    percentage !== NaN && setUploadPercentage(percentage);
  }, [fileChunkList]);

  const handlePause = () => {
    setFakeStatus(Status.pause);
    resetData();
  };

  const resetData = () => {
    if (requestList) {
      requestList.forEach((xhr) => xhr?.abort());
      if (container.worker) {
        setContainer({ ...container, worker: { ...container?.worker, onmessage: null } });
      }
    }
  };

  const handleResume = async () => {
    setFakeStatus(Status.uploading);
    const { uploadedList } = await verifyUpload(container.file.name, container.hash);
    const fileOption = {
      fileName: container.file.name,
      fileHash: container.hash,
    };
    await uploadChunks(uploadedList, fileOption, fileChunkList);
  };

  const request = ({ url, method = 'post', data, headers = {}, onProgress = (e) => e, requests }: IRequest) => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = onProgress;
      xhr.open(method, url);
      Object.keys(headers).forEach((key) => xhr.setRequestHeader(key, headers[key]));
      xhr.send(data);
      xhr.onload = (e: any) => {
        // 将请求成功的 xhr 从列表中删除
        if (requestList) {
          const xhrIndex = requestList.findIndex((item) => item === xhr);
          requestList.splice(xhrIndex, 1);
          setRequestList(requestList);
        }

        resolve({
          data: e.target.response,
        });
      };
      // 暴露当前 xhr 给外部
      requests?.push(xhr);
      setRequestList(requests);
    });
  };
  // 生成文件切片
  const createFileChunk = (file, size = SIZE) => {
    const chunkList = [];
    let cur = 0;
    while (cur < file.size) {
      chunkList.push({ file: file.slice(cur, cur + size) });
      cur += size;
    }
    return chunkList;
  };

  // 生成文件 hash（web-worker）
  const calculateHash = (chunkList) => {
    return new Promise((resolve) => {
      const workerHash = new Worker('/hash.js');
      setContainer({ ...container, worker: workerHash });
      workerHash.postMessage({ chunkList });
      workerHash.onmessage = (e) => {
        const { percentage, hash } = e.data;
        setHashPercentage(parseInt(percentage.toFixed(2), 10));
        if (hash) {
          resolve(hash);
        }
      };
    });
  };

  const handleUpload = async (option: any) => {
    const file = option.file as File;
    if (!file) return;
    setFakeStatus(Status.uploading);
    const chunkList = createFileChunk(file);
    console.log('chunkList', chunkList);
    const hash: any = await calculateHash(chunkList);

    // const { shouldUpload, uploadedList } = await verifyUpload(file.name, hash);
    const { shouldUpload, uploadedList } = await verifyUpload1({ filename: file.name, fileHash: hash });

    if (!shouldUpload) {
      message.success('秒传：上传成功');
      setFakeStatus(Status.wait);
      return;
    }
    //hash 可以不要在这边写，在uploadChunk里面写
    const chunkData = chunkList.map(({ file }, index) => ({
      key: hash + '-' + index,
      fileHash: hash,
      index,
      hash: hash + '-' + index,
      chunk: file,
      size: file.size,
      fileName: file.name,
      percentage: uploadedList.includes(index) ? 100 : 0,
    }));
    setContainer({ ...container, hash: hash, file: file });

    const fileOption = {
      fileName: file.name,
      fileHash: hash,
    };

    await uploadChunks(uploadedList, fileOption, chunkData);
  };

  // 上传切片，同时过滤已上传的切片
  const uploadChunks = async (uploadedList = [], fileOption, chunkData) => {
    const requests = chunkData
      .filter(({ hash }) => !uploadedList.includes(hash))
      .map(({ chunk, hash, index }) => {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', hash);
        formData.append('filename', fileOption.fileName);
        formData.append('fileHash', fileOption.fileHash);
        return { formData, index };
      })
      .map(async ({ formData, index }) =>
        request({
          url: 'http://localhost:3000',
          data: formData,
          onProgress: createProgressHandler(chunkData, index),
          requests: requestList,
        }),
      );
    await Promise.all(requests);
    // 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量时
    // 合并切片
    if (uploadedList.length + requests.length === chunkData.length) {
      await mergeRequest(fileOption);
    }
  };

  // const calculateHashSample=async() =>{
  //   return new Promise(resolve => {
  //     const spark = new SparkMD5.ArrayBuffer();
  //     const reader = new FileReader();
  //     const file = this.container.file;
  //     // 文件大小
  //     const size = this.container.file.size;
  //     let offset = 2 * 1024 * 1024;
  //     let chunks = [file.slice(0, offset)];
  //     // 前面100K

  //     let cur = offset;
  //     while (cur < size) {
  //       // 最后一块全部加进来
  //       if (cur + offset >= size) {
  //         chunks.push(file.slice(cur, cur + offset));
  //       } else {
  //         // 中间的 前中后去两个字节
  //         const mid = cur + offset / 2;
  //         const end = cur + offset;
  //         chunks.push(file.slice(cur, cur + 2));
  //         chunks.push(file.slice(mid, mid + 2));
  //         chunks.push(file.slice(end - 2, end));
  //       }
  //       // 前取两个字节
  //       cur += offset;
  //     }
  //     // 拼接
  //     reader.readAsArrayBuffer(new Blob(chunks));
  //     reader.onload = e => {
  //       spark.append(e.target.result);

  //       resolve(spark.end());
  //     };
  //   });
  // }

  const mergeRequest = async (fileOption) => {
    await request({
      url: 'http://localhost:3000/merge',
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify({
        size: SIZE,
        fileHash: fileOption.fileHash,
        filename: fileOption.fileName,
      }),
    });
    message.success('上传成功');
    setFakeStatus(Status.wait);
  };

  // 根据 hash 验证文件是否曾经已经被上传过
  // 没有才进行上传
  const verifyUpload = async (filename, fileHash) => {
    const res: any = await request({
      url: 'http://localhost:3000/verify',
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify({
        filename,
        fileHash,
      }),
    });
    return JSON.parse(res?.data);
  };

  const verifyUpload1 = async ({ filename, fileHash }): Promise<any> => {
    const res = await verifyUploadTest({ filename, fileHash });
    return res;
  };
  // 用闭包保存每个 chunk 的进度数据
  const createProgressHandler = (chunkData, index) => {
    return (e) => {
      chunkData[index].percentage = parseInt(String((e.loaded / e.total) * 100), 10);
      setFileChunkList(cloneDeep(chunkData));
    };
  };
  const handleChange = ({ fileList: newFileList }) => {
    resetData();
    setFileList([]);
    // const { status } = info.file;
    // console.log('FileList', info.file);
    // if (status !== 'uploading') {
    //   console.log(info.file, info.fileList);
    // }
    // if (status === 'done') {
    //   message.success(`${info.file.name} file uploaded successfully.`);
    // } else if (status === 'error') {
    //   message.error(`${info.file.name} file upload failed.`);
    // }
  };

  const onDrop = (e) => {
    console.log('Dropped files', e.dataTransfer.files);
  };

  const columns = [
    {
      title: 'hash',
      dataIndex: 'hash',
      key: 'hash',
      width: '20%',
    },
    {
      title: 'progress',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => <Progress percent={percentage} />,
    },
    {
      title: 'size',
      dataIndex: 'size',
      key: 'size',
      width: '10%',
      render: (size) => <span>{Number((size / 1024).toFixed(0))}</span>,
    },
  ];

  return (
    <div>
      <UploadWrapper>
        <Dragger
          name="file"
          multiple
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          onChange={handleChange}
          onDrop={onDrop}
          customRequest={handleUpload}
          fileList={fileList}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files
          </p>
        </Dragger>
        <div>
          <Button onClick={handlePause}>暂停</Button>
          <Button type="primary" onClick={handleResume}>
            恢复
          </Button>
        </div>
      </UploadWrapper>

      <span>计算hash进度</span>
      <Progress percent={hashPercentage} />
      <span>上传</span>
      <Progress percent={uploadPercentage} />
      <Table
        size="small"
        columns={columns}
        dataSource={fileChunkList}
        scroll={{ x: 1500, y: 300 }}
        pagination={false}
      ></Table>
    </div>
  );
};

export default UploadDemo;

const UploadWrapper = styled.div`
  display: flex;
`;
