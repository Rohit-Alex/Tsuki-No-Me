# Module 11 — React 16 → 17 → 18 → 19

> Part of the [React Mastery course](./README.md). Previous: [Module 10 — Patterns](./Module10-Patterns.md). Next: [Module 12 — React Internals](./Module12-Internals.md).

Interviewers ask about versions to test one thing: **do you know *why* things changed, or just *that* they changed?**

Every release below is framed as: what problem existed → what shipped → what it enabled.

All facts sourced from the official release posts (linked in §8). Current stable: **React 19.2** (October 2025).

---

## The arc in one picture

```
16 (2017)   Fiber rewrite            → made everything after it possible
17 (2020)   no new features          → made upgrading possible
18 (2022)   concurrent rendering     → cashed in Fiber's promise
19 (2024)   Actions + Server         → the async/server story
19.2 (2025) Activity, Compiler v1    → prioritisation & automation
```

**Analogy:** React 16 **laid new foundations under a building people were living in**. React 17 **installed the lifts and fire doors** — nobody notices, but you can now renovate floor by floor. React 18 **opened the new floors**. React 19 **furnished them**.

---

## React 16 (Sept 2017) — the rewrite

**The problem:** rendering was recursive, so it couldn't be interrupted (Module 3 §2). A large update blocked the main thread and froze typing.

**What shipped:**

| Feature | Why |
|---|---|
| **Fiber architecture** | Rendering moved off the call stack into a data structure React controls |
| **Error boundaries** | One component crashing used to corrupt the whole tree |
| **Portals** | Render into a different DOM node (Module 5 §7) |
| **Fragments** | Return multiple elements without a wrapper `<div>` |
| **Return strings/arrays** | `render()` no longer had to return one element |
| **Custom DOM attributes** | Unknown attributes pass through instead of being stripped |

React 16 was also **32% smaller** than 15.6 despite all of this.

**The key thing to say:** Fiber shipped with **no new async features**. It was foundation-laying — the whole point was that React 18's concurrency became possible *without another rewrite*.

> **Error boundaries are still class-only** — there's no hook equivalent even in React 19 (Module 5 §8).

---

## React 17 (Oct 2020) — the "boring" release

**The problem:** upgrading React was all-or-nothing. A million-line app couldn't move without one enormous migration.

**What shipped:** deliberately **no new developer-facing features.** This is the release interviewers use to check whether you understand infrastructure work.

### Event delegation moved

```js
// React 16 and earlier
document.addEventListener(...)        // all events attached to document

// React 17
rootNode.addEventListener(...)        // attached to the root container
```

**Why it mattered:** with everything on `document`, two React versions on one page fought over events. Moving to the root container let **multiple React versions coexist** — so you could run React 17 in most of the app and React 18 in one section.

This is also why nesting a React app inside another finally worked properly, and why `e.stopPropagation()` behaves more predictably with non-React code.

### Gradual upgrades

The point of the whole release. Upgrade **piece by piece** instead of all at once.

### The new JSX transform

Covered in Module 2 §3.2 — `react/jsx-runtime`, no more `import React` for JSX. Optional and backwards compatible.

### Event pooling removed

```jsx
function handleChange(e) {
  setTimeout(() => console.log(e.target.value), 100);   // React 16: null! Pooled.
                                                         // React 17: works.
}
```

React used to recycle event objects for performance. Modern browsers made it unnecessary, and it caused constant confusion.

**Analogy:** React 17 is **replacing the plumbing while everyone's still living there**. No new rooms, no better view — but every renovation after it becomes possible.

---

## React 18 (Mar 2022) — concurrency arrives

**The problem:** Fiber made interruptible rendering *possible* in 2017. React 18 finally exposed it.

### `createRoot` — the gate

```js
ReactDOM.render(<App />, container);        // legacy — no concurrent features
createRoot(container).render(<App />);      // ✅ unlocks everything below
```

**This is the most-probed React 18 question.** Call `ReactDOM.render` on React 18 and you get *none* of the features below, with only a console warning. "We upgraded to 18 and saw no difference" is almost always this.

### Automatic batching

```jsx
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 17: TWO renders.  React 18: ONE.
}, 1000);
```

React 17 only batched inside React event handlers. React 18 batches everywhere — timeouts, promises, native handlers. *(Verified in Module 4 §4: three `setState` calls → one render.)*

### Transitions

```jsx
setInputValue(input);                                    // urgent
startTransition(() => setSearchQuery(input));            // can wait
```

Lanes (Module 3 §6) exposed as public API.

### Streaming SSR + Suspense on the server

`renderToPipeableStream` (Node) and `renderToReadableStream` (edge). Covered in Module 7 §5.

### New hooks

| Hook | For |
|---|---|
| `useId` | Stable ids across server and client — no hydration mismatch |
| `useTransition` | Mark updates non-urgent |
| `useDeferredValue` | Lag behind a value you don't control |
| `useSyncExternalStore` | External stores without tearing (Module 8 §5) |
| `useInsertionEffect` | CSS-in-JS libraries injecting styles |

### StrictMode double-effect

Dev-only: mount → unmount → mount, to surface effects missing cleanup (Module 2 §5.5).

**Concurrency is opt-in.** Using `createRoot` alone doesn't make everything concurrent — the new behaviour activates where you use transitions or Suspense.

---

## React 19 (Dec 2024) — Actions and the server

**The problem:** every app hand-rolled the same form logic — pending state, error state, optimistic updates, reset on success.

### Actions

Pass an async function straight to `<form>`:

```jsx
<form action={async (formData) => {
  await updateName(formData.get('name'));
}}>
```

React handles pending state, errors, and resets the form on success.

### New hooks

```jsx
const [error, submitAction, isPending] = useActionState(action, null);   // form state
const [optimisticName, setOptimisticName] = useOptimistic(currentName);  // instant UI, auto-revert
const { pending } = useFormStatus();                                     // parent form status, no drilling
```

### `use` — not a hook

```jsx
const data = use(promise);          // suspends
const theme = use(ThemeContext);    // reads context
```

Callable **inside conditions and loops**, unlike every hook (Module 6 §8).

### `ref` as a regular prop

```jsx
function MyInput({ placeholder, ref }) {   // no forwardRef needed
  return <input placeholder={placeholder} ref={ref} />;
}
```

**`forwardRef` is now deprecated.**

### Context as provider

```jsx
<ThemeContext value="dark">{children}</ThemeContext>   // no .Provider
```

**`<Context.Provider>` is deprecated.**

### Document metadata

```jsx
function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title}</title>              {/* hoisted to <head> automatically */}
      <meta name="description" content={post.excerpt} />
    </article>
  );
}
```

No more react-helmet for most cases.

### Stylesheets, async scripts, preloading

```jsx
<link rel="stylesheet" href="foo" precedence="default" />   // ordering + dedup handled
<script async src="..." />                                   // deduped automatically

import { preload, preinit, preconnect, prefetchDNS } from 'react-dom';
preload('/font.woff', { as: 'font' });
```

### Ref cleanup functions

```jsx
<input ref={(node) => {
  // setup
  return () => { /* cleanup on unmount */ };
}} />
```

### Server Components stable

Plus `"use server"` for Server Actions (Module 7 §7).

### Deprecated in 19

| Deprecated | Use instead |
|---|---|
| `forwardRef` | `ref` as a prop |
| `<Context.Provider>` | `<Context>` |
| `useFormState` | `useActionState` |
| `ReactDOM.render` | **Removed** — `createRoot` |

---

## React 19.1 & 19.2 (2025) — current stable

### `<Activity>` (19.2)

```jsx
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <NextPage />
</Activity>
```

Hidden content **unmounts effects and defers updates until React is idle** — so you can pre-render a likely next page without slowing the visible one, and keep state when navigating back.

### `useEffectEvent` (19.2)

Fixes the dependency problem where a non-reactive value forces an effect to re-run:

```jsx
const onConnected = useEffectEvent(() => {
  showNotification('Connected!', theme);   // reads latest theme
});

useEffect(() => {
  connection.on('connected', onConnected);
}, [roomId]);        // ← theme NOT needed here
```

Previously you either lied about deps or reconnected on every theme change.

### Performance Tracks (19.2)

Chrome DevTools custom tracks — a **Scheduler track** showing work priorities and a **Components track** showing render and effect lifecycles.

### Partial pre-rendering (19.2)

`prerender()` → `resume()`. Pre-render the static shell at build time, resume with dynamic content per request.

### `useId` prefix changed (19.2)

`:r:` / `«r»` → `_r_`, so ids are valid in CSS selectors and XML names.

### React Compiler v1.0 (Oct 2025)

Automatic memoization at build time. Most manual `memo`/`useMemo`/`useCallback` becomes unnecessary (Module 9 §2).

---

## Interview Questions

### Basic

**Q: What was the headline change in React 16?**
The Fiber rewrite — a complete rewrite of the reconciler, plus error boundaries, portals, and fragments. Fiber shipped no new async features itself; it was the foundation for React 18's concurrency.

**Q: What did React 17 add?**
Almost nothing on purpose. It moved event delegation from `document` to the root container, enabling multiple React versions on one page and gradual upgrades.

**Q: What's the difference between `ReactDOM.render` and `createRoot`?**
`createRoot` (18+) enables concurrent features — automatic batching everywhere, transitions, streaming Suspense. `ReactDOM.render` runs legacy mode with none of them, and was removed in React 19.

### Intermediate

**Q: Why did React 17 ship with no features?**
Upgrading was all-or-nothing, which blocked large codebases. Moving event delegation to the root container let two React versions coexist, so teams could migrate section by section. It made every later upgrade cheaper.

**Q: What is automatic batching and what changed?**
Multiple state updates in one tick produce one render. React 17 only did this inside React event handlers; React 18 does it everywhere — timeouts, promises, native handlers.

**Q: What did React 19 change about refs?**
`ref` became a regular prop for function components, so `forwardRef` is deprecated. Ref callbacks can also return a cleanup function.

**Q: Why is `use` not a hook?**
Because it can be called conditionally and in loops. It reads promises (suspending) or context, and it can't be wrapped in try/catch since it throws internally to talk to Suspense.

### Senior

**Q: Trace one design decision from React 16 to today.**
The scheduling principle. Because components return descriptions instead of mutating the DOM, React controls when they run. React 16 restructured work into interruptible fiber units to exploit that. React 17 made upgrading possible so the ecosystem could actually get there. React 18 exposed it as concurrent rendering, lanes, transitions, and streaming SSR. React 19 built Actions and Server Components on top, and 19.2's `<Activity>` uses the same priority system to pre-render hidden content while idle.

**Q: A team upgraded to React 18 and saw no improvement. Why?**
They're almost certainly still calling `ReactDOM.render`, which runs legacy mode — no automatic batching outside event handlers, no transitions, no streaming Suspense. It only warns in the console. The fix is `createRoot`.

**Q: What problem does `useEffectEvent` solve?**
Effects re-running because of values they read but shouldn't react to. If an effect shows a notification using `theme`, listing `theme` as a dependency reconnects on every theme change; omitting it means a stale closure. `useEffectEvent` wraps the non-reactive part so it always reads the latest value without being a dependency.

**Q: Why does `<Activity>` matter architecturally?**
It gives React a supported way to keep a subtree mounted-but-inactive — effects unmounted, updates deferred until idle. Pre-render a likely next route without competing with visible work, and preserve state on back-navigation. It's the priority system from Module 3 applied to whole subtrees rather than individual updates.

---

## Common Mistakes

- ❌ "React 16 introduced concurrent rendering." It introduced *Fiber*, which made it possible five years later.
- ❌ "React 17 was pointless." It made gradual upgrades possible — the reason large codebases could move at all.
- ❌ Using `ReactDOM.render` on React 18 and expecting concurrent features.
- ❌ Thinking `createRoot` alone makes everything concurrent — you must use transitions or Suspense.
- ❌ Writing `forwardRef` in new React 19 code.
- ❌ Reaching for react-helmet in React 19 — `<title>` and `<meta>` hoist natively now.
- ❌ Saying React 19's `use` is a hook.

---

## Official References

- [React v16.0](https://legacy.reactjs.org/blog/2017/09/26/react-v16.0.html) · [React v17.0](https://legacy.reactjs.org/blog/2020/10/20/react-v17.html)
- [React v18.0](https://react.dev/blog/2022/03/29/react-v18) · [React v19](https://react.dev/blog/2024/12/05/react-19) · [React 19.2](https://react.dev/blog/2025/10/01/react-19-2)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) · [Versions](https://react.dev/versions) · [React Compiler v1.0](https://react.dev/blog/2025/10/07/react-compiler-1)

---

## Revision Notes

1. **16** — Fiber rewrite (foundation, no async features yet), error boundaries, portals, fragments.
2. **17** — deliberately no features. Event delegation `document` → root container, enabling **multiple versions and gradual upgrades**. Event pooling removed.
3. **18** — `createRoot` gates everything: automatic batching everywhere, transitions, streaming SSR, `useId`/`useSyncExternalStore`/`useInsertionEffect`.
4. **19** — Actions, `useActionState`, `useOptimistic`, `useFormStatus`, `use`, **`ref` as a prop**, `<Context>` as provider, document metadata, Server Components stable.
5. **19.2** — `<Activity>`, `useEffectEvent`, Performance Tracks, partial pre-rendering.
6. **Deprecated in 19:** `forwardRef`, `<Context.Provider>`, `useFormState`. **Removed:** `ReactDOM.render`.
7. **Concurrency is opt-in** — `createRoot` unlocks it; transitions and Suspense activate it.
8. React Compiler v1.0 automates memoization.

**Soundbites**
- "16 laid foundations, 17 made upgrading possible, 18 opened the new floors, 19 furnished them."
- "React 17's whole feature was that it had no features."
- "createRoot is the gate — without it, React 18 is React 17."
- "Fiber made concurrency possible in 2017; React 18 finally shipped it."

---

## Practice Exercises

**1 — Prove the batching change.** In a React 18 app, call two `setState`s inside a `setTimeout` and count renders. Then switch to `ReactDOM.render` and count again.

**2 — Modernise a component.** Take one using `forwardRef` and `<Context.Provider>` and convert it to React 19 style. Note what got shorter.

**3 — Kill react-helmet.** Replace a helmet usage with `<title>` and `<meta>` rendered directly in a component. Confirm they land in `<head>`.

**4 — Fix a dependency lie.** Find an effect with a suppressed lint warning. Rewrite it with `useEffectEvent` so the deps are honest.

**5 — Read a release post.** Pick React 18 or 19 and find one feature not covered here. Work out which older pain it solves.

**6 — Interview rehearsal.** 2 minutes: *"Walk me through React 16 to today."* One sentence per version on the problem it solved — not a feature list.

---

**Next:** [Module 12 — React Internals](./Module12-Internals.md) — scheduler, lanes, synthetic events, commit phases.
