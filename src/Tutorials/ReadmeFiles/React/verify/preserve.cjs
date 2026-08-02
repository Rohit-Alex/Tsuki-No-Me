const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState } = React;
const e = React.createElement;

// "Nothing from the previous render is preserved except what React intentionally reuses"
// -> what IS carried over when a fiber is recycled?
function App() {
  const [n, setN] = useState(0);
  App.set = setN;
  return e('div', { id: 'd', 'data-n': n }, 'n=' + n);
}
const c = document.getElementById('r');
const root = createRoot(c);
act(() => root.render(e(App)));
const fiberRoot = c[Object.keys(c).find(k => k.startsWith('__reactContainer'))].stateNode;

const app = () => fiberRoot.current.child;
const A = app();
console.log('mount:      memoizedState hook value =', A.memoizedState.memoizedState);

act(() => App.set(1));
const B = app();
act(() => App.set(2));
const C = app();   // should be object A again

console.log('update 2:   current === mount object?', C === A);
console.log('            hook value on recycled fiber =', C.memoizedState.memoizedState);
console.log('            stateNode (DOM) still the same node?', C.child.stateNode === c.querySelector('#d'));
console.log('\n=> the recycled fiber is REWRITTEN, but state/stateNode are carried over,');
console.log('   not wiped. React copies them across in createWorkInProgress.');
