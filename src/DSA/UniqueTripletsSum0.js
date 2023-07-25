/*
    Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

    Notice that the solution set must not contain duplicate triplets.

    Input: nums = [-1,0,1,2,-1,-4]
    Output: [[-1,-1,2],[-1,0,1]]

    Input: nums = [0,1,1]
    Output: []

    Input: nums = [0,0,0]
    Output: [[0,0,0]]
*/

const triplets0Sum = (nums) => {
    nums.sort((a, b) => a - b)
    const arrLength = nums.length;
    if (arrLength < 3) {    
        return [];
    }
    if (nums[0] > 0) {  // As array is sorted, and if 1st element is > 0 then successive element would be >= 1. So no possibility of triplet
        return [];
    }
    const result = []
    for (let i = 0; i < arrLength - 2; i++) {
         if (nums[i] > 0) {
            //As array is sorted, and if ith element is > 0 then successive element would be >= 1. So no possibility of triplet
            break;
        }
        if (i > 0 && nums[i] == nums[i - 1]) {
            //If number is getting repeated, ignore the lower loop and continue.
            continue;
        }
        let j = i + 1;
        let k = arrLength - 1;
       
        while (j < k) {
            const sum = nums[i] + nums[j] + nums[k];
            if (sum === 0) {
                result.push([nums[i], nums[j], nums[k]])
                // Skip duplicate elements for j
                while (j < k && nums[j] == nums[j + 1]) {
                    j++;
                }

                // Skip duplicate elements for k
                while (j < k && nums[k] == nums[k - 1]) {
                    k--;
                }
                j++;
                k--;
            } else if (sum < 0) {
                j++;
            } else {
                k--;
            }
        }
    }
    return result;
}

console.log(triplets0Sum([-2,0,1,1,2]))