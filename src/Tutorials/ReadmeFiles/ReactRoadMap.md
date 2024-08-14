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

- Intersection Observer
- Resize Observer
- different hooks example


<-------------------Important Pts-------------------------->

1. CDN -> Content Delivery Network or Content Distribution Network. It is a geographically distributed network of proxy servers that allows fetching resources from nearest servers. 
    i. This decreases load time
    ii. lower latency (time gap between request and response)
    iii. increased scalability and efficiency

2. CORS -> Cross origin mechanism that allows memory resources (fonts, js) on a webpage to be requested from one domain to another

3. NPM -> Package manager. It is used to install, share, and manage dependencies in
          node.js projects.
4. Bundler -> Development tool that combines multiple js code and its dependency together into a single file that is production ready and loadable in    browser (e.g. parcel, rollup, webpack)

5. React Fibre -> Re-implementation of React core's feature to enhance user interface responsiveness and renderability  


<----------------Lifecycle methods-------------->

1. Mounting Phase:
    1. constructor() - Initializes the component and sets up initial state and bindings.
    2. static getDerivedStateFromProps() - Syncs state with props before the initial render. (Rarely used during         mounting phase unless necessary)
    3. render() - Outputs the JSX to render the component to the DOM.
    4. componentDidMount() - Invoked after the component is rendered to the DOM. Ideal for side-effects like data fetching, DOM manipulations, etc.

2. Updating Phase:
    1. static getDerivedStateFromProps() - Syncs state with new props before the component updates. (Triggered on prop or state change)
    2. shouldComponentUpdate() - Determines if the component should re-render. If false is returned, the update is skipped.
    3. render() - Re-renders the component.
    4. getSnapshotBeforeUpdate() - Captures some information from the DOM before it updates (e.g., scroll position). The value returned here is passed to componentDidUpdate.
    5. componentDidUpdate() - Called after the component has been updated in the DOM. This is where you can use the snapshot value, perform side-effects, etc.

3. Unmounting Phase:
    1. componentWillUnmount() - Invoked just before the component is removed from the DOM. Use this to clean up resources like timers, event listeners, etc.

4. Error Handling Phase:
    1. static getDerivedStateFromError() - Called when a descendant component throws an error. It allows the component to update its state to show a fallback UI.
    2. componentDidCatch() - Logs the error and its information. It can also be used to perform side-effects related to error handling.

```
import React from 'react';

class LifecycleExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
    console.log('1st: Constructor - Component is being initialized');
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('2nd (or 5th): getDerivedStateFromProps - Syncing state with props if necessary');
    // Return null or an object to update the state
    return null;
  }

  componentDidMount() {
    console.log('4th: componentDidMount - Component has been mounted to the DOM');
    // You can perform side-effects here, like fetching data
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('6th: shouldComponentUpdate - Deciding if component should re-render');
    // Return true if the component should update
    return true;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('8th: getSnapshotBeforeUpdate - Capturing information before DOM is updated');
    // Return a value to pass to componentDidUpdate, or null
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('9th: componentDidUpdate - Component has been updated');
    // You can perform additional operations here
  }

  componentWillUnmount() {
    console.log('10th: componentWillUnmount - Component is about to be removed from the DOM');
    // Perform cleanup like removing timers, canceling network requests, etc.
  }

  static getDerivedStateFromError(error) {
    console.log('Error Handling - getDerivedStateFromError: Handling error');
    // Update state so the next render shows a fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log('Error Handling - componentDidCatch: Error caught in the component tree');
    // Log error information
  }

  handleClick = () => {
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }));
  };

  render() {
    console.log('3rd (or 7th): Render - Rendering the component');
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.handleClick}>Increment</button>
      </div>
    );
  }
}

export default LifecycleExample;
```
