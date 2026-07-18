# Call, Apply, and Bind Methods

## Definition

These methods are used for **function borrowing** - they allow us to change the context of the invoking function. In short, we can change the reference of **`this`** value inside the function.

The function is called with **`this`** being referred to the first argument being passed to it.

## Sample Objects

```javascript
const obj = {
    firstName: 'Rohit',
    surname: 'Yadav',
    age: 23,
    fullNameArrow: () => {
        return `My name is ${this.firstName} ${this.surname}`
    },
    fullNameRegular: function (hobby) {
        return `My name is ${this.firstName} ${this.surname}. \nMy hobby is ${hobby}.`
    }
}

const obj1 = {
    firstName: 'Amane',
    surname: 'Ubuyashiki',
    age: 24
}

const favSeries = function (seriesname, nickName) {
    return `${this.firstName}'s favourite series is ${seriesname}.${nickName ? `\nPeople call me ${nickName}` : ''}`
}
```

## 1. Call Method

### Definition
**Call** calls a function with the value of `this` being referred to as the first argument. Additional arguments are provided individually.

### Characteristics:
- Function is called with reference of `this` being passed as the first argument
- **Executes the function immediately**
- Arguments are provided **individually**

### Question 1

What will be the output of these call method examples?

```javascript
console.log(obj.fullNameRegular('listening songs'));
console.log(obj.fullNameRegular.call(obj1, 'modelling'));
console.log(favSeries.call(obj, 'GOT'));
console.log(favSeries.call(obj1, 'After', 'Ubuyashiki'));
```

<details>
<summary>Show Answer</summary>

```
My name is Rohit Yadav. 
My hobby is listening songs.

My name is Amane Ubuyashiki. 
My hobby is modelling.

Rohit's favourite series is GOT.

Amane's favourite series is After.
People call me Ubuyashiki
```

**Explanation:** 
- First call uses `obj` as `this` context naturally
- Second call uses `obj1` as `this` context via `.call()`
- Third and fourth calls use the standalone `favSeries` function with different `this` contexts

</details>

## 2. Apply Method

### Definition
**Apply** is quite similar to the Call method. The only difference is that the additional arguments need to be passed in an **array**.

### Characteristics:
- Function is called with reference of `this` being passed as the first argument
- **Executes the function immediately**
- Arguments are provided in an **array**

### Question 2

What will be the output of these apply method examples?

```javascript
console.log(favSeries.apply(obj, ['GOT']));
console.log(favSeries.apply(obj1, ['After', 'Ubuyashiki']));
```

<details>
<summary>Show Answer</summary>

```
Rohit's favourite series is GOT.

Amane's favourite series is After.
People call me Ubuyashiki
```

**Explanation:** Apply works exactly like call, but arguments are passed as an array instead of individually.

</details>

## 3. Bind Method

### Definition
**Bind** is quite similar to the Call method. The only difference is that it **creates a new function** and doesn't call the function immediately.

### Characteristics:
- Creates a **new function** with `this` bound to the first argument
- **Does NOT execute immediately** - returns a new function
- Arguments are provided **individually** (like call)

### Question 3

What will be the output of these bind method examples?

```javascript
const bindFun1 = favSeries.bind(obj, 'GOT');
const bindFun2 = favSeries.bind(obj1, 'After', 'Ubuyashiki');
console.log(bindFun1());
console.log(bindFun2());
```

<details>
<summary>Show Answer</summary>

```
Rohit's favourite series is GOT.

Amane's favourite series is After.
People call me Ubuyashiki
```

**Explanation:** Bind creates new functions with pre-bound `this` context and arguments. These functions need to be called later to execute.

</details>

## Method Comparison

| Method | Execution | Arguments | Returns |
|--------|-----------|-----------|---------|
| **call()** | Immediate | Individual | Function result |
| **apply()** | Immediate | Array | Function result |
| **bind()** | Deferred | Individual | New function |

## Arrow Functions Limitation

### Question 4

What will be the output when using call/apply/bind with arrow functions?

```javascript
console.log(obj.fullNameArrow());
console.log(obj.fullNameArrow.call(obj1));
```

<details>
<summary>Show Answer</summary>

```
My name is undefined undefined
My name is undefined undefined
```

**Explanation:** Arrow functions do NOT work with `this` manipulation. They inherit `this` from their lexical scope and cannot be changed by call, apply, or bind.

</details>

## Practical Examples

### Question 5

What will be the output?

```javascript
const person1 = {
    name: 'Alice',
    greet: function(greeting, punctuation) {
        return `${greeting}, I'm ${this.name}${punctuation}`;
    }
};

const person2 = {
    name: 'Bob'
};

console.log(person1.greet('Hello', '!'));
console.log(person1.greet.call(person2, 'Hi', '.'));
console.log(person1.greet.apply(person2, ['Hey', '?']));

const boundGreet = person1.greet.bind(person2, 'Greetings');
console.log(boundGreet('!!!'));
```

<details>
<summary>Show Answer</summary>

```
Hello, I'm Alice!
Hi, I'm Bob.
Hey, I'm Bob?
Greetings, I'm Bob!!!
```

**Explanation:** 
- Normal method call uses `person1` as `this`
- Call and apply both use `person2` as `this` with different argument passing styles
- Bind creates a new function with `person2` as `this` and 'Greetings' pre-bound as first argument

</details>

### Question 6

What happens in this function borrowing example?

```javascript
const calculator = {
    value: 0,
    add: function(num) {
        this.value += num;
        return this;
    },
    multiply: function(num) {
        this.value *= num;
        return this;
    },
    getValue: function() {
        return this.value;
    }
};

const anotherObject = { value: 10 };

console.log(calculator.getValue());
console.log(calculator.add.call(anotherObject, 5));
console.log(anotherObject.value);
console.log(calculator.getValue());
```

<details>
<summary>Show Answer</summary>

```
0
{ value: 15 }
15
0
```

**Explanation:** 
- `calculator.getValue()` returns its own value (0)
- `calculator.add.call(anotherObject, 5)` borrows the add method and applies it to `anotherObject`
- `anotherObject.value` is now modified to 15
- `calculator.getValue()` is still 0 (unchanged)

</details>

## Use Cases

1. **Function Borrowing**: Using methods from one object on another
2. **Setting Context**: Explicitly controlling what `this` refers to
3. **Partial Application**: Pre-setting some arguments with bind
4. **Array-like Objects**: Using array methods on array-like objects

### Example: Array Methods on Array-like Objects

```javascript
function example() {
    // 'arguments' is array-like but not a real array
    const argsArray = Array.prototype.slice.call(arguments);
    return argsArray;
}
```

## Key Takeaways

1. **Call**: Immediate execution, individual arguments
2. **Apply**: Immediate execution, array arguments  
3. **Bind**: Returns new function, individual arguments
4. **All three** allow changing the `this` context
5. **Arrow functions** cannot be bound - they ignore call/apply/bind for `this`
6. **Use cases** include function borrowing and context control
7. **Modern alternative**: Use spread operator with apply: `func(...args)`

## Best Practices

1. **Use call** when you have individual arguments and want immediate execution
2. **Use apply** when you have arguments in an array and want immediate execution
3. **Use bind** when you want to create a reusable function with fixed context
4. **Avoid with arrow functions** - they won't behave as expected
5. **Consider modern alternatives** like spread operator for cleaner syntax