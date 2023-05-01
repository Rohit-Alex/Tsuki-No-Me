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

// Prime Number
// Prime factorization
// Duplicates 
// Unique
// Pair sum
// Overlapping intervals
// String reversal
// Object traversal 
// fibonaaci
// factorial
// memoization