# Polyfills — Implementing Built-in Methods Yourself

A polyfill re-implements a native method's behavior in plain JavaScript. Writing them is a common interview exercise because it tests whether you actually understand what the built-in does under the hood, not just how to call it.

> This file covers `Promise.all`/`allSettled`/`race`/`any` (see below), `Object.is`, and array method polyfills. For implementing the `Promise` constructor itself — `then`/`catch`/`finally`/`resolve`/`reject`, built up incrementally with each gap and fix — see the dedicated [PromisePolyfill.md](PromisePolyfill.md).

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

## Timers: `setInterval` on Top of `setTimeout`

`setTimeout` and `setInterval` are both native browser/Node APIs, not something you'd normally "polyfill" for missing-feature reasons — but implementing one in terms of the other is a common interview exercise, because it tests whether you understand what each one actually guarantees.

### Question 10 — `setInterval` Implemented via Recursive `setTimeout`

```javascript
function mySetInterval(cb, delay, ...args) {
    let cancelled = false;
    const timerId = {};

    function tick() {
        if (cancelled) return;
        cb(...args);
        timerId.id = setTimeout(tick, delay);
    }
    timerId.id = setTimeout(tick, delay);

    timerId.clear = () => {
        cancelled = true;
        clearTimeout(timerId.id);
    };
    return timerId;
}

let count = 0;
const t = mySetInterval((label) => {
    count++;
    console.log(label, count);
    if (count === 3) t.clear();
}, 20, 'tick');
```

<details><summary>Show Answer</summary>

```
tick 1
tick 2
tick 3
```
</details>

### Question 11 — An Alternative Approach: a Timer Registry Polled via `requestAnimationFrame`

Question 10's recursive-`setTimeout` approach is the simplest way to build `setInterval`, but it's not the only one. Browsers also expose `requestAnimationFrame` (rAF) — a callback that fires roughly once per screen repaint (~60 times a second). Another valid approach: keep a registry of "due times," and check it on every animation frame.

```javascript
let intervalIdTracker = 10000;
const intervals = {};

function mySetInterval(cb, interval, ...args) {
    const intervalId = intervalIdTracker++;

    function execute() {
        cb(...args);

        // The interval might have been cleared from inside the callback itself
        if (!intervals[intervalId]) return;

        intervals[intervalId].executeAt += interval;
    }

    intervals[intervalId] = {
        callback: execute,
        executeAt: Date.now() + interval,
    };

    // Only need one polling loop running at a time, no matter how many intervals exist
    if (Object.keys(intervals).length === 1) {
        requestAnimationFrame(processIntervals);
    }

    return intervalId;
}

function processIntervals() {
    const now = Date.now();

    for (const id of Object.keys(intervals)) {
        const timer = intervals[id];
        if (now >= timer.executeAt) {
            timer.callback();
        }
    }

    if (Object.keys(intervals).length > 0) {
        requestAnimationFrame(processIntervals);
    }
}

function myClearInterval(id) {
    delete intervals[id];
}

let count = 0;
const id = mySetInterval(() => {
    count++;
    console.log("Rohit", count);
    if (count === 3) myClearInterval(id);
}, 200);
```

<details><summary>Show Answer</summary>

```
Rohit 1
Rohit 2
Rohit 3
```

(then nothing further — `myClearInterval` removes the entry from `intervals`, and `processIntervals` stops rescheduling itself once the registry is empty)

**How it works:** rather than chaining individual `setTimeout` calls (Question 10), this keeps every active interval's "next due time" (`executeAt`) in a shared `intervals` registry, and drives everything from a **single** repeating `requestAnimationFrame` loop (`processIntervals`) that checks, on every frame, which timers are due to fire. `execute()` wraps the real callback so that after firing, it just bumps `executeAt` forward by `interval` — rescheduling by *updating a timestamp* rather than creating a brand-new timer each time.

**Why check `Object.keys(intervals).length === 1` before starting the loop?** So that calling `mySetInterval` multiple times doesn't spawn multiple competing `requestAnimationFrame` loops — the very first interval registered kicks off the single shared polling loop, and every interval after that just adds another entry to the same registry that the already-running loop will pick up.

**Trade-offs versus Question 10's recursive `setTimeout` version:**
- Since `requestAnimationFrame` only fires when the page is actually rendering (throttled or fully paused in a backgrounded/hidden browser tab), this version's timing is tied to the rendering pipeline — appropriate for animation-related work, but not a general-purpose timer replacement outside a browser (`requestAnimationFrame` doesn't exist in Node at all, unlike `setTimeout`).
- A single shared poll loop scales better with many concurrent intervals than Question 10's one-`setTimeout`-per-interval approach, at the cost of only checking due times on whatever cadence rAF happens to fire (not necessarily exactly on time).

</details>

### Question 12 — The Same Registry Pattern for `setTimeout`

```javascript
let timerIdGlobal = 1;
const timers = {};

function mySetTimeout(callback, delay, ...args) {
    const id = timerIdGlobal++;

    timers[id] = {
        callback,
        args,
        executeAt: Date.now() + delay,
    };

    if (Object.keys(timers).length === 1) {
        requestAnimationFrame(processTimers);
    }

    return id;
}

function processTimers() {
    const now = Date.now();

    for (const id of Object.keys(timers)) {
        const timer = timers[id];
        if (now >= timer.executeAt) {
            try {
                timer.callback(...timer.args);
            } finally {
                delete timers[id]; // unlike setInterval, a timeout only fires once
            }
        }
    }

    if (Object.keys(timers).length > 0) {
        requestAnimationFrame(processTimers);
    }
}

function myClearTimeout(id) {
    delete timers[id];
}

mySetTimeout(() => console.log("hi-1"), 200);
mySetTimeout(() => console.log("hi-2"), 400);
mySetTimeout(() => console.log("hi-3"), 600);
```

<details><summary>Show Answer</summary>

```
hi-1
hi-2
hi-3
```

(each roughly `200`/`400`/`600`ms after being scheduled, in that order)

**Explanation:** structurally identical to Question 11's `mySetInterval`, with one key difference: `processTimers` `delete`s the registry entry (inside a `finally`, so it's removed even if `callback` throws) right after firing it, instead of rescheduling it — a timeout should only ever fire once, never repeat. This is the same registry + single-shared-poll-loop pattern, just without the "bump `executeAt` forward and keep going" step that made Question 11's version behave like `setInterval`.

</details>

---

## Debounce and Throttle

Both **debounce** and **throttle** solve the same underlying problem — a function is being called far more often than needed (every keystroke, every scroll/resize/mousemove event) — but they solve it with different trade-offs, and mixing them up is a very common interview stumble.

- **Debounce**: wait until the calls *stop* for `delay` ms, then run the callback exactly once, with the arguments from the **last** call. Every new call resets the wait. Good for: search-as-you-type, resizing recalculations, form validation-on-pause — cases where only the *final* state matters.
- **Throttle**: run the callback immediately on the first call, then ignore (or queue) further calls until `delay` ms have passed, guaranteeing the callback runs **at most once** per window. Good for: scroll/mousemove handlers, rate-limiting API calls, button-mash prevention — cases where you want steady, periodic execution the whole time activity is happening, not just at the end.

### Question 13 — `debounce`

```javascript
function debounce(fn, delay) {
    let timerId;

    return function (...args) {
        clearTimeout(timerId);

        timerId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

const search = debounce((text) => {
    console.log("Searching:", text);
}, 500);

search("R");
search("Ro");
search("Roh");
search("Rohi");
search("Rohit");
```

<details><summary>Show Answer</summary>

```
Searching: Rohit
```

(logged once, ~500ms after the *last* call — `"R"`, `"Ro"`, `"Roh"`, `"Rohi"` never fire at all)

**How it works:** every call to the debounced function immediately `clearTimeout`s whatever timer is currently pending, then starts a fresh one. Since all five calls in this example happen synchronously, back-to-back, each one cancels the timer the previous call had just started — only the very last call's timer ever survives long enough to actually fire, `delay` ms after *it* was scheduled. That's why only `"Rohit"` gets logged, and why the wait is measured from the *last* call, not the first.

**`this` preservation:** the outer function is a plain `function`, not an arrow function, so `this` inside it is whatever it's called as a method of (e.g. `obj.debouncedFn()` gives `this === obj`). The inner arrow function passed to `setTimeout` doesn't have its own `this`, so it captures that outer `this` lexically — `fn.apply(this, args)` correctly forwards the original caller's `this`, not the global object `setTimeout`'s callback would otherwise get (see [thisExample.md](thisExample.md#question-6--settimeout-loses-this) for that exact gotcha in isolation).

</details>

### Question 14 — `throttle` (Leading Call, Trailing Call With Only the Latest Args)

```javascript
function throttle(cb, delay = 1000) {
    let shouldWait = false;

    let waitingArgs = null;
    let waitingThis = null;

    const timeoutFunc = () => {
        if (waitingArgs === null) {
            shouldWait = false;
            return;
        }

        cb.apply(waitingThis, waitingArgs);

        waitingArgs = null;
        waitingThis = null;

        setTimeout(timeoutFunc, delay);
    };

    return function (...args) {
        if (shouldWait) {
            waitingArgs = args;
            waitingThis = this;
            return;
        }

        cb.apply(this, args);

        shouldWait = true;

        setTimeout(timeoutFunc, delay);
    };
}

const person = {
    name: "Rohit",

    greet(message) {
        console.log(message, this.name);
    }
};
person.throttledGreet = throttle(person.greet, 1000);
person.throttledGreet("Hello");
```

<details><summary>Show Answer</summary>

```
Hello Rohit
```

**How it works — walk through a busier example to see the full behavior** (`throttledGreet` called at `t=0`, `t=20ms`, and `t=40ms`, with `delay=100`):

1. **`t=0` call:** `shouldWait` is `false`, so `cb.apply(this, args)` runs *immediately* — this is the **leading-edge** execution. `shouldWait` flips to `true`, and a `setTimeout` starts a `delay`-ms window via `timeoutFunc`.
2. **`t=20ms` call:** `shouldWait` is `true`, so this call doesn't run `cb` at all — instead it just records its `args`/`this` into `waitingArgs`/`waitingThis`, overwriting whatever (nothing, yet) was there before.
3. **`t=40ms` call:** same as above — `waitingArgs`/`waitingThis` get overwritten *again*, discarding the `t=20ms` call's arguments entirely. Only the **most recent** call's data survives.
4. **`t=100ms`, `timeoutFunc` fires:** `waitingArgs` is not `null` (the `t=40ms` call set it), so `cb.apply(waitingThis, waitingArgs)` runs now — this is the **trailing-edge** execution, using only the *latest* queued call's arguments. `waitingArgs`/`waitingThis` are cleared, and a fresh `delay`-ms window starts.
5. If nothing calls the throttled function again before the next window's `timeoutFunc` fires, `waitingArgs` is still `null` at that point, so `shouldWait` simply resets to `false` and no extra trailing call happens — the *next* call after that goes straight back to the immediate leading-edge path.

**Why this shape and not a simpler "just ignore calls during the window" version?** A naive throttle that only keeps the leading-edge call and *drops* everything else during the window would silently lose the most recent state — e.g. a scroll handler would never see where scrolling actually *stopped*, only where it *started* each window. Queuing the latest call's args and firing them at the end of the window (this implementation) guarantees the callback eventually sees the most up-to-date state, without letting intermediate calls flood the callback faster than `delay` allows.

**`this` preservation:** same mechanism as debounce — `cb.apply(this, args)`/`cb.apply(waitingThis, waitingArgs)` explicitly forward whatever `this` was at each call site, which is why `person.throttledGreet("Hello")` correctly logs `Rohit` and not `undefined`.

</details>

---

## Promise Methods

### Question 15 — `myPromiseAll`

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

### Question 16 — `Promise.allSettled` Polyfill

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

### Question 17 — `myRace`

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

### Question 18 — `myAny`

```javascript
function myAny(promiseArr) {
    return new Promise((resolve, reject) => {
        if (promiseArr.length === 0) return reject(new AggregateError("All promises were rejected"));
        let rejectedCount = 0;
        const rejectedVals = [];
        promiseArr.forEach((prms, idx) => {
            Promise.resolve(prms).then(resolve).catch((err) => {
                rejectedVals[idx] = err;
                rejectedCount++;
                if (rejectedCount === promiseArr.length) {
                    reject(new AggregateError("AggregateError: All promises were rejected"));
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

### Question 19 — `myObjectCreate`

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

### Question 20 — `myNew`

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
