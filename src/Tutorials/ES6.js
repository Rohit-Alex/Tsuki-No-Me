/*
    <<<<---------- Optional Chaining ----------->>>

*/
const knowMeObj = {
    traits: ['Addictive', 'Kanjoos', 'Nak chadhi', 'childish'],
    name: 'Nirali Bhalodiya',
    nickName: 'Namooni',
    address: {
        city: 'Vadodara',
        state: 'Gujarat',
    },
    getHobby: () => console.log("K-drama dekh ke baaki ladko ko barbaad karna"),
    knowTarget: () => console.log('Gift a house to Dad and be self dependent')
}
/*
    access name, nickName, getBoyfriend, assuming everthing is optional
    if no husband then print dilwa de koi acha wala
    getHusband: (bf) => console.log(`${bf} is my husband`) 
*/

/*
    <<<<---------- Spread ----------->>>

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
const personality = ['Beautiful', 'Addictive', 'hot-headed']
console.log(...personality)

const str = 'Nirali'
console.log(...str)

const obj1 = {fruit: 'mango', vegetable: 'tomato'}
console.log(...obj1)

//Suppose we want to add 4 and 5 to num1 array such that it becomes [1,2,3,4,5]
// or add "innocent", "childish" to personality
num1 = [...num1, 4, 5]

// Practical example. Add todo representing an object.

let arr1 = [0, 1, 2];
const arr2 = [3, 4, 5];

arr1 = [...arr1, ...arr2];

const posTraits = ['Patience', 'persistent', 'Innocent', 'Childish']
const negTraits = ['Kanjoos', 'hot-headed', 'pessimistic']

// Now combine above 2 arrays into 1


const stock1 = {mango: '12 kg', grapes: '10 kg'}
// Now add apple 10 kg in stock

const stock2 = {watermelon: '10 kg', pineapple: '5 kg'}
// Now combine stock1 and stock2
// Modify mango quantity to '15 kg'


//Note: We can spread an array to object

/*
     <<<<---------- Rest Operator ----------->>>

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

const unfilledWishes = ['Gaali sunna', 'To see in person', 'Working together', 'Rest u know']
const [first, second, ...restWishes] = unfilledWishes;
console.log(first);
console.log(second);
console.log(restWishes)

// Swapt two numbers using destructring

const bioData = {
    name: 'Nirali Bhalodiya',
    age: 25,
    dahejDo: 3000000,
    address: {
        city: 'Vadodara',
        state: 'Gujarat',
        landmark: ['eva mall', 'Ganshyam Nagar']
    },
    keyPoint: { education: { matric: '1st', enter: '1st', Diplcoma: '1st' }, cuteness: 'overloaded', gussa: 'Sizzling hot' } 
}
const { fname, ...remainingKeys } = bioData;
 

const error = { 
    config: {
        headers: {
            Authorization: 'chal bhaag',
            token: 'mggsflifeoioi24',
            contentType: 'html'
        },
        stomach: 'Bhookh laga hai khila de',
        leg: 'Dard kar rha, utha le'
    },
    complicated: 'thoda bahut',
    relief: 'hum hai na' 
}

const { config:
{ headers: { Authorization, ...exceptAuthorization } = {}, ...exceptHeaders } = {}, ...rest
} = error ?? {};


// Question: Given an array of object containing some properties. Now, create an array with each object containg additionKey title

