// O(n*n) in best, average and worst case.
// unstable -> Changes order of arrangement
const selectionSort = (arr) => {
  const arrLength = arr.length
  for (let i = 0; i < arrLength - 1; i++) {
    let smallEleIdx = i
    for (let j = i + 1; j < arrLength; j++) {
      if (arr[j] < arr[smallEleIdx]) {
        smallEleIdx = j
      }
    }
    [arr[i], arr[smallEleIdx]] = [arr[smallEleIdx], arr[i]] // swapping element at ith index and smallEleIdx index
  }
}

// stable -> maintains order of arrangement
// O(n) => best case (Already sorted array)
// O(n*n) => worst case (Reverse sorted array)
// O(n*n) => In General
const bubbleSort = (arr) => {
  const arrLength = arr.length
  for (let i = 0; i < arrLength - 1; i++) { // to sort an array of length n, it takes n-1 pass, so we run loop till n-1 
    let isSwapped = false
    for (let j = 0; j < arrLength - 1 - i; j++) {
      if (arr[j + 1] < arr[j]) {
        isSwapped = true;
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
    if (!isSwapped) break
  }
}

// stable -> maintains order of arrangement
// O(n) => best case (Already sorted array)
// O(n*n) => worst case (Reverse sorted array)
// O(n*n) => In General
const insertionSort = (arr) => {
  const arrLength = arr.length
  for (let i = 1; i < arrLength; i++) { // We start from 1 as first element is already sorted. No element is present left of it
    const key = arr[i]
    let j = i - 1; // starts checking the elements present left of it.
    while (j >= 0 && key < arr[j]) { // here if we use <= then also it will work, but it won't be stable then
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = key
  }
}

// un-stable
// worst case => O(n*n) (reversely sorted)
// best case => O(NlogN)
// In general => O(NlogN)
// Doesn't require any auxiliary space
const getPartitioningIndex = (start, end, arr) => {
  const pivotElement = arr[end];
  let swappingIdx = start;
  for (let i = start; i < end; i++) {
    if (arr[i] < pivotElement) {
      [arr[i], arr[swappingIdx]] = [arr[swappingIdx], arr[i]]
      swappingIdx++;
    }
  }
  [arr[swappingIdx], arr[end]] = [arr[end], arr[swappingIdx]]
  return swappingIdx
}

const quickSort = (start, end, arr) => {
  if (start < end) {
    const partioningIdx = getPartitioningIndex(start, end, arr)
    quickSort(start, partioningIdx - 1, arr)
    quickSort(partioningIdx + 1, end, arr)
  }
}

const arr = [10, 7, 8, 9, 1, 5];
quickSort(0, arr.length - 1, arr);
console.log(arr)

// Best, worst and Average case => O(NlogN)
// Auxiliary space of O(N)
// Stable 
// Not suitable for small array length. Preffered for large array

const merge = (start, mid, end, arr) => {
  const leftArrLength = mid - start + 1
  const rightArrLength = end - mid
  // const leftAuxiliaryArr = new Array(leftArrLength)
  // for (let i = 0; i < leftArrLength; i++) {
  //   leftAuxiliaryArr[i] = arr[start + i]
  // }
  const leftAuxiliaryArr = Array.from({length: leftArrLength}, (_, index) => arr[index + start])
  // const rightAuxiliaryArr = new Array(rightArrLength)
  // for (let i = 0; i < rightArrLength; i++) {
  //   rightAuxiliaryArr[i] = arr[mid + 1 + i]
  // }
  const rightAuxiliaryArr = Array.from({length: rightArrLength}, (_, index) => arr[index + mid + 1])

  let i = 0, j = 0, k = start
  while (i <= leftArrLength || j <= rightArrLength) {
    if (i === leftArrLength) {
      while (j < rightArrLength) {
        arr[k++] = rightAuxiliaryArr[j++]
      }
    } else if (j === rightArrLength) {
      while (i < leftArrLength) {
        arr[k++] = leftAuxiliaryArr[i++]
      }
    } else {
      if (leftAuxiliaryArr[i] < rightAuxiliaryArr[j]) {
        arr[k++] = leftAuxiliaryArr[i++]
      } else {
        arr[k++] = rightAuxiliaryArr[j++]
      }
    }
  }
}

const mergeSort = (start, end, arr) => {
  if (start < end) {
    const mid = (start + end) / 2;
    mergeSort(start, mid, arr)
    mergeSort(mid + 1, end, arr)
    merge(start, mid, end, arr)
  }
}

