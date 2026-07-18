# Shallow Copy and Deep Copy

> Objects/Arrays interact by reference when assigned to each other. When you assign a reference from one variable to another, you copy the *reference itself*, not the underlying data — note the two variables don't share the same variable, but they do share the same object in memory.

## Initial Data

```javascript
const iykyk = [30, 28, 32];
const detailsObj = {
    fname: 'Amane'
}
```

## The Problem

### Question 1

**Task:** Make a copy of `iykyk` and change first value to 32

```javascript
const iykykCopy = iykyk;
iykykCopy[0] = 32;
console.log(iykyk);
console.log(iykykCopy);
```

<details>
<summary>Show Answer</summary>

```
[32, 28, 32]
[32, 28, 32]
```

**Problem:** Both arrays changed! This is because objects (and arrays) are assigned/passed by reference, not by value.

</details>

### Question 2

What will be the output?

```javascript
let ifkyk = [10, 20];
const copy = ifkyk;
ifkyk[0] = 40;
ifkyk = null;
console.log(copy);
```

<details>
<summary>Show Answer</summary>

```
[40, 20]
```

**Explanation:** 

#### Step 1

```javascript
let ifkyk = [10, 20];
```

Memory:

```text
Stack                      Heap
-----                      ----------------
ifkyk ────────────────▶    [10, 20]
```

`ifkyk` doesn't store the array itself.

It stores a **reference** to the array in the heap.

---

#### Step 2

```javascript
const copy = ifkyk;
```

The reference inside `ifkyk` is copied into `copy`.

Memory:

```text
Stack

ifkyk ───────┐
             │
copy ────────┘
             │
             ▼

Heap

[10, 20]
```

Notice:

Both variables point to the **same array**.

No new array is created.

---

#### Step 3

```javascript
ifkyk[0] = 40;
```

This does **not** change the variable.

Instead, it modifies the **shared array** in memory.

Memory:

```text
Stack

ifkyk ───────┐
             │
copy ────────┘
             │
             ▼

Heap

[40, 20]
```

Since both variables reference the same array, both "see" the updated value.

---

#### Step 4

```javascript
ifkyk = null;
```

Now only the variable changes.

Memory:

```text
Stack

ifkyk ─────▶ null

copy ──────▶
             │
             ▼

Heap

[40, 20]
```

The array still exists because `copy` still references it.

---

#### Step 5

```javascript
console.log(copy);
```

`copy` follows its reference to the array.

Output:

```javascript
[40, 20]
```


</details>

### Question 3

What will be the output?

```javascript
let person = { name: 'Lydia' };
const members = [person];
person = null;
console.log(members);
```

<details>
<summary>Show Answer</summary>

```
[{ name: 'Lydia' }]
```

**Explanation:** 
- Variables don't store objects—they store **references** to objects.
- Assigning an object to another variable or data structure copies the **reference**, not the object.
- Reassigning a variable (`person = null`) changes only that variable.
- The object remains alive as long as **at least one reference** still points to it.

#### Step 1

```javascript
let ifkyk = [10, 20];
```

Memory:

```text
Stack                      Heap
-----                      ----------------
ifkyk ────────────────▶    [10, 20]
```

`ifkyk` doesn't store the array itself.

It stores a **reference** to the array in the heap.

---

#### Step 2

```javascript
const copy = ifkyk;
```

The reference inside `ifkyk` is copied into `copy`.

Memory:

```text
Stack

ifkyk ───────┐
             │
copy ────────┘
             │
             ▼

Heap

[10, 20]
```

Notice:

Both variables point to the **same array**.

No new array is created.

---

#### Step 3

```javascript
ifkyk[0] = 40;
```

This does **not** change the variable.

Instead, it modifies the **shared array** in memory.

Memory:

```text
Stack

ifkyk ───────┐
             │
copy ────────┘
             │
             ▼

Heap

[40, 20]
```

Since both variables reference the same array, both "see" the updated value.

---

#### Step 4

```javascript
ifkyk = null;
```

Now only the variable changes.

Memory:

```text
Stack

ifkyk ─────▶ null

copy ──────▶
             │
             ▼

Heap

[40, 20]
```

The array still exists because `copy` still references it.

---

#### Step 5

```javascript
console.log(copy);
```

`copy` follows its reference to the array.

</details>


### Question 4

**Task:** Make a copy of `detailsObj` and try to add a property `"age"` with value `25`

```javascript
const detailsObjCopy = detailsObj;
detailsObjCopy.age = 25;
console.log(detailsObjCopy);
console.log(detailsObj);
```

<details>
<summary>Show Answer</summary>

```
{ fname: 'Amane', age: 25 }
{ fname: 'Amane', age: 25 }
```

**Problem:** Both objects changed! `age` was added to both, because `detailsObjCopy` and `detailsObj` are two names for the exact same object.

</details>

**Explanation of the problem:** In all four questions above, modifying the "copy" also changes the "original" — because non-primitive types are accessed by reference, not value. Writing `const detailsObjCopy = detailsObj` doesn't create a new object; it just gives the *same* object a second name. Simple bhasa mein bole toh, hum Amane ko kuch kahe ya mg ko, bol toh tumhi ko rhe na — bus 2 alag alag naam kar diye. Original name aur nickname type.

## Solutions

### 1. Spread Operator (Shallow Copy)

Works cleanly for simple arrays (of primitives) and simple objects (with primitive values). It creates a **shallow** copy — a new top-level array/object, but nested objects/arrays inside it are still shared by reference.

### Question 5

```javascript
const iykykCopy = [...iykyk];
iykykCopy[0] = 32;
console.log(iykykCopy);
console.log(iykyk);

const detailsObjCopy = { ...detailsObj };
detailsObjCopy.age = 25;
console.log(detailsObjCopy);
console.log(detailsObj);
```

<details>
<summary>Show Answer</summary>

```
[32, 28, 32]
[30, 28, 32]
{ fname: 'Amane', age: 25 }
{ fname: 'Amane' }
```

**Success!** The spread operator creates a genuinely separate top-level copy for these flat data structures.

</details>

### Question 6 — Where Shallow Copy Breaks Down

```javascript
const people = [{ name: "Anjali" }, { name: "Priya" }];
const copyOfPeople = [...people];
copyOfPeople[0].name = "Pooja";
console.log(copyOfPeople);
console.log(people);
```

<details>
<summary>Show Answer</summary>

```
[{ name: "Pooja" }, { name: "Priya" }]
[{ name: "Pooja" }, { name: "Priya" }]
```

**Problem:** Both arrays changed! `[...people]` copies the **array itself**, but each *element* inside it — the objects — are still the exact same object references as before. This is exactly "shallow" — only one level deep.

</details>

### 2. `JSON.parse(JSON.stringify())` — Deep Copy

### Question 7

```javascript
const copyOfPeople2 = JSON.parse(JSON.stringify(people));
copyOfPeople2[0].name = "Rohit";
console.log(copyOfPeople2);
console.log(people);
```

<details>
<summary>Show Answer</summary>

```
[{ name: "Rohit" }, { name: "Priya" }]
[{ name: "Anjali" }, { name: "Priya" }]
```

**Success!** True deep copy — the nested objects are new too, so mutating one doesn't touch the other.

</details>

### 3. Lodash `_.cloneDeep()` — Deep Copy

```javascript
const copyOfPeople3 = _.cloneDeep(people);
copyOfPeople3[0].name = "Satakshi";
console.log(copyOfPeople3);
console.log(people);
```

Produces the same shape of result as Question 7 — `copyOfPeople3` changes independently of `people`.

### 4. `structuredClone()` — Deep Copy

### Question 8

```javascript
const copyOfPeople4 = structuredClone(people);
copyOfPeople4[0].name = "Richa";
console.log(copyOfPeople4);
console.log(people);
```

<details>
<summary>Show Answer</summary>

```
[{ name: "Richa" }, { name: "Priya" }]
[{ name: "Anjali" }, { name: "Priya" }]
```

**Success!** A modern, native, built-in deep-cloning method — no `JSON` round-trip, no external library.

</details>

## Which to Choose?

### `JSON.parse(JSON.stringify(x))`
- Built in — no extra dependency.
- **Silently loses data** for anything that isn't plain JSON-representable:
  - `Date` objects become plain strings, not `Date` instances (Question 9).
  - `Map`/`Set` become `{}` — completely emptied out, with no warning.
  - Functions and `undefined` values are silently dropped from objects (see [Coercion.md](Coercion.md)/[Object.md](Object.md)).
- **Throws** on circular references (`TypeError: Converting circular structure to JSON`).
- Slower than the alternatives for large/complex objects, due to the full serialize-then-parse round trip.

### `lodash.cloneDeep()`
- Requires installing a package, increasing bundle size and load time.
- Correctly handles `Date`, `Map`, `Set`, `RegExp`, and more.
- Faster than the JSON method.
- Handles circular references correctly too.

### `structuredClone()`
- Native since Node 17 / all major evergreen browsers — no longer needs a compatibility caveat in most projects as of current LTS Node versions, but still verify support if you must target very old environments.
- Correctly clones `Date`, `Map`, `Set`, `RegExp`, and more.
- Faster than the JSON method.

### Question 9 — `structuredClone()` vs. `JSON` on Things JSON Can't Represent

```javascript
const withDate = { when: new Date('2024-01-15') };

const jsonClone = JSON.parse(JSON.stringify(withDate));
console.log(jsonClone.when, jsonClone.when instanceof Date);

const structClone = structuredClone(withDate);
console.log(structClone.when, structClone.when instanceof Date);
```

<details>
<summary>Show Answer</summary>

```
2024-01-15T00:00:00.000Z false
2024-01-15T00:00:00.000Z true
```

**Explanation:** Both print what *looks* like the same thing, but `jsonClone.when` is now a plain **string** — the `Date`-ness is gone, and any code expecting to call `.getFullYear()` or similar on it will break. `structClone.when` is a genuine `Date` instance, fully intact.

</details>

### Question 10 — `structuredClone()` Actually *Handles* Circular References

```javascript
const circular = { a: 1 };
circular.self = circular;

const cloned = structuredClone(circular);
console.log(cloned.self === cloned);
console.log(cloned !== circular);
```

<details>
<summary>Show Answer</summary>

```
true
true
```

**Explanation:** This is a major advantage over the `JSON` method that's easy to overlook — `JSON.stringify(circular)` throws immediately, but `structuredClone` was specifically designed (originally for the browser's `postMessage` API) to handle circular structures correctly. The clone's `self` property correctly points back at the *clone*, not at the original.

</details>

### Question 11 — But `structuredClone()` Can't Clone Everything Either

```javascript
const withFunction = { fn: () => {}, val: 1 };

console.log(JSON.parse(JSON.stringify(withFunction)));
structuredClone(withFunction);
```

<details>
<summary>Show Answer</summary>

```
{ val: 1 }
DOMException: () => {} could not be cloned.
```

**Explanation:** The two methods fail in **opposite ways** here. `JSON` silently drops the function and moves on, quietly losing data with no warning. `structuredClone` **throws immediately** the moment it hits something unclonable (functions, DOM nodes in some contexts, class instances with private fields, etc.) — arguably safer, since a thrown error is much easier to notice and debug than data that silently vanished.

</details>

### Question 12 — `structuredClone()` and Class Instances

```javascript
class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  getDist() { return Math.sqrt(this.x ** 2 + this.y ** 2); }
}

const p = new Point(3, 4);
const clonedPoint = structuredClone(p);

console.log(clonedPoint);
console.log(clonedPoint instanceof Point);
clonedPoint.getDist();
```

<details>
<summary>Show Answer</summary>

```
{ x: 3, y: 4 }
false
TypeError: clonedPoint.getDist is not a function
```

**Explanation:** ⚠️ `structuredClone` preserves the **data** (own enumerable properties) but not the **prototype chain** — the clone comes back as a plain object, not a `Point`, so its prototype methods are gone. This applies to `JSON.parse(JSON.stringify())` too, for the same underlying reason (only data survives, not "what class this is"). If you need to deep-clone class instances *and* keep their methods, `lodash.cloneDeep()` handles this correctly, or you'd need to manually reconstruct the instance after cloning its data.

</details>

#### Opt for `lodash.cloneDeep()` if lodash is already a dependency in the project; otherwise reach for the native `structuredClone()` first, and fall back to `JSON.parse(JSON.stringify())` only if you specifically need broad legacy-environment support and know your data is plain JSON-safe (no `Date`/`Map`/`Set`/functions/circular references).

## Implementing Your Own Deep Clone

A very common interview follow-up: *"implement `deepClone` yourself, without `JSON` or a library."*

### Question 13 — A Naive Recursive Implementation

```javascript
function deepCloneNaive(value) {
  if (value === null || typeof value !== 'object') return value;
 

  const result = Array.isArray(value) ? [] : {};
  for (const key in value) {
    result[key] = deepCloneNaive(value[key]);
  }
  return result;
}

const original = { name: 'Amane', nested: { deep: { value: 42 } } };
const cloned = deepCloneNaive(original);
cloned.nested.deep.value = 999;

console.log(original.nested.deep.value);
console.log(cloned.nested.deep.value);
```

<details>
<summary>Show Answer</summary>

```
42
999
```

**Explanation:** Primitives (`typeof value !== 'object'`, plus the explicit `null` check since `typeof null === 'object'`) are returned as-is — copying a primitive by value is automatic in JS, nothing to do there. Arrays and objects recurse into each of their own values, rebuilding a brand new structure at every level, all the way down. This correctly handles Questions 5–8's cases.

</details>

### Question 14 — The Naive Version's Circular Reference Bug

```javascript
const circular = { a: 1 };
circular.self = circular;

deepCloneNaive(circular);
```

<details>
<summary>Show Answer</summary>

```
RangeError: Maximum call stack size exceeded
```

**Explanation:** `deepCloneNaive` has no memory of what it's already visited — cloning `circular.self` means cloning `circular` again, which means cloning `circular.self` again, forever, until the call stack overflows. This is the exact same category of bug as `JSON.stringify` throwing on circular data (Question 10's contrast), just manifesting as an infinite loop instead of an immediate, clean error.

</details>

### Question 15 — Fixing It with a `WeakMap`

```javascript
function deepCloneSafe(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);

  const result = Array.isArray(value) ? [] : {};
  seen.set(value, result);

  for (const key in value) {
    result[key] = deepCloneSafe(value[key], seen);
  }
  return result;
}

const circular = { a: 1 };
circular.self = circular;

const cloned = deepCloneSafe(circular);
console.log(cloned.self === cloned);
console.log(cloned !== circular);
```

<details>
<summary>Show Answer</summary>

```
true
true
```

**Explanation:** `seen` tracks every object already being cloned, mapping **original → its (in-progress) clone**, *before* recursing into that object's properties. So when the recursion reaches `circular.self` and finds `circular` already in `seen`, it returns the **already-created** clone instead of recursing infinitely — correctly wiring up `cloned.self` to point back at `cloned` itself. A `WeakMap` (rather than a `Map`) is used specifically so these tracking entries don't prevent the original objects from being garbage-collected once cloning is done — see [MapSetObject.md](MapSetObject.md) for the full `WeakMap` explanation.

</details>
