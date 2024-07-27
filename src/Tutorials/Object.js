/*
  <------ Different ways to create objects ------->

  i> object literals.
      e.g. const obj = {key: 'value'}
  
  ii> using new Object.
      e.g. const obj = new Object({ key: 'value' })
  
  iii> using construction function
  iv> using classes
*/

// Syntax showing the values can be of anything (any datatypes)
const dummyObj = {
  number: 2,
  string: 'Hey there!',
  boolean: true,
  array: [2, 4, 1, 'Amane'],
  myName() {
    console.log("Amane here.")
  },
  obj: {
    nestedKey: 1
  }
}


const obj = {
    name: 'Amane',
    surname: 'Ubuyashiki',
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

// Traversal using for in
for (const key in obj) {
    console.log(`Key is ${key} and value is ${obj[key]}`)
}

console.log(Object.keys(obj))
console.log(Object.values(obj))
console.log(Object.entries(obj))

// Traversal using for each. However, forEach can only be applied with arrays
Object.keys(obj).forEach(key => {
  console.log(`Key is ${key} and value is ${obj[key]}`)
})

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

/*
  <------- Check if a particulat key/property exists in an object? ----------->
  Available options: "in" / hasOwnProperty / Reflect.has

  Difference b/w "in" operator, hasOwnProperty and Reflect.has

  i> 'age' in obj => checks for specified property existance in an object or its prototype chain. It returns a boolean value (true or false) indicating whether the property is found.
  ii> hasOwnProperty checks for the presence of a property in an object and its prototype chain, i.e. properties defined directly and those inherited from its prototype chain.
      However, if the property is found directly on the object (not inherited), hasOwnProperty returns true; otherwise, it returns false.
  iii> Reflect.has only checks for the property in the object itself and also the prototype chain. Similar to "in" keyword. It's a static method
*/

const checkKeyInObj = {
  namooni: 'Your Grace',
};
console.log('namooni' in checkKeyInObj) // true
console.log(Reflect.has(checkKeyInObj, 'namooni')) // true
console.log(checkKeyInObj.hasOwnProperty('namooni')) // true

console.log('toString' in checkKeyInObj) // true As toString is an inbuilt method present in Object
console.log(Reflect.has(checkKeyInObj, 'toString')) // true
console.log(checkKeyInObj.hasOwnProperty('toString')) // false



const arr1 = [
  ["name", "Amane"],
  ["surname", "Ubuyashiki"],
  ["bf", "xyz"],
];

console.log(Object.fromEntries(arr1))


/*
  <----------- Object using constructor function ----------->

  Suppose you want to want to maintain record of all your lovers by mainting name, reasonForDecline, dayLeft and methods to increase and decrease dayLeft.

  Mainly used if we want make object with same properties and its repetitive
*/
const lover1 = {
  name: "namoona1",
  reasonForDecline: "Pasand nhi aur upar se annoying hai",
  dayLeft: 30,
  extendExpiry: function (extendBy) {
    this.dayLeft += extendBy;
    return `${this.dayLeft} days tak maje leti hu 😊`;
  },
  shortenExpiry: function (shortenBy) {
    this.dayLeft -= shortenBy;
    return `${this.dayLeft} days bus. Bahut ho rha iska ab 😠`;
  },
};

const lover2 = {
  name: "namoona2",
  reasonForDecline: "Chota hai warna sochti",
  dayLeft: 180,
  extendExpiry: function (extendBy) {
    this.dayLeft += extendBy;
    return `${this.dayLeft} days tak maje leti hu 😊`;
  },
  shortenExpiry: function (shortenBy) {
    this.dayLeft -= shortenBy;
    return `${this.dayLeft} days mein ise bhi chor dunhi 😂`;
  },
};

console.log(lover1.reasonForDecline)
console.log(lover1.extendExpiry(10))
console.log(lover1.shortenExpiry(30));

console.log(lover2.reasonForDecline)
console.log(lover2.extendExpiry(30))
console.log(lover2.shortenExpiry(200));

// Par tumhare pass lovers ka stock hai. Kitna object iss tarh banayegi. same cheez bus value alag alag.

function Lovers(name, reasonForDecline) {
  let dayLeft = 365;
  this.name = name;
  this.reasonForDecline = reasonForDecline;
  this.extendExpiry = function(extendBy) {
    dayLeft += extendBy;
    return `${dayLeft} days tak maje leti hu 😊`;
  }
  this.shortenExpiry = function(shortenBy) {
    dayLeft -= shortenBy;
    return `${dayLeft} days mein ise bhi chor dunhi 😂`;
  }
}

const lover3 = new Lovers('namoona1', 'Pasand nhi aur upar se annoying hai')
const lover4 = new Lovers('namoona2', 'Chota hai warna sochti')

console.log(lover3.reasonForDecline)
console.log(lover3.extendExpiry(10))
console.log(lover3.shortenExpiry(365));

console.log(lover4.reasonForDecline)
console.log(lover4.extendExpiry(30))
console.log(lover4.shortenExpiry(300));

// Ye scalable hai aur utna code bhi nhi likhna padega.



/*
  <-------------- Freeze vs Seal ----------->

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
