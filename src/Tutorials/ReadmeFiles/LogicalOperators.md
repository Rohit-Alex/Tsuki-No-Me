LOGICAL OPERATORS

1> LOGICAL OR(||)
x || y
If x can be converted to true, returns x; else, returns y.

0 || 1;
1 || 2;
true || true; 
false || true; 
true || false; 
false || 3 === 4; 
"Cat" || "Dog"; 
false || "Cat"; 
"Cat" || false;
[] || "dog" 
"" || false; 
false || "";

2> LOGICAL AND(&&)
x && y
Logical AND (&&) evaluates operands from left to right, returning immediately with the value of the first falsy operand it encounters; if all values are truthy, the value of the last operand is returned.

0 && 1
1 && 2
true && true; 
true && false; 
false && true; 
false && 3 === 4; 
"Cat" && "Dog"; 
false && "Cat"; 
"Cat" && false;
{} && "dog" 
"" && false; 
false && ""; 

Note:
Operator precedence
The AND operator has a higher precedence than the OR operator, meaning the && operator is executed before the || operator (see operator precedence).

3>
true || false && false;
true && (false || false);
(2 === 3) || (4 < 0) && (1 === 1);

4>

Just as a+= b means a = a + b
Similarly,

a ||= b means a = a || b
a &&= b means a = a && b

e.g 
i>
const a = { duration: 50, title: '' };

a.duration ||= 10;
console.log(a.duration);

a.title ||= 'title is empty.';
console.log(a.title);


ii>
let a = 1;
let b = 0;

a &&= 2;
console.log(a);

b &&= 2;
console.log(b);
