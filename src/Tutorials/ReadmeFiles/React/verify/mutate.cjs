const React = require('react');
const el = React.createElement('div', { className: 'blue' }, 'hi');

console.log('=== DEV BUILD (non-strict CJS: silent) ===');
console.log('before:', el.props.className);
el.props.className = 'red';               // sloppy mode -> silently ignored
console.log('after :', el.props.className);

console.log('\n=== DEV BUILD (strict mode: throws) ===');
try {
  (function(){ 'use strict'; el.props.className = 'red'; })();
} catch (e) { console.log(e.constructor.name + ':', e.message); }

console.log('\n=== adding a NEW prop (dev) ===');
try {
  (function(){ 'use strict'; el.props.title = 'new'; })();
} catch (e) { console.log(e.constructor.name + ':', e.message); }
