# Interview Prepartion and Cheat Sheet
<------------------------- PHASE 1 ------------------------->

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
    ii> Executes the entire code in one go.
    iii> compiled code is optimized for execution and can be executed more quickly than interpreted code.Hence, better performance.

3> Difference between Client side and server side?
Ans:

Client-side refers to the code that is executed on the user's device (usually a web browser), such as HTML, CSS, and JavaScript. The client-side code is responsible for rendering the web page and handling user interactions, such as clicking on a button or filling out a form.

Server-side refers to the code that is executed on the server (web server, application server, or database server). It usually involves technologies like PHP, Python, or Node.js. The server-side code is responsible for processing requests from the client, interacting with databases or other resources, and generating dynamic content that is sent back to the client.

JavaScript can be used for both client-side and server-side programming. On the client-side, JavaScript is used to create interactive web pages, validate form data, and provide visual effects. On the server-side, JavaScript is used in Node.js to build server applications, interact with databases, and handle incoming HTTP requests.

4> What happens behind the hood when a webpage made using html, css and JS is opened?
Ans:
Here's a general overview of the process:

HTML parsing: The web browser parses the HTML code to create a Document Object Model (DOM) tree, which represents the structure of the webpage. The DOM tree contains all the elements on the webpage, such as headings, paragraphs, images, and links.

CSS parsing: The web browser also parses the CSS code to create a Cascading Style Sheets (CSS) Object Model (CSSOM) tree, which represents the styles and layout of the webpage. The CSSOM tree contains information about the size, position, and appearance of each element on the webpage.

Rendering: The web browser combines the DOM tree and the CSSOM tree to create a render tree, which is used to display the webpage on the screen. The render tree contains all the elements and styles needed to paint the webpage.

JavaScript execution: If the webpage includes JavaScript code, the web browser executes it. JavaScript can modify the DOM and CSSOM trees, add interactivity to the webpage, and perform other actions.

Layout and painting: Due to user activity, some layout or value might update which is repainted.

Loading external resources: The webpage may also include external resources such as images, videos, and scripts. The web browser loads these resources as needed.

5> What is DOM?
Ans:
Tree-like structure, with nodes representing elements, attributes, and text. The DOM provides a way for programs to interact with the web page, allowing them to read, modify, and delete content and styles.

6> Explain async and defer in JS?
Ans:

THE PROBLEM -->>
When a web page is loaded, the browser needs to download and execute all the JavaScript files included in the page. By default, the browser will download and execute the JavaScript files synchronously, which means it will wait for each script to finish downloading and executing before moving on to the next one. This can slow down the page load time, especially if there are multiple scripts or if the scripts are large.

We can add script tag at two places.
    i> Inside <head> tag: 
        If script tag is added here then HTML parsing is blocked till the scripts are downloaded and done with execution. This arises 2 problems:
        a> Scripts can’t see DOM elements below them, so they can’t add handlers etc.
        b> If there’s a bulky script at the top of the page, it “blocks the page”. Users can’t see the page content till it downloads and runs:
    
    
    ii> Placing at the bottom of page. Last of <body> tag
    To avoid the above issue we can place the script tag at the bottom of the page. By this HTML parsing is not blocked and UI is rendered to the screen.
    But this gives us 1 problem.
        a> The browser notices the script (and can start downloading it) only after it downloaded the full HTML document. For long HTML documents, that may be a noticeable delay.

THE SOLUTION (async/defer)

i> DEFER:
        a> Here the scipt tag is downloaded parallely while the browser continues to parse the HTML and build DOM. The script is kept ready (downloaded) and     executed only when the entire HTML is parsed and DOM is built completely.
        b> Scripts with defer never block the page.
        c> Scripts with defer always execute when the DOM is ready (but before DOMContentLoaded event).
        d> Maitains order of execution of scripts in the order it were written.
            let's suppose there are 2 scripts tags small(size 5kb) and big(15kb). But big.js is written before small.js

            <script defer src="https://javascript.info/article/script-async-defer/long.js"></script>
            <script defer src="https://javascript.info/article/script-async-defer/small.js"></script>

            So even though small.js loads first, it still waits and runs after long.js downloads and executes.
ii> ASYNC:
        a> Here also script is downloaded parallely and doesn't block html parsing.

        Important difference between async and defer.
            a.i> It doesn't wait for html parsing to be completed. HTML parsing and async script downloading takes place parallely.
                Once the script has finished downloading, it will be executed immediately, even if the rest of the page is not yet fully loaded. 

            a.ii> DOMContentLoaded and async scripts don’t wait for each other:
            a.iii> For multiple scripts, the script which got downloaded first will be executed first and won't check for the order in which that were written.
                let's suppose there are 2 scripts tags small(size 5kb) and big(15kb). But big.js is written before small.js

                <script async src="https://javascript.info/article/script-async-defer/long.js"></script>
                <script async src="https://javascript.info/article/script-async-defer/small.js"></script>

                As small.js loads first so it gets executed first as well.


NOTE: We can "async" when the scripts are totally independent of each other and doesn't require the full DOM tree in it's execution.

7> What are different Datatypes?
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
    a> Object -> Array is included here as well.
    b> Functions

8> Difference between null and undefined?
Ans: 
"null" indicates that the variable or property has no value. In other words, null is a value that has been explicitly assigned to a variable or property to indicate that it does not have a meaningful value.

"Undefined", on the other hand, is a value that is automatically assigned to a variable or property that has been declared but not yet assigned a value. It indicates that a variable or property has not been initialized with a value.

let x; // x is undefined by default
let y = null; // y is explicitly assigned the null value
console.log(x); // Output: undefined
console.log(y); // Output: null

9> Why is typeof operator?
Ans:
The typeof operator returns a string indicating the type of the operand's value.
Open -> [click to open](src/Tutorials/Typeof&Falsy.js)

10> Why do we get typeof null as object?
Ans: It's basically a bug in JS.
In the first implementation of JavaScript, JavaScript values were represented as a type tag and a value. The type tag for objects was 0. null was represented as the NULL pointer (0x00 in most platforms). Consequently, null had 0 as type tag, hence the typeof return value "object"
                OR
Both null and Object are represented in similar bit pattern as that of object reference. Hence, we get object for null as well.

11> What are thruthy and falsy values?
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

[click to open](src/Tutorials/Typeof&Falsy.js)
    
12> What does instanceof operator do?
The instanceof operator tests to see if the prototype property of a constructor appears anywhere in the prototype chain of an object. The return value is a boolean value.
object instanceof constructor.

13> Scopes in JS.
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

Lexical scope: 

14> Var, let and const?
Ans: [click to open](src/Tutorials/ReadmeFiles/VarLetConst.md)

    Can we modify a variable declared using const?
    Ans:
        when we declare a const variable that holds an object, such as an array, it means that the variable cannot be reassigned to a different object. It does not mean that the object itself is immutable.

        In the case of const arr = [2,5,6], the const keyword ensures that arr cannot be reassigned to a different array or a different value. However, we can still modify the contents of the array itself, such as by adding new elements to it or changing existing elements.

        When we call arr.push(9), we are modifying the contents of the existing array rather than reassigning arr to a new array. Therefore, the operation is allowed and does not violate the const constraint.

        Simple bhasa mein = kar ke nhi value change kar sakte par method use kar ke kar sakte.
        High level mein bole toh Every object is referred by their reference and when we declare a variable of non-primitive datatype, it's reference can't be changed. However, we can change the value stored at that reference.


15> Shadowing and Illegal Shadowing?
Ans: [click to open](src/Tutorials/ReadmeFiles/VariableShadowing.md)

16> What is typeof operator? I/O questions based on it.
Ans: [click to open](src/Tutorials/Typeof&Falsy.js)

17> What are falsy and truthy values?
Ans: [click to open](src/Tutorials/Typeof&Falsy.js)

18> Operators in JS?
Ans:[click to open](src/Tutorials/ReadmeFiles/LogicalOperators.md)
    [click to open](src/Tutorials/ReadmeFiles/ComparisonOperators.md)
    [click to open](src/Tutorials/ReadmeFiles/NullishOperator.md)

19> isNaN() and Number.isNaN()?
Ans: [click to open](src/Tutorials/isNaN.js)

20> Precedence of Operators and associativity.
Ans: 
    1> ()
    2> ?.
    3> postfix ...++
    ...--
    4> unary operator & prefix: ! ~ + - ++... --...
    5> \*_ (right to left)
    6> _ / %
    7> + -
    8> << >>
    9> < > <= >=
    10> == != === !==
    11> |
    12> &
    13> ^
    14> &&
    15> ||
    16> ??
    17> =

    For Associativity, most of left to right.
    Exception: ** (exponential operator)
     --->>>
            the unique exponentiation operator has right-associativity, whereas other arithmetic operators have left-associativity.
            const a = 4 ** 3 ** 2; // Same as 4 ** (3 ** 2); evaluates to 262144
21> Coercion.
Ans: [click to open](src/Tutorials/Coercion.js)

22> How would compare a non-primitive datatypes?

23> Functions, Arrow Function(without this), Function Expression, Callbacks, IIFE?
Ans: [click to open](src/Tutorials/Functions.js)
    

24> string methods.
Ans: 
    -->> slice, substring, substr(deprecated but still should know), includes, at, trim, padStart, padEnd, split, join, match, matchAll
    slice => can take -ve, work as i think
    substring => almost same as slice
    doesn't take -ve values, when given treated as 0
    if endIndex is less than startIndex then swaps it.
    console.log('mozilla'.substring(4, 7)); // 'lla'
    console.log('mozilla'.substring(7, 4)); // 'lla'
    substr => takes a starting point and goes till the length of output string becomes equal to 2nd argument.
    however, it's deprecated now.      

    Note: When NaN is provided as index, then it's treated as 0 for every above method.

25> object methods.
    -> Different way to create object.
    -> construction function to create object
    -> Freeze vs Seal
    -> If Object.freeze does shallow freeze then how can we make it deep freeze?
    -> Tell her about the es6 shorthand
    -> syntax

Ans: [click to open](src/Tutorials/Object.js)

Array methods:
    -> push() => add at last. Returns the length of new array. Modifies original array.
    -> pop() => removes the last element. Returns the removed element i.e. last element. Modifies original array.
    -> shift() => removes first element. Returns the removed element i.e. first element. Modifies original array.
    -> unshift() => add at beginning of the array. Returns the length of new array. Modifies original array.
       To avoid confusion b/w shift and unshift: shift means "sharak/side ho/hatna" so removes first element. 
    -> at(index) -> returs the element at given index. Can take -ve value as well
    -> concat() -> add element or any array to the operational array
    -> flat() -> creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.
    -> slice() -> same as string method
    -> reverse() -> reverses the current array and returns the reference of original arr. Modifies original array.
    -> splice() -> can add, delete or modify the array. Returns the removed elements in the form of array. Modifies original array.
    -> indexOf(element) -> returns 1st index of element. If not found returns -1
    -> lastIndexOf() ->  returns 1st index of element from last. If not found returns -1
    -> includes(searchVal) -> returns true if searchVal found in array else false.

    Note: These 3 above methods can't be applied to array of objects or array of arrays i.e.(array of non-primitive types)

    -> map() -> returns new array of same length which each element getting the values from return value of function.
    -> filter() -> returns new array of with only that elements for which the function returned true.
    -> every() -> returns true if all the elements returned true from the function or if all the elements satisfied the condition
    -> some() -> returns true if any element returned true from the function.
    -> find() -> returns the found element else undefined
    -> findIndex() -> returns the 1st index of found element else -1

    # Desctructive methods -> alternative non-destructive methods
    push()                 -> [...arr, newValue]
    pop()                  -> slice(0, arr.length - 1) or toSpliced(arr.length - 1, 1)
    shift()                -> slice(1) or toSpliced(0, 1)
    unshift()              -> [newValue, ...arr]
    splice()               -> toSpliced()
    reverse()              -> toReversed()
    sort()                 -> toSorted()

[click to open](src/Tutorials/Arrays.js)

    These above methods can be applied in all kind of arrays.

    -> reduce() 
[click to open](src/Tutorials/Reduce.js)

    Refer this for more info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

26> delete operator
Ans: Returns true is object property is deleted else false. 
    syntax: delete object.property
            delete object[property]
    
    If we want to delete an element in array using this delete syntax i.e. delete arr[2]
    Then it does remove it but leaves undefined at that place. So size still remains the same.

    const arr = ["Paisa", "Paisa", "Paisa"];
    delete arr[1]; // removes "Paisa" and returns true
    console.log(arr[1]); // undefined 
    console.log(arr); // ['Paisa', ,'Paisa'] 

27> sort method on array and strings.
    -> Math.random()
    -> Math.ceil()
    -> Math.floor()
    -> Math.abs()

Ans: [click on link to open](src/Tutorials/sortMethod.js)

Note:    Give some scenarios and ask which data type would she choose.

28> Dot vs Bracket Notation in JS.
29> Map and set.
Ans: [click to open](src/Tutorials/ReadmeFiles/MapSetObject.md)

30> JSON.stringify, JSON.parse, LocalStorage, SessionStorage, structureClone.

31> ES6 concepts. (Spread, destructuring, rest, optional Chaining).
Ans: [click to open](src/Tutorials/ES6.js)

32> Shallow copy and deep copy.
Ans: [click to open](src/Tutorials/shallow&DeepCopy.js)

33> Oops in JS?
Ans> i> Classes used for making scalable objects
    ii> Making use of 
        a> Encapsulation
        b> Abstraction
        c> Inheritance
        d> Polymorphism
    [click to open](src/Tutorials/OopsConcept.js)

34> Constructor property of Object?
Ans.  Returns a reference to the constructor function that created the instance object. Note that the value of this property is a reference to the function itself, not a string containing the function's name.

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

35> How would you check if the given argument is an Array?
Also explain about semicolon.
How can convert any variable into boolean? (!!)
break and continue
switch statement: https://javascript.info/switch


<------------------------- PHASE 2 ------------------------->
36> Hoisting?
Ans: [click to open](src/Tutorials/Hoisting.js)

37> call, apply, bind
Ans: [click to open](src\Tutorials\callApplyBind.js)

38> Prototype Inheritance
Ans: [click to open](src\Tutorials\prototypeChain&pollyfills.js)

39> this operator
Ans: [click to open](src\Tutorials\thisExample.js)

40> Closure
Ans: [click to open](src/Tutorials/closure.js)

41> Currying
Ans: [click to open](src\Tutorials\currying.js)

42> Asynchronous behaviour
        -> Event loop: [click to open](src/Tutorials/eventLoop.js)
        -> Async behaviour and why we need Promises: [click to open](src/Tutorials/Asynchronous.js)
        -> Promises varinats:[click to open](src/Tutorials/PromiseVariant.js)
            ->Promise.all
            ->Promise.allSettled
            ->Promise.any
            ->Promise.race
        -> async/await & error handling: [click to open](src/Tutorials/asyncAwait.js)
            
<------------------------- PHASE 3 ------------------------->

Revision and I/O Question
Some DSA question based on Arrays, Objects & Strings. : [click to open](src/Tutorials/dsaQuestions.js)

<------------------------- Phase 4 ------------------------->
# HTML, CSS & Casual JS questions