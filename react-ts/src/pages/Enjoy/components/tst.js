// const handleAsync = () => {
//   const result = [];
//   while (head !== null) {
//     result.push(head);
//     const temp = head.next;
//     head.next = null;
//     head = temp;
//   }
//   result.sort((a, b) => a.val - b.val).reduce((pre, curr) => (pre.next = curr));
//   return result[0];
// };

// const singleOne = (nums) => {
//   for (let i = 1; i < nums.length; i++) {
//     nums[0] ^= nums[i];
//     console.log('nums', nums);
//   }
//   return nums[0];
// };

// console.log('res=>', singleOne([4, 1, 2, 1, 2, 9, 9, 1]));

// const async = (nums) => {
//   let i = 0,
//     j = 0;
//   while (j < nums.length) {
//     while (j < nums.length && nums[i] === nums[j]) j++;
//     if (j < nums.length && nums[i] !== nums[j]) {
//       i++;
//       nums[i] = nums[j];
//     }
//     j++;
//   }
//   return nums;
// };
const removeDuplicates = function (nums) {
  if (nums.length < 0) return nums;
  let i = 0,
    j = 0;
  while (j < nums.length) {
    while (j < nums.length && nums[i] === nums[j]) j++;
    if (nums[i] !== nums[j] && j < nums.length) {
      i++;
      nums[i] = nums[j];
    }
    j++;
  }
  return nums;
};
