# Prototype Chain

## What Is the Prototype Chain?

Every object has access to a special hidden property named `[[Prototype]]`, which is either a reference to another object or `null`. This chain of linked objects is called the **prototype chain**.

For example, when you write `arr.length` or `arr.push(...)`, those don't exist directly on the array instance — they're found by walking up to `Array.prototype`.

When looking up a property, JS first looks on the object itself. If not found, it looks up the prototype chain, one link at a time, until it either finds the property or reaches the end of the chain (`null`).

Common chains:

```
Number    --> Number.prototype    --> Object.prototype --> null
String    --> String.prototype    --> Object.prototype --> null
Boolean   --> Boolean.prototype   --> Object.prototype --> null
Function  --> Function.prototype  --> Object.prototype --> null
Array     --> Array.prototype     --> Object.prototype --> null
Object    --> Object.prototype    --> null

// Constructor functions / classes:
const person = new Person()
person --> Person.prototype --> Object.prototype --> null
```

---

## `__proto__` vs. `Object.prototype`

### Question 1

```javascript
const AmaneLife = {
    fulltime: 'thrill'
};
const rohitLife = {
    fullTime: 'Dukh, dard, peeda'
}
const protoObj = {
    partTime: 'Annoying rohit'
};

console.log(AmaneLife.partTime);
AmaneLife.__proto__ = protoObj;
console.log(AmaneLife.partTime);
console.log(rohitLife.partTime);
```

<details><summary>Show Answer</summary>

```
undefined
Annoying rohit
undefined
```

**Explanation:** `AmaneLife` initially has no `partTime` property and no custom `[[Prototype]]`, so the lookup fails and returns `undefined`. Once `AmaneLife.__proto__ = protoObj` runs, `AmaneLife`'s `[[Prototype]]` points to `protoObj`, so `AmaneLife.partTime` now resolves via the chain. But `rohitLife` was never linked to `protoObj` — its own `partTime` lookup still fails.

`AmaneLife.__proto__ = protoObj` is conceptually similar to setting an own property, except it targets the hidden `[[Prototype]]` slot instead of a regular key:

```
const AmaneLife = {
    fulltime: 'thrill',
    __proto__: {
        partTime: 'Annoying rohit'
    }
};
{ fulltime: 'thrill' } -> { partTime: 'Annoying rohit' } -> Object.prototype -> null
        ^                          ^                                ^
   Original object          local prototype         Prototype present to every object
```

</details>

### Question 2 — Adding to `Object.prototype` Globally

```javascript
Object.prototype.partTime = 'Annoying Rohit'; // added to Object.prototype itself, not to any specific object
console.log(AmaneLife.partTime);
console.log(rohitLife.partTime);
```

<details><summary>Show Answer</summary>

```
Annoying Rohit
Annoying Rohit
```

**Explanation:** Unlike `Question 1`, this line directly adds a new property to the shared `Object.prototype` — the prototype that (almost) every object ultimately chains up to — instead of creating a local link on one specific object. Because of that, **every** plain object, including both `AmaneLife` and `rohitLife`, now resolves `partTime` through the chain, without needing individual `__proto__` wiring.

> **Note (why we generally avoid this in real code):** mutating a built-in prototype like `Object.prototype` affects every object in the entire program, including third-party code and libraries — a common source of hard-to-trace bugs. It's shown here purely to illustrate the mechanism.

</details>

### Understanding the Difference Between `__proto__` and `Prototype`

- `__proto__` is generally used when we need to add something to one specific array/object/function.
- `Prototype` (e.g. `Array.prototype`, `Object.prototype`) is used to add something to *all* instances of that type.
- `__proto__` can be thought of as a **local** prototype link.
- `Prototype` can be thought of as the **global** prototype shared by every instance of that type.

---

## Custom Prototype Additions

### Question 3

```javascript
const arr1 = ['one', 'two', 'three', 'four'];

// adding to the Array prototype — affects every array
Array.prototype.myFun = function () {
    const ar = this.map(e => e.toUpperCase());
    return ar;
};
console.log(arr1.myFun());
```

<details><summary>Show Answer</summary>

```
[ 'ONE', 'TWO', 'THREE', 'FOUR' ]
```

**Explanation:** `Array.prototype.myFun` is added to the shared `Array.prototype`, so every array — not just `arr1` — gains access to `myFun` through the chain.

</details>

### Question 4 — Adding to One Instance's `__proto__` Only

```javascript
arr1.__proto__.myFun = function () {
    return this.includes(3);
};
console.log(arr1.myFun());
```

<details><summary>Show Answer</summary>

```
false
```

**Explanation:** `arr1.__proto__` *is* `Array.prototype` (all plain arrays share the same `[[Prototype]]` reference — there's no separate "local" prototype object unless you explicitly reassign `__proto__` to something else, as in Question 1). So this reassigns `myFun` on the same shared `Array.prototype`, overwriting the previous version. `arr1.includes(3)` is `false` since `arr1` only contains strings.

</details>

### Question 5 — Deleting a Prototype Property

```javascript
delete arr1.__proto__.myFun;
console.log(typeof arr1.myFun);
```

<details><summary>Show Answer</summary>

```
undefined
```

**Explanation:** Properties added to a prototype (built-in or custom) can be removed with `delete`, just like own properties. Once removed, the lookup up the chain fails again since there's no other link providing `myFun`.

</details>

---

## Property Shadowing

### Question 6

```javascript
const base = { greet() { return 'base greet'; } };
const obj = Object.create(base);

console.log(obj.greet());

obj.greet = function () { return 'own greet'; };
console.log(obj.greet());
console.log(Object.getPrototypeOf(obj).greet());

delete obj.greet;
console.log(obj.greet());
```

<details><summary>Show Answer</summary>

```
base greet
own greet
base greet
base greet
```

**Explanation:** `obj` doesn't have its own `greet` yet, so the lookup walks up to `base` and finds it there. Assigning `obj.greet = ...` creates an **own property** on `obj` that **shadows** (hides) the inherited one — property lookup always stops at the first match it finds walking up the chain, so `obj.greet()` now uses the own version while `base.greet` underneath is completely untouched (confirmed by reading it directly off the prototype via `Object.getPrototypeOf(obj)`). Once the own property is `delete`d, the shadow is gone and the lookup falls through to `base.greet` again.

**Interview relevance:** this is the mechanism behind overriding methods in class inheritance — a subclass method with the same name doesn't modify the parent's method, it just shadows it earlier in the lookup chain.

</details>

---

## `in` vs. `hasOwnProperty` vs. `for...in` vs. `Object.keys`

### Question 7

```javascript
const parent = { inherited: 1 };
const child = Object.create(parent);
child.own = 2;

console.log('own' in child, 'inherited' in child);
console.log(child.hasOwnProperty('own'), child.hasOwnProperty('inherited'));

const forInKeys = [];
for (const k in child) forInKeys.push(k);
console.log(forInKeys);

console.log(Object.keys(child));
```

<details><summary>Show Answer</summary>

```
true true
true false
[ 'own', 'inherited' ]
[ 'own' ]
```

**Explanation:** These four all answer "does this property exist" at different points in the chain:

| Check | Walks the prototype chain? |
|---|---|
| `key in obj` | ✅ yes — true for both own and inherited enumerable/non-enumerable properties |
| `obj.hasOwnProperty(key)` | ❌ no — only true for properties directly on `obj` itself |
| `for...in` | ✅ yes — iterates own **and** inherited **enumerable** properties |
| `Object.keys(obj)` / `Object.entries` / `Object.values` | ❌ no — only own enumerable properties |

**Interview gotcha:** `for...in` silently picking up inherited (and even accidentally-added, e.g. polluted `Object.prototype`) properties is exactly why most real-world code prefers `Object.keys()` + `.forEach()`, or guards every `for...in` body with `if (obj.hasOwnProperty(key))`.

</details>

### Question 8 — Prototype Pollution via `for...in`

```javascript
Object.prototype.polluted = 'oops';

const plain = { a: 1 };
const forInKeys = [];
for (const k in plain) forInKeys.push(k);

console.log(forInKeys);
console.log(Object.keys(plain));

delete Object.prototype.polluted;
```

<details><summary>Show Answer</summary>

```
[ 'a', 'polluted' ]
[ 'a' ]
```

**Explanation:** Adding an enumerable property directly to `Object.prototype` makes it show up in `for...in` on **every** plain object in the program, since `for...in` walks the whole chain. `Object.keys()` is unaffected since it only ever looks at own properties. This is the core mechanism behind real-world "prototype pollution" vulnerabilities (e.g. a library recursively merging attacker-controlled JSON into an object and accidentally writing to `__proto__`/`constructor.prototype`) — it's also the concrete reason `for...in` is generally avoided in favor of `Object.keys`/`Object.entries`.

</details>

---

## `Object.getPrototypeOf` / `Object.setPrototypeOf`

### Question 9

```javascript
function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return `${this.name} makes a noise.`; };

function Dog(name) { Animal.call(this, name); }
Object.setPrototypeOf(Dog.prototype, Animal.prototype);
Dog.prototype.speak = function () { return `${this.name} barks.`; };

const d = new Dog('Rex');
console.log(d.speak());
console.log(Object.getPrototypeOf(d) === Dog.prototype);
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype);
console.log(d instanceof Dog, d instanceof Animal);
```

<details><summary>Show Answer</summary>

```
Rex barks.
true
true
true true
```

**Explanation:** `Object.setPrototypeOf(Dog.prototype, Animal.prototype)` links `Dog.prototype`'s `[[Prototype]]` to `Animal.prototype` — the standards-based equivalent of `Dog.prototype.__proto__ = Animal.prototype` or `Dog.prototype = Object.create(Animal.prototype)` (see `PrototypalInheritance.md`'s subclassing section). This is why `d` is `instanceof` both `Dog` and `Animal` — the chain is `d → Dog.prototype → Animal.prototype → Object.prototype → null`.

**Prefer `Object.getPrototypeOf`/`Object.setPrototypeOf` over `__proto__` in real code** — `__proto__` is a legacy accessor that was only standardized for web-compatibility reasons; `getPrototypeOf`/`setPrototypeOf` are the direct, unambiguous API, and `setPrototypeOf` on an existing object is a genuinely slow operation in most engines (changing an object's shape after creation defeats a lot of internal optimization) — prefer setting the prototype once at creation time via `Object.create(proto)`.

</details>

---

## `Function.prototype` — Adding Utilities to Every Function

Functions are themselves objects created by the built-in `Function` constructor, so every function has **two separate `[[Prototype]]`-related things**, and it's easy to conflate them:

1. Its own hidden `[[Prototype]]` link (as an *object*) — this points to `Function.prototype`, since every function is an *instance of* `Function`.
2. Its own `.prototype` *property* (as a *function*) — this is the object that becomes the `[[Prototype]]` of anything created with `new thatFunction()`.

These serve two completely different chains:

```
Function object inheritance (looking up a property ON the function itself, e.g. fun.call):

  fun
   │
   ▼
  Function.prototype
   │
   ▼
  Object.prototype
   │
   ▼
  null


Instance inheritance (looking up a property on something built with `new fun()`):

  new fun()
   │
   ▼
  fun.prototype
   │
   ▼
  Object.prototype
   │
   ▼
  null
```

Note that `fun.prototype` never appears in the *first* chain, and `Function.prototype` never appears in the *second* chain — they're independent lookup paths that both happen to bottom out at `Object.prototype`.

### Question 10 — Adding a Utility to `Function.prototype`

Suppose you want a new utility method available on *every* function, the same way `call`/`apply`/`bind`/`toString` already are. Since those live on `Function.prototype`, adding your own method there makes it available everywhere a function is available — this is exactly how `call`/`apply`/`bind` themselves are implemented.

```javascript
Function.prototype.myUtil = function () {
    return `I am ${this.name || 'anonymous'}`;
};

function greet() {}
const arrow = () => {};
class MyClass {}

console.log(greet.myUtil());
console.log(arrow.myUtil());
console.log(MyClass.myUtil());
```

<details><summary>Show Answer</summary>

```
I am greet
I am arrow
I am MyClass
```

**Explanation:** Regular functions, arrow functions, and classes are all, under the hood, ordinary function objects — `greet`, `arrow`, and `MyClass` all have `[[Prototype]]` pointing to `Function.prototype` (the *first* chain above). Adding `myUtil` there makes it reachable from all of them, regardless of how they were declared.

> Note: `name` is coming from `prototype` object, `name` property is added with name of function. We can't even override by writing `greet.name = "something else"`

</details>

### Question 11 — Does an *Instance* Get Access to `Function.prototype` Methods Too?

```javascript
function fun() {}
Function.prototype.myUtil = function () { return 'hi'; };

const instance = new fun();

console.log(typeof instance.myUtil); // does the instance see myUtil?
console.log(typeof fun.call);        // does fun itself see call?
console.log(typeof instance.call);   // does the instance see call?
```

<details><summary>Show Answer</summary>

```
undefined
function
undefined
```

**Explanation:** This is the classic gotcha the two chains above are meant to clarify. `instance` was created with `new fun()`, so its `[[Prototype]]` chain is the **second** diagram: `instance → fun.prototype → Object.prototype → null`. `Function.prototype` never appears anywhere in that chain, so `instance.myUtil` is `undefined` — same reason `instance.call` is also `undefined`, even though `call` is famously "available on every function."

`fun` itself, on the other hand, *is* a function object, so it follows the **first** diagram: `fun → Function.prototype → Object.prototype → null`. That's why `fun.call` works — `fun` inherits it directly from `Function.prototype`. But that inheritance doesn't cascade down to objects `fun` constructs; `instance` is a plain object as far as the *instance* chain is concerned, and only knows about `fun.prototype`, not `Function.prototype`.

</details>

### Question 12 — Practical Use Case: a Reusable `once()` Utility

```javascript
Function.prototype.once = function () {
    const fn = this;
    let called = false;
    let result;
    return function (...args) {
        if (!called) {
            result = fn.apply(this, args);
            called = true;
        }
        return result;
    };
};

function expensiveInit() {
    console.log('running expensive init');
    return 'done';
}

const initOnce = expensiveInit.once();
console.log(initOnce());
console.log(initOnce());
console.log(initOnce());
```

<details><summary>Show Answer</summary>

```
running expensive init
done
done
done
```

**Explanation:** `"running expensive init"` logs only once, even though `initOnce()` is called three times — `once()` wraps the original function in a closure that remembers whether it's already run, and simply returns the cached `result` on every call after the first. Because `once` was added to `Function.prototype` rather than defined as a free-standing helper, it can be called as `.once()` directly on *any* function (`expensiveInit.once()`, `someOtherFn.once()`, etc.) instead of having to wrap calls like `once(expensiveInit)`. This is a genuinely common pattern in real codebases for things like idempotent setup/init logic, one-time event handlers, or memoizing a single computation.

> **Caution:** patching built-in prototypes like `Function.prototype` in real production code is generally discouraged for the same reason as patching `Object.prototype` (see the Prototype Pollution note above) — it affects every function in the entire program, including third-party library internals. Utility libraries typically export standalone helper functions (`once(fn)`) instead. This section demonstrates the mechanism, not a recommended practice.

</details>

---

### Question 13 — `instanceof` Follows the *Current* Prototype, Not the One at Creation Time

```javascript
function Foo() {}
const f = new Foo();
console.log(f instanceof Foo);

Foo.prototype = {};
console.log(f instanceof Foo);
```

<details><summary>Show Answer</summary>

```
true
false
```

**Explanation:** `instanceof` checks — at the moment it runs — whether `Foo.prototype` appears anywhere in `f`'s prototype chain. `f`'s `[[Prototype]]` was set to whatever `Foo.prototype` *was* at construction time, and that link doesn't retroactively update when `Foo.prototype` is later reassigned to a brand-new object. `f`'s chain still points to the *old* prototype object, which is no longer `=== Foo.prototype`, so the check now fails.

</details>

### Question 14 — `isPrototypeOf`

```javascript
function Animal(name) { this.name = name; }
const a = new Animal('Leo');

console.log(Animal.prototype.isPrototypeOf(a));
console.log(Object.prototype.isPrototypeOf(a));
```

<details><summary>Show Answer</summary>

```
true
true
```

**Explanation:** `proto.isPrototypeOf(obj)` is the mirror image of `obj instanceof Constructor` — instead of asking "is `Constructor.prototype` in `obj`'s chain," it asks "is `proto` in `obj`'s chain" directly, without needing a constructor function at all. Useful when you only have a plain prototype object (e.g. from `Object.create`) and no named constructor to check against.

</details>

---

## `Object.create(null)` — Objects With No Prototype

### Question 15

```javascript
const dict = Object.create(null);
dict.a = 1;

console.log(dict.hasOwnProperty === undefined);
console.log(dict.toString());
```

<details><summary>Show Answer</summary>

```
true
TypeError: dict.toString is not a function
```

**Explanation:** `Object.create(null)` produces an object whose `[[Prototype]]` is `null` — the chain terminates immediately, so it inherits **nothing** from `Object.prototype`: no `toString`, no `hasOwnProperty`, no `valueOf`. This makes it a genuinely "bare" dictionary, immune to prototype-pollution attacks (there's no chain to pollute through) and safe to use as a lookup map for untrusted keys (no risk of a key like `"constructor"` or `"__proto__"` colliding with something inherited). The tradeoff: you lose convenience methods and must use `Object.prototype.hasOwnProperty.call(dict, key)` or `Object.hasOwn(dict, key)` instead of `dict.hasOwnProperty(key)`.

</details>

---

For polyfill implementations built on top of these prototype-chain mechanics (`myCall`, `myMap`, `myReduce`, etc.), see [Polyfills.md](Polyfills.md). For the full walkthrough of how the prototype chain leads to constructor functions and eventually `class`, see [PrototypalInheritance.md](PrototypalInheritance.md).
