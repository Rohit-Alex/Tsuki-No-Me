const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState, useContext, createContext, Children, cloneElement } = React;
const e = React.createElement;
const mk = () => { const c=document.createElement('div'); document.body.appendChild(c); return createRoot(c); };

console.log('=== Why cloneElement/Children is fragile ===');
// Compound component built with Children.map + cloneElement
function TabsClone({ children, active }) {
  return e('div', null, Children.map(children, (child, i) =>
    cloneElement(child, { isActive: i === active })));
}
function Tab({ label, isActive }) { return e('span', null, `${label}${isActive?'*':''} `); }
function MoreTabs() { return e(React.Fragment, null, e(Tab,{label:'C'}), e(Tab,{label:'D'})); }

const c1 = mk();
act(()=>c1.render(e(TabsClone,{active:0}, e(Tab,{label:'A'}), e(Tab,{label:'B'}))));
console.log('  direct children  :', document.body.lastChild.textContent, ' (A is active - works)');

const c2 = mk();
act(()=>c2.render(e(TabsClone,{active:0}, e(Tab,{label:'A'}), e(MoreTabs))));
console.log('  wrapped children :', document.body.lastChild.textContent, ' <- C and D got NOTHING');
console.log('  Children.count sees', 2, 'children, but 3 tabs render. cloneElement cannot reach inside MoreTabs.');

console.log('\n=== Same thing with Context (the recommended way) ===');
const TabCtx = createContext(null);
let idx = 0;
function TabsCtx({ children, active }) {
  idx = 0;
  return e(TabCtx.Provider, { value: { active } }, children);
}
function CtxTab({ label }) {
  const { active } = useContext(TabCtx);
  const myIndex = idx++;
  return e('span', null, `${label}${myIndex===active?'*':''} `);
}
function MoreCtxTabs(){ return e(React.Fragment,null,e(CtxTab,{label:'C'}),e(CtxTab,{label:'D'})); }
const c3 = mk();
act(()=>c3.render(e(TabsCtx,{active:2}, e(CtxTab,{label:'A'}), e(MoreCtxTabs))));
console.log('  nested children  :', document.body.lastChild.textContent, ' <- C (index 2) IS active, even nested');
