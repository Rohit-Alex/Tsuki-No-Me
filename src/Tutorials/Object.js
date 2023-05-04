const obj = {
    name: 'Prateek',
    surname: 'Bhalodiya',
    details: {
        location: 'Vadodara'
    },
}
obj.bf = 'xyz'
// When trying to access any non existing property then we get undefined
console.log(obj.gf)

const fun = () => "surname";
const expensiveCal = 'name'
// Dot notation or bracket

// Use bracket notation in case when key is dynamic.
console.log(obj['name'])
console.log(obj[expensiveCal]);
console.log(obj.surname)
console.log(obj[fun()])


for (const key in obj) {
    console.log(`Key is ${key} and value is ${obj[key]}`)
}

console.log(Object.keys(obj))
console.log(Object.values(obj))
console.log(Object.entries(obj))


const bird = {
  size: 'small',
};

const mouse = {
  name: 'Mickey',
  small: true,
};


/*
    A: mouse.bird.size is not valid => undefined.size => Error (cannot read size of undefined)
    B: mouse[bird.size] is not valid => mouse['small'] => mouse.small => true
    C: mouse[bird["size"]] is not valid => mouse[bird.size] => mouse.small => true
*/

/*
    Format of value returned from Object.entries
    Array of array where each individual item represent key(1st value) and value(2nd value)
*/

// Check if any key exists in object. If age property exists or not
console.log(obj.hasOwnProperty('age'))

const arr1 = [
  ["name", "Nirali"],
  ["surname", "Bhalodiya"],
  ["bf", "xyz"],
];

console.log(Object.fromEntries(arr1))


// Freeze vs Seal

/*
    * 1st case:
    Modify existing property, addition or removal dono allowed nhi hai. ===
    Freeze is applicable

    *2nd
    Modify existing property but can't add or remove any property
    Seal is applicable
    
*/


