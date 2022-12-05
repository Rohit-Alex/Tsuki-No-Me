/*
    This files contains the polyfill for various methods
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
Array.prototype.myFilter = function(cb) {
    const newArr = []
    this.forEach((e,idx)=>{
        if (cb(e,idx, this)) {
            newArr.push(e)
        }
    })
    return newArr
}
console.log([5,7,9].myFilter((e,idx)=> e % 2 === 0))

//Reduce method
Array.prototype.myReduce = function(cb, initialValue) {
    // initialValue => acc = initialValue
    //                currIndex = 0 : 1
    //                currElement = arr[0] : arr[1]
    //                iteration = element.length
    let accumulator = initialValue !== undefined ? initialValue : this[0]
    for(let i = initialValue !== undefined ? 0 : 1; i < this.length; i++) {
        accumulator = cb(accumulator, this[i], i, this)
    }
    return accumulator
}

const sum = [1,5,7,2,9].myReduce((acc, currVal, currIndex, ar) => {
    console.log(acc, currVal, currIndex, ar);
    return acc + currVal;
}, 0);
console.log(sum);

//Call Method
Function.prototype.myCall = function(context, ...args) {
    const fun = this
    let randomUniqueKey = Math.random()
    while (context[randomUniqueKey] !== undefined) randomUniqueKey = Math.random()
    context[randomUniqueKey] = fun
    const result =  context[randomUniqueKey](...args)
    delete context[randomUniqueKey]
    return result
}

// Apply method
Function.prototype.myCall = function (context, argArr) {
    const fun = this
    let randomUniqueKey = Math.random()
    while (context[randomUniqueKey] !== undefined) randomUniqueKey = Math.random()
    context[randomUniqueKey] = fun
    const result = context[randomUniqueKey](...argArr)
    delete context[randomUniqueKey]
    return result
}

//Bind
Function.prototype.myBind = function(context, ...args) {
    const fun = this
    return function() {
        return fun.apply(context, args)
    }
}

// Promise.All

const myPromiseAll = promiseArr => {
    // let toReturn = []
    // for (const prms of promiseArr) {
    //     try {
    //         const data = await prms
    //         toReturn.push(data)
    //     } catch (err) {
    //         toReturn = err
    //     }
    // }
    // return toReturn
    return new Promise((res, rej)=>{
        let resolvedPromise = 0
        let returnArr = []
        promiseArr.forEach((prms, index)=> {
            prms.then((val)=>{
                returnArr[index] = val
                resolvedPromise += 1
            }).catch((err) => {
                rej(err)
            })
        })
        if (resolvedPromise === promiseArr.length) res(returnArr)
    })
}