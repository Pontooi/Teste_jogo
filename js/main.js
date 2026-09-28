// ============== INICIALIZAÇÃO ==============
// Limpa restos da Arena (removida) de versões anteriores.
try{ localStorage.removeItem('dualdev_arena'); }catch(e){}
STATE.achievements = (STATE.achievements||[]).filter(id=>ACHIEVEMENTS.some(a=>a.id===id));
saveState();

window.addEventListener('load', render);
render();
