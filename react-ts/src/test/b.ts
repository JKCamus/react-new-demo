import React from "react";
import getNotice from "./demo";

export default () => {
  const handleClick = () => {
    console.log("点击率");
  };

  const { notice } = getNotice(handleClick);

  return (
    <>
    <div>{ notice } < /div>
    < />
  );
};


import "./styles.css";
import Demo, { Business, renderCallback } from "./demo";
import { useEffect, useState } from "react";
export default function App() {
  const [cpn, setCpn] = useState()
  //demo函数的返回
  const say = () => {
    console.log("hello");
  };
  useEffect(() => {
    const getData = async () => {
      const { cpn, flag, content } = await renderCallback({ say });
      setCpn(cpn)
    };
    getData();
  }, []);

  return (
    <div className= "App" >
    <h1>Hello CodeSandbox < /h1>
  {/* 不能作为组件 */ }
  {/* <Cpn/> */ }
  { }
  {/* {DemoBusiness} */ }
  {/* <Business say={say} /> */ }

  <h2>Start editing to see some magic happen! < /h2>
    < /div>
  );
}
