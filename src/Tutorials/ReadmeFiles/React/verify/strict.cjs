const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, StrictMode, useState, useEffect } = React;
const e = React.createElement;

function Probe({ tag }) {
  console.log(`  [${tag}] render body ran`);
  useState(() => { console.log(`  [${tag}] useState initializer ran`); return 0; });
  useEffect(() => {
    console.log(`  [${tag}] effect SETUP`);
    return () => console.log(`  [${tag}] effect CLEANUP`);
  }, []);
  return null;
}
function mount(tag, wrap) {
  const c = document.createElement('div'); document.body.appendChild(c);
  const root = createRoot(c);
  console.log(`--- ${tag} ---`);
  act(() => root.render(wrap(e(Probe, { tag }))));
}
mount('NO StrictMode', el => el);
mount('WITH StrictMode', el => e(StrictMode, null, el));
