const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="root"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.IS_REACT_ACT_ENVIRONMENT = true;

const React = require('react');
const { createRoot } = require('react-dom/client');
const { act } = require('react-dom/test-utils');
const e = React.createElement;

// Uncontrolled input keeps its OWN DOM state -> perfect probe for identity
function Row({ label }) { return e('li', null, label, ' ', e('input', { defaultValue: '' })); }

function makeApp(keyMode) {
  return function App({ items }) {
    return e('ul', null, items.map((it, i) =>
      e(Row, { key: keyMode === 'index' ? i : it.id, label: it.label })));
  };
}

function run(keyMode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const App = makeApp(keyMode);
  const items = [{id:'a',label:'A'},{id:'b',label:'B'},{id:'c',label:'C'}];
  act(() => { root.render(e(App, { items })); });

  // user types into each input: A->1, B->2, C->3
  const inputs = () => [...container.querySelectorAll('input')];
  inputs().forEach((inp, i) => { inp.value = String(i + 1); });
  const snapshot = () => [...container.querySelectorAll('li')]
      .map(li => li.textContent.trim() + '=' + li.querySelector('input').value);
  console.log(`\n[${keyMode} keys] before:`, snapshot().join('  '));

  // prepend a new item at the front
  act(() => { root.render(e(App, { items: [{id:'z',label:'Z'}, ...items] })); });
  console.log(`[${keyMode} keys] after prepend Z:`, snapshot().join('  '));
}

run('index');
run('id');
