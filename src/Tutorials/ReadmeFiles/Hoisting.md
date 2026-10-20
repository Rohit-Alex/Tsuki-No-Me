# Hoisting in JavaScript

## Definition

**Hoisting** is not a real mechanism where code is physically moved. Instead, it's a metaphor describing how JavaScript handles variable and function declarations during compilation, where declarations are processed during the first pass before code execution.

## How Hoisting Works

Everything in JavaScript happens inside an **"Execution Context"** which has 2 phases:
1. **Memory allocation phase** (variable environment)
2. **Code execution phase** (Thread of execution)

Hoisting makes use of the memory allocation phase. Variables and functions are allocated in memory even before execution begins. Hence, variables and functions are accessible even before they are declared.

## Execution Context Warm-up

Before diving into hoisting puzzles, it helps to trace a plain execution context first — see [Example 3 in eventLoop.md](eventLoop.md) for a step-by-step walkthrough of memory allocation vs code execution for a simple `square()` function.

## Important Rules

### What Gets Hoisted:
- **`var` declarations**: Assigned value `undefined`
- **Function declarations**: Entire function code is stored in memory
- **`let` and `const`**: Hoisted but left uninitialized (Temporal Dead Zone)
- **`class` declarations**: ⚠️ Also hoisted into the Temporal Dead Zone, exactly like `let`/`const` — this is commonly misstated as "classes aren't hoisted," but `typeof MyClass` before the declaration throws the exact same `ReferenceError: Cannot access 'MyClass' before initialization` that a TDZ `let`/`const` does (see Question 18) — not "MyClass is not defined," which is what you'd get for something genuinely never hoisted at all.

### What Doesn't Get Hoisted:
- **Function expressions**: Treated as variables
- **Arrow functions**: Treated as variables
- **Initializations**: Only declarations are hoisted, not assignments

## Temporal Dead Zone (TDZ)

The gap between when a `let`/`const` variable is allocated memory and when it gets executed (assigned a value) is called the **"Temporal Dead Zone"**.

**Purpose**: TDZ ensures that `const` variables maintain their single immutable value and cannot be observed in an intermediate, uninitialized state.

## Practice Questions

### Question 1

What will be the output?

```javascript
console.log(frndo);
var frndo;
frndo = 'Amane';
console.log(frndo);
```

<details>
<summary>Show Answer</summary>

```
undefined
Amane
```

**Explanation:** `var frndo` is hoisted and initialized with `undefined`. The first console.log shows `undefined`, then after assignment, it shows 'Amane'.

</details>

### Question 2

What will happen when this code runs?

```javascript
console.log(frndo1);
let frndo1 = 'Amane';
```

<details>
<summary>Show Answer</summary>

```
ReferenceError: Cannot access 'frndo1' before initialization
```

**Explanation:** `let` variables are hoisted but remain in the Temporal Dead Zone until their declaration line is reached.

</details>

### Question 3

What will be the output?

```javascript
console.log(welcome);
welcome();
function welcome() {
    console.log('Hello world');
}
```

<details>
<summary>Show Answer</summary>

```
[Function: welcome]
Hello world
```

**Explanation:** Function declarations are fully hoisted - both the name and the function body are available before the declaration.

</details>

### Question 4

What will happen when this code runs?

```javascript
console.log(frndo2);
let frndo2 = 'Amane';
```

<details>
<summary>Show Answer</summary>

```
ReferenceError: Cannot access 'frndo2' before initialization
```

**Explanation:** Same as `let` - `const` variables are also in the Temporal Dead Zone.

</details>

### Question 5

What will happen when this code runs?

```javascript
console.log(frndo3);
const frndo3 = 'Amane';
```

<details>
<summary>Show Answer</summary>

```
ReferenceError: Cannot access 'frndo3' before initialization
```

**Explanation:** Same as `let` and `const` in Questions 2 and 4 - `frndo3` is hoisted but sits in the Temporal Dead Zone until its declaration line executes.

</details>

### Question 6

What will be the output?

```javascript
console.log(welcome);
welcome();
var welcome = function () {
    console.log('Hello world');
}
```

<details>
<summary>Show Answer</summary>

```
undefined
TypeError: welcome is not a function
```

**Explanation:** Function expressions are treated as `var` variables. `welcome` is hoisted as `undefined`, so trying to call it throws a TypeError.

</details>

### Question 7

What will happen when this code runs?

```javascript
console.log(welcome1);
welcome1();
let welcome1 = function () {
    console.log('Hello world');
}
```

<details>
<summary>Show Answer</summary>

```
ReferenceError: Cannot access 'welcome1' before initialization
```

**Explanation:** `let` variables (including function expressions assigned to `let`) are in the Temporal Dead Zone.

</details>

### Question 8

What will happen when this code runs?

```javascript
console.log(welcome2);
welcome2();
const welcome2 = function () {
    console.log('Hello world');
}
```

<details>
<summary>Show Answer</summary>

```
ReferenceError: Cannot access 'welcome2' before initialization
```

**Explanation:** Same as `let` - `const` variables are in the Temporal Dead Zone.

</details>

### Question 9

What will be the output?

```javascript
console.log(welcome3);
welcome3();
var welcome3 = () => {
    console.log('Hello world');
}
```

<details>
<summary>Show Answer</summary>

```
undefined
TypeError: welcome3 is not a function
```

**Explanation:** Arrow functions are treated as variables. With `var`, it's hoisted as `undefined`, then calling it throws TypeError.

</details>

### Question 10

What will happen when this code runs?

```javascript
console.log(welcome4);
welcome4();
let welcome4 = () => {
    console.log('Hello world');
}
```

<details>
<summary>Show Answer</summary>

```
ReferenceError: Cannot access 'welcome4' before initialization
```

**Explanation:** `let` with arrow function is in the Temporal Dead Zone.

</details>

### Question 11

What will happen when this code runs?

```javascript
console.log(welcome5);
welcome5();
const welcome5 = () => {
    console.log('Hello world');
}
```

<details>
<summary>Show Answer</summary>

```
ReferenceError: Cannot access 'welcome5' before initialization
```

**Explanation:** `const` with arrow function is in the Temporal Dead Zone.

</details>

### Question 12

What will be the output?

```javascript
var a = 1;
function b() {
    a = 10; 
    return;
    function a() { }
}
b();
console.log(a);
```

<details>
<summary>Show Answer</summary>

```
1
```

**Explanation:** 
- Inside function `b`, `function a() {}` is hoisted, creating a local variable `a`
- The assignment `a = 10` modifies the local `a`, not the global one
- Global `a` remains unchanged at 1

</details>

### Question 13

What will be the output?

```javascript
function print() {
  var square1 = number * number;
  console.log(square1);
  
  var number = 50;
  
  var square2 = number * number;
  console.log(square2);
}
print();
```

<details>
<summary>Show Answer</summary>

```
NaN
2500
```

**Explanation:** 
- `var number` is hoisted but initialized as `undefined`
- First calculation: `undefined * undefined = NaN`
- After assignment, `number = 50`, so second calculation: `50 * 50 = 2500`

</details>

### Question 14

What will be the output?

```javascript
function foo() {
    function bar() {
        return 3;
    }
    return bar();
    function bar() {
        return 8;
    }
}
console.log(foo());
```

<details>
<summary>Show Answer</summary>

```
8
```

**Explanation:** Both `bar` function declarations are hoisted. The second one overwrites the first one, so `bar()` returns 8.

</details>

### Question 15

What will happen when this code runs?

```javascript
function parent() {
    var hoisted = "I'm a variable";
    function hoisted() {
        return "I'm a function";
    }
    return hoisted();
}
console.log(parent());
```

<details>
<summary>Show Answer</summary>

```
TypeError: hoisted is not a function
```

**Explanation:** 
- Function `hoisted` is hoisted first
- Then `var hoisted = "I'm a variable"` overwrites it with a string
- Trying to call a string as a function throws TypeError

</details>

### Question 16

What will be the output?

```javascript
console.log(foo1());
function foo1() {
    var bar = function () {
        return 3;
    };
    return bar();
    var bar = function () {
        return 8;
    };
}
```

<details>
<summary>Show Answer</summary>

```
3
```

**Explanation:** 
- Both `var bar` declarations are hoisted as `undefined`
- Only the first function assignment executes before `return bar()`
- So `bar()` returns 3

</details>

### Question 17

What will be the output?

```javascript
(function () {
    console.log('Original value was: ' + myVar);
    var myVar = 'bar';
    console.log('New value is: ' + myVar);
})();
```

<details>
<summary>Show Answer</summary>

```
Original value was: undefined
New value is: bar
```

**Explanation:** Inside the IIFE, `var myVar` is hoisted as `undefined`, then assigned 'bar' later.

</details>

### Question 18 — `typeof` Isn't Always "Safe"

`typeof` is famously safe to use on a variable that was never declared at all — it returns `"undefined"` rather than throwing. Does that hold for a variable that *is* declared, but currently sitting in the TDZ?

```javascript
console.log(typeof totallyUndeclaredVar);

console.log(typeof tdzVar);
let tdzVar = 5;
```

<details>
<summary>Show Answer</summary>

```
undefined
ReferenceError: Cannot access 'tdzVar' before initialization
```

**Explanation:** ⚠️ This is a genuinely common interview trap. `typeof` only avoids throwing for identifiers that are **truly undeclared anywhere in scope** — because in that case, there's no binding at all for it to conflict with. `tdzVar`, on the other hand, **is** declared (hoisted, per the `let` rules above) — it's just uninitialized. `typeof` still has to resolve the binding to know what to report on, and resolving a TDZ binding always throws, `typeof` included. The "typeof is always safe" rule of thumb only applies to genuinely undeclared variables, not to declared-but-not-yet-initialized ones.

</details>

### Question 19 — Class Declarations Are in the TDZ Too

```javascript
console.log(typeof MyClass);
class MyClass {}
```

<details>
<summary>Show Answer</summary>

```
ReferenceError: Cannot access 'MyClass' before initialization
```

**Explanation:** If classes truly weren't hoisted at all, this would behave like `totallyUndeclaredVar` above and print `"undefined"` — instead it throws the exact same TDZ error `let`/`const` produce. This confirms `class` declarations follow the same hoisting rule as `let`/`const`: hoisted to the top of their scope, but left uninitialized until the declaration line actually executes.

</details>

### Question 20 — TDZ Spans the Entire `switch` Block

```javascript
function testSwitch(val) {
  switch (val) {
    case 1:
      let x = 'case1';
      console.log(x);
      break;
    case 2:
      console.log(x);
      break;
  }
}

testSwitch(2);
```

<details>
<summary>Show Answer</summary>

```
ReferenceError: Cannot access 'x' before initialization
```

**Explanation:** A `switch` statement's `{ }` is **one single block**, shared by every `case` inside it — it is *not* one block per case. `let x` declared inside `case 1` is hoisted to the top of the *entire switch block*, so `case 2` can see that `x` exists (unlike a truly separate scope, where `x` would be undeclared) — but since execution jumped straight to `case 2` without ever running `case 1`'s initialization, `x` is still sitting in the TDZ, and reading it throws. The general fix is to wrap each `case` body that declares a variable in its own `{ }` block, giving it a genuinely separate scope.

</details>

### Question 21 — The Hardest One: Function Declarations Inside a Block

```javascript
var a = "Rohit"
if (true) {
    console.log(a, 'first')
    a = "Sachin";
    console.log(a, '2nd')
    function a() {}
    a = "Nikhil"
    console.log(a, 'last')
}
console.log(a, 'lasteest')
```

<details>
<summary>Show Answer</summary>

**In a plain script / non-strict mode:**

```
[Function: a] first
Sachin 2nd
Nikhil last
Sachin lasteest
```

**In strict mode (`'use strict'`, or inside an ES module, or inside a class body):**

```
[Function: a] first
Sachin 2nd
Nikhil last
Rohit lasteest
```

**Explanation:** ⚠️ This is one of the most obscure corners of hoisting — legacy behavior formally specified in the spec's **Annex B**, kept only for compatibility with old websites.

In **strict mode**, it's simple: `function a() {}` is block-scoped, exactly like `let`. Inside the `if` block, `a` refers to that block-scoped function/variable the whole way through, completely independent of the outer `var a`. The outer `var a` is never touched by anything inside the block, so the final `console.log` outside it still shows the original `"Rohit"`.

**In non-strict (sloppy) mode**, the easiest way to think about it is that `function a() {}` inside a block quietly behaves as if it were **two separate declarations at once**:

```javascript
var a;        // 1. an invisible `var` in the enclosing function/global scope
{
    let a = function () {};  // 2. a block-scoped binding, hoisted to the top of the block
    // ...and right here, at the function declaration's own textual position,
    // an invisible assignment happens: (var) a = (let) a;
}
```

So there are genuinely **two different `a` bindings** alive at once inside the block — call them `(var) a` (the outer one, matching what the code literally calls `a` outside the block) and `(let) a` (the block-scoped one) — and they only get synced up **once**, at the exact line where `function a() {}` sits in the source. Walking through it line by line:

**Step 1 — the block is entered**
```javascript
if (true) {
```
`function a() {}` is hoisted to the top of the block immediately, so `(let) a` exists and already holds the function before any other line inside the block runs:
- `(var) a` → `"Rohit"` (untouched)
- `(let) a` → `function a() {}`

**Step 2**
```javascript
console.log(a, 'first')
```
Inside the block, `a` always resolves to `(let) a` (it shadows the outer one). Logs **`[Function: a] first`**.

**Step 3**
```javascript
a = "Sachin";
```
Writes `(let) a` only:
- `(var) a` → `"Rohit"` (still untouched)
- `(let) a` → `"Sachin"`

**Step 4**
```javascript
console.log(a, '2nd')
```
Reads `(let) a`. Logs **`Sachin 2nd`**.

**Step 5 — the sync point**
```javascript
function a() {}
```
This line was already hoisted (Step 1), so it doesn't re-create the function here — but this is exactly where the one-time Annex B sync happens: `(var) a = (let) a`.
- `(var) a` → `"Sachin"` ← just synced
- `(let) a` → `"Sachin"` (unchanged)

**Step 6**
```javascript
a = "Nikhil"
```
The sync already happened in Step 5 — the two bindings are now independent. This only writes `(let) a`:
- `(var) a` → `"Sachin"` (frozen — never touched again)
- `(let) a` → `"Nikhil"`

**Step 7**
```javascript
console.log(a, 'last')
```
Reads `(let) a`. Logs **`Nikhil last`**.

**Step 8 — outside the block**
```javascript
console.log(a, 'lasteest')
```
`(let) a` no longer exists once the block has exited — only `(var) a` is reachable here, still frozen at the value it was synced to back in Step 5. Logs **`Sachin lasteest`**.

**Practical takeaway:** avoid declaring functions directly inside `if`/`for`/block bodies in code that might run in non-strict mode — having two bindings with the same name, synced only once at an easy-to-miss moment, is confusing even to experienced developers. Use a function expression or arrow function assigned to a `let`/`const` instead, which behaves consistently and predictably in both modes.

_Blog_: https://dev.to/rkirsling/tales-from-ecma-s-crypt-annex-b-3-3-56go
</details>

### Question 22 — `var` Inside a `catch` Block

```javascript
function test() {
  try {
    throw "Error";
  } catch (err) {
    var err = 5;
    console.log("Inside:", err);
  }

  console.log("Outside:", err);
}

test();
```

<details>
<summary>Show Answer</summary>

```
Inside: 5
Outside: undefined
```

**Why:**

1. **`var err` is hoisted to the function scope.** The declaration `var err` inside the catch block is hoisted to the top of `test()`, so the function has its own `err` variable, initially `undefined`.
2. **The catch parameter creates a separate block-scoped binding.** `catch (err)` creates a new `err` that exists only inside the catch block, and it holds `"Error"` at first. This shadows the function-level `err` within the block.
3. **`var err = 5` inside the catch block assigns to the catch parameter, not the hoisted variable.** The `var` declaration is hoisted, but the *initializer* (`= 5`) is just an assignment, and assignments go to the nearest binding in scope. The nearest `err` is the catch parameter, so the catch parameter becomes `5`.
4. `console.log("Inside:", err)` reads the catch parameter, which is now `5`.
5. `console.log("Outside:", err)` is outside the catch block, so the catch parameter is out of scope. It sees the function-level `err` (from the hoisted `var`), which was never assigned. It's still `undefined`.

**Mental model:** it behaves roughly like this:

```javascript
function test() {
  var err;                     // hoisted declaration (function scope)
  try {
    throw "Error";
  } catch (err) {              // new block-scoped binding
    err = 5;                   // assigns to the catch param
    console.log("Inside:", err);   // 5
  }
  console.log("Outside:", err);    // undefined
}
```

**Analogy:** think of two people named "err" — one sitting in the office (function scope) and one standing at the front desk (catch block). When you walk up to the front desk and shout "err, take this 5!", the person at the desk takes it. The one in the office never hears you.

**Notes:**
- Redeclaring a catch parameter with `var` is only allowed because of a legacy rule in the spec's **Annex B**. Most other "same name twice in a block" cases are errors.
- With `let` it's a `SyntaxError`: `catch (e) { let e = 1; }` → `Identifier 'e' has already been declared`.
- With a destructured catch parameter, even `var` is a `SyntaxError`: `catch ({ message }) { var message = 1; }` throws.
- Strict mode gives the same output here.

</details>

### Question 23 — `var` Without an Initializer Inside `catch`

```javascript
function test() {
  try {
    throw "Error";
  } catch (err) {
    var err;
    console.log("Inside:", err);
  }
  console.log("Outside:", err);
}
test();
```

<details>
<summary>Show Answer</summary>

```
Inside: Error
Outside: undefined
```

**Explanation:** A common guess is that `var err;` "resets" `err` to `undefined` inside the block. It doesn't. A bare `var err;` has no `= value` part, so after hoisting there is **nothing left on that line to run**. The hoisted declaration goes to the function scope, and the line itself does nothing.

So inside the block, `err` is still the catch parameter, holding `"Error"`. Outside the block, `err` is the hoisted function-level `var`, which nobody ever assigned — `undefined`.

Rule of thumb: `var x;` never changes a value. Only the `= something` part does, and that part stays on its original line.

</details>

### Question 24 — Catch Parameter Shadowing a Global

```javascript
var x = "global";

function test() {
  try {
    throw "Error";
  } catch (x) {
    var x = "local";
    console.log(x);
  }
  console.log(x);
}

test();
console.log(x);
```

<details>
<summary>Show Answer</summary>

```
local
undefined
global
```

**Explanation:** There are **three** different `x` bindings here:

| Binding | Where it lives | Final value |
|---|---|---|
| global `x` | global scope | `"global"` |
| function `x` | hoisted from `var x` to the top of `test()` | `undefined` |
| catch `x` | the catch block only | `"local"` |

1. `var x` inside the catch is hoisted to the top of `test()`. That creates a function-level `x` which **shadows the global** for the whole function.
2. `x = "local"` goes to the nearest `x`, which is the catch parameter. Logs **`local`**.
3. After the catch block, the catch `x` is gone. The nearest `x` is now the function-level one, never assigned. Logs **`undefined`** — *not* `"global"`, because the hoisted `var` hides the global everywhere inside `test()`.
4. Outside `test()`, only the global `x` is visible, and nothing touched it. Logs **`global`**.

The trap is step 3: people expect `"global"` because they forget that the `var` inside the catch still creates a variable for the whole function.

</details>

### Question 25 — Catch Parameter Captured by a Closure

```javascript
function test() {
  try {
    throw "Error";
  } catch (err) {
    var err = 5;
    setTimeout(() => console.log("Timeout:", err), 0);
  }
  err = 10;
  console.log("Sync:", err);
}
test();
```

<details>
<summary>Show Answer</summary>

```
Sync: 10
Timeout: 5
```

**Explanation:**

1. `var err = 5` inside the catch sets the **catch parameter** to `5` (same rule as Question 22).
2. The arrow function passed to `setTimeout` is created inside the catch block, so it closes over the **catch parameter** `err`, not the function-level one.
3. `err = 10` runs outside the catch block. There, the nearest `err` is the function-level hoisted `var`, so that one becomes `10`. The catch parameter is untouched and stays `5`.
4. `console.log("Sync:", err)` runs right away and reads the function-level `err` → **`Sync: 10`**.
5. Later, the timeout callback runs. It reads the `err` it closed over — the catch parameter — which is still `5` → **`Timeout: 5`**.

Many people expect `Timeout: 10`, reasoning "the timeout runs last, and the last assignment was `10`." That would be true if there were only one `err`. But a closure remembers **which variable** it saw, not just the name. The callback is holding on to the catch block's `err`, and nothing ever changed that one after it became `5`.

</details>

## Key Takeaways

1. **Function declarations** are fully hoisted (name + body)
2. **`var` declarations** are hoisted and initialized with `undefined`
3. **`let`/`const`/`class` declarations** are all hoisted but remain uninitialized (TDZ) — `class` follows the exact same rule as `let`/`const`, despite the common misconception that it "isn't hoisted" at all
4. **Function expressions** and **arrow functions** follow variable hoisting rules
5. Only **declarations** are hoisted, not **initializations**
6. **Function declarations** take precedence over **variable declarations** with the same name
7. **Variable assignments** can overwrite **hoisted functions**
8. **`typeof` is only "safe" on genuinely undeclared variables** — on a variable that's declared but still in the TDZ, `typeof` throws the same `ReferenceError` as reading it directly
9. A `switch` statement's `{ }` is **one shared block** — a `let`/`const` declared in one `case` is in the TDZ (or already initialized) for every other `case` in the same `switch`, not scoped per-case
10. **Function declarations inside a block behave differently in strict vs. non-strict mode** — strict mode block-scopes them cleanly; non-strict mode additionally syncs their value out to an enclosing `var` of the same name exactly once (Annex B legacy behavior), then the two bindings diverge
11. **`var` with the same name as a `catch` parameter creates two variables** — the declaration is hoisted to the function, but the `= value` part writes to the catch parameter. Outside the catch block you see the function-level one, usually still `undefined`

## Best Practices

1. **Declare variables at the top** of their scope
2. **Use `const` by default**, `let` when reassignment is needed
3. **Avoid `var`** to prevent confusion
4. **Declare functions before using them** for clarity
5. **Be aware of TDZ** when using `let`/`const`/`class`
6. **Avoid declaring functions directly inside blocks** (`if`/`for`/`while` bodies) — the sloppy-mode Annex B behavior is confusing even for experienced developers; use a `let`/`const` function expression or arrow function instead