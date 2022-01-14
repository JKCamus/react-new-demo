import request, { AxiosRequestConfig } from './request';

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
