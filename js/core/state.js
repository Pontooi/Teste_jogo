// ============== ESTADO ==============
function loadState(){
  try{
    const s=JSON.parse(localStorage.getItem('dualdev_state'));
    return s||{completed:[],trilha:'html',theme:'dark',xp:0,achievements:[],visits:1,lastDay:new Date().toDateString()};
  }catch(e){ return {completed:[],trilha:'html',theme:'dark',xp:0,achievements:[],visits:1,lastDay:new Date().toDateString()}; }
}
function saveState(){ try{ localStorage.setItem('dualdev_state', JSON.stringify(STATE)); }catch(e){} }
let STATE = loadState();
if(!STATE.completed) STATE.completed = [];
if(!STATE.achievements) STATE.achievements = [];
if(!STATE.xp) STATE.xp = 0;
if(!STATE.trilha) STATE.trilha = 'html';
if(!STATE.theme) STATE.theme = 'dark';
if(!STATE.visits) STATE.visits = 1;
if(!STATE.lastDay) STATE.lastDay = new Date().toDateString();
if(!STATE.dicasAcademia) STATE.dicasAcademia = {};
if(!STATE.missions) STATE.missions = [];

const today = new Date().toDateString();
if(STATE.lastDay !== today){
  STATE.lastDay = today;
  STATE.visits = (STATE.visits||1) + 1;
  saveState();
}

if(STATE.theme==='light') document.documentElement.setAttribute('data-theme','light');
document.getElementById('themeBtn').onclick=()=>{
  STATE.theme = STATE.theme==='light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', STATE.theme==='light'?'light':'dark');
  saveState();
};
