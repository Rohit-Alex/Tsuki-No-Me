/*
    These methods are used for function borrowing i.e. allows us to change the context of the invoking function.
    In short, We can change the reference of "this" value inside the function.
    The function is called with "this" being referred to the first argument being passed to it.

*/

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
    firstName: 'Amane',
    surname: 'Ubuyashiki',
    age: 24
}

const favSerires = function (seriesname, nickName) {
    return `${this.firstName}'s favourite series is ${seriesname}.${nickName ? `\nPeople call me ${nickName}` : ''}`
}

/*
     CALL :-> i> The function is called with reference of "this" being passed as the first argument. It can have other arguments which are provided individually.
             ii> It executes the function there itself.

             One liner Definition: It calls a function with value of "this" being referred as the first argument and here arguments are provided individually.
*/

//Call
console.log(obj.fullNameRegular('listening songs'))
console.log(obj.fullNameRegular.call(obj1, 'modelling'))
console.log(favSerires.call(obj, 'GOT'))
console.log(favSerires.call(obj1, 'After', 'Ubuyashiki'))

/*
     APPLY :-> i> Quite similar to Call method. Only difference is that the rest arguments needs to passed in an array. 
               ii> It's also executes the function there itself.

             One liner Definition: It calls a function with value of "this" being referred as the first argument and the rest arguments needs to passed in an array.
*/

//Apply
console.log(favSerires.apply(obj, ['GOT']))
console.log(favSerires.apply(obj1, ['After', 'Ubuyashiki']))

/*
     Bind :-> i> Quite similar to Call method. Only difference is that it creates a new function and doesn't call the function there itself.

             One liner Definition: It creates a new function with value of "this" being referred as the first argument and the rest arguments are passed individually.
*/

// Bind
const bindFun1 = favSerires.bind(obj, 'GOT')
const bindFun2 = favSerires.bind(obj1, 'After', 'Ubuyashiki')
console.log(bindFun1())
console.log(bindFun2())

//Arrow functions does not work while working with this operator
console.log(obj.fullNameArrow())
