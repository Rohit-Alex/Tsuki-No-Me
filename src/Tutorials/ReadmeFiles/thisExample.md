
####    ******RULES******
1. Global context - this refers to window object. In Strict Mode => undefined
2. new keyword binding - refers to the object that is being created.
3. implicit binding - "this" refers to the object that is calling it. It is implied, without doing anything it's just how the language works.
4. explicit binding - using the "call/apply/bind" keyword to change the meaning of "this".
5. SetTimeout (Special Case) - Basically, setTimeout moves the callback function in callback queue(inside event loop) as cb.call(window)
6. arrow functions as methods - An arrow function does not define a 'this' keyword  at all. Instead, it lexically resolves 'this' by searching up the scope chain until it finds a function that defines 'this', and then uses that function's 'this' binding.

An arrow function treats 'this' exactly like any other variable, meaning it will lexically resolve to the 'this' in an enclosing scope.

Even though the object uses curly braces, objects are not scopes.

#### Priority of rules
1. Is the function called by new?
2. Is the function called by call or apply?
Note: bind() effectively uses apply
3. Is the function called on a context object (like object.method())?
4. DEFAULT: global object (except strict mode)

##### I/O -> O/P Questions

1.  
```
    this; // Window {...}
    window; // Window {...}
    this === window; // true
    function a() {
        console.log(this);
    }
    a(); // Window {...} 
```
Note: In Strict mode, we would get undefined

```
var teacher = "Kyle";
function ask(question) {
    console.log(this.teacher,question);
}
function askAgain(question) {
    "use strict";
    console.log(this.teacher,question);
}

ask("What's the non-strict-mode default?");
// Kyle What's the non-strict-mode default?

askAgain("What's the strict-mode default?");
// TypeError
```
2. 
```
    const obj = {
        property: `I'm a property of obj.`,
        method: function () {
            // this refers to the object obj
            console.log(this.property);
        }
    };
    obj.method(); // I'm a property of obj.

    Note. this refers to whatever is on the left of the .(dot) when calling a method
```

3.
```
    var name = "window";
    function whichName() {
        console.log(this.name);
    }
    const obj1 = {
        name: "Obj 1",
        whichName
    };
    const obj2 ={
        name: "Obj 2",
        whichName
    };

    whichName(); // window
    obj1.whichName(); // Obj 1
    obj2.whichName(); // Obj 2
```

4.
```
    const a = function () {
        console.log("a", this);
        const b = function () {
            console.log("b", this);
            const c = {
                hi: function () {
                    console.log("c", this);
                }
            };
            c.hi(); // new obj c called function
        };
        b(); // ran by a window.a()b()
    };
    a(); // called by window
    // a Window {…}
    // b Window {…}
    // c {hi: ƒ}
```
#### SetTimeout Special handling
```
var workshop = {
    teacher: "Kyle",
    ask(question) {
        console.log(this.teacher,question);
    },
};
setTimeout (workshop.ask,10,"Lost this?");
// undefined Lost this?

setTimeout (workshop.ask.bind(workshop),10, "Hard bound this?");
// Kyle Hard bound this?
```

5.
```
    function Person(name, age) {
        this.name = name;
        this.age = age;
        console.log(this);
    }
    const person1 = new Person("person1", 55);
    // this = Person { name: 'person1', age: 55 }
```

6. Implicit binding
```
    const person = {
        name: "person",
        age: 20,
        hi() {
            console.log("hi " + this);
        }
    };
    person.hi();
    // this = person { name: 'person', age: 20, hi(){...} }
```

7.  Explicit binding
```
    let name = "Brittney";
    const person3 = {
        name: "person3",
        age: 50,
        hi: function () {
            console.log("hi " + this.name);
        }.bind(window)
    };
    person3.hi();
    // hi Brittney
```    

8. Arrow functions inside objects

```
var workshop = {
    teacher: "Kyle", 
    ask: (question) => {
        console.log(this.teacher,question);
    },
};
workshop.ask('What happened to 'this'?");
// undefined What happened to 'this'?

workshop.ask.call(workshop,"Still no 'this'?");
// undefined Still no 'this'?
```
Here there are only 2 scopes, one for ask function and one global.
All curly braces are not scopes. 🥹🥹 (I used to this actually, but it's incorrect)

Explaination: So, ask function doesn't have it's own this variable so it takes global scope, so undefined.

```
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
    // this = person4 { name: 'person4', age: 40, hi() {...} }
    // if either function is changed around, it doesn't work
```
Here, 3 scopes are there. One inner(), hi method, and then global scope
inner() as arrow goes to lexical scope i.e. hi method
this in hi method is person4 object since it's called as person4.hi()

9. 
```    
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
    // a {name: "Billy", sing: ƒ}
    // b Window {…}
```

10. 
```
const obj = {
    name: 'Amane',
    surname: 'Ubuyashiki',
    age: 25,
    printName: function() {
        console.log(`My Name: ${this.name} and age: ${this.age}`)
    }
}

obj.printName()
```

#####  Todo:  Now print the name after 1 second

    printName: function() {
        setTimeout(function () {
            console.log(`My Name: ${this.name} and age: ${this.age}`)
        })
    }
But this doesn't work. We get undefined.👆

    printName: function() {
        const that = this
        setTimeout(function () {
            console.log(`My Name: ${that.name} and age: ${that.age}`)
        })
    }

The above code works but it can still be simplified. 👆

    printName: function() {
        setTimeout(() => {
            console.log(`My Name: ${this.name} and age: ${this.age}`)
        })
    }

11.
```
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
    // a {name: "Billy", sing: ƒ}
    // b {name: "Billy", sing: ƒ}
```

12.
```
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
    b.say(); // b {name: 'jay', say()...}
    // b called the function
    c.say(); // function() {console.log(this)}
    // returned a function that gets called later
    c.say()(); // Window {...}
    // c.say() gets the function and the Window runs it
    d.say(); // () => console.log(this)
    // returned the arrow function
    d.say()(); // d {name: 'jay', say()...}
    // arrow function does not rebind this and inherits this from parent
```
https://dev.to/liaowow/take-this-quiz-understand-how-this-works-in-javascript-44dj