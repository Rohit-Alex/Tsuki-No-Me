# Objects in JavaScript

## Different Ways to Create Objects

1. **Object literal** — e.g. `const obj = {key: 'value'}`
2. **Using `new Object()`** — e.g. `const obj = new Object({ key: 'value' })`
3. **Using a constructor function** — see the [Constructor Functions](#constructor-functions) section below.
4. **Using classes** — covered in depth in [PrototypalInheritance.md](PrototypalInheritance.md) (OOP notes).
5. **Using `Object.create()`** — see below.

**Values can be of any type:**

```javascript
const dummyObj = {
  number: 2,
  string: 'Hey there!',
  boolean: true,
  array: [2, 4, 1, 'Amane'],
  myName() {
    console.log("Amane here.")
  },
  obj: {
    nestedKey: 1
  }
}
```

## `Object.create`

`Object.create(proto, propertiesObject?)` creates a **new, empty object** whose `[[Prototype]]` is set directly to whatever you pass as `proto` — no constructor function runs, and there's no `new` involved. It's the most direct way to set up prototypal inheritance by hand.

### Question 1

```javascript
const animal = {
  speak() { return `${this.name} makes a noise.`; }
};

const dog = Object.create(animal);
dog.name = 'Rex';

console.log(dog.speak());
console.log(Object.getPrototypeOf(dog) === animal);
console.log(dog.hasOwnProperty('speak'));
console.log('speak' in dog);
```

<details>
<summary>Show Answer</summary>

```
Rex makes a noise.
true
false
true
```

**Explanation:** `dog` starts out completely empty — `speak` isn't its own property, it's inherited from `animal`, which is now `dog`'s prototype. That's why `hasOwnProperty('speak')` is `false` (not an *own* property) but `'speak' in dog` is `true` (`in` walks the whole prototype chain, same as covered in Question 18 above).

</details>

### Question 2

`Object.create(null)` — an object with **no prototype at all**, not even `Object.prototype`:

```javascript
const dict = Object.create(null);
dict.key = 'value';

console.log(dict.key);
console.log(dict.toString());
```

<details>
<summary>Show Answer</summary>

```
value
TypeError: dict.toString is not a function
```

**Explanation:** Every normal object — even `{}` — inherits from `Object.prototype`, which is where methods like `.toString()`, `.hasOwnProperty()`, and `.valueOf()` actually live. `Object.create(null)` opts out of that entirely, giving you a truly "bare" object with `Object.getPrototypeOf(dict) === null`. This is genuinely useful for building a pure key-value dictionary with zero risk of a data key accidentally colliding with an inherited method name (e.g. a key literally named `"toString"` or `"constructor"`). It's also *why* `Object.hasOwn(obj, key)` (Question 15 above) is recommended over `obj.hasOwnProperty(key)` — the latter would throw on a `dict` like this one, since `dict` has no `hasOwnProperty` method to call either.

</details>

### Question 3

The second argument lets you define properties with full descriptors, exactly like `Object.defineProperties`:

```javascript
const withProps = Object.create({}, {
  greeting: { value: 'hi', enumerable: true }
});

console.log(withProps.greeting);
```

<details>
<summary>Show Answer</summary>

```
hi
```

**Explanation:** The second argument to `Object.create` uses the exact same property-descriptor format as `Object.defineProperties` (Question 8 above) — so the same "defaults to non-enumerable/non-writable/non-configurable unless stated" rule applies here too.

</details>

### Question 4

How is `Object.create(Foo.prototype)` different from `new Foo()`?

```javascript
function Foo(name) {
  this.name = name;
}
Foo.prototype.greet = function() {
  return `Hi ${this.name}`;
};

const viaNew = new Foo('A');
const viaCreate = Object.create(Foo.prototype);

console.log(viaNew.greet());
console.log(viaCreate.name);
console.log(viaCreate.greet());
```

<details>
<summary>Show Answer</summary>

```
Hi A
undefined
Hi undefined
```

**Explanation:** `new Foo('A')` both sets the new object's prototype to `Foo.prototype` **and** runs the `Foo` constructor body (which sets `this.name = 'A'`). `Object.create(Foo.prototype)` only does the first part — it wires up the prototype link so `greet()` is inherited and callable, but the constructor never runs, so `name` was never assigned. This is exactly why `Object.create` is the *lower-level* building block — `new`/classes are built on top of it, with the constructor-calling behavior layered on.

</details>

## `Object.assign`

### Question 5

```javascript
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
console.log(returnedTarget === target);
```

<details>
<summary>Show Answer</summary>

```
{ a: 1, b: 4, c: 5 }
true
```

**Explanation:** `Object.assign(target, source)` copies `source`'s own enumerable properties onto `target`, overwriting any matching keys (`b: 2` → `b: 4`), and **mutates and returns `target` itself** — it doesn't create a new object. That's why `returnedTarget === target` is `true`.

</details>

### Question 6

⚠️ **Warning — `Object.assign` only does a *shallow* clone**, same limitation as `Object.freeze`/spread. What happens here?

```javascript
const original = { name: 'Amane', address: { city: 'Vadodara' } };
const clone = Object.assign({}, original);

clone.address.city = 'Las Vegas';

console.log(original.address.city);
console.log(clone.address === original.address);
```

<details>
<summary>Show Answer</summary>

```
Las Vegas
true
```

**Explanation:** `Object.assign({}, original)` copies `original`'s top-level properties into a new object — but for the `address` property, what actually gets *copied* is the **reference** to the same nested object, not a fresh copy of it. So `clone.address` and `original.address` point at the exact same object in memory, and mutating one mutates both. To truly clone nested data, you need a deep-clone approach (`structuredClone()`, `JSON.parse(JSON.stringify())`, or a recursive clone — see [shallow&DeepCopy.md](shallow&DeepCopy.md) for the full comparison). Object spread (`{ ...original }`) has this exact same shallow-only limitation.

</details>

### Question 7

**Merging more than two objects** — later sources win on conflicting keys, applied left to right:

```javascript
const a = { x: 1, y: 1 };
const b = { y: 2, z: 2 };
const c = { z: 3, w: 3 };

console.log(Object.assign({}, a, b, c));
```

<details>
<summary>Show Answer</summary>

```
{ x: 1, y: 2, z: 3, w: 3 }
```

**Explanation:** `Object.assign` accepts any number of source objects and applies them in order, left to right, onto the target. `y` is set by `a` (`1`) then overwritten by `b` (`2`); `z` is set by `b` (`2`) then overwritten by `c` (`3`). Whichever source object comes *last* and defines a given key wins.

</details>

### Question 8

**Merging objects that share the *same* properties:**

```javascript
const p1 = { name: 'A', age: 1 };
const p2 = { name: 'B', age: 2 };

console.log(Object.assign({}, p1, p2));
```

<details>
<summary>Show Answer</summary>

```
{ name: 'B', age: 2 }
```

**Explanation:** Every property in `p1` is also in `p2`, so `p2`'s values win across the board — the result is effectively just a copy of `p2`. This is the same left-to-right, last-source-wins rule as Question 3, just with 100% overlap instead of partial overlap.

</details>

### Question 9

**Gotcha — getters are invoked during the copy, but only their *result* is copied, not the getter itself:**

```javascript
const withGetter = {
  get random() {
    return Math.floor(Math.random() * 1000);
  }
};

const copied = Object.assign({}, withGetter);
console.log(Object.getOwnPropertyDescriptor(copied, 'random'));
```

<details>
<summary>Show Answer</summary>

```
{ value: <some number>, writable: true, enumerable: true, configurable: true }
```

**Explanation:** `Object.assign` doesn't copy property *descriptors* (getters/setters, `writable`, etc.) — it reads each source property's **current value** (which, for a getter, means calling it) and does a plain `target[key] = value` assignment. So `copied.random` becomes a normal, static, writable data property holding whatever the getter happened to return at copy time — it's frozen at that one random value forever, not a live getter anymore.

</details>

### Question 10

**Gotcha — inherited (prototype) properties are *not* copied, only own enumerable ones:**

```javascript
function Base() {}
Base.prototype.inherited = 'from prototype';

const instance = new Base();
instance.own = 'own prop';

console.log(Object.assign({}, instance));
```

<details>
<summary>Show Answer</summary>

```
{ own: 'own prop' }
```

**Explanation:** `Object.assign` (like `Object.keys`, `for...in`'s enumerable-own equivalent, and spread) only copies an object's **own** enumerable properties. `inherited` lives on `Base.prototype`, not directly on `instance`, so it's silently skipped — a common surprise when merging class/constructor-function instances instead of plain objects.

</details>

## Property Descriptors: `Object.defineProperty` / `Object.defineProperties`

### Question 11

```javascript
const object1 = {};

Object.defineProperty(object1, 'property1', {
  value: 42,
  writable: false,
});

object1.property1 = 77;
console.log(object1.property1);
```

<details>
<summary>Show Answer</summary>

```
42
```

**Explanation:** `writable: false` makes the property read-only. In non-strict-mode code (a plain script, like this one), assigning to it is a **silent no-op** — no error, the value just doesn't change.

</details>

### Question 12

Does the same assignment behave differently in strict mode?

```javascript
'use strict';

const object1 = {};
Object.defineProperty(object1, 'property1', {
  value: 42,
  writable: false,
});

object1.property1 = 77;
```

<details>
<summary>Show Answer</summary>

```
TypeError: Cannot assign to read only property 'property1' of object '#<Object>'
```

**Explanation:** The exact same assignment that silently fails in Question 2 **throws** under `'use strict'`. This is a common interview trap — the "silent failure" behavior for frozen/read-only properties is a non-strict-mode-only courtesy. ES modules and class bodies are strict by default, so this is more likely to bite in modern codebases than it looks.

</details>

### Question 13

```javascript
const object2 = {};

Object.defineProperties(object2, {
  property1: {
    value: 42,
    writable: true,
  },
  property2: {},
});

console.log(object2.property1);
console.log(Object.keys(object2));
```

<details>
<summary>Show Answer</summary>

```
42
[]
```

**Explanation:** `object2.property1` reads `42` directly. But `Object.keys()` returns an **empty array** — any descriptor field you don't explicitly specify defaults to `false` (`enumerable`, `configurable`, and, for `defineProperty`/`defineProperties`, `writable` too). Since `enumerable` wasn't set on either property, neither shows up in `Object.keys()`, `for...in`, or `JSON.stringify()`, even though `property1` is readable directly.

</details>

## Dot vs. Bracket Notation

```javascript
const obj = {
    name: 'Amane',
    surname: 'Ubuyashiki',
    address: {
        city: 'Vadodara'
    },
}
obj.bf = 'xyz'
```

### Question 14

Accessing a property that doesn't exist:

```javascript
console.log(obj.gf)
```

<details>
<summary>Show Answer</summary>

```
undefined
```

**Explanation:** Reading a non-existent property never throws — it just returns `undefined`. (Contrast this with reading a property *of* `undefined`, which does throw — see Question 7.)

</details>

### Question 15

```javascript
const fun = () => "surname";
const expensiveCal = 'name'

console.log(obj['name'])
console.log(obj[expensiveCal]);
console.log(obj.surname)
console.log(obj[fun()])
```

<details>
<summary>Show Answer</summary>

```
Amane
Amane
Ubuyashiki
Ubuyashiki
```

**Explanation:** Bracket notation takes any expression and evaluates it to a string key — `obj[expensiveCal]` looks up `obj['name']`, and `obj[fun()]` calls `fun()` first (`"surname"`), then looks up `obj['surname']`. Use bracket notation whenever the key is dynamic (computed at runtime); dot notation only works with a literal, static identifier.

</details>

**The classic dot-vs-bracket puzzle:**

```javascript
const bird = {
  size: 'small',
};

const mouse = {
  name: 'Mickey',
  small: true,
};
```

### Question 16

```javascript
console.log(mouse.bird.size);
```

<details>
<summary>Show Answer</summary>

```
TypeError: Cannot read properties of undefined (reading 'size')
```

**Explanation:** `mouse` has no `bird` property, so `mouse.bird` is `undefined`. Trying to read `.size` off of `undefined` throws. (See Question 10 for how optional chaining avoids this.)

</details>

### Question 17

```javascript
console.log(mouse[bird.size]);
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** `bird.size` evaluates first to `'small'`, so this becomes `mouse['small']` → `true`. This is completely different from Question 7 — here `bird` is its own object being read directly (not a property of `mouse`), and its value is used as the *key* to look up on `mouse`.

</details>

### Question 18

```javascript
console.log(mouse[bird["size"]]);
```

<details>
<summary>Show Answer</summary>

```
true
```

**Explanation:** Identical result to Question 8 — `bird["size"]` and `bird.size` are just two notations for reading the same property off `bird`, both giving `'small'`, which is then used as the computed key into `mouse`.

</details>

### Question 19

How would optional chaining change the outcome of Question 7?

```javascript
console.log(mouse.bird?.size);
```

<details>
<summary>Show Answer</summary>

```
undefined
```

**Explanation:** `?.` short-circuits to `undefined` the moment it hits a `null`/`undefined` value, instead of throwing. Since `mouse.bird` is `undefined`, `mouse.bird?.size` stops right there and returns `undefined` — no `TypeError` like in Question 7.

</details>

## Traversing an Object

### Question 20

```javascript
const obj = {
    name: 'Amane',
    surname: 'Ubuyashiki',
    address: { city: 'Vadodara' },
    bf: 'xyz',
}

for (const key in obj) {
    console.log(`Key is ${key} and value is ${obj[key]}`)
}
```

<details>
<summary>Show Answer</summary>

```
Key is name and value is Amane
Key is surname and value is Ubuyashiki
Key is address and value is [object Object]
Key is bf and value is xyz
```

**Explanation:** `for...in` iterates every enumerable key, in insertion order (for string keys). `address`'s value stringifies to `[object Object]` when interpolated into a template literal, since objects don't have a meaningful default string form (see [Coercion.md](Coercion.md) for why).

</details>

### Question 21

```javascript
console.log(Object.keys(obj))
console.log(Object.values(obj))
console.log(Object.entries(obj))
```

<details>
<summary>Show Answer</summary>

```
['name', 'surname', 'address', 'bf']
['Amane', 'Ubuyashiki', { city: 'Vadodara' }, 'xyz']
[['name', 'Amane'], ['surname', 'Ubuyashiki'], ['address', { city: 'Vadodara' }], ['bf', 'xyz']]
```

**Explanation:** `Object.entries()` returns an array of `[key, value]` pairs — each entry is itself a 2-element array, with the key first and the value second.

</details>

**Traversal using `forEach`:** objects don't have their own `.forEach()` — only arrays do. So the usual pattern is to get an array first via `Object.keys()`, then `.forEach()` over that:

```javascript
Object.keys(obj).forEach(key => {
  console.log(`Key is ${key} and value is ${obj[key]}`)
})
```

## Checking Whether a Property Exists

Available options: `in`, `hasOwnProperty`, `Reflect.has`, and the modern `Object.hasOwn`.

- **`'key' in obj`** — checks for the property anywhere in the object *or its prototype chain*. Returns a boolean.
- **`obj.hasOwnProperty('key')`** — checks *only* for the object's own property (not inherited ones).
- **`Reflect.has(obj, 'key')`** — behaves like `in`: checks the object and its prototype chain. It's just the static-method form of the same check.
- **`Object.hasOwn(obj, 'key')`** — the modern replacement for `hasOwnProperty`, recommended because it works correctly even on objects that don't inherit from `Object.prototype` (e.g. `Object.create(null)`).

### Question 22

```javascript
const checkKeyInObj = {
  Ubuyashiki: 'Your Grace',
};

console.log('Ubuyashiki' in checkKeyInObj)
console.log(Reflect.has(checkKeyInObj, 'Ubuyashiki'))
console.log(checkKeyInObj.hasOwnProperty('Ubuyashiki'))
```

<details>
<summary>Show Answer</summary>

```
true
true
true
```

**Explanation:** `Ubuyashiki` is an own property of `checkKeyInObj`, so all three checks agree. The interesting case is Question 14, where they *don't*.

</details>

### Question 23

```javascript
console.log('toString' in checkKeyInObj)
console.log(Reflect.has(checkKeyInObj, 'toString'))
console.log(checkKeyInObj.hasOwnProperty('toString'))
```

<details>
<summary>Show Answer</summary>

```
true
true
false
```

**Explanation:** `toString` isn't defined directly on `checkKeyInObj` — it's inherited from `Object.prototype`. `in` and `Reflect.has` walk the whole prototype chain, so they find it and return `true`. `hasOwnProperty` only checks the object's *own* properties, so it correctly says `false`.

</details>

### Question 24

```javascript
const o = { a: 1 };
console.log(Object.hasOwn(o, 'a'));
console.log(Object.hasOwn(o, 'toString'));
```

<details>
<summary>Show Answer</summary>

```
true
false
```

**Explanation:** `Object.hasOwn()` gives the same result as `hasOwnProperty` here, but is the recommended modern replacement — it's a static method (so it can't be shadowed or broken by an object overriding its own `hasOwnProperty`), and it still works correctly on objects created with `Object.create(null)`, which have no `Object.prototype` to fall back on at all.

</details>

## `Object.fromEntries`

### Question 25

```javascript
const arr1 = [
  ["name", "Amane"],
  ["surname", "Ubuyashiki"],
  ["bf", "xyz"],
];

console.log(Object.fromEntries(arr1))
```

<details>
<summary>Show Answer</summary>

```
{ name: 'Amane', surname: 'Ubuyashiki', bf: 'xyz' }
```

**Explanation:** `Object.fromEntries()` is the inverse of `Object.entries()` — it takes an array of `[key, value]` pairs and rebuilds an object from them.

</details>

## Constructor Functions

Suppose you want to maintain a record of your lovers by tracking `name`, `reasonForDecline`, `dayLeft`, and methods to increase/decrease `dayLeft`.

**The problem — writing it out as separate object literals doesn't scale:**

```javascript
const lover1 = {
  name: "namoona1",
  reasonForDecline: "Pasand nhi aur upar se annoying hai",
  dayLeft: 30,
  extendExpiry: function (extendBy) {
    this.dayLeft += extendBy;
    return `${this.dayLeft} days tak maje leti hu 😊`;
  },
  shortenExpiry: function (shortenBy) {
    this.dayLeft -= shortenBy;
    return `${this.dayLeft} days bus. Bahut ho rha iska ab 😠`;
  },
};

const lover2 = {
  name: "namoona2",
  reasonForDecline: "Chota hai warna sochti",
  dayLeft: 180,
  extendExpiry: function (extendBy) {
    this.dayLeft += extendBy;
    return `${this.dayLeft} days tak maje leti hu 😊`;
  },
  shortenExpiry: function (shortenBy) {
    this.dayLeft -= shortenBy;
    return `${this.dayLeft} days mein ise bhi chor dunhi 😂`;
  },
};
```

### Question 26

```javascript
console.log(lover1.reasonForDecline)
console.log(lover1.extendExpiry(10))
console.log(lover1.shortenExpiry(30));
```

<details>
<summary>Show Answer</summary>

```
Pasand nhi aur upar se annoying hai
40 days tak maje leti hu 😊
10 days bus. Bahut ho rha iska ab 😠
```

**Explanation:** `dayLeft` starts at `30`. `extendExpiry(10)` adds 10 → `40`. `shortenExpiry(30)` then subtracts 30 from the *updated* `40` → `10`. Each method mutates the shared `this.dayLeft`, so the calls are cumulative.

</details>

**Same shape, repeated code.** Mainly used when we want to make objects with the same properties/methods but different values, and writing them out longhand like this is repetitive — that's exactly the problem constructor functions solve:

```javascript
function Lovers(name, reasonForDecline) {
  let dayLeft = 365;
  this.name = name;
  this.reasonForDecline = reasonForDecline;
  this.extendExpiry = function(extendBy) {
    dayLeft += extendBy;
    return `${dayLeft} days tak maje leti hu 😊`;
  }
  this.shortenExpiry = function(shortenBy) {
    dayLeft -= shortenBy;
    return `${dayLeft} days mein ise bhi chor dunhi 😂`;
  }
}

const lover3 = new Lovers('namoona1', 'Pasand nhi aur upar se annoying hai')
const lover4 = new Lovers('namoona2', 'Chota hai warna sochti')
```

### Question 27

```javascript
console.log(lover3.reasonForDecline)
console.log(lover3.extendExpiry(10))
console.log(lover3.shortenExpiry(365));

console.log(lover4.reasonForDecline)
console.log(lover4.extendExpiry(30))
console.log(lover4.shortenExpiry(300));
```

<details>
<summary>Show Answer</summary>

```
Pasand nhi aur upar se annoying hai
375 days tak maje leti hu 😊
10 days mein ise bhi chor dunhi 😂
Chota hai warna sochti
395 days tak maje leti hu 😊
95 days mein ise bhi chor dunhi 😂
```

**Explanation:** Each call to `new Lovers(...)` creates its own independent `dayLeft` closure variable starting at `365` — `lover3` and `lover4` don't share state, even though they came from the same constructor. This is what makes constructor functions scale: same shape, independent instances, without repeating the object literal every time.

</details>

## `Object.freeze` vs. `Object.seal` vs. `Object.preventExtensions`

| | Add new properties | Modify existing properties | Delete properties |
|---|:---:|:---:|:---:|
| `Object.freeze()` | ❌ | ❌ | ❌ |
| `Object.seal()` | ❌ | ✅ | ❌ |
| `Object.preventExtensions()` | ❌ | ✅ | ✅ |

- **`Object.freeze()`** — completely immutable. No adding, modifying, or deleting properties.
- **`Object.seal()`** — existing properties can still be modified, but nothing can be added or removed.
- **`Object.preventExtensions()`** — the loosest of the three: just blocks adding *new* properties. Existing ones can still be freely modified or deleted.

> **Memory trick:** *Freeze* is the longer word — it does more (blocks add, delete, *and* modify). *Seal* is shorter — it does less (only blocks add/delete, modify still works).

All three attempts (add/modify/delete) **fail silently** in non-strict mode — no error, the operation just doesn't happen (same rule as Question 2/3 above).

Also important: **all three only do a *shallow* lock** — they only affect the object's own immediate properties. A nested object one level down is completely unaffected (see Question 19).

### Question 28

```javascript
const frozenObj = { name: 'Amane', address: { city: 'Vadodara' } };
Object.freeze(frozenObj);

frozenObj.married = false;               // adding a new property
frozenObj.age = 25;                      // adding another new property
const wasDeleted = delete frozenObj.name; // deleting an existing property
frozenObj.address.city = 'Las Vegas';    // modifying a NESTED object's property

console.log(frozenObj);
console.log(wasDeleted);
console.log(Object.isFrozen(frozenObj));
```

<details>
<summary>Show Answer</summary>

```
{ name: 'Amane', address: { city: 'Las Vegas' } }
false
true
```

**Explanation:** `married` and `age` are never added, `name` is never deleted (`delete` returns `false` to signal failure) — freeze blocks all three. But `frozenObj.address.city` *does* change to `'Las Vegas'`, because `Object.freeze()` only froze `frozenObj`'s own top-level properties; the nested `address` object itself was never frozen and remains fully mutable.

</details>

### Question 29

```javascript
const sealObj = { name: 'Amane' };
Object.seal(sealObj);

sealObj.name = 'Prateek'; // modifying an existing property
sealObj.age = 17;         // adding a new property
const wasDeleted = delete sealObj.name;

console.log(sealObj);
console.log(wasDeleted);
```

<details>
<summary>Show Answer</summary>

```
{ name: 'Prateek' }
false
```

**Explanation:** Unlike `freeze`, `seal` allows modifying `name` to `'Prateek'` — that succeeds. But adding `age` and deleting `name` both fail, exactly as the table above predicts.

</details>

### Question 30

```javascript
const peObj = { x: 1 };
Object.preventExtensions(peObj);

peObj.y = 2;             // adding a new property
peObj.x = 99;             // modifying an existing property
const wasDeleted = delete peObj.x;

console.log(peObj);
console.log(wasDeleted);
```

<details>
<summary>Show Answer</summary>

```
{}
true
```

**Explanation:** `preventExtensions` is the loosest of the three — it *only* blocks adding new properties (`y` never gets added). Modifying `x` to `99` succeeds, and then deleting `x` also succeeds (`wasDeleted` is `true`), leaving an empty object.

</details>

### Question 31

`Object.freeze()` only does a shallow freeze — how would you make it a *deep* freeze?

```javascript
const deepFreeze = (obj) => {
  for (const key in obj) {
      if (typeof obj[key] === "object") deepFreeze(obj[key]);
  }
  Object.freeze(obj);
};

const nested = { name: 'Amane', address: { city: 'Vadodara' } };
deepFreeze(nested);

nested.address.city = 'Las Vegas'; // attempting to mutate the nested object

console.log(nested);
console.log(Object.isFrozen(nested), Object.isFrozen(nested.address));
```

<details>
<summary>Show Answer</summary>

```
{ name: 'Amane', address: { city: 'Vadodara' } }
true true
```

**Explanation:** `deepFreeze` recursively walks every property, and if a property's value is itself an object, freezes *that* too before finally freezing the top-level object. Now both `nested` and `nested.address` report `true` for `Object.isFrozen()`, and the nested mutation attempt silently fails — contrast with Question 19, where the plain (shallow) `Object.freeze()` let the nested mutation through.

</details>

## Object Spread vs. `Object.assign`

Both merge/copy own enumerable properties from one or more source objects, but they differ in one important way:

```javascript
const target = { a: 1 };
const source = { b: 2 };

const merged1 = Object.assign(target, source); // mutates AND returns `target`
const merged2 = { ...target, ...source };       // always creates a brand-new object
```

- **`Object.assign(target, ...sources)`** mutates `target` in place (and returns it) — as seen in Question 1. If you don't want the original mutated, you must pass an empty object as the target: `Object.assign({}, target, source)`.
- **`{ ...target, ...source }`** (spread) never touches the originals — it always builds a fresh object.

In modern code, spread is generally preferred for cloning/merging specifically *because* it can't accidentally mutate an existing object the way `Object.assign(target, source)` can if you forget the empty-object trick.

**Computed property names** — bracket-notation-style dynamic keys also work directly inside object literals, not just for reading:

```javascript
const key = 'dynamicKey';
const withComputed = { [key]: 'value', ['static' + 1]: 'val2' };
console.log(withComputed); // { dynamicKey: 'value', static1: 'val2' }
```
