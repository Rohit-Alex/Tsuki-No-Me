# The `this` Keyword in JavaScript

## Rules for `this` Binding

1. **Global context** — `this` refers to the global object (`window` in browsers). In strict mode, it's `undefined`.
2. **`new` binding** — `this` refers to the object being constructed.
3. **Implicit binding** — `this` refers to whatever object is calling the function, i.e. whatever is directly to the left of the dot at the call site. This happens automatically, just from how the function is invoked.
4. **Explicit binding** — using `call`/`apply`/`bind` to explicitly set what `this` should be.
5. **`setTimeout` (special case)** — the callback is invoked as a plain, context-less function call once it's pulled off the callback queue, so it follows the "global context" rule above (`this` is the global object in sloppy mode, `undefined` in strict mode) unless explicitly bound.
6. **Arrow functions** — an arrow function does not have its own `this` at all. Instead, it lexically resolves `this` by looking up the enclosing scope chain until it finds a function that *does* define `this`, and reuses that binding.

An arrow function treats `this` like any other variable — it resolves lexically to whatever `this` is in the enclosing scope, exactly like closures resolve any other outer variable.

> **Important:** object literals `{ ... }` are *not* scopes. `this` inside a method never "looks up" through the surrounding object literal — it only ever looks up through enclosing *functions*.

## Priority of the Rules

When multiple rules could apply, JS resolves `this` in this order:

1. Is the function called with **`new`**? → `this` is the newly created object.
2. Is the function called with **`call`** or **`apply`**? → `this` is the explicitly passed object. (`bind()` effectively pre-applies this rule permanently — see Question 9.)
3. Is the function called on a context object, i.e. `object.method()`? → `this` is that object.
4. **Default:** the global object in sloppy mode, or `undefined` in strict mode.

Arrow functions are the exception to all four — they never participate in this algorithm at all; they always take `this` from their lexical (enclosing) scope, unconditionally.

---

## Practice Questions

### Question 1 — Global Context

```javascript
this;
window;
this === window;
function a() {
    console.log(this);
}
a();
```

<details><summary>Show Answer</summary>

```
Window {...}
Window {...}
true
Window {...}
```

**Explanation:** At the top level of a script, `this` is the global object (`window` in a browser). Calling `a()` as a plain, context-less function call also defaults `this` to the global object — this is the sloppy-mode default from Rule 4 above.

**Note:** In strict mode, both the top-level `this` in a module and the `this` inside `a()` would be `undefined` instead.

</details>

### Question 2 — Strict Mode vs. Non-Strict Mode

```javascript
var teacher = "Kyle";
function ask(question) {
    console.log(this.teacher, question);
}
function askAgain(question) {
    "use strict";
    console.log(this.teacher, question);
}

ask("What's the non-strict-mode default?");
askAgain("What's the strict-mode default?");
```

<details><summary>Show Answer</summary>

```
Kyle What's the non-strict-mode default?
Uncaught TypeError: Cannot read properties of undefined (reading 'teacher')
```

**Explanation:** `ask` is called as a plain function call in non-strict mode, so `this` defaults to the global object — `this.teacher` finds the global `teacher` variable (`var` at top level attaches to the global object). `askAgain` opts into strict mode, so `this` defaults to `undefined` instead of the global object for a plain function call — and reading `.teacher` off `undefined` throws.

</details>

### Question 3 — Implicit Binding

```javascript
const obj = {
    property: `I'm a property of obj.`,
    method: function () {
        console.log(this.property);
    }
};
obj.method();
```

<details><summary>Show Answer</summary>

```
I'm a property of obj.
```

**Explanation:** `this` refers to whatever is immediately to the left of the dot at the call site. Here that's `obj`, so `this` is `obj`.

</details>

### Question 4 — Multiple Objects Sharing the Same Function

```javascript
var name = "window";
function whichName() {
    console.log(this.name);
}
const obj1 = {
    name: "Obj 1",
    whichName
};
const obj2 = {
    name: "Obj 2",
    whichName
};

whichName();
obj1.whichName();
obj2.whichName();
```

<details><summary>Show Answer</summary>

```
window
Obj 1
Obj 2
```

**Explanation:** `this` depends entirely on *how* the function is called, never on where it was defined. The exact same `whichName` function reference produces three different `this` values because it's invoked three different ways: as a bare call (global object), and as a method of `obj1`/`obj2` respectively.

</details>

### Question 5 — Nested Functions

```javascript
const a = function () {
    console.log("a", this);
    const b = function () {
        console.log("b", this);
        const c = {
            hi: function () {
                console.log("c", this);
            }
        };
        c.hi();
    };
    b();
};
a();
```

<details><summary>Show Answer</summary>

```
a Window {…}
b Window {…}
c {hi: ƒ}
```

**Explanation:**
- `a()` is called as a plain function call, so `this` is the global object.
- `b()` is also called as a plain function call (it's invoked as `b()`, not as a method of anything, even though it's textually nested inside `a`) — nesting doesn't inherit `this`, only arrow functions do that. So `this` is still the global object.
- `c.hi()` is called as a method of `c`, so `this` is `c`.

</details>

---

## `setTimeout` and `this`

### Question 6 — `setTimeout` Loses `this`

```javascript
var workshop = {
    teacher: "Kyle",
    ask(question) {
        console.log(this.teacher, question);
    },
};

setTimeout(workshop.ask, 10, "Lost this?");
setTimeout(workshop.ask.bind(workshop), 10, "Hard bound this?");
```

<details><summary>Show Answer</summary>

```
undefined Lost this?
Kyle Hard bound this?
```

**Explanation:** Passing `workshop.ask` to `setTimeout` passes only the *function reference* — it detaches the function from `workshop` entirely. When the event loop eventually invokes the callback, it does so as a plain, context-less call (`fn(...)`), so `this` defaults to the global object, and `this.teacher` is `undefined`. `.bind(workshop)` fixes this permanently by returning a new function whose `this` can never be anything but `workshop`, regardless of how it's later invoked.

</details>

### Question 7 — Constructor Function (`new` Binding)

```javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
    console.log(this);
}
const person1 = new Person("person1", 55);
```

<details><summary>Show Answer</summary>

```
Person { name: 'person1', age: 55 }
```

**Explanation:** `new` creates a fresh object, sets its `[[Prototype]]` to `Person.prototype`, and calls `Person` with `this` bound to that fresh object — this is Rule 1, the highest-priority rule, overriding everything else.

</details>

### Question 8 — Implicit Binding

```javascript
const person = {
    name: "person",
    age: 20,
    hi() {
        console.log("hi " + this);
    }
};
person.hi();
```

<details><summary>Show Answer</summary>

```
hi [object Object]
```

**Explanation:** `this` is the `person` object (implicit binding, Rule 3) — but `"hi " + this` coerces `this` to a string via string concatenation, and the default string conversion for a plain object is `"[object Object]"`, not a readable dump of its properties. (A logged object shown expanded, like `{name: 'person', age: 20, ...}`, only happens when you `console.log(this)` directly — not when it's concatenated into a string first.) To print the object's actual shape, use `console.log("hi", this)` (comma, not `+`) or `JSON.stringify(this)`.

</details>

### Question 9 — Explicit Binding with `.bind()`

```javascript
let name = "Brittney";
const person3 = {
    name: "person3",
    age: 50,
    hi: function () {
        console.log("hi " + this.name);
    }.bind(window)
};
person3.hi();
```

<details><summary>Show Answer</summary>

```
hi Brittney
```

**Explanation:** `.bind(window)` runs *before* the method is ever attached to `person3`, permanently locking `this` to `window`. Calling `person3.hi()` still looks like implicit binding (Rule 3) at the call site, but explicit binding (Rule 2, via `bind`) takes priority and can never be overridden by how the function is later called — see [CallApplyBind.md](CallApplyBind.md#question-6--double-bind) for the "double bind" gotcha this same mechanism causes.

</details>

### Question 10 — Arrow Functions as Object Methods

```javascript
var workshop = {
    teacher: "Kyle",
    ask: (question) => {
        console.log(this.teacher, question);
    },
};
workshop.ask("What happened to 'this'?");
workshop.ask.call(workshop, "Still no 'this'?");
```

<details><summary>Show Answer</summary>

```
undefined What happened to 'this'?
undefined Still no 'this'?
```

**Explanation:**
- Arrow functions never have their own `this` — they resolve it lexically from the enclosing scope.
- The object literal `{ ... }` is *not* a scope, There are 2 lexical scopes.
    - **Scope 1** — Global Scope 
        - Variables declared here: `workshop`
    - **Scope 2** — Arrow Function Scope `(question) => { .... }`
        - Variables declared here: `question`
- So `this` inside `ask` is whatever `this` is at the top level — the global object in a plain script (or `undefined` in a strict-mode module).
- Because arrow functions ignore Rules 1–4 entirely, even `.call(workshop, ...)` has no effect on `this` — only the arguments get passed through.

</details>

### Question 11 — Arrow Function Inside a Regular Method

```javascript
const person4 = {
    name: "person4",
    age: 40,
    hi: function () {
        var inner = () => {
            console.log(this);
        };
        return inner();
    }
};
person4.hi();
```

<details><summary>Show Answer</summary>

```
person4 { name: 'person4', age: 40, hi() {...} }
```

**Explanation:** `inner` is an arrow function, so it takes `this` from its enclosing scope — the `hi` method. `hi` is called as `person4.hi()`, so implicit binding gives it `this === person4`. `inner` simply inherits that same value. This is the standard fix for the classic "callback loses `this`" problem (see Question 6 and Question 14).

</details>

### Question 12 — Regular Function Inside a Method

```javascript
const obj = {
    name: "Billy",
    sing() {
        console.log("a", this);
        var anotherFunc = function () {
            console.log("b", this);
        };
        anotherFunc();
    }
};
obj.sing();
```

<details><summary>Show Answer</summary>

```
a {name: "Billy", sing: ƒ}
b Window {…}
```

**Explanation:** `sing()` is called as a method of `obj`, so `this` is `obj`. But `anotherFunc()` is called as a plain function call — being lexically nested inside `sing` doesn't matter, since regular functions never inherit `this` from their enclosing scope. So `this` defaults back to the global object inside `anotherFunc`. Compare with Question 15, where switching `anotherFunc` to an arrow function fixes this.

</details>

### Question 13 — Basic Method Call

```javascript
const obj = {
    name: 'Amane',
    surname: 'Ubuyashiki',
    age: 25,
    printName: function() {
        console.log(`My Name: ${this.name} and age: ${this.age}`)
    }
}
obj.printName();
```

<details><summary>Show Answer</summary>

```
My Name: Amane and age: 25
```

**Explanation:** Implicit binding — `printName` is called as `obj.printName()`, so `this` is `obj`.

</details>

### Question 14 — `setTimeout` Challenge: Three Approaches

**Challenge:** modify `printName` to log the name after a delay. Compare three approaches:

**Approach 1:**

```javascript
printName: function() {
    setTimeout(function () {
        console.log(`My Name: ${this.name} and age: ${this.age}`)
    }, 1000)
}
```

**Approach 2:**

```javascript
printName: function() {
    const that = this
    setTimeout(function () {
        console.log(`My Name: ${that.name} and age: ${that.age}`)
    }, 1000)
}
```

**Approach 3:**

```javascript
printName: function() {
    setTimeout(() => {
        console.log(`My Name: ${this.name} and age: ${this.age}`)
    }, 1000)
}
```

<details><summary>Show Answer</summary>

**Approach 1 — ❌ broken:**

```
My Name: undefined and age: undefined
```

The callback passed to `setTimeout` is invoked later as a plain, context-less function call — exactly like Question 6 — so `this` defaults to the global object, which has no `name`/`age`.

**Approach 2 — ✅ works (pre-ES6 fix):**

```
My Name: Amane and age: 25
```

Capturing `this` in a regular variable (`that`) *before* entering the callback sidesteps the problem — `that` is just a normal closed-over variable, unaffected by how the inner function is later called.

**Approach 3 — ✅ works (modern fix):**

```
My Name: Amane and age: 25
```

An arrow function passed to `setTimeout` never has its own `this` — it lexically resolves `this` from `printName`'s scope, which is correctly bound to the object. This is the preferred modern approach; `that`/`self` aliasing is now mostly a historical pattern.

</details>

### Question 15 — Arrow Function vs. Regular Function Inside a Method

Compare with Question 12 — what changes?

```javascript
const obj = {
    name: "Billy",
    sing() {
        console.log("a", this);
        var anotherFunc = () => {
            console.log("b", this);
        };
        anotherFunc();
    }
};
obj.sing();
```

<details><summary>Show Answer</summary>

```
a {name: "Billy", sing: ƒ}
b {name: "Billy", sing: ƒ}
```

**Explanation:** Unlike Question 12's regular function, this arrow function inherits `this` from its lexical scope (`sing`), so both logs show the same object.

</details>

### Question 16 — Function Return Patterns

```javascript
var b = {
    name: "jay",
    say() {
        console.log(this);
    }
};
var c = {
    name: "jay",
    say() {
        return function () {
            console.log(this);
        };
    }
};
var d = {
    name: "jay",
    say() {
        return () => console.log(this);
    }
};

b.say();
c.say();
c.say()();
d.say();
d.say()();
```

<details><summary>Show Answer</summary>

```
b {name: 'jay', say()...}
function() {console.log(this)}
Window {...}
() => console.log(this)
d {name: 'jay', say()...}
```

**Explanation:**
- `b.say()` — called as a method, logs `b` immediately.
- `c.say()` — just returns the inner function without calling it, so nothing runs yet; the returned function itself is what's printed (this line's "output" is really just the REPL echoing the returned value, not a `this` log).
- `c.say()()` — now the returned regular function is actually invoked, but as a plain call (nothing to the left of that second `()`), so `this` defaults to the global object.
- `d.say()` — same as `c.say()`, just returns the arrow function without invoking it.
- `d.say()()` — the returned arrow function is invoked, but arrow functions never rebind `this` — it still resolves lexically to `this` from when `say()` ran, which was `d` (implicit binding via `d.say()`).

**Key insight:** a regular function's `this` is decided fresh at *its own* call site every time it's invoked; an arrow function's `this` is permanently fixed to whatever `this` was in the scope where the arrow function was *written*, regardless of how or where it's later called.

</details>

---

## `this` Inside Classes

### Question 17 — Detaching a Class Method Loses `this`

```javascript
class Counter {
    constructor() {
        this.count = 0;
    }
    increment() {
        this.count++;
        console.log(this.count);
    }
}

const counter = new Counter();
counter.increment();

const inc = counter.increment;
inc();
```

<details><summary>Show Answer</summary>

```
1
Uncaught TypeError: Cannot read properties of undefined (reading 'count')
```

**Explanation:** `counter.increment()` works fine — implicit binding, `this` is `counter`. But `const inc = counter.increment` copies out just the bare function reference, detached from `counter` entirely — same trap as Question 6. Calling `inc()` is a plain function call, and unlike a normal function, **class bodies are always implicitly strict mode**, so `this` defaults to `undefined` instead of the global object. Reading `.count` off `undefined` throws immediately, rather than silently producing `undefined` the way Question 14's Approach 1 did.

**Why this matters in practice:** this is exactly the bug behind `<button onClick={this.handleClick}>` in React class components losing its `this` — passing a method as a callback always detaches it.

</details>

### Question 18 — Fixing It with an Arrow Function Class Field

```javascript
class Counter {
    count = 0;
    increment = () => {
        this.count++;
        console.log(this.count);
    };
}

const counter = new Counter();
const inc = counter.increment;
inc();
inc();
```

<details><summary>Show Answer</summary>

```
1
2
```

**Explanation:** Declaring `increment` as an arrow-function **class field** (rather than a method on the prototype) means a new arrow function is created fresh for *each instance*, at construction time, inside the constructor's scope — where `this` is already correctly bound to the new instance. Because it's an arrow function, that `this` is captured lexically and permanently, so `inc()` still works correctly even fully detached from `counter`. This is the standard fix for the React class-component callback problem (`onClick={this.increment}` now works without needing `.bind(this)` in the constructor).

**Trade-off:** each instance gets its own copy of the function (like the "own-copy methods" pattern in [PrototypalInheritance.md](PrototypalInheritance.md)) instead of sharing one via the prototype — a small memory cost for the binding safety.

</details>

---

## Additional Resources

For more practice: [Take this quiz: Understand how 'this' works in JavaScript](https://dev.to/liaowow/take-this-quiz-understand-how-this-works-in-javascript-44dj)
