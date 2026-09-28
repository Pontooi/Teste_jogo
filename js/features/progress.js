// ============== HELPERS ==============
function totalNodes(){ let n=0; for(const t of Object.values(TRACKS)) n+=t.nodes.length; return n; }
function isDone(trilha,id){ return STATE.completed.includes(trilha+':'+id); }
function levelFromXP(xp){ return Math.floor(xp/50)+1; }
function xpInLevel(xp){ return xp % 50; }
function markDone(trilha,id){
  const k=trilha+':'+id;
  if(!STATE.completed.includes(k)){
    STATE.completed.push(k);
    STATE.xp = (STATE.xp||0) + 10;
    saveState();
    checkAchievements();
  }
}
function markMission(key){
  if(!STATE.missions.includes(key)){
    STATE.missions.push(key);
    STATE.xp = (STATE.xp||0) + 15;
    saveState();
    showToast('🛠️ Missão cumprida! +15 XP');
    checkAchievements();
    return true;
  }
  return false;
}
const toastQueue = [];
let toastBusy = false;
function showToast(msg){
  toastQueue.push(msg);
  drainToast();
}
function drainToast(){
  if(toastBusy || toastQueue.length===0) return;
  toastBusy = true;
  const msg = toastQueue.shift();
  const wrap = document.getElementById('toastWrap');
  const t = document.createElement('div');
  t.className='toast';
  t.textContent = msg;
  wrap.appendChild(t);
  requestAnimationFrame(()=> t.classList.add('on'));
  setTimeout(()=>{
    t.classList.remove('on');
    setTimeout(()=>{ t.remove(); toastBusy=false; drainToast(); }, 400);
  }, 2200);
}
function checkAchievements(){
  const earned = STATE.achievements||[];
  const add = (id)=>{
    if(!earned.includes(id)){
      earned.push(id);
      const a=ACHIEVEMENTS.find(x=>x.id===id);
      if(a){ showToast('🏆 Conquista: '+a.label); }
    }
  };
  if(STATE.completed.length>=1) add('first-step');
  if(STATE.completed.length>=10) add('ten-lessons');
  if(STATE.completed.length>=20) add('twenty-lessons');
  if(STATE.completed.length>=totalNodes()) add('all-lessons');

  const byLang = {};
  STATE.completed.forEach(k=>{ const parts=k.split(':'); byLang[parts[0]]=(byLang[parts[0]]||0)+1; });
  ['html','css','js','python','java'].forEach(lang=>{
    if(!TRACKS[lang]) return;
    const total = TRACKS[lang].nodes.length;
    if((byLang[lang]||0) >= total) add(lang+'-master');
  });
  if(Object.keys(byLang).length>=3) add('polyglot');
  if(Object.keys(byLang).length>=5) add('polyglot-5');

  const xp = STATE.xp||0;
  if(xp>=100) add('xp-100');
  if(xp>=500) add('xp-500');
  if(xp>=1000) add('xp-1000');

  if(STATE.visits>=2) add('daily-streak');
  if((STATE.missions||[]).length>=3) add('hands-on');

  STATE.achievements = earned;
  saveState();
}
function updateProgressUI(){
  const bar=document.getElementById('gprogress');
  if(bar){
    const pct=Math.round(100*STATE.completed.length/totalNodes());
    bar.style.width=pct+'%';
    const txt=document.getElementById('gprogress-txt');
    if(txt) txt.textContent = STATE.completed.length+' de '+totalNodes()+' nós concluídos';
  }
  const xpBar=document.getElementById('xpFill');
  if(xpBar) xpBar.style.width = Math.round(100*xpInLevel(STATE.xp||0)/50)+'%';
  const lvl=document.getElementById('levelPill');
  if(lvl) lvl.textContent = 'Nv ' + levelFromXP(STATE.xp||0);
}
