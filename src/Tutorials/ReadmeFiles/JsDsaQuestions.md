# JS DSA Questions — Recursion Over Objects & Arrays

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
const getAllPaths = (data, prefix = "") => {
    let ans = []
    data.forEach(item => {
        if('child' in item && Array.isArray(item.child) && item.child.length > 0) {
            ans = [...ans, ...getItems(item.child, prefix + item.link + "/")]
        } else {
           ans.push(prefix + item.link) 
        }
    })
    return ans;
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

console.log(getValFromKeyInObj(target, "field5")); // [2, 4]
console.log(getValFromKeyInObj(target, "child")); // child
console.log(getValFromKeyInObj(target, "child3")); // child2
```

<details><summary>Show Answer</summary>

**Explanation:** if `givenKey` exists directly on `obj`, return it immediately. Otherwise, loop through every key, and for each value that's a plain object (`typeof val === "object" && val.constructor === Object` — this specifically excludes arrays, since an array's constructor is `Array`, not `Object`), recurse into it looking for the key.


```javascript
const obj = {
  first: { a: 1 },        
  second: { target: 99 } 
};
const objWithNull = { a: null, b: { target: 5 } };

const getValFromKeyInObjFixed = (obj, givenKey) => {
  if (obj && typeof obj === 'object' && givenKey in obj) {
    return obj[givenKey];
  }
  for (const key in obj) {
    const val = obj[key];
    if (val && typeof val === "object" && val.constructor === Object) {
      const found = getValFromKeyInObjFixed(val, givenKey);
      if (found !== undefined) return found;
    }
  }
  return undefined;
};

console.log(getValFromKeyInObj(target, "field5"));
console.log(getValFromKeyInObj(target, "child"));
console.log(getValFromKeyInObj(target, "child3"));
console.log(getValFromKeyInObjFixed(obj, 'target'));
console.log(getValFromKeyInObjFixed(objWithNull, 'target'));
```
</details>

## Question 3 — Access a Nested Value Using a Dot-Separated Path String

**Challenge:** given a key path like `"field4.child2.child3"`, return the value at that nested location — similar to Lodash's `_.get(obj, path)`.

```javascript
console.log(getValueFromObj(target, "field1")); // 1
console.log(getValueFromObj(target, "field4.child4")); // child4
console.log(getValueFromObj(target, "field4.child2")); // { child3: 'child2' }
console.log(getValueFromObj(target, "field4.child2.child3")); // child2
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



**⚠️ Gotcha:** if any *intermediate* segment doesn't exist, this throws instead of returning `undefined`:

```javascript
getValueFromObj(target, "doesNotExist.deeper");
// TypeError: Cannot read properties of undefined (reading 'deeper')
```

The first missing segment (`doesNotExist`) correctly resolves to `undefined`, but the *next* iteration then tries `undefined["deeper"]`, which crashes. **The fix** — short-circuit once `requiredVal` becomes `undefined`, or use optional chaining via `reduce`:

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

```javascript
console.log(JSON.stringify(removeFalsyValues({ a: 1, b: null, c: 'x' })));
// {"a":1,"b":{},"c":"x"}  <-- "b" should have been removed entirely, like every other falsy value
```

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

```javascript
const isPrimitive = (value) => {
    return value === null || (typeof value !== 'object' && typeof value !== 'function');
};
const isObject = (obj) => {
    return obj !== null && typeof obj === 'object' && obj.constructor === Object;
};
const isArray = (arr) => {
    return arr !== null && Array.isArray(arr);
};

console.log(isPrimitiveFixed(null)); // true
console.log(isObjectFixed(null));    // false, no crash
console.log(isArrayFixed(null));     // false, no crash
```

</details>

## Question 6 — Custom Truthiness Helpers

**Challenge:** two small helpers that redefine "truthy" slightly differently from JS's default rules — one that also treats the *strings* `"0"`, `"null"`, `"undefined"` as falsy, and one that treats `0` specifically as truthy (unlike normal JS).

```javascript
console.log(isCompleteTruthy(23)); // true
console.log(isCompleteTruthy("0")); // false
console.log(treat0AsTruthy(NaN)); // false
console.log(treat0AsTruthy(0)); // true
```

<details><summary>Show Answer</summary>

```javascript
const isCompleteTruthy = (value) => {
  return Boolean(value && !["0", "null", "undefined"].includes(value));
};
const treat0AsTruthy = (value) => {
  return Boolean(value || value === 0);
};

```
</details>


## Question 7: Deep Equal

Implement a `deepEqual()` function that recursively compares two values and returns whether they are deeply equal.

### Test Cases

#### Primitive values

```javascript
deepEqual(1, 1);            // true
deepEqual(1, "1");          // false
deepEqual(NaN, NaN);        // true
deepEqual(-0, +0);          // false
deepEqual(+0, +0);          // true
deepEqual(null, null);      // true
deepEqual(null, undefined); // false
```

#### Flat objects

```javascript
deepEqual({ x: 1, y: 2 }, { y: 2, x: 1 }); // true
```

#### Nested objects & arrays

```javascript
deepEqual({ a: { x: 1 } }, { a: { x: 1 } }); // true
deepEqual([1, [2, 3]], [1, [2, 3]]);         // true
deepEqual({ a: 1 }, { a: 1, b: 2 });         // false
```

#### `NaN` inside objects

```javascript
deepEqual({ v: NaN }, { v: NaN }); // true
```

#### Array vs Object

```javascript
deepEqual([1, 2], { 0: 1, 1: 2 }); // false
```

#### Dates

```javascript
deepEqual(new Date(0), new Date(0)); // true
```

#### Regular Expressions

```javascript
deepEqual(/abc/g, /abc/g); // true
deepEqual(/abc/g, /abc/i); // false
```

---

### This implementation intentionally does **not** handle

- Circular references
- `Map`
- `Set`
- `WeakMap` / `WeakSet`
- `ArrayBuffer` / TypedArrays
- Symbol-keyed properties
- Non-enumerable properties
- Property descriptors (`writable`, `configurable`, getters/setters)
- Function equality (functions are compared only by reference)

<details>
<summary><strong>Show Answer</strong></summary>

```javascript
function deepEqual(a, b) {
  // Handles primitives, NaN, -0/+0, and identical object references.
  if (Object.is(a, b)) {
    return true;
  }

  // If either value is primitive (or null), they cannot be equal here
  // because Object.is() already handled all equal primitive cases.
  if (
    a === null ||
    b === null ||
    typeof a !== "object" ||
    typeof b !== "object"
  ) {
    return false;
  }

  // Different object types (Array vs Object, Date vs Object, etc.)
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
    return false;
  }

  // Compare built-in objects by value.
  if (a instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp) {
    return a.toString() === b.toString();
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!Object.hasOwn(b, key)) {
      return false;
    }

    if (!deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}
```

</details>


## Question 8 — `deepFlatArr`, `deepClone`, `deepFreeze`

**Challenge:** three small recursive utilities over nested arrays/objects — flatten an arbitrarily-nested array, deep-clone a nested object, and deep-freeze a nested object.

<details><summary>Show Answer</summary>

```javascript
const deepFlatArr = (arr) => {
  let op = [];
  for (let val of arr) {
    if (Array.isArray(val)) {
      op = op.concat(deepFlatArr(val));
    } else {
      op.push(val);
    }
  }
  return op;
};

const deepClone = (ipObj) => {
  if (ipObj === null || typeof ipObj !== "object") return ipObj;
  if (Array.isArray(ipObj)) return ipObj.map((e) => deepClone(e));
  const op = {};
  for (let key in ipObj) op[key] = deepClone(ipObj[key]);
  return op;
};

console.log(deepClone([1, {a: 1}, 2]));   // [ 1, { a: 1 }, 2 ]
console.log(deepClone(null));             // null
```

</details>
