/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-10-15 17:03:50
 * @LastEditors: camus
 * @LastEditTime: 2021-10-15 17:37:38
 */
import React, { useState } from 'react';
interface IProps {
  goodsPrice: number;
}

const ShowGoods: React.FC<IProps> = ({ goodsPrice }) => {
  const [price, setPrice] = useState(goodsPrice);

  return (
    <div>
      this is the goods price {price} goodsPrice is {goodsPrice}
    </div>
  );
};
export default ShowGoods;
