```ts
Function.prototype.myCall = function (context = window, ...args) {
  if (this === Function.prototype) {
    return undefined; // 用于防止 Function.prototype.myCall() 直接调用
  }
  context = context || window;
  const fn = Symbol();
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};

Function.prototype.myApply = function (context = window, args) {
  if (this === Function.prototype) {
    return undefined; // 用于防止 Function.prototype.myCall() 直接调用
  }
  const fn = Symbol();
  context[fn] = this;
  let result;
  if (Array.isArray(args)) {
    result = context[fn](...args);
  } else {
    result = context[fn]();
  }
  delete context[fn];
  return result;
};

Function.prototype.myBind = function (context, ...args1) {
  if (this === Function.prototype) {
    throw new TypeError('Error');
  }
  const _this = this;
  return function F(...args2) {
    // 判断是否用于构造函数
    if (this instanceof F) {
      return new _this(...args1, ...args2);
    }
    return _this.apply(context, args1.concat(args2));
  };
};
```

```ts
class LRUCache {
  private caches = new Map<number, number>();
  private capacity: number;
  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: number): number {
    const val = this.caches.get(key);
    if (val === undefined) {
      return -1;
    }
    this.caches.delete(key);
    this.caches.set(key, val);
    return val;
  }

  put(key: number, value: number): void {
    const val = this.caches.get(key);
    if (val !== undefined) {
      this.caches.delete(key);
      this.caches.set(key, value);
    }
    if (this.capacity <= this.caches.size) {
      const leastRecentlyUsedKey = this.caches.keys().next().value;
      this.caches.delete(leastRecentlyUsedKey);
    }
    this.caches.set(key, value);
  }
}
```

```jsx
var rightSideView = function (root) {
  function dfs(root, step, res) {
    if (root) {
      if (res.length === step) {
        res.push(root.val); // 当数组长度等于当前 深度 时, 把当前的值加入数组
      }
      dfs(root.right, step + 1, res); // 先从右边开始, 当右边没了, 再轮到左边
      dfs(root.left, step + 1, res);
    }
  }
  if (!root) return [];
  let arr = [];
  dfs(root, 0, arr);
  return arr;
};
```

```ts
1. 数组类型
[3,1,4,null,2]  1=》1

var kthSmallest = function (root, k) {
  const stack = [];
  while (true) {
    // 直到左叶子节点 没有左节点
    while (root) {
      stack.push(root); // 左节点依次入栈
      root = root.left; // DFS 左节点
    }
    root = stack.pop();
    // 巧妙条件：因为出栈的过程是升序的 故第k次出栈即为BST中第k个最小的元素
    if (!--k) return root.val;
    root = root.right; // DFS 左叶子节点的右节点
  }
};


对象类型
{5,3,7,2,4,6,8},3
输出{4}

返回{4}
function KthNode(pRoot, k) {
  if (!pRoot || k <= 0) return null;
  let stack = [];
  let count = 0;
  while (pRoot || stack.length) {
    if (pRoot) {
      stack.push(pRoot);
      pRoot = pRoot.left;
    } else {
      pRoot = stack.pop();
      if (++count === k) {
        return pRoot;
      }
      pRoot = pRoot.right;
    }
  }
  return null;
}
```
