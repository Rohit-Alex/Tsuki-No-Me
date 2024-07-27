/*
    <<<<--------- REDUCE ---------->>>
    2 cases:
      1> initialValue provided
          -> initial accumulator value is taken initialValue
          -> currentValue starts from 0th element
          -> currentIndex starts from 0
          -> traversal takes place for array.length times

      2> initialValue not provided
          -> initial accumulator value is taken as 0th lement of array 
          -> currentValue starts from 1st element
          -> currentIndex starts from 1
          -> traversal takes place for array.length - 1 times
*/ 
(accumulator, currElement, index, arr)       
const array1 = [10, 20, 30, 40];

// 0 + 1 + 2 + 3 + 4
const initialValue = 0;

function reducerFn (accumulator, currentValue, currentIndex, traversalArr) {
  return accumulator + currentValue
}
const sumWithInitial = array1.reduce(reducerFn);

/*
  1st iteration: 
                -> accumulator -> 0
                -> currentValue -> 10
                -> currentIndex -> 0
                -> return value -> accumulator + currentValue = 0 + 10 = 10 => next accumulator value
  2nd iteration: 
                -> accumulator -> 10
                -> currentValue -> 20
                -> currentIndex -> 1
                -> return value -> accumulator + currentValue = 10 + 20 = 30 => next accumulator value
  
   3rd iteration: 
                -> accumulator -> 30
                -> currentValue -> 30
                -> currentIndex -> 2
                -> return value -> accumulator + currentValue = 30 + 30 = 60 => next accumulator value
    
    4th iteration: 
                -> accumulator -> 60
                -> currentValue -> 40
                -> currentIndex -> 3
                -> return value -> accumulator + currentValue = 60 + 40 = 100 => next accumulator value
    
    * No more iteration so last value of accumulator is returned in sumWithInitial
*/

console.log(sumWithInitial);

const peopleObj = [
  {
    name: "Amane",
    age: 25,
  },
  {
    name: "Prateek",
    age: 17,
  },
  {
    name: "Eren",
    age: "25",
  },
  {
    name: "Rohit",
    age: 24,
  },
];

/*
  const op = {
    25: [ {
      name: "Amane",
    age: 25,
    }, 
      {
    name: "Eren",
    color: "25",
  },
  ], 24: [ { name: 'rohit' ,age: 24}], 17: [{ name: 'prateek', age: 17 }]
  }
*/

const op1 = peopleObj.reduce((acc, curr) => {
  acc[curr.color] = [...(acc[curr.color] ?? []), curr];
  return acc;
}, {});

// ['"Do lafzon ki hai', 'First love","Chupana bhi nhi aata", "Dil ke chain" ]
const songs = [
  {
    favSongs: ["Do lafzon ki hai", "First love"],
  },
  {
    favSongs: ["Chupana bhi nhi aata", "Dil ke chain"],
  },
  {
    favSongs: ["Another love", "Let her go"],
  },
];
const allSongs = songs.reduce((accumulator, currentValue) => [...accumulator, ...currentValue.favSongs], ["Until i found you"]);
console.log(allSongs);



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


