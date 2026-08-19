const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState, useContext, createContext, memo } = React;
const e = React.createElement;

const Ctx = createContext(null);
let counts = { reader: 0, plainSibling: 0, memoSibling: 0, memoReaderDeep: 0 };

function Reader()        { counts.reader++;       useContext(Ctx); return null; }
function PlainSibling()  { counts.plainSibling++;  return null; }                    // no memo, no context
const MemoSibling        = memo(function MemoSibling() { counts.memoSibling++; return null; }); // memo, no context

// A memoized component that DOES read context, nested a level deep
function MemoReaderInner() { counts.memoReaderDeep++; useContext(Ctx); return null; }
const MemoReaderDeep = memo(MemoReaderInner);

function Middle({ children }) { return e('div', null, children); } // unmemoized wrapper, for realism

function App() {
  const [n, setN] = useState(0);
  App.set = setN;
  return e(Ctx.Provider, { value: { n } },  // new object every render
    e(Reader),
    e(PlainSibling),
    e(MemoSibling),
    e(Middle, null, e(MemoReaderDeep)),     // memoized consumer, nested inside a plain wrapper
  );
}
const c = document.getElementById('r');
act(() => createRoot(c).render(e(App)));
console.log('after mount:      ', counts);
act(() => App.set(1));
act(() => App.set(2));
console.log('after 2 updates:  ', counts);
console.log('');
console.log('reader          (plain, uses context)      -> reran every time:', counts.reader === 3);
console.log('plainSibling    (no memo, no context)       -> reran every time (parent re-render):', counts.plainSibling === 3);
console.log('memoSibling     (memo, no context)          -> bailed out:', counts.memoSibling === 1);
console.log('memoReaderDeep  (memo, BUT uses context)    -> reran every time despite memo:', counts.memoReaderDeep === 3);
