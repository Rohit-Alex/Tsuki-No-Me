# Variable Shadowing

## Definition

Variable shadowing in JavaScript occurs when a variable declared in an inner scope has the same name as a variable declared in an outer scope. The variable in the inner scope "shadows" or hides the variable in the outer scope, making it inaccessible within the inner scope.

```javascript
let x = 10;
function foo() {
  let x = 5;
  console.log(x);
}
foo();
console.log(x);
```

<details>
<summary>Show Answer</summary>

```
5
10
```

**Explanation:** The inner `x` shadows the outer `x` within the function scope, but doesn't affect the outer variable.

</details>

## Illegal Shadowing
- We can shadow `var` variable by `let` variable but cannot do the opposite. So, if we try to shadow `let` variable by `var` variable, it is known as **Illegal Shadowing** and it will give the error as _variable is already defined._

- The reason being `let` has blocked scope and `var` has functional scope. If something of same name is already accessible and within the scope then how can we re-declare a variable with same name.

```javascript
function func() {
	var a = 'Geeks';
	let b = 'Geeks';
	
	if (true) {
		let a = 'GeeksforGeeks'; 
		console.log(a);
		var b = 'Geeks';
		console.log(b);
	}
}
func();
```

<details>
<summary>Show Answer</summary>

```
SyntaxError: Identifier 'b' has already been declared
```

**Explanation:** 
- `let a = 'GeeksforGeeks'` is **legal shadowing** because we can shadow a `var` with `let`
- `var b = 'Geeks'` is **illegal shadowing** because we cannot shadow a `let` with `var` in the same scope
- **Note:** The error occurs before any `console.log` statements execute

</details>