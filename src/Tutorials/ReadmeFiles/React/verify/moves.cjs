const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act } = React;
const e = React.createElement;

function List({ items }) {
  return e('ul', null, items.map(i => e('li', { key: i }, i)));
}
const c = document.getElementById('r');
const root = createRoot(c);

const ids = ['A','B','C'];
act(() => root.render(e(List, { items: ids })));
const nodes = {};
[...c.querySelectorAll('li')].forEach(li => nodes[li.textContent] = li);
console.log('after mount:', [...c.querySelectorAll('li')].map(n=>n.textContent).join(','));

// reorder [A,B,C] -> [C,A,B]
act(() => root.render(e(List, { items: ['C','A','B'] })));
const after = [...c.querySelectorAll('li')];
console.log('after reorder:', after.map(n=>n.textContent).join(','));
console.log('\nDOM node reuse (keys preserve identity):');
after.forEach(n => console.log(`  ${n.textContent}: same node as before? ${nodes[n.textContent] === n}`));
