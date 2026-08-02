const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState } = React;
const e = React.createElement;

function Profile({ isLoggedIn }) {
  if (isLoggedIn) { useState('alice'); }   // conditional hook
  const [age] = useState(30);
  return e('span', null, 'age=' + age);
}
const c = document.getElementById('r');
const root = createRoot(c);
act(() => root.render(e(Profile, { isLoggedIn: true })));
console.log('render 1 (logged in):', c.textContent);
try {
  act(() => root.render(e(Profile, { isLoggedIn: false })));
  console.log('render 2:', c.textContent);
} catch (err) {
  console.log('\nERROR THROWN:\n' + err.message.split('\n')[0]);
}
