import _ from 'lodash'

//Kebab Case
//sony-bravia-51-inch-tv

console.log(_.kebabCase('SonyBravia51InchTv'))
console.log(_.kebabCase('Sony Bravia 51 Inch Tv'))
console.log(_.kebabCase('SonyBravia51 Inch Tv'))

//snake case
//sony_bravia_51_inch_tv

console.log(_.snakeCase('SonyBravia51InchTv'))
console.log(_.snakeCase('Sony Bravia 51 Inch Tv'))
console.log(_.snakeCase('SonyBravia51 Inch Tv'))

//camel case
//sonyBravia51InchTv
console.log(_.camelCase('Sony Bravia 51 Inch Tv'))
console.log(_.camelCase('Sony_Bravia-51Inch Tv'))

//startCase
// every first character of the words appear in capital letter
console.log(_.startCase('SonyBravia51InchTv'))
console.log(_.startCase('sony bravia 51 InchTv'))
console.log(_.startCase('sony_bravia-51 InchTv'))


// truncate
// gives the length of array including ...
const myString = 'My name is Rohit Kumar Yadav. I need a job.'
console.log(_.truncate(myString, { length: 24 }))
console.log(_.truncate(myString, { length: 24, separator: ' ' })) /* no half words would be shown */
console.log(_.truncate(myString, { length: 24, omission: '***' })) /* custom sign */



