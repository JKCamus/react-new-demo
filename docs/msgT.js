function throttle(func, delay = 300) {
  let flag = true;
  return (...args) => {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      func.apply(this, args);
      flag = true;
    }, delay);
  };
}

const data = [
  {
    id: 1,
    type: 'a',
  },
  {
    id: 2,
    type: 'b',
  },
  {
    id: 3,
    type: 'c',
  },
];

const arr = [];

const fn = () => {
  let timesRun = 0;
  let interval = setInterval(() => {
    timesRun += 1;
    arr.push({
      id: timesRun,
    });
    if (timesRun > 5) {
      clearInterval(interval);
    }
    console.log('res=>', arr);
  }, 100);
};
fn();
console.log('a', arr);

const result = () => {};

console.log('res=>', [1, 3, 2].includes(2));

class Cat {
  constructor() {
    this.name = 'guaiguai';
    var type = 'constructor';
    this.getType = () => {
      console.log(this.type);
      console.log(type);
    };
  }
  type = 'class';
  getType = () => {
    console.log(this.type);
    console.log(type);
  };
}
var type = 'window';
var guaiguai = new Cat();
guaiguai.getType();
console.log(guaiguai);
