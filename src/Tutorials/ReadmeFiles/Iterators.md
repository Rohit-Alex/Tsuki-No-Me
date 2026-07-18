# Iteration in JavaScript: `for...in`, `for...of`, `forEach`, and the Iterator Protocol

These iteration methods are largely a replacement for the classic `for` loop:

```javascript
const numbers = [10, 20, 30, 40, 50];

for (let i = 0; i < numbers.length; i++) {
    const element = numbers[i];          // 1st parameter
    const index = i;                     // 2nd parameter
    const array_being_traversed = numbers; // 3rd parameter
}
```

Most of the modern iteration methods (`forEach`, `map`, `filter`, `some`, `every`, ...) resemble this same shape, normally accepting up to 3 parameters: **element**, **index**, and the **array being traversed**.

## `forEach` vs. `for...in` vs. `for...of`

**`forEach`:**
- Can only be applied to Arrays (and Strings, but only after converting to an array with `Array.from()`).
- Can't use `break` or `return` to exit early.
- Unsuitable for `async`/`await` — see the [Async Behavior](#async-behavior-foreach-vs-forof-vs-forin) section below for exactly why.

**`for...in`:**
- Can be applied to Arrays, Strings, and Objects — but it's best suited for **Objects**.
- Gives you the **index** for arrays and the **key** for objects.
- Can use `break` and `return`.
- Works fine with `async`/`await`.

**`for...of`:**
- Can be applied to Arrays and Strings — **can't** be applied directly to a plain Object (see Question 8).
- Gives you the **values**.
- Can use `break` and `return`.
- Works fine with `async`/`await`.

**Quick applicability matrix:**

| | `for...in` | `forEach` | `for...of` |
|---|:---:|:---:|:---:|
| Array | ✅ (not recommended — gives indices) | ✅ | ✅ |
| Object | ✅ (best fit) | ❌ (needs `Object.keys()`/`Object.entries()` first) | ❌ (needs `Object.values()`/`Object.entries()` first) |
| String | ✅ (gives indices) | ❌ (needs `Array.from()` first) | ✅ |

## Applicability — Arrays

### Question 1

```javascript
let myArray = [1, 2, 3];

for (let key in myArray) {
    console.log(key + ': ' + myArray[key]);
}
```

<details>
<summary>Show Answer</summary>

```
0: 1
1: 2
2: 3
```

**Explanation:** `for...in` over an array gives you the **indices** (as strings: `'0'`, `'1'`, `'2'`), not the values directly — you have to index back into the array yourself. This works, but it's not the recommended way to iterate an array (see the "not recommended" note above, and Question 9 for why it can be actively misleading).

</details>

### Question 2

```javascript
let myArray = [1, 2, 3];

myArray.forEach((value, index) => {
    console.log(`Value at index: ${index} is ${value}`)
});
```

<details>
<summary>Show Answer</summary>

```
Value at index: 0 is 1
Value at index: 1 is 2
Value at index: 2 is 3
```

</details>

### Question 3

```javascript
let myArray = [1, 2, 3];

for (let value of myArray) {
    console.log(value);
}
```

<details>
<summary>Show Answer</summary>

```
1
2
3
```

</details>

## Applicability — Objects

### Question 4

```javascript
let myObj = { a: 1, b: 2, c: 3 };

for (let key in myObj) {
    console.log(key + ': ' + myObj[key]);
}
```

<details>
<summary>Show Answer</summary>

```
a: 1
b: 2
c: 3
```

**Explanation:** This is `for...in`'s home turf — plain objects don't have a `.forEach()` or work with `for...of` at all (see Question 8), so `for...in` is the natural fit here.

</details>

### Question 5

You can't call `.forEach()` directly on an object — but you can route through `Object.keys()`:

```javascript
let myObj = { a: 1, b: 2, c: 3 };

Object.keys(myObj).forEach(function(key) {
    console.log(key + ': ' + myObj[key]);
});
```

<details>
<summary>Show Answer</summary>

```
a: 1
b: 2
c: 3
```

</details>

### Question 6

Similarly, `for...of` needs an actual iterable — `Object.values()` gives it one:

```javascript
let myObj = { a: 1, b: 2, c: 3 };

for (let value of Object.values(myObj)) {
    console.log(value);
}
```

<details>
<summary>Show Answer</summary>

```
1
2
3
```

</details>

## Applicability — Strings

### Question 7

```javascript
let myString = 'hello';

for (let index in myString) {
    console.log(myString[index]);
}
```

<details>
<summary>Show Answer</summary>

```
h
e
l
l
o
```

</details>

**`forEach` needs the string converted to an array first:**

```javascript
Array.from(myString).forEach((char) => {
    console.log(char)
});
```

**`for...of` works directly on strings, iterating character by character:**

```javascript
for (let char of myString) {
    console.log(char);
}
```

Both produce the same `h`, `e`, `l`, `l`, `o` output as Question 7.

### Question 8

What happens if you try `for...of` directly on a plain object?

```javascript
const plainObj = { a: 1, b: 2 };
for (const x of plainObj) {
    console.log(x);
}
```

<details>
<summary>Show Answer</summary>

```
TypeError: plainObj is not iterable
```

**Explanation:** `for...of` only works on values that implement the **iterator protocol** (see the section below) — plain objects don't, by design, which is exactly why Questions 5 and 6 had to go through `Object.keys()`/`Object.values()` (both of which return arrays, which *are* iterable) instead of iterating the object directly.

</details>

## Break and Return Behavior

**Setup used by the questions below:**

```javascript
const arr = [300, 34, 525, 45, 234]
const numbers = [10, 20, 30, 40, 50];
```

### Question 9

Does `return` inside a `forEach` callback exit the surrounding function?

```javascript
const forEachFun = () => {
    arr.forEach(e => {
        if (e > 500) return true
    })
    return false
}

console.log(forEachFun())
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** `return true` only returns from that one callback *invocation* — and `forEach` completely ignores whatever its callback returns. There's no way to `break` or early-`return` out of a `forEach` loop itself. Even though `arr` contains `525` (which is `> 500`), `forEachFun()` unconditionally returns `false`, because the outer `return false` always runs after `.forEach()` finishes its full pass.

</details>

### Question 10

```javascript
for (const value of numbers) {
    if (value > 20) {
        break;
    }
    console.log(value)
}
```

<details>
<summary>Show Answer</summary>

```
10
20
```

**Explanation:** `for...of` gives you the actual **values**, so the check `value > 20` works as expected: `10` and `20` pass through, and the loop breaks before ever logging `30`.

</details>

### Question 11

```javascript
const forOfFun = () => {
    for (const val of arr) {
        if (val > 500) return true
    }
    return false
}

console.log(forOfFun())
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** Unlike `forEach` (Question 9), a real `return` inside a `for...of` loop body *does* exit the enclosing function immediately. `arr`'s third element, `525`, trips `val > 500`, so `forOfFun()` returns `true` right there — the array's later elements are never even visited.

</details>

### Question 12

The same `break` idea as Question 10, but with `for...in` over an **array**:

```javascript
for (const index in numbers) {
    if (index > 20) {
        break;
    }
    console.log(index);
    console.log(index + " : " + numbers[index]);
}
```

<details>
<summary>Show Answer</summary>

```
0 : 10
1 : 20
2 : 30
3 : 40
4 : 50
```

**Explanation:** ⚠️ **Gotcha:** this loop never breaks and logs *every* element! `for...in` over an array gives you **indices**, not values — and `numbers` only has 5 elements, so `index` only ever ranges over `'0'` through `'4'`. The comparison `index > 20` coerces the string index to a number, but since the highest index is `4`, it's never actually greater than `20` — the `break` condition is unreachable for any array of 21 elements or fewer. Compare this directly with Question 10, which breaks correctly because it's checking the **value** (which does exceed 20), not the index.

</details>

### Question 13

```javascript
const forInFun = () => {
    for (const idx in arr) {
        if (arr[idx] > 500) return true
    }
    return false
}

console.log(forInFun())
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** Here the check is on `arr[idx]` (the actual value at that index), not on `idx` itself — so unlike Question 12, this correctly detects `525` and returns `true` as soon as it's found, at index `'2'`.

</details>

## The Iterator Protocol

Iteration methods like `forEach`/`for...of` all rely on something more fundamental: the **iterator protocol**. An object is *iterable* if it has a `[Symbol.iterator]` method that returns an **iterator** — an object with a `.next()` method that returns `{ value, done }` on each call.

### Question 14

Calling the protocol manually on a built-in array:

```javascript
const arr = [10, 20];
const it = arr[Symbol.iterator]();

console.log(it.next());
console.log(it.next());
console.log(it.next());
```

<details>
<summary>Show Answer</summary>

```
{ value: 10, done: false }
{ value: 20, done: false }
{ value: undefined, done: true }
```

**Explanation:** `for...of`, spread (`...arr`), and array destructuring are all just convenient syntax over exactly this: repeatedly calling `.next()` until `done` is `true`. Arrays, strings, `Map`, and `Set` all ship with a built-in `[Symbol.iterator]`; plain objects deliberately don't (which is why Question 8 throws).

</details>

### Question 15

You can make **any** object iterable by implementing `[Symbol.iterator]` yourself:

```javascript
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

console.log([...range]);

for (const num of range) {
  console.log(num);
}
```

<details>
<summary>Show Answer</summary>

```
[ 1, 2, 3 ]
1
2
3
```

**Explanation:** `range` is a plain object — it works with spread *and* `for...of` purely because it implements `[Symbol.iterator]()`, returning a fresh iterator object each time (with its own `next()` and its own private `current` counter closed over). This is exactly what makes `for...of` succeed here where Question 8's `plainObj` failed. (Generator functions are a much shorter way to write this same pattern — see [generators.md](generators.md).)

</details>

### Question 16

Destructuring and spread both rely on this same protocol — not just `for...of`:

```javascript
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next: () => current <= last
        ? { value: current++, done: false }
        : { value: undefined, done: true }
    };
  }
};

const [first, second] = range;
console.log(first, second);
```

<details>
<summary>Show Answer</summary>

```
1 2
```

**Explanation:** Array destructuring `[first, second] = range` calls `range[Symbol.iterator]()` under the hood and pulls values via `.next()`, exactly like `for...of` does — it just stops early once it has enough values for the pattern on the left.

</details>

**Built-in iterator-returning methods:** arrays also expose `.entries()`, `.keys()`, and `.values()`, each returning an iterator you can spread or loop over directly:

```javascript
console.log(['a', 'b'].entries().next()); // { value: [0, 'a'], done: false }
console.log([...['a', 'b'].keys()]);      // [0, 1]
console.log([...['a', 'b'].values()]);    // ['a', 'b']
```

## Async Behavior: `forEach` vs `for...of`

One of the most common JavaScript interview gotchas involving `async` / `await`.

### Setup

```javascript
const getById = (id, timer = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Got ${id} for Timeout: ${timer * 1000}`);
      resolve(id);
    }, timer * 1000);
  });
};
```

---

## Question 17

```javascript
const ids = [1, 2, 3];

ids.forEach(async (id) => {
  await getById(id, id);
});

console.log("forEach() call finished");
```

<details>
<summary><strong>Show Answer</strong></summary>

### Output

```text
forEach() call finished

Got 1 for Timeout: 1000
Got 2 for Timeout: 2000
Got 3 for Timeout: 3000
```

> **Note:** The order of the `Got ...` logs depends on when each asynchronous operation finishes. In this example (1s, 2s, 3s), they'll naturally appear in that order.

---

### Explanation

`forEach()` **does not wait** for `await`.

It simply:

1. Calls the callback for `1`
2. Immediately calls the callback for `2`
3. Immediately calls the callback for `3`
4. Finishes execution

Each callback pauses at its own `await`, but **`forEach()` itself never waits** for those Promises.

As a result, all three timers start almost **simultaneously**.

---

### Timeline

```text
t = 0s
├── Start getById(1) → Timer (1s)
├── Start getById(2) → Timer (2s)
├── Start getById(3) → Timer (3s)
└── forEach() call finished

t = 1s
└── Got 1

t = 2s
└── Got 2

t = 3s
└── Got 3
```

---


### Key Takeaway

> `forEach()` ignores the Promise returned by an `async` callback. All asynchronous operations start immediately and run **concurrently**.

</details>

---

## Question 18

```javascript
(async function () {
  const ids = [1, 2, 3];

  for (const id of ids) {
    await getById(id, id);
  }

  console.log("for...of loop finished");
})();
```

<details>
<summary><strong>Show Answer</strong></summary>

### Output

```text
Got 1 for Timeout: 1000
Got 2 for Timeout: 2000
Got 3 for Timeout: 3000
for...of loop finished
```

---

### Explanation

`for...of` is a real control-flow statement.

When execution reaches:

```javascript
await getById(id, id);
```

the **entire loop pauses** until the Promise resolves.

Only after the current iteration completes does the next iteration begin.

Therefore:

- `getById(2)` starts **after** `getById(1)` finishes.
- `getById(3)` starts **after** `getById(2)` finishes.

The asynchronous operations execute **sequentially**, not in parallel.

> `for...in` behaves the same way with respect to `await`. The important distinction is **loop constructs** (`for`, `for...of`, `for...in`) versus **array methods** (`forEach`, `map`, `filter`, etc.).

---

### Visual Representation

```text
Time →

0s
│
├── getById(1)
│
1s
│
├── Got 1
├── getById(2)
│
3s
│
├── Got 2
├── getById(3)
│
6s
│
├── Got 3
└── for...of loop finished
```

### Key Takeaway

> `for...of` respects `await`. Each iteration waits for the previous Promise to resolve, so asynchronous operations execute **one after another**.

</details>

---
## Execution Timeline: `forEach` + `for...of` Together

```javascript
const getById = (id, timer = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Got ${id} for Timeout: ${timer * 1000}`);
      resolve(id);
    }, timer * 1000);
  });
};

const ids = [1, 2, 3];

ids.forEach(async (id) => {
  await getById(id, id);
});

console.log("forEach() call finished");

(async function () {
  const ids = [1, 2, 3];

  for (const id of ids) {
    await getById(id, id);
  }

  console.log("for...of loop finished");
})();
```
<details>
<summary><strong>Show Answer</strong></summary>

## Typical Output

```text
t = 0s
forEach() call finished

t = 1s
Got 1 for Timeout: 1000   // forEach
Got 1 for Timeout: 1000   // for...of

t = 2s
Got 2 for Timeout: 2000   // forEach

t = 3s
Got 3 for Timeout: 3000   // forEach
Got 2 for Timeout: 2000   // for...of

t = 6s
Got 3 for Timeout: 3000   // for...of
for...of loop finished
```

---

## Visual Timeline

```text
Time →

0s
│
├── forEach
│   ├── Timer1 (1s)
│   ├── Timer2 (2s)
│   └── Timer3 (3s)
│
├── forEach() call finished
│
├── for...of
│   └── Timer1 (1s)
│
1s
│
├── Got 1 (forEach)
├── Got 1 (for...of)
└── Start Timer2 (2s)

2s
│
└── Got 2 (forEach)

3s
│
├── Got 3 (forEach)
├── Got 2 (for...of)
└── Start Timer3 (3s)

6s
│
├── Got 3 (for...of)
└── for...of loop finished
```

## Key Takeaways

- `forEach()` starts **all async operations immediately** and never waits.
- `for...of` starts the **next async operation only after the previous one completes**.
- Since both snippets execute in the same program, their timers **overlap**, causing the logs to interleave.
- The logs occurring at **1s** and **3s** may swap order because they are produced by timers that expire at approximately the same time.
</details>

## Interview Summary

| Feature | `forEach()` | `for...of` |
|---------|-------------|------------|
| Waits for `await` | ❌ No | ✅ Yes |
| Execution | Concurrent (all start together) | Sequential (one after another) |
| Loop finishes immediately | ✅ Yes | ❌ No |
| Suitable for ordered async tasks | ❌ No | ✅ Yes |
| Suitable for parallel async tasks | ✅ Yes | ❌ No |

## `await` with Loops vs Array Methods

A common misconception is that **any function using `await` will pause execution**.

That's **not true**.

The important distinction is:

- ✅ **Loop constructs** (`for`, `for...of`, `for...in`, `while`, `do...while`) respect `await`.
- ❌ **Array methods** (`forEach`, `map`, `filter`, `find`, etc.) do **not** wait for an async callback.

---

## Why?

`await` pauses the **current async function**, not the caller.

Loop constructs are part of the language's control flow, so they naturally pause the loop until the awaited Promise resolves.

Array methods, on the other hand, simply invoke the callback for each element and continue immediately. They don't know or care whether the callback returned a Promise.

---

## Loop Constructs (Work with `await`)

These execute **sequentially** because the loop itself pauses at each `await`.

```javascript
for (const id of ids) {
  await getById(id);
}
```

```javascript
for (const key in obj) {
  await someAsyncTask(key);
}
```

```javascript
for (let i = 0; i < ids.length; i++) {
  await getById(ids[i]);
}
```

```javascript
while (condition) {
  await doSomething();
}
```

```javascript
do {
  await doSomething();
} while (condition);
```

---

## Array Methods (Do NOT Wait)

The following methods **do not wait** for an async callback:

- `forEach`
- `map`
- `filter`
- `find`
- `findIndex`
- `some`
- `every`
- `reduce`
- `flatMap`

---

### `forEach`

```javascript
ids.forEach(async (id) => {
  await getById(id);
});

console.log("Done");
```

Output:

```text
Done

Got 1
Got 2
Got 3
```

All callbacks are invoked immediately.

---

## `map()`

### Expectation

```javascript
const users = ids.map(async (id) => {
  return await getById(id);
});
```

Expected:

```javascript
[
  { id: 1 },
  { id: 2 },
  { id: 3 }
]
```

### Reality

`map()` immediately returns an array of Promises.

```javascript
[
  Promise,
  Promise,
  Promise
]
```

<details>
<summary><strong> Show Fix</strong></summary>


Use `Promise.all()` to wait for all Promises.

```javascript
const users = await Promise.all(
  ids.map((id) => getById(id))
);
```

</details>

---

## `filter()`

### Expectation

```javascript
const result = ids.filter(async (id) => {
  return id > 1;
});
```

Expected:

```javascript
[2, 3]
```

### Reality

```javascript
[1, 2, 3]
```

Because every async callback returns a Promise, and every Promise object is truthy.

<details>
<summary><strong> Show Fix</strong></summary>

### Fix

Resolve the async work first, then filter synchronously.

```javascript
const values = await Promise.all(
  ids.map(async (id) => ({
    id,
    keep: id > 1,
  }))
);

const result = values
  .filter(item => item.keep)
  .map(item => item.id);
```

</details>

---

## `find()`

### Expectation

```javascript
const result = ids.find(async (id) => {
  return id > 1;
});
```

Expected:

```javascript
2
```

### Reality

```javascript
1
```

The first returned Promise is truthy, so the first element matches.

<details>
<summary><strong> Show Fix</strong></summary>

### Fix (Option 1)

Resolve all conditions first.

```javascript
const values = await Promise.all(
  ids.map(async (id) => ({
    id,
    match: id > 1,
  }))
);

const result = values.find(item => item.match)?.id;
```

### Fix (Option 2 - Recommended)

Use `for...of` so you can stop as soon as a match is found.

```javascript
let result;

for (const id of ids) {
  if (await someAsyncCheck(id)) {
    result = id;
    break;
  }
}
```

</details>

---

## `some()`

### Expectation

```javascript
const result = ids.some(async (id) => {
  return id > 10;
});
```

Expected:

```javascript
false
```

### Reality

```javascript
true
```

Because a Promise object is truthy.

<details>
<summary><strong> Show Fix</strong></summary>

### Fix (Option 1)

Resolve everything first.

```javascript
const checks = await Promise.all(
  ids.map(async (id) => id > 10)
);

const result = checks.some(Boolean);
```

### Fix (Option 2 - Recommended)

Use `for...of` for early exit.

```javascript
let found = false;

for (const id of ids) {
  if (await someAsyncCheck(id)) {
    found = true;
    break;
  }
}
```

</details>

---

## `every()`

### Expectation

```javascript
const result = ids.every(async (id) => {
  return id > 10;
});
```

Expected:

```javascript
false
```

### Reality

```javascript
true
```

Because every callback returns a truthy Promise.

<details>
<summary><strong> Show Fix</strong></summary>

### Fix (Option 1)

Resolve everything first.

```javascript
const checks = await Promise.all(
  ids.map(async (id) => id > 10)
);

const result = checks.every(Boolean);
```

### Fix (Option 2 - Recommended)

Use `for...of`.

```javascript
let allPassed = true;

for (const id of ids) {
  if (!(await someAsyncCheck(id))) {
    allPassed = false;
    break;
  }
}
```

</details>

---

## `reduce()`

### Expectation

```javascript
const sum = ids.reduce(async (acc, id) => {
  return acc + await getById(id);
}, 0);
```

Expected:

```javascript
6
```

### Reality

After the first iteration, the accumulator becomes a Promise.

Subsequent iterations operate on:

```text
Promise + Number
```

which is usually not what you intended.

<details>
<summary><strong> Show Fix</strong></summary>

### Fix (Option 1)

Await the accumulator.

```javascript
const sum = await ids.reduce(
  async (accPromise, id) => {
    const acc = await accPromise;
    return acc + await getById(id);
  },
  Promise.resolve(0)
);
```

### Fix (Option 2 - Recommended)

Use `for...of` for better readability.

```javascript
let sum = 0;

for (const id of ids) {
  sum += await getById(id);
}
```

</details>
---

## Summary

| Construct | Waits for `await`? | Typical Behavior |
|-----------|--------------------|------------------|
| `for` | ✅ Yes | Sequential execution |
| `for...of` | ✅ Yes | Sequential execution |
| `for...in` | ✅ Yes | Sequential execution |
| `while` | ✅ Yes | Sequential execution |
| `do...while` | ✅ Yes | Sequential execution |
| `forEach` | ❌ No | Starts all callbacks immediately |
| `map` | ❌ No | Returns an array of Promises |
| `filter` | ❌ No | Promise is truthy; doesn't filter as expected |
| `find` | ❌ No | First Promise is truthy; returns first element |
| `some` | ❌ No | Promise is truthy; often returns `true` |
| `every` | ❌ No | Promise is truthy; often returns `true` |
| `reduce` | ❌ No | Doesn't automatically await the accumulator |

---

## Interview Takeaway

> **`await` pauses the current async function, not the caller.**

- **Loop constructs** (`for`, `for...of`, `for...in`, `while`, `do...while`) are part of the function's control flow, so they pause naturally.
- **Array methods** (`forEach`, `map`, `filter`, `find`, `some`, `every`, etc.) simply invoke your callback and continue. If the callback returns a Promise, the method doesn't wait for it.