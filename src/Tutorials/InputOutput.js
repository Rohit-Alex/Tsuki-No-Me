/* eslint-disable no-constant-condition */
// 1
typeof !!1;
typeof declaredButUndefinedVariable;
typeof { a: 1 }
typeof Symbol("foo") 
typeof undeclaredVariable;
typeof Infinity 
typeof String(1)
typeof Math.sin
typeof [1, 2, 4]
typeof "1";
typeof new Boolean(true)
typeof class C {};

// 2
if ("false") {
    console.log("inside")
}

// 3
if (-Infinity) {
    console.log("inside")
}

// 4
if ({}) {
    console.log("inside")
}

if ([null, undefined]) {
    console.log("inside")
}

// 5
var number = 50
function print() {
  var square = number * number
  console.log(square)
}
console.log(number) 
print()
console.log(square);

// 6
{
    const a = 5;
}
console.log(a);

// 7
function test() {
    z = 5;
}
console.log(z);
test()
console.log(z); 

// 8
{
  b = 5;
}
console.log(b)

// 9
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

// 10
var b = 20;
{
    let b = 50;
    console.log(b)
}
console.log(b)

// 11
let x = 20;
{
    var x = 30;
    console.log(x);
}
console.log(x);

// 12
let m = 24;
function temp() {
    var m = 30;
    console.log(m)
}
console.log(m)

// 13
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

// 14
console.log('Glow' > 'Glee');
console.log('Amane' > 'Amane');

// 15
console.log('' || -0 || 'Yaad karegi?' || [1,2] || {})
console.log({ans: 'sapna dekh'} || ['bilkul nhi'] || false || undefined || NaN)
console.log(['sapne toh roj dekhte'] || { addictive: 'hell yeah!' } || 24 || '🥱')
console.log('' || 0n || null || undefined || NaN || false)

// 16
console.log([null] && 'mg')
console.log('Humme tumse' && '' && 'jatana bhi...')
console.log(['Gaana band kar ab'] && {key: 'acha gaati waise'} && 'Answer bata')
console.log(null && NaN && '' && undefined && -0)

// 17
console.log(null ?? "Ticket kar de!"); 
console.log('' ?? "Chal theek hai"); 
console.log(241 ?? 0);
console.log(undefined ?? 24);
console.log(false ?? '2lakh bhej');

// 18 (Not that important but still should know)
console.log(Number.isNaN("Your grace"));
console.log(Number.isNaN("NaN"));
console.log(Number.isNaN(0));
console.log(Number.isNaN(NaN));

// 19
console.log(isNaN('NaN'))
console.log(isNaN('241'))
console.log(isNaN(null))
console.log(isNaN(undefined))
console.log(isNaN([]))

// 21
// Ab src\Tutorials\Coercion.js open kar ligiye "Your Grace".

// 22
const ans = 4 ** 3 ** 2
console.log(ans)

// 23
Q.
const obj = { a: 'one', b: 'two', a: 'three' };
console.log(obj);

Q.
let a = 3;
let b = new Number(3);
let c = 3;

console.log(a == b);
console.log(a === b);
console.log(b === c);

Q.
function checkAge(data) {
  if (data === { age: 18 }) {
    console.log('You are an adult!');
  } else if (data == { age: 18 }) {
    console.log('You are still an adult.');
  } else {
    console.log(`Hmm.. You don't have an age I guess`);
  }
}

checkAge({ age: 18 });

Q.
const obj = { 1: 'a', 2: 'b', 3: 'c' };
const set = new Set([1, 2, 3, 4, 5]);

obj.hasOwnProperty('1');
obj.hasOwnProperty(1);
set.has('1');
set.has(1);

Q.
const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;

console.log(a[b])

Q.
const numbers = [1, 2, 3];
numbers[10] = 11;
console.log(numbers);

Q.
let person = { name: 'Choro Hatao!' };
const members = [person];
person = null;

console.log(members);

Q.
const person = {
  name: 'Kya_karna_hai_naam_jaan_ke',
  .25e2: 25
};

console.log(person[25]);
console.log(person[.25e2]);
console.log(person['.25e2']);

Q.
const arr = ['my', 'name', 'is', 'mg']
console.log(arr.pop())
console.log(arr.push('Amane'))
console.log(arr.unshift('Hi', 'there'))
console.log(arr.shift())

Q.
function getAge(...args) {
  console.log(typeof args);
}

getAge(21);

Q.
var num = 8;
var num = 10;

console.log(num);

Q.
function sayHi() {
  return (() => 0)();
}

console.log(typeof sayHi());

Q.
let lang = 'javascript';
(function(){
   let lang = 'java';
})();

console.log(lang); (1)

(function(){
   var lang2 = 'java';
})();

console.log(lang2); (2)

Q.
(function(){
  var a = b = 3;
})();

console.log("a defined? " + (typeof a !== 'undefined'));
console.log("b defined? " + (typeof b !== 'undefined'));

Q.
console.log("0 || 1 = "+(0 || 1));
console.log("1 || 2 = "+(1 || 2));
console.log("0 && 1 = "+(0 && 1));
console.log("1 && 2 = "+(1 && 2));

Q.
!!null;
!!'';
!!1;
[]+2+[4,7]
[24] + [1]
+[5] + 5
[1, 2, 3] + [1, 3, 4]
console.log(false == '0')
console.log(false === '0')

Q.
var a = 10;
var b = a;
b = 20;

console.log(a);
console.log(b);

var a = 'Amane';
var b = a;
b = 'Ubuyashiki';

console.log(a);
console.log(b);

Q.
console.log('1' - - '1')
console.log('1' + - '1');


[...'Namooni'];


function getInfo(member, year) {
  member.name = 'Lydia';
  year = '1998';
}

const person2 = { name: 'Sarah' };
const birthYear = '1997';

getInfo(person2, birthYear);

console.log(person2, birthYear);


//46, 51, 53, 54, 55, 58, 61, 96, 102, 133