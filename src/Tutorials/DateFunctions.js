import { format, isExists, parse } from "date-fns"

/*
    d -> day of month
    M -> month of the year
    y -> year
    D -> day of year
    m -> minutes
    e -> day of week (Starts from sunday)
    i -> day of week (Starts from Monday)
    q -> quarter

    x -> normal ----> 1, 2, ..., 12, 13
    xo -> th -----> 1st, 2nd, ...11th,
    xx -> 01, 02,...,13, 14
    xxx -> three letters word
    xxxx -> full word
*/
const today = new Date()

//formatters
console.log(today) // Sat Mar 19 2022 14: 46: 49 GMT + 0530(India Standard Time)
console.log(format(today, 'dd/MM/yyyy')) // 19/03/2022 
console.log(format(today, 'dd MMM yyyy')) // 19 Mar 2022
console.log(format(today, 'eee, dd MMM yyyy')) // Sat, 19 Mar 2022
console.log(format(today, 'eeee, dd MMMM yyyy hh:mm:ss aa'))  // Saturday, 19 March 2022 02:43:53 PM 
console.log(format(today, 'ee, dd MMMM yyyy hh:mm:ss aa')) // 07, 19 March 2022 02:59:45 PM
console.log(format(today, 'ii, dd MMMM yyyy HH:mm:ss')) // 06, 19 March 2022 15:03:24 

// check valid dates
/*
    args1 -> year
    args2 -> month (Jan -> 0)
    args3 -> date
*/
console.log(isExists(2029, 0, 22)) // true
console.log(isExists(2029, 12, 22)) // false since month => 0 -> 11

console.log(parse(format(today, 'eeee, dd MMMM yyyy hh:mm:ss aa')))