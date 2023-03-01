Javascript definition : mentioned key point in Notes.md file
scripting/dynamic/JIT compilation
single threaded/synchronous/asynchronous

async/defer scripts

Datatypes
typeof
instanceof
truthy/falsy
== and ===

switch statement

Array methods
-->> push,pop,shift,unshift,concat,findIndexOf,findLastIndexOf,flat,includes,indexOf
-->> map,filter,reduce,reduceRight,find,some,every,slice,splice,group,groupMap

String methods
-->> slice, substring, substr(deprecated but still should know), includes, at, trim, padStart, padEnd, split, match, matchAll

sort method on array and strings

functions/constructor functions/arrow functions/generator/currying

Map & Sets

coercion

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

Promises
-->> all, allSettled, race, any, resolve, reject
-->> async/await

Polyfills for
-->> map, filter, reduce, call, apply, bind, promises, promise.all, promise.allSettled, promise.any, promise.race

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
