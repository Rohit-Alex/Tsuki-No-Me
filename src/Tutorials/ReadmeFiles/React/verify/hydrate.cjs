const { JSDOM } = require('jsdom');
const React = require('react');
const { renderToString } = require('react-dom/server');
const e = React.createElement;

// Server renders one thing, client renders another -> mismatch
function Clock() { return e('p', null, 'Rendered at: ' + (globalThis.__SERVER ? 'SERVER-TIME' : 'CLIENT-TIME')); }

globalThis.__SERVER = true;
const serverHTML = renderToString(e(Clock));
console.log('Server HTML :', serverHTML);
globalThis.__SERVER = false;

const dom = new JSDOM(`<!doctype html><div id="root">${serverHTML}</div>`);
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const { hydrateRoot } = require('react-dom/client');
const { act } = React;

const warns = [];
const orig = console.error;
console.error = (...a) => warns.push(a.map(String).join(' '));
act(() => { hydrateRoot(document.getElementById('root'), e(Clock)); });
console.error = orig;

console.log('Client wants:', 'CLIENT-TIME');
console.log('\nMismatch warning fired?', warns.some(w => /hydrat/i.test(w)));
const w = warns.find(w => /hydrat/i.test(w)) || '';
console.log('  ->', w.split('\n')[0].slice(0, 130));
console.log('\nFinal DOM  :', document.getElementById('root').innerHTML);
console.log('  (React discarded the server HTML and re-rendered on the client)');
