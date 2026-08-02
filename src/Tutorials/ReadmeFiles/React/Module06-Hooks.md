# Module 6 — Hooks

> Part of the [React Mastery course](./README.md). Previous: [Module 5 — Component Model](./Module05-ComponentModel.md). Next: [Module 7 — Rendering Patterns](./Module07-Rendering.md).

Module 3 showed you where hooks live: a linked list on the fiber, matched by position. This module is what you do with them.

All outputs below are from running React in Node. Scripts in [verify/](./verify/).

---

## 1. Why hooks exist

Before 2019, state meant a class. Reusing *stateful logic* between components had no good answer:

```jsx
// The old way: wrap your component to share logic
withRouter(connect(mapState)(withStyles(styles)(MyComponent)))
```

This was called **wrapper hell** — five layers of components in DevTools, none of which rendered anything. Logic that belonged together (subscribe on mount, unsubscribe on unmount) got split across `componentDidMount` and `componentWillUnmount`, while unrelated logic got mashed together in the same lifecycle method.

Hooks flipped it. Instead of wrapping components to share logic, you **extract the logic into a function**:

```jsx
function Chat({ roomId }) {
  const isOnline = useOnlineStatus();      // one line, all the logic
  ...
}
```

**Analogy:** classes organised code by **when it happens** (on mount, on update, on unmount) — like filing your receipts by the day you got them. Hooks organise by **what it's about** — all the "chat connection" code in one place. When you need to change how chat works, you edit one function instead of hunting through three lifecycle methods.

📚 [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

## 2. The Rules of Hooks — and why they exist

**Two rules:**
1. Only call hooks at the **top level** — not in conditions, loops, or nested functions.
2. Only call hooks from **React functions** — components or other hooks.

Rule 1 isn't arbitrary. From Module 3, hooks are a **linked list matched by position**:

```
render 1:   Hook#1 (name) → Hook#2 (age) → Hook#3 (effect)
render 2:   Hook#1 (name) → Hook#2 (age) → Hook#3 (effect)   ✅ lines up
```

Put one behind an `if` and everything after it shifts by one slot:

```jsx
if (isLoggedIn) {
  const [name] = useState('');   // ❌ sometimes there, sometimes not
}
const [age] = useState(0);       // now reads name's slot when logged out
```

```
Error: Rendered fewer hooks than expected.
```

**Analogy:** hooks are like **numbered lockers with no name tags**. You remember "my stuff is in locker 2." If someone removes locker 1 overnight, locker 2 becomes locker 1 — and you open a stranger's locker. React can't tell, because the lockers were never labelled.

**The fix:** keep the calls unconditional, move the condition inside.

```jsx
const [name] = useState('');
const [age] = useState(0);
if (!isLoggedIn) return <Login />;   // ✅ early return AFTER all hooks
```

> **One exception:** `use` (React 19) is **not a hook** and *can* be called conditionally. §8 covers it.

---

## 3. State hooks

### `useState`

```jsx
const [count, setCount] = useState(0);
```

**Lazy initial state.** If the initial value is expensive to compute, pass a *function*:

```jsx
useState(expensiveCalc())        // ❌ runs on EVERY render, result thrown away
useState(() => expensiveCalc())  // ✅ runs once
```

Verified over 3 renders ([`hooks.cjs`](./verify/hooks.cjs)):

```
eager() calls: 3  |  lazy initializer calls: 1
```

The eager version ran the expensive function three times and discarded two results. React only uses the initial value on the first render — but it still has to *evaluate the argument* every time.

**Updater form.** When the new value depends on the old:

```jsx
setCount(count + 1);        // uses a snapshot — breaks when batched
setCount(c => c + 1);       // ✅ always gets the latest
```

Three `setCount(count + 1)` in a row give you **+1**, not +3, because all three read the same snapshot. Three `setCount(c => c + 1)` give you **+3**.

### `useReducer`

When state updates get complicated, move the logic out of the component:

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'added':   return [...state, action.item];
    case 'deleted': return state.filter(t => t.id !== action.id);
    default: throw Error('Unknown: ' + action.type);
  }
}

const [todos, dispatch] = useReducer(reducer, []);
dispatch({ type: 'added', item });
```

**When to prefer it:** several pieces of state that change together, or update logic you want to test on its own (a reducer is a pure function — no React needed to test it).

**Analogy:** `useState` is **writing on a sticky note**. `useReducer` is **filing a request form** — you describe *what happened* ("item added"), and one central place decides how the records change. Better when many different things can update the same records.

---

## 4. `useEffect` — synchronising with the outside world

The most misused hook in React. Start with what it's *for*:

> **Effects connect your component to something outside React** — a server, a subscription, a timer, a browser API.

If you're not talking to an external system, you probably don't need one. React's docs are blunt about this:

> *"If you're not trying to synchronize with some external system, you probably don't need an Effect."*

### The dependency array

```jsx
useEffect(() => { ... });              // after EVERY render
useEffect(() => { ... }, []);          // once, on mount
useEffect(() => { ... }, [roomId]);    // on mount + whenever roomId changes
```

### Cleanup is not optional

```jsx
useEffect(() => {
  const connection = createConnection(roomId);
  connection.connect();
  return () => connection.disconnect();   // ← runs before next setup, and on unmount
}, [roomId]);
```

**Cleanup mirrors setup.** Subscribe → unsubscribe. Open → close. Start timer → clear timer.

**Analogy:** an effect is **renting a flat**. Setup is moving in; cleanup is handing back the keys. Change city (`roomId` changes) and you must hand back the old keys *before* getting new ones — otherwise you're paying two rents forever. That's a memory leak.

This is exactly what StrictMode's double-run exposes (Module 2 §5.5): setup → cleanup → setup. If you left the old subscription running, you'll see two.

### The stale closure — the classic bug

```jsx
function Timer() {
  const [n, setN] = useState(0);

  useEffect(() => {
    const id = setInterval(() => console.log(n), 1000);   // ❌ captures n = 0
    return () => clearInterval(id);
  }, []);                                                  // ❌ lying deps
}
```

Verified — state was updated to 9, but the interval keeps printing the first render's value forever:

```
   interval sees n = 0
   interval sees n = 0
   (current state is 9, but the interval keeps logging 0)
```

**Why:** the effect closed over `n` from the render where it ran. Empty deps means it never re-runs, so it never sees a newer `n`.

**Analogy:** you wrote today's date on a note and locked it in a drawer. Every time you open the drawer it says the same date — the world moved on, your note didn't.

**Fixes:** use the updater form (`setN(c => c + 1)` doesn't need to read `n`), or list the real dependency and let the effect re-subscribe.

> **Never silence the lint rule.** `react-hooks/exhaustive-deps` complains because the code is genuinely wrong, not because it's fussy.

### When you *don't* need an effect

```jsx
// ❌ derived state via effect — extra render, can go stale
const [fullName, setFullName] = useState('');
useEffect(() => { setFullName(first + ' ' + last); }, [first, last]);

// ✅ just calculate it
const fullName = first + ' ' + last;
```

```jsx
// ❌ event logic in an effect
useEffect(() => { if (submitted) postData(form); }, [submitted]);

// ✅ in the handler where it belongs
function handleSubmit() { postData(form); }
```

📚 [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

### The effect family

| Hook | Runs | Use for |
|---|---|---|
| `useEffect` | After paint | Almost everything — fetching, subscriptions, timers |
| `useLayoutEffect` | After DOM update, **before** paint | Measuring, preventing visual flicker |
| `useInsertionEffect` | Before DOM changes | CSS-in-JS libraries injecting styles |

Module 4 §4 has the verified ordering. Default to `useEffect` — the other two block paint.

---

## 5. `useRef` — a box that doesn't cause renders

Two uses, and they feel unrelated but are the same thing.

**1. Reaching a DOM node:**

```jsx
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus();
```

**2. Remembering a value without re-rendering:**

```jsx
const timerRef = useRef(null);
timerRef.current = setInterval(...);   // changing this renders nothing
```

Verified — three mutations, zero renders:

```
3 ref mutations -> extra renders: 0 | ref value: 3
```

| | `useState` | `useRef` |
|---|---|---|
| Changing it re-renders | Yes | **No** |
| Read during render | Yes | Avoid |
| Survives re-renders | Yes | Yes |

**Analogy:** state is a **whiteboard in the room** — change it and everyone looks up. A ref is a **note in your pocket** — you can update it all day and nobody notices. Use the pocket for things nobody needs to see (a timer id, the previous value); use the whiteboard for anything that should appear on screen.

⚠️ **Don't read or write `ref.current` during render.** It breaks purity (Module 5 §1). Refs are for event handlers and effects.

---

## 6. Performance hooks — and when they're pointless

### `useMemo` / `useCallback`

```jsx
const filtered = useMemo(() => hugeFilter(items, q), [items, q]);  // caches a VALUE
const onClick  = useCallback(() => doThing(id), [id]);             // caches a FUNCTION
```

`useCallback(fn, deps)` is just `useMemo(() => fn, deps)`.

**Here's the part people get wrong.** `useCallback` is usually pointless *on its own* — it only pays off when the receiving child is memoized. Verified over 3 parent re-renders ([`memo.cjs`](./verify/memo.cjs)):

```
plain child                : 3
memo + inline fn prop      : 3   <- memo USELESS here
memo + useCallback fn prop : 0   <- memo works
```

Read the middle row. The child *is* wrapped in `memo`, and it still re-rendered every time — because the inline `() => {}` prop is a **new function object** on every render, so memo's props comparison always fails.

**So `memo` and `useCallback` are a package deal.** One without the other does nothing:

```jsx
const handleClick = () => {};                          // ❌ memo defeated
const handleClick = useCallback(() => {}, []);         // ✅ memo works
```

**Analogy:** `memo` is a **bouncer checking IDs** — "same person as last time? Don't bother going in." `useCallback` makes sure your function **carries the same ID card** each render. Without it the bouncer sees a stranger every time and waves them through, so hiring the bouncer achieved nothing.

**When NOT to bother:** memoizing is not free — you pay a comparison and extra memory on every render. For a cheap component, that costs more than it saves. Remember Module 2 §5.2: **re-render ≠ DOM update.** Measure before you optimize (Module 9).

> **React Compiler (v1.0, 2025)** inserts this memoization automatically. If you adopt it, most manual `useMemo`/`useCallback` becomes unnecessary.

### `useTransition` / `useDeferredValue`

Mark an update as "not urgent" so typing stays responsive:

```jsx
const [isPending, startTransition] = useTransition();

function handleChange(e) {
  setQuery(e.target.value);                        // urgent — show the keystroke
  startTransition(() => setResults(search(e.target.value)));  // can wait
}
```

`useDeferredValue` is the same idea from the other end — you don't control the update, you just lag behind a value:

```jsx
const deferredQuery = useDeferredValue(query);
const results = useMemo(() => search(deferredQuery), [deferredQuery]);
```

**Analogy:** a restaurant kitchen where **drinks come out before the slow-cooked main.** The urgent thing (your keystroke) is served immediately; the expensive thing (filtering 10,000 rows) arrives when ready — instead of making you wait at an empty table for both.

This is the lanes system from Module 3 §6, exposed as an API.

---

## 7. The remaining hooks

| Hook | What it's for |
|---|---|
| `useContext` | Read a context value (Module 5 §6) |
| `useId` | Generate stable unique ids for accessibility attributes. **Not for list keys.** |
| `useSyncExternalStore` | Subscribe to a store outside React (Redux, Zustand). Prevents tearing in concurrent rendering. |
| `useImperativeHandle` | Customise what a parent's ref sees. Rare — usually a design smell. |
| `useDebugValue` | Label a custom hook in DevTools. |
| `useEffectEvent` | Read latest values inside an effect without adding them to deps. |

**`useId` — why it exists:** server and client must generate the *same* id or hydration breaks. A counter or `Math.random()` produces different values on each side.

```jsx
const id = useId();
<label htmlFor={id}>Email</label>
<input id={id} />
```

---

## 8. React 19 hooks

### `useActionState` — form state without the boilerplate

```jsx
const [error, submitAction, isPending] = useActionState(
  async (previousState, formData) => {
    const err = await updateName(formData.get('name'));
    return err;               // becomes the new state
  },
  null
);

<form action={submitAction}>
  <input name="name" />
  <button disabled={isPending}>Save</button>
</form>
```

Replaces the usual trio of `isLoading`, `error`, and a submit handler.

### `useOptimistic` — show the result before it lands

```jsx
function LikeButton({ isLiked, toggleLike }) {
  const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic(isLiked);

  function handleClick() {
    startTransition(async () => {
      setOptimisticIsLiked(!optimisticIsLiked);   // instant UI
      await toggleLike(!optimisticIsLiked);        // real request
    });
  }
  return <button onClick={handleClick}>{optimisticIsLiked ? '❤️' : '🤍'}</button>;
}
```

If the request fails, React **reverts automatically** — no cleanup code, no extra render to undo it.

**Analogy:** like a **text message showing as sent before the network confirms it.** You see it instantly; if it actually failed, it quietly flips to "not delivered."

⚠️ Must be called inside a transition or action, or React warns and the value reverts immediately.

### `use` — the one that isn't a hook

```jsx
const data = use(promise);        // suspends until resolved
const theme = use(ThemeContext);  // reads context
```

**`use` is not a hook**, so the rules don't apply — it can go inside conditions and loops:

```jsx
if (show) {
  const theme = use(ThemeContext);      // ✅ legal
  const theme2 = useContext(ThemeContext);  // ❌ illegal
}
```

Two caveats that will bite:

**Cache your promises.** Created during render, they're new every render, so you re-suspend forever:

```jsx
use(fetch('/albums'))    // ❌ new promise each render
use(fetchData('/albums')) // ✅ from a cache
```

**No try/catch.** `use` throws internally to talk to Suspense. Use an Error Boundary.

---

## 9. Custom hooks

A custom hook is just a function starting with `use` that calls other hooks.

```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  return isOnline;
}
```

**The key thing to understand: custom hooks share *logic*, not *state*.** Two components calling `useOnlineStatus()` each get their **own** state — because each has its own fiber, with its own hook list.

**Analogy:** a custom hook is a **recipe, not a shared pot of soup**. Everyone who follows it cooks their own batch in their own kitchen.

The `use` prefix isn't decoration — it's how the linter knows to check the rules of hooks in that function.

---

## 10. Interview Questions

### Basic

**Q: Why can't hooks be called conditionally?**
Hooks are a linked list on the fiber, matched by position, with no names or keys. Skipping one shifts every later hook onto the wrong slot. React detects the count mismatch and throws `Rendered fewer hooks than expected`.

**Q: `useState` vs `useRef`?**
Changing state re-renders; changing a ref doesn't. Verified: three ref mutations caused zero renders. Use state for anything shown on screen, refs for things like timer ids or DOM nodes.

**Q: What does the dependency array do?**
Controls when the effect re-runs. No array = every render. `[]` = once on mount. `[a, b]` = whenever `a` or `b` change (compared with `Object.is`).

### Intermediate

**Q: What's a stale closure?**
An effect or callback captured a value from an old render and never updated. Verified: an interval with `[]` deps kept logging `0` while state was `9`. Fix by listing the real dependencies or using the updater form.

**Q: Why pass a function to `useState`?**
Because the argument is evaluated on every render even though only the first result is used. Verified: eager version ran 3 times over 3 renders, lazy version ran once.

**Q: Does `useCallback` improve performance on its own?**
Almost never. Verified: a `memo`'d child receiving an inline function re-rendered all 3 times — memo's comparison fails because the function is a new object each render. Only with `useCallback` did it drop to 0. `memo` and `useCallback` are a package deal.

**Q: `useEffect` vs `useLayoutEffect`?**
`useEffect` runs after paint; `useLayoutEffect` runs after the DOM updates but before paint. Use layout effects only to measure and adjust before the user sees anything — they block painting.

**Q: When should you NOT use an effect?**
For derived data (calculate during render), for event logic (put it in the handler), or for resetting state on prop change (use a `key` instead). Effects are for syncing with systems outside React.

### Senior

**Q: Why does the hook list make React's design simpler than a lookup by name?**
No keys to generate, no name collisions, and no map allocation per component — just a linked list walked in order, which is also cheap to clone when a fiber is recycled (Module 3 §4). The cost is the positional-call rule, which the linter enforces for you.

**Q: What problem does `useSyncExternalStore` solve?**
Tearing. With concurrent rendering, React can pause mid-render; an external store could change in that gap, so different components in the same commit would read different values. `useSyncExternalStore` makes React re-read and stay consistent.

**Q: How do `useTransition` and `useDeferredValue` differ?**
`useTransition` wraps the *update* — you control the setState and get `isPending`. `useDeferredValue` wraps a *value* you don't control, typically a prop. Both use the lanes system to render at a lower priority.

**Q: Is `use` a hook?**
No — and that's the point. It's a regular function, so it can be called inside conditions and loops, unlike every hook. It reads promises (suspending) or context. It can't be wrapped in try/catch because it throws internally to communicate with Suspense.

**Q: How would you design a custom hook API?**
Return what callers need, hide the rest. Return an object for 3+ values (naming at the call site), an array for 2 (so they can rename freely, like `useState`). Keep it focused on one concern, and remember consumers get independent state — if they need shared state, that's context or a store.

---

## 11. Common Mistakes

- ❌ Hooks inside `if`/loops — shifts the whole list.
- ❌ Silencing `exhaustive-deps` — hides a real stale-closure bug.
- ❌ `useState(expensiveCalc())` — runs every render. Use `useState(() => ...)`.
- ❌ `setCount(count + 1)` three times expecting +3 — it's +1. Use the updater form.
- ❌ Effects for derived data — extra render and a chance to go stale. Calculate during render.
- ❌ Missing cleanup — subscriptions and timers leak. StrictMode's double-run exists to show you.
- ❌ `useCallback` without `memo` on the child — pure overhead. *(Verified.)*
- ❌ Memoizing everything — comparison cost on every render to skip work that was already cheap.
- ❌ Reading `ref.current` during render — breaks purity.
- ❌ `useId` for list keys — it's for DOM ids and hydration.

---

## 12. Official Documentation References

- [Hooks reference](https://react.dev/reference/react/hooks) · [Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning)
- [`useState`](https://react.dev/reference/react/useState) · [`useReducer`](https://react.dev/reference/react/useReducer) · [`useRef`](https://react.dev/reference/react/useRef)
- [`useEffect`](https://react.dev/reference/react/useEffect) · [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [`useMemo`](https://react.dev/reference/react/useMemo) · [`useCallback`](https://react.dev/reference/react/useCallback) · [`useTransition`](https://react.dev/reference/react/useTransition)
- [`useOptimistic`](https://react.dev/reference/react/useOptimistic) · [`useActionState`](https://react.dev/reference/react/useActionState) · [`use`](https://react.dev/reference/react/use)
- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

## 13. Revision Notes

1. Hooks replaced **wrapper hell** — share logic by extracting a function, not by wrapping components.
2. Rules exist because hooks are a **positional linked list** on the fiber. No names, no keys.
3. `useState(() => x)` runs **once**; `useState(x())` runs every render. *(Verified 1 vs 3.)*
4. Updater form `setC(c => c + 1)` when the new value depends on the old.
5. Effects are for **external systems**. Derived data → calculate in render. Event logic → handlers.
6. **Cleanup mirrors setup.** Missing cleanup = leak; StrictMode's double-run reveals it.
7. **Stale closure**: empty deps captured the first render's value. *(Verified: state 9, interval logs 0.)*
8. Refs change without re-rendering. *(Verified: 3 mutations, 0 renders.)*
9. **`memo` + `useCallback` are a package deal.** *(Verified: memo alone = 3 renders, with useCallback = 0.)*
10. `useTransition` marks an update non-urgent; `useDeferredValue` lags a value you don't own.
11. `useSyncExternalStore` prevents **tearing** with external stores.
12. React 19: `useActionState` (forms), `useOptimistic` (instant UI, auto-revert), `use` (**not a hook** — works in conditions).
13. Custom hooks share **logic, not state** — each caller gets its own.

**Soundbites**
- "Hooks are numbered lockers with no name tags."
- "Cleanup mirrors setup — hand back the keys before renting the next flat."
- "memo is a bouncer; useCallback is the ID card. One without the other is theatre."
- "A custom hook is a recipe, not a shared pot of soup."
- "If you're not syncing with something outside React, you probably don't need an effect."

---

## 14. Practice Exercises

**1 — Break the rules.** Put a `useState` inside an `if`, toggle the condition, and read the error. Fix it with an early return placed *after* the hooks.

**2 — Catch a stale closure.** Build a counter with `setInterval` in an effect with `[]` deps, logging state. Watch it print the initial value forever. Fix it two ways: the updater form, and correct deps. Explain the difference.

**3 — Prove lazy init.** Log inside `useState(expensive())` vs `useState(() => expensive())`, re-render 5 times, count the calls.

**4 — Show memo is theatre.** Give a `memo`'d child an inline arrow prop and count its renders. Add `useCallback` and count again. You should see 3 → 0.

**5 — Delete some effects.** Find an effect that only computes derived state and replace it with a plain calculation. Find one doing event work and move it into the handler.

**6 — Write a custom hook.** Build `useLocalStorage(key, initial)` returning `[value, setValue]` and persisting across reloads. Mount it in two components and confirm they have independent state.

**7 — Feel the priority.** Render a 10,000-item filtered list. Type in the input and notice the lag. Wrap the filter update in `startTransition` and compare.

**8 — Interview rehearsal.** 2 minutes: *"Why do hooks have rules?"* Cover the linked list, positional matching, what breaks, the error, and the one exception (`use`).

---

**Next:** [Module 7 — Rendering Patterns](./Module07-Rendering.md) — CSR, SSR, SSG/ISR, streaming, hydration, Server Components, Islands.
