# Iterators and Generators

## Iterators

We regularly have lists or collections where we want to grab each element one by one:

```javascript
const numbers = [4, 5, 6]
for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i])
}
```

Now suppose we want to access each element and perform some action, without an explicit loop.

**Using closure:**

```javascript
function createFunction(array) {
    let i = 0
    function inner() {
        const element = array[i]
        i++
        return element
    }
    return inner
}
const returnNextElement = createFunction([4, 5, 6])
const element1 = returnNextElement()
const element2 = returnNextElement()
```

---

> **Note:** JavaScript's built-in iterators are actually objects with a `next` method that, when called, returns the next element from the "stream" — so let's restructure slightly to match that shape.

An **iterator** is an object with a `next` method that, when called, returns an object containing a `value` and a `done` property. `value` is the current element, and `done` indicates whether the iteration is complete.

```javascript
function createFlow(array) {
    let i = 0
    const inner = {
        next: function () {
            const element = array[i]
            i++
            return element
        }
    }
    return inner
}
const returnNextElement = createFlow([4, 5, 6])
const element1 = returnNextElement.next()
const element2 = returnNextElement.next()
```

**Generator function:** a special type of function that produces a flow of data — it returns a *generator object* with a `next` method, and lets you dynamically control data generation using the `yield` keyword to suspend and resume execution.

`yield` suspends a function's execution, returns a value, and allows the function to be resumed later — preserving its local state and position in the code exactly where it left off.

A generator object's `next()` method can be called repeatedly to generate values, can pass values back into the function, and maintains the function's execution context between calls.

- **Regular functions** return only a single value (or nothing) and then they're done.
- **Generators** can "yield" multiple values, one at a time, on demand. They pair naturally with iterables, making it easy to build data streams.

**Why generators exist:**
- A normal function: starts, runs to completion, returns once, finishes.
- A generator: starts, pauses at each `yield`, resumes from that same point later, and can produce multiple values over time.

So generators exist to support **lazy value generation** and **step-by-step execution** — computing only what's actually needed, only when it's needed.

Special syntax: `function*`.

### Question 1

```javascript
function* generateSequence() {
  yield 1;
  yield 2;
  yield 3;
  yield;
}

const gen = generateSequence();
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
```

<details><summary>Show Answer</summary>

```
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: false }
{ value: undefined, done: false }
{ value: undefined, done: true }
```

**Explanation:** each `yield` pauses execution and returns a value; a bare `yield` (no value) yields `undefined`. The 5th call has nothing left to yield, so `value` is `undefined` and `done` flips to `true`, signaling the generator has finished.

**Note:** calling `generateSequence()` doesn't run any of the function's code immediately — it returns a special **generator object** that manages execution. The main method on that object is `next()`: each call runs the function until the nearest `yield <value>` (value optional, defaults to `undefined`), pauses there, and returns `{ value, done }` to the caller.

</details>

---

## Generators Are Iterable

Generators can be used directly with `for...of` loops and the spread operator.

### Question 2

```javascript
function* numberGen() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGen();
for (let value of gen) {
  console.log(value);
}
```

<details><summary>Show Answer</summary>

```
1
2
3
```

**Explanation:** `for...of` automatically calls `next()` repeatedly and extracts each `value`, stopping as soon as `done` becomes `true` — it never sees or logs that final `{ value: undefined, done: true }` result.

</details>

### Question 3 — `return` Inside a Generator

```javascript
function* myGenerator() {
  yield "A";
  yield "B";
  return "Done";
}

const g = myGenerator();
for (const value of g) {
  console.log(value);
}
```

<details><summary>Show Answer</summary>

```
A
B
```

**Explanation:** `for...of` only iterates over *yielded* values — a `return` inside a generator sets `done: true` with that value, but `for...of` treats that as the termination signal and never logs it. Compare with manually calling `.next()` (Question 4), where the returned value **is** directly visible.

</details>

### Question 4 — Calling `next()` Before Entering a `for...of` Loop

```javascript
function* myGenerator() {
  yield "A";
  yield "B";
  return "Done";
}

const g = myGenerator();
console.log('called using next', g.next());
for (const value of g) {
  console.log(value);
}
```

<details><summary>Show Answer</summary>

```
called using next { value: 'A', done: false }
B
```

**Explanation:** the manual `g.next()` call already consumed `"A"` before the loop started. `for...of` continues from wherever the generator's internal position currently is — it doesn't restart from the beginning — so the loop only ever sees `"B"`.

</details>

### `yield` vs. `return`

- `yield` pauses execution and hands back a value — the generator can still be resumed afterward.
- `return` ends the generator completely — any code (including further `yield`s) after it never runs.

```javascript
function* demo() {
  yield 10;
  return 20;
  yield 30; // never reached
}

const d = demo();
console.log(d.next()); // { value: 10, done: false }
console.log(d.next()); // { value: 20, done: true }
console.log(d.next()); // { value: undefined, done: true } — already finished
```

Also works with the spread operator (which internally uses `for...of`):

```javascript
function* generateSequence() {
  yield 1;
  yield 2;
  yield 3;
}
console.log([0, ...generateSequence()]);
```

```
[ 0, 1, 2, 3 ]
```

---

## Passing Values Into Generators

Calling `generator.next(arg)` with an argument makes `arg` become the *result* of the `yield` expression that's currently paused.

### Question 5

```javascript
function* greet() {
  const name = yield "What is your name?";
  yield `Hello ${name}`;
}

const g = greet();
console.log(g.next());
console.log(g.next("Rohit"));
```

<details><summary>Show Answer</summary>

```
{ value: 'What is your name?', done: false }
{ value: 'Hello Rohit', done: false }
```

**Explanation:** the first `next()` (called with no argument) starts the generator and runs it up to the first `yield`, returning `"What is your name?"` — at this point, `name` hasn't been assigned yet, since the assignment only completes once this `yield` expression *resolves*. The second call, `next("Rohit")`, supplies `"Rohit"` as that resolved value, which is what gets assigned to `name` before the function continues to the next `yield`.

</details>

### Use Cases for Generator Functions

- Values are large or effectively infinite.
- We don't want to (or can't) compute everything upfront.
- We want lazy, on-demand computation.

```javascript
function* infiniteNumbers() {
  let i = 1;
  while (true) {
    yield i++;
  }
}
```

`infiniteNumbers()` never actually loops forever in practice — each call to `.next()` only computes *one* more value, so you can safely pull as many or as few values as you want (`gen.next().value`, `gen.next().value`, ...) without ever trying to materialize an infinite array.

---

## Generator Methods: `.next()`, `.return()`, `.throw()`

### `generator.return(value)` — Finishes the Generator Early

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

const g = gen();

console.log(g.next());            // { value: 1, done: false }
console.log(g.return('Stop now')); // { value: "Stop now", done: true }
console.log(g.next());            // { value: undefined, done: true }
```

**Note:** if you call `.return()` again on an already-completed generator, it returns that same value again:

```javascript
console.log(g.return('again')); // { value: 'again', done: true }
```

### `generator.throw(err)` — Throws an Error Inside the Generator

Throwing into a generator raises `err` at the exact line where the generator is currently paused (at its most recent `yield`), letting the generator's own `try/catch` handle it.

```javascript
function* gen() {
  try {
    yield 1;
    console.log("Never reached here, went to catch");
  } catch (e) {
    console.log("caught", e);
  }
}

const g = gen();
console.log(g.next()); // { value: 1, done: false }
g.throw("error");      // logs: caught error
```

### `yield*` — Delegating to Another Generator/Iterable

```javascript
function* a() {
  yield 1;
  yield 2;
}

function* b() {
  yield* a();
  yield 3;
}

console.log([...b()]);
```

```
[ 1, 2, 3 ]
```

`yield*` transparently forwards every value from the inner generator (or any iterable) out through the outer one, as if the inner generator's `yield`s were written directly inside `b`.

---

## Practical Example: Driving a Generator With a Promise

```javascript
function doWhenDataReceived(value) {
    returnNextElement.next(value)
}
function* createFlow() {
    console.log('inside gen')
    const data = yield Promise.resolve("hi")
    console.log(data)
}

const returnNextElement = createFlow()
console.log('1')
const futureData = returnNextElement.next()
console.log('11')
futureData.value.then(doWhenDataReceived)
console.log('2')
```

<details><summary>Show Answer</summary>

```
1
inside gen
11
2
hi
```

**Explanation:** `createFlow()` doesn't run any code yet (generators are lazy). `returnNextElement.next()` starts it, running until the `yield Promise.resolve("hi")` — logging `'inside gen'` synchronously, then pausing with `futureData.value` holding the *unresolved* promise itself (not yet `"hi"`). We manually attach `.then(doWhenDataReceived)` to that promise, and once it resolves, `doWhenDataReceived` calls `returnNextElement.next("hi")` — feeding `"hi"` back in as the result of the paused `yield` expression, resuming the generator and letting `console.log(data)` finally run, printing `hi`.

**Why this matters historically:** we're manually building the "resume the generator once the promise resolves" wiring here — deciding exactly when to call `.next()` in response to a promise settling. `async`/`await` (next section) automates this *exact* pattern natively, which is why `async` functions are sometimes described as "generators with an automatic promise-driven runner built in."

</details>

---

## `async`/`await` Simplifies All This

### Question 6

```javascript
async function createFlow() {
    console.log("Me first")
    const data = await Promise.resolve("HI")
    console.log(data)
}
createFlow()
console.log("Me second")
```

<details><summary>Show Answer</summary>

```
Me first
Me second
HI
```

**Explanation:** the async function starts running immediately and synchronously, up to its first `await` — logging `"Me first"`. `await` then pauses it and hands control back to the caller, letting the rest of the synchronous code (`"Me second"`) run first. Once the awaited promise resolves, the rest of `createFlow` resumes as a microtask, logging `"HI"` last. Full mechanics of this ordering (and how it fits alongside `setTimeout`) are covered in [eventLoop.md](eventLoop.md#question-6--asyncawait-in-the-ordering).

</details>

> **Note:** unlike the manual generator example above, there's no need to write a "resume when the promise resolves" trigger function ourselves — `await` automatically schedules that resumption for us.

### What Happens When an `async` Function Hits an `await`?

- The `async` function starts running immediately, synchronously, just like any normal function call.
- At `await`, the function's execution pauses.
- The rest of the function (everything after that `await`) is scheduled to resume as a **microtask**, once the awaited promise settles.
- Control returns to the caller immediately — any remaining synchronous code after the call keeps running first.
- Only once all synchronous code has finished does the event loop process the microtask queue, resuming the paused `async` function.

### Step-by-Step With the Call Stack

1. **Global code starts running.** Call stack: `[Global]`.
2. `createFlow()` is called — pushed onto the stack: `[createFlow, Global]`. Inside it, `console.log("Me first")` runs immediately. Output so far: `Me first`.
3. JS reaches `const data = await Promise.resolve("HI")`. `Promise.resolve("HI")` creates an already-resolved promise, but `await` doesn't let execution continue past it synchronously. Instead:
   - `createFlow` pauses right there.
   - The remainder of the function (`console.log(data)`) is scheduled as a microtask, to run once the awaited promise settles.
   - Control returns to wherever `createFlow()` was called from. Call stack shrinks back to `[Global]`.
4. Global code continues with `console.log("Me second")`. Output so far: `Me first`, `Me second`.
5. Synchronous global code has now finished — the call stack is empty. The event loop checks the microtask queue and finds the scheduled continuation of `createFlow`, resumes it with `data = "HI"`, and runs `console.log(data)`. Final output: `Me first`, `Me second`, `HI`.

---

## Custom Iterables With `Symbol.iterator`

Generators aren't the only way to make something work with `for...of` or the spread operator — any object can opt in by implementing a method keyed by the well-known symbol `Symbol.iterator`, which must return an iterator (an object with a `next()` method).

### Question 7 — Making a Plain Object Iterable

```javascript
const range = {
    from: 1,
    to: 5,
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
console.log(Array.from(range));
for (const num of range) console.log(num);
```

<details><summary>Show Answer</summary>

```
[ 1, 2, 3, 4, 5 ]
[ 1, 2, 3, 4, 5 ]
1
2
3
4
5
```

**Explanation:** `range` is a plain object — it has no `length`, no numeric indices, nothing array-like about it. But because it implements `[Symbol.iterator]()` returning a valid iterator, every construct that expects an iterable (`for...of`, spread `...`, `Array.from`, destructuring) works on it automatically. This is exactly the mechanism arrays, strings, `Map`s, and `Set`s use under the hood to support `for...of` themselves.

</details>

### Question 8 — Using a Generator as a Shortcut for `Symbol.iterator`

```javascript
const range2 = {
    from: 1,
    to: 3,
    *[Symbol.iterator]() {
        for (let i = this.from; i <= this.to; i++) yield i;
    }
};

console.log([...range2]);
```

<details><summary>Show Answer</summary>

```
[ 1, 2, 3 ]
```

**Explanation:** manually implementing `next()`/`{value, done}` bookkeeping by hand (Question 7) is tedious — a generator method does it automatically. `*[Symbol.iterator]()` is a **generator method** (combining a computed method name with `function*` syntax); calling it returns a generator object, which already satisfies the iterator protocol. This is the far more common way to make a custom object iterable in real code.

</details>

### Question 9 — Are Generators Their Own Iterator?

```javascript
function* gen() { yield 1; yield 2; }
const g = gen();
console.log(g[Symbol.iterator]() === g);
```

<details><summary>Show Answer</summary>

```
true
```

**Explanation:** a generator object is simultaneously both an **iterator** (it has `next()`) and an **iterable** (it has `[Symbol.iterator]()`) — and its own `[Symbol.iterator]()` method just returns itself. This is exactly why a generator object can be passed directly to `for...of` or spread without any extra wrapping — it already satisfies both protocols at once.

</details>

---

## Generator Syntax Forms

### Question 10 — Generator Method Shorthand and Generators in Classes

```javascript
const obj = {
    *genMethod() {
        yield 'a';
        yield 'b';
    }
};
console.log([...obj.genMethod()]);

class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    *[Symbol.iterator]() {
        for (let i = this.start; i <= this.end; i++) yield i;
    }
}
console.log([...new Range(1, 4)]);
```

<details><summary>Show Answer</summary>

```
[ 'a', 'b' ]
[ 1, 2, 3, 4 ]
```

**Explanation:** `*methodName() { ... }` is the generator method shorthand for object literals and classes — it's exactly equivalent to writing `genMethod: function*() { ... }`, just terser. This is the same shorthand used earlier for `*[Symbol.iterator]()` (Question 8), just with a plain name instead of a computed one. Note that `this` inside a generator method works exactly like `this` in a regular method — see Question 11.

**Not allowed:** arrow functions cannot be generators — there's no such thing as `const gen = *() => {}`; it's a syntax error. If you need a generator, it has to be a `function*` declaration/expression or a method shorthand.

</details>

### Question 11 — `this` Inside a Generator

```javascript
const account = {
    balance: 100,
    *transactions() {
        yield this.balance;
        yield this.balance - 50;
    }
};
console.log([...account.transactions()]);
```

<details><summary>Show Answer</summary>

```
[ 100, 50 ]
```

**Explanation:** `this` inside a generator method follows the exact same rules as `this` in any regular method (see [thisExample.md](thisExample.md)) — it's determined by how the generator function is *called*, not by anything generator-specific. Here `account.transactions()` is called as a method, so `this` is `account` throughout the generator's body, across every `yield`, exactly as it would be in a non-generator method.

</details>

---

## Cleanup: `for...of` and Early `break`

### Question 12 — Breaking Out of a `for...of` Loop Early Triggers `.return()`

```javascript
function* gen() {
    try {
        yield 1;
        yield 2;
        yield 3;
    } finally {
        console.log('cleanup ran');
    }
}

for (const v of gen()) {
    console.log(v);
    if (v === 2) break;
}
```

<details><summary>Show Answer</summary>

```
1
2
cleanup ran
```

**Explanation:** `3` never logs — the loop `break`s after `v === 2`. But notice `'cleanup ran'` still logs, even though the generator was never allowed to run to completion or hit its `return`. `for...of` (and the spread operator) automatically call `.return()` on a generator whenever they stop consuming it early — whether that's a `break`, a `return` inside the loop body, or an exception thrown out of the loop. `.return()` behaves like forcing a `return` statement at the generator's current paused position, which is why the `finally` block still runs: it's the same guarantee a normal `try/finally` gives on any early `return`.

**Why this matters in practice:** this is exactly the mechanism that makes generators safe to use for resource cleanup (closing a file handle, a DB cursor, a network stream) even when a consumer stops iterating partway through — as long as the cleanup logic lives in a `finally` block wrapped around the `yield`s.

</details>

---

## Practical Use Cases

### Question 13 — Lazy Infinite Sequences

```javascript
function* idGenerator() {
    let id = 1;
    while (true) {
        yield id++;
    }
}

const ids = idGenerator();
console.log(ids.next().value, ids.next().value, ids.next().value);
```

<details><summary>Show Answer</summary>

```
1 2 3
```

**Explanation:** `idGenerator` describes an infinite sequence, but nothing about that is dangerous here — unlike a `while (true)` loop written outside a generator (which would hang forever), each `.next()` call only computes exactly one more value and then pauses again. This is a genuinely common real-world pattern for unique ID generation, cursor/pagination tokens, or any "give me the next one, on demand" sequence where materializing the whole thing upfront isn't possible or desirable.

</details>

### Question 14 — `yield*` Can Also Capture the Delegated Generator's Return Value

```javascript
function* inner() {
    yield 1;
    yield 2;
    return 'inner done';
}

function* outer() {
    const result = yield* inner();
    console.log('delegated return value:', result);
}

console.log([...outer()]);
```

<details><summary>Show Answer</summary>

```
delegated return value: inner done
[ 1, 2 ]
```

**Explanation:** `yield*` doesn't just forward every *yielded* value from `inner` out through `outer` (already covered in the `yield*` section above) — as an *expression*, `yield* inner()` also evaluates to whatever `inner` eventually `return`s, once `inner` is fully exhausted. That's why `result` captures `'inner done'`, not `undefined`. This is easy to miss since `return`ed values are otherwise invisible to `for...of`/spread (see Question 3) — but `yield*` specifically exposes it to the delegating generator, even though it's still hidden from anything consuming `outer()` itself from the outside.

</details>
