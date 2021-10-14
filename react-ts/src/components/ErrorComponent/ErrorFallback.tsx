/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-10-14 15:00:00
 * @LastEditors: camus
 * @LastEditTime: 2021-10-14 15:02:18
 */
import React from 'react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};
export default ErrorFallback;
