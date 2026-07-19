# Polyfills — Implementing Built-in Methods Yourself

A polyfill re-implements a native method's behavior in plain JavaScript. Writing them is a common interview exercise because it tests whether you actually understand what the built-in does under the hood, not just how to call it.

## `Function.prototype.call` / `apply` / `bind`

> These are covered conceptually (with all their `this`-binding gotchas) in [CallApplyBind.md](CallApplyBind.md). This section only holds the polyfill implementations.

### Question 1 — `myCall`

```javascript
Function.prototype.myCall = function (context, ...args) {
    context = context || globalThis;
    const fnSymbol = Symbol('fn');
    context[fnSymbol] = this;
    const result = context[fnSymbol](...args);
    delete context[fnSymbol];
    return result;
};

function greet(greeting) { return `${greeting}, ${this.name}`; }
console.log(greet.myCall({ name: 'Rohit' }, 'Hi'));
```

<details><summary>Show Answer</summary>

```
Hi, Rohit
```

**Explanation:** `call` needs to invoke the original function with `this` set to `context`. The trick is: temporarily attach the function (`this` inside `myCall`) onto `context` under a unique key, call it *as a method* of `context` (so `this` resolves to `context` naturally), then delete the temporary key so we don't leave `context` polluted. A `Symbol` guarantees no collision with existing properties, which is safer than the `Math.random()`-based unique-key approach (still correct, but needlessly complex).

</details>

### Question 2 — `myApply`

```javascript
Function.prototype.myApply = function (context, argsArray) {
    context = context || globalThis;
    const fnSymbol = Symbol('fn');
    context[fnSymbol] = this;
    const result = argsArray ? context[fnSymbol](...argsArray) : context[fnSymbol]();
    delete context[fnSymbol];
    return result;
};

console.log(greet.myApply({ name: 'Rohit' }, ['Hey']));
```

<details><summary>Show Answer</summary>

```
Hey, Rohit
```

**Explanation:** Identical to `myCall`, except arguments arrive as a single array instead of individually — spread it when invoking. `apply` also allows omitting the second argument entirely, so it should still work when `argsArray` is `undefined`/`null`.

</details>

### Question 3 — `myBind` (naive version)

```javascript
Function.prototype.myBind = function (context, ...boundArgs) {
    const originalFn = this;
    return function (...callArgs) {
        return originalFn.apply(context, [...boundArgs, ...callArgs]);
    };
};

const bound = greet.myBind({ name: 'Rohit' }, 'Yo');
console.log(bound());
```

<details><summary>Show Answer</summary>

```
Yo, Rohit
```

**Explanation:** `bind` doesn't call the function immediately — it returns a new function that, when eventually called, invokes the original with a pre-set `this` and pre-set leading arguments (partial application), plus whatever arguments are passed at call time.

</details>

### Question 4 — Why the Naive `myBind` Breaks with `new`

```javascript
function Person(name) { this.name = name; }
const BoundPerson = Person.myBind({ name: 'ShouldBeIgnored' }, 'PresetName');
const p = new BoundPerson();
console.log(p.name);
```

<details><summary>Show Answer</summary>

```
undefined
```

**Explanation:** The real `Function.prototype.bind` has a special rule: if the bound function is called with `new`, the preset `context` is ignored and `this` becomes the newly constructed object instead — but preset arguments still apply. Our naive `myBind` always forces `context`, ignoring `new` entirely, so `this` inside `Person` ends up being `{ name: 'ShouldBeIgnored' }`, not the new instance — meaning `this.name = name` sets a property on the wrong object, and `p.name` reads `undefined` off the actual new instance. The fix:

```javascript
Function.prototype.myBindProper = function (context, ...boundArgs) {
    const originalFn = this;
    function bound(...callArgs) {
        const isNewCall = this instanceof bound;
        return originalFn.apply(isNewCall ? this : context, [...boundArgs, ...callArgs]);
    }
    bound.prototype = Object.create(originalFn.prototype || {});
    return bound;
};

const BoundPersonProper = Person.myBindProper({ name: 'ShouldBeIgnored' }, 'PresetName');
const p2 = new BoundPersonProper();
console.log(p2.name, p2 instanceof Person);
```

```
PresetName true
```

`this instanceof bound` is `true` exactly when `bound` was invoked with `new` (because `new` sets the new object's `[[Prototype]]` to `bound.prototype`). In that case we use the freshly constructed `this` instead of the preset `context`, while the preset arguments (`boundArgs`) still apply. Copying `originalFn.prototype` onto `bound.prototype` keeps `instanceof` working correctly against the original constructor.

</details>

---

## `Object.is`

### Question 5

```javascript
function myObjectIs(x, y) {
    const xNegZero = isNegZero(x);
    const yNegZero = isNegZero(y);

    if (xNegZero || yNegZero) {
        return xNegZero && yNegZero;
    } else if (isItNaN(x) && isItNaN(y)) {
        return true;
    } else {
        return x === y;
    }

    function isNegZero(v) {
        return v === 0 && (1 / v) === -Infinity;
    }
    function isItNaN(v) {
        return v !== v; // NaN is the only value that isn't equal to itself
    }
}

console.log(myObjectIs(0, -0));
console.log(myObjectIs(-0, -0));
console.log(myObjectIs(NaN, NaN));
console.log(myObjectIs(5, 5));
```

<details><summary>Show Answer</summary>

```
false
true
true
true
```

**Explanation:** `Object.is` behaves like `===` for almost everything, except its two documented special cases: `Object.is(NaN, NaN)` is `true` (unlike `NaN === NaN`, which is `false`), and `Object.is(0, -0)` is `false` (unlike `0 === -0`, which is `true`). The `isNegZero` helper distinguishes `+0` from `-0` using the fact that `1 / 0 === Infinity` but `1 / -0 === -Infinity`.

> **Bug note:** an earlier version of this polyfill returned `xNegZero && xNegZero` (repeating the same variable) instead of `xNegZero && yNegZero`. It happened to still produce correct results only because the negative-zero check is symmetric in practice, but it was checking the wrong thing — fixed here.

</details>

---

## Array Methods

### Question 6 — `myMap`

```javascript
Array.prototype.myMap = function (cb) {
    const newArr = [];
    this.forEach((e, index) => {
        newArr.push(cb(e, index, this));
    });
    return newArr;
};

console.log([2, 5, 7].myMap((e, idx, ar) => e * 2 + idx + ar[2]));
```

<details><summary>Show Answer</summary>

```
[ 11, 18, 23 ]
```

**Explanation:** Builds a new array by calling `cb(element, index, originalArray)` for each item, matching the real `Array.prototype.map` callback signature (all three arguments, not just the element).

</details>

### Question 7 — `myFilter`

```javascript
Array.prototype.myFilter = function (cb) {
    const newArr = [];
    this.forEach((e, idx) => {
        if (cb(e, idx, this)) {
            newArr.push(e);
        }
    });
    return newArr;
};

console.log([5, 7, 9].myFilter((e, idx) => e % 2 === 0));
```

<details><summary>Show Answer</summary>

```
[]
```

**Explanation:** None of `5, 7, 9` are even, so the result is an empty array — confirms the callback and push-on-truthy logic run correctly.

</details>

### Question 8 — `myReduce`

```javascript
Array.prototype.myReduce = function (cb, initialValue) {
    let accumulator = initialValue !== undefined ? initialValue : this[0];
    for (let i = initialValue !== undefined ? 0 : 1; i < this.length; i++) {
        accumulator = cb(accumulator, this[i], i, this);
    }
    return accumulator;
};

console.log([1, 5, 7, 2, 9].myReduce((acc, currVal) => acc + currVal, 0));
console.log([1, 5, 7, 2, 9].myReduce((acc, currVal) => acc + currVal)); // no initial value
```

<details><summary>Show Answer</summary>

```
24
24
```

**Explanation:** The key detail real `reduce` handles: when `initialValue` is omitted, the accumulator starts as `this[0]` and iteration begins from index `1` instead of `0` — otherwise the first element would be counted twice. Both calls give the same result here since starting from `0 + 1` is equivalent to starting from `1` directly.

</details>

### Question 9 — `myFlat`

```javascript
const flatArray = (ip, currLevel, targetLevel) => {
    let op = [];
    for (let i = 0; i < ip.length; i++) {
        const currEle = ip[i];
        if (typeof currEle === "object" && Array.isArray(currEle)) {
            currLevel++;
            if (targetLevel >= currLevel) {
                op = op.concat(flatArray(currEle, currLevel, targetLevel));
            } else {
                op.push(currEle);
            }
        } else {
            op.push(currEle);
        }
    }
    return op;
};

Array.prototype.myFlat = function (level) {
    return flatArray(this, 0, level);
};

console.log([1, [2, 3], [4, [5, 6]]].myFlat(1));
console.log([1, [2, 3], [4, [5, 6]]].myFlat(2));
console.log([1, [2, [3, [4]]]].myFlat(Infinity));
```

<details><summary>Show Answer</summary>

```
[ 1, 2, 3, [ 4, [ 5, 6 ] ] ]
[ 1, 2, 3, 4, [ 5, 6 ] ]
[ 1, 2, 3, 4 ]
```

**Explanation:** `flatArray` recursively tracks `currLevel` vs `targetLevel` — it only recurses into a nested array if doing so wouldn't exceed the requested depth. Passing `Infinity` as the level fully flattens arbitrarily nested arrays, matching `Array.prototype.flat(Infinity)`.

</details>

---

## Promise Methods

### Question 10 — `myPromiseAll`

```javascript
function myPromiseAll(promiseArr) {
    return new Promise((res, rej) => {
        if (promiseArr.length === 0) return res([]);
        let resolvedCount = 0;
        const returnArr = [];
        promiseArr.forEach((prms, index) => {
            Promise.resolve(prms).then((val) => {
                returnArr[index] = val;
                resolvedCount += 1;
                if (resolvedCount === promiseArr.length) res(returnArr);
            }).catch((err) => rej(err));
        });
    });
}

const delay = (val, ms) => new Promise(r => setTimeout(() => r(val), ms));
myPromiseAll([delay(1, 50), delay(2, 20), 3]).then(r => console.log('resolved:', r));
```

<details><summary>Show Answer</summary>

```
resolved: [ 1, 2, 3 ]
```

**Explanation:** Fulfills when all promises fulfill (preserving input order in the output array regardless of resolution order), rejects as soon as any promise rejects.

> **Bug note:** an earlier version of this polyfill checked `if (resolvedPromise === promiseArr.length) res(returnArr)` as a single statement placed *after* the `forEach` loop, outside any `.then()` callback. Since `.then()` callbacks are always asynchronous (they run on the microtask queue, never synchronously), that check ran immediately after registering the callbacks — while `resolvedPromise` was still `0` — so it could never actually equal `promiseArr.length` at that point. The promise would never resolve for genuinely asynchronous input (verified in Node: the buggy version hung indefinitely on promises using `setTimeout`, only "working" by accident for already-resolved/synchronous values). The fix moves the completion check *inside* the `.then()` callback, incrementing and checking on every resolution instead of once synchronously.

</details>

### Question 11 — `Promise.allSettled` Polyfill

```javascript
if (!Promise.allSettled) {
    Promise.allSettled = function (promises) {
        return new Promise((resolve) => {
            const results = [];
            let completed = 0;

            const checkCompletion = () => {
                if (completed === promises.length) resolve(results);
            };

            if (promises.length === 0) return resolve(results);

            for (let i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i])
                    .then((value) => { results[i] = { status: "fulfilled", value }; })
                    .catch((reason) => { results[i] = { status: "rejected", reason }; })
                    .finally(() => { completed++; checkCompletion(); });
            }
        });
    };
}

const failing = new Promise((_, reject) => setTimeout(() => reject('x'), 10));
Promise.allSettled([delay(1, 30), failing, 3]).then(r => console.log(r));
```

<details><summary>Show Answer</summary>

```
[
  { status: 'fulfilled', value: 1 },
  { status: 'rejected', reason: 'x' },
  { status: 'fulfilled', value: 3 }
]
```

**Explanation:** Unlike `Promise.all`, `allSettled` never short-circuits on rejection — it waits for every promise to *settle* (either fulfill or reject) and reports the outcome of each individually via `.finally()`, which runs regardless of whether `.then()` or `.catch()` handled that particular promise.

</details>

### Question 12 — `myRace`

```javascript
function myRace(promiseArr) {
    return new Promise((resolve, reject) => {
        promiseArr.forEach((prms) => {
            Promise.resolve(prms).then(resolve).catch(reject);
        });
    });
}

console.log(await myRace([delay(1, 30), delay(2, 10)]));
```

<details><summary>Show Answer</summary>

```
2
```

**Explanation:** Settles (fulfills or rejects) as soon as the *first* promise settles, regardless of which array position it's in — here the 10ms delay wins over the 30ms one.

</details>

### Question 13 — `myAny`

```javascript
function myAny(promiseArr) {
    return new Promise((resolve, reject) => {
        if (promiseArr.length === 0) return reject(new Error("All promises were rejected"));
        let rejectedCount = 0;
        const rejectedVals = [];
        promiseArr.forEach((prms, idx) => {
            Promise.resolve(prms).then(resolve).catch((err) => {
                rejectedVals[idx] = err;
                rejectedCount++;
                if (rejectedCount === promiseArr.length) {
                    reject(new Error("AggregateError: All promises were rejected"));
                }
            });
        });
    });
}

const rejecting = (val, ms) => new Promise((_, rej) => setTimeout(() => rej(val), ms));
console.log(await myAny([rejecting('a', 30), delay(2, 10)]));
```

<details><summary>Show Answer</summary>

```
2
```

**Explanation:** Fulfills as soon as *any* promise fulfills; only rejects if *every* promise rejects (mirroring `Promise.any`/`AggregateError` semantics). An empty input array rejects immediately, matching the spec.

</details>

---

## `Object.create()` and `new`

> The conceptual walkthrough of how `Object.create` and `new` build the prototype chain lives in [PrototypalInheritance.md](PrototypalInheritance.md). This section only holds the polyfill implementations.

### Question 14 — `myObjectCreate`

```javascript
function MyObjectCreate(source) {
    const obj = {};
    Object.setPrototypeOf(obj, source); // obj.__proto__ = source
    return obj;
}

const proto = { greet() { return 'hi'; } };
const o = MyObjectCreate(proto);
console.log(o.greet());
console.log(Object.getPrototypeOf(o) === proto);
```

<details><summary>Show Answer</summary>

```
hi
true
```

**What it does:**
- Accepts an object, `source`, as the intended prototype.
- Creates a fresh, empty object.
- Links that new object's `[[Prototype]]` to `source`, via `Object.setPrototypeOf` (equivalent to `obj.__proto__ = source`).
- Returns the new object.

**Explanation:** `o.greet` isn't an own property of `o` — it resolves through the chain to `proto.greet`, which is exactly what real `Object.create(proto)` produces. Passing `null` as `source` correctly leaves the new object with no prototype at all, matching `Object.create(null)`.

</details>

### Question 15 — `myNew`

```javascript
function myNew(Constructor, ...args) {
    const obj = {};

    Object.setPrototypeOf(obj, Constructor.prototype);

    const result = Constructor.apply(obj, args);

    if (
        result !== null &&
        (typeof result === "object" || typeof result === "function")
    ) {
        return result;
    }

    return obj;
}

function Person(name) {
    this.name = name;
}

const p = new Person("Rohit");
console.log(p);
const p2 = myNew(Person, "Ghost");
console.log(p2);
console.log(p2 instanceof Person);
```

<details><summary>Show Answer</summary>

```
Person { name: 'Rohit' }
Person { name: 'Ghost' }
true
```

**What `new` does, step by step:**
1. Create a new, empty object.
2. Link the new object's `[[Prototype]]` to the constructor's `.prototype`.
3. Invoke the constructor with `this` bound to the new object.
4. If the constructor explicitly returns an object (or function), use *that* as the result instead; otherwise, return the object created in step 1.

**Explanation:** `Object.setPrototypeOf(obj, Constructor.prototype)` handles step 2, and `Constructor.apply(obj, args)` handles step 3 (calling the constructor with `this` forced to `obj`, à la [CallApplyBind.md](CallApplyBind.md)). The `typeof result === "object" || typeof result === "function"` check handles step 4 — real `new` has this same override rule:

```javascript
function WeirdCtor(name) {
    this.name = name;
    return { overridden: true }; // explicit object return
}
console.log(new WeirdCtor("X"));       // { overridden: true }
console.log(myNew(WeirdCtor, "X"));    // { overridden: true }

function PrimitiveCtor(name) {
    this.name = name;
    return "ignored string"; // primitive return
}
console.log(new PrimitiveCtor("Y"));    // PrimitiveCtor { name: 'Y' }
console.log(myNew(PrimitiveCtor, "Y")); // PrimitiveCtor { name: 'Y' }
```

> **Note:** if a constructor returns a primitive value (string, number, boolean, etc.), `new` ignores it completely and returns the newly created object instead — only explicit object/function returns can override the new instance.

</details>
