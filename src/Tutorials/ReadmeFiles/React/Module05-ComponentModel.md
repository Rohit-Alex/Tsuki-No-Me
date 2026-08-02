# Module 5 — Component Model

> Part of the [React Mastery course](./README.md). Previous: [Module 4 — Virtual DOM & Diffing](./Module04-VirtualDOM-Diffing.md). Next: [Module 6 — Hooks](./Module06-Hooks.md).

Modules 2–4 covered the machinery: elements, fibers, diffing. This module is about the part you actually write — components, and how data moves between them.

All outputs below come from running React in Node. Scripts are in [verify/](./verify/).

---

## 1. What a component really is

A component is **a function that takes props and returns a description of UI.**

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

That's it. No class, no framework object, no lifecycle to register. React calls your function, gets an element back, and figures out the DOM (Module 4).

### The one rule: components must be pure

Same props in → same JSX out, and nothing else touched.

```jsx
let count = 0;

function Bad() {
  count++;                          // ❌ changes something outside
  return <p>{count}</p>;
}

function Good({ count }) {
  return <p>{count}</p>;            // ✅ only reads its input
}
```

**Why React insists on this:** from Module 3, React may run your component, throw the result away, and run it again. A component that increments a counter or fires a `fetch` does it an unpredictable number of times.

Think of a component like a **recipe**. Reading a recipe should never change your kitchen. It just tells you what the dish should look like. If reading the recipe secretly used up an egg every time, you couldn't read it twice to check something.

---

## 2. Props — the one-way street

Props are the arguments you pass down. Two rules people trip on:

**Props are read-only.**

```jsx
function Profile({ user }) {
  user.name = 'changed';   // ❌ never do this — you're mutating the parent's data
  return <p>{user.name}</p>;
}
```

**Data flows down, events flow up.** A child can't change a parent's state directly. The parent hands down a function instead:

```jsx
function Parent() {
  const [text, setText] = useState('');
  return <Child text={text} onTextChange={setText} />;   // ↓ data   ↑ callback
}

function Child({ text, onTextChange }) {
  return <input value={text} onChange={e => onTextChange(e.target.value)} />;
}
```

**Analogy:** props are like a **restaurant order ticket**. The kitchen (child) receives it and cooks what it says — it can't walk out and change what the customer ordered. If something needs changing, it sends a message back to the front (`onTextChange`).

This is the one-way data flow from Module 1. It's more typing than two-way binding, but when a value is wrong you can always trace who set it.

### `children` is just a prop

```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}          {/* whatever was nested inside */}
    </div>
  );
}

<Card title="Profile">
  <Avatar />              {/* this becomes children */}
  <p>Bio text</p>
</Card>
```

Remember from Module 2 §4.4 — `<Avatar />` here is only an *element object*. `Avatar` hasn't run yet. Passing components as children costs nothing.

---

## 3. State — memory that survives re-renders

Props come from outside. State is the component's own memory.

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

From Module 3 you already know where this lives: the hook list on the fiber. That's why it survives re-renders — elements are thrown away, the fiber isn't.

### Three things that surprise people

**1. State updates are not immediate.**

```jsx
function handleClick() {
  setCount(count + 1);
  console.log(count);      // still the OLD value
}
```

`count` is a snapshot from *this* render. The update is queued (Module 4 §4). Use the updater form when the new value depends on the old:

```jsx
setCount(c => c + 1);      // ✅ always works, even batched
```

**2. Mutating state does nothing.**

```jsx
items.push(newItem);
setItems(items);           // ❌ same reference → React bails out, no re-render

setItems([...items, newItem]);   // ✅ new reference
```

**3. Don't put derived values in state.**

```jsx
// ❌ two sources of truth that can drift
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);

// ✅ derive it during render
const [items, setItems] = useState([]);
const count = items.length;
```

**Analogy:** state is your **notepad**; derived values are **arithmetic you do while reading it**. You don't write "3 items" on the notepad next to a list of 3 items — you just count them when asked. Otherwise the two disagree the moment you add an item and forget to update the tally.

---

## 4. Controlled vs uncontrolled

This is about **who owns the value in a form field** — React, or the DOM.

```jsx
// CONTROLLED — React owns it
const [name, setName] = useState('');
<input value={name} onChange={e => setName(e.target.value)} />

// UNCONTROLLED — the DOM owns it
const ref = useRef();
<input defaultValue="" ref={ref} />        // read later via ref.current.value
```

**Analogy:** a controlled input is a **whiteboard you hold** — the user asks you to write, and only what you write appears. An uncontrolled input is a **notepad you hand over** — they write on it freely, and you read it later when you need it.

| | Controlled | Uncontrolled |
|---|---|---|
| Value lives in | React state | The DOM node |
| Read it | Any time, from state | Only via a ref |
| Validate as you type | Easy | Awkward |
| Re-renders on keystroke | Yes | No |
| Best for | Most forms, live validation | Simple forms, file inputs |

### Two warnings you will hit

**`value` without `onChange`** makes the field read-only — the user types and nothing happens. Verified warning text:

```
Warning: You provided a `value` prop to a form field without an `onChange` handler.
```

Fix: add `onChange`, or use `defaultValue` if you meant it to be uncontrolled.

**Switching between the two** — usually caused by state starting as `undefined`:

```
Warning: A component is changing an uncontrolled input to be controlled.
```

```jsx
const [name, setName] = useState();      // ❌ undefined → uncontrolled at first
const [name, setName] = useState('');    // ✅ always a string → always controlled
```

*(Both verified in [`controlled.cjs`](./verify/controlled.cjs).)*

---

## 5. Composition — how to avoid prop drilling

You need `user` deep in the tree, so you thread it through four components that don't care about it:

```jsx
// ❌ prop drilling — Layout and Sidebar don't use `user`, they just pass it on
<Layout user={user}>
  <Sidebar user={user}>
    <Profile user={user} />
  </Sidebar>
</Layout>
```

Before reaching for Context, try **composition** — pass the finished element instead of the data:

```jsx
// ✅ Layout doesn't know about `user` at all
<Layout>
  <Sidebar>
    <Profile user={user} />
  </Sidebar>
</Layout>
```

`Profile` is created where `user` already exists, then passed down as `children`. The middle layers just render `{children}`.

**Analogy:** don't hand someone your **grocery list, the ingredients, and the recipe** so they can pass it to a chef three rooms away. **Cook the dish yourself and hand over the finished plate.** The people in between only need to carry a plate — they never touch the ingredients.

React's docs are explicit about the order to try things:

> **props → composition → context.** *"Just because you need to pass some props several levels deep doesn't mean you should put that information into context."*

---

## 6. Context — for genuinely global data

Context skips the middle layers entirely.

```jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />                          {/* no theme prop anywhere below */}
    </ThemeContext.Provider>
  );
}

function DeepButton() {
  const theme = useContext(ThemeContext);   // reaches up to the nearest provider
  return <button className={theme}>Click</button>;
}
```

**Analogy:** props are **handing a note person to person** down a row. Context is the **office intercom** — announce it once, and anyone in the building who's listening hears it. Great for building-wide news (theme, logged-in user, language). Terrible for telling one person their lunch is ready — that's what a note is for.

> **React 19 note:** you can now render `<ThemeContext value="dark">` directly, without `.Provider`. The `.Provider` form still works.

### The performance trap — verified

**Every consumer re-renders when the value changes, and `memo` will not save them.**

```jsx
function App() {
  const [n, setN] = useState(0);
  return (
    <Ctx.Provider value={{ n }}>   {/* ❌ NEW object every render */}
      <Reader />                    {/* uses context */}
      <MemoSibling />               {/* memo, no context */}
    </Ctx.Provider>
  );
}
```

Measured over two updates ([`context.cjs`](./verify/context.cjs)):

```
after mount:      reader=1 sibling=1 memoSibling=1
after 2 updates:  reader=3 sibling=3 memoSibling=1
```

Read that carefully:

- `Reader` (context consumer) — re-rendered **every time**.
- `MemoSibling` (memo, doesn't use context) — **never re-rendered**. `memo` worked.
- So **`memo` protects non-consumers, but a context consumer always re-renders when the value changes.**

And a second finding — even a **referentially stable** value doesn't help if the provider's parent re-renders:

```
stable context value -> consumer re-rendered anyway? true (because PARENT re-rendered)
```

That's normal child re-rendering (Module 2 §5.3), not a context bug. Context only *adds* re-renders; it never removes the ordinary ones.

### Two fixes

**1. Stabilise the value** so consumers don't re-render on unrelated parent renders:

```jsx
const value = useMemo(() => ({ user, login }), [user, login]);
return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
```

**2. Split contexts by how often they change:**

```jsx
// ❌ one big context — theme changes wake up everyone reading `user`
<AppContext.Provider value={{ user, theme, cart }}>

// ✅ separate, so consumers only re-render for what they use
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>
```

**Rule of thumb:** context suits data that is *global and changes rarely* — theme, current user, language, routing. For frequently-changing state shared widely, reach for a proper store (Module 8).

---

## 7. Portals — render elsewhere, stay connected

A modal inside a container with `overflow: hidden` gets clipped. CSS gives you no way out. Portals do:

```jsx
function Modal({ children }) {
  return createPortal(children, document.body);   // DOM: goes to <body>
}
```

**The important part:** the DOM moves, but the **React tree doesn't**. Verified ([`portal.cjs`](./verify/portal.cjs)):

```
#root innerHTML      : <div id="react-parent"></div>
#modal-host innerHTML: <button id="portal-btn">ctx=from-provider</button>
button is a DOM child of #root?  false          ← physically outside

Context through the portal: ctx=from-provider   ← context still reaches it
Clicking the portalled button:
  ✅ React parent onClick FIRED                  ← event bubbles through the REACT tree
```

So a portalled component still gets context, and its clicks still bubble to its React parent — **even though it sits somewhere else in the DOM entirely.**

**Analogy:** a portal is a **stage microphone**. The speaker stands on stage (in your component tree), but the sound comes out of speakers at the back of the hall (a different DOM node). They're still part of the same event, still take questions from the same host — the audio just comes out somewhere else.

⚠️ **The bubbling surprise:** an outside-click handler on a parent will fire for clicks inside a portalled modal, because React events follow the React tree, not the DOM tree. Catches people out constantly.

---

## 8. Class components — what you need to know

Class components are **not deprecated** and still work. React's official line:

> *"We recommend defining components as functions instead of classes."*

You'll still meet them in older codebases, and in one place they're still required: **error boundaries**.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logToService(error, info);
  }

  render() {
    if (this.state.hasError) return <p>Something went wrong.</p>;
    return this.props.children;
  }
}
```

There is still no hook equivalent — if you need to catch render errors, you write a class (or use `react-error-boundary`).

### `componentDidMount` vs `DOMContentLoaded`

A classic confusion, because both sound like "when the page is ready."

| | Fires |
|---|---|
| **`DOMContentLoaded`** | Once per page load, when the HTML is fully parsed and deferred scripts have run. Doesn't wait for images or async scripts. |
| **`componentDidMount`** | Every time *that component instance* mounts — which can be many times per page, or never. |

```jsx
useEffect(() => { ... }, []);   // the hook equivalent of componentDidMount
```

So `DOMContentLoaded` is about the **document**; `componentDidMount` is about **one component's lifetime**. A component mounted by a route change fires `componentDidMount` long after `DOMContentLoaded` has come and gone.

### `PureComponent`

The class-era ancestor of `React.memo` — it implements `shouldComponentUpdate` with a shallow props/state comparison.

```jsx
class Row extends React.PureComponent { ... }   // class era
const Row = memo(function Row() { ... });        // function equivalent
```

Same caveat as `memo` (Module 9 §2): a shallow comparison fails whenever props are new objects, so it does nothing if the parent passes inline objects or arrows.

### Named vs default exports

```jsx
export default function Button() {}      // import Button from './Button'
export function Button() {}              // import { Button } from './Button'
```

**Named exports are usually the better default.** The import name must match the export, so renames stay consistent, autocomplete works, and refactoring tools can find every usage. With default exports each file can import it under a different name — three files calling the same component `Button`, `Btn`, and `MyButton` is a real thing that happens.

Default exports do matter for `lazy()`, which expects a module with a `default` export:

```jsx
const Dashboard = lazy(() => import('./Dashboard'));         // needs a default export
const Dashboard = lazy(() =>
  import('./Dashboard').then(m => ({ default: m.Dashboard }))  // named export
);
```

### Lifecycle → hooks

| Class | Function |
|---|---|
| `constructor` | `useState` |
| `componentDidMount` | `useEffect(fn, [])` |
| `componentDidUpdate` | `useEffect(fn, [deps])` |
| `componentWillUnmount` | `useEffect`'s cleanup return |
| `shouldComponentUpdate` | `React.memo` |
| `this.context` | `useContext` |

⚠️ **Legacy, do not use in new code:** `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, `UNSAFE_componentWillUpdate`. They were renamed with the `UNSAFE_` prefix because they break under interruptible rendering (Module 3) — they could run more than once for a single update.

---

## 9. Interview Questions

### Basic

**Q: Props vs state?**
Props come from the parent and are read-only. State is the component's own memory and it can change it. Props flow down; changes flow up through callbacks.

**Q: Why can't a child change props directly?**
One-way data flow. If children could edit props, a wrong value could come from anywhere and you'd have no way to trace it. Instead the parent passes a callback down.

**Q: Controlled vs uncontrolled input?**
Controlled: React state holds the value (`value` + `onChange`). Uncontrolled: the DOM holds it, read via a ref (`defaultValue`). Controlled for most forms; uncontrolled for simple cases and file inputs.

### Intermediate

**Q: What's prop drilling and how do you fix it?**
Passing props through components that don't use them. First fix is **composition** — build the element where the data lives and pass it as `children`, so the middle layers never see it. Only use Context if the data is genuinely needed all over the tree.

**Q: Does `React.memo` stop context re-renders?**
No. Verified: a `memo` component that *doesn't* use context never re-rendered, but a context consumer re-rendered every time the value changed. `memo` compares props, and context isn't a prop.

**Q: Why does my whole app re-render when I use Context?**
Almost always a new object as the value: `value={{ user, login }}` creates a fresh object each render, so every consumer sees a change. Wrap it in `useMemo`, and split one big context into several by update frequency.

**Q: Do events bubble out of a portal?**
Yes — through the **React** tree, not the DOM tree. Verified: a button portalled into `document.body` still fired its React parent's `onClick`. This is why outside-click handlers misfire on portalled modals.

### Senior

**Q: When is Context the wrong tool?**
When the data changes often. Every consumer re-renders on every change, and `memo` can't stop it. Context is for global, slow-moving data — theme, user, locale. For fast-changing shared state, use a store with selectors so components only re-render for the slice they read.

**Q: Why were the `componentWill*` lifecycles marked UNSAFE?**
They ran during the render phase, which Fiber made interruptible. React can start rendering, abandon it, and restart — so those methods could fire multiple times for one update. Anything with side effects in them became unreliable, so they were renamed with `UNSAFE_` and replaced by `getDerivedStateFromProps` and `getSnapshotBeforeUpdate`.

**Q: Are class components deprecated?**
No — officially supported, and React recommends functions for new code. Error boundaries are still class-only; there's no hook for `componentDidCatch`.

**Q: How would you design a component API for a reusable dropdown?**
Look for: composition over configuration (compound components like `<Select><Option/></Select>` rather than an `options` array prop), controlled *and* uncontrolled support (`value` vs `defaultValue`), and not leaking internal state. Patterns are Module 10.

---

## 10. Common Mistakes

- ❌ Mutating props or state — `items.push()` then `setItems(items)` re-renders nothing (same reference).
- ❌ Reading state right after setting it — it's a snapshot; the update is queued.
- ❌ Storing derived data in state — two sources of truth that drift. Derive during render.
- ❌ `useState()` with no argument for an input value — `undefined` makes it uncontrolled, then controlled, and React warns.
- ❌ Reaching for Context to fix two levels of prop drilling — try composition first.
- ❌ Inline object as a context value — `value={{ a, b }}` re-renders every consumer, every render.
- ❌ Expecting `memo` to stop context re-renders — it can't.
- ❌ Assuming portal clicks don't reach React parents — they do.

---

## 11. Official Documentation References

- [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component) · [Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [State: A Component's Memory](https://react.dev/learn/state-a-components-memory) · [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context) · [`useContext`](https://react.dev/reference/react/useContext)
- [`createPortal`](https://react.dev/reference/react-dom/createPortal) · [`Component` (classes)](https://react.dev/reference/react/Component)

---

## 12. Revision Notes

1. A component is **a pure function: props in, element description out.**
2. Props are **read-only**; data down, events up via callbacks.
3. `children` is just a prop — and passing `<Foo />` doesn't run `Foo`.
4. State lives on the **fiber's hook list**, which is why it survives re-renders.
5. State updates are **queued**, not immediate. Use `setX(prev => ...)` when the new value depends on the old.
6. **New reference or no re-render** — mutating state does nothing.
7. **Derive, don't store.** Two sources of truth will drift.
8. Controlled = React owns the value; uncontrolled = the DOM owns it. Never start with `undefined`.
9. Fix prop drilling with **composition first**, Context second.
10. **Context: every consumer re-renders on value change, and `memo` cannot stop it.** *(Verified.)*
11. Stabilise context values with `useMemo`; split contexts by update frequency.
12. Portals move the **DOM node**, not the **React tree** — context flows in and events bubble out. *(Verified.)*
13. Classes aren't deprecated; error boundaries are still class-only.
14. `componentWill*` became UNSAFE because interruptible rendering can run them more than once.

**Soundbites**
- "Props are an order ticket — the kitchen can't change what was ordered."
- "Context is an intercom, props are a note passed down the row."
- "A portal moves the node, not the tree."
- "memo compares props, and context isn't a prop."
- "Derive it, don't store it."

---

## 13. Practice Exercises

**1 — Break it with mutation.** Hold an array in state, `push` to it, call `setItems(items)`. Watch nothing happen. Fix with a spread and explain what `Object.is` did.

**2 — Both kinds of input.** Build the same form twice: controlled, then uncontrolled with refs. Add "disable submit until valid" to each and note which one fought you.

**3 — Trigger both warnings.** Render `<input value="x" />` with no `onChange`, then a field whose state starts as `undefined`. Read the exact warnings and fix both.

**4 — Kill the drilling.** Build a 4-level tree passing `user` through all of it. Refactor with composition so the middle layers never see `user`. Then do it with Context and compare which reads better.

**5 — Prove the context trap.** Count renders with an inline `value={{ n }}`, then wrap it in `useMemo` and count again. Add a `memo`'d consumer and confirm it *still* re-renders.

**6 — Portal surprise.** Portal a modal into `document.body`, put an "outside click closes me" handler on a React parent, and watch clicks *inside* the modal close it. Explain why, then fix it.

**7 — Interview rehearsal.** 90 seconds: *"How does data flow in React, and what do you do when it gets awkward?"* Cover props down, events up, composition, then Context — and say when each stops being the right tool.

---

**Next:** [Module 6 — Hooks](./Module06-Hooks.md) — every hook, internals, and the rules that follow from the fiber's hook list.
