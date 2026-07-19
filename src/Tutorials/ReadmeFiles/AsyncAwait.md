# Async/Await in JavaScript

### Async/Await

- `async/await` is syntactic sugar built on top of **Promises**. It provides a cleaner and more readable way to write asynchronous code compared to chaining `.then()` and `.catch()`.

- It makes asynchronous code **look and read like synchronous code**, while still remaining non-blocking.

- An `async` function executes **synchronously** until it encounters the first `await`.

- When execution reaches:

  ```js
  await promiseVar;
  ```

  the following happens:

  1. If `promiseVar` is **not already a Promise**, it is wrapped using `Promise.resolve(promiseVar)`.
  2. The current `async` function is **paused**.
  3. The remaining code inside the `async` function is scheduled to resume as a **microtask** once the awaited Promise settles.
  4. Control returns to the caller, allowing the rest of the current call stack to continue executing.

> **Note:** `await` does **not** block the JavaScript thread. It only pauses the execution of the current `async` function. Other synchronous code, event loop tasks, and microtasks can continue to execute while the function is suspended.


## Prerequisite: A Promise's Executor Runs Synchronously, Immediately

Before tracing through *any* execution-order question in this file — or [Asynchronous.md](Asynchronous.md) — one fact needs to be second nature:

> **A `Promise`'s executor function starts running the instant `new Promise(...)` is evaluated — synchronously, during normal code execution, not during any separate "memory creation phase," and not deferred to later like a callback.**

`new Promise((resolve, reject) => { ... })` does **not** create a dormant, "paused" promise waiting to be triggered — the `(resolve, reject) => { ... }` function passed in (the **executor**) is called immediately, right then, as part of the line that creates it. Only the *asynchronous work happening inside* that executor (a `setTimeout`, a `fetch`, an event handler) is what's actually deferred — the executor function itself is 100% synchronous.

This single fact is *why* Question 9/Question 10 (further down) behave the way they do — both `promise1` and `promise2` there start their `setTimeout` timers the moment each is constructed, not when they're later `await`ed.

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
    const promise = Promise.resolve('Sharam nhi aati.')
    promise.then(msg => console.log(msg))
    console.log("2 lakh bhej!")
    console.log('Ticket kara de');
})()
```

<details>
<summary>Show Answer</summary>

```
2 lakh bhej!
Ticket kara de
Sharam nhi aati.
```

**Explanation:** The `.then()` callback is added to the microtask queue and executes after the synchronous code completes.

</details>

### Question 2

What will be the output and in what order?

```javascript
(async () => {
    const promise = Promise.resolve('Sharam nhi aati.')
    console.log(await promise)
    console.log("2 lakh bhej!")
    console.log('Ticket kara de')
})()
```

<details>
<summary>Show Answer</summary>

```
Sharam nhi aati.
2 lakh bhej!
Ticket kara de
```

**Explanation:** `await` pauses execution until the promise resolves, then continues sequentially.

</details>

### Question 3

What will be the output and in what order?

```javascript
(async () => {
    const promise = Promise.resolve('Sharam nhi aati.')
    
    promise.then(msg => console.log('.then', msg))
    console.log("2 lakh bhej!")
    console.log('Ticket kara de');
    
    console.log(await promise)
    console.log("2 lakh bhej!")
    console.log('Ticket kara de')
})()
```

<details>
<summary>Show Answer</summary>

```
2 lakh bhej!
Ticket kara de
.then Sharam nhi aati.
Sharam nhi aati.
2 lakh bhej!
Ticket kara de
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

**The key takeaway:** two separate rules are stacked in this example — (1) an async function runs synchronously up to its first `await`, so both promise executors log *before* `"After"` ever prints; and (2) every single `await`, even on an already-settled promise, costs one full microtask hop to resume (the same rule verified in Question 13) — which is why `"P1 res 1"` and `"P2 res 2"` are each on their own separate microtask turn, both landing *after* `"After"`, not interleaved with the synchronous portion at all.

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

### Question 7

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

### Question 8

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

### Question 9

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

### Question 10

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

### Question 11 — Contrast: Creating the Promises *Inline*, Inside Each `await`

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

**Explanation:** this time the total genuinely *is* 3 + 5 = 8 seconds — the opposite conclusion from Question 9, and that's the whole point of comparing them. The key difference: `new Promise(...)` for `ans2` is written directly inside the second `await` expression, so — per the [prerequisite section](#prerequisite-a-promises-executor-runs-synchronously-immediately) — its executor doesn't run, and its `setTimeout` timer doesn't start, until execution actually *reaches* that line. And execution can't reach it until `ans1`'s `await` has already resolved, 3 seconds in. So the two timers never overlap; they run back-to-back, and their delays genuinely add up.

**The rule of thumb this proves:** it was never really about "sequential `await`s always add up" or "always run in parallel" — it's specifically about **when each promise is constructed**. Promises created upfront (Question 9/10) race their timers in the background regardless of `await` order. Promises created inline, one `await` at a time (this question), can only start once the previous `await` completes — so their delays stack. This is the same underlying mechanism demonstrated with `Promise.all` in [Question 17](#question-17) further down.

</details>

## Advanced Execution Order Questions

### Question 12

What will be the output and order?

```javascript
const myPromise = () => new Promise((res) => setTimeout(() => res(5), 2000))

const fun = async () => {
  console.log('start of fun')
    try {
        const res = await myPromise()
        console.log('after await', res)
    } catch(err) {
        console.log(err)
    } finally {
        console.log('inside finally')
    }
  console.log('end of fun')
}

fun()

const fun2 = () => {
  console.log('start of fun')
  myPromise().then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  }).finally(() => {
    console.log('inside finally')
  })
  console.log('end of fun')
}

fun2()
```

<details>
<summary>Show Answer</summary>

```
start of fun
start of fun
end of fun
after await 5
inside finally
end of fun
5
inside finally
```

**Explanation:** 
- Both functions start immediately and log "start of fun"
- `fun2()` completes synchronously and logs "end of fun" 
- After 2 seconds, promises resolve
- `fun()` (with await) completes its execution
- `fun2()` (with .then()) callbacks execute from microtask queue

</details>

### Question 13

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

### Question 14

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
- Synchronous code runs first: "Last line 1!"
- `await` in `funcTwo` resolves immediately, continues execution
- Promise chains from `funcOne` execute from microtask queue
- `setTimeout` callbacks execute last from macrotask queue

</details>

### Question 15

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

### Question 16

What will be the output and order? (Same shape as Question 15, but `fun` and `cbFun` now await **two separate** promises that resolve at the same time)

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

**Explanation:**
- Unlike Question 15, `promise11` and `promise22` are independent promises, so their `.then` → `.catch` → `.finally` chains run as two separate microtask sequences instead of interleaving
- `promise11`'s chain (registered first) fully drains — `res 1 5` then `in finally parent` — before `promise22`'s chain (registered a moment later, from inside `cbFun()`) gets its turn

</details>

---

## Sequential vs. Parallel `await`s

A very common interview follow-up and real-world performance mistake: awaiting multiple **independent** async operations one after another instead of running them concurrently.

### Question 17

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

**Contrast with Question 9 and Question 11:** Question 9's `promise1`/`promise2` were *already* created upfront (outside the async function), so they behaved like the parallel case even though they were awaited sequentially. Question 11 flipped that by creating each promise *inline*, inside its own `await`, which forced genuine sequential timing. This question's `sequential` function is the same pattern as Question 11 — proving the timing depends on *when the promise is created*, not on where the `await` keyword sits.

</details>

---

## Key Takeaways

1. **Async functions always return promises**
2. **Await pauses execution** until promise settles
3. **Use try-catch-finally** for error handling with async/await
4. **Finally blocks always execute** regardless of return statements
5. **Execution order matters** - understand microtask vs macrotask queues
6. **Sequential awaits of freshly-created promises add up timing**; running independent operations concurrently (`Promise.all`) is faster — but only if the promises are created together, not created-then-awaited one at a time (Question 11, Question 17). If the promises already exist beforehand, awaiting them in sequence doesn't re-add their delays (Question 9).
7. **`await` on an already-resolved promise still costs one microtask tick** — it doesn't resume synchronously just because there's technically nothing left to wait for (Question 13).
8. **An `async` function runs synchronously up to its first `await`** — everything before that point, including any `Promise` executors, runs immediately with no microtask delay (Question 4, Question 5).

## Best Practices

1. **Use async/await over .then()** for readability
2. **Always wrap in try-catch** when using await
3. **Use Promise.all()** for parallel execution when possible
4. **Avoid sequential awaits** when operations are independent
5. **Handle errors appropriately** with proper error boundaries