const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState, useEffect, useLayoutEffect, useRef } = React;
const e = React.createElement;

function Probe() {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  Probe.set = setN;

  console.log(`1. RENDER BODY runs      | DOM text right now: "${ref.current ? ref.current.textContent : 'ref is null - no DOM yet'}"`);

  useLayoutEffect(() => {
    console.log(`2. useLayoutEffect runs  | DOM text right now: "${ref.current.textContent}"  <- DOM EXISTS & is updated`);
  });

  useEffect(() => {
    console.log(`3. useEffect runs        | DOM text right now: "${ref.current.textContent}"`);
  });

  return e('p', { ref }, 'value=' + n);
}

const c = document.createElement('div'); document.body.appendChild(c);
const root = createRoot(c);
console.log('=== MOUNT ===');
act(() => root.render(e(Probe)));
console.log('\n=== UPDATE (setState 0 -> 42) ===');
act(() => Probe.set(42));
