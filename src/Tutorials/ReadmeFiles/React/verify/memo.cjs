const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState, useCallback, memo } = React;
const e = React.createElement;
const mk = () => { const c=document.createElement('div'); document.body.appendChild(c); return createRoot(c); };

let plainChild = 0, memoChildInline = 0, memoChildCb = 0;
const Plain      = function P(){ plainChild++; return null; };
const MemoInline = memo(function M1(){ memoChildInline++; return null; });
const MemoCb     = memo(function M2(){ memoChildCb++; return null; });

function App() {
  const [n, setN] = useState(0);
  App.set = setN;
  const inline = () => {};                       // ❌ new function every render
  const stable = useCallback(() => {}, []);      // ✅ same function every render
  return e('div', null,
    e(Plain,      { onClick: inline }),
    e(MemoInline, { onClick: inline }),   // memo defeated by new prop identity
    e(MemoCb,     { onClick: stable }));  // memo works
}
const r = mk();
act(() => r.render(e(App)));
const base = [plainChild, memoChildInline, memoChildCb];
act(() => App.set(1)); act(() => App.set(2)); act(() => App.set(3));
console.log('After 3 parent re-renders, child render counts:');
console.log('  plain child                       :', plainChild - base[0]);
console.log('  memo + inline fn prop             :', memoChildInline - base[1], ' <- memo USELESS here');
console.log('  memo + useCallback fn prop        :', memoChildCb - base[2], ' <- memo works');
