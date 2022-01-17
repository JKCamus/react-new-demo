import request, { AxiosRequestConfig } from './request';
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

export const verifyUploadTest = ({ filename, fileHash }) =>
  request({
    url: '/verify',
    headers: {
      'content-type': 'application/json',
    },
    method: 'post',
    data: JSON.stringify({ filename, fileHash }),
  });

export const uploadChunksTest = (params: FormData, config) => {
  request({
    url: '/uploadChunks',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
};

export const mergeChunks = (data) => {
  request({
    url: '/merge',
    headers: {
      'content-type': 'application/json',
    },
    method: 'post',
    data: JSON.stringify(data),
  });
};
