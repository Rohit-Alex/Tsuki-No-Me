# Module 2 — React Fundamentals

> Part of the [React Mastery course](./README.md). Previous: [Module 1 — Why React Exists](./Module01-WhyReactExists.md). Next: [Module 3 — Fiber Architecture](./Module03-FiberArchitecture.md).

Module 1 established the *why*: `UI = f(state)`. This module is the *what* — the concrete machinery that turns a component into pixels. Every output in this file was **verified by running React 18.3.1 in Node**; where behavior differs between development and production builds, that is called out explicitly, because several popular explanations of these APIs describe only the dev build and are wrong about production.

**The chain this module walks, end to end:**

```
JSX  →  compiler  →  jsx()/createElement()  →  React Element  →  reconciliation  →  DOM
```

---

## 1. Introduction

Four ideas carry the whole module:

1. **A React Element is a plain, immutable JS object** describing intended output. It is not a DOM node and not a component instance.
2. **JSX is syntax sugar**, resolved entirely at build time. It adds zero runtime semantics.
3. **Reconciliation** decides which DOM nodes to reuse, using two heuristics: *element type* and *key*.
4. **Rendering ≠ committing.** Calling your component produces a description; committing applies DOM mutations. Most renders commit nothing.

📚 [Describing the UI](https://react.dev/learn/describing-the-ui) · [Render and Commit](https://react.dev/learn/render-and-commit)

---

## 2. Historical Context

| Version | Change | Why it matters |
|---|---|---|
| 2013 | `React.createElement` is the public API; JSX optional from day one | JSX was always sugar — never required |
| 0.14 (Oct 2015) | Split into `react` + `react-dom` | Elements became renderer-agnostic (Native, three-fiber, Ink) |
| 16 (Sep 2017) | Fiber rewrite; fragments, portals, error boundaries; return arrays/strings | Same element model, new internals |
| **17 (Oct 2020)** | **New JSX transform** (`react/jsx-runtime`) | No more `import React` for JSX; smaller bundles |
| 18 (Mar 2022) | `createRoot` replaces `ReactDOM.render`; StrictMode adds effect remount | Opt-in gate for concurrent features |
| 19 (Dec 2024) | `ref` as a regular prop; `forwardRef` largely unnecessary | Element shape simplified |

**The `ReactDOM.render` → `createRoot` change is the one interviewers probe**, because it was not cosmetic — it is the switch that enables concurrent rendering. See §5.4.

📚 [Introducing the New JSX Transform](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)

---

## 3. JSX and its compilation

### 3.1 JSX is not HTML and not in the language

JSX is a syntax extension. No browser and no JS engine understands it. A compiler (Babel, SWC, TypeScript, esbuild) rewrites it to function calls **before** the code ships.

Differences from HTML, all consequences of compiling to a JS object:

| HTML | JSX | Why |
|---|---|---|
| `class` | `className` | `class` is a reserved word |
| `for` | `htmlFor` | `for` is a reserved word |
| `onclick` | `onClick` | camelCase props; also synthetic events (Module 11) |
| `style="color:red"` | `style={{color:'red'}}` | an object, not a string |
| `<br>` | `<br />` | must be well-formed to parse |
| lowercase tags | `<div>` host, `<Foo>` component | **capitalization decides** string vs identifier |

That last row is a real bug source: `<foo />` compiles to `createElement('foo')` — the string `"foo"` — producing an unknown DOM element rather than your component.

### 3.2 The two transforms — verified compiler output

Source:

```jsx
const a = <div className="x">Hello <b>{name}</b></div>;
const list = <ul>{items.map(i => <li key={i.id}>{i.t}</li>)}</ul>;
const frag = <><A/><B/></>;
```

**Classic runtime** (pre-React 17 default) — `@babel/preset-react` with `runtime: 'classic'`:

```js
const a = /*#__PURE__*/React.createElement("div", { className: "x" },
  "Hello ", /*#__PURE__*/React.createElement("b", null, name));
const list = /*#__PURE__*/React.createElement("ul", null,
  items.map(i => /*#__PURE__*/React.createElement("li", { key: i.id }, i.t)));
const frag = /*#__PURE__*/React.createElement(React.Fragment, null,
  /*#__PURE__*/React.createElement(A, null), /*#__PURE__*/React.createElement(B, null));
```

`React` appears literally in the output — **that** is why the old transform required `import React from 'react'` in every JSX file, even when you never referenced `React` yourself.

**Automatic runtime** (React 17+ default) — `runtime: 'automatic'`:

```js
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";

const a = /*#__PURE__*/_jsxs("div", { className: "x",
  children: ["Hello ", /*#__PURE__*/_jsx("b", { children: name })] });
const list = /*#__PURE__*/_jsx("ul", {
  children: items.map(i => /*#__PURE__*/_jsx("li", { children: i.t }, i.id)) });
const frag = /*#__PURE__*/_jsxs(_Fragment, {
  children: [/*#__PURE__*/_jsx(A, {}), /*#__PURE__*/_jsx(B, {})] });
```

Four differences worth naming precisely — these are exactly what a senior interviewer is listening for:

1. **The import is injected by the compiler**, from `react/jsx-runtime` — never import it yourself.
2. **`children` moved into the props object** instead of being trailing arguments.
3. **`key` moved out of props into a separate third argument** (`_jsx("li", {...}, i.id)`). This is the structural reason `key` is not a prop — it is not even in the props object at the call site.
4. **`jsx` vs `jsxs`** — `jsxs` ("s" = static) is used when children are a statically-known array, letting React skip runtime key-validation work it would otherwise need.

**Development** uses `react/jsx-dev-runtime` and a single `jsxDEV` with source location baked in:

```js
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
_jsxDEV("b", { children: name }, void 0, false,
  { fileName: _jsxFileName, lineNumber: 2, columnNumber: 36 }, this);
```

Those `fileName`/`lineNumber` fields are what produce component stack traces in error messages — and they are stripped from production, which is why prod stacks are less useful.

> **`/*#__PURE__*/`** marks the call side-effect-free so minifiers can drop the result if unused. It's how unreferenced elements get tree-shaken.

### 3.3 JSX rules that follow from compilation

**One parent.** A function returns one value, so JSX needs a single root. `<></>` (Fragment) groups without emitting DOM — verified: `<><b>x</b><i>y</i></>` renders exactly `<b>x</b><i>y</i>`, no wrapper.

**Braces are expressions, not statements.** `{}` accepts anything evaluating to a value — so `if`/`for` are illegal inside, but ternaries, `&&`, and `.map()` work.

**What renders as nothing** (verified — each produced `<div></div>`): `null`, `undefined`, `false`, `true`, `''`.
**What renders**: `0` produced `<div>0</div>`.

That asymmetry is the single most common React list bug:

```jsx
{items.length && <List items={items} />}   // ❌ renders "0" when empty
{items.length > 0 && <List items={items} />} // ✅
```

`items.length` is `0` → `&&` short-circuits returning `0` → `0` is a valid React child → literal "0" on screen.

---

## 4. React Elements — the actual object

### 4.1 Verified shape (React 18.3.1, development)

`React.createElement('div', { className: 'a', key: 'k1' }, 'hello')` produces:

```js
{
  $$typeof: Symbol(react.element),
  type: 'div',
  key: 'k1',
  ref: null,
  props: { className: 'a', children: 'hello' },
  _owner: null,
  _store: {}
}
```

Field by field:

- **`type`** — `'div'` for host elements, or the function/class itself for components. This drives reconciliation (§6).
- **`key`** — extracted from props; **coerced to a string** (verified: `key: 42` became `"42"`).
- **`ref`** — extracted from props like `key`. (React 19 makes `ref` an ordinary prop.)
- **`props`** — everything else. Children live at `props.children`.
- **`_owner` / `_store`** — internals for warnings; `_store` is **dev-only**.

**`$$typeof` is a security feature, not bookkeeping.** It's a `Symbol`, and symbols don't survive `JSON.parse`. If a server returns user-controlled JSON shaped like an element and you render it, React refuses — the forged object can't carry a real symbol. This defends against XSS via injected element objects. It's a great "do you know why?" answer.

### 4.2 Elements are immutable — and dev enforces it

Verified: in development, `Object.isFrozen(element)` and `Object.isFrozen(element.props)` are both `true`. Attempting `el.props.className = 'mutated'` silently left `'orig'` (it would throw in strict mode).

**Production differs.** Loading the production build directly:

```
PROD own keys: [ '$$typeof', 'type', 'key', 'ref', 'props', '_owner' ]
PROD element frozen? false | props frozen? false
PROD has _store? false
```

So freezing is a **development-only guardrail**, and `_store` doesn't exist in prod. Mutating an element in production won't throw — it will just corrupt rendering unpredictably. Never rely on the freeze to catch mistakes.

### 4.3 `key` is not a prop — mechanically

Verified in dev:

```
props has key? true          ← surprising!
Object.keys(props): ['id']   ← but not enumerable
JSON.stringify(props): {"id":"i"}
```

The descriptor explains it:

```js
{ get: [Function: warnAboutAccessingKey] { isReactWarning: true },
  set: undefined, enumerable: false, configurable: false }
```

React installs a **non-enumerable dev-only getter** that warns and returns `undefined`:

> Warning: li: `key` is not a prop. Trying to access it will result in `undefined` being returned.

In production the property is simply absent (`'key' in props` → `false`). So "key is not a prop" isn't a convention — key never enters props at the call site (§3.2), and the dev getter exists purely to catch you reaching for it. If a child needs the value, pass it twice: `<Profile key={id} userId={id} />`.

### 4.4 Elements are cheap; components are not called yet

```js
const el = <ExpensiveComponent />;   // ExpensiveComponent has NOT run
```

This allocates `{ type: ExpensiveComponent, props: {} }` — one object literal. React calls the function later, if and when it renders it. This is why passing elements as props (`children`, slots) costs nothing, and why `<Foo />` inside a ternary branch that isn't taken is free.

---

## 5. Rendering: from element to DOM

### 5.1 The three phases

```
TRIGGER          initial render, or a setState
   ↓
RENDER PHASE     call components, build element tree, diff
                 pure · no side effects · INTERRUPTIBLE (React 18)
   ↓
COMMIT PHASE     apply DOM mutations, run refs & layout effects
                 synchronous · UNINTERRUPTIBLE
   ↓
BROWSER PAINT
   ↓
PASSIVE EFFECTS  useEffect callbacks
```

The render phase must be pure precisely because it can be discarded and re-run (Module 3). This is the mechanical reason for "no side effects during render" — not style advice.

### 5.2 Render ≠ DOM update

The most consequential idea in this module. A component "re-rendering" means **its function ran**. If the produced description matches the previous one, React performs **zero** DOM operations.

Verified with a real DOM:

```
same type -> same DOM node? true   | className now: b | text: two
```

React updated the attribute and text on the **same** node — `n1 === n2`. It did not create a new `<div>`.

Node identity mattering is not academic: a preserved node keeps focus, text selection, scroll position, playing video, and uncontrolled input values. A replaced node loses all of it.

### 5.3 Fundamental rendering behavior

**When a component re-renders, all of its children re-render by default** — regardless of whether their props changed. React does not diff props to decide whether to call a child; it calls the child and diffs the *output*.

This surprises people, but follows from §4.4: calling components is usually cheap, and the expensive part (DOM) is already minimized by diffing. `React.memo` opts out of this default — Module 8 covers when that's worth it (usually less often than people think).

### 5.4 The Root API

**Legacy (React ≤17, removed in 19):**

```js
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));
```

**Modern (React 18+):**

```js
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Not cosmetic. `createRoot` is the **gate for concurrent features** — automatic batching everywhere, `useTransition`, `useDeferredValue`, Suspense improvements, selective hydration. An app calling `ReactDOM.render` in React 18 runs in legacy mode and silently gets none of them (with a console warning). "We upgraded to 18 but saw no benefit" almost always means this.

Note the separation: the root is created once, `render` may be called repeatedly on it, and `root.unmount()` tears it down. For SSR you use `hydrateRoot` instead (Module 6).

### 5.5 StrictMode

`<StrictMode>` enables **development-only** checks. Zero production impact.

Verified side by side:

```
--- NO StrictMode ---            --- WITH StrictMode ---
render body ran                  render body ran
useState initializer ran         useState initializer ran
effect SETUP                     render body ran            ← double-invoked
                                 useState initializer ran   ← double-invoked
                                 effect SETUP
                                 effect CLEANUP             ← extra remount
                                 effect SETUP
```

**Double-invoked** (to surface impure render logic): component bodies, `useState` initializers, updater functions, `useMemo` callbacks, `useReducer` reducers, and class `constructor`/`render`/`shouldComponentUpdate`.

**Effects run setup → cleanup → setup** on mount, which surfaces missing cleanup. If your effect subscribes without unsubscribing, StrictMode doubles the subscription immediately rather than letting it leak in production.

> **This is not a bug and you must not "fix" it by disabling StrictMode.** Seeing two API calls in dev means your effect lacks cleanup (or belongs in an event handler, not an effect). Removing StrictMode hides the defect; it does not remove it.

---

## 6. Reconciliation and the diffing algorithm

### 6.1 Why heuristics

Optimal tree-diff algorithms are **O(n³)**. For 1,000 nodes that's a billion operations — unusable. React uses an **O(n)** heuristic built on two assumptions:

1. **Different element types produce different trees.**
2. **The developer can mark stable children with `key`.**

These are assumptions, not theorems — they can be wrong, and when they are, you get the bugs in §6.4. But they hold for virtually all real UI.

### 6.2 The rules, verified

**Rule 1 — same type at the same position → reuse the DOM node, patch what differs.**

```jsx
// render 1
<div className="a">one</div>
// render 2
<div className="b">two</div>
```
```
same type -> same DOM node? true | className now: b | text: two
```

Both renders are a `div`, so React keeps the *same* DOM node and just updates the class and text. It does not create a new `<div>`. That's why focus, scroll position, and text selection survive an update.

**Rule 2 — different type at the same position → destroy the subtree, build fresh.**

```jsx
// render 1
<div>one</div>
// render 2
<span>one</span>     // ← tag changed
```
```
type changed div->span -> same node? false | tag: SPAN
```

React doesn't try to match `<div>` against `<span>`. It throws away the old node, everything nested inside it, and **all component state in that subtree**. The classic real-world version:

```jsx
{isEditing ? <input value={v} /> : <p>{v}</p>}   // switching remounts, focus lost
```

**Rule 3 — different `key` on the same type → also destroy and rebuild.**

```jsx
// render 1
<p key="k1">x</p>
// render 2
<p key="k2">x</p>    // same tag, same content, different key
```
```
key changed on same type -> same node? false
```

Identical `<p>` with identical text, yet React rebuilds it — because the key changed. Key beats type. That makes `key` a deliberate **state-reset switch**, not just a list optimization:

```jsx
function Chat({ contactId }) {
  const [draft, setDraft] = useState('');   // ← want this cleared per contact
  ...
}

<Chat key={contactId} contactId={contactId} />   // switching contact wipes the draft
```

Without the `key`, the draft you typed to Alice follows you to Bob's conversation. With it, React remounts `Chat` and the draft resets — no `useEffect` needed.

### 6.3 State lives at a *position in the tree*

React ties state to a component's **position in the render tree**, not to the JSX text or the component name. Consequences:

- Same component, same position → **state preserved** (even if props changed).
- Different component type, same position → **state reset**.
- Component removed → **state destroyed**.
- Same component rendered at two positions → **two independent states**.
- Same position, different `key` → **state reset**.

**What if the position changes? — verified**

This is the question that catches people out. Same component, but you wrap it in a `<div>` or add a sibling above it. Here's what actually happens ([`position.cjs`](./verify/position.cjs)) — a counter is set to 5, then the surrounding markup changes:

```
A. <Counter/>            →  <Counter/>                    count=5 → count=5  ✅ kept
B. <Counter/>            →  <div><Counter/></div>         count=5 → count=0  ❌ RESET
C. <div><Counter/></div> →  <section><Counter/></section>  count=5 → count=0  ❌ RESET
D. <div><Counter/></div> →  <div><p/><Counter/></div>      count=5 → count=0  ❌ RESET
E. same as D, but with <Counter key="c"/>                  count=5 → count=5  ✅ kept
```

So, to answer directly: **wrapping the same component in a new `<div>` destroys its state.** React sees a different tree shape at that spot and treats it as a different component.

The reason is simple. React identifies a component by *where it sits*, described as a path:

```
B.  before:  root → Counter          the path changed,
    after:   root → div → Counter    so it's a different component
```

Case D is the sneaky one — the path is `div → child #0` before and `div → child #1` after. Just adding a sibling above shifted the index, and the state was gone. Nothing warns you.

Case E is the fix: give the component a `key`. React then tracks it by name instead of by position, so it survives the shift. Same tool as lists (§6.4) — it always means "this is the same thing."

**Practical rule:** don't move a stateful component around in the tree. If you must — conditional wrappers, layouts that restructure — give it a stable `key`.

**The related trap** — a component defined inside another:

```jsx
function Parent() {
  function Child() { const [v, setV] = useState(0); return <div>{v}</div>; }
  return <Child />;   // ❌ new function identity every render
}
```

Every render creates a brand-new `Child` function. A new function is a new `type`, so Rule 2 fires and React remounts it — state resets on every single render. Define components at module top level, always.

📚 [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)

### 6.4 Keys — and the index-key bug, demonstrated

**The rules:** unique among siblings (not globally); stable across renders; never generated during render; not readable as a prop.

Without keys React falls back to index, which is fine for **static, never-reordered** lists. It breaks the moment items are inserted, removed, or sorted — because index describes *position*, not *identity*.

Verified with uncontrolled inputs (which hold their own DOM state, making identity visible). Three rows, user types `1`, `2`, `3`, then a new row `Z` is prepended:

```
[index keys] before: A=1  B=2  C=3
[index keys] after prepend Z:  Z=1   A=2   B=3   C=      ❌ values stayed with positions
[id keys]    before: A=1  B=2  C=3
[id keys]    after prepend Z:  Z=    A=1   B=2   C=3     ✅ values followed their rows
```

Read the index-key row carefully: **the brand-new row `Z` inherited the value `1` that the user typed into row `A`.** No error, no warning — data silently attached to the wrong item. With real forms, checkboxes, or a "delete" button bound to the wrong row, this is a production incident.

`key={Math.random()}` is worse: keys never match, so React rebuilds every row on every render — slow *and* it destroys state and focus continuously.

Use a stable id from the data (database id, or `crypto.randomUUID()` assigned at creation — not at render).

---

## 7. Lists, conditionals, Fragments, and Portals

### 7.1 Lists and conditionals

```jsx
function ProductList({ products, query }) {
  const visible = products.filter(p => p.name.includes(query));

  if (visible.length === 0) return <Empty query={query} />;

  return (
    <ul>
      {visible.map(p => <ProductRow key={p.id} product={p} />)}
    </ul>
  );
}
```

Note `visible` is **derived** during render rather than stored in state — the Module 1 principle applied. Storing it in state would create a second source of truth that can drift.

Conditional forms: `if`/early return (statements, outside JSX), ternary (inside JSX), `&&` (beware §3.3's `0`), and `null` to render nothing.

### 7.2 Fragments

```jsx
<>            {/* short syntax — cannot take a key */}
  <td>A</td>
  <td>B</td>
</>

{rows.map(r => (
  <React.Fragment key={r.id}>   {/* explicit form required when you need a key */}
    <dt>{r.term}</dt>
    <dd>{r.def}</dd>
  </React.Fragment>
))}
```

Fragments exist because wrapper `<div>`s break `<table>`, flexbox, and grid layouts — the parent's direct-child relationship matters in CSS.

### 7.3 Portals

```jsx
createPortal(<Modal />, document.body)
```

Renders children into a **different DOM node** while keeping them in the same **React tree** — so context still flows down and events still bubble through the React parent, not the DOM parent. That last part surprises people and is a good interview question. Solves `overflow: hidden` / `z-index` clipping for modals and tooltips.

---

## 8. Performance Considerations

- **Creating elements is cheap.** Object literals. Don't contort code to avoid them.
- **The DOM is the expensive part.** Diffing exists to minimize it.
- **Keys are a correctness issue first, performance second.** Bad keys cause wrong data, not just slow renders (§6.4).
- **Preserving node identity is a performance *and* UX feature** — it keeps focus, selection, scroll, and media playback alive.
- **`jsxs` vs `jsx`** lets React skip key validation for static children — a small win you get free from the modern transform.
- **Don't reach for `React.memo` reflexively.** Re-render ≠ DOM update (§5.2); memo adds comparison cost to avoid work that is often already trivial. Measure first (Module 8).

---

## 9. Edge Cases & Nuances

- **`key` is coerced to a string.** `key={1}` and `key={'1'}` are the same key. Objects become `"[object Object]"` — silently colliding.
- **Keys are scoped to siblings.** Reusing the same key in a different array is fine.
- **`0` renders; `false`/`null`/`undefined`/`''` don't.** (§3.3, verified.)
- **Dev freezes elements, production doesn't.** (§4.2, verified.) Don't depend on the freeze.
- **Lowercase JSX tags become strings.** `<myComponent />` → `createElement('myComponent')`, not your component.
- **Whitespace in JSX** is trimmed at line boundaries; use `{' '}` when you need an explicit space.
- **`React.Fragment` accepts only `key`.** No other props — it emits no DOM to put them on.
- **Comments inside JSX** need braces: `{/* like this */}`.

---

## 10. Comparison

| | Description format | Diffing | Key equivalent |
|---|---|---|---|
| **React** | Elements (plain objects), created every render | VDOM diff, O(n) heuristic | `key` |
| **Vue 3** | VNodes + compiler hints (static hoisting, patch flags) | VDOM diff, compiler-optimized | `:key` |
| **Svelte** | No description — compiler emits direct DOM updates | none needed | `{#each ... (id)}` |
| **Solid** | JSX compiles to fine-grained reactive DOM creation | none — signals update nodes directly | `<For>` |
| **Angular** | Templates compiled to instructions | Incremental DOM | `trackBy` |

Notice every framework needs a keying mechanism. Identity-tracking is inherent to updating a list, not a React quirk.

---

## 11. Interview Questions

### Basic

**Q: What is JSX and does the browser understand it?**
A syntax extension compiled to plain function calls before shipping. No browser understands it. It compiles to `React.createElement` (classic) or `jsx()` from `react/jsx-runtime` (automatic, React 17+).

**Q: What does `createElement` return?**
A plain immutable object: `{ $$typeof, type, key, ref, props, _owner }`. Not a DOM node, not a component instance. Creating one does not call the component.

**Q: Why do JSX elements need a single parent?**
A function can only return one value. Fragments (`<></>`) group children without emitting DOM.

**Q: What are keys for?**
To give list items a stable identity across renders so React knows which item is which when the list reorders — preserving the right DOM nodes and the right component state.

### Intermediate

**Q: Why doesn't React 17+ need `import React` for JSX?**
The automatic transform injects `import { jsx } from 'react/jsx-runtime'` itself. Under the classic transform the literal identifier `React` appeared in compiled output, so it had to be in scope.

**Q: `jsx` vs `jsxs`?**
`jsxs` is used when children are a statically-known array, letting React skip runtime key validation. Purely a compiler-chosen optimization.

**Q: Why is index-as-key a problem? Give a concrete failure.**
Index encodes position, not identity. Verified case: three rows with typed values 1/2/3; prepend a new row `Z` and the new row inherits `1` while the last row is blank — user data silently attached to the wrong item. With stable ids, values follow their rows correctly.

**Q: Difference between `ReactDOM.render` and `createRoot`?**
`createRoot` (React 18+) enables concurrent features — automatic batching everywhere, transitions, Suspense improvements. `ReactDOM.render` runs legacy mode with none of them, and was removed in React 19.

**Q: Why does StrictMode run my effect twice?**

To show you a missing cleanup. This effect leaks:

```jsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  // ❌ no cleanup — StrictMode leaves you with TWO intervals running
}, []);
```

```jsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);   // ✅ setup → cleanup → setup ends clean
}, []);
```

It's development-only and diagnostic. Disabling StrictMode hides the leak rather than fixing it — in production the same bug shows up when the component remounts.

### Senior

**Q: Why is `key` not accessible as a prop? Explain mechanically.**
It never enters props. The compiler emits it as a separate argument (`_jsx("li", {...}, i.id)`), and `createElement` extracts it onto `element.key`. In development React installs a non-enumerable getter on props named `key` that warns and returns `undefined`; in production the property is absent entirely. Verified: `Object.keys(props)` excludes it in both.

**Q: What is `$$typeof` and why a Symbol?**

It's a marker proving an object is a real React element. Here's the attack it stops — imagine your app renders data straight from an API:

```jsx
const data = await res.json();   // attacker controls this
return <div>{data.message}</div>;
```

If the attacker returns this, they'd be injecting a script tag:

```json
{ "message": {
    "type": "script",
    "props": { "dangerouslySetInnerHTML": { "__html": "steal()" } }
}}
```

It has the right shape. But `JSON.parse` can't produce a `Symbol`, so `$$typeof` is missing — and React refuses to render it. XSS defense-in-depth.

**Q: React's diff is O(n) but optimal tree diffing is O(n³). What is traded away?**

Optimality. React never looks for the *smartest* match — it makes two assumptions and moves on.

Here's a case where the assumption is wrong:

```jsx
{isWide ? <div><Editor /></div> : <section><Editor /></section>}
```

A perfect algorithm would notice `<Editor />` is the same component and keep it. React sees `div` → `section`, gives up on the entire subtree, and remounts `Editor` — losing whatever the user typed. Verified ([`keyparent.cjs`](./verify/keyparent.cjs)):

```
<div><Editor/></div> → <section><Editor/></section>    text=hello → text=(empty)  ❌ LOST
```

⚠️ **A `key` on the child does NOT rescue this** — a common misconception, and worth testing yourself:

```
<Editor key="editor"/> in both branches      text=hello → text=(empty)  ❌ still LOST
key on the parent instead (<div key="w">)    text=hello → text=(empty)  ❌ still LOST
```

Keys only distinguish **siblings within one parent**. They can't reconnect a child across a parent that was destroyed — once React unmounts the `<div>`, everything inside it is gone regardless of keys.

The real fix is to keep the tag stable and vary something else:

```jsx
<div className={isWide ? 'wide' : 'narrow'}><Editor /></div>   // ✅ text=hello kept
```

If the tag genuinely must change, lift the state above it so remounting can't destroy it. Note that passing `<Editor />` as `children` through a wrapper does **not** work — verified — because the element still lands under the changed tag.

The trade is worth it overall: O(n³) on a 1,000-node tree is a billion operations. React's assumptions are right for virtually all real UI.

**Q: Everything works but state resets whenever the parent re-renders. Diagnose.**
Almost certainly a component defined inside another component's body. Each parent render creates a new function identity, so `type` differs, so Rule 2 fires and React unmounts and remounts the child. Fix: hoist to module scope. Alternative causes: a changing `key`, or conditional structure moving the component to a different tree position.

**Q: How would you deliberately reset a child's state?**
Change its `key`. Same type, different key → destroy and rebuild (verified). Idiomatic for resetting a form when the edited entity changes: `<Chat key={contactId} />`. Cleaner than a `useEffect` that resets state on prop change, which renders once with stale values first.

### Staff

**Q: React freezes elements in dev but not production. Why the difference?**

First, what "mutating an element" actually looks like:

```js
const el = <div className="blue">hi</div>;
el.props.className = 'red';    // ← this is the mutation
```

Run that in both builds and you get different results ([`mutate.cjs`](./verify/mutate.cjs)):

```
DEV build         TypeError: Cannot assign to read only property 'className'
PROD build        before: blue → after: red     ← mutation SUCCEEDED
```

Adding a new prop fails in dev too, with a different message:

```js
el.props.title = 'tooltip';
// DEV:  TypeError: Cannot add property title, object is not extensible
```

Why the difference? Freezing costs time, and React creates a lot of elements. In development that cost is worth it because it catches your mistakes. In production it's wasted work, so React skips it.

The catch: production React *assumes* you never mutate elements, but doesn't check. So the same bug throws loudly in dev and silently renders the wrong thing in prod.

⚠️ One gotcha — the dev error only appears in **strict mode**. Plain scripts fail silently:

```js
el.props.className = 'red';       // sloppy mode: no error, just ignored
'use strict';                      // strict mode: TypeError
```

ES modules and JSX bundles are always strict, so you'll normally see the error. But this is why "it worked in dev" isn't proof you didn't mutate something.

That's React's general pattern — dev catches bugs, production trusts you. Same reason for `_store`, dev warnings, and StrictMode's double-render.

**Q: Why must the render phase be pure?**

Because React might run your component, throw the result away, and run it again. That's what concurrent rendering does when something more urgent comes in.

Here's the bug that causes:

```jsx
let orderId = 0;

function Checkout({ cart }) {
  orderId++;                          // ❌ side effect during render
  fetch('/api/reserve', {             // ❌ fires every render
    method: 'POST',
    body: JSON.stringify({ cart }),
  });
  return <Summary id={orderId} />;
}
```

You expect one reservation per checkout. But React may render `Checkout` twice, or render it for a screen the user never sees — so you get duplicate orders. Nothing errors; the count is just wrong.

The fix is to move it out of render:

```jsx
function Checkout({ cart }) {
  const handleSubmit = () => {         // ✅ event handler — runs once, on click
    fetch('/api/reserve', { method: 'POST', body: JSON.stringify({ cart }) });
  };
  return <button onClick={handleSubmit}>Reserve</button>;
}
```

**Pure means:** same props and state in, same JSX out, and nothing else touched. No fetch calls, no mutating variables outside the component, no writing to `localStorage`, no `document.title = ...`.

StrictMode double-renders on purpose to expose exactly this in development — you'd see two network requests instead of one, before it becomes a real bug in production.

**Q: Argue that the Virtual DOM is a cost, not a benefit.**

It's a fair point. Take a counter:

```jsx
function Counter({ n }) {
  return <p>Count: {n}</p>;
}
```

**React**, when `n` changes: re-runs `Counter`, builds a new element object, diffs it against the old one, works out that only the text differs, then updates the text.

**Svelte**, compiled ahead of time, emits roughly:

```js
p.textContent = 'Count: ' + n;   // it already knows which node, at build time
```

One line, no diffing. So React genuinely does more work for the same result — see [Module 4 §3](./Module04-VirtualDOM-Diffing.md).

React pays that cost to get three things:

1. **Components are just functions.** Their output can depend on anything at runtime — a compiler can't always predict what will change.
2. **The same elements work anywhere.** `<p>Count: {n}</p>` can become a DOM node, a React Native view, or terminal text. Only the renderer changes.
3. **Rendering can be interrupted.** React can throw away half-finished work — but only because it hasn't touched the DOM yet. Once you write `p.textContent = ...`, you can't take it back.

The React Compiler is React's attempt to get the speed back without giving up any of that.

---

## 12. Common Mistakes

**Beginner**
- `{items.length && <List/>}` printing `0` — use an explicit boolean.
- Lowercase component tags (`<myComp />`) producing unknown DOM elements.
- `class` instead of `className`; `style="..."` string instead of an object.
- Expecting `props.key` to work — it's `undefined` by design.

**Intermediate**
- Index keys on reorderable lists → wrong data on the wrong row (§6.4).
- `key={Math.random()}` → full rebuild every render, state and focus destroyed.
- Defining components inside components → constant remounts.
- Still calling `ReactDOM.render` on React 18 → silently no concurrent features.
- Disabling StrictMode to "fix" double effects → hiding a missing cleanup.

**Interview traps**
- Saying the VDOM is "a copy of the real DOM." It's a *description*.
- Saying re-render means the DOM updated. Verified: same type → same node, attribute patched only.
- Claiming keys are "for performance." They are for **identity**; bad keys cause incorrect behavior.

---

## 13. Official Documentation References

- [Describing the UI](https://react.dev/learn/describing-the-ui) · [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx) · [JS in JSX](https://react.dev/learn/javascript-in-jsx-with-curly-braces)
- [Rendering Lists](https://react.dev/learn/rendering-lists) · [Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [Render and Commit](https://react.dev/learn/render-and-commit) · [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [`createElement`](https://react.dev/reference/react/createElement) · [`Fragment`](https://react.dev/reference/react/Fragment) · [`StrictMode`](https://react.dev/reference/react/StrictMode)
- [`createRoot`](https://react.dev/reference/react-dom/client/createRoot) · [`createPortal`](https://react.dev/reference/react-dom/createPortal)
- [New JSX Transform](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)

*Verification environment: React 18.3.1 + `@babel/preset-react` + jsdom, run in Node. Production-build claims checked against `react.production.min.js`.*

---

## 14. Revision Notes

**Key takeaways**
1. JSX → `jsx()`/`createElement()` → plain object → reconciliation → DOM. Build-time sugar only.
2. Element = `{ $$typeof, type, key, ref, props, _owner }`. Cheap; does not call the component.
3. `$$typeof` is a `Symbol` for **XSS protection** — JSON can't forge it.
4. `key` is extracted at the call site, never in props; dev adds a warning getter, prod omits it.
5. Dev freezes elements; **production does not**.
6. Diff is O(n) via two heuristics: **type** and **key**.
7. Same type same position → node reused. Different type or different key → destroyed and rebuilt. *(All verified.)*
8. State is tied to **position in the tree**, not JSX text.
9. Index keys break on insert/reorder — data lands on the wrong row.
10. `createRoot` is the gate for concurrent features; legacy `render` silently opts out.
11. StrictMode double-invokes and remounts effects in **dev only**, to expose impurity and missing cleanup.
12. **Re-render ≠ DOM update.**

**Soundbites**
- "JSX is sugar for function calls — the browser never sees it."
- "An element is a description, not a node."
- "Keys are about identity, not speed — wrong keys give wrong data, not slow data."
- "State belongs to a position in the tree."
- "`$$typeof` is a Symbol so JSON can't forge an element."

---

## 15. Practice Exercises

**1 — Compile it yourself.** Run your own JSX through Babel with `runtime: 'classic'` and `'automatic'`, then with `development: true`. Find where `key` goes in each. Predict the output before you look.

**2 — Inspect an element.** `console.log(<div className="x">hi</div>)`. Locate `$$typeof`, `type`, `key`, `props`. Then try mutating `props` in dev and in a production build and explain the difference.

**3 — Reproduce the index-key bug.** Render a list with uncontrolled `<input>`s keyed by index. Type in each, then prepend an item. Watch values attach to the wrong rows. Switch to stable ids and confirm the fix. *This is the single most valuable exercise in the module.*

**4 — Prove node identity.** Render `<div className="a">one</div>`, capture `container.firstChild`, re-render as `<div className="b">two</div>`, and assert the node is `===`. Then change the tag to `<span>` and assert it isn't.

**5 — Key as a reset switch.** Build a `<Chat contact={c} />` with a draft in local state. Show the draft leaking across contacts, then fix it with `key={c.id}` — no `useEffect`.

**6 — Find the remount.** Define a component inside another, add state, and watch it reset on every parent render. Explain it using Rule 2, then fix it.

**7 — Falsy audit.** Render `0`, `''`, `null`, `undefined`, `false`, `NaN` as children and record which appear. Then explain why `{count && <Badge/>}` is a bug.

**8 — Interview rehearsal.** In 90 seconds: *"Walk me from JSX to a DOM update."* Hit compile → element → render phase → reconciliation (type + key) → commit. Then answer the follow-up: *"Where could state be lost in that pipeline, and why?"*

---

**Next:** [Module 3 — Fiber Architecture](./Module03-FiberArchitecture.md) — work loop, lanes, priorities, interruptible rendering, render vs commit in depth.
