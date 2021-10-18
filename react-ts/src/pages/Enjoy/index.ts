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
const Demo = require.context('@/pages/Enjoy/components', true, /index\.tsx$/);
const WidthComponents: any = {};

Demo.keys().forEach((v) => {
  WidthComponents[Demo(v).default.name] = widthErrorBoundary(Demo(v).default);
  return widthErrorBoundary(Demo(v).default);
});

export const { AsyncUnMount, SlotConsumer, Verify, ReducerDemo, ListDetail, SomePattern, Minutes } = WidthComponents;

// const AsyncUnMount = widthErrorBoundary(normalAsyncUnMount);
// const SlotDemo = widthErrorBoundary(normalSlotDemo);
// const Verify = widthErrorBoundary(normalVerify);
// const ReducerDemo = widthErrorBoundary(normalReducerDemo);
// const ListDetail = widthErrorBoundary(normalListDetail);

// export { AsyncUnMount, SlotDemo, Verify, ReducerDemo, ListDetail };
