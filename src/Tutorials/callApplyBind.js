const obj = {
    firstName: 'Rohit',
    surname: 'Yadav',
    age: 23,
    fullNameArrow: () => {
        return `My name is ${this.firstName} ${this.surname}`
    },
    fullNameRegular: function (hobby) {
        return `My name is ${this.firstName} ${this.surname}. \nMy hobby is ${hobby}.`
    }
}

const obj1 = {
    firstName: 'Nirali',
    surname: 'Bhalodiya',
    age: 24
}

const favSerires = function (seriesname, nickName) {
    return `${this.firstName}'s favourite series is ${seriesname}.${nickName ? `\nPeople call me ${nickName}` : ''}`
}

//Call
console.log(obj.fullNameRegular('listening songs'))
console.log(obj.fullNameRegular.call(obj1, 'modelling'))
console.log(favSerires.call(obj, 'GOT'))
console.log(favSerires.call(obj1, 'After', 'Namooni'))

//Apply
console.log(favSerires.apply(obj, ['GOT']))
console.log(favSerires.apply(obj1, ['After', 'Namooni']))

// Bind
const bindFun1 = favSerires.bind(obj, 'GOT')
const bindFun2 = favSerires.bind(obj1, 'After', 'Namooni')
console.log(bindFun1())
console.log(bindFun2())

//Arrow functions does not work while working with this operator
console.log(obj.fullNameArrow())
