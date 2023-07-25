/*
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
*/

const nums = [2,11,15, -2]
const target = 9
const twoSumBF = (nums, target) => {
    const length = nums.length;
    for (let i = 0; i < length - 1; i++) {
        for (let j = i+1; j < length ; j++) {
            if (nums[i] + nums[j] === target) return [i, j]
        }
    }
};

const twoSumOPT = (nums, target) => {
    const length = nums.length;
    const numMap = new Map();
    for (let i = 0; i < length; i++) {
        const lookupValue = target - value;
        if (numMap.has(lookupValue)) return [numMap.get(lookupValue), i]
        numMap.set(nums[i], i)
    }
}
