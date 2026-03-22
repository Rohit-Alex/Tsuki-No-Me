class MinHeap {
    constructor(defaultVal) {
        this.heap = defaultVal ?? []
    }
    getParentIdx(idx) {
        return Math.floor((idx - 1) / 2);
    }
    getLeftChildIdx(idx) {
        return 2 * idx + 1
    }
    getRightChildIdx(idx) {
        return 2 * idx + 2
    }
    insert(val) {
        this.heap.push(val)
        this.heapifyUp(this.heap.length - 1)
    }
    heapifyUp(idx) {
        while(idx > 0) {
            const parentEleIdx = this.getParentIdx(idx)
            if(this.heap[parentEleIdx] > this.heap[idx]) {
                // swap and repeat
                [this.heap[parentEleIdx], this.heap[idx]] = [this.heap[idx],this.heap[parentEleIdx]]
                idx = parentEleIdx;
            } else {
                // propery satisfied i.e. parent <= child
                break;
            }
        }
    }
    extract() {
        const length = this.heap.length;
        
        if(length === 0) return null
        const topEle = this.heap[0];
        
        // replace first and last element
        [this.heap[0], this.heap[length - 1]] = [this.heap[length - 1], this.heap[0]]
        this.heap.pop();
        
        this.heapifyDown(0)
        console.log(this.heap, 'before heapify dwn')
        return topEle
    }
    
    heapifyDown(idx) {
        const leftIdx = this.getLeftChildIdx(idx)
        const rightIdx = this.getRightChildIdx(idx)
        const totalEle = this.heap.length;
        let smallestIdx = idx;
        if(leftIdx < totalEle && this.heap[leftIdx] < this.heap[smallestIdx]) {
            smallestIdx = leftIdx
        }
        if(rightIdx < totalEle && this.heap[rightIdx] < this.heap[smallestIdx]) {
            smallestIdx = rightIdx
        }
        if(smallestIdx !== idx) {
            [this.heap[smallestIdx], this.heap[idx]] = [this.heap[idx], this.heap[smallestIdx]]
            this.heapifyDown(smallestIdx)
        }
    }
    
    peek() {
        if(this.heap.length <= 0) return null
        return this.heap[0]
    }
}
const minHeap1 = new MinHeap();
minHeap1.insert(5)
minHeap1.insert(20)
minHeap1.insert(4)
minHeap1.insert(10)
minHeap1.insert(1)
minHeap1.insert(0)
console.log(minHeap1.heap, 'heap')
console.log(minHeap1.extract())
console.log(minHeap1.extract())

console.log(minHeap1.heap)


// Heap Sort (in ASC Order => using Max Heap)
const unsortedArr = [2, 3, 21, 10, 7, 9, 1, 8, 5, 1, 3]
function heapSort(arr) {
    const n = arr.length;
    
    // create a maxHeap
    for(let i = n - 1; i >= 0; i--) {
        heapifyDown(arr, i, n)
    }
    
    // sort
    for(let i = n - 1; i > 0; i--) {
        //swap first and last element for considered array(heap)
        // heap length keeps decreasing by 1 from last
        [arr[0], arr[i]] = [arr[i], arr[0]]
        heapifyDown(arr, 0, i)
    }
}
function heapifyDown(arr,i, n) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if(left < n && arr[left] > arr[largest]) {
        largest = left
    }
    if(right < n && arr[right] > arr[largest]) {
        largest = right
    }
    
    if(largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]]
        heapifyDown(arr, largest, n)
    }
}
heapSort(unsortedArr)
console.log(unsortedArr)
