function renderAcademia(app){
  const trilha = STATE.trilha || 'html';
  const track = TRACKS[trilha];
  if(!track){ app.innerHTML='<div class="empty-state">Trilha não encontrada.</div>'; return; }
  const params = new URLSearchParams(location.hash.split('?')[1]||'');
  const noAtual = params.get('no') || track.nodes[0].id;

  const doneCount = track.nodes.filter(n=>isDone(trilha,n.id)).length;

  app.innerHTML = `<h1 style="margin-bottom:.2rem">Academia — ${track.label}</h1>
    <p style="color:var(--muted);margin-top:0">Roadmap · ${doneCount}/${track.nodes.length} nós concluídos · <span class="tag-ling">${track.label}</span></p>
    <div class="chips" id="trocaTrilha"></div>
    <div class="layout-academia" style="margin-top:1rem">
      <div class="roadmap" id="roadmap"></div>
      <div id="lessonArea"></div>
    </div>`;

  const trocaTrilha = app.querySelector('#trocaTrilha');
  Object.entries(TRACKS).forEach(([key,t])=>{
    const c=document.createElement('button'); c.className='chip'+(trilha===key?' on':''); c.textContent=t.label;
    c.onclick=()=>{ STATE.trilha=key; saveState(); goto('/academia'); };
    trocaTrilha.appendChild(c);
  });

  const roadmapEl = app.querySelector('#roadmap');
  track.nodes.forEach(n=>{
    const b=document.createElement('button');
    const done = isDone(trilha,n.id);
    b.className='node'+(done?' done':'')+(n.id===noAtual?' active':'');
    b.innerHTML = (done?'✓ ':'') + n.titulo + ' <span class="mono" style="font-size:.72em;color:var(--muted)">· '+n.tempo+'min</span>';
    b.onclick=()=>{ goto('/academia?no='+n.id); };
    roadmapEl.appendChild(b);
  });

  const area = app.querySelector('#lessonArea');
  const lesson = (LESSONS[trilha]||{})[noAtual];
  if(!lesson){
    area.innerHTML = `<div class="empty-state"><strong>Em construção.</strong> Este nó entra na próxima rodada.</div>`;
    return;
  }
  const nodeInfo = track.nodes.find(n=>n.id===noAtual) || {tempo:10,titulo:noAtual};
  const jaFeito = isDone(trilha,noAtual);

  const labMsg = lesson.lab ? `<div class="lab-hint">🧪 Este é o laboratório ${lesson.lab==='python'?'Python':'Java'}. Escreva o código na caixa e clique em <b>▶ Rodar</b>. O tradutor entende o essencial (def/class/for/if/print).</div>` : '';

  area.innerHTML = `<div class="lesson-card">
      <span class="badge">${nodeInfo.tempo} min${jaFeito?' · concluída ✓':''}</span>
      <h2>${nodeInfo.titulo}</h2>
      ${w3Links(trilha,noAtual)}
      <p><strong>Em 5 min você vai:</strong> ${lesson.cinco}</p>
      <p>${lesson.conceito}</p>
      <p style="color:var(--muted)"><em>${lesson.analogia}</em></p>
      <pre class="mono" style="background:var(--surface-2);padding:.8rem;border-radius:8px;overflow-x:auto">${lesson.sintaxe}</pre>
      <p><strong>Bom:</strong> <code class="mono">${lesson.bom}</code></p>
      <p><strong>Erro comum da turma:</strong> ${lesson.erro}</p>
    </div>
    <div class="lesson-card">
      <h3>Tente você mesmo</h3>
      ${labMsg}
      <p style="color:var(--muted);font-size:.9rem">${lesson.lab?'Edite o código abaixo e clique em <b>▶ Rodar</b> (ou Ctrl/Cmd + Enter) para ver a saída.':'Mude o código e veja o resultado mudar ao lado.'}</p>
      <div id="pgHolder"></div>
    </div>
    ${MISSIONS[trilha+':'+noAtual] ? '<div class="lesson-card mission-card" id="missionHolder"></div>' : ''}
    <div class="lesson-card" id="quizHolder">
      <h3>Mini-quiz</h3>
      <p style="color:var(--muted);font-size:.85rem;margin-top:0">Acerte pelo menos <b>2 das 3</b> perguntas para marcar a lição como concluída.</p>
    </div>`;

  const pgHolder = area.querySelector('#pgHolder');
  if(lesson.lab){
    const lab = createLabPlayground(
      lesson.starterCode || '',
      lesson.demo || '',
      lesson.lab === 'python' ? pythonLiteToJs : javaLiteToJs,
      lesson.check || 'true'
    );
    pgHolder.appendChild(lab);
  } else if(lesson.starter){
    pgHolder.appendChild(createPlayground(lesson.starter));
  }

  const mKey = trilha + ':' + noAtual, mission = MISSIONS[mKey];
  if(mission){
    const mh = area.querySelector('#missionHolder');
    const feita = STATE.missions.includes(mKey);
    mh.innerHTML = '<h3>🛠️ Missão' + (feita ? ' · cumprida ✓' : '') + '</h3><p style="margin-top:0">' + mission.enunciado.replace(/</g,'&lt;') + '</p><div class="mission-pg"></div><p class="mission-status" style="font-size:.85rem;color:var(--muted)">' + (feita ? 'Você já cumpriu esta missão.' : 'Edite o código: a correção é automática e vale +15 XP.') + '</p>';
    const mpg = createPlayground(mission.starter, mission.check);
    mh.querySelector('.mission-pg').appendChild(mpg);
    const mFrame = mpg.querySelector('iframe'), mStatus = mh.querySelector('.mission-status');
    if(window.__missionHandler) window.removeEventListener('message', window.__missionHandler);
    window.__missionHandler = (e)=>{
      if(e.source !== mFrame.contentWindow || !e.data || !e.data.dualdevCheck) return;
      if(e.data.ok){
        mStatus.textContent = '✅ Correto! Missão cumprida.'; mStatus.style.color = 'var(--ok)';
        if(markMission(mKey)) mh.querySelector('h3').textContent = '🛠️ Missão · cumprida ✓';
      } else if(!STATE.missions.includes(mKey)){
        mStatus.textContent = 'Ainda não bate com o pedido — continue ajustando.'; mStatus.style.color = 'var(--muted)';
      }
    };
    window.addEventListener('message', window.__missionHandler);
  }

  const dicaKey = trilha + ':' + noAtual;
  const dicasUsadas = STATE.dicasAcademia[dicaKey] || 0;
  const hintBtn = document.createElement('button');
  hintBtn.style.marginTop = '.6rem';
  if(dicasUsadas >= 3){
    hintBtn.textContent = '💡 Dicas esgotadas (3/3)';
    hintBtn.disabled = true;
  } else {
    hintBtn.textContent = '💡 Pedir dica (' + dicasUsadas + '/3)';
  }
  hintBtn.onclick = ()=>{
    const usadas = STATE.dicasAcademia[dicaKey] || 0;
    if(usadas >= 3) return;
    const dicas = lesson.dicas || ['Releia o conceito.', 'Olhe a sintaxe.', 'Veja o exemplo "Bom".'];
    STATE.dicasAcademia[dicaKey] = usadas + 1;
    saveState();
    const box = document.createElement('div');
    box.className = 'hint-box';
    if(usadas === 2){
      box.className = 'solution-box';
      box.innerHTML = '<strong>💡 Dica 3 — Código completo de referência:</strong>' +
        '<pre class="mono">' + ((lesson.lab ? lesson.starterCode : (lesson.starter && lesson.starter[Object.keys(lesson.starter)[0]])) || '').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre>' +
        '<p style="margin-top:.5rem;font-size:.82rem;color:var(--muted)">Dica extra: ' + (dicas[2]||'') + '</p>';
      hintBtn.parentNode.insertBefore(box, hintBtn);
      hintBtn.textContent = '💡 Dica 3/3 (revelada)';
      hintBtn.disabled = true;
    } else {
      box.textContent = '💡 Dica ' + (usadas+1) + ': ' + dicas[usadas];
      hintBtn.parentNode.insertBefore(box, hintBtn);
      hintBtn.textContent = '💡 Pedir dica (' + (usadas+1) + '/3)';
    }
  };
  area.querySelector('#pgHolder').parentNode.appendChild(hintBtn);

  // QUIZ
  const qHolder = area.querySelector('#quizHolder');
  let acertos=0, respondidas=0;
  const quizTotal = lesson.quiz.length;

  lesson.quiz.forEach((item, qi) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'quiz-q';

    const qP = document.createElement('p');
    const qStrong = document.createElement('strong');
    qStrong.textContent = (qi+1) + '. ' + item.q;
    qP.appendChild(qStrong);
    qDiv.appendChild(qP);

    item.op.forEach((op, oi) => {
      const label = document.createElement('label');
      label.className = 'quiz-opt';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'quiz_' + trilha + '_' + noAtual + '_' + qi;
      radio.value = oi;

      const span = document.createElement('span');
      span.textContent = ' ' + op;

      label.appendChild(radio);
      label.appendChild(span);

      radio.addEventListener('change', () => {
        respondidas++;
        let fb = qDiv.querySelector('.quiz-fb');
        if(!fb){
          fb = document.createElement('p');
          qDiv.appendChild(fb);
        }
        const ok = (oi === item.c);
        fb.className = 'quiz-fb ' + (ok ? 'ok' : 'bad');
        fb.textContent = (ok ? 'Certo. ' : 'Quase. ') + item.why;
        if(ok) acertos++;

        if(respondidas >= quizTotal && acertos >= 2){
          if(acertos === quizTotal && !STATE.achievements.includes('perfect-quiz')){
            STATE.achievements.push('perfect-quiz');
            saveState();
            showToast('🏆 Conquista: Gabaritou');
          }
          markDone(trilha, noAtual);
          showToast('✓ Lição concluída: ' + nodeInfo.titulo);
        }
      });

      qDiv.appendChild(label);
    });

    qHolder.appendChild(qDiv);
  });
}
