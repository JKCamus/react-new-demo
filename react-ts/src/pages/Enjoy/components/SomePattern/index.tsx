/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-10-15 11:31:03
 * @LastEditors: camus
 * @LastEditTime: 2021-10-15 17:25:19
 */
import React from 'react';
import GoodsList from './GoodsList';
import ShowGoods from './ShowGoods';

const SomePattern: React.FC = (props) => {
  return (
    <div>
      SomePattern
      <GoodsList>{(data) => <ShowGoods goodsPrice={data} />}</GoodsList>
    </div>
  );
};
export default SomePattern;
