# Async/Await in JavaScript

### Async/Await

- `async/await` is syntactic sugar built on top of **Promises**. It provides a cleaner and more readable way to write asynchronous code compared to chaining `.then()` and `.catch()`.

- It makes asynchronous code **look and read like synchronous code**, while still remaining non-blocking.

- An `async` function executes **synchronously** until it encounters the first `await`.
- When execution reaches `await expression`, five things happen, strictly in this order:

  ```
  await expression OR await expression()
       │
       ▼
  1. Evaluate `expression` immediately, synchronously.
     (If it's a function call, that function's entire synchronous
      body runs right now)
       │
       ▼
  2. Convert the result to a Promise, via Promise.resolve(result)
     (a no-op if it's already a native Promise).
       │
       ▼
  3. Suspend the current async function right here, unconditionally —
     regardless of whether that Promise is already settled or still
     pending. Control returns to the caller immediately.
       │
       ▼
  4. Once that Promise settles (fulfills or rejects) — whether that
     takes zero extra ticks (already-resolved) or many (a pending
     setTimeout/fetch/etc.) — the rest of the async function is
     enqueued as a microtask.
       │
       ▼
  5. When that microtask's turn comes up on the queue, execution
     resumes right after the `await`, with the settled value
     (or the async function's `await` throws, if it rejected).
  ```

> **Note:** `await` does **not** block the JavaScript thread. It only pauses the execution of the current `async` function. Other synchronous code, event loop tasks, and microtasks can continue to execute while the function is suspended.
>
> **Common misreading to avoid:** step 3 always suspends — even when the awaited value is already a settled, non-pending promise (verified in Question 23 further down: `await` on an already-resolved promise still costs a real microtask hop, never resumes synchronously in place). What differs between "already settled" and "still pending" is only *how long* step 4 takes to fire — not *whether* the function suspends or *whether* a microtask gets queued at all.


## Prerequisite: A Promise's Executor Runs Synchronously, Immediately

Before tracing through *any* execution-order question in this file — or [Asynchronous.md](Asynchronous.md) — one fact needs to be second nature:

> **A `Promise`'s executor function starts running the instant `new Promise(...)` is evaluated — synchronously, during normal code execution, not during any separate "memory creation phase," and not deferred to later like a callback.**

`new Promise((resolve, reject) => { ... })` does **not** create a dormant, "paused" promise waiting to be triggered — the `(resolve, reject) => { ... }` function passed in (the **executor**) is called immediately, right then, as part of the line that creates it. Only the *asynchronous work happening inside* that executor (a `setTimeout`, a `fetch`, an event handler) is what's actually deferred — the executor function itself is 100% synchronous.

This single fact is *why* Question 19/Question 20 (further down) behave the way they do — both `promise1` and `promise2` there start their `setTimeout` timers the moment each is constructed, not when they're later `await`ed.

### Example 1 — Promise Executors Run When Reached, Not When the Function Is Defined

```javascript
function foo() {
    const p1 = new Promise((resolve) => {
        console.log("P1 started");
        resolve(1);
    });

    const p2 = new Promise((resolve) => {
        console.log("P2 started");
        resolve(2);
    });

    console.log("Function end");
}

console.log("Before");
foo();
console.log("After");
```

<details><summary>Show Answer</summary>

```
Before
P1 started
P2 started
Function end
After
```

**Explanation:** `p1`'s executor doesn't run when `foo` is *defined* — it runs only once execution actually reaches that `const p1 = new Promise(...)` line, inside a real call to `foo()`. Same for `p2`. Both executors run synchronously and in order, interleaved with the rest of `foo`'s own synchronous code — there's nothing asynchronous about *creating* a promise, only about what might happen inside it.

</details>

### Example 2 — Executors Run Synchronously, Even Without Ever Resolving

```javascript
function foo() {
    console.log("Function Start");

    const p1 = new Promise(() => {
        console.log("Promise1");
    });

    const p2 = new Promise(() => {
        console.log("Promise2");
    });

    console.log("Function End");
}

foo();
```

<details><summary>Show Answer</summary>

```
Function Start
Promise1
Promise2
Function End
```

**Explanation:** neither executor here even calls `resolve` or `reject` — these promises stay pending forever. That doesn't matter for this example: `"Promise1"` and `"Promise2"` still log **synchronously**, interleaved with `"Function Start"`/`"Function End"`, proving the executor itself runs immediately regardless of whether (or when) the promise ever actually settles.

**A common misconception:** people often assume promises are inherently asynchronous. They're not — a `Promise` is just an object with a synchronously-run constructor function. Only the *settlement* (and any genuinely async work inside the executor, like `setTimeout` or `fetch`) can happen later.

</details>

### Example 3 — Only the Async Work *Inside* the Executor Is Deferred

```javascript
function foo() {
    const p = new Promise((resolve) => {
        console.log("Executor starts");

        setTimeout(() => {
            console.log("Timer");
            resolve();
        }, 1000);

        console.log("Executor ends");
    });

    console.log("Function End");
}

foo();
```

<details><summary>Show Answer</summary>

```
Executor starts
Executor ends
Function End
Timer
```

**Explanation:** the executor itself runs immediately and fully synchronously — `"Executor starts"` and `"Executor ends"` both log before `foo()` even returns. `setTimeout` inside it only *registers* a timer and returns right away; it doesn't pause the executor to wait for the timer. `"Function End"` (from after `foo()`'s call to the promise constructor) logs next, and only once the real 1-second delay elapses does the timer's callback run, logging `"Timer"` and finally resolving the promise — long after the executor function itself had already finished running.

</details>

## Basic Concepts

### Async Functions

- **Async functions always return a promise** even if you return a normal value
- **Returned values** other than promises are wrapped in a resolved promise automatically

```javascript
async function getFairyName() {
    return 'Your Grace'
}

// Equivalent to:
function getFairyNameEquiv() {
    return Promise.resolve('Your Grace')
}
```

### Await Keyword

- **Can only be used inside async functions**
- **Literally stops execution** until the promise is settled (resolved or rejected)
- **Assigns the resolved value** to the variable and moves to the next line

## Async/Await vs .then()

### Key Differences:

1. **`.then()`**: Gets executed when call stack is empty (microtask queue). Program execution doesn't stop.

2. **`await`**: Literally stops execution until promise is settled, then continues.

## Practice Questions

### Question 1

What will be the output and in what order?

```javascript
(async () => {
    const promise = Promise.resolve('I have resolved')
    promise.then(msg => console.log(msg))
    console.log("Switch coming")
    console.log('Paisa');
})()
```

<details>
<summary>Show Answer</summary>

```
Switch coming
Paisa
I have resolved
```

**Explanation:** The `.then()` callback is added to the microtask queue and executes after the synchronous code completes.

</details>

### Question 2

What will be the output and in what order?

```javascript
(async () => {
    const promise = Promise.resolve('I have resolved')
    console.log(await promise)
    console.log("Switch coming")
    console.log('Paisa')
})()
```

<details>
<summary>Show Answer</summary>

```
I have resolved
Switch coming
Paisa
```

**Explanation:** `await` pauses execution until the promise resolves, then continues sequentially.

</details>

### Question 3

What will be the output and in what order?

```javascript
(async () => {
    const promise = Promise.resolve('I have resolved')
    
    promise.then(msg => console.log('.then', msg))
    console.log("Switch coming")
    console.log('Paisa');
    
    console.log(await promise)
    console.log("Switch coming")
    console.log('Paisa')
})()
```

<details>
<summary>Show Answer</summary>

```
Switch coming
Paisa
.then I have resolved
I have resolved
Switch coming
Paisa
```

**Explanation:** Synchronous code runs first, then `.then()` from microtask queue, then `await` resumes execution.

**Why does `.then()` run before `await`?** Both ultimately rely on the same microtask queue, so it comes down to *when* each callback is actually queued:
- `promise.then(msg => ...)` queues its callback immediately, the moment that line runs.
- `await promise` only queues its "resume the async function" continuation *after* that — it's a later line in the same synchronous block.

Since the microtask queue is FIFO (first-in, first-out), whichever gets queued first runs first:

```
Microtask queue (in order):
1. .then() callback        ← queued first
2. resume async function   ← queued second, on the await line
```

So in this example, `.then()`'s callback always wins the race — not because `.then()` is inherently "faster" than `await`, but purely because it was registered earlier in the synchronous code.

</details>


### Question 4 — Do Multiple `await`s in a Row Also Pause on Already-Fulfilled Promises?

```javascript
async function foo() {
    const p1 = new Promise((resolve) => {
        console.log("P1 started");
        resolve(1);
    });

    const p2 = new Promise((resolve) => {
        console.log("P2 started");
        resolve(2);
    });

    console.log("P1 res", await p1);
    console.log("P2 res", await p2);

    console.log("Function end");
}

console.log("Before");
foo();
console.log("After");
```

<details><summary>Show Answer</summary>

```
Before
P1 started
P2 started
After
P1 res 1
P2 res 2
Function end
```

**Rule for this question:** an `async` function runs **synchronously up until its first `await`** — everything before that point (including any `new Promise(...)` executors, which are themselves always synchronous per the [prerequisite section](#prerequisite-a-promises-executor-runs-synchronously-immediately)) executes immediately, in order, with no microtask hop at all. Only once execution actually *hits* an `await` does the function pause and hand control back to the caller.

Step by step:

**Step 1 — Global code starts.**
```javascript
console.log("Before");
```
Output so far: `Before`

**Step 2 — `foo()` is called.** A new execution context is pushed. Nothing has run inside it yet.

**Step 3 — First statement inside `foo`: `const p1 = new Promise(...)`.**
`new Promise(...)` immediately invokes its executor — synchronously, right here:
```javascript
console.log("P1 started"); // runs now
resolve(1);                 // p1 settles: fulfilled, value 1
```
Output so far: `Before`, `P1 started`

**Step 4 — Next statement: `const p2 = new Promise(...)`.**
Same thing happens again, immediately:
```javascript
console.log("P2 started"); // runs now
resolve(2);                 // p2 settles: fulfilled, value 2
```
Output so far: `Before`, `P1 started`, `P2 started`

At this point, **both `p1` and `p2` already exist and are already fulfilled** — but `foo` hasn't paused even once yet, because it hasn't reached an `await` yet.

**Step 5 — Execution reaches `console.log("P1 res", await p1)`.**
This is the **first `await`** in `foo` — and per the rule, hitting it *always* pauses the function, even though `p1` is already fulfilled. `await` doesn't check "is this already done, so I can skip pausing" — it unconditionally schedules the rest of the function as a microtask and returns control to the caller immediately. Roughly:
```javascript
p1.then(value => { /* resume the rest of foo() from here */ });
```
`foo()` itself (the call in global code) returns its own (still-pending) promise right away. Global execution continues.

**Step 6 — Global code continues: `console.log("After")`.**
Output so far: `Before`, `P1 started`, `P2 started`, `After`

Global synchronous code is now finished — the call stack is empty.

**Step 7 — Event loop drains the microtask queue.** The queued "resume `foo`" continuation runs. `await p1` resolves to `1`, so:
```javascript
console.log("P1 res", 1); // "P1 res 1"
```
Output so far: `... After`, `P1 res 1`

Execution immediately continues to the *next* line — `console.log("P2 res", await p2)`. This is `foo`'s **second `await`**, and the same rule applies again: even though `p2` was fulfilled all the way back in Step 4, `await p2` still unconditionally pauses the function and queues another "resume" continuation as a *new* microtask — it does not resume synchronously just because `p2`'s value is already sitting there ready.

**Step 8 — Event loop picks up that next microtask.** `await p2` resolves to `2`:
```javascript
console.log("P2 res", 2); // "P2 res 2"
console.log("Function end");
```
Final output: `Before`, `P1 started`, `P2 started`, `After`, `P1 res 1`, `P2 res 2`, `Function end`

**The key takeaway:** two separate rules are stacked in this example — (1) an async function runs synchronously up to its first `await`, so both promise executors log *before* `"After"` ever prints; and (2) every single `await`, even on an already-settled promise, costs one full microtask hop to resume (the same rule verified in Question 23) — which is why `"P1 res 1"` and `"P2 res 2"` are each on their own separate microtask turn, both landing *after* `"After"`, not interleaved with the synchronous portion at all.

</details>

### Question 5 — Same Setup, but No `await` at All

```javascript
async function foo() {
    const p1 = new Promise((resolve) => {
        console.log("P1 started");
        resolve(1);
    });

    const p2 = new Promise((resolve) => {
        console.log("P2 started");
        resolve(2);
    });

    p1.then(res => console.log(".then res", res))

    console.log("Function end");
}

console.log("Before");
foo();
console.log("After");
```

<details><summary>Show Answer</summary>

```
Before
P1 started
P2 started
Function end
After
.then res 1
```

**Explanation:** with no `await` anywhere inside it, `foo` never pauses at all — it runs synchronously from start to finish in a single go, just like a regular function call. `p1.then(...)` only *registers* a microtask callback; it doesn't pause `foo` to wait for it. So `"Function end"` logs immediately, `foo()` returns (a promise, since it's `async`, but nothing is awaiting it here), and `"After"` logs right after. Only once the synchronous script finishes does the event loop drain the microtask queue and run `.then()`'s callback last.

</details>

### Question 6 — Adding Back a Single `await`, After the `.then()` Registration

```javascript
async function foo() {
    const p1 = new Promise((resolve) => {
        console.log("P1 started");
        resolve(1);
    });

    const p2 = new Promise((resolve) => {
        console.log("P2 started");
        resolve(2);
    });

    p1.then(res => console.log(".then res", res))
    console.log("P2 res", await p2)

    console.log("Function end");
}

console.log("Before");
foo();
console.log("After");
```

<details><summary>Show Answer</summary>

```
Before
P1 started
P2 started
After
.then res 1
P2 res 2
Function end
```

**Explanation:** this time `foo` does hit an `await` (on `p2`), so — same rule as Question 4 — it pauses there and hands control back, letting `"After"` log before anything queued resolves. Two microtasks are now competing: `p1.then(...)`'s callback (registered first, on the line before the `await`) and the "resume `foo` after `await p2`" continuation (queued second, when the `await` line runs). Since the microtask queue is FIFO, `.then()`'s callback — queued earlier — runs first (`".then res 1"`), and only after that does `foo` resume with `"P2 res 2"` followed by `"Function end"`.

</details>

---

## `await Promise.resolve()` vs. `return Promise.resolve()` Inside an `async` Function

Before tackling Question 7 (and everything after it — this section is the missing piece that makes the rest of the file click), one more distinction needs to be second nature: **awaiting an already-resolved promise directly** behaves differently from **awaiting a call to an `async` function that itself `return`s an already-resolved promise.** They look almost identical, but they don't resolve on the same microtask turn — because of *when the outer `async` function's own promise actually settles*.

### Case 1 — `await Promise.resolve()` Directly

```javascript
async function foo() {
  await Promise.resolve();
  console.log("done");
}

foo();

Promise.resolve().then(() => {
  console.log("then");
});
```

<details><summary>Show Answer</summary>

```
done
then
```

**Step by step:**

1. `foo()` is called and runs synchronously up to `await Promise.resolve()`.
2. The expression `Promise.resolve()` is evaluated — it's an **already-fulfilled** promise.
3. Because it's already fulfilled, `foo`'s continuation (`console.log("done")`) is queued as a microtask right away. Queue so far: `[resume foo]`.
4. Global code continues: `Promise.resolve().then(() => console.log("then"))` registers its own callback, appended to the queue: `[resume foo, then callback]`.
5. Microtasks drain in FIFO order: `foo` resumes first → `"done"` logs, then the `.then()` callback runs → `"then"` logs.

**Why:** the promise being awaited is already fulfilled at the moment `await` evaluates it, so `foo`'s continuation gets queued immediately — nothing has to wait for it to "become" fulfilled.

</details>

### Case 2 — `return Promise.resolve()` From a Called `async` Function

```javascript
async function foo() {
  console.log("foo");

  return Promise.resolve();
}

async function main() {
  await foo();

  console.log("after");
}

main();

Promise.resolve().then(() => {
  console.log("then");
});
```

<details><summary>Show Answer</summary>

```
foo
then
after
```

**Step by step:**

1. `main()` calls `foo()` — per the [prerequisite rule](#prerequisite-a-promises-executor-runs-synchronously-immediately) about `await` evaluating its expression first, `foo()`'s body runs synchronously: `"foo"` logs, then it hits `return Promise.resolve()`.
2. Here's the subtlety: **an `async` function always has its *own* promise** — the one `foo()` itself returns to its caller. `return Promise.resolve()` doesn't make that outer promise simply *be* `Promise.resolve()`; instead, `foo`'s own promise **adopts** the state of the returned promise. That adoption is *not* instantaneous — it itself takes a microtask tick to resolve, even though the returned promise was already fulfilled.
3. So at this point, `foo()`'s own promise is *not yet* settled — it's waiting on that adoption step. `main`'s `await foo()` therefore has nothing settled to resume on yet; no "resume main" continuation is queued.
4. Global code continues: `Promise.resolve().then(() => console.log("then"))` registers its callback — queued *before* anything related to `main`'s resumption, since that still hasn't been queued.
5. The adoption step finishes (this is its own microtask turn), and *only now* does `foo()`'s own promise actually settle — which is what finally lets `main`'s `await foo()` queue its own "resume main" continuation.
6. Draining the queue in order: the standalone `.then()` callback runs → `"then"` logs. Then `main` finally resumes → `"after"` logs, last.

**Why:** `return Promise.resolve()` inside an `async` function is not the same as directly awaiting that promise. The `async` function's own returned promise has to *adopt* the state of whatever promise it returns, and that adoption costs an extra microtask hop — verified above: `main`'s `"after"` lands two ticks later than the standalone `.then()`'s `"then"`, even though both ultimately depend on an already-resolved `Promise.resolve()`.

</details>

### Side-by-Side Comparison

| | Case 1: `await Promise.resolve()` | Case 2: `await foo()` where `foo` returns `Promise.resolve()` |
|---|---|---|
| What's actually awaited | The already-fulfilled promise itself | `foo`'s *own* promise, which must first adopt the returned promise's state |
| Extra adoption step? | No | Yes — one extra microtask hop |
| When does the continuation get queued? | Immediately, since the awaited promise is already fulfilled | Only after `foo`'s own promise finishes adopting the returned promise's state |

**Key takeaways:**
- `await` always evaluates its expression first, then pauses — consistent with the rule at the top of this file.
- If the *directly* awaited promise is already fulfilled, the continuation is queued right away, with no extra delay.
- `return somePromise` inside an `async` function does **not** make that function's own returned promise *be* `somePromise` — every `async` function has its own promise, which *adopts* the state of whatever it returns. That adoption step costs a real microtask tick, even for an already-resolved promise.
- Because of this, code that `await`s a called `async` function can resume **later** than code that awaits an equivalent already-resolved promise directly — this is exactly the mechanism Question 7 below builds on.

---

### Question 7 — `await someAsyncCall()` Runs the Call Synchronously First

The rule at the top of this file is easy to misread as "`await` immediately pauses the function." It doesn't — **the expression to the right of `await` is evaluated completely, synchronously, first.** If that expression is a call to another function, that function's entire synchronous body runs — right then, on the spot — before `await` has anything to actually suspend on.

```javascript
async function foo() {
  console.log("foo start");

  await bar();

  console.log("foo end");
}

async function bar() {
  console.log("bar");

  return Promise.resolve();
}

foo();

Promise.resolve().then(() => {
  console.log("then");
});

console.log("end");
```

<details><summary>Show Answer</summary>

```
foo start
bar
end
then
foo end
```

**Timeline:**

```
Synchronous phase (call stack):
  foo() called
    → "foo start" logs
    → reaches `await bar()` — before foo can suspend, bar() must be CALLED and
      RUN first, since it's the expression being awaited
    → bar() runs synchronously:
        → "bar" logs
        → returns Promise.resolve() — a new, already-fulfilled promise
    → NOW foo has a promise to await — THIS is the point foo actually suspends
    → foo() call returns (a pending promise) — control back to caller
  Promise.resolve().then(() => log "then")  →  microtask #1 queued
  "end" logs
Call stack empty — synchronous phase over.

Microtask queue drains:
  Turn 1: "then" runs (microtask #1 — was queued first, before foo's own
          continuation ever got queued)
  Turn 2: foo's `await bar()` continuation finally runs → "foo end" logs
```

**Explanation:** `bar` is only a *regular* `async` function call here — `bar()` itself never hits an `await` internally (it just returns `Promise.resolve()`, no suspension inside `bar` at all). So the entire body of `bar` — including `console.log("bar")` — executes synchronously, as part of evaluating the expression `bar()`, before `foo`'s `await` even has a promise to suspend on. That's why `"bar"` logs immediately after `"foo start"`, in the *same* synchronous burst — well before `"end"`.

Once `bar()` returns its promise, *that's* the moment `foo` actually pauses and hands control back — so `"end"` (from the outer synchronous code, which runs after `foo()` returns control) logs next. The externally-registered `Promise.resolve().then(...)` was queued *before* `foo`'s own resume-continuation (since `foo`'s continuation is only queued once `bar()` has finished running and returned its promise, which happens slightly later), so `"then"` wins the race and logs before `"foo end"`.

</details>

### Question 8 — Now `bar` Itself Awaits Something

```javascript
async function bar() {
  console.log("bar start");

  await Promise.resolve();

  console.log("bar end");
}

async function foo() {
  console.log("foo start");

  await bar();

  console.log("foo end");
}

foo();

console.log("end");
```

<details><summary>Show Answer</summary>

```
foo start
bar start
end
bar end
foo end
```

**Timeline:**

```
Synchronous phase (call stack):
  foo() called
    → "foo start" logs
    → reaches `await bar()` — must call and run bar() first
    → bar() runs synchronously, up to ITS first await:
        → "bar start" logs
        → reaches `await Promise.resolve()` — bar suspends HERE
    → bar() call returns (a pending promise) back to foo's `await` expression
    → foo now has bar's pending promise to await — foo ALSO suspends here
    → foo() call returns — control back to caller
  "end" logs
Call stack empty — synchronous phase over.

Microtask queue drains:
  Turn 1: bar's `await Promise.resolve()` continuation runs → "bar end" logs,
          bar's own returned promise now resolves
  Turn 2: foo's `await bar()` continuation runs (now that bar's promise
          resolved) → "foo end" logs
```

**Explanation:** unlike Question 7, `bar` here has its own internal `await` — so calling `bar()` does **not** run its entire body synchronously. `bar` runs up to `console.log("bar start")`, hits its own `await Promise.resolve()`, and suspends right there, handing control back up to `foo`'s `await bar()` expression with a still-pending promise. `foo` then also suspends, waiting on that promise. Since neither function can finish synchronously, `"end"` (the outer synchronous code) logs before either `"bar end"` or `"foo end"` — both of which only resolve later, across two separate microtask turns: first `bar` resumes and finishes (unblocking its own returned promise), and only then can `foo`'s `await` on `bar()`'s promise resolve in turn.

**Contrast with Question 7:** the deciding factor isn't "does `foo` await an async function" in both cases — it's **whether the awaited function itself contains an `await`**. `bar()` with no internal `await` (Question 7) runs fully synchronously when called, so only `foo`'s own `await` causes any suspension. `bar()` *with* an internal `await` (this question) suspends on its own, which cascades — `foo` can't resume until `bar` does, adding an extra microtask hop to the whole chain.

</details>

### Question 9 — A Fire-and-Forget `.then()` Inside the Awaited Function

```javascript
async function bar() {
  console.log("bar");

  Promise.resolve().then(() => {
    console.log("inside then");
  });
}

async function foo() {
  console.log("foo");

  await bar();

  console.log("foo end");
}

foo();

console.log("end");
```

<details><summary>Show Answer</summary>

```
foo
bar
end
inside then
foo end
```

**Explanation:** `bar` has no `await` of its own, so — per Question 7's rule — calling `bar()` runs its entire body synchronously: `"bar"` logs, and `Promise.resolve().then(...)` merely *registers* a microtask before `bar` returns. Crucially, `bar` never `return`s that `.then()` chain — it implicitly returns `undefined`. So `foo`'s `await bar()` is really awaiting `Promise.resolve(undefined)`, which is completely unrelated to (and doesn't wait for) the detached `.then()` callback still sitting in the microtask queue.

Two independent microtasks are now queued once the synchronous phase ends (`"end"` logs): `bar`'s fire-and-forget `.then()` callback (queued first, while `bar()` was running) and `foo`'s own `await` continuation (queued right after, once `bar()` returned). FIFO order means `"inside then"` runs before `"foo end"` — but this is coincidental ordering from *registration order*, not because `foo` is actually waiting on that `.then()` chain. Verify this distinction in Question 10, where making `bar` slower proves `foo end` doesn't actually depend on it.

</details>

### Question 10 — Contrast: `bar` *Returning* the `.then()` Chain Instead

```javascript
async function bar() {
  console.log("bar");

  return Promise.resolve().then(() => {
    console.log("then");
  });
}

async function foo() {
  console.log("foo");

  await bar();

  console.log("foo end");
}

foo();

console.log("end");
```

<details><summary>Show Answer</summary>

```
foo
bar
end
then
foo end
```

**Explanation:** with only a single `.then()` hop, this happens to *print* identically to Question 9 — but the mechanism is genuinely different, and it matters the moment the chain gets longer or slower. Here `bar` explicitly `return`s the `.then()` chain, so `bar()`'s returned promise **is** that chain — `foo`'s `await bar()` only resolves once the whole `.then()` chain has actually settled, not just once `bar`'s synchronous body finishes.

**Proof the mechanism differs (try extending each chain by two more `.then(() => Promise.resolve())` hops before the final log):** in Question 9's fire-and-forget version, `"foo end"` would still log *before* the extended chain's final callback — `foo` genuinely never waits for it. In this version, `"foo end"` would move to *after* the extended chain finishes, since `foo` is now truly waiting on it via `bar`'s `return`. **The takeaway:** whether an awaited function's internal promise work actually delays the caller depends entirely on whether that work is `return`ed (chained into the awaited promise) or just fired off as a disconnected side effect.

</details>

### Question 11 — `await` vs. `.then()` Registered on the Same Returned Promise

```javascript
async function foo() {
  console.log(1);

  await Promise.resolve();

  console.log(2);
}

foo().then(() => {
  console.log(3);
});

console.log(4);
```

<details><summary>Show Answer</summary>

```
1
4
2
3
```

**Explanation:** `foo()` runs synchronously up to its `await`, logging `1`. It then suspends (step 3 of the rule above) and returns its own (still-pending) promise back to the caller — `.then(() => console.log(3))` is registered on *that* promise, right away. Global code continues: `console.log(4)` runs next. Once the microtask queue drains, `foo`'s own `await Promise.resolve()` continuation resumes first, logging `2` — and only *after* `foo` finishes (and its returned promise consequently settles) does the externally-attached `.then()` get to run, logging `3` last.

</details>

### Question 12 — A Non-Async Function Returning a Plain Value, Awaited via `.then()`

```javascript
async function foo() {
  console.log("foo");

  return 100;
}

console.log(1);

foo().then((value) => {
  console.log(value);
});

console.log(2);
```

<details><summary>Show Answer</summary>

```
1
foo
2
100
```

**Explanation:** `foo` has no `await` at all, so calling `foo()` runs it fully synchronously — `"foo"` logs immediately, right in the middle of the outer synchronous code (after `1`, before `2`). Since `foo` is declared `async`, its `return 100` is automatically wrapped as `Promise.resolve(100)` (per the [prerequisite rules](#basic-concepts) — every async function always returns a promise). The externally-attached `.then(value => ...)` still only runs later, as a microtask, once the synchronous phase (`1`, `foo`, `2`) has fully finished — so `100` logs last.

</details>

### Question 13 — Nested `await`s Where the Inner Function Also Returns a Value

```javascript
async function foo() {
  console.log("foo start");

  await Promise.resolve();

  console.log("foo end");

  return 10;
}

async function main() {
  console.log("main");

  const value = await foo();

  console.log(value);
}

main();

Promise.resolve().then(() => {
  console.log("then");
});

console.log("end");
```

<details><summary>Show Answer</summary>

```
main
foo start
end
foo end
then
10
```

**Explanation:** `main()` runs synchronously into `foo()`, which itself runs synchronously up to its own `await Promise.resolve()` — logging `"main"` then `"foo start"`. At that point `foo` suspends (and so does `main`, waiting on `foo`'s promise), control returns, and `"end"` logs. The standalone `Promise.resolve().then(...)` is registered *after* this — right on the next line of the outer synchronous code.

Once the microtask queue drains: `foo`'s own `await` continuation resumes first (it was queued earliest, while `main` was still running), logging `"foo end"` and causing `foo` to return `10` (wrapped as a resolved promise). The standalone `.then()` (registered second) runs next, logging `"then"`. Only *after* that does `main`'s `await foo()` get to resume — because `main`'s continuation was queued only once `foo`'s promise actually settled, which happens strictly after both of the above — logging `10` last.

</details>

### Question 14 — A Fire-and-Forget `.then()` Registered *Before* an `await` Inside the Same Function

```javascript
async function first() {
  console.log("first");

  await second();

  console.log("after second");
}

async function second() {
  console.log("second");

  Promise.resolve().then(() => {
    console.log("then inside second");
  });

  await Promise.resolve();

  console.log("second end");
}

first();

Promise.resolve().then(() => {
  console.log("global then");
});

console.log("end");
```

<details><summary>Show Answer</summary>

```
first
second
end
then inside second
second end
global then
after second
```

**Explanation:** `first()` runs into `second()` synchronously — `"first"` then `"second"` log immediately. Inside `second`, the fire-and-forget `.then()` is registered *before* `second`'s own `await Promise.resolve()` — so by the time `second` actually suspends, two things are already true: a fire-and-forget microtask is queued (`"then inside second"`), and `second` itself is paused, about to queue its own resume-continuation once its `await` settles. Control bubbles back to `first`, which is also now suspended (awaiting `second()`'s still-pending promise), then to the outer synchronous code, which registers the `"global then"` microtask and logs `"end"`.

Now three microtasks race in registration order: `second`'s fire-and-forget `.then()` (queued first, inside `second`, before its own `await`) → `second`'s own `await` continuation (queued next) → the outer `"global then"` (queued last, after `second()`/`first()` had already returned control). They resolve in exactly that order: `"then inside second"`, then `second` resumes and logs `"second end"` (which settles `second`'s returned promise), then `"global then"`, and only *after all of that* does `first`'s `await second()` finally get to resume — logging `"after second"` last, since `first`'s continuation was only queued once `second`'s promise settled, which happened after the other two were already ahead of it in line.

</details>

### Question 15 — Two Fire-and-Forget `.then()`s Straddling an `await`

```javascript
async function a() {
  console.log("A1");

  await b();

  console.log("A2");
}

async function b() {
  console.log("B1");

  Promise.resolve().then(() => {
    console.log("B2");
  });

  await Promise.resolve();

  console.log("B3");

  Promise.resolve().then(() => {
    console.log("B4");
  });
}

a();

Promise.resolve().then(() => {
  console.log("P1");
});

console.log("END");
```

<details><summary>Show Answer</summary>

```
A1
B1
END
B2
B3
P1
B4
A2
```

**Explanation:** synchronous phase first: `a()` calls `b()`, both run into their first suspension point — `"A1"`, `"B1"` log, `b` registers its first fire-and-forget `.then()` (`B2`) and then hits its own `await Promise.resolve()` and suspends. Control bubbles all the way back out; `a` is also now suspended (awaiting `b()`), and `"END"` logs from the outer code, after registering its own `Promise.resolve().then(...)` for `"P1"`.

Now trace the microtask queue strictly in registration order:
1. `B2`'s callback (registered first, inside `b`, before `b`'s own `await`) → logs `"B2"`.
2. `b`'s own `await Promise.resolve()` continuation (registered second) resumes → logs `"B3"`, then registers a *new* fire-and-forget `.then()` for `"B4"` (queued now, at the *end* of the current queue), and `b` finishes — its returned promise settles.
3. `"P1"`'s callback (registered third, from the outer code) → logs `"P1"`.
4. `"B4"`'s callback (registered fourth — during step 2 above, after `B2`/`b`'s-own-continuation/`P1` were already ahead of it) → logs `"B4"`.
5. Only now does `a`'s `await b()` continuation get to run — queued only once `b()`'s promise settled back in step 2, but that placed it *behind* `P1` and `B4` in the queue, since those were both already registered by the time `b` finished → logs `"A2"` last.

**Key insight:** each microtask, once it starts running, can itself register brand-new microtasks (like `B4` here) that go to the *back* of the queue — they don't jump ahead of things already waiting, even things that were registered later than the code that spawned them but earlier than the new task itself hit the queue. Tracing this kind of question requires literally maintaining the queue as a FIFO list and updating it step by step — there's no shortcut.

</details>

### Question 16 — Combining Everything: `await`, `.then()`, `setTimeout`, and a `new Promise` Executor

```javascript
async function async1() {
    console.log("async1 started");
    await async2().then(r => console.log("hey", r));
    console.log("async1 ended");
}

async function async2() {
    console.log("async 2");
}

console.log("started");

setTimeout(() => {
    console.log("Settimeout")
}, 0);

new Promise((resolve, reject) => {
    console.log("Promise");
    resolve();
}).then(() => console.log("Promise ended"));

async1();

console.log("Ended");
```

<details><summary>Show Answer</summary>

```
started
Promise
async1 started
async 2
Ended
Promise ended
hey undefined
async1 ended
Settimeout
```

**Explanation:** trace the synchronous phase in strict top-to-bottom order:
1. `"started"` logs.
2. `setTimeout(...)` registers a **macrotask** (lowest priority — see [eventLoop.md](eventLoop.md) for the microtask-vs-macrotask queue distinction) and returns immediately; nothing logs yet.
3. `new Promise((resolve, reject) => { ... })` — per the [prerequisite section](#prerequisite-a-promises-executor-runs-synchronously-immediately), its executor runs immediately: `"Promise"` logs, `resolve()` is called. `.then(...)` is registered on the now-fulfilled promise (queued as microtask #1).
4. `async1()` is called — runs synchronously: `"async1 started"` logs, then reaches `await async2().then(...)`. Per the rule at the top of this file, the expression to the right of `await` is evaluated *fully* first: `async2()` is called and runs synchronously (`"async 2"` logs, implicitly returns `Promise.resolve(undefined)`), and `.then(r => console.log("hey", r))` is immediately chained onto it (queued as microtask #2). *Then*, and only then, does `async1` actually suspend on the combined `.then()`-chain promise.
5. Back in the outer synchronous code: `"Ended"` logs.

Synchronous phase over — microtask queue drains in registration order:
- Microtask #1: the `new Promise(...)`'s `.then()` → logs `"Promise ended"`.
- Microtask #2: `async2().then(...)` → logs `"hey undefined"` (`async2` never explicitly returns anything, so `r` is `undefined`), which settles the promise `async1` is awaiting.
- `async1`'s own `await` continuation (queued only now, once step 2's promise settled) → logs `"async1 ended"`.

Only after the microtask queue is completely empty does the event loop turn to the macrotask queue: the `setTimeout` callback finally runs, logging `"Settimeout"` last — even though it was registered *first*, at the very top of the script.

</details>

## Error Handling

### Try-Catch-Finally with Async/Await

```javascript
try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
} catch (err) {
    console.log('Error:', err);
} finally {
    console.log("Cleanup code here");
}
```

### Question 17

What will be the output?

```javascript
const promiseObj = new Promise((res, rej) => {
    setTimeout(() => {
        res("resolved after 200ms")
    }, 200)
});

(async () => {
    try {
        const res = await promiseObj
        if (typeof res === 'string') {
            console.log('string', res)
            return
        }
        if (typeof res === 'number') {
            console.log('number', res)
        }
    } catch (err) {
        console.log(err.message)
    } finally {
       console.log('inside finally') 
    }
})();
```

<details>
<summary>Show Answer</summary>

```
string resolved after 200ms
inside finally
```

**Explanation:** The promise resolves with a string, so the first condition executes, then `finally` runs regardless of the return.

</details>

### Question 18

What will be the output?

```javascript
let count = 0;
function foo() {
  try {
    return count;
  } finally {
    count++;
  }
}
console.log(foo());
console.log(count);
```

<details>
<summary>Show Answer</summary>

```
0
1
```

**Explanation:** The `return count` happens first (returns 0), but `finally` still executes and increments count to 1.

</details>

## Timing and Execution Order

### Question 19

After how many seconds will each console.log execute?

```javascript
const promise1 = new Promise((res, rej) => {
    setTimeout(() => {
        res(300)
    }, 3000)
})

const promise2 = new Promise((res, rej) => {
    setTimeout(() => {
        res(500)
    }, 5000)
})

const getAns = async() => {
    const ans1 = await promise1
    console.log(ans1)
    const ans2 = await promise2
    console.log(ans2)
}

getAns()
```

<details>
<summary>Show Answer</summary>

```
300 (after 3 seconds)
500 (after 5 seconds total)
```

**Explanation:** ⚠️ This is a common mistake — the two waits do **not** add up to 8 seconds. Per the [prerequisite above](#prerequisite-a-promises-executor-runs-synchronously-immediately), `promise1`'s and `promise2`'s executors both run synchronously the moment each is constructed — so *both* `setTimeout` timers start counting at essentially the same moment, well before `getAns()` is even called, not one after another.

**Timeline:**

```
Time = 0
  Create promise1  →  its 3s timer starts
  Create promise2  →  its 5s timer starts
  Call getAns()
    → await promise1
      → getAns pauses

Time = 3
  promise1 resolves → console.log(300)
    → await promise2   (promise2's timer already has only 2s left on it!)
      → getAns pauses again

Time = 5
  promise2 resolves → console.log(500)
```

So while `getAns` spends 0–3s awaiting `promise1`, `promise2`'s own timer has been running in the background that entire time, completely independently. By the time execution reaches `await promise2` at the 3-second mark, only 2 seconds remain on its timer — resolving it at the 5-second mark total, not 3+5=8.

</details>

### Question 20

After how many seconds will each console.log execute?

```javascript
const promise1 = new Promise((res, rej) => {
    setTimeout(() => {
        res(300)
    }, 3000)
})

const promise2 = new Promise((res, rej) => {
    setTimeout(() => {
        res(500)
    }, 5000)
})

const getAns2 = async() => {
    const ans1 = await promise2
    console.log(ans1)
    const ans2 = await promise1
    console.log(ans2)
}

getAns2()
```

<details>
<summary>Show Answer</summary>

```
500 (after 5 seconds)
300 (after 5 seconds total)
```

**Explanation:** Waits 5 seconds for promise2. Meanwhile, promise1 already resolved after 3 seconds, so promise1 resolves immediately when awaited.

</details>

### Question 21 — Contrast: Creating the Promises *Inline*, Inside Each `await`

Questions 6 and 7 both pre-created `promise1`/`promise2` *before* calling the async function — so both executors (and their timers) started running at essentially the same moment. What changes if each `Promise` is constructed directly inside its own `await` expression instead?

```javascript
const getAns = async () => {
    const ans1 = await new Promise((res) => {
        setTimeout(() => res(300), 3000);
    });

    console.log(ans1);

    const ans2 = await new Promise((res) => {
        setTimeout(() => res(500), 5000);
    });

    console.log(ans2);
};

getAns();
```

<details><summary>Show Answer</summary>

```
300 (after 3 seconds)
500 (after 8 seconds total)
```

**Timeline:**

```
Time = 0
  Create Promise1 (inline)  →  its 3s timer starts
    → getAns pauses at await

Time = 3
  Promise1 resolves → console.log(300)
    → NOW we reach the second await, which creates Promise2 for the first time
    → Create Promise2 (inline)  →  its 5s timer starts only now
      → getAns pauses again

Time = 3 + 5 = 8
  Promise2 resolves → console.log(500)
```

**Explanation:** this time the total genuinely *is* 3 + 5 = 8 seconds — the opposite conclusion from Question 19, and that's the whole point of comparing them. The key difference: `new Promise(...)` for `ans2` is written directly inside the second `await` expression, so — per the [prerequisite section](#prerequisite-a-promises-executor-runs-synchronously-immediately) — its executor doesn't run, and its `setTimeout` timer doesn't start, until execution actually *reaches* that line. And execution can't reach it until `ans1`'s `await` has already resolved, 3 seconds in. So the two timers never overlap; they run back-to-back, and their delays genuinely add up.

**The rule of thumb this proves:** it was never really about "sequential `await`s always add up" or "always run in parallel" — it's specifically about **when each promise is constructed**. Promises created upfront (Question 19/20) race their timers in the background regardless of `await` order. Promises created inline, one `await` at a time (this question), can only start once the previous `await` completes — so their delays stack. This is the same underlying mechanism demonstrated with `Promise.all` in [Question 27](#question-27) further down.

</details>

## Advanced Execution Order Questions

### Question 22

What will be the output and order?

```javascript
const myPromise = () =>
  new Promise((res) => setTimeout(() => res(5), 2000));

const fun1 = async () => {
  console.log('async: start')
    try {
        const res = await myPromise()
        console.log('async: ', res)
    } catch(err) {
        console.log(err)
    } finally {
        console.log('async: finally')
    }
  console.log('async: end')
}

fun1()

const fun2 = () => {
  console.log('.then: start')
  myPromise().then(res => {
    console.log(".then: ", res)
  }).catch(err => {
    console.log(err)
  }).finally(() => {
    console.log('.then: finally')
  })
  console.log('end')
}

fun2()
```

<details>
<summary>Show Answer</summary>

<br />

| Call Stack | Microtask Queue | Callback Queue |
|------------|-----------------|----------------|
| Global | Empty | Empty |

---

#### Step 1 : `fun1()` is called

Call Stack

```
fun1
Global
```

Execute

```js
console.log("async: start");
```

Output

```
async: start
```

---

##### Next Line

```js
const res = await myPromise();
```

Before `await` pauses the function, JavaScript **evaluates the expression**.

So,

```js
myPromise()
```

executes.

Inside `myPromise`

```js
new Promise(res => {
    setTimeout(() => res(5), 2000)
})
```

##### What happens?

- Promise A is created.
- `setTimeout` registers a timer.
- Timer callback goes to the **Web APIs**.

Current State

| Call Stack | Microtask Queue | Callback Queue |
|------------|-----------------|----------------|
| fun1 → Global | Empty | Timer A (waiting 2s) |

Since Promise A is **pending**, `await` pauses `fun1` and nothing is queued in `microtask queue` for rest of the code. It awaits pending promise.

`fun1` returns a pending promise.

Call Stack

```
Global
```

---

#### Step 2 : `fun2()` is called

Call Stack

```
fun2
Global
```

Execute

```js
console.log(".then: start");
```

Output

```
async: start
.then: start
```

---

##### Next Line

```js
myPromise()
```

Again,

A **new promise** is created.

This is **Promise B**.

Another timer is registered.

Current State

| Call Stack | Microtask Queue | Callback Queue |
|------------|-----------------|----------------|
| fun2 → Global | Empty | Timer A, Timer B |

---

##### Next Line

```js
.then(...)
.catch(...)
.finally(...)
```

Important:

Nothing is executed.

JavaScript only registers callbacks on Promise B.

Since Promise B is still pending,

nothing is added to the Microtask Queue.

Current State

| Call Stack | Microtask Queue | Callback Queue |
|------------|-----------------|----------------|
| fun2 → Global | Empty | Timer A, Timer B |

---

##### Next Line

```js
console.log("end");
```

Output

```
async: start
.then: start
end
```

`fun2` finishes.

Global script also finishes.

---

##### Global Script Ends

Current State

| Call Stack | Microtask Queue | Callback Queue |
|------------|-----------------|----------------|
| Empty | Empty | Timer A, Timer B |

At this point the Event Loop waits.

---

##### After ~2 Seconds

Assume **Timer A finishes first**.

---

#### Step 3 : Timer A Callback Executes

Callback Queue

```
Timer A
```

↓

Call Stack

```
Timer A callback
```

Executes

```js
res(5)
```

Promise A becomes fulfilled.

Since `fun1` was waiting using

```js
await myPromise()
```

JavaScript queues the continuation of `fun1`.

Current State

| Call Stack | Microtask Queue | Callback Queue |
|------------|-----------------|----------------|
| Empty | Resume fun1 | Timer B |

---

##### Event Loop

Before taking another callback,

the Event Loop always empties the Microtask Queue.

---

#### Step 4 : Resume `fun1`

Call Stack

```
Resume fun1
```

Continue after

```js
await myPromise()
```

Execute

```js
console.log("async:", res);
```

Output

```
async: 5
```

---

Next

```js
finally
```

Output

```
async: finally
```

---

Next

```js
console.log("async: end");
```

Output

```
async: end
```

No more code remains.

`fun1` finishes.

Current State

| Call Stack | Microtask Queue | Callback Queue |
|------------|-----------------|----------------|
| Empty | Empty | Timer B |

---

#### Step 5 : Timer B Executes

Callback Queue

```
Timer B
```

↓

Call Stack

```
Timer B callback
```

Runs

```js
res(5)
```

Promise B becomes fulfilled.

Since Promise B has a registered

```js
.then(...)
```

callback,

JavaScript queues that callback.

Current State

| Call Stack | Microtask Queue | Callback Queue |
|------------|-----------------|----------------|
| Empty | .then callback | Empty |

---

#### Step 6 : Execute `.then()`

Call Stack

```
.then callback
```

Execute

```js
console.log(".then:", res);
```

Output

```
.then: 5
```

The `.then()` callback finishes.

The Promise returned from `.then()` is now fulfilled.

Because `.finally()` is chained,

its callback is queued.

Current State

| Call Stack | Microtask Queue | Callback Queue |
|------------|-----------------|----------------|
| Empty | .finally callback | Empty |

---

#### Step 7 : Execute `.finally()`

Call Stack

```
.finally callback
```

Execute

```js
console.log(".then: finally");
```

Output

```
.then: finally
```

Everything finishes.

---

##### Final Output

```text
async: start
.then: start
end

(after ~2 seconds)

async: 5
async: finally
async: end
.then: 5
.then: finally
```

---

#### Queue Evolution

```
GLOBAL SCRIPT
────────────────────────────────────────

Call Stack
-----------
Global

Microtasks
-----------
[]

Callback Queue
--------------
[]

────────────────────────────────────────

fun1()

Call Stack
-----------
fun1
Global

Microtasks
-----------
[]

Callback Queue
--------------
Timer A

────────────────────────────────────────

fun1 pauses at await

Call Stack
-----------
Global

Microtasks
-----------
[]

Callback Queue
--------------
Timer A

────────────────────────────────────────

fun2()

Call Stack
-----------
fun2
Global

Microtasks
-----------
[]

Callback Queue
--------------
Timer A
Timer B

────────────────────────────────────────

Global Ends

Call Stack
-----------
[]

Microtasks
-----------
[]

Callback Queue
--------------
Timer A
Timer B

────────────────────────────────────────

Timer A fires

Call Stack
-----------
Timer A callback

Microtasks
-----------
Resume fun1

Callback Queue
--------------
Timer B

────────────────────────────────────────

Resume fun1

Call Stack
-----------
Resume fun1

Microtasks
-----------
[]

Callback Queue
--------------
Timer B

────────────────────────────────────────

Timer B fires

Call Stack
-----------
Timer B callback

Microtasks
-----------
.then callback

Callback Queue
--------------
[]

────────────────────────────────────────

.then callback completes

Microtasks
-----------
.finally callback

────────────────────────────────────────

.finally callback completes

Microtasks
-----------
[]

Callback Queue
--------------
[]
```
</details>

### Question 23

What will be the output and order?

```javascript
const myPromise1 = () => Promise.resolve('I have resolved1!');
const myPromise2 = () => Promise.resolve('I have resolved2!');

function firstFunction() {
  myPromise1().then(res => console.log(res));
  console.log('first');
}

async function secondFunction() {
  console.log(await myPromise2());
  console.log('second');
}

firstFunction();
secondFunction();
```

<details>
<summary>Show Answer</summary>

```
first
I have resolved1!
I have resolved2!
second
```

**Explanation:**
- `firstFunction()` runs first: `myPromise1().then(...)` registers a microtask (since `myPromise1()` is already resolved), then logs `'first'` synchronously.
- `secondFunction()` runs next: `await myPromise2()` also queues a microtask — `await` on an already-settled promise still takes exactly **one microtask tick** to resume, the same cost as a `.then()` callback. It doesn't resume synchronously just because the promise is already resolved.
- Both continuations are now sitting in the microtask queue, in the order they were registered: `firstFunction`'s `.then()` first, `secondFunction`'s `await` continuation second. So they run in that same order: `'I have resolved1!'` fires before `'I have resolved2!'`, and only after that does `secondFunction` continue to log `'second'`.

**Interview relevance:** it's tempting to assume `await` on an already-resolved promise "skips the queue" since there's nothing to wait for — but it doesn't. It still costs exactly one microtask hop, same as `.then()`, so ordering between competing `.then()`/`await` continuations comes down to *registration order*, not which one "needed less waiting."

</details>

### Question 24

What will be the output and order?

```javascript
const myPromise = Promise.resolve(Promise.resolve('Promise'));

function funcOne() {
  setTimeout(() => console.log('Timeout 1!'), 0);
  myPromise.then(res => res).then(res => console.log(`${res} 1!`));
  console.log('Last line 1!');
}

async function funcTwo() {
  const res = await myPromise;
  console.log(`${res} 2!`)
  setTimeout(() => console.log('Timeout 2!'), 0);
  console.log('Last line 2!');
}

funcOne();
funcTwo();
```

<details>
<summary>Show Answer</summary>

```
Last line 1!
Promise 2!
Last line 2!
Promise 1!
Timeout 1!
Timeout 2!
```

**Explanation:** 
- `Promise.resolve(Promise.resolve(value))` returns the **same fulfilled promise**, not a nested promise.
- `await` on an already fulfilled promise queues **one continuation microtask**.
- Every `.then()` in a chain is **a separate microtask**.
- The next `.then()` cannot be queued until the previous `.then()` completes.
- The Event Loop **always empties the Microtask Queue before processing the Callback (Macrotask) Queue**.

</details>

### Question 25

What will be the output and order? (`cbFun` is called synchronously from inside `fun`'s `.then`, and both use the **same** `promise5`)

```javascript
const promise5 = new Promise((res, rej) => {
    setTimeout(() => {
        res(5)
    }, 200)
})

const cbFun = () => {
   promise5.then(res => {
        console.log('res 2', res)
    }).catch(err => {
        console.error('error')
    }).finally(() => {
       console.log('in finally child')
    })
}

const fun = () => {
    promise5.then(res => {
        cbFun()
        console.log('res 1', res)
    }).catch(err => {
        console.error('error', err)
    }).finally(() => {
       console.log('in finally parent')
    })
}

fun()
```

<details>
<summary>Show Answer</summary>

```
res 1 5
res 2 5
in finally parent
in finally child
```

**Explanation:**
- `fun`'s `.then` callback runs first (promise5 already resolved), synchronously calling `cbFun()` before logging `res 1 5`
- `cbFun()` registers a new `.then` on the same `promise5`, which queues *after* the microtask that's currently running
- Because both chains hang off the same already-settled `promise5`, `fun`'s chain (`then` → `catch` skip → `finally`) and `cbFun`'s chain interleave one microtask hop at a time, so `res 1 5` and `res 2 5` both resolve before either `finally` fires, and the parent's `finally` (registered first) wins the race to the queue

</details>

### Question 26

**Prerequisite for this question:** a `.then()` callback runs as **one microtask**. Any *new* `.then()` callbacks registered from inside that microtask don't run immediately, even if they look like they're "right there" in the code — they have to wait until (a) the currently-running microtask finishes, **and** (b) the promise they're attached to actually settles. Calling `.then()` on a promise that's still *pending* doesn't queue anything at all — it just registers the callback to be queued later, whenever that promise eventually settles.

What will be the output and order? (Same shape as Question 25, but `fun` and `cbFun` now await **two separate** promises that resolve at the same time)

```javascript
const promise11 = new Promise((res, rej) => {
    setTimeout(() => {
        res(5)
    }, 200)
})

const promise22 = new Promise((res, rej) => {
    setTimeout(() => {
        res(5)
    }, 200)
})

const cbFun = () => {
   promise22.then(res => {
        console.log('res 2', res)
    }).catch(err => {
        console.error('error')
    }).finally(() => {
       console.log('in finally child')
    })
}

const fun = () => {
    promise11.then(res => {
        cbFun()
        console.log('res 1', res)
    }).catch(err => {
        console.error('error', err)
    }).finally(() => {
       console.log('in finally parent')
    })
}

fun()
```

<details>
<summary>Show Answer</summary>

```
res 1 5
in finally parent
res 2 5
in finally child
```

**Initial state**, right after this script starts running:

| Call Stack | Microtask Queue | Callback (Macrotask) Queue |
|---|---|---|
| Global | Empty | Empty |

**Step 1 — `promise11`/`promise22` are created.** Per the [prerequisite section](#prerequisite-a-promises-executor-runs-synchronously-immediately), both executors run immediately — each just registers a `setTimeout` timer and returns; neither promise is resolved yet.

| Call Stack | Microtask Queue | Callback Queue |
|---|---|---|
| Global | Empty | Timer11, Timer22 |

**Step 2 — `fun()` is called.** It runs `promise11.then(...).catch(...).finally(...)`. Since `promise11` is still **pending**, this call only *registers* the callbacks — nothing is queued yet, per the prerequisite rule above. Global code finishes; the call stack empties out.

| Call Stack | Microtask Queue | Callback Queue |
|---|---|---|
| Empty | Empty | Timer11, Timer22 |

**~200ms later, Timer11 fires first** (both timers have the same delay, so whichever was registered first — `promise11`'s — fires first).

**Step 3 — Timer11's callback runs**, calling `res(5)`. `promise11` becomes fulfilled — *now*, and only now, its `.then()` callback is queued as a microtask.

| Call Stack | Microtask Queue | Callback Queue |
|---|---|---|
| Empty | Parent `.then` | Timer22 |

**Step 4 — the parent `.then()` microtask runs.** Inside it, `cbFun()` is called synchronously, which runs `promise22.then(...).catch(...).finally(...)` — but `promise22` is **still pending** (its own timer hasn't fired yet), so — same rule as Step 2 — this only registers callbacks; nothing new is queued. Execution returns from `cbFun()` and continues with `console.log("res 1", res)`, logging `res 1 5`. The parent `.then()` callback finishes, which settles the promise *it* returns — queuing the parent's `.finally()` next.

| Call Stack | Microtask Queue | Callback Queue |
|---|---|---|
| Empty | Parent `.finally` | Timer22 |

**Step 5 — the parent `.finally()` runs**, logging `in finally parent`. The microtask queue is now empty; only `Timer22` remains, still waiting on its own timer.

| Call Stack | Microtask Queue | Callback Queue |
|---|---|---|
| Empty | Empty | Timer22 |

**Step 6 — Timer22 fires**, calling `res(5)`. `promise22` becomes fulfilled — *now* its `.then()` (registered back in Step 4, inside `cbFun()`) is finally queued.

| Call Stack | Microtask Queue | Callback Queue |
|---|---|---|
| Empty | Child `.then` | Empty |

**Step 7 — the child `.then()` runs**, logging `res 2 5`, then settles its own returned promise — queuing the child's `.finally()`.

**Step 8 — the child `.finally()` runs**, logging `in finally child`. Nothing left in any queue — done.

**Why doesn't `cbFun()`'s `promise22.then(...)` run immediately when it's called in Step 4?** Calling `.then()` on a promise only *registers* a callback — it doesn't queue a microtask by itself. A `.then()` callback only gets queued once the promise it's attached to actually **settles**. Since `promise22` is still pending at that exact moment (its timer hasn't fired), nothing about `cbFun()`'s `.then()` chain can run until three things happen, in order: `promise22`'s timer eventually fires (Step 6), *that* settles `promise22`, and only then does the event loop get to queue (and eventually run) the microtask for its `.then()` callback.

**Key takeaways:**
- Calling `.then()` on a **pending** promise registers the callback but adds nothing to the microtask queue yet.
- A `.then()` callback becomes an actual microtask **only once the promise it's attached to settles** — not at the moment `.then()` is called.
- The parent `.then()`/`.catch()`/`.finally()` chain runs to completion *before* the child chain (from `cbFun()`) gets any turn at all, purely because `promise22` happens to settle later — via its own separate `Timer22` macrotask, not anything to do with microtask priority.
- Contrast with Question 25, where both `fun` and `cbFun` operated on the *same* already-resolving `promise5` — there, the two chains genuinely interleaved one microtask hop at a time, since both were reacting to the same settlement event instead of two independent timers.

</details>

---

## Sequential vs. Parallel `await`s

A very common interview follow-up and real-world performance mistake: awaiting multiple **independent** async operations one after another instead of running them concurrently.

### Question 27

```javascript
const wait = (val, ms) => new Promise((res) => setTimeout(() => res(val), ms));

const sequential = async () => {
    const t = Date.now();
    const a = await wait(300, 300); // starts only after this line runs
    const b = await wait(500, 500); // doesn't start until `a` has resolved
    console.log('sequential total:', Date.now() - t, [a, b]);
};

const parallel = async () => {
    const t = Date.now();
    const [a, b] = await Promise.all([wait(300, 300), wait(500, 500)]); // both start immediately
    console.log('parallel total:', Date.now() - t, [a, b]);
};

sequential();
parallel();
```

<details><summary>Show Answer</summary>

```
parallel total: ~500 [ 300, 500 ]
sequential total: ~800 [ 300, 500 ]
```

**Explanation:** in `sequential`, `wait(500, 500)` isn't even *created* until the line `await wait(500, 500)` runs — which only happens after `wait(300, 300)` has already fully resolved. So the two delays stack: `300 + 500 = ~800ms` total.

In `parallel`, **both** promises are created immediately, side by side, as arguments to `Promise.all([...])` — so both `setTimeout` timers start counting at the same moment. `Promise.all` waits for the *slowest* one to settle, so the total time is just `max(300, 500) = ~500ms`, not the sum.

**Rule of thumb:** only await sequentially when a later call genuinely *depends* on an earlier one's result (like the marriage-approval chain in [Asynchronous.md](Asynchronous.md)). If two async calls don't depend on each other at all, kick them both off together — with `Promise.all`, or by simply not `await`-ing the first one before starting the second — instead of accidentally serializing independent work.

**Contrast with Question 19 and Question 21:** Question 19's `promise1`/`promise2` were *already* created upfront (outside the async function), so they behaved like the parallel case even though they were awaited sequentially. Question 21 flipped that by creating each promise *inline*, inside its own `await`, which forced genuine sequential timing. This question's `sequential` function is the same pattern as Question 21 — proving the timing depends on *when the promise is created*, not on where the `await` keyword sits.

</details>

---

## Key Takeaways

1. **Async functions always return promises**
2. **Await pauses execution** until promise settles
3. **Use try-catch-finally** for error handling with async/await
4. **Finally blocks always execute** regardless of return statements
5. **Execution order matters** - understand microtask vs macrotask queues
6. **Sequential awaits of freshly-created promises add up timing**; running independent operations concurrently (`Promise.all`) is faster — but only if the promises are created together, not created-then-awaited one at a time (Question 21, Question 27). If the promises already exist beforehand, awaiting them in sequence doesn't re-add their delays (Question 19).
7. **`await` on an already-resolved promise still costs one microtask tick** — it doesn't resume synchronously just because there's technically nothing left to wait for (Question 23).
8. **An `async` function runs synchronously up to its first `await`** — everything before that point, including any `Promise` executors, runs immediately with no microtask delay (Question 4, Question 5).
9. **`await expression()` evaluates `expression()` — including running its entire synchronous body — before the surrounding function actually suspends.** Whether an `await`ed function call causes any *cascading* suspension depends entirely on whether the called function itself contains an `await` (Question 7 vs. Question 8).
10. **Whether an awaited function's internal promise work actually delays its caller depends on whether that work is `return`ed or just fired off as a disconnected side effect** — a fire-and-forget `.then()` inside an awaited function doesn't make the caller wait for it; only `return`ing that chain does (Question 9 vs. Question 10).
11. **Every microtask, once running, can itself enqueue new microtasks that go to the *back* of the queue** — they never jump ahead of tasks already waiting, no matter how "close" they were to the code that spawned them (Question 15, Question 16).

## Best Practices

1. **Use async/await over .then()** for readability
2. **Always wrap in try-catch** when using await
3. **Use Promise.all()** for parallel execution when possible
4. **Avoid sequential awaits** when operations are independent
5. **Handle errors appropriately** with proper error boundaries