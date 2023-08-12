
- All comparison operators return a boolean value:
- <,<=,>=,==, != triggers numeric conversion when comparison is between different types.
- A comparison result can be assigned to a variable, just like any value:
```
e.g.
let result = 5 > 4; 
console.log(result); 
```

#### String comparison
To see whether a string is greater than another, JavaScript uses the so-called “dictionary” or “lexicographical” order.
```
In other words, strings are compared letter-by-letter.

console.log('Z' > 'A');
console.log('Glow' > 'Glee');
console.log('Bee' > 'Be');
console.log('a' > 'Z');
```

#### Comparison of different types

_**NOTE:** When comparing values of different types, JavaScript converts the values to numbers._
