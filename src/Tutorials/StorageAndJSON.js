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
    * setItem(key, value) - set key/value pair
    * getItem(key) - get the value stored for that key
    * removeItem(key) - remove a particular key
    * clear() – delete everything.
     
    ? NOTE: Please note that both key and value must be strings.
    ?       If they were any other type, like a number, or an object, they would get converted to a string automatically:
    ?       If we want to store arrays and objects as value then since by default it gets converted to strings so we would use JSON.stringify() to store and JSON.parse() to access
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
let room = {
  number: 23
};

let meetup = {
  title: "Conference",
  participants: [{name: "John"}, {name: "Alice"}],
  place: room
};

room.occupiedBy = meetup; // room references meetup

alert( JSON.stringify(meetup, ['title', 'participants', 'place', 'name', 'number']) );