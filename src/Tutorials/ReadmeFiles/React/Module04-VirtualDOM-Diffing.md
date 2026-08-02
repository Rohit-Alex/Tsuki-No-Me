# Module 4 — Virtual DOM, Diffing & Reconciliation

> Part of the [React Mastery course](./README.md). Previous: [Module 3 — Fiber Architecture](./Module03-FiberArchitecture.md). Next: [Module 5 — Component Model](./Module05-ComponentModel.md).

> **Prerequisite:** [Module 3](./Module03-FiberArchitecture.md). This module uses `workInProgress`, `alternate`, lanes, and effect flags throughout — all introduced there.

Modules 2 and 3 covered elements and fibers. This module puts them together: how React compares one against the other, and answers the questions interviewers actually phrase around "the Virtual DOM," which don't map cleanly onto those mechanics:

- What **is** the VDOM, concretely?
- VDOM vs Real DOM — and **is it actually faster?**
- What happens, step by step, **when you call `setState`**?
- What happens **when a React app loads**, from `<script>` to first paint?

Traces below come from **running React 18.3.1 in Node** — scripts in [verify/](./verify/). Performance claims are stated as direction, not multipliers; §3 explains why.

---

## 1. What the Virtual DOM actually is

> **"Virtual DOM" refers to React's in-memory representation of the UI — which begins as a tree of React Elements and is managed internally through the Fiber architecture. The strategy: keep that representation in memory, reconcile it against what's currently mounted, and apply only the differences to the real DOM.**

That phrasing is deliberately careful, because people use the term slightly differently. Some mean the element tree, some mean the whole mechanism. Both are defensible — so define your terms before answering, rather than assuming the interviewer's version matches yours.

Two things that are simply wrong, though:

**❌ "It's a copy of the real DOM."** It isn't. It's a description of what the DOM *should be*, built from your components — it never mirrors what's currently there. There's no snapshot step.

**❌ "There's a VirtualDOM class in React."** There isn't. Grep the source and you'll find `ReactElement`, `FiberNode`, `ReactDOMHostConfig` — no VDOM module. "Virtual DOM" is a *concept name*, not an implementation.

**✅ What actually exists** are two structures (both detailed in Module 2 §4 and Module 3):

| | React Element | Fiber Node |
|---|---|---|
| What | Immutable description, recreated every render | Mutable work unit, persists across renders |
| Holds | `type`, `key`, `props`, `ref` | element data **+ state, effects, lanes, `alternate` pointer** |
| Lifetime | Thrown away after reconciliation | Lives as long as the component is mounted |

### Shadow DOM vs Virtual DOM

Similar names, completely unrelated things — and a favourite interview trip-up.

| | Virtual DOM | Shadow DOM |
|---|---|---|
| What it is | React's in-memory description of the UI | A **browser** feature |
| Who provides it | React (a library concept) | The web platform |
| Purpose | Work out minimal DOM updates | **Encapsulation** — scoped styles and markup |
| Where you meet it | Any React app | Web Components, `<video>` controls |

```js
element.attachShadow({ mode: 'open' });   // Shadow DOM — real browser API
```

The Shadow DOM creates an isolated subtree whose CSS can't leak out and outside CSS can't leak in. That's why `<video>` controls don't inherit your page styles.

**They solve different problems and can be used together** — React can render into a shadow root. If someone asks "what's the difference," the short answer is: *the Virtual DOM is about efficient updates; the Shadow DOM is about style encapsulation.*

### Is Fiber the Virtual DOM?

A very common confusion, and worth getting straight — they're different layers:

```
JSX
 ↓
React Elements     ← WHAT the UI should look like (immutable description)
 ↓
Fiber Reconciler   ← HOW React should render it (work units, state, priority)
 ↓
DOM
```

**React Elements describe what.** **Fiber describes how.** The Virtual DOM is the overall *strategy* of using these in-memory representations to compute minimal DOM updates. Fiber is the architecture that implements it — it replaced the old stack reconciler in React 16 without changing the element model at all.

### What reconciliation actually compares

Careful here, because the sloppy version — *"React diffs the old VDOM against the new VDOM"* — misdescribes the mechanism:

```
new React Elements  ─┐
                     ├──→  reconcile  ──→  workInProgress Fiber tree
current Fiber tree  ─┘
```

React is **not** diffing two element trees, and **not** diffing two fiber trees. It walks the current fibers while comparing them against the newly returned elements, and builds the next fiber tree from that.

You can see this in the reconciler source — `reconcileSingleElement(returnFiber, currentFirstChild, element, lanes)` compares `child.key` (a **fiber**) against `element.key` (an **element**):

```js
function reconcileSingleElement(returnFiber, currentFirstChild, element, lanes) {
  var key = element.key;        // ← from the new ELEMENT
  var child = currentFirstChild; // ← from the current FIBER tree
  while (child !== null) {
    if (child.key === key) { ... }
```

So the accurate sentence is: **React reconciles new element descriptions against the current fiber tree to produce the next fiber tree.** Element-vs-fiber, not tree-vs-tree.

---

## 1.5 The diffing algorithm, in full

This section is self-contained — the rules from Module 2 §6 restated, then the algorithm underneath them.

### Why not the optimal algorithm

Comparing two trees optimally is **O(n³)**. On 1,000 nodes that's a billion operations, for every update. Unusable.

React drops to **O(n)** by refusing to search. It makes two assumptions and never reconsiders:

1. **Different types produce different trees.** A `<div>` that became a `<span>` is not "the same node moved" — destroy and rebuild.
2. **Keys mark identity.** Where the developer says two elements are the same thing, believe them.

Both can be wrong (Module 2 §11 has a case). The escape hatch is `key`.

### The three rules

**Rule 1 — same type, same position → reuse the DOM node.**

```jsx
<div className="a">one</div>   →   <div className="b">two</div>
```
Same node object, attributes patched. Focus, scroll, and selection survive.

**Rule 2 — different type, same position → destroy the subtree.**

```jsx
<div>one</div>   →   <span>one</span>
```
Old node, its children, and all component state inside are discarded.

**Rule 3 — different key, same type → also destroy and rebuild.**

```jsx
<p key="k1">x</p>   →   <p key="k2">x</p>
```
Identical tag and text, still rebuilt. Key beats type — which makes `key` a state-reset switch.

### Single child vs list

React takes different paths depending on what a component returns. For one child, `reconcileSingleElement` walks the existing children looking for a key match:

```js
function reconcileSingleElement(returnFiber, currentFirstChild, element, lanes) {
  var key = element.key;          // ← from the new ELEMENT
  var child = currentFirstChild;   // ← from the current FIBER tree
  while (child !== null) {
    if (child.key === key) { ... }   // key first, then type
```

Note again: **element vs fiber**, never tree vs tree.

### The list algorithm — two passes

Lists are the interesting case. `reconcileChildrenArray` runs up to two passes.

**Pass 1 — walk both in order, stop at the first mismatch.**

```js
for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
  var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);
  if (newFiber === null) break;      // ← keys stopped matching; bail to pass 2
  lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
  oldFiber = nextOldFiber;
}
```

For the common cases — nothing changed, or items appended — this pass handles everything and pass 2 never runs. That's the fast path.

Two shortcuts follow it:

```js
if (newIdx === newChildren.length) {
  deleteRemainingChildren(returnFiber, oldFiber);   // new list ran out → delete the rest
  return resultingFirstChild;
}
if (oldFiber === null) {
  for (; newIdx < newChildren.length; newIdx++) {   // old list ran out → all insertions
    ...createChild(...)
  }
}
```

**Pass 2 — build a key→fiber map and match out of order.**

Only reached when the lists diverge (a reorder, or an insert in the middle):

```js
var existingChildren = mapRemainingChildren(returnFiber, oldFiber);   // Map: key → fiber

for (; newIdx < newChildren.length; newIdx++) {
  var newFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], lanes);
  if (newFiber !== null) {
    existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key);  // claimed
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
  }
}

existingChildren.forEach(child => deleteChild(returnFiber, child));   // unclaimed → deleted
```

The Map gives O(1) lookup per item, so even a full reorder stays O(n). Anything left in the map at the end was in the old list but not the new one — deleted.

**Why keys must be unique among siblings:** they're Map keys. Duplicates overwrite each other and items get lost.

### How a "move" is detected

`placeChild` decides whether a matched fiber moved, using one running high-water mark:

```js
function placeChild(newFiber, lastPlacedIndex, newIndex) {
  newFiber.index = newIndex;
  var current = newFiber.alternate;

  if (current !== null) {
    var oldIndex = current.index;
    if (oldIndex < lastPlacedIndex) {
      newFiber.flags |= Placement;   // ← moved backwards: needs a DOM move
      return lastPlacedIndex;
    } else {
      return oldIndex;               // ← stayed in order: no DOM operation
    }
  } else {
    newFiber.flags |= Placement;     // ← no alternate: brand new, insert it
  }
}
```

`lastPlacedIndex` tracks the furthest-right old position placed so far. An item whose old index is *behind* that mark must have jumped backwards, so it's tagged `Placement`. Items in increasing order need no DOM work at all.

Worked example — `[A, B, C]` → `[C, A, B]`:

| new idx | item | old index | lastPlacedIndex | result |
|---|---|---|---|---|
| 0 | C | 2 | 0 | `2 >= 0` → stays, mark becomes **2** |
| 1 | A | 0 | 2 | `0 < 2` → **moved** |
| 2 | B | 1 | 2 | `1 < 2` → **moved** |

Two moves, not three. React finds the longest run that's already in order and moves only the rest.

### Why this is O(n)

- Pass 1: at most n comparisons.
- Pass 2: one Map build (n) plus one O(1) lookup per item (n).
- No backtracking, no cross-parent search.

The cost is optimality: React only compares children **within the same parent**. Move a subtree to a different parent and it's destroyed and rebuilt, however identical it was. The React team documented this tradeoff in the source:

```
// This algorithm can't optimize by searching from both ends since we
// don't have backpointers on fibers. I'm trying to see how far we can get
// with that model. If it ends up not being worth the tradeoffs, we can
// add it later.
```

> Vue takes the other option — a two-ended diff, comparing head and tail simultaneously, which handles reversals better. React chose the simpler forward-only walk.

---

## 2. VDOM vs Real DOM

### 2.1 Why the DOM is expensive

The DOM isn't slow because it's "a bad API." It's expensive because a DOM node is a large object wired into a rendering engine, and writes can trigger a cascade:

```
JS writes to DOM
      ↓
Style recalculation   (which CSS rules now apply?)
      ↓
Layout / reflow       (where does everything sit?)   ← expensive, often whole-document
      ↓
Paint                 (fill in pixels)
      ↓
Composite             (assemble layers)
```

The real killer is **layout thrashing** — interleaving writes with reads:

```js
for (const el of items) {
  el.style.height = el.offsetHeight + 10 + 'px';   // ❌ write, then read, then write…
}
```

Each `offsetHeight` read forces the browser to flush pending layout *synchronously*, so an N-item loop causes N forced reflows. Hand-written DOM code accumulates these by accident. React avoids them structurally by batching DOM mutations within a commit phase, so reads and writes don't interleave.

### 2.2 Side by side

| | Real DOM | Virtual DOM (React elements) |
|---|---|---|
| Object weight | Heavy — hundreds of properties, engine-bound | Light — `{type, key, props, ref}` |
| Creating one | Allocates in the rendering engine | A plain JS object literal |
| Reading a property | May force synchronous layout | Plain property access |
| Mutating | Can trigger style→layout→paint→composite | Nothing; it's just memory |
| Who updates it | You, imperatively | React, derived from your description |

**The trade in one line:** React does *extra* work in cheap memory to avoid *unnecessary* work in expensive DOM.

---

## 3. Is the Virtual DOM actually faster?

This is where candidates lose credibility by overclaiming.

**Don't memorize a number for this.** Say the *shape* of the result instead:

> In micro-benchmarks where the exact DOM node is already known, hand-written DOM updates are faster — React does extra work (running your component, creating elements, reconciling) before it touches the DOM. Against realistic imperative code that rebuilds markup rather than surgically patching it, React usually wins.

That holds regardless of environment, which a specific multiplier does not.

If you want to see it yourself, [`bench.cjs`](./verify/bench.cjs) updates one row out of 1000 three ways — React, an optimal targeted write, and an `innerHTML` rebuild. The ordering it produces (optimal < React < naive rebuild) is the point; the ratios are not.

> ⚠️ **Why the ratios are not quotable.** That script runs on **jsdom in Node**, which has no layout, style, or paint. Real browsers differ from it and from each other. In a browser the `innerHTML` rebuild also forces a full reflow and repaint of 1000 nodes, so React's advantage there is *larger* than jsdom suggests — while the gap versus an optimal write depends entirely on the engine. Quote the direction, never the multiplier.

### The correct interview answer

> "Is the Virtual DOM faster than the DOM?"

The question is malformed — they're not alternatives. The VDOM doesn't replace DOM operations; it *decides which ones to perform*. So:

- **vs. optimal hand-written updates** → React is **slower**. It runs your component, allocates elements, and reconciles before doing the same single DOM write.
- **vs. realistic imperative code** → React is usually **faster**, because it never rebuilds what didn't change.
- **The real value is not speed at all** — it's that you write `UI = f(state)` and get *near-optimal* updates without hand-tracking every node. React converts a correctness problem into a performance cost you can afford.

**React's actual performance claim:** *"fast enough, by default, without developer discipline"* — not *"fastest."*

---

## 4. What happens when you call `setState` — the full trace

Verified render order ([`trace.cjs`](./verify/trace.cjs)):

```
--- MOUNT ---
   render App (n=0)
   render Child (n=0)
   useLayoutEffect (before paint)
   useEffect (after paint)
--- setState(1) ---
   render App (n=1)
   render Child (n=1)
   useLayoutEffect (before paint)
   useEffect (after paint)
```

> ⚠️ **"Before paint" does not mean "before render."** `useLayoutEffect` runs **after** your component function and **after** React has updated the DOM — just before the browser draws it. Nothing in React runs before render; render is what produces the description everything else acts on.
>
> Proof — the same component logs the live DOM text at each step ([`layout.cjs`](./verify/layout.cjs)):
>
> ```
> === UPDATE (setState 0 -> 42) ===
> 1. RENDER BODY runs      | DOM text right now: "value=0"    ← DOM still OLD
> 2. useLayoutEffect runs  | DOM text right now: "value=42"   ← DOM now UPDATED
> 3. useEffect runs        | DOM text right now: "value=42"
> ```
>
> On mount it's even starker — during render the ref is still `null`, because no DOM node exists yet:
>
> ```
> === MOUNT ===
> 1. RENDER BODY runs      | "ref is null - no DOM yet"
> 2. useLayoutEffect runs  | "value=0"   ← DOM exists now
> ```
>
> So the useful mental model is: **render describes, commit builds, layout effects measure and adjust, then the browser paints.**

### The whole pipeline in one picture

Elements, Fiber, the scheduler, reconciliation, and commit are usually taught as separate topics. They're really one pipeline:

```
                    setState()
                        │
                        ▼
                  Update Queue          ← update object enqueued on the fiber
                        │
                        ▼
                   Scheduler            ← picks priority; BATCHING happens here
                        │
                        ▼
        ┌───────── RENDER PHASE ─────────┐   interruptible · pure · no DOM writes
        │  Creates new React Elements    │
        │              │                 │
        │              ▼                 │
        │       Reconciliation           │   compare new elements
        │              │                 │   against current Fibers
        │              ▼                 │
        │  WorkInProgress Fiber Tree     │
        └──────────────┬─────────────────┘
                       ▼
        ┌───────── COMMIT PHASE ─────────┐   synchronous · uninterruptible
        │  DOM mutations                 │
        │  swap current ← workInProgress │
        │  refs, then useLayoutEffect    │
        └──────────────┬─────────────────┘
                       ▼
                 BROWSER PAINTS
                       │
                       ▼
                 useEffect fires         ← passive, after paint
```

### The eight steps

```
1. setState(next)
      ↓  does NOT render immediately
2. Create update object, enqueue on the fiber's update queue
      ↓
3. Mark lanes on the fiber + bubble priority to the root
      ↓
4. Schedule work (scheduler picks a priority) — BATCHING happens here
      ↓
━━━━━━━━━ RENDER PHASE (interruptible, pure, no DOM writes) ━━━━━━━━━
5. Walk the fiber tree, call components, produce new React Elements
6. Reconcile new elements against current fibers → workInProgress tree,
   tagging fibers with effect flags
      ↓
━━━━━━━━━ COMMIT PHASE (synchronous, uninterruptible) ━━━━━━━━━━━━━━
7. Apply DOM mutations · swap current ← workInProgress · run refs
   → useLayoutEffect fires here (before paint, synchronously)
      ↓
   BROWSER PAINTS
      ↓
8. useEffect fires (passive, after paint)
```

**Step 4 is where batching lives.** Verified — three `setState` calls in one tick:

```
--- BATCHING: 3 setStates in one tick ---
   render App (n=12)
   render Child (n=12)
   => renders triggered: 1 (not 3)
```

One render, with the final value. Since React 18's `createRoot`, this applies **everywhere** — promises, `setTimeout`, native handlers — not just React event handlers. That's *automatic batching* (Module 10).

**Step 7 is why `useLayoutEffect` blocks paint.** It runs inside the commit phase — the DOM is updated, but the user hasn't seen it yet. That gap is the entire reason the hook exists.

The classic use is measure-then-adjust. A tooltip needs to know its own height before it can position itself above a button:

```jsx
function Tooltip({ targetRect }) {
  const ref = useRef(null);
  const [top, setTop] = useState(0);

  useLayoutEffect(() => {
    const height = ref.current.offsetHeight;   // measure the real DOM
    setTop(targetRect.top - height);           // reposition before anyone sees it
  }, [targetRect]);

  return <div ref={ref} style={{ top }}>...</div>;
}
```

You can't measure during render — the node doesn't exist yet (the ref is `null`). Use `useEffect` here instead and the tooltip paints at the wrong position first, then jumps. With `useLayoutEffect` the correction happens before paint, so there's no flicker.

The cost: the browser waits for you. Slow work in a layout effect directly delays what the user sees. Default to `useEffect`; reach for `useLayoutEffect` only when a visual flicker would otherwise be visible.

### Two bailouts worth knowing

**① Same value → no render at all.** Verified:

```
setState with SAME value: renders after mount = 0 (bailout)
```

React compares with `Object.is`. Setting state to its current value skips the render entirely. (Caveat: React may still re-render *once* before bailing in some cases — don't rely on it for correctness, only understand it for debugging.)

**② `Object.is` is reference equality for objects.** Verified:

```
setState({n:1}) with new object ref (same content): +1 render
```

Identical *content*, new reference → React re-renders. This is why `setItems([...items])` always re-renders and why mutating state in place (`items.push(x); setItems(items)`) renders **nothing** — same reference, bailout fires. That's the #1 "why isn't my UI updating?" bug.

### Children re-render by default

Verified:

```
Parent re-rendered 2x with UNCHANGED child props:
  plain child re-rendered: 2x   ← default: children always re-run
  memo child re-rendered:  0x   ← memo bails out
```

React does **not** check whether a child's props changed before calling it. It calls the child and diffs the *output*. `React.memo` opts into a props comparison — useful sometimes, but remember from Module 2 §5.2 that a re-render producing identical output causes **zero DOM writes**. You're often memoizing away work that was already nearly free (Module 8).

---

## 5. What happens when a React app loads

End to end, from URL to interactive:

```
1. HTML arrives     <div id="root"></div>  ← empty; nothing to show yet
                    <script src="/bundle.js">
       ↓
2. JS downloads, parses, executes   ← blank screen until this finishes (CSR)
       ↓
3. createRoot(document.getElementById('root'))
       ↓
4. root.render(<App />)
       ↓
5. INITIAL RENDER — call components top-down, build the element tree
   No previous tree exists, so every fiber is tagged Placement
       ↓
6. COMMIT — build real DOM nodes and append them
   *On the initial mount React creates every node, because no previous tree exists.*
   (Not the only time — a changed `key`, a remount, or a hydration mismatch
    rebuilds whole subtrees later too.)
       ↓
7. BROWSER PAINTS  ← user finally sees content
       ↓
8. useEffect callbacks fire → typically data fetching starts HERE
       ↓
9. Data arrives → setState → the §4 cycle runs again
```

Two consequences worth stating in an interview:

**The blank-screen problem is structural to CSR.** Steps 1–7 all precede first paint, so the user stares at an empty `<div>` for the entire bundle download + parse + first render. That single fact is the motivation for SSR, streaming SSR, and Server Components (Module 6).

**Data fetching in `useEffect` guarantees a waterfall.** Effects run *after* paint (step 8), so the request can't even start until render is complete. Parent fetches, renders child, child fetches — each level serialized. This is why React Query, route loaders, and Suspense-based fetching exist (Modules 6–7).

> **Build pipeline** — how `bundle.js` is produced (webpack/Vite, tree-shaking, code splitting, source maps) gets its own module later in the course. Here we start from "the bundle exists."

---

## 6. Performance Considerations

- **Creating elements is cheap; DOM writes are not.** The entire design follows from this asymmetry.
- **React's cost is proportional to the tree it re-renders**, not to what changed. A `setState` at the root re-runs everything below by default — the diff then keeps DOM writes minimal, but the *component calls* still happen. Push state down to shrink that subtree.
- **The diff is O(n), not optimal.** Achieved via two heuristics (type, key) — Module 2 §6.1.
- **Preserving node identity is a UX feature**, not just speed: focus, selection, scroll, media playback, and uncontrolled input values all survive only if React reuses the node.
- **Measure before memoizing.** Re-render ≠ DOM update.

---

## 7. Edge Cases & Nuances

- **The VDOM is a cost React pays, not a benefit it provides.** Solid and Svelte have no VDOM and are faster. React accepts the overhead to buy a fully dynamic, renderer-agnostic description — and interruptible rendering, which is impossible if you've already mutated the DOM.
- **`setState` in an effect without a guard** → render → effect → setState → render… an infinite loop. React throws "Maximum update depth exceeded."
- **State updates are not synchronous.** Reading state right after `setState` gives the old value — the update is queued, and the variable in scope is a snapshot from that render.
- **Automatic batching is a React 18 + `createRoot` behavior.** Legacy `ReactDOM.render` batches only inside React event handlers.
- **`flushSync`** forces a synchronous re-render and commit, opting out of batching. Escape hatch — it costs you the batching optimization.

---

## 8. Comparison

| | Description layer | Update mechanism |
|---|---|---|
| **React** | Element tree → Fiber, recreated each render | Diff, then patch |
| **Vue 3** | VNodes + compiler patch flags | Diff, compiler-narrowed |
| **Svelte** | None — compiler knows the bindings | Direct node updates |
| **Solid** | None — JSX creates real nodes once | Signals update nodes directly |

Svelte and Solid resolve *at compile time* what React resolves *at runtime*. React trades that speed for the ability to have components be ordinary functions whose output depends on arbitrary runtime logic — and to target DOM, Native, or a terminal with the same elements.

---

## 9. Interview Questions

### Basic

**Q: What is the Virtual DOM?**
An in-memory description of the intended UI, made of plain JS objects. React diffs successive descriptions and applies only the differences to the real DOM.

**Q: Why not update the real DOM directly?**
You can, and it's faster if done optimally. The problem is that doing it optimally by hand means tracking every node affected by every state change — which doesn't scale and produces stale-UI bugs.

**Q: What is reconciliation?**
React comparing the newly returned React Elements against the current fiber tree, to build the next fiber tree and work out the minimum set of DOM operations. Rules in Module 2 §6.

**Q: Is Fiber the Virtual DOM?**
See §1 above — Elements describe **what**, Fiber describes **how**; "Virtual DOM" names the strategy, Fiber is the architecture that implements it. The follow-up interviewers actually want: this distinction is why "the VDOM re-rendered" is a category error. Fiber can redo *how* it builds a tree (interrupt, restart, run twice) without that ever being visible as extra *what* — your component output is the same either way, so the only symptom of Fiber's internal churn is timing, never incorrect UI.

### Intermediate

**Q: Is the Virtual DOM faster than the real DOM?**
⚠️ Malformed premise — they aren't alternatives; the VDOM decides *which* DOM operations to run. In micro-benchmarks where you already know the exact node, hand-written updates are faster, because React does extra work first. Against realistic code that rebuilds markup instead of surgically patching it, React usually wins. Its value is near-optimal updates without hand-tracking every node.

**Q: What happens when you call `setState`?**
It enqueues an update on the fiber and schedules work — it does not render immediately. Updates in the same tick batch into one render. Then: render phase (call components, diff, no DOM writes) → commit phase (DOM mutations, refs, `useLayoutEffect`) → paint → `useEffect`.

**Q: Why doesn't my UI update when I push to an array in state?**
`Object.is` sees the same reference and bails out. Verified: `setState` with a new object of identical content re-renders; mutating in place does not. Always create a new reference.

**Q: Do children re-render when a parent re-renders?**
Yes, by default — verified. React doesn't compare child props first; it calls the child and diffs the output. `React.memo` opts into a props comparison.

### Senior

**Q: Walk through everything from `setState` to a pixel changing.**
setState → enqueue update on fiber → mark lanes, bubble to root → schedule (batching happens here) → **render phase**: build workInProgress tree, call components, reconcile, tag effect flags (interruptible, no DOM writes) → **commit phase**: mutate DOM, swap `current` pointer, run refs, fire `useLayoutEffect` (synchronous, uninterruptible) → browser paints → `useEffect` fires.

**Q: Why must the render phase be pure?**
Render is the phase React is allowed to discard and redo (§4, the eight steps). If a higher-priority update arrives mid-render, React abandons the workInProgress tree and starts over — the component function you wrote may run once, twice, or for a screen the user never sees. A side effect in that function fires exactly as many times as React *decided* to call your component, not once per meaningful update. That number is an implementation detail, not something you control.

Concretely:

```jsx
function Checkout({ cart }) {
  fetch('/api/reserve', { method: 'POST', body: JSON.stringify({ cart }) }); // ❌
  return <Summary items={cart} />;
}
```

You expect one reservation per checkout. But render can run twice for one commit (StrictMode simulates this on purpose, and real concurrent rendering does it for real when a more urgent update interrupts). Nothing throws — you just get two orders. Move the `fetch` into a click handler, which React guarantees runs exactly once per click, and the bug is structurally gone.

This is the same guarantee that makes double buffering safe (Module 3 §4): React can build the workInProgress tree off-screen, throw it away, and rebuild it, only because nothing observable happened while building it. Purity in render and "current is never touched mid-build" are the same promise seen from two sides — one about your code, one about React's tree. Break purity and you've quietly broken the assumption every concurrent feature (transitions, Suspense, interruption) relies on.

**Q: Why does `useLayoutEffect` block paint but `useEffect` doesn't?**
It's purely about where each one sits in the pipeline (§4, "the whole pipeline in one picture"). `useLayoutEffect` fires inside the commit phase — after the DOM is mutated, but before the browser has painted the frame. `useEffect` is a *passive* effect, deliberately scheduled after paint. The browser can only draw once nothing synchronous is left to run, so anything still running before that point necessarily delays what the user sees.

The tooltip case makes it concrete. A tooltip needs to know its own height to position itself above a button — but it can't know that until it's a real DOM node:

```jsx
useLayoutEffect(() => {
  const height = ref.current.offsetHeight;   // measure the real, just-committed DOM
  setTop(targetRect.top - height);           // correct position before paint
}, [targetRect]);
```

With `useLayoutEffect`, the measure-then-correct happens before the browser draws — the user only ever sees the tooltip in its final position. Swap it for `useEffect` and the browser paints the *wrong* position first (default `top`), then the effect fires, `setTop` schedules another render, and the tooltip visibly jumps a frame later.

The trade is exactly what you'd expect from "blocks paint": whatever runs inside `useLayoutEffect` delays the frame directly, so slow work there is much more costly than the same work in `useEffect`. That's why the rule is "default to `useEffect`, reach for `useLayoutEffect` only when skipping it would cause a visible flicker" — you're trading a small, guaranteed delay for avoiding a worse, visible glitch, not getting a delay for free.

**Q: Argue that the VDOM is a cost, not a benefit.**
Fair. Building and diffing a tree every render is pure overhead versus Solid/Svelte, which know at compile time which node a value maps to. React accepts it to buy a runtime-agnostic, fully dynamic description — components are ordinary functions, the same elements target DOM/Native/terminal, and rendering stays interruptible (impossible once you've mutated the DOM). The React Compiler is an attempt to reclaim the constant factor without giving up that model.

**Q: Why is fetching in `useEffect` a waterfall, and what fixes it?**
The cause is timing, not React being slow. `useEffect` is a passive effect — it's scheduled to run *after* the browser paints (§4, "the whole pipeline"). So a child component's fetch literally cannot begin until: the parent has rendered, committed, and painted. If the parent is also fetching in an effect, its own data has to arrive and trigger a re-render *before* the child even mounts and gets a chance to start its request.

```
  5ms  Parent starts fetching
 56ms  parent data arrives, Parent re-renders, Child mounts
 59ms  Child starts fetching        ← only now — three levels deep, this repeats
110ms  Child data arrives
```

Two 50ms requests took 110ms because they ran one after another instead of together — the child's request didn't even *exist* yet while the parent's was in flight. Add a third nested level and the total keeps climbing the same way (Module 9 §4 measures this directly).

The fix in every case is the same idea: stop discovering what to fetch by rendering, and start every independent request as early as possible instead.

1. **Route loaders** — fetch everything a page needs before rendering it, in parallel.
2. **Hoist the fetch** — request in the parent, pass data down as props instead of letting the child discover its own need.
3. **`Promise.all`** for requests that don't depend on each other.
4. **Server Components** — data fetching moves to the server, before any client-side render loop is even involved (Module 7 §7).

All four remove the same dependency: "render must finish before the next fetch can start."

---

## 10. Common Mistakes

- ❌ *"The VDOM is a copy of the real DOM."* It's a description of intended output, built from components — never a snapshot.
- ❌ *"The VDOM makes React fast."* It makes React *fast enough by default*. Optimal hand-written updates are faster.
- ❌ *"There's a VirtualDOM module in React."* There's `ReactElement` and `FiberNode`.
- ❌ *Reading state right after `setState`* and expecting the new value — it's queued; your variable is a snapshot.
- ❌ *Mutating state in place* — `Object.is` bails out and nothing re-renders.
- ❌ *Assuming three `setState` calls cause three renders* — verified: one.
- ❌ *Blaming re-renders for slowness* without profiling. Re-render ≠ DOM update.

---

## 11. Official Documentation References

- [Render and Commit](https://react.dev/learn/render-and-commit) · [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [`useLayoutEffect`](https://react.dev/reference/react/useLayoutEffect) · [`memo`](https://react.dev/reference/react/memo) · [`flushSync`](https://react.dev/reference/react-dom/flushSync)
- [React 18: Automatic Batching](https://react.dev/blog/2022/03/29/react-v18#new-feature-automatic-batching)

*Verification: React 18.3.1 + jsdom in Node. Scripts in [verify/](./verify/).*

---

## 12. Revision Notes

**Key takeaways**
1. The VDOM is a **strategy**, not a module or a DOM copy — a description of intended output.
2. What exists: **React Elements** (immutable, per-render) and **Fiber nodes** (mutable, persistent, hold state/effects/lanes). Elements describe **what**; Fiber describes **how**. Fiber is not the VDOM — it's the architecture implementing it.
3. **Slower** than optimal hand-written DOM code, **faster** than a naive rebuild. "Faster than the DOM" is a malformed claim — quote the direction, never a multiplier (it's environment-specific).
4. React's real claim: **fast enough by default, without developer discipline**.
5. `setState` → enqueue → schedule (**batch**) → render phase (pure, interruptible) → commit (sync) → paint → `useEffect`.
5b. Reconciliation compares **new elements against current fibers** to build the workInProgress tree — not two element trees, not two fiber trees.
6. **Verified:** 3 setStates in one tick → **1 render**.
7. **Verified:** same value → bailout; new object reference with same content → re-render.
8. **Verified:** children re-render by default; `memo` opts out.
9. `useLayoutEffect` runs in commit (blocks paint); `useEffect` after paint.
10. CSR blank screen and `useEffect` fetch waterfalls are **structural** — the motivation for SSR and Suspense.

**Soundbites**
- "The VDOM doesn't replace DOM operations — it decides which ones to perform."
- "React is slower than optimal DOM code and faster than realistic DOM code."
- "State updates are queued, not immediate — your variable is a snapshot."
- "Re-render means the function ran, not that the DOM changed."

---

## 13. Practice Exercises

**1 — Run the benchmark.** Execute [`bench.cjs`](./verify/bench.cjs), then change the row count to 10 and to 10,000. At what size does React's overhead stop mattering? Explain the shape of the curve.

**2 — Prove batching.** Log a counter in a component body, then call `setState` three times in a click handler. Confirm one render. Now move the calls inside a `setTimeout` — still one render on React 18 (`createRoot`), but three on legacy `ReactDOM.render`. Explain why.

**3 — Break it with mutation.** Hold an array in state, `push` to it, and call `setState` with the same reference. Watch nothing happen. Fix with a spread and explain what `Object.is` did.

**4 — Order the effects.** Put logs in the render body, `useLayoutEffect`, and `useEffect`, then predict the order before running. Add a `while` loop burning 100ms in each effect and observe which one delays paint.

**5 — Watch the waterfall.** Build a parent that fetches in `useEffect` and renders a child that also fetches. Confirm in the Network tab that the requests are serialized, then fix it by hoisting the fetch.

**6 — Interview rehearsal.** 2 minutes, no notes: *"What happens when I call setState?"* Hit enqueue → batch → render phase → reconcile → commit → paint → effects, and name which phases are interruptible.

---

**Next:** [Module 5 — Component Model](./Module05-ComponentModel.md) — props, state, controlled inputs, composition, context, portals.
