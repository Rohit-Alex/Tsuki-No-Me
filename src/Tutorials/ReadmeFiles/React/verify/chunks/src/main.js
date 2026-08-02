import Home from './home.js';
console.log(Home());
document.getElementById('go').onclick = async () => {
  const { default: Dashboard } = await import('./dashboard.js');   // ← split point
  console.log(Dashboard());
};
