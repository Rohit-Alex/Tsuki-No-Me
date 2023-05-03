/*
    Spread operator:
    * This syntax allows iterable items (arrays, strings, or objects) to be expanded.

    * Possible syntax
    Function arguments list => myFunction(a, ...iterableObj, b)
    Array  => [1, ...iterableObj, '4', 'five', 6])
    Object => { ...obj, key: 'value' }

    Mainly used to make shallow copy for object and arrays.
    Use cases are like suppose there is some pre-existing array or object and we want to make changes to them maybe add or modify an existing property.
*/
const num1 = [1,2,3]
console.log(...num1)

const obj1 = {fruit: 'mango', vegetable: 'tomato'}
console.log(...obj1)

//Suppose we want to add 4 and 5 to num1 array such that it becomes [1,2,3,4,5]
num1 = [...num1, 4, 5]

// Practical example. Add todo representing an object.

let arr1 = [0, 1, 2];
const arr2 = [3, 4, 5];

arr1 = [...arr1, ...arr2];

const obj2 = {fName: 'Nirali'}
const obj3 = {lastName: 'Bhalodiya'}
//Make an object which has both the keys.
// Make it your brother's object


//Note: We can spread an array to object

/*
    ! Resemblence with rest operator
    Used to get all the remaining parameter. Can be only used at last while destructuring or last parameter in function
*/

function myFun(a, b, ...manyMoreArgs) {
  console.log("a", a);
  console.log("b", b);
  console.log("manyMoreArgs", manyMoreArgs);
}

myFun("one", "two", "three", "four", "five", "six");

/*
    <<<----- Destructuring ----->>>
    * JavaScript expression that makes it possible to unpack values from arrays, or properties from objects, into distinct variables.
*/

const x = [1, 2, 3, 4, 5];
const [y, z] = x;

const shaddi = { ladki: '', dahej: 3000000, keyPoint: { education: { matric: '1st', enter: '1st', BA: '2nd' }, cuteness: 'overloaded', gussa: 'Sizzling hot' }  };

const error = { message: 'rohit' }
const { config:
{ headers: { Authorization, ...exceptAuthorization } = {}, ...exceptHeaders } = {}, ...rest
} = error ?? {};


// Question: Given an array of object containing some properties. Now, create an array with each object containg additionKey title
