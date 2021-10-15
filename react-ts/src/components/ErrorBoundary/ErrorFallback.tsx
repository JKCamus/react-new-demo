/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-10-14 15:00:00
 * @LastEditors: camus
 * @LastEditTime: 2021-10-14 19:33:35
 */

import { Button, Result } from 'antd';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <Result
      status="warning"
      title={`Something error width ${error.message}`}
      extra={
        <Button onClick={resetErrorBoundary} type="primary" key="console">
          Try again
        </Button>
      }
    />
  );
};
export default ErrorFallback;
