setTimeout(() => {
    console.log("Excited for flight!")
}, 200)
const y = () => {
    console.log('y')
}
const x = () => {
    console.log('x')
    y()
}
x()