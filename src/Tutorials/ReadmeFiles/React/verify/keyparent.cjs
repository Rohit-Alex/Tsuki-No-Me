const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState } = React;
const e = React.createElement;

function Editor() {
  const [text, setText] = useState('');
  Editor.set = setText;
  return e('span', null, 'text=' + (text || '(empty)'));
}

function run(label, first, second) {
  const c = document.createElement('div'); document.body.appendChild(c);
  const root = createRoot(c);
  act(() => root.render(first()));
  act(() => Editor.set('hello'));       // user types
  const before = c.textContent;
  act(() => root.render(second()));
  const after = c.textContent;
  console.log(`${label}\n   ${before}  ->  ${after}   ${before===after?'KEPT':'LOST'}\n`);
}

// 1. parent type changes, NO key
run('1. <div><Editor/></div> -> <section><Editor/></section>   (no key)',
    () => e('div', null, e(Editor)),
    () => e('section', null, e(Editor)));

// 2. parent type changes, Editor HAS a stable key  <- the claim to test
run('2. same, but <Editor key="editor"/> in BOTH branches',
    () => e('div', null, e(Editor, { key: 'editor' })),
    () => e('section', null, e(Editor, { key: 'editor' })));

// 3. key on the PARENT instead, kept stable
run('3. key on parent: <div key="w"> -> <section key="w">',
    () => e('div', { key: 'w' }, e(Editor)),
    () => e('section', { key: 'w' }, e(Editor)));

// 4. control: parent type SAME, no key
run('4. control: <div><Editor/></div> -> <div><Editor/></div>',
    () => e('div', null, e(Editor)),
    () => e('div', null, e(Editor)));
