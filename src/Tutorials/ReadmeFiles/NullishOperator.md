#### The nullish coalescing (??) operator is a logical operator that returns its right-hand side operand when its left-hand side operand is null or undefined.
```
const nullValue = null;
const emptyText = "";
const someNumber = 42;
const number0 = 0
const booleanValue = false


console.log(nullValue ?? "Ticket kar de"); 
console.log(emptyText ?? "Delhi aa"); 
console.log(someNumber ?? 0);
console.log(number0 ?? 24);
console.log(booleanValue ?? '2lakh bhej');

console.log(nullValue || "Ticket kar de"); 
console.log(emptyText || "Delhi aa"); 
console.log(someNumber || 0);
console.log(number0 || 24);
console.log(booleanValue || '2lakh bhej');
```