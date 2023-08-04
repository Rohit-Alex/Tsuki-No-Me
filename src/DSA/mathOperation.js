/*
Basic Euclidean Algorithm for GCD: 
The algorithm is based on the below facts. 

    i> If we subtract a smaller number from a larger one (we reduce a larger number), GCD doesn’t change. So if we keep subtracting repeatedly the larger of two, we end up with GCD.
    ii> Now instead of subtraction, if we divide the smaller number, the algorithm stops when we find the remainder 0.
*/

const getHCF = (a, b) => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

const getHCFRecursion = (a, b) => {
   if (b === 0) {
    return a;
  }
  return getHCFRecursion(b, a % b);

}

const getLCM = (a, b) => {
  const hcf = getHCFRecursion(a, b);
  return Math.abs(a * b) / hcf;
}

const isPrime = (num) => {
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false
    }
    return true
}

const countFactors = (num) => {
  let count = 0
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) {
      count++
      if (num / i !== i) count++
    }
    return count + 2
  }
}