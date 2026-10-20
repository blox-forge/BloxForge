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

/* ============================================================
   PRÉAMBULE + 10 MASTERCLASS
   ============================================================ */
const LESSONS=[
{id:'pre',gt:'pre',pnum:'P',title:'Se repérer dans Roblox Studio',dur:'5 MIN',lvl:'PRÉAMBULE',
obj:'Les 6 repères essentiels pour ne jamais te perdre dans l\u2019atelier de création.',
kintro:'Avant de choisir ton jeu, imprègne ces <b>6 repères</b> : c\u2019est le plan de Roblox Studio. 2 minutes de lecture qui te serviront dans toutes les masterclass.',
steps:[
{t:'La vue 3D',b:'<p>La grande fenêtre centrale : c\u2019est <b>ton monde</b>, visible sous tous les angles. <mark>Clic droit maintenu + souris</mark> pour tourner autour, molette pour zoomer, <b>ZQSD + clic droit</b> pour te déplacer.</p>'},
{t:'L\u2019Explorer',b:'<p>Le panneau à droite : <mark>l\u2019arbre de tous les objets</mark> du jeu — Workspace, Lighting, Players… Tout ce qui existe dans ton monde vit ici, comme un sommaire.</p>'},
{t:'Les Properties',b:'<p>Juste sous l\u2019Explorer : <mark>la fiche d\u2019identité de l\u2019objet sélectionné</mark>. Position, taille, couleur, Anchored… Clique un objet dans l\u2019Explorer, ses propriétés s\u2019affichent ici.</p>',
tip:'Le duo <mark>Explorer + Properties</mark> est ta table de travail permanente — 90 % de ton temps se passera ici.'},
{t:'Le bouton Play',b:'<p>En haut : <mark>lance ton jeu en test</mark> (F5). Attention : tout ce que tu modifies pendant le test disparaît à l\u2019arrêt (Shift+F5) — c\u2019est une copie temporaire.</p>'},
{t:'Ctrl + S',b:'<p><mark>La sauvegarde locale</mark> de ton fichier. Réflexe absolu : chaque victoire sur ton monde mérite un Ctrl + S.</p>'},
{t:'La Toolbox',b:'<p>La bibliothèque d\u2019objets et de modèles de la communauté. Pratique pour prototyper — mais apprends d\u2019abord à construire toi-même.</p>'}
],
exos:[
{type:'mcq',q:'Où se trouve la liste de tous les objets de ton jeu ?',opts:['Les Properties','L\u2019Explorer','La Toolbox','L\u2019Output'],a:1,why:'L\u2019Explorer est l\u2019arbre complet des objets.'},
{type:'tf',q:'Les modifications en mode Play persistent après l\u2019arrêt.',a:false,why:'Le mode Play travaille sur une copie temporaire : tout s\u2019efface.'},
{type:'mcq',q:'Quelle touche fait focus sur l\u2019objet sélectionné ?',opts:['F','G','R','Échap'],a:0,why:'F fait sauter la caméra sur l\u2019objet sélectionné.'}
]},

{id:'obby',gt:'obby',pnum:'M',title:'Masterclass Obby — parcours d\u2019obstacles',dur:'45 MIN',lvl:'MASTERCLASS',
obj:'Construire un obby complet : parcours, kill bricks, checkpoints, compteur, publication.',
kintro:'<b>L\u2019obby</b>, la porte d\u2019entrée des créateurs Roblox ! En 6 étapes, tu construis un parcours d\u2019obstacles complet et jouable — le type parfait pour tout apprendre.',
steps:[
{t:'Le plan de ton parcours',b:'<p>Un bon obby se <b>conçoit avant de se construit</b>. Dessine ton parcours sur papier : départ, étapes, pièges, arrivée.</p><ul class="dash"><li><mark>Commence facile, termine difficile</mark> — la courbe de difficulté doit monter en douceur.</li><li>Espace les plateformes d\u2019environ <mark>7 à 8 studs maximum</mark> pour des sauts faisables.</li><li>Varie les défis : sauts, kill bricks, plateformes mobiles, labyrinthes.</li></ul>',
tip:'Teste chaque saut toi-même en mode Play : si TU n\u2019y arrives pas, le joueur n\u2019y arrivera pas non plus.'},
{t:'Plateforme de départ et spawn',b:'<p>Crée une plateforme de 20 × 1 × 20 studs (onglet Modèle → Part), <mark>ancrée</mark>. Puis insère un <b>SpawnLocation</b> (onglet Modèle → Spawn) au centre : c\u2019est là que tes joueurs apparaissent.</p>',
b2:'<p>Le SpawnLocation est l\u2019objet magique : <mark>chaque joueur réapparaît au SpawnLocation</mark> après une mort. Sans lui, Roblox choisit un point aléatoire au sol.</p>'},
{t:'La kill brick — le piège mortel',b:'<p>Crée une part fine et <mark>rouge</mark> (couleur bien visible = signal de danger), ancrée, nommée <b>KillBrick</b>. Insère un Script dedans :</p>',
code:'local part = script.Parent\n\npart.Touched:Connect(function(hit)\n  local perso = hit.Parent\n  if perso:FindFirstChild("Humanoid") then\n    perso.Humanoid.Health = 0\n  end\nend)',
b2:'<p><b>Ligne par ligne :</b> Touched détecte le contact ; <mark>hit.Parent</mark> est le personnage ; FindFirstChild("Humanoid") vérifie que c\u2019est bien un joueur (et pas un objet) ; <mark>Health = 0</mark> déclenche la mort et la réapparition automatique.</p>',
say:'La kill brick c\u2019est LE classique. Teste-la en sautant dessus… <b>après avoir sauvegardé</b> !'},
{t:'Le checkpoint — réapparaître plus loin',b:'<p>Place une SpawnLocation colorée (néon, par exemple) nommée <b>Checkpoint2</b>, avec ce script :</p>',
code:'local spawn = script.Parent\nlocal Players = game:GetService("Players")\n\nspawn.Touched:Connect(function(hit)\n  local joueur = Players:GetPlayerFromCharacter(hit.Parent)\n  if joueur then\n    joueur.RespawnLocation = spawn\n  end\nend)',
b2:'<p>Quand le joueur touche ce checkpoint, <mark>son point de réapparition est redéfini ici</mark> — il ne retourne plus au départ. Propre et simple, sans système d\u2019équipes.</p>',
tip:'<mark>Numérote tes checkpoints</mark> (Checkpoint1, Checkpoint2…) — le numéro servira dans le compteur à l\u2019étape suivante.'},
{t:'Le compteur d\u2019étapes (leaderstats)',b:'<p>L\u2019affichage en haut à droite de la liste des joueurs. Un seul script dans <b>ServerScriptService</b> :</p>',
code:'local Players = game:GetService("Players")\n\nPlayers.PlayerAdded:Connect(function(joueur)\n  local stats = Instance.new("Folder")\n  stats.Name = "leaderstats"\n  stats.Parent = joueur\n\n  local etapes = Instance.new("IntValue")\n  etapes.Name = "Etapes"\n  etapes.Parent = stats\nend)',
b2:'<p>Le dossier <mark>leaderstats</mark> est reconnu automatiquement par Roblox et affiché dans le scoreboard. Puis complète le script du checkpoint (étape 4) :</p>',
code:'  if joueur then\n    joueur.RespawnLocation = spawn\n    local etapes = joueur.leaderstats.Etapes\n    if etapes.Value < 2 then\n      etapes.Value = 2\n    end\n  end',
b2:'<p>Le verrou <mark>if etapes.Value &lt; 2</mark> empêche le compteur de reculer si le joueur retouche un vieux checkpoint.</p>'},
{t:'Polish et publication',b:'<p>Ton obby fonctionne ! Reste le polish, ce qui différencie un bon jeu d\u2019un jeu inoubliable :</p><ul class="dash"><li><b>Néons</b> sur les checkpoints — visible de loin.</li><li><b>Sons</b> : un bip de validation, une musique d\u2019ambiance (objet Sound).</li><li><b>Équilibrage</b> : fais tester par un ami et regarde-le jouer en silence.</li><li>Publie : <b>Fichier → Publier sur Roblox</b>, puis <mark>Permissions → Public</mark>.</li></ul>',
challenge:'Défi : ajoute une plateforme mobile (part avec un script qui la fait bouger en boucle avec while true do et task.wait) — un classique des obby avancés !'}
],
exos:[
{type:'fill',q:'Complète la kill brick :',code:'perso.‹Humanoid›.‹Health› = 0',extra:['Name','Touched']},
{type:'mcq',q:'Que fait <code>joueur.RespawnLocation = spawn</code> ?',opts:['Téléporte immédiatement','Redéfinit le point de réapparition','Fige la part','Soigne le joueur'],a:1},
{type:'order',q:'Ordonne la construction d\u2019un obby :',items:['Plateforme + spawn','Plateformes de saut','Kill brick','Checkpoint','Compteur d\u2019étapes']},
{type:'tf',q:'Le verrou if etapes.Value < 2 empêche le compteur de reculer.',a:true}
]},

{id:'simu',gt:'simu',pnum:'M',title:'Masterclass Simulator — boucle de progression',dur:'45 MIN',lvl:'MASTERCLASS',
obj:'Créer un jeu de collecte avec économie, boutique et sauvegarde.',
kintro:'<b>Le Simulator</b> : le roi de la rétention sur Roblox ! Collecter, vendre, améliorer, recommencer plus fort — la boucle qui fait revenir les joueurs chaque jour.',
steps:[
{t:'La boucle de gameplay',b:'<p>Un simulator vit sur une boucle simple : <mark>collecter → vendre → acheter → collecter plus vite</mark>. Avant de coder, dessine cette boucle pour TON jeu (fruits ? pierres ? étoiles ?).</p><ul class="dash"><li><b>La ressource</b> : ce que le joueur ramasse.</li><li><b>Le point de vente</b> : où il transforme en argent.</li><li><b>La boutique</b> : où il dépense pour aller plus vite.</li></ul>'},
{t:'La zone de collecte',b:'<p>Crée une zone colorée (part géante, Transparency 0.5, ancrée, <mark>CanCollide = false</mark>). Quand le joueur la touche, il gagne la ressource :</p>',
code:'local zone = script.Parent\nlocal Players = game:GetService("Players")\n\nlocal RECOMPENSE = 5 -- pièces par contact\n\nzone.Touched:Connect(function(hit)\n  local joueur = Players:GetPlayerFromCharacter(hit.Parent)\n  if joueur then\n    local pieces = joueur.leaderstats.Pieces\n    pieces.Value = pieces.Value + RECOMPENSE\n  end\nend)',
b2:'<p>Le montant est dans une variable <mark>RECOMPENSE</mark> : facile à ajuster quand tu équilibreras plus tard.</p>'},
{t:'Leaderstats : argent et ressources',b:'<p>Comme pour l\u2019obby, le scoreboard affiche les richesses du joueur :</p>',
code:'local Players = game:GetService("Players")\n\nPlayers.PlayerAdded:Connect(function(joueur)\n  local stats = Instance.new("Folder")\n  stats.Name = "leaderstats"\n  stats.Parent = joueur\n\n  local pieces = Instance.new("IntValue")\n  pieces.Name = "Pieces"\n  pieces.Parent = stats\nend)'},
{t:'La boutique — acheter un multiplicateur',b:'<p>Une part avec un TextLabel « VITESSE ×2 — 100 pièces ». Au clic (Touched), on vérifie le prix :</p>',
code:'local bouton = script.Parent\nlocal Players = game:GetService("Players")\n\nlocal PRIX = 100\n\nbouton.Touched:Connect(function(hit)\n  local joueur = Players:GetPlayerFromCharacter(hit.Parent)\n  if joueur then\n    local pieces = joueur.leaderstats.Pieces\n    if pieces.Value >= PRIX then\n      pieces.Value = pieces.Value - PRIX\n      joueur.Vitesse.Value = joueur.Vitesse.Value * 2\n    end\n  end\nend)',
b2:'<p>Le <mark>if pieces.Value &gt;= PRIX</mark> vérifie que le joueur a assez d\u2019argent — sinon rien ne se passe. Ajoute une valeur IntValue « Vitesse » dans le dossier joueur à la connexion.</p>',
tip:'Ajoute un <b>feedback sonore</b> quand l\u2019achat réussit — le silence est le pire retour possible pour un joueur.'},
{t:'Sauvegarde avec DataStore',b:'<p>Le point qui fait la différence : <mark>les DataStores sauvegardent les pièces entre les sessions</mark>. Version simplifiée :</p>',
code:'local DSS = game:GetService("DataStoreService")\nlocal store = DSS:GetDataStore("PiecesStore")\nlocal Players = game:GetService("Players")\n\nPlayers.PlayerAdded:Connect(function(joueur)\n  local data = store:GetAsync(joueur.UserId) or 0\n  joueur.leaderstats.Pieces.Value = data\nend)\n\nPlayers.PlayerRemoving:Connect(function(joueur)\n  store:SetAsync(joueur.UserId,\n    joueur.leaderstats.Pieces.Value)\nend)',
b2:'<p><mark>GetAsync lit</mark>, <mark>SetAsync écrit</mark> — identifié par l\u2019UserId unique du joueur. C\u2019est un sujet avancé, retiens le rôle : la mémoire long terme de ton jeu.</p>'},
{t:'Le rebirth et l\u2019expansion',b:'<p>Le <b>rebirth</b> : le joueur repart de zéro contre un <mark>multiplicateur permanent</mark> — la mécanique de rétention ultime. Puis élargis : <b>pets</b> (compagnons qui boostent), <b>zones à débloquer</b>, <b>classements hebdomadaires</b>.</p>',
challenge:'Défi : affiche le total de pièces dans un TextLabel UI qui se met à jour automatiquement — indice : la propriété .Changed des IntValue !'}
],
exos:[
{type:'fill',q:'Ajoute la récompense au compteur :',code:'pieces.Value = pieces.Value ‹+› ‹RECOMPENSE›',extra:['-','*']},
{type:'mcq',q:'Que fait GetAsync ?',opts:['Écrit des données','Lit des données sauvegardées','Crée une part','Soigne le joueur'],a:1},
{type:'order',q:'Ordonne la boucle du simulator :',items:['Collecter la ressource','Vendre pour des pièces','Acheter des améliorations','Collecter plus vite']},
{type:'tf',q:'Le rebirth efface la progression contre un multiplicateur permanent.',a:true}
]},

{id:'tycoon',gt:'tycoon',pnum:'M',title:'Masterclass Tycoon — construire un empire',dur:'45 MIN',lvl:'MASTERCLASS',
obj:'Un tycoon avec droppers, convoyeurs, achats et expansion automatique.',
kintro:'<b>Le Tycoon</b> : démarrer avec rien, bâtir un empire qui produit tout seul. La satisfaction de voir sa base grandir pendant qu\u2019on regarde — un pilier de Roblox.',
steps:[
{t:'Le concept : produire, dépenser, grandir',b:'<p>Un tycoon repose sur une production <mark>automatique</mark> : des machines génèrent de l\u2019argent pendant que le joueur achète les suivantes. Ton plan : <b>une base plot</b>, des machines à débloquer, un convoyeur central.</p>'},
{t:'Le dropper — produire automatiquement',b:'<p>Le dropper crée des billets en boucle infinie. Le secret : <mark>while true do</mark> :</p>',
code:'local dropper = script.Parent\n\nwhile true do\n  local billet = Instance.new("Part")\n  billet.Size = Vector3.new(1, 0.3, 2)\n  billet.Color = Color3.fromRGB(80, 200, 120)\n  billet.Position = dropper.Position - Vector3.new(0, 3, 0)\n  billet.Parent = workspace\n  task.wait(1) -- un billet par seconde\nend',
b2:'<p><mark>while true do</mark> répète à l\u2019infini. <mark>Instance.new("Part")</mark> fabrique un objet en direct. <b>task.wait(1)</b> évite de figer le jeu — <mark>jamais de boucle sans task.wait</mark> !</p>',
say:'while true do est le moteur de tout tycoon. Mais oublie le task.wait et ton jeu entier se fige — c\u2019est le bug n°1 des débutants !'},
{t:'Le convoyeur et la collecte',b:'<p>Un long tapis (part ancrée, <mark>Velocity = (0, 0, 10)</mark> — il pousse tout ce qui le touche) mène à une zone de collecte :</p>',
code:'local collecteur = script.Parent\n\ncollecteur.Touched:Connect(function(hit)\n  if hit.Name == "Billet" then\n    hit:Destroy()\n    -- +10 pièces pour le propriétaire\n  end\nend)'},
{t:'Les boutons d\u2019achat — débloquer des machines',b:'<p>Chaque machine est verrouillée derrière un bouton-prix. Le motif complet :</p>',
code:'local bouton = script.Parent\nlocal machine = bouton.Parent:FindFirstChild("Dropper2")\nlocal PRIX = 100\n\nbouton.Touched:Connect(function(hit)\n  local joueur = game:GetService("Players")\n    :GetPlayerFromCharacter(hit.Parent)\n  if joueur and machine then\n    local pieces = joueur.leaderstats.Pieces\n    if pieces.Value >= PRIX then\n      pieces.Value = pieces.Value - PRIX\n      bouton:Destroy()\n      machine.Transparency = 0\n      machine.CanCollide = true\n    end\n  end\nend)',
b2:'<p>La machine est <b>cachée</b> (Transparency 1, CanCollide false) puis <mark>révélée à l\u2019achat</mark>. C\u2019est ainsi que ton empire « grandit » visuellement.</p>'},
{t:'Organiser ton plot',b:'<ul class="dash"><li><b>Un plot par joueur</b> : duplique le modèle et assigne chaque plot via <mark>player:LoadCharacter dans un plot libre</mark>.</li><li><b>Progression lisible</b> : les boutons passent du gris au vert quand le joueur peut acheter.</li><li><b>Modularité</b> : chaque machine = un Model indépendant, dupliqué à volonté.</li></ul>',
tip:'Nomme TOUS tes objets (Dropper1, ConveyorB, BuyButton3…) : un tycoon mal nommé devient ingérable dès la 5e machine.'},
{t:'Sauvegarde et expansion',b:'<p>Comme pour le simulator : <b>DataStore</b> pour sauvegarder machines achetées et argent. Puis les grands classiques : <mark>rebirth</mark>, <b>badges</b> de palier (« 1 million ! »), <b>classements</b> des plus riches.</p>',
challenge:'Défi : fais varier le délai des billets avec le niveau du dropper — niveau 1 toutes les 2 secondes, niveau 5 : 2 par seconde !'}
],
exos:[
{type:'fill',q:'Complète la boucle infinie du dropper :',code:'‹while› true ‹do›\n  task.wait(1)\n‹end›',extra:['if','then','repeat']},
{type:'mcq',q:'Que fait task.wait(1) dans une boucle while ?',opts:['Arrête la boucle','Met en pause 1 seconde sans figer le jeu','Détruit le billet','Accélère le jeu'],a:1},
{type:'order',q:'Ordonne la construction d\u2019un tycoon :',items:['Créer le plot de base','Programmer le dropper (while true do)','Poser le convoyeur et le collecteur','Ajouter les boutons d\u2019achat','Sauvegarder avec DataStore']},
{type:'tf',q:'Une boucle while true do sans task.wait fige le jeu entier.',a:true}
]},

{id:'combat',gt:'combat',pnum:'M',title:'Masterclass Combat — duels et battlegrounds',dur:'45 MIN',lvl:'MASTERCLASS',
obj:'Un jeu de combat avec dégâts, cooldowns, coups spéciaux et UI de vie.',
kintro:'<b>Le Combat / Battlegrounds</b> : inspiré des animes qui cartonnent. Combos, cooldowns, coups spéciaux — la mécanique la plus pure de Roblox.',
steps:[
{t:'Les fondations : Humanoid et santé',b:'<p>Chaque personnage a un <b>Humanoid</b> avec une <mark>Health</mark> (0 à 100 par défaut). Tout combat est une bataille de Health : frapper = <mark>réduire la santé de l\u2019adversaire</mark>, gagner = la ramener à 0.</p>',
code:'-- Frapper un personnage :\nperso.Humanoid:TakeDamage(25)',
b2:'<p><mark>TakeDamage</mark> respecte les boucliers éventuels (ForceField) — c\u2019est la méthode propre.</p>'},
{t:'L\u2019arme : le Tool',b:'<p>Le <b>Tool</b> est l\u2019objet que le personnage tient en main. Crée-le dans <mark>StarterPack</mark> (chaque joueur le reçoit) avec un Handle (part) et un Script :</p>',
code:'local tool = script.Parent\nlocal toolEquipped = false\n\ntool.Equipped:Connect(function()\n  toolEquipped = true\nend)\n\ntool.Unequipped:Connect(function()\n  toolEquipped = false\nend)'},
{t:'Le coup : détection et dégâts',b:'<p>Le Handle touche l\u2019adversaire → dégâts. Mais pas à chaque frame ! D\u2019où le <mark>cooldown</mark> :</p>',
code:'local handle = tool:WaitForChild("Handle")\nlocal peutFrapper = true\nlocal DEGATS = 25\nlocal COOLDOWN = 1 -- seconde\n\nhandle.Touched:Connect(function(hit)\n  local perso = hit.Parent\n  local humanoid = perso:FindFirstChild("Humanoid")\n  \n  if humanoid and peutFrapper\n    and perso ~= tool.Parent.Parent then\n    peutFrapper = false\n    humanoid:TakeDamage(DEGATS)\n    task.wait(COOLDOWN)\n    peutFrapper = true\n  end\nend)',
b2:'<p><mark>peutFrapper</mark> bloque les coups pendant le cooldown. La condition <b>perso ~= tool.Parent.Parent</b> t\u2019empêche de te frapper toi-même !</p>',
tip:'Le cooldown est LE concept du jeu de combat : <mark>1 seconde = équilibré, 0.1s = chaos, 3s = lent</mark>. Teste, ajuste, reteste.'},
{t:'La barre de vie à l\u2019écran',b:'<p>Avec un ScreenGui + un LocalScript, affiche la santé en direct :</p>',
code:'local player = game.Players.LocalPlayer\nlocal barre = script.Parent\n\nwhile true do\n  local hum = player.Character.Humanoid\n  barre.Size = UDim2.new(hum.Health / hum.MaxHealth, 0, 1, 0)\n  task.wait(0.1)\nend',
b2:'<p>La barre se <mark>recalcule à chaque boucle</mark> — le rapport Health/MaxHealth donne toujours un nombre entre 0 et 1, parfait pour une barre.</p>'},
{t:'Coup spécial et animations',b:'<p>Un coup spécial = <mark>plus de dégâts + cooldown plus long</mark> + effet visuel. Charge l\u2019animation avec l\u2019<mark>Animator</mark> du Humanoid, joue-la avec track:Play(), et applique les dégâts pendant l\u2019animation.</p>',
say:'Le feeling d\u2019un combat, c\u2019est 20 % de code et 80 % de timing. Joue ton propre jeu, rétrécis les cooldowns, aggrave les coups — jusqu\u2019à ce que ça soit FUN.'},
{t:'Équilibrage et publication',b:'<ul class="dash"><li><b>MaxHealth</b> différent par classe (tank 200, assassin 80…).</li><li><b>KO = respawn au spawn</b> avec un délai de 3 secondes.</li><li>Publie et fais tester par des amis — l\u2019équilibrage ne se fait jamais seul.</li></ul>',
challenge:'Défi : ajoute un knockback — quand le coup touche, l\u2019adversaire est propulsé avec une impulsion sur son HumanoidRootPart !'}
],
exos:[
{type:'fill',q:'Applique des dégâts proprement :',code:'humanoid:‹TakeDamage›(25)',extra:['Health','Kill']},
{type:'mcq',q:'À quoi sert la variable peutFrapper dans le script de coup ?',opts:['À compter les coups','À bloquer les coups pendant le cooldown','À afficher les dégâts','À soigner'],a:1},
{type:'order',q:'Ordonne la construction d\u2019une arme :',items:['Créer le Tool avec son Handle','Détecter Equipped/Unequipped','Détecter Touched sur le Handle','Appliquer les dégâts avec cooldown']},
{type:'tf',q:'TakeDamage respecte les ForceField, contrairement à une écriture directe de Health.',a:true}
]},

{id:'rp',gt:'rp',pnum:'M',title:'Masterclass Roleplay — ville et vie sociale',dur:'45 MIN',lvl:'MASTERCLASS',
obj:'Une ville vivante : maisons achetables, métiers, argent, interactions.',
kintro:'<b>Roleplay et villes</b> (Brookhaven, Adopt Me) : le genre le plus social de Roblox. Pas de gagnant — une vie. Maisons, métiers, rencontres.',
steps:[
{t:'La ville : construire l\u2019espace',b:'<p>Une ville se construit en <b>modèles répétables</b> : une maison-type, une route-type, un magasin-type. <mark>Construis un prototype parfait, puis Ctrl + D</mark> pour dupliquer et varier.</p><ul class="dash"><li>Routes larges (12 studs), zones piétonnes.</li><li>Bâtiments repérables : couleurs et enseignes distinctes.</li><li>Un lieu central (place, fontaine) pour les rencontres.</li></ul>'},
{t:'Portes et interactions',b:'<p>Une porte qui s\u2019ouvre au contact — la base de toute interaction RP :</p>',
code:'local porte = script.Parent\nlocal ouvert = false\n\nporte.Touched:Connect(function(hit)\n  local humanoid = hit.Parent:FindFirstChild("Humanoid")\n  if humanoid and not ouvert then\n    ouvert = true\n    porte.CanCollide = false\n    porte.Transparency = 0.7\n    task.wait(3)\n    porte.CanCollide = true\n    porte.Transparency = 0\n    ouvert = false\n  end\nend)',
b2:'<p>La variable <mark>ouvert</mark> évite que la porte « clignote » si plusieurs joueurs la touchent en même temps.</p>'},
{t:'Acheter sa maison',b:'<p>La porte verrouillée jusqu\u2019à l\u2019achat : un panneau « MAISON — 500 pièces », puis propriété :</p>',
b2:'<p>Au Touched : si le joueur a 500 pièces, déduis, mets un <b>ObjectValue "Proprietaire"</b> pointant vers le joueur, et ouvre la porte UNIQUEMENT pour lui. Les autres voient : « Maison de Alex ».</p>',
tip:'Attribue la maison via <mark>un ObjectValue pointant vers le joueur</mark> — à la reconnexion, il la récupère automatiquement.'},
{t:'Métiers et économie',b:'<ul class="dash"><li><b>Pizzaïolo, livreur, policier…</b> — un poste de travail = une zone Touched qui rapporte à chaque tâche.</li><li><mark>Un métier = une boucle simple</mark> : prends la commande → livre → pièces.</li><li>Le leaderstats affiche <b>Argent</b> et <b>Métier</b> (StringValue).</li></ul>'},
{t:'Les véhicules simples',b:'<p>Le <b>VehicleSeat</b> rend n\u2019importe quel assemblage conduisible ! Châssis + 4 roues + VehicleSeat, et dans le VehicleSeat :</p>',
code:'local seat = script.Parent\n\nseat.Changed:Connect(function(prop)\n  if prop == "Occupant" and seat.Occupant then\n    print(seat.Occupant.Name .. " conduit !")\n  end\nend)'},
{t:'Sauvegarde et communauté',b:'<p>DataStore pour <mark>l\u2019argent, la maison, le métier</mark>. Le vrai moteur d\u2019un RP : <b>la communauté</b> — mets à jour régulièrement, écoute les joueurs, organise des événements (fêtes, ventes flash).</p>',
challenge:'Défi : ajoute un PNJ qui salue le joueur quand il s\u2019approche — un Humanoid + un Touched sur une zone autour de lui !'}
],
exos:[
{type:'mcq',q:'Que fait la variable "ouvert" dans le script de porte ?',opts:['Compte les joueurs','Empêche la porte de clignoter au multi-contact','Affiche le nom du propriétaire','Détruit la porte'],a:1},
{type:'fill',q:'Détecte un personnage à la porte :',code:'hit.Parent:FindFirstChild("‹Humanoid›")',extra:['Health','Player']},
{type:'order',q:'Ordonne la construction d\u2019une ville RP :',items:['Construire les prototypes (maison, route)','Dupliquer et composer la ville','Programmer les interactions (portes)','Ajouter métiers et économie','Sauvegarder argent et maisons']},
{type:'tf',q:'Le VehicleSeat rend un assemblage conduisible.',a:true}
]},

{id:'horror',gt:'horror',pnum:'M',title:'Masterclass Horreur — peur et immersion',dur:'45 MIN',lvl:'MASTERCLASS',
obj:'Une expérience terrifiante : ambiance, lampe torche, monstre traqueur, jumpscares.',
kintro:'<b>L\u2019horreur</b> (Doors, Rainbow Friends) : le genre le plus immersif de Roblox. Peu de code, beaucoup d\u2019ambiance — et des joueurs qui crient.',
steps:[
{t:'L\u2019ambiance : Lighting au service de la peur',b:'<p>Règle l\u2019objet <b>Lighting</b> pour une obscurité totale :</p>',
code:'-- Dans les Properties de Lighting :\n-- ClockTime = 0 (minuit)\n-- Brightness = 1\n-- FogEnd = 60 (brume qui rapproche)\n-- + un Atmosphere dans Lighting',
b2:'<p><mark>FogEnd = 60</mark> : au-delà de 60 studs, tout disparaît dans la brume. Le joueur ne voit jamais loin — <b>ce qu\u2019on ne voit pas fait plus peur</b>.</p>',
tip:'L\u2019horreur vit dans le SON autant que l\u2019image : des pas, des murmures, un silence total juste AVANT le jumpscare.'},
{t:'La lampe torche — le LocalScript',b:'<p>Le joueur tient une lampe (un Tool avec un <b>SpotLight</b> sur le Handle) :</p>',
code:'local tool = script.Parent\nlocal lampe = tool:WaitForChild("Handle")\n  :FindFirstChildOfClass("SpotLight")\n\ntool.Activated:Connect(function()\n  lampe.Enabled = not lampe.Enabled\nend)',
b2:'<p><mark>tool.Activated</mark> = clic gauche. La lampe s\u2019allume et s\u2019éteint — <mark>une lampe qui vacille</mark> (Brightness aléatoire) est encore plus angoissante.</p>'},
{t:'Le monstre qui traque',b:'<p>Un PNJ qui suit le joueur le plus proche — le cauchemar de tout jeu d\u2019horreur :</p>',
code:'local monstre = script.Parent\nlocal Pathfinding = game:GetService("PathfindingService")\n\nwhile true do\n  local cible = game.Players:GetPlayers()[1]\n  if cible and cible.Character then\n    local path = Pathfinding:ComputeAsync(\n      monstre.HumanoidRootPart.Position,\n      cible.Character.HumanoidRootPart.Position)\n    if path.Status == Enum.PathStatus.Success then\n      monstre.Humanoid:MoveTo(\n        path:GetWaypoints()[#path:GetWaypoints()].Position)\n    end\n  end\n  task.wait(2)\nend',
b2:'<p><mark>PathfindingService calcule un chemin</mark> autour des obstacles. MoveTo fait marcher le monstre. Toutes les 2 secondes, il recalcule — il traque sans jamais s\u2019arrêter.</p>'},
{t:'Le jumpscare — image + son',b:'<p>Le duo classique : contact (ou zone) → <b>image plein écran + son strident</b> pendant 0.5 seconde, dans un LocalScript de StarterGui.</p>',
say:'La peur vit dans l\u2019anticipation. Deux pièces calmes, puis une porte qui grince — le joueur est déjà terrifié AVANT même de voir quoi que ce soit.'},
{t:'Les portes — Doors-style',b:'<p>Le cœur de Doors : <b>ouvrir chaque porte est un risque</b>. Derrière elle : parfois la pièce suivante… parfois le monstre. <mark>Une chance sur 10</mark> de rencontre, gérée par un if et math.random(1, 10).</p>'},
{t:'Rythme et publication',b:'<ul class="dash"><li><mark>Alternance tension / chaos</mark> : jamais deux jumpscares d\u2019affilée.</li><li>Objectif clair : « atteins la sortie » — une raison d\u2019avancer malgré la peur.</li><li>Bruit de pas du monstre audible de loin : le joueur SAIT qu\u2019il vient.</li></ul>',
challenge:'Défi : fais vaciller la lampe — un while true do qui change aléatoirement Brightness entre 0.5 et 2 !'}
],
exos:[
{type:'mcq',q:'Pourquoi FogEnd = 60 est-il si efficace en horreur ?',opts:['Le jeu va plus vite','Ce qu\u2019on ne voit pas fait peur','Ça économise la mémoire','C\u2019est obligatoire'],a:1},
{type:'fill',q:'Allume/éteins la lampe au clic :',code:'tool.‹Activated›:Connect(function()end)',extra:['Touched','Equipped']},
{type:'order',q:'Ordonne la construction d\u2019un jeu d\u2019horreur :',items:['Régler Lighting (noir + brouillard)','Créer la lampe torche (LocalScript)','Programmer le monstre traqueur','Ajouter les jumpscares','Équilibrer le rythme']},
{type:'tf',q:'Deux jumpscares d\u2019affilée sont recommandés pour plus de peur.',a:false}
]},

{id:'td',gt:'td',pnum:'M',title:'Masterclass Tower Defense — vagues et stratégie',dur:'45 MIN',lvl:'MASTERCLASS',
obj:'Un TD complet : ennemis, tours, vagues, économie et ciblage.',
kintro:'<b>Tower Defense</b> (Toilet Tower Defense !) : placer des tours, survivre aux vagues. La stratégie pure — et un des genres les plus suivis.',
steps:[
{t:'Le concept : le chemin et les vagues',b:'<p>Un TD a trois ingrédients : <b>un chemin</b> que suivent les ennemis, <b>des tours</b> que le joueur place à côté, <b>des vagues</b> de plus en plus féroces. Construis d\u2019abord le chemin (parts ancrées formant un S).</p>'},
{t:'Les ennemis : suivre le chemin',b:'<p>Chaque ennemi est un Model avec Humanoid. Il suit les <mark>waypoints</mark> du chemin :</p>',
code:'local ennemi = script.Parent\nlocal chemin = workspace.Chemin -- dossier de waypoints\n\nfor _, point in pairs(chemin:GetChildren()) do\n  ennemi.Humanoid:MoveTo(point.Position)\n  ennemi.Humanoid.MoveToFinished:Wait()\nend\n\n-- Fin du chemin : le joueur perd une vie\nennemi:Destroy()',
b2:'<p><mark>MoveToFinished:Wait()</mark> attend que l\u2019ennemi atteigne chaque point avant de passer au suivant — il suit le chemin point par point.</p>'},
{t:'Les vagues — la boucle du jeu',b:'<p>Le spawner crée les ennemis en vagues croissantes :</p>',
code:'local vague = 1\n\nwhile true do\n  for i = 1, vague * 3 do\n    spawnEnnemi()\n    task.wait(1)\n  end\n  task.wait(5) -- pause entre les vagues\n  vague = vague + 1\nend',
b2:'<p><mark>vague × 3</mark> : chaque vague est plus fournie que la précédente. Annonce le numéro de vague à l\u2019écran — la tension monte.</p>',
tip:'Augmente aussi <b>les points de vie</b> des ennemis avec les vagues — plus d\u2019ennemis ET plus résistants.'},
{t:'Les tours : cibler et tirer',b:'<p>Une tour regarde l\u2019ennemi le plus proche et tire :</p>',
code:'local tour = script.Parent\nlocal portee = 30\n\nwhile true do\n  local cible = nil\n  local distMin = portee\n  \n  for _, e in pairs(workspace.Ennemis:GetChildren()) do\n    local d = (e.HumanoidRootPart.Position\n      - tour.Position).Magnitude\n    if d < distMin then\n      distMin = d\n      cible = e\n    end\n  end\n  \n  if cible then\n    cible.Humanoid:TakeDamage(10)\n  end\n  task.wait(0.5)\nend',
b2:'<p><mark>.Magnitude</mark> calcule la distance entre deux positions. La tour cible <b>l\u2019ennemi le plus proche</b> dans sa portée — tu peux varier : le plus avancé, le plus faible…</p>'},
{t:'Économie et placements',b:'<ul class="dash"><li>Chaque ennemi tué rapporte <mark>de l\u2019argent (leaderstats)</mark> — qui paie les nouvelles tours.</li><li>Placement des tours : clic sur une case valide (Touched + vérification que la case est libre).</li><li><b>Améliorations</b> : touche la tour + assez d\u2019argent = niveau 2 (dégâts ×2).</li></ul>'},
{t:'Victoire, défaite, équilibrage',b:'<p>Le joueur a <mark>des vies</mark> : un ennemi qui atteint la fin = -1 vie. 0 vie = défaite. Vague 20 survécue = victoire. Puis équilibre : <b>teste en jouant toi-même</b> jusqu\u2019à ce que la vague 10 soit dure mais juste.</p>',
challenge:'Défi : fais apparaître un ennemi « boss » toutes les 5 vagues — plus grand, plus lent, 10× plus de points de vie !'}
],
exos:[
{type:'fill',q:'Fais avancer l\u2019ennemi vers le point :',code:'ennemi.Humanoid:‹MoveTo›(point.Position)',extra:['Walk','Jump']},
{type:'mcq',q:'Que calcule .Magnitude entre deux positions ?',opts:['La rotation','La distance','Le poids','Le nombre d\u2019ennemis'],a:1},
{type:'order',q:'Ordonne la construction d\u2019un TD :',items:['Tracer le chemin','Programmer les ennemis (waypoints)','Créer la boucle des vagues','Programmer les tours (ciblage)','Équilibrer économie et difficulté']},
{type:'tf',q:'Chaque ennemi qui atteint la fin du chemin fait perdre une vie au joueur.',a:true}
]},

{id:'racing',gt:'racing',pnum:'M',title:'Masterclass Racing — vitesse et chrono',dur:'45 MIN',lvl:'MASTERCLASS',
obj:'Un jeu de course : voitures, checkpoints, chronomètre, classement.',
kintro:'<b>Racing</b> : le genre de la compétition pure. Chrono, classement, dépassements au dernier virage — et un son de moteur qui fait vibrer.',
steps:[
{t:'Le circuit : forme et repères',b:'<p>Dessine ton circuit en <b>3 parties minimum</b> : ligne droite de départ, virages serrés, longue finale. Marque-le avec <mark>des murs bas</mark> de chaque côté (CanCollide = true) pour que la voiture reste dedans.</p>'},
{t:'La voiture : VehicleSeat + roues',b:'<p>La voiture la plus simple : un châssis (part plate, ancrée = false), 4 roues (cylindres), un <b>VehicleSeat</b> au centre :</p>',
code:'-- Réglages du VehicleSeat dans Properties :\n-- MaxSpeed = 50\n-- Torque = 10\n-- TurnSpeed = 5\n-- Et c\u2019est TOUT : la voiture roule !',
b2:'<p>Le VehicleSeat pilote automatiquement les roues attachées : <mark>W = accélérer, A/D = tourner</mark>. Le joueur entre en touchant le siège.</p>'},
{t:'Les checkpoints de circuit',b:'<p>Un circuit compte des checkpoints invisibles (Transparency 1, CanCollide false) — on ne peut pas tricher en coupant :</p>',
code:'local cp = script.Parent\nlocal Players = game:GetService("Players")\n\ncp.Touched:Connect(function(hit)\n  local joueur = Players:GetPlayerFromCharacter(hit.Parent)\n  if joueur then\n    joueur.CircuitCP.Value = 1 -- CP n°1 franchi\n  end\nend)',
b2:'<p><mark>Seuls les CP franchis dans l\u2019ordre comptent</mark> : la ligne d\u2019arrivée vérifie que CircuitCP = dernier numéro avant de valider le tour.</p>'},
{t:'Le chronomètre',b:'<p>Le chrono démarre au premier mouvement et s\u2019affiche en direct :</p>',
code:'-- LocalScript dans StarterGui\nlocal depart = nil\nlocal label = script.Parent\n\ngame.Players.LocalPlayer.CharacterAdded:Connect(function()\n  depart = os.clock()\nend)\n\nwhile true do\n  if depart then\n    local temps = os.clock() - depart\n    label.Text = string.format("%.2f s", temps)\n  end\n  task.wait(0.05)\nend',
b2:'<p><mark>os.clock()</mark> donne le temps en secondes. La différence départ/arrivée = le temps du tour, affiché au centième.</p>'},
{t:'Classement et records',b:'<p>Le leaderboard affiche <b>MeilleurTemps</b> — sauvegardé en DataStore pour persister. Un record battu déclenche un son + un message global.</p>',
tip:'Un chrono visible crée la tension : le joueur se ressait pour grappiller <mark>0.1 seconde</mark>. C\u2019est ça, le racing.'},
{t:'Polish et publication',b:'<ul class="dash"><li><b>Sons</b> : moteur, collision, passage de checkpoint.</li><li><b>Effets de vitesse</b> : FOV qui s\u2019élargit quand on accélère.</li><li>Publie et fais des courses avec des amis — le racing vit du duel.</li></ul>',
challenge:'Défi : ajoute un boost pad — une zone Touched qui donne une impulsion (Velocity) à la voiture pendant 1 seconde !'}
],
exos:[
{type:'mcq',q:'Que pilote automatiquement le VehicleSeat ?',opts:['Les lumières','Les roues attachées','Le chrono','La musique'],a:1},
{type:'fill',q:'Mesure le temps écoulé :',code:'local temps = ‹os.clock›() - depart',extra:['wait()','tick()']},
{type:'order',q:'Ordonne la construction d\u2019un jeu de course :',items:['Construire le circuit et les murs','Assembler la voiture (VehicleSeat)','Poser les checkpoints anti-triche','Programmer le chrono','Classement et records']},
{type:'tf',q:'Les checkpoints invisibles empêchent de tricher en coupant le circuit.',a:true}
]},

{id:'io',gt:'io',pnum:'M',title:'Masterclass Survival .io — dernier debout',dur:'45 MIN',lvl:'MASTERCLASS',
obj:'Une arène avec zone qui rétrécit, collecte, combat, dernier survivant.',
kintro:'<b>Survival .io / Arène</b> : né sur navigateur, victorieux sur Roblox. Une zone qui se resserre, des objets à ramasser, un seul survivant — tension maximale.',
steps:[
{t:'Le concept : la boucle de survie',b:'<p>La boucle : <mark>collecter → s\u2019armer → survivre → éliminer</mark>. Chaque partie dure 5 à 10 minutes — courte, intense, rejouable. C\u2019est le format « une manche » qui fait revenir.</p>'},
{t:'L\u2019arène et la zone qui rétrécit',b:'<p>Le cœur du genre : un cercle qui se resserre :</p>',
code:'local zone = script.Parent -- un cylindre géant\nlocal rayon = 100\n\nwhile rayon > 10 do\n  task.wait(10) -- toutes les 10 secondes\n  rayon = rayon - 10\n  zone.Size = Vector3.new(rayon*2, 50, rayon*2)\n  zone.Position = Vector3.new(0, 25, 0)\n  -- + dégâts à ceux qui restent dehors\nend',
b2:'<p>Toutes les 10 secondes, la zone <mark>perd 10 studs de rayon</mark> — les joueurs sont forcés de se rapprocher… et de s\u2019affronter.</p>'},
{t:'Collecter les objets au sol',b:'<p>Des armes et bonus apparaissent aléatoirement :</p>',
code:'local objets = {"Epee", "Bouclier", "Potion"}\n\nwhile true do\n  task.wait(3)\n  local objet = Instance.new("Part")\n  objet.Name = objets[math.random(1, #objets)]\n  objet.Position = Vector3.new(\n    math.random(-50, 50), 2, math.random(-50, 50))\n  objet.Parent = workspace\nend',
b2:'<p><mark>math.random(1, #objets)</mark> choisit un objet au hasard. La rareté des meilleurs items crée la course au loot.</p>'},
{t:'Vie, dégâts, éliminations',b:'<p>Comme au combat : chaque joueur a un Humanoid. Toucher avec une arme = <mark>TakeDamage</mark>. Quand il ne reste <b>qu\u2019un joueur vivant</b> :</p>',
code:'local Players = game:GetService("Players")\n\nwhile true do\n  local vivants = 0\n  for _, p in pairs(Players:GetPlayers()) do\n    if p.Character and p.Character.Humanoid.Health > 0 then\n      vivants = vivants + 1\n    end\n  end\n  \n  if vivants <= 1 and #Players:GetPlayers() > 1 then\n    -- fin de partie, écran de victoire\n    break\n  end\n  task.wait(1)\nend'},
{t:'La boucle de partie',b:'<p>Une manche se termine → <mark>téléportation au lobby</mark> → décompte de 10 secondes → nouvelle manche avec arène régénérée. Cette <b>boucle de parties</b> (round-based) est ce qui rend le jeu infini.</p>',
say:'5 minutes par manche : assez pour s\u2019attacher, trop court pour se lasser. Le rythme parfait de la survie .io.'},
{t:'Polish et progression',b:'<ul class="dash"><li><b>Écran « TOP 1 — VICTOIRE !</b> » avec effets.</li><li><mark>Skins déblocables</mark> avec les victoires (DataStore).</li><li>Sons de zone, sons d\u2019élimination — l\u2019audio porte la tension.</li></ul>',
challenge:'Défi : fais apparaître des « orbes de soin » toutes les 30 secondes — Touched = +25 Health !'}
],
exos:[
{type:'fill',q:'Choisis un objet au hasard :',code:'objets[‹math.random›(1, #objets)]',extra:['math.floor','table.find']},
{type:'mcq',q:'Comment savoir qu\u2019une partie est finie ?',opts:['Après 60 secondes fixes','Quand il reste 1 joueur vivant','Quand la zone disparaît','Chaque mort'],a:1},
{type:'order',q:'Ordonne la construction d\u2019un survival .io :',items:['Créer l\u2019arène','Programmer la zone qui rétrécit','Faire apparaître les objets','Gérer vie et éliminations','Boucle de parties (lobby → manche)']},
{type:'tf',q:'La boucle round-based (lobby → manche → lobby) rend le jeu rejouable à l\u2019infini.',a:true}
]},

{id:'story',gt:'story',pnum:'M',title:'Masterclass Story game — narration et émotion',dur:'45 MIN',lvl:'MASTERCLASS',
obj:'Une aventure narrative : chapitres, dialogues, événements scriptés, badges.',
kintro:'<b>Story game</b> (Break In, Camping) : le genre de l\u2019émotion. Pas de score — une histoire qui se joue à plusieurs, avec des choix et des rebondissements.',
steps:[
{t:'La structure : chapitres et moments',b:'<p>Écris ton histoire <mark>en chapitres numérotés</mark> : Introduction → Moment calme → Mystère → Crise → Choix final → Épilogue. Chaque chapitre = une séquence scriptée que les joueurs vivent ensemble.</p>',
tip:'Un story game sans écrit préalable est un story game incohérent. Écris l\u2019histoire AVANT d\u2019ouvrir Studio.'},
{t:'Les dialogues — LocalScript à l\u2019écran',b:'<p>Le cœur du genre : des boîtes de dialogue qui s\u2019affichent avec le nom du personnage :</p>',
code:'-- LocalScript dans StarterGui\nlocal dialogue = script.Parent\nlocal texte = dialogue.TextLabel\n\nfunction dire(nom, phrase)\n  dialogue:WaitForChild("Nom").Text = nom\n  texte.Text = phrase\n  dialogue.Visible = true\n  task.wait(3)\n  dialogue.Visible = false\nend',
b2:'<p>Le serveur déclenche les dialogues via <mark>RemoteEvent:FireClient</mark> — chaque joueur voit la même scène au même moment.</p>'},
{t:'Événements scriptés — le monde réagit à l\u2019histoire',b:'<p>Chapitre 2 : la lumière s\u2019éteint. Chapitre 4 : le sol tremble. <b>Le monde devient un acteur</b> :</p>',
code:'-- Le noir tombe (événement du chapitre)\nlocal Lighting = game:GetService("Lighting")\n\nRemoteEvent.OnServerEvent:Connect(function()\n  Lighting.Brightness = 0\n  Lighting.ClockTime = 0\n  sonMenace:Play()\n  task.wait(5)\n  -- PNJ : "Qu\u2019est-ce que c\u2019était ?!"\nend)'},
{t:'Les choix qui comptent',b:'<p>Le climax : le joueur choisit. Deux boutons — <mark>deux branches</mark> :</p>',
code:'if choix == "sauver" then\n  -- branche A : le héros sauve l\u2019ami\n  epilogueHeureux()\nelse\n  -- branche B : il part seul\n  epilogueTriste()\nend',
b2:'<p>Un seul vrai choix bien écrit vaut mieux que dix faux choix. <mark>Le joueur doit hésiter</mark> — c\u2019est là que l\u2019émotion naît.</p>',
say:'Le meilleur story game de Roblox ne dure qu\u2019une quinzaine de minutes. C\u2019est court, et c\u2019est parfait : l\u2019émotion n\u2019a pas besoin d\u2019être longue.'},
{t:'Checkpoints de chapitre',b:'<p>Comme un obby : si le joueur meurt au chapitre 3, il <mark>réapparaît au début du chapitre 3</mark> — pas au départ de l\u2019histoire. Respect du temps du joueur.</p>'},
{t:'Badges et re-valeur',b:'<p>Un badge par fin débloquée (« Fin A — Le Sauveur », « Fin B — Le Solitaire ») : <mark>les badges donnent une raison de rejouer</mark> pour voir l\u2019autre fin. Ajoute un secret caché pour les explorateurs.</p>',
challenge:'Défi : écris les 5 premières lignes de dialogue de TON histoire — maintenant, avant d\u2019écrire la moindre ligne de code !'}
],
exos:[
{type:'mcq',q:'Quand faut-il écrire l\u2019histoire d\u2019un story game ?',opts:['Après avoir construit le monde','Avant d\u2019ouvrir Studio','Pendant le développement','Ça n\u2019a pas d\u2019importance'],a:1},
{type:'fill',q:'Affiche la boîte de dialogue :',code:'dialogue.‹Visible› = true',extra:['Active','Show']},
{type:'order',q:'Ordonne la construction d\u2019un story game :',items:['Écrire l\u2019histoire en chapitres','Programmer les dialogues (LocalScript)','Scripter les événements du monde','Ajouter les choix et les branches','Badges de fins et secrets']},
{type:'tf',q:'Un seul choix bien écrit vaut mieux que dix choix insignifiants.',a:true}
]},

{id:'rpg',gt:'rpg',pnum:'M',title:'Masterclass RPG — quêtes, inventaire et progression',dur:'50 MIN',lvl:'MASTERCLASS',
obj:'Construire le cœur d’un RPG : quêtes fiables, récompenses, niveaux et sauvegarde.',
kintro:'<b>Un RPG Roblox</b> ne se résume pas à un monde fantastique : les joueurs reviennent pour une progression claire. Tu vas construire le système qui relie quêtes, objets, expérience et sauvegarde, en gardant les récompenses sous contrôle du serveur.',
steps:[
{t:'La boucle de progression RPG',b:'<p>Une boucle RPG réussie donne toujours une prochaine étape : <b>accepter une quête → accomplir un objectif → réclamer une récompense → devenir plus fort</b>. Chaque étape doit être visible et compréhensible.</p><ul class="dash"><li>Commence par une seule quête, un seul objet et une seule récompense.</li><li>Affiche l’objectif et la progression dans l’interface.</li><li>Teste le plaisir de la boucle avant d’ajouter des dizaines de contenus.</li></ul>',tip:'Écris la boucle sur papier avant de construire la carte : le monde doit servir les objectifs du joueur.'},
{t:'Les états d’une quête',b:'<p>Une quête ne doit pas pouvoir être réclamée plusieurs fois. Modélise son cycle avec des états explicites : <mark>Locked → Available → Active → ReadyToClaim → Completed</mark>.</p><p>Quand l’objectif est atteint, passe à <b>ReadyToClaim</b>. Au moment de réclamer, le serveur vérifie l’état, verse la récompense et passe à <b>Completed</b>.</p>',code:'local questState = "Active"\nlocal progress = 0\nlocal goal = 5\n\nif questState == "Active" then\n  progress += 1\n  if progress >= goal then\n    questState = "ReadyToClaim"\n  end\nend',codeType:'Script',location:'ServerScriptService',result:'La quête devient réclamable une fois les cinq objectifs confirmés par le serveur.',tip:'N’utilise pas un simple booléen « fait » : les états permettent de distinguer une quête disponible, en cours et réclamable.'},
{t:'Définir les quêtes dans un ModuleScript',b:'<p>Place les définitions partagées dans un <b>ModuleScript</b> de <code>ReplicatedStorage</code>. Le serveur les utilise pour valider les objectifs ; l’interface peut lire les titres et descriptions.</p>',code:'return {\n  SlimeHunt = {\n    title = "Chasse aux slimes",\n    goal = 5,\n    rewardXP = 100,\n    rewardItem = "Potion",\n  },\n}',codeType:'ModuleScript',location:'ReplicatedStorage/QuestDefinitions',result:'Le ModuleScript retourne une table de quêtes consultable par son identifiant.',b2:'<p>Garde les valeurs de récompense définies par ton jeu. Le client ne doit jamais pouvoir choisir lui-même combien d’XP ou d’objets il reçoit.</p>'},
{t:'Valider les objectifs côté serveur',b:'<p>Le client peut demander à réclamer une quête via un <b>RemoteEvent</b>, mais seul un script serveur décide si elle est terminée et accorde la récompense. Vérifie aussi que la quête existe et qu’elle est encore réclamable.</p>',code:'claimQuest.OnServerEvent:Connect(function(player, questId)\n  local quest = quests[questId]\n  local data = playerData[player]\n  if not quest or not data then return end\n  if data.quests[questId] ~= "ReadyToClaim" then return end\n\n  data.xp += quest.rewardXP\n  if quest.rewardItem then\n    data.inventory = data.inventory or {}\n    data.inventory[quest.rewardItem] = (data.inventory[quest.rewardItem] or 0) + 1\n  end\n  data.quests[questId] = "Completed"\nend)',codeType:'Script',location:'ServerScriptService',result:'Seul un état serveur valide peut déclencher la récompense et clôturer la quête.',tip:'Toute donnée envoyée par le client est une demande, jamais une preuve. Vérifie l’objectif et l’état à partir des données serveur.'},
{t:'Inventaire, XP et niveaux',b:'<p>Stocke l’inventaire sous forme de compteurs par identifiant d’objet et ajoute l’XP au profil du joueur. Un niveau calculé depuis l’XP évite de sauvegarder deux valeurs qui pourraient se contredire.</p>',code:'local function niveauPour(xp)\n  return math.floor(xp / 100) + 1\nend\n\nlocal function ajouterObjet(data, itemId)\n  data.inventory[itemId] = (data.inventory[itemId] or 0) + 1\nend',codeType:'ModuleScript',location:'ServerScriptService/PlayerData',result:'Le niveau est dérivé de l’XP et chaque objet s’accumule dans son compteur d’inventaire.',b2:'<p>À la réclamation d’une quête, donne l’XP <b>et</b> l’objet une seule fois. Un même identifiant d’objet, comme <code>"Potion"</code>, garde le code de l’inventaire simple.</p>',challenge:'Ajoute une récompense de quête qui débloque un objet, puis décide à quel niveau le joueur peut l’utiliser.'},
{t:'Sauvegarder sans perdre la progression',b:'<p>Utilise <b>DataStoreService</b> depuis le serveur. Charge le profil à l’arrivée du joueur, sauvegarde à son départ et prévois aussi une sauvegarde périodique. Encadre les appels réseau avec <code>pcall</code> et traite les échecs au lieu de supposer que chaque sauvegarde réussit.</p>',code:'local ok, err = pcall(function()\n  PlayerStore:UpdateAsync(tostring(player.UserId), function(old)\n    old = old or {}\n    old.xp = data.xp\n    old.inventory = data.inventory\n    old.quests = data.quests\n    return old\n  end)\nend)\n\nif not ok then\n  warn("Sauvegarde RPG échouée :", err)\nend',codeType:'Script',location:'ServerScriptService',result:'La sauvegarde est tentée côté serveur et l’échec est visible dans la sortie Studio.',b2:'<p>En production, copie les tables avant de les envoyer au DataStore et évite les écritures trop fréquentes. Teste les sauvegardes dans une version publiée avec l’accès Studio configuré.</p>'}
],
exos:[
{type:'mcq',q:'Qui doit vérifier qu’une quête est terminée et accorder son XP ?',opts:['Le LocalScript du joueur','Le serveur Roblox','Le texte de l’interface','Le joueur en choisissant sa récompense'],a:1,why:'Le serveur contrôle l’état de quête et les récompenses ; les données du client ne sont pas fiables.'},
{type:'fill',q:'Passe la quête à son état réclamable quand l’objectif est atteint :',code:'questState = "‹ReadyToClaim›"',extra:['Completed'],why:'ReadyToClaim indique que les objectifs sont atteints, mais que la récompense n’a pas encore été réclamée.'},
{type:'order',q:'Ordonne le cycle de récompense d’une quête :',items:['Le serveur vérifie que la quête est ReadyToClaim','Le serveur ajoute l’XP et les objets','Le serveur marque la quête Completed','Le profil mis à jour est sauvegardé'],why:'Valide l’état avant de payer, puis marque la quête comme terminée pour empêcher les récompenses répétées.'},
{type:'tf',q:'Un RemoteEvent peut demander une récompense, mais le client ne doit pas décider lui-même du montant d’XP.',a:true,why:'Le serveur doit choisir la récompense à partir de la définition de quête et vérifier l’état du joueur.'}
]}
];

/* ============================================================
   LES 11 TYPES — mapping corrigé, URLs exactes
   ============================================================ */
const GAME_TYPES=[
{id:'obby',name:'Obby',tag:'PARCOURS D\u2019OBSTACLES',lesson:'obby',lvl:'IDÉAL POUR DÉBUTER',
desc:'Sauter, éviter les pièges, atteindre l\u2019arrivée. LA porte d\u2019entrée des créateurs — et le projet le plus complet pour tout apprendre.',
skills:[['Touched','détecter chaque contact'],['Health','la kill brick qui élimine'],['RespawnLocation','le checkpoint'],['leaderstats','le compteur d\u2019étapes']],
img:'./images%20pour%20bloxforge/Salto%20%C3%A9pico%20en%20el%20obby%20celestial.png'},
{id:'simu',name:'Simulator',tag:'COLLECTE · PROGRESSION',lesson:'simu',lvl:'TRÈS POPULAIRE',
desc:'Collecter, vendre, améliorer, recommencer plus fort. La boucle de progression infinie qui fait revenir les joueurs chaque jour.',
skills:[['Variables','compteurs et multiplicateurs'],['Touched','zones de collecte'],['if','la boutique'],['DataStore','la sauvegarde']],
img:'./images%20pour%20bloxforge/Avatar%20Roblox%20celebrando%20entre%20mascotas%20y%20tesoros.png'},
{id:'tycoon',name:'Tycoon',tag:'GESTION · CONSTRUCTION',lesson:'tycoon',lvl:'GRAND CLASSIQUE',
desc:'Démarrer avec rien, acheter des machines, bâtir un empire qui produit tout seul. La satisfaction de voir sa base grandir.',
skills:[['while true do','le dropper automatique'],['Instance.new','créer les billets'],['if','les boutons d\u2019achat'],['Models','organiser le plot']],
img:'./images%20pour%20bloxforge/H%C3%A9roe%20del%20dinero%20en%20la%20f%C3%A1brica.png'},
{id:'combat',name:'Combat / Battlegrounds',tag:'ACTION · DUELS',lesson:'combat',lvl:'POPULAIRE',
desc:'Combattre avec des coups spéciaux et des combos. Les jeux de combat inspirés des animes cartonnent sur Roblox.',
skills:[['TakeDamage','infliger des dégâts'],['Tools','l\u2019arme tenue en main'],['Cooldowns','le rythme des coups'],['Animations','le feeling']],
img:'./images%20pour%20bloxforge/Avatar%20Roblox%20con%20energ%C3%ADa%20el%C3%A9ctrica%20en%20la%20arena.png'},
{id:'rp',name:'Roleplay / Ville',tag:'VIE SOCIALE · HABITATION',lesson:'rp',lvl:'COMMUNAUTAIRE',
desc:'Habiter une maison, travailler, rencontrer les autres. Les villes (Brookhaven) attirent des millions de joueurs.',
skills:[['Touched','portes et interactions'],['ObjectValue','la propriété'],['VehicleSeat','les véhicules'],['DataStore','maison et métier']],
img:'./images%20pour%20bloxforge/Avatar%20saludando%20en%20un%20vecindario%20colorido.png'},
{id:'horror',name:'Horreur',tag:'PEUR · IMMERSION',lesson:'horror',lvl:'AMBIANCE',
desc:'Un couloir sombre, une lampe torche, quelque chose qui traque. Doors et Rainbow Friends dominent le genre.',
skills:[['Lighting','l\u2019obscurité contrôlée'],['SpotLight','la lampe torche'],['Pathfinding','le monstre qui traque'],['Sons','l\u2019angoisse']],
img:'./images%20pour%20bloxforge/Pasillo%20nocturno_%20linterna%20entre%20sombras.png'},
{id:'td',name:'Tower Defense',tag:'STRATÉGIE · VAGUES',lesson:'td',lvl:'STRATÉGIE',
desc:'Placer des tours, survivre à des vagues de plus en plus féroces. Un genre stratégique extrêmement suivi.',
skills:[['MoveTo','les ennemis suivent le chemin'],['Magnitude','le ciblage des tours'],['Boucles','les vagues'],['leaderstats','l\u2019économie']],
img:'./images%20pour%20bloxforge/Roblox%20Tower%20Defense%20Showdown.png'},
{id:'racing',name:'Racing',tag:'VITESSE · CHRONO',lesson:'racing',lvl:'COMPÉTITION',
desc:'Des circuits, des voitures personnalisables et un chrono au centième. La compétition amicale à l\u2019état pur.',
skills:[['VehicleSeat','la voiture qui roule'],['Checkpoints','l\u2019anti-triche'],['os.clock()','le chrono'],['leaderstats','le classement']],
img:'./images%20pour%20bloxforge/Piloto%20Roblox%20en%20carrera%20al%20atardecer.png'},
{id:'io',name:'Survival .io / Arène',tag:'SURVIE · DERNIER DEBOUT',lesson:'io',lvl:'TENSION',
desc:'Une zone qui rétrécit, des objets à ramasser, un seul survivant. Battle royale simplifié, tension maximale.',
skills:[['Boucles','la zone qui se resserre'],['math.random','le loot aléatoire'],['Health','éliminations'],['Round-based','la boucle de parties']],
img:'./images%20pour%20bloxforge/Blades%20of%20the%20Zombie%20Arena.png'},
{id:'story',name:'Plateforme / Story game',tag:'AVENTURE · NARRATION',lesson:'story',lvl:'CRÉATIF',
desc:'Une histoire guidée, des chapitres, des choix qui comptent. Break In et Camping ont fait vibrer des millions de joueurs.',
skills:[['LocalScript','les dialogues'],['RemoteEvent','les scènes synchronisées'],['if','les choix'],['Badges','les fins multiples']],
img:'./images%20pour%20bloxforge/Aventura%20al%20atardecer%20hacia%20el%20castillo.png'},
{id:'rpg',name:'RPG / Quêtes',tag:'QUÊTES · INVENTAIRE · PROGRESSION',lesson:'rpg',lvl:'AVENTURE',
desc:'Crée des quêtes à objectifs, des récompenses et une progression persistante avec XP, niveaux et inventaire.',
skills:[['Quest states','le cycle des missions'],['ModuleScript','les définitions de quête'],['RemoteEvent','les récompenses vérifiées'],['DataStore','la progression RPG']],
img:'./images%20pour%20bloxforge/Heroic%20Roblox%20Fantasy%20Castle%20Adventure.png'}
];

/* ============================================================
   COLORATION LUA
   ============================================================ */
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
const GT_COLORS={obby:['var(--blue)','var(--blue-bg)'],simu:['var(--green)','var(--green-bg)'],tycoon:['var(--amber)','#FAF3E3'],combat:['var(--red)','#FCEFEF'],rp:['#8B5A2B','#F7EFDC'],horror:['var(--ink)','#EDEAE1'],td:['#8F6BB5','#F0EAF8'],racing:['#D9A441','#FBF3E0'],io:['#2A8A8A','#E0F0F0'],story:['#C77B5A','#FAEFE8'],rpg:['#6D4CC3','#F0EBFA'],pre:['var(--blue)','var(--blue-bg)']};
const COURSE_META={
  obby:{difficulty:'Débutant',genre:'Aventure',prerequisite:'Aucun'},
  simu:{difficulty:'Débutant',genre:'Simulation',prerequisite:'Variables et conditions'},
  tycoon:{difficulty:'Intermédiaire',genre:'Construction',prerequisite:'Variables et scripts simples'},
  combat:{difficulty:'Intermédiaire',genre:'Action',prerequisite:'Événements et fonctions'},
  rp:{difficulty:'Intermédiaire',genre:'Social',prerequisite:'Objets et interactions'},
  horror:{difficulty:'Intermédiaire',genre:'Aventure',prerequisite:'Éclairage et événements'},
  td:{difficulty:'Avancé',genre:'Stratégie',prerequisite:'Boucles et fonctions'},
  racing:{difficulty:'Intermédiaire',genre:'Course',prerequisite:'Véhicules et événements'},
  io:{difficulty:'Avancé',genre:'Survie',prerequisite:'Santé et boucles de jeu'},
  story:{difficulty:'Intermédiaire',genre:'Aventure',prerequisite:'Événements et interface'},
  rpg:{difficulty:'Avancé',genre:'Aventure',prerequisite:'ModuleScripts et RemoteEvents'}
};
const LEARNING_PATHS=[
  {id:'first',title:'Parcours Premier jeu',desc:'Découvrir Studio, construire un premier jeu et le rendre jouable.',courses:['obby','story','rp']},
  {id:'scripting',title:'Parcours Scripting',desc:'Progresser des interactions aux systèmes de jeu pilotés par le code.',courses:['obby','simu','combat','rpg']},
  {id:'systems',title:'Parcours Systèmes avancés',desc:'Concevoir des boucles, des données et des mécaniques qui se combinent.',courses:['tycoon','td','io','rpg']}
];
const FINAL_PROJECTS={
  obby:{title:'Construire un parcours jouable',goal:'Un parcours avec checkpoints fiables, obstacles lisibles et une arrivée qui valide la partie.',milestones:['Construire un parcours en plusieurs zones avec un point de départ clair.','Ajouter des obstacles et vérifier les collisions.','Créer des checkpoints et tester la réapparition après une chute.','Ajouter une arrivée et tester tout le parcours du début à la fin.']},
  simu:{title:'Créer une boucle de simulator',goal:'Un joueur collecte une ressource, la vend puis améliore sa capacité pour recommencer.',milestones:['Créer une ressource et un compteur de collecte.','Ajouter une zone de vente et créditer les gains.','Créer une amélioration achetable avec validation du solde.','Tester la progression et sauvegarder les données essentielles.']},
  tycoon:{title:'Assembler un mini-tycoon',goal:'Un terrain évolue grâce aux achats et aux machines de production.',milestones:['Créer un terrain attribué à un joueur.','Ajouter un achat avec vérification du coût et du propriétaire.','Produire et collecter des revenus de manière contrôlée.','Tester plusieurs terrains et les réinitialisations de partie.']},
  combat:{title:'Prototyper un duel',goal:'Un duel avec une attaque, des dégâts validés et un temps de recharge.',milestones:['Créer une arène et définir les règles de réapparition.','Ajouter une arme ou compétence avec animation simple.','Valider côté serveur la cible, la portée et le cooldown.','Tester les dégâts à deux joueurs et empêcher les attaques répétées.']},
  rp:{title:'Créer un quartier roleplay',goal:'Un petit quartier avec maisons attribuables, interactions et rôles.',milestones:['Construire une rue avec des bâtiments faciles à repérer.','Créer une interaction de porte qui ne bloque pas les autres joueurs.','Attribuer une maison et vérifier son propriétaire côté serveur.','Tester les interactions à plusieurs et enregistrer la progression utile.']},
  horror:{title:'Mettre en scène une séquence d’horreur',goal:'Une séquence courte avec éclairage, lampe, indices sonores et menace lisible.',milestones:['Construire un trajet court avec une ligne de vue maîtrisée.','Régler l’éclairage et ajouter une lampe torche.','Synchroniser un indice sonore avec un événement du niveau.','Tester lisibilité, rythme et performance dans une partie complète.']},
  td:{title:'Défendre un chemin contre des vagues',goal:'Des ennemis suivent un chemin pendant que des tours les ciblent et dépensent des ressources.',milestones:['Construire un chemin balisé avec une base à défendre.','Faire apparaître une vague et guider les ennemis sur le parcours.','Placer une tour avec portée et cible clairement définies.','Tester les vagues, les récompenses et la fin de partie.']},
  racing:{title:'Créer une course chronométrée',goal:'Une course avec véhicule, checkpoints dans l’ordre et résultat affiché.',milestones:['Construire un circuit et définir la ligne de départ.','Ajouter un véhicule et vérifier les commandes.','Valider les checkpoints dans l’ordre pour chaque joueur.','Afficher le temps final et tester les raccourcis impossibles.']},
  io:{title:'Prototyper une arène de survie',goal:'Une partie en manches avec zone de jeu, ressources et condition de victoire.',milestones:['Construire une arène et définir ses limites jouables.','Gérer le démarrage et la fin de manche.','Ajouter des ressources avec apparition contrôlée.','Tester éliminations, dernier survivant et remise à zéro.']},
  story:{title:'Réaliser un chapitre interactif',goal:'Une courte histoire avec dialogue, événement de scène et choix significatif.',milestones:['Écrire un chapitre court avec un objectif compréhensible.','Afficher un dialogue piloté par l’interface.','Déclencher un événement de scène synchronisé.','Tester les choix, les checkpoints et la fin du chapitre.']},
  rpg:{title:'Bâtir une quête RPG persistante',goal:'Un NPC propose une quête, le serveur valide l’objectif et remet une récompense une seule fois.',milestones:['Définir une quête avec objectif, état et récompense dans un ModuleScript.','Créer une interaction NPC et afficher l’objectif en cours.','Valider l’objectif et la remise de récompense côté serveur.','Sauvegarder XP, inventaire et état de quête puis tester une reconnexion.']}
};

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
  const totalLess=LESSONS.length;
  const doneLess=state.done.length;
  const lastL=state.lastLesson&&state.lastLesson!=='pre'?L_by(state.lastLesson):null;

  const cards=GAME_TYPES.map(gt=>{
    const l=L_by(gt.lesson);
    const done=lessonDone(l)&&evalPassed(gt.id);
    const meta=COURSE_META[gt.id],completedMissions=l.exos.filter((_,i)=>exoDone(l,i)).length;
    const status=lessonDone(l)&&evalPassed(gt.id)?'completed':completedMissions||state.lastLesson===l.id?'inprogress':'notstarted';
    const acc=GT_COLORS[gt.id];
    return '<article class="gt card rv'+(done?' done-state':'')+'" data-open="'+gt.lesson+'" data-level="'+meta.difficulty+'" data-genre="'+meta.genre+'" data-minutes="'+parseInt(l.dur,10)+'" data-progress="'+status+'" tabindex="0" role="group" aria-label="'+gt.name+' — '+meta.difficulty+', '+meta.genre+'" style="--pc:'+acc[0]+';--pcb:'+acc[1]+'">'
    +'<div class="gt-vig">'
    +'<img src="'+gt.img+'" alt="'+gt.name+'" loading="lazy" onerror="this.style.display=\'none\'">'
    +'<span class="gt-lvl">'+gt.lvl+'</span>'
    +'</div>'
    +'<div class="gt-body">'
    +'<div class="gt-top"><span class="gt-name">'+gt.name+'</span><span class="gt-tag">'+gt.tag+'</span></div>'
    +'<div class="course-meta"><span>'+meta.difficulty+'</span><span>'+meta.genre+'</span><span>Prérequis : '+meta.prerequisite+'</span></div>'
    +'<p class="gt-desc">'+gt.desc+'</p>'
    +'<ul class="gt-sk">'+gt.skills.slice(0,3).map(s=>'<li><i>'+s[0]+'</i><span>'+s[1]+'</span></li>').join('')+'</ul>'
    +'<div class="course-progress" role="progressbar" aria-label="Progression des missions de '+gt.name+'" aria-valuemin="0" aria-valuemax="'+l.exos.length+'" aria-valuenow="'+completedMissions+'"><span style="width:'+(completedMissions/l.exos.length*100)+'%"></span></div>'
    +'<div class="gt-foot"><span class="gt-meta">'+(l.steps.length)+' étapes · <b>'+l.exos.length+' missions</b> · '+l.dur+(bestEval(gt.id)!=null?' · <b>'+bestEval(gt.id)+'%</b>':'')+'</span>'
    +'<button class="gt-go">'+(done?'Refaire':status==='inprogress'?'Continuer':'Suivre ce cours')+' <i data-lucide="'+(status==='inprogress'?'play':'arrow-right')+'"></i></button></div>'
    +'</div></article>';
  }).join('');
  const pathCards=LEARNING_PATHS.map(path=>'<article class="path-card card"><div class="lab">'+path.courses.length+' COURS · PARCOURS GUIDÉ</div><h3>'+path.title+'</h3><p>'+path.desc+'</p><ol>'+path.courses.map((id,i)=>'<li>'+String(i+1).padStart(2,'0')+' · '+GAME_TYPES.find(g=>g.id===id).name+'</li>').join('')+'</ol><button class="path-go btn btn-ghost" data-route="'+path.id+'">Voir ce parcours <i data-lucide="arrow-right"></i></button></article>').join('');
  const canCreateCourses=authenticatedUser&&authenticatedUser.role==='creator';
  const courseCards=customCourses.map(course=>'<article class="creator-card card">'
    +'<div class="creator-card-head"><span class="creator-label">'+(course.ownerId===authenticatedUser.id?'VOTRE FORMATION':'PAR '+esc(course.creatorName||'CRÉATEUR'))+'</span><span class="creator-price">'+(course.price===0?'GRATUIT':esc(new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(course.price)))+'</span></div>'
    +'<h3>'+esc(course.title)+'</h3><p>'+esc(course.description)+'</p>'
    +'<div class="creator-outline"><span class="lab">AU PROGRAMME · '+course.lessons.length+' ÉTAPES</span><ol>'+course.lessons.map(item=>'<li>'+esc(item)+'</li>').join('')+'</ol></div>'
    +(course.ownerId===authenticatedUser.id?'<div class="creator-actions"><button class="ex-reset" type="button" data-edit-course="'+escAttr(course.id)+'"><i data-lucide="pencil"></i>Modifier</button><button class="creator-delete" type="button" data-delete-course="'+escAttr(course.id)+'"><i data-lucide="trash-2"></i>Supprimer</button></div>':'')+'</article>').join('');
  const emptyCourses='<div class="creator-empty card"><div class="creator-empty-icon"><i data-lucide="book-open-check"></i></div><h3>'+(canCreateCourses?'Votre première formation commence ici.':'Aucune formation publiée pour le moment.')+'</h3><p>'+(canCreateCourses?'Ajoutez un titre, quelques étapes et choisissez si elle est gratuite ou payante.':'Revenez bientôt pour découvrir les cours créés par la communauté.')+'</p>'+(canCreateCourses?'<button class="btn btn-ghost" type="button" data-open-creator>Créer mon premier cours <i data-lucide="arrow-right"></i></button>':'')+'</div>';

  const v=elFromHTML('<div class="view">'
  +'<section class="hero" id="heroGhost"><div class="hero-in">'
  +'<span class="kick"><i></i>ACADÉMIE DE CRÉATION ROBLOX</span>'
  +'<h1 class="display">Quel jeu<br>veux-tu <em>créer</em> ?</h1>'
  +'<p class="hero-sub">Onze types de jeux parmi les plus joués de Roblox. Pour chacun : <b>une masterclass complète</b> — le code, les pièges, le polish. Progression <b>sauvegardée automatiquement</b>.</p>'
  +(lastL?'<button class="resume rv" data-open="'+lastL.id+'" data-resume="true"><i data-lucide="history"></i>REPRENDRE — '+lastL.title.toUpperCase()+'</button>':'')
  +'<div class="hero-cta">'
  +'<button class="btn btn-ghost" data-open="pre"><i data-lucide="compass"></i>Débutant ? Le préambule Studio — 5 min</button>'
  +'</div>'
  +'</div></section>'
  +'<section class="statband"><div class="wrap"><div class="statband-grid">'
  +'<div class="sbc card rv"><b>'+doneLess+'<span style="font-size:20px;color:var(--muted)">/'+totalLess+'</span></b><span>COURS TERMINÉS</span></div>'
  +'<div class="sbc card rv"><b>'+GAME_TYPES.filter(g=>evalPassed(g.id)).length+'<span style="font-size:20px;color:var(--muted)">/'+GAME_TYPES.length+'</span></b><span>ÉVALUATIONS RÉUSSIES</span></div>'
  +'<div class="sbc card rv"><b>'+state.xp+'</b><span>XP · RANG '+rankOf(state.xp)+'</span></div>'
  +'<div class="sbc card rv"><b>'+(doneLess===totalLess&&GAME_TYPES.every(g=>evalPassed(g.id))?'DIPLÔMÉ':'EN COURS')+'</b><span>STATUT DU CURSUS</span></div>'
  +'</div></div></section>'
  +'<section class="creator-section"><div class="wrap"><div class="creator-heading"><div><div class="lab">'+(canCreateCourses?'VOTRE ESPACE CRÉATEUR':'DÉCOUVRIR')+'</div><h2 class="display">'+(canCreateCourses?'Mes formations.':'Formations de la communauté.')+'</h2><p>'+(canCreateCourses?'Créez vos propres cours, organisez le programme et fixez un prix.':'Parcourez les formations proposées par les créateurs BLOXFORGE.')+'</p></div>'+(canCreateCourses?'<button class="btn btn-black" id="newCourseBtn" type="button"><i data-lucide="plus"></i>Créer une formation</button>':'')+'</div>'
  +(canCreateCourses?'<div class="creator-form-wrap card" id="courseFormWrap" hidden><form id="courseForm" class="creator-form">'
  +'<input id="courseId" type="hidden"><div class="creator-form-title"><div><div class="lab">NOUVELLE FORMATION</div><h3 id="courseFormTitle">Créer votre cours</h3></div><button class="creator-close" id="cancelCourseBtn" type="button" aria-label="Fermer le formulaire">×</button></div>'
  +'<label for="courseTitle">Nom du cours<input id="courseTitle" name="title" type="text" maxlength="80" placeholder="Ex. Créer son premier obby" required></label>'
  +'<label for="courseDescription">Description<textarea id="courseDescription" name="description" maxlength="360" rows="3" placeholder="À qui s’adresse ce cours et qu’allez-vous apprendre ?" required></textarea></label>'
  +'<div class="creator-form-row"><label for="coursePrice">Prix en euros<input id="coursePrice" name="price" type="number" min="0" max="10000" step="0.01" value="0" required><span class="creator-help">0 € = formation gratuite.</span></label>'
  +'<label for="courseLessons">Programme du cours<textarea id="courseLessons" name="lessons" rows="5" placeholder="Une étape par ligne&#10;Ex. Découvrir Roblox Studio&#10;Créer son premier niveau" required></textarea><span class="creator-help">Ajoutez une étape par ligne (maximum 30).</span></label></div>'
  +'<p class="creator-notice"><i data-lucide="info"></i>La formation et son prix sont enregistrés sur le serveur local. Le paiement en ligne n’est pas activé.</p>'
  +'<div class="creator-form-actions"><button class="ex-reset" id="cancelCourseBtnBottom" type="button">Annuler</button><button class="btn btn-black" type="submit"><i data-lucide="save"></i>Enregistrer la formation</button></div></form></div>':'')
  +(customCourses.length?'<div class="creator-grid">'+courseCards+'</div>':emptyCourses)
  +'</div></section>'
  +'<section class="types" id="typesSec"><div class="wrap">'
  +'<section class="pathways"><div class="sec-head rv"><div><div class="lab">PROGRESSION GUIDÉE</div><h2>Choisis ton parcours.</h2></div><p>Tu peux suivre un parcours conseillé ou choisir librement n’importe quel cours.</p></div>'
  +'<div class="path-grid">'+pathCards+'</div>'
  +'<div class="diagnostic"><div><h3>Tu ne sais pas par où commencer ?</h3><p>Quelques réponses suffisent pour te proposer un parcours adapté.</p></div>'
  +'<div class="diagnostic-field"><label for="diagStudio">Ton expérience de Studio</label><select id="diagStudio"><option value="">Choisir…</option><option value="new">Je débute</option><option value="some">J’ai déjà créé un projet</option><option value="confident">Je connais bien Studio</option></select></div>'
  +'<div class="diagnostic-field"><label for="diagLua">Ton expérience de Lua / Luau</label><select id="diagLua"><option value="">Choisir…</option><option value="new">Je débute</option><option value="some">Je connais quelques bases</option><option value="confident">Je sais déjà coder</option></select></div>'
  +'<button class="btn btn-black" id="diagnosePath">Me conseiller</button><p class="diagnostic-result" id="diagnosticResult" aria-live="polite"></p></div></section>'
  +'<div class="sec-head rv"><div><div class="lab">LES '+GAME_TYPES.length+' MASTERCLASS</div><h2>Choisis ton jeu.</h2></div>'
  +'<p style="color:var(--muted);max-width:36ch;font-size:14.5px">Chaque masterclass contient tout : théorie, scripts commentés ligne par ligne, pièges à éviter, défis et évaluation finale.</p></div>'
  +'<div class="catalog-tools"><label for="courseSearch">Rechercher un cours</label><input id="courseSearch" type="search" placeholder="Ex. RPG, Obby…" autocomplete="off">'
  +'<label for="filterGenre">Genre</label><select id="filterGenre"><option value="">Tous les genres</option>'+[...new Set(Object.values(COURSE_META).map(m=>m.genre))].sort().map(v=>'<option>'+v+'</option>').join('')+'</select>'
  +'<label for="filterLevel">Difficulté</label><select id="filterLevel"><option value="">Toutes</option><option>Débutant</option><option>Intermédiaire</option><option>Avancé</option></select>'
  +'<label for="filterDuration">Durée</label><select id="filterDuration"><option value="">Toutes</option><option value="short">Moins de 30 min</option><option value="medium">30 à 45 min</option><option value="long">Plus de 45 min</option></select>'
  +'<label for="filterProgress">Progression</label><select id="filterProgress"><option value="">Toutes</option><option value="notstarted">À commencer</option><option value="inprogress">En cours</option><option value="completed">Terminées</option></select>'
  +'<button class="ex-reset" id="clearFilters">Effacer les filtres</button><span id="catalogCount" aria-live="polite"></span></div>'
  +'<div class="gt-grid">'+cards+'</div>'
  +'<p class="empty-catalog" id="emptyCatalog" hidden>Aucun cours ne correspond à ces filtres.</p>'
  +'</div></section>'
  +'<div class="wrap"><footer><span><b>BLOXFORGE</b> — apprendre en construisant, avec Kubo</span><span>'+GAME_TYPES.length+' MASTERCLASS · PROGRESSION SAUVEGARDÉE LOCALEMENT</span></footer></div>'
  +'</div>');

  setView(v);
  setupCourseCreator(v);
  setupCatalog(v);
  ghostKubos(v.querySelector('#heroGhost'),8,.05);
  ghostKubos(v.querySelector('#typesSec'),4,.028);
  const w=document.createElement('div');
  w.className='gk-walk';
  w.innerHTML=kuboSVG('happy');
  v.querySelector('#heroGhost').appendChild(w);
  setTimeout(()=>{
    if(state.xp===0)kuboSpeak('Bienvenue ! '+GAME_TYPES.length+' types de jeux t\u2019attendent — <b>choisis celui qui te fait rêver</b>. Débutant total ? Le préambule Studio est fait pour toi.','happy',7500);
    else if(lastL)kuboSpeak('Content de te revoir ! Dernier cours : <b>'+lastL.title+'</b>. Reprends ou change de voie !','happy');
    else kuboSpeak('Content de te revoir ! '+GAME_TYPES.filter(g=>evalPassed(g.id)).length+' masterclass validée(s) sur '+GAME_TYPES.length+'.','happy');
  },900);
  if(storageWarning){toast(storageWarning,'triangle-alert');storageWarning='';}
}

function setupCourseCreator(v){
  const form=v.querySelector('#courseForm'),wrap=v.querySelector('#courseFormWrap');
  if(!form||!wrap)return;
  const titleInput=v.querySelector('#courseTitle');
  const refreshCourses=async()=>{const result=await BloxforgeAuth.listCourses();customCourses=result.courses;};
  const closeForm=()=>{
    form.reset();
    v.querySelector('#courseId').value='';
    v.querySelector('#courseFormTitle').textContent='Créer votre cours';
    wrap.hidden=true;
  };
  const openForm=course=>{
    wrap.hidden=false;
    if(course){
      v.querySelector('#courseId').value=course.id;
      titleInput.value=course.title;
      v.querySelector('#courseDescription').value=course.description;
      v.querySelector('#coursePrice').value=course.price;
      v.querySelector('#courseLessons').value=course.lessons.join('\n');
      v.querySelector('#courseFormTitle').textContent='Modifier votre formation';
    }else{
      form.reset();
      v.querySelector('#courseId').value='';
      v.querySelector('#coursePrice').value='0';
      v.querySelector('#courseFormTitle').textContent='Créer votre cours';
    }
    wrap.hidden=false;
    titleInput.focus();
    wrap.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
  };
  v.querySelector('#newCourseBtn').addEventListener('click',()=>openForm(null));
  v.addEventListener('click',async e=>{
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
    const fields={title:title.slice(0,80),description:description.slice(0,360),price:Math.round(price*100)/100,lessons:lessons.map(item=>item.slice(0,120))};
    try{
      if(id)await BloxforgeAuth.updateCourse(id,fields);
      else await BloxforgeAuth.createCourse(fields);
      await refreshCourses();buildHome();toast(id?'Formation mise à jour.':'Formation créée.','check');
    }catch(error){toast(error.message||'Impossible d’enregistrer cette formation.','triangle-alert');}
  });
}

function setupCatalog(v){
  const cards=[...v.querySelectorAll('.gt')],inputs=['#courseSearch','#filterGenre','#filterLevel','#filterDuration','#filterProgress'].map(s=>v.querySelector(s));
  const update=()=>{
    const [search,genre,level,duration,progress]=inputs.map(input=>input.value.trim().toLocaleLowerCase());
    let visible=0;
    cards.forEach(card=>{
      const matches=(!search||card.innerText.toLocaleLowerCase().includes(search))&&
        (!genre||card.dataset.genre.toLocaleLowerCase()===genre)&&
        (!level||card.dataset.level.toLocaleLowerCase()===level)&&
        (!progress||card.dataset.progress===progress)&&
        (!duration||(duration==='short'?+card.dataset.minutes<30:duration==='medium'?+card.dataset.minutes>=30&&+card.dataset.minutes<=45:+card.dataset.minutes>45));
      card.hidden=!matches;if(matches)visible++;
    });
    v.querySelector('#catalogCount').textContent=visible+' / '+cards.length+' cours';
    v.querySelector('#emptyCatalog').hidden=visible!==0;
  };
  inputs.forEach(input=>{input.addEventListener('input',update);input.addEventListener('change',update);});
  v.querySelector('#clearFilters').addEventListener('click',()=>{inputs.forEach(input=>input.value='');update();});
  const activateRoute=id=>{
    const path=LEARNING_PATHS.find(item=>item.id===id);if(!path)return;
    cards.forEach(card=>card.classList.toggle('route-match',path.courses.includes(GAME_TYPES.find(game=>game.lesson===card.dataset.open).id)));
    v.querySelectorAll('.path-card').forEach(card=>card.classList.toggle('route-selected',card.querySelector('[data-route="'+id+'"]')!=null));
    v.querySelectorAll('[data-route]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.route===id)));
    v.querySelector('#typesSec').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    toast('Parcours « '+path.title+' » repéré dans le catalogue','route');
  };
  v.querySelectorAll('[data-route]').forEach(button=>button.addEventListener('click',()=>activateRoute(button.dataset.route)));
  v.querySelector('#diagnosePath').addEventListener('click',()=>{
    const studio=v.querySelector('#diagStudio').value,lua=v.querySelector('#diagLua').value,result=v.querySelector('#diagnosticResult');
    if(!studio||!lua){result.textContent='Choisis une réponse pour les deux questions afin de recevoir une recommandation.';return;}
    const path=studio==='new'&&lua==='new'?LEARNING_PATHS[0]:studio==='confident'&&lua==='confident'?LEARNING_PATHS[2]:LEARNING_PATHS[1];
    const emphasis=document.createElement('b');emphasis.textContent=path.title;
    result.replaceChildren('Parcours conseillé : ',emphasis,' — '+path.desc);
    activateRoute(path.id);
  });
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
    +'<label for="authPassword">Mot de passe<input id="authPassword" name="password" type="password" minlength="'+(mode==='register'?'10':'1')+'" maxlength="128" autocomplete="'+(mode==='register'?'new-password':'current-password')+'" required>'+(mode==='register'?'<span class="creator-help">10 caractères minimum pour ce prototype.</span>':'')+'</label>'
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
    +'<label for="whyBloxforge">Pourquoi as-tu choisi BLOXFORGE ?<textarea id="whyBloxforge" name="whyBloxforge" rows="3" minlength="3" maxlength="500" placeholder="Dis-nous ce que tu aimerais apprendre ou créer…" required></textarea></label>'
    +'<fieldset style="border:0;display:grid;gap:8px"><legend style="font-size:12px;font-weight:700;color:var(--ink);margin-bottom:5px">Tu veux utiliser BLOXFORGE comme…</legend>'
    +'<div class="auth-choices"><label class="auth-choice"><input type="radio" name="role" value="consumer" required><span><b>Consommateur</b><small>Découvrir et suivre des formations.</small></span></label>'
    +'<label class="auth-choice"><input type="radio" name="role" value="creator"><span><b>Créateur</b><small>Créer et gérer tes propres formations.</small></span></label></div></fieldset>'
    +'<p class="auth-permanent-note"><b>À savoir :</b> tu pourras passer de consommateur à créateur dans Configuration. Ce changement est définitif : un compte créateur ne peut pas redevenir consommateur.</p>'
    +'<button class="btn btn-black" type="submit">Enregistrer et entrer <i data-lucide="arrow-right"></i></button></form>'
    +'<p class="auth-local-note">Prototype local de test : n’indique pas de renseignements confidentiels.</p>'
    +'</div></section>';
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
  authRoot.querySelector('#settingsDiscovery').textContent='Découverte : '+(DISCOVERY_LABELS[user.onboarding.discovery]||user.onboarding.discovery);
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
