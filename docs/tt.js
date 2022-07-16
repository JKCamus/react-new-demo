const t = [
  {
    name: 1,
  },
  {
    tag: 2,
  },
];

t[1] && (t[1].name = 'wwww');

console.log('res=>', t);
