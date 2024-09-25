/*
COERCION:
Type coercion is the process of converting value from one type to another (such as string to number, object to boolean, and so on). Any type, be it primitive or an object, is a valid subject for type coercion.

Explicit Type Coversion: Forcefully conversion of one type into another. We can do so by writing the Datatype followed by wrapping the variable within parenthesis(). 

Implicit Type Coversion: The coversion takes on it's own automatically without user's knowledge.

One operator that does not trigger implicit type coercion is ===, which is called the strict equality operator. 
The loose equality operator == on the other hand does both comparison and type coercion if needed.

String Conversion
  Explicit conversion
  2 => String(2) => '2'
  2.toString() => '2'

* const num = 1 + 1 + 'lakh bhej' => '2 lakh bhej'

STRING CONVERSIONS:
Implicit coercion is triggered by the binary + operator, when any operand is a string:



Numeric conversion:
Explicit Conversion: Number('5') => 5
1> Triggered by comparison operators (>, <, <=,>=) when comparing 2 different types
2> bitwise operators ( | & ^ ~)
3> arithmetic operators (- + * / % ). Note, that binary+ does not trigger numeric conversion, when any operand is a string.
4> unary + operator
    +'5' => 5
    +'ILoveYou' => NaN 
5> loose equality operator ==, !=

Note that == does not trigger numeric conversion when both operands are strings.
'Amane' === 'Ubuyashiki' => false (this doesn't trigger numeric conversion)

Number(null)          // 0
Number(undefined)     // NaN
Number(false)         // 0
Number("")            // 0
Number("  ")          // 0
Number("\n")          // 0
Number("someNum")     // NaN
Number(true)          // 1
Number(" 12 ")        // 12
Number("-12.34")      // -12.34
Number(" 12s ")       // NaN
Number(123)           // 123
Number({})				    // NaN => Note: Object mein kuch bhi ho "NaN" hi aayega
Number([])				    // 0
Number([undefined])		// 0
Number([null])		    // 0
Number([24])				  // 24 => String([24]) =>'24' => Number('24') => 24
Number([24, 5])				// NaN => String([24, 5]) => '24,5' => Number('24,5') => NaN


Exceptions: 
1> null and undefined equal each other and don’t equal anything else. 

null === null => true
undefined === undefined => true
null == undefined => true
null === undefined => false

ii> NaN is not equal to itself also.

NaN == NaN false
NaN === NaN false


*/

3 + 3               // 6
"3" + "3"           // 33
"3" + +"3"          // "3" + 3 (as +"3" triggers numeric conversion) => 33
3 + +"3"            // 3 + 3 (as +"3" triggers numeric conversion) => 6
3 + 3 - 3           // 6 - 3 => 3
"3" + "3" - "3"     // 33 - "3" => 33 - 3 ( - triggers numeric conversion so "3" becomes 3) => 30

true + false
/* Explaination
  ==> 1 + 0
  ==> 1
*/

12 / '6'
/* Explaination
  ==> 12 / 6
  ==>> 2
*/

'number' + 15 + 3 
/* Explaination
  ==> "number15" + 3 
  ==> "number153"
*/

15 + 3 + "number"; 
/*
  ==> 18 + "number" 
  ==> "18number"
*/

[1] > null
/* Explanation
  ==> '1' > 0
  ==> 1 > 0
  ==> true
*/

"foo" + + "bar" 
/* Explanation
  ==> "foo" + (+"bar") 
  ==> "foo" + NaN 
  ==> "fooNaN"
*/

'true' == true
/* Explanation
  ==> NaN == 1
  ==> false
*/

false == 'false'   
/* Explanation
  ==> 0 == NaN
  ==> false
*/

null == ''
/* Explanation
== usually triggers numeric conversion, but it’s not the case with null . null equals to null or undefined only, and does not equal to anything else.
==> false
*/

!!"false" == !!"true";  
/* Explanation
  ==> true == true
  ==> true
*/

['x'] == 'x';  
/* Explanation
  ==> 'x' == 'x'
  ==>  true
*/


let a = 0;
console.log( Boolean(a) ); // false

let b = "0";
console.log( Boolean(b) ); // true

console.log(a == b); // true
/* Explanation:
   0 == "0"
   0 == Number("0")
   0 == 0
   true
*/

'2' > 1; //true
/* Explanation
  Number('2') > 1
  2 > 1
  true
*/

'01' == 1 
/* Explanation
  Number('01') == 1 
  => 1 == 1 
  => true
*/

null > 0 ; 
/* Explanation:
    null > 0
    Number(null) > 0
    0 > 0
    false
*/ 

null == 0;
/* Explanation:
    null == 0
   Note: No type conversion or number conversion.
   Remember, I told you "null and undefined equal each other and nothing else. Like hushband wife."
   so, false
*/  

null >= 0; 
/* Explanation:
    null >= 0
    Number(null) >= 0
    0 >= 0
    true
*/ 

null == undefined // true
null === undefined; // false
NaN === NaN; //false (NaN is not even equal to itself)

[] + null + 1; 
/* Explanation
  ==>  '' + null + 1  
  ==>  'null' + 1  
  ==> 'null1'
*/

0 || "0" && {};  
/* Explanation
  ==>  0 || ("0" && {})
  ==> 0 || {}
  ==> {}
*/

[1,2,3] == [1,2,3];
/* Explanation
  No coercion is needed because both operands have same type. Since == checks for object identity (and not for object equality) and the two arrays are two different instances, the result is false.
  ==>  false
*/

// eslint-disable-next-line no-empty
{}+[]+{}+[1]

/*
Explaination: first {} is not considered as an object literal, but rather as a block declaration statement, so it’s ignored.
==> +[]+{}+[1]
==> +''+{}+[1]
==> 0 + {} + [1]
==> 0 + '[object Object]' + [1]
==> '0[object Object]' + [1]
==> '0[object Object]' + '1'
==> '0[object Object]1'
*/

!+[]+[]+![];
/* Explanation: according to operator precedence. 
  ==> (!+[]) + [] + (![])
  ==> !0 + [] + !''
  ==> true + [] + true
  ==> true + '' + true
  ==> 'truetrue'
*/

[null].toString() = '';
[undefined].toString() = ''


const arr1 = [2,5]
const arr2 = [2,5]
console.log(arr1 === arr2) // false
/*
  As both of them are of same type hence no type conversion.
  As it is non-primitive then
  comparison is done with reference and not value.
  Even though both have same value but are placed at different reference in memory. Hence false
*/

let arr3 = [2];
let arr4 = [2, 4, 1];
arr3 = arr4; // At this line both are pointing to same reference. Hence true.
console.log(arr3 === arr4)


typeof 4+5; 
/* Explanation: typeof has higher precedence.
  (typeof 4) + 5
  => 'number5
*/

[2] + [4, 1];
/*
  Each gets converted to string first and gets joined
  '2' + '4,1' 
  '24,1'
*/

[24, 1, 1] + [998];
/*
  Each gets converted to string first and gets joined
  '24,1,1' + '998' 
  '24,1,1998' // (Hope that rings a bell)
*/
