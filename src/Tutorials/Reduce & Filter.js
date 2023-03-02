const groupObj1 = {
  naruto: {
    surname: "uzomaki",
    age: 23,
  },
  hinata: {
    surname: "hyuga",
    age: 22,
  },
  sakura: {
    surname: "haruno",
    age: 22,
  },
  shikamaru: {
    surname: "nara",
    age: 23,
  },
};

const op = Object.keys(groupObj1).reduce((acc, curr) => {
  acc[groupObj1[curr].age] = {
    ...(acc[groupObj1[curr].age] ?? {}),
    [curr]: groupObj1[curr],
  };
  return acc;
}, {});

console.log(op);
// {
//     23:
//     {
//         naruto: { surname: 'uzomaki', age: 23 },
//         shikamaru: { surname: 'nara', age: 23 }
//     },
//     22:
//     {
//         hinata: { surname: 'hyuga', age: 22 },
//         sakura: { surname: 'haruno', age: 22 }
//     }
// }

const output = Object.keys(groupObj1).reduce((acc, curr) => {
  acc[groupObj1[curr].age] = [
    ...(acc[groupObj1[curr].age] ?? []),
    { [curr]: groupObj1[curr] },
  ];
  return acc;
}, {});

console.log(output);
// {
//     23:
//     [{ naruto: { surname: 'uzomaki', age: 23 } },
//     { shikamaru: { surname: 'nara', age: 23 } }],
//         22:
//     [{ sakura: { surname: 'haruno', age: 22 } },
//     { hinata: { surname: 'hyuga', age: 22 } }]
// }

const obj2 = [
  {
    name: "Jim",
    color: "blue",
    age: 22,
  },
  {
    name: "Sam",
    color: "blue",
    age: 33,
  },
  {
    name: "Eddie",
    color: "green",
    age: 77,
  },
];

const op2 = obj2.reduce((acc, curr) => {
  acc[curr.color] = [...(acc[curr.color] || []), curr];
  return acc;
}, {});

console.log(op2);

const arrObj = [
  { tag_id: "lang" },
  { tag_id: "quesType" },
  { tag_id: "other" },
  { tag_id: "board" },
];
// const requiredFiltered = arrObj.filter(e => e.tag_id === 'lang' || e.tag_id === 'other')
const requiredFiltered = arrObj.filter((e) =>
  ["lang", "other"].includes(e.tag_id)
);

// const exceptdFiltered = arrObj.filter(e =>  e.tag_id !== 'lang' && e.tag_id !== 'other')
const exceptdFiltered = arrObj.filter(
  (e) => !["lang", "other"].includes(e.tag_id)
);

console.log(requiredFiltered);
console.log(exceptdFiltered);

const checkTruthyValueTotally = (value) => {
  return value && !["0", "null", "undefined"].includes(value);
};
const treatFalsyAsTruthy = (value) => {
  return value || value === 0;
};

console.log(checkTruthyValueTotally(23));
console.log(treatFalsyAsTruthy(NaN));
