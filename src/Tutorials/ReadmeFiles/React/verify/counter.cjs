const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState } = React;
const e = React.createElement;

function Counter() {
  const [count, setCount] = useState(0);
  Counter.set = setCount;
  return e('button', null, 'Count: ' + count);
}
const c = document.getElementById('r');
const root = createRoot(c);
act(() => root.render(e(Counter)));
const fiberRoot = c[Object.keys(c).find(k => k.startsWith('__reactContainer'))].stateNode;

const labels = new WeakMap(); let n = 0;
const L = f => { if(!f) return 'null'; if(!labels.has(f)) labels.set(f,'Tree'+String.fromCharCode(65+(n++))); return labels.get(f); };
const cur = () => fiberRoot.current.child;
const show = (step) => {
  const f = cur();
  console.log(`${step.padEnd(16)} current=${L(f).padEnd(6)} count=${f.memoizedState.memoizedState}   spare=${L(f.alternate)}${f.alternate ? ' holds count=' + f.alternate.memoizedState.memoizedState : ''}`);
};
show('initial render');
act(() => Counter.set(1)); show('after click 1');
act(() => Counter.set(2)); show('after click 2');
act(() => Counter.set(3)); show('after click 3');
console.log('\nThe spare tree always holds the PREVIOUS committed count — never a stale count=0.');
console.log('DOM says:', c.textContent);
