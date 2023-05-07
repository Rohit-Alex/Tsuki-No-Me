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

// Solved using setTimeout: 1st method
const getMarriageApproval = () => {

    // Getting your response
     setTimeout(() => {
        const ladkiKaResponse = 'yes'
         const bioData = {
            name: 'adasf',
            property: 400000,
        }
        console.log("Got response from girl:", ladkiKaResponse, bioData)

        // Getting Your parent response
        setTimeout(() => {
            const familyDecision = 'yes'
            console.log('Family approval:', familyDecision)

            // Ladka background and property check
            setTimeout(() => {    
                const { property } = bioData
                if (property <= 100000) {
                    console.log("Property score: Kuch na hai iske pass!")
                } else if (property <= 500000) {
                    console.log("Property score: Isse acha mil jaayega")
                } else {
                    console.log("Property thodi dekha jaata. Aap bharat laao.")
                }
            }, 3000)

        }, 2000)

    }, 3000)
}
getMarriageApproval()

// 2nd way of doing this. (easier to visualize)
const getGirlDesicion1 = (cb) => {
    setTimeout(() => {
        const yourRes = 'yes'
        if (yourRes === 'yes') {
            const bioData = {
                name: 'adasf',
                property: 400000,
            }
            cb('yes', bioData)
        }
    }, 3000)
}

const getFamiliesPermission1 = (girlResp, bioData,  cb) => {
    setTimeout(() => {
        const familyRes = 'yes'
        if (girlResp === 'yes' && familyRes === 'yes') {
            cb('yes', {...bioData, initialApproval: 'yes' } )
        }
    }, 2000)
}
const analyzePropertyAndBackground = (bioData, cb) => {
    setTimeout(() => {    
        const { property } = bioData
        if (property <= 100000) {
            cb({ ...bioData, finalRemarks: "Property: kuch na hai iske pass!" })
            return 
        } else if (property <= 500000) {
            cb({ ...bioData, finalRemarks: "Property: Isse acha mil jaayega" })
            return
        } else {
            cb({ ...bioData, finalRemarks: "Property thodi dekha jaata. Aap bharat laao." })
            return
        }
    }, 3000)
}

const getMarriageApproval1 = () => {

    // Getting your response
    getGirlDesicion1((ladkiKaResponse, bioData) => {
        console.log("Got response from girl:", ladkiKaResponse, bioData)

        // getting familyDecision
        getFamiliesPermission1(ladkiKaResponse, bioData, (overallRes, updatedBioData) => {
            console.log("Family and girl response now: ",overallRes, updatedBioData )

            // background and property check
            analyzePropertyAndBackground(bioData, (finalizedBioData) => {
                console.log(finalizedBioData.finalRemarks)
            })
        })
    })
}
getMarriageApproval1()

/* 
    Note we have only considered the happy cases here still itna complex ho chuka hai.
    1 ke liye hum kar ke dikhata hai, happy + sad case.
*/

const getGirlDesicionWithResAndErr = (acceptCb, rejectCb) => {
    setTimeout(() => {
        const yourRes = 'yes'
        if (yourRes === 'yes') {
            const bioData = {
                name: 'adasf',
                property: 400000,
            }
            acceptCb('yes', bioData)
        }
        else {
            const reason = {
                actualReason: 'Pasand na hai. Jldi bhaag 😝',
                excuse: 'Caste same nhi, Career dekhna hai, chota hai 🥱'
            }
            rejectCb(reason)
        }
    }, 3000)
}

getGirlDesicionWithResAndErr((res, bioData) => {
    console.log("Tumhara response: ", res)
    console.log("Forwarded biodata: ", bioData)
},(reason) => {
    console.log(reason.excuse)
})
// Ab soch aisa har function ke liye karna ho toh kitna complicated ho jaayega. Samajh rhi hai na.

/*
    * This phenomenon in which we nest multiple callbacks  within a function which are inter-dependent is called a callback hell. 
    * The shape of the resulting code structure resembles a pyramid and hence callback hell is also called the “pyramid of the doom”. 
    * It makes the code very difficult to understand and maintain.
    
    ? Problem with  callback hell
        * i> non-readability and complex structure
        * ii> increase in variable shadowing chances
        * iii> Separate error callback fn needs to be provided for each level
    
    ? Solution to escape callback hell
        * PROMISES
*/

/*
    * Analogy: 
            Jaise you have promised to tell the final judgement to me on 12th June.
            Abhi se 12th June tak wo "pending" hai jo hona baaki hai. Result maan le -> { state: 'pending', result: 'undefined' }
            Par 12th June ko hum log settled ho jaayenge. 2 cheez mein 1 ho sakta hai.

                i> tum uss din apna final verdict batao. You keep your promise.
                    Result iss moment pe -> { state:  'fulfilled', result: joTumBolo } 
                    Ye promise settle ho gya and you kept it i.e. "fulfilled" your promise. 

                                                OR

                ii> koi reason de do ki jaise mera tabiyat kharab hai toh phir baad mein bata dungi (Aise ye mat karna waise)
                    Result iss moment pe -> { state: 'rejected', result: joExcuseHoTumhara }
                    Ye promise settle ho gya and you mocked it i.e. "rejected" your promise.  

            
            Dono mein se ek cheez hoga, either you would keep your promise or tell the reason for not being able to fulfill the promise.

    * Similarly, Promise is an object that may produce a single value either a resolved value or a reason.
    *   ii> This lets asynchronous methods return values like synchronous methods: instead of immediately returning the final value, 
    *       the asynchronous method returns a promise to supply the value at some point in the future.
    
    * A Promise is in one of these states:
    *   pending: initial state, neither fulfilled nor rejected.
    *   fulfilled: meaning that the operation was completed successfully. <--- Settled hai lekin ---->
    *   rejected: meaning that the operation failed. <--- Settled lekin ye bhi hai --->
    
    * Analogy continued:
        Upar jo hua, poora controller tum thi. Tum executor hai. Tum decide kar rhi ki resolve krna ya reject.
        Par tumhara result humko affect karega. 3 scenario hai iska bhi.
           i> agar you kept your promise toh hum kya karenge -> (.then)
           ii> agar you didn't keep your promise toh how would i react (.catch)
           iii> aur fir toh promise rakho ya tod do, hum toh uss din kuch decision lenge hi (.finally)
        
        Try thinking of example of api call in open modal. If api successful then do something, error mein notification, finally modal close.
    Let's see same example using promises.
*/

/*
        ?    <----------  Imp. Points ------->
    * resolve() or reject() accepts a single argument, which can be of any type but not multiple aruguments.
    *    e.g resolve(5,6) => ❌ Wrong  resolve([5,6]) => ✅ correct
    * Each .then(), .catch() and .finally() returns a newly generated promise object, which can optionally be used for chaining
    * you can use multiple .finally() blocks with promises. 
    *       Each .finally() block will be executed in the order they are chained onto the promise.
    * The .finally() block doesn’t receive any value, and anything returned from .finally() 
    *     is not considered in the next .then() block if any so the output from the last .then() is used.
    
    * Best Practices: -> 
        i> .finally() block should be only 1 and should not return anything. just like finally block. 
        ii> These are always executed, regardless of whether an exception was thrown or caught. 
        iii> They are used to clean up resources
    
*/
const girlResponse = new Promise((resolve, reject) => {
    setTimeout(() => {
        const yourResponse = 'yes'
        if (yourResponse === 'yes') {
            resolve('Hamari taraf se haan hai.')
        } else {
            reject('Chale jaa meri najron se door')
        }
    }, 3000)
})

console.log(girlResponse, 'girlResponse')
girlResponse
    .then(res => {
        console.log('Response: ', res)
    })
    .catch(err => {
        console.log('Error: ', err)
    }).finally(() => {
        console.log("Finally i made my decision.")
    })


// Promise chaining without returning from .then()
girlResponse
    .then(res => {
        console.log('Response: ', res)
    }).then(res => {
        console.log(res) // Note: This gives undefined as nothing was returned from above .then()
        console.log("Shaadi karega na")
    })
    .catch(err => {
        console.log('Error: ', err)
    })
    .finally(() => {
        console.log("Finally i made my decision.")
    })

// Promise chaining when returned from .then()
girlResponse
    .then(res => res)
    .then(res => { 
        console.log(res); 
        return `Shaddi karega na?`
    })
    .then(res => { 
        console.log(res); 
        return `Dahej tu dega lekin, theek na.` 
    })
    .then(res => {
        console.log(res); 
        return `Mein ghar ka koi kaam nhi karungi. Soch le`
    })
    .catch(err => {
        console.log('Error: ', err)
    })
    .finally(() => {
        console.log("Finally i made my decision.")
    })

// Now suppose har decision tumhara async hai. Thoda late de rhi tum reply.

girlResponse
    .then(res => res)
    .then(res => {
        console.log(res)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('Shaddi karega na?')
            }, 200)
        })
    })
    .then(res => {
        console.log(res)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(`Dahej tu dega lekin, theek na.`)
            }, 200)
        })
    })
    .then(res => {
        console.log(res)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(`Mein ghar ka koi kaam nhi karungi. Soch le`)
            }, 200)
        })
    })
    .catch(err => {
        console.log('Error: ', err)
    })
    .finally(() => {
        console.log("Finally i made my decision.")
    })

// Now reject above example after 2 successful resolve

// Note: When rejected flow goes to the nearest .cath() block


// Practical Example:

fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  .then(response => response.json())
  .then(githubUser => new Promise((resolve, reject) => { // (*)
    // thode der isko bhi ignore kar deti hu. kya pata ye bhi pyaar mein pad jaaye
    setTimeout(() => {
      resolve(githubUser);
    }, 3000);
  }))
  .then(githubUser => alert(`Finished showing ${githubUser.name}`));

  /*    
    * <---- QUIZ on Promises ------>
    i> https://danlevy.net/javascript-promises-quiz/

    ii>
    const promise = new Promise((res) => res(2));
    
    promise
    .then((v) => {
        console.log(v);
        return v * 2;
    })
    .finally(() => {
        console.log('finally 1');
        return 'finally 1';
    })
    .then((v) => {
        console.log(v);
        return v * 2;
    })
    .finally((v) => {
        console.log('finally 2',v);
        return 'finally 2';
    })
    .then((v) => {
        console.log(v);
    });

  */


/*
    * Now how can we use Promises to escape callback hell?
    * Remember that marraigeApproval analogy? let's try to do so with Promises and handle both acceptance and rejection in each case.
*/

const getGirlDesicion2 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const yourRes = 'yes'
            if (yourRes === 'yes') {
                const bioData = {
                    name: 'adasf',
                    property: 400000,
                }
                resolve(bioData)
            } else {
                reject('Aur kitni baar mana karu.')
            }
        }, 3000)
    })
}

const getFamiliesPermission2 = (girlResp, bioData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const familyRes = 'yes'
            if (girlResp === 'yes' && familyRes === 'yes') {
                resolve({ ...bioData, initialApproval: 'yes' })
            } else {
                reject('Papa nhi maan rhe..')
            }
        }, 2000)
    })
    
}
const analyzePropertyAndBackground2 = (bioData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {    
            const { property } = bioData
            if (property <= 100000) {
                reject({ ...bioData, finalRemarks: "Property: kuch na hai iske pass!" })
            } else if (property <= 500000) {
                resolve({ ...bioData, finalRemarks: "Property: Isse acha mil jaayega" })
            } else {
                resolve({ ...bioData, finalRemarks: "Property thodi dekha jaata. Aap bharat laao." })
            }
        }, 5000)
    })
    
}

const getMarriageApproval2 = () => {
    // Getting your response
    getGirlDesicion2()
        .then(bioData => {
            console.log("Got response from girl: yes ", bioData)
            // getting family response
            return getFamiliesPermission2('yes', bioData)
        })
        .then(updatedBioData => {
            console.log("Family and girl response now: yes")
            // Background and property check
            return analyzePropertyAndBackground2(updatedBioData)
        })
        .then(finalizedBioData => {
            console.log("Final remark: ", finalizedBioData.finalRemarks)
            console.log("Sab maan gye 😊")
        })
        .catch(issue => {
            console.log('Rejection reason: ', issue)
        })
        .finally(() => {
            console.log("Finally decision ho gya.")
        })
}
getMarriageApproval2()

// After learning async/await try to simplify above using that.(src/Tutorials/asyncAwait.js)