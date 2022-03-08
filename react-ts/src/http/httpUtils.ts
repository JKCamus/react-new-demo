import Axios, { AxiosRequestConfig } from 'axios';

const CancelToken = Axios.CancelToken;

const widthCancelToken = (request) => {
  let abort: (message: string) => void;

  const send = (data, config) => {
    cancelFunc();
    const cancelToken = new CancelToken((cancel) => {
      abort = cancel;
    });
    return request(data, { ...config, cancelToken });
  };

  const cancelFunc = (message = 'abort') => {
    if (abort) {
      console.log('message', message);
      abort(message);
      abort = null;
    }
  };

  return [send, cancelFunc];
};

export { widthCancelToken };
