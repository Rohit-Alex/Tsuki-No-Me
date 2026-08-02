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
Follow the **scheduling principle** (Module 1 §3) — "you describe UI, React decides when to render it" — and every major version since 2017 reads as one long payoff of that single decision, not four unrelated releases.

```
16 (2017)  Fiber: work becomes interruptible units, not a locked recursive call
17 (2020)  Events move to the root: two React versions can now coexist, so teams CAN migrate
18 (2022)  createRoot exposes it: automatic batching, lanes, transitions, streaming SSR
19 (2024)  Built ON TOP of it: Actions, Server Components
19.2 (2025) Same priority system, new scope: <Activity> applies it to whole subtrees
```

React 16 didn't ship anything a user could point to and call "concurrency" — it restructured rendering into fiber units specifically so that *later*, React could pause between them (Module 3 §2). That's a bet paid off five years later, not a feature. React 17 shipped almost nothing user-facing on purpose (§ "the boring release") — but moving event delegation off `document` was the precondition for two React versions coexisting on one page, which is what let large codebases adopt 18 gradually instead of all at once. React 18 is where the bet cashes in: `createRoot` gates automatic batching, transitions, and lanes-based scheduling — the exact mechanism Module 3 §6 describes, now exposed as public API. React 19's Actions and Server Components are built assuming that scheduling substrate already exists. And 19.2's `<Activity>` — keeping a subtree mounted-but-idle, deferring its updates — is the *same* lane-priority mechanism, just applied to an entire subtree instead of a single update.

The interview-worthy point: nothing after 2017 required another foundational rewrite. Every version since has been spending the same architectural investment in a new direction, which is itself evidence the original bet on Fiber was sound.

**Q: A team upgraded to React 18 and saw no improvement. Why?**
The single most likely cause: they bumped the `react`/`react-dom` version in `package.json` but never changed the render call itself, so the app is running React 18's code in React 17's mode.

```js
// still there after "upgrading"
ReactDOM.render(<App />, container);      // ❌ legacy mode — none of 18's features activate

// what unlocks it
import { createRoot } from 'react-dom/client';
createRoot(container).render(<App />);    // ✅ the actual gate (Module 2 §5.4)
```

`createRoot` isn't cosmetic API renaming — it's the literal switch that turns on automatic batching everywhere, transitions, and streaming Suspense improvements. Call the old `ReactDOM.render` on React 18 and every one of those stays off. React doesn't error or block this — it just logs a console warning, which is easy to miss in a large app's build output, so teams genuinely ship this and don't notice.

The second-order trap, worth mentioning as a follow-up: even with `createRoot` in place, "upgraded and saw no difference" can still be correct for a different reason — concurrency is **opt-in per feature**, not automatic just because the root changed. Automatic batching applies everywhere for free, but transitions and Suspense-driven scheduling only activate where the code actually calls `startTransition` or uses `<Suspense>`. A team that switched to `createRoot` but never touched any component code gets the batching improvement silently and correctly sees no visible change anywhere else — which is a legitimately different, more subtle version of the same complaint.

**Q: What problem does `useEffectEvent` solve?**
It fixes a genuine conflict inside the dependency array: some values an effect reads should trigger a re-run when they change (**reactive** — `roomId`), and some values it reads should always be current but should never *cause* a re-run on their own (**non-reactive** — `theme`, used only inside a notification the effect might show). Before this hook, both kinds of value went into the same array, and the array can't distinguish them.

```jsx
useEffect(() => {
  connection.on('connected', () => {
    showNotification('Connected!', theme);   // reads theme, but shouldn't reconnect for it
  });
}, [roomId, theme]);   // ❌ listing theme reconnects on every theme change
```

Two bad options existed before `useEffectEvent`: list `theme` honestly and the connection needlessly tears down and rebuilds every time the user switches themes (Module 6 §4's stale-closure section covers the mechanism — the effect's cleanup and setup both re-run). Or omit `theme` to avoid that, and the closure captures whatever `theme` was on the render that created the effect, which is exactly the stale-closure bug (Module 6 §4, verified with the interval example logging `0` forever while state moved to `9`).

```jsx
const onConnected = useEffectEvent(() => {
  showNotification('Connected!', theme);   // always reads the LATEST theme, no closure staleness
});

useEffect(() => {
  connection.on('connected', onConnected);
}, [roomId]);   // ✅ theme genuinely doesn't belong here
```

`useEffectEvent` creates a function that's guaranteed to always see the latest render's values, but whose identity never changes and never appears in a dependency array — it exists specifically to hold the non-reactive half of an effect's logic, so the dependency array can go back to honestly listing only what should actually cause a re-run.

**Q: Why does `<Activity>` matter architecturally?**
Before it, React only really offered two states for a subtree: mounted (fully alive — effects running, updates processing normally) or unmounted (gone — state and effects destroyed). Real apps kept wanting a third state: "not visible right now, but don't throw it away, and don't let it compete for resources with what the user is actually looking at." Every team hand-rolled this with `display: none` (state survives, but effects and updates still run pointlessly in the background) or full conditional unmounting (resources freed, but state and scroll position lost on return).

```jsx
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <NextPage />        {/* hidden: effects unmount, updates deferred until React is idle */}
</Activity>
```

`<Activity>` gives that third state a real, supported implementation: hidden content's effects unmount (so a hidden tab's subscriptions and timers genuinely stop costing anything), but its component state and fiber tree survive, and any pending updates are deferred to whenever the scheduler is otherwise idle — not dropped, not processed at full priority, just parked.

The architectural point is that this isn't a new mechanism bolted on — it's the lanes and priority system (Module 3 §6) applied at a coarser grain. A single `setState` already gets a lane and a priority; `<Activity>` extends that same idea to an entire subtree, marking all of its pending work as "lowest priority, resume when idle" in one move. Concretely, it's what lets you pre-render a likely next page in the background — starting its data fetches and component tree now — without that work ever competing with the visible page's rendering, and lets a user navigate back to a hidden tab and find their scroll position and form state exactly as they left it.

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
