```
const iykyk = [30, 28, 32];
const detailsObj = {
    fname: 'Amane'
}
```
#### Problem
##### Task: -> Make a copy of <u>*iykyk*</u> and change first value to 32
```
const iykykCopy = iykyk;
iykykCopy[0] = 32
console.log(iykyk); // [32, 28, 32]
console.log(iykykCopy) // [32, 28, 32]
```

```
let ifkyk = [10, 20];
const copy = ifkyk;
ifkyk[0] = 40
ifkyk = null
console.log(copy)
```

```
let person = { name: 'Lydia' };
const members = [person];
person = null;

console.log(members);
```
###### Objects interact by reference when setting them equal to each other. When you assign a reference from one variable to another, you make a copy of that reference. (note that they don't have the same reference!)

##### Task: -> Make a copy of <u>*detailsObj</u>* and try to add a property name "age" with value 25
```
const detailsObjCopy = detailsObj
detailsObjCopy.age = 25
console.log(detailsObjCopy) // age added to detailsObjCopy
console.log(detailsObj) // Note: here as well, age is added to detailsObj
```
> Explanation of problem:
From above two examples, we see that even if we are modifying the copied variable, the original data is also getting changed. The reason being that non-primitive types are accessed by reference and not value. When we write,
```
const detailsObjCopy = detailsObj
```
Then basically we are accessing the same variable just by 2 different name.
Simple bhasa mein bole toh, hum Amane ko kuch kahe ya mg ko, bol toh tumhi ko rhe na. Bus 2 alag alag naam kar diye. Orginal name aur nickname type.
#### SOLUTION
##### 1. Spread operator 
###### works for simple arrays (array of primitive type) and simple object with values of primitive types. It creates a shallow copy.
```
const iykykCopy = [...iykyk];
copyOfNumbers[0] = 32;
console.log(iykykCopy); // [32, 28, 32]
console.log(iykyk); // [30,28,32]

const detailsObjCopy = { ...detailsObj }
detailsObjCopy.age = 25
console.log(detailsObjCopy) // {fname: 'Amane', age: 25 }
console.log(detailsObj) // {fname: 'Amane' }
```
##### spread operator does not work in deep copy
```
const people = [{ name: "Anjali" }, { name: "Priya" }];
console.log(people);
const copyOfPeople = [...people];
console.log(copyOfPeople);
copyOfPeople[0].name = "Pooja";
console.log(copyOfPeople);
console.log(people);
```
##### 2. JSON.parse(JSON.stringify())

```
const copyOfPeople2 = JSON.parse(JSON.stringify(people))
copyOfPeople2[0].name = "Rohit"
console.log(copyOfPeople2)
console.log(people);
```

##### 3. Lodash
```
const copyOfPeople3 = _.cloneDeep(people)
copyOfPeople3[0].name = "Satakshi"
console.log(copyOfPeople3);
console.log(people);
```

##### 4. Structure clone
```
const copyOfPeople3 = structuredClone(people)
copyOfPeople3[0].name = "Richa"
console.log(copyOfPeople3);
console.log(people);
```

##### Which to choose?

1. JSON.parse(JSON.stringify()):
    - Inbuilt method so can be used without any issue
    - Can't handle Date Objects, Map, Set, Regex
    - It doesn't handle circular references, which can lead to infinite loops during the cloning process.
    - slower compared to other methods, especially for large and complex objects due to the serialization and deserialization steps.
2. lodash.deepCopy()
    - Need to install a package, thereby increasing the bundle size, hence more loading time
    - Can handle Date, Map, Set, Regex
    - Faster than JSON method
3. structuredClone()
    - Not yet supported in node version less than 17. Must have node 17 or higher
    - Not sure, but it works for Date as well
    - Faster than JSON method

#### Opt for lodash.deepCopy() if lodash is already installed else use JSON.parse(JSON.stringify())

