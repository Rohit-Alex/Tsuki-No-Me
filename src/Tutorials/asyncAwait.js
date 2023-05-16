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

    /* 
        Output bata CASE: 3:

        const promise = Promise.resolve('Sharam nhi aati.')
        promise.then(msg => console.log(msg))
        console.log("2 lakh bhej!")
        console.log('Ticket kara de');

        (async() => {
        console.log(await promise)
        console.log("2 lakh bhej!")
        console.log('Ticket kara de')
        })()
    */

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