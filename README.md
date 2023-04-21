# Interview Prepartion and Cheat Sheet

1> What is JavaScript?
Ans: 
-> It is weakly typed dynamic language. As no variable is bound to any datatype and it might change over the next successive execution.
-> Scripting language as it uses browser do all the work. 
-> Can be used for both client side as well as server side.
-> Single threaded ( JavaScript code is executed in a single call stack and can only perform one task at a time.)
-> Synchronous ( code is executed sequentially in a single thread. This means that each line of code is executed one after another, and the program must wait for each operation to complete before moving on to the next one.)
However, JavaScript also has built-in support for asynchronous programming, which allows code to execute non-sequentially. Asynchronous JavaScript code does not block the main thread of execution and can perform multiple operations simultaneously. This is achieved through the use of callbacks, setTimeout, promises, and async/await syntax.
-> JavaScript is an interpreted language, However, modern JavaScript engines have become very fast and efficient at interpreting code, often using just-in-time (JIT) compilation to optimize performance.
 As a result, JavaScript code can be executed at speeds that are comparable to compiled languages.

2> What is the difference between interpreted and compiled language?
Ans:
Interpreted Language:  
    i> Source code -> executable code
    ii> Executed line by line
    iii> More flexible and easier to use
    iv> Doesn't require the creation of executable file.
    e.g. Javascript, Python

Compiled Language:
    i> Source code -> Machine code -> Executable code
    ii> Executes the entire line in one go.
    iii> compiled code is optimized for execution and can be executed more quickly than interpreted code.Hence, better performance.

3> Difference between Client side and server side?
Ans:

Client-side refers to the code that is executed on the user's device (usually a web browser), such as HTML, CSS, and JavaScript. The client-side code is responsible for rendering the web page and handling user interactions, such as clicking on a button or filling out a form.

Server-side refers to the code that is executed on the server (web server, application server, or database server). It usually involves technologies like PHP, Python, or Node.js. The server-side code is responsible for processing requests from the client, interacting with databases or other resources, and generating dynamic content that is sent back to the client.

JavaScript can be used for both client-side and server-side programming. On the client-side, JavaScript is used to create interactive web pages, validate form data, and provide visual effects. On the server-side, JavaScript is used in Node.js to build server applications, interact with databases, and handle incoming HTTP requests.

4> What are different Datatypes?
Ans> 
i> Primitive Datatypes
    a> Number
    number in the range ±(2-¹⁰⁷⁴(Number.MIN_VALUE) to 2¹⁰²⁴(Number.MAX_VALUE))
    Positive values greater than Number.MAX_VALUE are converted to +Infinity.
    Positive values smaller than Number.MIN_VALUE are converted to +0.
    Negative values smaller than -Number.MAX_VALUE are converted to -Infinity.
    Negative values greater than -Number.MIN_VALUE are converted to -0.
    b> Bigint
    
     number can only safely store integers in the range -(2⁵³ − 1) (Number.MIN_SAFE_INTEGER) to 2⁵³ − 1 (Number.MAX_SAFE_INTEGER)
     With BigInts, you can safely store and operate on large integers even beyond the safe integer limit (Number.MAX_SAFE_INTEGER) for Numbers.
    c> String
    d> Boolean
    e> null
    f> undefined
    g> Symbol

ii> Non-primitive Datatypes
    a> Object
    b> Functions

5> Difference between null and undefined?
Ans: 
"null" indicates that the variable or property has no value. In other words, null is a value that has been explicitly assigned to a variable or property to indicate that it does not have a meaningful value.

"Undefined", on the other hand, is a value that is automatically assigned to a variable or property that has been declared but not yet assigned a value. It indicates that a variable or property has not been initialized with a value.

let x; // x is undefined by default
let y = null; // y is explicitly assigned the null value
console.log(x); // Output: undefined
console.log(y); // Output: null

6> Why is typeof operator?
Ans:
The typeof operator returns a string indicating the type of the operand's value.

7> Why do we get typeof null as object?
Ans: It's basically a bug in JS.
In the first implementation of JavaScript, JavaScript values were represented as a type tag and a value. The type tag for objects was 0. null was represented as the NULL pointer (0x00 in most platforms). Consequently, null had 0 as type tag, hence the typeof return value "object"
                OR
Both null and Object are represented in similar bit pattern as that of object reference. Hence, we get object for null as well.

8> What are thruthy and falsy values?
Ans:
    All values are truthy except 
    i> false
    ii> 0
    iii> -0
    iv> 0n
    v> ""
    vi> null
    vii> undefined
    viii> NaN.

9> What does instanceof operator do?
The instanceof operator tests to see if the prototype property of a constructor appears anywhere in the prototype chain of an object. The return value is a boolean value.
object instanceof constructor.

10> Scopes in JS.
Global scope: Variables declared outside of all functions.
These are accessible throughout the entire program, including within functions and other blocks of code.

let globalVariable = "I am in global scope";
function globalFunction() {
  console.log(globalVariable);
}
globalFunction(); // Output: "I am in global scope"

Functional scope: variable will only be available to use inside the function it declared, will not be accessible outside of function.

function name() {
    var myAge = 22;
    console.log(myAge); 
}
name() //output => 22
console.log(myAge); //output => ReferenceError

Local scope: Variables declared inside of function. These are also accessible within that block and can't be accessed outside of it.

function localFunction() {
  let localVariable = "I am in local scope";
  console.log(localVariable);
}
localFunction(); // Output: "I am in local scope"
console.log(localVariable); // Output: Uncaught ReferenceError: localVariable is not defined

Block Scope: Variables declared inside of curly braces {} have block scoped. It can't be accessed outside of it.

{
  let x = 2;
}
// x can NOT be used here

11> Var, let and const?
12> Shadowing and Illegal Shadowing?
