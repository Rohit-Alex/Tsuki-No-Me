
# Closures

## Definition

A closure is:

1. Function bundled together with reference to its lexical environment.
2. Inner function can access the outer function's variables and parameters.
3. Closure is created every time a function is created at execution time.
4. Even if this function is executed in some other scope, it still remembers its outer lexical environments where it was originally present in code.

## Practice Questions

### Question 1

What will be the output when we call `outer()`?

```javascript
function outer () {
    const Amane = 'hi'
    function inner() {
        console.log(`Log: ${Amane}`)
    }
    inner()
}
outer()
```

<details>
<summary>Show Answer</summary>

```
Log: hi
```

**Explanation:** The inner function has access to the outer function's variable `Amane` due to closure.

</details>

### Question 2

What will be the output when we call the returned function?

```javascript
function outer () {
    const Amane = 'hi'
    return function inner() {
        console.log(`Log: ${Amane}`)
    }
}
const returnedFn = outer()
returnedFn()

// Alternative way:
outer()()
```

<details>
<summary>Show Answer</summary>

```
Log: hi
```

**Explanation:** Even after `outer()` finishes executing, the returned `inner` function still remembers the `Amane` variable from its lexical scope. This is closure in action.

</details>

### Question 3

What will be the output? Notice that `Amane` is modified before returning the function.

```javascript
function outer () {
    let Amane = 'bye'
    function inner() {
        console.log(`Log: Amane ${Amane}`)
    }
    Amane = 'hi again!'
    return inner
}

outer()()
```

<details>
<summary>Show Answer</summary>

```
Log: Amane hi again!
```

**Explanation:** Closures capture variables by reference, not by value. When `inner` is executed, it sees the latest value of `Amane`, which was changed to 'hi again!' before the function was returned.

</details>

### Question 4

What will be the output? Notice that `Amane` is declared after the `inner` function.

```javascript
function outer () {
    function inner() {
        console.log(`Log: ${Amane}`)
    }
    const Amane = 'hi'
    return inner
}
const returnVal = outer()
returnVal()
```

<details>
<summary>Show Answer</summary>

```
Log: hi
```

**Explanation:** Due to hoisting and closure, the `inner` function can access the `Amane` variable even though it was declared after the function definition.

</details>

### Question 5

What will be the output? Pay attention to which `word1` and `word3` are used.

```javascript
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
```

<details>
<summary>Show Answer</summary>

```
Log: kya bol rha hai , kuch samajh nhi aa rha. Phir se bata
```

**Explanation:** 
- Every function forms a closure with the reference to its lexical environment
- Lexical environment comprises of the variables and parameters inside of a function
- The function first searches for the variable in its own scope, if not found then looks in the outer function, until it reaches window level or finds the variable
- `word1`: Found in `outest` function scope
- `word2`: Found in `outer` function scope  
- `word3`: Found in global scope

</details>

## Interview Question: setTimeout with Closures

**Problem:** Print 1, 2, 3 after 1, 2, 3 seconds respectively.

### Approach 1: Common Wrong Attempt

What will be the output of this code?

```javascript
for (var i = 1; i <= 3; i++) {
    setTimeout(() => {
        console.log(i)
    }, i * 1000)
}
```

<details>
<summary>Show Answer</summary>

```
4
4  
4
```

**Why it doesn't work:** 
- `var` is function scoped, so all setTimeout callbacks share the same `i` variable
- By the time the callbacks execute, the loop has finished and `i` is 4
- All callbacks reference the same `i` variable, not separate copies

</details>

### Approach 2: Using `let` instead of `var`

What will be the output of this corrected version?

```javascript
for (let i = 1; i <= 3; i++) {
    setTimeout(() => {
        console.log(i)
    }, i * 1000)
}
```

<details>
<summary>Show Answer</summary>

```
1 (after 1 second)
2 (after 2 seconds)
3 (after 3 seconds)
```

**Why it works:** `let` is block scoped, so in each iteration a fresh variable `i` is created with the current value.

</details>

### Approach 3: Using `var` with Closure (Function Parameter)

**Challenge:** What if interviewer asks to solve it using `var` only?

```javascript
for (var j = 1; j <= 3; j++) {
    const print = (x) => {
        setTimeout(() => {
            console.log(x)
        }, x * 1000)
    }
    print(j)
}
```

<details>
<summary>Show Answer</summary>

```
1 (after 1 second)
2 (after 2 seconds) 
3 (after 3 seconds)
```

**Why it works:** By passing `j` as a parameter `x` to the `print` function, we create a new scope for each iteration where `x` holds the current value of `j`.

</details>
## Data Hiding and Encapsulation using Closure

### Problem with Global Variables

```javascript
let count = 0
function increaseCounter() {
    count++;
}
```

**Issue:** Anyone can modify `count` directly (`count++` or `count = 5`), which breaks encapsulation.

### Solution: Using Closure for Privacy

```javascript
function counter() {
    let count = 0;
    return function incrementCount() {
        count++;
        console.log(count);
    }
}
const counter1 = counter()
counter1()
counter1()

const counter2 = counter()
counter2()
counter2()
```

<details>
<summary>Show Answer</summary>

```
1
2
1
2
```

**Explanation:** 
- Each call to `counter()` creates a new closure with its own `count` variable
- The `count` variable is private and can only be accessed through the returned function
- `counter1` and `counter2` are independent instances

</details>
    
### Scalable Solution: Multiple Methods

**Challenge:** What if we want both `incrementCount()` and `decrementCount()` methods?

```javascript
function counter() {
    let count = 0;

    const incrementCount = () => {
        count++;
        console.log(count);
    };

    const decrementCount = () => {
        count--;
        console.log(count);
    };

    return {
        incrementCount,
        decrementCount
    };
}

const counter1 = counter();
counter1.incrementCount();
counter1.incrementCount();
counter1.decrementCount();

const counter2 = counter();
counter2.incrementCount();
counter2.decrementCount();
```

<details>
<summary>Show Answer</summary>

```
1
2
1
1
0
```

**Explanation:** We return an object with multiple methods, each having access to the same private `count` variable through closure.

</details>
   


### Constructor Function Approach

**Most Scalable Solution:** Using constructor function with closures

```javascript
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

<details>
<summary>Show Answer</summary>

```
3
1
2
0
```

**Explanation:** 
- Each instance created with `new Counter()` has its own private `count` variable
- The methods are attached to each instance and have access to their respective `count` via closure
- This provides true data encapsulation and multiple instances

</details>

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


