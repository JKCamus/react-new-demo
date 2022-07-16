/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-10-18 09:51:58
 * @LastEditors: camus
 * @LastEditTime: 2021-10-18 10:00:47
 */
import React from 'react';
import { Card } from 'antd';
import { MinuteCardWrapper } from './styles';

interface IProps {
  loading?: boolean;
}

const MinuteCard: React.FC<IProps> = ({ loading }) => {
  return (
    <MinuteCardWrapper>
      <Card loading={loading}>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </MinuteCardWrapper>
  );
};
export default MinuteCard;
