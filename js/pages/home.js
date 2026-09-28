function renderHome(app){
  const lvl = levelFromXP(STATE.xp||0), inLvl = xpInLevel(STATE.xp||0);
  const earnedAch = (STATE.achievements||[]).length;
  app.innerHTML = `
    <section class="hero">
      <h1>DualDev</h1>
      <p>Aprenda o que a turma já viu, testando o código na hora.</p>
      <div class="xp-row">
        <span class="level-pill" id="levelPill">Nv ${lvl}</span>
        <div class="xp-track"><div class="xp-fill" id="xpFill" style="width:${Math.round(100*inLvl/50)}%"></div></div>
        <span class="mono" style="font-size:.78rem;color:var(--muted)">${inLvl}/50 XP · total ${STATE.xp||0}</span>
      </div>
      <div class="progress-wrap"><div class="progress-bar" id="gprogress"></div></div>
      <p class="mono" id="gprogress-txt" style="font-size:.8rem;color:var(--muted)"></p>
      <div class="chips" id="chips"></div>
    </section>
    <div class="stat-grid">
      <div class="stat-card"><b>${STATE.completed.length}</b><span>lições concluídas</span></div>
      <div class="stat-card"><b>${earnedAch}</b><span>conquistas desbloqueadas</span></div>
      <div class="stat-card"><b>${STATE.xp||0}</b><span>XP total</span></div>
      <div class="stat-card"><b>${STATE.visits||1}</b><span>dias estudando</span></div>
    </div>
    <div class="intro-grid">
      <div class="intro-card"><h3>O que é</h3><p>Um campus digital para a matéria: você aprende um conceito e testa escrevendo código de verdade — sem instalar nada.</p></div>
      <div class="intro-card"><h3>Como usar</h3><p>Escolha uma linguagem, entre na Academia para estudar por nós de um roadmap, e use o playground ao lado: o resultado muda a cada tecla.</p></div>
      <div class="intro-card"><h3>XP e conquistas</h3><p>Cada lição concluída rende XP e destrava conquistas. Seu progresso fica salvo no navegador, sem login.</p></div>
    </div>
    <div class="portas">
      <a class="porta" data-route="/academia"><span class="tag">Estudo</span><h2>Academia</h2><p>Roadmap clicável + lições estilo W3Schools, com playground ao vivo em cada uma.</p></a>
      <a class="porta" data-route="/conquistas"><span class="tag">Metas</span><h2>Conquistas</h2><p>Acompanhe troféus por linguagem, XP e dedicação.</p></a>
      <a class="porta" data-route="/sobre"><span class="tag">Info</span><h2>Sobre o projeto</h2><p>Como o DualDev foi feito e o que já está pronto.</p></a>
    </div>
    <section style="margin-top:2rem">
      <h2 style="margin-bottom:.4rem">Conquistas recentes</h2>
      <p style="color:var(--muted);font-size:.9rem;margin-top:0">As próximas metas que você está perto de alcançar.</p>
      <div class="achievement-grid" id="achGrid"></div>
    </section>`;
  const chips=app.querySelector('#chips');
  Object.entries(TRACKS).forEach(([key,t])=>{
    const c=document.createElement('button'); c.className='chip'+(STATE.trilha===key?' on':''); c.textContent=t.label;
    c.onclick=()=>{ STATE.trilha=key; saveState(); goto('/academia'); };
    chips.appendChild(c);
  });
  const ag=app.querySelector('#achGrid');
  const ordenadas = [...ACHIEVEMENTS].sort((a,b)=>{
    const da=(STATE.achievements||[]).includes(a.id)?1:0;
    const db=(STATE.achievements||[]).includes(b.id)?1:0;
    return da-db;
  }).slice(0,8);
  ordenadas.forEach(a=>{
    const earned=(STATE.achievements||[]).includes(a.id);
    const el=document.createElement('div');
    el.className='achievement-card'+(earned?' earned':'');
    el.dataset.rarity=a.rarity;
    const goal = typeof a.goal==='function'?a.goal():(a.goal||null);
    const prog = a.progress?a.progress():0;
    const pct  = goal?Math.min(100, Math.round(100*prog/goal)):null;
    el.innerHTML='<span class="ac-icon">'+a.icon+'</span><strong>'+a.label+'</strong><br><span style="font-size:.76rem">'+a.desc+'</span>'
      + (goal? '<div class="ach-progress"><i style="width:'+pct+'%"></i></div><span style="font-size:.7rem;color:var(--muted)">'+Math.min(prog,goal)+'/'+goal+'</span>' : '');
    ag.appendChild(el);
  });
  updateProgressUI();
}
