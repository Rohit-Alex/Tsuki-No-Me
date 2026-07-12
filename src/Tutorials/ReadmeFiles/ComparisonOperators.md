
# Comparison Operators

## Basic Rules

- All comparison operators return a boolean value
- `<`, `<=`, `>=`, `==`, `!=` trigger numeric conversion when comparison is between different types
- A comparison result can be assigned to a variable, just like any value

### Example 1

```javascript
let result = 5 > 4; 
console.log(result);
```

<details>
<summary>Show Answer</summary>

```
true
```

</details>

## String Comparison
To see whether a string is greater than another, JavaScript uses the so-called “dictionary” or “lexicographical” order.
In other words, strings are compared letter-by-letter.

### Question 2
```javascript
console.log('Z' > 'A');
console.log('Glow' > 'Glee');
console.log('Bee' > 'Be');
console.log('a' > 'Z');
```

<details>
<summary>Show Answer</summary>

```
true
true
true
true
```

**Explanation:**
- `'Z' > 'A'`: Z comes after A in Unicode
- `'Glow' > 'Glee'`: 'o' comes after 'e' at position 3
- `'Bee' > 'Be'`: Longer string is greater when prefix matches
- `'a' > 'Z'`: Lowercase 'a' has higher Unicode value than uppercase 'Z'

</details>

## Comparison of Different Types

**NOTE:** When comparing values of different types, JavaScript converts the values to numbers.
