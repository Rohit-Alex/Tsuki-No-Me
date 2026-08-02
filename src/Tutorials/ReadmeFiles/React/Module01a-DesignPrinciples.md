# Module 1a — React's Design Principles

> Deep dive companion to [Module 1 — Why React Exists](./Module01-WhyReactExists.md) §3. Read Module 1 first; come back here when you want the full picture.

Before learning React's APIs, it's important to understand **how the React team thinks**.

Almost every major React feature — Hooks, Fiber, Suspense, Concurrent Rendering, Server Components — can be traced back to a few core design principles.

These come from React's official [Design Principles](https://legacy.reactjs.org/docs/design-principles.html) document and explain **why React is designed the way it is**, not just how its APIs work.

---

## 1. Composition

> **Components should compose regardless of who wrote them.**

React is built around **composition**, not inheritance.

Instead of building large components that know about each other, React encourages building small independent components that can be combined to create larger applications.

```jsx
function Button() {
  return <button>Save</button>;
}

function Modal({ children }) {
  return (
    <div className="modal">
      {children}
    </div>
  );
}

function Page() {
  return (
    <Modal>
      <Button />
    </Modal>
  );
}
```

Notice that:

- `Button` doesn't know about `Modal`.
- `Modal` doesn't know about `Button`.
- They work together naturally.

This is possible because every component simply returns **React Elements**, allowing React to compose them into a tree.

### Why is composition important?

Without composition, components would need special integration logic:

```jsx
<Modal button={Button} />
```

or

```jsx
<Button insideModal />
```

Every component library would need to understand every other library. React avoids this by making components completely independent.

### Features inspired by Composition

Components · JSX · Props · Children · Context · Custom Hooks

### Interview Takeaway

> React favors **composition over inheritance**. Independent components can be combined without knowing about each other, making applications more reusable and maintainable.

---

## 2. Common Abstraction

> **If many developers solve the same problem repeatedly, React may provide a standard solution.**

The React team intentionally keeps the API surface small. Instead of adding features quickly, they first observe how the community solves problems. If the same pattern keeps appearing, React standardizes it.

### Example — Hooks

Before Hooks, developers reused stateful logic using many different patterns:

- Higher Order Components (HOCs)
- Render Props
- Mixins (very early React)
- Wrapper Components

Everyone solved the same problem differently. React observed this and introduced Hooks:

```jsx
const [count, setCount] = useState(0);
```

Now every application uses the same abstraction.

### Example — Suspense

Before Suspense:

```jsx
if (loading) {
  return <Spinner />;
}
```

Every application handled loading differently. React introduced Suspense as a common abstraction for asynchronous rendering.

### Example — Server Components

Different frameworks implemented SSR, streaming and hydration differently. React eventually introduced Server Components to provide a common model.

### Features inspired by Common Abstraction

Hooks · Suspense · Server Components · Actions (React 19)

### Interview Takeaway

> React doesn't introduce APIs quickly. It first lets the community experiment, then standardizes patterns that repeatedly prove useful.

---

## 3. Escape Hatches

> **Declarative programming covers most cases, but reality sometimes requires imperative code.**

React encourages developers to describe **what** the UI should look like:

```jsx
<button>{count}</button>
```

Not:

```js
button.innerText = count;
```

However, some problems cannot be solved declaratively.

### Example — Focusing an input

```jsx
const inputRef = useRef();

inputRef.current.focus();
```

There is no declarative way to say:

> "Focus this input right now."

React provides `ref` as an escape hatch.

### Example — Portals

Normally a component renders inside its parent. Sometimes a modal must render into `document.body`:

```jsx
createPortal(<Modal />, document.body);
```

Another escape hatch.

### Example — `flushSync()`

Normally React batches updates. Sometimes an immediate update is required:

```jsx
flushSync(() => {
  setOpen(true);
});
```

### Why are these called escape hatches?

React wants developers to stay inside the declarative model. Imperative APIs exist only for situations where the declarative model cannot express the required behavior.

### Senior Interview Insight

Junior developers often reach for `ref` first.

Senior developers ask:

> **Can this be solved declaratively first?**

Only if the answer is **no** should they use `ref`, `createPortal`, `flushSync`, or `useImperativeHandle`.

---

## 4. Scheduling (The Most Important Principle)

> **Because components describe UI instead of mutating the DOM, React controls when rendering happens.**

This principle is the foundation of modern React.

When you write:

```jsx
return <App />;
```

you're only describing the next UI. You're **not** updating the DOM yourself. This gives React complete control over rendering.

```
Developer
    ↓
Describe UI
    ↓
React decides
    • when to render
    • what priority to use
    • whether to pause
    • whether to continue later
```

Because React owns rendering, it can pause, resume, interrupt, batch updates, prioritize urgent work, and delay non-urgent work.

This single design decision enabled:

Fiber · Concurrent Rendering · Lanes · Automatic Batching · Transitions · Suspense · Selective Hydration

If developers manipulated the DOM directly:

```js
document.body.appendChild(...)
```

React could never pause or prioritize rendering. This is why React insists on the declarative model:

```
UI = f(state)
```

instead of

```
DOM = manual operations
```

### Interview Takeaway

> React's declarative programming model gives React ownership of rendering. That ownership enables scheduling, interruption, prioritization, batching, and all modern React performance features.

---

## 5. Stability

> **React values smooth upgrades over rapid API changes.**

React prefers gradual evolution instead of frequent breaking changes.

A great example is **React 17**, which intentionally introduced almost **no new features**. Instead it focused on making upgrades easier for large applications.

The React team also provides long deprecation periods, codemods, and gradual migration paths. This makes React suitable for applications with millions of lines of code.

### Interview Takeaway

> React optimizes for long-term maintainability rather than constantly introducing new APIs.

---

## 6. Interoperability

> **React should work inside existing applications, not require rewriting them.**

React was never designed as an "all-or-nothing" framework. A company with an existing PHP, jQuery, or Angular application could gradually adopt React:

```jsx
createRoot(document.getElementById("comments"))
  .render(<Comments />);
```

One widget today. Another widget next month. Eventually the whole application could become React.

This gradual adoption strategy played a major role in React's widespread adoption.

### Interview Takeaway

> One of React's biggest advantages over many frameworks was that it could be introduced incrementally instead of requiring a full rewrite.

---

## Summary

| Principle | Major Features Influenced |
|-----------|----------------------------|
| Composition | Components, Props, Context, Custom Hooks |
| Common Abstraction | Hooks, Suspense, Server Components, Actions |
| Escape Hatches | `ref`, `createPortal`, `flushSync`, `useImperativeHandle` |
| Scheduling | Fiber, Concurrent Rendering, Lanes, Transitions, Suspense |
| Stability | Gradual upgrades, codemods, React 17 |
| Interoperability | Incremental adoption, embedding React into existing applications |

---

## The Biggest Insight

Almost every major React feature can be traced back to **Scheduling**.

React asks developers to describe the UI instead of manually updating the DOM. In return, React gains complete control over rendering.

That control enabled:

```
Declarative UI
        │
        ▼
React controls rendering
        │
        ▼
Fiber
        │
        ▼
Concurrent Rendering
        │
        ▼
Lanes
        │
        ▼
Transitions
        │
        ▼
Suspense
        │
        ▼
Server Components
```

If there's one design principle to remember from React, it's this:

> **Developers own the UI description. React owns the rendering process.**

---

📚 [Design Principles (official, legacy docs)](https://legacy.reactjs.org/docs/design-principles.html) — *legacy URL, but these principles still describe current React.*

**Back to:** [Module 1 — Why React Exists](./Module01-WhyReactExists.md) · **Next:** [Module 2 — React Fundamentals](./Module02-ReactFundamentals.md)
