#### <----------- SET ------------->
- will have only unique values
- uses array as initialization
- returns object, 
- traversal using forOf, forEach loop
- access in  same order of addition
- has() method is quicker than testing most of the elements that have previously been added to the set. Quicker than Array.includes() method

###### Methods in Set:
        set.add(value) – adds a value, returns the set itself.
        set.delete(value) – removes the value, returns true if value existed at the moment of the call, otherwise false.
        set.has(value) – returns true if the value exists in the set, otherwise false.
        set.clear() – removes everything from the set.
        set.size – is the elements count.
#### <---------- MAP ------------->
- will have only unique keys stored in it
- uses array of [key, value] for initialization

##### Methods in map:
        map.set(key, value) – stores the value by the key.
        map.get(key) – returns the value by the key, undefined if key doesn’t exist in map.
        map.has(key) – returns true if the key exists, false otherwise.
        map.delete(key) – removes the element (the key/value pair) by the key.
        map.clear() – removes everything from the map.
        map.size – returns the current element count. 

Note:

        i> Whenever told to optimize or efficient approach, think if map or set can be applied
        ii> map.has() or set.has() takes O(1) time complixity, so using it instead of Array.includes() which takes O(N)
            would increase the efficiency by taking less time and quicker result.
        iii> Count frequency, unique, duplicates, pair sum are common questions based on it.

<----------- Map vs Object ----------->

Both allow us to store collection of data in key-value pair. However, there are some important differences:

1. Datatypes used as keys.
    - Object can have only "string" or "symbols" as the keys.
    - Maps can have key of any data type. Unlike objects, keys are not converted to strings.
```
    e.g.
        const user1 = { name: "MG" };
        const user2 = { name: "Nirali" };
        const obj = {}; 
        obj[user1] = 234; 
        obj[user2] = 123;
        console.log(obj[user1]);

        const myMap = new Map();
        myMap.set(user1, 123);
        console.log( myMap.get(user1) );
```
> Note:

_Interview question._ Think of the scenario where you might find this useful. i.e. using object as key in Map


2. Displaying keys
    - Object follows certain rules for order.
        - Numbers are ordered first, and they are ordered within themselves from smallest to largest as long as they are >=0
        - Strings come second, and they are ordered within themselves by insertion order
        - Symbols come last, and they are ordered within themselves by insertion order

        _Note:_ JS will see if your string can be converted to a number - if it can, then it will order it with the numbers and not the strings.

        Reference link: https://dev.to/frehner/the-order-of-js-object-keys-458d

    - The iteration goes in the same order as the values were inserted. Map preserves this order, unlike a regular Object.
    ```
        e.g.
        const obj = {
            2: true, 
            1: true,
            '00': true,
            'b': true,
            'a': true,
            '3': true,
            '0': true,
            '-2': false
        }
        console.log(Object.keys(obj))
        for (const key in obj) {
            console.log(key)
        }

        myMap.set('dairyMilk', '1 packet');
        myMap.set('peda', '500g')
        myMap.set('lotteChocoPie', '2 packet')

        myMap.forEach((value, key) => {
            console.log(key + " = " + value)
        })
        
        for (let [key, value] of myMap) {
            console.log(key + " = " + value);
        }
    ```
3. Getting size
    - To get the size of object we need to count the keys using Object.keys()
    -  We can easily get the size of map by using its size property

4. Efficiency
    - Objects are not that efficient when there is frequent addition and removal of property.
    - Maps are Efficient in scenarios where we need frequent addition and deletion of key-value pair or property.

