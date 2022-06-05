/* ：nums = [3,4,5,1,2]
：1
[1,2,3,4,5] ，旋转 3 次得到输入数组。
*/
function resolve(nums) {
  let left = 0,
    right = nums.length - 1;
  if (nums[left] < nums[right]) {
    return [nums[left]];
  }
  while (left < right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] > nums[mid + 1]) {
      return nums[mid + 1];
    } else if (nums[mid - 1] > nums[mid]) {
      return nums[mid];
    }
    if (nums[mid] > nums[left]) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
}
