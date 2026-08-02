const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState, useEffect, useRef } = React;
const e = React.createElement;
const mk = () => { const c=document.createElement('div'); document.body.appendChild(c); return createRoot(c); };

console.log('PUZZLE 1: what does this log?');
function P1(){
  const [c,setC]=useState(0);
  P1.click = () => { setC(c+1); setC(c+1); setC(c+1); };
  return e('span',null,String(c));
}
let r=mk(); act(()=>r.render(e(P1))); act(()=>P1.click());
console.log('  setC(c+1) x3  ->', document.body.lastChild.textContent, '(NOT 3)');

function P1b(){
  const [c,setC]=useState(0);
  P1b.click = () => { setC(v=>v+1); setC(v=>v+1); setC(v=>v+1); };
  return e('span',null,String(c));
}
r=mk(); act(()=>r.render(e(P1b))); act(()=>P1b.click());
console.log('  setC(v=>v+1) x3 ->', document.body.lastChild.textContent);

console.log('\nPUZZLE 2: order of logs on mount + update');
const order=[];
function P2(){
  const [n,setN]=useState(0);
  P2.set=setN;
  order.push('render '+n);
  useEffect(()=>{ order.push('effect '+n); return ()=>order.push('cleanup '+n); },[n]);
  return null;
}
r=mk(); act(()=>r.render(e(P2))); act(()=>P2.set(1));
console.log('  ', order.join('  →  '));

console.log('\nPUZZLE 3: does the ref or the state win?');
function P3(){
  const [s,setS]=useState(0);
  const ref=useRef(0);
  P3.go=()=>{ ref.current+=1; setS(x=>x); };   // same value -> bailout
  P3.read=()=>({ state:s, ref:ref.current });
  return null;
}
r=mk(); act(()=>r.render(e(P3)));
act(()=>{P3.go();P3.go();P3.go();});
console.log('  after 3 ref bumps + setState(same):', JSON.stringify(P3.read()));

console.log('\nPUZZLE 4: stale closure in an event handler');
function P4(){
  const [n,setN]=useState(0);
  P4.set=setN;
  P4.delayed=()=>{ setTimeout(()=>{ P4.captured = n; },0); };
  return null;
}
r=mk(); act(()=>r.render(e(P4)));
act(()=>{ P4.delayed(); });          // captures n=0
act(()=>P4.set(5));
setTimeout(()=>console.log('  handler captured n =', P4.captured, '(state is now 5)'),10);
