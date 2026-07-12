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

### What Doesn't Get Hoisted:
- **Function expressions**: Treated as variables
- **Arrow functions**: Treated as variables  
- **Classes**: Not hoisted
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

## Key Takeaways

1. **Function declarations** are fully hoisted (name + body)
2. **`var` declarations** are hoisted and initialized with `undefined`  
3. **`let`/`const` declarations** are hoisted but remain uninitialized (TDZ)
4. **Function expressions** and **arrow functions** follow variable hoisting rules
5. **Classes** are not hoisted
6. Only **declarations** are hoisted, not **initializations**
7. **Function declarations** take precedence over **variable declarations** with the same name
8. **Variable assignments** can overwrite **hoisted functions**

## Best Practices

1. **Declare variables at the top** of their scope
2. **Use `const` by default**, `let` when reassignment is needed
3. **Avoid `var`** to prevent confusion
4. **Declare functions before using them** for clarity
5. **Be aware of TDZ** when using `let`/`const`