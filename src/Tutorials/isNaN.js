/*
    * isNaN() => It converts the given parameter into number and tests for whether it is NaN or not.
    !  Number.isNaN() doesn't attempt to convert the parameter to a number. Returns true if it is NaN else false.
*/

Number.isNaN("NaN"); 
Number.isNaN(undefined);
Number.isNaN({});
Number.isNaN("Your grace");
Number.isNaN(true);
Number.isNaN(null);
Number.isNaN("37");
Number.isNaN("37.37");
Number.isNaN("");
Number.isNaN(" ");

Number.isNaN(NaN)
Number.isNaN(2)

// Remember: Number.isNaN(NaN) => Only this gives true, rest all gives false


isNaN("NaN"); // => true
isNaN(undefined);  // => true
isNaN({}); // => true
isNaN("blabla") // => true
isNaN(true); // => false
isNaN(null); // => false
isNaN("37"); // => false
isNaN("37.37"); // => false
isNaN(""); // => false
isNaN(" "); // => false

/*
    ?? isNaN() coerces its parameter to a number
    ?? Number.isNaN() doesn't attempt to convert the parameter to a number, so non-numbers always return false
*/
