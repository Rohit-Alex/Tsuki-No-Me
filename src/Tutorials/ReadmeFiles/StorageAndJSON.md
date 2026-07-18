# Storage APIs and JSON

## Session Storage vs. Local Storage

Both store data in the browser as key-value pairs (strings only — see the Notes below).

**Session Storage:**
- The value is stored for that tab only, mapped to the URL's origin.
- Reloading/hard-reloading the same tab keeps the data.
- Opening the same page in a new tab or window, or closing and reopening the tab, loses the data.
- Duplicating a tab copies the original tab's `sessionStorage` into the new tab.
- A page session lasts as long as the tab or browser is open, and survives page reloads/restores.
- Opening multiple tabs/windows with the same URL creates a **separate** `sessionStorage` per tab/window — they don't share data.
- Closing a tab/window ends its session and clears its `sessionStorage`.

**Local Storage:**
- Once set, data is mapped to the URL's origin and persists across a full browser restart, regardless of tab or window. No expiry time.
- Reload/hard reload doesn't affect it.
- Opening the page in a new tab or window (same browser), or closing and reopening it, doesn't affect it either — it's shared across all of them.

> If you open the page in a private/incognito window, or a different browser entirely, the data won't be there — storage is scoped per browser profile.

**Methods (shared by both):**

| Method | Description |
|---|---|
| `setItem(key, value)` | Sets a key/value pair. |
| `getItem(key)` | Gets the value stored for that key. |
| `removeItem(key)` | Removes a particular key. |
| `clear()` | Deletes everything. |

**Notes:**
1. Both key and value **must be strings**. Any other type (number, object, array) gets automatically coerced to a string.
2. If a key isn't found, `getItem()` returns `null`.
3. Since non-string values get converted to strings automatically, storing an array/object/boolean requires `JSON.stringify()` on the way in and `JSON.parse()` on the way out — see the [Using JSON with Web Storage](#using-json-with-web-storage) section below. Don't parse a value that was stored as a plain string — that will throw.
4. **Simple rule to avoid the confusion:** always `JSON.stringify()` while storing, always `JSON.parse()` while accessing — regardless of the value's type:
   ```javascript
   sessionStorage.setItem('key', JSON.stringify(valueOfAnyDatatype))
   JSON.parse(sessionStorage.getItem('key'))
   ```

## Local Storage vs. Cookies

| | Local Storage | Cookies |
|---|---|---|
| **Data capacity** | ~5–10MB | ~4KB |
| **Expiration** | None — persists until manually cleared | Can be set to expire after a specific time |
| **Accessibility** | Only the domain that stored it | Both the storing domain *and* other domains the user visits (e.g. via an `<iframe>`) |
| **Sent to server automatically?** | No | Yes — attached to every matching HTTP request |

## Cookies — Quick Reference

Cookies are read and written through `document.cookie` — a single string property with unusual semantics: reading it returns *all* cookies as one `"key1=value1; key2=value2"` string, but writing to it only ever adds/updates **one** cookie at a time (whatever `key=value` you assign), leaving the others untouched.

```javascript
document.cookie = "theme=dark; max-age=3600; path=/";
document.cookie = "lang=en; path=/";

console.log(document.cookie); // "theme=dark; lang=en"
```

**Common attributes:**

| Attribute | Purpose |
|---|---|
| `max-age=<seconds>` / `expires=<date>` | When the cookie should be deleted. Omitted = deleted when the browser session ends. |
| `path=/` | Which URL paths the cookie is sent for. |
| `secure` | Only sent over HTTPS. |
| `httpOnly` | Not accessible via `document.cookie` at all — **can only be set by the server**, specifically to prevent JS (and XSS attacks) from reading it. |
| `samesite=Strict/Lax/None` | Controls whether the cookie is sent on cross-site requests — a key CSRF mitigation. |

> Because cookies are sent with **every** matching HTTP request automatically, they're the right tool for anything the server needs on every request (auth tokens, session IDs) — but that's also why they're capped so small (~4KB), unlike Local/Session Storage, which never leave the browser on their own.

## Cross-Tab Communication: the `storage` Event

A commonly asked follow-up: *"how would two open tabs on the same site talk to each other?"* — one answer is the `storage` event.

```javascript
window.addEventListener('storage', (event) => {
  console.log(event.key, event.oldValue, event.newValue, event.url);
});

localStorage.setItem('theme', 'dark');
```

- Fires on **other** tabs/windows of the same origin when `localStorage` changes — **not** on the tab that made the change itself.
- Gives you the key, old value, new value, and the URL of the document that made the change.
- Does **not** fire for `sessionStorage` changes across tabs (since `sessionStorage` isn't shared across tabs to begin with).

## JSON (`JSON.stringify()` & `JSON.parse()`)

### What is JSON?

**JSON (JavaScript Object Notation)** is a lightweight data-interchange format.

- Used to exchange data between client and server.
- Used for storing structured data (e.g., in Local Storage / Session Storage, as seen above).
- JSON is **text (a string)**, not a JavaScript object.
- JSON keys and string values **must** be enclosed in double quotes (`"`).

```json
{
  "name": "John",
  "age": 25,
  "isAdmin": false
}
```

## `JSON.stringify()`

Converts a JavaScript value into a JSON string.

```javascript
JSON.stringify(value, replacer, space)
```

| Parameter | Required | Description |
|---|:---:|---|
| `value` | ✅ | The JavaScript value to convert into JSON. |
| `replacer` | ❌ | An array of keys to keep (or a function to transform/filter each value) in the output. |
| `space` | ❌ | Adds indentation for pretty-printing. |

### Question 1

```javascript
console.log(JSON.stringify(2));
console.log(JSON.stringify(true));
console.log(JSON.stringify(null));
console.log(JSON.stringify(["paisa", "paisa", "paisa"]));
```

<details>
<summary>Show Answer</summary>

```
"2"
"true"
"null"
["paisa","paisa","paisa"]
```

**Explanation:** `JSON.stringify()` can convert numbers, booleans, `null`, strings, arrays, and objects. Note the output is itself a **string** — the quotes shown around `"2"`, `"true"`, `"null"` are part of that string's `console.log` representation, since `JSON.stringify(2)` literally returns the 3-character string `"2"` (the digit `2` inside quote characters).

</details>

### Question 2

```javascript
const obj = {
  goal: "Get rich",
  interest: ["Get", "rich"],
  plan: {
    planA: "Get rich",
    planB: "Marry a rich person"
  },
  carPrice: 6 * 1e7
};

console.log(JSON.stringify(obj));
```

<details>
<summary>Show Answer</summary>

```
{"goal":"Get rich","interest":["Get","rich"],"plan":{"planA":"Get rich","planB":"Marry a rich person"},"carPrice":60000000}
```

**Explanation:** Nested objects and arrays serialize recursively — `plan` (an object) and `interest` (an array) are both fully expanded inline.

</details>

### `undefined`

### Question 3

```javascript
console.log(JSON.stringify(undefined));
console.log(typeof JSON.stringify(undefined));
```

<details>
<summary>Show Answer</summary>

```
undefined
undefined
```

**Explanation:** Unlike other primitives, `undefined` isn't valid JSON — `JSON.stringify(undefined)` returns the **actual** `undefined` value (not the string `"undefined"`), which is why `typeof` reports `undefined` too.

</details>

### Functions & `undefined` Properties

### Question 4

```javascript
console.log(JSON.stringify({
  a: undefined,
  b: () => {}
}));
```

<details>
<summary>Show Answer</summary>

```
{}
```

**Explanation:** Object properties whose values are `undefined`, functions, or symbols are silently **omitted** entirely (rather than causing an error, or including them as `null`) — different from `undefined` at the top level (Question 3), which returns `undefined` itself instead of omitting anything.

</details>

### `NaN` and `Infinity`

### Question 5

```javascript
console.log(JSON.stringify({ a: NaN, b: Infinity, c: -Infinity }));
```

<details>
<summary>Show Answer</summary>

```
{"a":null,"b":null,"c":null}
```

**Explanation:** JSON has no representation for `NaN` or `Infinity` (JSON numbers must be finite), so `JSON.stringify()` silently converts all three to `null` rather than throwing. This is an easy-to-miss data-loss bug if your data legitimately might contain one of these — `JSON.parse` has no way to know the original `null` used to be `NaN` or `Infinity`.

</details>

### Circular References

### Question 6

```javascript
const obj = {};
obj.self = obj;

console.log(JSON.stringify(obj));
```

<details>
<summary>Show Answer</summary>

```
TypeError: Converting circular structure to JSON
```

**Explanation:** `JSON.stringify()` walks the object graph recursively with no cycle detection built in for handling them gracefully — if it encounters an object it's already in the middle of serializing (via `obj.self` pointing back to `obj`), it throws rather than looping forever. `structuredClone()` (see [shallow&DeepCopy.md](shallow&DeepCopy.md)), by contrast, *can* handle circular references correctly.

</details>

### Custom Serialization with `toJSON()`

If an object has a `.toJSON()` method, `JSON.stringify()` calls it and serializes **its return value** instead of the object itself.

### Question 7

```javascript
class Money {
  constructor(amount) {
    this.amount = amount;
  }
  toJSON() {
    return `₹${this.amount}`;
  }
}

console.log(JSON.stringify({ price: new Money(500) }));
```

<details>
<summary>Show Answer</summary>

```
{"price":"₹500"}
```

**Explanation:** Instead of serializing `Money`'s internal shape (`{"amount":500}`), `JSON.stringify` calls `.toJSON()` first and uses its return value. This is exactly how `Date` objects behave too — see Question 8.

</details>

### `Date` Objects

### Question 8

```javascript
const createdAt = new Date('2024-01-15T10:00:00.000Z');
const serialized = JSON.stringify({ createdAt });

console.log(serialized);

const parsed = JSON.parse(serialized);
console.log(typeof parsed.createdAt, parsed.createdAt instanceof Date);
```

<details>
<summary>Show Answer</summary>

```
{"createdAt":"2024-01-15T10:00:00.000Z"}
string false
```

**Explanation:** `Date` has a built-in `.toJSON()` (Question 7's mechanism) that converts it to an ISO string during `stringify`. But `JSON.parse()` doesn't have the reverse knowledge — it has no way to know that string *used to be* a `Date`, so it comes back as a **plain string**, not a `Date` instance. If you need it back as a real `Date`, you need a reviver function — see Question 10.

</details>

### Using `replacer` and `space`

### Question 9

```javascript
const room = {
  number: 23
};

const meetup = {
  title: "Conference",
  participants: [
    { name: "John" },
    { name: "Alice" }
  ],
  place: room
};

console.log(
  JSON.stringify(
    meetup,
    ["title", "participants", "place", "name", "number"],
    2
  )
);
```

<details>
<summary>Show Answer</summary>

```json
{
  "title": "Conference",
  "participants": [
    {
      "name": "John"
    },
    {
      "name": "Alice"
    }
  ],
  "place": {
    "number": 23
  }
}
```

**Explanation:** Passing an **array** as `replacer` acts as an allow-list — only those key names appear anywhere in the output, at any nesting level (`name` and `number` apply inside the nested objects too, not just at the top level). The `2` for `space` adds 2-space indentation for readability. `replacer` can also be a **function** `(key, value) => transformedValue` for more complex filtering/transformation than a simple allow-list can express.

</details>

## `JSON.parse()`

Converts a JSON string back into its original JavaScript value.

```javascript
JSON.parse(jsonString, reviver)
```

### Question 10

```javascript
console.log(JSON.parse("null"));
console.log(JSON.parse("true"));
console.log(JSON.parse("false"));
console.log(JSON.parse("[24, 1, \"DOB\"]"));
console.log(JSON.parse('{"name":"Amane","age":25}'));
```

<details>
<summary>Show Answer</summary>

```
null
true
false
[ 24, 1, 'DOB' ]
{ name: 'Amane', age: 25 }
```

</details>

### Invalid JSON

### Question 11

```javascript
console.log(JSON.parse(undefined));
```

<details>
<summary>Show Answer</summary>

```
SyntaxError: "undefined" is not valid JSON
```

**Explanation:** `JSON.parse()` expects a string. Since `undefined` isn't one, it's first coerced via `String(undefined)` → `"undefined"` — and the 9-character text `undefined` isn't valid JSON syntax (it would need to be the unquoted literal `null`, `true`, or `false`, or a quoted string), so it throws.

</details>

### Question 12

```javascript
console.log(JSON.parse("Eren"));
```

<details>
<summary>Show Answer</summary>

```
SyntaxError: Unexpected token 'E', "Eren" is not valid JSON
```

**Explanation:** Strings inside JSON must be wrapped in double quotes. `Eren` on its own looks like an unquoted identifier, which isn't valid JSON — it needs to be `'"Eren"'` (a JSON string literal) to parse successfully:

```javascript
console.log(JSON.parse('"Eren"')); // "Eren"
```

</details>

### The `reviver` Function

Just like `stringify`'s `replacer`, `parse` accepts an optional second argument — a function that gets called for every key/value pair as the JSON is parsed, letting you transform values on the way in. This is exactly what's needed to reverse the `Date` problem from Question 8.

### Question 13

```javascript
const createdAt = new Date('2024-01-15T10:00:00.000Z');
const serialized = JSON.stringify({ createdAt });

const revived = JSON.parse(serialized, (key, value) => {
  if (key === 'createdAt') return new Date(value);
  return value;
});

console.log(revived.createdAt instanceof Date);
console.log(revived.createdAt.getFullYear());
```

<details>
<summary>Show Answer</summary>

```
true
2024
```

**Explanation:** The reviver runs once per key, bottom-up (deepest properties first). Here, whenever the key is `createdAt`, its (still-a-string) value gets wrapped back into a real `Date`. For every other key, the reviver just returns `value` unchanged, passing it through as-is.

</details>

## Using JSON with Web Storage

Since Local Storage and Session Storage store only strings, objects and arrays must be converted with `JSON.stringify()` before storing, and `JSON.parse()` after retrieving.

### Question 14

```javascript
sessionStorage.setItem("numberKey", JSON.stringify(24));
sessionStorage.setItem("stringKey", JSON.stringify("Amane"));
sessionStorage.setItem("booleanKey", JSON.stringify(false));
sessionStorage.setItem("arrayKey", JSON.stringify(["no", 9, "know"]));
sessionStorage.setItem("objectKey", JSON.stringify({ key: "some value" }));

console.log(JSON.parse(sessionStorage.getItem("numberKey")));
console.log(JSON.parse(sessionStorage.getItem("stringKey")));
console.log(JSON.parse(sessionStorage.getItem("booleanKey")));
console.log(JSON.parse(sessionStorage.getItem("arrayKey")));
console.log(JSON.parse(sessionStorage.getItem("objectKey")));
```

<details>
<summary>Show Answer</summary>

```
24
Amane
false
[ 'no', 9, 'know' ]
{ key: 'some value' }
```

**Explanation:** Every value round-trips back to its original type and shape — the number stays a number, the boolean stays a boolean, and so on — because `JSON.stringify()` was used consistently on the way in and `JSON.parse()` on the way out, exactly per the "always stringify while storing, always parse while accessing" rule from earlier.

</details>

## Interview Notes

- JSON is a **string representation** of data — not a JavaScript object itself.
- JSON keys and string values must use **double quotes**.
- `JSON.stringify()` converts JavaScript values → JSON strings; `JSON.parse()` converts them back.
- `undefined`, functions, and symbols are omitted when they're object *properties* — but `JSON.stringify(undefined)` at the top level returns `undefined` itself, not a string.
- `NaN` and `Infinity` both silently become `null` — a common source of quiet data loss.
- Circular references throw a `TypeError`; `structuredClone()` can handle them where `JSON.stringify()` can't.
- An object with a `.toJSON()` method (like `Date`) gets that method's return value serialized instead of its own shape — but `JSON.parse()` has no automatic reverse mapping, so reviving a `Date` (or any custom type) back from JSON requires a `reviver` function.
- Local Storage and Session Storage store only strings — always `JSON.stringify()` before storing and `JSON.parse()` after retrieving non-string values.
- The `storage` event lets one tab react to another tab's `localStorage` changes (but never fires on the tab that made the change itself).
