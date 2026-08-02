const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act } = React;
const e = React.createElement;

const N = 1000, ROUNDS = 30;
const mkData = (n, tag) => Array.from({length:n}, (_,i)=>({id:i, text:`${tag}-${i}`}));

// ---------- A. React: update ONE row out of 1000 ----------
function List({ items }) {
  return e('ul', null, items.map(it => e('li', { key: it.id }, it.text)));
}
const cReact = document.createElement('div'); document.body.appendChild(cReact);
const root = createRoot(cReact);
let data = mkData(N, 'row');
act(() => root.render(e(List, { items: data })));

let t = process.hrtime.bigint();
for (let r = 0; r < ROUNDS; r++) {
  const next = data.slice();
  next[500] = { id: 500, text: 'changed-' + r };   // ONE row differs
  data = next;
  act(() => root.render(e(List, { items: data })));
}
const reactOne = Number(process.hrtime.bigint() - t) / 1e6 / ROUNDS;

// ---------- B. Vanilla optimal: update the one node directly ----------
const cVan = document.createElement('div'); document.body.appendChild(cVan);
const ul = document.createElement('ul');
mkData(N,'row').forEach(it => { const li=document.createElement('li'); li.textContent=it.text; ul.appendChild(li); });
cVan.appendChild(ul);
t = process.hrtime.bigint();
for (let r = 0; r < ROUNDS; r++) ul.children[500].textContent = 'changed-' + r;
const vanillaOne = Number(process.hrtime.bigint() - t) / 1e6 / ROUNDS;

// ---------- C. Vanilla naive: innerHTML rebuild (what many devs actually write) ----------
const cNaive = document.createElement('div'); document.body.appendChild(cNaive);
t = process.hrtime.bigint();
for (let r = 0; r < ROUNDS; r++) {
  const d = mkData(N,'row'); d[500] = {id:500, text:'changed-'+r};
  cNaive.innerHTML = '<ul>' + d.map(it=>`<li>${it.text}</li>`).join('') + '</ul>';
}
const naiveRebuild = Number(process.hrtime.bigint() - t) / 1e6 / ROUNDS;

console.log(`Update 1 row of ${N}, avg over ${ROUNDS} rounds (jsdom):`);
console.log(`  A. React re-render        ${reactOne.toFixed(3)} ms`);
console.log(`  B. Vanilla optimal        ${vanillaOne.toFixed(3)} ms   <- lower bound`);
console.log(`  C. Vanilla innerHTML      ${naiveRebuild.toFixed(3)} ms   <- naive rebuild`);
console.log(`  React is ${(reactOne/vanillaOne).toFixed(0)}x slower than optimal, ${(naiveRebuild/reactOne).toFixed(1)}x faster than naive rebuild`);
