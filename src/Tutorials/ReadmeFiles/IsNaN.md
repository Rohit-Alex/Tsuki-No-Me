# isNaN() vs Number.isNaN()

## Key Differences

### `isNaN()`
- **Converts** the given parameter into number first, then tests whether it is NaN
- **Legacy method** with type coercion behavior

### `Number.isNaN()`
- **Does NOT attempt** to convert the parameter to a number
- **Returns true only if** the value is actually NaN
- **More reliable** and predictable behavior

## Rule to Remember

**Only `Number.isNaN(NaN)` returns true. Everything else returns false.**

For `isNaN()`, it first converts the value to a number, then checks if the result is NaN.

## Practice Questions

### Question 1

```javascript
console.log(Number.isNaN("NaN"));
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 2

```javascript
console.log(Number.isNaN(undefined));
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 3

```javascript
console.log(Number.isNaN({}));
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 4

```javascript
console.log(Number.isNaN("Hello"));
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 5

```javascript
console.log(Number.isNaN(true));
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 6

```javascript
console.log(Number.isNaN(null));
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 7

```javascript
console.log(Number.isNaN("37"));
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 8

```javascript
console.log(Number.isNaN("37.37"));
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 9

```javascript
console.log(Number.isNaN(""));
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 10

```javascript
console.log(Number.isNaN(" "));
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 11

```javascript
console.log(Number.isNaN(NaN));
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** `Number.isNaN()` only returns `true` for the actual `NaN` value — this is the one case in this whole list where it does.

</details>

### Question 12

```javascript
console.log(Number.isNaN(2));
```

<details>
<summary>Show Answer</summary>

```
false
```

</details>

### Question 13

```javascript
console.log(isNaN("NaN"));
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** `isNaN()` first converts the value with `Number("NaN")` → `NaN`, then checks `isNaN(NaN)` → `true`.

</details>

### Question 14

```javascript
console.log(isNaN(undefined));
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** `Number(undefined)` → `NaN` → `isNaN(NaN)` → `true`.

</details>

### Question 15

```javascript
console.log(isNaN({}));
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** `Number({})` → `NaN` → `isNaN(NaN)` → `true`.

</details>

### Question 16

```javascript
console.log(isNaN("blabla"));
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** `Number("blabla")` → `NaN` → `isNaN(NaN)` → `true`.

</details>

### Question 17

```javascript
console.log(isNaN(true));
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** `Number(true)` → `1` → `isNaN(1)` → `false`.

</details>

### Question 18

```javascript
console.log(isNaN(null));
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** `Number(null)` → `0` → `isNaN(0)` → `false`.

</details>

### Question 19

```javascript
console.log(isNaN("37"));
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** `Number("37")` → `37` → `isNaN(37)` → `false`.

</details>

### Question 20

```javascript
console.log(isNaN("37.37"));
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** `Number("37.37")` → `37.37` → `isNaN(37.37)` → `false`.

</details>

### Question 21

```javascript
console.log(isNaN(""));
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** `Number("")` → `0` → `isNaN(0)` → `false`.

</details>

### Question 22

```javascript
console.log(isNaN(" "));
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** `Number(" ")` → `0` → `isNaN(0)` → `false`.

</details>

### Question 23

```javascript
console.log(isNaN("123abc"));
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** First converts to `Number("123abc")`, which is `NaN`, then returns `true`.

</details>

### Question 24

```javascript
console.log(Number.isNaN("123abc"));
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** No conversion happens — `"123abc"` is a string, not `NaN`, so it returns `false`. Contrast with Question 23, where plain `isNaN()` converts it first and returns `true`.

</details>

### Question 25

```javascript
console.log(isNaN(NaN));
```

<details>
<summary>Show Answer</summary>

```
true
```

</details>

### Question 26

```javascript
console.log(Number.isNaN(NaN));
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** Both functions agree here — they only disagree when the input isn't already `NaN` but *converts* to `NaN`.

</details>

### Question 27

```javascript
console.log(isNaN(""));
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** `Number("")` → `0`, so `isNaN(0)` → `false`.

</details>

### Question 28

```javascript
console.log(Number.isNaN(""));
```

<details>
<summary>Show Answer</summary>

```
false
```

**Explanation:** No conversion — an empty string is not `NaN`, so it returns `false`.

</details>


## Key Takeaways

1. **`Number.isNaN()` is more reliable** - it doesn't perform type coercion
2. **`isNaN()` can give unexpected results** due to type conversion
3. **Use `Number.isNaN()`** when you specifically want to check for the `NaN` value
4. **Use `isNaN()`** only when you want to check if something becomes `NaN` after number conversion
5. **Remember**: `Number.isNaN(NaN)` is the only call that returns `true`

## Best Practice

**Prefer `Number.isNaN()`** over `isNaN()` for more predictable behavior, unless you specifically need the type coercion behavior of the legacy `isNaN()` function.
