- Why React?
React is a JavaScript library designed to simplify the process of building complex, interactive UIs, especially for single-page applications (SPAs). While it's entirely possible to build a web application using just JavaScript, HTML, and CSS, React offers several advantages that make development more efficient, maintainable, and scalable

1. Component-Based Architecture
  Reusability: React promotes a component-based architecture where UI elements are encapsulated into reusable components. This means you can write a component once and use it across different parts of your application, reducing redundancy and potential for errors.
  Modularity: Components make your code more modular, leading to better organization and easier debugging. Each component can be developed, tested, and maintained independently, which is particularly useful in large-scale applications.
2. Virtual DOM
  Efficient Updates: React uses a Virtual DOM, which is a lightweight copy of the actual DOM. When the state of a component changes, React efficiently updates only the necessary parts of the DOM by comparing the new and old Virtual DOMs. This results in faster updates and a smoother user experience, especially in applications with frequent UI changes.

  JSX: React’s JSX syntax allows developers to write HTML-like code directly in JavaScript. This blend of HTML and JavaScript makes the code more intuitive and easier to work with. While this might seem like a small benefit, it significantly improves developer productivity.

  Optimizations: React is optimized for performance with features like lazy loading, code splitting, and the aforementioned Virtual DOM. This helps in building fast, responsive applications that can handle complex UI interactions and data-heavy operations.

  Maintainable Codebase / Scalability: As applications grow in size and complexity, maintaining and scaling a plain JavaScript/HTML/CSS codebase can become difficult. React’s structured approach to building UIs with reusable components and clear state management practices makes it easier to maintain and scale large applications.

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

#### Virtual Dom in Brief
- The Virtual DOM is an in-memory representation of the real DOM. It’s a lightweight copy of the actual DOM that React maintains in the background. Instead of directly manipulating the real DOM, React first updates the Virtual DOM.
- When we write JSX code in React, it is compiled into JavaScript objects representing the Virtual DOM elements. These objects describe what the UI should look like at any point in time.
- When the state or props of a component change, React creates a new Virtual DOM tree representing the updated UI. This new tree is then compared to the previous Virtual DOM tree.
- React uses a process called reconciliation or diffing algorithm to compare the new Virtual DOM tree with the previous one. This algorithm efficiently calculates the differences (or "diffs") between the two trees.
- Based on the differences found during the diffing process, React identifies the minimal set of changes needed to update the real DOM. Instead of re-rendering the entire UI, React only updates the parts of the DOM that have actually changed.
- React can batch multiple updates together to further optimize performance. This means that multiple state changes within a single event cycle can be processed together, reducing the number of reflows and repaints.
- Updating the Real DOM: After calculating the necessary changes, React applies these updates to the real DOM. This targeted approach minimizes the performance overhead associated with DOM manipulation, leading to faster and more responsive UIs.

#### Reconciliation

Reconciliation is the process that React uses to compare the new Virtual DOM with the previous one and figure out the minimal set of changes required to update the real DOM. It’s a core part of how React achieves efficient updates to the user interface.

1. The Role of the Virtual DOM

- Virtual DOM Overview: As discussed earlier, React maintains a lightweight, in-memory representation of the actual DOM called the Virtual DOM. Whenever there is a change in the state or props of a component, React creates a new Virtual DOM tree.
- Comparison Process: React then compares this new Virtual DOM tree with the previous Virtual DOM tree to detect what has changed. This comparison process is called reconciliation.

2. The Diffing Algorithm

  - Algorithm Efficiency: React uses a highly optimized diffing algorithm to perform reconciliation. This algorithm is efficient because it operates under certain assumptions that make the comparison process faster.
  - Key Assumptions:
      - Element Type Consistency: If two elements are of the same type (e.g., both are <div> elements), React assumes they represent the same underlying DOM node, so it reuses the existing DOM node and only updates its attributes as needed.
      - Unique Key Prop: For lists of elements, React relies on the key prop to uniquely identify each element. This helps React efficiently match corresponding elements in the old and new lists, minimizing re-renders.

3. Steps in Reconciliation

  Step 1: Comparing Root Elements
        - Same Type: If the root elements of the new and old Virtual DOM trees are of the same type, React continues to compare their attributes and child elements.
        - Different Type: If the root elements are of different types, React removes the old DOM node and its children and creates a new DOM node for the new root element.
  Step 2: Updating Attributes
        - Attribute Changes: React compares the attributes of the old and new elements and updates only those that have changed.
  Step 3: Comparing Children
        - Recursive Comparison: React recursively compares the children of the elements, applying the same logic to each child node. It does this by walking through both the old and new Virtual DOM trees.
  Step 4: Handling Lists with Keys
        - Keys for Identification: In cases where elements are part of a list, React uses the key prop to identify which items have changed, been added, or been removed. This allows React to rearrange, add, or remove list items with minimal DOM operations.

#### Why Reconciliation is Efficient?
Minimizing DOM Operations: The goal of reconciliation is to minimize the number of changes that need to be made to the real DOM. Since DOM operations are costly in terms of performance, reducing the number of these operations leads to a faster and more responsive application.

Avoiding Unnecessary Re-renders: By carefully comparing only the parts of the Virtual DOM that have changed, React avoids unnecessary re-renders, which further optimizes performance.


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
    2. static getDerivedStateFromProps() - Syncs state with props before the initial render. This method is called for every render cycle and provides an opportunity to update the component's state based on changes in props before the initial render.
    The method should return an object that represents the updated state of the component, or null if no state update is necessary.
    3. render() - Outputs the JSX to render the component to the DOM.
    4. componentDidMount() - Invoked after the component is rendered to the DOM. Ideal for side-effects like data fetching, DOM manipulations, etc.

2. Updating Phase:
    1. static getDerivedStateFromProps() - Syncs state with new props before the component updates. (Triggered on prop or state change)
    2. shouldComponentUpdate() - Determines if the component should re-render. It takes two arguments: nextProps and nextState. This method returns a boolean value that determines whether the component should update or not. If this method returns true, the component will update, and if it returns false, the component will not update.
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

-> parent render
-> child render
-> child useLayout effect
-> parent useLayout effect
-> child useEffect
-> parent useEffect

DOM updates (useLayoutEffect) vs Browser paints(useEffect)

1.  
  The DOM is a tree-like structure that represents the HTML elements on the page. The browser parses HTML and constructs the DOM. As changes are made to the DOM (e.g., via JavaScript or React rendering), the DOM is immediately updated to reflect these changes in its internal data structure. However, these updates are not yet visible to the user.

  Painting refers to the actual process of drawing the visual content of the page onto the screen. This includes rendering the layout, text, colors, images, and any other visual elements that the browser needs to display to the user.
  After the DOM has been updated, the browser goes through a series of steps (called the rendering pipeline) before actually painting the changes to the screen.
    - style recomputation
    - layout findings
    - paints & composite

In brief: 
- DOM Updates refer to changes in the structure/content of the page that happen immediately when the DOM is manipulated.
- Browser Paint is the process of actually rendering the visual changes to the screen, which occurs after the DOM is updated, styles are recalculated, and the layout is determined.

useLayoutEffect: Runs synchronously after the DOM updates but before the browser paints. You can use it to measure or manipulate the DOM (e.g., measuring an element's size or position) before the browser renders the new changes on the screen.

useEffect: Runs asynchronously after the DOM updates and after the browser has already painted. This is useful for tasks like fetching data, logging, or setting up event listeners without blocking the rendering process.


React.memo(comp, arePropsEqual) => if arePropsEqual returns true then doesn't re-render, if returns false then it re-renders


### Diff b/w clientWidth, offsetWidth, scrollWidth, innerWidth (window property), outerWidth (windowProperty)

```
<div style="width: 300px; padding: 10px; border: 5px solid black; margin: 20px;">
  Content
</div>
```
clientWidth:
  Returns the width of the content + padding, so 320px (300px width + 10px padding on both sides).
offsetWidth:
  Returns the width of the content + padding + border, so 330px (300px width + 10px padding + 5px border on both sides).
scrollWidth:
  If the content inside overflows the container, it will return the width of the content including the overflowed part.
innerWidth:
  If referring to window.innerWidth, it will return the width of the entire viewport.
outerWidth:
  Refers to the full width of the browser window, including toolbars and borders.

### Difference b/w direct state value initialization and lazy initialization (function)

###### const [data, setData] = useState(localStorage.getItem('someKey'));

- <b> First render:</b> The useState hook will run, and localStorage.getItem('someKey') will be called. The value returned will be used as the initial state for data.
- <b>Subsequent renders:</b> The expression localStorage.getItem('someKey') will still run (even though useState only uses the initial value once). 
React will ignore the return value of localStorage.  getItem('someKey') because the state (data) is preserved. So, even though it computes, it won’t affect the state unless setData is explicitly called to change it.

#### The Problem:
Although the state (data) is preserved between renders, the issue is that the localStorage.getItem('someKey') expression is evaluated every time the component re-renders, which is unnecessary and can cause performance issues if the operation is expensive (e.g., fetching large data from local storage, making API calls, etc.).

######  const [data, setData] = useState(() => localStorage.getItem('someKey'));

- Now, the localStorage.getItem('someKey') will only run once, during the first render.
- For subsequent renders, React will simply return the preserved state (data) without re-evaluating localStorage.getItem('someKey').

##### in Brief:
-  If you pass an expression like localStorage.getItem('someKey') directly to useState, that expression still runs on every render, even though React will ignore it.
- To avoid this unnecessary computation, use the lazy initialization pattern (useState(() => localStorage.getItem('someKey'))), ensuring the computation only runs once during the initial render.