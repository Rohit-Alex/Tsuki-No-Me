// 1
const cbFn = (person) => {
    console.log("Stop spilling your beauty every where you go, " + person)
}

setTimeout(cbFn, 500, 'Your Grace')

// Note: Here we passed cbFb in setTimeout and not cbFn() as it takes reference of callBackFn and not the result of execution

// Now suppose i am obsessed with you i want it to keep printing after every 500ms then

setInterval(cbFn, 500, 'Your Grace')

// Callback (cbFn) used for handling async activity as it's initiated now but cbFn() is executed after 500ms
// onLoad and DOMContentLoaded and componentDidMount also handles async activity. It gets initiated at start but when respective events are loaded, then the callback is fired.

// * Note: Both setTimeout and setInterval returns a unique timerId which can be used to cancel its execution.

const timeoutId = setTimeout(() => console.log('Timeout to run'), 1000)
clearTimeout(timeoutId)

const intervalId = setInterval(() => console.log('Jo hoga dekha jaayega'), 400)
// Ab dekha nhi jaa rha, Bhagwaan. Please stop it
clearInterval(intervalId)


//2
setTimeout(() => {
  console.log("First");
}, 200);
setTimeout(() => {
  console.log("Hum first");
});
setTimeout(() => {
  console.log("Nhi hum first");
}, 0);
setTimeout(() => {
  console.log("Na na munna, hum first");
}, -2);

// 3
setTimeout(() => {
    console.log("Let me check my busy schedule")
}, 200)
setTimeout(() => {
    console.log("Namooni")
}, 0)
setTimeout(()=>{
    console.log("Date pe kab chal rhi?")
})
setTimeout(()=>{
    console.log("ye bata")
}, -400)

/*
    ? General rule of execution order of setTimeout:
    -> with 0 or no delay (equivalent to 0)
    -> when passed no delay then treated as 0
    -> when passed -ve then also treated as 0
    -> with postive delay
    
    * Note: if any delay is of same number then the one declared first will be executed first

*/
// 4
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
// Explain the call stack formation for e.g 4 i.e. How the functions are pushed and popped. Starts with GEC.

/*
    First of all GEC is pushed into call stack at the begining of code execution.
    Then first x is pushed
    Then y is pushed
    After y is executed and y is popped
    After x is executed
    x is popped
    GEC is popped
    setTimeout cb is fired
*/

/*
    <------ Some examples ------->
*/
console.log("start")
setTimeout(() => {
    console.log("Event loop")
}, 500)
console.log("end")


console.log("start")
setTimeout(() => {
    console.log("Event loop")
})
fetch('https://instagram/apis/reels')
.then(res => console.log(res))
// 1000 of lines of code
console.log("end")

// Note: Microtask queue has got higher priority