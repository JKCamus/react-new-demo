/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-10-14 15:00:00
 * @LastEditors: camus
 * @LastEditTime: 2022-01-10 10:43:40
 */

import { Button, Result } from 'antd';

const ErrorFallback = ({ error, resetErrorBoundary }: { error: any; resetErrorBoundary: any }) => {
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
