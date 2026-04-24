// ? DIGIT SEPARATION

// 1. Count the number of digits in a number

function countDigits(num) {
    if (num === 0) return 1
    num = Math.abs(num) // * handling for -ve number
    let digitCount = 0
    while(num > 0) {
        digitCount++;
        num = num/10;
    }
    return digitCount
}

console.log(countDigits(2451))

// 2. Check for pallindrome number

function checkPallindrome(num) {
    if (num === 0) return true
    num = Math.abs(num)
    let tempNum = num;
    let reverse = 0;
    while(tempNum > 0) {
        const lastDigit = tempNum % 10;
        reverse = reverse * 10 + lastDigit
        tempNum = Math.floor(tempNum / 10)
    }
    if (reverse === num) {
        return true
    }
    return false
}
