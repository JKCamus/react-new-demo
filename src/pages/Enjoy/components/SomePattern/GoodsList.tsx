/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-10-15 17:10:45
 * @LastEditors: camus
 * @LastEditTime: 2021-10-16 09:00:44
 */
import React from 'react';
import ShowGoods from './ShowGoods';

interface IProps {
  children: (number) => React.ReactNode;
}

const GoodsList: React.FC<IProps> = (props) => {
  let goodsPrice = 101;
  return <div>{props.children(goodsPrice)}</div>;
};
export default GoodsList;
