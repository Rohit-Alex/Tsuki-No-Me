COERCION:
Type coercion is the process of converting value from one type to another (such as string to number, object to boolean, and so on). Any type, be it primitive or an object, is a valid subject for type coercion.

Explicit Type Coversion: Forcefully conversion of one type into another. We can do so by writing the Datatype followed by wrapping the variable within parenthesis(). 

Implicit Type Coversion: The coversion takes on it's own automatically without user's knowledge.

NOTE:

One operator that does not trigger implicit type coercion is ===, which is called the strict equality operator. The loose equality operator == on the other hand does both comparison and type coercion if needed.

STRING CONVERSIONS:
Implicit coercion is triggered by the binary + operator, when any operand is a string:

Numeric conversion:
1> Triggered by comparison operators (>, <, <=,>=)
2> bitwise operators ( | & ^ ~)
3> arithmetic operators (- + * / % ). Note, that binary+ does not trigger numeric conversion, when any operand is a string.
4> unary + operator
5> loose equality operator == (incl. !=).
Note that == does not trigger numeric conversion when both operands are strings.

Number(null)                   // 0
Number(undefined)              // NaN
Number(true)                   // 1
Number(false)                  // 0
Number(" 12 ")                 // 12
Number("-12.34")               // -12.34
Number("\n")                   // 0
Number(" 12s ")                // NaN
Number(123)                    // 123
Number([])				 // 0
Number({})				// NaN

Exceptions: 
1> null and undefined equal each other and don’t equal anything else. 


