# Verification scripts

Runnable proofs for the claims in the course modules. Every "verified" output quoted in a module came from one of these.

## Setup

These need `react`, `react-dom`, `@babel/core`, `@babel/preset-react`, and `jsdom`. The project root doesn't have `node_modules` installed, so the simplest path is a throwaway folder:

```bash
mkdir -p /tmp/react-verify && cd /tmp/react-verify
npm init -y
npm i react@18 react-dom@18 @babel/core @babel/preset-react jsdom
cp <repo>/src/Tutorials/ReadmeFiles/React/verify/*.cjs .
node inspect.cjs
```

## Scripts — Module 2

| Script | Proves |
|---|---|
| `inspect.cjs` | React element object shape: `$$typeof`, `type`, `key`, `ref`, `props`, `_owner`, `_store`. Dev-mode freezing. Numeric keys coerced to strings. Single child is not an array. |
| `jsxc.cjs` | JSX compiler output for `runtime: 'classic'` vs `'automatic'` vs `automatic + development`. Shows `jsx` vs `jsxs`, `key` moving to the 3rd argument, and `jsxDEV` source locations. |
| `keyprop.cjs` | `props.key` is a **non-enumerable dev-only warning getter** returning `undefined`. Compare with the production build, where the property is absent entirely. |
| `identity.cjs` | The three reconciliation rules: same type → same DOM node reused; changed type → node replaced; changed `key` → node replaced. |
| `indexkey.cjs` | **The index-key bug.** Uncontrolled inputs show typed values sticking to positions instead of rows when a new item is prepended. Compare against stable ids. |
| `strict.cjs` | StrictMode double-invokes render bodies and `useState` initializers, and runs effects setup → cleanup → setup. |
| `keyparent.cjs` | **Keys don't cross a changed parent.** When the wrapper tag changes (`div` → `section`), the child's state is lost — and adding a `key` to the child, or to the parent, does *not* save it. Keys only distinguish siblings within one parent. |
| `mutate.cjs` | **Element mutation, dev vs prod.** `el.props.className = 'red'` throws `TypeError` in the dev build but silently succeeds in production (`blue → red`). Also shows that the dev error only fires in strict mode. |
| `position.cjs` | **State vs. position.** A counter set to 5 loses its state when wrapped in a new `<div>`, when the wrapper tag changes, or when a sibling is added above it — and keeps it when given a stable `key`. |

## Scripts — Modules 3 & 4

| Script | Proves |
|---|---|
| `bench.cjs` | **The performance ordering.** Updates 1 row of 1000 three ways: React re-render, optimal vanilla, naive `innerHTML` rebuild. Result is consistently `optimal < React < naive rebuild`. ⚠️ **Don't quote the ratios** — jsdom has no layout, style, or paint, so the numbers aren't representative of any browser. Only the ordering transfers. |
| `wholesale.cjs` | React does **not** build DOM wholesale only on first mount — changing a `key` rebuilds an entire subtree later, reusing zero nodes. |
| `trace.cjs` | Render order across mount and update — render body → `useLayoutEffect` → `useEffect` — plus automatic batching: 3 `setState` calls in one tick produce **1** render. |
| `tree.cjs` | **One tree for the whole app.** Prints the real fiber tree for a nested app — 15 fibers covering every component *and* every host element, all reachable from `HostRoot`. Shows components and their DOM tags are separate fibers. |
| `counter.cjs` | **The Counter walkthrough.** Three clicks traced through the two trees: `TreeA(0) → TreeB(1) → TreeA(2) → TreeB(3)`. Shows the spare tree always carries the *previous committed* count, never a stale `0`. |
| `buffers.cjs` | **`current` / `workInProgress` / `alternate`.** Labels fiber objects and traces them across mount and two updates: mount has `alternate = null`; update 1 creates a second object; update 2 swaps **back to the original**. Proves React ping-pongs between exactly two objects. |
| `preserve.cjs` | **What survives fiber recycling.** After two updates `current` is the original mount object again — but the hook value and `stateNode` are carried over, not wiped. Shows recycling rewrites the scratch fields while preserving state. |
| `fiber.cjs` | **Live fiber tree.** Reaches the tree via the container's `__reactContainer$…` property → `.stateNode.current`. Shows real field names, that host fibers have a DOM node in `stateNode` while function fibers have `null`, that hooks live in `memoizedState`, and that `current`/`alternate` swap on update (double buffering). |
| `condhooks.cjs` | **Why hooks can't be conditional.** A hook behind an `if` shifts every later hook onto the wrong slot; React compares hook counts and throws `Rendered fewer hooks than expected`. |
| `moves.cjs` | List reorder `[A,B,C]` → `[C,A,B]` reuses **all three** DOM nodes — keys preserve identity across a move. |
| `layout.cjs` | **`useLayoutEffect` runs AFTER render, not before.** Logs the live DOM text at each step: during render the DOM still shows the old value (and the ref is `null` on mount); by `useLayoutEffect` the DOM is updated. Order is render → DOM commit → layout effect → paint → passive effect. |
| `bailout.cjs` | `Object.is` bailout on identical values; re-render when a new object reference has identical content; children re-render by default while `memo` bails out. |

## Scripts — Module 5

| Script | Proves |
|---|---|
| `context.cjs` | **The context performance trap.** Over 2 updates: a context consumer re-rendered every time (`reader=3`), while a `memo`'d **non**-consumer never did (`memoSibling=1`). `memo` cannot stop context re-renders. Also shows a referentially stable value still re-renders consumers when the parent re-renders. |
| `portal.cjs` | **Portals move the DOM node, not the React tree.** A button portalled into a separate host is *not* a DOM child of `#root`, yet context still reaches it and its click still fires the React parent's `onClick`. |
| `controlled.cjs` | The two form warnings, verbatim: `value` without `onChange`, and switching an uncontrolled input to controlled. |

## Scripts — Module 6

| Script | Proves |
|---|---|
| `hooks.cjs` | Three classics at once: **stale closure** (interval keeps logging `0` while state is `9`), **lazy init** (`useState(expensive())` runs 3× over 3 renders vs `useState(() => …)` once), and **`useRef` causes no re-render** (3 mutations → 0 renders). |
| `memo.cjs` | **`memo` + `useCallback` are a package deal.** Over 3 parent re-renders: plain child 3, `memo` + inline arrow prop **3** (memo defeated), `memo` + `useCallback` **0**. |

## Scripts — Module 7

| Script | Proves |
|---|---|
| `ssr.cjs` | **Why hydration exists.** `renderToString` on a button with `onClick` emits `<button>Count: 0</button>` — no handler. HTML cannot carry a function, so the markup looks finished but does nothing until JS attaches. |
| `hydrate.cjs` | **A hydration mismatch discards the server HTML.** Server rendered `SERVER-TIME`, client wanted `CLIENT-TIME`; React warned and replaced the subtree — you paid for SSR and got CSR. |

## Scripts — Module 8

| Script | Proves |
|---|---|
| `store.cjs` | **Context has no selectors.** Same two theme changes, three ways: one combined context → the `user`-only component re-renders **2×** for nothing; split contexts → **0×**; external store with selectors → **0×** from a single store. |
| `tearing.cjs` | `useSyncExternalStore` subscribing a component to an external source, and why it exists — concurrent rendering can otherwise show two different values in one commit (tearing). |

## Scripts — Module 9

| Script | Proves |
|---|---|
| `perf3.cjs` | **The memo verdict, in render counts.** 50 rows, 10 updates: plain + changing props = **500** child renders; `memo` + changing props = **500** (memo did nothing, plus 500 wasted comparisons); `memo` + stable props = **0**. |
| `waterfall.cjs` | **The `useEffect` fetch waterfall.** Two 50 ms requests take ~110 ms because the child cannot start until the parent's data lands (child starts at 59 ms). |
| `perf.cjs` | `useMemo` on a genuinely expensive calculation (200k-iteration loop) runs it once instead of on every render. ⚠️ Prints timings — treat the **direction** as the result, not the numbers (jsdom, single machine). |

## Scripts — Module 10

| Script | Proves |
|---|---|
| `patterns.cjs` | **Why `cloneElement` breaks compound components.** With direct children it works (`A* B`); wrap two tabs in another component and they receive nothing (`A* C D`) — `Children` only sees direct JSX children. The context version marks the right tab active at any nesting depth. |

## Scripts — Module 12

| Script | Proves |
|---|---|
| `events.cjs` | **Where React attaches listeners.** Wrapping `addEventListener` shows **130 listeners on the root container vs 1 on document** — the React 17 delegation change. Also shows the handler receives a `SyntheticBaseEvent` wrapping a real `MouseEvent`, with pooling gone. |

## Scripts — Module 13

| Script | Proves |
|---|---|
| `puzzles.cjs` | Four classic output puzzles, answered: `setC(c+1)`×3 → **1** vs `setC(v=>v+1)`×3 → **3**; effect order `render 0 → effect 0 → render 1 → cleanup 0 → effect 1` (cleanup runs *after* the next render); ref bumps with a state bailout → `{state: 0, ref: 3}`; a handler's `setTimeout` capturing stale state. |

## Scripts — Module 14

| Script | Proves |
|---|---|
| [`tree/`](./tree/) | **Tree-shaking needs ESM.** An ESM bundle drops the unused export (49 bytes); the CommonJS build ships it (231 bytes). Also measures lodash imports: `import _ from 'lodash'` = **73,808 bytes** vs `lodash-es` = **2,890** — 25× from one line. See `tree/README.md`. |

## Checking production behavior

`react.production.min.js` isn't in the package `exports` map, so require it by full path:

```js
const React = require('/abs/path/node_modules/react/cjs/react.production.min.js');
```

This is how the dev-vs-prod differences in Module 2 §4.2 and §4.3 were confirmed.
