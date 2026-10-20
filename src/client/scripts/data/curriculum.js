'use strict';

// Archived built-in curriculum. Not loaded by the academy by default.
window.BLOXFORGE_ARCHIVED_CURRICULUM = {
  LESSONS: [
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
],

  GAME_TYPES: [
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
],

  GT_COLORS: {obby:['var(--blue)','var(--blue-bg)'],simu:['var(--green)','var(--green-bg)'],tycoon:['var(--amber)','#FAF3E3'],combat:['var(--red)','#FCEFEF'],rp:['#8B5A2B','#F7EFDC'],horror:['var(--ink)','#EDEAE1'],td:['#8F6BB5','#F0EAF8'],racing:['#D9A441','#FBF3E0'],io:['#2A8A8A','#E0F0F0'],story:['#C77B5A','#FAEFE8'],rpg:['#6D4CC3','#F0EBFA'],pre:['var(--blue)','var(--blue-bg)']},

  COURSE_META: {
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
},

  LEARNING_PATHS: [
  {id:'first',title:'Parcours Premier jeu',desc:'Découvrir Studio, construire un premier jeu et le rendre jouable.',courses:['obby','story','rp']},
  {id:'scripting',title:'Parcours Scripting',desc:'Progresser des interactions aux systèmes de jeu pilotés par le code.',courses:['obby','simu','combat','rpg']},
  {id:'systems',title:'Parcours Systèmes avancés',desc:'Concevoir des boucles, des données et des mécaniques qui se combinent.',courses:['tycoon','td','io','rpg']}
],

  FINAL_PROJECTS: {
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
}
};
