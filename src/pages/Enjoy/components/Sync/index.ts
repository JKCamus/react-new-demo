
function deepClone(origin, m = new WeakMap()) {
  if (origin == undefined || typeof origin !== "object") {
    return origin;
  }
  if (origin instanceof Date) {
    return new Date(origin);
  }
  if (origin instanceof RegExp) {
    return new RegExp(origin);
  }
  const val = m.get(origin);
  if (val) {
    return val;
  }
  // {} 字面量生成的 也就是new Object生成的
  // constructor 是从原型上获得的指向 {}本身
  // 所以可以通过new这个构造器，生成一个新的对象
  const target = new origin.constructor();
  m.set(origin, target);
  for (let k in origin) {
    if (origin.hasOwnProperty(k)) {
      target[k] = deepClone(origin[k], m);
    }
  }
  return target;
}
let a = {},
  b = {};
b.a = a;
a.b = b;
console.log("res=>", deepClone(b));

//
Promise.MyAll = function (promises) {
  let result = [],
    count = 0
  return new Promise((resolve, reject) => {
    promises.forEach((item, i) => {
      Promise.resolve(item).then(res => {
        result[i] = res
        count += 1
        if (count === promises.length) resolve(result)
      }, reject)
    })
  })
}

// 3. curry
function curry(fn, ...args) {
  return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}
const add = (a, b, c) => a + b + c;
const curryAdd = curry(add);
console.log(curryAdd(1)(2)(3))

// 4.flatten
// 栈的形式实现
function flatten1(arr) {
  const result = [];
  // const stack = [].concat(arr);  // 将数组元素拷贝至栈，直接赋值会改变原数组
  const stack = [...arr];
  //如果栈不为空，则循环遍历
  while (stack.length !== 0) {
    const val = stack.pop();
    if (Array.isArray(val)) {
      stack.push(...val); //如果是数组再次入栈，并且展开了一层
    } else {
      result.unshift(val); //如果不是数组就将其取出来放入结果数组中
    }
  }
  return result;
}
// lrc
function LRU(operators, k) {
  // write code here
  let res = [];
  let map = new Map();
  for (let i = 0; i < operators.length; i++) {
    let [op, key, value] = operators[i];
    if (op === 1) {
      if (map.size >= k) {
        map.delete(map.keys().next().value);
        map.set(key, value);
      } else {
        if (map.has(key)) {
          map.delete(key);
        }
        map.set(key, value);
      }
    } else if (op === 2) {
      if (!map.has(key)) {
        res.push(-1);
      } else {
        let value = map.get(key);
        res.push(value);
        map.delete(key);
        map.set(key, value);
      }
    }
  }
  return res;
}
// 大数
var addStrings = function (num1, num2) {
  let i = num1.length - 1,
    j = num2.length - 1,
    carry = 0,
    ans = [];
  while (i >= 0 || j >= 0 || carry !== 0) {
    let c1 = i >= 0 ? num1.charAt(i) - "0" : 0,
      c2 = j >= 0 ? num2.charAt(j) - "0" : 0;
    let sum = c1 + c2 + carry;
    ans.unshift(sum % 10);
    carry = Math.floor(sum / 10);
    i--;
    j--;
  }
  return ans.join("");
};
// 数组转树
const fn = (arr) => {
  const res = [];
  const map = arr.reduce((res, item) => ((res[item.id] = item), res), {});
  for (const item of Object.values(map)) {
    if (!item.pId) {
      res.push(item);
    } else {
      const parent = map[item.pId];
      parent.child = parent.child || [];
      parent.child.push(item);
    }
  }
  return res;
};
// const arr = [{id: 1}, {id:2, pId: 1}, {id: 3, pId: 2}, {id: 4}, {id:3, pId: 2}, {id: 5, pId: 4}]
// fn(arr) => [{id: 1, child: [{id: 2, pId: 1, child: [{ id: 3, pId: 2}]}]}, {id: 4, child: [{id: 5, pId: 4}]}]

//
class EventEmitter {
  constructor() {
    this.events = {};
  }
  emit(event, ...args) {
    const cbs = this.events[event];
    if (!cbs) {
      console.log("没有这个事件");
      return this;
    }
    cbs.forEach((cb) => cb.apply(this, args));
    return this;
  }
  on(event, cb) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(cb);
    return this;
  }
  off(event, cb) {
    if (!cb) {
      this.events[event] = null;
    } else {
      this.events[event] = this.events[event].filter((item) => item !== cb);
    }
    return this;
  }
  once(event, cb) {
    const func = (...args) => {
      cb.apply(this, args);
      this.off(event, func);
    };
    this.on(event, func);
    return this;
  }
}
const emitter = new EventEmitter();
// reduce
Array.prototype.fakeReduce = function fakeReduce(fn, base) {
  if (typeof fn !== "function") {
    throw new TypeError("arguments[0] is not a function");
  }
  let initialArr = this;
  let arr = initialArr.concat();
  if (base) arr.unshift(base);
  let index, newValue;
  while (arr.length > 1) {
    index = initialArr.length - arr.length + 1;
    newValue = fn.call(null, arr[0], arr[1], index, initialArr);
    arr.splice(0, 2, newValue); // 直接用 splice 实现替换
  }
  return newValue;
};
// compose
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}



// 一个是将“函数数组(funs)”进行了颠倒(reverse)从而最右边的函数被最先被遍历，第二个则是颠倒了函数的组合顺序，每次遍历都是用当前的函数来包裹组合后的函数，因此它看上去是一层层的通过包裹嵌套a(b(c(...args)))来实现函数的组合，也只有这样，才能保证最先遍历的函数在组合函数的最里层，从而按照嵌套函数的执行顺序，能够被最先执行(保证从右向左的执行顺序)。

