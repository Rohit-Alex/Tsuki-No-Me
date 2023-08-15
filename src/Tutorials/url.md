#### Components of a URL

```
    Suppose this is the url,
    https://www.example.com:8080/chalegi/date/pe?answer=nhi&answer2=bhoolJaa#section
```

> 1. **Scheme:** *<u>https:</u>* (http, ftp, mailto)
2. **Host:** *<u>www.example.com</u>*
    1. **SubDomain:** *<u>www.</u>*
    2. **Domain:** *<u>example</u>*
    3. **Top-Level Domain**: *<u>.com</u>*
3. **Port Number:** *<u>8080</u>*
4. **Path:** *<u>/chalegi/date/pe</u>*
5. **Query Params/String:** *<u>?answer=nhi&answer2=bhoolJaa</u>*
6. **Fragment:** *<u>section</u>*
>
 ###### Default port is 80 and 443. Default port are not considered while displaying port number.

 - URL(url, baseURL)
    > Creates and returns a URL object referencing the URL specified using an absolute URL string, or a relative URL string and a base URL string.
    
    > url (1st parameter) -> A string or any other object that represents an absolute or relative URL. If url is a relative URL, base is required, and will be used as the base URL. If url is an absolute URL, a given base will be ignored.
    ```
        const baseUrl = "https://developer.mozilla.org";

        new URL("/", baseUrl) => 'https://developer.mozilla.org/'

        new URL(baseUrl) => 'https://developer.mozilla.org/'

        new URL("en-US/docs", 'https://developer.mozilla.org/') => 'https://developer.mozilla.org/en-US/docs'

        new URL("/en-US/docs", 'https://developer.mozilla.org/')  => 'https://developer.mozilla.org/en-US/docs'

        new URL("/en-US/docs", 'https://developer.mozilla.org/en-US/docs') => 'https://developer.mozilla.org/en-US/docs'

        new URL("/en-US/docs", "https://developer.mozilla.org/fr-FR/toto") => 'https://developer.mozilla.org/en-US/docs'
        
        new URL("http://www.example.com") => 'http://www.example.com/' (no need of baseURL as given url is absolute)

        new URL("http://www.example.com", 'https://developer.mozilla.org/') => 'http://www.example.com/' (baseURL ignored as 1st parameter is absolute url)
    ```

- URLSearchParams()
    > Returns the query string or URLSearchParams object instance.

    ```
        const paramsString = "one=1&two=2";
        const paramsObject = {
            one: "1",
            two: "2",
            three: undefined
        };
        const searchParams = new URLSearchParams(paramsString);

        some imp methods:
            1> has(key) => checks if key exists or not. => searchParams.has("one"); // true
            2> has(key, value) => checks if key exists with the value provided in parameter => searchParams.has("one", "2"); // false
            3> get(key) => returns the value of the key. If not found returns null. => searchParams.get("one) === "1"; // true
                            searchParams.get("foo"); // null
            4> getAll(key) => returns all the values of the key in the array for provided key. => searchParams.getAll("one"); // ["1"]
            5> append(key, value) => adds another key. => searchParams.append("four", "4");
            console.log(searchParams.toString()); // "one=1&two=2&three=undefined&four=4"
            6> set(key, value) => set the value of existing key with given value. If key doesn't exist then adds it. => 
            searchParams.set("three", 3);
            searchParams.set("seven", 7);
            console.log(searchParams.toString()); // "one=1&two=2&three=3&four=4&seven=7"
            7> delete(key) => deletes the key =>  searchParams.delete("three");
            console.log(searchParams.toString()); // "one=1&two=2&&four=4&seven=7"
    ```

- protocol
    > returns the scheme of url
    ```
    Suppose current url is "https://xxYYzz.com:3001/seller/details"
    
    Then to get the host in JS or React, the code would be
    const currentURL = window.location.href;

    // Create a new URL object
    const url = new URL(currentURL);

    // Extract the protocol
    console.log(url.protocol);  // https:
    ```

- search
    > returns the entire query string as a string.
    ```
    Suppose current url is "https://xxYYzz.com:3001/seller/details?category=someValue&quality=720"

    const url = new URL(window.location.href);

    console.log(url.search); // ?category=someValue&quality=720
    ```

- searchparams
    > returns query params in object form allowing access to the "get" decoded query arguments contained in the URL. When accessing using get keyword, we get the result in a string. So we may need to parse it as per requirement
    
  ```
    Suppose current url is "https://xxYYzz.com:3001/seller/details?category=someValue&quality=720"
    
    Then to get the host in JS or React, the code would be
 
    const url = new URL(window.location.href);

    const queryParams = url.searchParams; 
    console.log(params.get("category")); // 'someValue'
    console.log(params.get("quality")); // '720' (Note: it's a string)
    
    NOTE: We may need to parse using parseInt, Number, Boolean or JSON.parse as per requirement here. Reason being it returns a string value.
    ```

- host
    >string containing the hostname, and then, if the port of the URL is nonempty, then ':', followed by the port of the URL.
    
    ```
    Suppose current url is "https://xxYYzz.com:3001/seller/details"
    
 
    const url = new URL(window.location.href);

    console.log(url.host); // xxYYzz.com:3001
    ```

- hostname
    > string containing the domain name of the URL and **no port number**
    
    ```
    Suppose current url is "https://xxYYzz.com:3001/seller/details"
    
    Then to get the host in JS or React, the code would be
    const currentURL = window.location.href;

    const url = new URL(window.location.href;);

    console.log(url.hostname); // xxYYzz.com
    ```
- href
    > For getting the entire url
    ```
    Suppose current url is "https://xxYYzz.com:3001/seller/details"
    
    Then to get the host in JS or React, the code would be
    const currentURL = window.location.href; // https://xxYYzz.com:3001/seller/details
    ```
- origin
    > For getting scheme + domain name + port (unless it's default port)
    ```
    Suppose current url is "https://xxYYzz.com:3001/seller/details"
    
    Then to get the host in JS or React, the code would be
    const currentURL = window.location.href;

    // Create a new URL object
    const url = new URL(currentURL);

    console.log(url.origin); // https://xxYYzz.com:3001
    ```
- pathname
 > returns path of the url
    ```
    Suppose current url is "https://xxYYzz.com:3001/seller/details"
    
    Then to get the host in JS or React, the code would be
    const currentURL = window.location.href;

    // Create a new URL object
    const url = new URL(currentURL);

    console.log(url.pathname); // logs -> /seller/details
    ```
-  port
    > returns port number unless it is a default port i.e. 443 and 80
    ```
    Suppose current url is "https://xxYYzz.com:3001/seller/details"
    
    Then to get the host in JS or React, the code would be
    const currentURL = window.location.href;

    // Create a new URL object
    const url = new URL(currentURL);

    console.log(url.port); // 3001
    ```

###### Function to Form the url with given query params and also remove any key if it is undefined, null or empty string
```
    const getUrl = (url, baseurl, paramsObj) => {
        const urlFormed = new URL(url, baseurl);
        const queryParams = new URLSearchParams(paramsObj);
        urlFormed.search = queryParams;
        return urlFormed;
    };

    const removeFalsyValuesInObj = (obj) => {
        const newObj = {}
        for (const key in obj) {
            const val = obj[key];
            if (typeof val === "object" && val.constructor === Object & val !== null) {
                    const updatedObj = removeFalsyValuesInObj(val);
                    console.log(updatedObj, newObj)
                    newObj[key] = updatedObj
            }
            else {
                if (![null, undefined, ''].includes(val)) newObj[key] = val
            }
        }
        return newObj;
    }

    const queryParamsObj = {
        one: "1",
        two: "2",
        three: undefined
    };

    console.log(getUrl("/youtube", "https://www.google.com", removeFalsyValuesInObj(queryParamsObj)));

```