const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState, memo } = React;
const e = React.createElement;
const mk = () => { const c=document.createElement('div'); document.body.appendChild(c); return createRoot(c); };

// Count ACTUAL child renders to confirm memo is/ isn't bailing out
let plainRenders = 0, memoRenders = 0;
const Plain = ({item}) => { plainRenders++; return e('li',null,item.text); };
const Memoed = memo(({item}) => { memoRenders++; return e('li',null,item.text); });

function App({ Comp, changing }) {
  const [n,setN]=useState(0); App.set=setN;
  return e('ul',null,Array.from({length:50},(_,i)=>
    e(Comp,{key:i, item: changing ? {text:'row '+i+' '+n} : STABLE[i]})));
}
const STABLE = Array.from({length:50},(_,i)=>({text:'row '+i}));

for (const [label, Comp, changing, counter] of [
  ['plain, changing props', Plain, true, ()=>plainRenders],
  ['memo,  changing props', Memoed, true, ()=>memoRenders],
]) {
  plainRenders = 0; memoRenders = 0;
  const r = mk(); act(()=>r.render(e(App,{Comp,changing})));
  const base = counter();
  for(let i=1;i<=10;i++) act(()=>App.set(i));
  console.log(`${label}: ${counter()-base} child renders over 10 updates (50 rows => 500 expected if never bailing)`);
}

plainRenders = 0; memoRenders = 0;
const r2 = mk(); act(()=>r2.render(e(App,{Comp:Memoed,changing:false})));
const b2 = memoRenders;
for(let i=1;i<=10;i++) act(()=>App.set(i));
console.log(`memo,  STABLE props   : ${memoRenders-b2} child renders over 10 updates  <- memo actually bails out`);
