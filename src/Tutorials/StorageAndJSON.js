/*
    STORE DATA IN SYSTEM STORAGE IN THE FORM OF KEY VALUE PAIR

    SESSION STORAGE: 
        * -> the value is stored for that tab only and mapped with the url (origin). 
        *    Opening same url in another tab or closing and reopening tab or opening in new tab looses data.
        *    Reloading the same tab within the same window makes the data persists.
        
            A page session lasts as long as the tab or the browser is open, and survives over page reloads and restores.
            Opening a page in a new tab or window creates a new session and data is removed.
            Opening multiple tabs/windows with the same URL creates sessionStorage for each tab/window and removes data.
            Duplicating a tab copies the tab's sessionStorage into the new tab.
            Closing a tab/window ends the session and clears objects in sessionStorage.

    LOCAL STORAGE:
        * -> Once set the data is mapped to the url and accessible even a full browser restart 
             no matter whether it's the same tab or window. No expiry time.
    
    * e.g. In a particular website or remote url store local storage and session storage both and 
             try opening the same url in new tab, reloading the existing tab and opening in new window.
    
    <<<<------------------- METHODS ----------------------->>>>

    * setItem(key, value) - set key/value pair.
    * getItem(key) - get the value stored for that key.
    * removeItem(key) - remove a particular key.
    * clear() – delete everything.
     
    ? NOTE: Please note that both key and value must be strings.
    ?       If they were any other type, like a number, or an object, they would get converted to a string automatically:
    ?       If we want to store arrays and objects as value then since by default it gets converted to strings so we would use JSON.stringify() to store and JSON.parse() to access
    ?       If key is not found then we get null.
    ?       Always parse the data while accessing the key in storage whose value is array/objects/boolean. e.g. JSON.parse(localStorage.getItem(SOME_KEY))
    ?       No need to parse when the stored value is string. This will throw error
*/

/*
  ? Local storage vs Cookies

* Data capacity: LocalStorage can store more data (up to 5-10MB) than cookies (up to 4KB).

* Expiration: Cookies have an expiration date and can be set to expire after a certain time, while LocalStorage does not have an expiration date and will remain in the browser until it is manually cleared or the user clears their browser data.

* Accessibility: LocalStorage data can only be accessed by the domain that stored it, while cookies can be accessed by both the domain that stored them and other domains that the user visits.
            *  e.g. If the domain uses some iframe to open any other website then there also cookies are accessible but local storage is not.
*/



/*
        <<<-------------------- JSON ------------------------>>>

        * JSON.stringify to convert objects into JSON (basically strings / plain data). Everything gets wrapped in "" (double quotes) must condition for JSON
        * JSON.parse to convert JSON back into an object.
         
        
        ? NOTE: JSON.stringify() can be applied to all datatypes (number/string/boolean/arrays/null/objects)

        syntax: JSON.strigify(obj, arrOfKeysToGet, spacesToIndent)

        *only 1st argument is required (the one to be stringified)
        * arrOfKeysToGet -> Optional argument that signifies which all keys to get in the result
        * spacesToIndent -> For formatting the spaces. 
*/

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
    planB: "Marry Nirali's fantisied rich person"
  },  
  carPrice: 6*1e7 
}
JSON.stringify(objExp) // '{"goal":"Get rich","interest":["Get","rich"],"plan":{"planA":"Get rich","planB":"Marry Nirali's fantisied rich person"},"carPrice":60000000}'


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
JSON.parse('MG') // invalid JSON
JSON.parse('[24, 1, "DOB"]'); // [24, 1, 'DOB']
JSON.parse('{"name": "Nirali", "age": 25}') // { name: 'Nirali', age: 25}

// STORING & ACCESSING from Application storage

sessionStorage.setItem('numberKey', 24)
sessionStorage.setItem('stringKey', 'Nirali')
sessionStorage.setItem('booleanKey', false)
sessionStorage.setItem('arrayKey', ['no', 9, 'know'])
sessionStorage.setItem('objectKey', {key: 'some value'})

sessionStorage.getItem('numberKey')
sessionStorage.getItem('stringKey')
JSON.parse(sessionStorage.getItem('booleanKey'))
JSON.parse(sessionStorage.getItem('arrayKey'))
JSON.parse(sessionStorage.getItem('objectKey'))