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

```ts
var hasPathSum = function (root, targetSum) {
  if (root === null) return false;
  if (root.left === null && root.right === null) {
    //1.刚开始遍历时
    //2.递归中间 说明该节点不是叶子节点
    return root.val === targetSum;
  }
  // sum = targetSum - root.val;
  // 拆分成两个子树
  return hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val);
};
```

```ts
var majorityElement = function (nums) {
  const eleMap = new Map();
  if (nums.length === 1) {
    return nums[0];
  }
  // 只需找到数量大于nums.length/2的数
  for (const item of nums) {
    if (!eleMap.has(item)) {
      eleMap.set(item, 1);
    } else {
      eleMap.set(item, eleMap.get(item) + 1);
      if (eleMap.get(item) > Math.floor(nums.length / 2)) {
        return item;
      }
    }
  }
  return 0;
};
```

```ts
var numSquares = function (n) {
  const dp = [...Array(n)].map((_) => 0); //初始化dp数组 当n为0的时候
  for (let i = 1; i <= n; i++) {
    dp[i] = i; // 最坏的情况就是每次+1 比如: dp[3]=1+1+1
    for (let j = 1; i - j * j >= 0; j++) {
      //枚举前一个状态
      dp[i] = Math.min(dp[i], dp[i - j * j] + 1); // 动态转移方程
    }
  }
  return dp[n];
};
```

//triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]
//11
从三角形最后一层开始向上遍历，每个数字的最小路径和是它下面两个数字中的较小者加上它本身

```jsx
//状态压缩
const minimumTotal = (triangle) => {
  const bottom = triangle[triangle.length - 1];
  const dp = new Array(bottom.length);
  // base case 是最后一行
  for (let i = 0; i < dp.length; i++) {
    dp[i] = bottom[i];
  }
  // 从倒数第二列开始迭代
  for (let i = dp.length - 2; i >= 0; i--) {
    for (let j = 0; j < triangle[i].length; j++) {
      dp[j] = Math.min(dp[j], dp[j + 1]) + triangle[i][j];
    }
  }
  return dp[0];
};
```

```jsx
// 输入：coins = [1, 2, 5], amount = 11
// 输出：3
// 解释：11 = 5 + 5 + 1
var coinChange = function (coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity); //初始化dp数组
  dp[0] = 0; //面额0只需要0个硬币兑换

  for (let i = 1; i <= amount; i++) {
    //循环面额
    for (let coin of coins) {
      //循环硬币数组
      if (i - coin >= 0) {
        //当面额大于硬币价值时
        //dp[i - coin]： 当前面额i减当前硬币价值所需要的最少硬币
        //dp[i] 可由 dp[i - coin] + 1 转换而来
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount]; //如果dp[amount] === Infinity，则无法兑换
};
```

```ts
输入: n = 10
输出: 36
解释: 10 = 3 + 3 + 4, 3 × 3 × 4 = 36。
var integerBreak = function (n) {
    //dp[i]为正整数i拆分之后的最大乘积
    let dp = new Array(n + 1).fill(0);
    dp[2] = 1;

    for (let i = 3; i <= n; i++) {
        for (let j = 1; j < i; j++) {
            //j*(i-j)表示把i拆分为j和i-j两个数相乘
            //j*dp[i-j]表示把i拆分成j和继续把(i-j)这个数拆分，取(i-j)拆分结果中的最大乘积与j相乘
            dp[i] = Math.max(dp[i], dp[i - j] * j, (i - j) * j);
        }
    }
    return dp[n];
};
```
