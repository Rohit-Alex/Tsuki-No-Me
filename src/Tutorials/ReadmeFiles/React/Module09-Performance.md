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
That it's a net loss without measuring. Every `memo` adds a props comparison on every render, and the benefit only lands when props are referentially stable — which inline objects and arrow functions break by default. Measured, memo with changing props did exactly as much work plus the comparisons. Profile first, then memo the few expensive components with stable props.

**Q: How do you decide between `useTransition` and fixing the render cost?**
They solve different problems. `useTransition` doesn't make work faster — it reprioritises it so urgent updates paint first, which fixes *perceived* lag. If the work is genuinely too expensive (filtering 100k rows on every keystroke), fix the algorithm or virtualize; transitions just hide it behind a smoother frame.

**Q: What would you look at first on a slow React app?**
Which kind of slow. First load → bundle analysis and code splitting. Late content → network tab for waterfalls. Laggy interaction → Profiler flamegraph with "why did this render" on. The wrong instinct is to start adding `memo` before knowing which of the three it is.

**Q: Why might the React Compiler make this module obsolete?**
Manual memoization is a static analysis problem — working out which values are stable and which components are expensive. The compiler does it at build time and inserts memoization automatically, without the human error of stale dep arrays or inline objects silently defeating `memo`. It's React's bet that the mental model should stay simple and the optimisation should be a tooling concern.

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
