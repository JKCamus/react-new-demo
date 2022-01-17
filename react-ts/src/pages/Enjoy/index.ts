/*
 * @Description:动态引入demo路由
  通过仿vue动态添加路由的方式，根本原理是通过node读取文件配合正则匹配。
  只读取components底下第一层文件夹中的index.tsx，也就是各个demo的入口文件。
  遍历获取并且包裹错误边界，生成组件数组，方便路由的配置
 * @version:
 * @Author: camus
 * @Date: 2021-10-14 17:17:07
 * @LastEditors: camus
 * @LastEditTime: 2022-01-07 16:21:42
 */

// TODO导出模块合集 =>https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export
// export * from …; // does not set the default export
// export * as name1 from …; // Draft ECMAScript® 2O21
// export { name1, name2, …, nameN } from …;
// export { import1 as name1, import2 as name2, …, nameN } from …;
// export { default } from …;
import { widthErrorBoundary } from '@/components/ErrorBoundary';
// import normalAsyncUnMount from './components/AsyncUnMount';
// import normalSlotDemo from './components/SlotDemo';
// import normalVerify from './components/Verify';
// import normalReducerDemo from './components/StateWhen';
// import normalListDetail from './components/ListDetail';

// @ts-ignore
const Demo = require.context('@/pages/Enjoy/components', true, /^\.\/[^\/]+?\/index\.tsx/);

const WidthComponents: any = {};

Demo.keys().forEach((v) => {
  WidthComponents[Demo(v).default.name] = widthErrorBoundary(Demo(v).default);
});

const components = Demo.keys().map((demo) => {
  return { name: Demo(demo).default.name, component: widthErrorBoundary(Demo(demo).default) };
});

export default components;

// const AsyncUnMount = widthErrorBoundary(normalAsyncUnMount);
// const SlotDemo = widthErrorBoundary(normalSlotDemo);
// const Verify = widthErrorBoundary(normalVerify);
// const ReducerDemo = widthErrorBoundary(normalReducerDemo);
// const ListDetail = widthErrorBoundary(normalListDetail);

// export { AsyncUnMount, SlotDemo, Verify, ReducerDemo, ListDetail };
