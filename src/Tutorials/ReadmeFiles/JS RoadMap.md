Javascript definition : mentioned key point in Notes.md file
scripting/dynamic/JIT compilation
single threaded/synchronous/asynchronous
async/defer scripts: https://javascript.info/script-async-defer

Datatypes
typeof => Returns the datatype of the variable. It's return string.
Difference between null and undefined
instanceof: Mentioned key points in Notes.md (Pt. 4)

typeof null => 'object'
    -->>This is because in the implementation of the language, the type of null is represented by a bit pattern that is the same as    the bit pattern used to represent an object reference. This mistake was made in the early days of JavaScript development.


truthy/falsy
Operators (>, <, <=, >=, ||, &&, ==, === !, comma, ??, =, isNaN(a), Number.isNaN(a))
    --->>> Exponential operator
            the unique exponentiation operator has right-associativity, whereas other arithmetic operators have left-associativity.
            const a = 4 ** 3 ** 2; // Same as 4 ** (3 ** 2); evaluates to 262144
    --->>> Assignment operator is explained in Notes.md pt.31
    --->>> isNaN() function determines whether a value is NaN when converted to a number
    --->>> Number.isNaN() doesn't attempt to convert the parameter to a number, so non-numbers always return false
    --->>> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
    
Ternary operator:

    --->>> c ? p : q     <====> (c && p) || (!c && q)

    --->>> c ? true : p  <====> (c || p)
    --->>> c ? p : true  <====> (!c || p)

    --->>> c ? false : p <====> (!c && p)
    --->>> c ? p : false <====> (c && p)

    e.g. 
    boolean b;
    if (i > 5) {
        b = (j == 3);
    } else {
        b = false;
    }

    equivalent to: boolean b = (i > 5) && (j == 3)

coercion
    --->>> == and === (in details using coercion)
    --->>> https://javascript.info/comparison
    --->>> null and undefined equal each other and don’t equal anything else.
    --->>> [null].toString() => ''
           [undefined].toString() => ''
           [] => in number is equivalent to 0

break and continue
switch statement: https://javascript.info/switch

forIn, forOf, forEach --> covered in Iterators.js file

var,let,const
How are we able to change a constant variable with array but not a variable having primitive value?

Objects, Maps 
    --->>> Go through their differences. Which one to use and when.
    --->>> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
    --->>> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map (Difference is also provided)

Object.Freeze vs Object.Seal
    --->>> Seal => Naruto sealing corpses
                => can't add or remove any properties.
                => However, can change the existing properties.

           Freeze => Max privacy in object
                  => Can't add, modify or delete any properties.
                  => Only applicable at top level. i.e. Shallow freezing
                  Arrays, Sets

Object methods --> keys, values, entries, fromEntries, hasOwnProperty

delete operator -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete

Array methods
-->> push,pop,shift,unshift,concat,findIndexOf,findLastIndexOf,flat,includes,indexOf
-->> map,filter,reduce,reduceRight,find,some,every,slice,splice,group,groupMap

String methods
-->> slice, substring, substr(deprecated but still should know), includes, at, trim, padStart, padEnd, split, match, matchAll
-->> Mentioned key points of slice, substring, substr in Notes.md (Pt. 9)
sort method on array and strings

functions/constructor functions/arrow functions/generator/currying
Optional Chaining (?.) operator
order of precedence -> not necessary

Hoisting ---> covered in Function&Hoisting.js file
closure ---> covered in mischeleaneous.js file
IIFE
call, apply, bind ---> covered in callApplyBind.js file
Prototype Inheritance


template strings
spread, rest, optional chaining
JSON.stringify, JSON.parse, structureClone
crypto randomUUID

shallow copy/deep copy ---> covered in shallow&DeepCopy.js file
local storage/session storage

this operator ---> covered in thisExample.js file

setTimeout, setInterval, callback
Promises
-->> all, allSettled, race, any, resolve, reject
-->> async/await

Polyfills for
-->> map, filter, reduce, call, apply, bind, promises, promise.all, promise.allSettled, promise.any, promise.race

event-bubbling, event-capturing, event-delegation
Prototype chaining

Event loop

Classes

Debouncing & throttling

https://javascript.info/ (From introduction to events)

locale
currency short form

INTL DateTimeFormat
options ->
dateStyle, timeStyle => 'full', 'short', 'long'
hour, minute, second => 'numeric'
hour12 => false/true (to show am/pm or not)
fractionalSecondDigits (to show miliseconds can have values 1,2,3 i.e to show how many digits of miliseconds. Max 3)
day, month, year => 'numeric', 'short', 'long'
weekday => 'short'/'long'
timezone(Time zone 'Australia/Sydney'/'America/Los_Angeles')
timeZoneName => 'short'/'long'

INTL NumberFormat
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
options->
style => currency/unit
currency => 'EUR'/'JPY'/'INR'
unit => 'kilometer-per-hour'/'liter'
unitDisplay => 'long'/'short'
maximumSignificantDigits
maximumFractionDigits => numeric
minimumFractionDigits => numeric
useGrouping: false,
