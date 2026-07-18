# Functions in JavaScript

## Function Declaration and Invocation

To create a function, we can use a **function declaration**:

```javascript
function fun(parameter1, parameter2) {
  // body
}
```

This is a **function invocation**:

```javascript
fun(argument1, argument2)
```

> **Note:** Default parameters only kick in when the argument is `undefined` — not `null`, not any other falsy value (see [Question 5](#question-5) below).

### Question 1

```javascript
function fun() {
  console.log('All my friends are Heathen take it slow')
}

fun()
```

<details>
<summary>Show Answer</summary>

```
All my friends are Heathen take it slow
```

</details>

### Question 2

```javascript
function name(parameter1, parameter2) {
 console.log('Baat jo hai usmein' + '\n' + parameter1 + ' ' + parameter2)
}
const argument1 = 'baat wo ynha kanhi'
const argument2 = 'Nhi kisi mein'
name(argument1, argument2)
```

<details>
<summary>Show Answer</summary>

```
Baat jo hai usmein
baat wo ynha kanhi Nhi kisi mein
```

</details>

**Notes on parameters and arguments:**
- Argument names need not be the same as the parameter names.
- The order of arguments has to match the order expected by the parameters.
- A function can access an outer (enclosing scope) variable.
- The function has full access to that outer variable — it can modify it too.
- The outer variable is only used if there's no local one shadowing it.

### Question 3

```javascript
const userName = 'That they loved one day';
function showMessage() {
  const message = 'Welcome to the room of people, ' + userName;
  console.log(message);
}

showMessage();
```

<details>
<summary>Show Answer</summary>

```
Welcome to the room of people, That they loved one day
```

</details>

## Default Parameters

### Question 4

```javascript
function getAmaneSkill(skill = "Loyalty") {
  console.log("Amane's skill " + skill);
}

getAmaneSkill();
```

<details>
<summary>Show Answer</summary>

```
Amane's skill Loyalty
```

</details>

### Question 5

```javascript
function getAmaneSkill(skill = "Loyalty") {
  console.log("Amane's skill " + skill);
}

getAmaneSkill(null);
```

<details>
<summary>Show Answer</summary>

```
Amane's skill null
```

**Explanation:** Default parameters only apply when the argument is `undefined`. `null` is a deliberately passed value, so it's used as-is — the default is *not* triggered.

</details>

### Question 6

Default parameters can reference earlier parameters:

```javascript
function greet(name, greeting = `Hello, ${name}!`) {
  console.log(greeting);
}

greet('Amane');
greet('Amane', 'Hey there');
```

<details>
<summary>Show Answer</summary>

```
Hello, Amane!
Hey there
```

**Explanation:** When `greeting` isn't passed, its default expression `` `Hello, ${name}!` `` runs and can see `name`, since parameters are evaluated left to right. When `greeting` *is* passed explicitly, the default is skipped entirely.

</details>

### Question 7

What happens when a default parameter references a *later* parameter?

```javascript
function foo(a = b, b = 5) {
  console.log(a);
}
foo();
```

<details>
<summary>Show Answer</summary>

```
ReferenceError: Cannot access 'b' before initialization
```

**Explanation:** Parameters are initialized left to right, each in its own mini temporal-dead-zone — much like `let`/`const`. When `a`'s default tries to read `b`, `b` hasn't been initialized yet.

</details>

## Function Expressions

### Question 8

```javascript
const tuSetHogi = function() {
  console.log('bhool jaa.')
};

tuSetHogi()
```

<details>
<summary>Show Answer</summary>

```
bhool jaa.
```

</details>

**Difference between Function Declaration and Function Expression:**

| | Function Declaration | Function Expression |
|---|---|---|
| Usable before it's written in the code | ✅ Yes — hoisted | ❌ No — only usable from the point it executes |
| Hoisted | ✅ Yes | ❌ No |
| Needs a name | ✅ Must have one | ❌ Can be anonymous |
| Syntax | `function name() {}` | An (often anonymous) function stored in a variable |

**Named vs. Anonymous Function Expression:**

### Question 9

```javascript
var namedFun = function namedFun() {
  console.log('Named Function Expression');
}

namedFun();
```

<details>
<summary>Show Answer</summary>

```
Named Function Expression
```

</details>

### Question 10

```javascript
var anonymousFun = function() {
  console.log('Anonymous Function Expression');
}

anonymousFun();
```

<details>
<summary>Show Answer</summary>

```
Anonymous Function Expression
```

**Explanation:** Called the same way, Questions 9 and 10 look identical from the outside. The real difference between named and anonymous function expressions only shows up in *self-reference* and *stack traces* — see Questions 11 and 12.

</details>

An anonymous function expression has no name, while a named function expression is given a specific name. Despite being less common, named function expressions are recommended for better clarity and debugging.

**3 main reasons to prefer named function expressions:**
1. Creates a reliable self-reference to the function (useful for recursion and event handling).
2. Provides more debuggable stack traces (it shows up in the stack trace with a meaningful name, allowing developers to more easily understand the source and context of an error without having to read the entire code).
3. Makes code more self-documenting by clearly indicating the function's purpose.

### Question 11

Reason #1 in action — a named function expression can call itself by name:

```javascript
var factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};

console.log(factorial(5));
```

<details>
<summary>Show Answer</summary>

```
120
```

</details>

### Question 12

But that inner name isn't visible from the outside:

```javascript
var factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};

console.log(fact(5));
```

<details>
<summary>Show Answer</summary>

```
ReferenceError: fact is not defined
```

**Explanation:** The name of a named function expression (`fact`) is only bound *inside the function's own scope* — it's not attached to the outer scope the way a function declaration's name would be. Only `factorial` (the variable it's assigned to) exists outside.

</details>

## Callback Functions

- A callback function is a function passed into another function as an argument, which is then invoked inside the outer function to complete some kind of action.
- Callback functions are often used in JavaScript to handle asynchronous operations or events.
- A callback doesn't itself make JavaScript asynchronous. Instead, callbacks are the mechanism used to handle the result of an asynchronous operation.
- e.g. `onLoad`, `onClick`, `onChange` events and `setTimeout`, `setInterval`.

**Why use callbacks?**
Some of our operations are started only after the preceding ones have completed. Often when we request data from other sources, such as an external API, we don't always know when our data will be served back. In these instances we want to wait for the response, but we don't always want our entire application grinding to a halt while our data is being fetched. These situations are where callback functions come in handy.

**An example — an async callback:**

```javascript
function performOperation(num, callback) {
    setTimeout(() => {
        const randomNumber = Math.floor(Math.random() * 12) + 1 // maan le ye api se aa rha
        callback(num, randomNumber); // aur jab api se aa jaaye tabhi ye function call karna hai
    }, 800)
}

function add(num1, num2) {
    console.log(num1 + num2);
}

function multiply(num1, num2) {
    console.log(num1 * num2);
}
```

### Question 13

```javascript
performOperation(8, add);
```

<details>
<summary>Show Answer</summary>

After roughly an 800ms delay, logs `8 + <random 1-12>`.

**Explanation:** `performOperation` doesn't call `callback` synchronously — it schedules it inside `setTimeout`, so the result only shows up ~800ms later, once the "fake API" (`randomNumber`) resolves.

</details>

### Question 14

```javascript
performOperation(8, multiply);
```

<details>
<summary>Show Answer</summary>

After roughly an 800ms delay, logs `8 * <random 1-12>`.

**Explanation:** Same mechanism as Question 13 — only the callback passed in differs (`multiply` instead of `add`), which is the whole point of the callback pattern: the same `performOperation` wrapper can produce completely different behavior depending on what's handed to it.

</details>

## IIFE (Immediately Invoked Function Expressions)

- Runs as soon as it is defined, without being explicitly called.
- IIFE is often used to create a private scope for the variables and functions defined within it, thus preventing naming conflicts with other code in the global namespace.
- Hence it doesn't pollute the global namespace.

```javascript
(function () {
  // using function definition…
})();

(() => {
  // Using arrow function …
})();

(async () => {
  // Async functionalities can be added here…
})();
```

### Question 15

A practical demonstration of the "private scope" benefit:

```javascript
const counter = (function () {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count
  };
})();

console.log(counter.increment());
console.log(counter.increment());
console.log(counter.count);
```

<details>
<summary>Show Answer</summary>

```
1
2
undefined
```

**Explanation:** The IIFE runs immediately and returns an object exposing `increment`/`getCount`. `count` itself lives only inside the IIFE's private scope — it's not a property on the returned object, so `counter.count` is `undefined`. The only way to read or change it is through the methods the IIFE chose to expose.

</details>

## Arrow Functions

1. New feature introduced in ES6.
2. Provides a shorter syntax for defining functions compared to traditional function expressions.
3. If only one parameter is there, then no need of parenthesis around it.
4. Can define a function without the need of the `function` keyword.
5. Can return a value without a `return` keyword and curly braces, provided the function body is a single expression.
6. Arrow functions don't have their own `this`, `arguments`, `super`, or `new.target` — they're **lexically bound**, meaning they use the value from the enclosing (defining) scope, not from however the arrow function itself gets called. (Regular closures over ordinary variables work the same way whether it's an arrow function or a regular one — this lexical-binding rule specifically matters for `this`/`arguments`/`super`/`new.target`. See Questions 23–26 below.)

### Question 16

```javascript
function normalFun (name) {
    return console.log(`Hello ${name}`)
}

const arrowFun1 = name => console.log(`Hello ${name}`);

normalFun('nammoni')
arrowFun1('Ubuyashiki')
```

<details>
<summary>Show Answer</summary>

```
Hello nammoni
Hello Ubuyashiki
```

</details>

**Concise (one-line) arrow function bodies:**

### Question 17

```javascript
const returnNumber = () => 2
console.log(returnNumber())
```

<details>
<summary>Show Answer</summary>

```
2
```

</details>

### Question 18

```javascript
const returnString = () => 'suiiiiiii'
console.log(returnString())
```

<details>
<summary>Show Answer</summary>

```
suiiiiiii
```

</details>

### Question 19

```javascript
const returnBoolean = () => false
console.log(returnBoolean())
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 20

```javascript
const returnArray = () => [1, 5, 999]
console.log(returnArray())
```

<details>
<summary>Show Answer</summary>

```
[1, 5, 999]
```

</details>

### Question 21

```javascript
const returnObj = () => ({ propKey: 'val' })
console.log(returnObj())
```

<details>
<summary>Show Answer</summary>

```
{ propKey: 'val' }
```

**Explanation:** The parentheses around the object literal are required. Without them, `() => { propKey: 'val' }` would be parsed as an arrow function with a **block body** containing a labeled statement (`propKey:` being a label, not a key) — see Question 22 for exactly that trap.

</details>

### Question 22

The parens-are-required gotcha, made explicit:

```javascript
const wrong = () => { key: 'value' };
console.log(wrong());
```

<details>
<summary>Show Answer</summary>

```
undefined
```

**Explanation:** `{ key: 'value' }` here is parsed as a **function body block**, not an object literal — `key:` is treated as a statement label, and `'value'` as an expression statement. The function has no `return`, so it implicitly returns `undefined`. Wrapping it in parens, `() => ({ key: 'value' })`, is what forces JS to parse it as an object literal instead (as in Question 21).

</details>

### Question 23

Arrow functions and `this` — the classic gotcha:

```javascript
const person = {
  name: 'Amane',
  regularGreet: function () {
    console.log(`Regular: Hello, I'm ${this.name}`);
  },
  arrowGreet: () => {
    console.log(`Arrow: Hello, I'm ${this.name}`);
  }
};

person.regularGreet();
```

<details>
<summary>Show Answer</summary>

```
Regular: Hello, I'm Amane
```

**Explanation:** A regular function's `this` is determined by *how it's called* — since it's called as `person.regularGreet()`, `this` is `person`.

</details>

### Question 24

```javascript
const person = {
  name: 'Amane',
  regularGreet: function () {
    console.log(`Regular: Hello, I'm ${this.name}`);
  },
  arrowGreet: () => {
    console.log(`Arrow: Hello, I'm ${this.name}`);
  }
};

person.arrowGreet();
```

<details>
<summary>Show Answer</summary>

```
Arrow: Hello, I'm undefined
```

**Explanation:** Arrow functions don't get their own `this` based on how they're called — `arrowGreet` inherits `this` from the scope it was *defined* in (the top level here, where `this.name` isn't `person.name`). This is precisely why arrow functions make poor object methods when they need to reference the object via `this`.

</details>

### Question 25

Can an arrow function be used as a constructor?

```javascript
const Foo = () => {};
const f = new Foo();
```

<details>
<summary>Show Answer</summary>

```
TypeError: Foo is not a constructor
```

**Explanation:** Arrow functions have no internal `[[Construct]]` behavior and no `prototype` property, so `new` can never be used with them.

</details>

### Question 26

Do arrow functions have their own `arguments` object?

```javascript
function outer() {
  const arrow = () => {
    console.log(arguments.length);
  };
  arrow(100, 200);
}

outer(1, 2, 3);
```

<details>
<summary>Show Answer</summary>

```
3
```

**Explanation:** Arrow functions have no `arguments` object of their own. Inside `arrow`, `arguments` resolves to the nearest enclosing regular function's `arguments` — here, `outer`'s, which was called with 3 arguments (`1, 2, 3`). The `100, 200` that `arrow` was actually invoked with are not captured anywhere, since `arrow` declares no parameters and has no `arguments` of its own.

</details>

## Rest Parameters

Rest parameters collect any remaining arguments into a **real array** — unlike `arguments`, which is only array-like (no `.map`/`.reduce`/etc. without converting it first).

### Question 27

```javascript
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3));
```

<details>
<summary>Show Answer</summary>

```
6
```

</details>

### Question 28

```javascript
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(10, 20));
```

<details>
<summary>Show Answer</summary>

```
30
```

**Explanation:** `...numbers` collects however many arguments are passed into a real array, so `sum` works with any number of arguments without needing `arguments` at all.

</details>

### Question 29

A rest parameter must be the *last* parameter — what happens here?

```javascript
function bad(...rest, last) {}
```

<details>
<summary>Show Answer</summary>

```
SyntaxError: Rest parameter must be last formal parameter
```

</details>

## `arguments` vs. Rest Parameters

| | `arguments` | Rest parameters (`...args`) |
|---|---|---|
| Type | **Array-like** object (has `.length` and indices, but no array methods) | A **real** `Array` |
| Available in arrow functions | ❌ No — resolves to the nearest enclosing regular function's `arguments` (see Question 26 above) | ✅ Yes |
| What it captures | **All** arguments passed to the call, regardless of declared parameters | Only the arguments left over *after* the named parameters |
| Opt-in? | Implicitly available in every regular function | Must explicitly declare `...name` as the last parameter |

### Question 30

Is `arguments` a real array?

```javascript
function demo(a, b) {
  console.log(Array.isArray(arguments));
  console.log(arguments.map(x => x * 2));
}

demo(1, 2, 3, 4);
```

<details>
<summary>Show Answer</summary>

```
false
TypeError: arguments.map is not a function
```

**Explanation:** `arguments` is array-*like* — it has a `.length` and numeric indices, but it doesn't inherit from `Array.prototype`, so array methods like `.map()`, `.reduce()`, `.filter()` aren't available on it directly. You'd need `Array.from(arguments)` or `[...arguments]` first.

</details>

### Question 31

Is a rest parameter a real array?

```javascript
function demo(...args) {
  console.log(Array.isArray(args));
  console.log(args.map(x => x * 2));
}

demo(1, 2, 3, 4);
```

<details>
<summary>Show Answer</summary>

```
true
[ 2, 4, 6, 8 ]
```

**Explanation:** Rest parameters are built as genuine arrays, so every array method works on them immediately — no conversion needed. This is one of the main reasons rest parameters are preferred over `arguments` in modern code.

</details>

### Question 32

What's the difference in what gets captured?

```javascript
function demo(a, b, ...rest) {
  console.log(arguments.length, arguments[0], arguments[1], arguments[2], arguments[3]);
  console.log(rest);
}

demo(1, 2, 3, 4);
```

<details>
<summary>Show Answer</summary>

```
4 1 2 3 4
[ 3, 4 ]
```

**Explanation:** `arguments` always reflects *every* argument the function was called with (`4` args here: `1, 2, 3, 4`), completely independent of how many parameters were declared. `rest`, on the other hand, only collects what's left over after `a` and `b` have each claimed one argument — so just `[3, 4]`.

</details>

## Function Length

- The number of parameters present in a function.
- Default parameters aren't considered.
- All parameters from the first default parameter onward aren't considered either — even ones that don't have a default themselves.

In brief: `function.length` is the number of parameters *before* the first one with a default value.

**Setup used by the questions below:**

```javascript
const func1 = (name) => {}
const func2 = (name = 'eshaan') => {}
const func3 = (name, age = 20) => {}
const func4 = (name, age = 20, gender) => {}
```

### Question 33

```javascript
console.log(func1.length)
```

<details>
<summary>Show Answer</summary>

```
1
```

</details>

### Question 34

```javascript
console.log(func2.length)
```

<details>
<summary>Show Answer</summary>

```
0
```

**Explanation:** `name` is the very first parameter and already has a default, so zero parameters count as "before the first default."

</details>

### Question 35

```javascript
console.log(func3.length)
```

<details>
<summary>Show Answer</summary>

```
1
```

**Explanation:** `name` (no default) counts; counting stops at `age` (has a default).

</details>

### Question 36

```javascript
console.log(func4.length)
```

<details>
<summary>Show Answer</summary>

```
1
```

**Explanation:** Counting stops at `age` (the first default parameter) — `gender`, which comes after, is never counted either, even though it has no default of its own.

</details>

### Question 37

Do rest parameters count toward `.length`, and how does that compare to `arguments.length`?

```javascript
function demo(a, b, ...rest) {
  console.log(demo.length);
  console.log(arguments.length);
}

demo(1, 2, 3, 4, 5);
```

<details>
<summary>Show Answer</summary>

```
2
5
```

**Explanation:** `demo.length` is a **static** property of the function's declaration — `2`, since `a` and `b` are counted but the rest parameter never is (same rule as default parameters). `arguments.length` is dynamic — it reflects how many arguments were actually *passed* at this specific call (`5`), regardless of how many parameters were declared.

</details>
