# Module 14 — Build Tooling

> Part of the [React Mastery course](./README.md). Previous: [Module 13 — Interview Preparation](./Module13-InterviewPrep.md). **Final module.**

Module 7 §2 started from "the bundle exists." This module explains where it comes from — and why one import line can cost you 70KB.

All bundle measurements below come from actually building the code ([`tree/`](./verify/tree/)).

---

## 1. Why a build step exists at all

Browsers can't run what you write. Four gaps:

| You write | Browser needs |
|---|---|
| JSX | Plain function calls (Module 2 §3) |
| TypeScript | JavaScript |
| `import` across hundreds of files | Few requests, not hundreds |
| Modern syntax | Something older browsers support |

A bundler closes all four.

**Analogy:** shipping furniture. You *could* send 400 individual screws, planks, and brackets in separate boxes — the customer gets everything, but unpacking takes forever. A bundler **flat-packs it into a few labelled boxes**, throws away the parts nobody ordered, and writes the instructions in a language the recipient reads.

---

> 📘 **Want the full walkthrough?** [Module 14a](./Module14a-BuildPipelineEndToEnd.md) traces every stage of `npm run build` end to end, including how `.env` files and vault secrets actually reach (or don't reach) your bundle.

## 2. The pipeline

```
Your source
    ↓  TRANSFORM   Babel / SWC / esbuild
JSX → jsx() calls · TS → JS · modern syntax → target syntax
    ↓  RESOLVE     follow every import, build a module graph
    ↓  TREE-SHAKE  drop code nothing imports
    ↓  BUNDLE      group modules into chunks
    ↓  MINIFY      shorten names, strip whitespace and dead branches
    ↓  EMIT        bundle.js + chunks + source maps
```

**Transform** is per-file (Module 2 §3.2 shows the JSX output). **Everything after** needs the whole graph — which is why bundlers are slower than transpilers.

---

## 3. Tree-shaking — measured

Tree-shaking removes exports nothing imports. But it **only works with ES modules**, and here's why.

```js
// lib.js
export function used()   { return 'I am used'; }
export function unused() { return 'I am NOT used'; }

// main.js
import { used } from './lib.js';
```

Built as ESM vs CommonJS ([`tree/`](./verify/tree/)):

```
ESM bundle:  function e(){return"I am used"}console.log(e());
             contains "NOT used"? 0        →  49 bytes

CJS bundle:  contains "NOT used"? 1        → 231 bytes   ← dead code SHIPPED
```

**Why CommonJS can't be shaken:** `require()` is a function call that runs at runtime. `require(someVariable)` is legal, so the bundler can't know statically what's used. ESM `import` is static — declared at the top, analysable before running anything.

### The lodash lesson

This is the single most valuable measurement in the module. Same function, three import styles:

```
import _ from 'lodash';                     73,808 bytes
import debounce from 'lodash/debounce';      3,478 bytes
import { debounce } from 'lodash-es';        2,890 bytes
```

**73KB versus 2.9KB — a 25× difference from one line.** `lodash` ships as CommonJS, so importing the default pulls the whole library. `lodash-es` is ESM and shakes down to just what you used.

**Check your big dependencies for an `-es` build or a deep-import path.** This costs more than every `memo` in Module 9 combined.

### What blocks tree-shaking

- **CommonJS dependencies** — as above.
- **Side effects.** If a module does work on import (`import './polyfill'`), the bundler must keep it. Packages declare safety via `"sideEffects": false` in `package.json`.
- **Barrel files.** `export * from './everything'` in an `index.js` can pull far more than you referenced.

---

## 4. Code splitting

One giant bundle means users download your entire app to see the login page.

```jsx
const Dashboard = lazy(() => import('./Dashboard'));   // ← split point

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>
```

Dynamic `import()` tells the bundler to emit a **separate chunk**, fetched on first render.

**Split at routes first.** Users already expect a pause when navigating, and route boundaries usually align with the biggest code differences.

**Don't over-split.** Fifty tiny chunks means fifty requests and worse compression than a few well-sized ones.

**Prefetch to hide the delay:**

```jsx
<link rel="preload" href="/chunk.js" as="script" />   // need it now
<link rel="prefetch" href="/next-page.js" />          // probably need it soon
```

A good trick: prefetch a route's chunk on link hover — by the time the click lands, it's cached.

---

## 5. Bundlers compared

| Tool | Dev speed | Notes |
|---|---|---|
| **Vite** | Very fast | Native ESM in dev (no bundling), Rollup for production. React's top recommendation. |
| **Rsbuild** | Very fast | Rspack (Rust) with tuned defaults |
| **Parcel** | Fast | Zero config |
| **webpack** | Slower | Most configurable, biggest plugin ecosystem, still everywhere |
| **esbuild** | Fastest | Go; used *inside* other tools |
| **Turbopack** | Very fast | Rust; Next.js |

**Why Vite feels instant in dev:** it doesn't bundle. Browsers support ES modules natively, so Vite serves your files directly and transforms them on demand. Change one file, and only that file is re-processed — no rebuild proportional to app size.

```
webpack dev:  bundle everything → serve      (slow start, slow rebuild)
Vite dev:     serve modules directly          (instant start)
Vite build:   Rollup bundles for production   (still needed for HTTP efficiency)
```

**Analogy:** webpack dev is **cooking the whole buffet before opening**. Vite is **cooking each dish as it's ordered** — the restaurant opens immediately, and re-cooking one dish doesn't mean redoing the buffet.

> ⚠️ **Create React App is deprecated.** React's docs no longer list it — the recommendations are now **Vite, Parcel, or Rsbuild**, or a framework like Next.js. *(This project still uses `react-scripts`, which is why builds feel slow — migrating to Vite is the single biggest DX win available here.)*

---

## 6. Babel vs SWC vs esbuild

All three do the transform step; they differ in language and scope.

| | Written in | Speed | Plugin ecosystem |
|---|---|---|---|
| **Babel** | JavaScript | Slowest | Huge — anything you need |
| **SWC** | Rust | ~20× faster | Growing (Next.js default) |
| **esbuild** | Go | Fastest | Limited |

Babel is slow because it's JS parsing JS. SWC and esbuild are compiled languages doing the same job in parallel.

**When you still need Babel:** a plugin with no Rust/Go equivalent — some CSS-in-JS transforms, older decorator proposals, bespoke codemods.

> The **React Compiler** ships as a Babel plugin, so Babel isn't going away.

---

## 7. Source maps

Minified production code is unreadable:

```js
function e(t){return t.a+t.b}   // good luck debugging this
```

A source map maps compiled positions back to your original files, so DevTools shows real names and line numbers.

| Setting | Use |
|---|---|
| `eval-cheap-module-source-map` | Dev — fast rebuilds |
| `source-map` | Production — accurate, separate `.map` file |
| `hidden-source-map` | Production — generated but not linked; upload to Sentry only |
| `false` | No debugging at all |

⚠️ **Source maps expose your source code.** Publishing them publicly means anyone can read your original files. Use `hidden-source-map` and upload to your error tracker instead.

---

## 8. Environment and dead-code elimination

```js
if (process.env.NODE_ENV !== 'production') {
  warnAboutSomething();
}
```

The bundler replaces `process.env.NODE_ENV` with the literal `"production"`, so this becomes `if (false) {...}` — and the minifier deletes it entirely.

This is how React ships two builds from one source. Module 2 §4.2 verified the difference: development freezes elements and adds warning getters; production does neither. **Ship a development build and you get all that overhead in production.**

---

## 9. Analysing a bundle

Before optimising, look:

```bash
npx vite-bundle-visualizer          # Vite
npx webpack-bundle-analyzer stats.json   # webpack
```

You're looking for:

1. **One unexpectedly large dependency** — moment.js with all locales, an icon set imported whole, a chart library.
2. **Duplicates** — two versions of the same package from mismatched peer deps.
3. **Server-only code** leaking into the client bundle.
4. **Missing splits** — one enormous chunk.

**Analogy:** it's **weighing your luggage before the airport**, not after they've charged you.

---

## 10. Interview Questions

### Basic

**Q: Why do React apps need a build step?**
Browsers don't understand JSX or TypeScript, and shipping hundreds of separate module files would mean hundreds of requests. A bundler transforms, bundles, and optimises.

**Q: What is tree-shaking?**
Removing exported code nothing imports. Verified: an ESM bundle dropped the unused function entirely (49 bytes); the CommonJS version shipped it (231 bytes).

**Q: What's a source map?**
A file mapping minified code back to your original source so DevTools shows real names and line numbers.

### Intermediate

**Q: Why doesn't tree-shaking work with CommonJS?**
`require()` is a runtime function call — `require(someVariable)` is legal, so the bundler can't know statically what's used. ESM imports are static and analysable before execution.

**Q: Why is `import _ from 'lodash'` a problem?**
Measured: **73,808 bytes** versus **2,890** for `import { debounce } from 'lodash-es'` — a 25× difference for the same function. `lodash` is CommonJS, so the default import pulls everything.

**Q: Why is Vite's dev server so fast?**
It doesn't bundle in dev. Browsers support ES modules natively, so Vite serves files directly and transforms on demand — startup and rebuild times don't scale with app size. Production still bundles, via Rollup.

**Q: Babel vs SWC vs esbuild?**
All transform code. Babel is JavaScript — slowest, but the richest plugin ecosystem. SWC (Rust) and esbuild (Go) are far faster with fewer plugins. You still need Babel for plugins with no native equivalent — including the React Compiler.

### Senior

**Q: You inherit an app with a 3MB bundle. What do you do?**
Measure first — run a bundle analyzer. Look for one oversized dependency, duplicate packages from mismatched peer deps, missing route-level splits, and server-only code leaking client-side. Fix the biggest item first; a single 200KB dependency usually outweighs every micro-optimisation.

**Q: What stops a package from being tree-shaken?**
CommonJS format, side effects on import (the bundler must keep anything that does work at module load), a missing or wrong `"sideEffects"` field, and barrel files re-exporting everything.

**Q: How would you split a large app?**
Routes first — biggest wins, and users expect a pause on navigation. Then genuinely heavy standalone features (a chart library, a rich text editor). Prefetch on hover so the click feels instant. Avoid over-splitting: many tiny chunks compress worse and cost extra requests.

**Q: Why are development and production builds different?**
Dev includes warnings, element freezing, and StrictMode checks — real cost that only pays off while developing. `process.env.NODE_ENV` is replaced at build time so the minifier can delete those branches. Ship a dev build and you carry all of it into production.

---

## 11. Common Mistakes

- ❌ `import _ from 'lodash'` — *(verified: 25× larger)*.
- ❌ Assuming everything tree-shakes. CommonJS deps don't.
- ❌ Publishing public source maps — that's your source code.
- ❌ Shipping a development build to production.
- ❌ Splitting every component — many tiny chunks compress worse.
- ❌ Optimising the bundle without analysing it first.
- ❌ Starting new projects with Create React App — deprecated, no longer recommended.
- ❌ Ignoring duplicate packages from mismatched peer deps.

---

## 12. References

- [Build a React App from Scratch](https://react.dev/learn/build-a-react-app-from-scratch) — Vite, Parcel, Rsbuild
- [Creating a React App](https://react.dev/learn/creating-a-react-app) — recommended frameworks
- [Vite](https://vitejs.dev/) · [webpack](https://webpack.js.org/) · [esbuild](https://esbuild.github.io/) · [SWC](https://swc.rs/)
- [New JSX Transform](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)

---

## 13. Revision Notes

1. Build step exists for **JSX, TypeScript, module bundling, and syntax targets**.
2. Pipeline: **transform → resolve → tree-shake → bundle → minify → emit**.
3. **Tree-shaking needs ESM.** `require()` is dynamic and can't be analysed statically. *(Verified: 0 vs 1 dead functions shipped.)*
4. **`import _ from 'lodash'` = 73,808 bytes; `lodash-es` = 2,890.** *(Verified.)*
5. Tree-shaking is blocked by **CommonJS, side effects, and barrel files**.
6. **Split at routes first**; prefetch on hover; don't over-split.
7. **Vite is fast in dev because it doesn't bundle** — native ESM, transform on demand.
8. **Babel** (JS, slow, most plugins) vs **SWC** (Rust) vs **esbuild** (Go). React Compiler is a Babel plugin.
9. Use **`hidden-source-map`** in production — public maps expose your source.
10. `NODE_ENV` replacement lets the minifier delete dev-only code.
11. **Create React App is deprecated** — use Vite, Parcel, Rsbuild, or a framework.
12. **Analyse before optimising.**

**Soundbites**
- "Tree-shaking needs static imports — `require()` is a function call, and functions can take variables."
- "One import line cost 73KB instead of 3KB."
- "Vite is fast in dev because it doesn't bundle at all."
- "Source maps in production are your source code in production."

---

## 14. Practice Exercises

**1 — Prove tree-shaking.** Build a two-export module as ESM and as CommonJS, importing one export. Check whether the unused one survives.

**2 — Measure the lodash difference.** Bundle all three import styles and compare sizes. Then check your own project for a full-library import.

**3 — Analyse a real bundle.** Run a bundle analyzer on a project. Find the largest dependency you didn't expect and decide whether to split, replace, or drop it.

**4 — Split a route.** Convert a route to `lazy()` + `<Suspense>`, confirm the new chunk in the network tab, then add hover-prefetching.

**5 — Feel the dev-server difference.** Scaffold the same small app with Vite and with CRA. Compare cold start and hot-reload times.

**6 — Break the source map.** Build with and without source maps, then throw an error in production mode and compare the stack traces.

---

## 🎉 Course complete

Fourteen modules, from why React exists to how the bundle reaches the browser.

| | Module |
|---|---|
| **Foundations** | [1 Why React](./Module01-WhyReactExists.md) · [1a Design Principles](./Module01a-DesignPrinciples.md) · [2 Fundamentals](./Module02-ReactFundamentals.md) |
| **Internals** | [3 Fiber](./Module03-FiberArchitecture.md) · [4 VDOM & Diffing](./Module04-VirtualDOM-Diffing.md) · [12 Internals](./Module12-Internals.md) |
| **Building** | [5 Components](./Module05-ComponentModel.md) · [6 Hooks](./Module06-Hooks.md) · [10 Patterns](./Module10-Patterns.md) |
| **Delivery** | [7 Rendering](./Module07-Rendering.md) · [8 State](./Module08-StateManagement.md) · [9 Performance](./Module09-Performance.md) · [14 Build Tooling](./Module14-BuildTooling.md) |
| **Context** | [11 Versions](./Module11-VersionHistory.md) · [13 Interview Prep](./Module13-InterviewPrep.md) |

**160+ interview questions**, and **36 runnable scripts** in [verify/](./verify/) proving the claims rather than asserting them.

**Where to go next:** [Module 13](./Module13-InterviewPrep.md) has a two-week revision plan. Start there.
