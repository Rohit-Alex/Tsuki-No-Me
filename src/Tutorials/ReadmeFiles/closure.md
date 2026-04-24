
1. Function bundled together with reference to its lexical environment.
2. Inner function can access the outer functions variables and parameters. 
3. Closure is created every time a function is created at execution time.
4. Even if this function is executed in some other scope, it still remembers its outer lexical environments where it was originally present in code.

#### I/O -> O/P Questions

1. 
```
    function outer () {
        const Amane = 'hi'
        function inner() {
            console.log(`Log: ${Amane}`)
        }
        inner()
    }
    outer() 
    // Log: hi
```

2. 
```
    function outer () {
        const Amane = 'hi'
        return function inner() {
            console.log(`Log: ${Amane}`)
        }
    }
    const returnedFn = outer()
    returnedFn()

    outer()() // Equivalent to above 2 lines i.e. 29 & 30
    // Log: hi
```

3. 
```
    function outer () {
        let Amane = 'bye'
        function inner() {
            console.log(`Log: Amane ${Amane}`)
        }
        Amane = 'hi again!'
        return inner
    }

    outer()()
   // Log: Amane hi again!
```

4.
```
    function outer () {
        function inner() {
            console.log(`Log: ${Amane}`)
        }
        const Amane = 'hi'
        return inner
    }
    const returnVal = outer()
    returnVal()
    // Log: hi
```

5.
```
function outest() {
    const word1 = 'kya bol rha hai '
    function outer() {
        const word2 = 'kuch samajh nhi aa rha'
        function inner() {
            console.log(`Log: ${word1}, ${word2}. ${word3}`)
        }
        inner()
    }
    outer()
}
const word1 = 'Akshay Saini ka video dekhna hoga!'
const word3 = 'Phir se bata'
outest()
// Log: kya bol rha hai , kuch samajh nhi aa rha. Phir se bata
```

> Explanation: Every function forms a closure with the reference to it's lexical environment.
> Lexical environment comprises of the variables and parameters inside of a function.
> Matlab, sabse pehle function apne scope mein doondhta variable ko, agar nhi milta toh apne upar dekhta means outer function, jab tak wo window level mein na aa jaaye ya usko mil na jaaye. Jo sabse pehle mila, niche se upar aane mein, wo use karega

Interview Question: Print 1,2,3 after 1,2,3 seconds respectively.

> First thing that most would think of using is:
```
for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i) // 3 3 3
    }, i * 1000)
}
```
> However, above code doesn't work. The reason being var is functional scope, and callback function of setTimeout forms a closure with variable 'i' and as it is async, when the callback function is called the variable i has got a value of 3. And as in closure the reference if bound with the function not variable, we see 3.

```
for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i) // 0 1 2
    }, i * 1000)
}
```
> This, works as let has block scoped and in each iteration a fresh variable is made with incremented value.

But, what if interviewer asks to do it using var only?

```
for (var j = 0; j < 3; j++) {
    const print = (x) => {
        setTimeout(() => {
            console.log(x) // 0 1 2
        }, x * 1000)
    }
    print(j)
}
```
##### data hiding and encapsulation using closure


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
   


**A scalable solution for above problem**
```
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
```

##### Memoization using closure
```
const memoizAddition = () => {
    let cache = {};
    return (value) => {
        if (value in cache) {
            console.log("Log: Fetching from cache.");
            return cache[value]; 
        } else {
            console.log("Log: Calculating result.");
            let result = value + 20;
            cache[value] = result;
            return result;
        }
    };
};

const addition = memoizAddition(); // returned function from memoizAddition
console.log(addition(20)); //Log: Calculating result. 40
console.log(addition(20)); //Log: Fetching from cache. 40
```

####    <------ Advantages and disadvantages of Closure ---------->

    <-- Advantage -->
    * Encapsulation & Data privacy: creating a private scope for variables and functions that are not directly accessible from outside the function. 
    * Currying
    * Memoization
    
    <-- Disadvantages -->
    * Function overhead
    * Memory leaks as lexical environment elements are not garbage collected
    * complexity increases


