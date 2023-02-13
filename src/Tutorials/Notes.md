1>
JavaScript is a lightweight scripting language.
--->scripting language because it uses the browser to do the dirty work.
Whatever instruction we give, JavaScript tells the browser to go do it.
It is weakly typed dynamic language.
--->Dynamic language because no variable is binded to a particular datatype.
It is used to provide functionality to the webpage.
mostly used as client side programming language

2>
If a function accepts more than 2 arguments then it's better to send an object rather than other values.

3>
To add props conditionally => {...(condition && {disable: true})}
To add keys conditionally in object => {...obj, ...(condition && {key: 1})}

4>
Instance Of
The instanceof operator tests to see if the prototype property of a constructor appears anywhere in the prototype chain of an object. The return value is a boolean value.
object instanceof constructor

5>
Eventloop -> responsible for executing js code, collecting and processing events and executing queued sub-tasks

6>
inline-block => same as inline except that they can have padding and margin added from top & bottom as well and allows to set a width and height on the element.

7>
currying => process of taking a function with multiple arguments and turning it into a sequence of functions.

8>
charCodeAt ==>> returns the ascii value of the character at given index of the string
"ABC".charCodeAt(0); // returns 65
fromCharCode ====>> returns the character for the given ascii value
String.fromCharCode(65, 66, 67); // returns "ABC"

9>
slice => can take -ve, work as i think
substring => almost same as slice
doesn't take -ve values, when given treated as 0
if endIndex is less than startIndex then swaps it.
console.log('mozilla'.substring(4, 7)); // 'lla'
console.log('mozilla'.substring(7, 4)); // 'lla'
substr => takes a starting point and goes till the length of output string becomes equal to 2nd argument.
however, it's deprecated now.

10>
isNaN ===>> isNaN() function determines whether a value is NaN when converted to a number
Number.isNaN() doesn't attempt to convert the parameter to a number, so non-numbers always return false. The following are all false:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN

11>
Closure => combination of function bundled together with it's lexical environment

12>
Freeze vs Seal
Seal => Naruto sealing corpses
=> can't add or remove any properties.
=> However, can change the existing properties.

Freeze => Max privacy in object
=> Can't add, modify or delete any properties.
=> Only applicable at top level. i.e. Shallow freezing

13>
HOC => making reuse of the component logic and functionality that is commonly required at different level of hierarchy
=> It's a pure function that takes a component as a parameter and returns a new component without changing the original component.
=> We can pass all the common functionality in props to the newly created component and acces these props in the actual component.
=> The props passed into these wrappedComponent can't be accessed there and needs to spread in the hoc to be able to use it.

14>
DOMContentLoaded => The DOMContentLoaded event fires when the HTML document has been completely parsed, and all deferred scripts (<script defer src="…"> and <script type="module">) have downloaded and executed. It doesn't wait for other things like images, subframes, and async scripts to finish loading.
componentDidMount is triggered as soon as the instance of the componenet is created. Wheras, DOMContentLoaded is fired once only in entire webPage life.

15>
Call, apply & bind
async & defer
throttling & debouncing

16>
the unique exponentiation operator has right-associativity, whereas other arithmetic operators have left-associativity.
const a = 4 ** 3 ** 2; // Same as 4 ** (3 ** 2); evaluates to 262144

17>
code splitting: ->
Code-Splitting is a feature supported by bundlers like Webpack, Rollup and Browserify (via factor-bundle) which can create multiple bundles that can be dynamically loaded at runtime.
Code-splitting your app can help you “lazy-load” just the things that are currently needed by the user, which can dramatically improve the performance of your app
The React.lazy function lets you render a dynamic import as a regular component.
const OtherComponent = React.lazy(() => import('./OtherComponent'));

18>
Error Boundary
Webpack -> module bundler

19>
Arrow functions cannot be used as constructors and will throw an error when used with new. Because they have a lexical this, and do not have a prototype property, so it would not make much sense.

20>
[null].toString() => ''
[undefined].toString() => ''
[] => in number is equivalent to 0

21>
const error = { message: 'rohit' }
const { config:
{ headers: { Authorization, ...exceptAuthorization } = {}, ...exceptHeaders } = {}, ...rest
} = error ?? {};

22>
Object.is() determines if two values have the same value or not. It works similar to the === operator but there are a few weird cases:
NaN is not equal to itself as well. To compare NaN, use Object.is() => It is similar to === except for this case
Object.is(NaN, NaN); // -> true
NaN === NaN; // -> false

Object.is(-0, 0); // -> false
-0 === 0; // -> true

Object.is(NaN, 0 / 0); // -> true
NaN === 0 / 0; // -> false

23>
Precedence operators:
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

24>
typeof 4+5 => 'number5

25>
Logger middleware in Redux
const logger = store => next => action => {
console.group(action.type)
console.info('dispatching', action)
console.log('next state', store.getState())
console.groupEnd()
return next(action)
}

26>
const crashReporter = store => next => action => {
try {
return next(action)
} catch (err) {
console.error('Caught an exception!', err)
Raven.captureException(err, {
extra: {
action,
state: store.getState()
}
})
throw err
}
}

27>
const thunkMiddleware =
({ dispatch, getState }) =>
next =>
action => {
// If the "action" is actually a function instead...
if (typeof action === 'function') {
// then call the function and pass `dispatch` and `getState` as arguments
return action(dispatch, getState)
}

    // Otherwise, it's a normal action - send it onwards
    return next(action)

}

// always return next(action) in middleware function

28>
Semicolon: =>>
Normally not putting ; after a line works. However if we have anything starting with square bracket e.g [....], (...)
in the new line without ending the previous line with semicolon ; then it's not taken as new line

alert("Hi");
[1,2].forEach(alert);  
 This works fine and we get alert of Hi, 1, 2

However,
alert("Hi")
[1,2].forEach(alert)  
 This doesn't work and we get alert of Hi, then error.
It's similar to alert("Hi")[1,2].forEach(alert)

29>
Number range => (2^53 - 1) in total 16 digit

30>
to swap two numbers: [a,b] = [b,a]

31>
Assignment = returns a value ===>>
The fact of = being an operator, not a “magical” language construct has an interesting implication.
All operators in JavaScript return a value. That’s obvious for + and -, but also true for =.
The call x = value writes the value into x and then returns it.
Here’s a demo that uses an assignment as part of a more complex expression:

let a = 1;
let b = 2;

let c = 3 - (a = b + 1);

alert(a); // 3
alert(c); // 0

32>
https://javascript.info/comparison

> ,<,<=,>=,==, != triggers numeric conversion when comparison is between different types.
> However, it always returs boolean value

33>
null and undefined equal each other and don’t equal anything else.

34>
https://javascript.info/switch

Default parameters are only applied when undefined is passed to it or nothing which is equivalent to undefined itself

35>
//unique values in array of object based on certain key
d = [...new Map(d.map(obj => [`${obj.id}:${obj.title}`, obj])).values()].map(item => ({
id: item?.id,
title: item?.title
}));

36>
function curry(func) {
return function curried(...args1) {
if (args1.length >= func.length) {
func.apply(this, args1)
} else {
return function(...args2) {
return curried.apply(this, args1.concat(args2))
}
}
}
}

37>
Classes are not hoisted

38>
constructor function & classes page->66

39>
In modern engines, the interpreter starts reading the code line by line while
the profiler watches for frequently used code then passes is to the compiler to
be optimized. In the end, the JavaScript engine takes the bytecode the interpreter
outputs and mixes in the optimized code the compiler outputs and then gives that to the
computer. This is called "Just in Time" or JIT Compiler.

40> history.push absolute & relatving routing.
e.g. initial route: https://www.bharatpe.com/transactions/status
i> Relative routing: history.push('my-charges') or history.push('./my-charges') => https://www.bharatpe.com/transactions/status/my-charges

ii> Absolute routing: history.push('/my-charges') => https://www.bharatpe.com/my-charges

41>
To Learn ---->>>
1> Prodution build
2> Reselect/Re-reselect for redux store memoization
3> Web workers
4> weakset, weakmap
5> structuredClone
6> shadowDOM
7> context vs Reducer vs Thunk vs Saga
8> Why can't we use redux state instead of local state
