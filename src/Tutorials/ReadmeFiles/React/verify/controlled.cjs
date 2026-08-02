const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState } = React;
const e = React.createElement;

// value WITHOUT onChange -> React makes it read-only
function Frozen(){ return e('input', { id:'frozen', value: 'locked' }); }
const c1 = document.createElement('div'); document.body.appendChild(c1);
const origErr = console.error; const warns = [];
console.error = (...a) => warns.push(String(a[0]));
act(() => createRoot(c1).render(e(Frozen)));
console.error = origErr;
const frozen = c1.querySelector('#frozen');
frozen.value = 'user typed';                    // simulate typing
console.log('controlled w/o onChange -> React warns?', warns.some(w=>w.includes('without an `onChange`')));
console.log('   warning:', (warns.find(w=>w.includes('without an `onChange`'))||'').slice(0,95));

// switching uncontrolled -> controlled
const warns2 = [];
function Switcher({ ctrl }) { return e('input', ctrl ? { value:'x', onChange(){} } : { defaultValue:'x' }); }
const c2 = document.createElement('div'); document.body.appendChild(c2);
const root2 = createRoot(c2);
console.error = (...a) => warns2.push(String(a[0]));
act(() => root2.render(e(Switcher,{ctrl:false})));
act(() => root2.render(e(Switcher,{ctrl:true})));
console.error = origErr;
console.log('\nuncontrolled -> controlled switch warns?', warns2.some(w=>w.includes('changing an uncontrolled input')));
console.log('   warning:', (warns2.find(w=>w.includes('uncontrolled'))||'').slice(0,110));
