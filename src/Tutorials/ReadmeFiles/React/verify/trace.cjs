const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState, useEffect, useLayoutEffect } = React;
const e = React.createElement;

const log = [];
function Child({ n }) { log.push(`   render Child (n=${n})`); return e('span', null, n); }
function App() {
  const [n, setN] = useState(0);
  log.push(`   render App (n=${n})`);
  useLayoutEffect(() => { log.push('   useLayoutEffect (before paint)'); });
  useEffect(() => { log.push('   useEffect (after paint)'); });
  App.set = setN;
  return e('div', null, e(Child, { n }));
}
const c = document.createElement('div'); document.body.appendChild(c);
const root = createRoot(c);

log.push('--- MOUNT ---');
act(() => root.render(e(App)));
log.push('--- setState(1) ---');
act(() => App.set(1));

log.push('--- BATCHING: 3 setStates in one tick ---');
const before = log.length;
act(() => { App.set(10); App.set(11); App.set(12); });
log.push(`   => renders triggered: ${log.slice(before).filter(l=>l.includes('render App')).length} (not 3)`);

console.log(log.join('\n'));
