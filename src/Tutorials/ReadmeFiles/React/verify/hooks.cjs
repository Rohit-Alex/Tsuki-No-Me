const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState, useRef, useEffect } = React;
const e = React.createElement;
const mk = () => { const c=document.createElement('div'); document.body.appendChild(c); return createRoot(c); };

// 1. STALE CLOSURE: [] deps captures the first render's value forever
console.log('=== 1. Stale closure ===');
function Stale() {
  const [n, setN] = useState(0);
  Stale.set = setN;
  useEffect(() => {
    const id = setInterval(() => console.log('   interval sees n =', n), 10);
    return () => clearInterval(id);
  }, []);                                   // ❌ empty deps
  return null;
}
const r1 = mk();
act(() => r1.render(e(Stale)));
act(() => Stale.set(5));
act(() => Stale.set(9));
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await wait(35);
  console.log('   (current state is 9, but the interval keeps logging 0)');

  // 2. useState initializer: function form runs ONCE
  console.log('\n=== 2. Lazy initial state ===');
  let eagerCalls = 0, lazyCalls = 0;
  const eager = () => { eagerCalls++; return 0; };
  function Init() {
    const [a] = useState(eager());            // ❌ runs EVERY render
    const [b] = useState(() => { lazyCalls++; return 0; });  // ✅ runs ONCE
    Init.set = useState(0)[1];
    return null;
  }
  const r2 = mk();
  act(() => r2.render(e(Init)));
  act(() => Init.set(1));
  act(() => Init.set(2));
  console.log('   after 3 renders -> eager() calls:', eagerCalls, '| lazy initializer calls:', lazyCalls);

  // 3. useRef does NOT trigger re-render
  console.log('\n=== 3. useRef vs useState ===');
  let renders = 0;
  function Ref() {
    renders++;
    const r = useRef(0);
    Ref.bump = () => { r.current++; };
    Ref.read = () => r.current;
    return null;
  }
  const r3 = mk();
  act(() => r3.render(e(Ref)));
  const before = renders;
  act(() => { Ref.bump(); Ref.bump(); Ref.bump(); });
  console.log('   3 ref mutations -> extra renders:', renders - before, '| ref value:', Ref.read());

  act(() => r1.unmount());   // stop the interval so the script exits
})();
