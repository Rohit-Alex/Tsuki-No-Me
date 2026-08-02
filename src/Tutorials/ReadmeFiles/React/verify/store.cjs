const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><div id="r"></div>');
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
const { act, useState, useContext, createContext, useReducer, useSyncExternalStore } = React;
const e = React.createElement;
const mk = () => { const c=document.createElement('div'); document.body.appendChild(c); return createRoot(c); };

console.log('=== A. ONE context holding {user, theme} ===');
const One = createContext(null);
let userReader = 0, themeReader = 0;
function UserBadge(){ userReader++;  useContext(One); return null; }
function ThemeBtn() { themeReader++; useContext(One); return null; }
function AppOne(){
  const [user,setUser]=useState('alice'); const [theme,setTheme]=useState('light');
  AppOne.setTheme=setTheme;
  return e(One.Provider,{value:{user,theme}}, e(UserBadge), e(ThemeBtn));
}
const r1=mk(); act(()=>r1.render(e(AppOne)));
let b=[userReader,themeReader];
act(()=>AppOne.setTheme('dark')); act(()=>AppOne.setTheme('light'));
console.log(`  after 2 THEME changes -> userReader re-rendered ${userReader-b[0]}x  (it doesn't use theme!)`);

console.log('\n=== B. SPLIT contexts ===');
const UserCtx = createContext(null), ThemeCtx = createContext(null);
let userReader2 = 0, themeReader2 = 0;
function UserBadge2(){ userReader2++;  useContext(UserCtx); return null; }
function ThemeBtn2() { themeReader2++; useContext(ThemeCtx); return null; }
const Kids = React.memo(function Kids(){ return e(React.Fragment,null,e(UserBadge2),e(ThemeBtn2)); });
function AppTwo(){
  const [user]=useState('alice'); const [theme,setTheme]=useState('light');
  AppTwo.setTheme=setTheme;
  return e(UserCtx.Provider,{value:user}, e(ThemeCtx.Provider,{value:theme}, e(Kids)));
}
const r2=mk(); act(()=>r2.render(e(AppTwo)));
b=[userReader2,themeReader2];
act(()=>AppTwo.setTheme('dark')); act(()=>AppTwo.setTheme('light'));
console.log(`  after 2 THEME changes -> userReader ${userReader2-b[0]}x, themeReader ${themeReader2-b[1]}x`);

console.log('\n=== C. External store + useSyncExternalStore (selector) ===');
let state={user:'alice',theme:'light'}; const subs=new Set();
const store={ subscribe(f){subs.add(f); return ()=>subs.delete(f);}, get:()=>state,
  set(p){ state={...state,...p}; subs.forEach(f=>f()); } };
let u3=0,t3=0;
function U3(){ u3++;  useSyncExternalStore(store.subscribe, ()=>store.get().user);  return null; }
function T3(){ t3++;  useSyncExternalStore(store.subscribe, ()=>store.get().theme); return null; }
const r3=mk(); act(()=>r3.render(e('div',null,e(U3),e(T3))));
b=[u3,t3];
act(()=>store.set({theme:'dark'})); act(()=>store.set({theme:'light'}));
console.log(`  after 2 THEME changes -> user subscriber ${u3-b[0]}x, theme subscriber ${t3-b[1]}x`);
console.log('\n  => selectors give per-slice subscriptions; context cannot.');
