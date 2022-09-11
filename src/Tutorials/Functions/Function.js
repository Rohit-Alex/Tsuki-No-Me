console.log(...[1, 2, 3])

const a = 5
const locations = {
    GET_RULES: (b) => a + b,
    GET_TRANSACTIONS: () => a,
    GET_DATA: (b, c, d) => b + c + d
}

const myFun = (a) => a + 100

const locationData = (type, callback, params) => {
    const res = params ? callback(locations[type](...params)) : callback(locations[type]())
    return res

}

console.log(locationData('GET_TRANSACTIONS', myFun, undefined))
console.log(locationData('GET_RULES', myFun, [6]))
console.log(locationData('GET_DATA', myFun, [6, 9, 69]))

console.log(locationData.bind(this, 'GET_TRANSACTIONS', myFun, undefined)())
console.log(locationData.bind(this, 'GET_RULES', myFun, [6])())
console.log(locationData.bind(this, 'GET_DATA', myFun, [6, 9, 69])())


