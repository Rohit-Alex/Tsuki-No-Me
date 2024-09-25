
#### 1. LOGICAL OR(||)
> x || y

If x can be converted to true, returns x; else, returns y.
```
0 || 1; => 1
1 || 2; => 1
true || true; => true 
false || true; => true
true || false; => true
false || 3 === 4; => false
"Cat" || "Dog"; => "Cat"
false || "Cat"; => "Cat"
"Cat" || false; => "Cat"
[] || "dog" => []
"" || false; => false
false || ""; => ""
'' || -0 || ['suno'] || 'maan jaao' || {}; => ['suno']
```

#### 2. LOGICAL AND(&&)
>x && y

Logical AND (&&) evaluates operands from left to right, returning immediately with the value of the first falsy operand it encounters; if all values are truthy, the value of the last operand is returned.
```
0 && 1 => 0
1 && 2 => 2
true && true; => true
true && false; => false
false && true; => false
false && 3 === 4; => false
"Cat" && "Dog"; => "Dog"
false && "Cat"; => false
"Cat" && false; => false
[] && "dog" => "dog"
"" && false; => ""
false && ""; => false
4 && 'kya kar rhi' && ['acha', 'padh', 'rhi'] && null && {Amane: 'Ubuyashiki'} => null
```

> **Note:**
 && operator has a **higher precedence** than the || operator, meaning the && operator is executed before the || operator (see operator precedence).

```
true || false && false; true || (false && false) => true || false =>  true
true && (false || false); => false
(2 === 3) || (4 < 0) && (1 === 1); => false || false && true => false
```



Just as,
```
a+= b means a = a + b
Similarly,

a ||= b means a = a || b
a &&= b means a = a && b
```
examples:
```
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
```