/*
    Since, JS is a single threaded and synchronous language. If a piece of code takes 3 seconds to execute
    then as long as this line is executed, the execution won't go to next line. This will increase the wait 
    time and block the main thread.

    We should never block the main thread. We can make that particular code asynchronous, i.e 
    * Gets initiated at that moment but gets executed at some later point when call stack is empty.

    Some common examples are:
        * window.onLoad() => when js scripts are loaded.

    Now suppose a piece of code is dependent on the result returned from asynchronous code declared just above it, then 
    now if we use it then we would be getting undefined as it has not been executed yet. So, we want to execute this current line only
    after we received a result or above async code is executed.
*/

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

/*
    Now think of the procedure of love marriage
        -> girl's approval
        -> families approval
        -> background check
*/
// Issue in synchronous code.
const getGirlDesicion = () => {
    setTimeout(() => {
        return 'Yes'
    }, 2000)
}
const getFamiliesPermission = () => {
    setTimeout(() => {
        return 'No'
    }, 500)
}
const girlDecision = getGirlDesicion()
console.log(girlDecision)
if (girlDecision) {
    const familyDecision = getFamiliesPermission()
}

// Solved using setTimeout
const getMarriageApproval = () => {
    // Getting your response
     setTimeout(() => {
        const ladkiKaResponse = 'yes'
        console.log("Got response from girl:", ladkiKaResponse)
        // Getting Your parent response
        setTimeout((response) => {
            const bioData = {
                name: 'adasf',
                property: 400000,
            }
            const familyDecision = 'yes'
            console.log('Family approval:', familyDecision)
            // Ladka background and property check
            setTimeout((sourceData) => {    
                const { property } = sourceData
                console.log("Girl decision:", response, " Family Decision: ", familyDecision)
                if (property <= 100000) {
                    console.log("Property score: Kuch na hai iske pass!")
                } else if (property <= 500000) {
                    console.log("Property score: Isse acha mil jaayega")
                } else {
                    console.log("Property score: Baarat leke aao abhi.")
                }
            }, 5000, bioData)
        }, 2000, ladkiKaResponse)
    }, 3000)
}
getMarriageApproval()