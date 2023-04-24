/*
    * These new iterations method are replaement of for loop.
    * Resemblence with for loop of ForEach, Map, Filter, Some, Every. 
    * Normally these iteration method accept 3 parameters.
        * i> element
        * ii> index
        * iii> array_being_traversed 
*/
const numbers = [10, 20, 30, 40, 50];

for (let i = 0; i < numbers.length; i++) {
    const element = arr[i]; // 1st parameter
    const index = i; // 2nd parameter
    const array_being_traversed = numbers; // 3rd parameter
}

/*
            ! FOR EACH
    * Can be applied only on Arrays and Strings(But need to convert to Array using Array.from() before applying).
    Demerit :-> can't use break and return inside this
            :-> un-suitable for async await function
*/

/*
            ! FOR IN
    Can be applied on Arrays, strings and Objects as well. 
    * However, Best suited for Objects
    for in loop to get the index for arrays and keys for objects
    can use break and return statement
    suitable for async-await
*/

/*
            ! FOR OF
    Can be applied on Arrays and strings. 
    * Cant' apply on Object.
    for of loop to get the values in array.
    can use break and return statement
    suitable for async-await
*/

// ?? In Object we can only apply forIn loop. Nothing else.
// ?? In Array we can apply all the iterating method.
// ?? In Strings we can't apply forEach loop directly. But we can apply all the iteration method directly (except forEach)


// APPLICABILITY

    // Arrays

    let myArray = [1, 2, 3];

    // Using for...in loop with array (not recommended)
    for (let key in myArray) {
        console.log(key + ': ' + myArray[key]);
    }

    // Using forEach with array
    myArray.forEach((value, index) => {
        console.log(`Value at index: ${index} is ${value}`)
    });

    // Using for...of loop with array
    for (let value of myArray) {
        console.log(value);
    }

    // Objects

    let myObj = { a: 1, b: 2, c: 3 };

    // Using for...in loop with object
    for (let key in myObj) {
        console.log(key + ': ' + myObj[key]);
    }

    // Can't directly use ForEach here.
    // However, we can use it by doing below
    Object.keys(myObj).forEach(function(key) {
        console.log(key + ': ' + myObj[key]);
    });

    // Using for...of loop with object (not supported)
    // However, we can use it by doing below
    for (let value of Object.values(myObj)) {
    console.log(value);
    }

    // Strings

    let myString = 'hello';

    // Using for...in loop with string
    for (let index in myString) {
    console.log(myString[index]);
    }

    // Using forEach with string
    Array.from(myString).forEach((char) => {
        console.log(char)
    });

    // Using for...of loop with string
    for (let char of myString) {
        console.log(char);
    }

// Return and break cases examples

    // FOR EACH LOOP
    const arr = [300, 34, 525, 45, 234]
    const forEachFun = () => {
        arr.forEach(e => {
            if (e > 500) return true
        })
        return false
    }

    console.log(forEachFun()) //false


    // FOR OF LOOP

    for (const value of numbers) {
        if (value > 20) {
            break;
        }
        console.log(value)
    }

    const forOfFun = () => {
        for (const val of arr) {
            if (val > 500) return true
        }
        return false
    }

    console.log(forOfFun())  // true

    // FOR IN LOOP

    for (const index in numbers) {
        if (index > 20) {
            break;
        }
        console.log(index);
        console.log(numbers[index]);
    }

    const forInFun = () => {
        for (const idx in arr) {
            if (arr[idx] > 500) return true
        }
        return false
    }

    console.log(forInFun())  // true

// Asynchronous Behaviour

const getById = (id, timer = 1) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Got ${id} for Timeout: ${timer * 1000}`);
            resolve(id);
        }, timer * 1000);
    });
}

    // FOR EACH
    const ids = [10, 20, 30];
    ids.forEach(async (id) => {
        const randomIndex = Math.floor(Math.random() * 3) + 1
        console.log(randomIndex,'randomIndex')
        await getById(id, randomIndex);
    });

    // FOR IN

    (async function () {
        const ids = [10, 20, 30];
        for (const idx in ids) {
            const randomIndex = Math.floor(Math.random() * 3) + 1
            console.log(randomIndex,'randomIndex')
            await getById(ids[idx], randomIndex)
        }
    })();

    //FOR OF

    (async function () {
        const ids = [10, 20, 30];
        for (const id of ids) {
            const randomIndex = Math.floor(Math.random() * 3) + 1
            console.log(randomIndex,'randomIndex')
            await getById(id, randomIndex)
        }
    })()