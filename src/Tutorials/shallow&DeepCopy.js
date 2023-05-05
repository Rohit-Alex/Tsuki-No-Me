import _ from 'lodash'
const numbers = [10, 20, 30, 40, 50];
const detailsObj = {
    fname: 'Nirali',
    lname: 'Bhalodiya',
    address: {
        city: 'Vadodara'
    }
}


// Task: -> Make a copy of numbers and try to add 60 at last
const numbersCopy = numbers;
numbersCopy.push(60)
console.log(numbers);
console.log(numbersCopy)

// Task: -> Make a copy of detailsObj and try to add a property name "age" with value 25
const detailsObjCopy = detailsObj
detailsObjCopy.age = 25
console.log(detailsObjCopy)
console.log(detailsObj)

// spread operator works for shallow copy
const copyOfNumbers = [...numbers];
console.log(copyOfNumbers);
copyOfNumbers[0] = 100;
console.log(copyOfNumbers);
console.log(numbers);

const detailsObjCopy2 = { ...detailsObj }
detailsObjCopy2.age = 25
console.log(detailsObjCopy2)
console.log(detailsObj)

// spread operator does not work in deep copy
const people = [{ name: "John" }, { name: "Jane" }];
console.log(people);
const copyOfPeople = [...people];
console.log(copyOfPeople);
copyOfPeople[0].name = "Jack";
console.log(copyOfPeople);
console.log(people);

//Need to use JSON.parse and JSON.stringify or _.cloneDeep for deepCopy
const copyOfPeople2 = JSON.parse(JSON.stringify(people))
copyOfPeople2[0].name = "Rohit"
console.log(copyOfPeople2)
console.log(people);

//using loadash
const copyOfPeople3 = _.cloneDeep(people)
copyOfPeople3[0].name = "Satakshi"
console.log(copyOfPeople3);
console.log(people);



