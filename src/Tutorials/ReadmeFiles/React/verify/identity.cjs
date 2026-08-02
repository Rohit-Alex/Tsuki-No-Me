const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="root"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act } = React;
const e = React.createElement;

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);

// same type, changed prop -> node REUSED
act(() => root.render(e('div', { className: 'a' }, 'one')));
const n1 = container.firstChild;
act(() => root.render(e('div', { className: 'b' }, 'two')));
const n2 = container.firstChild;
console.log('same type -> same DOM node?', n1 === n2, '| className now:', n2.className, '| text:', n2.textContent);

// different type at same position -> node REPLACED
act(() => root.render(e('span', null, 'three')));
const n3 = container.firstChild;
console.log('type changed div->span -> same node?', n2 === n3, '| tag:', n3.tagName);

// key change on same type -> node REPLACED (identity reset)
act(() => root.render(e('p', { key: 'k1' }, 'x')));
const p1 = container.firstChild;
act(() => root.render(e('p', { key: 'k2' }, 'x')));
const p2 = container.firstChild;
console.log('key changed on same type -> same node?', p1 === p2);
