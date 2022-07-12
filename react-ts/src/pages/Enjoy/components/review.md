```ts
// 输入：nums = [2,7,11,15], target = 9
// 输出：[0,1]
// 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
/**
 * @description: map
 * 1. 创建index和value的Map
 * 2. 如果没有当前元素，map.set(target-currentVal,currentIndex)，注意，target-currentVal为key，value为当前的index
 * 3. 遇到target-currentVal时，就是目标值的时候。返回[map.get(currentVal),currentIndex]
 * @param {number} nums
 * @param {number} target
 */
function twoSum(nums: number[], target: number): number[] {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (!map.has(nums[i])) {
      map.set(target - nums[i], i);
    } else {
      return [map.get(nums[i]), i];
    }
  }
}
```

```ts
// 两数相加
```

```ts
/**
 * @description: 滑窗问题
 * 1. 创建set，记录字符串首位，max记录最长无重复字符串。
 * 2. 注意边界考虑
 * 3. 循环，如果set没有当前元素，加入，并且比对set.size和max，更新max
 * 4. 如果set有当前元素，进入循环，判断依据是set含有当前元素s[i]，同时删除p指针所指首位元素，并且p向前移动一位。最后set加入当前元素。
 * @param {*} s
 */
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
