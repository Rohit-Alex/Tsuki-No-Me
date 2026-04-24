##### Iterators

We regularly have lists or collections or data where we want to grab each element one by one

```
const numbers = [4,5,6]
for (let i = 0; i < numbers.length; i++){
 console.log(numbers[i])
} 
```

Now suppose we want to access each element, perform some actions without using loops.

**Using closure**

```
function createFunction(array){
 let i = 0
 function inner(){
 const element = array[i]
 i++
 return element
 }
 return inner
}
const returnNextElement = createFunction([4,5,6])
const element1 = returnNextElement()
const element2 = returnNextElement()
```

---
> **Note:** JavaScript’s built in iterators are actually objects with a next method that when called
> returns the next element from the ‘stream’, so let’s restructure slightly

An iterator is an object with a 'next' method that, when called, returns an object containing a 'value' and a 'done' property. The 'value' is the current element, and 'done' indicates whether the iteration is complete.

```
function createFlow(array){
    let i = 0
    const inner = {
        next : function() {
            const element = array[i]
            i++
            return element
        }
    }
    return inner
}
const returnNextElement = createFlow([4,5,6])
const element1 = returnNextElement.next()
const element2 = returnNextElement.next()
```

**Generator Fn**: A special type of function that creates a flow of data, returns a generator object with a next method, and allows dynamic control over data generation by using the 'yield' keyword to suspend and resume function execution.

The 'yield' keyword suspends the execution context of a function, returns a value, and allows the function to be resumed later, preserving its local state and position in the code.

A generator object has a 'next' method that can be called repeatedly to generate values, allows passing values back into the function, and maintains the function's execution context between calls.

Regular functions return only one, single value (or nothing).

Generators can return (“yield”) multiple values, one after another, on-demand. They work great with iterables, allowing to create data streams with ease.

_Why generators exist_
**Normally, a function:**  starts, runs fully, returns once,finishes
**A generator can:** start ,pause at yield, resume from the same place later ,produce multiple values over time
So generators exist to support lazy value generation and step-by-step execution.

_Special syntax_ `function*`

```
function* generateSequence() {
  yield 1;
  yield 2;
  yield 3;
  yield;
}

const gen = generateSequence();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

when called, it doesn’t run its code. Instead it returns a special object, called “generator object”, to manage the execution.

The main method of a generator is next(). When called, it runs the execution until the nearest yield <value> statement (value can be omitted, then it’s undefined). Then the function execution pauses, and the yielded value is returned to the outer code.

The result of next() is always an object with two properties:

value: the yielded value.
done: `true` if the function code has finished, otherwise `false`
---

##### Generators are iterable (can use for of and spread)

```
for(let value of gen) {
  console.log(value); // 1, then 2, then 3, then undefined
}
```

```
function* myGenerator() {
  yield "A";
  yield "B";
  return "Done";
}

const g = myGenerator();

for(const value of g) {
  console.log(value); // A, then B
}
```
**Note:** 
- It doesn't have `Done`, it ignores the value when  `done: true`
- If we call `g.next()` prior to _for of_ loop then one yield is covered and we get only B in loop

>   console.log('called using next', g.next()) // called using next { value: 'A', done: false }
>    for(const value of g) {
>       console.log(value); //  B
>     }

```
function* generateSequence() {
  yield 1;
  yield 2;
  yield 3;
}

let generator = generateSequence();

for(let value of generator) {
  console.log(value); // 1, then 2, then 3
}

console.log([0, ...generateSequence()]); // 0, 1, 2, 3
```

---
##### yield vs return

1. yield pauses and gives a value
2. return ends the generator completely

```
function* demo() {
  yield 10;
  return 20;
  yield 30; // never reached
}
```

##### Passing values into generators

we should call `generator.next(arg)` with an argument. That argument becomes the result of yield.

```
function* greet() {
  const name = yield "What is your name?";
  yield `Hello ${name}`;
}

const g = greet();

console.log(g.next());        // { value: "What is your name?", done: false }
console.log(g.next("Rohit")); // { value: "Hello Rohit", done: false }
```

##### usecase of generator functions

- values are large or infinite
- we do not want to create everything upfront
- we want lazy computation

```
function* infiniteNumbers() {
  let i = 1;
  while (true) {
    yield i++;
  }
}
```

---

##### Generator methods

The iterator returned by a generator has:

- .next()
- .return()
- .throw()

**generator.return** : finishes the generator execution and return the given value

```
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

const g = gen();

g.next();                // { value: 1, done: false }
g.return('Stop now');    // { value: "Stop now", done: true }
g.next();                // { value: undefined, done: true }
```
_Note_: If we again use generator.return() in a completed generator, it will return that value again

**.throw()** : Throws an error inside the generator.

To pass an error into a yield, we should call generator.throw(err). In that case, the err is thrown in the line with that yield.

```
function* gen() {
  try {
    yield 1;
    alert("Never reached here, went to catch")
  } catch (e) {
    console.log("caught", e);
  }
}

const g = gen();
console.log(g.next());    // { value: 1, done: false }
g.throw("error");         // caught error
```

###### yield*
yield* delegates to another iterable or generator

```
function* a() {
  yield 1;
  yield 2;
}

function* b() {
  yield* a();
  yield 3;
}

console.log([...b()]); // [1, 2, 3]
```

##### Data fetching using yield

```
function doWhenDataReceived (value){
 returnNextElement.next(value)
}
function* createFlow(){
 console.log('inside gen')
 const data = yield Promise.resolve("hi")
 console.log(data)
}

const returnNextElement = createFlow()
console.log('1')
const futureData = returnNextElement.next()
console.log('11')
futureData.value.then(doWhenDataReceived)
console.log('2')
```

We get to control when we return back to createFlow and continue
executing - by setting up the trigger to do so
(returnNextElement.next()) to be run by our function that
was triggered by the promise resolution (when the value returned)


#### Async/await simplifies all this

```
async function createFlow(){
 console.log("Me first")
 const data = await fetch('https://twitter.com/will/tweets/1')
 console.log(data)
}
createFlow()
console.log("Me second")
```

> **Note**: No need for a triggered function on the promise
> resolution, instead we auto trigger the resumption of the createFlow execution 

##### What happens when an async function encounters an await expression?

When an async function encounters an await expression, it exits the function's execution context, allows other code to run, and automatically resumes when the promise resolves, storing the resolved value in the designated variable

- async function starts running immediately.
- await pauses the function.
- The rest of the function is scheduled as a microtask.
- Current synchronous code continues first.
- After sync code finishes, microtasks run.

##### Step-by-step with call stack

1. Global code starts running.
  - JS code
    ```
    createFlow()
    console.log("Me second")
    ```

  - Call Stack
    ```
    Global
    ```

2. createFlow() is called.
  - Call stack:
    ```
    createFlow
    Global
    ```
  
  - Inside createFlow: `console.log("Me first")`

  - Output : `Me first`


3. Now JS sees:
   ```
   const data = await Promise.resolve("HI")
   ```

   First, Promise.resolve("HI")
   But await does not continue immediately.

  What await does:

  - pauses createFlow
  - exits the function for now
  - schedules the remaining part of the function to resume later
  - The remaining part is roughly: `console.log(data)`
  - This continuation is placed in the microtask queue.

So now:

  - createFlow is paused
  - control returns back to global code

Call stack becomes:
    Global

Microtask queue has something like: resume createFlow with value "HI"

4. Global code continues: `console.log("Me second")`
  - output now becomes:
    ```
    Me first
    Me second
    ```

5. Synchronous global code is finished. Now event loop checks microtasks. The queued continuation of createFlow runs.
   ```
    data = "HI"
    console.log(data)
    ```
  
  Final output:
  ```
  Me first
  Me second
  HI
  ```






