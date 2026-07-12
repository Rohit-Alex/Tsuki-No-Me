# Async/Await in JavaScript

## Definition

**Async/await** is syntactical sugar for using promises instead of `.then()`. It makes asynchronous code look and behave more like synchronous code.

## Basic Concepts

### Async Functions

- **Async functions always return a promise** even if you return a normal value
- **Returned values** other than promises are wrapped in a resolved promise automatically

```javascript
async function getFairyName() {
    return 'Your Grace'
}

// Equivalent to:
function getFairyNameEquiv() {
    return Promise.resolve('Your Grace')
}
```

### Await Keyword

- **Can only be used inside async functions**
- **Literally stops execution** until the promise is settled (resolved or rejected)
- **Assigns the resolved value** to the variable and moves to the next line

## Async/Await vs .then()

### Key Differences:

1. **`.then()`**: Gets executed when call stack is empty (microtask queue). Program execution doesn't stop.

2. **`await`**: Literally stops execution until promise is settled, then continues.

## Practice Questions

### Question 1

What will be the output and in what order?

```javascript
(async () => {
    const promise = Promise.resolve('Sharam nhi aati.')
    promise.then(msg => console.log(msg))
    console.log("2 lakh bhej!")
    console.log('Ticket kara de');
})()
```

<details>
<summary>Show Answer</summary>

```
2 lakh bhej!
Ticket kara de
Sharam nhi aati.
```

**Explanation:** The `.then()` callback is added to the microtask queue and executes after the synchronous code completes.

</details>

### Question 2

What will be the output and in what order?

```javascript
(async () => {
    const promise = Promise.resolve('Sharam nhi aati.')
    console.log(await promise)
    console.log("2 lakh bhej!")
    console.log('Ticket kara de')
})()
```

<details>
<summary>Show Answer</summary>

```
Sharam nhi aati.
2 lakh bhej!
Ticket kara de
```

**Explanation:** `await` pauses execution until the promise resolves, then continues sequentially.

</details>

### Question 3

What will be the output and in what order?

```javascript
(async () => {
    const promise = Promise.resolve('Sharam nhi aati.')
    
    promise.then(msg => console.log('.then', msg))
    console.log("2 lakh bhej!")
    console.log('Ticket kara de');
    
    console.log(await promise)
    console.log("2 lakh bhej!")
    console.log('Ticket kara de')
})()
```

<details>
<summary>Show Answer</summary>

```
2 lakh bhej!
Ticket kara de
.then Sharam nhi aati.
Sharam nhi aati.
2 lakh bhej!
Ticket kara de
```

**Explanation:** Synchronous code runs first, then `.then()` from microtask queue, then `await` resumes execution.

</details>

## Error Handling

### Try-Catch-Finally with Async/Await

```javascript
try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
} catch (err) {
    console.log('Error:', err);
} finally {
    console.log("Cleanup code here");
}
```

### Question 4

What will be the output?

```javascript
const promiseObj = new Promise((res, rej) => {
    setTimeout(() => {
        res("resolved after 200ms")
    }, 200)
});

(async () => {
    try {
        const res = await promiseObj
        if (typeof res === 'string') {
            console.log('string', res)
            return
        }
        if (typeof res === 'number') {
            console.log('number', res)
        }
    } catch (err) {
        console.log(err.message)
    } finally {
       console.log('inside finally') 
    }
})();
```

<details>
<summary>Show Answer</summary>

```
string resolved after 200ms
inside finally
```

**Explanation:** The promise resolves with a string, so the first condition executes, then `finally` runs regardless of the return.

</details>

### Question 5

What will be the output?

```javascript
let count = 0;
function foo() {
  try {
    return count;
  } finally {
    count++;
  }
}
console.log(foo());
console.log(count);
```

<details>
<summary>Show Answer</summary>

```
0
1
```

**Explanation:** The `return count` happens first (returns 0), but `finally` still executes and increments count to 1.

</details>

## Timing and Execution Order

### Question 6

After how many seconds will each console.log execute?

```javascript
const promise1 = new Promise((res, rej) => {
    setTimeout(() => {
        res(300)
    }, 3000)
})

const promise2 = new Promise((res, rej) => {
    setTimeout(() => {
        res(500)
    }, 5000)
})

const getAns = async() => {
    const ans1 = await promise1
    console.log(ans1)
    const ans2 = await promise2
    console.log(ans2)
}

getAns()
```

<details>
<summary>Show Answer</summary>

```
300 (after 3 seconds)
500 (after 8 seconds total)
```

**Explanation:** First waits 3 seconds for promise1, then waits another 5 seconds for promise2. Total: 8 seconds for both.

</details>

### Question 7

After how many seconds will each console.log execute?

```javascript
const promise1 = new Promise((res, rej) => {
    setTimeout(() => {
        res(300)
    }, 3000)
})

const promise2 = new Promise((res, rej) => {
    setTimeout(() => {
        res(500)
    }, 5000)
})

const getAns2 = async() => {
    const ans1 = await promise2
    console.log(ans1)
    const ans2 = await promise1
    console.log(ans2)
}

getAns2()
```

<details>
<summary>Show Answer</summary>

```
500 (after 5 seconds)
300 (after 5 seconds total)
```

**Explanation:** Waits 5 seconds for promise2. Meanwhile, promise1 already resolved after 3 seconds, so promise1 resolves immediately when awaited.

</details>

## Advanced Execution Order Questions

### Question 8

What will be the output and order?

```javascript
const myPromise = () => new Promise((res) => setTimeout(() => res(5), 2000))

const fun = async () => {
  console.log('start of fun')
    try {
        const res = await myPromise()
        console.log('after await', res)
    } catch(err) {
        console.log(err)
    } finally {
        console.log('inside finally')
    }
  console.log('end of fun')
}

fun()

const fun2 = () => {
  console.log('start of fun')
  myPromise().then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  }).finally(() => {
    console.log('inside finally')
  })
  console.log('end of fun')
}

fun2()
```

<details>
<summary>Show Answer</summary>

```
start of fun
start of fun
end of fun
after await 5
inside finally
end of fun
5
inside finally
```

**Explanation:** 
- Both functions start immediately and log "start of fun"
- `fun2()` completes synchronously and logs "end of fun" 
- After 2 seconds, promises resolve
- `fun()` (with await) completes its execution
- `fun2()` (with .then()) callbacks execute from microtask queue

</details>

### Question 9

What will be the output and order?

```javascript
const myPromise1 = () => Promise.resolve('I have resolved1!');
const myPromise2 = () => Promise.resolve('I have resolved2!');

function firstFunction() {
  myPromise1().then(res => console.log(res));
  console.log('first');
}

async function secondFunction() {
  console.log(await myPromise2());
  console.log('second');
}

firstFunction();
secondFunction();
```

<details>
<summary>Show Answer</summary>

```
first
I have resolved2!
second
I have resolved1!
```

**Explanation:** 
- `firstFunction()` schedules `.then()` callback and logs 'first' immediately
- `secondFunction()` awaits promise and logs resolved value, then 'second'
- `.then()` callback from `firstFunction()` executes from microtask queue

</details>

### Question 10

What will be the output and order?

```javascript
const myPromise = Promise.resolve(Promise.resolve('Promise'));

function funcOne() {
  setTimeout(() => console.log('Timeout 1!'), 0);
  myPromise.then(res => res).then(res => console.log(`${res} 1!`));
  console.log('Last line 1!');
}

async function funcTwo() {
  const res = await myPromise;
  console.log(`${res} 2!`)
  setTimeout(() => console.log('Timeout 2!'), 0);
  console.log('Last line 2!');
}

funcOne();
funcTwo();
```

<details>
<summary>Show Answer</summary>

```
Last line 1!
Promise 2!
Last line 2!
Promise 1!
Timeout 1!
Timeout 2!
```

**Explanation:** 
- Synchronous code runs first: "Last line 1!"
- `await` in `funcTwo` resolves immediately, continues execution
- Promise chains from `funcOne` execute from microtask queue
- `setTimeout` callbacks execute last from macrotask queue

</details>

### Question 11

What will be the output and order? (`cbFun` is called synchronously from inside `fun`'s `.then`, and both use the **same** `promise5`)

```javascript
const promise5 = new Promise((res, rej) => {
    setTimeout(() => {
        res(5)
    }, 200)
})

const cbFun = () => {
   promise5.then(res => {
        console.log('res 2', res)
    }).catch(err => {
        console.error('error')
    }).finally(() => {
       console.log('in finally child')
    })
}

const fun = () => {
    promise5.then(res => {
        cbFun()
        console.log('res 1', res)
    }).catch(err => {
        console.error('error', err)
    }).finally(() => {
       console.log('in finally parent')
    })
}

fun()
```

<details>
<summary>Show Answer</summary>

```
res 1 5
res 2 5
in finally parent
in finally child
```

**Explanation:**
- `fun`'s `.then` callback runs first (promise5 already resolved), synchronously calling `cbFun()` before logging `res 1 5`
- `cbFun()` registers a new `.then` on the same `promise5`, which queues *after* the microtask that's currently running
- Because both chains hang off the same already-settled `promise5`, `fun`'s chain (`then` → `catch` skip → `finally`) and `cbFun`'s chain interleave one microtask hop at a time, so `res 1 5` and `res 2 5` both resolve before either `finally` fires, and the parent's `finally` (registered first) wins the race to the queue

</details>

### Question 12

What will be the output and order? (Same shape as Question 11, but `fun` and `cbFun` now await **two separate** promises that resolve at the same time)

```javascript
const promise11 = new Promise((res, rej) => {
    setTimeout(() => {
        res(5)
    }, 200)
})

const promise22 = new Promise((res, rej) => {
    setTimeout(() => {
        res(5)
    }, 200)
})

const cbFun = () => {
   promise22.then(res => {
        console.log('res 2', res)
    }).catch(err => {
        console.error('error')
    }).finally(() => {
       console.log('in finally child')
    })
}

const fun = () => {
    promise11.then(res => {
        cbFun()
        console.log('res 1', res)
    }).catch(err => {
        console.error('error', err)
    }).finally(() => {
       console.log('in finally parent')
    })
}

fun()
```

<details>
<summary>Show Answer</summary>

```
res 1 5
in finally parent
res 2 5
in finally child
```

**Explanation:**
- Unlike Question 11, `promise11` and `promise22` are independent promises, so their `.then` → `.catch` → `.finally` chains run as two separate microtask sequences instead of interleaving
- `promise11`'s chain (registered first) fully drains — `res 1 5` then `in finally parent` — before `promise22`'s chain (registered a moment later, from inside `cbFun()`) gets its turn

</details>

## Key Takeaways

1. **Async functions always return promises**
2. **Await pauses execution** until promise settles
3. **Use try-catch-finally** for error handling with async/await
4. **Finally blocks always execute** regardless of return statements
5. **Execution order matters** - understand microtask vs macrotask queues
6. **Sequential awaits** add up timing, parallel execution is faster
7. **Promise.resolve() is immediate** but still goes through microtask queue

## Best Practices

1. **Use async/await over .then()** for readability
2. **Always wrap in try-catch** when using await
3. **Use Promise.all()** for parallel execution when possible
4. **Avoid sequential awaits** when operations are independent
5. **Handle errors appropriately** with proper error boundaries