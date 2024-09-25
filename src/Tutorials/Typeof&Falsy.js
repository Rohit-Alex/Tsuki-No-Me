typeof 37; // => 'number'
typeof `template literal`; // => 'string'
typeof !!1; // => 'boolean'
typeof /regex/; // => 'object'
typeof 3.14; // => 'number'
typeof Boolean(1); // => 'boolean'
typeof Math.LN2; // => 'number'
typeof true; // => 'boolean'
typeof [1, 2, 4]; // => 'object'
typeof Symbol(); // => 'symbol'
typeof declaredButUndefinedVariable; // => 'undefined'
typeof new Number(1); // => 'object'
typeof undeclaredVariable; // => 'undefined'
typeof "bla"; // => 'string'
typeof Infinity; // => 'number'
typeof ""; // => 'string'
typeof NaN; // => 'number'
typeof Number("1"); // => 'number'
typeof Number("shoe"); // => 'number'
typeof "1"; // => 'string'
typeof new String("abc"); // => 'object'
typeof 42n; // => 'bigint'
typeof typeof 1; // => 'string'
typeof String(1); // => 'string'
typeof false; // => 'boolean'
typeof Symbol("foo"); // => 'symbol'
typeof undefined; // => 'undefined'
typeof { a: 1 }; // => 'object'
typeof new Date(); // => 'object'
typeof function () {}; // => 'function'
typeof class C {}; //; // => 'function' ***********
typeof new Boolean(true); // => 'object'
typeof Math.sin; // => 'function'


/*
    Every values except these are truthy value in JS:
        i> false
        ii> 0 (and -0)
        iii> 0n (BigInt zero)
        iv> "" (empty string)
        v> null
        vi> undefined
        vii> NaN
*/

if (true) // truthy
if ({}) // truthy
if ([]) // truthy
if (42) // truthy
if ("0") // truthy
if ("false") // truthy
if (new Date()) // truthy
if (-42) // truthy
if (12n) // truthy
if (3.14) // truthy
if (-3.14) // truthy
if (Infinity) // truthy
if (-Infinity) // truthy
