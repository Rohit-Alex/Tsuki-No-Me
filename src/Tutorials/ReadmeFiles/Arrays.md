# Array Methods and Exercises

> See also the main [Array methods](../../../README.md#32-array-methods) reference in the README for the full method list (`push`/`pop`/`map`/`filter`/`find`/... and the static `Array.isArray`/`Array.from`/`Array.of`). This file focuses on `Array` constructor quirks, generating arrays programmatically, and worked practice exercises.

## The `Array` Constructor — Quirks

### Question 1

```javascript
const arrayEmpty = new Array(2);
console.log(arrayEmpty.length);
console.log(arrayEmpty[0]);
```

Show Answer

```
2
undefined
```

**Explanation:** A single **numeric** argument to `Array()` sets the `length`, but creates a **sparse array** — 2 empty slots, not 2 elements holding `undefined`. Reading `arrayEmpty[0]` still gives `undefined` (there's nothing there to read), but methods like `.map()` skip empty slots entirely rather than visiting them (see Question 4 for why that matters when generating arrays).



### Question 2

```javascript
const arrayOfOne = new Array("2"); // the string "2", not the number 2

console.log(arrayOfOne.length);
console.log(arrayOfOne[0]);
```

Show Answer

```
1
2
```

**Explanation:** The special "sets the length" behavior from Question 1 only triggers for a **single numeric** argument. A single *non-numeric* argument (like the string `"2"`) is treated as a normal element, producing a proper 1-element array — no sparseness. This asymmetry (`Array(2)` vs `Array("2")` behaving completely differently) is exactly why `Array.of(7)` exists — see the README's static methods section for that comparison.



### Question 3

```javascript
const fruits = new Array("Apple", "Banana");

console.log(fruits.length);
console.log(fruits[0]);
```

Show Answer

```
2
Apple
```

**Explanation:** With **2 or more** arguments (of any type), `Array()` just builds a normal array from them — the sparse-length special case only applies to the single-numeric-argument form from Question 1.



## Creating Dynamic (Generated) Arrays

### Question 4

Two different ways to generate an array of objects, `{ name: 'rohit', position: N }`, for `N` from 1 to 5 — do they produce the same result?

```javascript
const dyn1 = Array.from({ length: 5 }, (_, index) => ({ name: 'rohit', position: index + 1 }));
const dyn2 = new Array(5).fill().map((_, index) => ({ name: 'rohit', position: index + 1 }));

console.log(JSON.stringify(dyn1) === JSON.stringify(dyn2));
```

Show Answer

```
true
```

**Explanation:** Both produce identical output, but for different reasons:

- `Array.from({ length: 5 }, mapFn)` treats `{ length: 5 }` as an array-*like* object and calls `mapFn` once per index, `0` through `4`.
- `new Array(5).fill().map(mapFn)` first creates a sparse array of 5 empty slots (Question 1's behavior), then `.fill()` (no arguments = fills with `undefined`) turns those empty slots into 5 *real* elements holding `undefined` — **this step is required**, because `.map()` skips empty slots entirely. Only after `.fill()` does `.map()` have real elements to visit and transform.

`Array.from` is generally the more direct/idiomatic choice for this pattern.



## Practice Exercises

### Question 5 — Movie List

**Task:** print the name and year of each movie.

```javascript
const favHollywoodMovies = [
  { name: 'Infinity war', genre: 'Sci-fi', year: 2018, director: 'Russo brothers' },
  { name: 'Endgame', genre: 'Sci-fi', year: 2019, director: 'Russo brothers' },
  { name: 'Inception', genre: 'Sci-fi', year: 2015, director: 'Christopher Nolan' },
  { name: 'Sherlock Holmes', genre: 'Crime Fiction', year: 2010, director: 'Guy Ritchie' }
];

favHollywoodMovies.forEach(m => console.log(`${m.name} (${m.year})`));
```

Show Answer

```
Infinity war (2018)
Endgame (2019)
Inception (2015)
Sherlock Holmes (2010)
```



### Question 6 — `map`: Simple Doubling

**Setup used by the questions below:**

```javascript
const arr = [3, 5, 1, 2, 8, 9, 4];
```

```javascript
console.log(arr.map(x => x * 2));
```

Show Answer

```
[ 6, 10, 2, 4, 16, 18, 8 ]
```



### Question 7 — `map`: Position-Based Transform

**Task:** double the elements at even positions, triple the elements at odd positions.

```javascript
console.log(arr.map((x, i) => i % 2 === 0 ? x * 2 : x * 3));
```

Show Answer

```
[ 6, 15, 2, 6, 16, 27, 8 ]
```

**Explanation:** Index `0` (value `3`) is even-positioned → `3 * 2 = 6`. Index `1` (value `5`) is odd-positioned → `5 * 3 = 15`. And so on — `map`'s second callback argument (the index) is what makes the position-dependent rule possible.



### Question 8 — `filter`: Odd Numbers

**Setup used by the questions below:**

```javascript
const arr2 = [15, 5, 9, 7, 4, 11, 18];
console.log(arr2.filter(n => n % 2 !== 0));
```

Show Answer

```
[ 15, 5, 9, 7, 11 ]
```



### Question 9 — Chaining `filter`s

**Task:** from the odd numbers, keep only the ones that are also prime.

```javascript
console.log(
  arr2
    .filter(n => n % 2 !== 0)
    .filter(isPrime)
);
```

Show Answer

```
[ 5, 7, 11 ]
```

**Explanation:** `15` (odd, but `15 = 3×5`) and `9` (odd, but `9 = 3×3`) get filtered out by the second `.filter(isPrime)` — each `.filter()` call returns a new array, so chaining them is just narrowing the result step by step. `.filter(n => n % 2 !== 0 && isPrime(n))` in a single pass gives the identical result.



### Question 10 — `every`: Are All Numbers Positive?

```javascript
const nums = [3, 5, 1, 2, 8, 9, 4];
console.log(nums.every(n => n > 0));
```

Show Answer

```
true
```



### Question 11 — `some`: Is There an Even Number?

```javascript
const nums = [3, 5, 1, 2, 8, 9, 4];
console.log(nums.some(n => n % 2 === 0));
```

Show Answer

```
true
```

**Explanation:** `2` and `4` are both even — `.some()` stops and returns `true` the moment it finds the first one (`2`), without checking the rest.



### Question 12 — `every`: Are All Members Female?

```javascript
const member = [
  { name: "Anjali", age: 24, gender: "female", status: "single" },
  { name: "Pooja", age: 25, gender: "female", status: "taken" },
  { name: "Richa", age: 25, gender: "female", status: "single" },
];

console.log(member.every(m => m.gender === 'female'));
```

Show Answer

```
true
```



### Question 13 — `some`: Is Anyone Single?

```javascript
const member = [
  { name: "Anjali", age: 24, gender: "female", status: "single" },
  { name: "Pooja", age: 25, gender: "female", status: "taken" },
  { name: "Richa", age: 25, gender: "female", status: "single" },
];

console.log(member.some(m => m.status === 'single'));
```

Show Answer

```
true
```

**Explanation:** Anjali and Richa are both `'single'` — `.some()` short-circuits as soon as it hits Anjali's record.



## Filtering Candidate Objects

**Setup used by the questions below:**

```javascript
const availableOptions = [
  {
    name: 'abc',
    occupation: 'Engineer',
    salary: 1800000,
    surname: 'yadav',
    isEmployed: true,
    isNri: false,
    location: { state: 'Jharkhand', country: 'India' }
  },
  {
    name: 'mno',
    occupation: 'Doctor',
    isEmployed: true,
    salary: 5000000,
    surname: 'unknown',
    isNri: false,
    location: { state: 'Gujarat', country: 'India' }
  },
  {
    name: 'xyz',
    occupation: 'nalla',
    isEmployed: false,
    salary: NaN,
    surname: 'patel',
    isNri: true,
    location: { state: 'Sydney', country: 'Australia' }
  }
]
```

> **Note:** the original version of this file had a copy-paste bug here — the filter for "surname is `patel` or `Ubuyashiki`" was accidentally duplicated from the previous "salary or patel" filter instead of implementing its own condition, and the filter for "anyone from Australia" was listed as a task but never actually implemented at all. Both are fixed and included below (Questions 18 and 19).

### Question 14 — Filter by `isEmployed`

```javascript
const ans1 = availableOptions.filter(o => o.isEmployed);
console.log(ans1.map(o => o.name));
```

Show Answer

```
[ 'abc', 'mno' ]
```



### Question 15 — Filter by `isEmployed` AND surname `patel`

```javascript
const ans2 = availableOptions.filter(o => o.isEmployed && o.surname === 'patel');
console.log(ans2.map(o => o.name));
```

Show Answer

```
[]
```

**Explanation:** `xyz` has `surname: 'patel'` but `isEmployed: false` — since this filter requires **both** conditions (`&&`), nobody qualifies.



### Question 16 — Filter by salary OR surname `patel`

```javascript
const ans3 = availableOptions.filter(o => o.salary > 2500000 || o.surname === 'patel');
console.log(ans3.map(o => o.name));
```

Show Answer

```
[ 'mno', 'xyz' ]
```

**Explanation:** `mno` qualifies via salary (`5000000 > 2500000`); `xyz` qualifies via surname (`'patel'`) — note `xyz`'s `salary` is `NaN`, and `NaN > 2500000` is `false`, but the `||` still lets it through because the surname half of the condition is `true`.



### Question 17 — Filter by surname `patel` or `Ubuyashiki`

```javascript
const ans4 = availableOptions.filter(o => ['patel', 'Ubuyashiki'].includes(o.surname));
console.log(ans4.map(o => o.name));
```

Show Answer

```
[ 'xyz' ]
```



### Question 18 — Filter by country: anyone from Australia

```javascript
const ans5 = availableOptions.filter(o => o.location.country === 'Australia');
console.log(ans5.map(o => o.name));
```

Show Answer

```
[ 'xyz' ]
```



### Question 19 — Reshape with `map`

**Task:** create a new array where each item only contains `name`, `country`, `surname`, and `salary`.

```javascript
const ans6 = availableOptions.map(o => ({
  name: o.name,
  country: o.location.country,
  surname: o.surname,
  salary: o.salary
}));
console.log(ans6);
```

Show Answer

```
[
  { name: 'abc', country: 'India', surname: 'yadav', salary: 1800000 },
  { name: 'mno', country: 'India', surname: 'unknown', salary: 5000000 },
  { name: 'xyz', country: 'Australia', surname: 'patel', salary: NaN }
]
```

**Explanation:** `.map()` is the tool for reshaping every element into a new shape — here pulling `location.country` up to a top-level `country` key while dropping `occupation` and `isEmployed`/`isNri` entirely.



### Question 20 — Find the Candidate from Gujarat

```javascript
const ans7 = availableOptions.find(o => o.location.state === 'Gujarat').name;
console.log(ans7);
```

Show Answer

```
mno
```

**Explanation:** `.find()` returns the first matching **object** (not a filtered array), so `.name` can be chained directly onto the result.



### Question 20 — Is Any Candidate an NRI?

```javascript
const ans8 = availableOptions.some(o => o.isNri);
console.log(ans8);
```

Show Answer

```
true
```

**Explanation:** Only `xyz` has `isNri: true`, but that's enough for `.some()` to return `true`.

