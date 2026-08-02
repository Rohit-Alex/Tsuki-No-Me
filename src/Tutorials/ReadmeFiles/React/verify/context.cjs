const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState, useContext, createContext, memo } = React;
const e = React.createElement;

const Ctx = createContext(null);
let readerRenders = 0, siblingRenders = 0, memoSiblingRenders = 0;

function Reader()  { readerRenders++;  useContext(Ctx); return null; }
function Sibling() { siblingRenders++; return null; }                     // does NOT use context
const MemoSibling = memo(function MemoSibling() { memoSiblingRenders++; return null; });

function App() {
  const [n, setN] = useState(0);
  App.set = setN;
  // NEW OBJECT every render -> classic context perf bug
  return e(Ctx.Provider, { value: { n } }, e(Reader), e(Sibling), e(MemoSibling));
}
const c = document.getElementById('r');
act(() => createRoot(c).render(e(App)));
console.log('after mount:      reader=%d sibling=%d memoSibling=%d', readerRenders, siblingRenders, memoSiblingRenders);
act(() => App.set(1));
act(() => App.set(2));
console.log('after 2 updates:  reader=%d sibling=%d memoSibling=%d', readerRenders, siblingRenders, memoSiblingRenders);
console.log('\n-> memo does NOT protect a context consumer, but DOES protect a non-consumer sibling.');

// Does a consumer re-render if the value is referentially STABLE?
let stableReader = 0;
const Ctx2 = createContext(null);
const STABLE = { theme: 'dark' };
function R2(){ stableReader++; useContext(Ctx2); return null; }
function App2(){ const [n,setN]=useState(0); App2.set=setN; return e(Ctx2.Provider,{value:STABLE}, e(R2), 'n='+n); }
const c2 = document.createElement('div'); document.body.appendChild(c2);
act(() => createRoot(c2).render(e(App2)));
const base = stableReader;
act(() => App2.set(1));
console.log('\nstable context value -> consumer re-rendered anyway? %s (because PARENT re-rendered)', stableReader > base);
