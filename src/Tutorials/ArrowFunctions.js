/*  
    * 1> New feature introduced in ES6
    * 2> Provides a shorter syntax for defining functions compared to traditional function expressions.
    * 3> If only one parameter is there then no need of paranthesis as well.
    * 4> Can defined a function without the need of "function" keyword.
    * 5> Can return a value without "return" keyword and curly braces. Provided function content is 1 line.
    * 6> Arrow functions have a lexical scoping, which means that they use the value of variables from the enclosing scope where they are defined, 
        not where they are executed.
*/

function normalFun (name) {
    return console.log(`Hello ${name}`)
}

const arrowFun1 = (name) => {
    return console.log(`Hello ${name}`);
}

normalFun('nammoni')
arrowFun1('namooni')

// Now simplify it to one line and show paranthesis removal.
// Don't forget to show how we return an object from arrow function.  


// Pt. 6 example
const a = 10;
const printA = () => {
  console.log(a);
};

const f = () => {
  const a = 20;
  printA();
};

f();





// "this" keyword example
const obj = {
    name: 'Nirali',
    surname: 'Bhalodiya',
    age: 25,
    printName: function() {
        console.log(`My Name: ${this.name} and age: ${this.age}`)
    }
}

obj.printName()

/*
    todo Now print the name after 1 second

    printName: function() {
        setTimeout(function () {
            console.log(`My Name: ${this.name} and age: ${this.age}`)
        })
    }
    ! But this doesn't work. We get undefined.👆

    printName: function() {
        const that = this
        setTimeout(function () {
            console.log(`My Name: ${that.name} and age: ${that.age}`)
        })
    }

    ! The above code works but it can still be simplified. 👆

    printName: function() {

        setTimeout(() => {
            console.log(`My Name: ${this.name} and age: ${this.age}`)
        })
    }
*/