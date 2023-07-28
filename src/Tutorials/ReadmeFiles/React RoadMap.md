Why React?
React Features
React 18 features

component based approach
VDOM -->> Diffing

createElement
JSX

lifecycle methods

DOMContentLoaded => The DOMContentLoaded event fires when the HTML document has been completely parsed, and all deferred scripts (<script defer src="…"> and <script type="module">) have downloaded and executed. It doesn't wait for other things like images, subframes, and async scripts to finish loading.
componentDidMount is triggered as soon as the instance of the componenet is created. Wheras, DOMContentLoaded is fired once only in entire webPage life.

hooks
rules of hooks
fragment
one-way data binding?
keys/indexes as key
synthetic events

why state is required, why not simply variables
state/props
children props
why don't we change state directly/ why do we first create copy of non-primitive state before updating

controlled vs un-controlled

pure component

memo, useMemo, useCallback, HOC, useTransition, useDefferedValue, useImperativeHandle, useLayoutEffect, useReducer, useRef
custom hooks

Error boundary

named vs default exports

prop drilling
useContext
Redux
middleware
Redux thunk/Redux saga

webpack
babble

portals
shadow DOM
React fibre
code splitting
webworker/service worker


React Machine coding question:

	1> counter app
	2> Counter app such that user can increase or decrease by any given amount
	   Now make the Counter a child component
	   Now make 2 Counter child component with their independent counter ((Counters that updates independently)
	   Now make 2 Counter child component with dependent counter (Counters that update together)
	Now make a Counter component which will maintain the count of counter on increase and decrease button
	3> Now same thing using parent and child
		make a counter component where user maintains the count
		make an search bar which maintains the search value
		make a display component, which shows the latest count and search value together.
	
	4> Store user firstName and lastName using object as state variable
	5> Checkbox selection for male and female
	6> todo list
	7> useEffect with api calls and search functionality
	8> Digital clock
	9> Counter
	10> Reverse counter
	11> 
