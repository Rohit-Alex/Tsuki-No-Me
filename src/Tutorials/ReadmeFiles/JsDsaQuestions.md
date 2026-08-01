# JS DSA Questions — Recursion Over Objects & Arrays

A recurring interview pattern across all the questions on this page: given a deeply nested object or array (a tree of categories, menus, permissions, form config, arbitrary JSON), write a small recursive utility to traverse, search, compare, or transform it. Almost every bug found on this page traces back to the same root cause — **`typeof null === "object"`** — so watch for it repeating.

> For deep **cloning**/**copying** an object, see [shallow&DeepCopy.md](shallow&DeepCopy.md#implementing-your-own-deep-clone). For deep **freeze**/**seal**, see [Object.md](Object.md#question-31) and [Question 9](#question-9-deepflatarr-deepclone-deepfreeze) below.

## Nested Object/Array Utilities

## Question 1 — Flatten a Tree Into All Its Leaf Paths

**Challenge:** given a tree of nested category/subcategory nodes, return every "leaf" node's full path, joined by `/`.

```javascript
const data = [
  {
    link: "Pants",
    hasChild: true,
    child: [
      {
        link: "Trousers",
        hasChild: true,
        child: [
          {
            link: "Black",
            hasChild: true,
            child: [
              { link: "XL", hasChild: false },
              { link: "L", hasChild: false },
              { link: "M", hasChild: false }
            ]
          },
          { link: "blue", hasChild: false }
        ]
      }
    ]
  },
  { link: "shirts", hasChild: false }
];

Output expected:
[
  'Pants/Trousers/Black/XL',
  'Pants/Trousers/Black/L',
  'Pants/Trousers/Black/M',
  'Pants/Trousers/blue',
  'shirts'
]
```

<details><summary>Show Answer</summary>

```
const getAllPaths = (data) => {
  const paths = [];
  const traverse = (data, initialPath) => {
    data.forEach((path) => {
      let pathFormed = initialPath + path.link;
      if (path.hasChild && path?.child?.length > 0) {
        traverse(path.child, pathFormed + "/");
      } else {
        paths.push(pathFormed);
      }
    });
  };
  traverse(data, "");
  return paths;
}


console.log(getAllPaths(data));
```

**Explanation:** `traverse` walks the array depth-first, building up `initialPath` as it descends. At each node: if it `hasChild` **and** actually has a non-empty `child` array, recurse one level deeper with the path extended by `link + "/"`. Otherwise (a genuine leaf, or a node inconsistently marked `hasChild: true` with no actual children), the fully-built path is pushed to the results. The `path?.child?.length > 0` check is a defensive guard — it means the function won't crash even if `hasChild` is `true` but `child` is missing or empty, it'll just treat that node as a leaf instead.

**Common interview follow-up:** what if a node could have both children *and* be a valid result itself (not just leaves)? You'd push `pathFormed` unconditionally before the recursive call, not only in the `else` branch.

</details>

## Question 2 — Find the First Value for a Given Key, Anywhere in a Nested Object

**Challenge:** given an object with arbitrarily nested plain-object values, return the value for the first occurrence of a given key, searching at any depth.

```javascript
const target = {
  field1: 1,
  field2: undefined,
  field3: "value",
  field5: [2, 4],
  field4: {
    child: "child",
    child4: "child4",
    child2: {
      child3: "child2",
    },
  },
};

Output expected

[ 2, 4 ]
child
child2

```

<details><summary>Show Answer</summary>

```
const getValFromKeyInObj = (obj, givenKey) => {
  if (givenKey in obj) {
    return obj[givenKey];
  }
  for (const key in obj) {
    const val = obj[key];
    if (typeof val === "object" && val.constructor === Object) {
      return getValFromKeyInObj(val, givenKey);
    }
  }
};

console.log(getValFromKeyInObj(target, "field5"));
console.log(getValFromKeyInObj(target, "child"));
console.log(getValFromKeyInObj(target, "child3"));
```

**Explanation:** if `givenKey` exists directly on `obj`, return it immediately. Otherwise, loop through every key, and for each value that's a plain object (`typeof val === "object" && val.constructor === Object` — this specifically excludes arrays, since an array's constructor is `Array`, not `Object`), recurse into it looking for the key.

**⚠️ Two real bugs in this version, both verified in Node:**

**Bug 1 — it can give up too early.** The `for...in` loop's `return getValFromKeyInObj(val, givenKey)` returns on the **first** nested object it checks, even if that recursive call comes back `undefined` — it never tries the next sibling:

```javascript
const obj = {
  first: { a: 1 },        // checked first — recursion returns undefined
  second: { target: 99 }  // never even reached, because the loop already returned!
};
console.log(getValFromKeyInObj(obj, 'target')); // undefined, but 99 clearly exists in `second`
```

**Bug 2 — it crashes on `null` values.** `typeof null === "object"` is a famous JS quirk — so `null` passes the `typeof val === "object"` check, and `val.constructor` then throws, since `null` has no properties at all:

```javascript
const objWithNull = { a: null, b: { target: 5 } };
getValFromKeyInObj(objWithNull, 'target'); // TypeError: Cannot read properties of null (reading 'constructor')
```

**The fix** — only return from the loop when the recursive call actually finds something, and guard against `null`:

```javascript
const getValFromKeyInObjFixed = (obj, givenKey) => {
  if (obj && typeof obj === 'object' && givenKey in obj) {
    return obj[givenKey];
  }
  for (const key in obj) {
    const val = obj[key];
    if (val && typeof val === "object" && val.constructor === Object) {
      const found = getValFromKeyInObjFixed(val, givenKey);
      if (found !== undefined) return found; // only stop searching once something is actually found
    }
  }
  return undefined;
};

console.log(getValFromKeyInObjFixed(obj, 'target'));        // 99 — correctly checks `second` too
console.log(getValFromKeyInObjFixed(objWithNull, 'target')); // 5 — no crash on the null value
```

</details>

## Question 3 — Access a Nested Value Using a Dot-Separated Path String

**Challenge:** given a key path like `"field4.child2.child3"`, return the value at that nested location — similar to Lodash's `_.get(obj, path)`.

```javascript
console.log(getValueFromObj(target, "field1"));
console.log(getValueFromObj(target, "field4.child4"));
console.log(getValueFromObj(target, "field4.child2"));
console.log(getValueFromObj(target, "field4.child2.child3"));

Output expected

1
child4
{ child3: 'child2' }
child2
```

<details><summary>Show Answer</summary>

```
function getValueFromObj(obj, keys) {
  const splitKeyArr = keys.split(".");
  let requiredVal = obj;
  splitKeyArr.forEach((key) => {
    requiredVal = requiredVal[key];
  });
  return requiredVal;
}
```

**Explanation:** split the path on `.` into individual key segments, then walk them one at a time, drilling one level deeper into `requiredVal` on each step — `field4.child2.child3` becomes `target["field4"]["child2"]["child3"]`, computed iteratively instead of via a literal chain.

**⚠️ Gotcha, verified in Node:** if any *intermediate* segment doesn't exist, this throws instead of returning `undefined`:

```javascript
getValueFromObj(target, "doesNotExist.deeper");
// TypeError: Cannot read properties of undefined (reading 'deeper')
```

The first missing segment (`doesNotExist`) correctly resolves to `undefined`, but the *next* iteration then tries `undefined["deeper"]`, which crashes. Real `_.get()` handles this by bailing out early. **The fix** — short-circuit once `requiredVal` becomes `undefined`, or use optional chaining via `reduce`:

```javascript
function getValueFromObjSafe(obj, keys) {
  return keys.split(".").reduce((acc, key) => acc?.[key], obj);
}

console.log(getValueFromObjSafe(target, "doesNotExist.deeper")); // undefined, no crash
console.log(getValueFromObjSafe(target, "field4.child2.child3")); // child2 — still works correctly
```

`?.` short-circuits the whole rest of the chain the moment `acc` is `null`/`undefined`, so it never attempts to index into a missing intermediate value.

</details>

## Question 4 — Recursively Strip Falsy Values From a Nested Object

**Challenge:** given an object with arbitrary nesting (including arrays), return a new object with every falsy value (`undefined`, `""`, `null`, `0`, `false`, `NaN`) removed at every level.

```javascript
const queryParamsObj = {
  one: "1",
  two: "2",
  three: undefined,
  nested: {
    nest1: {
      nest11: {
        five: "5",
        six: "6",
        seven: "",
      },
    },
    nest2: {
      nes3: 44,
      nes: undefined,
    },
    nest33: [1, 2, 4, null, { random: 1, random2: undefined }],
  },
};

Expected output: s
{
  "one": "1",
  "two": "2",
  "nested": {
    "nest1": {
      "nest11": { "five": "5", "six": "6" }
    },
    "nest2": { "nes3": 44 },
    "nest33": [1, 2, 4, { "random": 1 }]
  }
}

```

<details><summary>Show Answer</summary>

```
const removeFalsyValues = (givenObj) => {
  if (typeof givenObj !== "object") {
    return givenObj ? true : false;
  }
  let opObj = {};
  for (const key in givenObj) {
    const value = givenObj[key];
    if (typeof value !== "object") {
      opObj = { ...opObj, ...(value && { [key]: value }) };
    } else {
      if (!Array.isArray(value)) {
        opObj = { ...opObj, [key]: removeFalsyValues(value) };
      } else {
        opObj = {
          ...opObj,
          [key]: value
            .map((ele) => (removeFalsyValues(ele) ? ele : undefined))
            .filter(Boolean),
        };
      }
    }
  }
  return opObj;
};

console.log(JSON.stringify(removeFalsyValues(queryParamsObj), null, 2));
```

**Explanation:** for each key, if the value is a primitive, only keep it (spread into `opObj`) if it's truthy. If the value is an object, recurse into it (handling plain objects and arrays slightly differently — arrays get `.map` + `.filter(Boolean)` to drop falsy *elements*, while still recursing into each element first in case it's itself an object). `three: undefined`, `seven: ""`, `nes: undefined`, `random2: undefined`, and the raw `null` inside `nest33` all correctly disappear from the output.

**⚠️ Bug, verified in Node:** a top-level `null` value doesn't get removed — it gets silently converted into `{}` instead:

```javascript
console.log(JSON.stringify(removeFalsyValues({ a: 1, b: null, c: 'x' })));
// {"a":1,"b":{},"c":"x"}  <-- "b" should have been removed entirely, like every other falsy value
```

**Why:** `typeof null === "object"` (the same quirk from Question 2) means `null` takes the "recurse into it" branch instead of the "check truthiness" branch. Recursing into `null` with `for (const key in null)` is a harmless no-op loop, so `removeFalsyValues(null)` just returns an empty `{}` — which is *truthy*, so it survives in the output instead of being dropped like every other falsy value would be.

**The fix** — explicitly treat `null` as a primitive/falsy case up front, in both the top-level check and the branch that decides whether to recurse:

```javascript
const removeFalsyValuesFixed = (givenObj) => {
  if (typeof givenObj !== "object" || givenObj === null) {
    return givenObj ? true : false;
  }
  let opObj = {};
  for (const key in givenObj) {
    const value = givenObj[key];
    if (typeof value !== "object" || value === null) {
      opObj = { ...opObj, ...(value && { [key]: value }) };
    } else if (!Array.isArray(value)) {
      opObj = { ...opObj, [key]: removeFalsyValuesFixed(value) };
    } else {
      opObj = {
        ...opObj,
        [key]: value
          .map((ele) => (removeFalsyValuesFixed(ele) ? ele : undefined))
          .filter(Boolean),
      };
    }
  }
  return opObj;
};

console.log(JSON.stringify(removeFalsyValuesFixed({ a: 1, b: null, c: 'x' })));
// {"a":1,"c":"x"}  -- "b" is now correctly gone
```

Re-running the fixed version against the original `queryParamsObj` produces the exact same output as before, *plus* the top-level-`null` case now works correctly — confirming the fix doesn't regress anything.

</details>

## Type-Checking Helpers

## Question 5 — `isPrimitive`, `isObject`, `isArray`

**Challenge:** write three small type-checking helpers — is a value a primitive, a plain object, or an array?

```javascript
const isPrimitive = (value) => {
    return typeof value !== 'object' && typeof value !== 'function'
}

const isObject = (obj) => {
    return typeof obj === 'object' && obj.constructor === Object
}

const isArray = (arr) => {
    return typeof arr === 'object' && arr.constructor === Array && Array.isArray(arr)
}

console.log(isPrimitive(5));
console.log(isObject({}));
console.log(isArray([]));

Expected output:
true
true
true
```

<details><summary>Show Answer</summary>

**Explanation:** `isPrimitive` excludes anything `typeof` reports as `'object'` or `'function'` — covering strings, numbers, booleans, `undefined`, symbols, and bigints. `isObject`/`isArray` both check `typeof === 'object'` *and* the value's `.constructor`, to distinguish a plain object from an array (since `typeof [] === 'object'` too — `isArray` additionally double-checks with `Array.isArray` for good measure, though `.constructor === Array` alone is already a strong signal in practice).

**⚠️ Bug, verified in Node — `null` breaks all three, in different ways:**

```javascript
console.log(isPrimitive(null)); // false — but null is normally considered a primitive value in JS!
console.log(isObject(null));    // TypeError: Cannot read properties of null (reading 'constructor')
console.log(isArray(null));     // TypeError: Cannot read properties of null (reading 'constructor')
```

`typeof null === "object"` is the culprit for all three — the exact same root cause behind every other bug on this page:
- `isPrimitive(null)` returns `false`, which contradicts how `null` is normally described (it *is* one of JS's primitive types — string, number, boolean, `undefined`, `null`, symbol, bigint — even though `typeof` famously misreports it).
- `isObject(null)` and `isArray(null)` both crash outright, since they immediately access `.constructor` on whatever `typeof` said was an "object," without checking it isn't actually `null` first.

**The fix** — treat `null` as its own explicit case in each:

```javascript
const isPrimitiveFixed = (value) => {
    return value === null || (typeof value !== 'object' && typeof value !== 'function');
};
const isObjectFixed = (obj) => {
    return obj !== null && typeof obj === 'object' && obj.constructor === Object;
};
const isArrayFixed = (arr) => {
    return arr !== null && Array.isArray(arr);
};

console.log(isPrimitiveFixed(null)); // true
console.log(isObjectFixed(null));    // false, no crash
console.log(isArrayFixed(null));     // false, no crash
```

(`isArrayFixed` also drops the redundant `.constructor === Array` check — `Array.isArray()` alone is the correct, spec-recommended way to check for arrays, and it already implies `arr !== null` won't crash since it doesn't touch `.constructor` at all.)

</details>

## Question 6 — Custom Truthiness Helpers

**Challenge:** two small helpers that redefine "truthy" slightly differently from JS's default rules — one that also treats the *strings* `"0"`, `"null"`, `"undefined"` as falsy, and one that treats `0` specifically as truthy (unlike normal JS).

```javascript
const checkTruthyValueTotally = (value) => {
  return value && !["0", "null", "undefined"].includes(value);
};
const treatFalsyAsTruthy = (value) => {
  return value || value === 0;
};

console.log(checkTruthyValueTotally(23));
console.log(checkTruthyValueTotally("0"));
console.log(treatFalsyAsTruthy(NaN));
console.log(treatFalsyAsTruthy(0));

Expected output:
true
false
false
true
```

<details><summary>Show Answer</summary>

**Explanation:** `checkTruthyValueTotally` starts with JS's normal truthy check (`value &&`), then additionally excludes the specific *strings* `"0"`, `"null"`, `"undefined"` — useful for sanitizing values that came from somewhere stringly-typed (URL query params, `localStorage`, form inputs) where `"0"` would otherwise be truthy as a non-empty string. `treatFalsyAsTruthy` does the opposite kind of adjustment — it special-cases `0` to count as truthy, useful when `0` is a legitimate value you don't want treated as "no value" (e.g. a valid array index, a real numeric score).

**Minor inconsistency worth knowing about:** `checkTruthyValueTotally(0)` doesn't return a clean boolean — it short-circuits at `value &&` and returns `0` itself (falsy, but not literally `false`):

```javascript
console.log(checkTruthyValueTotally(0)); // 0, not false
console.log(checkTruthyValueTotally(0) == false); // true — still works in an `if`, but isn't a strict boolean
```

This is harmless in an `if (checkTruthyValueTotally(x))` check (since `0` is still falsy), but would fail a strict `=== false` comparison or `typeof result === 'boolean'` check. Wrapping the whole expression in `Boolean(...)` or `!!(...)` would make it a "real" boolean if that matters for your use case.

</details>

## Array & Object Comparison

## Question 7 — Comparing Two Arrays as Multisets (Frequency Counting)

**Challenge:** check whether two arrays contain the exact same elements with the exact same frequency, regardless of order — using a `Map` for O(n) instead of a nested-loop O(n²) comparison.

```javascript
const optimizedCompareArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false
    }
    const myMap = new Map()
    arr1.forEach((ele) => {
        myMap.set(ele, (myMap.get(ele) ?? 0) + 1)
    })
    arr2.forEach(ele => {
        const currEleFreq = myMap.get(ele)
        if (currEleFreq === undefined) {
            return false;
        }
        myMap.set(ele, currEleFreq - 1);
    })
    for (const freq of myMap.values()) {
        if (freq !== 0) return false
    }
    return true
}

console.log(optimizedCompareArrays([5, 1, 24], [24, 5, 1])); // true
console.log(optimizedCompareArrays([13, 19, 69, 45], [13, 19, 69])); // false
```

<details><summary>Show Answer</summary>

**Explanation:** build a frequency map from `arr1` (element → count), then walk `arr2` decrementing each element's count as it's seen. If `arr2` has an element `arr1` never had, `myMap.get(ele)` is `undefined`. If the arrays truly contain the same multiset of elements, every count nets back to exactly `0` by the end. This runs in O(n) instead of the O(n²) a naive "for each element in arr1, find and remove a match in arr2" approach would take.

**⚠️ The `return false` inside the second `forEach` doesn't do what it looks like it does — verified in Node:**

```javascript
[1, 2, 3].forEach((x) => {
    if (x === 2) {
        return false; // looks like "stop everything and return false" — it isn't
    }
    console.log('processed', x);
});
console.log('this still runs afterward, regardless');
```

```
processed 1
processed 3
this still runs afterward, regardless
```

`return` inside a `forEach` callback only exits *that one iteration's callback* — it has no way to stop `forEach` itself, and it definitely doesn't make the outer `optimizedCompareArrays` function return anything. The `return false;` on the "element not found" branch is effectively **dead code** — the loop keeps going regardless, silently calling `myMap.set(ele, undefined - 1)` (`NaN`) for that element instead of bailing out early.

**Why the function still gives correct answers despite this bug:** the trailing `for (const freq of myMap.values())` loop catches the problem anyway — any element from `arr2` that wasn't in `arr1` corrupts that key's count into `NaN` (or leaves some other key's count non-zero), and `NaN !== 0` is `true`, so the final loop still correctly returns `false`. The dead `return false` is misleading to read, but the algorithm happens to be correct by a different path — a good reminder to verify *why* something works, not just *that* it produces the right answer on your test cases.

**A cleaner fix** — use `some()` instead of `forEach()`, since `some()` actually *does* support early-exit via its own return value:

```javascript
const cleanerCompareArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    const myMap = new Map();
    arr1.forEach((ele) => myMap.set(ele, (myMap.get(ele) ?? 0) + 1));

    const hasMismatch = arr2.some((ele) => {
        const freq = myMap.get(ele);
        if (freq === undefined) return true; // stops `some` immediately
        myMap.set(ele, freq - 1);
        return false;
    });
    if (hasMismatch) return false;

    for (const freq of myMap.values()) {
        if (freq !== 0) return false;
    }
    return true;
};
```

`some()` stops iterating the moment its callback returns `true` — genuinely short-circuiting, unlike `forEach`, which always runs every element regardless of what the callback returns.

</details>

## Question 8 — `deepCompare`: Structural Equality for Arbitrary Values

**Challenge:** write a `deepCompare(a, b)` that recursively checks structural equality — two objects/arrays are "equal" if they have the same shape and equal values at every level, regardless of reference identity.

```javascript
function deepCompare(value1, value2) {
  if (value1 === value2) return true;

  if ([null, undefined].includes(value1) || [null, undefined].includes(value2)) {
    return value1 === value2;
  }

  if (typeof value1 !== typeof value2) return false;

  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return false;
    for (let i = 0; i < value1.length; i++) {
      if (!deepCompare(value1[i], value2[i])) return false;
    }
    return true;
  }

  if (typeof value1 === 'object' && typeof value2 === 'object') {
    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);
    if (keys1.length !== keys2.length) return false;
    for (let key of keys1) {
      if (!deepCompare(value1[key], value2[key])) return false;
    }
    return true;
  }

  return false;
}

console.log(deepCompare({a: 1, b: {c: 2}}, {a: 1, b: {c: 2}}));
console.log(deepCompare([1, [2, 3]], [1, [2, 3]]));
console.log(deepCompare({a: 1, b: {c: 2}}, {a: 1, b: {c: 3}}));

Expected output:
true
true
false
```

<details><summary>Show Answer</summary>

**Explanation:** `value1 === value2` handles identical primitives and identical references immediately. The `null`/`undefined` check comes next specifically so the later `typeof value1 === 'object'` branch never has to deal with `null` (recall `typeof null === 'object'`) — this function actually gets that guard *right*, unlike several others on this page. Arrays are compared element-by-element (with a length check first), and objects are compared by recursively comparing every key's value (with a key-*count* check first, which implicitly also requires the same key *names*, since two same-length key sets with any different key name would fail the recursive per-key comparison).

**Two genuine edge cases worth knowing, both verified in Node:**

```javascript
console.log(deepCompare(NaN, NaN)); // false
```

`value1 === value2` is `false` for `NaN` (the classic `NaN !== NaN` quirk), and nothing downstream special-cases it the way `Object.is()` does — so structurally-identical `NaN` values are reported as *not* equal. If `NaN`-aware equality matters for your use case, swap the first line for `Object.is(value1, value2) ? true : ...` and keep the rest of the recursion the same.

```javascript
console.log(deepCompare({a: undefined}, {})); // false
```

`Object.keys({a: undefined})` still includes `'a'` (a key that exists with value `undefined` is different from a key that's simply absent) — so these two objects have different key counts (`1` vs `0`) and are correctly reported as unequal. This is arguably the *right* behavior (an explicit `undefined` value is a different thing from a missing key), but it's worth knowing which convention a `deepCompare` implementation is choosing, since some libraries (like Lodash's `_.isEqual`) treat these as equal instead.

</details>

## Recursion Over Nested Data — Flatten, Clone, Freeze

## Question 9 — `deepFlatArr`, `deepClone`, `deepFreeze`

**Challenge:** three small recursive utilities over nested arrays/objects — flatten an arbitrarily-nested array, deep-clone a nested object, and deep-freeze a nested object.

```javascript
const givenArr = [2, 4, [8, 9], [0, -1, [1, 2, [4, 5]]]];
const deepFlatArr = (arr) => {
  let op = [];
  for (let val of arr) {
    if (typeof val !== "object") {
      op.push(val);
    }
    if (typeof val === "object" && Array.isArray(val)) {
      op = op.concat(deepFlatArr(val));
    }
  }
  return op;
};
console.log(deepFlatArr(givenArr));

const originalObj = { a: 1, b: { c: 2, d: [3, 4] } };
const deepClone = (ipObj) => {
  if (typeof ipObj !== "object") return ipObj;
  if (typeof ipObj === "object" && Array.isArray(ipObj))
    return ipObj.map((e) => deepClone(e));
  const op = {};
  for (let key in ipObj) {
    op[key] = deepClone(ipObj[key]);
  }
  return op;
};
const cloned = deepClone(originalObj);
cloned.b.c = 999;
console.log(originalObj.b.c, cloned.b.c);

const deepFreeze = (obj) => {
  Object.freeze(obj);
  for (let key in obj) {
    if (typeof obj[key] === "object") deepFreeze(obj[key]);
  }
  return obj;
};
const objToFreeze = { a: 1, b: { c: 2 } };
deepFreeze(objToFreeze);
objToFreeze.b.c = 3; // silently fails
console.log(objToFreeze.b.c);

Expected output:
[ 2, 4, 8, 9, 0, -1, 1, 2, 4, 5 ]
2 999
2
```

<details><summary>Show Answer</summary>

**Explanation:**
- `deepFlatArr` walks each element: primitives get pushed directly, arrays get recursively flattened and concatenated in.
- `deepClone` returns primitives as-is, maps over arrays recursively, and rebuilds plain objects key-by-key, recursing into each value — `cloned.b.c = 999` doesn't touch `originalObj.b.c`, confirming it's a genuine deep (not shallow) copy.
- `deepFreeze` freezes the top-level object first, then recurses into every property that's itself an object and freezes that too — the assignment `objToFreeze.b.c = 3` silently fails (no error in non-strict mode) and `b.c` stays `2`.

**⚠️ Bugs, all verified in Node — and all the same root cause as everywhere else on this page:**

**`deepFlatArr` silently drops non-array objects and `null`:**

```javascript
console.log(deepFlatArr([1, {a: 1}, 2])); // [ 1, 2 ]  <-- {a:1} vanished entirely!
console.log(deepFlatArr([1, null, 2]));   // [ 1, 2 ]  <-- null vanished entirely!
```

The two `if` checks are structured as two *separate* `if`s, not `if`/`else if` — a value that's `typeof "object"` but *not* an array (a plain object, or `null`) fails **both** conditions (`typeof val !== "object"` is `false`, and `Array.isArray(val)` is `false`), so it's neither pushed nor flattened — just silently lost. If a `deepFlatArr` is only ever meant to be called on arrays of primitives and arrays (no plain objects), this may be intentional — but it's a sharp edge worth calling out explicitly if the interviewer's test cases include either case.

**`deepClone(null)` returns `{}` instead of `null`:**

```javascript
console.log(deepClone(null)); // {}
```

Same story: `typeof null !== "object"` is `false` (so it doesn't hit the primitive early-return), `Array.isArray(null)` is `false` (so it doesn't hit the array branch either), so it falls through to the object-rebuilding branch — `for (let key in null)` is a harmless no-op loop, producing an empty `{}` instead of preserving `null`.

**The shared fix for all three** — explicitly check `=== null` before checking `typeof === "object"`, every time:

```javascript
const deepFlatArrFixed = (arr) => {
  let op = [];
  for (let val of arr) {
    if (Array.isArray(val)) {
      op = op.concat(deepFlatArrFixed(val));
    } else {
      op.push(val); // primitives, null, and non-array objects all just get pushed through
    }
  }
  return op;
};

const deepCloneFixed = (ipObj) => {
  if (ipObj === null || typeof ipObj !== "object") return ipObj;
  if (Array.isArray(ipObj)) return ipObj.map((e) => deepCloneFixed(e));
  const op = {};
  for (let key in ipObj) op[key] = deepCloneFixed(ipObj[key]);
  return op;
};

console.log(deepFlatArrFixed([1, {a: 1}, 2])); // [ 1, { a: 1 }, 2 ]
console.log(deepCloneFixed(null));             // null
```

(`deepFreeze` itself doesn't actually break on `null` — `Object.freeze(null)` and `for...in null` are both safe no-ops in JS — so no fix is needed there, unlike the other two.)

</details>
