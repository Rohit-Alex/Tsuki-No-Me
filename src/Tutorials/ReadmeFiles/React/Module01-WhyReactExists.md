# Module 1 — Why React Exists

> Part of the [React Mastery course](./README.md). Prerequisite: none. Next: [Module 2 — React Fundamentals](./Module02-ReactFundamentals.md).

This module is motive, not mechanism — deliberately light. Every later module explains *how* React works; this one explains *why it exists at all*. Interviews almost always open here, and the gap between a mid-level and a senior answer lives in this material.

> Mid-level answer: *"Virtual DOM, it's fast."*
> Senior answer: *"Manually keeping the DOM in sync with state doesn't scale. React makes UI a derivation of state instead — and trades some raw speed for that guarantee."*

---

## 1. Introduction

React is a JavaScript **library** for building user interfaces. Not a framework — no router, no data layer, no HTTP client. That narrowness is deliberate (§3).

The one idea underneath everything:

> **UI is a function of state.** You describe what the screen should look like for a given state. React works out which DOM operations get it there.

JSX, the Virtual DOM, Fiber, hooks, Suspense — all machinery serving that sentence.

📚 [react.dev](https://react.dev/) · [Thinking in React](https://react.dev/learn/thinking-in-react)

---

## 2. Historical Context

```text
Static HTML
   ↓
Server-rendered pages  (every interaction = full reload)
   ↓
AJAX + jQuery          (page persists, data changes underneath)
   ↓
Single Page Apps       (manual DOM manipulation everywhere)
   ↓
State synchronization problems   ← the actual pain
   ↓
React (2013)
```

**Important correction:** by 2013, AJAX had already solved full page reloads. React was **not** created to fix reloads or because "the DOM is slow." It was created because *keeping the UI in sync with changing state* had become the dominant engineering problem.

### 2.1 What went wrong: manual DOM mutation

jQuery (2006) made DOM APIs pleasant but left developers deciding **when**, **where**, and **how** to update every element:

```js
$('#username').on('input', function () {
  var value = $(this).val();
  // every consequence of "username changed", listed by hand
  $('#greeting').text('Hello, ' + value);
  $('#submit').prop('disabled', value.length === 0);
  $('#char-count').text(value.length + '/20');
});
```

Three problems, and these *are* the answer to "why React exists":

**① State lives in the DOM.** Where is the current username? In `$('#username').val()` — inside a widget. To ask "is this form valid?" you must interrogate the screen. State stored in the view can't be tested or serialized without a browser.

**② You hand-write every transition.** Add a field and every handler must know about it. The code scales with the number of **state transitions**, not the number of states. Miss one edge and you get the classic bug: *the submit button stays disabled after the user fixes the error.* Nothing throws. The screen just lies.

**③ The same data appears in many places.** Facebook's canonical case was the unread-message count — shown in the chat window, header badge, sidebar, and notifications, and they would disagree:

```
message data
 ├── Header badge
 ├── Sidebar
 ├── Chat window
 └── Notifications      ← N code paths mutating shared state → guaranteed drift
```

### 2.2 The MVC era got the diagnosis right, the cure wrong

Backbone, Knockout, Ember, and AngularJS all correctly said *state should not live in the DOM*. Their fix was **two-way data binding**:

```html
<input ng-model="user.name">
<p>Hello, {{ user.name }}</p>
```

Great for forms, but it made causality untraceable — if views update models and models update views, any change can propagate anywhere. AngularJS's **digest cycle** re-ran every watcher until values stopped changing, giving up after 10 passes with `10 $digest() iterations reached` — the framework admitting it couldn't find a stable answer.

By 2012 the industry knew both options failed:
- State in the DOM → unmaintainable *(jQuery)*
- Two-way binding → unpredictable *(MVC)*

### 2.3 React's origin

| When | What |
|---|---|
| ~2010 | **XHP** — Facebook's PHP extension composing HTML as typed, nestable components. React's component model, server-side. |
| ~2011 | **Jordan Walke** builds an early prototype (referenced as *FaxJS* / *Bolt*), first shipped on Facebook Ads. |
| 2012 | Instagram acquisition — a forcing function to decouple React from Facebook infra. |
| **May 2013** | **Open-sourced at JSConf US.** |

**The reception was hostile** — JSX was seen as violating separation of concerns. React's rebuttal is a genuine interview answer:

> Separating markup from logic by **file type** separates *technologies*, not concerns. A dropdown's markup and behavior are one concern and change together.

---

## 3. Motivation — Design Principles

React's behaviour isn't a pile of API decisions. Almost every feature traces back to a handful of principles the React team wrote down early.

| Principle | What it means | What it gave us |
|---|---|---|
| **Composition** | Components combine without knowing about each other | Components, props, children, context, custom hooks |
| **Common abstraction** | Let the community experiment, then standardise the pattern | Hooks, Suspense, Server Components, Actions |
| **Escape hatches** | Provide imperative exits where declarative can't reach | `ref`, `createPortal`, `flushSync` |
| **Scheduling** | You describe UI; React decides *when* to render | Fiber, concurrent rendering, lanes, transitions |
| **Stability** | Smooth upgrades over rapid API churn | Codemods, long deprecations, React 17 |
| **Interoperability** | Drop into an existing app, no rewrite required | Incremental adoption |

**The one that matters most is Scheduling**, because everything modern follows from it:

```
Declarative UI  →  React controls rendering  →  Fiber  →  Concurrent Rendering
                        →  Lanes  →  Transitions  →  Suspense  →  Server Components
```

You never call `document.body.appendChild()`. You return a description and React decides when to run it. That one trade is why React can pause, prioritise, and interrupt rendering — and it's the seed of Modules 3, 4, 7, and 9.

> **If you remember one sentence:** *developers own the UI description, React owns the rendering process.*

📚 **Full deep dive with code examples for each principle:** [Module 1a — Design Principles](./Module01a-DesignPrinciples.md)

---

## 4. Mental Model

```
IMPERATIVE (jQuery)              DECLARATIVE (React)
  state changed                    state changed
    → you compute the diff           → you describe the new UI
    → you write DOM mutations        → React computes the diff
    → miss one → stale UI            → React writes the DOM
                                     → can't miss one
```

The payoff isn't speed. **A category of bug becomes unrepresentable.** "I forgot to update the badge" can't happen if you never update the badge — you describe what it shows, and React makes it so.

**The equation:**

```
UI = f(state)
```

`f` is your component tree, and its output is a *description*, not DOM nodes.

⚠️ **The subtlety everyone trips on:** "re-render" does **not** mean "touch the DOM." It means "call `f` again." Most re-renders produce identical output and cause **zero** DOM mutations. Confusing these two is the #1 cause of misguided `memo` usage (Module 9).

**One-way data flow:**

```
  state ──────────→ UI
    ↑                │
    └── setState ────┘  (explicit)
```

Given a wrong value on screen, you trace: which state produced it → which `setState` wrote it. Finite and local — exactly what the digest cycle gave away.

---

## 5. Internal Working (overview)

Detail comes in Modules 2–3. The shape:

```
Component → JSX → (Babel) → jsx() call → React Element (plain object)
                                              ↓
                                          Fiber tree
                                              ↓
                                   render phase (interruptible, pure)
                                              ↓
                                    commit phase (sync, uninterruptible)
                                              ↓
                                        DOM mutations
```

Three things to carry forward:

1. **Elements are plain objects** — cheap to create. That's what makes "re-render everything" viable: you recreate *descriptions*, not DOM.
2. **Render is interruptible; commit is not.** Work that may be thrown away and redone must have no side effects — this is *why* render must be pure.
3. **"Virtual DOM" is a strategy, not a module.** There's no `VirtualDOM` class in the source. Saying *"React keeps a copy of the DOM in memory"* is a red flag — Fiber nodes hold state, effects, and priorities. Say **description**, never **copy**.

---

## 6. Step-by-Step Execution

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

1. **Initial render** — React calls `Counter()`, gets an element describing a button with `"Count: 0"`.
2. **Commit** — creates a real `<button>` and appends it. *The only time React builds DOM wholesale.*
3. **Click** — synthetic event system dispatches to your handler.
4. **`setCount(1)`** — does **not** re-render immediately. Enqueues an update and schedules work. Updates in the same tick are **batched** (React 18: everywhere, including promises and timeouts).
5. **Re-render** — `Counter()` runs again, returns a *new* element with `"Count: 1"`. **Nothing has touched the DOM yet.**
6. **Reconciliation** — same type at the same position → **reuse the existing DOM node**; only the text differs.
7. **Commit** — one text write. The button node is never recreated, so focus and selection survive.

Step 6 is the payoff: you wrote "the button says Count: 1"; React worked out that one text update was sufficient.

---

## 7. Practical Example

**Vanilla — you own every transition:**

```js
let count = 0;
function render() {
  display.textContent = 'Count: ' + count;
  resetBtn.disabled = count === 0;   // must stay right everywhere count changes
}
button.addEventListener('click', () => { count++; render(); });
resetBtn.addEventListener('click', () => { count = 0; render(); });
render();  // and don't forget the initial call
```

Notice this is already drifting toward React — one `render()` recomputing everything from `count` *is* the declarative idea, hand-rolled.

**React — you own the description:**

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(0)} disabled={count === 0}>Reset</button>
    </>
  );
}
```

`disabled={count === 0}` **cannot go stale.** It's not an instruction run once; it's a standing description of the relationship.

**Where it pays off most** — Facebook's bug, structurally eliminated:

```jsx
function Dashboard({ notifications }) {
  const unread = notifications.filter(n => !n.read).length;   // derived, not stored
  return (
    <>
      <Header unreadCount={unread} />
      <Sidebar unreadCount={unread} />
      <NotificationList items={notifications} />
    </>
  );
}
```

Three views, one computation. They cannot disagree — not because the developer was careful, but because there's nothing to keep in sync.

> **Interview framing:** "React converts a synchronization problem into a derivation problem." Synchronization needs perpetual vigilance; derivation is correct by construction.

---

## 8. Performance Considerations

**❌ "React is faster than vanilla JS."** False, and interviewers push on it. React sits *on top of* the DOM APIs — it adds component execution, element allocation, and diffing, then performs the same DOM writes.

**✅ "React is fast enough, and makes the fast path the default":**

1. **Batching** — many state updates in a tick → one render, one commit.
2. **Minimal DOM writes** — diffing happens on cheap plain objects; only necessary mutations are issued, grouped, avoiding accidental layout thrashing.
3. **Scheduling (18+)** — urgent updates (typing) can preempt non-urgent ones (filtering a big list).

**The trade:** you give up a constant factor of raw speed for consistency guarantees and performance that degrades *gracefully*, instead of depending on every developer hand-optimizing forever.

**When React is the wrong tool** — saying this unprompted signals judgment:
- Mostly-static content → Astro/SSG; hydrating static text is pure cost.
- 60fps canvas/WebGL hot loops → bypass React for the hot path.
- Hard bundle budgets → Preact (~3KB) or Svelte.

---

## 9. Edge Cases & Nuances

- **Library, not framework — and it's load-bearing.** Excluding routing/data-fetching enables gradual adoption; the cost is ecosystem fragmentation (the gap Next.js fills).
- **Not only for the web.** `react` (reconciler + component model) is separate from renderers — `react-dom`, React Native, Ink. Split formalized in v0.14 (Oct 2015).
- **The VDOM was never the point.** Svelte and Solid achieve the same declarative model without one. The essence is `UI = f(state)` plus a component model.
- **Re-render ≠ DOM update.** Repeated because it's the most common misconception.

---

## 10. Comparison

| | Model | Update mechanism | Trade-off |
|---|---|---|---|
| **Vanilla/jQuery** | Imperative | Direct DOM calls | Max control, max drift risk |
| **AngularJS** | Two-way binding | Digest cycle | Less glue; causality unclear |
| **React** | Declarative | VDOM diff + Fiber | Predictable; runtime cost |
| **Vue 3** | Declarative + reactivity | Proxy-based + VDOM | Ergonomic; more magic |
| **Svelte** | Compiled | Compiler-generated updates | Tiny runtime; magic in compiler |
| **Solid** | Signals | Fine-grained, **no VDOM** | Very fast; different mental model |

**Direction of travel:** Svelte and Solid showed fine-grained reactivity avoids re-running components at all. React's answer is the **React Compiler** (v1.0, 2025) — keep the simple "re-run the function" model and let a compiler insert memoization. React bets the mental model is worth preserving and the gap is a tooling problem; Solid bets the opposite.

---

## 11. Interview Questions

### Basic

**Q: What is React?**
A JavaScript library for building UIs from composable components, where UI is a declarative function of state.

**Q: Library or framework?**
A library — it renders UI and leaves routing, data fetching, and global state to you. Matters because you assemble your own stack, and because React can be adopted incrementally.

**Q: Declarative vs imperative?**
Imperative: you write the steps. Declarative: you describe the result and the library derives the steps. Declarative code can't drift because you never write the transitions.

**Q: What problem did React solve at Facebook?**
Views showing the same data disagreeing — the unread-count bug. React makes every view derive from one source of state, so divergence is structurally impossible.

### Intermediate

**Q: Why is the Virtual DOM faster than the real DOM?**
⚠️ *Trap — the premise is wrong.* They aren't comparable. The VDOM doesn't replace DOM operations; it decides *which* to perform. Diffing plain objects is cheap, so React can batch a minimal set of real mutations. A hand-written optimal mutation still beats React doing the same one.

**Q: Was React created to avoid page reloads?**
No — AJAX had already solved that by 2013. React was created for *state synchronization*, not navigation.

**Q: What was wrong with two-way data binding?**
Any component can change any bound value, so causality becomes a graph search. AngularJS's digest gave up after 10 passes with `10 $digest() iterations reached`.

**Q: Why JSX, given the backlash?**
Separating markup from logic by *file type* separates technologies, not concerns. Markup and behavior change together. JSX is also just sugar for function calls — no runtime semantics.

### Senior

**Q: Why one-way data flow when two-way is more convenient?**
Convenience at small scale vs debuggability at large scale. One-way makes every change explicit — more typing, but the trace from wrong pixel to responsible `setState` stays finite and local. Facebook optimized for large, long-lived codebases.

**Q: "React is fast." Attack that statement.**
Imprecise. React is *slower* than optimal hand-written DOM code. What it provides is a well-optimized default path (batching, minimal writes, no accidental thrashing) and graceful degradation as the app grows — rather than relying on universal developer discipline.

**Q: React ships no router or data layer. Defend that.**
*Common abstraction* (absorb a feature only once its shape is proven) and *interoperability* (must drop into existing apps). Bundling a router would force decisions on every adopter and block incremental adoption. Cost: fragmentation.

**Q: The "scheduling" principle predated Fiber by years. Trace its consequences.**
Because components return descriptions rather than mutating the DOM, React controls when they run — so rendering becomes deferrable. Everything follows: Fiber made work interruptible, lanes gave updates priorities, concurrent rendering let urgent work preempt background work, `useTransition` exposed it as API, Suspense used it for async boundaries. None of it is possible if calling a component immediately mutates the DOM — which is also why render must be pure.

**Q: If Svelte and Solid are faster, why is React still dominant?**
Ecosystem, hiring, and production-tested stability outweigh constant-factor performance for most teams. Technically, React bets "re-run the function" is simpler and more debuggable, and that the gap is solvable by a compiler.

---

## 12. Common Mistakes

- ❌ *"React was created because the DOM is slow."* It was created because manual state↔UI synchronization doesn't scale.
- ❌ *"React is a framework."* Library — the difference shows the moment you need routing.
- ❌ *"The VDOM is a copy of the real DOM."* It's a *description*. Fiber nodes carry state, effects, and priority.
- ❌ *Assuming re-render means DOM update*, then sprinkling `React.memo` everywhere — usually a net loss.
- ❌ *Reaching for `document.getElementById` in a component* — almost always means state is modeled wrong.
- ❌ *Reciting features without motives.* Anyone can list hooks; explaining *why* `useEffect` exists is the signal.

---

## 13. Official Documentation References

- [react.dev](https://react.dev/) · [Thinking in React](https://react.dev/learn/thinking-in-react) · [Describing the UI](https://react.dev/learn/describing-the-ui)
- [Design Principles](https://legacy.reactjs.org/docs/design-principles.html) *(legacy docs; principles still current)*
- [React Versions](https://react.dev/versions) · [React v16.0 announcement](https://legacy.reactjs.org/blog/2017/09/26/react-v16.0.html) · [React Compiler](https://react.dev/learn/react-compiler)

**Version context** (verified against react.dev/versions): latest stable **React 19.2** (Oct 2025); 19.x at v19.2.7 (June 2026); React Compiler v1.0 (2025).

---

## 14. Revision Notes

**One-liner:** React exists because manually synchronizing a mutable DOM with changing state doesn't scale. React makes UI a *derivation* of state instead.

**Key takeaways**
1. `UI = f(state)` — everything else is machinery serving this.
2. React turns **synchronization** into **derivation**.
3. Not about page reloads (AJAX solved that) and not about the DOM being slow.
4. One-way data flow chosen for debuggability over two-way's convenience.
5. The VDOM is a *strategy*, not the essence — Svelte/Solid prove it.
6. React is **not** faster than optimal vanilla DOM; it makes the fast path the default.
7. **Scheduling** is the seed of Fiber, concurrency, transitions, and Suspense.
8. **Re-render ≠ DOM update.**

**Timeline**

```
2006  jQuery          2010  Backbone/Knockout, XHP     2011  FaxJS/Bolt
2013  ★ Open-sourced at JSConf US — JSX widely disliked
2015  v0.14 splits react / react-dom · React Native
2017  ★ React 16 — Fiber rewrite, error boundaries, portals, fragments
2020  React 17 — no new features; event delegation moves to root
2022  ★ React 18 — createRoot, concurrent rendering, automatic batching
2024  ★ React 19 — Actions, use, useOptimistic, useActionState
2025  React 19.2 · React Compiler v1.0
```

**Soundbites**
- "React turns synchronization into derivation."
- "Separating markup from logic by file type separates technologies, not concerns."
- "The Virtual DOM is a strategy, not the point."
- "React isn't faster than the DOM; it makes the fast path the default."

---

## 15. Practice Exercises

**1 — Feel the pain.** Build a todo list in plain JS: add, toggle, delete, filter, and a live "N items left" counter. Then add *"Clear completed is disabled when nothing is completed."* Count every place you had to touch — that's your intuition for §2.1 ②.

**2 — Convert it.** Rebuild in React. Note that "N items left" is *maintained* in one version and *derived* in the other.

**3 — Debug.** In the vanilla version, delete a completed item without updating the counter. Nothing errors — the UI just lies. Explain in two sentences why that bug class is unreachable in React.

**4 — Argue both sides.** Write a paragraph arguing a marketing site should *not* use React, then rebut it. Being able to argue both is the skill §8 tests.

**5 — Interview rehearsal.** 90 seconds, no notes: *"Why does React exist?"* Hit the problem (state↔UI sync), the failed attempts (jQuery, two-way binding), the reframe (`UI = f(state)`), and one honest trade-off.

---

**Next:** [Module 2 — React Fundamentals](./Module02-ReactFundamentals.md) — `createElement`, JSX compilation, elements, reconciliation, keys, Root API, StrictMode.
