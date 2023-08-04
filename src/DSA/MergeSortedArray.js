/*
You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, 
representing the number of elements in nums1 and nums2 respectively.

Merge nums1 and nums2 into a single array sorted in non-decreasing order.

Input: nums1 = [1,2,3], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
Explanation: The arrays we are merging are [1,2,3] and [2,5,6].
*/

const mergeSortedArray = (arr1, arr2, m, n) => {
    const op = []
    let i = 0, j = 0;
    new Array(m+n).fill().forEach(ele => {
        if (arr1[i] < arr2[j]) {
            op.push(arr1[i++])
        } else {
            op.push(arr2[j++])
        }
    })
    return op
}

const nums1 = [1,2,3];
const m = 3;
const nums2 = [2,5,6]
const n = 3

console.log(mergeSortedArray(nums1, nums2, m, n))

/*
    Slight change in question:

    The final sorted array should not be returned by the function, but instead be stored inside the array nums1. 
    To accommodate this, nums1 has a length of m + n, where the first m elements denote the elements that should be merged, 
    and the last n elements are set to 0 and should be ignored. nums2 has a length of n.

    Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
    Output: [1,2,2,3,5,6]
    Explanation: The arrays we are merging are [1,2,3] and [2,5,6].
    The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.
*/

const mergedSortedArr = (arr1, arr2, m, n) => {
    let i = m - 1;
    let j = n - 1;
    let k = m + n - 1;
    while (j >= 0) {
        if (arr1[i] > arr2[j]) {
            arr1[k] = arr1[i]
            i--;
        } else {
            arr1[k] = arr2[j]
            j--
        }
        k--
    }
}