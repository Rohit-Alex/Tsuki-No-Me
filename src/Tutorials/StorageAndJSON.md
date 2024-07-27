#### STORE DATA IN SYSTEM STORAGE IN THE FORM OF KEY VALUE PAIR

##### SESSION STORAGE: 
- The value is stored for that tab only and mapped with the url (url origin). 
- Reloading/Hard Reloading the same tab within the same window makes the data persists.
- Opening the same page or page url in a new tab or a new window or closing and reopening the tab, looses data.
- Duplicating a tab copies the tab's sessionStorage into the new tab.
- A page session lasts as long as the tab or the browser is open, and survives over page reloads and restores.
- Opening multiple tabs/windows with the same URL creates sessionStorage for each tab/window and removes data.
- Closing a tab/window ends the session and clears objects in sessionStorage.

##### LOCAL STORAGE:
- Once set, the data is mapped to the url(url origin) and accessible even a full browser restart, no matter whether it's the same tab or window. No expiry time.
- Reload / Hard Reload still makes the data persists.
- Even if you open the page in a new tab, or new window (of same browser), closing and re-open the same page, the data still persists.
- e.g. In a particular website or remote url store local storage and session storage both and try opening the same url in new tab, reloading/hard reloading the existing tab and opening in new window.
    
###### If you open the page in a private window(incognito mode) or different browser, data won't persist.
##### <<<<------------------- METHODS ----------------------->>>>

    * setItem(key, value) - set key/value pair.
    * getItem(key) - get the value stored for that key.
    * removeItem(key) - remove a particular key.
    * clear() – delete everything.

**NOTE:**
1. Both key and value must be strings. If they were any other type, like a number, or an object, they would get converted to a string automatically.
2. If key is not found then we get null.
3. Storing and Accessing data.
    -  If we want to store arrays and objects as value then since by default it gets converted to strings so we would have to use JSON.stringify() to store and JSON.parse() while accessing.
    - We need to parse the data while accessing the key in storage whose value is array/objects/boolean. 
    ```
    JSON.parse(localStorage.getItem(SOME_KEY)) (Provided stored value is array/object/boolean)
    ```
    - No need to parse when the stored value is string. This will throw error
4. **Agar ye samajh nhi aa rha ki kab parse karna access ke time aur kab stringify karna storing ke time toh. Always, stringify while storing and always parse while accessing.**
    ```
        sessionStorage.setItem('key', JSON.stringify(valueOfAnyDatatype))
        JSON.parse(sessionStorage.getItem('key'))
    ```


 ##### Local storage vs Cookies

- **Data capacity:** LocalStorage can store more data (up to 5-10MB) than cookies (up to 4KB).

- **Expiration:** Cookies have an expiration date and can be set to expire after a certain time, while LocalStorage does not have an expiration date and will remain in the browser until it is manually cleared or the user clears their browser data.

- **Accessibility:** LocalStorage data can only be accessed by the domain that stored it, while cookies can be accessed by both the domain that stored them and other domains that the user visits.
            *  e.g. If the domain uses some iframe to open any other website then there also cookies are accessible but local storage is not.


##### <<<-------------------- JSON ------------------------>>>
```
* JSON.stringify to convert objects into JSON (basically strings / plain data). Everything gets wrapped in "" (double quotes) must condition for JSON
* JSON.parse to convert JSON back into the original value.
* NOTE: JSON.stringify() can be applied to all datatypes (number/string/boolean/arrays/null/objects)

syntax: JSON.strigify(obj, arrOfKeysToGet, spacesToIndent)
        * 1st argument is required (the one to be stringified)
        * arrOfKeysToGet -> Optional argument that signifies which all keys to get in the result
        * spacesToIndent -> For formatting the spaces. 


JSON.stringify(2) // "2"
JSON.stringify(true) // "true"
JSON.stringify(null) // "null"
JSON.stringify(undefined) // undefined NOTE: stringify doesn't work in undefined. Returns undefined
JSON.stringify(['paisa', 'paisa', 'paisa']) // '["paisa","paisa","paisa"]'
const objExp = { 
  goal: 'Get rich', 
  interest: ['Get', 'rich'], 
  plan: {
    planA: 'Get rich',
    planB: "Marry Amane's fantisied rich person"
  },  
  carPrice: 6*1e7 
}
JSON.stringify(objExp) // '{"goal":"Get rich","interest":["Get","rich"],"plan":{"planA":"Get rich","planB":"Marry Amane's fantisied rich person"},"carPrice":60000000}'


// Using addition arguments of JSON.stringify
let room = {
  number: 23
};

let meetup = {
  title: "Conference",
  participants: [{name: "John"}, {name: "Alice"}],
  place: room
};

console.log(JSON.stringify(meetup, ['title', 'participants', 'place', 'name', 'number'], 2));

// PARSING

JSON.parse(null) // null
JSON.parse(undefined) // invalid JSON
JSON.parse('false') // false
JSON.parse('true') // true
JSON.parse('Eren') // invalid JSON
JSON.parse('[24, 1, "DOB"]'); // [24, 1, 'DOB']
JSON.parse('{"name": "Amane", "age": 25}') // { name: 'Amane', age: 25}

// STORING & ACCESSING from Application storage

sessionStorage.setItem('numberKey', 24)
sessionStorage.setItem('stringKey', 'Amane')
sessionStorage.setItem('booleanKey', false)
sessionStorage.setItem('arrayKey', ['no', 9, 'know'])
sessionStorage.setItem('objectKey', {key: 'some value'})

sessionStorage.getItem('numberKey')
sessionStorage.getItem('stringKey')
JSON.parse(sessionStorage.getItem('booleanKey'))
JSON.parse(sessionStorage.getItem('arrayKey'))
JSON.parse(sessionStorage.getItem('objectKey'))