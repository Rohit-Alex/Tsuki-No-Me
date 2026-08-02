const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState } = React;
const e = React.createElement;

// Does React build DOM "wholesale" ONLY on first mount?
function Row({ i }) { return e('li', null, 'row ' + i); }
function List({ k, n }) {
  return e('ul', { key: k }, Array.from({length:n}, (_,i)=>e(Row,{key:i,i})));
}
const c = document.createElement('div'); document.body.appendChild(c);
const root = createRoot(c);

act(() => root.render(e(List, { k: 'a', n: 3 })));
const firstUL = c.querySelector('ul');
const firstLIs = [...c.querySelectorAll('li')];
console.log('mount: created', firstLIs.length, 'li nodes');

// change the KEY on the ul -> whole subtree rebuilt AFTER initial mount
act(() => root.render(e(List, { k: 'b', n: 3 })));
const secondUL = c.querySelector('ul');
const secondLIs = [...c.querySelectorAll('li')];
console.log('after key change: same <ul> node?', firstUL === secondUL);
console.log('after key change: any <li> node reused?', firstLIs.some(n => secondLIs.includes(n)));
console.log('=> React rebuilt', secondLIs.length, 'li nodes wholesale, NOT on initial mount');
