# Module 7 — Rendering Patterns

> Part of the [React Mastery course](./README.md). Previous: [Module 6 — Hooks](./Module06-Hooks.md). Next: [Module 8 — State Management](./Module08-StateManagement.md).

Every module so far assumed your app renders in the browser. This one covers the alternatives: rendering on a server, at build time, in pieces, or not at all.

Coverage follows the [patterns.dev rendering patterns](https://www.patterns.dev/react/client-side-rendering/) list, plus Islands and the React APIs that implement each one.

---

## 1. The one question every pattern answers

> **Where and when does your HTML get built?**

Three places, and every pattern is a mix of them:

```
BUILD TIME          SERVER (per request)         BROWSER
   ↓                        ↓                       ↓
 SSG / ISR                 SSR                     CSR
 fastest,             fresh data,            interactive,
 stale-est            slower TTFB            slow first paint
```

**Analogy:** think of a restaurant.

- **CSR** — they hand you raw ingredients and a stove. Nothing to eat at first, but after that you cook whatever you want instantly.
- **SSR** — the kitchen cooks your dish when you order. You wait, but you get food on a plate.
- **SSG** — the dish was cooked this morning and sits ready. Instant, but it's this morning's dish.
- **Streaming SSR** — they bring your starter the moment it's ready, then the main, then dessert. You start eating sooner.

The rest of this module is just those four ideas plus fixes for their weaknesses.

---

## 2. CSR — Client-Side Rendering

The default with Create React App or a plain Vite SPA. The server sends an almost empty page:

```html
<div id="root"></div>
<script src="/bundle.js"></script>
```

Then JavaScript does everything — build the DOM, fetch the data, wire up routing.

```
HTML (empty)  →  download JS  →  parse  →  execute  →  fetch data  →  paint
     ↑                                                                  ↑
  fast TTFB                                        user sees nothing until here
```

**Good at:** dashboards, internal tools, design tools, spreadsheets — anywhere the user logs in once and stays for an hour. The slow start is paid once, then every interaction is instant with no server round trip.

**Bad at:** SEO, marketing pages, news, anything a user bounces off in 5 seconds, and low-end phones on poor networks.

**The metrics story:** great TTFB (the empty shell arrives instantly), poor FCP and LCP (nothing to see until JS runs), late TTI — but excellent responsiveness afterwards.

Two structural problems you already met in Module 4 §5:
1. **Blank screen** while the bundle downloads and executes.
2. **Fetch waterfalls** — `useEffect` runs after paint, so a child can't start fetching until its parent has rendered and committed.

---

## 3. SSR — Server-Side Rendering

The server runs your components and sends real HTML.

```jsx
// server
import { renderToString } from 'react-dom/server';
const html = renderToString(<App />);

// client
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

Verified output:

```
renderToString(<App/>)  →  <div id="app"><h1>Hello</h1><button>Count: 0</button></div>
```

The user sees content immediately, and crawlers get real markup.

### Hydration — and why it's needed

Look closely at that HTML. Here's the `<button>` we rendered:

```jsx
<button onClick={() => setN(n + 1)}>Count: {n}</button>
```

And here's what actually shipped:

```html
<button>Count: 0</button>
```

**No `onClick`.** HTML cannot carry a function ([`ssr.cjs`](./verify/ssr.cjs)). So the page *looks* finished but does nothing when clicked.

**Hydration** is React re-running your components on the client, walking the existing DOM, and attaching the event handlers and state that HTML couldn't express.

**Analogy:** SSR sends a **photograph of a working control panel**. It looks perfect, but pressing a button does nothing — it's a picture. Hydration is the electrician arriving to wire up every button behind the photo. Until they finish, it's decoration.

This creates the **uncanny valley** of SSR: content appears fast, but taps do nothing until the JS loads and hydration completes. Users notice.

### Hydration mismatches

The client's first render must produce **exactly** what the server sent. If not:

```
Warning: An error occurred during hydration. The server HTML was replaced with client content
```

Verified ([`hydrate.cjs`](./verify/hydrate.cjs)) — server rendered `SERVER-TIME`, client wanted `CLIENT-TIME`:

```
Server HTML : <p>Rendered at: SERVER-TIME</p>
Final DOM   : <p>Rendered at: CLIENT-TIME</p>
  (React discarded the server HTML and re-rendered on the client)
```

**That's the real cost — React throws away the server HTML for that subtree.** You paid for SSR and got CSR.

Usual causes: `Date.now()`, `Math.random()`, `window`/`localStorage` during render, locale-dependent formatting, browser extensions injecting markup.

**Fix:** render the server-safe value first, then update in an effect:

```jsx
const [time, setTime] = useState(null);           // matches server
useEffect(() => setTime(new Date()), []);         // client-only, after hydration
```

---

## 4. SSG and ISR — rendering at build time

**Static Site Generation** runs your components once, at build, and saves plain HTML files. No server work per request; a CDN serves the file.

Fastest possible delivery. The catch: content is frozen until you rebuild. A 10,000-page site means a 10,000-page build.

**Incremental Static Regeneration** fixes the staleness. Serve the cached page, and rebuild it in the background after a set interval:

```jsx
// Next.js
export const revalidate = 60;   // serve cached; regenerate at most once a minute
```

**Analogy:** SSG is a **printed newspaper** — instant to read, fixed at print time. ISR is a **newspaper with a standing reprint order** — readers get the current edition, and a fresh one is printed in the background when it's old enough. Nobody waits for the press.

Use SSG for docs, blogs, and marketing. Use ISR when content changes but not per-user — product pages, listings.

---

## 5. Streaming SSR — don't wait for the slowest part

Plain `renderToString` has one flaw: **it's all or nothing.** One slow database query and the entire page waits.

```
renderToString:   [====== wait for everything ======] → send
Streaming:        [shell] → send → [posts ready] → send → [comments] → send
```

React 18 replaced it with `renderToPipeableStream`:

```jsx
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);              // start sending immediately
  }
});
```

`<Suspense>` marks the split points:

```jsx
<ProfileLayout>
  <ProfileCover />                        {/* shell — sent immediately */}
  <Suspense fallback={<Skeleton />}>
    <Posts />                             {/* streamed when ready */}
  </Suspense>
</ProfileLayout>
```

React sends the shell with the skeleton in place. When `Posts` resolves, it sends the real HTML plus a tiny inline `<script>` that swaps out the skeleton.

**`onShellReady` vs `onAllReady`:**

| | Fires when | Use for |
|---|---|---|
| `onShellReady` | Shell is done | Real users — progressive display |
| `onAllReady` | Everything is done | Crawlers, static generation |

**Analogy:** back to the restaurant. `renderToString` is a kitchen that refuses to serve anything until all four courses are plated. Streaming brings each course out as it's ready.

---

## 6. Progressive and Selective Hydration

Hydration has its own version of the same problem: **the page can't be interactive until the whole tree is hydrated.**

**Progressive hydration** hydrates in chunks rather than all at once — by priority, or as components scroll into view.

**Selective hydration** is React 18's automatic version, and it's cleverer. Two behaviors:

1. Content still streaming? React hydrates what has arrived — the page becomes usable before everything loads.
2. **A user clicks something that isn't hydrated yet? React re-prioritises and hydrates that part first.**

```
    Streaming in:  [Header ✓] [Sidebar ✓] [Comments …still loading]
                                              ↑
                       user clicks here → React hydrates Comments FIRST
```

**Analogy:** the electrician from §3 now works to a plan. Instead of wiring the building floor by floor, they wire the entrance first so people can get in — and if someone's standing at a lift pressing the button, they go wire *that* lift next.

This falls straight out of lanes and interruptible rendering (Module 3). A click is a high-priority lane; React reorders its work to serve it.

---

## 7. React Server Components

The newest and most confused-with-SSR pattern. **RSC is not SSR.**

| | SSR | Server Components |
|---|---|---|
| Runs on server | Yes | Yes |
| Ships component JS to browser | **Yes** | **No** |
| Needs hydration | Yes | No — nothing to hydrate |
| Can use state/effects | Yes | **No** |
| Runs again on client | Yes | Never |

SSR renders your component on the server **and then ships it to the browser too**, so it can hydrate. A Server Component runs on the server and **only its output travels** — the code never reaches the browser.

```jsx
// Server Component (the default in the RSC model)
async function Notes() {
  const notes = await db.notes.getAll();      // direct DB access, no API layer
  return <ul>{notes.map(n => <li key={n.id}>{n.text}</li>)}</ul>;
}
```

```jsx
'use client';                                  // ← the boundary
export default function Expandable({ children }) {
  const [open, setOpen] = useState(false);     // hooks need the client
  return <div onClick={() => setOpen(!open)}>{open && children}</div>;
}
```

**The bundle win is the headline.** A markdown renderer plus sanitizer is ~75KB gzipped in the client bundle. As Server Components, that becomes **0KB** — the libraries never leave the server.

**Server Components cannot:** use `useState`/`useReducer`, use effects, attach event handlers, or touch browser APIs. They're not in the browser to do any of it.

**Analogy:** a Server Component is a **meal delivered cooked**; a Client Component is a **meal kit**. The delivered meal is lighter to transport and you eat it immediately — but you can't change the recipe. The kit is heavier and needs assembly (hydration), but you can adjust it as you go. Real apps ship mostly cooked meals with a few kits where interactivity is needed.

> `'use server'` is **not** the opposite of `'use client'`. It marks **Server Functions** (actions you can call from the client), not Server Components. Common interview trap.

---

## 8. Islands Architecture

Not React-native, but you'll be asked to compare.

The page is **static HTML by default**, with small independent interactive zones dropped in. Each island ships and hydrates its own JS separately, and there's never one unified component tree on the client.

```
┌─────────────────────────────────────┐
│  Static HTML — 0 KB JS              │
│                                     │
│   ┌──────────┐      ┌────────────┐  │
│   │ 🏝 Search │      │ 🏝 Cart     │  │  ← only these ship JS
│   └──────────┘      └────────────┘  │
│                                     │
│  More static HTML — 0 KB JS         │
└─────────────────────────────────────┘
```

**How it differs from progressive hydration** — the key distinction, and it's the question interviewers ask: progressive hydration still has **one tree** and just decides which branches to hydrate first. Islands never build a unified tree at all; the static parts have no hydration payload because they were never React to begin with.

Astro is the reference implementation (`client:load`, `client:visible`, `client:idle`). Fresh, Qwik, and Marko take similar approaches.

**Strengths:** 80%+ less JS on content-heavy sites; one broken island can't take down the page.
**Weaknesses:** islands talking to each other is awkward, and shared global state across many widgets fights the model. Bad fit for app-like UIs.

---

## 9. Code splitting, lazy loading, preloading

Independent of the above — these shrink whatever you do ship.

```jsx
const Dashboard = lazy(() => import('./Dashboard'));   // separate chunk

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>
```

`lazy` + dynamic `import()` tells the bundler to split at that point. The chunk downloads only when the component first renders.

**Split at route boundaries first** — that's where the biggest wins are, and users already expect a moment when navigating.

**Preloading** removes the delay by fetching *before* it's needed:

```jsx
<link rel="preload" href="/chunk.js" as="script" />   // need it now
<link rel="prefetch" href="/next-page.js" />          // probably need it soon
```

A common trick: prefetch a route's chunk when the user hovers its link. By the time they click, it's cached.

**Analogy:** code splitting is **packing several small suitcases instead of one huge trunk**. Prefetching is **sending the next suitcase ahead to your hotel** so it's waiting when you arrive.

---

## 10. Choosing a pattern

| Your situation | Pattern |
|---|---|
| Logged-in dashboard, long sessions | **CSR** |
| Marketing site, blog, docs | **SSG** (+ Islands if some interactivity) |
| Product pages, changes hourly | **ISR** |
| Per-user content, SEO matters | **SSR**, streaming |
| Big page, one slow section | **Streaming SSR + Suspense** |
| Heavy server-side libraries | **Server Components** |
| Mostly-static, a few widgets | **Islands** |

Most real apps mix them. Next.js lets you pick per route — static marketing pages, ISR product listings, SSR for the dashboard.

---

## 11. Interview Questions

### Basic

**Q: CSR vs SSR?**
CSR sends an empty shell and the browser builds everything — fast TTFB, slow first paint, bad SEO. SSR sends real HTML from the server — content and crawlers see it immediately, but TTFB is slower and the page needs hydrating before it responds.

**Q: What is hydration?**
React re-running your components on the client over server-rendered HTML to attach event handlers and state. Needed because HTML can't carry functions — verified: `renderToString` on a button with `onClick` produces `<button>Count: 0</button>`, no handler.

**Q: SSG vs SSR?**
SSG renders at build time into static files — fastest, but stale until rebuilt. SSR renders per request — always fresh, more server work.

### Intermediate

**Q: What causes a hydration mismatch and why does it matter?**
The client's first render differs from the server HTML — `Date.now()`, `Math.random()`, reading `window` during render. It matters because React **discards the server HTML for that subtree and re-renders on the client**, so you paid SSR's cost and got CSR's result. Verified.

**Q: What does streaming SSR fix?**
`renderToString` waits for the entire tree, so one slow query blocks the whole page. `renderToPipeableStream` sends the shell immediately and streams Suspense boundaries as they resolve.

**Q: `onShellReady` vs `onAllReady`?**
`onShellReady` starts streaming as soon as the shell renders — best for users. `onAllReady` waits for everything — needed for crawlers and static generation that require complete HTML.

**Q: What is ISR?**
Static pages that regenerate in the background after a revalidation window. Users always get a cached page instantly; freshness catches up without a full rebuild.

### Senior

**Q: Are Server Components just SSR?**
No. SSR renders on the server *and* ships the component JS so it can hydrate. Server Components render on the server and ship **only their output** — the code never reaches the browser, there's nothing to hydrate, and they can't use state, effects, or event handlers. The win is bundle size: server-only libraries become 0KB on the client.

**Q: Islands vs progressive hydration?**
Progressive hydration still has one component tree and just orders which branches hydrate first. Islands never form a unified tree — the page is static HTML and each interactive zone hydrates independently, so static regions carry no hydration payload at all.

**Q: How does selective hydration relate to Fiber?**
It's lanes applied to hydration. A click is a high-priority lane, so if a user interacts with a not-yet-hydrated boundary, React reprioritises and hydrates that subtree first. Only possible because rendering is interruptible (Module 3).

**Q: When would you argue against SSR?**
When there's no SEO or first-paint requirement — an internal dashboard behind a login. SSR adds server cost, a hydration step, and a class of mismatch bugs, for benefits nobody collects. Also when your content is fully static: SSG is strictly better.

**Q: What's the uncanny valley of SSR?**
The window where content is visible but not interactive — the HTML has arrived, hydration hasn't finished, and clicks do nothing. Users perceive it as broken. Streaming plus selective hydration narrows it; Server Components and Islands shrink the JS that has to run at all.

---

## 12. Common Mistakes

- ❌ Assuming SSR makes an app faster overall. It improves first paint; it usually delays interactivity.
- ❌ `Date.now()` or `Math.random()` during render in an SSR app — guaranteed mismatch.
- ❌ Reading `window` or `localStorage` during render. Do it in an effect.
- ❌ Suppressing mismatch warnings. React silently re-renders the subtree on the client.
- ❌ Still using `renderToString` on React 18+ when streaming is available.
- ❌ Thinking `'use server'` marks a Server Component. It marks Server Functions.
- ❌ Expecting `useState` to work in a Server Component.
- ❌ Code splitting every component. Split routes first; over-splitting means many small requests.
- ❌ Calling Islands "the same as progressive hydration."

---

## 13. Official Documentation References

- [`renderToPipeableStream`](https://react.dev/reference/react-dom/server/renderToPipeableStream) · [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Server Components](https://react.dev/reference/rsc/server-components) · [`'use client'`](https://react.dev/reference/rsc/use-client) · [`'use server'`](https://react.dev/reference/rsc/use-server)
- [`Suspense`](https://react.dev/reference/react/Suspense) · [`lazy`](https://react.dev/reference/react/lazy)
- patterns.dev: [CSR](https://www.patterns.dev/react/client-side-rendering/) · [SSR](https://www.patterns.dev/react/server-side-rendering/) · [Streaming SSR](https://www.patterns.dev/react/streaming-ssr/) · [Islands](https://www.patterns.dev/vanilla/islands-architecture/)

---

## 14. Revision Notes

1. Every pattern answers one question: **where and when is the HTML built** — build time, server, or browser.
2. **CSR**: empty shell, fast TTFB, slow FCP, bad SEO. Great for long-session apps.
3. **SSR**: real HTML, good SEO/first paint, slower TTFB, needs hydration.
4. **Hydration exists because HTML can't carry functions.** *(Verified: no `onClick` in the output.)*
5. **A mismatch makes React discard the server HTML** and re-render on the client. *(Verified.)*
6. **SSG** = build-time HTML, fastest, stale. **ISR** = SSG plus background regeneration.
7. **Streaming SSR** sends the shell first and streams Suspense boundaries as they resolve.
8. `onShellReady` for users, `onAllReady` for crawlers.
9. **Selective hydration** reprioritises to hydrate whatever the user just clicked — lanes applied to hydration.
10. **RSC ≠ SSR.** Server Components ship *no JS*, can't use state or effects, and never hydrate.
11. `'use server'` marks **Server Functions**, not Server Components.
12. **Islands** never build a unified tree — that's the difference from progressive hydration.
13. Split code at **routes** first; prefetch on hover.

**Soundbites**
- "Hydration exists because HTML can't carry a function."
- "SSR sends a photograph of a control panel; hydration wires up the buttons."
- "A hydration mismatch means you paid for SSR and got CSR."
- "SSR ships the component; RSC ships only its output."
- "Progressive hydration reorders one tree; Islands never build one."

---

## 15. Practice Exercises

**1 — See why hydration exists.** Run `renderToString` on a component with an `onClick`. Confirm the handler isn't in the HTML. Explain in one sentence what hydration does about it.

**2 — Cause a mismatch.** Render `{new Date().toISOString()}` in an SSR page and hydrate it. Read the warning, then fix it with the `useState(null)` + `useEffect` pattern.

**3 — Compare the waterfalls.** Build the same page as CSR and as SSR. In DevTools, compare when first paint happens and when the page first responds to a click.

**4 — Stream it.** Take a page with one slow component, wrap it in `<Suspense>`, and switch to `renderToPipeableStream`. Watch the shell arrive before the slow part.

**5 — Split a route.** Convert a route to `lazy()` + `<Suspense>`. Check the network tab for the new chunk, then add hover-prefetching and compare.

**6 — Pick patterns.** For each — a bank dashboard, a recipe blog, an e-commerce listing, a live sports scoreboard — choose a pattern and justify it in two sentences.

**7 — Interview rehearsal.** 2 minutes: *"Walk me through the rendering options and how you'd choose."* Cover CSR, SSR, SSG/ISR, streaming, and RSC, with one trade-off each.

---

**Next:** [Module 8 — State Management](./Module08-StateManagement.md) — state structure, lifting, context, reducers, external stores.
