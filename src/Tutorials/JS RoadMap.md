Javascript definition : mentioned key point in Notes.md file
scripting/dynamic/JIT compilation
single threaded/synchronous/asynchronous

async/defer scripts: https://javascript.info/script-async-defer

Datatypes
typeof
instanceof: Mentioned key points in Notes.md (Pt. 4)

truthy/falsy
Operators (>, <, <=, >=, ||, &&, ==, === !, comma, ??, =, isNaN, Number.isNaN())
    --->>> Exponential operator
            the unique exponentiation operator has right-associativity, whereas other arithmetic operators have left-associativity.
            const a = 4 ** 3 ** 2; // Same as 4 ** (3 ** 2); evaluates to 262144
    --->>> Assignment operator is explained in Notes.md pt.31
    --->>> isNaN() function determines whether a value is NaN when converted to a number
    --->>> Number.isNaN() doesn't attempt to convert the parameter to a number, so non-numbers always return false
    --->>> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
    
coercion
    --->>> == and === (in details using coercion)
    --->>> https://javascript.info/comparison
    --->>> null and undefined equal each other and don’t equal anything else.
    --->>> [null].toString() => ''
           [undefined].toString() => ''
           [] => in number is equivalent to 0

switch statement: https://javascript.info/switch

Objects, Maps 
    --->>> Go through their differences. Which to use and when.
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


Array methods
-->> push,pop,shift,unshift,concat,findIndexOf,findLastIndexOf,flat,includes,indexOf
-->> map,filter,reduce,reduceRight,find,some,every,slice,splice,group,groupMap

String methods
-->> slice, substring, substr(deprecated but still should know), includes, at, trim, padStart, padEnd, split, match, matchAll
-->> Mentioned key points of slice, substring, substr in Notes.md (Pt. 9)
sort method on array and strings

functions/constructor functions/arrow functions/generator/currying

this operator

order of precedence

Hoisting
closure
IIFE
call, apply, bind
Prototype Inheritance

var,let,const
template strings
spread, rest, optional chaining
forIn, forOf, forEach
Object methods --> keys, values, entries, fromEntries, hasOwnProperty
JSON.stringify, JSON.parse, structureClone
freeze, seal
crypto randomUUID

shallow copy/deep copy
local storage/session storage

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
options->
style => currency/unit
currency => 'EUR'/'JPY'/'INR'
unit => 'kilometer-per-hour'/'liter'
unitDisplay => 'long'/'short'
maximumSignificantDigits
maximumFractionDigits => numeric
minimumFractionDigits => numeric
