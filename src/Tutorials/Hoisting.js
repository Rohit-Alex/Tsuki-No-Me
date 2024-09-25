/*
   Everything is JS happens inside "Execution Context". It has 2 phases: 
       -> i> Memory allocation phase (variable env.) 
       -> ii> Code execution (Thread of execution)

   Hositiing is a process whereby the interpreter moves the declaration of functions & variables to the top of their scope, prior to execution of the code.
   
   It makes use of the memory allocation phase of execution context. Variables and functions are allocated in memory even before the execution begins. Hence, due to this variables and functions are accessible even before they are declared.

   Note: only declaration is hoisted and not initialization. Mtlb value store nhi hota memory of during first phase.
   sirf variable ka naam store hota.

   Only var, and normal functions means (function declartion) are hoisted.
   var is assigned a value "undefined" and In functions, entire code is assigned in memory during allocation phase of global execution context.

   Let and const are also hoisted but they are allocated memory under script as they are block scoped. Hence are not accessible till they are executed i.e initialized a value. 
   This zone is called "temporal dead zone". The gap b/w a variable is allocated a memory and till its gets executed and a value is assigned to it is called "temporal dead zone".

   Function expression, arrow functions are treated as normal variables are treated.
   classes are not hoisted.
   
*/

    var n = 2;
    function square(num) {
        var ans = num * num
        return ans 
    }
    var square2 = square(n)
    var square4 = square(4)

    // Explain the execution context of above code.
    
// 1
console.log(frndo); //undefined
var frndo;
frndo = 'Amane';
console.log(frndo); // Amane

// 2
console.log(frndo1); // Reference Error
var frndo1 = 'Amane';

// 3
console.log(welcome) // [Function: welcome]
welcome()
function welcome() {
    console.log('Hello world')
}

// 4
console.log(frndo2) // Reference Error
let frndo2 = 'Amane'; 

// 5
console.log(frndo3) // Reference Error
const frndo3 = 'Amane';

// 6
console.log(welcome) // undefined
welcome() // TypeError
var welcome = function () {
    console.log('Hello world')
}

// 7
console.log(welcome1) // Reference Error
welcome1()
let welcome1 = function () {
    console.log('Hello world')
}

// 8
console.log(welcome2) // Reference Error
welcome2()
const welcome2 = function () {
    console.log('Hello world')
}

// 9
console.log(welcome3) // undefined
welcome3() // Type Error
var welcome3 = () => {
    console.log('Hello world')
}

// 10
console.log(welcome4) // Reference Error
welcome4()
let welcome4 = () => {
    console.log('Hello world')
}

// 11
console.log(welcome5) // Reference Error
welcome5()
const welcome5 = () => {
    console.log('Hello world')
}
//Hoisting Questions...

// 12
var a = 1;
function b() {
    a = 10; return;
    function a() { }
}
b();
console.log(a); // 1

// 13
function print() {
  var square1 = number * number
  console.log(square1)

  var number = 50

  var square2 = number * number
  console.log(square2)
}
print() // NaN, 2500

// 14
function foo() {
    function bar() {
        return 3;
    }
    return bar();
    function bar() {
        return 8;
    }
}
console.log(foo()); // 8

// 15
function parent() {
    var hoisted = "I'm a variable";
    function hoisted() {
        return "I'm a function";
    }
    return hoisted();
}
console.log(parent()); // Type Error


// 16
console.log(foo1()); // 3
function foo1() {
    var bar = function () {
        return 3;
    };
    return bar();
    var bar = function () {
        return 8;
    };
}

// 17
(function () {
    console.log('Original value was: ' + myVar);
    var myVar = 'bar';
    console.log('New value is: ' + myVar);
})();


