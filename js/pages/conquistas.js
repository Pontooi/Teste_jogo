function renderConquistas(app){
  const earned = STATE.achievements||[];
  const cats = {};
  ACHIEVEMENTS.forEach(a=>{ (cats[a.cat] ||= []).push(a); });
  const rarCores = {comum:'#8B85A8', raro:'#60A5FA', 'épico':'#C084FC', 'lendário':'#F5B942'};
  app.innerHTML = `<h1>Conquistas</h1>
    <p style="color:var(--muted)">Você desbloqueou <b style="color:var(--fg)">${earned.length}</b> de ${ACHIEVEMENTS.length}. Raridades vão de <span style="color:${rarCores.comum}">comum</span> a <span style="color:${rarCores['lendário']}">lendário</span>.</p>
    <div class="progress-wrap" style="margin-bottom:1rem"><div class="progress-bar" style="width:${Math.round(100*earned.length/ACHIEVEMENTS.length)}%"></div></div>
    ${Object.entries(cats).map(([cat,list])=>`
      <h2 style="margin-top:1.6rem">${cat}</h2>
      <div class="achievement-grid">
        ${list.map(a=>{
          const ok=earned.includes(a.id);
          const goal = typeof a.goal==='function'?a.goal():(a.goal||null);
          const prog = a.progress?a.progress():0;
          const pct  = goal?Math.min(100, Math.round(100*prog/goal)):null;
          return `<div class="achievement-card${ok?' earned':''}" data-rarity="${a.rarity}">
            <span class="ac-icon">${a.icon}</span>
            <strong>${a.label}</strong><br>
            <span style="font-size:.76rem">${a.desc}</span>
            ${goal?'<div class="ach-progress"><i style="width:'+pct+'%"></i></div><span style="font-size:.7rem;color:var(--muted)">'+Math.min(prog,goal)+'/'+goal+'</span>':''}
          </div>`;
        }).join('')}
      </div>`).join('')}`;
}
