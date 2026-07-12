
# The "this" Keyword in JavaScript

## Rules for "this" Binding

1. **Global context** - this refers to window object. In Strict Mode => undefined
2. **new keyword binding** - refers to the object that is being created
3. **implicit binding** - "this" refers to the object that is calling it. It is implied, without doing anything it's just how the language works
4. **explicit binding** - using the "call/apply/bind" keyword to change the meaning of "this"
5. **setTimeout (Special Case)** - Basically, setTimeout moves the callback function in callback queue(inside event loop) as cb.call(window)
6. **arrow functions as methods** - An arrow function does not define a 'this' keyword at all. Instead, it lexically resolves 'this' by searching up the scope chain until it finds a function that defines 'this', and then uses that function's 'this' binding

An arrow function treats 'this' exactly like any other variable, meaning it will lexically resolve to the 'this' in an enclosing scope.

**Important:** Even though the object uses curly braces, objects are not scopes.

## Priority of Rules

1. Is the function called by **new**?
2. Is the function called by **call** or **apply**?
   - Note: bind() effectively uses apply
3. Is the function called on a context object (like object.method())?
4. **DEFAULT**: global object (except strict mode)

## Practice Questions

### Question 1: Global Context

What will be the output of this code?

```javascript
this; 
window; 
this === window; 
function a() {
    console.log(this);
}
a(); 
```

<details>
<summary>Show Answer</summary>

```
Window {...}
Window {...}
true
Window {...}
```

**Note:** In Strict mode, we would get `undefined`

</details>

### Question 2: Strict Mode vs Non-Strict Mode

What will be the output of this code?

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

<details>
<summary>Show Answer</summary>

```
Kyle What's the non-strict-mode default?
TypeError
```

**Explanation:** In non-strict mode, `this` refers to the global object (window), but in strict mode, `this` is `undefined` in functions called without a context.

</details>
### Question 3: Implicit Binding

What will be the output when we call `obj.method()`?

```javascript
const obj = {
    property: `I'm a property of obj.`,
    method: function () {
        console.log(this.property);
    }
};
obj.method();
```

<details>
<summary>Show Answer</summary>

```
I'm a property of obj.
```

**Explanation:** `this` refers to whatever is on the left of the dot (.) when calling a method. Here, `this` refers to the `obj` object.

</details>

### Question 4: Multiple Objects with Same Function

What will be the output of each function call?

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

<details>
<summary>Show Answer</summary>

```
window
Obj 1
Obj 2
```

**Explanation:** The value of `this` depends on how the function is called, not where it's defined. When called directly, `this` refers to the global object. When called as a method of an object, `this` refers to that object.

</details>

### Question 5: Nested Functions

What will be the output of each console.log in this nested function example?

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

<details>
<summary>Show Answer</summary>

```
a Window {…}
b Window {…}  
c {hi: ƒ}
```

**Explanation:**
- `a()` is called by window, so `this` in function `a` is the window object
- `b()` is called inside `a` but not as a method of an object, so `this` is still window
- `c.hi()` is called as a method of object `c`, so `this` refers to the object `c`

</details>
## setTimeout Special Case

### Question 6: setTimeout and 'this' Context

What will be the output of these setTimeout calls?

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

<details>
<summary>Show Answer</summary>

```
undefined Lost this?
Kyle Hard bound this?
```

**Explanation:** 
- `setTimeout` calls the function in global context, so `this` becomes `undefined` (or window in non-strict mode)
- Using `.bind()` explicitly sets the context to the `workshop` object

</details>

### Question 7: Constructor Function (new binding)

What will be logged when we create a new Person?

```javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
    console.log(this);
}
const person1 = new Person("person1", 55);
```

<details>
<summary>Show Answer</summary>

```
Person { name: 'person1', age: 55 }
```

**Explanation:** When a function is called with `new`, `this` refers to the newly created object instance.

</details>

### Question 8: Implicit Binding

What will be the output when calling `person.hi()`?

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

<details>
<summary>Show Answer</summary>

```
person { name: 'person', age: 20, hi(){...} }
```

**Explanation:** The method is called on the `person` object, so `this` refers to the `person` object.

</details>

### Question 9: Explicit Binding with .bind()

What will be the output when calling `person3.hi()`?

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

<details>
<summary>Show Answer</summary>

```
hi Brittney
```

**Explanation:** Even though the method is called on `person3`, the `.bind(window)` explicitly binds `this` to the window object, so `this.name` refers to the global `name` variable.

</details>    

### Question 10: Arrow Functions as Object Methods

What will be the output of these arrow function calls?

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

<details>
<summary>Show Answer</summary>

```
undefined What happened to 'this'?
undefined Still no 'this'?
```

**Explanation:** 
- Arrow functions don't have their own `this` - they inherit it from the enclosing scope
- Here there are only 2 scopes: the arrow function scope and the global scope
- Object literals (curly braces) are NOT scopes in JavaScript
- Since the arrow function doesn't have its own `this`, it takes it from the global scope, which is `undefined` in this context
- Even using `.call()` won't change `this` for arrow functions

</details>

### Question 11: Arrow Function Inside Regular Method

What will be the output when calling `person4.hi()`?

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

<details>
<summary>Show Answer</summary>

```
person4 { name: 'person4', age: 40, hi() {...} }
```

**Explanation:** 
- Here there are 3 scopes: `inner()` arrow function, `hi` method, and global scope
- The arrow function `inner()` doesn't have its own `this`, so it looks to the lexical scope (the `hi` method)
- `this` in the `hi` method is the `person4` object since it's called as `person4.hi()`
- Arrow functions inherit `this` from their enclosing scope, which is perfect for this use case

</details>

### Question 12: Regular Function Inside Method

What will be the output when calling `obj.sing()`?

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

<details>
<summary>Show Answer</summary>

```
a {name: "Billy", sing: ƒ}
b Window {…}
```

**Explanation:** 
- `sing()` is called as a method of `obj`, so `this` refers to `obj`
- `anotherFunc()` is called as a regular function (not as a method), so `this` defaults to the global object

</details>

### Question 13: Basic Method Call

What will be the output when calling `obj.printName()`?

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

<details>
<summary>Show Answer</summary>

```
My Name: Amane and age: 25
```

**Explanation:** The method is called on the `obj` object, so `this` refers to `obj`.

</details>

### Question 14: setTimeout Challenge - Three Approaches

**Challenge:** Modify the `printName` method to print the name after 1 second. Try the three approaches below and predict their outputs:

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

<details>
<summary>Show Answer</summary>

**Approach 1:** ❌ Doesn't work
```
My Name: undefined and age: undefined
```
**Reason:** The callback function in setTimeout loses the context of `this`.

**Approach 2:** ✅ Works (Old way)
```
My Name: Amane and age: 25
```
**Reason:** We store `this` in a variable `that` before passing to setTimeout.

**Approach 3:** ✅ Works (Modern way)
```
My Name: Amane and age: 25  
```
**Reason:** Arrow functions inherit `this` from their lexical scope (the `printName` method).

</details>

### Question 15: Arrow Function vs Regular Function Inside Method

Compare the output of this version with Question 12. What's the difference?

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

<details>
<summary>Show Answer</summary>

```
a {name: "Billy", sing: ƒ}
b {name: "Billy", sing: ƒ}
```

**Explanation:** Unlike the regular function in Question 12, the arrow function inherits `this` from its lexical scope (`sing` method), so both console.logs show the same object.

</details>

### Question 16: Function Return Patterns

What will be the output of each function call?

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

<details>
<summary>Show Answer</summary>

```
b {name: 'jay', say()...}
function() {console.log(this)}
Window {...}
() => console.log(this)
d {name: 'jay', say()...}
```

**Explanation:**
- `b.say()`: b called the function directly
- `c.say()`: returned a function that gets called later
- `c.say()()`: c.say() gets the function and the Window runs it
- `d.say()`: returned the arrow function
- `d.say()()`: arrow function does not rebind this and inherits this from parent

**Key Insight:** Arrow functions preserve the `this` context from where they were created, while regular functions get a new `this` context based on how they're called.

</details>

---

## Additional Resources

For more practice: [Take this quiz: Understand how 'this' works in JavaScript](https://dev.to/liaowow/take-this-quiz-understand-how-this-works-in-javascript-44dj)