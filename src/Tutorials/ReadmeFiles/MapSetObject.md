<----------- SET ------------->
    will have only unique values
    uses array as initialization
    returns object, 
    traversal using forOf, forEach loop
    access in  same order of addition
    has() method is quicker than testing most of the elements that have previously been added to the set. Quicker than Array.includes

    Methods in Set:
        set.add(value) – adds a value, returns the set itself.
        set.delete(value) – removes the value, returns true if value existed at the moment of the call, otherwise false.
        set.has(value) – returns true if the value exists in the set, otherwise false.
        set.clear() – removes everything from the set.
        set.size – is the elements count.
               
<---------- MAP ------------->
    will have only unique keys stored in it
    uses array of [key, value] for initialization

    Methods in map:
        map.set(key, value) – stores the value by the key.
        map.get(key) – returns the value by the key, undefined if key doesn’t exist in map.
        map.has(key) – returns true if the key exists, false otherwise.
        map.delete(key) – removes the element (the key/value pair) by the key.
        map.clear() – removes everything from the map.
        map.size – returns the current element count. 

Note:-> 
        i> Whenever told to optimize or efficient approach, think if map or set can be applied
        ii> map.has() or set.has() takes O(1) time complixity, so using it instead of Array.includes() which takes O(N)
            would increase the efficiency by taking less time and quicker result.
        iii> Count frequency, unique, duplicates, pair sum are common questions based on it.

<----------- Map vs Object ----------->

Both allow us to store collection of data in key-value pair. However, there are some important differences:

i> 
    a> Object can have only "string" or "symbols" as the keys.
    b> Maps can have key of any data type. Unlike objects, keys are not converted to strings.

    e.g.
        const user2 = { name: "Nirali" };
        const obj = {}; 
        obj[user1] = 234; 
        obj[user2] = 123;
        console.log(obj[user1]);

        const user1 = { name: "MG" };
        const myMap = new Map();
        myMap.set(user1, 123);
        console.log( myMap.get(user1) );

    Note: Interview question. Think of the scenario where you might find this useful. i.e. using object as key

ii> 
    a> It follows certain rules for order.
        1> Numbers are ordered first, and they are ordered within themselves from smallest to largest as long as they are >=0
        2> Strings come second, and they are ordered within themselves by insertion order
        3> Symbols come last, and they are ordered within themselves by insertion order

        Note: JS will see if your string can be converted to a number - if it can, then it will order it with the numbers and not the strings.

        Reference link: https://dev.to/frehner/the-order-of-js-object-keys-458d
    b> The iteration goes in the same order as the values were inserted. Map preserves this order, unlike a regular Object.

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
iii>
    a> To get the size of object we need to count the keys using Object.keys()
    b> We can easily get the size of map by using its size property

iv> 
    a> Not that efficient when there is frequent addition and removal of property.
    b> Efficient in scenarios where we need frequent addition and deletion of key-value pair or property.

