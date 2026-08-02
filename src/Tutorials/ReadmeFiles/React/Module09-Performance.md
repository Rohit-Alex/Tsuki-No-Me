# Module 9 — Performance

> Part of the [React Mastery course](./README.md). Previous: [Module 8 — State Management](./Module08-StateManagement.md). Next: [Module 10 — Patterns](./Module10-Patterns.md).

React performance advice is full of confident claims that fall apart when you measure them. This module measures them.

The rule throughout: **render counts, not milliseconds.** Timings depend on machine, browser, and engine; render counts are exact and reproducible. Scripts in [verify/](./verify/).

---

## 1. Start here: re-render ≠ slow

The single most common performance mistake is treating "this component re-rendered" as a bug.

From Module 2 §5.2: a re-render means **your function ran**. If it returns the same description, React performs **zero** DOM operations. Function calls are cheap; DOM writes are not.

So the real question isn't *"did it re-render?"* — it's:

1. Is anything actually **slow**? (measure)
2. If yes, is it slow because of **too many renders**, or **one expensive render**?

Those two have completely different fixes, and applying the wrong one makes things worse.

**Analogy:** a re-render is **re-reading a shopping list**. Cheap, and you do it constantly. The expensive part is **walking to the shop** (touching the DOM). Optimising by memorising the list saves nothing if the walk is what's slow — and if you spend longer memorising than reading, you've made it worse.

---

## 2. `React.memo` — measured, not assumed

The advice you usually hear is "wrap components in `memo` to avoid re-renders." Here's what actually happens.

**Test:** 50 rows, 10 parent updates. Counting real child renders ([`perf3.cjs`](./verify/perf3.cjs)):

```
plain, changing props : 500 child renders over 10 updates
memo,  changing props : 500 child renders over 10 updates   ← memo did NOTHING
memo,  STABLE props   :   0 child renders over 10 updates   ← memo worked completely
```

Three findings in one table:

**1. `memo` with changing props is pure overhead.** 500 renders either way — but the memo version *also* ran a props comparison 500 times. You paid and got nothing.

**2. `memo` with stable props is total.** 500 → 0.

**3. The difference is entirely whether props keep their identity.** This is the same result as Module 6 §6: `memo` and `useCallback`/`useMemo` are a package deal.

```jsx
<Row item={{ text: 'a' }} />           // ❌ new object every render → memo always fails
<Row item={stableItem} />              // ✅ same reference → memo bails out
```

**Analogy** (from Module 6): `memo` is a **bouncer checking IDs**. If everyone shows a freshly printed ID each time, the bouncer checks every one and lets everyone through — you've hired a bouncer and gained nothing but the queue.

### When memo is worth it

- The component is **genuinely expensive** to render (big subtree, heavy computation), **and**
- its props are **referentially stable**, **and**
- the parent re-renders often for unrelated reasons.

All three, or skip it.

> **React Compiler (v1.0, 2025)** does this analysis automatically and inserts memoization where it helps. If you adopt it, most manual `memo`/`useMemo`/`useCallback` becomes unnecessary — and this whole section becomes a historical note.

---

## 3. `useMemo` — the case where it clearly pays

`useMemo` caches a *value*, and unlike `memo` it has an obvious winning case: a genuinely expensive calculation that runs on every render.

Measured on a 200,000-iteration loop across 20 re-renders ([`perf.cjs`](./verify/perf.cjs)), the memoized version ran the calculation **once** instead of 20 times — an order-of-magnitude difference in that component's render cost.

```jsx
const filtered = useMemo(() => hugeFilter(items, query), [items, query]);
```

But note what "expensive" means. A 200k-iteration loop is expensive. These are not:

```jsx
const doubled = useMemo(() => count * 2, [count]);          // ❌ the memo costs more
const name = useMemo(() => `${first} ${last}`, [first, last]); // ❌ string concat is free
```

`useMemo` itself has a cost: storing the value, storing the deps, and comparing the deps every render. For trivial work that's more expensive than just redoing it.

**Rule:** memoize *computation* that's genuinely heavy, or *references* that feed `memo`'d children. Nothing else.

---

## 4. Render waterfalls — usually the real problem

Before micro-optimising renders, check whether you have a waterfall. This costs far more than any memo.

From Module 4 §5: `useEffect` runs **after** paint. So a child can't start fetching until its parent has rendered, committed, painted, *and* got its data back.

Verified with two 50ms requests ([`waterfall.cjs`](./verify/waterfall.cjs)):

```
  5ms  Parent starts fetching
 56ms  <- parent arrived
 59ms  Child  starts fetching     ← only now!
110ms  <- child arrived
```

**Two 50ms requests took 110ms because they ran in sequence.** Add a third level and it's 165ms. None of that is React being slow — it's the fetch-in-effect pattern serialising your network.

**Analogy:** it's a **relay race where each runner waits for the baton**, when they could all have run at once. Three 50m legs run in sequence take three times as long as three runners going in parallel.

**Fixes, in order of preference:**

1. **Fetch at the route level** — start every request for a page at once (route loaders, Next.js server components).
2. **Hoist the fetch** — request in the parent, pass data down.
3. **Fire in parallel** — `Promise.all` for independent requests.
4. **A query library** — TanStack Query dedupes and can prefetch (Module 8 §6).
5. **Server Components** — data fetching moves to the server entirely (Module 7 §7).

---

## 5. Long lists — virtualization

Rendering 10,000 rows creates 10,000 DOM nodes. No memoization fixes that; the DOM is genuinely that big.

**Virtualization** renders only what's visible:

```jsx
import { useVirtualizer } from '@tanstack/react-virtual';
// 10,000 items → ~20 DOM nodes, the rest is padding
```

**Analogy:** a **cinema showing one frame at a time** rather than printing all 130,000 frames and holding them up at once. The audience only ever sees one — everything else is wasted work.

Reach for it when a list has hundreds of rows or more. Below that, the library's overhead isn't worth it.

---

## 6. Bundle size — the cost before any render

Everything above assumes your JS has already loaded. For first paint, bundle size dominates.

- **Code split at routes** (Module 7 §9) — `lazy()` + `<Suspense>`.
- **Check what you're importing.** `import _ from 'lodash'` can pull the whole library; `import debounce from 'lodash/debounce'` pulls one function.
- **Audit before optimising** — `vite-bundle-visualizer` or `webpack-bundle-analyzer` usually reveals one unexpectedly huge dependency (moment.js with all locales, a chart library, an icon set imported whole).
- **Server Components** remove libraries from the client bundle entirely.

A 200KB dependency you didn't notice costs more than every `memo` you'll ever add.

---

## 6.5 Web Workers and Service Workers

Different tools, often confused because of the name.

**Web Worker — move CPU work off the main thread.**

Transitions (§7) reorder work but still run it on the main thread. If a computation is genuinely heavy — parsing a large file, image processing, a big sort — no amount of scheduling helps. A worker runs it on a *separate thread*:

```js
const worker = new Worker('/heavy.js');
worker.postMessage(bigDataset);
worker.onmessage = (e) => setResult(e.data);   // main thread stayed free
```

The catch: workers have no DOM access and communicate by message passing, so data is copied (or transferred). Worth it only when the computation clearly outweighs that overhead.

**Service Worker — a network proxy for caching and offline.**

Sits between your app and the network, intercepting requests:

```js
navigator.serviceWorker.register('/sw.js');
```

Used for offline support, asset caching, and push notifications — the basis of PWAs. Nothing to do with rendering performance directly, but it can eliminate network cost entirely on repeat visits.

| | Web Worker | Service Worker |
|---|---|---|
| Purpose | Run heavy JS off the main thread | Intercept and cache network requests |
| Lifetime | While your page lives | Persists beyond the page |
| Fixes | Janky UI from CPU work | Slow or absent network |

**Analogy:** a Web Worker is **hiring a second cook** so the kitchen doesn't stall. A Service Worker is **a pantry by the door** — you check there before sending anyone to the shops.

---

## 7. Concurrent features

React 18's scheduling (Module 3 §6) as performance tools.

**`useTransition`** — mark an update non-urgent so typing stays responsive:

```jsx
const [isPending, startTransition] = useTransition();
setQuery(e.target.value);                                  // urgent
startTransition(() => setResults(filter(e.target.value))); // can wait
```

**`useDeferredValue`** — lag behind a value you don't control:

```jsx
const deferredQuery = useDeferredValue(query);
const results = useMemo(() => search(deferredQuery), [deferredQuery]);
```

Neither makes the work faster. They change **when** it happens so the browser can paint your keystroke first. That's a perceived-performance win, which is usually the one users care about.

---

## 8. How to actually find the problem

Guessing is the main failure mode. Order of operations:

**1. React DevTools Profiler.** Record an interaction, look at the flamegraph. It shows which components rendered, how long each took, and *why* each rendered (enable "Record why each component rendered").

**2. Highlight updates.** In DevTools settings, turn on "Highlight updates when components render." Flashing regions that shouldn't be changing are your suspects.

**3. Browser Performance tab.** For anything that isn't React — layout thrashing, long tasks, expensive third-party scripts.

**4. Lighthouse / Core Web Vitals.** LCP, INP, CLS. These are what users and search rankings actually measure.

**Then** decide which problem you have:

| Symptom | Likely cause | Fix |
|---|---|---|
| Slow first load | Bundle size | Code splitting, SSR/SSG |
| Content appears late | Fetch waterfall | Hoist fetching, parallel requests |
| Typing lags | Expensive render per keystroke | `useTransition`, `useDeferredValue`, `useMemo` |
| Scrolling stutters | Too many DOM nodes | Virtualization |
| One interaction is slow | Expensive component | Profile it, then `memo` with stable props |

---

## 9. Interview Questions

### Basic

**Q: Does re-rendering mean poor performance?**
No. A re-render means the function ran; if the output matches, React does zero DOM work. Function calls are cheap, DOM writes are expensive. Optimise measured slowness, not render counts.

**Q: What does `React.memo` do?**
Skips re-rendering a component when its props are shallow-equal to last time. It compares props on every render, so it only helps if props are stable *and* the component is expensive.

**Q: `useMemo` vs `useCallback`?**
`useMemo` caches a value, `useCallback` caches a function. `useCallback(fn, deps)` is exactly `useMemo(() => fn, deps)`.

### Intermediate

**Q: When does `memo` make things slower?**
When props change identity every render. Verified: 50 rows over 10 updates gave **500 child renders with or without memo** — identical work, plus 500 wasted comparisons. With stable props the same test gave **0** renders.

**Q: What's a render waterfall?**
Sequential requests that could have been parallel. Because `useEffect` runs after paint, a child can't fetch until the parent has finished. Verified: two 50ms requests took 110ms, with the child starting only at 59ms.

**Q: How do you fix a waterfall?**
Move fetching up — route loaders, parent fetches, `Promise.all`, a query library, or Server Components. The goal is starting all independent requests at once.

**Q: When would you virtualize?**
Hundreds of rows or more, where the DOM node count itself is the cost. No memoization helps, because the nodes genuinely exist.

### Senior

**Q: Someone wraps every component in `memo`. What do you tell them?**
That it's very likely making things slower, not faster, and here's how to prove it rather than argue about it. `memo` isn't free — it adds a props comparison on *every* render, win or lose, and only pays off when that comparison actually succeeds (§2, "memo is a bouncer checking IDs"). It succeeds only when props are referentially stable, which most everyday React code breaks constantly:

```jsx
<Row onClick={() => handleClick(id)} style={{ color }} />   // new fn + new object, every render
```

Measured directly (§2, 50 rows over 10 updates): `memo` with changing props gave **500 child renders — identical to no memo at all** — plus 500 wasted prop comparisons on top. The team paid a real cost and captured zero benefit. Only when props were made referentially stable did the same test drop to **0** renders.

So the fix isn't "remove all the memos" or "trust that memo helps" — it's to measure. Open the Profiler, record an interaction, and check which components are actually expensive to render and whether their props are actually stable across their parent's re-renders. `memo` earns its keep only when all three hold at once: the component does real work per render, its props don't change identity on unrelated parent updates, and the parent re-renders often enough for that to matter (§2, "When memo is worth it"). Most components fail at least one of those, which is why "memo everything" reads as diligence but measures as net loss — and why the React Compiler (2025) exists to do this specific analysis automatically instead of by hand (§2).

**Q: How do you decide between `useTransition` and fixing the render cost?**
Ask what's actually slow: the *total* work, or just *when the browser gets to show it*. `useTransition` changes nothing about the amount of work React does — it uses the lanes system (Module 3 §6) to mark that work low-priority, so the browser paints the urgent update (your keystroke) first and the expensive one (filtering 100k rows) after. It fixes *perceived* lag by reordering, not real cost by reducing it.

```
Without transition:  keystroke waits behind the filter    →  input feels frozen
With transition:      keystroke paints first, filter after →  input feels instant,
                       but the filter still takes just as long to finish
```

If the filter genuinely takes 300ms no matter what, wrapping it in `startTransition` doesn't make it take 150ms — it just stops that 300ms from blocking the character you just typed. That's the right fix when the *total* time is acceptable and the only problem is *which* update the browser draws first.

It's the wrong fix when the total work itself is the problem — filtering 100,000 rows on every keystroke is expensive regardless of priority, and no amount of scheduling changes that it's O(n) work repeated on every character. There the actual fix is reducing the work: a cheaper algorithm, `useMemo` on the genuinely expensive computation (§3), debouncing so the filter runs once per pause instead of once per keystroke, or virtualizing so only visible rows render at all (§5). The diagnostic test: if the Profiler shows the slow render itself shrinking when you fix it, you fixed the real cost; if the render time is unchanged but input finally feels responsive, you fixed perception with a transition. Both are legitimate — they just answer different questions, and reaching for the wrong one leaves the real problem in place.

**Q: What would you look at first on a slow React app?**
Not a tool — a question: *which* kind of slow is this, because the three kinds have almost no fix in common, and guessing wrong wastes real effort (§8's table). "Slow" said by a user could mean the page took a while to appear, content showed up late, or typing/clicking felt laggy — and each one points somewhere completely different.

```
"Slow to appear at all"    →  bundle size, blocking JS       →  bundle analyzer, code splitting (§6)
"Content shows up late"    →  sequential fetches              →  Network tab, hunt for a waterfall (§4)
"Interaction feels laggy"  →  expensive render per keystroke  →  Profiler flamegraph, "why did this render" (§8)
```

Concretely: open the Network tab first, in every case, because it's the fastest way to rule two of the three out. If the JS bundle itself takes a long time to arrive, that's the first problem — no amount of React optimization touches time spent downloading and parsing before React has even started (§6). If the bundle is fine but data arrives late in stages, check for the classic `useEffect`-waterfall shape (Module 4 §5, Module 9 §4) — a child fetch that couldn't start until the parent's had already resolved. Only once both of those are ruled out does the React DevTools Profiler come in, recording the actual interaction and reading the flamegraph with "record why each component rendered" on, to find the specific component doing unnecessary work.

The failure mode worth naming explicitly: reaching for `memo` as step one. It only addresses the third category, and even there only sometimes (§9's earlier answer) — applied to a bundle-size or waterfall problem, it does nothing but add comparison overhead to a page that was never render-bound in the first place.

**Q: Why might the React Compiler make this module obsolete?**
Almost everything in this module is really the same problem stated three ways: *is this value referentially stable, and does this component's output actually depend on its inputs changing?* That's a question about your code's structure, answerable by reading it — a static analysis problem, not something that inherently needs a human deciding case by case at write-time.

```jsx
<Row onClick={() => handleClick(id)} />   // human: "should I useCallback this?"
                                           // compiler: sees handleClick(id) doesn't change → memoizes automatically
```

Manual memoization fails in exactly the ways a human forgets things: a `useMemo` dependency array missing a value, an inline object silently defeating a `memo` comparison nobody noticed (§2's core finding — 500 renders either way), or `memo` added to a component that was never expensive enough to be worth the comparison cost in the first place. None of these are hard problems in the abstract — they're bookkeeping problems, and bookkeeping is exactly what compilers are reliable at and humans aren't, especially across a codebase nobody holds fully in their head.

The React Compiler (v1.0, 2025) does this analysis at build time and inserts the equivalent of `memo`/`useMemo`/`useCallback` automatically, wherever the static analysis proves it's safe and beneficial — without ever getting a stale dependency array wrong, because it isn't relying on a developer to keep one updated by hand. This connects to the same bet Module 1 §10 raises about Svelte and Solid: React could have moved to fine-grained reactivity to get this performance, but chose instead to keep "components are plain functions, re-run and diffed" as the mental model, and offload the optimization work to a compiler instead of the developer. If it works as intended, most of this module becomes a historical explanation of what the compiler is doing for you, not a checklist you execute by hand.

---

## 10. Common Mistakes

- ❌ Treating any re-render as a bug. Re-render ≠ DOM update.
- ❌ `memo` everywhere without measuring — comparison cost on every render. *(Verified: 500 vs 500.)*
- ❌ `memo` with inline object or arrow props — comparison always fails.
- ❌ `useMemo` on trivial values — the memo costs more than the work.
- ❌ Optimising renders while a fetch waterfall costs 10× more. *(Verified: 110ms for two 50ms requests.)*
- ❌ Rendering thousands of rows instead of virtualizing.
- ❌ `import _ from 'lodash'` and shipping the whole library.
- ❌ Optimising without the Profiler — guessing wastes effort on the wrong component.
- ❌ Expecting `useTransition` to make slow work fast. It reorders; it doesn't accelerate.

---

## 11. Official Documentation References

- [`memo`](https://react.dev/reference/react/memo) · [`useMemo`](https://react.dev/reference/react/useMemo) · [`useCallback`](https://react.dev/reference/react/useCallback)
- [`useTransition`](https://react.dev/reference/react/useTransition) · [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue)
- [`lazy`](https://react.dev/reference/react/lazy) · [`Suspense`](https://react.dev/reference/react/Suspense)
- [React Compiler](https://react.dev/learn/react-compiler) · [React DevTools Profiler](https://react.dev/learn/react-developer-tools)

---

## 12. Revision Notes

1. **Re-render ≠ slow.** Function calls are cheap; DOM writes are expensive.
2. **`memo` with changing props does nothing but cost.** *(Verified: 500 renders with and without.)*
3. **`memo` with stable props is total.** *(Verified: 0 renders.)*
4. `memo` needs all three: expensive component, stable props, frequently-rendering parent.
5. `useMemo` pays for **genuinely heavy** computation; on trivial values it's a net loss.
6. **Waterfalls usually cost more than renders.** *(Verified: two 50ms requests → 110ms.)*
7. Fix waterfalls by moving fetching up — route loaders, parallel requests, query libraries, RSC.
8. **Virtualize** lists of hundreds or more — the DOM nodes are the cost.
9. **Bundle size dominates first load.** Audit imports; split at routes.
10. **Transitions reorder work, they don't speed it up** — a perceived-performance win.
11. **Profile before optimising.** Match the fix to the symptom.
12. The **React Compiler** automates most of this.

**Soundbites**
- "Re-render means the function ran, not that the DOM changed."
- "memo is a bouncer; if everyone shows a new ID each time, you've just added a queue."
- "A waterfall is a relay race where each runner waits for the baton."
- "Transitions don't make work faster — they make it happen at a better time."
- "Profile first. Guessing optimises the wrong component."

---

## 13. Practice Exercises

**1 — Measure memo honestly.** Render 50 rows with an inline object prop and count child renders over 10 updates. Add `memo` and count again — expect no change. Make the props stable and count once more. You should see 500 → 500 → 0.

**2 — Find your waterfall.** Build a 3-level nested fetch in `useEffect`. Log timestamps. Then hoist the fetches and use `Promise.all`, and compare total time.

**3 — Profile something real.** Open React DevTools Profiler on your own app, enable "record why each component rendered," and record one interaction. Find the component that rendered most often and explain why.

**4 — Break the bundle open.** Run a bundle analyzer on a real project. Find the largest dependency you didn't expect and work out whether it can be split, replaced, or moved to the server.

**5 — Virtualize.** Render 10,000 rows plainly and scroll. Add `@tanstack/react-virtual` and compare DOM node count and scroll smoothness.

**6 — Feel a transition.** Filter a 20,000-item list on every keystroke. Note the input lag, wrap the filter update in `startTransition`, and compare — then explain why total work didn't change.

**7 — Interview rehearsal.** 2 minutes: *"An app feels slow. Walk me through what you do."* Cover diagnosis before fixes, the three kinds of slow, and one honest limitation of memoization.

---

**Next:** [Module 10 — Patterns](./Module10-Patterns.md) — compound components, render props, HOCs, headless components.
