# OOP in JavaScript

## The Problem: Repetitive Object Literals

Suppose we want to store details of every groom approaching for marriage. Each groom has the same shape: `name`, `age`, `hobbies`, `height`, `occupation`, `salary`, and methods like `getIntro()`, `getPickupLine()`, `getAfterMarriageSchedule()`.

The naive approach — a separate object literal per groom:

```javascript
const groom1 = {
    name: 'xyz',
    age: 24,
    hobbies: 'Playing games, watching Anime, and music',
    height: "5'10 feet",
    occupation: 'SDE1',
    salary: 2400000,
    getIntro() {
        return `Meet ${this.name}, a ${this.age}-year-old ${this.occupation} who stands tall at ${this.height}.\n I like ${this.hobbies} `
    },
    getPickupLine() {
        return "Do you come with a price tag, 'cause I want to invest in you!"
    },
    getAfterMarriageSchedule() {
        return `Shopping: Once a week. \n Dinner: Twice a week. \n Movie: Twice a month`
    }
}
```

This doesn't scale — every new groom means copy-pasting the same shape and methods again, with only the data changing. That repetition is exactly what constructor functions and classes solve.

**Constructor function vs. classes:**
- Both are a blueprint for creating objects with predefined properties and methods.
- Once you have one, you can instantiate (create) many objects from it, each inheriting the same properties and methods.
- `class` is largely syntactic sugar over the constructor-function pattern — easier to read, with several newer OOP-oriented features layered on top (see below).

**Setup used throughout this file:**

```javascript
const helperObj = {
    xyz: {
        pickupLine: "Do you come with a price tag, 'cause I want to invest in you!",
        afterMarriageSchedule: `Shopping: Once a week. \n Dinner: Twice a week. \n Movie: Twice a month`
    },
    abc: {
        pickupLine: "Are you a plane ticket? Cause you take my breath away!",
        afterMarriageSchedule: `Ticket hum khood karwaa lenge.`
    },
    yenAreEye: {
        pickupLine: "Chalna hai toh chal, warna bahut padi hai line mein!",
        afterMarriageSchedule: "Time pe khaana mil jaayega"
    }
}
```

## Constructor Function

```javascript
function Groom(name, age, hobbies, height, occupation, salary) {
    this.name = name;
    this.age = age;
    this.hobbies = hobbies;
    this.height = height;
    this.occupation = occupation;
    this.salary = salary;
    this.getIntro = function() {
        return `Meet ${this.name}, a ${this.age}-year-old ${this.occupation} who stands tall at ${this.height}.\n I like ${this.hobbies} `
    }
    this.getPickupLine = function() {
        return helperObj[this.name].pickupLine
    }
    this.getAfterMarriageSchedule = function() {
        return helperObj[this.name].afterMarriageSchedule
    }
}
```

## Classes

```javascript
class Groom {
    constructor(name, age, hobbies, height, occupation, salary) {
        this.name = name;
        this.age = age;
        this.hobbies = hobbies;
        this.height = height;
        this.occupation = occupation;
        this.salary = salary;
    }
    getIntro() {
        return `Meet ${this.name}, a ${this.age}-year-old ${this.occupation} who stands tall at ${this.height}.\n I like ${this.hobbies} `
    }
    getPickupLine() {
        return helperObj[this.name].pickupLine
    }
    getAfterMarriageSchedule() {
        return helperObj[this.name].afterMarriageSchedule
    }
}
```

### Question 1

```javascript
const groom3 = new Groom('xyz', 24, 'Playing games, watching Anime, and music', "5'10 feet", 'SDE1', 2400000)
const groom4 = new Groom('abc', 25, 'To be with you', "5'8 feet", 'Businessman', 4000000)

console.log(groom3.getPickupLine())
console.log(groom3.getAfterMarriageSchedule())
console.log(groom4.getPickupLine())
console.log(groom4.getAfterMarriageSchedule())
```

<details>
<summary>Show Answer</summary>

```
Do you come with a price tag, 'cause I want to invest in you!
Shopping: Once a week.
 Dinner: Twice a week.
 Movie: Twice a month
Are you a plane ticket? Cause you take my breath away!
Ticket hum khood karwaa lenge.
```

**Explanation:** `getPickupLine()`/`getAfterMarriageSchedule()` both look up `helperObj[this.name]` — using each instance's own `name` to fetch its matching data dynamically, rather than hardcoding the pickup line per-class.

</details>

## Class Fields vs. Constructor Variables

- **Class fields** are properties declared directly on the class body, outside any method or the constructor — with or without `static`. Despite living on the class body, they end up as **own properties on each individual instance**, not on the shared prototype.
- **Constructor variables** — set via `this.x = ...` inside the constructor — are also per-instance, but they require the constructor to run to be assigned. Class fields are assigned to every instance automatically, even if you add a second constructor overload or forget to reference them in the constructor.

### Question 2

```javascript
class GroomWithField {
    bride = 'Amane'; // class field
    constructor(name) {
        this.name = name;
    }
}

const g1 = new GroomWithField('xyz');
const g2 = new GroomWithField('abc');

g1.bride = 'Modified';
console.log(g1.bride, g2.bride);
console.log(g1.hasOwnProperty('bride'));
```

<details>
<summary>Show Answer</summary>

```
Modified Amane
true
```

**Explanation:** Even though `bride = 'Amane'` is written once, on the class body, each instance gets its **own independent copy** as an own property (`hasOwnProperty('bride')` is `true`) — it is emphatically **not** shared the way a method on the prototype is. Changing `g1.bride` has zero effect on `g2.bride`. (Note: you can't write `const bride = 'Amane'` as a class field — only plain assignment, no `var`/`let`/`const` keyword.)

</details>

## Static Fields and Methods

Once a class field or method is declared `static`, it's no longer associated with instances at all — it's attached directly to the **class itself**.

- Accessing a static field via an instance → `undefined`.
- Calling a static method via an instance → `TypeError: ... is not a function`.

### Question 3

```javascript
class GroomStatic {
    static totalGrooms = 0;

    constructor(name) {
        this.name = name;
        GroomStatic.totalGrooms++;
    }

    static staticMethod() {
        return "OOPs in JS!";
    }
}

new GroomStatic('a');
new GroomStatic('b');

console.log(GroomStatic.totalGrooms);
console.log(GroomStatic.staticMethod());
console.log(new GroomStatic('c').staticMethod());
```

<details>
<summary>Show Answer</summary>

```
2
OOPs in JS!
TypeError: (intermediate value).staticMethod is not a function
```

**Explanation:** `static totalGrooms` is shared class-wide state — every `new GroomStatic(...)` call increments the *same* counter, which is exactly why it's useful for things like "how many instances have been created." `staticMethod()` works when called on the class (`GroomStatic.staticMethod()`), but throws when called on an instance — static members simply don't exist on `GroomStatic.prototype`, so instances never inherit them.

</details>

## Inheritance

A NRI groom has all the same properties as a regular `Groom`, plus `countryVisa` and `getStayPeriod()`.

```javascript
class AdvanceGroom extends Groom {
    constructor(name, age, hobbies, height, occupation, salary, countryVisa) {
        super(name, age, hobbies, height, occupation, salary)
        this.countryVisa = countryVisa
    }
    getStayPeriod() {
        return `${this.countryVisa} return and I can stay a max of 14 days in India`
    }
}
```

### Question 4

```javascript
const nriGroom = new AdvanceGroom('yenAreEye', 29, 'Taadna', "5'8 feet", 'Majdoori', 1500000, 'Germany')

console.log(nriGroom.getIntro())
console.log(nriGroom.getStayPeriod())
console.log(nriGroom instanceof Groom)
console.log(nriGroom instanceof AdvanceGroom)
```

<details>
<summary>Show Answer</summary>

```
Meet yenAreEye, a 29-year-old Majdoori who stands tall at 5'8 feet.
 I like Taadna
Germany return and I can stay a max of 14 days in India
true
true
```

**Explanation:** `extends` sets up the prototype chain so `AdvanceGroom` instances inherit everything `Groom` defines (`getIntro`, `getPickupLine`, ...) *and* have their own additional method (`getStayPeriod`). `super(...)` must be called before `this` can be used in a subclass constructor — it runs the parent constructor to set up the inherited fields. `instanceof` returns `true` for **both** classes, since `AdvanceGroom`'s prototype chain includes `Groom`'s.

</details>

## Method Overriding

A subclass can redefine (override) a method it inherits, and still reach the parent's original version via `super.methodName()`.

### Question 5

```javascript
class Base {
    getIntro() {
        return 'base intro';
    }
}

class Overridden extends Base {
    getIntro() {
        return 'My naam Chomu hai. Overridden intro.';
    }
    getBaseIntro() {
        return super.getIntro();
    }
}

const ov = new Overridden();
console.log(ov.getIntro());
console.log(ov.getBaseIntro());
```

<details>
<summary>Show Answer</summary>

```
My naam Chomu hai. Overridden intro.
base intro
```

**Explanation:** `ov.getIntro()` calls `Overridden`'s own version — it completely shadows `Base`'s method of the same name, the same way an object property shadows one from its prototype. `super.getIntro()` explicitly reaches past the override to call `Base`'s original implementation — useful when you want to *extend* the parent's behavior rather than fully replace it (e.g. `super.getIntro() + ' Extra info.'`).

</details>

## Encapsulation — Private Fields and Methods

Encapsulation is an object's ability to "decide" what it exposes to the outside world and what it keeps internal. In modern JS, this is done with `#` — a genuinely private field or method, not just a naming convention (unlike the older `_prop` convention, which is just a signal to other developers, not actually enforced by the language).

### Question 6

```javascript
class Rectangle {
    #height = 0;
    #width;
    constructor(height, width) {
        this.#height = height;
        this.#width = width;
    }
    getArea() {
        return this.#height * this.#width;
    }
}

const rect = new Rectangle(4, 5);
console.log(rect.getArea());
console.log(rect.height);
console.log(JSON.stringify(rect));
```

<details>
<summary>Show Answer</summary>

```
20
undefined
{}
```

**Explanation:** `getArea()` (defined inside the class) has access to `#height`/`#width` and computes correctly. `rect.height` (no `#`) is `undefined` — that's a genuinely different, non-existent public property; `#height` is not accessible from outside the class body **at all**, not even by name-mangling tricks — attempting `rect.#height` from outside the class is a `SyntaxError`, caught at parse time, not a runtime error. `JSON.stringify(rect)` produces `{}` — private fields are excluded from serialization, reflection (`Object.keys`), and `for...in` entirely.

</details>

### Question 7 — Private Methods Too

`#` works on methods, not just fields — useful for internal helper logic the class needs but shouldn't expose:

```javascript
class BankAccount {
    #balance = 0;

    constructor(owner, initialBalance) {
        this.owner = owner;
        this.#balance = initialBalance;
    }

    #logTransaction(type, amount) {
        console.log(`[${type}] ₹${amount} for ${this.owner}`);
    }

    deposit(amount) {
        this.#balance += amount;
        this.#logTransaction('DEPOSIT', amount);
    }
}

const acc = new BankAccount('Amane', 1000);
acc.deposit(500);
acc.logTransaction('X', 1);
```

<details>
<summary>Show Answer</summary>

```
[DEPOSIT] ₹500 for Amane
TypeError: acc.logTransaction is not a function
```

**Explanation:** `deposit()` (public) can call `#logTransaction()` internally since they're both defined inside the same class. But `acc.logTransaction(...)` from outside fails — the `#` name simply isn't visible there at all, so JS doesn't even see it as "a method that exists but is off-limits"; it just doesn't exist as far as external code is concerned.

</details>

## Getters and Setters

Let you expose a method that's **called like a property** (`obj.prop`, not `obj.prop()`) — useful for computed values, or for adding validation logic to what looks like a plain assignment.

### Question 8

```javascript
class BankAccount {
    #balance = 0;

    constructor(owner, initialBalance) {
        this.owner = owner;
        this.#balance = initialBalance;
    }

    get balance() {
        return `₹${this.#balance}`;
    }

    set balance(amount) {
        if (amount < 0) {
            throw new Error("Balance can't be negative");
        }
        this.#balance = amount;
    }
}

const acc = new BankAccount('Amane', 1000);
console.log(acc.balance);

acc.balance = 2000;
console.log(acc.balance);

acc.balance = -50;
```

<details>
<summary>Show Answer</summary>

```
₹1000
₹2000
Error: Balance can't be negative
```

**Explanation:** `acc.balance` — no parentheses — silently invokes the `get balance()` method, formatting the private `#balance` for display. `acc.balance = 2000` — looks like a plain assignment — actually invokes `set balance(amount)`, which validates before committing the change. This combination (private field + public getter/setter) is the standard way to expose a controlled, validated view of otherwise-private state — the caller never even needs to know `#balance` exists, or that reading/writing `.balance` is running code rather than touching a plain property.

</details>

## Polymorphism

The same method call behaving differently depending on which class's instance it's actually called on.

### Question 9

```javascript
class Shape {
    area() { return 0; }
}
class Circle extends Shape {
    constructor(r) { super(); this.r = r; }
    area() { return Math.PI * this.r ** 2; }
}
class Square extends Shape {
    constructor(s) { super(); this.s = s; }
    area() { return this.s ** 2; }
}

const shapes = [new Circle(2), new Square(3)];
shapes.forEach(s => console.log(s.area().toFixed(2)));
```

<details>
<summary>Show Answer</summary>

```
12.57
9.00
```

**Explanation:** The calling code (`shapes.forEach(s => s.area())`) doesn't know or care whether `s` is a `Circle` or a `Square` — it just calls `.area()` uniformly, and each instance runs *its own* class's implementation. This is polymorphism in practice: one interface (`area()`), many behaviors, decided by the actual runtime type of each object rather than by the code calling it.

</details>

## Abstraction

Representing only the essential features of something, while hiding the implementation details behind them. In practice, this usually means combining everything above: exposing a small, clean public API (regular methods, getters/setters) while keeping the messy internal mechanics `#private`.

> e.g. `acc.deposit(500)` (Question 7) is the abstraction — the caller doesn't need to know it internally calls `#logTransaction()`, or that `#balance` is being mutated directly. They just see "deposit money," not the mechanism behind it. Similarly: we care that we're eating food, not the full digestive-system process happening after it — that detail is "abstracted away" because it isn't relevant to the person eating.
