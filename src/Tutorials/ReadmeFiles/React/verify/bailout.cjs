const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState, memo } = React;
const e = React.createElement;

// 1. Same value -> bailout
let renders = 0;
function A() { renders++; const [v,setV]=useState(0); A.set=setV; return null; }
const c1=document.createElement('div'); document.body.appendChild(c1);
act(()=>createRoot(c1).render(e(A)));
const afterMount = renders;
act(()=>A.set(0));  // same value
act(()=>A.set(0));
console.log(`setState with SAME value: renders after mount = ${renders-afterMount} (bailout)`);
act(()=>A.set(5));
console.log(`setState with NEW value:  +${renders-afterMount-0} render total after changes`);

// 2. Object identity: same content, new reference
let r2=0;
function B(){ r2++; const [o,setO]=useState({n:1}); B.set=setO; return null; }
const c2=document.createElement('div'); document.body.appendChild(c2);
act(()=>createRoot(c2).render(e(B)));
const b0=r2;
act(()=>B.set({n:1}));  // identical content, DIFFERENT reference
console.log(`\nsetState({n:1}) with new object ref (same content): +${r2-b0} render (Object.is fails)`);

// 3. Child re-renders by default even with unchanged props
let parent=0, child=0, memoChild=0;
function Child(){ child++; return null; }
const MemoChild = memo(function MemoChild(){ memoChild++; return null; });
function Parent(){ parent++; const [n,setN]=useState(0); Parent.set=setN;
  return e('div', null, e(Child, {static: 'x'}), e(MemoChild, {static:'x'})); }
const c3=document.createElement('div'); document.body.appendChild(c3);
act(()=>createRoot(c3).render(e(Parent)));
const p0=parent,ch0=child,m0=memoChild;
act(()=>Parent.set(1)); act(()=>Parent.set(2));
console.log(`\nParent re-rendered ${parent-p0}x with UNCHANGED child props:`);
console.log(`  plain child re-rendered: ${child-ch0}x  <- default: children always re-run`);
console.log(`  memo child re-rendered:  ${memoChild-m0}x  <- memo bails out`);
