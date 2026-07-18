# Map, Set, and Object — Comparisons

## `Set`

- Will have only **unique values**.
- Can be initialized from an array.
- The constructor returns a `Set` object.
- Traversal via `for...of` or `.forEach()`.
- Iterates in the same order values were added.
- `.has()` is much quicker than testing for membership with `Array.includes()` on an equivalent array.

```javascript
const set = new Set([1, 2])
console.log(set); // Set(2) {1, 2}
```

**Methods:**

| Method | Description |
|---|---|
| `set.add(value)` | Adds a value. Returns the set itself (chainable). |
| `set.delete(value)` | Removes the value. Returns `true` if it existed, else `false`. |
| `set.has(value)` | Returns `true` if the value exists in the set. |
| `set.clear()` | Removes everything from the set. |
| `set.size` | The element count (property, not a method). |

**Set composition methods (newer — verified in Node 22):**

| Method | Description |
|---|---|
| `setA.union(setB)` | All elements in either set. |
| `setA.intersection(setB)` | Only elements in **both** sets. |
| `setA.difference(setB)` | Elements in `setA` but **not** in `setB`. |
| `setA.symmetricDifference(setB)` | Elements in exactly one of the two sets, not both. |
| `setA.isSubsetOf(setB)` | `true` if every element of `setA` is also in `setB`. |
| `setA.isSupersetOf(setB)` | `true` if `setA` contains every element of `setB`. |
| `setA.isDisjointFrom(setB)` | `true` if the two sets share no elements at all. |

### Question 1

```javascript
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

console.log([...a.union(b)]);
console.log([...a.intersection(b)]);
console.log([...a.difference(b)]);
console.log([...a.symmetricDifference(b)]);
```

<details>
<summary>Show Answer</summary>

```
[ 1, 2, 3, 4 ]
[ 2, 3 ]
[ 1 ]
[ 1, 4 ]
```

**Explanation:** Before these landed (Baseline across major browsers/Node from 2024–2025), doing set arithmetic like this required manually looping or converting to arrays — `[...new Set([...a, ...b])]` for a union, `[...a].filter(x => b.has(x))` for an intersection, and so on. These methods replace all of that with direct, readable set-theory operations. ⚠️ **Compatibility note:** these are relatively recent additions — check they're available in your target runtime (Node ≥ 22, or a recent evergreen browser) before relying on them; they won't exist in older LTS Node versions or older browsers without a polyfill.

</details>

## `Map`

- Will have only **unique keys**.
- Can be initialized from an array of `[key, value]` pairs.

**Methods:**

| Method | Description |
|---|---|
| `map.set(key, value)` | Stores the value under the key. |
| `map.get(key)` | Returns the value for the key, or `undefined` if it doesn't exist. |
| `map.has(key)` | Returns `true` if the key exists. |
| `map.delete(key)` | Removes the key/value pair for the given key. |
| `map.clear()` | Removes everything from the map. |
| `map.size` | The current element count (property, not a method). |

**Newer convenience methods — `getOrInsert` / `getOrInsertComputed`:**

A very common `Map` pattern is "read a value if it exists, otherwise compute and store a default":

```javascript
// The old way — two lookups, and easy to get subtly wrong
if (!map.has(key)) {
  map.set(key, computeExpensiveDefault());
}
const value = map.get(key);
```

The newer `Map.prototype.getOrInsert(key, value)` and `Map.prototype.getOrInsertComputed(key, callbackFn)` collapse this into one call:

```javascript
// getOrInsert: value is provided directly
const value = map.getOrInsert(key, defaultValue);

// getOrInsertComputed: value is computed lazily, only if the key is missing
const value2 = map.getOrInsertComputed(key, (k) => computeExpensiveDefault(k));
```

- `getOrInsert(key, value)` — if `key` exists, returns its current value; otherwise inserts `value` under `key` and returns it.
- `getOrInsertComputed(key, callbackFn)` — same idea, but the replacement value comes from calling `callbackFn(key)` — and critically, `callbackFn` is **only invoked if the key is actually missing**, unlike `map.set(key, map.get(key) ?? computeExpensiveDefault())`, which always evaluates the fallback eagerly whether it's needed or not.

⚠️ **Compatibility note:** this is a newer TC39 proposal — at the time of writing it is **not yet available in Node 22** (`typeof Map.prototype.getOrInsert` is `"undefined"` there) and may not be supported in your target browsers either. Always check current support (caniuse / MDN) before relying on it, and fall back to the manual `has`/`get`/`set` pattern above if you need broader compatibility.

**Notes:**
- Whenever asked to optimize something, or asked for a more efficient approach, consider whether a `Map` or `Set` fits.
- `map.has()`/`set.has()` run in `O(1)`, versus `O(n)` for `Array.includes()` — a direct efficiency win whenever membership checks happen frequently.
- Frequency counting, deduplication, finding duplicates, and pair-sum-style problems are common interview questions built around `Map`/`Set`.

## Map vs. Object

Both let you store a collection of data as key-value pairs. However, there are some important differences.

### 1. Key Data Types

- **Object** can only have **strings** or **symbols** as keys — anything else gets coerced to a string.
- **Map** can have a key of **any data type**, including objects, functions, or other collections — unlike objects, keys are never converted to strings.

**Setup used by the questions below:**

```javascript
const user1 = { name: "Eren" };
const user2 = { name: "Amane" };
```

### Question 2

What happens when you use objects as keys on a plain object?

```javascript
const obj = {};
obj[user1] = 234;
obj[user2] = 123;

console.log(obj[user1]);
console.log(Object.keys(obj));
```

<details>
<summary>Show Answer</summary>

```
123
[ '[object Object]' ]
```

**Explanation:** ⚠️ This is the concrete reason `Map` exists. Object keys are always coerced to strings — and **every plain object stringifies to the exact same string**, `"[object Object]"` (see [Coercion.md](Coercion.md) for why). So `obj[user1] = 234` and `obj[user2] = 123` don't create two entries — they both resolve to the *same* key, `"[object Object]"`, and the second assignment silently overwrites the first. `obj[user1]` returns `123`, not `234`, and `Object.keys(obj)` shows only one key total, no matter how many different objects you "used as keys."

</details>

### Question 3

Does `Map` have the same problem?

```javascript
const myMap = new Map();
myMap.set(user1, 123);
myMap.set(user2, 456);

console.log(myMap.get(user1));
console.log(myMap.get(user2));
console.log(myMap.size);
```

<details>
<summary>Show Answer</summary>

```
123
456
2
```

**Explanation:** No collision — `Map` keys are compared by reference (like `===`), not by stringifying them first. `user1` and `user2` are genuinely distinct objects, so they're genuinely distinct keys, and both entries coexist. This is exactly the interview-favorite use case for "using an object as a `Map` key": anywhere you need to associate extra data with an object itself (e.g. DOM nodes, class instances) without mutating that object or worrying about key collisions — something a plain object literally cannot do correctly, as Question 2 demonstrates.

</details>

### Question 4 — A Practical Use Case: Reference-Based Memoization

```javascript
const cache = new Map();
let computeCount = 0;

function getExpensiveTotal(items) {
  if (cache.has(items)) {
    return cache.get(items);
  }
  computeCount++;
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  cache.set(items, total);
  return total;
}

const cart = [{ price: 100, qty: 2 }, { price: 50, qty: 1 }];
console.log(getExpensiveTotal(cart));
console.log(getExpensiveTotal(cart));
console.log('computeCount:', computeCount);

// A different array with IDENTICAL contents — same values, different reference
const cartCopy = [{ price: 100, qty: 2 }, { price: 50, qty: 1 }];
console.log(getExpensiveTotal(cartCopy));
console.log('computeCount:', computeCount);
```

<details>
<summary>Show Answer</summary>

```
250
250
computeCount: 1
250
computeCount: 2
```

**Explanation:** This is the practical payoff of "array/object as key." `cache.set(items, total)` uses the **array itself** — not a stringified or serialized version of it — as the cache key. Calling `getExpensiveTotal(cart)` twice with the *same* `cart` reference hits the cache instantly (`computeCount` stays at `1`). But `cartCopy` — a different array, even though its contents are identical — is a different key entirely, so it recomputes (`computeCount` becomes `2`). This reference-identity-based caching is exactly the mechanism behind memoized selectors in state-management libraries (e.g. Reselect, or React's `useMemo`/`useCallback` dependency comparisons): the cache is invalidated by *which object you pass*, not by inspecting its contents — which is both faster (no need to deep-compare or serialize) and only possible because `Map` keys aren't coerced to strings the way object property keys are.

Doing the equivalent with a plain object as the "cache" would require `JSON.stringify(items)` as the key instead (since `cacheObj[items]` would coerce `items` to `"[object Object]"` regardless of which array was passed, causing exactly the same collision as Question 2) — slower, and breaks entirely if the data contains functions, `undefined`, circular references, or anything else `JSON.stringify` can't represent.

</details>

### 2. Key Ordering

**Object** follows specific ordering rules, not insertion order by default:
- Keys that look like non-negative integers (in canonical form) come first, ordered numerically ascending.
- Then string keys, in insertion order.
- Then symbol keys, in insertion order.

> **Note:** JS checks whether a string key *could* be a canonical non-negative integer — if so, it's grouped and numerically sorted with the "integer" keys instead of the string keys. `'00'` is **not** canonical (a real integer wouldn't have a leading zero), so it's treated as a plain string key despite looking numeric. See [this reference](https://dev.to/frehner/the-order-of-js-object-keys-458d) for the full spec detail.

**`Map`**, by contrast, **always** iterates in insertion order — full stop, no special-casing for integer-like keys.

### Question 5

```javascript
const obj = {
    2: true,
    1: true,
    '00': true,
    'b': true,
    'a': true,
    '3': true,
    '0': true,
    '-2': false
}
console.log(Object.keys(obj))
```

<details>
<summary>Show Answer</summary>

```
[ '0', '1', '2', '3', '00', 'b', 'a', '-2' ]
```

**Explanation:** `'0'`, `'1'`, `'2'`, `'3'` are canonical non-negative integers, so they come first, sorted numerically (not by insertion order — notice `2` and `1` were inserted before `3` and `0`, but the output is still `0, 1, 2, 3`). `'00'` (non-canonical — real integers don't have leading zeros) and `'-2'` (negative) don't qualify as "integer-like," so they're treated as ordinary string keys and appear afterward in their **original insertion order**, alongside `'b'` and `'a'`: `'00'`, `'b'`, `'a'`, `'-2'`. `for...in` follows this exact same ordering.

</details>

### Question 6

```javascript
const myMap = new Map();
myMap.set('dairyMilk', '1 packet');
myMap.set('peda', '500g');
myMap.set('lotteChocoPie', '2 packet');

myMap.forEach((value, key) => {
    console.log(key + " = " + value);
})
```

<details>
<summary>Show Answer</summary>

```
dairyMilk = 1 packet
peda = 500g
lotteChocoPie = 2 packet
```

**Explanation:** Unlike the object case in Question 5, `Map` never reorders anything by key type or value — it's always strict insertion order, which is one of the reasons `Map` is often preferred when order genuinely matters. `for...of` over a `Map` (destructuring each entry as `[key, value]`) produces the identical order:

```javascript
for (let [key, value] of myMap) {
    console.log(key + " = " + value);
}
// dairyMilk = 1 packet
// peda = 500g
// lotteChocoPie = 2 packet
```

</details>

### 3. Getting the Size

- **Object:** no direct property — you have to count keys yourself, typically `Object.keys(obj).length`.
- **Map:** has a built-in `.size` property that's always accurate and O(1) to read.

### 4. Efficiency

- **Object** isn't particularly efficient under frequent addition/removal of properties.
- **Map** is specifically optimized for scenarios with frequent addition and deletion of key-value pairs.

## `WeakMap` and `WeakSet`

A commonly asked follow-up: *"what's the difference between `Map`/`Set` and `WeakMap`/`WeakSet`?"*

- Keys (for `WeakMap`) or values (for `WeakSet`) **must be objects** — primitives aren't allowed.
- Those references are held **weakly** — if there's no other reference to that object anywhere in the program, the garbage collector is free to reclaim it, and its entry is automatically removed from the `WeakMap`/`WeakSet`. A regular `Map`/`Set` would keep that object alive forever just by holding a reference to it, which is a classic source of memory leaks (e.g. caching data keyed by DOM nodes that get removed from the page).
- **Not iterable** — no `.forEach()`, no `for...of`, no `.keys()`/`.values()`/`.entries()`, and no `.size`. This is a direct consequence of weak references: since entries can vanish at any moment (whenever the GC runs), the *number* of entries isn't even a well-defined, stable value you could report.
- Much smaller API surface as a result: just `get`/`set`/`has`/`delete` for `WeakMap`, and `add`/`has`/`delete` for `WeakSet`.

**Typical use case:** attaching private/extra metadata to an object without risking a memory leak and without modifying the object itself — e.g. caching computed results per DOM node, or implementing private class fields before native `#privateField` syntax existed.

### Question 7

```javascript
const wm = new WeakMap();
const keyObj = {};
wm.set(keyObj, 'secret');

console.log(wm.get(keyObj));
console.log(wm.size);

wm.set('a string key', 'x');
```

<details>
<summary>Show Answer</summary>

```
secret
undefined
TypeError: Invalid value used as weak map key
```

**Explanation:** Reading back via the same object reference works fine. `wm.size` is `undefined` — `WeakMap` has no `.size` property at all (not even `0`), since entry count isn't meaningfully observable. Attempting to use a **primitive** (`'a string key'`) as the key throws immediately — `WeakMap` keys must be objects, no exceptions.

</details>

## Converting Between `Map`, `Object`, `Array`, and `Set`

A practical, frequently-asked-in-practice skill: moving data between these structures.

### Question 8

```javascript
const obj = { a: 1, b: 2 };

// Object -> Map
const map = new Map(Object.entries(obj));
console.log([...map]);

// Map -> Object
const backToObj = Object.fromEntries(map);
console.log(backToObj);
```

<details>
<summary>Show Answer</summary>

```
[ [ 'a', 1 ], [ 'b', 2 ] ]
{ a: 1, b: 2 }
```

**Explanation:** `Object.entries(obj)` produces the `[key, value][]` shape the `Map` constructor expects; `Object.fromEntries()` is the exact inverse, rebuilding a plain object from any iterable of `[key, value]` pairs — including directly from a `Map`, since `Map` is itself iterable as entries.

</details>

### Question 9

```javascript
const set = new Set([1, 2, 2, 3]);

console.log(Array.from(set));
console.log([...set]);
```

<details>
<summary>Show Answer</summary>

```
[ 1, 2, 3 ]
[ 1, 2, 3 ]
```

**Explanation:** Both `Array.from(set)` and the spread operator `[...set]` work identically here — both rely on `Set` implementing the iterator protocol (see [Iterators.md](Iterators.md)). This is also the standard idiom for deduplicating an array: `[...new Set(arrayWithDupes)]`.

</details>
