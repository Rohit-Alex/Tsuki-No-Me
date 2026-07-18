# Sort, Compare Functions, and Randomization

## Default Sort Behavior

**Default sorting order is ascending.** Default functionality: converts the elements into strings, then compares their sequences of UTF-16 code unit values. This applies **regardless of the actual element type** — including numbers, as Question 2 demonstrates.

### Question 1

```javascript
const strArr = ['caterpilar', 'ape', 'zebra', 'cat', 'Albatross', 'donkey']
strArr.sort()
console.log(strArr)
```

<details>
<summary>Show Answer</summary>

```
[ 'Albatross', 'ape', 'cat', 'caterpilar', 'donkey', 'zebra' ]
```

**Explanation:** `'Albatross'` sorts first even though `'ape'` comes earlier alphabetically in the everyday sense — because uppercase letters have **lower UTF-16 code points** than lowercase ones (`'A'` is `65`, `'a'` is `97`), a capitalized word always sorts before any lowercase word by default.

</details>

### Question 2

```javascript
const numArr = [2, 10, 1998, 24, 1999];
numArr.sort();
console.log(numArr);
```

<details>
<summary>Show Answer</summary>

```
[ 10, 1998, 1999, 2, 24 ]
```

**Explanation:** ⚠️ **The classic `.sort()` gotcha.** With no compare function, `.sort()` converts every element to a **string** first: `"10"`, `"1998"`, `"1999"`, `"2"`, `"24"`. String-compared, `"1..."` comes before `"2..."` regardless of how many digits follow, so `10` sorts before `2`. This is why you should **always** pass a compare function when sorting numbers.

</details>

## Custom Compare Functions

```javascript
function compare(a, b) {
    /* must return a number
        * if returned > 0  => b comes first
            a > b => a - b => greater than 0 => b comes first

        * if returned < 0  => a comes first
            a < b => a - b => less than 0 => a comes first

        * if returned === 0 => no change (relative order preserved)
            a === b => a - b => 0 => no change
    */
    return a - b
}
```

- **Ascending order** → `return a - b`
- **Descending order** → `return b - a`

### Question 3

```javascript
const numArr = [2, 10, 1998, 24, 1999];

function compare(a, b) {
    return a - b;
}

numArr.sort(compare);
console.log(numArr);
```

<details>
<summary>Show Answer</summary>

```
[ 2, 10, 24, 1998, 1999 ]
```

**Explanation:** With a proper numeric compare function, the exact same array from Question 2 now sorts correctly.

</details>

### Question 4

Does the same gotcha from Question 2 apply to negative numbers too?

```javascript
const num = [-1, 0, 1, 2, -1, -4, -2, -3, 3, 0, 4]
console.log(num.sort())
```

<details>
<summary>Show Answer</summary>

```
[ -1, -1, -2, -3, -4, 0, 0, 1, 2, 3, 4 ]
```

**Explanation:** Same root cause as Question 2, just easier to miss: string-compared, `"-1"` < `"-2"` < `"-3"` < `"-4"` (comparing the digit *after* the shared `-` character), so the "most negative" number, `-4`, ends up sorted as if it were the *largest* magnitude negative — landing at the end of the negatives group instead of the front. The positive numbers happen to look correctly ordered here only by coincidence (single digits sort fine as strings too), which makes this bug easy to miss in a quick glance.

</details>

### Question 5

```javascript
const num = [-1, 0, 1, 2, -1, -4, -2, -3, 3, 0, 4]
console.log(num.sort((a, b) => a - b))
```

<details>
<summary>Show Answer</summary>

```
[ -4, -3, -2, -1, -1, 0, 0, 1, 2, 3, 4 ]
```

**Explanation:** With the numeric compare function, the same array sorts correctly — true ascending numeric order, `-4` first.

</details>

## Custom Priority Ordering

You can sort by any arbitrary rule, not just ascending/descending — the compare function just needs to return negative/zero/positive consistently.

### Question 6

**Task:** `24` should always come first, `2` should always come second, and everything else follows in ascending order.

```javascript
const numArr = [2, 10, 24, 1998, 1999]; // already ascending, from Question 3

numArr.sort((a, b) => {
    if (a === 24) return -1;
    if (b === 24) return 1;

    if (a === 2) return -1;
    if (b === 2) return 1;

    return a - b;
});

console.log(numArr);
```

<details>
<summary>Show Answer</summary>

```
[ 24, 2, 10, 1998, 1999 ]
```

**Explanation:** The special-cased checks for `24` and `2` run before the fallback `a - b`, giving them forced priority regardless of their numeric value, while every other pair falls through to normal ascending comparison.

</details>

**Setup for the next two questions:**

```javascript
const makeupItems = [
    { type: 'Nail polish', quantity: 20 },
    { type: 'Lipstick', quantity: 14 },
    { type: 'Butterfly clips', quantity: 8 },
    { type: 'brushes', quantity: 16 },
    { type: 'Foundation', quantity: 8 },
]
```

### Question 7 — Spot the Bug

**Task:** sort by `quantity` descending; if quantities tie, sort by `type` alphabetically.

```javascript
makeupItems.sort((a, b) => {
    if (a.quantity !== b.quantity) {
        return b.quantity - a.quantity;
    } else {
        return a.type.length - b.type.length;
    }
});

console.log(makeupItems.map(i => `${i.type} (${i.quantity})`));
```

<details>
<summary>Show Answer</summary>

```
[
  'Nail polish (20)',
  'brushes (16)',
  'Lipstick (14)',
  'Foundation (8)',
  'Butterfly clips (8)'
]
```

**Explanation:** 🐛 **Bug:** the tie-break compares `a.type.length - b.type.length` — sorting by the **length** of the type name, not alphabetically. `'Foundation'` (10 characters) ends up before `'Butterfly clips'` (16 characters) purely because it's a shorter string, even though `'Butterfly clips'` comes first alphabetically (`B` < `F`). This is the kind of bug that's easy to miss because the code runs without error — it just silently sorts by the wrong criterion. See Question 8 for the fix.

</details>

### Question 8 — The Fix

```javascript
makeupItems.sort((a, b) => {
    if (a.quantity !== b.quantity) {
        return b.quantity - a.quantity;
    }
    return a.type.localeCompare(b.type);
});

console.log(makeupItems.map(i => `${i.type} (${i.quantity})`));
```

<details>
<summary>Show Answer</summary>

```
[
  'Nail polish (20)',
  'brushes (16)',
  'Lipstick (14)',
  'Butterfly clips (8)',
  'Foundation (8)'
]
```

**Explanation:** `.localeCompare()` is the correct way to compare strings alphabetically (and, unlike plain `<`/`>`, does it case-insensitively-ish and locale-aware by default) — now `'Butterfly clips'` correctly sorts before `'Foundation'` within the tied `quantity: 8` group. Note also that the two branches can be collapsed with `||`, since `0` (falsy) from the first comparison falls through to the second: `return (b.quantity - a.quantity) || a.type.localeCompare(b.type);`

</details>

### Question 9 — Sorting by a Custom Priority List

```javascript
const plansData = [
    { plan_id: 30, plan_type: 'REGULAR', plan_slogan: 'Jab tak aap ho tab tak mein' },
    { plan_id: 31, plan_type: 'SAVERS', plan_slogan: 'Sasta aur lamba' },
    { plan_id: 32, plan_type: 'LIFETIME', plan_slogan: 'Zindagi ke saath bhi, zindagi ke baad bhi' },
    { plan_id: 33, plan_type: 'EXCLUSIVE', plan_slogan: 'Sirf aapke liye' },
    { plan_id: 32, plan_type: 'PREMIUM', plan_slogan: 'Feel royal' }
]

// Sort such that order is EXCLUSIVE > PREMIUM > LIFETIME > REGULAR > SAVERS
plansData.sort((a, b) => {
    const order = ['EXCLUSIVE', 'PREMIUM', 'LIFETIME', 'REGULAR', 'SAVERS'];
    return order.indexOf(a.plan_type) - order.indexOf(b.plan_type);
});

console.log(plansData.map(p => p.plan_type));
```

<details>
<summary>Show Answer</summary>

```
[ 'EXCLUSIVE', 'PREMIUM', 'LIFETIME', 'REGULAR', 'SAVERS' ]
```

**Explanation:** A neat general pattern for "sort by an arbitrary custom order": build an array listing the desired order, then compare each element's `indexOf()` position in that list. Whichever type appears earlier in `order` gets the lower (earlier) sort position. This works regardless of what the underlying values look like — no special-casing needed like Question 6's approach.

</details>

## `Math.random()`

`Math.random()` generates a random number `>= 0` and `< 1`. Since it returns a float, `Math.floor()` or `Math.ceil()` is typically used to get a usable integer range.

```javascript
const rand1 = Math.random();                        // [0, 0.999...]
const rand2 = Math.floor(Math.random() * 5);         // integers 0 to 4
const rand3 = Math.ceil(Math.random() * 5);          // integers 0 to 5
```

### Question 10

**Task:** generate a random integer between `min` (inclusive) and `max` (exclusive), then between `min` and `max` (both inclusive).

```javascript
const min = 10;
const max = 20;

const randExclusiveMax = Math.floor(Math.random() * (max - min) + min);
const randInclusiveMax = Math.floor(Math.random() * (max - min + 1) + min);

console.log(randExclusiveMax >= min && randExclusiveMax < max);
console.log(randInclusiveMax >= min && randInclusiveMax <= max);
```

<details>
<summary>Show Answer</summary>

```
true
true
```

**Explanation:** `Math.random() * (max - min)` scales the `[0, 1)` range up to `[0, max - min)`; adding `min` shifts it to `[min, max)` — exclusive of `max`. Adding `1` inside the multiplication, `(max - min + 1)`, widens the scaled range by exactly one integer step, which after `Math.floor()` makes `max` itself reachable too.

</details>

## Shuffling an Array — the `sort()` Anti-Pattern

### Question 11

A very common (but broken) way to "randomly shuffle" an array:

```javascript
const yourNature = ['Patience', 'persistent', 'Innocence', 'Childish', 'Kanjoos', 'hot-headed', 'pessimistic']

const arrangeRandomly = () => {
    yourNature.sort(() => Math.random() - 0.5);
    console.log(yourNature)
}
arrangeRandomly()
```

Does this produce a genuinely uniform random shuffle?

<details>
<summary>Show Answer</summary>

**No.** ⚠️ `arr.sort(() => Math.random() - 0.5)` is a well-known anti-pattern — it does **not** produce a uniformly random permutation.

Running the first-position outcome 100,000 times on `[1, 2, 3, 4]` gives a clearly **biased** distribution (should be ~25,000 each if uniform):

```
{ '1': 35972, '2': 13961, '3': 18615, '4': 31452 }
```

**Explanation:** Sort algorithms aren't designed to be called with a random, inconsistent comparator — they make a specific, fixed number of comparisons based on their internal algorithm (varies by engine and array size), and a "random" comparator distributes those comparisons unevenly across elements, biasing which ones end up swapped and how often. It's also technically not even a spec-compliant comparator (it should be transitive/consistent across calls for the same pair), so behavior can differ across JS engines.

**The correct fix — Fisher-Yates shuffle:**

```javascript
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

The same 100,000-trial measurement on Fisher-Yates gives a genuinely uniform distribution:

```
{ '1': 24969, '2': 25092, '3': 25038, '4': 24901 }
```

Fisher-Yates works backward through the array, swapping each element with a random one from among the *remaining unshuffled* positions (`0` to `i`, inclusive) — guaranteeing every permutation is equally likely, in `O(n)` time with no bias.

</details>
