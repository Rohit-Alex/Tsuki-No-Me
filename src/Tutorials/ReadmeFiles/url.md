# URLs in JavaScript

## Anatomy of a URL

Suppose this is the URL:

```
https://www.example.com:8080/chalegi/date/pe?answer=nhi&answer2=nhiOYO#section
```

1. **Scheme:** `https:` (also `http:`, `ftp:`, `mailto:`, ...) — URL => `protocol`.
2. **Host:** `www.example.com`
   1. **Subdomain:** `www.`
   2. **Domain:** `example`
   3. **Top-Level Domain:** `.com`
3. **Port number:** `8080`  URL => `port`
4. **Path:** `/chalegi/date/pe` URL => `pathname`
5. **Query params/string:** `?answer=nhi&answer2=nhiOYO` — the `search` property gives it back as a raw string; `searchParams` gives an object with lookup methods (see below).
6. **Fragment:** `section` URL => `hash`

> Default ports are `80` (HTTP) and `443` (HTTPS). A default port is **not** shown when displaying the URL, even if you constructed it explicitly with one.

### Question 1

```javascript
const url = new URL("https://www.example.com:8080/chalegi/date/pe?answer=nhi&answer2=nhiOYO#section");

console.log(url.protocol);
console.log(url.host);
console.log(url.hostname)
console.log(url.origin)
console.log(url.pathname);
console.log(url.search);
console.log(url.hash);
```

<details>
<summary>Show Answer</summary>

```
https:
www.example.com:8080
www.example.com
https://www.example.com:8080
/chalegi/date/pe
?answer=nhi&answer2=nhiOYO
#section
```

</details>

## `new URL(url, baseURL)`

Creates and returns a `URL` object from an absolute URL string, or a relative URL string plus a base URL.

- `url` (1st parameter) — an absolute or relative URL string. If `url` is relative, `baseURL` is required and used to resolve it. If `url` is **absolute**, `baseURL` is ignored entirely.

### Question 2

```javascript
const baseUrl = "https://developer.mozilla.org";

console.log(new URL("/", baseUrl).href);
console.log(new URL(baseUrl).href);
```

<details>
<summary>Show Answer</summary>

```
https://developer.mozilla.org/
https://developer.mozilla.org/
```

**Explanation:** With no path segment given at all, or an explicit root path `/`, both resolve to the same thing — the domain root.

</details>

### Question 3

A leading `/` on the relative URL **replaces** the base's entire path, regardless of what that path was:

```javascript
console.log(new URL("en-US/docs", 'https://developer.mozilla.org/').href);
console.log(new URL("/en-US/docs", 'https://developer.mozilla.org/').href);
console.log(new URL("/en-US/docs", 'https://developer.mozilla.org/en-US/docs').href);
console.log(new URL("/en-US/docs", "https://developer.mozilla.org/fr-FR/toto").href);
```

<details>
<summary>Show Answer</summary>

```
https://developer.mozilla.org/en-US/docs
https://developer.mozilla.org/en-US/docs
https://developer.mozilla.org/en-US/docs
https://developer.mozilla.org/en-US/docs
```

**Explanation:** All four resolve to the exact same URL. The first has no leading slash and the base ends in `/`, so it appends normally. The other three all use `/en-US/docs` — note the **base's own path is completely discarded** each time (`/en-US/docs`, then `/fr-FR/toto`) — a leading `/` always resolves relative to the domain root, not relative to wherever the base's path happened to point.

</details>

### Question 4

An **absolute** `url` argument makes `baseURL` irrelevant, even if one is provided:

```javascript
console.log(new URL("http://www.example.com").href);
console.log(new URL("http://www.example.com", 'https://developer.mozilla.org/').href);
```

<details>
<summary>Show Answer</summary>

```
http://www.example.com/
http://www.example.com/
```

**Explanation:** Both produce the identical result — `baseURL` is silently ignored the moment `url` is already a complete, absolute URL.

</details>

## `URLSearchParams`

Represents (and lets you build/manipulate) a query string.

| Method | Description |
|---|---|
| `.has(key)` | Does the key exist? |
| `.has(key, value)` | Does the key exist *with this specific value*? |
| `.get(key)` | The value for the key, or `null` if missing. |
| `.getAll(key)` | All values for the key, as an array (a key can appear more than once). |
| `.append(key, value)` | Adds a new `key=value` pair — doesn't overwrite existing ones with the same key. |
| `.set(key, value)` | Sets the key to this value, overwriting any existing value(s) for that key; adds it if missing. |
| `.delete(key)` | Removes the key entirely. |

### Question 5

```javascript
const searchParams = new URLSearchParams("one=1&two=2");

console.log(searchParams.has("one"));
console.log(searchParams.has("one", "2"));
console.log(searchParams.get("one") === "1");
console.log(searchParams.get("foo"));
console.log(searchParams.getAll("one"));
```

<details>
<summary>Show Answer</summary>

```
true
false
true
null
[ '1' ]
```

**Explanation:** `has("one", "2")` is `false` because the *value* check fails — `"one"` exists, but its value is `"1"`, not `"2"`. `get("foo")` returns `null` since that key was never set — not `undefined`.

</details>

### Question 6

```javascript
const searchParams = new URLSearchParams("one=1&two=2");

searchParams.append("four", "4");
console.log(searchParams.toString());

searchParams.set("three", 3);
searchParams.set("seven", 7);
console.log(searchParams.toString());

searchParams.delete("three");
console.log(searchParams.toString());
```

<details>
<summary>Show Answer</summary>

```
one=1&two=2&four=4
one=1&two=2&four=4&three=3&seven=7
one=1&two=2&four=4&seven=7
```

**Explanation:** `.append()`/`.set()` on a brand-new key both add it at the **end**, in call order — that's why `four` appears before `three` and `seven`: `four` was appended first. `.delete("three")` removes that key/value pair cleanly, with no leftover stray `&`.

</details>

### Question 7

What happens if you construct `URLSearchParams` directly from an **object** that has an `undefined` value?

```javascript
const paramsObject = {
    one: "1",
    two: "2",
    three: undefined
};

const searchParams = new URLSearchParams(paramsObject);
console.log(searchParams.toString());
```

<details>
<summary>Show Answer</summary>

```
one=1&two=2&three=undefined
```

**Explanation:** ⚠️ Unlike `JSON.stringify` (which drops keys with `undefined` values), the `URLSearchParams` object constructor **coerces every value to a string** — `undefined` becomes the literal 4-character string `"undefined"`, not an omitted key. If you want to drop empty/nullish query params before building the URL, you need to filter them out yourself first (see the practical example at the end of this file).

</details>

### Question 8

`URLSearchParams` automatically percent-encodes values for you — but not quite the same way `encodeURIComponent` does:

```javascript
const sp = new URLSearchParams();
sp.set('q', 'node & npm/react');
console.log(sp.toString());
```

<details>
<summary>Show Answer</summary>

```
q=node+%26+npm%2Freact
```

**Explanation:** `&` and `/` get percent-encoded (`%26`, `%2F`) as expected, but the **space becomes `+`**, not `%20`. This is the older `application/x-www-form-urlencoded` convention that `URLSearchParams` follows, which differs from `encodeURIComponent`'s output (which always uses `%20` for spaces — see the Encoding section below). Mixing the two conventions by hand-encoding with `encodeURIComponent` and then also using `URLSearchParams` can cause subtle double-encoding bugs — pick one and stick with it.

</details>

### Question 9 — Iterating `URLSearchParams`

```javascript
const sp = new URLSearchParams('a=1&b=2');

console.log([...sp.entries()]);
console.log([...sp.keys()]);
console.log([...sp.values()]);

for (const [key, value] of sp) {
  console.log(key, value);
}
```

<details>
<summary>Show Answer</summary>

```
[ [ 'a', '1' ], [ 'b', '2' ] ]
[ 'a', 'b' ]
[ '1', '2' ]
a 1
b 2
```

**Explanation:** `URLSearchParams` implements the iterator protocol directly (see [Iterators.md](Iterators.md)) — `for...of` destructures each entry as `[key, value]` without needing `.entries()` explicitly, same as `Map`.

</details>

## `URL` Object Properties

**Setup used by the questions below:**

```javascript
const url = new URL("https://xxYYzz.com:3001/seller/details?category=someValue&quality=720");
```

### Question 10

```javascript
console.log(url.protocol);
console.log(url.pathname);
console.log(url.port);
console.log(url.href);
```

<details>
<summary>Show Answer</summary>

```
https:
/seller/details
3001
https://xxyyzz.com:3001/seller/details?category=someValue&quality=720
```

**Explanation:** `.protocol` includes the trailing `:`. `.port` is a string, not a number. `.href` reconstructs the entire URL as a string — equivalent to `url.toString()`.

</details>

### Question 11 — `host` vs. `hostname`

```javascript
console.log(url.host);
console.log(url.hostname);
```

<details>
<summary>Show Answer</summary>

```
xxyyzz.com:3001
xxyyzz.com
```

**Explanation:** `.host` includes the port (if non-default); `.hostname` never does. ⚠️ **Also notice: the original `xxYYzz.com` got lowercased to `xxyyzz.com`.** Hostnames are case-insensitive per the DNS spec, so the `URL` parser normalizes them to lowercase automatically — this happens regardless of what casing you typed in.

</details>

### Question 12 — `origin`

```javascript
console.log(url.origin);
```

<details>
<summary>Show Answer</summary>

```
https://xxyyzz.com:3001
```

**Explanation:** `origin` is scheme + host (+ port, if non-default) — no path, no query, no fragment. If the URL used a default port instead (`https://example.com/path`), `.port` would be `""` (empty string) and `.origin` would omit the port entirely: `https://example.com`.

</details>

### Question 13 — `search` vs. `searchParams`

```javascript
console.log(url.search);
console.log(url.searchParams.get("category"));
console.log(url.searchParams.get("quality"), typeof url.searchParams.get("quality"));
```

<details>
<summary>Show Answer</summary>

```
?category=someValue&quality=720
someValue
720 string
```

**Explanation:** `.search` is the raw query string (including the leading `?`); `.searchParams` is a live `URLSearchParams` instance for structured access. Every value read back through `.get()` is a **string** — even `"720"`, which looks numeric — so you'll typically need `Number(...)`/`parseInt(...)`/`JSON.parse(...)` on the result if you need it as something other than a string.

</details>

## Encoding: `encodeURIComponent` vs. `encodeURI`

### Question 14

```javascript
const value = "a/b c&d=e";

console.log(encodeURIComponent(value));
console.log(encodeURI(value));
```

<details>
<summary>Show Answer</summary>

```
a%2Fb%20c%26d%3De
a/b%20c&d=e
```

**Explanation:** `encodeURIComponent` escapes **everything** that isn't a safe literal character — including `/`, `&`, and `=` — because it assumes you're encoding a single *piece* (like one query param's value) that might legitimately contain those characters as data. `encodeURI` assumes you're encoding an **entire URL** that's already structurally valid, so it deliberately leaves characters like `/`, `&`, `=`, `?`, `:` untouched (they're meaningful URL syntax), and only escapes things like spaces and non-ASCII characters.

> **Rule of thumb:** use `encodeURIComponent` on individual values you're inserting *into* a URL (query param values, path segments); use `encodeURI` only on a complete URL string you're encoding as a whole. Using `encodeURI` on a single query value (or skipping encoding altogether) is a common source of broken URLs when a value happens to contain `&` or `=`.

</details>

### Question 15

Building a query string safely by hand vs. letting `URLSearchParams` do it:

```javascript
const params = { search: "node & npm", tag: "a/b" };

const manual = Object.entries(params)
  .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
  .join('&');

console.log(manual);
```

<details>
<summary>Show Answer</summary>

```
search=node%20%26%20npm&tag=a%2Fb
```

**Explanation:** Manually encoding with `encodeURIComponent` uses `%20` for spaces (contrast with `URLSearchParams`'s `+`, from Question 8) — this is why mixing the two approaches for the same query string can produce inconsistent encoding. Prefer just using `new URLSearchParams(params).toString()` directly rather than hand-rolling this — it's shorter and avoids exactly this kind of inconsistency.

</details>

## `URL.canParse()`

A newer, convenient way to check whether a string is a valid URL **without** wrapping `new URL(...)` in a `try`/`catch`.

```javascript
console.log(URL.canParse('https://example.com')); // true
console.log(URL.canParse('not a url'));            // false
```

> **Compatibility note:** this is a relatively recent addition (Baseline across major browsers/Node from 2023–2024) — verify support in your target runtime before relying on it; older environments will need the `try { new URL(x); return true } catch { return false }` pattern instead.

## Practical: Building a URL, Stripping Falsy Query Params

A function to form a URL from a base, a relative path, and a params object — automatically dropping any key whose value is `undefined`, `null`, or an empty string (recursing into nested objects too):

```javascript
const getUrl = (url, baseurl, paramsObj) => {
    const urlFormed = new URL(url, baseurl);
    const queryParams = new URLSearchParams(paramsObj);
    urlFormed.search = queryParams;
    return urlFormed;
};

const removeFalsyValuesInObj = (obj) => {
    const newObj = {}
    for (const key in obj) {
        const val = obj[key];
        if (typeof val === "object" && val.constructor === Object && val !== null) {
            const updatedObj = removeFalsyValuesInObj(val);
            newObj[key] = updatedObj
        } else {
            if (![null, undefined, ''].includes(val)) newObj[key] = val
        }
    }
    return newObj;
}
```

### Question 16

```javascript
const queryParamsObj = {
    one: "1",
    two: "2",
    three: undefined
};

console.log(getUrl("/youtube", "https://www.google.com", removeFalsyValuesInObj(queryParamsObj)).href);
```

<details>
<summary>Show Answer</summary>

```
https://www.google.com/youtube?one=1&two=2
```

**Explanation:** `removeFalsyValuesInObj` strips `three` (its value is `undefined`) before the object ever reaches `URLSearchParams` — this is exactly the manual filtering step that Question 7 showed you'd need, since `URLSearchParams` itself would otherwise happily stringify `undefined` into the query string as the literal text `"undefined"`.

</details>
