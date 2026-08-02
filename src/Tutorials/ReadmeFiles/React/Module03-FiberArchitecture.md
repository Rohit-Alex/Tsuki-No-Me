# Module 3 — Fiber Architecture

> Part of the [React Mastery course](./README.md). Previous: [Module 2 — React Fundamentals](./Module02-ReactFundamentals.md). Next: [Module 4 — Virtual DOM & Diffing](./Module04-VirtualDOM-Diffing.md).

Module 2 showed you React Elements — immutable descriptions, thrown away every render. This module covers the other half: **Fiber**, the structure React actually keeps.

You need this before the Virtual DOM module, because reconciliation and diffing operate *on fibers*. Terms like `workInProgress`, `alternate`, and "interruptible render" only make sense once you've seen a fiber node.

Everything here was verified by **inspecting a live fiber tree** ([`fiber.cjs`](./verify/fiber.cjs)) and by **reading the reconciler source**.

---

## 1. Introduction

Three ideas:

1. **A fiber is a work unit** — one JavaScript object per component instance, holding its hook list, its effects, and its priority.
2. **On updates React keeps two fiber trees** — `current` and `workInProgress` — and swaps between them. (On the very first mount only one exists; the second is created on the first update.)
3. **Fiber made the *render phase* interruptible.** The commit phase is still synchronous and uninterruptible. Before Fiber, rendering was one unbroken recursive call that nothing could stop.

### Where Fiber sits in the pipeline

Fiber is easy to study in isolation and then not know where it belongs. It's one stage of a chain:

```
        JSX                    what you write
         ↓  compiler
   React Element               WHAT the UI should be   (immutable, per render)
         ↓  reconciliation
       Fiber                   HOW React will build it (persistent work unit)
         ↓
     Scheduler                 WHEN the work runs      (lanes, yielding)
         ↓
      Commit                   apply the changes
         ↓
        DOM                    what the user sees
```

Elements are **thrown away** every render. Fibers **persist** — that difference is §3.5, and it's the piece most people miss.

📚 [React 16.0 announcement](https://legacy.reactjs.org/blog/2017/09/26/react-v16.0.html)

---

## 2. Why Fiber exists — the stack reconciler problem

Before React 16, reconciliation was ordinary recursion:

```js
function reconcile(element) {
  const children = renderComponent(element);
  children.forEach(reconcile);   // ← recursion, on the JS call stack
}
```

Simple, and it worked. But it had one fatal property: **once started, it could not stop.** The JS call stack owns the flow. You can't pause a recursive call, hand control back to the browser, and resume later.

So a deep tree meant a long synchronous block:

```
User types  →  React starts rendering 3000 components
                   │
                   │  main thread fully blocked, 200ms
                   │  keystrokes queued, animations frozen
                   ▼
               DOM updated, input finally responds
```

Every update was also equally urgent. A background list filter blocked a keystroke, because React had no concept of priority.

**The fix required a fundamental change:** stop letting the JS call stack own the traversal. Put the work in a data structure React controls — then React can pause whenever it likes.

Note the scope of the fix: it made the **render phase** interruptible. Commit stayed synchronous, because you can't half-apply DOM mutations.

That data structure is the fiber tree. Fiber shipped in **React 16 (Sept 2017)** as a complete internal rewrite, with no change to the component API.

---

## 3. What a fiber node actually is

A fiber is a plain JS object. Here are the **real field names** from a live `App` component:

```
tag, key, elementType, type, stateNode, return, child, sibling, index,
ref, pendingProps, memoizedProps, updateQueue, memoizedState, dependencies,
mode, flags, subtreeFlags, deletions, lanes, childLanes, alternate,
actualDuration, actualStartTime, selfBaseDuration, treeBaseDuration
```

The ones that matter:

| Field | What it holds | Verified value |
|---|---|---|
| `tag` | What kind of fiber | `0` = function component, `3` = HostRoot, `5` = host element |
| `type` | The function, or tag string | `App`, or `'div'` |
| `stateNode` | The real instance | **`null`** for function components; the **real DOM node** for host fibers |
| `child` / `sibling` / `return` | Tree links | `App.child` → `div` fiber |
| `memoizedState` | Head of the **hook linked list** | present |
| `memoizedProps` | Props from the last committed render | `{}` |
| `pendingProps` | Props for the render in progress | |
| `flags` | What to do in commit (Placement, Update, Deletion) | |
| `lanes` | Priority of pending updates | |
| `alternate` | Pointer to this fiber's other copy | `null` until the first update |

Two verified facts worth keeping:

```
host <div> fiber: stateNode === real DOM node?  true
function App fiber: stateNode =                 null
```

Host fibers own a real DOM node. Function component fibers don't — there's no instance to own.

### Where state actually lives — precisely

The loose version — *"state is stored on the fiber"* — is close enough to be useful and wrong enough to trip you up. The accurate version:

> **A component's state is associated with its fiber through the hook list stored in `memoizedState`.**

The fiber doesn't hold your values directly. It holds the **head of a linked list of hook objects**, and each hook holds its own state and its own pending update queue:

```
fiber.memoizedState
      │
      ▼
  ┌──────────────┐   next   ┌──────────────┐   next   ┌──────────────┐
  │ Hook #1      │ ───────▶ │ Hook #2      │ ───────▶ │ Hook #3      │
  │ memoizedState│          │ memoizedState│          │ memoizedState│
  │ baseState    │          │ baseState    │          │ baseState    │
  │ queue        │          │ queue        │          │ queue        │
  └──────────────┘          └──────────────┘          └──────────────┘
   useState(0)               useState('')              useEffect(...)
```

Straight from the source — every hook is created with exactly this shape:

```js
function mountWorkInProgressHook() {
  var hook = {
    memoizedState: null,   // the current value
    baseState: null,
    baseQueue: null,
    queue: null,           // pending updates for THIS hook
    next: null             // ← the linked list
  };
  if (workInProgressHook === null) {
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;  // first hook
  } else {
    workInProgressHook = workInProgressHook.next = hook;                // append
  }
  return workInProgressHook;
}
```

Note there are **no names and no keys** — hooks are matched purely by *position in the list*. That fact is the whole answer to the most common Fiber interview question (§8).

### One fiber per element — but ONE tree for the whole app

A common misreading: *"a fiber is created per component"* sounds like each component gets its own little tree. It doesn't.

**There is exactly one fiber tree for the entire application**, mirroring the whole UI — just like the DOM tree. Every component *and* every host element in it gets one node in that single tree.

Take this app:

```jsx
function App() {
  const [n, setN] = useState(0);
  return (
    <div className="app">
      <Header user="Rohit" />
      <List items={['a','b']} />
      <footer>{n}</footer>
    </div>
  );
}
```

Here is the **real** fiber tree React built for it ([`tree.cjs`](./verify/tree.cjs)):

```
HostRoot                        [HostRoot]
  └─ App                        [FunctionComponent]
    └─ <div>                    [HostComponent]
      └─ Header                 [FunctionComponent]
        └─ <header>             [HostComponent]
          └─ <h1>               [HostComponent]
          ├─ Avatar             [FunctionComponent]
            └─ <img>            [HostComponent]
      ├─ List                   [FunctionComponent]
        └─ <ul>                 [HostComponent]
          └─ Item key="a"       [FunctionComponent]
            └─ <li>             [HostComponent]
          ├─ Item key="b"       [FunctionComponent]
            └─ <li>             [HostComponent]
      ├─ <footer>               [HostComponent]

Total fibers in the single tree: 15
```

Three things to read off this:

1. **Components and host elements are both fibers.** `Header` (your component) and `<header>` (the DOM tag it returned) are two *separate* fibers, parent and child. Function fibers have `stateNode: null`; host fibers hold the real node.
2. **The tree spans everything from the root.** `App`, `Header`, `Avatar`, `List`, both `Item`s — all in one connected structure, reachable from `HostRoot`.
3. **It mirrors the DOM but is bigger than it.** 15 fibers produce only 8 DOM nodes, because component fibers (`App`, `Header`, `Avatar`, `List`, `Item`×2) emit no DOM of their own.

So: **one fiber per element in the tree; one tree per root.** `createRoot` creates one — if you mount two roots on a page, you get two independent trees.

### The tree is a linked list, not an array of children

```
        HostRoot
           │ child
           ▼
          App ──────── sibling ────────▶ (none)
           │ child          ▲
           ▼                │ return
          div ──────────────┘
           │ child
           ▼
         Child
```

Each fiber has **one** `child`, a `sibling`, and a `return` (parent).

The traversal is still **recursive in concept** — down to children, back up to parents. The change is *who tracks the position*. Instead of the JS call stack holding it implicitly, React holds it explicitly in a module-level `workInProgress` pointer:

```js
while (workInProgress !== null) {
  performUnitOfWork(workInProgress);
}
```

Because the position is a variable React owns, it can stop after any unit and resume from that pointer later. You can't do that with the call stack — that's the whole unlock.

(The upward walk in `completeUnitOfWork` is a `do…while` over `return` pointers, not a recursive call.)

---

## 3.5 The fiber lifecycle — elements die, fibers survive

The single biggest mental-model gap. Say it plainly:

> **A new React Element is created on every render. The fiber is created once and reused.**

```
   React Element  ──▶  CREATE fiber      first time this position renders
                          │
                          ▼
   React Element  ──▶  UPDATE fiber      same type + key → reuse, new pendingProps
                          │
                          ▼
   React Element  ──▶  REUSE fiber       bailout: no pending work → skip entirely
                          │
                          ▼
   (element gone)  ──▶  DELETE fiber     removed, or type/key changed
```

Step by step:

**CREATE** — no matching current fiber at this position, so React builds one and tags it `Placement`. Happens on mount, and for newly added items.

**UPDATE** — a matching fiber exists (same type, same key). React reuses the fiber object via `createWorkInProgress`, writes the new props into `pendingProps`, and keeps `memoizedState` — **which is why your state survives a re-render**.

**REUSE (bailout)** — props are unchanged and there's no pending work in `lanes`, so React clones the fiber and skips the subtree entirely. `childLanes` is what makes this check cheap.

**DELETE** — the element is gone, or its type or key changed. React tags the fiber `Deletion` and pushes it to the parent's `deletions` array. State inside is destroyed.

The consequence worth internalizing:

| | React Element | Fiber |
|---|---|---|
| Created | every render | once, then reused |
| Mutable | no (frozen in dev) | yes |
| Holds state | no | yes — via the hook list |
| Lifetime | until reconciliation ends | until the component unmounts |

So when someone asks *"where does my state go between renders?"* — the elements were all discarded, but the fiber holding the hook list was never thrown away. **Element identity is per-render; fiber identity is per-mounted-component.**

---

## 4. current, workInProgress and alternate

This is one of the most important concepts in Fiber.

Many people think React keeps creating new Fiber trees on every render. It doesn't.

React keeps **at most two Fiber trees**:

1. **Current Tree** — the tree representing the UI currently visible to the user.
2. **WorkInProgress Tree** — the tree React is building for the next render.

Think of them like **double buffering** used in video games.

```
                User sees

          Current Fiber Tree
                 ▲
                 │
─────────────────┼─────────────────

      WorkInProgress Fiber Tree

      React builds the next UI here
```

The user only ever sees the **Current Tree**. React performs all rendering work inside the **WorkInProgress Tree**, and only swaps them once rendering is completely finished.

### The three terms

| Term | Meaning |
|------|---------|
| **current** | The tree currently displayed on screen. |
| **workInProgress** | The tree React is currently building. |
| **alternate** | A pointer connecting corresponding fibers between the two trees. |

Remember:

> **current** and **workInProgress** are **roles**, not permanent objects.

After every successful commit the roles simply swap.

---

### Why do we need two trees?

Imagine React updated the current tree directly.

```jsx
<App>
    <Navbar />
    <Sidebar />
    <Products />
    <Footer />
</App>
```

Suppose React finishes updating only `Navbar` and `Sidebar`, but hasn't reached `Products` and `Footer` yet. If it were modifying the visible tree, the user would temporarily see:

```
New Navbar
New Sidebar
Old Products      ← half-updated UI
Old Footer
```

React never allows this. It builds the entire next version **off-screen** in the workInProgress tree, and only makes it visible once the whole tree is ready.

---

### Walkthrough: a counter, three clicks

Abstract rules are easy to forget. Follow one component through three renders instead.

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

Every step below is real output from [`counter.cjs`](./verify/counter.cjs):

```
initial render   current=TreeA  count=0   spare=null
after click 1    current=TreeB  count=1   spare=TreeA holds count=0
after click 2    current=TreeA  count=2   spare=TreeB holds count=1
after click 3    current=TreeB  count=3   spare=TreeA holds count=2
```

### Initial render

React builds the very first Fiber tree and commits it.

```
Current → Tree A (count = 0)
```

The user sees `Count: 0`. At this point there is only **one tree** — `spare=null` above, because there's nothing to alternate with yet.

### First click — `setCount(1)`

React does **not** modify Tree A. It creates a second tree:

```
Current        → Tree A (count = 0)
                    │  clone latest committed state
                    ▼
WorkInProgress → Tree B (count = 0)   ← starts as a copy
                    │  apply pending update
                    ▼
                 Tree B (count = 1)
```

Commit. Tree B becomes current, Tree A becomes the spare. The user sees `Count: 1`.

### Second click — `setCount(2)`

Here's the step most people get wrong. React reuses Tree A — so does rendering start from Tree A's old `count = 0`?

**No.** Before rendering, React copies the latest committed state from the current tree into the work tree:

```
Current        → Tree B (count = 1)
                    │  clone latest committed state
                    ▼
WorkInProgress → Tree A (count = 1)   ← NOT the stale 0
                    │  apply pending update
                    ▼
                 Tree A (count = 2)
```

The trace confirms it: after click 2, `current=TreeA count=2`, and the spare (TreeB) holds `count=1` — the previous committed value. Never a stale `0`.

### Third click

Same process, swapping back:

```
Current → Tree A (count = 2)  →  clone  →  WorkInProgress → Tree B (2)  →  update  →  (3)  →  commit
```

`Tree A ↔ Tree B ↔ Tree A ↔ Tree B` — forever.

---

### The important detail: the spare is never stale

The spare tree does **not** keep holding old values from its previous use. Before rendering, React copies the latest committed information across. This is `createWorkInProgress`, straight from the source:

```js
function createWorkInProgress(current, pendingProps) {
  var workInProgress = current.alternate;

  if (workInProgress === null) {
    // We use a double buffering pooling technique because we know that we'll
    // only ever need at most two versions of a tree. We pool the "other" unused
    // node that we're free to reuse.
    workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode);
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.flags = NoFlags;        // ← old effects cleared
    workInProgress.subtreeFlags = NoFlags;
    workInProgress.deletions = null;
  }

  // Copy the latest committed snapshot across:
  workInProgress.childLanes    = current.childLanes;
  workInProgress.lanes         = current.lanes;
  workInProgress.child         = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;   // ← your hooks
  workInProgress.updateQueue   = current.updateQueue;
  ...
}
```

So the work tree always starts from the **latest committed state**, not from leftovers. Note what's *reset* (`flags`, `subtreeFlags`, `deletions` — per-render scratch work) versus what's *carried over* (`memoizedState`, `memoizedProps`, `stateNode`, `updateQueue`). That distinction is exactly how state survives a re-render while the object is reused as a buffer.

---

### Why keep two trees?

Four benefits, and they're the reason the whole design exists:

**1. Atomic updates.** The user always sees either the old UI or the new UI — never a mixture. Commit is one assignment:

```js
fiberRoot.current = workInProgress;
```

**2. Interruptible rendering.** If a higher-priority update arrives mid-render, React throws away the unfinished workInProgress tree. The current tree was never modified, so the UI stays correct. *This is what makes the render phase interruptible.*

**3. Cheap rollback.** Since the visible tree is untouched, React never has to undo partial work. It just starts a new workInProgress tree.

**4. Memory reuse.** Instead of allocating Tree A, B, C, D… forever, React reuses exactly two.

---

### Mental model: two notebooks

Imagine two notebooks, A and B.

Everyone is reading Notebook A. You copy its contents into Notebook B, make your edits, and finish the new version. Only when it's complete do you hand Notebook B to everyone.

Notebook A is then wiped and reused for the next revision — but you always start by copying the *current* contents across, so you're never editing an outdated draft.

React's Fiber trees work exactly the same way.

---

## 5. The work loop

Render walks the tree in a loop, one fiber at a time:

```js
while (workInProgress !== null && !shouldYield()) {
  workInProgress = performUnitOfWork(workInProgress);
}
```

`shouldYield()` is the whole point. After each unit React asks *"has the browser waited long enough?"* — and if so it stops, lets the browser paint and handle input, then resumes.

Each unit has two halves:

**`beginWork` (going down)** — call the component, get the elements it returned, and reconcile them against the current child fibers. The output is **child fibers**, not elements — reconciliation happens immediately, so elements never accumulate as a tree.

**`completeWork` (coming back up)** — prepare the **host instance** for host fibers and bubble effect flags to the parent.

```
      App          1. begin App
       │           2. begin div
       ▼           3. begin Child
      div          4. complete Child   ← prepares host instance for <span>
       │           5. complete div     ← prepares host instance for <div>
       ▼           6. complete App
     Child         7. commit — insert everything at once
```

**Careful with the wording here.** Host fibers *prepare host instances* during `completeWork`; **insertion into the tree happens only in commit.** Say "host instance," not "DOM node" — the reconciler is renderer-agnostic. `react-dom` creates a DOM node, React Native creates a native view, and the test renderer creates a plain object. Same fiber algorithm, different host config.

### Render phase vs commit phase

| | Render phase | Commit phase |
|---|---|---|
| Work | Call components, reconcile, build wip tree | Apply DOM mutations, run effects |
| Interruptible | **Yes** | **No** |
| Can run twice | **Yes** | No |
| Side effects allowed | **No** | Yes |

This table *is* the reason render must be pure (Module 2 §11). React may run your component, throw the result away, and run it again — so a `fetch` in render fires an unpredictable number of times.

---

## 6. Lanes and priority

Not all updates are equally urgent. Typing must feel instant; re-filtering a 10,000-row table can wait.

React encodes priority as **lanes** — a bitmask (31 bits, so it fits in a SMI and stays fast):

```js
const SyncLane          = 0b0000000000000000000000000000001;  // discrete input: click, keypress
const InputContinuousLane = 0b0000000000000000000000000000100;  // drag, scroll
const DefaultLane       = 0b0000000000000000000000000010000;  // normal setState
const TransitionLanes   = 0b0000000001111111111111110000000;  // startTransition
const IdleLane          = 0b0100000000000000000000000000000;  // lowest
```

**Why a bitmask and not just a priority number?** This gets asked, and "because it's fast" is only half the answer.

A number expresses *one* priority. A bitmask expresses a **set** of them — and that's the property React actually needs:

1. **One fiber can carry work at several priorities at once.** A component might have a pending urgent click update *and* a pending transition update. A single number would have to discard one.
2. **Lanes combine with a single OR.** Straight from the source:
   ```js
   function mergeLanes(a, b) { return a | b; }
   root.pendingLanes |= updateLane;
   ```
3. **React can render a *subset* and leave the rest pending** — process the urgent lanes now, keep the transition lanes queued. `lanes & ~completedLanes` clears exactly what finished.
4. **The common questions are single CPU instructions:**
   ```js
   lanes & SyncLane           // any urgent work pending?
   lanes & ~completedLanes    // clear finished work
   ```

That's why lanes replaced the older `expirationTime` number in React 17 — a single number can order priorities but can't represent a *set* of them, which Suspense and transitions require.

Every fiber carries `lanes` (its own pending work) and `childLanes` (work anywhere below it). `childLanes` is the optimization that lets React **skip entire subtrees** with nothing to do, instead of walking them.

When a higher-priority update arrives mid-render, React abandons the workInProgress tree, restarts at the higher priority, and comes back to the low-priority work afterwards. Safe only because of double buffering (§4).



---

## 7. Effect flags

During render React tags each fiber with what commit must do:

```js
Placement  = 0b0000000000010;   // insert or move
Update     = 0b0000000000100;   // update props / run effects
Deletion   = 0b0000000001000;   // remove
```

Also a bitmask, so one fiber can carry several (`Placement | Update`). Commit reads the flags instead of re-deriving what changed.

> **Historical note:** this field was called **`effectTag`** until React 17, when it was renamed to **`flags`** (and the old linked "effect list" was replaced by `subtreeFlags`). Older blog posts and talks still say `effectTag` — same concept, older name. Worth recognising both.

`subtreeFlags` aggregates descendants' flags — so if a subtree has none, commit skips it entirely.

**Commit runs in three passes**, and the order matters:

```
1. BEFORE MUTATION   getSnapshotBeforeUpdate — read the DOM as it was
2. MUTATION          insert / update / delete DOM nodes
                     → useLayoutEffect CLEANUP runs here
3. LAYOUT            refs attached
                     → useLayoutEffect SETUP runs here
   ─────────── swap current ← workInProgress ───────────
   BROWSER PAINTS
   → useEffect runs after (passive, async)
```

This is why `useLayoutEffect` sees the updated DOM before the user does (Module 4 §4).

---

## 8. Interview Questions

### Basic

**Q: What is Fiber?**
React's internal architecture since React 16. A fiber is a plain JS object representing one unit of work — one per component instance — holding its state, effects, and priority. The fiber tree replaced recursive rendering with a pausable loop.

**Q: What problem did Fiber solve?**
Rendering used to be recursive, so it couldn't be interrupted. A large update blocked the main thread and froze input. Fiber moved the work off the call stack into a data structure React controls, so it can pause and resume.

**Q: Is Fiber the Virtual DOM?**
No. React Elements describe *what* the UI should look like; Fiber is *how* React renders it. "Virtual DOM" is the overall strategy; Fiber is the architecture implementing it.

### Intermediate

**Q: What's the difference between a React Element and a Fiber?**
An element is an immutable description created fresh on **every** render and discarded after reconciliation. A fiber is a mutable work unit created **once** per component position and reused across renders — it carries the hook list, effects, and lanes. Elements are per-render; fibers are per-mounted-component. That's why state survives re-renders: the elements were thrown away, the fiber wasn't.

**Q: Why two fiber trees?**
So work can be thrown away safely. `current` is on screen; `workInProgress` is being built. If React abandons a render, the screen is untouched because `current` never changed. Committing is one pointer swap — atomic, so users never see a partial tree.

**Q: Why can't hooks be called conditionally?** ⭐ *The most common Fiber question there is.*

Because hooks are stored as a **linked list** on the fiber, in `memoizedState`, and they're matched **purely by position** — there are no names or keys in the hook object.

React expects the same sequence every render:

```
render 1:   Hook#1 (name) → Hook#2 (age) → Hook#3 (effect)
render 2:   Hook#1 (name) → Hook#2 (age) → Hook#3 (effect)   ✅ positions line up
```

Put one behind a condition and the sequence shifts:

```jsx
function Profile({ isLoggedIn }) {
  if (isLoggedIn) {
    const [name, setName] = useState('');   // ❌ sometimes present, sometimes not
  }
  const [age, setAge] = useState(0);
  ...
}
```

```
render 1 (logged in):   Hook#1 (name) → Hook#2 (age)
render 2 (logged out):  Hook#1 (age)                  ← age now reads name's slot!
```

`age` picks up the value and update queue that belonged to `name`. React can't detect this by identity, so it compares hook *counts* and throws — verified output ([`condhooks.cjs`](./verify/condhooks.cjs)):

```
Error: Rendered fewer hooks than expected. This may be caused by an accidental early return statement.
```

The fix is to keep the calls unconditional and move the condition inside:

```jsx
const [name, setName] = useState('');       // ✅ always called
const [age, setAge] = useState(0);
if (!isLoggedIn) return <Login />;          // ✅ early return AFTER the hooks
```

**Q: Where does `useState` actually store state?**
Precisely: the state is associated with the fiber *through the hook list* at `memoizedState`. The fiber holds the head of a linked list; each hook object holds its own `memoizedState` (the value) and `queue` (pending updates). Verified — a function component's fiber has `memoizedState` populated while its `stateNode` is `null`.

**Q: What are lanes?**
A 31-bit priority bitmask on each fiber. Bitwise ops make "is there urgent work?" a single instruction, and `childLanes` lets React skip subtrees with no pending work. They replaced React 17's `expirationTime` number because a bitmask can represent *sets* of priorities.

### Senior

**Q: Walk through one unit of work.**
One "unit" is one fiber, processed in two halves. `beginWork` runs the component (or, for a host fiber, does the reconciliation math), reconciles its returned elements against the current child fibers (§4's element-vs-fiber comparison), and produces the child fibers to descend into next. When there are no more children, `completeWork` runs on the way back up — it prepares the host instance for host fibers and bubbles effect flags to the parent, then the loop moves to a sibling or continues upward via `return`.

```
      App          1. begin App
       │           2. begin div
       ▼           3. begin Child
      div          4. complete Child
       │           5. complete div
       ▼           6. complete App
     Child         7. commit — insert everything at once
```

The part worth naming explicitly: between every single unit, the loop checks `shouldYield()` (§5) — "has the browser waited long enough for this frame?" If so, React stops mid-tree, hands control back to the browser to paint and handle input, and resumes later from the exact `workInProgress` pointer it left off at.

This is the concrete mechanism behind "render is interruptible" (Module 4 §4, the eight-step trace). It isn't interruptible in some abstract sense — it's *literally* a loop that can stop after any fiber, because the position lives in a variable React owns (`workInProgress`) rather than on the JS call stack. That's the exact property the old stack reconciler (§2) didn't have, and it's why a fiber tree, not smarter recursion, was the fix.

**Q: Why can the render phase run twice but the commit phase can't?**
It comes down to what's observable. Render only writes to the workInProgress tree — a plain JS object graph nobody but React can see (§4). Throwing it away and starting over costs some CPU time and nothing else, because `current`, the tree the user is actually looking at, was never touched.

Commit is different in kind, not just degree: it writes to the real DOM, which the user's eyes and the browser's rendering pipeline observe immediately. There's no "undo" for a DOM mutation the way there is for discarding an object — once a node is inserted, style is recalculated, and something might already be painted. You can't half-apply a set of DOM writes and cleanly back out if a higher-priority update shows up.

```
Render:  build workInProgress  →  (if interrupted) throw it away  →  current still correct
Commit:  fiberRoot.current = workInProgress                       →  irreversible, one line
```

That asymmetry is why the two-tree design (§4) exists at all — it's not an optimization bolted on, it's what makes interruption *safe*. Everything risky (running your component, maybe multiple times, maybe for a tree nobody sees) happens in the phase with no observable side effects. Everything observable (DOM writes, layout effects, ref attachment) happens in one uninterrupted synchronous pass, atomically swapped in with a single pointer assignment. If commit could also be interrupted, users would see a UI that's half old, half new — precisely the bug two-tree buffering was built to make impossible (§4, "Why do we need two trees?").

**Q: How does `childLanes` improve performance?**
Without it, "does anything below this fiber need work?" has only one honest answer: walk the whole subtree and check. For a large app that's expensive to repeat on every render pass, and most of the tree usually has nothing pending.

`childLanes` turns that walk into a lookup. Every fiber carries `lanes` (its own pending work) and `childLanes` (the OR of every lane pending anywhere below it) — so a parent fiber's `childLanes` is precomputed the moment its children got their updates, via `mergeLanes` bubbling up the tree during the update. At render time React tests one bitmask per fiber: `childLanes & renderLanes`. Zero means "nothing in this entire subtree needs this render" — skip it, don't even descend.

```
App        childLanes: SyncLane | DefaultLane   ← something below needs work
 ├─ Header  childLanes: 0                        ← skip entirely, no descent
 └─ List    childLanes: DefaultLane              ← descend, List itself may bail
```

Concretely: a large static sidebar that never receives updates has `childLanes: 0` forever. Every re-render of `App`, React checks that one field and moves straight past the whole sidebar subtree without calling a single component inside it. This is the mechanism behind "children re-render by default, unless something opts out" *not* being as expensive as it sounds (Module 4 §4, "Children re-render by default") — `childLanes` prunes the parts of the tree that provably have nothing to do, before React ever gets to the point of deciding whether to bail via `memo`.

**Q: What happens if a high-priority update arrives mid-render?**
React abandons whatever it was building in the workInProgress tree, throws that partial work away completely, and restarts the render loop at the new, higher-priority lane. Once that urgent work commits, React comes back and redoes the lower-priority work from scratch — it doesn't resume where it left off, because the abandoned tree might be based on stale assumptions the interrupting update invalidated.

```
Filtering 10,000 rows (low priority)  ─┐
                                        ├─ user types a character (SyncLane, high)
     [abandoned, restarted later]  ◄───┘
Keystroke renders and commits first
Filter work restarts from scratch afterward
```

This is only safe because of double buffering (§4): the abandoned tree was the *workInProgress* copy, never the one on screen. `current` sat untouched the entire time, so the user never saw a flicker or a half-filtered list — they saw their keystroke land instantly, then the filtered results catch up a moment later.

The cost lands on your component code, not the user: a component involved in the abandoned render may run two, three, or more times for what is, from the user's perspective, a single logical update. That's not a bug to work around — it's the concrete reason render must be pure (Module 2 §5.1, Module 4 §9). A `fetch` or a mutated module-level variable in that component would fire once per discarded attempt, not once per meaningful change, and there'd be no error to tell you it happened.

---

## 9. Common Mistakes

- ❌ *"Fiber is the Virtual DOM."* Different layers — elements are *what*, Fiber is *how*.
- ❌ *"A fiber is a DOM node copy."* It holds state, effects, and lanes; only host fibers reference a DOM node, via `stateNode`.
- ❌ *"React rebuilds the fiber tree every render."* It reuses the alternate buffer — at most two trees ever exist.
- ❌ *"Concurrent means multithreaded."* Single-threaded. React just yields between units of work.
- ❌ *Doing side effects in render* because "it works." It works until a transition or Suspense makes React re-run your component.

---

## 10. Official Documentation References

- [React 16.0 announcement](https://legacy.reactjs.org/blog/2017/09/26/react-v16.0.html)
- [React 18: concurrent features](https://react.dev/blog/2022/03/29/react-v18)
- [`useTransition`](https://react.dev/reference/react/useTransition) · [`startTransition`](https://react.dev/reference/react/startTransition)
- Source: `ReactFiber.js`, `ReactFiberWorkLoop.js`, `ReactFiberLane.js` in [facebook/react](https://github.com/facebook/react/tree/main/packages/react-reconciler/src)

⚠️ Fiber internals are **implementation details**, not public API. Field names change between versions. Understand them to reason about behavior — never depend on them in application code.

---

## 11. Revision Notes

1. A **fiber** is one work unit per component — a plain object with state, effects, and priority.
2. Fiber replaced the **stack reconciler**, whose recursion couldn't be interrupted.
3. Tree links are `child` / `sibling` / `return`. Traversal is recursive *in concept*, but React tracks the position in its own `workInProgress` pointer rather than the JS call stack — that's what makes it pausable.
4. **`stateNode`**: real DOM node for host fibers, `null` for function components. *(Verified.)*
5. State is associated with a fiber **through the hook list** at `memoizedState` — a linked list matched **by position**, with no names or keys. *(Verified.)*
5b. **Elements die every render; fibers persist.** That's why state survives.
5c. Hooks can't be conditional because a missing call shifts every later hook onto the wrong slot.
6. **Double buffering**: `current` + `workInProgress`, linked by `alternate`. Commit is one pointer swap. *(Verified.)*
7. Render phase: interruptible, pure, can run twice. Commit: synchronous, uninterruptible.
8. **Lanes** are a priority **bitmask** — a *set*, not a number, so one fiber can carry work at several priorities and React can render a subset. Combined with `mergeLanes(a,b) => a | b`. `childLanes` lets React skip subtrees.
9. **Effect flags** tell commit what to do; `subtreeFlags` allows skipping. Called `effectTag` before React 17.
10. Commit has three passes: before-mutation → mutation → layout, then paint, then passive effects.

**Soundbites**
- "Fiber moved rendering off the call stack so React could pause it."
- "Two trees means abandoning work costs nothing."
- "State is tied to the fiber through the hook list — matched by position, not by name."
- "Elements are per-render; fibers are per-mounted-component."
- "Concurrent isn't parallel — it's yielding between units of work."

---

## 12. Practice Exercises

**1 — Find the fiber tree.** In a browser, grab a container element and look for its `__reactContainer$...` property. Follow `.stateNode.current` to the root fiber, then walk `child` / `sibling`. Confirm host fibers have a real `stateNode` and function fibers don't.

**2 — Watch the buffers swap.** Log `fiberRoot.current.child` before and after a `setState`. Confirm the object identity changed and that `current.alternate` is the original. Then click a third time and confirm it swaps *back* — proving only two trees ever exist. ([`buffers.cjs`](./verify/buffers.cjs) does exactly this.)

**2b — Prove the spare isn't stale.** After several updates, check that the recycled fiber holds the latest committed state and the same `stateNode`, not values from its previous use. ([`preserve.cjs`](./verify/preserve.cjs).)

**3 — Find your hooks.** Locate `memoizedState` on a component fiber with two `useState` calls and walk the linked list via `.next`. Match the values to your state.

**4 — Block the thread.** Render 5,000 components with a busy loop in each, then type in an input. Wrap the update in `startTransition` and compare responsiveness.

**5 — Interview rehearsal.** 2 minutes: *"What is Fiber and why does it exist?"* Cover the stack reconciler's limitation, work units, double buffering, and interruptibility.

---

**Next:** [Module 4 — Virtual DOM & Diffing](./Module04-VirtualDOM-Diffing.md) — now that fibers are familiar, the reconciliation algorithm in full.
