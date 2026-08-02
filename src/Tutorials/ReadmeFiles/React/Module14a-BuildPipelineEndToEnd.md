# Module 14a — The Build, End to End

> Deep dive companion to [Module 14 — Build Tooling](./Module14-BuildTooling.md). Covers what actually happens when you run `npm run build`, including environment variables and secrets on large projects.

Module 14 gave the pipeline overview. This is the walkthrough: every stage, what it produces, and where env vars and vault secrets fit.

Everything below was produced by running real builds ([`envdemo/`](./verify/envdemo/) and [`chunks/`](./verify/chunks/)).

---

## The whole pipeline at a glance

```
npm run build
     │
 1.  READ CONFIG        vite.config.js / webpack.config.js, NODE_ENV=production
     ↓
 2.  LOAD ENV           .env files → process.env  (build machine only)
     ↓
 3.  ENTRY + RESOLVE    start at src/index.js, follow every import → module graph
     ↓
 4.  TRANSFORM          JSX → jsx() · TS → JS · syntax down-levelled
     ↓
 5.  REPLACE ENV        process.env.X  →  the literal string value
     ↓
 6.  TREE-SHAKE         drop exports nothing imports
     ↓
 7.  CHUNK              split the graph into files (entry / vendor / lazy / shared)
     ↓
 8.  MINIFY             rename, strip whitespace, remove dead branches
     ↓
 9.  HASH + EMIT        main-74AQNMGT.js, chunk-ES2H7ROY.js, .map files
     ↓
10.  INJECT HTML        <script src> tags with the hashed names
     ↓
     dist/  →  uploaded to CDN
```

Steps 2 and 5 are where the env/secrets story lives. Everything else is mechanical.

---

## 1. Read config, set NODE_ENV

`npm run build` runs whatever's in `package.json`:

```json
"scripts": { "build": "vite build" }
```

The tool sets `NODE_ENV=production` itself. That single variable decides which React build you get (dev with warnings, or production without) and whether minification runs.

---

## 2. Load environment variables

Here's the part that surprises people the most.

### `.env` files are read on the **build machine**, at **build time**

```
.env                  committed, safe defaults
.env.development      local dev
.env.production       production build
.env.local            gitignored, your machine only
```

They are **not** read by the browser. They're not read at runtime. They're read once, by the build process, on whatever machine runs it.

### The prefix rule

Only prefixed variables reach your code:

| Tool | Prefix |
|---|---|
| Vite | `VITE_` |
| CRA | `REACT_APP_` |
| Next.js (client) | `NEXT_PUBLIC_` |

```bash
VITE_API_URL=https://api.example.com    # ✅ reaches the browser
DATABASE_PASSWORD=hunter2               # ❌ ignored — no prefix
```

**That prefix is a safety fence, not a security feature.** It exists so you have to *opt in* to exposing something. It does not protect what you opt in to.

---

## 3–4. Entry, resolve, transform

The bundler starts at your entry file and follows every `import`, building a graph of every module your app touches.

Then each file is transformed: JSX becomes `jsx()` calls (Module 2 §3.2), TypeScript loses its types, modern syntax is down-levelled for your browser targets.

Transform is **per file**. Everything after this needs the whole graph.

---

## 5. Environment replacement — and why secrets leak

The bundler does a **find-and-replace** of `process.env.X` with a literal string. Not a lookup — a text substitution.

**Source:**

```js
const API = process.env.REACT_APP_API_URL;
const SECRET = process.env.REACT_APP_SECRET_KEY;
if (process.env.NODE_ENV !== 'production') {
  console.log('dev only warning');
}
console.log(API, SECRET);
```

**Built output — the entire file** ([`envdemo/`](./verify/envdemo/)):

```js
(()=>{var o="https://api.prod.com",n="sk_live_SUPERSECRET123";console.log(o,n);})();
```

Read that carefully. Three things happened:

1. **`process.env` is gone.** There's no `process` in a browser — it never existed at runtime.
2. **The secret is a plain string in the bundle.** Anyone can open DevTools and read it.
3. **The `NODE_ENV` branch vanished.** It became `if (false)`, and the minifier deleted it. This is how React ships dev warnings that cost nothing in production (Module 2 §4.2).

> ### 🔑 The rule that matters
>
> **Anything in a frontend bundle is public.** Not obscured — public. Minification is not encryption; `sk_live_SUPERSECRET123` is right there in the file your CDN serves to everyone.
>
> If a value must stay secret, it **cannot** be in the frontend build. It belongs on a server.

**Analogy:** env vars in a frontend build are like **writing on the outside of an envelope**. You can use a small font (minify), but you haven't hidden anything — you've just made it slightly harder to read. Secrets go *inside* the envelope, which means server-side.

### What's safe vs unsafe in a frontend bundle

| Safe | Never |
|---|---|
| API base URLs | Database credentials |
| Public keys (Stripe publishable, Firebase config) | Private/secret API keys |
| Feature flags | Signing secrets, JWT secrets |
| Analytics IDs | Anything with `SECRET`/`PRIVATE` in the name |
| Build version, environment name | Admin tokens |

Firebase config and Stripe *publishable* keys look alarming but are designed to be public — they're safe because the backend enforces the rules.

---

## 6. How vault secrets actually work on large projects

This is the question. The answer has two halves, because there are two kinds of secret.

### Half 1 — build-time config (goes into the bundle, must be public)

The vault injects values into the **CI environment**, and the build reads them like any other env var:

```yaml
# CI pipeline
- name: Fetch config from Vault
  run: |
    export VITE_API_URL=$(vault kv get -field=api_url secret/frontend/prod)
    export VITE_SENTRY_DSN=$(vault kv get -field=dsn secret/frontend/prod)

- name: Build
  run: npm run build      # ← bundler picks these up from process.env
```

```
  Vault  ──→  CI environment vars  ──→  bundler replaces  ──→  bundle
         (never on a developer's machine)      (now public)
```

**The vault's job here is controlling who can *see and change* the values, and keeping them out of git — not making them secret in the browser.** A URL baked into the bundle is public either way. The vault means a developer doesn't need production values on their laptop, and rotating a value doesn't require a commit.

### Half 2 — real secrets (never reach the bundle)

These stay on a server. The browser calls your backend; the backend uses the secret:

```
Browser  ──→  your API  ──→  reads secret from vault  ──→  third-party API
             (server)                                       (Stripe, etc.)
```

```js
// ❌ NEVER
const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);   // now public

// ✅ Browser calls your server; your server holds the key
await fetch('/api/create-payment', { method: 'POST', body });
```

### If config must change without a rebuild

Baking values into the bundle means a new build per environment. Two ways round it:

**Runtime config endpoint** — the app fetches config on boot:

```js
const config = await fetch('/api/config').then(r => r.json());
```

One artifact promotes across dev → staging → prod unchanged. Costs one request at startup.

**Server-injected globals** — the server writes config into the HTML it serves:

```html
<script>window.__CONFIG__ = { apiUrl: "https://api.prod.com" };</script>
```

Both are still public. They only remove the rebuild, not the exposure.

---

## 7. Tree-shaking

Covered in Module 14 §3 with measurements. Short version: exports nothing imports get dropped, and it only works with ES modules because `require()` is a runtime call that can take a variable.

---

## 8. Chunking — what a "chunk" actually is

**A chunk is one output file.** The bundler decides how to cut your module graph into files.

Four kinds:

| Chunk | What's in it | When it loads |
|---|---|---|
| **Entry** | Your app's starting point | Immediately |
| **Vendor** | `node_modules` dependencies | Immediately (usually) |
| **Async / lazy** | Everything behind `import()` | On demand |
| **Shared / common** | Code used by 2+ chunks | With whichever needs it |

### Watch it happen

Four source files — `main` imports `home`, both `home` and `dashboard` import `shared`, and `dashboard` is loaded dynamically:

```js
const { default: Dashboard } = await import('./dashboard.js');   // ← split point
```

**Emitted** ([`chunks/`](./verify/chunks/)):

```
  chunk-ES2H7ROY.js      51 bytes     ← shared.js (used by both)
  chunk-EVWUNHCL.js      99 bytes     ← dashboard.js (lazy)
  main-LGHX4FMV.js      207 bytes     ← entry
```

And the entry file shows exactly how they connect:

```js
import{a as t}from"./chunk-ES2H7ROY.js";      // shared — loaded up front
...
document.getElementById("go").onclick=async()=>{
  let{default:e}=await import("./chunk-EVWUNHCL.js");   // dashboard — on click
```

**Why `shared.js` became its own chunk:** two chunks need it. Inlining it into both would ship it twice. A separate file means it's downloaded once and cached.

**Analogy:** chunking is **packing for a trip**. Essentials go in the bag you carry on (entry + vendor). Things you might need go in checked luggage you can collect later (lazy chunks). Anything two people need goes in a shared bag rather than duplicated in both (shared chunks).

---

## 9. Minification

Making the file smaller without changing behaviour:

```js
// before
function calculateTotalPrice(itemPrice, taxRate) {
  const taxAmount = itemPrice * taxRate;
  return itemPrice + taxAmount;
}

// after
function c(t,a){return t+t*a}
```

What it does:

- **Rename** local variables to single letters (only safe locally — exports keep their names unless mangled deliberately).
- **Strip** whitespace, newlines, comments.
- **Remove dead code** — `if (false) {...}` from step 5, unreachable branches.
- **Inline and fold** — `2 * 60 * 60` becomes `7200`; single-use variables get inlined.
- **Shorten syntax** — `true` → `!0`, `if/else` → ternaries.

Then the server gzips or brotlis the result on top, typically another 70–80%.

> **Minification is not obfuscation and not security.** Anyone can run it through a formatter. Your logic and any baked-in strings are readable.

---

## 10. Content hashing — the caching payoff

Output filenames include a hash of the **content**:

```
main-74AQNMGT.js
chunk-ES2H7ROY.js
```

Change the file, the hash changes, the filename changes. That lets the CDN cache each file *forever* — a new build produces new names, so there's no stale-cache problem.

### Proven

Build twice, changing **only** `dashboard.js`:

```
BUILD 1                      BUILD 2
chunk-ES2H7ROY.js            chunk-ES2H7ROY.js    ← SAME (shared.js untouched)
chunk-EVWUNHCL.js            chunk-TUJD7DQS.js    ← new (dashboard changed)
main-LGHX4FMV.js             main-74AQNMGT.js     ← new (import path changed)
```

**The shared chunk kept its exact filename**, so returning users don't re-download it. Only what actually changed gets fetched again.

This is why you split vendor code out: React and your dependencies rarely change, so their chunk keeps its hash across dozens of deploys and stays cached.

> **Note `main` changed too** — its content includes the import path of the renamed chunk. This cascade is real; it's why some setups use a manifest so hash changes don't ripple upward.

---

## 11. Emit and HTML injection

Finally the bundler writes `dist/` and rewrites your HTML with the hashed names:

```html
<script type="module" src="/assets/main-74AQNMGT.js"></script>
<link rel="modulepreload" href="/assets/chunk-ES2H7ROY.js">
```

Typical output:

```
dist/
  index.html
  assets/
    main-74AQNMGT.js        entry
    vendor-K3J2H4KL.js      node_modules
    chunk-ES2H7ROY.js       shared
    chunk-TUJD7DQS.js       lazy route
    main-9F8D7S6A.css
    *.map                   source maps
```

**Deploy rule:** hashed assets get `Cache-Control: max-age=31536000, immutable`. `index.html` gets **no-cache** — it's the only file whose name never changes, so it must always be fetched to learn the new hashes.

---

## 12. Source maps in production

```
hidden-source-map    generate, don't link publicly, upload to Sentry   ← recommended
source-map           generate and link — anyone can read your source
false                no debugging
```

Upload maps to your error tracker in CI, then delete them before the public upload:

```yaml
- run: npm run build
- run: sentry-cli sourcemaps upload ./dist
- run: rm dist/assets/*.map        # ← don't ship them
```

---

## 13. A realistic CI build

```yaml
build:
  steps:
    - checkout
    - run: npm ci                              # exact lockfile versions

    - name: Fetch config from Vault            # ← step 2
      run: |
        export VITE_API_URL=$(vault kv get -field=api_url secret/frontend/prod)
        export VITE_SENTRY_DSN=$(vault kv get -field=dsn secret/frontend/prod)

    - run: npm run build                       # ← steps 3–11
      env:
        NODE_ENV: production

    - run: npx vite-bundle-visualizer          # size check
    - run: sentry-cli sourcemaps upload ./dist
    - run: rm dist/assets/*.map
    - run: aws s3 sync dist/ s3://bucket --cache-control "max-age=31536000,immutable" --exclude index.html
    - run: aws s3 cp dist/index.html s3://bucket --cache-control "no-cache"
```

Note the last two lines — **assets cached forever, `index.html` never cached.** Getting that backwards is the most common deploy bug: either users get stale code indefinitely, or you lose all caching benefit.

---

## Interview Questions

**Q: What happens when you run `npm run build`?**
Config and `NODE_ENV` are read, `.env` files load into `process.env`, the bundler walks the import graph from the entry, transforms each file (JSX/TS/syntax), replaces `process.env.X` with literal strings, tree-shakes, splits into chunks, minifies, adds content hashes, and emits `dist/` with rewritten HTML.

**Q: Are frontend env vars secure?**
No. They're find-and-replaced into the bundle as plain strings — verified: `sk_live_SUPERSECRET123` appears literally in the output. The `VITE_`/`REACT_APP_` prefix is an opt-in fence, not protection. Anything a browser can run, a user can read.

**Q: So how do vault secrets work on a big project?**
Two paths. Build-time *config* (API URLs, public keys) is injected into the CI environment from the vault and baked into the bundle — the vault controls access and rotation, not browser secrecy. **Real secrets never reach the build**; they stay server-side, and the browser calls your backend, which uses them.

**Q: What is a chunk?**
One output file. Bundlers emit an entry chunk, usually a vendor chunk, an async chunk per `import()`, and shared chunks for code used by two or more. Verified: a shared module used by two routes became its own 51-byte chunk instead of being duplicated.

**Q: Why content hashes in filenames?**
So assets can be cached forever. A changed file gets a new name, so there's no stale cache. Verified: changing only `dashboard.js` left the shared chunk's filename identical — returning users skip re-downloading it.

**Q: Why is `index.html` cached differently?**
It's the only file whose name never changes, so it must be re-fetched to discover the new hashed asset names. Assets get `immutable`; `index.html` gets `no-cache`.

**Q: How do you get config that changes without a rebuild?**
Fetch it at runtime from an endpoint, or have the server inject `window.__CONFIG__` into the HTML. One artifact then promotes across environments. Both are still public — you've removed the rebuild, not the exposure.

---

## Revision Notes

1. Pipeline: **config → env → resolve → transform → env replace → tree-shake → chunk → minify → hash → emit → HTML**.
2. `.env` is read **at build time on the build machine** — never by the browser.
3. Prefixes (`VITE_`, `REACT_APP_`, `NEXT_PUBLIC_`) are an **opt-in fence, not security**.
4. **`process.env.X` is find-and-replaced with a literal.** *(Verified: the secret sits in the output as plain text.)*
5. **Anything in the bundle is public.** Minification ≠ encryption.
6. **Vault → CI env → bundle** for public config; **real secrets stay server-side**, reached through your own API.
7. A **chunk is one output file**: entry, vendor, async, shared.
8. Shared code becomes its own chunk so it isn't duplicated. *(Verified.)*
9. **Content hashes** allow permanent caching; unchanged chunks keep their filenames. *(Verified.)*
10. `index.html` = **no-cache**; hashed assets = **immutable**.
11. `NODE_ENV` replacement is what deletes React's dev warnings.
12. Use `hidden-source-map` and delete `.map` files after uploading to your error tracker.

**Soundbites**
- "Frontend env vars are written on the outside of the envelope."
- "The vault controls who can change the value, not who can read it in the browser."
- "A chunk is just an output file."
- "Content hashes are why you can cache assets forever."
- "index.html is the only file that must never be cached."

---

## Practice Exercises

**1 — Find your own secrets.** Build your app, then `grep -r "sk_\|secret\|password" dist/`. Anything found is public.

**2 — Watch the replacement.** Add `console.log(process.env.VITE_SOMETHING)` and build. Find the literal in the output — confirm `process.env` isn't there.

**3 — Make a chunk appear.** Convert a route to `lazy()` and diff the `dist/` file list before and after.

**4 — Prove the caching.** Build, save the filenames, change one component, rebuild. Note which hashes survived and why.

**5 — Check your cache headers.** Look at your deploy config. Confirm assets are `immutable` and `index.html` is `no-cache`. If it's backwards, that's a real bug.

**6 — Move a secret.** Find a frontend call using a sensitive key and design the server proxy that would replace it.

---

**Back to:** [Module 14 — Build Tooling](./Module14-BuildTooling.md) · [Course index](./README.md)
