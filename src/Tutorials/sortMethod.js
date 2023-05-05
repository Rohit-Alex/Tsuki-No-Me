/*
    Default sorting order is Ascending.
    Default functionality: converting the elements into strings, then comparing their sequences of UTF-16 code units values.
*/
const strArr = ['caterpilar', 'ape', 'zebra', 'cat', 'Albatross', 'donkey']
strArr.sort()
console.log(strArr)

const numArr = [ 5, 1, 1998, 24, 1999];
numArr.sort();
console.log(numArr);

function compare(a, b) {
    /* must return a number 

      
        * if returned  > 0 => b comes first  
            a > b => a - b => Greater than 0 => b comes first

        * if returned  < 0 => a comes first
            a < b => a - b => less than 0 => a comes first

        * if returned number === 0 => no change
            a = b => a - b => 0 => no change 
    */
    return a - b
}

numArr.sort(compare);
numArr.sort((a, b) => a - b);
console.log(numArr);

/* 
    First -> 24 (no matter what)
    Second -> 1 (no matter what)
    baaki left order ascending order mein
*/
numArr.sort((a, b) => {
    if (a === 24 || a === 1) {
        return -1
    }
    if (b === 24 || b === 1) {
        return 1
    }
    return a - b
});


const makeupItems = [
    {
        type: 'Nail polish',
        quantity: 20
    },
    {
        type: 'Lipstick',
        quantity: 14,
    },
    {
        type: 'Butterfly clips',
        quantity: 8,
    },
    {
        type: 'brushes',
        quantity: 16,
    },
      {
        type: 'Foundation',
        quantity: 8,
    },
]

// Sort this on the basis of quantity
// Sort on the basis of quantity but if same quantity then sort on the basis of type in alphabetical order



makeupItems.sort((a, b) => {
    if (a.quantity !== b.quantity) { // sort by quantity if they're different
        return b.quantity - a.quantity;
    } else { // if quantities are the same, sort by type length
        return a.type.length - b.type.length;
    }

    // or in single line
    return b.quantity - a.quantity || a.type.length - b.type.length
})

/*
    <<<<<------------ Random Fn ----------->>>>

    Math.random() => Generates random no >= 0 and < 1.
    As it returns floating numbers, so we need to use Math.floor() or Math.ceil()

*/
const rand1 = Math.random() // [0, 0.999]
const rand2 = Math.floor(Math.random() * 5) // [0, 4]
const rand3 = Math.ceil(Math.random() * 5) // [0, 5]

// Generate a number between min(inclusive) and max(exclusive)
const rand4 = Math.floor(Math.random() * (max - min) + min)
const rand5 = Math.floor(Math.random() * (max - min + 1) + min)


// Rearrange the array in a random order.
const yourNature = ['Patience', 'persistent', 'Innocence', 'Childish', 'Kanjoos', 'hot-headed', 'pessimistic']
const arrangeRandomly = () => {
    yourNature.sort(() => Math.random() - 0.5);
    console.log(yourNature)
}
arrangeRandomly()