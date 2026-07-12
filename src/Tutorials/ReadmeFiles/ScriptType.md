# The `type` Attribute on `<script>` Tags

## Why was `type` introduced?

An HTML document can contain different kinds of embedded content. The browser needs to know whether the content inside a `<script>` tag is:

- JavaScript
- An import map
- JSON data
- ES Module

The `type` attribute tells the browser which of these it's looking at, and therefore whether (and how) to execute it.

## Default value

If `type` is omitted entirely, the browser defaults to treating the script as a **classic JavaScript script** (`text/javascript`). Since HTML5, JavaScript is the default scripting language, so these are equivalent:

```html
<script src="app.js"></script>
<script type="text/javascript" src="app.js"></script>
```

Nowadays we almost always omit `type="text/javascript"` — it's redundant.

## Common values of `type`

### 1. `text/javascript` (classic script) — the default

```html
<script src="app.js"></script>
```

- Runs in the **global scope** — top-level `var`/function declarations become properties of `window`.
- Not automatically deferred — a plain `<script src="...">` blocks HTML parsing until it downloads and executes (see [async/defer](../../../README.md#7-explain-async-and-defer-in-js), Q7 in the main README).
- Cannot use `import`/`export`.
- Not strict mode by default (unless you opt in with `"use strict"`).

### 2. `type="module"` (ES Modules)

```html
<script type="module" src="app.js"></script>
```

This tells the browser to:

- Treat the file as an **ES Module**.
- Allow `import` and `export`.
- Use **module scope** — top-level variables don't become globals.
- Automatically fetch and resolve imported modules.
- Defer execution until the HTML is parsed (behaves like `defer` by default).
- Run in **strict mode** automatically — no opt-in needed.
- Execute with top-level `this` as `undefined`, not `window`.

**Limitations / things that trip people up:**

- A module is fetched with **CORS** — cross-origin module scripts must be served with the right `Access-Control-Allow-Origin` headers, or the browser refuses to run them.
- A module is only ever **evaluated once**, no matter how many other modules import it — subsequent imports reuse the cached module record (identified by its resolved URL).
- Top-level `await` is only valid inside a module — not in a classic script.
- For browsers that don't support `type="module"` at all, pair it with a `<script nomodule src="fallback.js"></script>` — modern browsers ignore `nomodule` scripts, legacy browsers ignore `module` scripts, so each browser runs exactly one of the two.

### 3. `type="importmap"`

```html
<script type="importmap">
{
  "imports": {
    "lodash": "/node_modules/lodash/lodash.js"
  }
}
</script>
```

This defines an **import map**, letting you use bare module specifiers:

```javascript
import _ from "lodash";
```

instead of writing out the full path every time:

```javascript
import _ from "/node_modules/lodash/lodash.js";
```

**Limitations:**
- Must appear **before** any `<script type="module">` that relies on it — the browser needs to know the mapping before it starts resolving module specifiers.
- A document can only have **one active import map**; adding a second one throws.
- Not supported in older browsers (Safari added support later than Chrome/Firefox) — check compatibility before relying on it in production.

### 4. `type="application/json"`

Sometimes a `<script>` tag is used to store JSON data rather than executable code:

```html
<script type="application/json" id="config">
{
  "theme": "dark",
  "api": "/users"
}
</script>
```

The browser does **not** execute this content, because `application/json` isn't a recognized JavaScript MIME type — it just leaves the tag inert.

You can later read it out with:

```javascript
const config = JSON.parse(
  document.getElementById("config").textContent
);
```

> **General rule:** any `type` value the browser doesn't recognize as JavaScript (and isn't `module`/`importmap`) causes it to treat the `<script>` as a **data block** — it's parsed as part of the DOM but never executed. This is also how template libraries historically embedded raw templates, e.g. `<script type="text/x-handlebars-template">...</script>`.

## `text/javascript` vs `module` — comparison table

| Feature | `text/javascript` | `module` |
|---|:---:|:---:|
| Default if `type` is omitted | ✅ Yes | ❌ No |
| Supports `import`/`export` | ❌ No | ✅ Yes |
| Has its own module scope | ❌ No | ✅ Yes |
| Top-level `var` becomes a `window` property | ✅ Yes | ❌ No |
| Automatically deferred | ❌ No | ✅ Yes |
| Runs in strict mode automatically | ❌ No | ✅ Yes |
| Can use top-level `await` | ❌ No | ✅ Yes |
| Fetched with CORS | ❌ No | ✅ Yes |
| Evaluated only once per URL, even if "included" multiple times | ❌ No (re-executes every `<script>` tag) | ✅ Yes (cached by module record) |

## Deep dive: behavioral differences

### 1. Support for `import` / `export`

**❌ `text/javascript`:**

```html
<script src="app.js"></script>
```

```javascript
// app.js
import { add } from "./math.js";
```

```
Uncaught SyntaxError: Cannot use import statement outside a module
```

The browser treats `app.js` as a classic script, so `import`/`export` are invalid syntax there.

**✅ `type="module"`:**

```html
<script type="module" src="app.js"></script>
```

```javascript
// math.js
export function add(a, b) {
    return a + b;
}
```

```javascript
// app.js
import { add } from "./math.js";

console.log(add(2, 3));
```

```
5
```

Since the browser knows this is a module, `import`/`export` work correctly.

### 2. Module scope

A module has its own scope. Top-level variables are **not** attached to the global object (`window`).

**❌ `text/javascript`:**

```html
<script>
var name = "Rohit";
console.log(window.name);
</script>
```

```
Rohit
```

Top-level `var` declarations in a classic script become properties of `window`.

**✅ `type="module"`:**

```html
<script type="module">
var name = "Rohit";
console.log(window.name);
console.log(name);
</script>
```

```
""      // window.name is the browser's own built-in property
Rohit
```

`name` is accessible inside the module itself, but it's never attached to `window` — the variable stays private to that module.

### 3. Whether variables leak across files

**Classic scripts (`text/javascript`):**

```html
<!-- index.html -->
<script src="a.js"></script>
<script src="b.js"></script>
```

```javascript
// a.js
var user = "Rohit";
```

```javascript
// b.js
console.log(user);
```

```
Rohit
```

`user` became a global variable (`window.user`), so every subsequently loaded script can see it.

**ES Modules:**

```html
<!-- index.html -->
<script type="module" src="a.js"></script>
<script type="module" src="b.js"></script>
```

```javascript
// a.js
var user = "Rohit";
```

```javascript
// b.js
console.log(user);
```

```
ReferenceError: user is not defined
```

Each module has its own scope — variables aren't shared automatically. To share them, you must explicitly `export` and `import`:

```javascript
// a.js
export const user = "Rohit";
```

```javascript
// b.js
import { user } from "./a.js";
console.log(user);
```

```
Rohit
```

## Interview summary

| Feature | `text/javascript` | `type="module"` |
|---|---|---|
| `import`/`export` | ❌ Not supported | ✅ Supported |
| Top-level scope | Global script scope | Module scope |
| Top-level `var` becomes a `window` property | ✅ Yes | ❌ No |
| Variables shared across files | ✅ Automatically, via globals | ❌ Only through explicit `export`/`import` |

**One-line way to remember:** classic scripts share one global scope, so variables can easily leak into other scripts. Modules have their own private scope, so nothing is shared unless you explicitly `export` it and `import` it elsewhere.
