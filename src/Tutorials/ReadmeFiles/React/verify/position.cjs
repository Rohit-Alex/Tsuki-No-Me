const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState } = React;
const e = React.createElement;

function Counter() {
  const [n, setN] = useState(0);
  Counter.set = setN;
  return e('span', null, 'count=' + n);
}

function run(label, wrapFirst, wrapSecond) {
  const c = document.createElement('div'); document.body.appendChild(c);
  const root = createRoot(c);
  act(() => root.render(wrapFirst(e(Counter))));
  act(() => Counter.set(5));                    // user increments to 5
  const before = c.textContent;
  act(() => root.render(wrapSecond(e(Counter)))); // now change the wrapper
  console.log(`${label}\n   before: ${before}   after: ${c.textContent}\n`);
}

// A. same position, no wrapper change
run('A. <Counter/> -> <Counter/>  (identical)',
    el => el, el => el);

// B. WRAPPED in a new div  <- the user's question
run('B. <Counter/> -> <div><Counter/></div>  (now nested deeper)',
    el => el, el => e('div', null, el));

// C. wrapper element TYPE changes around it
run('C. <div><Counter/></div> -> <section><Counter/></section>',
    el => e('div', null, el), el => e('section', null, el));

// D. same wrapper type, extra sibling ADDED BEFORE it (index shifts)
run('D. <div><Counter/></div> -> <div><p/><Counter/></div>  (index 0 -> 1)',
    el => e('div', null, el), el => e('div', null, e('p', null, 'new'), el));

// E. same as D but Counter has a stable key
run('E. same as D, but <Counter key="c"/>',
    el => e('div', null, e(Counter, { key: 'c' })),
    el => e('div', null, e('p', { key: 'p' }, 'new'), e(Counter, { key: 'c' })));
