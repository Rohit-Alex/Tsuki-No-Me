```
const cbFn = (person) => {
    console.log("Stop spilling your beauty every where you go, " + person)
}

setTimeout(cbFn, 500, 'Your Grace')
```
**Note:** Here we passed cbFb in setTimeout and not cbFn() as it takes reference of callBackFn and not the result of execution

To keep printing after every 500ms then

    setInterval(cbFn, 500, 'Your Grace')

- Callback (cbFn) used for handling async activity as it's initiated now but cbFn() is executed after 500ms
- onLoad and DOMContentLoaded and componentDidMount also handles async activity. It gets initiated at start but when respective events are loaded, then the callback is fired.

**Note:** Both *<u>setTimeout</u>* and *<u>setInterval</u>* returns a unique timerId which can be used to cancel its execution.

    const timeoutId = setTimeout(() => console.log('Timeout to run'), 1000)
    clearTimeout(timeoutId)

    const intervalId = setInterval(() => console.log('Jo hoga dekha jaayega'), 400)
    // Ab dekha nhi jaa rha, Bhagwaan. Please stop it
    clearInterval(intervalId)


> 1. Chal output bata iska 
```
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

// Ruko zara, hum first
// Nhi hum first
// Hum first
// Aur mein?
```

##### General rule of execution order of setTimeout:
- with 0 or no delay (equivalent to 0)
- when passed no delay then treated as 0
- when passed -ve then also treated as 0
- with postive delay
    
* **Note:** if any delay is of same number then the one declared first will be executed first


>2. *Iska bata answer ab...*
```
setTimeout(() => {
    console.log("Let me check my busy schedule")
}, 200)
setTimeout(() => {
    console.log("Namooni")
}, 0)
setTimeout(()=>{
    console.log("xxxx pe kab chal rhi?")
})
setTimeout(()=>{
    console.log("ye bata")
}, -400)
```
##### Explain the call stack formation for e.g 4 i.e. How the functions are pushed and popped. Starts with GEC.
![GEC](/src/Assests/callStackAndEventLoop.png)
![GEC Akshay saini](/src/Assests/EventLoop1.jpeg)
```
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
Answer: 
> 1.      First of all GEC is pushed into call stack at the begining of code execution.
> 2.      Then first x is pushed
> 3.      Then y is pushed
> 4.      After y is executed and y is popped
> 5.      After x is executed
> 6.      x is popped
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
![Example 3 part 1](https://github.com/Rohit-Alex/Tsuki-No-Me/blob/master/src/Assests/execution_context.png)

![Example 3 part 2](https://github.com/Rohit-Alex/Tsuki-No-Me/blob/master/src/Assests/execution_context1.png)

![Example 3 part 3](https://github.com/Rohit-Alex/Tsuki-No-Me/blob/master/src/Assests/execution_context2.png)

![Example 3 part 4](https://github.com/Rohit-Alex/Tsuki-No-Me/blob/master/src/Assests/execution_context3.png)

![Example 3 part 5](https://github.com/Rohit-Alex/Tsuki-No-Me/blob/master/src/Assests/execution_context4.png)

**Note:** Microtask queue has got higher priority