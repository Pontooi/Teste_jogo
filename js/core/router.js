// ============== NAVEGAÇÃO ==============
function goto(route){
  const h = '#' + route;
  if(location.hash !== h){
    try { history.pushState(null, '', h); }
    catch(e){ location.hash = h; }
  }
  render();
}
function render(){
  const hash = location.hash || '#/';
  const path = hash.split('?')[0];
  const route = path.replace(/^#/, '') || '/';
  const app = document.getElementById('app');
  document.querySelectorAll('#nav a[data-route]').forEach(a=>{
    const r = a.getAttribute('data-route');
    a.classList.toggle('active', r==='/' ? route==='/' : route.startsWith(r));
  });
  if(route.startsWith('/academia')) renderAcademia(app);
  else if(route.startsWith('/conquistas')) renderConquistas(app);
  else if(route.startsWith('/sobre')) renderSobre(app);
  else renderHome(app);
  updateProgressUI();
}
document.addEventListener('click', (e)=>{
  const el = e.target.closest('[data-route]');
  if(!el) return;
  e.preventDefault();
  goto(el.getAttribute('data-route'));
});
window.addEventListener('popstate', render);
