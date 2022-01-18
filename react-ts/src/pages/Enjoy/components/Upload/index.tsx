/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Upload, message, Progress, Table, Button } from 'antd';
import { useReactive } from 'utils/hooks';
import styled from 'styled-components';
const { Dragger } = Upload;
import { InboxOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import { verifyUploadTest, mergeChunks, uploadChunksTest } from 'src/http/upload';
import axios, { AxiosRequestConfig } from 'axios';

interface IRequest {
  url: string;
  method?: string;
  data: any;
  headers?: any;
  onProgress?: any;
  requests?: any;
}

interface IChunk {
  // 切片源文件
  chunk: Blob;
  // hash值，用来标识文件的唯一性
  hash: string;
  // 文件名
  fileName: string;
  // 请求进度
  progress: number;
  // 下标，标记哪些分片包已上传完成
  index: number;
  // abort上传请求
  cancel: () => void;
}

const SIZE = 20 * 1024 * 1024; // 切片大小

const Status = {
  wait: 'wait',
  pause: 'pause',
  uploading: 'uploading',
  error: 'error',
  done: 'done',
};

const uploadChunksTest1 = (param: FormData, config: AxiosRequestConfig) =>
  axios.post('http://localhost:3000/uploadChunks', param, config);

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
    if (!container.file || !fileChunkList?.length) {
      setUploadPercentage(0);
    }
    const loaded = fileChunkList.map((item) => item.size * item.percentage).reduce((acc, cur) => acc + cur, 0);
    const percentage = parseInt((loaded / container.file?.size).toFixed(2), 10);
    percentage !== NaN && setUploadPercentage(percentage);
    if (percentage === 100) {
      const fileOption = {
        fileName: container.file.name,
        fileHash: container.hash,
      };
      mergeRequest(fileOption);
    }
  }, [fileChunkList]);

  const handlePause = () => {
    setFakeStatus(Status.pause);
    resetData();
  };

  // const resetData = () => {
  //   if (requestList) {
  //     requestList.forEach((xhr) => xhr?.abort());
  //     if (container.worker) {
  //       setContainer({ ...container, worker: { ...container?.worker, onmessage: null } });
  //     }
  //   }
  // };

  const resetData = () => {
    if (fileChunkList) {
      fileChunkList.forEach((chunkItem) => {
        console.log('chunkItem', chunkItem);
        chunkItem?.cancel && chunkItem.cancel(chunkItem.hash);
      });
      if (container.worker) {
        setContainer({ ...container, worker: { ...container?.worker, onmessage: null } });
      }
    }
  };

  const handleResume = async () => {
    setFakeStatus(Status.uploading);
    const { uploadedList = [] } = await verifyUpload({ filename: container.file.name, fileHash: container.hash });

    const fileOption = {
      fileName: container.file.name,
      fileHash: container.hash,
    };
    await uploadChunks(uploadedList, fileOption, fileChunkList);
  };

  const request = ({ url, method = 'post', data, headers = {}, onProgress = (e) => e, requests }: IRequest) => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = 10000;
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

  const calculateHashSampleTest = (file) => {
    return new Promise((resolve) => {
      const workerHash = new Worker('/hashSample.js');
      setContainer({ ...container, worker: workerHash });
      workerHash.postMessage(file);
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
    const hash = await calculateHashSampleTest(file);

    const chunkList = createFileChunk(file);

    const { shouldUpload, uploadedList } = await verifyUpload({ filename: file.name, fileHash: hash });

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
    const updateChunk = chunkData.map((chunk) => ({
      ...chunk,
      percentage: uploadedList.includes(chunk.hash) ? 100 : 0,
    }));
    const requests = updateChunk
      .filter(({ hash }) => !uploadedList.includes(hash))
      .map((item) => {
        const { chunk, hash, index } = item;
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', hash);
        formData.append('filename', fileOption.fileName);
        formData.append('fileHash', fileOption.fileHash);
        const cancelToken = createCancelAction(item);
        const onUploadProgress = createProgressHandler(updateChunk, index);
        return uploadChunksTest1(formData, {
          onUploadProgress,
          cancelToken,
        });
        // return uploadChunksTest(formData, { onUploadProgress, cancelToken });
        // return { formData, index, status: Status.wait, retryNum: 0 };
      });

    // .map(async ({ formData, index }) =>
    //   request({
    //     url: 'http://localhost:3000/uploadChunks',
    //     data: formData,
    //     onProgress: createProgressHandler(chunkData, index),
    //     requests: requestList,
    //   }),
    // );
    await Promise.all(requests);

    // const counter = await controlRequest(requests, chunkData);
    // console.log('counter', counter);
    // 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量时
    // 合并切片
    // if (uploadedList.length + requests.length === chunkData.length) {
    //   await mergeRequest(fileOption);
    // }
  };
  // 获取cancelToken
  const createCancelAction = (chunk: IChunk) => {
    const { cancel, token } = axios.CancelToken.source();
    chunk.cancel = cancel;
    return token;
  };

  const controlRequest = async (requests, chunkData, limit = 3) => {
    return new Promise<number>((resolve, reject) => {
      const len = requests.length;
      let counter = 0;
      let max = limit;
      const start = async () => {
        while (counter < len && max > 0) {
          max--;
          const requestData = requests.find(
            (r) => r.status === Status.wait || (r.status === Status.error && r.retryNum <= 2),
          );
          if (!requestData) continue;

          requestData.status = requestData.status = Status.uploading;
          const formData = requestData.formData;
          const index = requestData.index;
          // 任务不能仅仅累加获取，而是要根据状态
          // wait和error的可以发出请求 方便重试
          request({
            url: 'http://localhost:3000',
            data: formData,
            onProgress: createProgressHandler(chunkData, index),
            requests: requestList,
          })
            .then(() => {
              requestData.status = Status.done;
              max += 1;
              counter += 1;
              if (counter === len) {
                resolve(counter);
              } else {
                start();
              }
            })
            .catch((error) => {
              console.log('重试~~~~', error);
              max += 1;
              requestData.status = Status.error;
              chunkData[index].process = 0;
              setFileChunkList(cloneDeep(chunkData));
              if (typeof requestData['retryNum'] !== 'number') {
                requestData['retryNum'] = 0;
              }
              requestData['retryNum'] += 1;
              if (requestData['retryNum'] > 2) {
                counter++; // 把当前切块 3 次失败后，当做是成功了，不再重试发送了
                chunkData[index].process = -1; // 更改上传失败进度条
              }
              start();
            });
        }
      };
      start();
    });
  };

  // 创建每个chunk上传的progress监听函数
  const createProgressHandler = (chunkData, index: number) => {
    return (e) => {
      setFileChunkList((pre) => {
        const newChunkList = [...chunkData];
        if (newChunkList[index]) {
          newChunkList[index].percentage = parseInt(String((e.loaded / e.total) * 100), 10);
          return newChunkList;
        }
      });
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

  const mergeRequest = async (fileOption) => {
    try {
      const mergeData = { size: SIZE, fileHash: fileOption.fileHash, filename: fileOption.fileName };
      await mergeChunks(mergeData);
      message.success('上传成功');
      setFakeStatus(Status.wait);
    } catch (error) {
      message.success('上传成功失败');
    }
  };

  // 根据 hash 验证文件是否曾经已经被上传过
  // 没有才进行上传
  const verifyUpload = async ({ filename, fileHash }): Promise<any> => {
    const res = await verifyUploadTest({ filename, fileHash });
    return res;
  };
  const onDrop = (e) => {
    // console.log('Dropped files', e.dataTransfer.files);
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
