
# Currying

## Definition

- Currying in JavaScript transforms a function with multiple arguments into a nested series of functions, each taking a single argument.
- Currying helps you avoid passing the same variable multiple times, and it helps you create a higher order function.
- Function callable as *f(a, b, c)* into callable as *f(a)(b)(c)*.

## Basic Example

```javascript
function add(num1, num2) {
    console.log(num1 + num2)
}

function addCurried(num1) {
    return function (num2) {
        console.log(num1 + num2)
    }
}
add(3,7)
addCurried(3)(7); // same as above
```

### In Arrow Functions

```javascript
const addCurriedArrow = num1 => num2 => num1 + num2
console.log(addCurriedArrow(3)(7))
```

<details>
<summary>Show Answer</summary>

```
10
```

</details>
## Interview Question: Infinite Currying

**Challenge:** Implement a function which takes n arguments and returns the sum. Something like `sum(1)(2)(3)(4)...()`

<details>
<summary>Show Answer</summary>

**Solution 1: Regular Function**
```javascript
function sum(a) {
    return function (b) {
        if (b) return sum(a+b)
        return a
    }
}
```

**Solution 2: ES6 Arrow Functions**
```javascript
const sum = a => b => b ? sum(a+b) : a
console.log(sum(1)(2)(3)(4)());
```

**Output:**
```
10
```

**Explanation:** The function keeps returning itself with accumulated sum until no argument is passed.

</details>


## Basic Curry Function

**Challenge:** Create a curry function that takes 1 argument at a time in each call.

```javascript
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
console.log(curriedSum1(1)(2));
```

<details>
<summary>Show Answer</summary>

```
3
```

**Explanation:** The curry function transforms a regular function into a curried version that accepts one argument at a time.

</details>

<-----------------Start---------------------->

**Task:** Make a function which takes any no of arguments i.e. all or one by one or any combination of arguments can be passed to it.

```
const curryAdvanced = (func) => {
    return function curry(...args) {
        if (args.length === func.length) {
            return func(...args)
        } else {
            return (...args2) => {
                return curry(...(args.concat(args2)))
            }
        }
    }
}

const curryAdvanced = (func) => {
    const curried = (...args1) => {
        if (args1.length >= func.length) {
            return func.apply(this, args1);
        } else {
            return (...args2) => curried.apply(this, args1.concat(args2));
        }
    };
    return curried;
}

function product(a, b, c) {
  return a * b * c;
}

let curriedSum = curryAdvanced(product);

console.log(curriedSum(1, 2, 3));
console.log(curriedSum(1)(2,3));
console.log(curriedSum(1)(2)(3));
```

<details>
<summary>Show Answer</summary>

```
6
6
6
```

**Explanation:** The advanced curry function can handle any combination of arguments until it receives enough parameters to call the original function.

</details>
<-----------------End---------------------->



<-----------------Start---------------------->

function curryOp(...args) {
    return function curried(...nextArgs) {
        if (nextArgs.length === 0) {
            return args.reduce((acc, num) => acc + num, 0);
        }
        args = [...args, ...nextArgs];
        return curried;
    }
}


console.log(curryOp(10)(11)(1, 2, 34)(12)()); // Output: 70

<-----------------End---------------------->

<----------------Start--------------------->
function curryOp(...args) {
    function curried(...newArgs) {
        args = [...args, ...newArgs];
        return curried;
    }
    curried.toString = () => args.reduce((acc, num) => acc + num, 0);
    return curried;
}

// Example usage:
console.log(+curryOp(10)(11)(1, 2, 34)(12)); // Output: 70

<-----------------End---------------------->
