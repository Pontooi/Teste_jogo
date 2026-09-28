// ============== PÁGINA: SOBRE ==============
const LANG_ICONS = {
  html:   'assets/icons/html5.svg',
  css:    'assets/icons/css3.svg',
  js:     'assets/icons/javascript.svg',
  python: 'assets/icons/python.svg',
  java:   'assets/icons/java.svg'
};

function renderSobre(app){
  const cards = Object.entries(TRACKS).map(([k,t])=>{
    const done = t.nodes.filter(n=>isDone(k,n.id)).length;
    const total = t.nodes.length;
    const pct = Math.round(100*done/total);
    const completo = done === total;
    return `<div class="achievement-card cov-card${completo?' earned':''}" data-rarity="${completo?'raro':'comum'}">
      <img class="lang-icon" src="${LANG_ICONS[k]}" alt="Logo de ${t.label}" width="46" height="46" loading="lazy">
      <strong>${t.label}</strong><br>
      <span style="font-size:.78rem">${done}/${total} lições</span>
      <div class="ach-progress"><i style="width:${pct}%"></i></div>
    </div>`;
  }).join('');

  app.innerHTML = `<h1>Sobre o DualDev</h1>
    <p>Projeto para o trabalho de Desenvolvimento de Sistemas: um campus digital de estudo, direto no navegador e sem instalar nada.</p>
    <p><strong>Etapa atual:</strong> Academia com ${totalNodes()} lições (todas com quiz e dicas), playground ao vivo, sistema de XP e conquistas com raridades.</p>
    <p><strong>Limitação conhecida:</strong> o laboratório Python/Java entende só o essencial (funções, for, if/else, return, print). É um ambiente de treino, não um compilador completo.</p>
    <p>O progresso é salvo no navegador (localStorage), sem login e sem backend.</p>

    <h2 style="margin-top:1.6rem;margin-bottom:.2rem">Cobertura do currículo</h2>
    <p style="color:var(--muted);font-size:.9rem;margin-top:0">As cinco linguagens ensinadas na Academia, com o progresso de cada trilha.</p>
    <div class="achievement-grid">${cards}</div>`;
}
