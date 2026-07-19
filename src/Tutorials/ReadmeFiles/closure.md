# Closures

## Definition

A closure is:

1. A function bundled together with a reference to its lexical environment.
2. An inner function that can access the outer function's variables and parameters, even after the outer function has finished executing.
3. Created every time a function is *created* — not when it's called. The closure is formed at the point the inner function is defined, capturing a live reference to its surrounding scope right then, regardless of whether that inner function is ever invoked.
4. Preserved wherever the function ends up being executed — even in a completely different scope than where it was originally written, it still remembers its original lexical environment.

**MDN's formal definition:** *"A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives a function access to its outer scope."*

**One-line interview answer:** a closure lets a function "remember" the variables from the scope it was created in, even after that outer scope has returned.

## Practice Questions

### Question 1

What will be the output when we call `outer()`?

```javascript
function outer () {
    const Amane = 'hi'
    function inner() {
        console.log(`Log: ${Amane}`)
    }
    inner()
}
outer()
```

<details>
<summary>Show Answer</summary>

```
Log: hi
```

**Explanation:** The inner function has access to the outer function's variable `Amane` due to closure.

</details>

### Question 2

What will be the output when we call the returned function?

```javascript
function outer () {
    const Amane = 'hi'
    return function inner() {
        console.log(`Log: ${Amane}`)
    }
}
const returnedFn = outer()
returnedFn()

// Alternative way:
outer()()
```

<details>
<summary>Show Answer</summary>

```
Log: hi
```

**Explanation:** Even after `outer()` finishes executing, the returned `inner` function still remembers the `Amane` variable from its lexical scope. This is closure in action.

</details>

### Question 3

What will be the output? Notice that `Amane` is modified before returning the function.

```javascript
function outer () {
    let Amane = 'bye'
    function inner() {
        console.log(`Log: Amane ${Amane}`)
    }
    Amane = 'hi again!'
    return inner
}

outer()()
```

<details>
<summary>Show Answer</summary>

```
Log: Amane hi again!
```

**Explanation:** Closures capture variables by reference, not by value. When `inner` is executed, it sees the latest value of `Amane`, which was changed to 'hi again!' before the function was returned.

</details>

### Question 4

What will be the output? Notice that `Amane` is declared after the `inner` function.

```javascript
function outer () {
    function inner() {
        console.log(`Log: ${Amane}`)
    }
    const Amane = 'hi'
    return inner
}
const returnVal = outer()
returnVal()
```

<details>
<summary>Show Answer</summary>

```
Log: hi
```

**Explanation:** Due to hoisting and closure, the `inner` function can access the `Amane` variable even though it was declared after the function definition.

</details>

### Question 5

What will be the output? Pay attention to which `word1` and `word3` are used.

```javascript
function outest() {
    const word1 = 'kya bol rha hai '
    function outer() {
        const word2 = 'kuch samajh nhi aa rha'
        function inner() {
            console.log(`Log: ${word1}, ${word2}. ${word3}`)
        }
        inner()
    }
    outer()
}
const word1 = 'Akshay Saini ka video dekhna hoga!'
const word3 = 'Phir se bata'
outest()
```

<details>
<summary>Show Answer</summary>

```
Log: kya bol rha hai , kuch samajh nhi aa rha. Phir se bata
```

**Explanation:** 
- Every function forms a closure with the reference to its lexical environment
- Lexical environment comprises of the variables and parameters inside of a function
- The function first searches for the variable in its own scope, if not found then looks in the outer function, until it reaches window level or finds the variable
- `word1`: Found in `outest` function scope
- `word2`: Found in `outer` function scope  
- `word3`: Found in global scope

</details>

## Interview Question: setTimeout with Closures

**Problem:** Print 1, 2, 3 after 1, 2, 3 seconds respectively.

### Approach 1: Common Wrong Attempt

What will be the output of this code?

```javascript
for (var i = 1; i <= 3; i++) {
    setTimeout(() => {
        console.log(i)
    }, i * 1000)
}
```

<details>
<summary>Show Answer</summary>

```
4
4  
4
```

**Why it doesn't work:** 
- `var` is function scoped, so all setTimeout callbacks share the same `i` variable
- By the time the callbacks execute, the loop has finished and `i` is 4
- All callbacks reference the same `i` variable, not separate copies

</details>

### Approach 2: Using `let` instead of `var`

What will be the output of this corrected version?

```javascript
for (let i = 1; i <= 3; i++) {
    setTimeout(() => {
        console.log(i)
    }, i * 1000)
}
```

<details>
<summary>Show Answer</summary>

```
1 (after 1 second)
2 (after 2 seconds)
3 (after 3 seconds)
```

**Why it works:** `let` is block scoped, so in each iteration a fresh variable `i` is created with the current value.

</details>

### Approach 3: Using `var` with Closure (Function Parameter)

**Challenge:** What if interviewer asks to solve it using `var` only?

```javascript
for (var j = 1; j <= 3; j++) {
    const print = (x) => {
        setTimeout(() => {
            console.log(x)
        }, x * 1000)
    }
    print(j)
}
```

<details>
<summary>Show Answer</summary>

```
1 (after 1 second)
2 (after 2 seconds) 
3 (after 3 seconds)
```

**Why it works:** By passing `j` as a parameter `x` to the `print` function, we create a new scope for each iteration where `x` holds the current value of `j`.

</details>

## Data Hiding and Encapsulation using Closure

### Problem with Global Variables

```javascript
let count = 0
function increaseCounter() {
    count++;
}
```

**Issue:** Anyone can modify `count` directly (`count++` or `count = 5`), which breaks encapsulation.

### Solution: Using Closure for Privacy

```javascript
function counter() {
    let count = 0;
    return function incrementCount() {
        count++;
        console.log(count);
    }
}
const counter1 = counter()
counter1()
counter1()

const counter2 = counter()
counter2()
counter2()
```

<details>
<summary>Show Answer</summary>

```
1
2
1
2
```

**Explanation:** 
- Each call to `counter()` creates a new closure with its own `count` variable
- The `count` variable is private and can only be accessed through the returned function
- `counter1` and `counter2` are independent instances

</details>
    
### Scalable Solution: Multiple Methods

**Challenge:** What if we want both `incrementCount()` and `decrementCount()` methods?

```javascript
function counter() {
    let count = 0;

    const incrementCount = () => {
        count++;
        console.log(count);
    };

    const decrementCount = () => {
        count--;
        console.log(count);
    };

    return {
        incrementCount,
        decrementCount
    };
}

const counter1 = counter();
counter1.incrementCount();
counter1.incrementCount();
counter1.decrementCount();

const counter2 = counter();
counter2.incrementCount();
counter2.decrementCount();
```

<details>
<summary>Show Answer</summary>

```
1
2
1
1
0
```

**Explanation:** We return an object with multiple methods, each having access to the same private `count` variable through closure.

</details>
   


### Constructor Function Approach

**Most Scalable Solution:** Using constructor function with closures

```javascript
function Counter() {
    let count = 0
    this.increment = function () {
        count++
    }
    this.decrement = function () {
        count--
    }
    this.print = function () {
        return count
    }
}

const counter1 = new Counter()
counter1.increment()
counter1.increment()
counter1.increment()
console.log(counter1.print())
counter1.decrement()
counter1.decrement()
console.log(counter1.print())

const counter2 = new Counter()
counter2.increment()
counter2.increment()
console.log(counter2.print())
counter2.decrement()
counter2.decrement()
console.log(counter2.print())
```

<details>
<summary>Show Answer</summary>

```
3
1
2
0
```

**Explanation:** 
- Each instance created with `new Counter()` has its own private `count` variable
- The methods are attached to each instance and have access to their respective `count` via closure
- This provides true data encapsulation and multiple instances

</details>

### Question 6 — Memoization Using Closure

```javascript
const memoizAddition = () => {
    let cache = {};
    return (value) => {
        if (value in cache) {
            console.log("Log: Fetching from cache.");
            return cache[value];
        } else {
            console.log("Log: Calculating result.");
            let result = value + 20;
            cache[value] = result;
            return result;
        }
    };
};

const addition = memoizAddition(); // returned function from memoizAddition
console.log(addition(20));
console.log(addition(20));
```

<details><summary>Show Answer</summary>

```
Log: Calculating result.
40
Log: Fetching from cache.
40
```

**Explanation:** `cache` is a private variable held alive by closure, shared across every call to the returned function (but *not* shared across separate calls to `memoizAddition()` — each call creates a fresh `cache`, just like the counter examples above). The first call for a given `value` computes and stores the result; every subsequent call for that same `value` skips recomputation and reads straight from `cache`.

</details>

---

## The Module Pattern (IIFE + Closure)

### Question 7

```javascript
const bankAccount = (function () {
    let balance = 100;
    return {
        deposit(amt) { balance += amt; return balance; },
        withdraw(amt) { balance -= amt; return balance; },
        getBalance() { return balance; }
    };
})();

console.log(bankAccount.deposit(50));
console.log(bankAccount.withdraw(30));
console.log(bankAccount.balance);
```

<details><summary>Show Answer</summary>

```
150
120
undefined
```

**Explanation:** This is the **module pattern** — an IIFE (Immediately Invoked Function Expression) runs once, creates a private `balance` variable in its own scope, and returns an object containing only the methods meant to be public. `balance` itself is never exposed — `bankAccount.balance` is `undefined` because it was never attached to the returned object, only closed over by the methods inside it. This is closure-based encapsulation using the exact same mechanism as the counter examples above, just packaged as a single IIFE instead of a reusable factory function.

**Interview relevance:** this pattern predates ES6 classes and `#privateFields`, and is still common in vanilla-JS libraries and singleton-style modules (config objects, single shared caches, etc.) where you want exactly one instance with private state.

</details>

---

## Currying via Closure

### Question 8

```javascript
function multiply(a) {
    return function (b) {
        return function (c) {
            return a * b * c;
        };
    };
}

console.log(multiply(2)(3)(4));
```

<details><summary>Show Answer</summary>

```
24
```

**Explanation:** Each returned function closes over the argument from the call before it — the innermost function has access to `a`, `b`, *and* `c` simultaneously, purely because of nested closures. This is the mechanical basis of currying: breaking a multi-argument function into a chain of single-argument functions, each one "remembering" the arguments already supplied. See [currying.md](currying.md) for a dedicated deep dive into currying patterns (including a generic `curry()` helper).

</details>

---

## Closures Inside Loops — Beyond `var`/`let`

### Question 9 — Does `forEach` Have the Same `var` Problem as a `for` Loop?

```javascript
var fns = [];
[1, 2, 3].forEach(function (num) {
    fns.push(() => num);
});
console.log(fns.map(f => f()));
```

<details><summary>Show Answer</summary>

```
[ 1, 2, 3 ]
```

**Explanation:** Unlike a `var`-based `for` loop (see Approach 1 above), `forEach`'s callback is invoked as a **separate function call for each array element** — so `num` is a fresh parameter binding on every call, not one shared `var` mutated in place across iterations. Each arrow function pushed into `fns` closes over its *own* call's `num`, so the trap from the classic `for (var i ...)` example simply doesn't apply to `forEach`, `map`, `filter`, or any other callback-based iteration — only raw `var`-based `for`/`while` loops have this problem.

</details>

---

## Practical Use Case: Stale Closures in React (`useEffect` Missing Dependencies)

The exact "loop captured an old value" bug from Approach 1 above shows up constantly in React, wearing a different costume — it's the mechanism behind the classic **stale closure** bug with `useEffect`, `useCallback`, and `useMemo`.

### Question 10 — Stale Closure in `useEffect`

```javascript
function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            console.log(count); // reads `count`
            setCount(count + 1);
        }, 1000);
        return () => clearInterval(id);
    }, []); // <-- empty dependency array

    return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

<details><summary>Show Answer</summary>

The interval callback logs `0, 0, 0, 0, ...` forever — it never advances past the first render's value, even though the component keeps re-rendering and `count` visibly updates on screen (from the button's own `c => c + 1` updater, which is unaffected).

**Explanation:** Every render of `Counter` calls `useState`/`useEffect` fresh, and `count` is effectively a **new `const` binding on every render** — this is the same mechanism verified in the loop examples above, just triggered by React re-rendering instead of a `for` loop iterating. The arrow function passed to `useEffect` is created fresh on every render too, and *that* render's version closes over *that* render's `count`.

The empty dependency array `[]` tells React "only run this effect once, after the first render, and never again." Because the effect never re-runs, the `setInterval` callback that got registered is **permanently the one created during the first render** — it closed over `count` when `count` was `0`, and it will keep reading `0` forever, no matter how many times the component actually re-renders with a new `count`. This is a **stale closure**: the callback is closing over a snapshot of state that's since gone out of date.

**The fix — declare the real dependency:**

```javascript
useEffect(() => {
    const id = setInterval(() => {
        console.log(count);
        setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
}, [count]); // effect re-runs (and the interval is torn down + recreated) every time count changes
```

Or, better for this specific case, avoid depending on `count` at all by using the **functional updater form**, which reads the latest state directly instead of relying on a closed-over variable:

```javascript
useEffect(() => {
    const id = setInterval(() => {
        setCount(c => c + 1); // always gets the current value, no stale closure possible
    }, 1000);
    return () => clearInterval(id);
}, []); // safe to keep the effect running only once now
```

**Interview relevance:** this is exactly why the `react-hooks/exhaustive-deps` ESLint rule exists — it flags exactly this pattern (a value used inside the effect but missing from the dependency array) at lint time, because it's such a common and easy-to-miss source of bugs. The underlying cause is never React-specific magic — it's the same "closure captured an old variable" behavior demonstrated with plain `setTimeout` and `for` loops earlier in this file.

</details>

---

## Closures and Memory

### Question 11 — Do Closures Keep the *Entire* Outer Scope Alive?

```javascript
function outer() {
    const bigArray = new Array(1_000_000).fill('x'); // large, unused by inner
    const smallValue = 'kept';
    return function inner() {
        return smallValue; // only ever references smallValue
    };
}
const fn = outer();
console.log(fn());
```

<details><summary>Show Answer</summary>

```
kept
```

**Explanation:** A common misconception is that a closure keeps *everything* in its outer function's scope alive in memory for as long as the closure exists. In practice, modern JS engines (V8, used by Chrome and Node, included) perform **closure optimization**: they analyze which outer variables the inner function actually references, and only keep *those* variables alive — `bigArray` here is eligible for garbage collection once `outer()` finishes, since `inner` never touches it, even though both variables technically live in the same lexical scope.

**Why this still matters in interviews and real code:** even with this optimization, closures are a legitimate, well-known source of memory leaks when they *do* reference something large and long-lived — e.g. a closure capturing a big object or DOM node that's never released because some long-lived callback (an event listener that's never removed, an interval that's never cleared) keeps the closure itself alive indefinitely. The disadvantage isn't "closures leak everything" — it's "a closure keeps whatever it actually references alive for as long as the closure itself is reachable," which can surprise you if that reachability is longer than expected (e.g. a forgotten `setInterval`, or a detached DOM node still referenced by a stale event handler).

</details>

---

## Advantages and Disadvantages of Closures

**Advantages:**
- **Encapsulation & data privacy** — creates a private scope for variables and functions that aren't directly accessible from outside (Questions 6–7).
- **Currying and partial application** — building up arguments across multiple calls (Question 8).
- **Memoization / caching** — remembering computed results across calls (Question 6).
- **Stateful function factories** — counters, IDs, event handler factories, and similar patterns that need "private" state per instance without a full class.

**Disadvantages:**
- **Memory usage** — any variable referenced by a closure stays alive for as long as the closure is reachable, even after the outer function has returned (Question 11). This is a common source of real memory leaks when a closure outlives its usefulness (forgotten timers, un-removed event listeners).
- **Stale data** — a closure captures a *reference* to its lexical environment at creation time; if that data is expected to be "live" but the closure was created too early (or its surrounding scope isn't re-created when you'd expect), it can silently read outdated values — the exact bug demonstrated in Question 10.
- **Slight performance/complexity overhead** — deeply nested closures can make code harder to reason about and debug compared to flatter, closure-free alternatives.
