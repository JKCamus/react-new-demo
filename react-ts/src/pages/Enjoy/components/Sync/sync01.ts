
function solve(M, N) {
  // write code here
  let isZ = true;
  if (M < 0) {
    isZ = false;
    M = Math.abs(M);
  }
  let res = '';
  const map = { '10': 'A', '11': 'B', '12': 'C', '13': 'D', '14': 'E', '15': 'F' }
  while (M > N) {
    let temp = M % N;
    if (temp > 9) {
      temp = map[temp + '']
    }
    res = temp + res;
    M = Math.floor(M / N);
  }
  return isZ ? M + res : '-' + M + res;
}


















function LRU(operators, k) {
  // write code here
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
