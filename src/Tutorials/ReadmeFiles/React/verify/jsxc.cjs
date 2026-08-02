const babel = require('@babel/core');
const src = `
const a = <div className="x">Hello <b>{name}</b></div>;
const list = <ul>{items.map(i => <li key={i.id}>{i.t}</li>)}</ul>;
const frag = <><A/><B/></>;
`;
for (const runtime of ['classic', 'automatic']) {
  console.log('\n===== runtime:', runtime, '=====');
  console.log(babel.transformSync(src, {
    presets: [['@babel/preset-react', { runtime, development: false }]],
  }).code);
}
console.log('\n===== automatic + development =====');
console.log(babel.transformSync(src, {
  presets: [['@babel/preset-react', { runtime: 'automatic', development: true }]],
  filename: 'Demo.jsx',
}).code);
