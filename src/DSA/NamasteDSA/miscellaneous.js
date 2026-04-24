// * 1. Find HCF of 2 numbers

// Naive Approach: Find minimum of 2 number and find highest common factor for both

function hcf(num1, num2) {
    const small = Math.min(num1, num2)
    let hcfValue = 1
    for (let i = 1; i <= small; i++) {
        if (num1 % i === 0 && num2 % i === 0) {
            hcfValue = i
        }
    }
    return hcfValue
}


/*
* Efficient approach: Division based Euclidean

    num1        num2        rem
    12          32          8
    8           12          4
    4           8           0
    0           4 => res
*/

function hcf(num1, num2) {
    if (num1 === 0) return num2
    return hcf(num2 % num1, num1)
}
