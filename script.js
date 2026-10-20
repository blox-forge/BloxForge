(function(){
  var b=document.getElementById('boot');
  if(!b)return;
  var done=false;
  function finish(){if(done)return;done=true;b.classList.add('done');setTimeout(function(){if(b.parentNode)b.parentNode.removeChild(b);},600);}
  b.addEventListener('click',finish);
  document.addEventListener('keydown',function onKey(e){if(e.key==='Escape'||e.key==='Enter'){finish();document.removeEventListener('keydown',onKey);}});
  var lines=['> BLOXFORGE — v9.1','> 11 masterclass de création ......... OK','> illustrations corrigées ............ OK','> sauvegarde automatique active ...... OK','> réveil de l\u2019unité KUBO ............. OK'];
  var box=document.getElementById('bootLines');
  for(var i=0;i<lines.length;i++){(function(t,x){var d=document.createElement('div');d.textContent=t;if(x>0)d.className='ok';d.style.animationDelay=(x*0.2)+'s';box.appendChild(d);})(lines[i],i);}
  setTimeout(function(){var bar=document.getElementById('bootBar');if(bar)bar.style.width='100%';},80);
  setTimeout(function(){var k=document.getElementById('bootKubo');if(k)k.classList.add('on');},1300);
  setTimeout(finish,2400);
})();

'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const escAttr=s=>esc(s).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[r[i],r[j]]=[r[j],r[i]];}return r;};
function refreshIcons(){try{if(window.lucide)lucide.createIcons();}catch(e){}}
(function waitIcons(){refreshIcons();let n=0;const iv=setInterval(()=>{if(window.lucide||++n>15){clearInterval(iv);refreshIcons();}},400);})();

/* ---------- KUBO ---------- */
function kuboSVG(mood){
  const eye='#9BC9FF', ant='#E8930C', ink='#17181C';
  let eyes,mouth,extra='';
  if(mood==='happy'){
    eyes='<g class="kbl" fill="none" stroke="'+eye+'" stroke-width="4.5" stroke-linecap="round"><path d="M41 60 Q47.5 51 54 60"/><path d="M66 60 Q72.5 51 79 60"/></g>';
    mouth='<path d="M50 71 Q60 83 70 71 Z" fill="'+eye+'"/>';
  }else if(mood==='think'){
    eyes='<g class="kbl" fill="'+eye+'"><circle cx="47.5" cy="58" r="6"/><circle cx="72.5" cy="58" r="2.8"/></g>';
    mouth='<path d="M54 76 L66 76" stroke="'+eye+'" stroke-width="3" stroke-linecap="round" fill="none"/>';
    extra='<text x="88" y="34" font-family="\'IBM Plex Mono\',monospace" font-size="15" font-weight="600" fill="'+ant+'" transform="rotate(12 88 34)">?</text>';
  }else if(mood==='star'){
    eyes='<g fill="'+eye+'"><circle cx="47.5" cy="58" r="6.5"/><circle cx="72.5" cy="58" r="6.5"/><circle cx="45" cy="55.5" r="1.8" fill="#fff"/><circle cx="70" cy="55.5" r="1.8" fill="#fff"/></g>';
    mouth='<path d="M48 70 Q60 87 72 70 Z" fill="'+eye+'"/>';
    extra='<g class="ksp"><rect x="9" y="28" width="7" height="7" fill="'+ant+'" transform="rotate(45 12.5 31.5)"/><rect x="100" y="20" width="6" height="6" fill="'+eye+'" transform="rotate(45 103 23)"/><rect x="104" y="52" width="5" height="5" fill="'+ant+'" transform="rotate(45 106.5 54.5)"/></g>';
  }else{
    eyes='<g class="kbl" fill="'+eye+'"><circle cx="47.5" cy="58" r="6"/><circle cx="72.5" cy="58" r="6"/></g>';
    mouth='<path d="M54 74 Q60 79 66 74" stroke="'+eye+'" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  }
  const lift=(mood==='happy'||mood==='star');
  const arm=(x,rot)=>'<g transform="rotate('+rot+' '+(x+7)+' 62)"><rect x="'+x+'" y="58" width="14" height="24" rx="7" fill="#fff" stroke="'+ink+'" stroke-width="3"/></g>';
  return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">'
    +'<ellipse cx="60" cy="112" rx="27" ry="4.5" fill="rgba(23,24,28,.07)"/>'
    +arm(7,lift?-38:0)+arm(99,lift?38:0)
    +'<line x1="60" y1="24" x2="60" y2="9" stroke="'+ink+'" stroke-width="3"/>'
    +'<circle cx="60" cy="7" r="4.5" fill="'+ant+'"/>'
    +'<rect x="21" y="24" width="78" height="80" rx="17" fill="#FFFFFF" stroke="'+ink+'" stroke-width="3.5"/>'
    +'<rect x="38" y="102" width="14" height="9" rx="4" fill="'+ink+'"/>'
    +'<rect x="68" y="102" width="14" height="9" rx="4" fill="'+ink+'"/>'
    +'<rect x="33" y="40" width="54" height="44" rx="9" fill="#17181C"/>'
    +eyes+mouth
    +'<circle cx="60" cy="93" r="3" fill="'+ant+'" opacity=".85"/>'
    +extra+'</svg>';
}
let kbMood='norm',kbT=null,curView=null,curLesson=null,curGtHint=null;
function kuboAvatar(){try{$('#kbAv').innerHTML='<div class="kfig">'+kuboSVG(kbMood)+'</div>';}catch(e){}}
function kuboSpeak(msg,mood,dur){
  if(state.kuboMuted)return;
  mood=mood||'norm';dur=dur||5500;kbMood=mood;kuboAvatar();
  $('#kbMsg').innerHTML=msg;
  $('#kbBubble').classList.add('show');
  clearTimeout(kbT);kbT=setTimeout(()=>{$('#kbBubble').classList.remove('show');},dur);
}
function ghostKubos(host,n,maxOp){
  if(!host)return;
  for(let i=0;i<n;i++){
    const d=document.createElement('div');
    d.className='gk';
    const size=36+Math.random()*105;
    d.style.width=size+'px';d.style.height=size+'px';
    d.style.left=(Math.random()*94)+'%';
    d.style.top=(Math.random()*84)+'%';
    d.style.opacity=(maxOp*(.35+Math.random()*.65)).toFixed(3);
    d.style.setProperty('--d',(6+Math.random()*6).toFixed(1)+'s');
    d.style.setProperty('--dl',(Math.random()*6).toFixed(1)+'s');
    d.style.setProperty('--r',(Math.random()*14-7).toFixed(1)+'deg');
    d.innerHTML=kuboSVG(['norm','happy','think'][Math.random()*3|0]);
    host.appendChild(d);
  }
}

/* ---------- ÉTAT + SAUVEGARDE ---------- */
let KEY='bloxforge_v10_guest';
const DEFAULT_STATE={done:[],ex:{},eval:{},xp:0,last:null,lastLesson:null,lastStep:{},projects:{},kuboMuted:false};
let state={...DEFAULT_STATE},storageWarning='';
try{const s=localStorage.getItem(KEY);if(s)state={...state,...JSON.parse(s)};}catch(e){storageWarning='Le progrès local n’a pas pu être lu. Il ne sera pas chargé pour cette session.';console.warn('Lecture du progrès local impossible.',e);}
let storageWriteWarningShown=false;
function save(){
  try{localStorage.setItem(KEY,JSON.stringify(state));}
  catch(e){console.warn('Écriture du progrès local impossible.',e);if(!storageWriteWarningShown){storageWriteWarningShown=true;toast('Sauvegarde indisponible — exporte ta progression pour la conserver.','triangle-alert');}return false;}
  const si=$('#saveInd');
  if(si){si.classList.add('flash');si.setAttribute('aria-label','Progression sauvegardée');setTimeout(()=>si.classList.remove('flash'),1100);}
  return true;
}
window.addEventListener('beforeunload',save);
const RANKS=[[0,'NOVICE'],[400,'APPRENTI'],[1000,'BÂTISSEUR'],[1800,'SCRIPTER'],[2800,'ARCHITECTE'],[3800,'CRÉATEUR'],[4399,'LÉGENDE']];
const rankOf=xp=>{let r=RANKS[0][1];for(const[t,n]of RANKS)if(xp>=t)r=n;return r;};
const lessonDone=l=>state.done.includes(l.id);
const exoDone=(l,i)=>!!state.ex[l.id+'-e'+i];
const L_by=id=>LESSONS.find(l=>l.id===id);
function setLast(type,id){state.last={type:type,id:id};if(type==='lesson')state.lastLesson=id;save();}

const archivedCurriculum=window.BLOXFORGE_ARCHIVED_CURRICULUM||{};
const LESSONS=archivedCurriculum.LESSONS||[];
const GAME_TYPES=archivedCurriculum.GAME_TYPES||[];

const LUA_RE=/(--[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|\b(local|function|end|if|then|elseif|else|for|while|do|return|break|true|false|nil|and|or|not|in|repeat|until)\b|\b(print|game|workspace|script|Instance|task|Enum|Players|BrickColor|Color3|Vector3|UDim2|string|math|os|pairs)\b|(\b\d+(?:\.\d+)?\b)|(\.[A-Za-z_]\w*)/g;
function hlLua(src){
  let out='',last=0,m;LUA_RE.lastIndex=0;
  while((m=LUA_RE.exec(src))){
    if(m.index>last)out+=esc(src.slice(last,m.index));
    const cls=m[1]?'tok-c':m[2]?'tok-s':m[3]?'tok-k':m[4]?'tok-b':m[5]?'tok-n':'tok-m';
    out+='<span class="'+cls+'">'+esc(m[0])+'</span>';
    last=m.index+m[0].length;
  }
  return out+esc(src.slice(last));
}

/* ============================================================
   WIDGETS
   ============================================================ */
function fillWidget(code,extra){
  const parts=code.split(/‹([^‹›]*)›/);
  const correct=parts.filter((_,i)=>i%2===1);
  const tokens=shuffle([...correct,...(extra||[])]);
  const root=document.createElement('div');
  root.innerHTML='<div class="fill-code"></div><div class="tok-pool"></div>';
  const codeEl=root.querySelector('.fill-code'),pool=root.querySelector('.tok-pool');
  parts.forEach((p,i)=>{
    if(i%2===0){codeEl.appendChild(document.createTextNode(p));return;}
    const h=document.createElement('button');h.className='hole';h.innerHTML='&nbsp;';
    h.addEventListener('click',()=>{
      if(root.classList.contains('locked'))return;
      root.querySelectorAll('.hole').forEach(x=>x.classList.remove('sel'));
      if(h.classList.contains('filled')){
        const val=h.textContent;
        const tk=[...pool.children].find(t=>t.classList.contains('used')&&t.dataset.val===val);
        if(tk){tk.classList.remove('used');h.classList.remove('filled');h.innerHTML='&nbsp;';h.dataset.val='';}
      }else{
        h.classList.add('sel');
        const tk=[...pool.children].find(t=>!t.classList.contains('used'));
        if(tk)place(tk,h);
      }
    });
    codeEl.appendChild(h);
  });
  function place(tk,h){
    h.textContent=tk.dataset.val;h.dataset.val=tk.dataset.val;
    h.classList.add('filled');h.classList.remove('sel','bad','good');
    tk.classList.add('used');
    const nx=[...root.querySelectorAll('.hole')].find(x=>!x.classList.contains('filled'));
    root.querySelectorAll('.hole').forEach(x=>x.classList.remove('sel'));
    if(nx)nx.classList.add('sel');
  }
  tokens.forEach(val=>{
    const tk=document.createElement('button');tk.className='tokc';tk.textContent=val;tk.dataset.val=val;
    tk.addEventListener('click',()=>{
      if(root.classList.contains('locked')||tk.classList.contains('used'))return;
      const sel=root.querySelector('.hole.sel:not(.filled)')||root.querySelector('.hole:not(.filled)');
      if(sel)place(tk,sel);
    });
    pool.appendChild(tk);
  });
  return {
    el:root,
    ready(){return[...root.querySelectorAll('.hole')].every(h=>h.classList.contains('filled'));},
    check(){
      let good=0;const holes=[...root.querySelectorAll('.hole')];
      holes.forEach((h,i)=>{h.classList.remove('bad','good');
        if(h.dataset.val===correct[i]){good++;h.classList.add('good');}else h.classList.add('bad');});
      return good===correct.length;
    },
    userText(){return[...root.querySelectorAll('.hole')].map(h=>h.dataset.val||'—').join(' ');}
  };
}
function orderWidget(items){
  const root=document.createElement('div');
  root.innerHTML='<div class="ord-lab">TA SÉQUENCE</div><div class="ord-seq"></div><div class="ord-lab">ÉTAPES DISPONIBLES</div><div class="ord-pool"></div>';
  const seq=root.querySelector('.ord-seq'),pool=root.querySelector('.ord-pool');
  let picked=[];
  const renderSeq=()=>{
    seq.innerHTML=picked.length?'':'<span class="hint">Clique les étapes ci-dessous dans le bon ordre…</span>';
    picked.forEach((txt,i)=>{
      const c=document.createElement('button');c.className='ord-chip';
      c.innerHTML='<span class="n">'+(i+1)+'</span>'+txt;
      c.addEventListener('click',()=>{if(root.classList.contains('locked'))return;picked.splice(i,1);renderSeq();renderPool();});
      seq.appendChild(c);
    });
  };
  const renderPool=()=>{
    pool.innerHTML='';
    shuffle(items.filter(it=>!picked.includes(it))).forEach(txt=>{
      const c=document.createElement('button');c.className='ord-chip';c.textContent=txt;
      c.addEventListener('click',()=>{if(root.classList.contains('locked'))return;picked.push(txt);renderSeq();renderPool();});
      pool.appendChild(c);
    });
  };
  renderSeq();renderPool();
  return {
    el:root,
    ready(){return picked.length===items.length;},
    check(){
      let good=0;
      seq.querySelectorAll('.ord-chip').forEach((c,i)=>{
        c.classList.remove('good','bad');
        if(picked[i]===items[i]){good++;c.classList.add('good');}else c.classList.add('bad');
      });
      return good===items.length;
    },
    userText(){return picked.join(' → ');}
  };
}

/* ============================================================
   OUTILS
   ============================================================ */
function toast(msg,icon){
  const t=document.createElement('div');t.className='toast';
  t.innerHTML='<i data-lucide="'+(icon||'check')+'"></i><span>'+msg+'</span>';
  $('#toasts').appendChild(t);refreshIcons();
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),320);},3000);
}
function addXP(n){
  const before=rankOf(state.xp);
  const from=state.xp;state.xp+=n;save();updateHeader();
  const el=$('#hdXP');const pill=$('#xpPill');pill.classList.add('pump');setTimeout(()=>pill.classList.remove('pump'),250);
  let t0=null;const anim=ts=>{if(!t0)t0=ts;const k=Math.min((ts-t0)/500,1);
    el.textContent=Math.round(from+(state.xp-from)*k)+' XP';if(k<1)requestAnimationFrame(anim);};
  requestAnimationFrame(anim);
  const after=rankOf(state.xp);
  if(after!==before)kuboSpeak('Nouveau rang débloqué : <b>'+after+'</b> ! Mes circuits chauffent de fierté.','star',6000);
}
function sparkle(x,y){
  const cols=['#17181C','#2B59F6','#8CD8B8'];
  for(let i=0;i<18;i++){
    const s=document.createElement('i');s.className='spark';
    const a=Math.random()*Math.PI*2,d=60+Math.random()*110;
    s.style.left=x+'px';s.style.top=y+'px';
    s.style.background=cols[i%3];
    s.style.setProperty('--dx',Math.cos(a)*d+'px');
    s.style.setProperty('--dy',Math.sin(a)*d-30+'px');
    s.style.setProperty('--rr',(Math.random()*720-360)+'deg');
    document.body.appendChild(s);
    s.addEventListener('animationend',()=>s.remove());
  }
}
const SUCCESS_MSGS=['Exact ! <b>+50 XP</b> pour toi.','Bien vu, créateur !','Mes circuits applaudissent.','C\u2019est ça, le réflexe du pro !'];
const ERROR_MSGS=['Pas grave — l\u2019erreur fait partie du métier. Relis la question.','Hmm… regarde bien la ligne en rouge et réessaie.','Presque ! Prends une seconde et réfléchis.'];
const QTYPE={mcq:'CHOIX MULTIPLE',tf:'VRAI / FAUX',order:'REMISE EN ORDRE',fill:'CODE À TROUS'};
const GT_COLORS=archivedCurriculum.GT_COLORS||{};
const COURSE_META=archivedCurriculum.COURSE_META||{};
const LEARNING_PATHS=archivedCurriculum.LEARNING_PATHS||[];
const FINAL_PROJECTS=archivedCurriculum.FINAL_PROJECTS||{};

/* ============================================================
   VUES
   ============================================================ */
const app=$('#app');
app.replaceChildren();
const authRoot=document.createElement('div');
authRoot.id='authRoot';
app.before(authRoot);
let authenticatedUser=null,customCourses=[];
const revealObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('rv-in');revealObs.unobserve(e.target);}}),{threshold:.1});
function setView(el){
  const old=app.firstElementChild;
  if(old){old.classList.add('view-out');
    setTimeout(()=>{old.replaceWith(el);el.classList.add('view-in');window.scrollTo(0,0);afterRender();},180);
  }else{app.appendChild(el);el.classList.add('view-in');afterRender();}
}
function afterRender(){
  refreshIcons();
  $$('.rv').forEach(o=>revealObs.observe(o));
  setTimeout(()=>{$$('.rv').forEach(el=>el.classList.add('rv-in'));},2500);
}
function elFromHTML(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstElementChild;}
const bestEval=gt=>state.eval[gt]&&state.eval[gt].best;
const evalPassed=gt=>!!(state.eval[gt]&&state.eval[gt].passed);
function normalizeProgress(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Format de progression invalide.');
  const lessons=new Set(LESSONS.map(l=>l.id)),games=new Set(GAME_TYPES.map(g=>g.id));
  if(!lessons.size&&!games.size){
    const preserved={...DEFAULT_STATE,...raw};
    const record=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};
    preserved.done=Array.isArray(raw.done)?raw.done:[];
    preserved.ex=record(raw.ex);
    preserved.eval=record(raw.eval);
    preserved.lastStep=record(raw.lastStep);
    preserved.projects=record(raw.projects);
    preserved.xp=Number.isFinite(raw.xp)&&raw.xp>=0?Math.floor(raw.xp):0;
    preserved.last=raw.last&&typeof raw.last==='object'?raw.last:null;
    preserved.lastLesson=typeof raw.lastLesson==='string'?raw.lastLesson:null;
    preserved.kuboMuted=raw.kuboMuted===true;
    return preserved;
  }
  const clean={...DEFAULT_STATE,done:[],ex:{},eval:{},lastStep:{},projects:{}};
  if(Array.isArray(raw.done))clean.done=[...new Set(raw.done.filter(id=>lessons.has(id)))];
  if(raw.ex&&typeof raw.ex==='object'&&!Array.isArray(raw.ex)){
    for(const [key,value] of Object.entries(raw.ex)){
      const match=key.match(/^(.+)-e(\d+)$/),lesson=match&&L_by(match[1]);
      if(match&&lesson&&Number(match[2])<lesson.exos.length&&value===true)clean.ex[key]=true;
    }
  }
  if(raw.eval&&typeof raw.eval==='object'&&!Array.isArray(raw.eval)){
    for(const [id,result] of Object.entries(raw.eval)){
      if(games.has(id)&&result&&typeof result==='object'&&Number.isFinite(result.best)&&result.best>=0&&result.best<=100)
        clean.eval[id]={best:Math.round(result.best),passed:result.passed===true,
          last:Number.isFinite(result.last)&&result.last>=0&&result.last<=100?Math.round(result.last):Math.round(result.best),
          lastPassed:result.lastPassed===true,
          answers:Array.isArray(result.answers)?result.answers.slice(0,30).map(a=>({correct:a&&a.correct===true,user:typeof(a&&a.user)==='string'?a.user.slice(0,500):''})):[]};
    }
  }
  if(Number.isFinite(raw.xp)&&raw.xp>=0)clean.xp=Math.floor(raw.xp);
  if(raw.last&&typeof raw.last==='object'&&['home','lesson'].includes(raw.last.type)&&
    (raw.last.type==='home'||lessons.has(raw.last.id)))clean.last={type:raw.last.type,id:raw.last.id};
  if(typeof raw.lastLesson==='string'&&lessons.has(raw.lastLesson))clean.lastLesson=raw.lastLesson;
  else if(clean.last&&clean.last.type==='lesson')clean.lastLesson=clean.last.id;
  if(raw.lastStep&&typeof raw.lastStep==='object'&&!Array.isArray(raw.lastStep)){
    for(const [id,step] of Object.entries(raw.lastStep)){
      const lesson=L_by(id);
      if(lesson&&Number.isInteger(step)&&step>=0&&step<lesson.steps.length)clean.lastStep[id]=step;
    }
  }
  if(raw.projects&&typeof raw.projects==='object'&&!Array.isArray(raw.projects)){
    for(const [id,items] of Object.entries(raw.projects)){
      if(lessons.has(id)&&items&&typeof items==='object'&&!Array.isArray(items))
        clean.projects[id]=Object.fromEntries(Object.entries(items).filter(([key,value])=>/^\d+$/.test(key)&&value===true));
    }
  }
  clean.kuboMuted=raw.kuboMuted===true;
  return clean;
}
try{state=normalizeProgress(state);}
catch(e){console.warn('Progression locale invalide, retour à un état vierge.',e);state={...DEFAULT_STATE};storageWarning='Les données de progression étaient illisibles. Une progression vierge est utilisée.';}

/* ---------- ACCUEIL ---------- */
function buildHome(){
  curView='home';curLesson=null;curGtHint=null;setLast('home');
  const canCreateCourses=authenticatedUser&&authenticatedUser.role==='creator';
  const courseCards=customCourses.map(course=>{
    const ownsCourse=authenticatedUser&&course.ownerId===authenticatedUser.id;
    return '<article class="creator-card card">'
    +'<div class="creator-card-head"><span class="creator-label">'+(ownsCourse?'VOTRE FORMATION':'PAR '+esc(course.creatorName||'CRÉATEUR'))+'</span><span class="creator-price">'+(course.price===0?'GRATUIT':esc(new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(course.price)))+'</span></div>'
    +'<h3>'+esc(course.title)+'</h3><p>'+esc(course.description)+'</p>'
    +'<div class="creator-outline"><span class="lab">AU PROGRAMME · '+course.lessons.length+' ÉTAPES</span><ol>'+course.lessons.map(item=>'<li>'+esc(item)+'</li>').join('')+'</ol></div>'
    +(ownsCourse?'<div class="creator-actions"><button class="ex-reset" type="button" data-edit-course="'+escAttr(course.id)+'"><i data-lucide="pencil"></i>Modifier</button><button class="creator-delete" type="button" data-delete-course="'+escAttr(course.id)+'"><i data-lucide="trash-2"></i>Supprimer</button></div>':'')+'</article>';
  }).join('');
  const emptyCourses='<div class="creator-empty card"><div class="creator-empty-icon"><i data-lucide="book-open-check"></i></div><h3>'+(canCreateCourses?'Votre première formation commence ici.':'Aucune formation publiée pour le moment.')+'</h3><p>'+(canCreateCourses?'Ajoutez un titre, quelques étapes et choisissez si elle est gratuite ou payante.':'Revenez bientôt pour découvrir les cours créés par la communauté.')+'</p>'+(canCreateCourses?'<button class="btn btn-ghost" type="button" data-open-creator>Créer mon premier cours <i data-lucide="arrow-right"></i></button>':'')+'</div>';

  const v=elFromHTML('<div class="view">'
  +'<section class="hero" id="heroGhost"><div class="hero-in">'
  +'<span class="kick"><i></i>FORMATIONS DE LA COMMUNAUTÉ</span>'
  +'<h1 class="display">Trouve ta prochaine<br><em>formation.</em></h1>'
  +'<p class="hero-sub">Recherche parmi les cours créés par la communauté BLOXFORGE.</p>'
  +'</div></section>'
  +'<section class="creator-section"><div class="wrap"><div class="creator-heading"><div><div class="lab">'+(canCreateCourses?'VOTRE ESPACE CRÉATEUR':'DÉCOUVRIR')+'</div><h2 class="display">'+(canCreateCourses?'Mes formations.':'Formations de la communauté.')+'</h2><p>'+(canCreateCourses?'Créez vos propres cours, organisez le programme et fixez un prix.':'Parcourez les formations proposées par les créateurs BLOXFORGE.')+'</p></div>'+(canCreateCourses?'<button class="btn btn-black" id="newCourseBtn" type="button"><i data-lucide="plus"></i>Créer une formation</button>':'')+'</div>'
  +'<div class="catalog-tools"><label for="courseSearch">Rechercher une formation</label><input id="courseSearch" type="search" placeholder="Titre, sujet, créateur…" autocomplete="off"><button class="ex-reset" id="clearSearch" type="button">Effacer</button><span id="catalogCount" aria-live="polite"></span></div>'
  +(canCreateCourses?'<div class="creator-form-wrap card" id="courseFormWrap" hidden><form id="courseForm" class="creator-form">'
  +'<input id="courseId" type="hidden"><div class="creator-form-title"><div><div class="lab">NOUVELLE FORMATION</div><h3 id="courseFormTitle">Créer votre cours</h3></div><button class="creator-close" id="cancelCourseBtn" type="button" aria-label="Fermer le formulaire">×</button></div>'
  +'<label for="courseTitle">Nom du cours<input id="courseTitle" name="title" type="text" maxlength="80" placeholder="Ex. Créer son premier obby" required></label>'
  +'<label for="courseDescription">Description<textarea id="courseDescription" name="description" maxlength="360" rows="3" placeholder="À qui s’adresse ce cours et qu’allez-vous apprendre ?" required></textarea></label>'
  +'<div class="creator-form-row"><label for="coursePrice">Prix en euros<input id="coursePrice" name="price" type="number" min="0" max="10000" step="0.01" value="0" required><span class="creator-help">0 € = formation gratuite.</span></label>'
  +'<label for="courseLessons">Programme du cours<textarea id="courseLessons" name="lessons" rows="5" placeholder="Une étape par ligne&#10;Ex. Découvrir Roblox Studio&#10;Créer son premier niveau" required></textarea><span class="creator-help">Ajoutez une étape par ligne (maximum 30).</span></label></div>'
  +'<p class="creator-notice"><i data-lucide="info"></i>La formation et son prix sont enregistrés sur le serveur local. Le paiement en ligne n’est pas activé.</p>'
  +'<div class="creator-form-actions"><button class="ex-reset" id="cancelCourseBtnBottom" type="button">Annuler</button><button class="btn btn-black" type="submit"><i data-lucide="save"></i>Enregistrer la formation</button></div></form></div>':'')
  +'<div class="creator-grid" id="creatorGrid"'+(customCourses.length?'':' hidden')+'>'+courseCards+'</div>'
  +(customCourses.length?'':emptyCourses)
  +'<p class="empty-catalog" id="emptyCatalog" hidden>Aucune formation ne correspond à ta recherche. Essaie un autre mot-clé.</p>'
  +'</div></section>'
  +'<div class="wrap"><footer><span><b>BLOXFORGE</b> — apprendre en construisant, avec Kubo</span><span>FORMATIONS DE LA COMMUNAUTÉ · PROGRESSION SAUVEGARDÉE LOCALEMENT</span></footer></div>'
  +'</div>');

  setView(v);
  setupCourseCreator(v);
  setupCatalog(v);
  ghostKubos(v.querySelector('#heroGhost'),8,.05);
  const w=document.createElement('div');
  w.className='gk-walk';
  w.innerHTML=kuboSVG('happy');
  v.querySelector('#heroGhost').appendChild(w);
  setTimeout(()=>{
    if(state.xp===0)kuboSpeak('Bienvenue ! Cherche une formation pour commencer à créer.','happy',7500);
    else kuboSpeak('Content de te revoir ! Explore les formations créées par la communauté.','happy');
  },900);
  if(storageWarning){toast(storageWarning,'triangle-alert');storageWarning='';}
}

function setupCourseCreator(v){
  const form=v.querySelector('#courseForm'),wrap=v.querySelector('#courseFormWrap');
  if(!form||!wrap)return;
  let editorDocument={modules:[]}, editorVersion=1, editorTimer=0;
  const editorMarkup='<section class="bf-editor"><div class="bf-editor-head"><h4>Programme de la formation</h4><span id="bfSaveState" aria-live="polite">Enregistré</span><button type="button" id="bfAddModule">Ajouter un module</button><button type="button" id="bfPreview">Aperçu</button></div><div class="bf-editor-grid"><nav id="bfOutline" aria-label="Modules et leçons"></nav><section id="bfLessonEditor"><p>Sélectionnez une leçon ou créez un module.</p></section></div><div id="bfPreviewPane" hidden></div></section>';
  const mountEditor=()=>{if(!form.querySelector('.bf-editor'))form.insertAdjacentHTML('beforeend',editorMarkup);};
  const saveState=label=>{const el=v.querySelector('#bfSaveState');if(el)el.textContent=label;};
  const renderEditor=()=>{const outline=v.querySelector('#bfOutline'),area=v.querySelector('#bfLessonEditor');if(!outline||!area)return;
    outline.innerHTML=editorDocument.modules.map((m,mi)=>'<div class="bf-module"><b>'+esc(m.title)+'</b><button type="button" data-move-module="'+mi+'" aria-label="Monter le module">↑</button><button type="button" data-rename-module="'+mi+'">Renommer</button><button type="button" data-del-module="'+mi+'">Supprimer</button>'+m.lessons.map((l,li)=>'<div class="bf-lesson"><button type="button" data-select-lesson="'+mi+':'+li+'">'+esc(l.title)+'</button><button type="button" data-move-lesson="'+mi+':'+li+'">↑</button><button type="button" data-rename-lesson="'+mi+':'+li+'">Renommer</button><button type="button" data-del-lesson="'+mi+':'+li+'">×</button></div>').join('')+'<button type="button" data-add-lesson="'+mi+'">Ajouter une leçon</button></div>').join('');
    area.innerHTML='<p>Choisissez une leçon pour modifier ses blocs de texte et de code.</p>';};
  const scheduleSave=()=>{saveState('Modifications non enregistrées');clearTimeout(editorTimer);editorTimer=setTimeout(async()=>{const id=v.querySelector('#courseId').value;if(!id){saveState('Enregistrez d’abord les informations du cours');return;}saveState('Enregistrement…');try{const current=customCourses.find(c=>c.id===id);const fields={title:titleInput.value.trim(),description:v.querySelector('#courseDescription').value.trim(),price:Number(v.querySelector('#coursePrice').value),lessons:editorDocument.modules.flatMap(m=>m.lessons.map(l=>l.title)),document:editorDocument,expectedVersion:editorVersion};const result=await BloxforgeAuth.updateCourse(id,fields);editorVersion=result.course.version;await refreshCourses();saveState('Enregistré');}catch(error){saveState('Erreur d’enregistrement');toast(error.message||'Erreur d’enregistrement. Vos changements restent dans l’éditeur.','triangle-alert');}},600);};
  const titleInput=v.querySelector('#courseTitle');
  const refreshCourses=async()=>{const result=await BloxforgeAuth.listCourses();customCourses=result.courses;};
  const closeForm=()=>{
    form.reset();
    v.querySelector('#courseId').value='';
    v.querySelector('#courseFormTitle').textContent='Créer votre cours';
    wrap.hidden=true;
  };
  const openForm=course=>{
    mountEditor();
    wrap.hidden=false;
    if(course){
      v.querySelector('#courseId').value=course.id;
      titleInput.value=course.title;
      v.querySelector('#courseDescription').value=course.description;
      v.querySelector('#coursePrice').value=course.price;
      v.querySelector('#courseLessons').value=course.lessons.join('\n');
      editorDocument=course.document||{modules:[{id:'module-'+Date.now(),title:'Programme',description:'',position:0,lessons:course.lessons.map((title,i)=>({id:'lesson-'+Date.now()+'-'+i,title,position:i,type:'content',durationMinutes:0,blocks:[{id:'block-'+Date.now()+'-'+i,type:'text',content:title}]}))}]};editorVersion=course.version||1;renderEditor();
      v.querySelector('#courseFormTitle').textContent='Modifier votre formation';
    }else{
      form.reset();
      v.querySelector('#courseId').value='';
      v.querySelector('#coursePrice').value='0';
      editorDocument={modules:[]};editorVersion=1;renderEditor();
      v.querySelector('#courseFormTitle').textContent='Créer votre cours';
    }
    wrap.hidden=false;
    titleInput.focus();
    wrap.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
  };
  v.querySelector('#newCourseBtn').addEventListener('click',async event=>{const button=event.currentTarget;if(button.disabled)return;button.disabled=true;try{const result=await BloxforgeAuth.createCourse({title:'Nouvelle formation',description:'Brouillon à compléter.',price:0,lessons:['Première leçon'],document:{modules:[]}});await refreshCourses();editorVersion=result.course.version||1;openForm(result.course);toast('Brouillon créé. Vous pouvez commencer.','check');}catch(error){button.disabled=false;toast(error.message||'Impossible de créer le brouillon. Réessayez.','triangle-alert');}});
  v.addEventListener('click',async e=>{
    const makeId=prefix=>prefix+'-'+crypto.randomUUID();
    if(e.target.closest('#bfAddModule')){editorDocument.modules.push({id:makeId('module'),title:'Nouveau module',description:'',position:editorDocument.modules.length,lessons:[]});renderEditor();scheduleSave();return;}
    if(e.target.closest('[data-rename-module]')){const i=+e.target.closest('[data-rename-module]').dataset.renameModule;const name=prompt('Nom du module',editorDocument.modules[i].title);if(name&&name.trim()){editorDocument.modules[i].title=name.trim();renderEditor();scheduleSave();}return;}
    if(e.target.closest('[data-del-module]')){const i=+e.target.closest('[data-del-module]').dataset.delModule;if(confirm('Supprimer ce module et ses leçons ?')){editorDocument.modules.splice(i,1);renderEditor();scheduleSave();}return;}
    if(e.target.closest('[data-move-module]')){const i=+e.target.closest('[data-move-module]').dataset.moveModule;if(i>0){[editorDocument.modules[i-1],editorDocument.modules[i]]=[editorDocument.modules[i],editorDocument.modules[i-1]];renderEditor();scheduleSave();}return;}
    if(e.target.closest('[data-add-lesson]')){const i=+e.target.closest('[data-add-lesson]').dataset.addLesson,m=editorDocument.modules[i];m.lessons.push({id:makeId('lesson'),title:'Nouvelle leçon',position:m.lessons.length,type:'content',durationMinutes:0,blocks:[]});renderEditor();scheduleSave();return;}
    if(e.target.closest('[data-del-lesson]')){const [mi,li]=e.target.closest('[data-del-lesson]').dataset.delLesson.split(':').map(Number);if(confirm('Supprimer cette leçon ?')){editorDocument.modules[mi].lessons.splice(li,1);renderEditor();scheduleSave();}return;}
    if(e.target.closest('[data-rename-lesson]')){const [mi,li]=e.target.closest('[data-rename-lesson]').dataset.renameLesson.split(':').map(Number),lesson=editorDocument.modules[mi].lessons[li],name=prompt('Nom de la leçon',lesson.title);if(name&&name.trim()){lesson.title=name.trim();renderEditor();scheduleSave();}return;}
    if(e.target.closest('[data-move-lesson]')){const [mi,li]=e.target.closest('[data-move-lesson]').dataset.moveLesson.split(':').map(Number),lessons=editorDocument.modules[mi].lessons;if(li>0){[lessons[li-1],lessons[li]]=[lessons[li],lessons[li-1]];renderEditor();scheduleSave();}return;}
    if(e.target.closest('[data-select-lesson]')){const [mi,li]=e.target.closest('[data-select-lesson]').dataset.selectLesson.split(':').map(Number),lesson=editorDocument.modules[mi].lessons[li];const blockHtml=lesson.blocks.map((b,i)=>'<label>'+esc(b.type==='code'?'Code':'Texte')+'<textarea data-block="'+mi+':'+li+':'+i+'" rows="5">'+esc(b.content)+'</textarea><button type="button" data-del-block="'+mi+':'+li+':'+i+'">Supprimer</button></label>').join('');v.querySelector('#bfLessonEditor').innerHTML='<h4>'+esc(lesson.title)+'</h4><button type="button" data-add-block="'+mi+':'+li+':text">Ajouter du texte</button><button type="button" data-add-block="'+mi+':'+li+':code">Ajouter du code</button>'+blockHtml;return;}
    if(e.target.closest('[data-add-block]')){const [mi,li,type]=e.target.closest('[data-add-block]').dataset.addBlock.split(':'),lesson=editorDocument.modules[+mi].lessons[+li];lesson.blocks.push({id:makeId('block'),type,content:''});const btn=v.querySelector('[data-select-lesson="'+mi+':'+li+'"]');if(btn)btn.click();scheduleSave();return;}
    if(e.target.closest('[data-del-block]')){const [mi,li,bi]=e.target.closest('[data-del-block]').dataset.delBlock.split(':').map(Number);editorDocument.modules[mi].lessons[li].blocks.splice(bi,1);v.querySelector('[data-select-lesson="'+mi+':'+li+'"]').click();scheduleSave();return;}
    if(e.target.closest('#bfPreview')){const p=v.querySelector('#bfPreviewPane');p.hidden=!p.hidden;p.innerHTML='<h3>'+esc(titleInput.value)+'</h3>'+editorDocument.modules.map(m=>'<h4>'+esc(m.title)+'</h4>'+m.lessons.map(l=>'<h5>'+esc(l.title)+'</h5>'+l.blocks.map(b=>b.type==='code'?'<pre><code>'+esc(b.content)+'</code></pre>':'<p>'+esc(b.content).replace(/\n/g,'<br>')+'</p>').join('')).join('')).join('');return;}
    if(e.target.closest('[data-open-creator]')){openForm(null);return;}
    if(e.target.closest('#cancelCourseBtn,#cancelCourseBtnBottom')){closeForm();return;}
    const edit=e.target.closest('[data-edit-course]');
    if(edit){
      const course=customCourses.find(item=>item.id===edit.dataset.editCourse);
      if(!course){toast('Cette formation est introuvable.','triangle-alert');return;}
      openForm(course);return;
    }
    const remove=e.target.closest('[data-delete-course]');
    if(remove){
      const course=customCourses.find(item=>item.id===remove.dataset.deleteCourse);
      if(!course){toast('Cette formation est introuvable.','triangle-alert');return;}
      if(!confirm('Supprimer la formation « '+course.title+' » ? Cette action est définitive.'))return;
      try{await BloxforgeAuth.deleteCourse(course.id);await refreshCourses();buildHome();toast('Formation supprimée.','trash-2');}
      catch(error){toast(error.message||'Impossible de supprimer cette formation.','triangle-alert');}
    }
  });
  v.addEventListener('input',e=>{const target=e.target.closest('[data-block]');if(!target)return;const [mi,li,bi]=target.dataset.block.split(':').map(Number);editorDocument.modules[mi].lessons[li].blocks[bi].content=target.value;scheduleSave();});
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const title=titleInput.value.trim(),description=v.querySelector('#courseDescription').value.trim();
    const price=Number(v.querySelector('#coursePrice').value);
    const lessons=v.querySelector('#courseLessons').value.split(/\r?\n/).map(item=>item.trim()).filter(Boolean);
    if(!title||!description||!Number.isFinite(price)||price<0||price>10000){
      toast('Vérifiez le nom, la description et le prix de la formation.','triangle-alert');return;
    }
    if(!lessons.length||lessons.length>30||lessons.some(item=>item.length>120)){
      toast('Ajoutez de 1 à 30 étapes (120 caractères maximum par étape).','triangle-alert');return;
    }
    const id=v.querySelector('#courseId').value;
    const fields={title:title.slice(0,80),description:description.slice(0,360),price:Math.round(price*100)/100,lessons:lessons.map(item=>item.slice(0,120)),document:editorDocument};
    try{
      if(id){const current=customCourses.find(c=>c.id===id);fields.expectedVersion=editorVersion;const result=await BloxforgeAuth.updateCourse(id,fields);editorVersion=result.course.version;}
      else {const result=await BloxforgeAuth.createCourse(fields);editorVersion=result.course.version;}
      await refreshCourses();buildHome();toast(id?'Formation mise à jour.':'Formation créée.','check');
    }catch(error){toast(error.message||'Impossible d’enregistrer cette formation.','triangle-alert');}
  });
}

function setupCatalog(v){
  const cards=[...v.querySelectorAll('.creator-card')],search=v.querySelector('#courseSearch');
  const grid=v.querySelector('#creatorGrid'),empty=v.querySelector('#emptyCatalog');
  const update=()=>{
    const query=search.value.trim().toLocaleLowerCase();
    let visible=0;
    cards.forEach(card=>{
      const matches=!query||card.textContent.toLocaleLowerCase().includes(query);
      card.hidden=!matches;if(matches)visible++;
    });
    grid.hidden=visible===0;
    v.querySelector('#catalogCount').textContent=visible+' / '+cards.length+' formations';
    empty.hidden=cards.length===0||visible!==0;
  };
  search.addEventListener('input',update);
  v.querySelector('#clearSearch').addEventListener('click',()=>{search.value='';update();search.focus();});
  update();
}

/* ---------- LEÇON / MASTERCLASS ---------- */
function renderFinalProject(L,gt){
  const project=FINAL_PROJECTS[L.id];if(!project)return '';
  const saved=state.projects[L.id]||{};
  const checks=project.milestones.map((label,i)=>'<label class="project-check"><input type="checkbox" data-project-check="'+i+'"'+(saved[i]?' checked':'')+'><span>'+label+'</span></label>').join('');
  const publish=['Tester le jeu à deux joueurs ou plus.','Vérifier les erreurs dans la sortie Studio.','Contrôler les performances et les effets visuels.','Vérifier les permissions et les interactions client/serveur.','Tester sauvegarde, reconnexion et réinitialisation.'];
  const publishChecks=publish.map((label,i)=>'<label class="project-check"><input type="checkbox" data-project-check="'+(100+i)+'"'+(saved[100+i]?' checked':'')+'><span>'+label+'</span></label>').join('');
  return '<section class="final-project card" id="finalProject"><div class="lab">PROJET FINAL · '+(gt?gt.name.toUpperCase():'STUDIO')+'</div><h2>'+project.title+'</h2><p>'+project.goal+'</p><h3>Étapes du projet</h3><div class="project-checks">'+checks+'</div><h3>Vérification avant publication</h3><div class="project-checks">'+publishChecks+'</div><div class="project-status" aria-live="polite"></div></section>';
}
function buildLesson(id,resume){
  const L=L_by(id);if(!L)return buildHome();
  curView='lesson';curLesson=L;curGtHint=GAME_TYPES.find(g=>g.lesson===L.id)||null;
  setLast('lesson',L.id);
  const isPre=L.id==='pre';
  const acc=GT_COLORS[L.gt]||GT_COLORS.pre;
  const CODES={};let cid=0;
  const gt=curGtHint;

  const resumeStep=resume?Math.min(state.lastStep[L.id]||0,L.steps.length-1):0;
  const stepsHTML=L.steps.map((s,k)=>{
    let code='';
    if(s.code){const c=L.id+'-c'+(cid++);CODES[c]=s.code;
      code='<div class="code"><div class="code-bar"><span class="code-file">'+(s.codeType||'Luau')+(s.location?' · '+s.location:' · contexte à vérifier dans Studio')+'</span><button class="copy-btn" data-cid="'+c+'" aria-label="Copier le code de '+s.t+'"><i data-lucide="copy"></i>COPIER</button></div><pre><code>'+hlLua(s.code)+'</code></pre>'+(s.result?'<p class="code-result">Résultat attendu : '+s.result+'</p>':'')+'</div>';}
    const tip=s.tip?'<div class="tip"><i data-lucide="lightbulb"></i><p><b>Astuce — </b>'+s.tip+'</p></div>':'';
    const ch=s.challenge?'<div class="challenge"><i data-lucide="flag"></i><p>'+s.challenge+'</p></div>':'';
    const say=s.say?'<div class="kubo-note"><div class="kfig">'+kuboSVG('norm')+'</div><div class="kb-say">'+s.say+'</div></div>':'';
    return '<section class="step rv" id="s'+k+'">'
    +'<div class="step-k">ÉTAPE '+(k+1)+' / '+L.steps.length+'</div>'
    +'<h3>'+s.t+'</h3><div class="step-b">'+s.b+'</div>'
    +code+(s.b2?'<div class="step-b" style="margin-top:14px">'+s.b2+'</div>':'')
    +tip+ch+say+'<div class="step-nav">'+(k>0?'<button class="ex-reset" data-goto="s'+(k-1)+'"><i data-lucide="arrow-left"></i>Étape précédente</button>':'<span></span>')+(k<L.steps.length-1?'<button class="btn btn-ghost" data-goto="s'+(k+1)+'">Étape suivante <i data-lucide="arrow-right"></i></button>':'<button class="btn btn-ghost" data-goto="exos">Passer aux missions <i data-lucide="arrow-down"></i></button>')+'</div></section>';
  }).join('');

  const v=elFromHTML('<div class="view" style="--acc:'+acc[0]+';--softa:'+acc[1]+'">'
  +'<div class="sub-top"><div class="wrap sub-top-in">'
  +'<button class="back" data-home><i data-lucide="arrow-left"></i>LES JEUX</button>'
  +'<div class="sub-crumb">'+(isPre?'PRÉAMBULE':gt?gt.name.toUpperCase()+' — MASTERCLASS':'COURS')+'</div>'
  +(lessonDone(L)?'<span class="tl-state" style="color:var(--acc)"><i data-lucide="check-circle-2"></i>VALIDÉ</span>':'<span style="width:20px"></span>')
  +'</div></div>'
  +'<div class="wrap ls-grid"><aside>'
  +'<div class="as-box"><div class="as-kubo"><div class="kfig">'+kuboSVG('norm')+'</div><div><div class="kv">KUBO</div><div class="ks" id="asKuboSt">suit la leçon avec toi</div></div><span class="kd"></span></div></div>'
  +'<div class="as-box"><div class="as-t"><i data-lucide="target"></i>OBJECTIF</div><div class="as-obj">'+L.obj+'</div></div>'
  +'<div class="as-box"><div class="as-t"><i data-lucide="list"></i>PLAN</div><div class="as-list" id="asPlan">'
  +L.steps.map((s,k)=>'<a data-goto="s'+k+'"><b>'+(k+1)+'</b>'+s.t+'</a>').join('')
  +'<a data-goto="exos"><b>&gt;</b>Missions</a></div></div>'
  +'<div class="as-box"><div class="as-t"><i data-lucide="zap"></i>MISSIONS</div><ul class="as-mis">'
  +L.exos.map((e,k)=>'<li data-goto="ex'+k+'"'+(exoDone(L,k)?' class="ok"':'')+'><span class="dot"></span>MISSION '+(k+1)+'</li>').join('')
  +'</ul><div class="as-bar"><i id="lsBar"></i></div><div class="as-pct" id="lsPct">0 / '+L.exos.length+' RÉUSSIES</div></div>'
  +'</aside><div>'
  +(gt?'<div class="lsn-visual rv" style="border-radius:20px;overflow:hidden;border:1px solid var(--hair);margin-bottom:22px"><img src="'+gt.img+'" alt="'+gt.name+'" style="width:100%;height:220px;object-fit:cover;display:block"></div>':'')
  +'<div class="lsn-head rv"><div class="lsn-metas">'
  +'<span class="tag t-acc"><i data-lucide="'+(isPre?'compass':'gamepad-2')+'"></i>'+(isPre?'PRÉAMBULE STUDIO':(gt?gt.name.toUpperCase():'COURS'))+'</span>'
  +'<span class="tag"><i data-lucide="clock"></i>'+L.dur+'</span><span class="tag"><i data-lucide="layers"></i>'+L.steps.length+' étapes</span>'
  +'</div><h2 class="display">'+L.title+'</h2><div class="lesson-progress"><span id="lessonStage" aria-live="polite">Étape '+(resumeStep+1)+' sur '+L.steps.length+'</span><progress id="lessonProgressBar" aria-label="Progression des étapes du cours" max="'+L.steps.length+'" value="'+(resumeStep+1)+'">Étape '+(resumeStep+1)+' sur '+L.steps.length+'</progress></div></div>'
  +'<div class="kubo-intro rv"><div class="kfig">'+kuboSVG('norm')+'</div><div><div class="kt">KUBO — TON GUIDE</div><div class="km">'+L.kintro+'</div></div></div>'
  +stepsHTML
  +'<section class="exos-sec" id="exos"><div class="exos-head rv"><h2 class="display">Missions</h2><p>// VALIDE TES ACQUIS — '+(L.exos.length*50)+' XP</p></div>'
  +'<div id="exList"></div>'
  +'<div class="finish card" id="finishBox"><div class="finish-in"><div class="fx">'
  +'<div class="finish-t" id="finT">Validation du cours</div><div class="finish-s" id="finS"></div></div>'
  +'<button class="btn-fin" id="finBtn" disabled><i data-lucide="lock"></i>MISSIONS REQUISES</button>'
  +'</div></div></section>'
  +renderFinalProject(L,gt)
  +(gt?'<div class="evalcard" style="margin-top:28px">'
  +'<div><div class="ev-lab">ÉVALUATION DE MASTERCLASS</div>'
  +'<h3 class="display">Validation — '+gt.name+'</h3><p>Teste tout ce que la masterclass t\u2019a appris. Corrections détaillées et analyse de tes acquis à la clé.</p>'
  +'<div class="ev-meta"><span>SEUIL <b>70%</b></span><span>ENJEU <b>+150 XP</b></span></div>'
  +(bestEval(gt.id)!=null?'<div class="ev-score">Meilleur score : '+bestEval(gt.id)+'%'+(evalPassed(gt.id)?' — validé ✓':'')+'</div>':'')
  +'</div>'
  +'<button class="btn btn-cream" data-eval="'+gt.id+'">'+(evalPassed(gt.id)?'Refaire':'Commencer')+' <i data-lucide="clipboard-check"></i></button>'
  +'</div>':'')
  +'<div class="ls-nav">'
  +'<div class="navc card" data-home><span class="nv-l"><i data-lucide="arrow-left"></i>AUTRES JEUX</span><span class="nv-t serif">Choisir un autre type</span></div>'
  +(gt?'<div class="navc card nx" data-eval="'+gt.id+'"><span class="nv-l r">PASSER À L\u2019ÉVALUATION<i data-lucide="clipboard-check"></i></span><span class="nv-t serif">Validation '+gt.name+'</span></div>'
     :'<div class="navc card nx" data-home><span class="nv-l r">COMMENCER<i data-lucide="arrow-right"></i></span><span class="nv-t serif">Choisis ton jeu</span></div>')
  +'</div></div></div></div>');

  setView(v);
  setupFinalProject(v);
  const exList=v.querySelector('#exList');
  L.exos.forEach((ex,k)=>exList.appendChild(renderExercise(L,ex,k)));
  window._CODES=CODES;
  updateLessonUI();
  setupSpy(v,L);
  if(resume&&resumeStep>0)setTimeout(()=>v.querySelector('#s'+resumeStep)?.scrollIntoView({block:'start'}),260);

  const finBtn=v.querySelector('#finBtn');
  finBtn.addEventListener('click',()=>{
    if(finBtn.disabled||lessonDone(L))return;
    state.done.push(L.id);save();addXP(100);
    sparkle(innerWidth/2,180);
    kuboSpeak('Cours <b>validé</b> ! +100 XP. '+(gt?'Direction l\u2019<b>évaluation</b> pour sceller la masterclass.':'Tu es prêt à choisir ton type de jeu !'),'star',6000);
    toast('Cours validé — +100 XP','award');
    updateLessonUI();updateHeader();
    if(gt){finBtn.innerHTML='<i data-lucide="clipboard-check"></i>ALLER À L\u2019ÉVALUATION';finBtn.disabled=false;finBtn.onclick=()=>openEval(gt.id);}
    else{finBtn.innerHTML='<i data-lucide="check"></i>VALIDÉ';finBtn.disabled=true;}
    refreshIcons();
  });
  setTimeout(()=>kuboSpeak('Les infos vitales sont <mark>surlignées en jaune</mark> — repère-les en priorité !','norm'),700);
}

function updateLessonUI(){
  if(!curLesson)return;
  const L=curLesson;
  const ok=L.exos.filter((_,k)=>exoDone(L,k)).length;
  const bar=$('#lsBar'),pct=$('#lsPct'),st=$('#asKuboSt');
  if(bar)bar.style.width=ok/L.exos.length*100+'%';
  if(pct)pct.textContent=ok+' / '+L.exos.length+' RÉUSSIES';
  if(st)st.textContent=ok===L.exos.length?'prêt à valider':'attend tes missions ('+ok+'/'+L.exos.length+')';
  const box=$('#finishBox'),finBtn=$('#finBtn'),finT=$('#finT'),finS=$('#finS');
  if(!finBtn)return;
  if(lessonDone(L)){
    box.classList.add('finish-done');
    finT.textContent='Cours déjà validé';finS.textContent='Missions rejouables librement.';
    if(!curGtHint){finBtn.innerHTML='<i data-lucide="check"></i>VALIDÉ';finBtn.disabled=true;}
  }else if(ok===L.exos.length){
    box.classList.add('finish-done');
    finT.textContent='Toutes les missions sont réussies';
    finS.textContent='Valide officiellement ce cours — +100 XP.';
    finBtn.disabled=false;
    finBtn.innerHTML=curGtHint?'<i data-lucide="clipboard-check"></i>TERMINER + ALLER À L\u2019ÉVAL':'<i data-lucide="check"></i>TERMINER LE COURS · +100 XP';
  }else{
    box.classList.remove('finish-done');
    finT.textContent='Validation du cours';finS.textContent='Termine les '+L.exos.length+' missions ('+ok+'/'+L.exos.length+' faites).';
    finBtn.disabled=true;finBtn.innerHTML='<i data-lucide="lock"></i>MISSIONS REQUISES';
  }
  refreshIcons();
}
function setupFinalProject(v){
  const section=v.querySelector('#finalProject');if(!section)return;
  const checks=[...section.querySelectorAll('[data-project-check]')],status=section.querySelector('.project-status');
  const done=checks.filter(input=>input.checked).length;
  status.textContent=done===checks.length?'Projet et vérifications terminés — bravo !':done+' / '+checks.length+' éléments terminés.';
}
function setupSpy(v,L){
  const links=[...v.querySelectorAll('#asPlan a')];
  const obs=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){
      links.forEach(a=>a.classList.toggle('on',a.dataset.goto===e.target.id));
      const match=e.target.id.match(/^s(\d+)$/);
      if(match){const index=Number(match[1]);state.lastStep[L.id]=index;state.lastLesson=L.id;save();
        const label=v.querySelector('#lessonStage'),bar=v.querySelector('#lessonProgressBar');
        if(label)label.textContent='Étape '+(index+1)+' sur '+L.steps.length;
        if(bar)bar.value=index+1;
      }
    }});
  },{rootMargin:'-30% 0px -60% 0px'});
  v.querySelectorAll('.step, .exos-sec').forEach(s=>obs.observe(s));
}

/* ============================================================
   MISSIONS
   ============================================================ */
function renderExercise(L,ex,idx){
  const exId=L.id+'-e'+idx;
  const card=document.createElement('div');
  card.className='ex-card'+(exoDone(L,idx)?' ok':'');
  card.id='ex'+idx;
  card.innerHTML='<div class="ex-h"><span class="ex-num">MISSION '+(idx+1)+'</span><span class="ex-badge">'+QTYPE[ex.type]+'</span><span class="sp"></span>'
  +(exoDone(L,idx)?'<span class="ex-okmark"><i data-lucide="check"></i>RÉUSSIE · +50 XP</span><button class="ex-redo"><i data-lucide="rotate-ccw"></i>REFAIRE</button>':'')
  +'</div><div class="ex-b"></div>';
  const body=card.querySelector('.ex-b');
  const feed=document.createElement('div');feed.className='ex-feed';
  const bindRedo=c=>{const r=c.querySelector('.ex-redo');if(r)r.onclick=()=>{card.replaceWith(renderExercise(L,ex,idx));};};

  const success=()=>{
    const first=!state.ex[exId];
    if(first){
      state.ex[exId]=true;save();addXP(50);
      toast('Mission réussie — +50 XP','zap');
      const mis=app.querySelector('.as-mis li[data-goto="ex'+idx+'"]');if(mis)mis.classList.add('ok');
      updateLessonUI();
    }
    card.classList.add('ok','locked');
    card.querySelector('.ex-h .sp').insertAdjacentHTML('afterend',
      '<span class="ex-okmark"><i data-lucide="check"></i>RÉUSSIE'+(first?' · +50 XP':'')+'</span><button class="ex-redo"><i data-lucide="rotate-ccw"></i>REFAIRE</button>');
    bindRedo(card);refreshIcons();
    if(first)kuboSpeak(SUCCESS_MSGS[Math.random()*SUCCESS_MSGS.length|0],'happy');
  };
  const failMsg=()=>kuboSpeak(ERROR_MSGS[Math.random()*ERROR_MSGS.length|0],'think');

  if(ex.type==='mcq'||ex.type==='tf'){
    const isTF=ex.type==='tf';
    body.innerHTML='<div class="ex-q">'+ex.q+'</div>';
    const row=document.createElement('div');row.className=isTF?'tf-row':'';
    const opts=isTF?[['VRAI',true],['FAUX',false]]:ex.opts.map((o,i)=>[o,i]);
    let selected=null;
    opts.forEach(([lab,val])=>{
      const b=document.createElement('button');b.className=isTF?'tf':'opt';
      if(!isTF)b.innerHTML='<span class="ol">'+String.fromCharCode(65+val)+'</span><span>'+lab+'</span>';
      else b.textContent=lab;
      b.addEventListener('click',()=>{
        if(card.classList.contains('locked'))return;
        selected={b,val,lab};
        row.querySelectorAll('button').forEach(x=>x.classList.remove('sel'));
        b.classList.add('sel');
      });
      row.appendChild(b);
    });
    body.appendChild(row);
    const actions=document.createElement('div');actions.className='ex-actions';
    const chk=document.createElement('button');chk.className='ex-check';chk.innerHTML='<i data-lucide="check"></i>VÉRIFIER';
    chk.addEventListener('click',()=>{
      if(card.classList.contains('locked'))return;
      if(!selected){feed.className='ex-feed show bad';feed.textContent='Choisis une réponse d\u2019abord.';body.appendChild(feed);return;}
      const good=(selected.val===ex.a);
      if(good){
        selected.b.classList.add('right');
        feed.className='ex-feed show good';feed.innerHTML='<b>Exact. </b>'+(ex.why||'');body.appendChild(feed);success();
      }else{
        selected.b.classList.add('wrong');setTimeout(()=>selected.b.classList.remove('wrong'),600);
        feed.className='ex-feed show bad';feed.textContent='Pas tout à fait — observe bien et réessaie.';
        body.appendChild(feed);failMsg();
      }
    });
    actions.appendChild(chk);body.appendChild(actions);body.appendChild(feed);
  }

  if(ex.type==='fill'||ex.type==='order'){
    body.innerHTML='<div class="ex-q">'+ex.q+'</div>';
    const w=ex.type==='fill'?fillWidget(ex.code,ex.extra):orderWidget(ex.items);
    body.appendChild(w.el);
    const actions=document.createElement('div');actions.className='ex-actions';
    const chk=document.createElement('button');chk.className='ex-check';chk.innerHTML='<i data-lucide="check"></i>VÉRIFIER';
    chk.addEventListener('click',()=>{
      if(card.classList.contains('locked'))return;
      if(!w.ready()){feed.className='ex-feed show bad';feed.textContent=ex.type==='fill'?'Remplis tous les trous.':'Place toutes les étapes.';body.appendChild(feed);return;}
      if(w.check()){
        feed.className='ex-feed show good';feed.innerHTML='<b>Parfait. </b>'+(ex.why||'');body.appendChild(feed);success();
      }else{
        feed.className='ex-feed show bad';feed.textContent=ex.type==='fill'?'Certains trous sont incorrects.':'Certaines étapes sont mal placées.';
        body.appendChild(feed);failMsg();
      }
    });
    const rst=document.createElement('button');rst.className='ex-reset';rst.textContent='RÉINITIALISER';
    rst.addEventListener('click',()=>{const fresh=renderExercise(L,ex,idx);card.replaceWith(fresh);});
    actions.append(chk,rst);body.appendChild(actions);body.appendChild(feed);
  }

  bindRedo(card);
  refreshIcons();
  return card;
}

/* ============================================================
   ÉVALUATIONS
   ============================================================ */
function openEval(gtId){buildEval(gtId);}

function buildEval(gtId){
  const gt=GAME_TYPES.find(g=>g.id===gtId);if(!gt)return buildHome();
  const L=L_by(gt.lesson);
  const qs=L.exos.map(ex=>({
    type:ex.type,q:ex.q,opts:ex.opts,a:ex.a,items:ex.items,code:ex.code,extra:ex.extra,
    skill:gt.name,ref:L.id,why:ex.why||''
  }));
  const results=[];let qi=0;
  const acc=GT_COLORS[gtId];

  const v=elFromHTML('<div class="view" style="--acc:'+acc[0]+';--softa:'+acc[1]+'">'
  +'<div class="sub-top"><div class="wrap sub-top-in">'
  +'<button class="back" data-open="'+L.id+'"><i data-lucide="arrow-left"></i>MASTERCLASS</button>'
  +'<div class="sub-crumb">ÉVALUATION — <b>'+gt.name.toUpperCase()+'</b></div><span style="width:20px"></span>'
  +'</div></div>'
  +'<div class="eval-wrap">'
  +'<div class="eval-head"><span class="ev-badge"><i data-lucide="clipboard-check"></i>ÉVALUATION DE MASTERCLASS</span>'
  +'<h2 class="display">'+gt.name+' — as-tu tout retenu ?</h2><p>'+qs.length+' questions · seuil de réussite : 70 % · 150 XP à la première réussite.</p><button class="back" data-open="'+L.id+'"><i data-lucide="arrow-left"></i>RETOURNER À LA MASTERCLASS</button></div>'
  +'<div class="eval-progress" id="evProg"></div>'
  +'<div class="eval-intro" id="evalIntro"><h3>Avant de commencer</h3><p>Réponds aux '+qs.length+' questions. Tu peux revenir aux précédentes avant d’envoyer tes résultats. Une note de 70 % valide la masterclass.</p><button class="btn btn-black" id="startEval">Commencer l’évaluation <i data-lucide="arrow-right"></i></button></div>'
  +'<div id="evZone" hidden></div>'
  +'</div>');

  setView(v);
  const zone=v.querySelector('#evZone'),prog=v.querySelector('#evProg');

  function renderProg(){
    prog.innerHTML=qs.map((q,i)=>'<div class="evdot'+(results[i]?(results[i].correct?' ok':' ko'):(i===qi?' cur':''))+'"></div>').join('');
  }

  function renderQuestion(){
    renderProg();
    const q=qs[qi];
    zone.innerHTML='';
    const card=document.createElement('div');card.className='q-card card rv rv-in';
    card.innerHTML='<div class="q-type">'+QTYPE[q.type]+' · QUESTION '+(qi+1)+'/'+qs.length+'</div>'
    +'<div class="q-text">'+q.q+'</div><div class="q-body"></div>'
    +'<div class="q-actions"><button class="ex-check" id="qVal"><i data-lucide="check"></i>VALIDER</button></div>'
    +'<div class="q-feed" id="qFeed"></div>';
    zone.appendChild(card);
    const qbody=card.querySelector('.q-body'),qVal=card.querySelector('#qVal'),qFeed=card.querySelector('#qFeed'),actions=card.querySelector('.q-actions');
    qFeed.setAttribute('aria-live','polite');
    if(qi>0){const prev=document.createElement('button');prev.className='ex-reset';prev.textContent='Question précédente';prev.addEventListener('click',()=>{qi--;renderQuestion();});actions.appendChild(prev);}
    let answered=false,correct=false,userTxt='—';

    if(q.type==='mcq'||q.type==='tf'){
      const isTF=q.type==='tf';
      const row=document.createElement('div');row.className=isTF?'tf-row':'';
      const opts=isTF?[['VRAI',true],['FAUX',false]]:q.opts.map((o,i)=>[o,i]);
      let sel=null;
      opts.forEach(([lab,val])=>{
        const b=document.createElement('button');b.className=isTF?'tf':'opt';
        if(!isTF)b.innerHTML='<span class="ol">'+String.fromCharCode(65+val)+'</span><span>'+lab+'</span>';
        else b.textContent=lab;
        b.addEventListener('click',()=>{
          if(answered)return;
          row.querySelectorAll('button').forEach(x=>x.classList.remove('sel'));
          b.classList.add('sel');sel={b,val,lab};
          qVal.disabled=false;
        });
        row.appendChild(b);
      });
      qbody.appendChild(row);
      qVal.disabled=true;
      qVal.addEventListener('click',()=>{
        if(answered||!sel)return;
        answered=true;correct=(sel.val===q.a);
        userTxt=String(sel.lab);
        row.querySelectorAll('button').forEach((b,i)=>{
          const val=isTF?(i===0):(i);
          if(val===q.a)b.classList.add('right');
          else if(b===sel.b)b.classList.add('wrong');
        });
        qFeed.className='q-feed show '+(correct?'good':'bad');
        qFeed.innerHTML=(correct?'<b>Exact. </b>':'<b>Raté. </b>')+(q.why||'')
        +'<div class="ans">Ta réponse : '+esc(userTxt)+'</div>';
        afterAnswer();
      });
    }

    if(q.type==='fill'||q.type==='order'){
      const w=q.type==='fill'?fillWidget(q.code,q.extra):orderWidget(q.items);
      qbody.appendChild(w.el);
      qVal.addEventListener('click',()=>{
        if(answered)return;
        if(!w.ready()){qFeed.className='q-feed show bad';qFeed.textContent='Complète tout d\u2019abord.';return;}
        answered=true;correct=w.check();userTxt=w.userText();
        const corrTxt=q.type==='fill'?(q.code.match(/‹([^‹›]*)›/g)||[]).map(s=>s.slice(1,-1)).join(' · '):q.items.join(' → ');
        qFeed.className='q-feed show '+(correct?'good':'bad');
        qFeed.innerHTML=(correct?'<b>Exact. </b>':'<b>Raté. </b>')+(q.why||'')
        +'<div class="ans">Ta réponse : '+esc(userTxt)+'<br>Correction : '+esc(corrTxt)+'</div>';
        afterAnswer();
      });
    }

    function afterAnswer(){
      results[qi]={correct,user:userTxt};
      qVal.style.display='none';
      renderProg();
      const nx=document.createElement('button');nx.className='ex-check';
      nx.innerHTML=(qi===qs.length-1?'<i data-lucide="clipboard-check"></i>VOIR LES RÉSULTATS':'<i data-lucide="arrow-right"></i>QUESTION SUIVANTE');
      nx.addEventListener('click',()=>{qi++;(qi<qs.length)?renderQuestion():renderResults();});
      actions.appendChild(nx);
      if(!correct)kuboSpeak(ERROR_MSGS[Math.random()*ERROR_MSGS.length|0],'think');
      refreshIcons();
    }
    refreshIcons();
  }

  function renderResults(){
    renderProg();
    const nOk=results.filter(r=>r.correct).length;
    const score=Math.round(nOk/qs.length*100);
    const passed=score>=70;
    const prev=state.eval[gtId]||{};
    const firstPass=passed&&!prev.passed;
    state.eval[gtId]={best:Math.max(prev.best||0,score),passed:passed||!!prev.passed,last:score,lastPassed:passed,answers:results};
    if(firstPass)addXP(150);
    save();updateHeader();
    if(firstPass)sparkle(innerWidth/2,180);

    const corrHTML=qs.map((q,i)=>{
      const r=results[i];
      const corrAns=q.type==='mcq'?q.opts[q.a]:(q.type==='tf'?(q.a?'VRAI':'FAUX'):(q.type==='fill'?(q.code.match(/‹([^‹›]*)›/g)||[]).map(s=>s.slice(1,-1)).join(' · '):q.items.join(' → ')));
      return '<div class="corr-card card">'
      +'<div class="corr-q">Q'+(i+1)+' · '+(r.correct?'<span style="color:var(--green)">✓</span>':'<span style="color:var(--red)">✗</span>')+' — '+esc(q.q.replace(/<[^>]+>/g,''))+'</div>'
      +'<div class="corr-lines"><span class="m">Ta réponse :</span> <span class="'+(r.correct?'good':'bad')+'">'+esc(r.user)+'</span><br>'
      +(r.correct?'':'<span class="m">Bonne réponse :</span> <span class="good">'+esc(corrAns)+'</span><br>')
      +'<span class="m">Masterclass :</span> '+esc(q.skill)+'</div>'
      +(q.why?'<div class="corr-why">'+q.why+'</div>':'')
      +'</div>';
    }).join('');

    const CIRC=2*Math.PI*54;
    zone.innerHTML='';
    const res=document.createElement('div');
    res.className='rv rv-in';
    res.innerHTML=
    '<div class="res-hero">'
    +'<div class="ring"><svg width="140" height="140"><circle cx="70" cy="70" r="54" fill="none" stroke="#33352E" stroke-width="10"/>'
    +'<circle id="ringFill" cx="70" cy="70" r="54" fill="none" stroke="'+(passed?'#0E9F5D':'#E5484D')+'" stroke-width="10" stroke-linecap="round" stroke-dasharray="'+CIRC+'" stroke-dashoffset="'+CIRC+'" style="transition:stroke-dashoffset 1.2s cubic-bezier(.3,.1,.2,1)"/></svg>'
    +'<div class="rt"><b>'+score+'%</b><span>'+nOk+'/'+qs.length+'</span></div></div>'
    +'<div class="res-mid"><h2 class="display">'+(passed?'Masterclass <em style="color:#8CD8B8">validée</em>.':(score>=50?'Presque — encore un effort.':'À retravailler.'))+'</h2>'
    +'<p>'+(passed?'Bravo, créateur. '+gt.name+' n\u2019a plus de secret pour toi.':'Le seuil est de 70%. Relis la masterclass et retente — ta progression est conservée.')+'</p></div>'
    +'<div class="res-side">'+(firstPass?'<div class="res-xp">+150 XP GAGNÉS</div>':'')
    +'<span class="res-verdict '+(passed?'pass':'fail')+'">'+(passed?'VALIDÉ':'NON VALIDÉ')+'</span></div>'
    +'</div>'
    +'<div class="corr-t">CORRECTIONS DÉTAILLÉES</div>'
    +corrHTML
    +'<div class="res-actions">'
    +'<button class="btn btn-black" id="evRetry"><i data-lucide="rotate-ccw"></i>Refaire l\u2019évaluation</button>'
    +'<button class="btn btn-ghost" data-open="'+L.id+'">Relire la masterclass <i data-lucide="book-open"></i></button>'
    +(results.some(r=>!r.correct)?'<button class="btn btn-ghost" id="reviewMistakes"><i data-lucide="list-restart"></i>Revoir mes erreurs</button>':'')
    +'<button class="btn btn-ghost" data-home>Choisir un autre jeu <i data-lucide="arrow-right"></i></button>'
    +'</div>';
    zone.appendChild(res);
    setTimeout(()=>{const rf=document.getElementById('ringFill');if(rf)rf.style.strokeDashoffset=CIRC*(1-score/100);},200);
    res.querySelector('#evRetry').addEventListener('click',()=>buildEval(gtId));
    const review=res.querySelector('#reviewMistakes');
    if(review)review.addEventListener('click',()=>{
      const firstWrong=results.findIndex(r=>!r.correct),exerciseIndex=L.exos.findIndex(ex=>ex.q===qs[firstWrong].q);
      buildLesson(L.id);
      setTimeout(()=>document.getElementById('ex'+Math.max(exerciseIndex,0))?.scrollIntoView({behavior:'smooth',block:'start'}),300);
    });
    refreshIcons();
    if(passed&&firstPass)kuboSpeak('Évaluation <b>réussie à '+score+'%</b> ! Masterclass '+gt.name+' validée, +150 XP. Choisis ton prochain type de jeu !','star',7000);
    else if(!passed)kuboSpeak('Score de '+score+'% — le seuil est à 70%. Relis les passages surlignés et retente !','think',7000);
  }

  v.querySelector('#startEval').addEventListener('click',()=>{v.querySelector('#evalIntro').hidden=true;zone.hidden=false;renderQuestion();});
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function goHome(){buildHome();}

document.addEventListener('click',e=>{
  try{
    const tool=e.target.closest('#exportProgress,#importProgress,#kbMute,#kbClose');
    if(tool)return;
    const ev=e.target.closest('[data-eval]');
    if(ev){openEval(ev.dataset.eval);return;}
    const open=e.target.closest('[data-open]');
    if(open){buildLesson(open.dataset.open,open.dataset.resume==='true');return;}
    if(e.target.closest('[data-home]')||e.target.closest('#homeLink')){goHome();return;}
    const go=e.target.closest('[data-goto]');
    if(go){const t=document.getElementById(go.dataset.goto);if(t){const match=go.dataset.goto.match(/^s(\d+)$/);if(match&&curLesson){state.lastStep[curLesson.id]=Number(match[1]);state.lastLesson=curLesson.id;save();}t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}return;}
    const cp=e.target.closest('.copy-btn');
    if(cp){const code=window._CODES&&window._CODES[cp.dataset.cid];if(code!=null)copyText(code);}
  }catch(err){console.error(err);}
});
document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('.gt[data-open]')){
    e.preventDefault();buildLesson(e.target.dataset.open,false);
  }
});
document.addEventListener('change',e=>{
  const input=e.target.closest('[data-project-check]');
  if(!input)return;
  const lesson=curLesson;if(!lesson)return;
  state.projects[lesson.id]=state.projects[lesson.id]||{};
  state.projects[lesson.id][input.dataset.projectCheck]=input.checked;
  save();
  const section=input.closest('#finalProject'),checks=[...section.querySelectorAll('[data-project-check]')],status=section.querySelector('.project-status');
  const done=checks.filter(item=>item.checked).length;
  status.textContent=done===checks.length?'Projet et vérifications terminés — bravo !':done+' / '+checks.length+' éléments terminés.';
});

async function copyText(t){
  try{await navigator.clipboard.writeText(t);}
  catch(e){
    const ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(_){}ta.remove();
  }
  toast('Code copié dans le presse-papiers','copy');
}

function setupProgressTools(){
  const header=$('.hd-right'),reset=$('#resetBtn');
  if(!header||!reset)return;
  header.insertAdjacentHTML('beforebegin','<div class="progress-tools"><button class="hd-tool" id="exportProgress" aria-label="Exporter ma progression" title="Exporter la progression au format JSON"><i data-lucide="download"></i><span>Exporter</span></button><button class="hd-tool" id="importProgress" aria-label="Importer une sauvegarde de progression" title="Importer une sauvegarde JSON"><i data-lucide="upload"></i><span>Importer</span></button><input id="progressFile" type="file" accept="application/json,.json" hidden></div>');
  const modal=$('#modal');modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');$('.mo-t').id='resetTitle';modal.setAttribute('aria-labelledby','resetTitle');
  const exportBtn=$('#exportProgress'),importBtn=$('#importProgress'),file=$('#progressFile');
  exportBtn.addEventListener('click',()=>{
    const payload={app:'BLOXFORGE',version:1,exportedAt:new Date().toISOString(),progress:state};
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download='bloxforge-progression.json';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Sauvegarde JSON téléchargée','download');
  });
  importBtn.addEventListener('click',()=>file.click());
  file.addEventListener('change',async()=>{
    const selected=file.files&&file.files[0];if(!selected)return;
    try{
      const payload=JSON.parse(await selected.text());
      if(payload.app!=='BLOXFORGE'||payload.version!==1||!payload.progress||!Array.isArray(payload.progress.done)||
        !payload.progress.ex||!payload.progress.eval||!Number.isFinite(payload.progress.xp))
        throw new Error('Ce fichier n’est pas une sauvegarde BLOXFORGE valide.');
      const imported=normalizeProgress(payload.progress);
      if(!confirm('Remplacer la progression actuelle par celle du fichier ? Cette action ne peut pas être annulée.'))return;
      state=imported;
      if(save()){updateHeader();buildHome();toast('Progression importée avec succès','upload');}
    }catch(e){console.error('Import de progression refusé.',e);toast(e instanceof SyntaxError?'Le fichier JSON est illisible.':e.message||'Impossible d’importer ce fichier.','triangle-alert');}
    finally{file.value='';}
  });
  refreshIcons();
}
function setupKuboControls(){
  const bubble=$('#kbBubble'),host=$('#kubo');
  if(!bubble||!host)return;
  bubble.insertAdjacentHTML('afterbegin','<button class="kb-close" id="kbClose" aria-label="Fermer le message de Kubo">×</button>');
  host.insertAdjacentHTML('beforeend','<button class="kb-mute" id="kbMute" aria-pressed="false"></button>');
  const close=$('#kbClose'),mute=$('#kbMute'),avatar=$('#kbAv');
  close.addEventListener('click',()=>bubble.classList.remove('show'));
  const update=()=>{mute.textContent=state.kuboMuted?'Réactiver Kubo':'Désactiver Kubo';mute.setAttribute('aria-pressed',String(state.kuboMuted));host.classList.toggle('kubo-muted',state.kuboMuted);};
  mute.addEventListener('click',()=>{state.kuboMuted=!state.kuboMuted;save();update();if(!state.kuboMuted)kuboSpeak('Je suis de retour ! Appuie sur moi si tu as besoin d’un conseil.','happy');});
  avatar.setAttribute('aria-label','Kubo — ouvrir un conseil de progression');
  avatar.removeAttribute('title');
  update();
}

$('#kbAv').addEventListener('click',()=>{
  try{
    if(curLesson){
      const L=curLesson,left=L.exos.filter((_,i)=>!exoDone(L,i)).length;
      if(left)kuboSpeak('Il te reste <b>'+left+' mission'+(left>1?'s':'')+'</b> dans ce cours.','think');
      else if(!lessonDone(L))kuboSpeak('Missions réussies — valide le cours en bas !','happy');
      else kuboSpeak('Cours validé. Un autre type de jeu ?','happy');
    }else{
      const nl=GAME_TYPES.find(g=>!evalPassed(g.id));
      if(nl)kuboSpeak('Prochaine masterclass : <b>'+nl.name+'</b>. On y va ?','norm');
      else kuboSpeak('Les '+GAME_TYPES.length+' masterclass sont validées — tu es une légende, créateur !','star');
    }
  }catch(e){console.error(e);}
});

function closeResetModal(){$('#modal').classList.remove('open');$('#resetBtn').focus();}
$('#resetBtn').addEventListener('click',()=>{$('#modal').classList.add('open');refreshIcons();});
$('#moCancel').addEventListener('click',closeResetModal);
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeResetModal();});
$('#moConfirm').addEventListener('click',()=>{
  state={...DEFAULT_STATE,done:[],ex:{},eval:{},xp:0,last:null,lastLesson:null,lastStep:{},projects:{},kuboMuted:state.kuboMuted};save();
  closeResetModal();
  updateHeader();buildHome();
  toast('Progression réinitialisée','rotate-ccw');
  kuboSpeak('On repart de zéro… ensemble. Quel jeu veux-tu créer ?','norm',6000);
});

function updateHeader(){
  $('#hdXP').textContent=state.xp+' XP';
  $('#hdRank').textContent=rankOf(state.xp);
  const pill=$('#xpPill'),index=RANKS.findIndex(([,rank])=>rank===rankOf(state.xp)),current=RANKS[index][0],next=RANKS[index+1];
  let meter=pill.querySelector('.rank-progress');
  if(!meter){meter=document.createElement('span');meter.className='rank-progress';meter.setAttribute('role','progressbar');meter.setAttribute('aria-label','Progression vers le prochain rang');pill.appendChild(meter);}
  const percent=next?Math.max(0,Math.min(100,(state.xp-current)/(next[0]-current)*100)):100;
  meter.style.setProperty('--rank-progress',percent+'%');
  meter.setAttribute('aria-valuemin',String(current));meter.setAttribute('aria-valuemax',String(next?next[0]:current));meter.setAttribute('aria-valuenow',String(state.xp));
  pill.setAttribute('aria-label',state.xp+' XP, rang '+rankOf(state.xp)+(next?' — '+Math.floor(next[0]-state.xp)+' XP avant '+next[1]:' — rang maximum'));
}
function setupAccessibility(){
  const skip=document.createElement('a');skip.href='#app';skip.className='skip-link';skip.textContent='Aller au contenu principal';
  $('header').after(skip);
  $('#app').setAttribute('role','main');$('#app').setAttribute('aria-label','Contenu BLOXFORGE');
  $('#saveInd').setAttribute('role','status');$('#saveInd').setAttribute('aria-label','État de sauvegarde de la progression');
  $('#toasts').setAttribute('role','status');$('#toasts').setAttribute('aria-live','polite');
  $('#resetBtn').setAttribute('aria-label','Réinitialiser la progression');
  const modal=$('#modal');
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open')){modal.classList.remove('open');$('#resetBtn').focus();}});
  document.addEventListener('keydown',e=>{
    if(e.key!=='Tab'||!modal.classList.contains('open'))return;
    const focusable=[...modal.querySelectorAll('button:not([disabled]),[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')];
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
  $('#resetBtn').addEventListener('click',()=>setTimeout(()=>$('#moCancel').focus(),0));
}

const DISCOVERY_LABELS={
  youtube:'YouTube',social:'Réseaux sociaux',friend:'Recommandation d’un proche',
  search:'Moteur de recherche',roblox:'Roblox',other:'Autre'
};
function renderAuthScreen(mode='login',error=''){
  authRoot.innerHTML='<section class="auth-screen"><div class="auth-card card">'
    +'<div class="auth-brand">Blox<span>forge</span></div>'
    +'<div class="lab">ACADÉMIE DE CRÉATION ROBLOX</div>'
    +'<h1>'+(mode==='register'?'Créer mon compte':'Bienvenue à nouveau')+'</h1>'
    +'<p class="auth-subtitle">'+(mode==='register'?'Un compte pour retrouver votre progression et votre espace.':'Connectez-vous pour retrouver votre espace BLOXFORGE.')+'</p>'
    +(error?'<p class="auth-error" role="alert">'+esc(error)+'</p>':'')
    +'<form class="auth-form" id="authForm">'
    +(mode==='register'?'<label for="authName">Votre nom<input id="authName" name="name" type="text" minlength="2" maxlength="80" autocomplete="name" required></label>':'')
    +'<label for="authEmail">E-mail<input id="authEmail" name="email" type="email" maxlength="254" autocomplete="email" required></label>'
    +'<label for="authPassword">Mot de passe<input id="authPassword" name="password" type="password" minlength="'+(mode==='register'?'10':'1')+'" maxlength="128" autocomplete="'+(mode==='register'?'new-password':'current-password')+'" required>'+(mode==='register'?'<span class="creator-help">10 caractères minimum, avec majuscule, minuscule et chiffre.</span>':'')+'</label>'
    +'<button class="btn btn-black" type="submit">'+(mode==='register'?'Créer mon compte':'Se connecter')+' <i data-lucide="arrow-right"></i></button></form>'
    +'<p class="auth-switch">'+(mode==='register'?'Vous avez déjà un compte ?':'Pas encore de compte ?')+' <button type="button" data-auth-mode="'+(mode==='register'?'login':'register')+'">'+(mode==='register'?'Se connecter':'Créer un compte')+'</button></p>'
    +'<p class="auth-local-note"><b>Prototype local :</b> utilisez une adresse fictive et un mot de passe de test. Aucune donnée réelle ou confidentielle.</p>'
    +'</div></section>';
  authRoot.querySelector('#authEmail').focus();
  refreshIcons();
}

function renderOnboarding(error=''){
  authRoot.innerHTML='<section class="auth-screen"><div class="auth-card card">'
    +'<div class="auth-brand">Blox<span>forge</span></div>'
    +'<div class="lab">AVANT DE COMMENCER · 1 MINUTE</div>'
    +'<h1>Faisons connaissance.</h1><p class="auth-subtitle">Quelques réponses nous aident à mieux comprendre les créateurs de BLOXFORGE.</p>'
    +(error?'<p class="auth-error" role="alert">'+esc(error)+'</p>':'')
    +'<form class="auth-form" id="onboardingForm">'
    +'<label for="discovery">Où as-tu découvert BLOXFORGE ?<select id="discovery" name="discovery" required><option value="">Choisir une réponse…</option><option value="youtube">YouTube</option><option value="social">Réseaux sociaux</option><option value="friend">Recommandation d’un proche</option><option value="search">Moteur de recherche</option><option value="roblox">Roblox</option><option value="other">Autre</option></select></label>'
    +'<label for="attributionName">Nom de la personne ou chaîne qui te l’a recommandé<input id="attributionName" name="attributionName" type="text" minlength="2" maxlength="120" placeholder="Ex. Nom de la chaîne YouTube"><span class="creator-help">Obligatoire pour YouTube, les réseaux sociaux et une recommandation.</span></label>'
    +'<label for="whyBloxforge">Pourquoi as-tu choisi BLOXFORGE ?<textarea id="whyBloxforge" name="whyBloxforge" rows="3" minlength="3" maxlength="500" placeholder="Dis-nous ce que tu aimerais apprendre ou créer…" required></textarea></label>'
    +'<fieldset style="border:0;display:grid;gap:8px"><legend style="font-size:12px;font-weight:700;color:var(--ink);margin-bottom:5px">Tu veux utiliser BLOXFORGE comme…</legend>'
    +'<div class="auth-choices"><label class="auth-choice"><input type="radio" name="role" value="consumer" required><span><b>Consommateur</b><small>Découvrir et suivre des formations.</small></span></label>'
    +'<label class="auth-choice"><input type="radio" name="role" value="creator"><span><b>Créateur</b><small>Créer et gérer tes propres formations.</small></span></label></div></fieldset>'
    +'<p class="auth-permanent-note"><b>À savoir :</b> tu pourras passer de consommateur à créateur dans Configuration. Ce changement est définitif : un compte créateur ne peut pas redevenir consommateur.</p>'
    +'<button class="btn btn-black" type="submit">Enregistrer et entrer <i data-lucide="arrow-right"></i></button></form>'
    +'<p class="auth-local-note">Prototype local de test : n’indique pas de renseignements confidentiels.</p>'
    +'</div></section>';
  const discoverySelect=authRoot.querySelector('#discovery'), attributionInput=authRoot.querySelector('#attributionName');
  if(discoverySelect&&attributionInput){const updateAttribution=()=>{attributionInput.required=['youtube','social','friend'].includes(discoverySelect.value);};discoverySelect.addEventListener('change',updateAttribution);updateAttribution();}
  refreshIcons();
}

function renderAccountSettings(){
  const user=authenticatedUser;
  if(!user)return;
  authRoot.innerHTML='<div class="account-overlay" role="presentation"><section class="account-dialog card" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">'
    +'<div class="account-dialog-head"><div><div class="lab">VOTRE COMPTE</div><h2 id="settingsTitle">Configuration</h2></div><button class="creator-close" type="button" data-settings-close aria-label="Fermer">×</button></div>'
    +'<p id="settingsIdentity"></p><span class="account-role" id="settingsRole"></span>'
    +'<p id="settingsDiscovery"></p><p id="settingsWhy"></p>'
    +(user.role==='consumer'?'<div class="auth-permanent-note"><b>Passage définitif :</b> vous deviendrez créateur et ne pourrez pas revenir au mode consommateur.</div>':'<div class="auth-permanent-note">Le mode créateur est permanent ; aucun retour au mode consommateur n’est possible.</div>')
    +'<div class="account-dialog-actions">'+(user.role==='consumer'?'<button class="account-upgrade" type="button" data-settings-upgrade>Passer au mode créateur</button>':'')
    +'<button class="ex-reset" type="button" data-settings-close>Fermer</button></div></section></div>';
  authRoot.querySelector('#settingsIdentity').textContent=user.name+' · '+user.email;
  authRoot.querySelector('#settingsRole').textContent=user.role==='creator'?'Mode créateur':'Mode consommateur';
  authRoot.querySelector('#settingsDiscovery').textContent='Découverte : '+(DISCOVERY_LABELS[user.onboarding.discovery]||user.onboarding.discovery)+(user.onboarding.attributionName?' · '+user.onboarding.attributionName:'');
  authRoot.querySelector('#settingsWhy').textContent='Pourquoi BLOXFORGE : '+user.onboarding.whyBloxforge;
  refreshIcons();
  authRoot.querySelector('[data-settings-close]').focus();
}

function renderCreatorConfirmation(){
  authRoot.innerHTML='<div class="account-overlay" role="presentation"><section class="account-dialog card" role="alertdialog" aria-modal="true" aria-labelledby="upgradeTitle" aria-describedby="upgradeDescription">'
    +'<div class="lab">CONFIRMATION REQUISE</div><h2 id="upgradeTitle">Passer au mode créateur ?</h2>'
    +'<p id="upgradeDescription">Cette modification sera <b>définitive</b>. Vous pourrez créer et gérer vos formations, mais ce compte ne pourra plus revenir au mode consommateur.</p>'
    +'<p class="auth-permanent-note">Confirmez uniquement si vous souhaitez devenir créateur de façon permanente.</p>'
    +'<div class="account-dialog-actions"><button class="ex-reset" type="button" data-settings-cancel>Annuler</button><button class="account-upgrade" type="button" data-settings-confirm-upgrade>Oui, devenir créateur</button></div></section></div>';
  authRoot.querySelector('[data-settings-cancel]').focus();
}

function loadAccountProgress(userId){
  KEY='bloxforge_v10_'+userId;
  try{
    const saved=localStorage.getItem(KEY);
    state=saved?normalizeProgress(JSON.parse(saved)):{...DEFAULT_STATE};
  }catch(error){
    console.error('Impossible de charger la progression de ce compte.',error);
    state={...DEFAULT_STATE};
    toast('La progression locale de ce compte était illisible ; une nouvelle progression est utilisée.','triangle-alert');
  }
}

function mountAccountControls(){
  const header=$('.hd-right');
  let tools=$('#accountTools');
  if(tools)tools.remove();
  tools=document.createElement('div');
  tools.id='accountTools';
  tools.className='account-tools';
  tools.innerHTML='<span class="account-name"></span><button class="account-action" id="settingsButton" type="button" aria-label="Configuration du compte"><i data-lucide="settings-2"></i><span>Configuration</span></button><button class="account-action" id="logoutButton" type="button" aria-label="Se déconnecter"><i data-lucide="log-out"></i><span>Quitter</span></button>';
  tools.querySelector('.account-name').textContent=authenticatedUser.name;
  tools.querySelector('#settingsButton').addEventListener('click',renderAccountSettings);
  tools.querySelector('#logoutButton').addEventListener('click',logoutCurrentAccount);
  header.insertBefore(tools,$('#resetBtn'));
  refreshIcons();
}

async function logoutCurrentAccount(){
  try{await BloxforgeAuth.logout();}
  catch(error){toast(error.message||'Impossible de fermer la session. Réessayez.','triangle-alert');return;}
  authenticatedUser=null;customCourses=[];authRoot.replaceChildren();
  document.body.classList.add('auth-locked');renderAuthScreen('login');
}

async function enterApplication(user){
  authenticatedUser=user;
  if(!user.onboarding){renderOnboarding();return;}
  try{
    const result=await BloxforgeAuth.listCourses();
    customCourses=result.courses;
  }catch(error){
    authRoot.innerHTML='<section class="auth-screen"><div class="auth-card card"><div class="lab">CONNEXION AU SERVEUR</div><h1>Impossible d’ouvrir BLOXFORGE.</h1><p class="auth-subtitle">'+esc(error.message)+'</p><p class="auth-local-note">Vérifiez que le serveur local est lancé avec <b>npm start</b>, puis rechargez la page.</p><div class="auth-actions"><button class="btn btn-ghost" type="button" data-auth-logout>Se déconnecter</button><button class="btn btn-black" type="button" data-auth-retry>Réessayer</button></div></div></section>';
    return;
  }
  loadAccountProgress(user.id);
  app.replaceChildren();
  authRoot.replaceChildren();
  document.body.classList.remove('auth-locked');
  mountAccountControls();
  updateHeader();
  buildHome();
}

async function initializeAuthentication(){
  document.addEventListener('keydown',event=>{
    const dialog=authRoot.querySelector('.account-dialog');
    if(event.key==='Escape'&&dialog){
      authRoot.replaceChildren();
      const settings=$('#settingsButton');if(settings)settings.focus();
      return;
    }
    if(event.key!=='Tab'||!dialog)return;
    const focusable=[...dialog.querySelectorAll('button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled])')];
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  authRoot.addEventListener('click',async event=>{
    const mode=event.target.closest('[data-auth-mode]');
    if(mode){renderAuthScreen(mode.dataset.authMode);return;}
    if(event.target.closest('[data-settings-close]')||event.target.matches('.account-overlay')){
      authRoot.replaceChildren();
      const settings=$('#settingsButton');if(settings)settings.focus();
      return;
    }
    if(event.target.closest('[data-settings-upgrade]')){renderCreatorConfirmation();return;}
    if(event.target.closest('[data-settings-cancel]')){renderAccountSettings();return;}
    if(event.target.closest('[data-settings-confirm-upgrade]')){
      const confirmButton=event.target.closest('[data-settings-confirm-upgrade]');
      confirmButton.disabled=true;
      try{
        const result=await BloxforgeAuth.becomeCreator();
        authenticatedUser=result.user;
        authRoot.replaceChildren();
        mountAccountControls();buildHome();
        toast('Mode créateur activé définitivement.','check');
      }catch(error){renderAccountSettings();toast(error.message||'Impossible de modifier le mode du compte.','triangle-alert');}
      return;
    }
    if(event.target.closest('[data-auth-retry]')){await enterApplication(authenticatedUser);return;}
    if(event.target.closest('[data-auth-logout]')){
      await logoutCurrentAccount();
    }
  });
  authRoot.addEventListener('submit',async event=>{
    const form=event.target;
    event.preventDefault();
    const submit=form.querySelector('[type="submit"]');
    if(submit)submit.disabled=true;
    try{
      if(form.id==='authForm'){
        const data=new FormData(form);
        const credentials={email:String(data.get('email')||''),password:String(data.get('password')||'')};
        if(form.querySelector('#authName')){
          const result=await BloxforgeAuth.register({...credentials,name:String(data.get('name')||'')});
          authenticatedUser=result.user;renderOnboarding();
        }else{
          const result=await BloxforgeAuth.login(credentials);
          await enterApplication(result.user);
        }
      }else if(form.id==='onboardingForm'){
        const data=new FormData(form);
        const result=await BloxforgeAuth.completeOnboarding({
          discovery:String(data.get('discovery')||''),
          attributionName:String(data.get('attributionName')||''),
          whyBloxforge:String(data.get('whyBloxforge')||''),
          role:String(data.get('role')||'')
        });
        await enterApplication(result.user);
      }
    }catch(error){
      if(form.id==='onboardingForm')renderOnboarding(error.message||'Vérifiez vos réponses.');
      else renderAuthScreen(form.querySelector('#authName')?'register':'login',error.message||'Impossible de traiter la demande.');
    }
  });
  try{
    const session=await BloxforgeAuth.getSession();
    if(session.user)await enterApplication(session.user);
    else renderAuthScreen('login');
  }catch(error){
    renderAuthScreen('login','Le serveur local ne répond pas. Lancez npm start, puis rechargez cette page.');
  }
}

function killBoot(){
  const b=document.getElementById('boot');
  if(b){b.classList.add('done');setTimeout(()=>{if(b.parentNode)b.remove();},600);}
}
try{
  kuboAvatar();
  setupProgressTools();
  setupKuboControls();
  setupAccessibility();
  updateHeader();
  initializeAuthentication();
}catch(err){
  console.error('Erreur au démarrage :',err);
  killBoot();
  authRoot.innerHTML='<section class="auth-screen"><div class="auth-card card"><h1>Oups — un problème est survenu.</h1><p class="auth-subtitle">Recharge la page (F5).</p><button class="btn btn-black" type="button" data-reload-page>Recharger</button></div></section>';
  authRoot.querySelector('[data-reload-page]').addEventListener('click',()=>location.reload());
  refreshIcons();
}
setTimeout(killBoot,3200);

(function(){
  var lastErr=null;
  window.addEventListener('error',function(e){lastErr=e.message||'Erreur inconnue';});
  setTimeout(function(){
    var a=document.getElementById('app');
    if(a&&!a.firstElementChild&&!document.body.classList.contains('auth-locked')){
      a.innerHTML='<div style="max-width:520px;margin:80px auto;padding:0 24px;font-family:Archivo,sans-serif;text-align:center">'
      +'<div style="font-family:\'Bricolage Grotesque\',sans-serif;font-weight:800;font-size:28px;color:#17181C">Oups — le site n\u2019a pas pu démarrer.</div>'
      +'<p style="color:#8B8F98;margin:14px 0">Recharge la page.</p>'
      +(lastErr?'<p style="font-family:monospace;font-size:12px;color:#E5484D;background:#FCEFEF;border:1px solid #F3DCDC;border-radius:10px;padding:10px 14px">'+lastErr+'</p>':'')
      +'<button data-reload-page style="margin-top:18px;background:#17181C;color:#fff;border:none;border-radius:999px;padding:13px 26px;font-weight:700;font-size:15px;cursor:pointer">Recharger la page</button>'
      +'</div>';
      a.querySelector('[data-reload-page]').addEventListener('click',()=>location.reload());
    }
  },3000);
})();
