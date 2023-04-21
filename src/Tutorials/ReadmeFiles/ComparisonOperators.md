COMPARISON OPERATORS

-> All comparison operators return a boolean value:

-> A comparison result can be assigned to a variable, just like any value:
e.g.
let result = 5 > 4; 
alert( result ); 

String comparison
To see whether a string is greater than another, JavaScript uses the so-called “dictionary” or “lexicographical” order.

In other words, strings are compared letter-by-letter.

alert( 'Z' > 'A' ); // true
alert( 'Glow' > 'Glee' ); // true
alert( 'Bee' > 'Be' ); // true

Comparison of different types
When comparing values of different types, JavaScript converts the values to numbers.

For example:

alert( '2' > 1 ); // true, string '2' becomes a number 2
alert( '01' == 1 ); // true, string '01' becomes a number 1


let a = 0;
alert( Boolean(a) ); 

let b = "0";
alert( Boolean(b) );

alert(a == b);

NOTE: 
null and undefined equal each other and don’t equal anything else. 

alert( null > 0 );  
alert( null == 0 ); 
alert( null >= 0 ); 