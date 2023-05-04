const obj = {
    name: 'Nirali',
    surname: 'Bhalodiya',
    address: {
        city: 'Vadodara'
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
    Modify existing property, addition or removal dono allowed nhi hai. Think it as of ===
    * Object.freeze is used to prevent the modification of an object’s properties and the addition/removal of new properties. 
    * This means that once an object has been frozen, it becomes completely immutable and cannot be changed in any way.
    *  it’s only doing a shallow freeze, which means that it will only freeze the immediate properties of the object itself.
    
    *2nd
    Modify existing property but can't add or remove any property. Think it as of ==
    * Object.seal() method prevents the addition and deletion of properties from an object, but it does not prevent the modification of the values of existing properties.
    
    Remeber trick: Freeze ka spelling bada hai mtlb jaada kaam kar rha. means add, delete aur modify sab block
                   seal chota word toh kam kaam kar rha. Bus modify kar sakte. add aur delete nhi. 
*/

const frozenObject = Object.freeze(obj);
// Note: If we attempt to modify/delete any of its properties or add new properties will have no effect. It won't throw any error.

frozenObject.married = false; // Property cannnot be altered
frozenObject.age = 25;        // No new property can be added
delete frozenObject.name;      // Returns false. Property cannot be deleted
frozenObject.address.city = 'Las Vagas'; // Successful as it is one level deep
//method to check whether the object is frozen or not. It returns the boolean value and returns true if the object is frozen otherwise false.

Object.isFrozen(frozenObject); // === true


Object.seal(obj);

obj.name = 'Prateek' // allowed
obj.age = 17 // not allowed
delete obj.married // returns false as it can't be deleted


/*
    Question: If Object.freeze does shallow freeze then how can we make it deep freeze?

    Ans: 
        const deepFreeze = (obj) => {
          for (const key in obj) {
              if (typeof obj[key] === "object") deepFreeze(obj[key]);
          }
          return Object.freeze(obj);
        };
        deepFreeze(obj);
*/
