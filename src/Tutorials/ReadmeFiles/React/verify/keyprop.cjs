const React = require('react');
const keyed = React.createElement('li', { key: 'k', id: 'i' });
const d = Object.getOwnPropertyDescriptor(keyed.props, 'key');
console.log('descriptor for props.key:', d);
console.log('enumerable?', d && d.enumerable, '| has getter?', !!(d && d.get));
console.log('Object.keys(props):', Object.keys(keyed.props));
console.log('reading props.key (expect dev warning):');
console.log('  value =', keyed.props.key);
