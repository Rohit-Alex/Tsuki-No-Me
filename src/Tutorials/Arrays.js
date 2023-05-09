/*
  
    e.g. 
    const myPriorityList = ['family', 'mg', friends', 'career', 'music', 'anime']
    O/P:
      family: Present at first of my priority
      mg: Present at 2 of my priority
      friends: Present at 3 of my priority
      career: Present at 4 of my priority
      music: present at 5 of my priority
      anime: present at last of my priority
      
      2>
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
// allNumbersArePositive; // for every method
// hasEvenNumber // some method


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

// Tell me ki saari ladki hi hai na, koi transgender toh nhi
// Tell me ki koi bhi ladki single hai ki nhi. Haan ya na, dekh ke bata
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

// Array: 
/*
  Filter out options on the basis of 
    i> isEmployed
    ii> isEmployed and surname with patel. dono satisfy ho
    iii> salary more than 2500000 or surname with patel
    iv> anyone from Australia
    v> Create a new array such that each item only contains:
        -> name, country, surname, salary
  Find and return the name and surname of candidate who is from Gujarat

  
*/

