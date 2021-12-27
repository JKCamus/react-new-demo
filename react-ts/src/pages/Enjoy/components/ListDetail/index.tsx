/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-10-11 10:26:58
 * @LastEditors: camus
 * @LastEditTime: 2021-12-15 14:59:36
 */
import React, { useState } from 'react';
import useWatch from './useWatch';

const ListDetail: React.FC = (props) => {
  const [num, setNum] = useState(1);

  useWatch(num, (pre) => console.log(pre, num), { immediate: true });

  return (
    <div>
      <div style={{ color: 'red' }}>{num}</div>
      <button onClick={() => setNum(num + 1)}>点我</button>
    </div>
  );
};
export default ListDetail;
