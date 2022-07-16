function deep(origin, m = new WeakMap()) {
  if (origin === undefined || typeof origin !== 'object') {
    return origin;
  }

  if (origin instanceof Date) {
    return new Date(origin);
  }
  if (origin instanceof RegExp) {
    return new RegExp(origin);
  }
  const val = m.get(origin);
  if (val) return val;
  const target = new origin.constructor();
  // 放入当前元素
  m.set(origin, target);
  for (let k in origin) {
    // 判断是否是自身的属性
    if (origin.hasOwnProperty(k)) {
      // 这一步，递归，传入weakMap
      target[k] = deep(origin[k], m);
    }
  }
  return target;
}
/**
 * @description:
 * 1. WeakMap
 *
 * 2. constructor
 * 3. hasOwnProperty
 */

Array.prototype.fakeFlat = function (num = 1) {
  if (!Number(num) || num < 0) return this;
  const arr = [...this];
  return num > 0
    ? arr.reduce((pre, curr) => {
        return Array.isArray(curr) ? [...pre, ...curr.fakeFlat(--num)] : [...pre, curr];
      }, [])
    : arr.slice();
};

Promise.MyAll = function (promises) {
  let result = [],
    count = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((item, i) => {
      Promise.resolve(item).then((res) => {
        result[i] = res;
        count += 1;
        if (count === promises.length) resolve(result);
      }, reject);
    });
  });
};
// test
let p1 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(1);
  }, 1000);
});
let p2 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(2);
  }, 2000);
});
let p3 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(3);
  }, 3000);
});
promiseAll([p3, p1, p2]).then((res) => {
  console.log(res); // [3, 1, 2]
});

const isS = (root) => {
  const help = (L, R) => {
    if (L === null && R === null) {
      return true;
    } else if (L === null || R === null || L.val !== R.val) {
      return false;
    } else {
      return help(L.left, R.right) && help(L.right, R.left);
    }
  };

  if (root === null) {
    return true;
  } else {
    help(root.left, root.right);
  }
};
