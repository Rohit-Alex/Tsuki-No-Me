const React = require('react');
const { renderToString, renderToStaticMarkup } = require('react-dom/server');
const { useState } = React;
const e = React.createElement;

function Counter() {
  const [n, setN] = useState(0);
  return e('button', { onClick: () => setN(n+1) }, 'Count: ' + n);
}
function App() { return e('div', { id: 'app' }, e('h1', null, 'Hello'), e(Counter)); }

console.log('=== renderToString (for hydration) ===');
const html = renderToString(e(App));
console.log(html);
console.log('\n=== renderToStaticMarkup (no hydration) ===');
console.log(renderToStaticMarkup(e(App)));
console.log('\nNote: onClick appears in NEITHER. HTML cannot carry a function.');
console.log('That gap between "HTML arrives" and "JS attaches handlers" IS hydration.');
