const numbers = [10, 20, 30, 40, 50];

const getById = (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Got ${id}`);
            resolve(id);
        }, 1000);
    });
}

// for in loop to get the index for arrays and keys for objects
// can use break and return statement
// suitable for async-await

for (const index in numbers) {
    if (index > 20) {
        break;
    }
    console.log(index);
    console.log(numbers[index]);
}
(async function () {
    const ids = [10, 20, 30];
    for (const idx in ids) {
        await getById(ids[idx])
    }
})()

//for of loop to get the values
// can use break and return statement here
// suitable for async-await 
for (const value of numbers) {
    if (value > 20) {
        break;
    }
    console.log(value)
}
(async function () {
    const ids = [10, 20, 30];
    for (const id of ids) {
        await getById(id)
    }
})()

// for each is better than above two as it gives both keys, values and iterating object/array
// Demerit :-> can't use break and return inside this
//         :-> un-suitable for async await function
numbers.forEach((value, index) => {
    console.log(value);
    console.log(index);
});

const ids = [10, 20, 30];
ids.forEach(async (id) => {
    await getById(id);
})

//Return case examples

const arr = [300, 34, 525, 45, 234]
const forEachFun = () => {
    arr.forEach(e => {
        if (e > 500) return true
    })
    return false
}

const forOfFun = () => {
    for (const val of arr) {
        if (val > 500) return true
    }
    return false
}

const forInFun = () => {
    for (const idx in arr) {
        if (arr[idx] > 500) return true
    }
    return false
}

console.log(forEachFun()) //false
console.log(forOfFun())  // true
console.log(forInFun())  // true