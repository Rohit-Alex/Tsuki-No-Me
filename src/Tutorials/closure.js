/*
    Function bundled together with reference to its lexical environment.
    Inner function can access the outer functions variables and parameters. 
    Closure is created every time a function is created at execution time.
    Even if this function is executed in some other scope, it still remembers its outer lexical environments where it was originally present in code.
*/

function outer () {
    var nirali = 'hi'
    function inner() {
        console.log(`Inside: ${nirali}`)
    }
    inner()
}
outer()

/*
    function outer () {
        var nirali = 'hi'
        return function inner() {
            console.log(`Inside: ${nirali}`)
        }
    }
    const returnedFn = outer()
    console.log(returnedFn)
    returnedFn()

    outer()() // inplace of above 2 line


    function outer () {
        let nirali = 'bye'
        function inner() {
            console.log(`Inside: Nirali ${nirali}`)
        }
        nirali = 'hi again!'
        return inner
    }

    outer()()
    Due to reference
*/

/*
    function outer () {
        function inner() {
            console.log(`Inside: ${nirali}`)
        }
        const nirali = 'hi'
        return inner
    }
    const returnVal = outer()
    returnVal()
*/
// Now instead of calling it, return the inner function and store in variable

function outest() {
    const word1 = 'kya bol rha hai '
    function outer() {
        const word2 = 'kuch samajh nhi aa rha'
        function inner() {
            console.log(word1 + word2)
        }
        inner()
    }
    outer()
}
const word1 = 'Phir se bata '
outest()

for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i) // 3 3 3
    }, i * 1000)
}

for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i) // 0 1 2
    }, i * 1000)
}

for (var j = 0; j < 3; j++) {
    const print = (x) => {
        setTimeout(() => {
            console.log(x) // 0 1 2
        }, x * 1000)
    }
    print(j)
}

// data hiding and encapsulation 

/*
    let count = 0
    function increaseCounter() {
        count++;
    }

    Now we can increase count by calling increaseCount() but anyone else can also do so by directly changing it to count++ or count = 5

    To hide this variable and also allow it to change through method, we can form closure

    function counter() {
        let count = 0;
        return function incrementCount() {
            count++;
        }
    }
    const counter1 = counter()
    counter1()
    counter1()

    const counter2 = counter()
    counter2()
    counter2()

    Now no one can access count directly and is hidden from other part of code.
    
    Now suppose we want to make a decrementCount() as well then is this above method scalable.

    It's not scalable but we can change the existing code to this for this implementation.

    function counter() {
        let count = 0;

        const incrementCount = () => {
            count++;
        };

        const decrementCount = () => {
            count--;
        };

        return {
            incrementCount,
            decrementCount
        };
    }

    const counter1 = counter();
    counter1.incrementCount();
    counter1.incrementCount();

    const counter2 = counter();
    counter2.incrementCount();
    counter2.incrementCount();
   
*/

// A scalable solution for above problem
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
counter1.increment()
counter1.increment()
counter1.increment()
console.log(counter1.print())
counter1.decrement()
counter1.decrement()
console.log(counter1.print())

const counter2 = new Counter()
counter2.increment()
counter2.increment()
console.log(counter2.print())
counter2.decrement()
counter2.decrement()
console.log(counter2.print())

// Memoization
const memoizAddition = () => {
    let cache = {};
    return (value) => {
        if (value in cache) {
            console.log("Fetching from cache");
            return cache[value]; // Here, cache.value cannot be used as property name starts with the number which is not a valid JavaScript  identifier. Hence, can only be accessed using the square bracket notation.
        } else {
            console.log("Calculating result");
            let result = value + 20;
            cache[value] = result;
            return result;
        }
    };
};
// returned function from memoizAddition
const addition = memoizAddition();
console.log(addition(20)); //output: 40 calculated
console.log(addition(20)); //output: 40 cached

// A minor, but noteworthy feature of includes is that it correctly handles NaN, unlike indexOf:
(function() {
    const arr = [NaN];
    console.log(arr.indexOf(NaN)); // -1 (wrong, should be 0)
    console.log(arr.includes(NaN));// true (correct)
})();

(function () {
    let arr = [1, 2];
    console.log(arr.concat([3, 4])); // 1,2,3,4
    console.log(arr.concat([3, 4], [5, 6])); // 1,2,3,4,5,6
    console.log(arr.concat([3, 4], 5, 6)); // 1,2,3,4,5,6

    arr = ["I", "go", "home"];
    delete arr[1]; // remove "go"
    console.log(arr[1]); // undefined
    // now arr = ["I",  , "home"];
    console.log(arr.length); // 3
})()

// different case letters have different codes
console.log("Z".codePointAt(0)); // 90
console.log("z".codePointAt(0)); // 122
console.log("z".codePointAt(0).toString(16)); 

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