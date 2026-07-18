# Type Coercion in JavaScript

## Definition

**Type coercion** is the process of converting value from one type to another (such as string to number, object to boolean, and so on). Any type, be it primitive or an object, is a valid subject for type coercion.

### Types of Coercion

1. **Explicit Type Conversion:** Forcefully conversion of one type into another. We can do so by writing the Datatype followed by wrapping the variable within parenthesis().

2. **Implicit Type Conversion:** The conversion takes on its own automatically without user's knowledge.

### Important Notes

- `===` (strict equality) does not trigger implicit type coercion
- `==` (loose equality) performs both comparison and type coercion if needed
- Both `==` and `===` first check the types of the values being compared
- When types are identical, `==` and `===` behave exactly the same
- Objects are compared by reference, not by structure

## String Conversion

### Explicit Conversion
```javascript
String(2)     // '2'
(2).toString() // '2'
```

### Implicit Conversion
String conversion is triggered by the binary `+` operator when any operand is a string.

### Question 1

```javascript
console.log(1 + 1 + 'lakh bhej');
```

<details>
<summary>Show Answer</summary>

```
2lakh bhej
```

**Explanation:** Numbers are added first (1 + 1 = 2), then concatenated with the string.

</details>

## Numeric Conversion

### Explicit Conversion
```javascript
Number('5') // 5
```

### Implicit Conversion
Triggered by:
1. Comparison operators (`>`, `<`, `<=`, `>=`) when comparing different types
2. Bitwise operators (`|`, `&`, `^`, `~`)  
3. Arithmetic operators (`-`, `*`, `/`, `%`) - Note: `+` doesn't trigger numeric conversion when any operand is a string
4. Unary `+` operator
5. Loose equality operators (`==`, `!=`)

### Numeric Conversion Examples


```javascript
Number(null)                  // 0
Number(undefined)             // NaN
Number(false)                 // 0
Number("")                    // 0
Number("  ")                  // 0
Number("\n")                  // 0
Number("someNum")             // NaN
Number(true)                  // 1
Number("-0")                  // -0
Number(" 12 ")                // 12
Number("-12.34")              // -12.34
Number(" 12s ")               // NaN
Number(123)                   // 123
```

## The ToPrimitive Algorithm

Coercion of non-primitive values doesn't happen by magic — it follows a fixed lookup order:

1. Try `valueOf()` — if it returns a primitive, use that.
2. Otherwise try `toString()` — if it returns a primitive, use that.
3. Otherwise throw a `TypeError`.

This is *why* puzzles like `{}+[]+{}+[1]` (Question 55 below) behave the way they do — every object/array operand gets funneled through this algorithm before any arithmetic or string concatenation happens.

### `toString()` on Different Datatypes

```javascript
console.log(null.toString());
```

<details>
<summary>Show Answer</summary>
**TypeError** : null` has no `toString` method — it's not an object
</details>

```javascript
String(null)          // "null"
String(undefined)     // "undefined"
String(true)          // "true"
String(false)         // "false"
(3.14159).toString()  // "3.14159"
(0).toString()        // "0"
(-0).toString()       // "0"
```

### Array Serialization Edge Cases

Arrays are serialized to strings by dropping the brackets and calling `join(",")` on the contents. `null`/`undefined` elements are shown as empty strings.

#### Question 1

```javascript
console.log([].toString());
```

<details>
<summary>Show Answer</summary>

```
""
```

</details>

#### Question 2

```javascript
console.log([1,2,3].toString());
```

<details>
<summary>Show Answer</summary>

```
"1,2,3"
```

</details>

#### Question 3

```javascript
console.log([null, undefined].toString());
```

<details>
<summary>Show Answer</summary>

```
","
```

</details>

#### Question 4

```javascript
console.log([1, , 3].toString());
```

<details>
<summary>Show Answer</summary>

```
"1,,3"
```

**Explanation:** The sparse (empty) slot serializes to `""`.

</details>

#### Question 5

```javascript
console.log([[[], [], []], []].toString());
```

<details>
<summary>Show Answer</summary>

```
",,,"
```

**Explanation:** Nested arrays flatten recursively during serialization.

</details>

#### Question 6

```javascript
console.log([,,,,].toString());
```

<details>
<summary>Show Answer</summary>

```
",,,"
```

</details>

#### Question 7

```javascript
console.log([,,].toString());
```

<details>
<summary>Show Answer</summary>

```
","
```

**Explanation:** `Array.prototype.toString()` internally calls `join(",")`. Each element is stringified, then joined with the separator — `["", ""]` joined with `","` gives `","`.

</details>

#### Question 8

```javascript
console.log([null, undefined].toString());
```

<details>
<summary>Show Answer</summary>

```
","
```

</details>

#### Question 9

```javascript
console.log([null, 4, 5, undefined].toString());
```

<details>
<summary>Show Answer</summary>

```
",4,5,"
```

</details>

### Objects

All plain objects convert to the same generic string, regardless of contents.

#### Question 1

```javascript
console.log(({}).toString());
```

<details>
<summary>Show Answer</summary>

```
"[object Object]"
```

</details>

#### Question 2

```javascript
console.log(({a: 2}).toString());
```

<details>
<summary>Show Answer</summary>

```
"[object Object]"
```

</details>

### Number conversion for non-primitives follows same as String conversion

```
Number({})                    // NaN => Note: Object mein kuch bhi ho "NaN" hi aayega
Number([])                    // 0
Number([undefined])           // 0 => string([undefined])=> '' => Number('') => 0
Number([null])                // 0 => string([null])=> '' => Number('') => 0
Number([null, undefined])     // 0 => string([null, undefined])=> ',' => Number(',') => NaN
Number([null, undefined, 5])  // 0 => string([null, undefined, 5])=> ',,5' => Number(',') => NaN
Number([24])                  // 24 => String([24]) =>'24' => Number('24') => 24
Number([24, 5])               // NaN => String([24, 5]) => '24,5' => Number('24,5') => NaN
```

## Practice Questions

### Question 1

```javascript
console.log(3 + 3);
console.log("3" + "3");
console.log("3" + +"3");
console.log(3 + +"3");
```

<details>
<summary>Show Answer</summary>

```
6
33
33
6
```

**Explanation:**
- `3 + 3`: Numeric addition = 6
- `"3" + "3"`: String concatenation = "33"  
- `"3" + +"3"`: `+"3"` converts to number 3, then "3" + 3 = "33"
- `3 + +"3"`: `+"3"` converts to number 3, then 3 + 3 = 6

</details>

### Question 2

```javascript
console.log(true + false);
```

<details>
<summary>Show Answer</summary>

```
1
```

**Explanation:** `true` converts to 1, `false` converts to 0, so 1 + 0 = 1

</details>

### Question 3

```javascript
console.log(12 / '6');
```

<details>
<summary>Show Answer</summary>

```
2
```

**Explanation:** Division operator converts '6' to number 6, then 12 / 6 = 2

</details>

### Question 4

```javascript
console.log('number' + 15 + 3);
console.log(15 + 3 + "number");
```

<details>
<summary>Show Answer</summary>

```
number153
18number
```

**Explanation:**
- `'number' + 15 + 3`: Left-to-right evaluation, "number" + 15 = "number15", then "number15" + 3 = "number153"
- `15 + 3 + "number"`: Numbers added first (15 + 3 = 18), then 18 + "number" = "18number"

</details>

### Question 5

```javascript
console.log([1] > null);
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** 
- `[1]` converts to string "1", then to number 1
- `null` converts to number 0
- `1 > 0` = true

</details>

### Question 6

```javascript
console.log("foo" + + "bar");
```

<details>
<summary>Show Answer</summary>

```
fooNaN
```

**Explanation:** 
- `+"bar"` attempts to convert "bar" to number, resulting in NaN
- `"foo" + NaN` = "fooNaN"

</details>

### Question 7

```javascript
console.log('true' == true);
console.log(false == 'false');
```

<details>
<summary>Show Answer</summary>

```
false
false
```

**Explanation:**
- `'true' == true`: 'true' converts to NaN, true converts to 1, NaN == 1 is false
- `false == 'false'`: false converts to 0, 'false' converts to NaN, 0 == NaN is false

</details>

### Question 8

```javascript
console.log(null == '');
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** `null` equals only `null` or `undefined`, and nothing else. No type conversion happens.

</details>

### Question 9

```javascript
console.log(!!"false" == !!"true");
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** Both "false" and "true" are non-empty strings, so both convert to true. `true == true` is true.

</details>

### Question 10

```javascript
console.log(['x'] == 'x');
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** `['x']` converts to string "x", then "x" == "x" is true.

</details>

### Question 11

```javascript
let a = 0;
let b = "0";
console.log(Boolean(a));
console.log(Boolean(b));
console.log(a == b);
```

<details>
<summary>Show Answer</summary>

```
false
true
true
```

**Explanation:**
- `Boolean(0)` = false (0 is falsy)
- `Boolean("0")` = true (non-empty string is truthy)
- `0 == "0"`: "0" converts to 0, then 0 == 0 is true

</details>

### Question 12

```javascript
console.log('2' > 1);
console.log('01' == 1);
```

<details>
<summary>Show Answer</summary>

```
true
true
```

**Explanation:**
- `'2' > 1`: '2' converts to 2, then 2 > 1 is true
- `'01' == 1`: '01' converts to 1, then 1 == 1 is true

</details>

## Special Cases with null

### Question 13

```javascript
console.log(null > 0);
console.log(null == 0);
console.log(null >= 0);
```

<details>
<summary>Show Answer</summary>

```
false
false
true
```

**Explanation:**
- `null > 0`: Comparison converts null to 0, so 0 > 0 is false
- `null == 0`: No conversion! null only equals null or undefined
- `null >= 0`: Comparison converts null to 0, so 0 >= 0 is true

</details>

### Question 14

```javascript
console.log(null == undefined);
console.log(null === undefined);
console.log(NaN === NaN);
```

<details>
<summary>Show Answer</summary>

```
true
false
false
```

**Explanation:**
- `null == undefined`: Special rule - they equal each other
- `null === undefined`: Different types, so false
- `NaN === NaN`: NaN is not equal to itself

</details>

## Complex Examples

### Question 15

```javascript
console.log([] + null + 1);
```

<details>
<summary>Show Answer</summary>

```
null1
```

**Explanation:**
- `[]` converts to empty string ""
- `"" + null` = "null"
- `"null" + 1` = "null1"

</details>

### Question 16

```javascript
console.log(0 || "0" && {});
```

<details>
<summary>Show Answer</summary>

```
{}
```

**Explanation:**
- `&&` has higher precedence than `||`
- `"0" && {}`: "0" is truthy, so returns {}
- `0 || {}`: 0 is falsy, so returns {}

</details>

### Question 17

```javascript
console.log([1,2,3] == [1,2,3]);
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** No coercion needed since both are arrays. Arrays are compared by reference, and these are different instances.

</details>

### Question 18

```javascript
console.log({}+[]+{}+[1]);
```

<details>
<summary>Show Answer</summary>

```
0[object Object]1
```

**Explanation:**
- First `{}` is treated as a block statement, not an object literal
- `+[]` converts to `+""` which is 0
- `0 + {}` = "0[object Object]"
- `"0[object Object]" + [1]` = "0[object Object]1"

</details>

### Question 19

```javascript
console.log(!+[]+[]+![]);
```

<details>
<summary>Show Answer</summary>

```
truefalse
```

**Explanation:**
- `!+[]`: `+[]` is 0, `!0` is true
- `![]`: `![]` is false (empty array is truthy, so negation is false)
- `true + [] + false`: converts to "true" + "" + "false" = "truefalse"

</details>

### Question 20

```javascript
console.log(typeof 4+5);
```

<details>
<summary>Show Answer</summary>

```
number5
```

**Explanation:** `typeof` has higher precedence, so `(typeof 4) + 5` = "number" + 5 = "number5"

</details>

### Question 21

```javascript
console.log([2] + [4, 1]);
console.log([24, 1, 1] + [998]);
```

<details>
<summary>Show Answer</summary>

```
24,1
24,1,1998
```

**Explanation:**
- Arrays convert to strings: [2] becomes "2", [4, 1] becomes "4,1"
- String concatenation: "2" + "4,1" = "24,1"
- Similarly: "24,1,1" + "998" = "24,1,1998"

</details>

### Question 22

```javascript
console.log([] == ![]);
console.log([] != []);
```

<details>
<summary>Show Answer</summary>

```
true
true
```

**Explanation:**
- `[] == ![]`: `[]` converts to "", `![]` is false, `"" == false` converts to `0 == 0` which is true
- `[] != []`: Different array instances, so not equal, therefore `!=` is true

</details>

### Question 23

```javascript
console.log(3 + 3 - 3);
console.log("3" + "3" - "3");
```

<details>
<summary>Show Answer</summary>

```
3
30
```

**Explanation:**
- `3 + 3 - 3`: left-to-right, `3 + 3 = 6`, then `6 - 3 = 3`
- `"3" + "3" - "3"`: `+` with two strings concatenates first: `"3" + "3" = "33"`, then `-` forces numeric conversion: `33 - 3 = 30`

</details>

### Question 24

```javascript
console.log([null].toString());
console.log([undefined].toString());
```

<details>
<summary>Show Answer</summary>

```
""
""
```

**Explanation:** `null` and `undefined` elements are serialized as empty strings when an array is converted to a string (see "Array Serialization Edge Cases" above).

</details>

### Question 25

```javascript
const arr1 = [2, 5];
const arr2 = [2, 5];
console.log(arr1 === arr2);
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** Both operands are the same type (array), so no coercion happens. Non-primitives are compared by reference, not value — `arr1` and `arr2` are two different array instances in memory, even though their contents are identical.

</details>

### Question 26

```javascript
let arr3 = [2];
let arr4 = [2, 4, 1];
arr3 = arr4; // arr3 now points to the same reference as arr4
console.log(arr3 === arr4);
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** After `arr3 = arr4`, both variables hold a reference to the exact same array object, so `===` (reference comparison) is true.

</details>

## Special Value: -0

**Setup used by the questions below:**

```javascript
var trendRate = -0;
```

### Question 28

```javascript
console.log(trendRate === -0);
```

<details>
<summary>Show Answer</summary>

```
true
```

</details>

### Question 29

```javascript
console.log(trendRate === 0);
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** `-0` and `0` are equal under both `==` and `===` — neither comparison nor arithmetic operators can distinguish them.

</details>

### Question 30

```javascript
console.log(trendRate.toString());
```

<details>
<summary>Show Answer</summary>

```
"0"
```

</details>

### Question 31

```javascript
console.log(trendRate < 0);
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 32

```javascript
console.log(trendRate > 0);
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 33

```javascript
console.log(Object.is(trendRate, -0));
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** `Object.is()` is the one built-in that treats `-0` and `0` as distinct.

</details>

### Question 34

```javascript‚
console.log(Object.is(trendRate, 0));
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** Contrast with Question 69 — `Object.is()` tells `-0` and `0` apart, which is also why a hand-rolled `Object.is` polyfill needs to special-case `-0` (see [prototypeChain&pollyfills.js](../prototypeChain&pollyfills.js)).

</details>

## Key Takeaways

1. **String concatenation** happens when any operand of `+` is a string
2. **Numeric conversion** happens with comparison and arithmetic operators (except `+` with strings)
3. **null and undefined** only equal each other with `==`
4. **Objects** are always compared by reference, not value
5. **Empty arrays** `[]` convert to empty string `""`
6. **Empty objects** `{}` convert to `"[object Object]"`
7. **NaN** is not equal to anything, including itself
‚