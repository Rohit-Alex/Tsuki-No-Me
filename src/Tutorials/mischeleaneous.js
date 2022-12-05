// closure

for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i) // 0 1 2
    }, i * 1000)
}

for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i) // 3 3 3
    }, i * 1000)
}


for (var i = 0; i < 3; i++) {
    const print = (x) => {
        setTimeout(() => {
            console.log(x) // 0 1 2
        }, x * 1000)
    }
    print(i)
}



// PROTOTYPE 

const arr1 = ['one', 'two', 'three', 'four']
//adding prototype to the Array prototype
Array.prototype.myFun = function () {
    const ar = this.map(e => e.toUpperCase())
    return ar
}
console.log(arr1.myFun())

// adding prototype to the arr1 array only
arr1.__proto__.myFun = function () {
    return this.includes(3)
}
console.log(arr1.myFun())

// currying

const add = a => b => c => a + b + c

console.log(add(5)(6)(8))

// sum(1)(2)(3)(4)...()

// function sum(a) {
//     return function (b) {
//         if (b) return sum(a+b)
//         return a
//     }
// }


// or using ES6 Arrow functions.

const sum = a => b => b ? sum(a+b) : a
sum(1)(2)(3)(4)()


// data hiding and encapsulation 

function Counter() {
    let count = 0
    this.increment = function () {
        count++
    }
    this.decrement = function () {
        count--
    }
    this.print = function () {
        return count
    }
}

const counter1 = new Counter()
console.log(counter1.increment())
console.log(counter1.increment())
console.log(counter1.increment())
console.log(counter1.print())
console.log(counter1.decrement())
console.log(counter1.decrement())
console.log(counter1.print())

const counter2 = new Counter()
console.log(counter2.increment())
console.log(counter2.increment())
console.log(counter2.print())
console.log(counter2.decrement())
console.log(counter2.decrement())
console.log(counter2.print())


// A minor, but noteworthy feature of includes is that it correctly handles NaN, unlike indexOf:

const arr = [NaN];
alert(arr.indexOf(NaN)); // -1 (wrong, should be 0)
alert(arr.includes(NaN));// true (correct)


let arr = [1, 2];

// create an array from: arr and [3,4]
alert(arr.concat([3, 4])); // 1,2,3,4

// create an array from: arr and [3,4] and [5,6]
alert(arr.concat([3, 4], [5, 6])); // 1,2,3,4,5,6

// create an array from: arr and [3,4], then add values 5 and 6
alert(arr.concat([3, 4], 5, 6)); // 1,2,3,4,5,6


// How to delete an element from the array ?

//     The arrays are objects, so we can try to use delete:

let arr = ["I", "go", "home"];

delete arr[1]; // remove "go"

alert(arr[1]); // undefined

// now arr = ["I",  , "home"];
alert(arr.length); // 3


// different case letters have different codes
alert("Z".codePointAt(0)); // 90
alert("z".codePointAt(0)); // 122
alert("z".codePointAt(0).toString(16)); 

const arr = [1, 2, [4, 5], [[[6, 9]]]]
const flatObj = (arr, result) => {
    arr.map(e => {
        if (typeof e !== 'object') {
            return result.push(e)
        }
        if (Array.isArray(e)) {
            return flatObj(e, result)
        }
    })

    return result
}
const res = []
console.log(flatObj(arr, res))