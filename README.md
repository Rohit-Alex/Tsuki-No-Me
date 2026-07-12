# Interview Preparation and Cheat Sheet

## Table of Contents

- [Phase 1: JavaScript Fundamentals](#phase-1)
- [Phase 2: Advanced JavaScript](#phase-2)
- [Phase 3: Revision & I/O Questions](#phase-3)
- [Phase 4: HTML, CSS & Casual JS Questions](#phase-4)
- [Phase 5: React & Ecosystem](#phase-5)

---

<a id="phase-1"></a>

## Phase 1: JavaScript Fundamentals

### 1. What is JavaScript?

- It is a **weakly typed, dynamic language** — no variable is bound to any datatype, and its type can change over successive assignments.
- A **scripting language** originally designed to run inside a web browser and make web pages interactive. Unlike traditional compiled languages, JavaScript code is interpreted and executed by the browser's JavaScript engine.
- Can be used for both **client-side and server-side** development.
- **Single-threaded** — JavaScript code executes on a single call stack and can only perform one task at a time.
- **Synchronous** — code executes sequentially on a single thread; each line runs to completion before the next one starts.
- However, JavaScript also has **built-in support for asynchronous programming**, which lets code run non-sequentially without blocking the main thread. This is achieved through callbacks, `setTimeout`, promises, and `async`/`await`.
- JavaScript is an interpreted language. Modern engines are very fast at interpreting code, often using **just-in-time (JIT) compilation** to optimize performance — so JavaScript can run at speeds comparable to compiled languages.

### 2. What is the difference between an interpreted and a compiled language?

**Interpreted language:**

- Source code → executable code
- Executed line by line at runtime
- More flexible and easier to use
- Doesn't require creating an executable file
- Slower execution due to real-time translation
- e.g. JavaScript, Python

**Compiled language:**

- Source code → machine code (before execution) → executable code
- Faster execution due to pre-compiled machine code
- Executes the entire program in one go
- Compiled code is optimized ahead of time, so it generally runs faster and performs better than interpreted code

### 3. What's the difference between client-side and server-side?

**Client-side:**

- Code executed on the user's device (usually a web browser) — HTML, CSS, and JavaScript.
- Responsible for rendering the web page and handling user interactions, such as clicking a button or filling out a form.

**Server-side:**

- Code executed on the server (web server, application server, or database server).
- Usually involves technologies like PHP, Python, or Node.js.
- Responsible for processing client requests, interacting with databases or other resources, and generating dynamic content sent back to the client.

> JavaScript can be used for **both client-side and server-side programming**. On the client-side, it creates interactive web pages, validates form data, and provides visual effects. On the server-side (Node.js), it builds server applications, interacts with databases, and handles incoming HTTP requests.

### 4. What happens behind the scenes when a webpage built with HTML, CSS and JS is opened?

1. **HTML parsing** — the browser parses the HTML to build a DOM (Document Object Model) tree representing the page structure: headings, paragraphs, images, links, etc.
2. **CSS parsing** — the browser parses the CSS to build a CSSOM (CSS Object Model) tree representing styles and layout — size, position, and appearance of each element.
3. **Rendering** — the DOM and CSSOM trees are combined into a render tree, used to paint the page on screen.
4. **JavaScript execution** — if the page includes JavaScript, the browser executes it. JS can modify the DOM/CSSOM, add interactivity, and perform other actions.
5. **Layout and painting** — as user activity updates values or layout, affected areas are repainted.
6. **Loading external resources** — images, videos, and scripts are loaded by the browser as needed.

### 5. Does CSS parsing block HTML parsing?

[Click to open](src/Tutorials/ReadmeFiles/CssRenderBlocking.md)

> Short answer: no — CSS is **render-blocking**, not **parser-blocking**. The HTML parser keeps building the DOM while a stylesheet downloads; the browser just can't *paint* anything until the CSSOM is ready too.

### 6. What is the DOM?

A tree-like structure, with nodes representing elements, attributes, and text. The DOM gives programs a way to interact with the web page — reading, modifying, and deleting content and styles.

### 7. Explain `async` and `defer` in JS

**The problem:**

- When the browser is building the DOM and encounters a `<script>...</script>` tag, it must pause and execute the script immediately. The same applies to external scripts (`<script src="...">`) — the browser waits for the download, executes it, and only then continues parsing the rest of the page.
- By default, script downloading and execution is synchronous: the browser waits for each script to finish before moving to the next one.
- This can slow down page load time, especially with multiple or large scripts.

**Basic HTML syntax:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Basic Web Syntax Template</title>

    <!-- Internal CSS -->
    <style>
        body {
            font-family: Arial, sans-serif;
        }
    </style>

    <!-- Link external CSS -->
    <link rel="stylesheet" href="style.css">

    <!-- Can add a JS script here as well -->
    <script src="script1.js"></script>
</head>
<body>
    <!-- HTML content: the structural layout of the web page -->

    <!-- Internal JavaScript -->
    <script>
        const button = document.getElementById("action-btn");
        button.addEventListener("click", function() {
        });
    </script>

    <!-- Link external JS -->
    <script src="script2.js"></script>
</body>
</html>
```

A `<script>` tag can go in two places:

**1. Inside `<head>`:**
If the script tag is placed here, HTML parsing is blocked until the script downloads and finishes executing. This causes two problems:
- Scripts can't see DOM elements below them, so they can't attach handlers, etc.
- If there's a bulky script at the top of the page, it "blocks the page" — users can't see any content until it downloads and runs.

**2. At the bottom of the page, just before `</body>`:**
Placing the script here avoids the issue above — HTML parsing isn't blocked, and the UI renders immediately. But this introduces one problem:
- The browser only notices the script (and starts downloading it) after the *entire* HTML document has downloaded. For long documents, that can be a noticeable delay — if the very first element on the page depends on a click handler, it stays unresponsive until the script downloads and executes.

**The solution — `async` / `defer`:**

Both `async` and `defer` let the browser download the script in parallel while it continues parsing the HTML. They differ in *when* and *in what order* the scripts execute.

**`defer`:**
- The script downloads in parallel while the browser continues parsing HTML and building the DOM. It's kept ready (downloaded) and executed only once the entire HTML document has been parsed and the DOM is fully built.
- Deferred scripts never block the page.
- Deferred scripts always execute once the DOM is ready, but before the `DOMContentLoaded` event.
- Execution order follows the order the scripts were written in the document.

  ```html
  <script defer src="https://javascript.info/article/script-async-defer/long.js"></script>
  <script defer src="https://javascript.info/article/script-async-defer/small.js"></script>
  ```

  Even though `small.js` (5kb) may finish downloading before `long.js` (15kb), it still waits and runs *after* `long.js` has downloaded and executed, because `long.js` was written first.

**`async`:**
- The script also downloads in parallel and doesn't block HTML parsing.
- Key differences from `defer`:
  - It doesn't wait for HTML parsing to finish — parsing and script downloading happen in parallel. Once the script finishes downloading, it executes immediately, even if the rest of the page hasn't finished loading.
  - `DOMContentLoaded` and async scripts don't wait for each other.
  - For multiple scripts, whichever finishes downloading first executes first — the order they were written in doesn't matter.

  ```html
  <script async src="https://javascript.info/article/script-async-defer/long.js"></script>
  <script async src="https://javascript.info/article/script-async-defer/small.js"></script>
  ```

  Since `small.js` loads first, it executes first as well — regardless of write order.

**Timeline comparison:**

*No attribute (default — blocking):*

```
HTML parsing starts
      │
      ▼
<script src="..."> encountered
      │
      ▼
HTML parsing PAUSES
      │
      ▼
Script downloads
      │
      ▼
Script executes
      │
      ▼
HTML parsing resumes
```

*`defer`:*

```
HTML parsing starts
      │
      ▼
<script defer src="..."> encountered
      │
      ├──────────────► Script downloads (parallel)
      │                        │
      ▼                        │
Continue HTML parsing          │
      │                        │
      ▼                        │
   DOM ready ◄─────────────────┘
      │
      ▼
Deferred scripts execute, in document order
      │
      ▼
DOMContentLoaded fires
```

*`async`:*

```
HTML parsing starts
      │
      ▼
<script async src="..."> encountered
      │
      ├──────────────► Script downloads (parallel)
      │                        │
      ▼                        │
Continue HTML parsing          │
      │                        ▼
      │                 Download finishes
      │                        │
      ▼◄───────────────────────┘
HTML parsing PAUSES — script executes immediately
      │
      ▼
HTML parsing resumes
```

The key visual difference: with no attribute, downloading and parsing never overlap. With `defer`, downloading overlaps parsing but execution always waits until parsing is completely done. With `async`, downloading overlaps parsing too, but execution can interrupt parsing at any moment — whenever that particular script happens to finish downloading.

**Where `DOMContentLoaded` fits in:**

`DOMContentLoaded` fires on `document` once the HTML has been **fully parsed and the DOM tree is built** — it does **not** wait for images, stylesheets, or iframes to finish loading. (That's what the `window.onload`/`load` event is for.) How it interacts with each script type:

- **No attribute (blocking):** the script executes as part of HTML parsing itself, so it always finishes *before* `DOMContentLoaded` fires — parsing can't even reach the end of the document until every blocking script is done.
- **`defer`:** deferred scripts are guaranteed to run *after* parsing finishes but *before* `DOMContentLoaded` fires, in the order they were written. This makes `defer` the safest choice if a script needs a fully-built DOM but should still run before the page announces itself "ready".
- **`async`:** `DOMContentLoaded` does **not** wait for async scripts, and async scripts don't wait for it either — they run whenever their download happens to finish, completely independently of the `DOMContentLoaded` timing. An async script could execute before, during, or after `DOMContentLoaded` fires.

```
Execution order relative to DOMContentLoaded:

defer script(s)  ──always──▶  DOMContentLoaded
async script(s)  ──???─────▶  DOMContentLoaded   (no guaranteed order either way)
```

> **Note:** Use `async` when scripts are fully independent of each other and don't require the complete DOM tree to execute.

### 8. What does the `type` attribute signify on a `<script>` tag?

[Click to open](src/Tutorials/ReadmeFiles/ScriptType.md)

### 9. What are the different data types?

**Primitive data types:**

1. **Number**
   - Range: ±(2⁻¹⁰⁷⁴ [`Number.MIN_VALUE`]) to (2¹⁰²⁴ [`Number.MAX_VALUE`])
   - Positive values greater than `Number.MAX_VALUE` become `+Infinity`.
   - Positive values smaller than `Number.MIN_VALUE` become `+0`.
   - Negative values smaller than `-Number.MAX_VALUE` become `-Infinity`.
   - Negative values greater than `-Number.MIN_VALUE` become `-0`.
2. **BigInt**
   - `Number` can only safely store integers in the range `-(2⁵³ − 1)` (`Number.MIN_SAFE_INTEGER`) to `2⁵³ − 1` (`Number.MAX_SAFE_INTEGER`).
   - `BigInt` lets you safely store and operate on integers beyond that safe range.
3. **String**
4. **Boolean**
5. **null**
6. **undefined**
7. **Symbol**

**Non-primitive data types:**

1. **Objects** — `Array` is included here as well.
2. **Functions**

### 10. What does the `++` operator do, according to the specification?

It grabs the old value, coerces it to a number, and returns the original number after updating it with an increment of one.

```javascript
var y = "5";
y++;    // 5  (postfix ++ returns the OLD value, coerced to a number)
y;      // 6  (y itself has been updated to 6)
```

### 11. Difference between `undefined` and `undeclared`

`undefined` means a variable exists but has no value. `undeclared` means a variable has never been created in any accessible scope.

### 12. What is the Temporal Dead Zone (TDZ) in JavaScript?

A state where block-scoped variables are uninitialized and cannot be accessed — accessing them throws an error.

- **uninitialized (TDZ)** — allocated memory but not yet reachable
- **undefined** — variable exists but has no value
- **undeclared** — variable never created

### 13. Difference between `null` and `undefined`

**`null`:** indicates that the variable or property has no value. It's a value explicitly assigned to indicate the absence of a meaningful value.

**`undefined`:** a value automatically assigned to a variable or property that has been declared but not yet assigned a value.

```javascript
let x; // x is undefined by default
let y = null; // y is explicitly assigned the null value
console.log(x); // Output: undefined
console.log(y); // Output: null
```

### 14. What is the `typeof` operator?

The `typeof` operator returns a string indicating the type of the operand's value.
[Click to open](src/Tutorials/ReadmeFiles/Typeof&Falsy.md)

### 15. Why do we get `typeof null === "object"`?

- It's basically a bug in JS.
- In the first implementation of JavaScript, values were represented as a type tag plus a value. The type tag for objects was `0`, and `null` was represented as the NULL pointer (`0x00` on most platforms) — so `null` ended up with the same type tag as objects, hence `typeof null` returns `"object"`.

  **OR**

- Both `null` and objects are represented with a similar bit pattern to an object reference, so we get `"object"` for `null` as well.

### 16. What are truthy and falsy values?

Falsy values in JS:

- `false`
- `0`
- `-0`
- `0n`
- `""`
- `null`
- `undefined`
- `NaN`

All other values are truthy. [View more](src/Tutorials/ReadmeFiles/Typeof&Falsy.md)

### 17. Scopes in JS

**Global scope:**
Variables declared outside of all functions. Accessible throughout the entire program, including within functions and other blocks.

```javascript
let globalVariable = "I am in global scope";
function globalFunction() {
  console.log(globalVariable);
}
globalFunction(); // Output: "I am in global scope"
```

**Functional scope:**
A variable is only available inside the function where it's declared and is not accessible outside of it.

```javascript
function name() {
    var myAge = 22;
    console.log(myAge);
}
name(); // output => 22
console.log(myAge); // output => ReferenceError
```

**Local scope:**
Variables declared inside a function. Accessible only within that block, not outside of it.

```javascript
function localFunction() {
  let localVariable = "I am in local scope";
  console.log(localVariable);
}
localFunction(); // Output: "I am in local scope"
console.log(localVariable); // Output: Uncaught ReferenceError: localVariable is not defined
```

**Block scope:**
Variables declared inside curly braces `{}` are block-scoped. They can't be accessed outside of that block.

```javascript
{
  let x = 2;
}
// x can NOT be used here
```

### 18. `var`, `let` and `const`?

[Click to open dedicated file](src/Tutorials/ReadmeFiles/VarLetConst.md)

### 19. Can we modify a variable declared using `const`?

When a `const` variable holds an object (like an array), it means the variable can't be *reassigned* to a different object — it doesn't mean the object itself is immutable.

```javascript
const arr = [2, 5, 6];
```

`const` ensures `arr` cannot be reassigned to a different array or value. However, we can still modify the contents of the array itself — e.g. adding or changing elements.

```javascript
arr.push(9);
```

This modifies the contents of the existing array rather than reassigning `arr` to a new one, so it's allowed and doesn't violate the `const` constraint.

> 💬 **Simple terms:** "=" karke value nahi change kar sakte, par method use karke kar sakte hain.

> 💬 **Interview phrasing:** Every object is referred to by its reference, and when we declare a variable of a non-primitive datatype, its reference can't be changed. However, we can change the value stored at that reference.

### 20. Shadowing and illegal shadowing?

[Click to open](src/Tutorials/ReadmeFiles/VariableShadowing.md)

### 21. Precedence of operators and associativity

| Precedence | Operator(s) |
|:---:|---|
| 1  | `()` |
| 2  | `?.` |
| 3  | postfix (`a++`, `a--`) |
| 4  | unary / prefix (`! ~ + - ++a --a`) |
| 5  | `typeof`, `delete`, `await` |
| 6  | `**` (right-to-left) |
| 7  | `* / %` |
| 8  | `+ -` |
| 9  | `<< >>` |
| 10 | `< > <= >=` |
| 11 | `== != === !==` |
| 12 | `&` |
| 13 | `^` |
| 14 | `\|` |
| 15 | `&&` |
| 16 | `\|\|` |
| 17 | `??` |
| 18 | `=` |

For associativity, most operators are left-to-right. The exception is `**` (exponentiation), which is right-associative while other arithmetic operators are left-associative:

```javascript
const a = 4 ** 3 ** 2; // Same as 4 ** (3 ** 2); evaluates to 262144
```

### 22. Operators in JS

- Logical operators — [click to open](src/Tutorials/ReadmeFiles/LogicalOperators.md)
- Comparison operators — [click to open](src/Tutorials/ReadmeFiles/ComparisonOperators.md)
- Nullish operator — [click to open](src/Tutorials/ReadmeFiles/NullishOperator.md)

### 23. `isNaN()` and `Number.isNaN()`?

[Click to open](src/Tutorials/ReadmeFiles/IsNaN.md)

### 24. `==` vs `===` vs `Object.is()`

**`==` (loose equality)** compares by value. If the operands are different types, it coerces them to a common type first (see [Coercion](src/Tutorials/ReadmeFiles/Coercion.md)) and then compares.

**`===` (strict equality)** compares both value and type — no coercion. If the types differ, the result is immediately `false`. It's the recommended default for almost all comparisons.

**`Object.is()`** implements the ECMAScript **SameValue** algorithm. It behaves *exactly* like `===` for every comparison, except for two edge cases baked into `===`

```javascript
NaN === NaN          // false — NaN is never equal to anything, including itself
Object.is(NaN, NaN)  // true

+0 === -0             // true — strict equality treats signed zero as identical
Object.is(+0, -0)     // false — Object.is distinguishes the two zero values

// Everything else behaves the same:
1 === 1                // true
Object.is(1, 1)        // true

const obj = {};
obj === obj             // true (same reference)
Object.is(obj, obj)     // true
```

| Comparison | `==` | `===` | `Object.is()` |
|---|:---:|:---:|:---:|
| `5` vs `"5"` | ✅ | ❌ | ❌ |
| `NaN` vs `NaN` | ❌ | ❌ | ✅ |
| `+0` vs `-0` | ✅ | ✅ | ❌ |
| Same object reference | ✅ | ✅ | ✅ |
| Objects with identical contents, different references | ❌ | ❌ | ❌ |

**Why was `Object.is()` needed?** `===`'s strict-equality algorithm was designed to mirror IEEE-754 floating-point comparison — which is why `NaN === NaN` is `false` and `+0 === -0` is `true`. That's mathematically correct for floats, but rarely what you *mean* when asking "are these two values identical?". `Object.is()` gives you that literal identity check instead.

**When to use which:**
- **`===`** — the default choice for nearly every comparison.
- **`==`** — avoid it in general; the one common intentional use is `x == null`, which is `true` for both `null` and `undefined` in a single check.
- **`Object.is()`** — reach for it only when you specifically need correct `NaN` equality or need to distinguish `+0`/`-0`. React uses it internally for exactly this reason — comparing previous vs. next values for dependency arrays (`useEffect`, `useMemo`, `useCallback`) and `useState` update bailouts.

### 25. Defining our own `Object.is` polyfill — should handle the `-0` and `NaN` cases

[Click to open](src/Tutorials/prototypeChain&pollyfills.js)

> Builds on Q26 above — the two cases a correct polyfill must special-case are exactly `NaN` and `-0`. See also the [Special Value -0](src/Tutorials/ReadmeFiles/Coercion.md#special-value--0) section in the Coercion notes for why `-0` needs special handling.

### 26. Coercion

[Click to open](src/Tutorials/ReadmeFiles/Coercion.md)

### 27. How would you compare two non-primitive data types?

### 28. Functions, arrow functions (without `this`), function expressions, callbacks, IIFE

[Click to open](src/Tutorials/Functions.js)

### 29. String methods

`slice`, `substring`, `substr` (deprecated, optional to know), `includes`, `at`, `trim`, `padStart`, `padEnd`, `split`, `join`, `match`, `matchAll`

- **`slice`** — accepts negative indices; behaves as expected.
- **`substring`** — almost the same as `slice`, but:
  - Doesn't accept negative values — they're treated as `0`.
  - If `endIndex` is less than `startIndex`, the two are swapped.
    ```javascript
    console.log('mozilla'.substring(4, 7)); // 'lla'
    console.log('mozilla'.substring(7, 4)); // 'lla'
    ```
- **`substr`** — takes a starting point and a length, returning that many characters. Deprecated now.

> **Note:** when `NaN` is provided as an index, it's treated as `0` for every method above.

- **`charCodeAt`** — returns the ASCII value of the character at the given index.
  ```javascript
  "ABC".charCodeAt(0); // returns 65
  ```
  If no argument is passed, it defaults to index `0`:
  ```javascript
  "A".charCodeAt(); // 65
  ```
- **`String.fromCharCode`** — returns the character(s) for given ASCII value(s).
  ```javascript
  String.fromCharCode(65, 66, 67); // returns "ABC"
  ```

### 30. Object methods

- Different ways to create an object — `Object.assign`, object literal, `new` keyword, classes, constructor function
- Constructor functions for creating objects
- `Object.freeze` vs `Object.seal`
- `Object.freeze` only performs a shallow freeze — how would you make it a deep freeze?
- ES6 shorthand syntax

[Click to open](src/Tutorials/Object.js)

**Iterator methods:** [click to open](src/Tutorials/Iterators.js)

### 31. Array methods

- **`push()`** — adds to the end. Returns the new length. Mutates the original array.
- **`pop()`** — removes the last element. Returns the removed element. Mutates the original array.
- **`shift()`** — removes the first element. Returns the removed element. Mutates the original array.
- **`unshift()`** — adds to the beginning. Returns the new length. Mutates the original array.

> To avoid confusion between `shift` and `unshift`: *shift* means <u>"sharak/side ho/hatna"</u>, so it **removes the first element**.

- **`splice()`** — can add, delete, or modify the array. Returns the removed elements as an array. Mutates the original array.
- **`sort()`** — sorts the array in a specific order. Mutates the original array.
- **`reverse()`** — reverses the array and returns a reference to the original array. Mutates the original array.
- **`at(index)`** — returns the element at the given index; accepts negative values.
- **`concat()`** — appends an element or array to the operational array.
- **`flat()`** — returns a new array with sub-array elements concatenated recursively, up to the specified depth.
- **`slice()`** — same behavior as the string method.
- **`indexOf(element)`** — returns the first index of `element`, or `-1` if not found.
- **`lastIndexOf(element)`** — returns the first index of `element` from the end, or `-1` if not found.
- **`includes(searchVal)`** — returns `true` if `searchVal` is found in the array, else `false`.

> **Note:** `indexOf()`, `lastIndexOf()`, and `includes()` can't be meaningfully applied to an array of objects/arrays (non-primitive elements).

**If you want an array back:**
- `map()` — returns an array of the same length, with each element transformed.
- `filter()` — returns a new array containing only the elements for which the callback returned `true`.

**If you want a single element:**
- `find()` — finds the first matching element.
- `findLast()` — finds the first matching element, searching from the end.

If you want *all* matches, use `filter()`.

**If you want an index:**
- `findIndex()` — returns the index of the first match, or `-1`.
- `findLastIndex()` — returns the index of the first match from the end, or `-1`.

**If you just want to know whether some/every element satisfies a condition:**
- `every()` — `true` if *all* elements satisfy the condition.
- `some()` — `true` if *any* element satisfies the condition.

**Equivalents for arrays of objects/arrays** (since `indexOf`/`lastIndexOf`/`includes` don't work there):

| Primitive array method | Object/array-of-objects equivalent |
|---|---|
| `includes()` | `some()` |
| `indexOf()` | `findIndex()` |
| `lastIndexOf()` | `findLastIndex()` |

**Destructive methods and their non-destructive alternatives:**

| Destructive | Non-destructive alternative |
|---|---|
| `push()` | `[...arr, newValue]` |
| `pop()` | `arr.slice(0, arr.length - 1)` or `arr.toSpliced(arr.length - 1, 1)` |
| `shift()` | `arr.slice(1)` or `arr.toSpliced(0, 1)` |
| `unshift()` | `[newValue, ...arr]` |
| `splice()` | `arr.toSpliced()` |
| `reverse()` | `arr.toReversed()` |
| `sort()` | `arr.toSorted()` |

```javascript
(function() {
    const arr = [NaN];
    console.log(arr.indexOf(NaN));  // -1 (wrong, should be 0)
    console.log(arr.includes(NaN)); // true (correct)
})();

(function () {
    let arr = [1, 2];
    console.log(arr.concat([3, 4]));         // 1,2,3,4
    console.log(arr.concat([3, 4], [5, 6])); // 1,2,3,4,5,6
    console.log(arr.concat([3, 4], 5, 6));   // 1,2,3,4,5,6
    console.log(arr.push(3, 4, 5, 6));       // 1,2,3,4,5,6

    arr = ["I", "go", "home"];
    delete arr[1]; // remove "go"
    console.log(arr[1]);      // undefined
    // now arr = ["I", , "home"];
    console.log(arr.length);  // 3
})();

// different case letters have different codes
console.log("Z".codePointAt(0)); // 90
console.log("z".codePointAt(0)); // 122
console.log("z".codePointAt(0).toString(16));
```

Dedicated file for arrays with the methods above: [click to open](src/Tutorials/Arrays.js)

`Array.reduce()`: [click to open](src/Tutorials/Reduce.js)

Refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) for more info.

### 32. `delete` operator

Returns `true` if the object property was deleted, else `false`.

**Syntax:**

```javascript
delete object.property
delete object[property]
```

If you delete an array element with `delete arr[2]`, it removes the value but leaves `undefined` in its place — the array's `length` stays the same.

```javascript
const arr = ["Paisa", "Paisa", "Paisa"];
delete arr[1]; // removes "Paisa" and returns true
console.log(arr[1]); // undefined
console.log(arr);    // ['Paisa', <1 empty item>, 'Paisa']
```

```javascript
const name = 'Lydia';
age = 21;

console.log(delete name); // false
console.log(delete age);  // true — here we're deleting window.age
```

> **Note:** variables declared with `var`, `let`, or `const` cannot be deleted with the `delete` operator.

### 33. `sort` method on arrays and strings

- `Math.random()`
- `Math.ceil()`
- `Math.floor()`
- `Math.abs()`

[Click to open](src/Tutorials/sortMethod.js)

> *Note: give some scenarios and ask which data type would be chosen.*

### 34. Dot vs. bracket notation in JS

[Explained here — search for "dot" and "bracket" in the file](src/Tutorials/Object.js)

### 35. Map and Set

[Click to open](src/Tutorials/ReadmeFiles/MapSetObject.md)

### 36. Components of a URL & URL methods

[Click to open](src/Tutorials/ReadmeFiles/url.md)

### 37. `JSON.stringify`, `JSON.parse`, LocalStorage, SessionStorage, cookies

[Click to open](src/Tutorials/ReadmeFiles/StorageAndJSON.md)

### 38. ES6 concepts — spread, destructuring, rest, optional chaining

[Click to open](src/Tutorials/ReadmeFiles/ES6.md)

### 39. Shallow copy and deep copy, `structuredClone`

[Click to open](src/Tutorials/ReadmeFiles/shallow&DeepCopy.md)

### 40. OOP in JS

- Classes are used for making scalable objects.
- Makes use of:
  - Encapsulation
  - Abstraction
  - Inheritance
  - Polymorphism

[Click to open](src/Tutorials/ReadmeFiles/objects.md) · [click to open](src/Tutorials/OopsConcept.js)

### 41. Constructor property of an object

Returns a reference to the constructor function that created the instance. This property holds a reference to the function itself, not a string containing its name.

```javascript
const o1 = {};
o1.constructor === Object; // true

const o2 = new Object();
o2.constructor === Object; // true

const a1 = [];
a1.constructor === Array; // true

const a2 = new Array();
a2.constructor === Array; // true

const n = 3;
n.constructor === Number; // true
```

### 42. How would you check if a given argument is an array?

*Also, explain semicolons.*

> Normally, not putting a `;` at the end of a line works fine. But if a new line starts with a square bracket (`[...]`) or parenthesis (`(...)`) and the previous line wasn't terminated with `;`, it's not treated as a new statement.

```javascript
alert("Hi");
[1,2].forEach(alert);
```

> This works fine — we get alerts for `Hi`, `1`, `2`.

However:

```javascript
alert("Hi")
[1,2].forEach(alert)
```

> This doesn't work as expected — we get an alert for `Hi`, then an error. It's parsed as `alert("Hi")[1,2].forEach(alert)`.

*How can you convert any variable into a boolean? (`!!`)*

*`break` and `continue`*

*`switch` statement* — see [javascript.info/switch](https://javascript.info/switch)

---

<a id="phase-2"></a>

## Phase 2: Advanced JavaScript

### 45. Hoisting

[Click to open](src/Tutorials/ReadmeFiles/Hoisting.md)

### 46. `call`, `apply`, `bind`

[Click to open](src/Tutorials/ReadmeFiles/CallApplyBind.md)

### 47. Prototype inheritance

[Click to open](src/Tutorials/prototypeChain&pollyfills.js)

### 48. What does the `instanceof` operator do?

The `instanceof` operator checks whether the prototype property of a constructor appears anywhere in the prototype chain of an object. It returns a boolean.

```javascript
object instanceof constructor
```

**Examples:**

```javascript
class Animal {}
class Dog extends Animal {}

const rex = new Dog();

rex instanceof Dog;      // true  — Dog.prototype is directly in rex's prototype chain
rex instanceof Animal;   // true  — Animal.prototype is further up the same chain (inheritance)
rex instanceof Object;   // true  — every object's chain eventually reaches Object.prototype

[] instanceof Array;     // true
[] instanceof Object;    // true  — arrays are objects too, so both checks pass

function Foo() {}
const f = new Foo();
f instanceof Foo;        // true
f instanceof Object;     // true

"hello" instanceof String;  // false — a string primitive isn't an instance of anything
new String("hello") instanceof String; // true — but a String wrapper object is

null instanceof Object;       // false — null has no prototype chain to walk
undefined instanceof Object;  // false — same reason

// Reassigning the prototype breaks the check:
function Bar() {}
const b = new Bar();
Bar.prototype = {}; // b's internal [[Prototype]] still points to the OLD prototype object
b instanceof Bar;    // false — Bar.prototype no longer matches what's in b's chain
```

> **Note:** `instanceof` walks the prototype chain at the time it runs, checking against whatever `constructor.prototype` currently *is* — not what it was when the object was created. That's why reassigning `Bar.prototype` after `b` was constructed makes `b instanceof Bar` return `false`.

### 49. The `this` keyword

[Click to open](src/Tutorials/ReadmeFiles/thisExample.md)

### 50. Closures

[Click to open](src/Tutorials/ReadmeFiles/closure.md)

### 51. Currying

[Click to open](src/Tutorials/ReadmeFiles/currying.md)

### 52. Asynchronous behavior

- Event loop — [click to open](src/Tutorials/ReadmeFiles/eventLoop.md)
- Async behavior and why we need promises — [click to open](src/Tutorials/ReadmeFiles/Asynchronous.md)
  - Promise variants — [click to open](src/Tutorials/PromiseVariant.js)
    - `Promise.all`
    - `Promise.allSettled`
    - `Promise.any`
    - `Promise.race`
  - Generator functions — [click to open](src/Tutorials/ReadmeFiles/generators.md)
  - `async`/`await` & error handling — [click to open](src/Tutorials/ReadmeFiles/AsyncAwait.md)

---

<a id="phase-3"></a>

## Phase 3: Revision & I/O Questions

Revision and I/O questions:

- Some DSA questions based on arrays, objects & strings — [click to open](src/Tutorials/interviewCodingQues.js)
- Some clubbed questions — [click to open](src/Tutorials/InputOutput.js)
- More input/output questions (150 important questions) — [click to open](https://github.com/lydiahallie/javascript-questions)

---

<a id="phase-4"></a>

## Phase 4: HTML, CSS & Casual JS Questions

CSS fundamentals (box model, box-sizing, block/inline/inline-block, position property) are covered here: [click to open](src/Tutorials/ReadmeFiles/css.md)

### 1. Doctype in HTML?

### 2. Inline vs. block, with examples

[Click to open](src/Tutorials/ReadmeFiles/css.md)

### 3. Table properties

### 4. Semantic tags

### 5. Entities

### 6. Box sizing

[Click to open](src/Tutorials/ReadmeFiles/css.md)

### 7. Box model

[Click to open](src/Tutorials/ReadmeFiles/css.md)

### 8. `block`, `inline`, `inline-block` display property

[Click to open](src/Tutorials/ReadmeFiles/css.md)

### 9. `position` property

[Click to open](src/Tutorials/ReadmeFiles/css.md)

### 10. Different ways to hide an element

### 11. Flex

### 12. Grid

### 13. Pseudo selectors

### 14. DOM methods (`querySelector`, `getElementsByClassName`, `getElementById`)

### 15. Event delegation

### 16. Event bubbling & event capturing

### 17. `DOMContentLoaded` and `onload`

### 18. React Testing Library queries, roles & Jest patterns

[Click to open](src/Tutorials/ReadmeFiles/Testing.md)

---

<a id="phase-5"></a>

## Phase 5: React & Ecosystem

- React roadmap — [click to open](src/Tutorials/ReadmeFiles/ReactRoadMap.md) (also go through the other files in the roadmap folder)
- Optimization strategies — [click to open](src/Tutorials/ReadmeFiles/Optimization.md)
- Next.js notes — [click to open](src/Tutorials/ReadmeFiles/NextJs.md)

---

> **TODO:** `.mjs` vs `.js`
