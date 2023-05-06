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
console.log('Nirali' > 'nirali');

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
