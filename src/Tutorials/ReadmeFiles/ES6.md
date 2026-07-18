# ES6 Features

## Optional Chaining (`?.`)

By using optional chaining, if the object accessed or function called using this operator is `null`/`undefined`, the expression **short-circuits and evaluates to `undefined`** instead of throwing an error.

**Setup used by the questions below:**

```javascript
const knowMeObj = {
   name: 'Amane Ubuyashiki',
   nickName: 'Ubuyashiki',
   address: {
       city: 'Vadodara',
       state: 'Gujarat',
   },
   address2: {
       pincode: 'bhool_gye'
   },
   secret: {
       traits: ['Addictive', 'Kanjoos', 'Nak chadhi', 'childish'],
       fav18PlusMovie: ['365 days', 'after', '50 shades of grey'],
       getHusband: function(bf) {
           return `${bf} is my ...`
       }
   },
   getHobby: () => console.log("K-drama dekh ke baaki ladko ko barbaad karna"),
   knowTarget: () => console.log('Gift a house to Dad and be self dependent')
}
```

Suppose you want to read `pincode` from inside `address2` — but you're not sure whether `address2` itself exists on the object. Similarly, you want to call `getHusband`, a function that may or may not be present inside `secret`. Before optional chaining, this required manually checking every step along the way with `&&`:

### Question 1 — Without Optional Chaining

```javascript
const pincode = knowMeObj.address2 && knowMeObj.address2.pincode
const knowMyHusband = knowMeObj.secret && knowMeObj.secret.getHusband && typeof knowMeObj.secret.getHusband === 'function' && knowMeObj.secret.getHusband('Prateek')
const fav18PlusMovie = knowMeObj.secret && knowMeObj.secret.fav18PlusMovie && Array.isArray(knowMeObj.secret.fav18PlusMovie) && knowMeObj.secret.fav18PlusMovie[0]

console.log(pincode);
console.log(knowMyHusband);
console.log(fav18PlusMovie);
```

<details>
<summary>Show Answer</summary>

```
bhool_gye
Prateek is my ...
365 days
```

**Explanation:** Each `&&` link guards the next property access — if any step along the way is falsy, the chain stops right there and evaluates to that falsy value instead of throwing. It works, but it's verbose, and gets worse the deeper the path goes.

</details>

### Question 2 — With Optional Chaining

```javascript
const pincode = knowMeObj?.address2?.pincode
const knowMyHusband = knowMeObj?.secret?.getHusband?.('Prateek')
const fav18PlusMovie = knowMeObj?.secret?.fav18PlusMovie?.[0]

console.log(pincode);
console.log(knowMyHusband);
console.log(fav18PlusMovie);
```

<details>
<summary>Show Answer</summary>

```
bhool_gye
Prateek is my ...
365 days
```

**Explanation:** Identical results to Question 1, in a fraction of the code. `?.` works for property access (`?.address2`), and there's a special form for calling a possibly-missing function (`?.getHusband?.(...)`) and for possibly-missing array/computed access (`?.[0]`).

</details>

### Question 3 — When the Property Genuinely Doesn't Exist

```javascript
const minimalObj = {
    name: 'Amane Ubuyashiki',
    nickName: 'Ubuyashiki',
    address: { city: 'Vadodara', state: 'Gujarat' },
};

console.log(minimalObj?.address2?.pincode);
console.log(minimalObj?.secret?.getHusband?.());
```

<details>
<summary>Show Answer</summary>

```
undefined
undefined
```

**Explanation:** This is the actual point of `?.` — `minimalObj` has neither `address2` nor `secret` at all. Without optional chaining, `minimalObj.address2.pincode` would throw `TypeError: Cannot read properties of undefined (reading 'pincode')`. With it, the whole expression just quietly resolves to `undefined`.

</details>

### Question 4 — Short-Circuiting the *Rest* of a Chain

```javascript
const chainRoot = null;
console.log(chainRoot?.b.c.d);
```

<details>
<summary>Show Answer</summary>

```
undefined
```

**Explanation:** ⚠️ This is a genuinely non-obvious rule: the `?.` only appears once, right after `chainRoot`, but the short-circuit applies to the **entire rest of the chain**, not just that one step. If `chainRoot` is `null`/`undefined`, the whole expression `chainRoot?.b.c.d` short-circuits to `undefined` immediately — `.c` and `.d` are never even evaluated, so they can't throw either, even though neither of *them* has a `?.` in front of it.

</details>

> `??` (nullish coalescing) pairs naturally with `?.` — see [NullishOperator.md](NullishOperator.md) for the full breakdown of `??` vs `||`.

## Spread (`...`)

This syntax allows iterable items (arrays, strings) — or, with a caveat, objects — to be **expanded** in place.

```javascript
// Function arguments list
myFunction(a, ...iterableObj, b)

// Array
[1, ...iterableObj, '4', 'five', 6]

// Object
{ ...obj, key: 'value' }
```

Mainly used to make a **shallow copy** of an array or object, typically so you can add or modify something without mutating the original.

### Question 5

```javascript
const num1 = [1, 2, 3];
console.log(...num1);

const personality = ['Beautiful', 'Addictive', 'hot-headed'];
console.log(...personality);
```

<details>
<summary>Show Answer</summary>

```
1 2 3
Beautiful Addictive hot-headed
```

**Explanation:** Spreading an array into `console.log`'s arguments passes each element as a **separate argument**, not as one array argument.

</details>

### Question 6

```javascript
const str = 'Amane';
console.log(...str);
console.log([...str]);
```

<details>
<summary>Show Answer</summary>

```
A m a n e
[ 'A', 'm', 'a', 'n', 'e' ]
```

**Explanation:** Strings are iterable character-by-character, so spreading one behaves just like spreading an array of its characters.

</details>

### Question 7

```javascript
const obj1 = { fruit: 'mango', vegetable: 'tomato' };
console.log(...obj1);
```

<details>
<summary>Show Answer</summary>

```
TypeError: Spread syntax requires ...iterable[Symbol.iterator] to be a function
```

**Explanation:** Plain objects don't implement the iterator protocol (see [Iterators.md](Iterators.md)) — they're not array-like or string-like — so spreading one **as function arguments** throws. This is different from spreading an object **inside an object literal** (`{ ...obj1 }`), which is valid and works completely differently (Question 9) — object spread there isn't "iteration" at all, it's a copy of own enumerable properties.

</details>

### Question 8 — Adding to an Existing Array

```javascript
let num1 = [1, 2, 3];
num1 = [...num1, 4, 5];
console.log(num1);

const posTraits = ['Patience', 'persistent', 'Innocent', 'Childish'];
const negTraits = ['Kanjoos', 'hot-headed', 'pessimistic'];
const allTraits = [...posTraits, ...negTraits];
console.log(allTraits);
```

<details>
<summary>Show Answer</summary>

```
[ 1, 2, 3, 4, 5 ]
[ 'Patience', 'persistent', 'Innocent', 'Childish', 'Kanjoos', 'hot-headed', 'pessimistic' ]
```

**Explanation:** `[...num1, 4, 5]` builds a **new** array containing everything from `num1` plus the two new elements — the original `num1` array (before reassignment) is never mutated. Spreading two arrays back-to-back inside one array literal, as with `allTraits`, is the standard way to concatenate them.

</details>

### Question 9 — Adding/Merging Object Properties

```javascript
const stock1 = { mango: '12 kg', grapes: '10 kg' };
const stock1WithApple = { ...stock1, apple: '10 kg' };
console.log(stock1WithApple);

const stock2 = { watermelon: '10 kg', pineapple: '5 kg' };
const combinedStock = { ...stock1, ...stock2 };
console.log(combinedStock);

const updatedStock = { ...combinedStock, mango: '15 kg' };
console.log(updatedStock);
```

<details>
<summary>Show Answer</summary>

```
{ mango: '12 kg', grapes: '10 kg', apple: '10 kg' }
{ mango: '12 kg', grapes: '10 kg', watermelon: '10 kg', pineapple: '5 kg' }
{ mango: '15 kg', grapes: '10 kg', watermelon: '10 kg', pineapple: '5 kg' }
```

**Explanation:** `{ ...stock1, apple: '10 kg' }` copies every property from `stock1`, then adds `apple`. Merging two objects is just spreading both in sequence — later spreads win on key conflicts, same rule as `Object.assign` (see [Object.md](Object.md)). Overwriting an existing key (`mango: '15 kg'`) works the same way: spread the old object first, then the new value for that key wins because it comes later in the literal.

</details>

### Question 10 — A Practical Use: `Math.max`/`Math.min`

```javascript
const nums = [4, 8, 15, 16, 23, 42];
console.log(Math.max(...nums));
console.log(Math.min(...nums));
```

<details>
<summary>Show Answer</summary>

```
42
4
```

**Explanation:** `Math.max`/`Math.min` don't accept an array directly — they take individual arguments (`Math.max(4, 8, 15, ...)`). Spreading the array into the call is the standard, idiomatic way to find the max/min of an array without writing a manual loop or `.reduce()`.

</details>

> **Note:** you can spread an array directly into an object literal too — `{ ...[10, 20, 30] }` produces `{ '0': 10, '1': 20, '2': 30 }`, using the array's indices as keys. Rarely useful directly, but explains why array-spread-into-object doesn't throw the way Question 7's object-spread-into-arguments does.

## Rest Parameters (`...`)

Visually identical to spread, but does the **opposite job**: instead of *expanding* values out, rest *collects* multiple values *into* a single array. Can only be used as the **last** parameter in a function, or the last item while destructuring.

> **Spread vs. Rest — same `...` syntax, opposite direction:** spread takes one iterable and expands it into many values (as in the Spread section above); rest takes many individual values and collects them into one array. Which one you're looking at depends entirely on *where* the `...` appears — inside a function call/array/object literal, it's spread; as a function parameter or the tail of a destructuring pattern, it's rest.

### Question 11

```javascript
function myFun(a, b, ...manyMoreArgs) {
  console.log("a", a);
  console.log("b", b);
  console.log("manyMoreArgs", manyMoreArgs);
}

myFun("one", "two", "three", "four", "five", "six");
```

<details>
<summary>Show Answer</summary>

```
a one
b two
manyMoreArgs [ 'three', 'four', 'five', 'six' ]
```

**Explanation:** `a` and `b` each claim one argument; `...manyMoreArgs` scoops up **everything left over** into a real array. See [Functions.md](Functions.md) for the full `arguments` vs. rest-parameter comparison.

</details>

## Destructuring

A JavaScript expression that unpacks values from arrays, or properties from objects, into distinct variables.

### Question 12 — Array Destructuring

```javascript
const x = [1, 2, 3, 4, 5];
const [y, z] = x;
console.log(y, z);
```

<details>
<summary>Show Answer</summary>

```
1 2
```

**Explanation:** Array destructuring matches by **position** — `y` gets `x[0]`, `z` gets `x[1]`. Anything beyond that (`3, 4, 5`) is simply not captured unless you also use rest (Question 13).

</details>

### Question 13 — Array Destructuring with Rest

```javascript
const unfilledWishes = ['Gaali sunna', 'To see in person', 'Working together', 'Rest u know']
const [first, second, ...restWishes] = unfilledWishes;

console.log(first);
console.log(second);
console.log(restWishes)
```

<details>
<summary>Show Answer</summary>

```
Gaali sunna
To see in person
[ 'Working together', 'Rest u know' ]
```

</details>

### Question 14 — Swapping Two Variables

```javascript
let m = 1, n = 2;
[m, n] = [n, m];
console.log(m, n);
```

<details>
<summary>Show Answer</summary>

```
2 1
```

**Explanation:** `[n, m]` builds a temporary 2-element array (`[2, 1]`), then immediately destructures it back into `m` and `n` — swapping them without needing a manual temporary variable.

</details>

### Question 15 — Default Values: `undefined` vs. `null` vs. Missing

```javascript
const obj = { a: undefined, b: null, c: 5 };
const { a = 10, b = 20, c = 30, d = 40 } = obj;

console.log(a, b, c, d);
```

<details>
<summary>Show Answer</summary>

```
10 null 5 40
```

**Explanation:** Destructuring defaults follow the **exact same rule as function default parameters** (see [Functions.md](Functions.md), Question 5): a default only kicks in when the value is `undefined` — either because the key is missing entirely (`d`) or explicitly set to `undefined` (`a`). `b` is explicitly `null`, which is a real, deliberate value, so its default is **not** triggered — `b` stays `null`. `c` already has a value, so its default is irrelevant.

</details>

### Question 16 — Renaming While Destructuring, Nested

You can rename a destructured property with `originalKey: newName`, and this nests arbitrarily deep:

```javascript
const bioData = {
    name: 'Amane Ubuyashiki',
    age: 25
}

const { name: fullName, ...remainingKeys } = bioData;
console.log(fullName);
console.log(remainingKeys);
```

<details>
<summary>Show Answer</summary>

```
Amane Ubuyashiki
{
  age: 25,
}
```

**Explanation:** `name: fullName` pulls `bioData.name`'s value into a **new** variable called `fullName` — the original key name (`name`) never becomes a variable itself. `...remainingKeys` (rest, not spread — see the note above) then collects every property that wasn't already destructured out, `name` included as excluded, into a single object.

> ⚠️ If you destructure a key name that **doesn't exist** on the object at all — say, `const { fname, ...rest } = bioData` (there is no `fname`, only `name`) — you don't get an error. `fname` just quietly becomes `undefined`, and `rest` ends up containing *every* key, `name` included, since nothing named `fname` was actually there to exclude. This is an easy typo to miss, since it fails silently rather than throwing.

</details>

### Question 17 — Deeply Nested Destructuring with Rename, Rest, and Defaults Combined

```javascript
const error = {
    config: {
        headers: {
            Authorization: 'chal bhaag',
            token: 'mggsflifeoioi24',
            contentType: 'html'
        },
    }
}

const { config:
{ headers: { Authorization, ...exceptAuthorization } = {} } = {},
} = error ?? {};

console.log(Authorization);
console.log(exceptAuthorization);
```

<details>
<summary>Show Answer</summary>

```
chal bhaag
{ token: 'mggsflifeoioi24', contentType: 'html' }
```

</details>

### Question 18 — Destructuring Directly in Function Parameters

```javascript
function greet({ name, age = 18 }) {
  return `${name} is ${age}`;
}

console.log(greet({ name: 'Amane' }));
console.log(greet({ name: 'Rohit', age: 24 }));
```

<details>
<summary>Show Answer</summary>

```
Amane is 18
Rohit is 24
```

**Explanation:** Destructuring works directly in a parameter list, not just in a `const`/`let` statement — a very common pattern for functions/React components that take a single "options object" argument, letting you pull out just the fields you need (with defaults) without a separate destructuring line inside the function body.

</details>

## Computed Property Names in Destructuring

Every destructuring example so far has used a **literal, hardcoded** key name (`{ name }`, `{ headers }`, ...). But the key itself can also be an **expression**, evaluated at runtime — wrapped in `[...]`, exactly like computed property names in an object literal (`{ [dynamicKey]: value }`).

### Question 19

```javascript
const a = "key1"
const obj = {
    key1: 244
}
const {[a]: aMod} = obj
console.log(aMod)
```

<details>
<summary>Show Answer</summary>

```
244
```

**Explanation:** `[a]` isn't destructuring a property literally named `"a"` — it's destructuring whatever property name the **value of `a`** evaluates to, which is `"key1"`. So `{[a]: aMod} = obj` is equivalent to writing `{ key1: aMod } = obj` by hand, except the key name doesn't have to be known until runtime. Note `aMod` is required here — unlike normal destructuring, `{[a]}` alone isn't valid syntax, since JS needs an explicit variable name to assign the computed-key's value to (you can't declare a variable named by a runtime expression).

</details>

### Question 20 — Why This Is Useful: a Field Selected at Runtime

```javascript
function getFieldValue(fieldName, record) {
  const { [fieldName]: value } = record;
  return value;
}

const user = { id: 1, name: 'Amane', email: 'amane@example.com' };

console.log(getFieldValue('name', user));
console.log(getFieldValue('email', user));
```

<details>
<summary>Show Answer</summary>

```
Amane
amane@example.com
```

**Explanation:** This is the practical payoff — `fieldName` isn't known when the function is *written*, only when it's *called*. Computed-key destructuring lets you write `const { [fieldName]: value } = record` once and reuse it for any key, instead of the plain-bracket-access equivalent (`record[fieldName]`), which does the same job here but doesn't extend to combining with renaming/defaults the way destructuring does — see Question 21.

</details>

### Question 21 — Combined with a Default Value

```javascript
const responseKey = 'status';
const response = { status: 'ok', data: [1, 2, 3] };

const { [responseKey]: statusValue = 'unknown' } = response;
console.log(statusValue);

const { [responseKey]: statusValue2 = 'unknown' } = { data: [] };
console.log(statusValue2);
```

<details>
<summary>Show Answer</summary>

```
ok
unknown
```

**Explanation:** Computed keys combine with every other destructuring feature covered earlier in this file — renaming (the part after `:`) and defaults (`= 'unknown'`) both work exactly the same way as with a literal key name. When `{ data: [] }` has no `status` property at all, the default kicks in, following the same "only `undefined` triggers a default" rule as Question 15.

</details>

### Question 22 — The Mirror Image: Computed Keys in Object *Literals*

Computed keys aren't unique to destructuring — the same `[...]` syntax builds a dynamic key when *creating* an object too:

```javascript
const dynamicKey = 'score';
const built = { [dynamicKey]: 99 };
console.log(built);
```

<details>
<summary>Show Answer</summary>

```
{ score: 99 }
```

**Explanation:** Same underlying idea as Questions 19–21, just running in the opposite direction: instead of *reading* a property whose name comes from a variable, this *writes* one. Recognizing `[...]` in either an object literal or a destructuring pattern as "the key is computed, not literal" is the general skill being tested here.

</details>
