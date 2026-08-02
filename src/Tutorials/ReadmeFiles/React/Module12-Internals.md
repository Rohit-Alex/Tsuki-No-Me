# Module 12 — React Internals

> Part of the [React Mastery course](./README.md). Previous: [Module 11 — React 16 → 19](./Module11-VersionHistory.md). Next: [Module 13 — Interview Preparation](./Module13-InterviewPrep.md).

Modules 3 and 4 covered fibers and diffing. This module covers what they left out: **the scheduler**, **synthetic events**, and **the commit phases** — the parts that make React feel responsive rather than merely correct.

Everything here is read from the React source or measured by running it. Scripts in [verify/](./verify/).

⚠️ These are **implementation details**, not public API. Understand them to reason about behaviour; never depend on them in app code.

---

## 1. The Scheduler — how React yields

From Module 3: rendering is interruptible because React tracks its position in a `workInProgress` pointer instead of the call stack. But *when* does it stop?

```js
while (workInProgress !== null && !shouldYield()) {
  workInProgress = performUnitOfWork(workInProgress);
}
```

Everything hinges on `shouldYield()`. Here it is, from the scheduler source:

```js
var frameYieldMs = 5;
var frameInterval = frameYieldMs;

function shouldYieldToHost() {
  var timeElapsed = exports.unstable_now() - startTime;
  if (timeElapsed < frameInterval) {
    // The main thread has only been blocked for a really short amount of time;
    // smaller than a single frame. Don't yield yet.
    return false;
  }
  return true;
}
```

**React works for 5 milliseconds, then hands the browser back control.** That's the whole mechanism — no frame-deadline maths, no `requestIdleCallback`. Just a 5ms budget.

**Why 5ms?** A 60fps frame is ~16.7ms. Working in 5ms slices means React never holds the thread long enough to drop a frame, even if the browser needs the rest for layout, paint, and input.

**Analogy:** a **considerate speaker in a conversation**. Rather than talking for ten minutes straight, they say a sentence and pause — so if you need to interrupt, you can. React speaks for 5ms, pauses to check if anything more urgent came up, then continues.

### Priority levels — real timeouts from the source

```js
var IMMEDIATE_PRIORITY_TIMEOUT     = -1;              // already expired — run now
var USER_BLOCKING_PRIORITY_TIMEOUT = 250;             // clicks, typing
var NORMAL_PRIORITY_TIMEOUT        = 5000;            // ordinary updates
var LOW_PRIORITY_TIMEOUT           = 10000;           // transitions
var IDLE_PRIORITY_TIMEOUT          = maxSigned31BitInt;   // never times out
```

Each task gets an expiry = `now + timeout`. Tasks live in a **min-heap** ordered by expiry, so the most urgent is always at the top.

The timeouts prevent starvation. A low-priority task keeps getting bumped by urgent work — but after 10 seconds it *expires*, and expired tasks jump the queue. Nothing waits forever.

### Why `MessageChannel`, not `setTimeout`

```js
// We prefer MessageChannel because of the 4ms setTimeout clamping.
var channel = new MessageChannel();
schedulePerformWorkUntilDeadline = function () {
  port.postMessage(null);
};
```

Browsers clamp nested `setTimeout(fn, 0)` to a **4ms minimum**. With a 5ms work budget, that's ~80% overhead wasted on waiting. `MessageChannel` posts a task with no clamp — React yields and resumes almost immediately.

That comment is in React's source verbatim. It's a great answer to "how does React yield to the browser?"

---

## 2. Lanes — priority as a bitmask

Covered in Module 3 §6; the mechanical detail here.

```js
const SyncLane            = 0b0000000000000000000000000000001;
const InputContinuousLane = 0b0000000000000000000000000000100;
const DefaultLane         = 0b0000000000000000000000000010000;
const TransitionLanes     = 0b0000000001111111111111110000000;
const IdleLane            = 0b0100000000000000000000000000000;
```

Combined with a single bitwise OR:

```js
function mergeLanes(a, b) { return a | b; }
root.pendingLanes |= updateLane;
```

The reason it's a **set** and not a number: one fiber can carry an urgent click update *and* a pending transition simultaneously. React renders the urgent lanes now and leaves the rest queued — `lanes & ~completedLanes` clears exactly what finished.

**Scheduler priorities vs lanes** — a common confusion:

| | Scheduler priority | Lanes |
|---|---|---|
| Lives in | The `scheduler` package (generic) | React's reconciler |
| Granularity | 5 levels | 31 bits |
| Answers | *When should this callback run?* | *Which updates render together?* |

React maps lanes → scheduler priority when it schedules the render.

---

## 3. Synthetic events

React doesn't attach a listener to every element. It attaches listeners at the **root container** and dispatches to your handlers itself.

Verified by counting real `addEventListener` calls ([`events.cjs`](./verify/events.cjs)):

```
listeners on document      : 1
listeners on root container: 130   ← React 17+ attaches HERE
  sample: abort, auxclick, cancel, canplay, canplaythrough …
```

**130 listeners on the root container, 1 on document.** React registers nearly every event type once, up front, at the root.

Before React 17 these were on `document` — which is why two React versions on one page fought over events (Module 11).

### The synthetic event object

```
Synthetic event constructor: SyntheticBaseEvent
  has nativeEvent? true | native type: MouseEvent
  target === real DOM node? true
```

`SyntheticBaseEvent` wraps the browser's real event. Why bother?

1. **Consistency** — one API across browsers.
2. **Delegation** — React needs to reconstruct the propagation path through the *React* tree, not the DOM tree. This is exactly why portal events bubble to the React parent (Module 5 §7, verified).
3. **Priority** — React reads the event type to pick a lane. A click gets `SyncLane`; a scroll gets `InputContinuousLane`.

The native event is always available at `e.nativeEvent`.

**Analogy:** synthetic events are a **receptionist**. Rather than every office having its own doorbell, calls arrive at one desk and get routed. The receptionist also translates between languages (browser differences) and knows which calls are urgent.

> **Pooling was removed in React 17.** Old code called `e.persist()` because React recycled event objects and nulled their fields after the handler. You can now read `e.target` in a `setTimeout` safely.

---

## 4. The update queue

`setState` doesn't overwrite a value — it **appends to a circular linked list** on the hook.

```jsx
setCount(c => c + 1);
setCount(c => c + 1);
setCount(c => c + 1);      // → +3, not +1
```

Each call creates an update object queued on that hook. During the next render React walks the queue and applies them in order.

That's why the updater form composes and the direct form doesn't:

```jsx
setCount(count + 1);   // queues the VALUE 1 — three times → still 1
setCount(c => c + 1);  // queues a FUNCTION — three times → 3
```

Each hook has its own queue (Module 3 §3), which is how React knows which updates belong to which piece of state.

**Analogy:** an update queue is a **to-do list, not a whiteboard**. Writing "count = 1" three times on a whiteboard leaves one instruction. Adding "increment count" to a list three times leaves three.

---

## 5. Commit phases in detail

Module 3 §7 introduced the three passes. The ordering is what matters:

```
━━━ RENDER PHASE ━━━  interruptible, pure, no DOM access
        ↓
━━━ COMMIT PHASE ━━━  synchronous, uninterruptible
  1. BEFORE MUTATION
       getSnapshotBeforeUpdate — read the OLD DOM (scroll position, size)
       ↓
  2. MUTATION
       insert / update / delete DOM nodes
       useLayoutEffect CLEANUP runs here
       ↓
     ── fiberRoot.current = workInProgress ──   the atomic swap
       ↓
  3. LAYOUT
       refs attached
       useLayoutEffect SETUP runs here — DOM is updated, user hasn't seen it
       ↓
  BROWSER PAINTS
       ↓
  PASSIVE EFFECTS
       useEffect cleanup, then useEffect setup
```

Three consequences worth knowing:

**Why `getSnapshotBeforeUpdate` exists** — it's the only place you can read the DOM *before* mutation. Capturing scroll position to restore after a list update needs the old value.

**Why the `current` swap happens between mutation and layout** — layout effects must see the *new* tree as current, so refs and measurements are consistent.

**Why passive effects run after paint** — so a slow `useEffect` can't delay what the user sees. Layout effects don't get that protection, which is why slow work in `useLayoutEffect` directly delays paint (Module 4 §4).

### Effect flags decide what runs

```js
Placement = 0b0000000000010;   // insert or move
Update    = 0b0000000000100;   // update props / run effects
Deletion  = 0b0000000001000;   // remove
```

`subtreeFlags` aggregates descendants — so if a subtree has no flags, commit skips it entirely rather than walking it.

> Called `effectTag` before React 17, and the old linked "effect list" was replaced by `subtreeFlags`. Older articles use the old names.

---

## 6. Interview Questions

### Basic

**Q: What is the React scheduler?**
The part that decides *when* rendering work runs. It keeps a priority queue of tasks and lets React pause between units of work so the browser can paint and handle input.

**Q: What are synthetic events?**
React's wrapper around native browser events. React attaches listeners at the root container and dispatches through the React tree, giving consistent cross-browser behaviour and letting it assign priority by event type.

**Q: What happened to event pooling?**
Removed in React 17. React used to recycle event objects, so reading `e.target` asynchronously gave `null` unless you called `e.persist()`. Modern browsers made the optimisation unnecessary.

### Intermediate

**Q: How does React decide to yield?**
A time budget. `shouldYieldToHost` returns true once 5ms have elapsed since the work loop started — `frameYieldMs = 5` in the source. React works for 5ms, hands control back, and resumes on the next task.

**Q: Why does React use `MessageChannel` instead of `setTimeout`?**
Browsers clamp nested `setTimeout` to a 4ms minimum. Against a 5ms work budget that's mostly waiting. `MessageChannel` schedules a task with no clamp. React's source says this in a comment.

**Q: Where does React attach event listeners?**
The root container, since React 17 — verified: 130 listeners on the container versus 1 on document. Before 17 they were on `document`, which stopped two React versions coexisting on one page.

**Q: Why does `setCount(c => c + 1)` three times give +3 but `setCount(count + 1)` gives +1?**
Updates queue on the hook as a linked list. The direct form queues the same computed value three times; the updater form queues three functions, each receiving the result of the previous one.

### Senior

**Q: How do scheduler priorities and lanes differ?**
Scheduler priorities (5 levels, with timeouts from 250ms to never) are generic — *when should this callback run?* Lanes are React's own 31-bit bitmask — *which updates render together?* Lanes can express a **set**, so one fiber can hold urgent and transition work at once. React maps lanes to a scheduler priority when scheduling.

**Q: How does React prevent low-priority work from starving?**
Every task gets an expiry (`now + timeout`) and lives in a min-heap. Low priority is 10 seconds, idle never expires. Once a task passes its expiry it's treated as urgent and jumps the queue, so background work always lands eventually.

**Q: Why does the `current` pointer swap between the mutation and layout phases?**
Because layout effects and refs must observe the new tree as current — if they ran while `current` still pointed at the old tree, measurements and ref reads would be inconsistent. Swapping after mutation but before layout gives layout effects an updated DOM and an updated fiber tree, still before paint.

**Q: Why can't React just use `requestIdleCallback`?**
Its cadence is too unpredictable and it isn't supported consistently; it can also delay work far longer than React wants for user-visible updates. React needs a predictable small slice, so it implements its own budget with `MessageChannel` and a 5ms cutoff.

**Q: Why does React wrap native events at all?**
Three reasons: consistent cross-browser semantics; propagation through the **React** tree rather than the DOM tree (which is why portal events reach their React parent); and priority assignment — the event type selects the lane, so a click renders synchronously while a scroll doesn't.

---

## 7. Common Mistakes

- ❌ "React uses `requestIdleCallback`." It uses `MessageChannel` with a 5ms budget.
- ❌ "React yields every frame." It yields every 5ms of *work*, which is finer-grained.
- ❌ "React adds a listener per element." One set at the root container — 130 of them, once.
- ❌ Calling `e.persist()` in modern React. Pooling was removed in 17.
- ❌ Expecting `e.stopPropagation()` to stop non-React listeners on ancestors — React's propagation follows the React tree.
- ❌ Confusing scheduler priorities with lanes.
- ❌ Relying on fiber field names in app code. They change between versions.

---

## 8. Official References

- Source: [`ReactFiberWorkLoop.js`](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js) · [`ReactFiberLane.js`](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberLane.js) · [`Scheduler.js`](https://github.com/facebook/react/blob/main/packages/scheduler/src/forks/Scheduler.js)
- [React 17: event delegation change](https://legacy.reactjs.org/blog/2020/10/20/react-v17.html)
- [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore) · [`flushSync`](https://react.dev/reference/react-dom/flushSync)

---

## 9. Revision Notes

1. **`shouldYieldToHost` uses a 5ms budget** (`frameYieldMs = 5`) — not frame deadlines, not `requestIdleCallback`.
2. **`MessageChannel`, not `setTimeout`**, because of the browser's 4ms clamp. React's source says so.
3. **Scheduler timeouts:** immediate `-1`, user-blocking `250ms`, normal `5000ms`, low `10000ms`, idle never. Tasks in a **min-heap**; expiry prevents starvation.
4. **Lanes are a set** (31-bit mask), combined with `a | b`. Scheduler priority answers *when*; lanes answer *which together*.
5. **Listeners live on the root container** — verified 130 vs 1 on document. Moved there in React 17 to allow multiple versions.
6. `SyntheticBaseEvent` wraps `nativeEvent` for consistency, React-tree propagation, and priority.
7. **Pooling removed in 17** — `e.persist()` is obsolete.
8. **Updates are a queue**, so `setCount(c => c+1)` composes and `setCount(count+1)` doesn't.
9. **Commit order:** before-mutation → mutation → **`current` swap** → layout → paint → passive.
10. `subtreeFlags` lets commit skip whole subtrees.

**Soundbites**
- "React works for 5ms, then lets the browser breathe."
- "MessageChannel, because setTimeout clamps to 4ms and the budget is 5."
- "One set of listeners at the root, not one per element."
- "Synthetic events propagate through the React tree, not the DOM tree."
- "The update queue is a to-do list, not a whiteboard."

---

## 10. Practice Exercises

**1 — Find the yield budget.** Open `node_modules/scheduler/cjs/scheduler.development.js` and locate `frameYieldMs` and `shouldYieldToHost`. Read the comment above the early return.

**2 — Count the listeners.** Wrap `addEventListener` on `document` and on your root container, mount an app, and compare the counts. You should see roughly 130 versus 1.

**3 — Prove pooling is gone.** In a click handler, `setTimeout(() => console.log(e.target), 100)`. Confirm it works without `persist()`.

**4 — Watch the queue.** Call `setCount(count + 1)` three times, then `setCount(c => c + 1)` three times. Explain the difference in terms of what got queued.

**5 — Order the commit.** Log in the render body, `getSnapshotBeforeUpdate` (class), `useLayoutEffect`, and `useEffect`. Predict the order, then verify.

**6 — Starve a task.** Fire continuous high-priority updates while a transition is pending, and observe that the transition still completes — the expiry made it urgent.

**7 — Interview rehearsal.** 2 minutes: *"How does React stay responsive during a large render?"* Cover the work loop, the 5ms budget, `MessageChannel`, lanes, and why commit can't be interrupted.

---

**Next:** [Module 13 — Interview Preparation](./Module13-InterviewPrep.md) — puzzles, debugging, machine coding, system design.
