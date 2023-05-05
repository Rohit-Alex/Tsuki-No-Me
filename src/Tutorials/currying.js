/*
    <------- Currying -------->
    * Currying in JavaScript transforms a function with multiple arguments into a nested series of functions, each taking a single argument.
    * Currying helps you avoid passing the same variable multiple times, and it helps you create a higher order function.
    * function callable as f(a, b, c) into callable as f(a)(b)(c).


*/

function add(num1, num2) {
    console.log(num1 + num2)
}

function addCurried(num1) {
    return function (num2) {
        console.log(num1 + num2)
    }
}
add(3,7)
addCurried(3)(7);

const addCurriedArrow = num1 => num2 => num1 + num2

console.log(addCurriedArrow(3)(7))

// sum(1)(2)(3)(4)...()

// function sum(a) {
//     return function (b) {
//         if (b) return sum(a+b)
//         return a
//     }
// }

// or using ES6 Arrow functions.

const sum = a => b => b ? sum(a+b) : a
console.log(sum(1)(2)(3)(4)());

/*
    <-------- Pay attention here namooni --------->
    Dhayn de idhar, hum idhar hai
*/
// 1 argument at a time in each call
function curry(f) {
  return function(a) {
    return function(b) {
      return f(a, b);
    };
  };
}

function sum1(a, b) {
  return a + b;
}

const curriedSum1 = curry(sum1);
console.log(curriedSum1(1)(2)); // 3

// any no of arguments can be passed either all or one by one or any combination
function curryAdvanced(func) {
    return function curried(...args1) {
        if (args1.length >= func.length) {
            func.apply(this, args1)
        } else {
            return function(...args2) {
                return curried.apply(this, args1.concat(args2))
            }
        }
    }
}

function product(a, b, c) {
  return a * b * c;
}

let curriedSum = curryAdvanced(product);

console.log(curriedSum(1, 2, 3)); // 6
console.log(curriedSum(1)(2,3)); // 6
console.log(curriedSum(1)(2)(3)); // 6