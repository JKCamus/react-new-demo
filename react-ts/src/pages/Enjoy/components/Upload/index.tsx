/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { Upload, message } from 'antd';
const { Dragger } = Upload;
import { InboxOutlined } from '@ant-design/icons';

interface IRequest {
  url: string;
  method?: string;
  data: any;
  headers?: any;
  onProgress?: any;
  requestList?: any;
}

const SIZE = 10 * 1024 * 1024; // 切片大小

const Status = {
  wait: 'wait',
  pause: 'pause',
  uploading: 'uploading',
};

const UploadDemo: React.FC = (props) => {
  const [status, setStatus] = useState(Status);
  const [container, setContainer] = useState<any>({
    file: null,
    hash: '',
    worker: null,
  });
  const [hashPercentage, setHashPercentage] = useState(0);
  const [data, setData] = useState<any[]>([]);
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
    if (!container.file || !data.length) {
      setUploadPercentage(0);
    }
    const loaded = data.map((item) => item.size * item.percentage).reduce((acc, cur) => acc + cur, 0);
    const percentage = parseInt((loaded / container.file?.size).toFixed(2), 10);
    setUploadPercentage(percentage);
  }, []);

  const handlePause = () => {
    setFakeStatus(Status.pause);
    resetData();
  };

  const resetData = () => {
    requestList.forEach((xhr) => xhr?.abort());
    setRequestList([]);
    if (container.worker) {
      setContainer({ ...container, worker: { ...container?.worker, onmessage: null } });
    }
  };
  const handleResume = async () => {
    setFakeStatus(Status.uploading);
    const { uploadedList } = await verifyUpload(container.file.name, container.hash);
    await uploadChunks(uploadedList);
  };

  const request = ({ url, method = 'post', data, headers = {}, onProgress = (e) => e, requestList }: IRequest) => {
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
        }
        resolve({
          data: e.target.response,
        });
      };
      // 暴露当前 xhr 给外部
      requestList?.push(xhr);
    });
  };
  // 生成文件切片
  const createFileChunk = (file, size = SIZE) => {
    const fileChunkList = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push({ file: file.slice(cur, cur + size) });
      cur += size;
    }
    return fileChunkList;
  };

  // 生成文件 hash（web-worker）
  const calculateHash = (fileChunkList) => {
    console.log('fileChunkList', fileChunkList);
    return new Promise((resolve) => {
      const workerHash = new Worker('/hash.js');
      setContainer({ ...container, worker: workerHash });
      workerHash.postMessage({ fileChunkList });
      workerHash.onmessage = (e) => {
        const { percentage, hash } = e.data;
        setHashPercentage(percentage);
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
    const fileChunkList = createFileChunk(file);
    const hash: any = await calculateHash(fileChunkList);
    setTimeout(() => {
      setContainer({ ...container, hash: hash, file: file });
    }, 0);

    const { shouldUpload, uploadedList } = await verifyUpload(file.name, hash);

    if (!shouldUpload) {
      message.success('秒传：上传成功');
      setFakeStatus(Status.wait);
      return;
    }

    const data = fileChunkList.map(({ file }, index) => ({
      fileHash: container.hash,
      index,
      hash: container.hash + '-' + index,
      chunk: file,
      size: file.size,
      percentage: uploadedList.includes(index) ? 100 : 0,
    }));
    setData(data);

    await uploadChunks(uploadedList);
  };

  // 上传切片，同时过滤已上传的切片
  const uploadChunks = async (uploadedList = []) => {
    const requestList = data
      .filter(({ hash }) => !uploadedList.includes(hash))
      .map(({ chunk, hash, index }) => {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', hash);
        formData.append('filename', container.file.name);
        formData.append('fileHash', container.hash);
        return { formData, index };
      })
      .map(async ({ formData, index }) =>
        request({
          url: 'http://localhost:3000',
          data: formData,
          onProgress: createProgressHandler(data[index]),
          requestList: [],
        }),
      );
    await Promise.all(requestList);
    // 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量时
    // 合并切片
    if (uploadedList.length + requestList.length === data.length) {
      await mergeRequest();
    }
  };

  const mergeRequest = async () => {
    await request({
      url: 'http://localhost:3000/merge',
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify({
        size: SIZE,
        fileHash: container.hash,
        filename: container.file.name,
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
  // 用闭包保存每个 chunk 的进度数据
  const createProgressHandler = (item) => {
    return (e) => {
      item.percentage = parseInt(String((e.loaded / e.total) * 100), 10);
    };
  };
  const handleChange = (info) => {
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

  return (
    <div>
      <Dragger
        name="file"
        multiple
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        onChange={handleChange}
        onDrop={onDrop}
        customRequest={handleUpload}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files
        </p>
      </Dragger>
    </div>
  );
};
export default UploadDemo;
