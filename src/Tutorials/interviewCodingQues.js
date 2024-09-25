const isPrimitive = (value) => {
    return typeof value !== 'object' && typeof value !== 'function'
    // return ['object', 'function'].includes(typeof value)
}

const isObject = (obj) => {
    return typeof obj === 'object' && obj.constructor === Object
}

const isArray = (arr) => {
    return typeof arr === 'object' && arr.constructor === Array && Array.isArray(arr)
}

const compareObject = (obj1, obj2) => {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false
    } 
    for (const key in obj1) {
        if (!obj2.hasOwnProperty(key)) { // Note: why not if(obj2[key] !== undefined)
            return false
        }
        const value1 = obj1[key]
        const value2 = obj2[key]
        if (value1 !== value2) {
            return false
        }
    }
    return true
}

const compareNestedObject = (obj1, obj2) => {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false 
    }
    for (const key in obj1) {
        if (obj2[key] === undefined) { // Note: why not obj2[key] !== undefined
            return false
        }
        const value1 = obj1[key]
        const value2 = obj2[key]
        if (isObject(obj1[key])) {
             if (!compareNestedObject(value1, value2)) {
                return false
             }
        }

        if (value1 !== value2) {
            return false
        }
    }
    return true
}
const isEqual = (val1, val2) => {
    if (typeof val1 !== 'object' && typeof val2 !== 'object') {
        // Means both are primitives values
        return val1 === val2
    }
    
    if (typeof val1 === 'object' && val1 !== null && typeof val2 === "object" && val2 !== null) {
        // Means both are non-primitive values
        if (val1.constructor !== val2.constructor)  {
            // If the type of non-primitives types are different
            // Means one is array other is object or function
            return false 
        }
        // Means both are of same type
        if (Object.keys(val1).length != Object.keys(val2).length) {
            return false;
        }
        for (const key in val1) {
            if (!val2.hasOwnProperty(key)) {
                return false
            }
            if (!isEqual(val1[key], val2[key])) {
                return false
            }
        }
        return true
    }

    // Means either one is primitive and other is non-primitive
    return false
}

const checkTruthyValueTotally = (value) => {
  return value && !["0", "null", "undefined"].includes(value);
};
const treatFalsyAsTruthy = (value) => {
  return value || value === 0;
};

console.log(checkTruthyValueTotally(23));
console.log(treatFalsyAsTruthy(NaN));

/*
Test case 1
const obj1 = {name: 'rohit', age: 24, hobbies: 'Music'}
const obj2 = {name: 'rohit', age: 24, hobbies: 'Music', skills: 'javascript'}

Test case 2
const obj1 = {age: 24, skills: 'javascript', hobbies: 'Music', name: 'rohit'}
const obj2 = {name: 'rohit', age: 24, hobbies: 'Music', skills: 'javascript'}

Test case 3
const obj1 = {name: 'rohit', age: 24, hobbies: 'Music', isSingle: true}
const obj2 = {name: 'rohit', age: 24, hobbies: 'Music', skills: 'javascript'}

Test case 4
const obj1 = { name: "rohit", age: 24, hobbies: "Music", skills: 'javasc' };
const obj2 = { name: "rohit", age: 24, hobbies: "Music", skills: undefined };

Test case 5
const obj1 = { a: 20, b: { x: 40, y: 60 }}
const obj2 = { a: 20, b: { x: 40, y: 80 }}
*/
console.log(compareObject(obj1, obj2))


const compareArrays = (arr1, arr2) => {
    // This doesn't always work. If order doesn't matter and any value is null and in another array any value is undefined
    return JSON.stringify(arr1) === JSON.stringify(arr2)
}

const advanceCompareArrays = (arr1, arr2) => {
    // If order matters
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false
    }
    return true

    // Try to do with every method
}


const optimizedCompareArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false
    }
    const myMap = new Map()
    arr1.forEach((ele) => {
        myMap.set(ele, (myMap.get(ele) ?? 0) + 1)
    })
    arr2.forEach(ele => {
        const currEleFreq = myMap.get(ele)
        if (currEleFreq === undefined) {
            return false;
        }
        myMap.set(ele, currEleFreq - 1);
    })
    const arrElemsFrequencies = myMap.values()
    // Checking if all the frequency is 0 or not.
    for (const freq of arrElemsFrequencies) {
        if (freq !== 0) return false
    }
    // Tell why didn't we use forEach here
    // Can we do this using Array.some()
    // Tell me the time comple
    return true
}
/*
    Test case 1
    const arr1 = [24, 1, 5]
    const arr2 = [24, 1, 5]

    Test case 2
    const arr1 = ['Hi', 'corporate', 'friend', null]
    const arr2 = ['Hi', 'corporate', 'friend', undefined]

    Test case 3
    const arr1 = [13, 19, 69, 45]
    const arr2 = [13, 19, 69]

    Test case 4
    const arr1 = [5, 1, 24]
    const arr2 = [24, 5, 1]

    Test case 5
    const arr1 = [4, 5, 2, 4, 2, 3] 
    const arr2 = [4, 3, 2, 2, 5, 2]

*/
console.log(compareArrays(arr1, arr2))
function deepCompare(value1, value2) {
  // If both are identical (for primitive types like number, string, etc.)
  if (value1 === value2) {
    return true;
  }

  // Handle null and undefined cases
  if (value1 === null || value2 === null || value1 === undefined || value2 === undefined) {
    return value1 === value2;
  }

  // If the types are different, they're not equal
  if (typeof value1 !== typeof value2) {
    return false;
  }

  // Handle arrays
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return false;
    for (let i = 0; i < value1.length; i++) {
      if (!deepCompare(value1[i], value2[i])) return false;
    }
    return true;
  }

  // Handle objects (non-null objects that aren't arrays)
  if (typeof value1 === 'object' && typeof value2 === 'object') {
    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!deepCompare(value1[key], value2[key])) return false;
    }
    return true;
  }

  // For all other types (including functions, dates, etc.), they should have failed by this point
  return false;
}


// Anagrams
// Prime Number
// Prime factorization
// HCF
// LCM
// Duplicates 
// Unique
// Count frequency of array elements
// Pair sum
// String reversal
// Object traversal 
// fibonaaci
// factorial
// memoization
// Overlapping intervals
// Recursion question on arrays and objects

// Question 1 (Deep Flat)
const givenArr = [2, 4, [8, 9], [0, -1, [1, 2, [4, 5]]]];
const deepFlatArr = (arr) => {
  let op = [];

  for (let val of arr) {
    if (typeof val !== "object") {
      op.push(val);
    }
    if (typeof val === "object" && Array.isArray(val)) {
      op = op.concat(deepFlatArr(val));
    }
  }
  return op;
};
console.log(deepFlatArr(givenArr));

// 2nd question (Deep Clone)
const originalObj = { a: 1, b: { c: 2, d: [3, 4] } };

const deepClone = (ipObj) => {
  if (typeof ipObj !== "object") return ipObj;
  if (typeof ipObj === "object" && Array.isArray(ipObj))
    return ipObj.map((e) => deepClone(e));
  const op = {};
  for (let key in ipObj) {
    const val = ipObj[key];
    op[key] = deepClone(val);
  }
  return op;
};
console.log(deepClone(originalObj));

//3. Deep Freeze

const deepFreeze = (obj) => {
  Object.freeze(obj);
  for (let key in obj) {
    const val = obj[key];
    if (typeof val === "object") {
      deepFreeze(val);
    }
  }
  return obj;
};

const objToFreeze = { a: 1, b: { c: 2 } };
deepFreeze(objToFreeze);
// objToFreeze.b.c = 3; // This will not change the value
console.log(objToFreeze.b.c); // Output: 2
