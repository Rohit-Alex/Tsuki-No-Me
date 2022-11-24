Freeze vs Seal

Seal => Naruto sealing corpses
     => can't add or remove any properties.
     => However, can change the existing properties.

Freeze => Max privacy in object
       => Can't add, modify or delete any properties.
       => Only applicable at top level. i.e. Shallow freezing

HOC => making reuse of the component logic and functionality that is commonly required at different level of hierarchy
    => It's a pure function that takes a component as a parameter and returns a new component without changing the original component.
    => We can pass all the common functionality in props to the newly created component and acces these props in   the  actual component.
    => The props passed into these wrappedComponent can't be accessed there and needs to spread in the hoc to be able to use it.

DOMContentLoaded => The DOMContentLoaded event fires when the HTML document has been completely parsed, and all deferred scripts (<script defer src="…"> and <script type="module">) have downloaded and executed. It doesn't wait for other things like images, subframes, and async scripts to finish loading.
componentDidMount is triggered as soon as the instance of the componenet is created. Wheras, DOMContentLoaded is fired once only in entire webPage life.

Call, apply & bind
async & defer
throttling & debouncing


the unique exponentiation operator has right-associativity, whereas other arithmetic operators have left-associativity.

const a = 4 ** 3 ** 2;  // Same as 4 ** (3 ** 2); evaluates to 262144

code splitting: ->
Code-Splitting is a feature supported by bundlers like Webpack, Rollup and Browserify (via factor-bundle) which can create multiple bundles that can be dynamically loaded at runtime.
Code-splitting your app can help you “lazy-load” just the things that are currently needed by the user, which can dramatically improve the performance of your app
The React.lazy function lets you render a dynamic import as a regular component.
const OtherComponent = React.lazy(() => import('./OtherComponent'));

Error Boundary
Context
Webpack

Precedence operators:
1> ()
2> ?.
3> postfix ...++
           ...--
4> unary operator & prefix:  ! ~ + - ++... --...
5> ** (right to left)
6> * / %
7> + -
8> << >>
9> < > <= >=
10> == != === !==
11> |
12> &
13> ^
14> &&
15> ||
16> ??
17> =
Logger middleware in Redux
const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
}

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
    throw err
  }
}

const thunkMiddleware =
  ({ dispatch, getState }) =>
  next =>
  action => {
    // If the "action" is actually a function instead...
    if (typeof action === 'function') {
      // then call the function and pass `dispatch` and `getState` as arguments
      return action(dispatch, getState)
    }

    // Otherwise, it's a normal action - send it onwards
    return next(action)
  }