import request from './request';

export const verifyUploadTest = ({ filename, fileHash }) =>
  request({
    url: '/verify',
    headers: {
      'content-type': 'application/json',
    },
    method: 'post',
    data: JSON.stringify({ filename, fileHash }),
  });
