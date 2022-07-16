/*
 * @Description:注意，最开始的pre为undefined
 * @version:
 * @Author: camus
 * @Date: 2021-12-15 14:54:35
 * @LastEditors: camus
 * @LastEditTime: 2021-12-15 15:04:44
 */
import { useEffect, useRef } from 'react';

type Callback<T> = (prev?: T) => void;
interface Config {
  immediate: Boolean;
}

const useWatch = <T>(data: T, callback: Callback<T>, config: Config = { immediate: false }) => {
  const prev = useRef<T>();

  const { immediate } = config;

  const init = useRef(false);
  const stop = useRef(false);

  useEffect(() => {
    const execute = () => callback(prev.current);
    if (!stop.current) {
      if (!init.current) {
        init.current = true;
        immediate && execute();
      } else {
        execute();
      }
      prev.current = data;
    }
  }, [data]);

  return () => {
    stop.current = true;
  };
};

export default useWatch;
