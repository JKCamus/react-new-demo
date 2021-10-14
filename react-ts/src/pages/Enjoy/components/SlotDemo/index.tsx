/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-09-15 19:17:29
 * @LastEditors: camus
 * @LastEditTime: 2021-10-14 15:09:02
 */
import { ErrorFallback } from '@/components/ErrorComponent';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import SlotDemo from './SlotDemo';

const TestHeader = () => {
  return <div>TestHeader Slot Consumer</div>;
};
const TestFooter = () => {
  return <div>TestFooter Slot Consumer</div>;
};

const SlotConsumer: React.FC = (props) => {
  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <SlotDemo header={<TestHeader />} footer={<TestFooter />} />
      </ErrorBoundary>
    </div>
  );
};
export default SlotConsumer;
