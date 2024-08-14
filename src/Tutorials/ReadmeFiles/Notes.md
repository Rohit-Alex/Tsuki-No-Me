#### Best Practices
- If a function accepts more than 2 arguments then it's better to send an object rather than other values.

#### conditionally add props and object property
- To add props conditionally => {...(condition && {disable: true})}
- To add keys conditionally in object => {...obj, ...(condition && {key: 1})}

**inline-block =>** same as inline except that they can have padding and margin added from top & bottom as well and allows to set a width and height on the element.

**currying =>** process of taking a function with multiple arguments and turning it into a sequence of functions.

**charCodeAt =>**  returns the ascii value of the character at given index of the string

    "ABC".charCodeAt(0); // returns 65
    
**fromCharCode =>** returns the character for the given ascii value

    String.fromCharCode(65, 66, 67); // returns "ABC"
    
#### HOC
- making reuse of the component logic and functionality that is commonly required at different level of hierarchy
- It's a pure function that takes a component as a parameter and returns a new component without changing the original component.
- We can pass all the common functionality in props to the newly created component and acces these props in the actual component.
- The props passed into these wrappedComponent can't be accessed there and needs to spread in the hoc to be able to use it.

#### code splitting
- Code-Splitting is a feature supported by bundlers like Webpack, Rollup and Browserify (via factor-bundle) which can create multiple bundles that can be dynamically loaded at runtime.
- Code-splitting your app can help you “lazy-load” just the things that are currently needed by the user, which can dramatically improve the performance of your app
- The React.lazy function lets you render a dynamic import as a regular component.
```
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

**Error Boundary**
**Webpack -> module bundler**
**Arrow functions** cannot be used as constructors and will throw an error when used with new. Because they have a lexical this, and do not have a prototype property, so it would not make much sense.

- Object.is() determines if two values have the same value or not. It works similar to the === operator but there are a few weird cases:
- NaN is not equal to itself as well. To compare NaN, use Object.is() => It is similar to === except for this case
```
Object.is(NaN, NaN); // -> true
NaN === NaN; // -> false
Object.is(-0, 0); // -> false
-0 === 0; // -> true
Object.is(NaN, 0 / 0); // -> true
NaN === 0 / 0; // -> false
```

#### Logger middleware in Redux
```
const logger = store => next => action => {
    console.group(action.type)
    console.info('dispatching', action)
    console.log('next state', store.getState())
    console.groupEnd()
    return next(action)
}
```
#### Crash Reporter middleware in Redux
```
const crashReporter = store => next => action => {
    try {
        return next(action)
    } catch (err) {
        console.error('Caught an exception!', err)
        throw err
    }
}
```
#### Thunk middleware in Redux
```
const thunkMiddleware = ({ dispatch, getState }) => next => action => {
    // If the "action" is actually a function instead...
    if (typeof action === 'function') {
    // then call the function and pass `dispatch` and `getState` as arguments
    return action(dispatch, getState)
    }
    // Otherwise, it's a normal action - send it onwards
    return next(action)
}
// always return next(action) in middleware function
```

Number range => (2^53 - 1) in total 16 digit

#### Swap
- to swap two numbers: [a,b] = [b,a]

#### Assignment operator
> Assignment operator returns a value
The fact of = being an operator, not a “magical” language construct has an interesting implication.
All operators in JavaScript return a value. That’s obvious for + and -, but also true for =.
The call x = value writes the value into x and then returns it.
Here’s a demo that uses an assignment as part of a more complex expression:
```
let a = 1;
let b = 2;

let c = 3 - (a = b + 1);

alert(a); // 3
alert(c); // 0
```

>Default parameters are only applied when undefined is passed to it or nothing which is equivalent to undefined itself

#### unique values in array of object based on certain key
```
d = [...new Map(d.map(obj => [`${obj.id}:${obj.title}`, obj])).values()].map(item => ({
id: item?.id,
title: item?.title
}));
```

**Classes are not hoisted**

>In modern engines, the interpreter starts reading the code line by line while
the profiler watches for frequently used code then passes is to the compiler to
be optimized. In the end, the JavaScript engine takes the bytecode the interpreter
outputs and mixes in the optimized code the compiler outputs and then gives that to the
computer. This is called "Just in Time" or JIT Compiler.


###### Important topics ---->>>
1> Prodution build
2> Reselect/Re-reselect for redux store memoization
3> Web workers

onmessage = (event) => {
  console.log('Received message from the main thread:', event.data);

  // Perform some computation
  const result = event.data * 2;

  // Send the result back to the main thread
  postMessage(result);
};

<--------app.js-------->
  useEffect(() => {
    const myWorker = new Worker('worker-path');

    myWorker.onmessage = function (event) {
      console.log('Received result from worker:', event.data);
      setResult(event.data);
    };

    return () => {
      myWorker.terminate();
    };
  }, []); 
 worker.postMessage(5); // on click or when we need to start computation

4> weakset, weakmap
5> structuredClone
6> shadowDOM
7> context vs Reducer vs Thunk vs Saga
8> Why can't we use redux state instead of local state

#### conditional props and object property
    const data = {
        one: 1
    }
    const path = ''
    console.log({...data, ...(path && {path})})

    <MyComponent title="Header" {...(subtitle && { subtitle: getRightContent() })} />

#### React Router v6
- ##### Absolute & relatving routing.
    e.g. initial route: https://www.bharatpe.com/transactions/status
    - ###### Relative Routing
        history.push('my-charges') or history.push('./my-charges')
            Becomes => 👇
            ```
            https://www.bharatpe.com/transactions/status/my-charges
            ```
    - ###### Absolute routing
        history.push('/my-charges') 
        Becomes => 👇
            ```
            https://www.bharatpe.com/my-charges
            ```
- ##### Navigate methods

    ```sh
    <Route path='dashboard/:id/:number' element={<DashboardDetails />} />

    navigate(-1)                                // history.goBack() or history.pop()
    navigate('/about, {replace: true})          // history.replace('/about)
    navigate(`/dashboard/${2}/${9304410487}`)   // passing params
    navigate(`/dashboard/${2}/${9304410487}?nickname=alex&trademark=neverBackDown`) // passing params and queryParams
    navigate(`/dashboard/${2}/${9304410487}?nickname=alex`, { state: { name: 'Rohit', age: 24 }, })   // passing state, params and queryParams

    const { id = 7984, number = 7984065620 } = useParams()
    
    const queryParams = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop as string),
    }) as any;
    const { nickname, trademark } = queryParams; // using this query params get method, we won't be able to give default value while destructuring 
    
    const { state } = location as ILocation
    const { name = 'Default name', age = 'Default age' } = state || {}
    ```
##### Data Strucuture (Turn Array into Object)
    const CUSTOMIZE_IMAGE_DATA_OBJ = {
        '/cutomizeQr/sampleBg1.jpg': { path: '/cutomizeQr/sampleBg1.jpg', themeColor: '#FCF4F5' },
        '/cutomizeQr/sampleBg2.jpg': { path: '/cutomizeQr/sampleBg2.jpg', themeColor: '#F4F9FF' },
        '/cutomizeQr/sampleBg3.jpg': { path: '/cutomizeQr/sampleBg3.jpg', themeColor: '#FFFCF2' },
        '/cutomizeQr/sampleBg4.jpg': { path: '/cutomizeQr/sampleBg4.jpg', themeColor: '#F1F9F3' },
        '/cutomizeQr/sampleBg5.jpg': { path: '/cutomizeQr/sampleBg5.jpg', themeColor: '#EEEEEE' },
    };

    const CUSTOMIZE_IMAGE_DATA_OBJ_ARR = [
        { path: '/cutomizeQr/sampleBg1.jpg', themeColor: '#FCF4F5' },
        { path: '/cutomizeQr/sampleBg2.jpg', themeColor: '#F4F9FF' },
        { path: '/cutomizeQr/sampleBg3.jpg', themeColor: '#FFFCF2' },
        { path: '/cutomizeQr/sampleBg4.jpg', themeColor: '#F1F9F3' },
        { path: '/cutomizeQr/sampleBg5.jpg', themeColor: '#EEEEEE' },
    ];

    Object.values(CUSTOMIZE_IMAGE_DATA_OBJ) is same as CUSTOMIZE_IMAGE_DATA_OBJ_ARR
