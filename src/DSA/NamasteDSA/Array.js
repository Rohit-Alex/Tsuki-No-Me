// 1.  Search for an element in array (Linear Search)
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i ++) {
        if (arr[i] === target) {
            return i
        }
    }
    return -1
}

// 2. Maximum Element in array
function largestElement(arr) {
    let maxElement = -Infinity;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > maxElement) {
            maxElement = arr[i]
        }
    }
    return maxElement
}

// A bit optimized

function largestElement(arr) {
    let maxElement = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > maxElement) {
            maxElement = arr[i]
        }
    }
    return maxElement
}

// 3. 2nd Max element in array.

function secondMaxElement(arr) {
    let maxElement = -Infinity;
    let secondMaxElement = -Infinity;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > maxElement) {
            secondMaxElement = maxElement;
            maxElement = arr[i]
        } else if (arr[i] > secondMaxElement && secondMaxElement !== maxElement) {
            secondMaxElement = arr[i]
        }
    }
    return secondMaxElement
}

/*
 *  Note: econdMaxElement !== maxElement checks if dupicates max element is present then we don't get 2nd max element same as maxElement
*/ 


/*
* Remove duplicates from sorted array.
? https://leetcode.com/problems/remove-duplicates-from-sorted-array/
* IP: nums = [1,1,2]
* Output: 2, nums = [1,2,_]

* Input: nums = [0,0,1,1,1,2,2,3,3,4]
* Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]

*/

function removeDuplicates(arr) {
    const length = arr.length;
    let k = 1;
    for (let i = 1; i < length; i++) {
        if (arr[i] !== arr[i - 1]) {
            arr[k] = arr[i]
            k++
        }
    }
    return k
}


/*
* Remove given element in an Array (In-Place) and return length
* https://leetcode.com/problems/remove-element/
? Input: nums = [3,2,2,3], val = 3
? Output: 2, nums = [2,2,_,_]
? Explanation: Your function should return k = 2, with the first two elements of nums being 2. 
?              It does not matter what you leave beyond the returned k (hence they are underscores).

? Input: nums = [0,1,2,2,3,0,4,2], val = 2
? Output:  5, nums = [0,1,4,0,3,_,_,_]
? Explanation: Your function should return k = 5, with the first five elements of nums containing 0, 0, 1, 3, and 4.
?              Note that the five elements can be returned in any order.
?              It does not matter what you leave beyond the returned k (hence they are underscores).
*/

function removeElement(arr, val) {
    const length = arr.length;
    let k = 0;
    for (let i = 0; i < length; i++) {
        if (arr[i] !== val) {
            arr[k] = arr[i]
            k++
        }
    }
    return k
}

/*
*    Reverse a string. String given as an array of characters. Do it in-place
? Input: ['h', 'e', 'l', 'l', 'o']
? Output: ['o', 'l', 'l', 'e', 'h']
*/

function reverseString(charArr) {
    const length = charArr.length;
    let start = 0, end = length - 1;
    while (start < end) { // not start <= end as consider length 1, i.e. one character no need to reverse then
        [charArr[start], charArr[end]] = [charArr[end], charArr[start]]
        start++
        end--
    }
}

/*
* Best Time to buy and sell stock
? https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
* Input: prices = [7,1,5,3,6,4]
* Output: 5
* Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
*              Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.
*/

function maximizeStockProfit(arr) {
    const length = arr.length;
    let minimum = arr[0]
    let maxProfit = 0
    for (let i = 1; i < length; i++) {
        if (arr[i] < minimum) {
            minimum = arr[i]
        }
        const profit = arr[i] - minimum;
        maxProfit = Math.max(profit, maxProfit)
    }
    return maxProfit
}

/*
* Merge Sorted Array
? https://leetcode.com/problems/merge-sorted-array/description/
* Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
* Output: [1,2,2,3,5,6]

* Input: nums1 = [0], m = 0, nums2 = [4], n = 1
* Output: [4]

* NOTE: Modify nums1 array
*/


function mergeSortedArray(arr1, arr2, m, n) {
   let i = m - 1;
    let j = n - 1;
    let k =  m + n - 1;
    while(j >= 0 ) {
        if(i >= 0 && arr1[i] > arr2[j]) { // * i >= 0, for cases where m = 0. e.g. 2nd test case 
            arr1[k--] = arr1[i--]
        } else {
            arr1[k--] = arr2[j--]
        }
    }
}

/*
?    If there was no extra items in array1 to accomodate and we were required to return a new array.
*   Input: nums1 = [1,2,3], m = 3, nums2 = [2,5,6], n = 3
*   Output: [1,2,2,3,5,6]
*/

function mergeSortedArr(nums1, nums2, m, n) {
    const mergedArr = []
    let i = 0, j = 0;
    while (i < m && j < n) {
        if (nums1[i] < nums2[j]) {
            mergedArr.push(nums1[i])
            i++
        } else {
            mergedArr.push(nums2[j])
            j++
        }
    }
    return [...mergedArr, ...nums1.slice(i), ...nums2.slice(j)]
}

/*
* Move Zeroes
? https://leetcode.com/problems/move-zeroes/description/

*   Example 1:
*       Input: nums = [0,1,0,3,12]
*       Output: [1,3,12,0,0]

*   Example 2:
*       Input: nums = [0]
*       Output: [0]
*/

function moveZeroes(arr) {
    let k = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== 0) {
            arr[k++] = arr[i]
        }
    }
    for (let i = k; k < length; k++) {
        arr[i] = 0
    }
}

/*
* Max Consecutive Ones
? https://leetcode.com/problems/max-consecutive-ones/

*   Example 1:
*       Input: nums = [1,1,0,1,1,1]
*       Output: 3
*       Explanation: The first two digits or the last three digits are consecutive 1s. The maximum number of consecutive 1s is 3.
    
*   Example 2:
*       Input: nums = [1,0,1,1,0,1]
*       Output: 2
*/

function maxConsecutiveOnes(arr) {
    let maxCount = -Infinity;
    let currMaxCount = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 1) {
            currMaxCount++;
        } else {
            maxCount = Math.max(maxCount, currMaxCount)
            currMaxCount = 0
        }
    }

    return Math.max(maxCount, currMaxCount) // can't return directly maxCount as there are chances all the max consecutive 1's are at the end. 
    // so we need to check at last as well. e.g. [1,1,0,1,0,1,1,1,1]
}

/*
* Missing Number: 
? https://leetcode.com/problems/missing-number/description/

*   Input: nums = [3,0,1]
*   Output: 2

*   Input: nums = [9,6,4,2,3,5,7,0,1]
*   Output: 8
*/

function missingNumber(arr) {
    const n = arr.length
    const expectedSum = Math.floor(n * (n+ 1))
    const arrSum = arr.reduce((acc, curr) => acc + curr)
    return expectedSum - arrSum
}

/*
* Single Number:
? https://leetcode.com/problems/single-number/

*   Example 1:
*       Input: nums = [2,2,1]
*       Output: 1

*   Example 2:
*       Input: nums = [4,1,2,1,2]
*       Output: 4

*   Example 3:
*       Input: nums = [1]
*       Output: 1
*/

function singleNumber(arr) {
    let xorValue = 0
    for (let i = 0; i < arr.length; i++) {
        xorValue = xorValue ^ arr[i]
    }
    return xorValue
}