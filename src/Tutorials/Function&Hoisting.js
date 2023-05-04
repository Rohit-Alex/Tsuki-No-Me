/*
   process whereby the interpreter moves the declaration of functions & variables to the top of their scope, prior to execution of the code.

   It makes use of the memory allocation phase of global execution context. Variables and functions are allocated in memory even before the execution begins. Hence, due to this variables and functions are accessible even before they are declared.

   Note: only declaration is hoisted and not initialization. Mtlb value store nhi hota memory of during first phase.
   sirf variable ka naam store hota.

   Only var, and normal functions means (function declartion) are hoisted.
   var is assigned a value "undefined" and functions entire code is assigned in memory during allocation phase of global execution context.

   Let and const are also hoisted but they are allocated memory under script as they are block scoped. Hence are not accessible till they are executed i.e initialized a value. This zone is called "temporal dead zone". The gap b/w a variable is assigned a memory till its gets executed and assigned a value is called "temporal dead zone".

   Function expression, arrow functions are treated as normal variables are treated.
   classes are not hoisted.
*/

0.1>
console.log(frndo);
var frndo;
frndo = 'nirali';

0.2>
console.log(frndo);
var frndo = 'nirali';

0.3>
console.log(welcome)
welcome()
function welcome() {
    console.log('Hello world')
}

0.4> 
console.log(frndo)
let frndo = 'nirali'; 

0.5> 
console.log(frndo)
const frndo = 'nirali';

0.6>
console.log(welcome)
welcome()
var welcome = function () {
    console.log('Hello world')
}

0.7>
console.log(welcome)
welcome()
let welcome = function () {
    console.log('Hello world')
}

0.8>
console.log(welcome)
welcome()
const welcome = function () {
    console.log('Hello world')
}

0.8>
console.log(welcome)
welcome()
var welcome = () => {
    console.log('Hello world')
}

0.9>
console.log(welcome)
welcome()
let welcome = () => {
    console.log('Hello world')
}

1.0>
console.log(welcome)
welcome()
const welcome = () => {
    console.log('Hello world')
}
//Hoisting Questions...

2>
var a = 1;
function b() {
    a = 10; return;
    function a() { }
}
b();
console.log(a);

3>
function print() {
  var square1 = number * number
  console.log(square1)

  var number = 50

  var square2 = number * number
  console.log(square2)
}
print()

4>
function foo() {
    function bar() {
        return 3;
    }
    return bar();
    function bar() {
        return 8;
    }
}
console.log(foo());

5>
function parent() {
    var hoisted = "I'm a variable";
    function hoisted() {
        return "I'm a function";
    }
    return hoisted();
}
console.log(parent());


6>
console.log(foo1());
function foo1() {
    var bar = function () {
        return 3;
    };
    return bar();
    var bar = function () {
        return 8;
    };
}

7>
(function () {
    console.log('Original value was: ' + myVar);
    var myVar = 'bar';
    console.log('New value is: ' + myVar);
})();

// Constructor Functions: --->>
// https://www.programiz.com/javascript/constructor-function
    // constructor functions are typically capitalized
    function Elf(name, type, weapon) {
        // not returning anything
        // "constructing" a new elf
        this.name = name;
        this.type = type;
        this.weapon = weapon;
        this.fn = function() {console.log("Hi myself constructor function")}
    }
// to use a constructor function
// the "new" keyword must be used
const dobby = new Elf("Dobby", "house", "cloth");
const legolas = new Elf("Legolas", "high", "bow");
// To add methods we need to add
Elf.prototype.attack = function () {
    // cannot be an arrow function
    // this would be scoped to the window obj
    return `attack with ${this.weapon}`;
};
// This would need to be repeated for each method.
dobby.attack(); // attack with cloth
legolas.attack(); // attack with bow


//Classes

// Definiton --->>>    However, classes in JavaScript
//     are not true classes, they are syntac c sugar.Under the hood, it is still using the old
//     prototype method.They are in fact just "special functions" with one big difference,
//         functions are hoisted and classes are not.You need to declare your class before it can be
//     used in your codebase.Classes also comes with a new method, the constructor that
//     creates and instan ates an object created with class.Classes are able to be extended
//     upon using the extends keyword, allowing subclasses to be created

class Character {
    constructor(name, weapon) {
        this.name = name;
        this.weapon = weapon;
    }
    attack() {
        return `attack with ${this.weapon}`;
    }
}
class Elf extends Character {
    constructor(name, weapon, type) {
        super(name, weapon);
        // pulls in name and weapon from Character
        this.type = type;
    }
}
class Ogre extends Character {
    constructor(name, weapon, color) {
        super(name, weapon);
        this.color = color;
    }
    enrage() {
        return `double attack power`;
    }
}
const legolas = new Elf("Legolas", "high", "bow");
const gruul = new Ogre("Gruul", "club", "gray");
legolas.attack(); // attack with high
gruul.enrage(); // double attack power
gruul.attack(); // attack with club
legolas instanceof Elf; //true
gruul instanceof Ogre; //true

// public declarations
class Rectangle {
    height = 0;
    width;
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
}
// private declarations
class Rectangle {
    #height = 0;
    #width;
    constructor(height, width) {
        this.#height = height;
        this.#width = width;
    }
}