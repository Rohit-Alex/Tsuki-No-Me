# Iterators and Generators

## Iterators

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

### Question 1

What will be the output of this generator?

```javascript
function* generateSequence() {
  yield 1;
  yield 2;
  yield 3;
  yield;
}

const gen = generateSequence();
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
```

<details>
<summary>Show Answer</summary>

```
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: false }
{ value: undefined, done: false }
{ value: undefined, done: true }
```

**Explanation:** Each `yield` pauses execution and returns a value. The last `yield` without a value returns `undefined`.

</details>

when called, it doesn’t run its code. Instead it returns a special object, called “generator object”, to manage the execution.

The main method of a generator is next(). When called, it runs the execution until the nearest yield <value> statement (value can be omitted, then it’s undefined). Then the function execution pauses, and the yielded value is returned to the outer code.

The result of next() is always an object with two properties:

value: the yielded value.
done: `true` if the function code has finished, otherwise `false`
---

## Generators are Iterable

Generators can be used with `for...of` loops and spread operator.

### Question 2

What will be the output when iterating over a generator?

```javascript
function* numberGen() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGen();
for(let value of gen) {
  console.log(value);
}
```

<details>
<summary>Show Answer</summary>

```
1
2
3
```

**Explanation:** `for...of` automatically calls `next()` and extracts values until `done` is true. It ignores the final `undefined` value when the generator is done.

</details>

### Question 3

What will be the output when a generator has a `return` statement?

```javascript
function* myGenerator() {
  yield "A";
  yield "B";
  return "Done";
}

const g = myGenerator();
for(const value of g) {
  console.log(value);
}
```

<details>
<summary>Show Answer</summary>

```
A
B
```

**Explanation:** `for...of` ignores the return value. It only iterates over yielded values, not the final returned value.

</details>

### Question 4

What happens if we call `next()` before the loop?

```javascript
function* myGenerator() {
  yield "A";
  yield "B";
  return "Done";
}

const g = myGenerator();
console.log('called using next', g.next());
for(const value of g) {
  console.log(value);
}
```

<details>
<summary>Show Answer</summary>

```
called using next { value: 'A', done: false }
B
```

**Explanation:** The first `next()` call consumes "A", so the loop only gets "B".

</details>

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

## Passing Values into Generators

We can call `generator.next(arg)` with an argument. That argument becomes the result of `yield`.

### Question 5

What will be the output when passing values to a generator?

```javascript
function* greet() {
  const name = yield "What is your name?";
  yield `Hello ${name}`;
}

const g = greet();
console.log(g.next());
console.log(g.next("Rohit"));
```

<details>
<summary>Show Answer</summary>

```
{ value: "What is your name?", done: false }
{ value: "Hello Rohit", done: false }
```

**Explanation:** The first `next()` starts the generator and gets the first yield. The second `next("Rohit")` passes "Rohit" as the result of the first yield, which is assigned to `name`.

</details>

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


## Async/await Simplifies All This

### Question 6

What will be the execution order with async/await?

```javascript
async function createFlow(){
 console.log("Me first")
 const data = await Promise.resolve("HI")
 console.log(data)
}
createFlow()
console.log("Me second")
```

<details>
<summary>Show Answer</summary>

```
Me first
Me second  
HI
```

**Explanation:** The async function starts immediately, pauses at `await`, allows other synchronous code to run, then resumes when the promise resolves.

</details>

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






