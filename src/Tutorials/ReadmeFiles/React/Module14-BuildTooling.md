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
The wrong first move is guessing — trimming a few imports, adding `lazy()` here and there, and hoping. The right first move is the same instinct §9 already establishes: analyze before touching anything, because a bundle's size is almost never spread evenly across the code, and fixing the wrong 5% wastes effort while the real problem sits untouched.

```bash
npx vite-bundle-visualizer          # or webpack-bundle-analyzer
```

The visualizer turns "3MB, somewhere" into a treemap where the actual offenders are visually obvious. In order of how often each one turns out to be the real answer:

1. **One unexpectedly huge dependency.** A moment.js bundled with every locale, an icon library imported as a whole rather than per-icon, a chart library pulled in for one page. This is almost always the single biggest line item — a 200KB dependency, once found, outweighs every `memo` or micro-optimization in the app combined (the same lesson as §3's lodash measurement: one import line was a 25x difference).
2. **Duplicate packages.** Mismatched peer dependency versions can silently bundle two copies of the same library — the analyzer's treemap makes this visible as the same name appearing twice.
3. **Server-only code leaking into the client bundle.** A database client or a server-only utility imported by a shared file that both server and client code touch.
4. **Missing route-level splits.** One enormous chunk instead of several route-sized ones (§4) — everyone downloads the login page's bundle plus the entire rest of the app.

Fix in that order — biggest line item first — because the ratio of effort to bundle-size reduction drops sharply as you go down the list. Chasing #4 before finding #1 is optimizing the smaller problem while the large one sits unaddressed in the treemap the whole time.

**Q: What stops a package from being tree-shaken?**
Every blocker traces back to one underlying requirement: the bundler must be able to prove, just by *reading* the code without running it, exactly which exports are actually used. Anything that breaks that static provability forces the bundler to keep code "just in case."

**CommonJS format** is the biggest one, and it's structural, not a missing flag. `require(path)` is an ordinary function call, and `require(someVariable)` is completely legal JavaScript — so a bundler can't know at build time what a `require()` call will resolve to without actually running the program (§3's verified case: an ESM bundle dropped the unused function entirely at 49 bytes; the CommonJS version shipped both functions at 231 bytes, because `require()` gave the bundler nothing to statically analyze). ESM's `import` is declarative and static by design — always at the top of the file, always a literal string — which is exactly what makes analysis possible before execution.

```js
import './polyfill';          // side effect on import — bundler MUST keep this, nothing "used" it
// package.json: "sideEffects": false   ← the package author's promise that nothing here does this
```

**Side effects on import** are the second blocker: if a module does real work just by being imported — polyfilling a global, registering something — deleting it because "nothing imports its exports" would silently break the app. The bundler has to assume any module *might* do this unless the package explicitly promises otherwise via `"sideEffects": false` in `package.json` — a missing or incorrect version of that field means the bundler defensively keeps code that was actually safe to drop.

**Barrel files** (`export * from './everything'` in an `index.js`) are the subtle one: importing one named export from a barrel can still pull in the barrel's full dependency graph if the bundler can't prove the other re-exports are unused, especially combined with CommonJS dependencies inside the barrel — the tree-shaking failure isn't in your import line, it's hidden a layer downstream.

**Q: How would you split a large app?**
Split where the boundary already matches user expectation and code structure both — that's routes, and it's why they're the first move, not just a convention. A route change is a moment users already expect a brief pause at (a new page, a new URL), and route boundaries usually align naturally with the app's biggest independent chunks of code — the login page's code genuinely doesn't share much with the settings page's.

```jsx
const Dashboard = lazy(() => import('./Dashboard'));   // route-level split
<Suspense fallback={<Spinner />}><Dashboard /></Suspense>
```

After routes, look for genuinely heavy **standalone features** that most users won't touch on a given visit — a rich text editor, a charting library, a PDF viewer. These are worth their own split specifically because they're large *and* conditional: someone who never opens the editor should never pay for its bundle.

**Prefetching removes the visible cost of splitting** rather than avoiding it — `<link rel="prefetch">` on hover means the chunk is already cached in the background by the time the click lands, so the split point becomes invisible to the user even though it's real on the network (§4).

The failure mode worth naming explicitly is **over-splitting**: turning every component into its own chunk sounds like more optimization, but many small requests compress worse individually than one well-sized chunk (gzip and brotli both do better with more data to find patterns across), and each extra chunk is its own HTTP request with its own overhead. The mental model: split at boundaries where "the user might not need this at all" is true — routes, and genuinely optional heavy features — not at every component boundary just because `lazy()` is available.

**Q: Why are development and production builds different?**
Because the two builds are optimizing for opposite things: development wants to catch your mistakes as early and loudly as possible, even at real runtime cost; production wants to be as fast and small as possible, trusting that development already caught what needed catching. Shipping the same build to both would mean picking one goal and losing the other.

This is Module 2's freezing behavior, generalized. Development freezes every element and adds a warning getter on `key` (Module 2 §4.2, verified: `Object.isFrozen(element)` is `true` in dev, `false` in prod) — real work, done on every single element creation, that exists purely to throw loudly the moment you mutate something you shouldn't. Production skips that work entirely, assuming by then you don't need the guardrail.

```js
if (process.env.NODE_ENV !== 'production') {
  warnAboutSomething();    // this whole block: kept in dev, DELETED in prod
}
```

The mechanism that makes shipping two builds from one source line practical: the bundler replaces `process.env.NODE_ENV` with a literal string at build time, so in a production build that `if` becomes `if (false) { ... }` — dead code the minifier then deletes outright, not just skips at runtime. Nothing about StrictMode's double-render, the dev-only warnings, or element freezing survives into the production bundle; it's compiled out, not merely disabled.

The mistake this explains: shipping a development build to production doesn't just mean "slightly slower" — it means carrying every one of those safety checks, every frozen-object allocation, every warning-getter lookup, into an environment where nothing is reading the warnings anyway. You pay dev's entire cost and get none of dev's benefit, because nobody's watching the console in production.

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
