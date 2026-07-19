# Currying

## Definition

- Currying transforms a function that takes multiple arguments into a nested sequence of functions, each taking a single argument.
- A function callable as `f(a, b, c)` becomes callable as `f(a)(b)(c)`.
- It lets you build up arguments incrementally, and makes it easy to derive specialized, reusable functions from a general one by pre-supplying some arguments (see the practical use case below).
- Mechanically, currying is really just nested closures — see [closure.md](closure.md#question-8) for the closure fundamentals this relies on.

### Currying vs. Partial Application

These two are commonly confused in interviews:

- **Currying** always transforms a function into a chain of functions that each take **exactly one argument** — `f(a)(b)(c)`.
- **Partial application** pre-fills *some* arguments and returns a function that still accepts the **rest all at once** — e.g. `f(a)(b, c)` or `f(a, b)(c)`.

`.bind()` performs partial application, not currying:

```javascript
function volume(l, w, h) { return l * w * h; }
const baseVolume = volume.bind(null, 10); // pre-fills l = 10 only
console.log(baseVolume(2, 3)); // still takes w and h together, not one at a time
```

```
60
```

## Basic Example

```javascript
function add(num1, num2) {
    return num1 + num2;
}

function addCurried(num1) {
    return function (num2) {
        return num1 + num2;
    };
}

console.log(add(3, 7));
console.log(addCurried(3)(7)); // same result, curried form
```

<details><summary>Show Answer</summary>

```
10
10
```

**Explanation:** `addCurried(3)` returns a new function that closes over `num1 = 3`; calling that returned function with `7` computes `3 + 7`. Same result as `add(3, 7)`, just split across two calls.

</details>

### In Arrow Functions

```javascript
const addCurriedArrow = num1 => num2 => num1 + num2;
console.log(addCurriedArrow(3)(7));
```

<details><summary>Show Answer</summary>

```
10
```

**Explanation:** The arrow-function form is the same nested-closure mechanism as `addCurried` above, just written more tersely — `num1 => (num2 => num1 + num2)`.

</details>

---

## Interview Question: Infinite Currying

**Challenge:** implement a function that takes `n` arguments across separate calls and returns their sum — something like `sum(1)(2)(3)(4)...()`, where a call with no arguments signals "stop and total it up."

### Using — Regular Function

```javascript
console.log(sum(1)(2)(3)(4)()); // 10
```

<details><summary>Show Answer</summary>

```
function sum(a) {
    return function (b) {
        if (b) return sum(a + b);
        return a;
    };
}
```

**Explanation:** Each call either receives another argument (`b` is truthy) and recurses with the running total (`sum(a + b)`), or receives nothing (`b` is falsy — no argument passed, or `undefined`) and returns the accumulated `a`. The chain keeps returning new functions until the empty `()` call short-circuits it.

**Gotcha:** since this checks truthiness of `b`, calling it with an explicit `0` (e.g. `sum(1)(0)(3)()`) would stop early too, since `0` is falsy — a genuine edge case worth mentioning if asked to harden this.

</details>

### Using — ES6 Arrow Function

```javascript
console.log(sum(1)(2)(3)(4)()); // 10
```

<details><summary>Show Answer</summary>

```
const sum = a => b => (b ? sum(a + b) : a);
```

**Explanation:** Same logic as Question 1, written as a one-line nested arrow chain.

</details>

---

## A Generic `curry()` Helper

**Challenge:** write a `curry(fn)` that takes any two-argument function and returns its curried version.

### Question 3

```javascript
function sum1(a, b) {
    return a + b;
}

const curriedSum1 = curry(sum1);
console.log(curriedSum1(1)(2)); // 3
```

<details><summary>Show Answer</summary>

```
function curry(f) {
    return function (a) {
        return function (b) {
            return f(a, b);
        };
    };
}
```

**Explanation:** `curry` wraps any two-argument function so it can be called one argument at a time instead of both at once. This version is hardcoded to exactly two arguments — the next section generalizes it to work for any number of arguments.

</details>

---

## A Generic Curry Function for Any Arity

**Challenge:** make a `curry()` that works for a function of *any* number of arguments, and accepts them in any combination — all at once, one at a time, or grouped.

### Question 4 — Using `func.length` and `===`

```javascript
function product(a, b, c) {
    return a * b * c;
}

const curriedProduct = curryAdvanced(product);
console.log(curriedProduct(1, 2, 3)); // 6
console.log(curriedProduct(1)(2, 3)); // 6
console.log(curriedProduct(1)(2)(3)); // 6
console.log(curriedProduct(1, 2)(3)); // 6
```

<details><summary>Show Answer</summary>

```
const curryAdvanced = (func) => {
    return function curry(...args) {
        if (args.length === func.length) {
            return func(...args);
        } else {
            return (...args2) => {
                return curry(...args.concat(args2));
            };
        }
    };
};
```

**Explanation:** `func.length` gives the number of *named, non-default, non-rest* parameters a function was declared with — for `product(a, b, c)`, that's `3`. On every call, `curry` accumulates arguments into `args`; once `args.length` reaches exactly `func.length`, it calls the original function. Until then, it returns another function that keeps collecting more arguments.

**Gotcha — this version breaks on extra arguments:**
</details>

```javascript
console.log(curriedProduct(1, 2, 3, 4)); // called with 4 args, product only expects 3
```

```
[Function (anonymous)]
```

Because the check is `args.length === func.length` (strict equality), 4 args never equals 3, so it just keeps returning a new function forever instead of calling `product`. Question 5 fixes this with `>=`.

### Using `>=` Instead of `===` to solve this issue

```javascript
function product(a, b, c) {
    return a * b * c;
}

const curriedProduct = curryAdvanced(product);
console.log(curriedProduct(1, 2, 3));
console.log(curriedProduct(1)(2, 3));
console.log(curriedProduct(1, 2, 3, 4)); // extra argument, now handled
```

<details><summary>Show Answer</summary>

```
const curryAdvanced = (func) => {
    const curried = (...args1) => {
        if (args1.length >= func.length) {
            return func.apply(this, args1);
        } else {
            return (...args2) => curried.apply(this, args1.concat(args2));
        }
    };
    return curried;
};
```

**Explanation:** Swapping `===` for `>=` fixes Question 4's gotcha — as soon as *enough* arguments have accumulated (even more than needed), the original function is called immediately with all of them; `product` simply ignores the extra 4th argument since it only declared three parameters. This is the more robust version, and the one worth reaching for in an actual interview unless the interviewer specifically wants strict arity matching.

</details>

---

## Curry with a Terminating Empty Call

**Challenge:** support a curry chain that sums an arbitrary number of arguments across an arbitrary number of calls, terminated by an empty `()` call — similar to infinite currying (Question 1), but accepting multiple arguments per call instead of just one.

### Question 6

```javascript
console.log(curryOp(10)(11)(1, 2, 34)(12)());
```

<details><summary>Show Answer</summary>

```
function curryOp(...args) {
    return function curried(...nextArgs) {
        if (nextArgs.length === 0) {
            return args.reduce((acc, num) => acc + num, 0);
        }
        args = [...args, ...nextArgs];
        return curried;
    };
}
```

**Explanation:** Each call either adds more arguments to the running `args` array (via closure — `args` is captured and mutated across calls) or, if called with zero arguments, reduces the accumulated `args` down to a sum. `10 + 11 + 1 + 2 + 34 + 12 = 70`.

</details>

### Question 7 — The Same Idea Without a Trailing `()`, via `toString`

```javascript
console.log(+curryOp(10)(11)(1, 2, 34)(12));
```

<details><summary>Show Answer</summary>

```
function curryOp(...args) {
    function curried(...newArgs) {
        args = [...args, ...newArgs];
        return curried;
    }
    curried.toString = () => args.reduce((acc, num) => acc + num, 0);
    return curried;
}

```

**Explanation:** Instead of requiring a final empty `()` call to signal "stop and total," this version overrides `curried.toString()` so that coercing the function to a primitive (via the unary `+`, template-literal interpolation, or string concatenation) triggers the sum. `+curryOp(...)` forces numeric coercion, which calls `toString()` under the hood — same mechanism as `Symbol.toPrimitive`/`valueOf` coercion covered in [Coercion.md](Coercion.md). A neat trick, but the explicit `()` terminator from Question 6 is more explicit and readable in real code.

</details>

---

## Practical Use Case: Deriving Specialized Functions

### Question 8

```javascript
const multiply = a => b => a * b;

const double = multiply(2);
const triple = multiply(3);

console.log(double(5));
console.log(triple(5));
```

<details><summary>Show Answer</summary>

```
10
15
```

**Explanation:** `multiply(2)` returns a new function permanently closed over `a = 2` — calling it later with different `b` values reuses that same specialized function. This is the real payoff of currying in practice: instead of writing `double`/`triple` as separate hand-written functions, they're derived on demand from one general `multiply`, each remembering its own preset argument via closure.

A similar pattern shows up in event-handling / logging code, where a family of related functions share a common "prefix" argument:

```javascript
const logEvent = category => action => label => `[${category}] ${action}: ${label}`;

const logClick = logEvent('UI')('click');
console.log(logClick('submit-button'));
console.log(logClick('cancel-button'));
```

```
[UI] click: submit-button
[UI] click: cancel-button
```

`logClick` is a reusable, specialized function derived from the general `logEvent` — useful for building a family of related loggers/handlers (`logClick`, `logHover`, `logSubmit`, ...) without repeating the `category`/`action` arguments every time.

</details>
