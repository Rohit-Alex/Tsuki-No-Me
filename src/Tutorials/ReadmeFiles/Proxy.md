# Proxy and Reflect

## What is a `Proxy`?

A `Proxy` wraps another object (the **target**) and lets you intercept and customize fundamental operations on it — reading a property, writing one, checking `in`, deleting, calling it as a function, and more. Each interceptable operation is called a **trap**.

```javascript
const proxy = new Proxy(target, handler);
```

- `target` — the object being wrapped.
- `handler` — an object whose methods (traps) define custom behavior for specific operations. Any operation without a corresponding trap just falls through to the target's default behavior.

## Common Traps

### Question 1

The two most commonly used traps are `get` and `set`:

```javascript
const target = { name: 'Amane' };
const handler = {
  get(obj, prop) {
    console.log(`Getting ${prop}`);
    return obj[prop];
  },
  set(obj, prop, value) {
    console.log(`Setting ${prop} to ${value}`);
    obj[prop] = value;
    return true;
  }
};

const p = new Proxy(target, handler);

console.log(p.name);
p.age = 24;
console.log(target.age);
```

<details>
<summary>Show Answer</summary>

```
Getting name
Amane
Setting age to 24
24
```

**Explanation:** Reading `p.name` triggers the `get` trap, which logs and then forwards to `obj[prop]`. Writing `p.age = 24` triggers `set`, which must **return `true`** to signal success — returning a falsy value (or nothing) from `set` throws a `TypeError` in strict mode. Since the trap does `obj[prop] = value`, the write lands on `target` itself, which is why `target.age` also reflects the new value.

</details>

**Other traps you'll see:** `has` (intercepts the `in` operator), `deleteProperty` (intercepts `delete`), `ownKeys` (intercepts `Object.keys`/`for...in`), `apply` (intercepts calling the target as a function), `construct` (intercepts `new` on the target), `getPrototypeOf`/`setPrototypeOf`, and `defineProperty`.


## Practical Use Cases

### Question 3 — Validation

A common real use case: enforce constraints on property writes.

```javascript

const user = new Proxy({}, {
    set(obj, prop, value) {
      if (prop === 'age' && typeof value !== 'number') {
        throw new TypeError('age must be a number');
      }
      obj[prop] = value;
      return true;
    }
  });
user.age = 25;
console.log(user.age);
user.age = 'twenty-five';
```

<details>
<summary>Show Answer</summary>

```
25
TypeError: age must be a number
```

**Explanation:** Unlike `Object.freeze`/`Object.seal` (which only silently block or, in strict mode, throw a generic error), a `Proxy`'s `set` trap lets you write **arbitrary validation logic** with a custom error message, per property, at the moment of assignment.

</details>

### Question 4 — Negative Array Indexing

```javascript
function createNegativeArray(arr) {
  return new Proxy(arr, {
    get(target, prop) {
      if (typeof prop === 'string' && /^-\d+$/.test(prop)) {
        return target[target.length + Number(prop)];
      }
      return Reflect.get(target, prop);
    }
  });
}

const arr = createNegativeArray([10, 20, 30]);
console.log(arr[-1]);
console.log(arr[0]);
```

<details>
<summary>Show Answer</summary>

```
30
10
```

**Explanation:** `arr[-1]` is intercepted by `get`, detected as a negative-index string key, and remapped to `arr[arr.length - 1]` — Python-style negative indexing, which JS arrays don't support natively. Any other key (like `0`, or `.length`) falls through to `Reflect.get`, preserving normal array behavior.

</details>

### Question 5 — Hiding Properties from `in`

```javascript
const secretObj = { public: 1, _private: 2 };

const hidden = new Proxy(secretObj, {
  has(obj, prop) {
    if (typeof prop === 'string' && prop.startsWith('_')) return false;
    return Reflect.has(obj, prop);
  }
});

console.log('public' in hidden);
console.log('_private' in hidden);
```

<details>
<summary>Show Answer</summary>

```
true
false
```

**Explanation:** The `has` trap intercepts the `in` operator. Here, any key starting with `_` is reported as absent, even though `_private` genuinely exists on `secretObj` — a way to simulate "private" conventions at the language-feature level, not just by naming convention.

</details>

### Question 6 — Blocking Deletion

```javascript
const undeletable = new Proxy({ x: 1 }, {
  deleteProperty(obj, prop) {
    console.log(`Blocked delete of ${prop}`);
    return false;
  }
});

console.log(delete undeletable.x);
console.log(undeletable.x);
```

<details>
<summary>Show Answer</summary>

```
Blocked delete of x
false
1
```

**Explanation:** `deleteProperty` intercepts `delete`. Returning `false` signals failure — `delete undeletable.x` evaluates to `false`, and `x` is still there afterward. This is a finer-grained alternative to `Object.freeze`/`Object.seal` when you want to block *only* deletion (or add custom logic like "log every deletion attempt") without also locking down reads/writes.

</details>

### Question 7 — Proxying a Function

Proxies aren't limited to plain objects — they can wrap functions too, via the `apply` trap.

```javascript
function sum(a, b) { return a + b; }

const loggedSum = new Proxy(sum, {
  apply(fn, thisArg, args) {
    console.log(`Calling with args: ${args}`);
    return Reflect.apply(fn, thisArg, args);
  }
});

console.log(loggedSum(2, 3));
```

<details>
<summary>Show Answer</summary>

```
Calling with args: 2,3
5
```

**Explanation:** `apply` fires whenever the proxy itself is *called* like a function (`loggedSum(2, 3)`) — useful for logging, timing, memoizing, or validating arguments on any function without modifying its source. There's a matching `construct` trap for intercepting `new loggedSum()` instead.

</details>

## Gotchas and Invariants

### Question 9

Is a proxy the same object as its target?

```javascript
const target = { name: 'Amane' };
const p = new Proxy(target, {});

console.log(p === target);
console.log(typeof p, typeof target);
```

<details>
<summary>Show Answer</summary>

```
false
typeof p: object
typeof target: object
```

**Explanation:** A proxy is a genuinely distinct object/reference from its target — `p === target` is `false` — even though `typeof` reports `'object'` for both and (with no traps defined) they behave identically for every operation. This matters if you're storing objects in a `Set`/`Map` or comparing by reference elsewhere in your code — a proxy and its target are *not* interchangeable for identity checks.

</details>

### Question 10

Can a trap lie about a non-configurable, non-writable property's value?

```javascript
const objWithNonConfig = {};
Object.defineProperty(objWithNonConfig, 'locked', {
  value: 1,
  configurable: false,
  writable: false,
});

const violatingProxy = new Proxy(objWithNonConfig, {
  get() {
    return 999; // lying about the real value
  }
});

console.log(violatingProxy.locked);
```

<details>
<summary>Show Answer</summary>

```
TypeError: 'get' on proxy: property 'locked' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected '1' but got '999')
```

**Explanation:** Traps aren't a total escape hatch — the spec defines **invariants** each trap must respect relative to the target's actual property descriptors. A non-configurable, non-writable property is guaranteed (by the language) to always report the same value everywhere, so a `get` trap is not allowed to return anything different for it. Violating an invariant throws a `TypeError` at the moment of the violation, not when the proxy is created.

</details>

## Interview Notes

- **Performance:** every trapped operation goes through extra function-call overhead compared to touching the target directly. Don't reach for `Proxy` on hot paths purely for convenience — use it where the interception itself is the point (validation, logging, reactivity).
- **`Proxy` vs. `Object.defineProperty`:** before `Proxy` existed, libraries like Vue 2 used `Object.defineProperty` to make objects "reactive" (re-render on property change) by turning each existing key into a getter/setter pair. The catch: `defineProperty` only works on keys that already exist at setup time — adding a brand-new property later isn't automatically tracked, which is why Vue 2 needed a special `Vue.set()` escape hatch. `Proxy`'s `set`/`deleteProperty`/`ownKeys` traps intercept the object as a whole, so new keys are tracked automatically — this is exactly why Vue 3's reactivity system is built on `Proxy` instead.
- **When to reach for it in an interview answer:** validation layers, access logging/auditing, computed/virtual properties, negative array indexing or other custom indexing schemes, revocable/sandboxed access to an object, and implementing your own lightweight reactivity system.
