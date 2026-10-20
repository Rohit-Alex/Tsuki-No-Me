# Feature Flag Store — Caching + Subscribe Pattern

Code: [FeatureFlagStore.js](FeatureFlagStore.js) (constructor-function version and class version, same behavior). Run with `node FeatureFlagStore.js`.

## 1. Problem

An app reads feature flags (`darkMode`, `newCheckout`) in many places.

1. Fetching a flag on every read is slow and wasteful. **Cache it.**
2. When a flag changes, every place that uses it must find out. **Let them subscribe.**

## 2. Why this design (and what breaks without it)

**Without the cache:** every `getFlag("darkMode")` is a network call. Ten components means ten calls for one answer.

**Without subscribe:** a flag flips, but the navbar still shows the old UI until someone polls or refreshes. Or you wire the store into every component by hand, and the store now knows about all of them.

Think of a **notice board in an office**:

- The cache is the board. You read the board, you don't phone HR each time.
- Subscribing is signing up for a text when the board changes. HR (the store) does not need to know who you are or what you do with the message. It just texts the list.
- Unsubscribing is leaving the list. If you forget, you keep getting texts forever (a memory leak).

## 3. The three pieces

```js
const cache = new Map();          // id -> value
const listeners = new Map();      // id -> Set of callbacks (one flag)
const globalListeners = new Set();// callbacks (every flag)
```

**`getFlag(id)`: cache first, fetch on miss**

```js
if (cache.has(id)) return cache.get(id);
const value = await fetchFlag(id);
cache.set(id, value);
return value;
```

Use `cache.has(id)`, not `if (cache.get(id))`. A flag can be `false`, and `false` is a valid cached answer.

**`subscribe(...)`: one function, two modes**

```js
store.subscribe("darkMode", (value, prev) => {});  // one flag
store.subscribe((change) => {});                   // all flags
```

It checks `typeof idOrCallback === "function"` to tell them apart. Both return an **unsubscribe function**.

**`updateFlag(id, newValue)`: write, then notify**

```js
if (cache.has(id) && oldValue === newValue) return; // nothing changed: stay quiet
cache.set(id, newValue);
listeners.get(id)?.forEach((cb) => cb(newValue, oldValue));
globalListeners.forEach((cb) => cb({ id, value: newValue, previousValue: oldValue }));
```

The early return matters. Without it, "set darkMode to true" when it is already `true` would still wake every subscriber for no reason.

## 4. Usage and output (verified in Node)

```js
const store = new FeatureFlagStore(async (id) => id === "darkMode");

const unsubDark = store.subscribe("darkMode", (v, prev) =>
  console.log("Dark mode:", prev, "->", v));
const unsubAll = store.subscribe((c) => console.log("changed:", c));

store.updateFlag("darkMode", false); // both listeners fire
store.updateFlag("newCheckout", true); // only the global listener fires

unsubAll();
unsubDark();
```

What each call notifies:

| Call | `darkMode` listener | global listener |
|---|---|---|
| `updateFlag("darkMode", true)` when already `true` | no | no |
| `updateFlag("darkMode", false)` | yes `(false, true)` | yes `{id, value:false, previousValue:true}` |
| `updateFlag("newCheckout", true)` (first time) | no | yes `previousValue: undefined` |
| after `unsubscribe()` | no | no |

## 5. Function vs class

| | Constructor function | Class |
|---|---|---|
| Private state | closure variables (`cache`) | `#cache` private fields |
| Methods | `this.getFlag = function...` (a new copy per instance) | on the prototype (shared by all instances) |
| `this` | must be `new`-ed | must be `new`-ed (throws if you forget) |

Closure state is truly private too, so both hide the cache. The class version is shorter to read and saves memory when you create many stores.

## 6. Gotchas (both verified)

1. **Two reads at once fetch twice.** If `getFlag("a")` is called twice before the first fetch finishes, the cache is still empty, so both call `fetchFlag`. Output: `concurrent fetches: 2`. Fix: cache the **promise**, not the value (`cache.set(id, fetchFlag(id))`).
2. **One bad subscriber can break the rest.** If a callback throws inside `updateFlag`, the error escapes and later callbacks never run. Wrap each call in `try/catch` if subscribers are code you don't control.
3. **Unsubscribe leaves an empty `Set`** in `listeners`. Harmless for a few flags. Delete the key when the set is empty if flags are created without limit.
4. **Pass `fetchFlag` in.** The original `new FeatureFlagStore(async fn)` ignored its argument and used `Math.random()`. Here the constructor stores and uses it.

## 7. Interview questions

- *Why `Map` and `Set` instead of an object and an array?* `Set` stops the same callback being added twice, and delete is O(1). `Map` keys can be any value and keep insertion order.
- *Why return an unsubscribe function instead of a separate `unsubscribe(id, cb)`?* The caller already holds the closure. No need to keep the id and callback around to remove it later. React's `useEffect` cleanup fits this directly: `return store.subscribe(...)`.
- *How would you plug this into React?* `useSyncExternalStore(store.subscribe, () => value)`. React calls `subscribe` for you and uses the returned function as cleanup.
- *Observer vs Pub/Sub?* Here subscribers hold a direct reference to the store (observer). Pub/sub adds a middle broker so publisher and subscriber never meet. See the [Cookie Consent notes](../CookieConsentManager/README.md) for the trade-off.
