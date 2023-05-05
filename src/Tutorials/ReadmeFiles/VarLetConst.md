Variables declared with var, let and const are quite similar when declared outside a block.

Var:
i>Variables declared with var have functional scope. But global scope when it is declared outside the function.

var number = 50
function print() {
  var square = number * number
  console.log(square)
}
console.log(number) // 50
print() // 2500
console.log(square) // Reference error

ii> Can skip initialization while declaring it. It's optional.
e.g. var a;
    console.log(a) // undefined
    
iii> It can be reassigned as well.
e.g. var a = 5;
     a = 10;
     console.log(a) // 10

iv> It can be re-declared and re-assigned as well.
e.g. var a = 5;
    console.log(a) // 5
     var a = 10;
     console.log(a) // 10
    
v> Variables declared with var are hoisted to the top of their global or local scope, which makes them accessible before the line they are declared.

e.g.
console.log(number) // undefined
var number = 50
console.log(number) // 50

Let
i> It has blocked scoped.
    {
        let a = 5;
    }
    console.log(a) // can't be accessed outside. Reference error.

ii> Can skip initialization while declaring it. It's optional.
    let a;
    a = 5;

iii> Can be re-assigned within the scope.
    let a = 5;
    a = 10;

iv> can't be re-declared within the same scope.
    let a = 5;
    let a = 10; // Syntax error.

v> Hoisted but without a default initialization. So, we get error. Variable not defined.

Const

i> Has block scoped.
    {
        const a = 5;
    }
    console.log(a) // can't be accessed outside. Reference error.

ii> Must initialize a value while declaring.
    const a; // Syntax error. Must initialize as well
    const a = 5; //correct

iii> Can't reassign a value. It's constant and can't modify it's value.
    const a = 5;
    a = 10; // Syntax error. Can't modify a const value

iv> Can't re-declare within a same scope.
    const a = 5;
    const a = 10; // Syntax error. Can't re-declare

v> Hoisted but without a default initialization. So, we get error. Variable not defined.

NOTE:

Global variable: If we don't use declare a variable with var, let or const. It goes to global scope.
However, in strict mode, it throws an error.

e.g. i>
function test() {
    a = 5;
}
console.log(a); // Error: a is not defined.
test()
console.log(a); // 5

e.g. ii>
{
  b = 5;
}
console.log(b); // 5

If we use "use strict" mode then we would get error.

I/O O/p

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

var b = 20;
{
    let b = 50;
    console.log(b)
}
console.log(b)

let x = 20;
{
    var x = 30;
    console.log(x);
}
console.log(x);


let m = 24;
function temp() {
    var m = 30;
    console.log(m)
}
console.log(m)


function fun() {
    var q = 24
    console.log(q)
}
console.log(q)


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




