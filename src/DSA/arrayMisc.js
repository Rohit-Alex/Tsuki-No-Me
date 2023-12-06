// Segregate +ve numbers at the beginning and -ve numbers at end
const arr = [4, -3, -5, 8, -1, -9, 10, -2]

let swapIdx = 0
arr.forEach((ele, index) => {
    if (ele < 0) {
        [arr[swapIdx], arr[index]] = [arr[index], arr[swapIdx]];
        swapIdx++;
    }
})
console.log(arr)

// Segregate an array consisting of 0,1 and 2 such that 0 comes first, 1 in between and 2 at the end.

const arr1= [0, 1, 2, 0, 1, 2]
let zeroIdx = 0, twoIdx = arr.length - 1;
let index = 0;
while (index <= twoIdx) {
    const ele = arr1[index]
     if (ele === 0) {
        [arr1[index], arr1[zeroIdx]] = [arr1[zeroIdx], arr1[index]];
        zeroIdx++
        index++
    } else if (ele === 2) {
        [arr1[index], arr1[twoIdx]] = [arr1[twoIdx], arr1[index]];
        twoIdx--
    } else {
        index++
    }
    console.log()
}

console.log(arr1)