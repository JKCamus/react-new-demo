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

```jsx
function longestPalindrome(s: string): string {
  if (s.length < 2) return s;
  let start = 0,
    maxLen = 1;
  const expandAroundCenter = (left: number, right: number) => {
    // 注意 邊界考慮
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      let len = right - left + 1;
      if (len > maxLen) {
        maxLen = len;
        start = left;
      }
      left--;
      right++;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expandAroundCenter(i - 1, i + 1);
    expandAroundCenter(i, i + 1);
  }
  return s.substring(start, start + maxLen);
}
```
