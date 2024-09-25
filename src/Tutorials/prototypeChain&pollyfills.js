/*
    <-------------- Prototype Inheritance ------------>
    
    * Each and every object has access to a special hidden propery named "[[Prototype]]" that is either reference to another object or null. This chain is called prototype chain.
    ? e.g. When we write arr.length, then length although doesn't exist in array but we are still able to access it. Because length property exists in Array.prototype.

    * When seeking a property, it is first sought/looked in the existing object and if not found then it seeks for it in the prototype chain. 
    * This continues till it reaches the end of prototype chain i.e. null.
    
   
    1> Number --> Number.prototype --> Object.prototype --> null
    2> String --> String.prototype --> Object.prototype --> null
    3> Boolean --> Boolean.prototype --> Object.prototype --> null
    4> Function --> Function.prototype --> Object.prototype --> null
    5> Contructor function / classes:
        e.g. const person = new Person()
        person --> Person.prototype --> Object.prototype --> null
    6> Array -> Array.prototype -> Object.prototype -> null
    7> Object -> Object.prototype -> null
*/
const AmaneLife = {
    fulltime: 'thrill'
};
const rohitLife = {
    fullTime: 'Dukh, dard, peeda'
}

const protoObj = {
    partTime: 'Annoying rohit'
};

console.log(AmaneLife) // See the [[Prototype]] value in browser console
console.log(AmaneLife.partTime) // undefined
AmaneLife.__proto__ = protoObj; // Added protoObj to its Prototype
console.log(AmaneLife) // Now, See the [[Prototype]] value in browser console
console.log(AmaneLife.partTime) // 'Annoying rohit'
/* 
    But now suppose I want to add "partTime" key to rohitLife as well.

    if we write now, 👇 we get undefined as we haven't added to rohitLife Prototype
        rohitLife.partTime 
    
    Toh tu bolegi ki, 👇 line likh de work kar jaayega.
        rohitLife.__proto__ = protoObj; 
    
    Par suppose ab I want this "partTime" property to be available to each and every object. Sabkoi pareshaan karta.
    So, to do this. 👇
*/

// Replace line no. 28 to 30 with
Object.prototype.partTime = 'Annoying Rohit' // Added to Object(as a whole, not to any specific object) Protype.
// Note the difference b/w previous [[Prototype]] property (using __proto__) and now (using Prototype)
console.log(AmaneLife)
console.log(AmaneLife.partTime) // 'Annoying rohit'
console.log(rohitLife.partTime)  // 'Annoying rohit'

/*
    ? <---- Understanding difference b/w __proto__ and Prototype ------->
    i> 
        * __proto__ is generally applied when we need to add to individual array/object/function. 
        * Prototype syntax is used to add to all types of array/object/function
    ii> 
        AmaneLife.__proto__ = protoObj; 
        This ☝️ line is equivalent to obj.age = 24. Relate kar paa rhi na.
        means AmaneLife is now:-> 

            const AmaneLife = {
                fulltime: 'thrill',
                __proto__: {
                    partTime: 'Annoying rohit'
                }
            };
            { fulltime: 'thrill' } -> { partTime: 'Annoying rohit' } ->  Object.prototype -> null
                    ☝️                           ☝️                             ☝️
                Original object              local prototype           Prototype present to each object
        
        
        And now 2nd line:
        Object.prototype.partTime = 'Annoying Rohit'
        This ☝️ line directly adds a new property to existing Object prototype and doesn't create any local prototype.

        * __proto__ can be thought of local prototype.
        * Prototype can be thought of global prototype for its type.
*/

const arr1 = ['one', 'two', 'three', 'four']
//adding prototype to the Array prototype
Array.prototype.myFun = function () {
    const ar = this.map(e => e.toUpperCase())
    return ar
}
console.log(arr1.myFun())

// adding prototype to the arr1 array only
arr1.__proto__.myFun = function () {
    return this.includes(3)
}
console.log(arr1.myFun());

// We can delete properties from objects prototype chain as well.
// e.g. delete arr1.__proto__.myFun

/* 
    <------------- Pollyfills for various Method and adding it in their respective prototype ------------>

    NOTE: Agar kuch samajh mein nhi aaye toh, last mein mera comment padhna. Pehle try kar samajhne ka.
*/

//Map Method
Array.prototype.myMap = function (cb) {
    const newArr = []
    this.forEach((e, index) => {
        newArr.push(cb(e, index, this))
    })
    return newArr
}
console.log([2, 5, 7].myMap((e, idx, ar) => e * 2 + idx + ar[2]))

//Filter method
Array.prototype.myFilter = function (cb) {
    const newArr = []
    this.forEach((e, idx) => {
        if (cb(e, idx, this)) {
            newArr.push(e)
        }
    })
    return newArr
}
console.log([5, 7, 9].myFilter((e, idx) => e % 2 === 0))

//Reduce method
Array.prototype.myReduce = function (cb, initialValue) {
    // initialValue => acc = initialValue
    //                currElement = arr[0] : arr[1]
    //                currIndex = 0 : 1
    let accumulator = initialValue !== undefined ? initialValue : this[0]
    for (let i = initialValue !== undefined ? 0 : 1; i < this.length; i++) {
        accumulator = cb(accumulator, this[i], i, this)
    }
    return accumulator
}

const sum = [1, 5, 7, 2, 9].myReduce((acc, currVal, currIndex, ar) => {
    console.log(acc, currVal, currIndex, ar);
    return acc + currVal;
}, 0);
console.log(sum);

// Flat method

const flatArray = (ip, currLevel, targetLevel) => {
    let op = [];
    const length = ip.length;
    for (let i = 0; i < length; i++) {
        const currEle = ip[i];
        if (typeof currEle === "object" && Array.isArray(currEle)) {
            currLevel++;
            if (targetLevel >= currLevel) {
                op = op.concat(flatArray(currEle, currLevel, targetLevel));
            } else {
                op.push(currEle);
            }
        } else {
            op.push(currEle);
        }
    }
    return op;
};

if (!Array.prototype.flat) {
    Array.prototype.flat = function (depth = 1) {
        const flatten = (arr, depth) => {
            if (depth === 0) return arr;
            let result = [];
            for (let i = 0; i < arr.length; i++) {
                const value = arr[i];
                if (Array.isArray(value)) {
                    result = result.concat(flatten(value, depth - 1));
                } else {
                    result.push(value);
                }
            }
            return result;
        };

        return flatten(this, depth);
    };
}

Array.prototype.myFlat = function (level) {
    const iteratingArr = this;
    return flatArray(iteratingArr, 0, level);
};

//Call Method
Function.prototype.myCall = function (context, ...args) {
    const fun = this
    let randomUniqueKey = Math.random()
    while (context[randomUniqueKey] !== undefined) randomUniqueKey = Math.random()
    context[randomUniqueKey] = fun
    const result = context[randomUniqueKey](...args)
    delete context[randomUniqueKey]
    return result
}

// Apply method
Function.prototype.myApply = function (context, argArr) {
    const fun = this
    let randomUniqueKey = Math.random()
    while (context[randomUniqueKey] !== undefined) randomUniqueKey = Math.random()
    context[randomUniqueKey] = fun
    const result = context[randomUniqueKey](...argArr)
    delete context[randomUniqueKey]
    return result
}

//Bind
Function.prototype.myBind = function (context, ...args) {
    const fun = this
    return function () {
        return fun.apply(context, args)
    }
}

/*
    *  ******Promises****** (Jab promises padh legi toh iska pollyfills dekhna. Theek hai na..)
    ! Fullfils -> resolved
    ? settled -> resolved or rejected. only needs to be fulfilled
    * Prmomise.resolve(prms) used so that if we pass static values/non-promise values then also the code works for us. As, Promise.resolve() returns a promise
    ******* <<<------>>>
*/

/*
    ******* <<<------>>>
    * Promise.All
    ! Fulfills when all of the promises fulfill; rejects when any of the promises rejects.
    ******* <<<------>>>
*/
Promise.prototype.myPromiseAll = promiseArr => {
    return new Promise((res, rej) => {
        let resolvedPromise = 0
        let returnArr = []
        promiseArr.forEach((prms, index) => {
            Promise.resolve(prms).then((val) => {
                returnArr[index] = val
                resolvedPromise += 1
            }).catch((err) => {
                rej(err)
            })
        })
        if (resolvedPromise === promiseArr.length) res(returnArr)
    })
}

/*
    ******* <<<------>>>
    * Promise.allSettled()
    ! Fulfills when all promises settle.
    ******* <<<------>>>
*/
// Check if Promise.allSettled is not defined
if (!Promise.allSettled) {
    Promise.allSettled = function (promises) {
        return new Promise((resolve) => {
            const results = [];
            let completed = 0;

            const checkCompletion = () => {
                if (completed === promises.length) {
                    resolve(results);
                }
            };

            for (let i = 0; i < promises.length; i++) {
                const promise = promises[i];

                Promise.resolve(promise)
                    .then((value) => {
                        results[i] = { status: "fulfilled", value };
                    })
                    .catch((reason) => {
                        results[i] = { status: "rejected", reason };
                    })
                    .finally(() => {
                        completed++;
                        checkCompletion();
                    });
            }

            if (promises.length === 0) {
                resolve(results);
            }
        });
    };
}


/*
    ******* <<<------>>>
    * Promise.race()
    ! Settles when any of the promises settles. In other words, fulfills when any of the promises fulfills; rejects when any of the promises rejects.
    ******* <<<------>>>
*/
Promise.prototype.myRace = function (promiseArr) {
    return new Promise((resolve, reject) => {
        promiseArr.forEach((prms) => {
            Promise.resolve(prms)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    });
};

/*
    ******* <<<------>>>
    * Promise.any()
    ! Fulfills when any of the promises fulfills; rejects when all of the promises reject.
    ******* <<<------>>>
*/
Promise.prototype.myAny = function (promiseArr) {
    return new Promise((resolve, reject) => {
        let rejectedPrms = 0;
        const rejectedPrmsVals = [];
        promiseArr
            .forEach((prms, idx) => {
                Promise.resolve(prms).then((res) => {
                    resolve(res);
                }).catch((err) => {
                    rejectedPrmsVals[idx] = err;
                    rejectedPrms++;
                    if (rejectedPrms === promiseArr.length) reject(new Error("Aggregate"));
                });
            })
    })
}


/*
    Sun, agar kuch na samajh aaye toh tension mat le. 
    Ye playlist ka saara video dekh jaa. Chota chota hai.
    https://youtu.be/nC2vSSdRLKk
*/