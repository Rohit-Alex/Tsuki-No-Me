Variables declared with var, let and const are quite similar when declared outside a block.

1. ###### var:
- variables declared with var have **functional** scope. 
- but global scope when it is declared outside the function.
```
var number = 50
function print() {
  var square = number * number
  console.log(square)
}
console.log(number) // 50
print() // 2500
console.log(square) // Reference error
```
- can skip initialization while declaring it. It's optional.
```
var a;
    console.log(a) // undefined
``` 
- It can be reassigned as well.
```
var a = 5;
a = 10;
console.log(a) // 10
```
- It can be re-declared and re-assigned as well.
```
var a = 5;
console.log(a) // 5
var a = 10;
console.log(a) // 10
```    
- variables declared with var are hoisted to the top of their global or local scope, which makes them accessible before the line they are declared.
```
console.log(number) // undefined
var number = 50
console.log(number) // 50
```
2. #### Let
- It has blocked scoped.
```
    {
        let a = 5;
    }
    console.log(a) // can't be accessed outside. Reference error.
```
- can skip initialization while declaring it. It's optional.
 ```
    let a;
    a = 5;
```
- Can be re-assigned within the scope.
```
    let a = 5;
    a = 10;
```
- can't be re-declared within the same scope.
```
    let a = 5;
    let a = 10; // Syntax error.
```
- Hoisted but without a default initialization. So, we get error. Variable not defined.

3. #### const
- Has block scoped.
```
    {
        const a = 5;
    }
    console.log(a) // can't be accessed outside. Reference error.
```
- Must initialize a value while declaring.
```
    const a; // Syntax error. Must initialize as well
    const a = 5; //correct
```
- Can't reassign a value. It's constant and can't modify it's value.
```
    const a = 5;
    a = 10; // Syntax error. Can't modify a const value
```
- Can't re-declare within a same scope.
 ```
    const a = 5;
    const a = 10; // Syntax error. Can't re-declare
```
- Hoisted but without a default initialization. So, we get error. Variable not defined.

#### NOTE:

Global variable: If we don't use declare a variable with var, let or const. It goes to global scope.
However, in strict mode, it throws an error.

```
function test() {
    a = 5;
}
console.log(a); // Error: a is not defined.
test()
console.log(a); // 5


{
  b = 5;
}
console.log(b); // 5
```
If we use "use strict" mode then we would get error.


```
1.
var a = 100;
{
    var a = 10;
    let b = 20;
    const c = 30;
    console.log(a); // 10
    console.log(b); // 20
    console.log(c); // 30
}
console.log(a); // 10
console.log(b); // Reference error
console.log(c); // Reference error

2.
var b = 20;
{
    let b = 50;
    console.log(b) // 50
}
console.log(b) // 20

3.
let x = 20;
{
    var x = 30; // x already defined, can't redefined within same scope. Syntax error
    console.log(x);
}
console.log(x);

4.
let m = 24;
function temp() {
    var m = 30;
    console.log(m)
}
console.log(m) // 24
temp() // 30

5.
function fun() {
    var q = 24
    console.log(q)
}
console.log(q) // reference error

6.
const p = 6;
{
    const p = 5;
    {
        const p = 10;
        console.log(p); // 10
    }
    console.log(p); // 5
}
console.log(p); // 6
```

