# Nullish Coalescing Operator (??)

## Definition

The nullish coalescing (??) operator is a logical operator that returns its right-hand side operand when its left-hand side operand is null or undefined.

## `??` vs `||`, value by value

### Question 1

What's the difference between `null ?? "Ticket kar de"` and `null || "Ticket kar de"`?

```javascript
const nullValue = null;

console.log(nullValue ?? "Ticket kar de");
console.log(nullValue || "Ticket kar de");
```

<details>
<summary>Show Answer</summary>

```
Ticket kar de
Ticket kar de
```

**Explanation:** Same result — `null` is falsy for `||` *and* nullish for `??`, so both fall through to the right-hand side.

</details>

### Question 2

What's the difference between `"" ?? "Delhi aa"` and `"" || "Delhi aa"`?

```javascript
const emptyText = "";

console.log(emptyText ?? "Delhi aa");
console.log(emptyText || "Delhi aa");
```

<details>
<summary>Show Answer</summary>

```
""
Delhi aa
```

**Explanation:** Different results — an empty string is neither `null` nor `undefined`, so `??` returns it as-is. But `""` is falsy, so `||` falls through to `"Delhi aa"`.

</details>

### Question 3

What's the difference between `42 ?? 0` and `42 || 0`?

```javascript
const someNumber = 42;

console.log(someNumber ?? 0);
console.log(someNumber || 0);
```

<details>
<summary>Show Answer</summary>

```
42
42
```

**Explanation:** Same result — `42` is truthy and non-nullish, so both operators just return it.

</details>

### Question 4

What's the difference between `0 ?? 24` and `0 || 24`?

```javascript
const number0 = 0;

console.log(number0 ?? 24);
console.log(number0 || 24);
```

<details>
<summary>Show Answer</summary>

```
0
24
```

**Explanation:** Different results — `0` is neither `null` nor `undefined`, so `??` returns it as-is. But `0` is falsy, so `||` falls through to `24`. This is the classic reason `??` exists: `0` (and `""`, and `false`) are legitimate values you often don't want `||` silently overriding.

</details>

### Question 5

What's the difference between `false ?? '2lakh bhej'` and `false || '2lakh bhej'`?

```javascript
const booleanValue = false;

console.log(booleanValue ?? '2lakh bhej');
console.log(booleanValue || '2lakh bhej');
```

<details>
<summary>Show Answer</summary>

```
false
2lakh bhej
```

**Explanation:** Different results — `false` is neither `null` nor `undefined`, so `??` returns it as-is. But `false` is falsy, so `||` falls through to `'2lakh bhej'`.

</details>

## Key Difference

- `??` only treats `null` and `undefined` as "empty" and worth falling through on.
- `||` treats *every* falsy value as worth falling through on: `null`, `undefined`, `false`, `0`, `""`, `NaN`.
