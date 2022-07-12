待办：

1. 每天一题新的，两题旧的。需要有思路。那种看见思路就能写出来的。
2. 待解题目梳理。
3. 构建今年
4. 项目储备

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

```ts
// 输入：grid = [[1,3,1],[1,5,1],[4,2,1]]
// 输出：7
// 解释：因为路径 1→3→1→1→1 的总和最小。
function minPathSum(grid: number[][]): number {
  const dp = grid;

  let row = grid.length,
    col = grid[0].length;
  for (let i = 1; i < row; i++) {
    dp[i][0] += dp[i - 1][0];
  }
  for (let j = 1; j < col; j++) {
    dp[0][j] += dp[0][j - 1];
  }
  for (let i = 1; i < row; i++) {
    for (let j = 1; j < col; j++) {
      dp[i][j] += Math.min(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[row - 1][col - 1];
}
```

```ts
// 分治的办法，将x^n次方划分为x^(n/2) * x^(n/2),每次划分一半下去。直到n === 1，这之间的过程我们可以用递归进行实现，而边境的判断条件就是当n===0时。
// 时间复杂度分析，因为我们每次都是x(n/2) * x ^ (n / 4) * x ^ (n / 8) * ... * 1;
// 所以时间复杂度为o(log n);
var myPow = function (x, n) {
  if (n === 0) {
    return 1;
  }
  if (n < 0) {
    return 1 / myPow(x, -n);
  }
  if (n % 2) {
    return x * myPow(x, n - 1);
  }
  return myPow(x * x, n / 2);
};
```

```jsx
var numRescueBoats = function (people, limit) {
  people.sort((a, b) => a - b);
  let ans = 0,
    left = 0, //左指针初始化在0的位置
    right = people.length - 1; //右指针初始化在people.length - 1的位置
  while (left <= right) {
    //两指针向中间靠拢 遍历
    //当people[left] + people[right--]) <= limit 表示左右两边的人可以一起坐船 然后让left++ right--
    //如果两人坐不下，那只能让重的人先坐一条船 也就是让right--
    if (people[left] + people[right--] <= limit) {
      left++;
    }

    ans++;
  }
  return ans;
};
```

```ts
// 输入：people = [3,5,3,4], limit = 5
// 输出：4
// 解释：4 艘船分别载 (3), (3), (4), (5)
var guessNumber = function (n) {
  let left = 1,
    right = n;
  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (guess(mid) <= 0) {
      right = mid; //更新查找区间为[left, mid]
    } else {
      left = mid + 1; //更新查找区间为[mid+1, right]
    }
  }
  //left == right为答案
  return left;
};
```

```ts
号码转译;
//输入：digits = "23"
//输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]

// 思路：深度优先遍历，遍历函数传入每一层形成的字符串和一个指向字符的位置指针，打给你指针的位置到达字符串的结尾时，将形成的字符串加入结果数组，递归的每一层遍历这一层的数字对应的字符，然后传入新的字符，指针向后移动一次，不断递归
// 复杂度：时间复杂度O(3^m * 4^n)，m，n分别是三个字母和四个字母对应的数字个数。空间复杂度O(m+n)，递归栈的深度，最大为m+n
var letterCombinations = (digits) => {
  if (digits.length == 0) return [];
  const res = [];
  const map = {
    //建立电话号码和字母的映射关系
    2: 'abc',
    3: 'def',
    4: 'ghi',
    5: 'jkl',
    6: 'mno',
    7: 'pqrs',
    8: 'tuv',
    9: 'wxyz',
  };

  const dfs = (curStr, i) => {
    //curStr是递归每一层的字符串，i是扫描的指针
    if (i > digits.length - 1) {
      //边界条件，递归的出口
      res.push(curStr); //其中一个分支的解推入res
      return; //结束递归分支，进入另一个分支
    }
    const letters = map[digits[i]]; //取出数字对应的字母
    for (const l of letters) {
      //进入不同字母的分支
      dfs(curStr + l, i + 1); //参数传入新的字符串，i右移，继续递归
    }
  };
  dfs('', 0); // 递归入口，传入空字符串，i初始为0的位置
  return res;
};
```

```ts
// 给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums ，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。
// 我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。
// 必须在不使用库的sort函数的情况下解决这个问题。
// 输入：nums = [2,0,2,1,1,0]
// 输出：[0,0,1,1,2,2]

/** 难点，原地算法
 * @description: 双指针
 *
 * 1. 思路有点类似移动0
 * 2. 因为三个数字，位置一定，也就是前面肯定是0后面肯定是2
 * 3. 两枚指针，left在左边界，right在右边界。
 * 4。当前（也算做一枚指针）,当前元素为0跟left元素交换位置，指针前一，当前元素等于2跟right交换位置，注意，此时，curr指针不前一。
 * 5. 等于1的情况，指针前一
 * @param {*} nums
 */
var sortColors = function (nums) {
  const len = nums.length;
  let left = 0,
    right = len - 1,
    curr = 0;
  while (curr <= right) {
    if (nums[curr] === 0) {
      [nums[left], nums[curr]] = [nums[curr], nums[left]];
      left++;
      curr++;
    } else if (nums[curr] === 2) {
      [nums[curr], nums[right]] = [nums[right], nums[curr]];
      right--;
    } else {
      curr++;
    }
  }
  return nums;
};
```

```jsx
34;
// 给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。
// 如果数组中不存在目标值 target，返回 [-1, -1]。
// 你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。
// 输入：nums = [5,7,7,8,8,10], target = 8
// 输出：[3,4]

/**
 * @description: 简单，基于二分查找，改造
 * 1. mid的公式很重要，别忘了
 * 2. 首先通过二分查找得到mid位置
 * 3. 最后两枚指针，去搜索startIndex和endIndex。这一步比较巧妙
 * 通过nums[i]===nums[i-1]搞定
 * @param {*} nums
 * @param {*} target
 */
var searchRange = function (nums, target) {
  let left = 0,
    right = nums.length - 1,
    mid;
  while (left <= right) {
    //二分查找target
    mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) break;
    if (nums[mid] > target) right = mid - 1;
    else left = mid + 1;
  }
  if (left > right) return [-1, -1];
  let i = mid,
    j = mid;
  while (nums[i] === nums[i - 1]) i--; //向左尝试找相同的元素
  while (nums[j] === nums[j + 1]) j++; //向右尝试找相同的元素
  return [i, j];
};
// 找到目标值在数组中的右边界
// 注意这里使用的是[left, right],
// 两边都闭合的方式，需要注意
// 1.循环结束条件 left <= right
// 2.当找到目标值时区间向后进1位
```
