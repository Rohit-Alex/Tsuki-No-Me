# Var, Let, and Const

Variables declared with var, let and const are quite similar when declared outside a block.

## `var`

- Variables declared with `var` have **functional** scope.
- But global scope when declared outside a function.

```javascript
var number = 50
function print() {
  var square = number * number
  console.log(square)
}
console.log(number)
print()
console.log(square)
```

<details>
<summary>Show Answer</summary>

```
50
2500
Reference error
```

</details>

#### Can skip initialization while declaring it. It's optional.

```javascript
var a;
console.log(a)
```

<details>
<summary>Show Answer</summary>

```
undefined
```

</details>

#### It can be reassigned as well.

What will be the output?

```javascript
var a = 5;
a = 10;
console.log(a)
```

<details>
<summary>Show Answer</summary>

```
10
```

</details>

#### It can be re-declared and re-assigned as well.

```javascript
var a = 5;
console.log(a)
var a = 10;
console.log(a)
```

<details>
<summary>Show Answer</summary>

```
5
10
```

</details>

#### Variables declared with `var` are hoisted to the top of their global or local scope, which makes them accessible before the line they are declared.

```javascript
console.log(number)
var number = 50
console.log(number)
```

<details>
<summary>Show Answer</summary>

```
undefined
50
```

</details>

## `let`

#### It has blocked scoped.

```javascript
{
    let a = 5;
}
console.log(a)
```

<details>
<summary>Show Answer</summary>

Can't be accessed outside. Reference error.

</details>

#### Can skip initialization while declaring it. It's optional.

```javascript
let a;
a = 5;
```

#### Can be re-assigned within the scope.

```javascript
let a = 5;
a = 10;
```

#### Can't be re-declared within the same scope.

```javascript
let a = 5;
let a = 10;
```

<details>
<summary>Show Answer</summary>

Syntax error.

</details>

#### Hoisted but without a default initialization. So, we get error. Variable not defined.

## `const`

#### Has block scoped.

```javascript
{
    const a = 5;
}
console.log(a)
```

<details>
<summary>Show Answer</summary>

Can't be accessed outside. Reference error.

</details>

#### Must initialize a value while declaring.

```javascript
const a;
```

<details>
<summary>Show Answer</summary>

Syntax error. Must initialize as well.

</details>

```javascript
const a = 5; // correct
```

#### Can't reassign a value. It's constant and can't modify it's value.

What will happen when this code runs?

```javascript
const a = 5;
a = 10;
```

<details>
<summary>Show Answer</summary>

Syntax error. Can't modify a const value.

</details>

#### Can't re-declare within a same scope.

```javascript
const a = 5;
const a = 10;
```

<details>
<summary>Show Answer</summary>

Syntax error. Can't re-declare.

</details>

#### Hoisted but without a default initialization. So, we get error. Variable not defined.

## NOTE

**Global variable**: If we don't use declare a variable with var, let or const. It goes to global scope.
However, in `strict mode`, it _throws an error_.

### Question 1

```javascript
function test() {
    a = 5;
}
console.log(a);
test()
console.log(a);


{
  b = 5;
}
console.log(b);
```

<details>
<summary>Show Answer</summary>

```
Error: a is not defined.
5
5
```
If we use "use strict" mode then we would get error.
</details>

## Practice Questions

### Question 1

```javascript
var a = 100;
{
    var a = 10;
    let b = 20;
    const c = 30;
    console.log(a);
    console.log(b);
    console.log(c);
}
console.log(a);
console.log(b);
console.log(c);
```

<details>
<summary>Show Answer</summary>

```
10
20
30
10
ReferenceError: b is not defined
```

**Explanation:** `b` and `c` are block-scoped, while `var a` gets reassigned in the global scope.

</details>

### Question 2

```javascript
var b = 20;
{
    let b = 50;
    console.log(b);
}
console.log(b);
```

<details>
<summary>Show Answer</summary>

```
50
20
```

**Explanation:** The `let b` inside the block shadows the outer `var b`.

</details>

### Question 3

```javascript
let x = 20;
{
    var x = 30;
    console.log(x);
}
console.log(x);
```

<details>
<summary>Show Answer</summary>

```
SyntaxError: Identifier 'x' has already been declared
```

**Explanation:** This is illegal shadowing - cannot redeclare a `let` variable with `var` in the same scope.

</details>

### Question 4

```javascript
let m = 24;
function temp() {
    var m = 30;
    console.log(m);
}
console.log(m);
temp();
```

<details>
<summary>Show Answer</summary>

```
24
30
```

**Explanation:** Function scope allows `var m` to be declared separately from the outer `let m`.

</details>

### Question 5

```javascript
function fun() {
    var q = 24;
    console.log(q);
}
console.log(q);
```

<details>
<summary>Show Answer</summary>

```
ReferenceError: q is not defined
```

**Explanation:** `var q` is function-scoped and not accessible outside the function.

</details>

### Question 6

```javascript
const p = 6;
{
    const p = 5;
    {
        const p = 10;
        console.log(p);
    }
    console.log(p);
}
console.log(p);
```

<details>
<summary>Show Answer</summary>

```
10
5
6
```

**Explanation:** Each `const p` is in a different block scope, creating nested shadowing.

</details>
