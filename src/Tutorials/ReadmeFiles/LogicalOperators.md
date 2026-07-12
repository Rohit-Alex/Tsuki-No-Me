# Logical Operators

## Logical OR (`||`)

**Syntax:** `x || y`

**Rule:** If x can be converted to true, returns x; else, returns y.

### Question 1

```javascript
console.log(0 || 1);
```

<details>
<summary>Show Answer</summary>

```
1
```

</details>

### Question 2

```javascript
console.log(1 || 2);
```

<details>
<summary>Show Answer</summary>

```
1
```

</details>

### Question 3

```javascript
console.log(true || true);
```

<details>
<summary>Show Answer</summary>

```
true
```

</details>

### Question 4

```javascript
console.log(false || true);
```

<details>
<summary>Show Answer</summary>

```
true
```

</details>

### Question 5

```javascript
console.log(true || false);
```

<details>
<summary>Show Answer</summary>

```
true
```

</details>

### Question 6

```javascript
console.log(false || 3 === 4);
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** `===` has higher precedence than `||`, so this is `false || (3 === 4)` → `false || false` → `false`.

</details>

### Question 7

```javascript
console.log("Cat" || "Dog");
```

<details>
<summary>Show Answer</summary>

```
Cat
```

</details>

### Question 8

```javascript
console.log(false || "Cat");
```

<details>
<summary>Show Answer</summary>

```
Cat
```

</details>

### Question 9

```javascript
console.log("Cat" || false);
```

<details>
<summary>Show Answer</summary>

```
Cat
```

</details>

### Question 10

```javascript
console.log([] || "dog");
```

<details>
<summary>Show Answer</summary>

```
[]
```

**Explanation:** An empty array is truthy, so `||` short-circuits and returns it without ever evaluating `"dog"`.

</details>

### Question 11

```javascript
console.log("" || false);
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 12

```javascript
console.log(false || "");
```

<details>
<summary>Show Answer</summary>

```
""
```

**Explanation:** Both operands are falsy, so `||` returns the last one, unevaluated as anything other than itself — the empty string.

</details>

### Question 13

```javascript
console.log('' || -0 || ['😴'] || '🦧' || {});
```

<details>
<summary>Show Answer</summary>

```
['😴']
```

**Explanation:** `||` evaluates left to right and returns the first truthy value it finds. `''` and `-0` are both falsy, so evaluation continues to `['😴']` — a non-empty array, which is truthy — and that's returned immediately, without ever touching `'maan jaao'` or `{}`.

</details>

## Logical AND (`&&`)

**Syntax:** `x && y`

**Rule:** Logical AND (&&) evaluates operands from left to right, returning immediately with the value of the first falsy operand it encounters; if all values are truthy, the value of the last operand is returned.

### Question 1

```javascript
console.log(0 && 1);
```

<details>
<summary>Show Answer</summary>

```
0
```

</details>

### Question 2

```javascript
console.log(1 && 2);
```

<details>
<summary>Show Answer</summary>

```
2
```

</details>

### Question 3

```javascript
console.log(true && true);
```

<details>
<summary>Show Answer</summary>

```
true
```

</details>

### Question 4

```javascript
console.log(true && false);
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 5

```javascript
console.log(false && true);
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 6

```javascript
console.log(false && 3 === 4);
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** `&&` short-circuits on the first falsy operand — `false` — so `3 === 4` is never evaluated.

</details>

### Question 7

```javascript
console.log("Cat" && "Dog");
```

<details>
<summary>Show Answer</summary>

```
Dog
```

</details>

### Question 8

```javascript
console.log(false && "Cat");
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 9

```javascript
console.log("Cat" && false);
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 10

```javascript
console.log([] && "dog");
```

<details>
<summary>Show Answer</summary>

```
dog
```

**Explanation:** An empty array is truthy, so `&&` moves on to evaluate and return the next operand.

</details>

### Question 11

```javascript
console.log("" && false);
```

<details>
<summary>Show Answer</summary>

```
""
```

</details>

### Question 12

```javascript
console.log(false && "");
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 13

```javascript
console.log(4 && 'JS' && ['is', 'full', 'krazyyy'] && null && {key: 'val'});
```

<details>
<summary>Show Answer</summary>

```
null
```

**Explanation:** `&&` evaluates left to right and returns the first falsy value it finds. `4`, `'JS'`, and `['is', 'full', 'krazyyy']` are all truthy, so evaluation continues until it hits `null` — which is falsy — and that's returned immediately, without ever touching `{key: 'val'}`.

</details>

## Operator Precedence (`&&` vs `||`)

> **Note:** `&&` operator has a **higher precedence** than the `||` operator, meaning the `&&` operator is executed before the `||` operator (see operator precedence).

### Question 1

```javascript
console.log(true || false && false);
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** `true || false && false` → `true || (false && false)` → `true || false` → `true`

</details>

### Question 2

```javascript
console.log(true && (false || false));
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** `true && (false || false)` → `true && false` → `false`

</details>

### Question 3

```javascript
console.log((2 === 3) || (4 < 0) && (1 === 1));
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** `(2 === 3) || (4 < 0) && (1 === 1)` → `false || false && true` → `false || (false && true)` → `false || false` → `false`

</details>

## Assignment Operators

Just as:
```javascript
a += b  // means a = a + b
```

Similarly:
```javascript
a ||= b  // means a = a || b
a &&= b  // means a = a && b
```

**Setup used by the questions below:**

```javascript
const a = { duration: 50, title: '' };
let x = 1;
let y = 0;
```

### Question 1

```javascript
a.duration ||= 10;
console.log(a.duration);
```

<details>
<summary>Show Answer</summary>

```
50
```

**Explanation:** `50` is truthy, so `||=` doesn't assign — `a.duration` keeps its original value.

</details>

### Question 2

```javascript
a.title ||= 'title is empty.';
console.log(a.title);
```

<details>
<summary>Show Answer</summary>

```
title is empty.
```

**Explanation:** The empty string is falsy, so `||=` assigns the new value.

</details>

### Question 3

```javascript
x &&= 2;
console.log(x);
```

<details>
<summary>Show Answer</summary>

```
2
```

**Explanation:** `1` is truthy, so `&&=` assigns `2`.

</details>

### Question 4

```javascript
y &&= 2;
console.log(y);
```

<details>
<summary>Show Answer</summary>

```
0
```

**Explanation:** `0` is falsy, so `&&=` doesn't assign — `y` keeps its original value.

</details>
