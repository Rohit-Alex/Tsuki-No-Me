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


const checkTruthyValueTotally = (value) => {
  return value && !["0", "null", "undefined"].includes(value);
};
const treatFalsyAsTruthy = (value) => {
  return value || value === 0;
};

console.log(checkTruthyValueTotally(23));
console.log(treatFalsyAsTruthy(NaN));

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
  if ([null, undefined].includes(value1) || [null, undefined].includes(value2) ) {
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
