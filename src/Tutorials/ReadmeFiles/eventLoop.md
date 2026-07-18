# Event Loop

## setTimeout and setInterval

```javascript
const cbFn = (person) => {
    console.log("Stop spilling your beauty every where you go, " + person)
}

setTimeout(cbFn, 500, 'Your Grace')
```

**Note:** Here we passed cbFn in setTimeout and not cbFn() as it takes reference of callBackFn and not the result of execution

To keep printing after every 500ms then:

```javascript
setInterval(cbFn, 500, 'Your Grace')
```

- Callback (cbFn) used for handling async activity as it's initiated now but cbFn() is executed after 500ms
- onLoad and DOMContentLoaded and componentDidMount also handles async activity. It gets initiated at start but when respective events are loaded, then the callback is fired.

**Note:** Both **setTimeout** and **setInterval** return a unique timerId which can be used to cancel their execution.

```javascript
const timeoutId = setTimeout(() => console.log('Timeout to run'), 1000)
clearTimeout(timeoutId)

const intervalId = setInterval(() => console.log('Jo hoga dekha jaayega'), 400)
// Ab dekha nhi jaa rha, Bhagwaan. Please stop it
clearInterval(intervalId)
```


## Practice Question 1

**Challenge:** What will be the output of this code?

```javascript
setTimeout(() => {
  console.log("Ruko zara, hum first");
}, -2);
setTimeout(() => {
  console.log("Aur mein?");
}, 200);
setTimeout(() => {
  console.log("Nhi hum first");
}, 0);
setTimeout(() => {
  console.log("Hum first");
});
```

<details>
<summary>Show Answer</summary>

```
Ruko zara, hum first
Nhi hum first
Hum first
Aur mein?
```

**Explanation:** 
- All timeouts with 0ms (or negative/no delay) execute first in order of declaration
- Then timeouts with positive delays execute in order of their delay time

</details>

### General Rules for setTimeout Execution Order:
- With 0 or no delay (equivalent to 0)
- When passed no delay then treated as 0
- When passed negative value then also treated as 0
- With positive delay
    
**Note:** If any delay is of the same number, then the one declared first will be executed first.

### Question 2

What will be the execution order?

```javascript
setTimeout(() => {
    console.log("Let me check my busy schedule")
}, 200)
setTimeout(() => {
    console.log("Ubuyashiki")
}, 0)
setTimeout(()=>{
    console.log("xxxx pe kab chal rhi?")
})
setTimeout(()=>{
    console.log("ye bata")
}, -400)
```

<details>
<summary>Show Answer</summary>

```
Ubuyashiki
xxxx pe kab chal rhi?
ye bata
Let me check my busy schedule
```

**Explanation:** 
- All 0ms delays (including no delay and negative delays) execute first in order of declaration
- Then positive delays execute

</details>
## Call Stack Formation Example

**Challenge:** Explain the call stack formation - how functions are pushed and popped (starts with GEC).

![Call Stack and Event Loop](../../Assests/callStackAndEventLoop.png)
![Event Loop Diagram](../../Assests/EventLoop1.jpeg)

```javascript
setTimeout(() => {
    console.log("Excited for flight!")
}, 200)

const y = () => {
    console.log('y')
}

const x = () => {
    console.log('x')
    y()
}
x()
```

<details>
<summary>Show Answer</summary>

**Call Stack Steps:**
1. First, GEC (Global Execution Context) is pushed into call stack at the beginning of code execution
2. `setTimeout` is encountered, callback is registered but not executed (goes to Web APIs)
3. `x()` is called and pushed to call stack
4. Inside `x()`, `console.log('x')` executes
5. `y()` is called and pushed to call stack
6. Inside `y()`, `console.log('y')` executes
7. `y()` finishes and is popped from call stack
8. `x()` finishes and is popped from call stack
9. After 200ms, setTimeout callback is moved to callback queue
10. Event loop moves it to call stack when stack is empty

**Output:**
```
x
y
Excited for flight! (after 200ms)
```

</details>
> 7.      GEC is popped
> 8.      setTimeout cb is fired

#####     <------ Some examples ------->
1.

    console.log("start")
    setTimeout(() => {
        console.log("Event loop")
    }, 500)
    console.log("end")
    
2.

    console.log("start")
    setTimeout(() => {
        console.log("Event loop")
    })
    fetch('https://instagram/apis/reels')
    .then(res => console.log(res))
    // 1000 of lines of code
    console.log("end")

3. 
```
    var n = 2
    function square(num) {
        var ans = num * num;
        return ans
    }
    var square2 = square(n);
    var square4 = square(4);
```
![Example 3 part 1](../../Assests/execution_context.png)

![Example 3 part 2](../../Assests/execution_context1.png)

![Example 3 part 3](../../Assests/execution_context2.png)

![Example 3 part 4](../../Assests/execution_context3.png)

![Example 3 part 5](../../Assests/execution_context4.png)

**Note:** Microtask queue has got higher priority