# Lexical Scope & Lexical Environment

## 1. The Core Idea

**Lexical scope** means the variables a piece of code can see are decided by **where the code is written**, not by where or how it is called.

> **Lexical = decided by the shape of the source code.**

A function remembers the place it was **defined**, and looks up names from there.

**Analogy:** think of a function as a person with a home address. When they need something (a variable), they check their own room first, then their house, then their street, then their city. It doesn't matter whose house they happen to be visiting when they ask — they always search outward from **home**.

The common trap: not every `{ ... }` is a "room". Look at this:

```js
const user = {
  name: "Rohit",
  greet: () => {
    console.log(this.name);
  },
};
```

`greet` looks like it lives "inside" `user`. But `user` is an **object**, not a scope. The object literal is not a room the function can search. Most of this doc is about keeping those two ideas apart.

---

## 2. What Is a Lexical Environment?

A **lexical environment** is how JavaScript keeps track of which names exist at a given point in the code. It has two parts:

```text
Lexical Environment
├── Environment Record          → the names defined here (variables, functions, parameters)
└── Outer Environment Reference → a link to the surrounding environment
```

Two moments matter:

1. **When a function is created**, it stores a hidden link called `[[Environment]]` to the environment it was written in. This link never changes.
2. **Each time the function is called**, a **brand-new** function environment is created for that call (parameters + local variables). Its outer link is set to the function's `[[Environment]]`.

```js
const name = "Rohit";

function greet() {
  console.log(name);
}
```

```text
Global Environment
├── name  → "Rohit"
└── greet → function
              └── [[Environment]] → Global Environment
```

When `greet()` runs and needs `name`, it checks its own call environment, doesn't find it, follows the outer link to Global, and finds it there.

> **Spec note (good to know, not needed for interviews):** newer versions of the ECMAScript spec dropped the separate "Lexical Environment" type and just talk about **Environment Records**, each with an `[[OuterEnv]]` field. Same idea, different name.

---

## 3. What Creates a New Environment?

| Code | Creates an environment? | Holds |
|---|---|---|
| Global script | ✅ | global `var`, `let`, `const`, functions |
| ES module | ✅ | module-level bindings (each module has its own) |
| Function call | ✅ (new one per call) | parameters, local `var`/`let`/`const`, inner functions |
| Block `{}` with `let`/`const`/`class`/function inside | ✅ | those block-scoped names |
| `for (let i ...)` loop | ✅ (new one **per iteration**) | `i` |
| `catch (err)` | ✅ | `err` |
| Class body | ✅ | the class's own name, private `#names` |
| **Object literal `{ a: 1 }`** | ❌ | nothing — it's a value, not a scope |

`var` ignores blocks — it belongs to the nearest function (or global) environment. That's why `var` "leaks" out of `if` blocks and `let` doesn't.

---

## 4. The Scope Chain: How a Name Is Found

```js
const a = 1;

function outer() {
  const b = 2;

  function inner() {
    const c = 3;
    console.log(a, b, c); // 1 2 3
  }

  inner();
  console.log(c); // ReferenceError — outer can't look *inward*
}
```

```text
inner's environment  (c)
        ↓ outer link
outer's environment  (b, inner)
        ↓ outer link
Global environment   (a, outer)
        ↓
null → not found → ReferenceError
```

Rules:

- Lookup always goes **outward**, never inward or sideways.
- The **first** match wins. That's what makes [shadowing](VariableShadowing.md) work.
- The chain is fixed by where code is written. Calling `inner` from somewhere else would not change it.

Blocks follow the same rule:

```js
const x = 10;

if (true) {
  const y = 20;
  console.log(x, y); // 10 20 — the block's outer link points to Global
}

console.log(y); // ReferenceError — y lives only in the block's environment
```

---

## 5. The Global Environment Has Two Halves

The global environment is special. It's split into:

- an **object part** backed by the global object (`window` / `globalThis`) — holds global `var` and function declarations
- a **declarative part** — holds global `let`, `const`, and `class`

```js
var v = 1;
let l = 2;

console.log(window.v); // 1
console.log(window.l); // undefined — l is global, but not a property of window
```

This matters for the next section: in a browser, the global object already has properties like `name`, `status`, and `top`, and those show up as **global variables**.

---

## 6. Object Literals Are NOT Lexical Environments

```js
const user = {
  name: "Rohit",
  age: 27,
};
```

`name` and `age` are **properties**, not variables. The only variable here is `user`.

```text
Global Environment
└── user ──────────┐
                   ▼
            ┌─────────────┐
            │   Object    │
            ├─────────────┤
            │ name: Rohit │
            │ age: 27     │
            └─────────────┘
```

There are two different kinds of lookup, and they never mix:

| | Identifier lookup | Property lookup |
|---|---|---|
| Looks like | `name` | `user.name`, `this.name` |
| Searches | the environment chain, outward | the object, then its [prototype chain](PrototypeChain.md) |
| Not found | `ReferenceError` | `undefined` |

### The trap

```js
const user = {
  name: "Rohit",
  greet: function () {
    console.log(name); // bare identifier — NOT user.name
  },
};

user.greet();
```

`name` is a bare identifier, so JavaScript searches the environment chain: `greet`'s call environment → Global. It never looks inside `user`.

- **In Node:** `ReferenceError: name is not defined`
- **In a browser:** prints `""` — no error! It finds `window.name` (a real browser property, empty by default) through the global object part from Section 5. This is a classic "why is it blank?" bug.

To read the property, you must say which object: `this.name` or `user.name`.

> **The one exception:** the (deprecated, banned in strict mode) `with (obj) { ... }` statement *does* turn an object into an environment, so bare names are looked up on `obj`. That's exactly why it was banned — it makes lookups impossible to predict by reading the code. The global object (Section 5) is the only other place an object backs an environment.

---

## 7. `this` — Regular Functions vs Arrow Functions

`this` is not a normal variable, and the two kinds of function get it differently.

**Regular functions** get `this` from **how they are called** (the call-site):

```js
const user = {
  name: "Rohit",
  greet() {
    console.log(this.name);
  },
};

user.greet(); // "Rohit" — called as user.greet(), so this === user

const fn = user.greet;
fn(); // this is undefined (strict) or globalThis (sloppy) — call-site changed
```

**Arrow functions** don't have their own `this`. They look `this` up **through the same outer-environment chain** used for variables, until they reach an environment that has a `this` (a regular function call, the module, or the global script).

```js
const user = {
  name: "Rohit",
  greet: () => {
    console.log(this.name);
  },
};

user.greet();
```

The arrow's outer environment is wherever `user` was written — here, the top level. The object literal is skipped because it isn't an environment. So `this` is the top-level `this`:

| Where this code runs | Top-level `this` | Result of `user.greet()` |
|---|---|---|
| Browser `<script>` | `window` | `window.name` → `""` |
| ES module (browser or Node `.mjs`) | `undefined` | `TypeError: Cannot read properties of undefined` |
| Node CommonJS file | `module.exports` (`{}`) | `undefined` |

None of them give `"Rohit"`.

**The fix that does work** — put the arrow inside a regular method, so the nearest `this` is the method's:

```js
const obj = {
  name: "obj",
  make() {
    return () => this.name; // arrow's outer env = make's call env, where this === obj
  },
};

obj.make()(); // "obj"
```

So "lexical `this`" isn't a separate mechanism — it's the arrow function borrowing `this` from its lexical surroundings, exactly like it borrows a variable. What's different is **regular** functions: they ignore the chain for `this` and use the call-site instead. More cases in [`this` examples](thisExample.md).

---

## 8. Worked Example: Classify Every Name

```js
const globalValue = 1;

function outer() {
  const outerValue = 2;

  const obj = {
    property: 3,
    method() {
      const methodValue = 4;

      console.log(methodValue);   // 4
      console.log(outerValue);    // 2
      console.log(globalValue);   // 1
      console.log(this.property); // 3 (when called as obj.method())
    },
  };

  return obj;
}

outer().method();
```

**Environment chain** (where `method` was written):

```text
method's call environment  (methodValue)
        ↓
outer's call environment   (outerValue, obj)
        ↓
Global environment         (globalValue, outer)
```

**Object structure** (separate from the above):

```text
obj
├── property: 3
└── method → function   ([[Environment]] → outer's call environment)
```

| Name | Kind of lookup | Path |
|---|---|---|
| `methodValue` | identifier | found in method's own environment |
| `outerValue` | identifier | method → outer |
| `globalValue` | identifier | method → outer → global |
| `this.property` | find `this` (call-site: `obj.method()` → `obj`), then **property** lookup on it | `obj.property` |

Notice `obj` never appears in the environment chain. It's a **value** stored in `outer`'s environment that happens to hold a reference to `method`.

---

## 9. Closures Fall Out of This

Because a function keeps its `[[Environment]]` link, the environment it points to stays alive as long as the function does — even after the outer function has returned. That is a closure.

```js
function createCounter() {
  let count = 0;
  return function increment() {
    return ++count;
  };
}

const a = createCounter();
const b = createCounter();

a(); // 1
a(); // 2
b(); // 1 — b has its own count
```

Each call to `createCounter()` creates a **new** environment (Section 2), so `a` and `b` each close over their own `count`.

```text
a ──[[Environment]]──► createCounter call #1  (count → 2)
b ──[[Environment]]──► createCounter call #2  (count → 1)
```

Methods on returned objects work the same way — **not** because they're inside an object, but because they were **written inside the function**:

```js
function createUser() {
  const secret = "123";
  return {
    getSecret() {
      return secret; // found via [[Environment]] → createUser's call environment
    },
  };
}

createUser().getSecret(); // "123"
```

The per-iteration environment of `for (let ...)` (Section 3) is why this classic question behaves differently with `let` and `var`:

```js
const withLet = [];
for (let i = 0; i < 3; i++) withLet.push(() => i);
withLet.map((f) => f()); // [0, 1, 2] — a fresh i per iteration

const withVar = [];
for (var j = 0; j < 3; j++) withVar.push(() => j);
withVar.map((f) => f()); // [3, 3, 3] — one shared j in the function/global environment
```

```
Function #1
   │
   └── [[Environment]]
          ↓
      Environment containing j


Function #2
   │
   └── [[Environment]]
          ↓
      Environment containing j


Function #3
   │
   └── [[Environment]]
          ↓
      Environment containing j
```

Full closure deep-dive: [Closures](closure.md).

---

## 10. Interview Checklist

When asked *"what can this function see?"*:

1. **Find where the function is written.** Walk outward through the enclosing functions, blocks, module, global.
2. **Skip object literals.** They are values, not scopes.
3. **For each name, decide the kind of lookup:**
   - bare name (`x`) → environment chain → `ReferenceError` if missing
   - `something.x` / `this.x` → property lookup → `undefined` if missing
4. **Work out `this` separately:**
   - regular function → from the call-site
   - arrow function → from the nearest enclosing regular function / module / script

| Question | Look at |
|---|---|
| Where does `x` come from? | The environment chain where the code is written |
| Is `x` a property? | The object (and its prototype chain) |
| What is `this` in a regular function? | How it was called |
| What is `this` in an arrow function? | The nearest enclosing `this` in the source |
| Is this `{}` an object literal? | **Not** an environment |
| Is this `{}` a block? | An environment if it has `let`/`const`/`class` inside |
| Why does a closure still see `count`? | `[[Environment]]` keeps that environment alive |

> **Objects hold properties. Environments hold variables.**
> **A function being written inside an object does not make the object its scope.**
