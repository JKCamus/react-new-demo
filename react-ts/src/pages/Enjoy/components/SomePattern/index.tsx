/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-10-15 11:31:03
 * @LastEditors: camus
 * @LastEditTime: 2021-12-31 14:15:51
 */
import React, { useEffect } from 'react';
import GoodsList from './GoodsList';
import ShowGoods from './ShowGoods';
import { preImage } from './ProxyPattern';

const SomePattern: React.FC = (props) => {
  useEffect(() => {
    preImage.setSrc(
      'https://imglf6.lf127.net/img/fa162c1e75341664/U2hOVWd5ZGVuYjdsNU1RalNBcm4wVTR0dldTSzVwbkNCZXpRMk9CVUxmaz0.jpg?imageView&thumbnail=500x0&quality=96&stripmeta=0&type=jpg%7Cwatermark&type=2&text=wqkg6K-YU2luIC8gZXZpbGNsb3VkLmxvZnRlci5jb20=&font=bXN5aA==&gravity=southwest&dissolve=30&fontsize=240&dx=8&dy=10&stripmeta=0',
    );
  }, []);

  return (
    <div>
      SomePattern
      <GoodsList>{(data) => <ShowGoods goodsPrice={data} />}</GoodsList>
    </div>
  );
};
export default SomePattern;
