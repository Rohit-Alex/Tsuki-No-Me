const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState } = React;
const e = React.createElement;

function Child({ n }) { return e('span', null, n); }
function App() {
  const [n, setN] = useState(0);
  App.set = setN;
  return e('div', { className: 'box' }, e(Child, { n }));
}
const c = document.getElementById('r');
const root = createRoot(c);
act(() => root.render(e(App)));

const key = Object.keys(c).find(k => k.startsWith('__reactContainer'));
const rootFiber = c[key];
console.log('rootFiber.tag:', rootFiber.tag, '(3 = HostRoot)');
console.log('rootFiber.child:', rootFiber.child);
console.log('rootFiber.stateNode is FiberRoot?', !!(rootFiber.stateNode && rootFiber.stateNode.current));
// the FiberRoot holds .current -> the live HostRoot fiber
const fiberRoot = rootFiber.stateNode;
const liveHostRoot = fiberRoot.current;
console.log('liveHostRoot === rootFiber?', liveHostRoot === rootFiber);
const appFiber = liveHostRoot.child;
console.log('\nappFiber type:', appFiber.type && appFiber.type.name);
console.log('fields:', Object.keys(appFiber).join(', '));
console.log('\ntag:', appFiber.tag, '| key:', appFiber.key, '| index:', appFiber.index);
console.log('child:', appFiber.child.type, '| sibling:', appFiber.sibling);
console.log('memoizedState (hooks):', appFiber.memoizedState ? 'present' : 'null');
console.log('memoizedProps:', JSON.stringify(appFiber.memoizedProps));
console.log('stateNode (fn component):', appFiber.stateNode);
const divFiber = appFiber.child;
console.log('\nhost <div> fiber: type =', divFiber.type, '| stateNode === real DOM node?', divFiber.stateNode === c.firstChild);

console.log('\n--- DOUBLE BUFFERING ---');
console.log('alternate BEFORE any update:', appFiber.alternate);
act(() => App.set(1));
const appAfter = fiberRoot.current.child;
console.log('alternate AFTER update:', appAfter.alternate ? 'exists (the other buffer)' : 'null');
console.log('current fiber === original object?', appAfter === appFiber);
console.log('current.alternate === original object?', appAfter.alternate === appFiber, ' <- buffers swapped');
