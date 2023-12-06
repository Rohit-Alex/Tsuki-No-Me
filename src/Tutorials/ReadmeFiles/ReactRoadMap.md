- Why React?
- React Features
- React 18 features
- Component-based approach
- VDOM -->> Diffing
- `createElement`
- JSX
- Lifecycle methods
 - `DOMContentLoaded`: The DOMContentLoaded event fires when the HTML document has been completely parsed, and all deferred scripts (`<script defer src="…">` and `<script type="module">`) have downloaded and executed. It doesn't wait for other things like images, subframes, and async scripts to finish loading.
- `componentDidMount` is triggered as soon as the instance of the component is created. Whereas, `DOMContentLoaded` is fired only once in the entire webpage life.
- Hooks
- Rules of hooks
- Fragment
- One-way data binding?
- Keys/indexes as keys
- Synthetic events
- Why state is required, why not simply variables?
- State/props
- Children props
- Why don't we change state directly/why do we first create a copy of non-primitive state before updating?
- Controlled vs uncontrolled
- Pure component
- `memo`, `useMemo`, `useCallback`, `HOC`, `useTransition`, `useDeferredValue`, `useImperativeHandle`, `useLayoutEffect`, `useReducer`, `useRef`
- Custom hooks
- Error boundary
- Named vs default exports
- Prop drilling
- `useContext`
- Redux
- Middleware
- Redux thunk/Redux saga
- Webpack
- Babel
- Portals
- Shadow DOM
- React Fiber
- Code splitting
- Web worker/service worker

## React Machine Coding Questions:

1. Counter app
2. Counter app such that the user can increase or decrease by any given amount. Now make the Counter a child component. Now make 2 Counter child components with their independent counters (Counters that update independently). Now make 2 Counter child components with dependent counters (Counters that update together). Now make a Counter component that will maintain the count of the counter on the increase and decrease button.
3. Same thing using parent and child:
    - Make a counter component where the user maintains the count.
    - Make a search bar that maintains the search value.
    - Make a display component that shows the latest count and search value together.
4. Store user firstName and lastName using an object as a state variable.
5. Checkbox selection for male and female.
6. Todo list.
7. `useEffect` with API calls and search functionality.
8. Digital clock.
9. Counter.
10. Reverse counter.
11. (Add your further question here)

[must know react concepts examples](https://codesandbox.io/p/sandbox/seekers-i4kstj)

[cars 24 interview](https://codesandbox.io/p/devbox/cars-24-y82lgm)

[js based dsa questions asked on interviews](https://codesandbox.io/p/sandbox/netomi-interview-fxmngd?file=%2Fsrc%2Findex.js)
