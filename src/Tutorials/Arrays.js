/*
    Given an array of elements, you need to print the elements such that:
        {element}: present at {position} of my priority
        Note: 
          i> For first element position would be first
          ii> For second element position would be 2 and so on but for last it would be last
    e.g. 
    const myPriorityList = ['family', 'friends', 'anime', 'music', 'career']
    O/P:
      family: Present at first of my priority
      friends: present at 2 of my priority
      .. 

      const favHollywoodMovies = [
        {
          name: 'Infinity war',
          genre: 'Sci-fi',
          year: 2018,
          director: 'Russo brothers'
        },
        {
          name: 'Endgame',
          genre: 'Sci-fi',
          year: 2019,
          director: 'Russo brothers'
        },
        {
          name: 'Inception',
          genre: 'Sci-fi',
          year: 2015,
          director: 'Christopher Nolan'
        },
        {
          name: 'Sherlock Holmes',
          genre: 'Crime Fiction',
          year: 2010,
          director: 'Guy Ritchie'
        }
      ]

      Print the name and year of each movie
*/

// map, filter,find, findIndex, findLast, findLastIndex, indexOf, at, slice, splice, concat, includes, split, join, flat, push, pop, shift, unshift, sort
const arr = [3, 5, 1, 2, 8, 9, 4] // normal map => just double it => then double even position elements and triple odd position elements
const arr2 = [15, 5, 9, 7, 4, 11, 18] // filter odd number => then filter prime number
allNumbersArePositive; // for every method
hasEvenNumber // some method

//marryOption
//areAllFemales
const member = [
  {
    name: "Anjali",
    age: 24,
    gender: "female",
    status: "single",
  },
  {
    name: "Pooja",
    age: 25,
    gender: "female",
    status: "taken",
  },
  {
    name: "Richa",
    age: 25,
    gender: "female",
    status: "single",
  },
];

const availableOptions = [
  {
    name: 'abc',
    occupation: 'Engineer',
    salary: 1800000,
    surname: 'yadav',
    isEmployed: true,
    isNri: false,
    location: {
      state: 'Jharkhand',
      country: 'India'
    }
  },
  {
    name: 'mno',
    occupation: 'Doctor',
    isEmployed: true,
    salary: 5000000,
    surname: 'unknown',
    isNri: false,
    location: {
      state: 'Gujarat',
      country: 'India'
    }
  },
   {
    name: 'xyz',
    occupation: 'nalla',
    isEmployed: false,
    salary: NaN,
    surname: 'patel',
    isNri: true,
    location: {
      state: 'Sydney',
      country: 'Australia'
    }
  }
]

/*
  Filter out options on the basis of 
    i> isEmployed
    ii> isEmployed and surname with patel. dono satisfy ho
    iii> salary more than 2500000 or surname with patel
    iv> anyone from Australia
  
  Find and return the name and surname of candidate who is from Gujarat
*/
