const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="root"></div><div id="modal-host"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot, createPortal } = require('react-dom/client').createRoot ? require('react-dom/client') : {};
const RD = require('react-dom');
const { act, createContext, useContext } = React;
const e = React.createElement;
const { createRoot: cr } = require('react-dom/client');

const Ctx = createContext('default');
const host = document.getElementById('modal-host');
const root = document.getElementById('root');

function Modal() {
  const v = useContext(Ctx);
  return RD.createPortal(
    e('button', { id: 'portal-btn' }, 'ctx=' + v),
    host
  );
}
function App() {
  return e(Ctx.Provider, { value: 'from-provider' },
    e('div', { id: 'react-parent', onClick: () => console.log('  ✅ React parent onClick FIRED (event bubbled through React tree)') },
      e(Modal)));
}
act(() => cr(root).render(e(App)));

console.log('DOM placement:');
console.log('  #root innerHTML      :', root.innerHTML);
console.log('  #modal-host innerHTML:', host.innerHTML);
console.log('  button is a DOM child of #root?', !!root.querySelector('#portal-btn'));
console.log('\nContext through the portal:', host.querySelector('#portal-btn').textContent);
console.log('\nClicking the portalled button (it lives OUTSIDE #root in the DOM):');
act(() => { host.querySelector('#portal-btn').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })); });
