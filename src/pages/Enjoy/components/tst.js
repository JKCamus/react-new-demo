/**
 * @description:
 * 1.建立统计目标字符串map，<value,counter>=>map
 * 2.设置最后生成结果的左右指针，初始都为0，初始化size为map的size。
 * 3. 首先逐步移动左指针，当map中含有当前元素时，map的当前元素counter数量-1
 * 4. 如果当前元素的统计counter===0的时候，更新size=size-1
 * 5. 当size===0的时候，说明右指针已经寻找到了，满足的一个字符串，需要比对当前街根据左右指针截取的字符串与res比对，取小的，记录更新res。
 * 6. 这时候开始处理左指针，左指针开始复原map中对应值的counter值和size值。
 * 7. 左指针移动。此时，右指针又继续移动到符合条件的位置。
 * 8。 结束循环，取得最小值
 *
 * @param {*} s
 * @param {*} t
 */
const minWindow = function (s, t) {
  const map = new Map();
  for (let i of t) {
    map.has(i) ? map.set(i, map.get(i) + 1) : map.set(i, 1);
  }
  let left = 0,
    right = 0,
    res = '',
    size = map.size;
  while (right < s.length) {
    const Rc = s[right];
    if (map.has(Rc)) {
      map.set(Rc, map.get(Rc) - 1);
      if (map.get(Rc) === 0) size -= 1;
    }
    while (size === 0) {
      const newRes = s.substring(left, right + 1);
      if (!res || res.length > newRes.length) {
        res = newRes;
      }
      const Lc = s[left];
      if (map.has(Lc)) {
        map.set(Lc, map.get(Lc) + 1);
        if (map.get(Lc) === 1) size += 1;
      }
      left++;
    }
    right += 1;
  }
  return res;
};
console.log('res=>', minWindow('ADOBECODEBANC', 'ABC'));
