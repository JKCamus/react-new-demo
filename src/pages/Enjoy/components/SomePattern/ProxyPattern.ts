let myImage = (function () {
  let imgNode = document.createElement('img');
  document.body.appendChild(imgNode);
  return {
    setSrc: (src) => {
      imgNode.src = src;
    },
  };
})();
// 代理模式
/**
 * @description: preImage 代理了myImage的部分功能
 * @param {*} param1
 */
const preImage = (() => {
  const img = new Image();
  img.onload = () => {
    myImage.setSrc(img.src);
  };

  return {
    setSrc: function (src) {
      myImage.setSrc(
        'https://imglf3.lf127.net/img/59a42e65d22d02cb/cXlzTTJ0OVdSZnhFQVhVMHZRT2RBUGEwRHRqbDVtSllvRFhGUjJISjc4TT0.jpg?imageView&thumbnail=500x0&quality=96&stripmeta=0&type=jpg%7Cwatermark&type=2&text=wqkg57q4cHVycGxlIC8g5ou-6L6J56S-IC8gcHVycGxlZWFzdC5sb2Z0ZXIuY29t&font=bXN5aA==&gravity=southwest&dissolve=30&fontsize=240&dx=8&dy=10&stripmeta=0',
      );
      img.src = src;
    },
  };
})();

export { preImage };
