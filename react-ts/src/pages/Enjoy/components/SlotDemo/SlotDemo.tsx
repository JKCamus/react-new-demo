/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-09-01 19:30:47
 * @LastEditors: camus
 * @LastEditTime: 2021-10-13 18:32:26
 */
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Card } from 'antd';
import Footer from './Footer';
import Header from './Header';

interface IProps {
  className?: string;
  footer?: ReactNode;
  header?: ReactNode;
}

const SlotDemo: React.FC<IProps> = ({ footer, header }) => {
  return (
    <SlotDemoWrapper>
      <Card>
        card
        <Header>{header}</Header>
        <Footer>{footer}</Footer>
      </Card>
    </SlotDemoWrapper>
  );
};
export default SlotDemo;

const SlotDemoWrapper = styled.div`
  background-color: #fff;
`;
