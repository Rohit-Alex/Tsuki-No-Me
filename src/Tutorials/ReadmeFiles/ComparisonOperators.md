COMPARISON OPERATORS

-> All comparison operators return a boolean value:
-> ,<,<=,>=,==, != triggers numeric conversion when comparison is between different types.
-> A comparison result can be assigned to a variable, just like any value:
e.g.
let result = 5 > 4; 
alert( result ); 

String comparison
To see whether a string is greater than another, JavaScript uses the so-called “dictionary” or “lexicographical” order.

In other words, strings are compared letter-by-letter.

alert( 'Z' > 'A' );
alert( 'Glow' > 'Glee' );
alert( 'Bee' > 'Be' );
alert( 'a' > 'Z' );


Comparison of different types
NOTE: When comparing values of different types, JavaScript converts the values to numbers.





