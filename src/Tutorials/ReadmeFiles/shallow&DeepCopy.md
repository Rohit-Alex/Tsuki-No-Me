# Shallow Copy and Deep Copy

## Initial Data

```javascript
const iykyk = [30, 28, 32];
const detailsObj = {
    fname: 'Amane'
}
```
## The Problem

### Question 1

**Task:** Make a copy of `iykyk` and change first value to 32

```javascript
const iykykCopy = iykyk;
iykykCopy[0] = 32;
console.log(iykyk);
console.log(iykykCopy);
```

<details>
<summary>Show Answer</summary>

```
[32, 28, 32]
[32, 28, 32]
```

**Problem:** Both arrays changed! This is because objects are passed by reference, not value.

</details>

### Question 2

What will be the output?

```javascript
let ifkyk = [10, 20];
const copy = ifkyk;
ifkyk[0] = 40;
ifkyk = null;
console.log(copy);
```

<details>
<summary>Show Answer</summary>

```
[40, 20]
```

**Explanation:** The `copy` still references the original array object, so it reflects the mutation even after `ifkyk` is set to null.

</details>

### Question 3

What will be the output?

```javascript
let person = { name: 'Lydia' };
const members = [person];
person = null;
console.log(members);
```

<details>
<summary>Show Answer</summary>

```
[{ name: 'Lydia' }]
```

**Explanation:** The array `members` contains a reference to the original object. Setting `person = null` doesn't affect the object reference stored in the array.

</details>
###### Objects interact by reference when setting them equal to each other. When you assign a reference from one variable to another, you make a copy of that reference. (note that they don't have the same reference!)

### Question 4

**Task:** Make a copy of `detailsObj` and try to add a property "age" with value 25

```javascript
const detailsObjCopy = detailsObj;
detailsObjCopy.age = 25;
console.log(detailsObjCopy);
console.log(detailsObj);
```

<details>
<summary>Show Answer</summary>

```
{ fname: 'Amane', age: 25 }
{ fname: 'Amane', age: 25 }
```

**Problem:** Both objects changed! The `age` property was added to both because they reference the same object.

</details>
> Explanation of problem:
From above two examples, we see that even if we are modifying the copied variable, the original data is also getting changed. The reason being that non-primitive types are accessed by reference and not value. When we write,
```
const detailsObjCopy = detailsObj
```
Then basically we are accessing the same variable just by 2 different name.
Simple bhasa mein bole toh, hum Amane ko kuch kahe ya mg ko, bol toh tumhi ko rhe na. Bus 2 alag alag naam kar diye. Orginal name aur nickname type.
## Solutions

### 1. Spread Operator (Shallow Copy)

Works for simple arrays (array of primitive types) and simple objects with primitive values. It creates a shallow copy.

```javascript
const iykykCopy = [...iykyk];
iykykCopy[0] = 32;
console.log(iykykCopy);
console.log(iykyk);

const detailsObjCopy = { ...detailsObj };
detailsObjCopy.age = 25;
console.log(detailsObjCopy);
console.log(detailsObj);
```

<details>
<summary>Show Answer</summary>

```
[32, 28, 32]
[30, 28, 32]
{ fname: 'Amane', age: 25 }
{ fname: 'Amane' }
```

**Success!** The spread operator creates separate copies for simple data structures.

</details>
### Problem: Spread Operator Doesn't Work for Deep Copy

```javascript
const people = [{ name: "Anjali" }, { name: "Priya" }];
const copyOfPeople = [...people];
copyOfPeople[0].name = "Pooja";
console.log(copyOfPeople);
console.log(people);
```

<details>
<summary>Show Answer</summary>

```
[{ name: "Pooja" }, { name: "Priya" }]
[{ name: "Pooja" }, { name: "Priya" }]
```

**Problem:** Both arrays changed! Spread operator only does shallow copy - it copies the array but not the nested objects.

</details>
### 2. JSON.parse(JSON.stringify()) - Deep Copy

```javascript
const copyOfPeople2 = JSON.parse(JSON.stringify(people));
copyOfPeople2[0].name = "Rohit";
console.log(copyOfPeople2);
console.log(people);
```

<details>
<summary>Show Answer</summary>

```
[{ name: "Rohit" }, { name: "Priya" }]
[{ name: "Anjali" }, { name: "Priya" }]
```

**Success!** True deep copy - changes don't affect the original.

</details>

### 3. Lodash _.cloneDeep() - Deep Copy

```javascript
const copyOfPeople3 = _.cloneDeep(people);
copyOfPeople3[0].name = "Satakshi";
console.log(copyOfPeople3);
console.log(people);
```

<details>
<summary>Show Answer</summary>

```
[{ name: "Satakshi" }, { name: "Priya" }]
[{ name: "Anjali" }, { name: "Priya" }]
```

**Success!** Lodash provides robust deep cloning.

</details>

### 4. structuredClone() - Deep Copy

```javascript
const copyOfPeople4 = structuredClone(people);
copyOfPeople4[0].name = "Richa";
console.log(copyOfPeople4);
console.log(people);
```

<details>
<summary>Show Answer</summary>

```
[{ name: "Richa" }, { name: "Priya" }]
[{ name: "Anjali" }, { name: "Priya" }]
```

**Success!** Modern native deep cloning method.

</details>

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

