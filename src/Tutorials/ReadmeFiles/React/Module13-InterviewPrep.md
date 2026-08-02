# Module 13 — Interview Preparation

> Part of the [React Mastery course](./README.md). Previous: [Module 12 — React Internals](./Module12-Internals.md). Next: [Module 14 — Build Tooling](./Module14-BuildTooling.md).

Modules 1–12 contain **147 interview questions** in context. This module doesn't repeat them — it's the practical layer: **output puzzles, debugging, machine coding, and system design.**

All puzzle answers below were verified by running them ([`puzzles.cjs`](./verify/puzzles.cjs)).

---

## 1. How to use the question bank

The questions live where the concepts are explained, which is deliberate — an answer you can't tie back to a mechanism won't survive a follow-up.

| Topic | Module | Qs |
|---|---|---|
| Why React exists, declarative model | [1](./Module01-WhyReactExists.md) · [1a](./Module01a-DesignPrinciples.md) | 13 |
| JSX, elements, reconciliation, keys, StrictMode | [2](./Module02-ReactFundamentals.md) | 17 |
| Fiber, double buffering, lanes | [3](./Module03-FiberArchitecture.md) | 12 |
| Virtual DOM, diffing algorithm, setState trace | [4](./Module04-VirtualDOM-Diffing.md) | 13 |
| Props, state, context, portals, classes | [5](./Module05-ComponentModel.md) | 11 |
| Hooks — rules, stale closures, memo | [6](./Module06-Hooks.md) | 13 |
| CSR/SSR/SSG/streaming/RSC/Islands | [7](./Module07-Rendering.md) | 12 |
| State management, stores, server state | [8](./Module08-StateManagement.md) | 11 |
| Performance, measured | [9](./Module09-Performance.md) | 11 |
| Patterns — hooks, compound, HOCs, headless | [10](./Module10-Patterns.md) | 11 |
| Version history 16 → 19.2 | [11](./Module11-VersionHistory.md) | 11 |
| Scheduler, synthetic events, commit | [12](./Module12-Internals.md) | 12 |

**Revision method that works:** read a module's **Revision Notes** section only. If a line doesn't immediately unpack into a full answer, reread that section. Don't reread whole modules.

---

## 2. Output puzzles — all verified

These are the classic "what does this print?" rounds.

### Puzzle 1 — batching

```jsx
const [c, setC] = useState(0);

function handleClick() {
  setC(c + 1);
  setC(c + 1);
  setC(c + 1);
}
```

**Answer: `1`, not `3`.** All three read the same snapshot of `c`. With the updater form:

```jsx
setC(v => v + 1);   // ×3
```

**Answer: `3`.** Each function receives the previous result. *(Verified: `1` and `3`.)*

### Puzzle 2 — effect ordering

```jsx
useEffect(() => {
  log('effect ' + n);
  return () => log('cleanup ' + n);
}, [n]);
```

Mount, then update `n` to 1. **Verified output:**

```
render 0  →  effect 0  →  render 1  →  cleanup 0  →  effect 1
```

The trap: **cleanup runs *after* the next render, not before it.** React renders first, then during commit cleans up the old effect and runs the new one.

### Puzzle 3 — refs vs state

```jsx
const [s, setS] = useState(0);
const ref = useRef(0);

function go() {
  ref.current += 1;
  setS(x => x);        // same value → bailout
}
```

After three calls: **`{ state: 0, ref: 3 }`** *(verified)*. Refs mutate silently; the state bailout means no re-render at all.

### Puzzle 4 — stale closure in a handler

```jsx
function handleClick() {
  setTimeout(() => console.log(n), 0);
}
// click, then setN(5)
```

**Logs `0`, not `5`** *(verified)*. The handler captured `n` from the render it was created in. Fix with a ref, or read state in the setter.

### Puzzle 5 — key changes

```jsx
{isEditing ? <input value={v} /> : <p>{v}</p>}
```

Switching remounts and loses focus — different type at the same position (Module 2 §6.2).

### Puzzle 6 — the falsy render

```jsx
{items.length && <List items={items} />}
```

Renders a literal **`0`** when the array is empty. `0` is a valid React child; `false` isn't (Module 2 §3.3).

---

## 3. Debugging exercises

Each is a real bug with a specific cause. Try to diagnose before reading the answer.

**① "My component doesn't re-render when I update the array."**
<details><summary>Answer</summary>

Mutation. `items.push(x); setItems(items)` passes the same reference, so `Object.is` bails out. Use `setItems([...items, x])`. (Module 4 §4)
</details>

**② "State resets every time the parent re-renders."**
<details><summary>Answer</summary>

A component defined inside another component's body. Each parent render creates a new function identity → new `type` → remount. Hoist it to module scope. (Module 2 §6.3)
</details>

**③ "My interval logs the same old value forever."**
<details><summary>Answer</summary>

Stale closure — `useEffect(..., [])` captured the first render's value. Use the updater form or list the real dependency. (Module 6 §4)
</details>

**④ "Typing in one row updates a different row."**
<details><summary>Answer</summary>

Index keys on a reorderable list. Values stay pinned to positions rather than items. Use stable ids. (Module 2 §6.4)
</details>

**⑤ "We upgraded to React 18 but nothing got faster."**
<details><summary>Answer</summary>

Still calling `ReactDOM.render`, which runs legacy mode — no automatic batching outside handlers, no transitions, no streaming. Switch to `createRoot`. (Module 11)
</details>

**⑥ "Everything re-renders when I change the theme."**
<details><summary>Answer</summary>

One context holding several unrelated values, and/or an inline object as the value. Split contexts by change frequency and `useMemo` the value. (Module 8 §4)
</details>

**⑦ "My modal closes when I click inside it."**
<details><summary>Answer</summary>

Portal events bubble through the **React** tree, not the DOM tree, so an outside-click handler on a React ancestor still fires. (Module 5 §7)
</details>

**⑧ "Hydration warning, and the page flickers."**
<details><summary>Answer</summary>

Server and client rendered different output — `Date.now()`, `Math.random()`, or reading `window` during render. React discards the server HTML for that subtree. Render a server-safe value, then update in an effect. (Module 7 §3)
</details>

**⑨ "I wrapped everything in memo and it got slower."**
<details><summary>Answer</summary>

Props change identity every render, so every comparison fails and you pay the cost for nothing. Verified: 500 renders with and without. (Module 9 §2)
</details>

**⑩ "Rendered fewer hooks than expected."**
<details><summary>Answer</summary>

A hook behind a condition or after an early return. Hooks are positional; skipping one shifts every later hook. (Module 6 §2)
</details>

---

## 4. Machine coding round

Typically 45–90 minutes, building something real. What's actually assessed:

| They watch for | Not |
|---|---|
| Does it work end to end? | Perfect styling |
| Is state in the right place? | Every edge case |
| Are you handling loading/error/empty? | Test coverage |
| Do you name things clearly? | Clever one-liners |
| Do you talk through trade-offs? | Silence |

### Common problems

**Autocomplete / typeahead** — debounced input, async results, keyboard navigation, loading and empty states, race-condition handling (a slow earlier request resolving after a fast later one).

**Todo list with filters** — add/toggle/delete, filter by status, derived counts. *They're checking whether you store the filtered list in state (wrong) or derive it (right).*

**Infinite scroll** — `IntersectionObserver`, pagination, loading state, error retry.

**Star rating / toggle / accordion** — small, so they'll push on controlled vs uncontrolled support.

**Nested comments** — recursive rendering, keys, collapse state.

**Shopping cart** — add/remove, quantity, derived totals, persistence.

### A method that works under time pressure

1. **Clarify for 2 minutes.** "Should this be controlled? Do we need keyboard support? Is the data paginated?" Asking is scored positively.
2. **Sketch state first.** What's the minimum state? What can be derived? (Module 8 §1)
3. **Static markup, then wire it up.** Hardcode data first so something renders early.
4. **Loading, error, empty.** Skipping these is the most common silent failure.
5. **Narrate trade-offs.** *"I'm deriving the count rather than storing it so they can't drift."*
6. **Leave a TODO out loud.** "With more time I'd add virtualization here." Shows awareness without over-building.

**Analogy:** it's a **cooking test, not a banquet.** They're watching your knife skills and whether you salt as you go — not whether you produced a five-course meal.

---

## 5. System design for frontend

Senior and staff rounds. The question is usually vague on purpose — *"design Twitter's feed"*, *"design a file explorer."*

### A framework

**1. Requirements (5 min).** Users? Scale? SEO needed? Mobile? Offline? Real-time?

**2. Rendering strategy** — the first real decision (Module 7):

```
SEO + public content  → SSG / ISR
Per-user + SEO        → SSR, streaming
Logged-in app         → CSR
Heavy server libs     → Server Components
```

**3. Data layer** — server state vs client state (Module 8 §6). Caching, revalidation, optimistic updates. Say *"server state belongs in a query library, not Redux"* and you've answered half the follow-ups.

**4. State architecture** — the ladder: local → lifted → context → store.

**5. Component architecture** — compound components for shared structure, headless for design-system flexibility (Module 10).

**6. Performance** — code splitting at routes, virtualization for long lists, prefetch on hover (Module 9).

**7. The rest** — accessibility, error boundaries, i18n, analytics, feature flags. Naming these unprompted separates senior from mid.

### Worked example: a social feed

```
Rendering    SSR for the first page (SEO + fast first paint),
             CSR for subsequent pagination
Data         TanStack Query — infinite query, dedup, refetch on focus
State        Local for composer drafts; query cache for the feed;
             context only for the current user
Feed list    Virtualized — thousands of items
Images       Lazy-load below the fold, explicit dimensions to avoid CLS
Interactions Optimistic likes via useOptimistic, revert on failure
Realtime     WebSocket → update the query cache, not separate state
Splitting    Route-level; prefetch profile chunk on avatar hover
Failure      Error boundary per feed section so one bad post
             doesn't blank the page
```

**The senior move is naming trade-offs, not features.** *"SSR for the first page costs server time but wins LCP and SEO — for an authenticated-only feed I'd skip it."*

---

## 6. Follow-up questions interviewers actually ask

Whatever you answer, expect one of these:

- *"Why?"* — the most common, and the one that separates memorised from understood.
- *"What's the trade-off?"* — every answer should have one ready.
- *"When would you not do that?"* — tests judgment over dogma.
- *"How would you measure it?"* — especially after any performance claim.
- *"What breaks at 10× scale?"*
- *"How would you test this?"*

**Have a limitation ready for every recommendation.** "Use `memo`" is a weak answer; "use `memo` when the component is expensive *and* props are stable, otherwise it's overhead" is a strong one.

---

## 7. Red flags to avoid

Things that cost credibility, all corrected in this course:

- ❌ "The Virtual DOM is faster than the DOM" — malformed comparison (Module 4 §3).
- ❌ "React is faster than vanilla JS" — it isn't (Module 1 §8).
- ❌ "The VDOM is a copy of the real DOM" — it's a description (Module 4 §1).
- ❌ "Re-render means the DOM updated" — it doesn't (Module 2 §5.2).
- ❌ "Fiber is the Virtual DOM" — different layers (Module 3).
- ❌ "`use` is a hook" — it isn't (Module 6 §8).
- ❌ "RSC is just SSR" — RSC ships no JS (Module 7 §7).
- ❌ "Keys are for performance" — they're for identity (Module 2 §6.4).
- ❌ Reciting features without motives.

---

## 8. Two-week revision plan

**Week 1 — understanding**

| Day | Do |
|---|---|
| 1 | Modules 1, 1a, 2 — read Revision Notes, answer Qs aloud |
| 2 | Modules 3, 4 — draw the fiber tree and buffer swap from memory |
| 3 | Modules 5, 6 — write `useDisclosure` and `useLocalStorage` from scratch |
| 4 | Module 7 — explain each rendering pattern in one sentence |
| 5 | Modules 8, 9 — run `store.cjs` and `perf3.cjs`, explain the numbers |
| 6 | Modules 10, 11, 12 |
| 7 | All 147 questions, flagging any you stumble on |

**Week 2 — application**

| Day | Do |
|---|---|
| 8–9 | Machine coding: autocomplete, then infinite scroll. Timed. |
| 10 | All puzzles in §2 without running them |
| 11 | All debugging exercises in §3 |
| 12 | Two system design questions aloud, 20 min each |
| 13 | Re-answer flagged questions from day 7 |
| 14 | Mock interview — 45 min, out loud, no notes |

**Answer out loud.** Reading an answer and *saying* it are different skills, and only one of them is tested.

---

## 9. The 20 highest-value answers

If time is short, these come up most:

1. Why React exists — synchronisation → derivation (M1)
2. Re-render ≠ DOM update (M2 §5.2)
3. What reconciliation compares — elements vs fibers (M4 §1)
4. Why keys matter — identity, with the index-key bug (M2 §6.4)
5. Fiber and why it exists (M3 §2)
6. `current` / `workInProgress` / `alternate` (M3 §4)
7. Why hooks can't be conditional (M6 §2)
8. What `setState` actually does (M4 §4)
9. Batching, and what React 18 changed (M11)
10. Stale closures (M6 §4)
11. `useEffect` vs `useLayoutEffect` (M4 §4)
12. When you don't need an effect (M6 §4)
13. Context's performance limits (M8 §4)
14. Server state vs client state (M8 §6)
15. `memo` measured — 500 vs 500 vs 0 (M9 §2)
16. Render waterfalls (M9 §4)
17. CSR vs SSR vs SSG, and why hydration exists (M7)
18. RSC ≠ SSR (M7 §7)
19. `createRoot` as the concurrency gate (M11)
20. Why the render phase must be pure (M2 §11)

---

## 10. Practice Exercises

**1 — Puzzle drill.** Cover the answers in §2 and predict each output. Then run [`puzzles.cjs`](./verify/puzzles.cjs) and check.

**2 — Debug drill.** Read each symptom in §3 without opening the answer. Aim for 8/10.

**3 — Timed build.** 60 minutes, no help: an autocomplete with debounce, keyboard nav, loading/error/empty states, and race-condition handling.

**4 — Design aloud.** 20 minutes: *"Design the frontend for a collaborative document editor."* Record yourself and listen for whether you named trade-offs.

**5 — Follow-up gauntlet.** Pick any 5 questions from the modules. For each, answer *"Why?"* then *"When would you not do that?"*

**6 — Teach it.** Explain Fiber's double buffering to someone who doesn't know React. If you can't, reread Module 3 §4.

---

**Next:** [Module 14 — Build Tooling](./Module14-BuildTooling.md) — webpack, Vite, Babel, tree-shaking, code splitting, source maps.
