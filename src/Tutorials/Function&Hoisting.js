1> console.log(...[1, 2, 3])

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
legolas.attack(); // attack with bow
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