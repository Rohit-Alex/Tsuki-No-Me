const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState, useMemo, memo } = React;
const e = React.createElement;
const mk = () => { const c=document.createElement('div'); document.body.appendChild(c); return createRoot(c); };
const ms = n => Number(n)/1e6;

// ---- 1. Does memo HELP or HURT on a cheap component? ----
const N = 200, ROUNDS = 60;
function makeRow(memoized) {
  const R = ({ text }) => e('li', null, text);
  return memoized ? memo(R) : R;
}
function bench(memoized) {
  const Row = makeRow(memoized);
  function List({ n }) {
    // props are STABLE (text never changes) -> best case for memo
    return e('ul', null, Array.from({length:N},(_,i)=>e(Row,{key:i,text:'row '+i})));
  }
  function App(){ const [n,setN]=useState(0); App.set=setN; return e('div',null,e(List,{n}),n); }
  const r = mk();
  act(()=>r.render(e(App)));
  const t0 = process.hrtime.bigint();
  for (let i=1;i<=ROUNDS;i++) act(()=>App.set(i));
  return ms(process.hrtime.bigint()-t0)/ROUNDS;
}
const noMemo = bench(false), withMemo = bench(true);
console.log('=== memo on 200 CHEAP rows with stable props ===');
console.log(`  without memo: ${noMemo.toFixed(3)} ms/update`);
console.log(`  with memo   : ${withMemo.toFixed(3)} ms/update`);
console.log(`  => memo is ${withMemo < noMemo ? 'FASTER' : 'SLOWER'} here (${(withMemo/noMemo).toFixed(2)}x)`);

// ---- 2. useMemo on a genuinely expensive computation ----
function heavy(n){ let s=0; for(let i=0;i<n;i++) s+=Math.sqrt(i); return s; }
function benchMemo(useIt){
  function App(){
    const [n,setN]=useState(0);
    App.set=setN;
    const v = useIt ? useMemo(()=>heavy(200000),[]) : heavy(200000);
    return e('div',null,String(v).slice(0,4), n);
  }
  const r = mk(); act(()=>r.render(e(App)));
  const t0=process.hrtime.bigint();
  for(let i=1;i<=20;i++) act(()=>App.set(i));
  return ms(process.hrtime.bigint()-t0)/20;
}
console.log('\n=== useMemo on an EXPENSIVE calc (200k loop), 20 re-renders ===');
const noUM = benchMemo(false), withUM = benchMemo(true);
console.log(`  without useMemo: ${noUM.toFixed(3)} ms/update`);
console.log(`  with useMemo   : ${withUM.toFixed(3)} ms/update`);
console.log(`  => ${(noUM/withUM).toFixed(0)}x faster with useMemo`);
