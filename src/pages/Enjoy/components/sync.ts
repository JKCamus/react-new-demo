function deep(origin, m = new WeakMap()) {
  if (origin === undefined || typeof origin !== 'object') {
    return origin
  }
  if (origin instanceof Date) {
    return new Date(origin)
  }
  if (origin instanceof RegExp) {
    return new RegExp(origin)
  }
  const val = m.get(origin)
  if (val) { return val }

  const target = new origin.constructor()
  m.set(origin, target)
  for (let k in origin) {
    target[k] = deep(origin[k], m)
  }
  return target
}



console.log("res=>", deep(a));
// 对称二叉树

function isSymmetric(root: TreeNode | null): boolean {
  const help = (L: TreeNode | null, R: TreeNode | null) => {
    if (L === null && R === null) {
      return true
    } else if (L === null || R === null || L.val !== R.val) {
      return false
    } else {
      return help(L.left, R.right) && help(L.right, R.left)
    }
  }
  if (root === null) {
    return true
  } else {
    return help(root.left, root.right)
  }
};

// 二叉树的中序遍历

function inorderTraversal(root: TreeNode | null): number[] {

  const result = []
  const inOrder = (root: TreeNode | null) => {
    if (root === null) return
    inOrder(root.left)
    result.push(root.val)
    inOrder(root.right)
  }
  inOrder(root)
  return result
};

// 二叉树的层序遍历

function levelOrder(root: TreeNode | null): number[][] {
  if (root === null) return []
  const queue = [root]
  const result = []
  while (queue.length) {
    const arr = []
    let len = queue.length
    while (len) {
      let node = queue.shift()
      arr.push(node.val)
      node.left && queue.push(node.left)
      node.right && queue.push(node.right)
      len--
    }
    result.push(arr)
  }
  return result
};

// 平衡二叉树


// function isBalanced(root: TreeNode | null): boolean {
//   let flag = true
//   let maxHeight = (root: TreeNode | null) => {
//     if (root === null) return true
//     let left = maxHeight(root.left)
//     let right = maxHeight(root.right)
//     if (Math.abs(left - right) > 1) {
//       flag = false
//     }
//     return Math.max(left, right) + 1
//   }
//   maxHeight(root)
//   return flag
// };


// for...of遍历获取的是对象的键值, for...in获取的是对象的键名;
// for...in会遍历对象的整个原型链, 性能非常差不推荐使用,而for...of只遍历当前对象不会遍历原型链;
// 对于数组的遍历,for...in会返回数组中所有可枚举的属性(包括原型链上可枚举的属性),for...of只返回数组的下标对应的属性值;
// 总结：for...in循环主要是为了遍历对象而生,不适用遍历数组; for....of循环可以用来遍历数组、类数组对象、字符串、Set、Map以及Generator对象


