const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState } = React;
const e = React.createElement;

function Avatar({ src }) { return e('img', { src }); }
function Header({ user }) { return e('header', null, e('h1', null, user), e(Avatar, { src: 'a.png' })); }
function Item({ text })   { return e('li', null, text); }
function List({ items })  { return e('ul', null, items.map(t => e(Item, { key: t, text: t }))); }
function App() {
  const [n, setN] = useState(0);
  App.set = setN;
  return e('div', { className: 'app' }, e(Header, { user: 'Rohit' }), e(List, { items: ['a','b'] }), e('footer', null, n));
}

const c = document.getElementById('r');
const root = createRoot(c);
act(() => root.render(e(App)));

const key = Object.keys(c).find(k => k.startsWith('__reactContainer'));
const fiberRoot = c[key].stateNode;

const TAGS = {0:'FunctionComponent',3:'HostRoot',5:'HostComponent',6:'HostText',7:'Fragment'};
function name(f){
  const t = TAGS[f.tag] || 'tag'+f.tag;
  const n = typeof f.type === 'function' ? f.type.name : (typeof f.type === 'string' ? `<${f.type}>` : '');
  return `${n || t}${f.key!=null?` key="${f.key}"`:''}   [${t}]`;
}
let count = 0;
function walk(f, depth, prefix){
  while (f) {
    count++;
    console.log('  '.repeat(depth) + prefix + name(f));
    if (f.child) walk(f.child, depth+1, '└─ ');
    f = f.sibling;
    prefix = '├─ ';
  }
}
console.log('=== ONE fiber tree for the WHOLE app ===\n');
walk(fiberRoot.current, 0, '');
console.log(`\nTotal fibers in the single tree: ${count}`);
