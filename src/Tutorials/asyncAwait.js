// Syntactical sugar for using promises instead of .then()

const getName = async () => {
    return 'MG'
}

console.log(getName())

/*
    *   Async function always returns a promise even though we return a normal value of any datatype.
    *   Returned values other than promises are wrapped in a resolved promise automatically.
*/

async function getFairyName() {
    return 'Your Grace'
}
// ☝️ async getFairyName function is equivalent to 👇 normal getFairyNameEquv function
function getFairyNameEquv() {
    return Promise.resolve('Your Grace')
}

console.log(getFairyName())
console.log(getFairyNameEquv())

/*
    * <--- Accessing values from async() functions --------->

    * since the values returned from async() are promises. So as far as we have learnt,
    *    .then() can be used
*/
getName().then(name => console.log(name, ':->using .then()'))
getFairyName().then(name => console.log(name, ':-> using .then()'));

/*
    *   <-------- AWAIT -------->
    Instead of using traditional way of accessing values from promises i.e using .then()
    We can make use of await in latest ES format
*/
// const res1 = await getName()
// const res2 = await getFairyName()
// console.log(res1, 'using await')
// console.log(res2, 'using await');

//! But wait we got some error. The reason being await can only be used inside async functions()

(async() => {
    const res1 = await getName()
    const res2 = await getFairyName()
    console.log(res1, ':-> using await')
    console.log(res2, ':-> using await');
})();

/*
    ? async/await VS tradition .then()

    * Both are used to access the values from promises. Difference is in the way of execution:

    i> 
        * .then() gets executed when the call stack is empty i.e.(GEC has been popped out) 
        *    and event loop pushes the callback from microtask queue to callstack. The program execution doesn't stop and moves to next line
        *    and at some later pt of time when call stack is empty, it get's executed.
        
        * await literally stops the execution there until the promise is settled i.e. either resolved or rejected. Once, it has got the
        *    result, it assigns it into the storing variable and then moves to the next line.
    
    let's see some example.
*/
(async () => {
    const promise = Promise.resolve('Sharam nhi aati.')

    // Output bata CASE: 1
    promise.then(msg => console.log(msg))
    console.log("2 lakh bhej!")
    console.log('Ticket kara de');

    // Output bata CASE: 2
    console.log(await promise)
    console.log("2 lakh bhej!")
    console.log('Ticket kara de')
})()

    // Note: In short jnha jnha .then() hai wnha await use kar lo bus. Let's try some examples


    fetch('https://demo3926231.mockable.io/bhalodiya/nirali')
        .then(res => res.json())
        .then(res => console.log('Final response in then():', res))
        .catch(err => console.log('Error while using then():', err))
        .finally(() => console.log("End of fetch using then(). Saaf safai karo ab"))

    const response = await fetch('https://demo3926231.mockable.io/bhalodiya/nirali');
    const finalResponse = await response.json();
    console.log('Final response in await:', finalResponse);

    /*
        Par promise mein .catch() aur .finally() bhi toh hota hai error handling aur cleanup ke liye.
        Wo kaise kare async/await mein?

        For this we have try catch and finally block.
        General approach: wrap the code in try catch and finally wherever we are using await so that
            it can handle error if any and code doesn't break.
        
        * <------ try catch finally ------>
    */
    try {
        const response = await fetch('https://demo3926231.mockable.io/bhalodiya/nirali');
        const finalResponse = await response.json();
        console.log('Final response in await & try:', finalResponse);
    } catch (err) {
        console.log('Error while using await: ',err)
    } finally {
        console.log("End of fetch using await. Saaf safai karo ab")
    }

    /*
        Remember getMarriageApproval() analogy. Simplify using async/await. 
        Open src/Tutorials/Asynchronous.js
    */

    // const getMarriageApprovalUsingAwait = async () => {
    //     try {
    //         const bioData = await getGirlDesicion2()
    //         console.log("Got response from girl: yes ", bioData)

    //         // getting family response
    //         const updatedBiodata = await getFamiliesPermission2('yes', bioData)
    //         console.log("Family and girl response now: yes", updatedBiodata)

    //         // Background and property check
    //         const finalizedBiodata = await analyzePropertyAndBackground2(updatedBiodata)
    //         console.log(finalizedBiodata.finalRemarks)
    //     } catch (err) {
    //         console.log("Rejection reason: ", err)
    //     } finally {
    //         console.log("Finally decision ho gya.")
    //     }
    // }
    // getMarriageApprovalUsingAwait()
})()

// Write the o/p. source (Akshay saini)

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
    console.log(ans1, ans2)
}

getAns() // ye bata ki, after how many seconds we will get the consoles

const getAns2= async() => {
    const ans1 = await promise2
    console.log(ans1)
    const ans2 = await promise1
    console.log(ans1, ans2)
}

getAns2() //ye bata ki, after how many seconds we will get the consoles

// <------------Ques------------>

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

fun()
// <-----------------End--------->


// <------------Ques------------>

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
// <-----------------End--------->

// <------------Ques------------>
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
// <-----------------End--------->
