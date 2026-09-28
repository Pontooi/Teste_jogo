function createLabPlayground(starterCode, demo, transpileFn, checker){
  const wrap=document.createElement('div'); wrap.className='split';
  let code = starterCode, ranOnce=false;
  const left=document.createElement('div'); left.className='pg-editor';
  const tabbar=document.createElement('div'); tabbar.className='pg-tabs';
  const onlyTab=document.createElement('span'); onlyTab.className='pg-tab on'; onlyTab.textContent='CÓDIGO'; tabbar.appendChild(onlyTab);
  const ta=document.createElement('textarea'); ta.className='editor'; ta.value=code;
  left.appendChild(tabbar); left.appendChild(ta);
  const right=document.createElement('div'); right.className='pg-preview-wrap';
  const iframe=document.createElement('iframe'); iframe.setAttribute('sandbox','allow-scripts'); iframe.title='Saída do laboratório';
  right.appendChild(iframe);
  const toolbar=document.createElement('div'); toolbar.className='pg-toolbar';
  const mkBtn=(l,fn,cls)=>{ const b=document.createElement('button'); if(cls) b.className=cls; b.textContent=l; b.onclick=fn; return b; };
  toolbar.append(
    mkBtn('▶ Rodar', ()=>run(true), 'primary'),
    mkBtn('↺ Resetar', ()=>{ code=starterCode; ta.value=code; run(true); }),
    mkBtn('⧉ Copiar', ()=>{ try{ navigator.clipboard.writeText(code); showToast('Copiado!'); }catch(e){} })
  );
  let timer=null;
  ta.addEventListener('input', ()=>{ code=ta.value; clearTimeout(timer); timer=setTimeout(()=>run(false),300); });
  ta.addEventListener('keydown', e=>{ if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){ e.preventDefault(); run(true); } });
  function run(flash){
    ranOnce=true;
    let jsCode;
    try{ jsCode = transpileFn(code + '\n' + (demo||'')); }catch(e){ jsCode='console.log("Erro ao traduzir: "+' + JSON.stringify(e.message) + ');'; }
    const doc = '<style>body{font-family:JetBrains Mono,monospace;font-size:12.5px;padding:10px;background:#0b0812;color:#E1D9F5;white-space:pre-wrap;margin:0;}</style><div id="out"></div><script>window.console.log=function(){var a=Array.prototype.slice.call(arguments);document.getElementById("out").textContent+=a.join(" ")+"\\n";};try{'+jsCode+'}catch(e){document.getElementById("out").textContent+="Erro: "+e.message+"\\n";}<\/script>'
      + (checker && checker!=='true' ? '<script>try{var __ok=('+checker+');parent.postMessage({dualdevCheck:true,ok:__ok},"*");}catch(e){parent.postMessage({dualdevCheck:true,ok:false},"*");}<\/script>' : '');
    iframe.srcdoc = doc;
    if(flash){ right.classList.add('flash'); setTimeout(()=>right.classList.remove('flash'),150); }
  }
  run(false);
  wrap.append(left,right);
  const holder=document.createElement('div'); holder.appendChild(wrap); holder.appendChild(toolbar);
  holder.wasRun=()=>ranOnce;
  return holder;
}
function createPlayground(starter, checker){
  const wrap=document.createElement('div'); wrap.className='split';
  const tabs=['html','css','js'].filter(k=>starter[k]!==undefined);
  let active=tabs[0];
  const code={...starter};
  let ranOnce=false;
  const left=document.createElement('div'); left.className='pg-editor';
  const tabbar=document.createElement('div'); tabbar.className='pg-tabs';
  tabs.forEach(t=>{ const b=document.createElement('button'); b.className='pg-tab'+(t===active?' on':''); b.textContent=t.toUpperCase(); b.onclick=()=>{ active=t; [...tabbar.children].forEach((x,i)=>x.classList.toggle('on', tabs[i]===active)); ta.value=code[t]; }; tabbar.appendChild(b); });
  const ta=document.createElement('textarea'); ta.className='editor'; ta.value=code[active];
  left.appendChild(tabbar); left.appendChild(ta);
  const right=document.createElement('div'); right.className='pg-preview-wrap';
  const iframe=document.createElement('iframe'); iframe.setAttribute('sandbox','allow-scripts'); iframe.title='Resultado ao vivo';
  right.appendChild(iframe);
  const toolbar=document.createElement('div'); toolbar.className='pg-toolbar';
  const mkBtn=(l,fn,cls)=>{ const b=document.createElement('button'); if(cls) b.className=cls; b.textContent=l; b.onclick=fn; return b; };
  toolbar.append(
    mkBtn('▶ Rodar', ()=>run(true), 'primary'),
    mkBtn('↺ Resetar', ()=>{ code[active]=starter[active]; ta.value=code[active]; run(true); }),
    mkBtn('⧉ Copiar', ()=>{ try{ navigator.clipboard.writeText(code[active]); showToast('Copiado!'); }catch(e){} })
  );
  let timer=null;
  ta.addEventListener('input', ()=>{ code[active]=ta.value; clearTimeout(timer); timer=setTimeout(()=>run(false),300); });
  ta.addEventListener('keydown', e=>{ if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){ e.preventDefault(); run(true); } });
  function run(flash){
    ranOnce=true;
    let doc = (code.html||'') + (code.css!==undefined ? '\n<style>'+code.css+'</style>' : '') + (code.js!==undefined ? '\n<script>'+code.js+'<\/script>' : '');
    if(checker){ doc += '\n<script>try{var __ok=('+checker+');parent.postMessage({dualdevCheck:true,ok:__ok},"*");}catch(e){parent.postMessage({dualdevCheck:true,ok:false},"*");}<\/script>'; }
    iframe.srcdoc = doc;
    if(flash){ right.classList.add('flash'); setTimeout(()=>right.classList.remove('flash'),150); }
  }
  run(false);
  wrap.append(left,right);
  const holder=document.createElement('div'); holder.appendChild(wrap); holder.appendChild(toolbar);
  holder.wasRun=()=>ranOnce;
  return holder;
}
