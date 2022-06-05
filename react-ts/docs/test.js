/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2022-05-05 15:53:24
 * @LastEditors: camus
 * @LastEditTime: 2022-05-13 14:52:47
 */
// function compose(...funcs) {
//   return function (input) {
//     return funcs.reverse().reduce((result, next) => next.call(this, result), input);
//   };
// }

// function promiseCompose(...fns) {
//   if (!Array.isArray(fns)) throw new TypeError('fn stack must be an array!');
//   return async function (result) {
//     const list = fns.slice();
//     console.log('res=>', list);
//     let r = result;
//     while (list.length > 0) {
//       const fn = list.pop();
//       r = await fn(result);
//     }
//     return r;
//   };
// }

// const res = async function (input) {
//   const re = await promiseCompose(fn3, fn2, fn1)({});
//   console.log('re', re);
// };

// res();

function compose(middleware) {
  //  参数middleware 是一个中间件数组，存放我们用app.use()一个个串联起来的中间件
  //  判断中间件列表是否为数组，如果不为数组，则抛出类型错误

  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!');
  // 判断中间件是否为函数，如果不为函数，则抛出类型错误
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!');
  }

  /**
 1. @param {Object} context
 2. @return {Promise}
 3. @api public
   */

  return function (context, next) {
    // 这里next指的是洋葱模型的中心函数
    // context是一个配置对象，保存着一些配置，当然也可以利用context将一些参数往下一个中间传递
    // last called middleware #
    let index = -1; // index是记录执行的中间件的索引
    return dispatch(0); // 执行第一个中间件  然后通过第一个中间件递归调用下一个中间件
    function dispatch(i) {
      // 这里是保证同个中间件中一个next（）不被调用多次调用
      // 当next()函数被调用两次的时候，i会小于index,然后抛出错误
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn = middleware[i]; // 取出要执行的中间件
      if (i === middleware.length) fn = next; // 如果i 等于 中间件的长度，即到了洋葱模型的中心（最后一个中间件）
      if (!fn) return Promise.resolve(); // 如果中间件为空，即直接resolve
      try {
        //  递归执行下一个中间件 （下面会重点分析这个）
        dispatch(i + 1);
        return Promise.resolve(fn(context));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}

const arr = [];
const stack = [];

// stack.push(async (context, next) => {
//   arr.push(1);
//   arr.push(6);
// });

// stack.push(async (context, next) => {
//   arr.push(2);
//   arr.push(5);
// });

// stack.push(async (context, next) => {
//   arr.push(3);
//   arr.push(4);
// });

stack.push(async (ctx, next) => {
  arr.push(1);
  try {
    arr.push(6);
  } catch (err) {
    arr.push(2);
  }
  arr.push(3);
});

stack.push(async (ctx, next) => {
  arr.push(4);
  throw new Error();
});

function promiseCompose([...fns]) {
  if (!Array.isArray(fns)) throw new TypeError('fn stack must be an array!');
  return async function (result) {
    const list = fns.slice();
    let r = result;
    while (list.length > 0) {
      const fn = list.pop();
      try {
        r = await fn(result);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return r;
  };
}

function composeSource(middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!');
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!');
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}

const fn1 = (msgData) => {
  console.log('res=>1', msgData);
  msgData.body = '1';
  return msgData;
};

const fn2 = (msgData) => {
  return new Promise((resolve) => {
    msgData.body = '2';
    console.log('res=>', msgData);
    resolve(msgData);
  });
};

const fn3 = (msgData) => {
  return new Promise((resolve) => {
    msgData.body = '3';
    resolve(msgData);
  });
};

const res1 = async function (input) {
  // const re = await compose(stack)({});
  const res = await promiseCompose(stack)({});
  console.log('res=>', res);
  console.log('a', arr);
};

res1();
