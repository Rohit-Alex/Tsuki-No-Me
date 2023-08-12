#### Variable shadowing:
- In JavaScript occurs when a variable declared in an inner scope has the same name as a variable declared in an outer scope. 
- The variable in the inner scope "shadows" or hides the variable in the outer scope, making it inaccessible within the inner scope.

```
let x = 10;
function foo() {
  let x = 5;
  console.log(x); // Output: 5
}
foo();
console.log(x); // Output: 10
```
#### Illegal Shadowing:
- We can shadow var variable by let variable but cannot do the opposite. So, if we try to shadow let variable by var variable, it is known as Illegal Shadowing and it will give the error as “variable is already defined.” 

- The reason being let has blocked scope and var has functional scope. If something of same name is already accessible and within the scope then how can we re-declare a variable with same name.

```
function func() {
	var a = 'Geeks';
	let b = 'Geeks';
	
	if (true) {
		let a = 'GeeksforGeeks'; // Legal Shadowing
		var b = 'Geeks'; // Illegal Shadowing
		console.log(a); // It will print 'GeeksforGeeks'
		console.log(b); // It will print error
	}
}
func();
```