const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act } = React;
const e = React.createElement;

const container = document.getElementById('r');
// Where are listeners actually attached? Count on document vs root container
const docAdd = [], rootAdd = [];
const origDoc = document.addEventListener.bind(document);
document.addEventListener = (t, ...r) => { docAdd.push(t); return origDoc(t, ...r); };
const origRoot = container.addEventListener.bind(container);
container.addEventListener = (t, ...r) => { rootAdd.push(t); return origRoot(t, ...r); };

function App(){ return e('button', { id:'b', onClick(){}, onChange(){} }, 'hi'); }
act(()=>createRoot(container).render(e(App)));
console.log('listeners on document      :', docAdd.length);
console.log('listeners on root container:', rootAdd.length, '<- React 17+ attaches HERE');
console.log('  sample:', rootAdd.slice(0,6).join(', '));

// Synthetic event object
let captured = null;
function App2(){ return e('button', { id:'b2', onClick(ev){ captured = ev; } }, 'x'); }
const c2 = document.createElement('div'); document.body.appendChild(c2);
act(()=>createRoot(c2).render(e(App2)));
act(()=>{ c2.querySelector('#b2').dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})); });
console.log('\nSynthetic event constructor:', captured.constructor.name);
console.log('  has nativeEvent?', !!captured.nativeEvent, '| native type:', captured.nativeEvent.constructor.name);
console.log('  isPersistent (pooling removed in 17):', typeof captured.isPersistent === 'function' ? captured.isPersistent() : 'n/a');
console.log('  target === real DOM node?', captured.target === c2.querySelector('#b2'));
