# Promise Variants: `all`, `allSettled`, `any`, `race`

All four static `Promise` methods take an array (or any iterable) of promises and return a single combined promise — they differ only in *when* that combined promise settles, and *what* it settles with.

## `Promise.all`

- **Fulfills** when **all** of the input promises fulfill, with an array of their fulfilled values (in the same order as the input, regardless of resolution order).
- **Rejects** as soon as **any** input promise rejects, with that first rejection reason — it doesn't wait for the others to settle.

**Analogy:** like needing a MacBook *and* a ≥7 LPA salary *and* a Bangalore posting before joining a company — if even one condition isn't met, the whole deal falls through.

### Question 1 — Basic Usage, Mixed Promise and Non-Promise Values

```javascript
const promise1 = Promise.resolve('Bangalore');
const promise2 = 700000;
const promise3 = new Promise((resolve) => {
    setTimeout(() => resolve('macbook pro'), 100);
});

Promise.all([promise1, promise2, promise3]).then((values) => {
    console.log(values);
});
```

<details><summary>Show Answer</summary>

```
[ 'Bangalore', 700000, 'macbook pro' ]
```

**Explanation:** `Promise.all` accepts non-promise values in the array too — they're treated as already-resolved (internally wrapped via `Promise.resolve()`), same as `700000` here. The output array preserves the original input order (`Bangalore`, `700000`, `macbook pro`) even though `promise3` is the slowest to actually settle.

</details>

### Question 2 — Rejecting Short-Circuits Immediately

```javascript
const fast = new Promise((_, reject) => setTimeout(() => reject('fast fail'), 50));
const slow = new Promise((resolve) => setTimeout(() => resolve('slow success'), 300));

Promise.all([fast, slow]).catch(err => {
    console.log('rejected with:', err);
});
```

<details><summary>Show Answer</summary>

```
rejected with: fast fail
```

**Explanation:** `Promise.all` doesn't wait for every promise to settle before deciding the outcome — the moment *any* input rejects, the combined promise rejects immediately with that reason (here, at ~50ms, without waiting the full 300ms for `slow`). This "fail fast" behavior is the key practical difference from `allSettled` below, and can matter for real UI code: an `all()`-based loading state will flip to an error state as soon as the first failure happens, even while other requests are still in flight.

</details>

### Question 3 — Using `await` With `Promise.all`, Including a Rejection

```javascript
(async () => {
    try {
        const values = await Promise.all([24, Promise.resolve('Your grace'), Promise.reject('Ubuyashiki')]);
        console.log(values);
    } catch (err) {
        console.log("Error: ", err);
    }
})();
```

<details><summary>Show Answer</summary>

```
Error:  Ubuyashiki
```

**Explanation:** since one of the inputs (`Promise.reject('Ubuyashiki')`) rejects, the whole `Promise.all` rejects — `await`ing it throws, which is caught by the surrounding `try/catch`. None of the other values are logged; the `catch` block only ever receives the rejection reason.

</details>

---

## `Promise.allSettled`

- Waits until **every** promise has **settled** — fulfilled or rejected, it doesn't matter which.
- Returns a promise that fulfills with an array of outcome objects, one per input, each shaped as either `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`.
- The returned promise **never itself rejects** — every outcome, success or failure, is captured inside the result array. So there's no need for `.catch()`/`catch` at all.

**Analogy:** like just wanting *a* job — location, laptop, salary don't all need to be perfect; whatever comes through is reported back, good or bad.

### Question 4

```javascript
const promise4 = Promise.resolve('Gurgaon');
const promise5 = 600000;
const promise6 = new Promise((resolve, reject) => {
    setTimeout(() => reject('No laptop'), 100);
});

(async () => {
    try {
        const values = await Promise.allSettled([promise4, promise5, promise6]);
        console.log(values);
    } catch (err) {
        // never reached — Promise.allSettled never rejects
    }
})();
```

<details><summary>Show Answer</summary>

```javascript
[
    { status: 'fulfilled', value: 'Gurgaon' },
    { status: 'fulfilled', value: 600000 },
    { status: 'rejected', reason: 'No laptop' }
]
```

**Explanation:** even though `promise6` rejects, `Promise.allSettled` doesn't throw or reject — it just records that outcome as `{ status: 'rejected', reason: 'No laptop' }` in its place in the result array, alongside the two fulfilled outcomes. The `catch` block here is genuinely unreachable.

</details>

### Remembering `all` vs. `allSettled`

- **`allSettled`** — self-explanatory: waits for everything to *settle* (fulfill or reject), then hands back every outcome, good or bad, no exceptions thrown.
- **`all`** — wants everything to succeed; money, smarts, zero liabilities — if even one condition isn't met, there's no satisfaction (immediate rejection).

---

## `Promise.any`

- Fulfills as soon as **any one** of the input promises fulfills, with that promise's value — it doesn't wait for or care about the others once it has a winner.
- Only rejects if **all** input promises reject, with an `AggregateError` whose `.errors` property holds every individual rejection reason.

### Question 5 — Fulfills With the First Successful One

```javascript
const errPromise = Promise.reject('Always fail');
const slowPromise = new Promise((resolve) => {
    setTimeout(resolve, 500, "Done slowly");
});
const quickPromise = new Promise((resolve) => {
    setTimeout(resolve, 100, "Done quickly");
});

(async () => {
    try {
        const value = await Promise.any([errPromise, slowPromise, quickPromise]);
        console.log(value);
    } catch (err) {
        console.log('Error: ', err);
    }
})();
```

<details><summary>Show Answer</summary>

```
Done quickly
```

**Explanation:** `errPromise` rejects immediately, but that alone doesn't reject the whole `Promise.any` — rejections are only fatal if *every* input rejects. Between `slowPromise` (500ms) and `quickPromise` (100ms), whichever fulfills first wins — here, `quickPromise`.

</details>

### Question 6 — Rejects Only When Everything Rejects

```javascript
const peedhaPrms = new Promise((resolve, reject) => {
    setTimeout(() => reject('Peeda'), 1000);
});

(async () => {
    try {
        const value = await Promise.any([Promise.reject('Dukh'), Promise.reject('Dard'), peedhaPrms]);
        console.log(value);
    } catch (err) {
        console.log('Error: ', err);
    }
})();
```

<details><summary>Show Answer</summary>

```
Error:  AggregateError: All promises were rejected
```

**Explanation:** all three inputs eventually reject — two immediately (`'Dukh'`, `'Dard'`), one after 1 second (`'Peeda'`). Since none ever fulfills, `Promise.any` rejects with an `AggregateError`. Inspecting `err.errors` would show `['Dukh', 'Dard', 'Peeda']` — every individual rejection reason, in input order.

</details>

---

## `Promise.race`

- Settles — fulfills **or** rejects — with whichever input promise settles **first**, regardless of whether that first one succeeded or failed.
- Unlike `any`, `race` doesn't specifically wait for a *success* — the first one to finish, win or lose, decides the outcome.

### Question 7 — Fastest Resolves Wins

```javascript
const prms1 = new Promise((resolve) => {
    setTimeout(resolve, 500, 'one');
});
const prms2 = new Promise((resolve) => {
    setTimeout(resolve, 100, 'two');
});

(async () => {
    try {
        const value = await Promise.race([prms1, prms2]);
        console.log(value);
    } catch (err) {
        console.log('Error: ', err);
    }
})();
```

<details><summary>Show Answer</summary>

```
two
```

**Explanation:** `prms2` settles first (100ms vs. 500ms), so `Promise.race` resolves with `'two'` — `prms1` is simply ignored once the race has already been decided.

</details>

### Question 8 — Fastest *Rejection* Also Wins

```javascript
const prms3 = new Promise((_resolve, reject) => {
    setTimeout(reject, 100, 'two');
});
const prms4 = new Promise((resolve) => {
    setTimeout(resolve, 500, 'two');
});

(async () => {
    try {
        const value = await Promise.race([prms3, prms4]);
        console.log(value);
    } catch (err) {
        console.log('Error: ', err);
    }
})();
```

<details><summary>Show Answer</summary>

```
Error:  two
```

**Explanation:** `prms3` *rejects* after only 100ms, well before `prms4` resolves at 500ms — and because `race` cares only about whichever settles first, a fast rejection beats a slow success. The `catch` block runs, not the success path.

</details>

### Question 9 — A Fast Success Beats a Slow Rejection

```javascript
const prms5 = new Promise((resolve) => {
    setTimeout(resolve, 100, 'two');
});
const prms6 = new Promise((_resolve, reject) => {
    setTimeout(reject, 500, 'two');
});

(async () => {
    try {
        const value = await Promise.race([prms5, prms6]);
        console.log(value);
    } catch (err) {
        console.log('Error: ', err);
    }
})();
```

<details><summary>Show Answer</summary>

```
two
```

**Explanation:** this time `prms5` (a success) settles first at 100ms, before `prms6`'s rejection at 500ms even happens — so the race resolves successfully. Same input shape as Question 8, but reversed outcome, purely because of *which one settles first*, not because of resolve vs. reject.

</details>

### Remembering `race` vs. `any`

- **`race`** — self-explanatory: whichever finishes first wins the result, whether it resolved or rejected.
- **`any`** — like picking a partner: it will never settle for the unsuccessful (rejected) ones. It waits specifically for the first *successful* one, and only reports failure (an `AggregateError`) if every single option was unsuccessful.

---

## Quick Comparison

| Method | Settles when... | Fulfills with... | Rejects with... |
|---|---|---|---|
| `Promise.all` | all fulfill, **or** any one rejects (whichever first) | array of all fulfilled values, in input order | the *first* rejection reason |
| `Promise.allSettled` | all have settled (fulfilled or rejected) | array of `{status, value/reason}` outcomes — never rejects | *(never rejects)* |
| `Promise.any` | any one fulfills, **or** all reject | the *first* fulfilled value | `AggregateError` — only if *all* reject |
| `Promise.race` | the first one settles, fulfilled or rejected | that first value, if it fulfilled | that first reason, if it rejected |
