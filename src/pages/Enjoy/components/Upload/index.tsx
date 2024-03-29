import React, { useEffect, useState } from 'react';
import { Upload, message, Progress, Table, Button } from 'antd';
import { asyncRetry } from 'utils/asyncRetry';

import styled from 'styled-components';
const { Dragger } = Upload;
import { InboxOutlined } from '@ant-design/icons';
import { cloneDeep, isNaN } from 'lodash';
import { verifyUploadTest, mergeChunks, uploadChunksTest } from 'src/http/upload';
import axios, { AxiosRequestConfig } from 'axios';
import classnames from 'classnames';
import { useUpdateEffect } from 'ahooks';

interface IRequest {
  url: string;
  method?: string;
  data: any;
  headers?: any;
  onProgress?: any;
  requests?: any;
}

const Status = {
  wait: 'wait',
  pause: 'pause',
  uploading: 'uploading',
  error: 'error',
  done: 'done',
};
interface IChunk {
  // 切片源文件
  chunk: Blob;
  // hash值，用来标识文件的唯一性
  hash: string;
  // 文件名
  fileName: string;
  // 请求进度
  percentage: number;
  // 下标，标记哪些分片包已上传完成
  index: number;
  // abort上传请求
  cancel: () => void;
  status: typeof Status;
}

const SIZE = 20 * 1024 * 1024; // 切片大小

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
    isNaN(percentage) && setUploadPercentage(percentage);
    const doneChunks = fileChunkList.filter(({ status }) => status === Status.done);
    const fileChunksLen = fileChunkList.length;

    if (fileChunksLen > 0 && doneChunks.length === fileChunksLen) {
      const fileOption = {
        fileName: container?.file?.name,
        fileHash: container?.hash,
      };
      asyncRetry(() => mergeRequest(fileOption), { errorMessage: '重试3次后合并失败!' });
    }
  }, [fileChunkList]);

  useUpdateEffect(() => {
    if (fakeUploadPercentage < uploadPercentage) {
      setFakeUploadPercentage(uploadPercentage);
    }
  }, [uploadPercentage]);

  const handlePause = () => {
    setFakeStatus(Status.pause);
    resetData();
  };

  const resetData = () => {
    if (fileChunkList) {
      fileChunkList.forEach((chunkItem) => {
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

  //   输入：s = "ADOBECODEBANC", t = "ABC"
  // 输出："BANC"
  //   1.创建左指针，右指针
  // 2.将输入t的所有字符存入，map中
  // 3.建立循环，直到右指针到s字符串长度结束
  // 4.逐位移动右指针
  // 5.如果need中有当前右指针的字符，need中当前右指针字符对应的value - 1
  // 6.如果当前右指针字符对应的value === 0 needType -= 1
  // 7.当needType === 0时候说明已经找到符合要求的子串开始处理左指针

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
    // hash 可以不要在这边写，在uploadChunk里面写
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

    if (chunkData.length === uploadedList.length) {
      setFileChunkList(updateChunk);
      await mergeRequest(fileOption);
      return;
    }

    const requests = updateChunk
      .filter(({ hash }) => !uploadedList.includes(hash))
      .map((item) => {
        const { chunk, hash, index } = item;
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', hash);
        formData.append('filename', fileOption.fileName);
        formData.append('fileHash', fileOption.fileHash);
        return { formData, index, status: Status.wait, retryNum: 0 };
      });
    await controlRequest(requests, updateChunk);
  };
  /**
   * @description: 请求并发控制，错误重试
   * @param {*} requests
   * @param {*} chunkData
   * @param {*} limit
   */
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
          // const cancelToken = createCancelAction(chunkData[index]);
          const onCancel = (cancel) => {
            chunkData[index].cancel = cancel;
          };
          const onUploadProgress = createProgressHandler(chunkData, index);
          // uploadChunksTest1(formData, { cancelToken, onUploadProgress })
          uploadChunksTest(formData, { onUploadProgress, onCancel })
            .then(() => {
              requestData.status = Status.done;
              chunkData[index].status = Status.done;
              max += 1;
              counter += 1;
              if (counter === len) {
                resolve(counter);
              } else {
                start();
              }
            })
            .catch((error) => {
              if (!axios.isCancel(error)) {
                console.log('重试~~~~', error);
                max += 1;
                requestData.status = Status.error;
                chunkData[index].percentage = 0;
                if (typeof requestData['retryNum'] !== 'number') {
                  requestData['retryNum'] = 0;
                }
                requestData['retryNum'] += 1;
                if (requestData['retryNum'] > 2) {
                  counter++; // 把当前切块 3 次失败后，当做是成功了，不再重试发送了
                  chunkData[index].percentage = -1; // 更改上传失败进度条
                  chunkData[index].status = Status.error;
                }
                setFileChunkList(chunkData);
                start();
              }
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
    setFileChunkList([]);
  };

  const mergeRequest = async (fileOption) => {
    const mergeData = { size: SIZE, fileHash: fileOption.fileHash, filename: fileOption.fileName };
    // eslint-disable-next-line no-useless-catch
    try {
      await mergeChunks(mergeData);
      message.success('上传成功');
      setFakeStatus(Status.wait);
    } catch (error) {
      throw error;
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

  const cubeClass = (chunk: IChunk) => {
    const val = chunk.percentage;
    switch (true) {
      case val > 0 && val < 100:
        return 'uploading';
      case val < 0:
        return 'error';
      case val === 100:
        return 'success';
      default:
        break;
    }
  };

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
            恢复/重试
          </Button>
        </div>
      </UploadWrapper>
      <span>计算hash进度：</span>
      <Progress percent={hashPercentage} />
      <span>上传切片进度：</span>
      <Progress percent={fakeUploadPercentage} />
      <UploadShowWrapper>
        <div className="cube-container" style={{ width: `${Math.ceil(Math.sqrt(fileChunkList.length)) * 22}px` }}>
          {fileChunkList.map((chunk, index) => (
            <span
              className={classnames(cubeClass(chunk), 'cube')}
              key={chunk.key}
              style={{ height: `${chunk.percentage}%` }}
            >
              {index}
            </span>
          ))}
        </div>
        {/* <div className="ant-table">
          <Table
            size="small"
            columns={columns}
            dataSource={fileChunkList}
            scroll={{ x: 150, y: 300 }}
            pagination={false}
          ></Table>
        </div> */}
      </UploadShowWrapper>
    </div>
  );
};

export default UploadDemo;

const UploadWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const UploadShowWrapper = styled.div`
  margin-top: 20px;
  /* display: flex; */
  .ant-table {
    flex: 1;
  }
  .cube-container {
    width: 100px;
    overflow: hidden;
    color: #67c23a;
  }

  .cube {
    width: 22px;
    height: 20px;
    line-height: 20px;
    border: 1px solid black;
    background: #eee;
    float: left;
    text-align: center;
    box-sizing: border-box;
    &.success {
      background: #67c23a;
    }

    &.uploading {
      background: #409eff;
    }

    &.error {
      background: #f56c6c;
    }
  }
`;
