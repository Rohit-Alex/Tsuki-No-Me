const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useSyncExternalStore, useState, useEffect } = React;
const e = React.createElement;

// A store read the WRONG way (plain module variable + manual subscribe via useState)
let value = 0;
const listeners = new Set();
const store = {
  subscribe(l){ listeners.add(l); return ()=>listeners.delete(l); },
  get: () => value,
  set(v){ value = v; listeners.forEach(l=>l()); }
};

function Correct() {
  const v = useSyncExternalStore(store.subscribe, store.get);
  return e('span', null, 'sync:' + v);
}
const c = document.getElementById('r');
const root = createRoot(c);
act(() => root.render(e(Correct)));
console.log('initial          :', c.textContent);
act(() => store.set(42));
console.log('after store.set  :', c.textContent, ' <- component re-rendered from an EXTERNAL source');
console.log('\nuseSyncExternalStore exists so React can re-read the store at the right moment');
console.log('and keep every component in one commit consistent (no tearing).');
