const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState, useEffect } = React;
const e = React.createElement;

const log = [];
const t0 = Date.now();
const at = () => String(Date.now() - t0).padStart(3) + 'ms';
const fakeFetch = (name, delay) => new Promise(res => setTimeout(() => { log.push(`${at()}  <- ${name} arrived`); res(name); }, delay));

function Child() {
  const [d, setD] = useState(null);
  useEffect(() => { log.push(`${at()}  Child  starts fetching`); fakeFetch('child', 50).then(setD); }, []);
  return d ? e('span', null, d) : null;
}
function Parent() {
  const [d, setD] = useState(null);
  useEffect(() => { log.push(`${at()}  Parent starts fetching`); fakeFetch('parent', 50).then(setD); }, []);
  return d ? e(Child) : null;      // child can't render (or fetch) until parent's data lands
}
const root = createRoot(document.getElementById('r'));
act(() => root.render(e(Parent)));
setTimeout(() => {
  console.log('=== useEffect fetch waterfall ===');
  log.forEach(l => console.log('  ' + l));
  console.log('\n  Two 50ms requests took ~100ms because they ran in SEQUENCE.');
  console.log('  The child could not even START until the parent finished.');
}, 250);
