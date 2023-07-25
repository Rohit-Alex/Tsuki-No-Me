/*
Given an array of integers nums that is already sorted in non-decreasing order, and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
*/

const twoSum = (numbers, target) => {
    let first = 0, last = numbers.length - 1;
    while (first < last) {
        if (numbers[first] + numbers[last] === target) {
            return [first+1, last+1]
        }
        if (numbers[first] + numbers[last] > target) {
            last--
        }
         if (numbers[first] + numbers[last] < target) {
            first++
        }
    }
};