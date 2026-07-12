# `typeof` Operator and Truthy/Falsy Values

## `typeof` Operator

### Q 1

```javascript
typeof 37;
```

<details>
<summary>Show Answer</summary>

```
'number'
```

</details>

### Q 2

```javascript
typeof `template literal`;
```

<details>
<summary>Show Answer</summary>

```
'string'
```

</details>

### Q 3

```javascript
typeof !!1;
```

<details>
<summary>Show Answer</summary>

```
'boolean'
```

</details>

### Q 4

```javascript
typeof /regex/;
```

<details>
<summary>Show Answer</summary>

```
'object'
```

</details>

### Q 5

```javascript
typeof 3.14;
```

<details>
<summary>Show Answer</summary>

```
'number'
```

</details>

### Q 6

```javascript
typeof Boolean(1);
```

<details>
<summary>Show Answer</summary>

```
'boolean'
```

</details>

### Q 7

```javascript
typeof Math.LN2;
```

<details>
<summary>Show Answer</summary>

```
'number'
```

</details>

### Q 8

```javascript
typeof true;
```

<details>
<summary>Show Answer</summary>

```
'boolean'
```

</details>

### Q 9

```javascript
typeof [1, 2, 4];
```

<details>
<summary>Show Answer</summary>

```
'object'
```

**Explanation:** Arrays are objects in JS — `typeof` doesn't distinguish arrays from plain objects. Use `Array.isArray()` to check specifically for an array.

</details>

### Q 10

```javascript
typeof Symbol();
```

<details>
<summary>Show Answer</summary>

```
'symbol'
```

</details>

### Q 11

```javascript
typeof declaredButUndefinedVariable;
```

<details>
<summary>Show Answer</summary>

```
'undefined'
```

**Explanation:** The variable exists (was declared) but has no value assigned, so its value is `undefined`, and `typeof undefined` is `'undefined'`.

</details>

### Q 12

```javascript
typeof new Number(1);
```

<details>
<summary>Show Answer</summary>

```
'object'
```

**Explanation:** `new Number(1)` creates a `Number` **wrapper object**, not a primitive number. Wrapper objects (`new Number()`, `new String()`, `new Boolean()`) are always `'object'`, unlike their primitive counterparts.

</details>

### Q 13

```javascript
typeof undeclaredVariable;
```

<details>
<summary>Show Answer</summary>

```
'undefined'
```

**Explanation:** `typeof` is the one operator that can be safely used on an undeclared variable without throwing a `ReferenceError` — it just returns `'undefined'`, same as a declared-but-unassigned variable (see Q 11).

</details>

### Q 14

```javascript
typeof "bla";
```

<details>
<summary>Show Answer</summary>

```
'string'
```

</details>

### Q 15

```javascript
typeof Infinity;
```

<details>
<summary>Show Answer</summary>

```
'number'
```

</details>

### Q 16

```javascript
typeof "";
```

<details>
<summary>Show Answer</summary>

```
'string'
```

</details>

### Q 17

```javascript
typeof NaN;
```

<details>
<summary>Show Answer</summary>

```
'number'
```

**Explanation:** `NaN` stands for "Not a Number", but it's still, perhaps confusingly, of type `'number'`.

</details>

### Q 18

```javascript
typeof Number("1");
```

<details>
<summary>Show Answer</summary>

```
'number'
```

</details>

### Q 19

```javascript
typeof Number("shoe");
```

<details>
<summary>Show Answer</summary>

```
'number'
```

**Explanation:** `Number("shoe")` evaluates to `NaN`, and `NaN` is still of type `'number'`.

</details>

### Q 20

```javascript
typeof "1";
```

<details>
<summary>Show Answer</summary>

```
'string'
```

</details>

### Q 21

```javascript
typeof new String("abc");
```

<details>
<summary>Show Answer</summary>

```
'object'
```

**Explanation:** Just like `new Number()` (Q 12), `new String()` creates a wrapper object, not a primitive string.

</details>

### Q 22

```javascript
typeof 42n;
```

<details>
<summary>Show Answer</summary>

```
'bigint'
```

</details>

### Q 23

```javascript
typeof typeof 1;
```

<details>
<summary>Show Answer</summary>

```
'string'
```

**Explanation:** The inner `typeof 1` evaluates first to the string `'number'`. Then the outer `typeof` runs on that string, and `typeof` on any string is `'string'`.

</details>

### Q 24

```javascript
typeof String(1);
```

<details>
<summary>Show Answer</summary>

```
'string'
```

</details>

### Q 25

```javascript
typeof false;
```

<details>
<summary>Show Answer</summary>

```
'boolean'
```

</details>

### Q 26

```javascript
typeof Symbol("foo");
```

<details>
<summary>Show Answer</summary>

```
'symbol'
```

</details>

### Q 27

```javascript
typeof undefined;
```

<details>
<summary>Show Answer</summary>

```
'undefined'
```

</details>

### Q 28

```javascript
typeof { a: 1 };
```

<details>
<summary>Show Answer</summary>

```
'object'
```

</details>

### Q 29

```javascript
typeof new Date();
```

<details>
<summary>Show Answer</summary>

```
'object'
```

</details>

### Q 30

```javascript
typeof function () {};
```

<details>
<summary>Show Answer</summary>

```
'function'
```

</details>

### Q 31

```javascript
typeof class C {};
```

<details>
<summary>Show Answer</summary>

```
'function'
```

**Explanation:** ⭐ Classes are functions under the hood, so `typeof` a class is `'function'` — same as `typeof function () {}` (Q 30).

</details>

### Q 32

```javascript
typeof new Boolean(true);
```

<details>
<summary>Show Answer</summary>

```
'object'
```

**Explanation:** Same wrapper-object rule as Q.12 and 21 — `new Boolean()` is an object, not a primitive boolean.

</details>

### Q 33

```javascript
typeof Math.sin;
```

<details>
<summary>Show Answer</summary>

```
'function'
```

</details>

## Truthy and Falsy Values

Every value is truthy in JS **except** these:

- `false`
- `0` (and `-0`)
- `0n` (BigInt zero)
- `""` (empty string)
- `null`
- `undefined`
- `NaN`

### Question 1

Is `true` truthy or falsy?

```javascript
if (true)
```

<details>
<summary>Show Answer</summary>

Truthy.

</details>

### Question 2

Is `{}` (an empty object) truthy or falsy?

```javascript
if ({})
```

<details>
<summary>Show Answer</summary>

Truthy.

**Explanation:** Only the primitive falsy values listed above are falsy — all objects, including empty ones, are truthy.

</details>

### Question 3

Is `[]` (an empty array) truthy or falsy?

```javascript
if ([])
```

<details>
<summary>Show Answer</summary>

Truthy.

**Explanation:** Same as `{}` (Question 2) — arrays are objects, and all objects are truthy regardless of whether they look "empty".

</details>

### Question 4

Is `42` truthy or falsy?

```javascript
if (42)
```

<details>
<summary>Show Answer</summary>

Truthy.

</details>

### Question 5

Is `"0"` (the string `"0"`) truthy or falsy?

```javascript
if ("0")
```

<details>
<summary>Show Answer</summary>

Truthy.

**Explanation:** It's a non-empty string. Only `""` (the actual empty string) is falsy — the *content* of the string doesn't matter.

</details>

### Question 6

Is `"false"` (the string `"false"`) truthy or falsy?

```javascript
if ("false")
```

<details>
<summary>Show Answer</summary>

Truthy.

**Explanation:** Same reasoning as `"0"` (Question 5) — it's a non-empty string, so it's truthy regardless of what it says.

</details>

### Question 7

Is `new Date()` truthy or falsy?

```javascript
if (new Date())
```

<details>
<summary>Show Answer</summary>

Truthy.

</details>

### Question 8

Is `-42` truthy or falsy?

```javascript
if (-42)
```

<details>
<summary>Show Answer</summary>

Truthy.

**Explanation:** Only `0`/`-0` is a falsy number — every other number, including negatives, is truthy.

</details>

### Question 9

Is `12n` truthy or falsy?

```javascript
if (12n)
```

<details>
<summary>Show Answer</summary>

Truthy.

</details>

### Question 10

Is `3.14` truthy or falsy?

```javascript
if (3.14)
```

<details>
<summary>Show Answer</summary>

Truthy.

</details>

### Question 11

Is `-3.14` truthy or falsy?

```javascript
if (-3.14)
```

<details>
<summary>Show Answer</summary>

Truthy.

**Explanation:** Same as `-42` (Question 8) — negative numbers are truthy; only `0`/`-0` is falsy.

</details>

### Question 12

Is `Infinity` truthy or falsy?

```javascript
if (Infinity)
```

<details>
<summary>Show Answer</summary>

Truthy.

</details>

### Question 13

Is `-Infinity` truthy or falsy?

```javascript
if (-Infinity)
```

<details>
<summary>Show Answer</summary>

Truthy.

**Explanation:** Same as `-3.14` and `-42` — negative numbers are truthy; only `0`/`-0` is falsy.

</details>
