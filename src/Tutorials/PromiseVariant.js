/*
    * Promise.all
        -> Fulfills when all of the promises fulfills; rejects when any of the promises rejects. (one liner answer)

        -> Takes array of promises
    *   -> Returns a single promise that fulfills (resolve) when all given promises are fulfilled with "array of fulfilled values".
    *   -> It rejects when any of the input's promises rejects, with this first rejection reason.
        e.g. Jaise tumko macbook bhi chahiye tha, >= 7 LPA salary bhi aur Bangalore bhi tabhi tum company join karegi 
             Agar ek bhi fulfill nhi hota tumhara condition toh tum ready nhi thi join karne ke liye
*/

// e.g. 1
const promise1 = Promise.resolve('Bangalore');
const promise2 = 700000;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('macbook pro'), 100);
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values); // ['Bangalore', 700000, 'macbook pro']
});

(async () => {
    const values = await Promise.all([promise1, promise2, promise3])
    console.log(values) // ['Bangalore', 700000, 'macbook pro']
})();

// e.g. 2
(async () => {
    try {
        const values = await Promise.all([24, Promise.resolve('Your grace'), Promise.reject('Ubuyashiki')]);
        console.log(values)
    } catch(err) {
        console.log("Error: ", err) //Error:  Ubuyashiki
    }
})()

/*
    * Promise.allSettled
        ->  Wait until all promises have settled (each may fulfill or reject). (one liner answer)
        -> Takes array of promises
    *   -> Returns a Promise that fulfills after all of the given promises is either fulfilled or rejected, 
            with an "array of objects that each describe the outcome of each promise".
    *   -> No need of .catch() or catch(err) block as every thing is returned along with promise state in final result.
    *      As the returned promise never gets rejected.

        e.g. Jaise humlog, bus job chahiye tha. Koi location ho, laptop de na de, 6 lakh de de kaafi hai. 
             Agar ek do nhi bhi mila toh chalega.
*/

const promise4 = Promise.resolve('Gurgaon');
const promise5 = 600000;
const promise6 = new Promise((resolve, reject) => {
  setTimeout(() => reject('No laptop'), 100);
});
(async () => {
    try {
        const values = await Promise.allSettled([promise4, promise5, promise6])
        console.log(values) /* 
        [
            {
                "status": "fulfilled",
                "value": "Gurgaon"
            },
            {
                "status": "fulfilled",
                "value": 600000
            },
            {
                "status": "rejected",
                "reason": "No laptop"
            }
        ] 
    */
    } catch (err) {
        // never gets to this line
    }
})()

/*
    ? Problem remembering above 2 and getting confused
    * i> allSettled => self explanatory => saara settled phir resolve ho ya reject => sab laake denge hum
    * ii> all => isko sab chahiye, paisa, buddhi, liabilities, ek bhi nhi mila toh nhi milega satifaction 
*/

/*
    * Promise.any
        -> Takes array of promises
        ->  as soon as one of the promises in the given array of promises fulfills, returns a single promise with fulfilled value of that promise.
    *   -> Returns a single Promise that fulfills (resolve) with the "value 1st fulfilled (resolved) promise".
    *   -> rejects when all of the input's promises reject, with an AggregateError containing an array of rejection reasons.

*/

// e.g. 1
const errPromise = Promise.reject('Always fail')
const slowPromise = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, "Done slowly");
});
const quickPromise = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "Done quickly");
});

(async () => {
    try{
        const value = await Promise.any([errPromise, slowPromise, quickPromise])
        console.log(value) // Done quickly
    } catch (err) {
        console.log('Error: ', err)
    }
})();

// e.g. 2
const peedhaPrms = new Promise((resolve, reject) => {
    setTimeout(() => reject('Peeda'), 1000)
});
(async () => {
    try{
        const value = await Promise.any([Promise.reject('Dukh'), Promise.reject('Dard'), peedhaPrms])
        console.log(value) // Error:  AggregateError: All promises were rejected
    } catch (err) {
        console.log('Error: ', err)
    }
})()

/*
    * Promise.race
        -> Wait until any of the promises is fulfilled or rejected.
        -> Takes array of promises
    *   -> Returns a single Promise with the "value 1st settled (resolved / rejected) promise".
        If the returned promise fulfills, it is fulfilled with the value of the first promise in the iterable that fulfilled.
*/

// e.g. 1
const prms1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});
const prms2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

(async () => {
    try{
        const value = await Promise.race([prms1, prms2])
        console.log(value)
    } catch (err) {
        console.log('Error: ', err)
    }
})();

// e.g. 2
const prms3 = new Promise((_resolve, reject) => {
  setTimeout(reject, 100, 'two');
});
const prms4 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'two');
});
(async () => {
    try{
        const value = await Promise.race([prms3, prms4])
        console.log(value)
    } catch (err) {
        console.log('Error: ', err)
    }
})()

// e.g. 3
const prms5 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});
const prms6 = new Promise((_resolve, reject) => {
  setTimeout(reject, 500, 'two');
});
(async () => {
    try{
        const value = await Promise.race([prms5, prms6])
        console.log(value)
    } catch (err) {
        console.log('Error: ', err)
    }
})()

/*
    ? Problem remembering above 2 and getting confused
    * Both gives the first one (Confusing right...)
    
    * i> race => self explanatory => jo pehle khtm ho gya wo aayega result mein (phir resolve ho ya reject)
    * ii> any => mltb koi => koi ladki utha lo => koi bhi ladki un-successful (rejected) waala ko kabhi pick nhi karegi.
    *         => jo pehla successful waala aa jaaye usi ke saath jaayegi
    *         => Agar saara un-successful mil rha toh reason de degi ki sab un-successful tha aur reject kar degi.
    
*/