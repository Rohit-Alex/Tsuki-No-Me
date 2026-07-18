# `Array.prototype.reduce()`

## Signature

```javascript
array.reduce((accumulator, currentValue, currentIndex, array) => { /* ... */ }, initialValue)
```

`reduce` behaves differently depending on whether you pass `initialValue`:

| | `initialValue` provided | `initialValue` omitted |
|---|---|---|
| Starting `accumulator` | `initialValue` | The array's `[0]` element |
| `currentValue` starts from | index `0` | index `1` |
| Number of iterations | `array.length` | `array.length - 1` |

## Question 1 — With an Initial Value

```javascript
const array1 = [10, 20, 30, 40];

function reducerFn(accumulator, currentValue, currentIndex) {
  console.log(`acc=${accumulator} curr=${currentValue} idx=${currentIndex}`);
  return accumulator + currentValue;
}

const sumWithInitial = array1.reduce(reducerFn, 0);
console.log(sumWithInitial);
```

<details>
<summary>Show Answer</summary>

```
acc=0 curr=10 idx=0
acc=10 curr=20 idx=1
acc=30 curr=30 idx=2
acc=60 curr=40 idx=3
100
```

**Explanation:** With `0` as the initial value, `accumulator` starts at `0` and `currentValue` starts from index `0` (`10`) — that's 4 iterations for a 4-element array, exactly matching the "initialValue provided" row of the table above.

</details>

## Question 2 — Without an Initial Value

```javascript
const array1 = [10, 20, 30, 40];

function reducerFn(accumulator, currentValue, currentIndex) {
  console.log(`acc=${accumulator} curr=${currentValue} idx=${currentIndex}`);
  return accumulator + currentValue;
}

const sumWithoutInitial = array1.reduce(reducerFn);
console.log(sumWithoutInitial);
```

<details>
<summary>Show Answer</summary>

```
acc=10 curr=20 idx=1
acc=30 curr=30 idx=2
acc=60 curr=40 idx=3
100
```

**Explanation:** With no initial value, `accumulator` starts as `array1[0]` (`10`) directly, and `currentValue` starts from index `1` (`20`) — only 3 iterations for the same 4-element array, matching the "initialValue omitted" row. It happens to land on the same final total (`100`) as Question 1 here, purely because summing is associative and every element still gets included exactly once either way — the *path* taken to get there (iteration count, intermediate values) is genuinely different, as the logs above show.

</details>

## Question 3 — Empty Array Without an Initial Value

```javascript
console.log([].reduce((acc, curr) => acc + curr));
```

<details>
<summary>Show Answer</summary>

```
TypeError: Reduce of empty array with no initial value
```

**Explanation:** With no elements and no `initialValue`, there's nothing to seed `accumulator` with on the first call — `reduce` has no valid starting point, so it throws rather than silently returning `undefined`. This is one of the most common real-world `reduce` bugs: always pass an `initialValue` when the array might be empty.

</details>

## Question 4 — Empty Array *With* an Initial Value

```javascript
console.log([].reduce((acc, curr) => acc + curr, 100));
```

<details>
<summary>Show Answer</summary>

```
100
```

**Explanation:** With an `initialValue` supplied, an empty array simply never invokes the callback at all, and `reduce` returns `initialValue` unchanged. Contrast with Question 3 — this is exactly why passing an explicit `initialValue` is the safer default habit.

</details>

## Grouping Objects with `reduce`

A very common real-world `reduce` use case: grouping an array of objects by some shared property.

**Setup used by the questions below:**

```javascript
const peopleObj = [
  { name: "Amane", age: 25 },
  { name: "Prateek", age: 17 },
  { name: "Eren", age: "25" },
  { name: "Rohit", age: 24 },
];
```


### Question 5

```javascript
const grouped = peopleObj.reduce((acc, curr) => {
  acc[curr.age] = [...(acc[curr.age] ?? []), curr];
  return acc;
}, {});

console.log(grouped);
```

<details>
<summary>Show Answer</summary>

```
{
  "17": [ { name: "Prateek", age: 17 } ],
  "24": [ { name: "Rohit", age: 24 } ],
  "25": [ { name: "Amane", age: 25 }, { name: "Eren", age: "25" } ]
}
```

**Explanation:** Reading `curr.age` instead of `curr.color` fixes the grouping. One more subtlety worth noticing: **Amane's `age` is the number `25`, Eren's `age` is the string `"25"`** — but they end up in the *same* group. Object keys are always coerced to strings, so `acc[25]` and `acc["25"]` are the exact same key; the type difference between the two people's `age` values disappears the moment it's used as a key.

</details>

## Flattening Arrays with `reduce`

### Question 6

```javascript
const songs = [
  { favSongs: ["Do lafzon ki hai", "First love"] },
  { favSongs: ["Chupana bhi nhi aata", "Dil ke chain"] },
  { favSongs: ["Another love", "Let her go"] },
];

const allSongs = songs.reduce(
  (accumulator, currentValue) => [...accumulator, ...currentValue.favSongs],
  ["Until i found you"]
);

console.log(allSongs);
```

<details>
<summary>Show Answer</summary>

```
[
  "Until i found you",
  "Do lafzon ki hai", "First love",
  "Chupana bhi nhi aata", "Dil ke chain",
  "Another love", "Let her go"
]
```

**Explanation:** The initial value here isn't an empty array — it's `["Until i found you"]`, a **seed** value that's already got one song in it. Each iteration spreads the accumulator so far, plus that person's `favSongs`, into a fresh array — a `reduce`-based alternative to `songs.flatMap(s => s.favSongs)` (see [Array methods](../../../README.md#32-array-methods) for `flatMap`), useful specifically because it lets you seed the result with something extra up front.

</details>
