import request from './request';

export const verifyUploadTest = ({ filename, fileHash }) =>
  request({
    url: '/verify',
    headers: {
      'content-type': 'application/json',
    },
    method: 'post',
    data: { filename, fileHash },
  });

// export const uploadChunks=(chunks,index)
