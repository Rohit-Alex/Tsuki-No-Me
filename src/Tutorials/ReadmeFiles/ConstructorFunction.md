## Constructor Function:

### 0. Implementing a design using constructor function

You're building a notification center for a large web application. The application can generate thousands of notifications during a user's session.
Each notification should have the following properties and behavior:
1. Every notification has a message, type, and timestamp.
2. Each notification should expose a getDetails() method that returns its details in a readable format.
3. All notification instances should share common methods rather than creating separate copies of those methods for every instance.
4. The notification center should support creating notifications of different types, such as INFO, SUCCESS, WARNING, and ERROR.

```js

function NotificationCenter(msg, type, timestamp) {
  this.message = msg;
  this.type = type;
  this.timestamp = timestamp;
}

NotificationCenter.prototype.getDetails = function () {
  const formattedTimestamp = new Date(
    this.timestamp,
  ).toLocaleString();

  return `Type: ${this.type}
Message: ${this.message}
Timestamp: ${formattedTimestamp}`;
};

const noti1 = new NotificationCenter("Hi", "Info", Date.now() - 1_00_00_000);

const noti2 = new NotificationCenter("Hello", "Success", Date.now() - 10_00_000);

console.log(noti1.getDetails());
console.log(noti2.getDetails());

console.log(noti1.getDetails === noti2.getDetails); // true
```

### 1. Adding methods to the existing prototype

```js
NotificationCenter.prototype.fun1 = function () {};
NotificationCenter.prototype.fun2 = function () {};
```

- Adds methods to the **existing prototype object**.
- Preserves existing properties, including `constructor`.
- Existing instances can access newly added methods because they still reference the same prototype object.

### 2. Replacing the prototype object

```js
NotificationCenter.prototype = {
  fun1() {},
  fun2() {},
};
```

- Creates a **new prototype object** and assigns it to `NotificationCenter.prototype`.
- Does not preserve properties from the old prototype unless explicitly copied or redefined.
- Existing instances continue to inherit from the old prototype.
- New instances inherit from the new prototype.
- The new object does not have its own `constructor` property by default. Consequently, instances inherit `Object.prototype.constructor`, which is `Object`.

### 3. Quick comparison

| Behavior | Adding methods | Replacing prototype |
|---|---|---|
| Prototype object | Modified | Replaced |
| Existing properties preserved | Yes | No |
| Existing instances access newly added methods | Yes | No, if methods exist only on the new prototype |
| New instances access the methods | Yes | Yes |
| `instance.constructor === NotificationCenter` | Normally `true` | `false`, unless restored |

**Remember:** Adding methods modifies the existing object; replacing the prototype changes which object future instances inherit from.

---

### 4. Example: NotificationCenter

```js
function NotificationCenter(msg, type, timestamp) {
  this.message = msg;
  this.type = type;
  this.timestamp = timestamp;
}

NotificationCenter.prototype.getDetails = function () {
  const formattedTimestamp = new Date(this.timestamp).toLocaleString();

  return `Type: ${this.type}
Message: ${this.message}
Timestamp: ${formattedTimestamp}`;
};

NotificationCenter.prototype.getType = function () {
  return "UNKNOWN";
};

const noti1 = new NotificationCenter("Hi", "Info", Date.now());
const noti2 = new NotificationCenter("Hello", "Success", Date.now());

console.log(noti1.hasOwnProperty("getDetails"));
console.log("getDetails" in noti1);
console.log(noti1.getDetails === noti2.getDetails);

NotificationCenter.prototype.getType = function () {
  return this.type;
};

console.log(noti1.getType());

NotificationCenter.prototype = {
  getType() {
    return "UNKNOWN";
  },
};

console.log(noti1.getType());

const noti3 = new NotificationCenter("Hey", "Warning", Date.now());

console.log(noti3.getType());
console.log(noti3.constructor === NotificationCenter);
console.log(noti3.getDetails());
```

<details>
<summary><strong>Show / Hide Answer: Console Output and Explanation</strong></summary>

#### Output

```text
false
true
true
Info
Info
UNKNOWN
false
TypeError: noti3.getDetails is not a function
```

The final statement throws a `TypeError`, so execution stops unless the error is caught.

#### Explanation

**1. `noti1.hasOwnProperty("getDetails")` → `false`**

`getDetails` is defined on `NotificationCenter.prototype`, not directly on `noti1`.

**2. `"getDetails" in noti1` → `true`**

The `in` operator checks the object and its entire prototype chain.

**3. `noti1.getDetails === noti2.getDetails` → `true`**

Both instances inherit the same function from their shared prototype. The method is not recreated for each instance.

#### 4. `noti1.getType()` → `"Info"`

```js
NotificationCenter.prototype.getType = function () {
  return this.type;
};

console.log(noti1.getType()); // "Info"
```

When `noti1` was created, its internal `[[Prototype]]` reference was set to the object currently referenced by `NotificationCenter.prototype`.

Initially, the references look like this:

```text
NotificationCenter (constructor function)
          |
          | .prototype
          v
     [ Object A ]
     | constructor: NotificationCenter
     | getDetails()
     | getType() → "UNKNOWN"
          ^
          |
          | [[Prototype]]
       [ noti1 ]
       | message: "Hi"
       | type: "Info"
       | timestamp: ...
          ^
          |
          | [[Prototype]]
       [ noti2 ]
       | message: "Hello"
       | type: "Success"
       | timestamp: ...
```

When we execute:

```js
NotificationCenter.prototype.getType = function () {
  return this.type;
};
```

we **modify the existing Object A** by replacing its `getType` property with a new function.

We do not create a new prototype object. Both instances still reference Object A, so they use the updated method.

```text
NotificationCenter.prototype
          |
          v
     [ Object A ]
     | getDetails()
     | getType() → this.type
          ^
          |
       [ noti1 ]                [ noti2 ]
       type: "Info"             type: "Success"
```

When `noti1.getType()` executes, JavaScript finds the method on Object A and calls it with `this` set to `noti1`.

Therefore:

```js
noti1.getType(); // "Info"
noti2.getType(); // "Success"
```

The method is shared, but `this` refers to the instance on which the method is called.

---

#### 5. `noti1.getType()` after replacing the prototype → `"Info"`

Now consider this reassignment:

```js
NotificationCenter.prototype = {
  getType() {
    return "UNKNOWN";
  },
};

console.log(noti1.getType()); // "Info"
```

This operation is fundamentally different from adding or updating a method.

Instead of modifying Object A, we create a **new object, Object B**, and change the `prototype` property on the constructor function to reference it.

```text
NotificationCenter (constructor function)
          |
          | .prototype
          v
     [ Object B ]  ← New prototype
     | getType() → "UNKNOWN"


     [ Object A ]  ← Original prototype
     | constructor: NotificationCenter
     | getDetails()
     | getType() → this.type
          ^
          |
          | [[Prototype]]
       [ noti1 ]
       | type: "Info"
          ^
          |
          | [[Prototype]]
       [ noti2 ]
       | type: "Success"
```

Notice that **only the constructor's `.prototype` reference changes**. The internal `[[Prototype]]` references of `noti1` and `noti2` remain connected to Object A.

This is because creating an object with `new` establishes its prototype link at creation time. Reassigning the constructor's `.prototype` later does not automatically update that link.

Consequently:

```js
noti1.getType(); // "Info"    — looks up the method on Object A
noti2.getType(); // "Success" — looks up the method on Object A
```

However, a new instance created after the reassignment points to Object B:

```js
const noti3 = new NotificationCenter("Hey", "Warning", Date.now());

noti3.getType(); // "UNKNOWN"
```

Its prototype chain is different:

```text
[ noti3 ]
     |
     | [[Prototype]]
     v
[ Object B ]
| getType() → "UNKNOWN"
     |
     | [[Prototype]]
     v
[ Object.prototype ]
```

`noti3` cannot access `getDetails()` because that method exists on Object A, which is not part of `noti3`'s prototype chain.

```js
noti3.getDetails(); // TypeError: noti3.getDetails is not a function
```

**Key takeaway:** `NotificationCenter.prototype` is a property on the constructor function, while `[[Prototype]]` is an internal link on each instance. Reassigning the former does not automatically change the latter.

**6. `noti3.getType()` → `"UNKNOWN"`**

`noti3` is created after the reassignment, so it inherits from the new prototype object, where `getType()` returns `"UNKNOWN"`.

**7. `noti3.constructor === NotificationCenter` → `false`**

The new prototype object has no own `constructor` property. Property lookup continues to `Object.prototype.constructor`, whose value is `Object`.

Therefore:

```js
noti3.constructor === Object; // true
```

**8. `noti3.getDetails()` → `TypeError`**

`getDetails` exists on the original prototype, not the new one. Since the new prototype does not inherit from the original prototype, `noti3` cannot find `getDetails`.

#### Prototype chain summary

- `noti1` and `noti2` → Original prototype (`getDetails`, updated `getType`, `constructor: NotificationCenter`)
- `noti3` → New prototype (`getType`) → `Object.prototype`

</details>

### 5. Restoring the constructor property

When replacing a prototype, explicitly define `constructor` if instances should resolve it to the original constructor function.

```js
NotificationCenter.prototype = {
  constructor: NotificationCenter,

  getType() {
    return "UNKNOWN";
  },
};
```

This restores the correct value, but the property is enumerable because it is defined in an object literal.

To preserve the usual non-enumerable behavior of the default `constructor` property, use `Object.defineProperty()`:

```js
Object.defineProperty(NotificationCenter.prototype, "constructor", {
  value: NotificationCenter,
  writable: true,
  configurable: true,
});
```

**Interview takeaway:** The `constructor` property is an ordinary property inherited through the prototype chain. It is not a guaranteed record of which function originally created an object.

## Calling a Constructor Function Without `new`

When a constructor function is called without `new`, JavaScript does not create a new instance automatically.

### 1. In strict mode

```js
"use strict";

function NotificationCenter(message) {
  this.message = message;
}

NotificationCenter("Hello"); // TypeError
```

- In a regular function call, `this` is `undefined` in strict mode.
- Assigning `this.message` throws a `TypeError`.

### 2. In non-strict mode

```js
function NotificationCenter(message) {
  this.message = message;
}

const noti = NotificationCenter("Hello");

console.log(noti); // undefined
console.log(window.message); // "Hello" (in a browser)
```

- In non-strict mode, `this` defaults to the global object when the function is called without a receiver.
- The function modifies global state instead of creating an instance.
- Since there is no explicit `return`, the function returns `undefined`.

### 3. Fix: Enforce the use of `new`

Use `new.target` to detect whether the function was called as a constructor.

```js
function NotificationCenter(message) {
  if (!new.target) {
    throw new TypeError("Use new to create a NotificationCenter");
  }

  this.message = message;
}

const noti = new NotificationCenter("Hello");
console.log(noti.message); // "Hello"

NotificationCenter("Hello"); // TypeError
```

### 4. Alternative: Support both calling styles

If you want to support calls with and without `new`, redirect ordinary calls to a constructor call.

```js
function NotificationCenter(message) {
  if (!new.target) {
    return new NotificationCenter(message);
  }

  this.message = message;
}

const n1 = NotificationCenter("Hello");
const n2 = new NotificationCenter("World");

console.log(n1.message); // "Hello"
console.log(n2.message); // "World"

console.log(n1 instanceof NotificationCenter); // true
console.log(n2 instanceof NotificationCenter); // true
```

**Interview takeaway:** Calling a constructor without `new` does not create an instance. Use `new.target` to enforce constructor usage or deliberately support both calling styles.

## Constructor Return Values

When a constructor function is called with `new`, JavaScript creates a new object, links it to the constructor's current `prototype`, and executes the constructor with `this` bound to that object.

The constructor's return value determines which object the caller receives.

### 1. Returning an object, function, or primitive

```js
function NotificationCenter(message, returnValue) {
  this.message = message;

  if (returnValue) {
    return returnValue;
  }
}

const n1 = new NotificationCenter("Hello", null);

const n2 = new NotificationCenter("World", {
  message: "Overridden",
});

const n3 = new NotificationCenter("Frontend", "SDE-3");

const n4 = new NotificationCenter("React", () => "Hello");

console.log(n1.message);
console.log(n2.message);
console.log(n3.message);
console.log(n4.message);

console.log(n1 instanceof NotificationCenter);
console.log(n2 instanceof NotificationCenter);
console.log(n3 instanceof NotificationCenter);
console.log(n4 instanceof NotificationCenter);
```

<details>
<summary><strong>Show / Hide Answer</strong></summary>

**Output**

```text
Hello
Overridden
Frontend
undefined
true
false
true
false
```

**Explanation**

| Return value | Behavior with `new` |
|---|---|
| Object | Replaces the newly created instance |
| Function | Replaces the newly created instance because functions are objects |
| String, number, boolean, symbol, bigint | Ignored; the new instance is returned |
| `null` | Ignored; the new instance is returned |
| `undefined` | Ignored; the new instance is returned |

- `n1` receives the newly created instance because `null` is a primitive.
- `n2` receives the explicitly returned object. It has `message: "Overridden"` but does not inherit from `NotificationCenter.prototype`.
- `n3` receives the newly created instance because the string return value is ignored.
- `n4` receives the returned function. Since the function has no `message` property, `n4.message` is `undefined`.

**Important:** Although `typeof null === "object"`, `null` is a primitive for this constructor-return rule.

</details>

---

### 2. Prototype reassignment and `instanceof`

The `instanceof` operator checks whether the constructor's **current `prototype` object** appears in the instance's prototype chain.

```js
function NotificationCenter(message) {
  this.message = message;
}

const n1 = new NotificationCenter("Hello");

NotificationCenter.prototype = {
  getType() {
    return "INFO";
  },
};

const n2 = new NotificationCenter("World");

console.log(n1 instanceof NotificationCenter);
console.log(n2 instanceof NotificationCenter);

console.log(n1.constructor === NotificationCenter);
console.log(n2.constructor === NotificationCenter);
```

<details>
<summary><strong>Show / Hide Answer</strong></summary>

**Output**

```text
false
true
true
false
```

**Explanation**

Initially, `NotificationCenter.prototype` references the original prototype object, Object A.

```text
Before reassignment:

NotificationCenter.prototype ──→ Object A
                                      ↑
                                      |
                                    [[Prototype]]
                                      |
                                    [ n1 ]
```

After reassignment, the constructor points to a new object, Object B. The existing instance `n1` still references Object A.

```text
After reassignment:

NotificationCenter.prototype ──→ Object B
                                  | getType()
                                  |
                                    ↑
                                    |
                                  [[Prototype]]
                                    |
                                  [ n2 ]


Object A
| constructor: NotificationCenter
| (original prototype)
      ↑
      |
    [[Prototype]]
      |
    [ n1 ]
```

**Why each output occurs:**

1. `n1 instanceof NotificationCenter` → `false`  
   `n1` points to Object A, but `instanceof` checks against the current prototype, Object B.

2. `n2 instanceof NotificationCenter` → `true`  
   `n2` was created after reassignment, so it points to Object B.

3. `n1.constructor === NotificationCenter` → `true`  
   `n1` inherits the `constructor` property from Object A, which still references `NotificationCenter`.

4. `n2.constructor === NotificationCenter` → `false`  
   Object B has no own `constructor` property. Lookup reaches `Object.prototype.constructor`, whose value is `Object`.

**Key distinction:** `instanceof` checks the constructor's current prototype against the object's prototype chain. `constructor` is an ordinary inherited property and can give a different result.

</details>

### Interview Takeaways

- An explicitly returned object or function replaces the instance created by `new`.
- Explicitly returned primitives do not replace that instance.
- Reassigning a constructor's `.prototype` affects instances created afterward, not existing instances.
- `instanceof` and `.constructor` use different mechanisms, so their results can differ.
- When replacing a prototype object, restore its `constructor` property if you need it to point back to the original constructor function.

## Constructor Function Inheritance (Without Classes)

### Requirements

Implement inheritance using JavaScript constructor functions and prototypes, without ES6 classes.

1. `NotificationCenter` accepts `message` and `type` and stores them as instance properties.
2. `NotificationCenter.prototype.getDetails()` returns the notification details.
3. `PriorityNotification` inherits from `NotificationCenter` and accepts `message`, `type`, and `priority`.
4. `PriorityNotification.prototype.getPriority()` returns the notification's priority.
5. Instances of `PriorityNotification` must pass both `instanceof PriorityNotification` and `instanceof NotificationCenter`.

### Solution

```javascript
function NotificationCenter(message, type) {
  this.message = message;
  this.type = type;
}

NotificationCenter.prototype.getDetails = function () {
  return `Type: ${this.type}, Message: ${this.message}`;
};

function PriorityNotification(message, type, priority) {
  // Reuse parent constructor to initialize instance properties
  NotificationCenter.call(this, message, type);

  this.priority = priority;
}

// Establish prototype inheritance
PriorityNotification.prototype = Object.create(
  NotificationCenter.prototype
);

// Restore the constructor reference
PriorityNotification.prototype.constructor = PriorityNotification;

// Add child-specific method
PriorityNotification.prototype.getPriority = function () {
  return this.priority;
};

// Usage
const notification = new NotificationCenter("Hello", "INFO");

const priorityNotification = new PriorityNotification(
  "Server is down",
  "ERROR",
  "HIGH"
);

console.log(priorityNotification.getDetails());  // "Type: ERROR, Message: Server is down"

console.log(priorityNotification.getPriority()); // "HIGH"

console.log(priorityNotification instanceof PriorityNotification); // true

console.log(priorityNotification instanceof NotificationCenter); // true

console.log(priorityNotification.constructor === PriorityNotification); // true
```

## Constructor Functions: Private State and `this` Gotchas

### 1. Private state using closures

Variables declared with `let` or `const` inside a constructor are not automatically properties of the instance. Methods created inside the constructor can access them through closures.

```javascript
function Notification(message) {
  this.message = message;

  let isRead = false;

  this.markAsRead = function () {
    isRead = true;
  };

  this.getReadStatus = function () {
    return isRead;
  };
}

const n1 = new Notification("Server down");
const n2 = new Notification("Deployment complete");

n1.markAsRead();

console.log(n1.getReadStatus()); // true
console.log(n2.getReadStatus()); // false

console.log(n1.markAsRead === n2.markAsRead); // false
```

Each instance has its own private `isRead` variable and its own method functions.

**Memory trade-off:** Instance methods created inside a constructor are recreated for every instance. Prototype methods are shared and generally more memory-efficient, but they cannot directly access local variables inside the constructor.

### 2. Prototype methods are shared

```javascript
function Notification(message) {
  this.message = message;
}

Notification.prototype.getMessage = function () {
  return this.message;
};

const n1 = new Notification("Server down");
const n2 = new Notification("Deployment complete");

console.log(n1.getMessage()); // "Server down"
console.log(n2.getMessage()); // "Deployment complete"

console.log(n1.getMessage === n2.getMessage); // true
```

Both instances use the same function through the prototype chain. The value of `this` depends on which instance calls the method.

### 3. The `this` gotcha: Detached methods

```javascript
function Notification(message) {
  this.message = message;
}

Notification.prototype.getMessage = function () {
  return this.message;
};

const n1 = new Notification("Server down");
const n2 = new Notification("Deployment complete");

const getMessage = n1.getMessage;

console.log(n1.getMessage()); // "Server down"
console.log(getMessage()); // undefined in a browser's non-strict environment
console.log(getMessage.call(n2)); // "Deployment complete"
```

- `n1.getMessage()` sets `this` to `n1`.
- `getMessage()` is called without an object receiver, so `this` does not refer to `n1`.
- `getMessage.call(n2)` explicitly sets `this` to `n2`.

**Remember:** `this` depends on how a regular function is called, not where it was defined.

### 4. Passing methods as callbacks

Passing a method directly can lose its original receiver.

```javascript
const notification = new Notification("Server down");

// Incorrect: the callback loses its receiver
setTimeout(notification.getMessage, 100);

// Fix 1: bind this explicitly
setTimeout(notification.getMessage.bind(notification), 100);

// Fix 2: call the method through its object
setTimeout(() => notification.getMessage(), 100);
```

Both fixes preserve access to the notification's message.

- **`.bind(notification)`** returns a new function whose `this` is permanently bound to `notification`.
- **Arrow wrapper** calls the method as `notification.getMessage()`, preserving the object as its receiver.

An arrow function does not automatically bind `this` to `notification`; the method call inside the arrow function is what preserves the receiver.

### 5. Binding a prototype method inside the constructor

```javascript
function Notification(message) {
  this.message = message;
  this.getMessage = this.getMessage.bind(this);
}

Notification.prototype.getMessage = function () {
  return this.message;
};

const n1 = new Notification("Server down");
const n2 = new Notification("Deployment complete");

console.log(n1.getMessage()); // "Server down"
console.log(n1.getMessage === n2.getMessage); // false
console.log(n1.hasOwnProperty("getMessage")); // true
console.log(n1.getMessage === Notification.prototype.getMessage); // false
```

Although the original method is on the prototype, binding it inside the constructor creates a new bound function for each instance and stores it as an own property. This fixes detached-method calls but sacrifices some of the memory efficiency of sharing the method.
