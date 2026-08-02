const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState } = React;
const e = React.createElement;

function Child() { return e('span', null, 'static'); }
function App() {
  const [n, setN] = useState(0);
  App.set = setN;
  return e('div', null, e(Child), e('p', null, n));
}
const c = document.getElementById('r');
const root = createRoot(c);
act(() => root.render(e(App)));
const fiberRoot = c[Object.keys(c).find(k => k.startsWith('__reactContainer'))].stateNode;

const appOf = () => fiberRoot.current.child;
const childOf = () => fiberRoot.current.child.child.child;

// Identify fiber objects by a WeakMap label instead of mutating them
const labels = new WeakMap(); let n = 0;
const label = f => { if (!labels.has(f)) labels.set(f, 'FiberObj#' + (++n)); return labels.get(f); };

console.log('=== MOUNT ===');
const appA = appOf(), childA = childOf();
console.log(`  current App  = ${label(appA)}   alternate = ${appA.alternate ? label(appA.alternate) : 'null  <-- only ONE tree exists'}`);
console.log(`  current Child= ${label(childA)}  alternate = ${childA.alternate ? label(childA.alternate) : 'null'}`);

console.log('\n=== UPDATE 1 (setState 1) ===');
act(() => App.set(1));
const appB = appOf(), childB = childOf();
console.log(`  current App  = ${label(appB)}   alternate = ${label(appB.alternate)}`);
console.log(`  current Child= ${label(childB)}  alternate = ${childB.alternate ? label(childB.alternate) : 'null  <-- Child was BAILED OUT (never re-rendered)'}`);
console.log(`  App: current is a NEW object? ${appB !== appA}   its alternate is the mount object? ${appB.alternate === appA}`);

console.log('\n=== UPDATE 2 (setState 2) ===');
act(() => App.set(2));
const appC = appOf();
console.log(`  current App  = ${label(appC)}   alternate = ${label(appC.alternate)}`);
console.log(`  Back to the ORIGINAL mount object? ${appC === appA}`);
console.log(`\n  => React alternates between exactly TWO App fiber objects forever:`);
console.log(`     ${label(appA)}  <-->  ${label(appB)}`);
