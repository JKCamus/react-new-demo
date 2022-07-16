import { Button } from 'antd';
import React from 'react';

const Notice = (number, dataClick) => {
  return (
    <>
      notice
      {number}
      <Button onClick={dataClick}>点击试试</Button>
    </>
  );
};

const getNotice = (dataClick) => {
  const data = 56;

  return {
    notice: <Notice number={data} dataClick={dataClick} />,
    data,
  };
};

export default getNotice;

import { useEffect } from 'react';
import { Button } from 'antd';

const Business = ({ say, sonS, content = '默认' }) => {
  // useEffect(() => {
  //   say();
  //   sonS();
  // }, []);

  return (
    <div>
      Business
      {content}
      sonS();
      <Button onClick={say}>say</Button>
    </div>
  );
};

export { Business };

const renderCallback = async ({ say }) => {
  // 数据
  let content = 'hi 008';

  const sonS = () => {
    console.log('009');
  };

  const fetchData = async () => {
    return new Promise((resolv, reject) => {
      setTimeout(() => {
        resolv('content 1');
      }, 600);
    });
  };

  console.log('inner', content);
  // 我们提供rednerCallback是给业务方初始化数据
  /*
进而返回
{
  cpn,
  cpnData，//这里，组件与数据是分开的
  以及唯一Id等
}
如1.所示，
但是不能返回组件加上注入的C数据的
*/
  return {
    // 1. cpn: Business, //这是组件
    cpn: <Business say={say} content={content} sonS={sonS} />, // 2.
    flag: '1',
    content,
  };
};
export { renderCallback };
// export default Demo;
