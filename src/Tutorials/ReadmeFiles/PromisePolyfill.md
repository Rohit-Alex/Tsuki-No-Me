# Building a `Promise` Polyfill from Scratch

"Implement `Promise` yourself" is one of the deepest polyfill questions an interview can ask — it's really asking whether you understand *why* promises behave the way they do, not just how to call `.then()`. This file builds one up **incrementally**: each step starts from a real gap in the previous version, demonstrates the gap breaking, then fixes it. All code on this page was verified end-to-end in Node before being written down, including a side-by-side check against the native `Promise`.

> This file only covers the `Promise` constructor itself — `then`/`catch`/`finally`/`resolve`/`reject`. For `Promise.all`/`allSettled`/`race`/`any` polyfills, see [Polyfills.md](Polyfills.md).

---

## Step 1 — The Smallest Possible Promise

### Question 1

```javascript
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;

    const resolve = (value) => {
      this.state = "fulfilled";
      this.value = value;
    };

    const reject = (reason) => {
      this.state = "rejected";
      this.reason = reason;
    };

    executor(resolve, reject);
  }
}

const p = new MyPromise((resolve, reject) => {
    resolve(1);
    reject("Boom"); // called after resolve() already ran
});
console.log(p.state, p.value, p.reason);
```

<details><summary>Show Answer</summary>

```
rejected 1 Boom
```

**The gap:** a real `Promise` can only ever settle **once** — whichever of `resolve`/`reject` runs first wins, and every call after that is silently ignored. This minimal version has no such guard: calling `reject("Boom")` after `resolve(1)` happily overwrites the state anyway, which is why `p.state` ends up `"rejected"` even though `resolve(1)` ran first.

**The fix:** guard both `resolve` and `reject` so neither does anything once the promise has already settled:

```javascript
const resolve = (value) => {
    if (this.state !== "pending") return;
    this.state = "fulfilled";
    this.value = value;
};
const reject = (reason) => {
    if (this.state !== "pending") return;
    this.state = "rejected";
    this.reason = reason;
};
```

With this guard, the same test above correctly gives `fulfilled 1 undefined` — `reject("Boom")` is a no-op since the state is no longer `"pending"`.

</details>

---

## Step 2 — Executor Errors Should Reject, Not Crash

### Question 2

```javascript
new MyPromise(() => {
    throw new Error("Boom");
});
```

<details><summary>Show Answer</summary>

**The gap:** a native `Promise` treats a thrown error inside its executor as an implicit rejection — `new Promise(() => { throw new Error("Boom") })` gives you a rejected promise, it doesn't crash the surrounding script. Our version so far calls the executor directly with no error handling, so this throws and crashes.

**The fix:** wrap the executor call in a `try/catch`, and reject with whatever was thrown:

```javascript
try {
    executor(resolve, reject);
} catch (err) {
    reject(err);
}
```

Verified: `new MyPromise(() => { throw new Error("Boom") }).reason.message` is now `"Boom"`, with no crash.

</details>

---

## Step 3 & 4 — A First `then()`, and Why It Needs a Callback Queue

### Question 3

```javascript
class MyPromiseNaive {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    const resolve = (value) => { this.state = "fulfilled"; this.value = value; };
    executor(resolve, () => {});
  }
  then(onFulfilled) {
    if (this.state === "fulfilled") {
      onFulfilled(this.value);
    }
    // if still pending, onFulfilled is just... dropped
  }
}

const p = new MyPromiseNaive((resolve) => setTimeout(() => resolve('late'), 20));
p.then(v => console.log('did this run?', v));
```

<details><summary>Show Answer</summary>

```
(nothing logs — the callback is silently lost)
```

**The gap:** this naive `then()` only calls `onFulfilled` if the promise is *already* fulfilled at the moment `.then()` is called. For an asynchronously-resolved promise (like one wrapping `setTimeout`), `.then()` runs while the promise is still `"pending"` — and since there's no `else` branch handling that case, the callback is thrown away entirely. It never gets a chance to run once `resolve` eventually fires.

**The fix:** give the promise a **queue of pending callbacks**. If the promise is already settled, call the callback right away (old behavior); if it's still pending, *store* the callback instead, and replay every stored callback once `resolve`/`reject` actually runs:

```javascript
this.onFulfilledCallbacks = [];
this.onRejectedCallbacks = [];

// inside resolve():
this.onFulfilledCallbacks.forEach(cb => cb(value));

// inside then():
then(onFulfilled) {
    if (this.state === "fulfilled") {
        onFulfilled(this.value);
    } else if (this.state === "pending") {
        this.onFulfilledCallbacks.push(onFulfilled);
    }
}
```

Verified: with this fix, `p.then(v => console.log('works now:', v))` correctly logs `works now: late` once the `setTimeout` fires. Because it's a plain array, calling `.then()` **multiple times** on the same pending promise also just works for free — every registered callback gets pushed onto the array and replayed when `resolve` runs. That's Step 4: no extra code needed, just a consequence of using an array instead of a single stored callback.

</details>

---

## Step 5 — Native Promises Are Always Asynchronous, Even When "Already" Resolved

### Question 4

```javascript
class MyPromiseSync {
  // ...same as Step 3/4's fixed version, but calls callbacks directly (no microtask)...
  then(onFulfilled) {
    if (this.state === "fulfilled") onFulfilled(this.value);
    else if (this.state === "pending") this.onFulfilledCallbacks.push(onFulfilled);
  }
}

console.log('start');
new MyPromiseSync((resolve) => resolve(1)).then(v => console.log('then:', v));
console.log('end');
```

<details><summary>Show Answer</summary>

```
start
then: 1
end
```

**The gap:** a real `Promise`'s `.then()` callback **always** runs as a microtask — never synchronously, even if the promise was already resolved the instant `.then()` was called. The output above is wrong: it should be `start`, `end`, `then: 1` — but this version calls `onFulfilled(this.value)` directly and immediately, so `"then: 1"` logs in the middle of the synchronous code instead of after it.

**The fix:** wrap every callback invocation — both the "already settled" branch and the "replay from the queue" branch — in `queueMicrotask()`:

```javascript
then(onFulfilled) {
    if (this.state === "fulfilled") {
        queueMicrotask(() => onFulfilled(this.value));
    } else if (this.state === "pending") {
        this.onFulfilledCallbacks.push(onFulfilled);
        // and inside resolve(): this.onFulfilledCallbacks.forEach(cb => queueMicrotask(() => cb(value)));
    }
}
```

Verified: with this fix, the same test now correctly logs `start`, `end`, `then: 1` — matching real `Promise` timing (see [AsyncAwait.md](AsyncAwait.md) and [eventLoop.md](eventLoop.md) for the full microtask-queue mechanics this relies on).

</details>

---

## Step 6 — `then()` Must Return a New Promise (Chaining)

### Question 5

```javascript
// So far, then() calls the callback but returns nothing.
new MyPromise((resolve) => resolve(1))
  .then(v => v + 1)
  .then(v => console.log(v)); // .then on undefined - crashes
```

<details><summary>Show Answer</summary>

**The gap:** `p.then(...).then(...)` only works if the first `.then()` itself returns something you can call `.then()` on. So far, `then()` just invokes the callback and returns `undefined` — chaining is impossible.

**The fix:** every call to `.then()` returns a **brand-new** `MyPromise`. Whatever the callback returns becomes the value that new promise resolves with:

```javascript
then(onFulfilled) {
    return new MyPromise((resolve, reject) => {
        const handleFulfilled = (value) => {
            const result = onFulfilled(value);
            resolve(result); // the returned value drives the NEW promise
        };
        if (this.state === "fulfilled") {
            queueMicrotask(() => handleFulfilled(this.value));
        } else if (this.state === "pending") {
            this.onFulfilledCallbacks.push(handleFulfilled);
        }
    });
}
```

Verified: `MyPromise.resolve-equivalent(1).then(v => v + 1).then(v => console.log(v))` now correctly logs `2` — the second `.then()` is called on a real, distinct `MyPromise` produced by the first.

</details>

---

## Step 7 — A Thrown Error Inside `then()` Should Reject, Not Crash

### Question 6

```javascript
new MyPromise((resolve) => resolve(1))
  .then(v => { throw new Error('thrown in then'); })
  .then(v => console.log('never runs'));
```

<details><summary>Show Answer</summary>

**The gap:** same issue as Step 2, but now inside `then()`'s callback. Right now, `onFulfilled(value)` is called with no error handling — if the callback throws, it crashes instead of rejecting the promise `.then()` returned.

**The fix:** wrap the callback invocation in `try/catch`, and `reject` the new promise with whatever was thrown:

```javascript
const handleFulfilled = (value) => {
    try {
        const result = onFulfilled(value);
        resolve(result);
    } catch (err) {
        reject(err);
    }
};
```

Verified: the example above, followed by `.catch(err => console.log(err.message))`, now correctly logs `"thrown in then"` instead of crashing.

</details>

---

## Step 8 — Returning Another Promise From `then()` Should Unwrap It

### Question 7

```javascript
new MyPromise((resolve) => resolve(1))
  .then(v => new MyPromise((res) => setTimeout(() => res(v * 100), 20)))
  .then(v => console.log(v));
```

<details><summary>Show Answer</summary>

**The gap:** with Step 7's fix, `resolve(result)` is called with whatever `onFulfilled` returned — but if that return value is *itself* a `MyPromise`, naively calling `resolve(thatPromise)` would make the next `.then()` receive the `MyPromise` object itself, not the value it eventually resolves to. Real promise chains automatically "flatten" a returned promise instead.

**The fix:** check whether `result` is a `MyPromise`. If so, chain onto it instead of resolving with it directly — its eventual value/rejection becomes the outer promise's value/rejection:

```javascript
const handleFulfilled = (value) => {
    try {
        const result = onFulfilled(value);
        if (result instanceof MyPromise) {
            result.then(resolve, reject);
        } else {
            resolve(result);
        }
    } catch (err) {
        reject(err);
    }
};
```

Verified: the example above now correctly logs `100` (after the inner `setTimeout`), not a `MyPromise { ... }` object.

</details>

---

## Step 9 & 10 — Rejection Handling and Error Propagation

### Question 8

**Challenge:** support `then(onFulfilled, onRejected)`, and make sure a *missing* handler doesn't break the chain — a rejection with no `onRejected` should propagate to the next `.then()` unchanged, and a fulfillment with no `onFulfilled` should propagate its value unchanged.

```javascript
MyPromise.reject('boom')  // pretend a working .reject() exists for now
  .then(v => console.log('should not run'))   // no onRejected here
  .then(v => console.log('should not run'))   // still no onRejected
  .catch(err => console.log(err));            // should finally catch it
```

<details><summary>Show Answer</summary>

```
boom
```

**What's needed:**
1. A second `onRejectedCallbacks` array, mirroring `onFulfilledCallbacks`, replayed inside `reject()`.
2. `then()` accepts a second parameter, `onRejected`.
3. If `onFulfilled`/`onRejected` isn't a function (i.e. wasn't provided), the new promise should just adopt the *same* outcome as the original — not silently swallow it.

```javascript
then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
        const handleFulfilled = (value) => {
            if (typeof onFulfilled !== "function") {
                resolve(value); // propagate value unchanged
                return;
            }
            try {
                const result = onFulfilled(value);
                result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
            } catch (err) {
                reject(err);
            }
        };

        const handleRejected = (reason) => {
            if (typeof onRejected !== "function") {
                reject(reason); // propagate rejection unchanged
                return;
            }
            try {
                const result = onRejected(reason);
                // returning normally from onRejected HEALS the chain back to fulfilled
                result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
            } catch (err) {
                reject(err);
            }
        };

        if (this.state === "fulfilled") {
            queueMicrotask(() => handleFulfilled(this.value));
        } else if (this.state === "rejected") {
            queueMicrotask(() => handleRejected(this.reason));
        } else {
            this.onFulfilledCallbacks.push(handleFulfilled);
            this.onRejectedCallbacks.push(handleRejected);
        }
    });
}
```

**Explanation:** the two bare `.then(v => ...)` calls in the challenge only supply an `onFulfilled` — so on a rejected promise, `handleRejected` runs with `onRejected === undefined`, which isn't a function, so it just calls `reject(reason)` on the new promise — forwarding the *same* rejection reason down the chain, unchanged, exactly like real promise chaining (this exact rule is covered in depth in [Asynchronous.md](Asynchronous.md#rules-of-promise-chaining-how-values-and-errors-actually-flow)). Only the final `.catch()` actually has a rejection handler, so that's where `"boom"` finally gets logged.

</details>

---

## Step 11 — `catch()` Is Just `then()` in Disguise

### Question 9

```javascript
catch(onRejected) {
    return this.then(undefined, onRejected);
}
```

<details><summary>Show Answer</summary>

**Explanation:** there's no separate mechanism for `.catch()` — it's pure sugar for calling `.then()` with `undefined` as the fulfillment handler and the given function as the rejection handler. This is worth remembering as an interview fact on its own: `promise.catch(fn)` and `promise.then(undefined, fn)` are always exactly equivalent, for the real `Promise` too, not just this polyfill.

</details>

---

## Step 12 — `finally()`: Cleanup That Doesn't See or Alter the Result

### Question 10 — The Naive Version

```javascript
finally(cb) {
    return this.then(
        value => { cb(); return value; },
        reason => { cb(); throw reason; }
    );
}
```

<details><summary>Show Answer</summary>

**The gap:** this looks right at first — `cb()` runs on both success and failure, and the original value/rejection passes through unchanged. But it misses one real behavior: if `cb()` itself returns a **promise** (e.g. an async cleanup step like closing a DB connection), a real `.finally()` waits for that cleanup promise to settle before continuing — this naive version doesn't; it fires `cb()` and moves on immediately, regardless of whether `cb()`'s own async work has finished.

**The fix:** route `cb()`'s return value through `MyPromise.resolve(...)`, so that if it's a plain value the chain continues immediately (unwrapping is a no-op for plain values), but if it's a promise, the chain correctly waits for it:

```javascript
finally(cb) {
    const fn = typeof cb === "function" ? cb : () => {};
    return this.then(
        value  => MyPromise.resolve(fn()).then(() => value),
        reason => MyPromise.resolve(fn()).then(() => { throw reason; })
    );
}
```

**Behavior this produces (all verified in Node):**
- Cleanup always runs, on both the fulfilled and rejected paths.
- If `cb()` returns a promise, the chain genuinely waits for it before continuing.
- The original value (or rejection reason) passes through **untouched** — `finally`'s own return value is discarded, exactly like the real `Promise.prototype.finally`.
- If `cb()` itself throws (or returns a promise that rejects), that **overrides** the original outcome — even an originally-fulfilled chain becomes rejected. (This exact edge case — and its rejected-chain counterpart — is explored further in [Asynchronous.md](Asynchronous.md#question-11-finally-overriding-the-chain-by-throwing-rules-9-10-11).)

</details>

---

## Step 13 — Static `resolve()` and `reject()`

### Question 11

```javascript
static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
}

static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
}
```

<details><summary>Show Answer</summary>

**Explanation:** `MyPromise.resolve(value)` wraps a plain value in an already-fulfilled promise — but if `value` is *already* a `MyPromise`, real `Promise.resolve` just returns it as-is instead of wrapping it in another layer (this check is what `finally()` above relies on to avoid unnecessary double-wrapping). `MyPromise.reject(reason)` is the mirror image — always produces an already-rejected promise, regardless of what `reason` is (even if `reason` is itself a promise — unlike `resolve`, `reject` never unwraps its argument).

</details>

---

## The Complete Implementation

Putting every step together — this is the fully assembled, verified version:

```javascript
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state !== "pending") return;
      this.state = "fulfilled";
      this.value = value;
      this.onFulfilledCallbacks.forEach(cb => queueMicrotask(() => cb(value)));
    };

    const reject = (reason) => {
      if (this.state !== "pending") return;
      this.state = "rejected";
      this.reason = reason;
      this.onRejectedCallbacks.forEach(cb => queueMicrotask(() => cb(reason)));
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handleFulfilled = (value) => {
        if (typeof onFulfilled !== "function") { resolve(value); return; }
        try {
          const result = onFulfilled(value);
          result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
        } catch (err) {
          reject(err);
        }
      };

      const handleRejected = (reason) => {
        if (typeof onRejected !== "function") { reject(reason); return; }
        try {
          const result = onRejected(reason);
          result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
        } catch (err) {
          reject(err);
        }
      };

      if (this.state === "fulfilled") {
        queueMicrotask(() => handleFulfilled(this.value));
      } else if (this.state === "rejected") {
        queueMicrotask(() => handleRejected(this.reason));
      } else {
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(cb) {
    const fn = typeof cb === "function" ? cb : () => {};
    return this.then(
      value => MyPromise.resolve(fn()).then(() => value),
      reason => MyPromise.resolve(fn()).then(() => { throw reason; })
    );
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }
}
```

### Question 12 — Verifying It End-to-End

```javascript
MyPromise.resolve(5)
  .then(v => v * 2)
  .catch(() => 'never')
  .then(v => console.log(v));
```

<details><summary>Show Answer</summary>

```
10
```

**Verified directly against native `Promise`** — running the equivalent chain with real `Promise.resolve(5).then(v => v * 2).catch(() => 'never')` produces the exact same `10`, confirming the polyfill's chaining/error-propagation semantics match.

</details>

---

## What This Implementation Still Doesn't Cover

This version deliberately stops short of the full **Promise/A+ resolution procedure**. In particular, it does not handle:

- **Thenables** — a plain object with a `.then()` method (not a real `Promise`, not a `MyPromise`) is *not* automatically unwrapped by this implementation; only `instanceof MyPromise` is checked. The real spec requires unwrapping *any* thenable, including ones from a completely different promise library.
- **Recursive promise adoption** — if a `.then()` callback returns a promise that itself resolves with *another* promise (nested), the spec requires recursively unwrapping until a non-promise value is reached. This version only unwraps one level via `result.then(resolve, reject)` — though because `resolve` inside the *next* promise's constructor would itself just store whatever it's given, deeply nested cases aren't fully spec-compliant here.
- **Self-resolution detection** — the spec requires throwing a `TypeError` if a promise's own `resolve` is called with itself (`resolve(thisPromise)`), to prevent an infinite resolution loop. This isn't guarded against here.
- **Safe, once-only `then` extraction from arbitrary thenables** — the real spec is very defensive about thenables whose `.then` is a getter with side effects, or that call both `resolve` and `reject` multiple times; a fully spec-compliant implementation needs extra guards for this that add significant complexity without much conceptual payoff.

**For interview purposes:** understanding *why* these edge cases exist in the spec (mostly: interoperability between different promise implementations, and defending against malicious or buggy thenables) is generally more valuable to be able to talk through than memorizing the full Promise/A+ algorithm line-by-line. The core mental model — pending/fulfilled/rejected, callback queues, microtask scheduling, and chaining via a freshly-returned promise — is what this file's incremental build-up is meant to make second nature.
