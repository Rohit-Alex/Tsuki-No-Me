const groupObj1 = {
    rohit: {
        surname: 'yadav',
        age: 23
    },
    nirali: {
        surname: 'bhalodiya',
        age: 24
    },
    mg: {
        surname: 'grace',
        age: 24
    },
    alex: {
        surname: 'mason',
        age: 23
    }
}

const op = Object.keys(groupObj1).reduce((acc, curr) => {
    acc[groupObj1[curr].age] = { ...acc[groupObj1[curr].age], [curr]: groupObj1[curr] }
    return acc
}, {})

console.log(op)

const obj2 = [
    {
        name: 'Jim',
        color: 'blue',
        age: 22,
    },
    {
        name: 'Sam',
        color: 'blue',
        age: 33,
    },
    {
        name: 'Eddie',
        color: 'green',
        age: 77,
    },
];

const op2 = obj2.reduce((acc, curr) => {
    acc[curr.color] = [...(acc[curr.color] || []), curr]
    return acc
}, {})

console.log(op2)
