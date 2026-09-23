/* ============================================================================
   Konstrio Learning — Avatar 3D « compagnon d'apprentissage »
   ----------------------------------------------------------------------------
   Moteur d'avatar mascotte procédural (Three.js r160, via l'importmap présente
   sur la page hôte, sinon fichier LOCAL /learning/vendor/three.module.js).
   AUCUN asset externe : géométrie 100 % procédurale, textures générées au canvas.
   Léger (petit canvas, perf mobile), respecte prefers-reduced-motion.

   API publique unique : window.KonstrioAvatar
     .OPTIONS                  catalogue des réglages (pour construire l'UI)
     .DEFAULT                  preset par défaut
     .get()                    -> config courante (clone)
     .set(cfg)                 -> fusionne + re-rend les avatars montés (mémoire)
     .save([cfg])              -> persiste dans localStorage 'konstrio-avatar'
     .reset()                  -> revient au preset par défaut
     .mount(container, opts)   -> instance { setConfig, play, celebrate, say, dispose }
     .celebrate()              -> fête sur tous les avatars montés
     .say(text[, ms])          -> bulle sur tous les avatars montés
     .play(name)               -> anime tous les avatars montés
     // — Déblocables (dérivés de window.KonstrioAch) —
     .ach()                    -> lit KonstrioAch.get() (ou un état neutre)
     .meetsReq(req[, ach])     -> true si la condition de déblocage est remplie
     .reqText(req)             -> libellé « Débloque au niveau N » / « trophée … »
     .reqProgress(req[, ach])  -> { have, need, ratio, unlocked }
     .isUnlocked(cat, id[,ach])-> item d'une catégorie débloqué ?
     .enforce(cfg[, ach])      -> ramène au défaut tout item verrouillé (anti-triche)

   Ce n'est PAS un hook de debug : c'est l'API produit légitime du compagnon.
   ============================================================================ */
(function () {
  'use strict';

  var LS_KEY = 'konstrio-avatar';
  var REDUCED = false;
  try { REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ---- Chargement paresseux de Three.js -------------------------------------
     On tente d'abord le specifier 'three' (importmap de la page) ; sinon on
     retombe sur le fichier LOCAL /learning/vendor/three.module.js — servi en
     'self', donc autorisé par la CSP des pages SSR du hub (qui bloque les CDN). */
  var THREE_URL = '/moteurs/vendor/three.module.js';
  var _threeP = null;
  function loadThree() {
    if (!_threeP) {
      _threeP = import(/* @vite-ignore */ 'three').catch(function () {
        return import(/* @vite-ignore */ THREE_URL);
      });
    }
    return _threeP;
  }

  /* ==========================================================================
   *  CATALOGUE DE PERSONNALISATION (+ conditions de déblocage `req`)
   *  req formes possibles : {level:N} {trophy:'id'} {cours:N} {stars:N}
   *                         {played:N} {xp:N}  — absent = toujours débloqué.
   *  ultimate:true = « cadeau ultime » (mis en avant dans l'UI).
   * ======================================================================== */
  var OPTIONS = {
    /* — 33 modèles, du starter au légendaire — */
    types: [
      { id:'robot',    label:'Robot',       emoji:'🤖', hint:'Un petit robot rigolo' },
      { id:'chat',     label:'Chaton',      emoji:'🐱', hint:'Tout doux, oreilles pointues' },
      { id:'blob',     label:'Blob',        emoji:'🫧', hint:'Une bulle toute douce' },
      { id:'lapin',    label:'Lapin',       emoji:'🐰', hint:'Grandes oreilles' },
      { id:'poussin',  label:'Poussin',     emoji:'🐤', hint:'Tout rond, tout jaune' },
      { id:'animal',   label:'Ourson',      emoji:'🐻', hint:'Un compagnon tout rond' },
      { id:'renard',   label:'Renard',      emoji:'🦊', req:{ played:3 } },
      { id:'panda',    label:'Panda',       emoji:'🐼', req:{ level:2 } },
      { id:'pingouin', label:'Pingouin',    emoji:'🐧', req:{ level:2 } },
      { id:'abeille',  label:'Abeille',     emoji:'🐝', req:{ stars:5 } },
      { id:'grenouille',label:'Grenouille', emoji:'🐸', req:{ trophy:'explorer5' } },
      { id:'dino',     label:'Bébé dino',   emoji:'🦕', req:{ trophy:'win1' } },
      { id:'cochon',   label:'Cochon',      emoji:'🐷', req:{ stars:8 } },
      { id:'mouton',   label:'Mouton',      emoji:'🐑', req:{ level:3 } },
      { id:'koala',    label:'Koala',       emoji:'🐨', req:{ level:3 } },
      { id:'hibou',    label:'Hibou',       emoji:'🦉', req:{ trophy:'perfect1' } },
      { id:'astro',    label:'Astronaute',  emoji:'🚀', req:{ level:3 } },
      { id:'alien',    label:'Alien',       emoji:'👽', req:{ level:4 } },
      { id:'fantome',  label:'Fantôme',     emoji:'👻', req:{ level:4 } },
      { id:'champignon',label:'Champi',     emoji:'🍄', req:{ stars:15 } },
      { id:'poulpe',   label:'Poulpe',      emoji:'🐙', req:{ level:4 } },
      { id:'feu',      label:'Flammèche',   emoji:'🔥', req:{ trophy:'level5' } },
      { id:'eau',      label:'Goutte',      emoji:'💧', req:{ level:5 } },
      { id:'plante',   label:'Pousse',      emoji:'🌱', req:{ trophy:'cours1' } },
      { id:'foudre',   label:'Éclair',      emoji:'⚡', req:{ level:6 } },
      { id:'cupcake',  label:'Cupcake',     emoji:'🧁', req:{ stars:15 } },
      { id:'pomme',    label:'Pomme',       emoji:'🍎', req:{ cours:3 } },
      { id:'golem',    label:'Golem',       emoji:'🪨', req:{ level:6 } },
      { id:'nuage',    label:'Nuage',       emoji:'☁️', req:{ level:7 } },
      { id:'etoile',   label:'Étoile',      emoji:'⭐', req:{ trophy:'stars45' } },
      { id:'licorne',  label:'Licorne',     emoji:'🦄', req:{ level:8 } },
      { id:'dragon',   label:'Dragon',      emoji:'🐲', req:{ trophy:'perfect5' } },
      { id:'legend',   label:'Légende dorée',emoji:'👑', req:{ level:10 }, ultimate:true, hint:'Le compagnon suprême' }
    ],
    colors: [
      { id:'#6E6BFF', label:'Indigo' },   { id:'#1B82E0', label:'Bleu' },
      { id:'#29B6E0', label:'Cyan' },     { id:'#4ECDC4', label:'Turquoise' },
      { id:'#23A06E', label:'Vert' },     { id:'#7BC86C', label:'Vert clair' },
      { id:'#F5A623', label:'Ambre' },    { id:'#FFC94D', label:'Or' },
      { id:'#E8556B', label:'Corail' },   { id:'#FF6B6B', label:'Rouge' },
      { id:'#E36B9E', label:'Rose' },     { id:'#FF9EC4', label:'Rose clair' },
      { id:'#9B5DE5', label:'Violet' },   { id:'#B8A6FF', label:'Lilas' },
      { id:'#8B5E3C', label:'Chocolat' }, { id:'#8892B0', label:'Gris' },
      { id:'#3A3F5C', label:'Ardoise' },  { id:'#EEF1FA', label:'Blanc' }
    ],
    accents: [
      { id:'#F5A623', label:'Ambre' },    { id:'#FFD23F', label:'Or' },
      { id:'#FF7BAC', label:'Rose' },     { id:'#FF6B6B', label:'Rouge' },
      { id:'#6E6BFF', label:'Indigo' },   { id:'#4ECDC4', label:'Turquoise' },
      { id:'#23A06E', label:'Vert' },     { id:'#29B6E0', label:'Cyan' },
      { id:'#9B5DE5', label:'Violet' },   { id:'#B8B8FF', label:'Lilas' },
      { id:'#FFFFFF', label:'Blanc' },    { id:'#2A2C46', label:'Nuit' }
    ],
    eyes: [
      { id:'joyeux',   label:'Joyeux',    emoji:'😊' },
      { id:'curieux',  label:'Curieux',   emoji:'🤔' },
      { id:'fier',     label:'Fier',      emoji:'😌' },
      { id:'clin',     label:'Malicieux', emoji:'😉' },
      { id:'kawaii',   label:'Adorable',  emoji:'🥰' },
      { id:'surpris',  label:'Surpris',   emoji:'😮' },
      { id:'amoureux', label:'Amoureux',  emoji:'😍' },
      { id:'cool',     label:'Cool',      emoji:'😎' },
      { id:'endormi',  label:'Endormi',   emoji:'😴' },
      { id:'determine',label:'Déterminé', emoji:'😤' }
    ],
    /* — Cosmétiques par catégories — */
    hat: [
      { id:'none',      label:'Rien',       emoji:'🚫' },
      { id:'noeud',     label:'Nœud',       emoji:'🎀' },
      { id:'casque',    label:'Casque',     emoji:'🎧' },
      { id:'casquette', label:'Casquette',  emoji:'🧢', req:{ played:3 } },
      { id:'chapeau',   label:'Haut-de-forme',emoji:'🎩', req:{ level:2 } },
      { id:'beanie',    label:'Bonnet',     emoji:'🧶', req:{ level:2 } },
      { id:'party',     label:'Cotillon',   emoji:'🥳', req:{ trophy:'win1' } },
      { id:'fleur',     label:'Fleur',      emoji:'🌸', req:{ stars:5 } },
      { id:'cornes',    label:'Petites cornes',emoji:'😈', req:{ level:4 } },
      { id:'couronne',  label:'Couronne',   emoji:'👑', req:{ level:5 } },
      { id:'halo',      label:'Auréole',    emoji:'😇', req:{ trophy:'perfect1' } },
      { id:'mage',      label:'Chapeau de mage',emoji:'🧙', req:{ level:7 } },
      { id:'beret',     label:'Béret d\'artiste', emoji:'🎨', rarity:'rare',    req:{ streak:3 },  look:{ kind:'beret', c1:'#3A3F5C' } },
      { id:'toque',     label:'Toque de chef',    emoji:'👨‍🍳', rarity:'rare',    req:{ cours:5 },   look:{ kind:'toque' } },
      { id:'pirate',    label:'Tricorne pirate',  emoji:'🏴‍☠️', rarity:'epique',  req:{ tickets:6 }, look:{ kind:'pirate' } },
      { id:'viking',    label:'Casque viking',    emoji:'⚔️', rarity:'epique',  req:{ quests:10 }, look:{ kind:'viking' } },
      { id:'detective', label:'Feutre détective', emoji:'🕵️', rarity:'epique',  req:{ tickets:8 }, look:{ kind:'tophat', c1:'#6B4A2B', band:'#3A3F5C' } },
      { id:'noel',      label:'Bonnet de Noël',   emoji:'🎅', rarity:'rare',    req:{ season:'hiver', sdays:2 },     look:{ kind:'santa' } },
      { id:'fleurs',    label:'Couronne de fleurs',emoji:'🌼', rarity:'rare',   req:{ season:'printemps', sdays:2 }, look:{ kind:'wreath', cols:['#FF9EC4','#FFE04D','#B8A6FF'] } },
      { id:'paille',    label:'Chapeau de paille',emoji:'👒', rarity:'rare',    req:{ season:'ete', sdays:2 },       look:{ kind:'straw' } },
      { id:'feuille',   label:'Bonnet d\'automne',emoji:'🍂', rarity:'rare',    req:{ season:'automne', sdays:2 },   look:{ kind:'dome', c1:'#B4562E', pom:'#FFD24D' } },
      { id:'couronneor',label:'Couronne d\'or',emoji:'👑', req:{ level:10 }, ultimate:true }
    ],
    glasses: [
      { id:'none',    label:'Rien',       emoji:'🚫' },
      { id:'lunettes',label:'Rondes',     emoji:'🤓' },
      { id:'soleil',  label:'Soleil',     emoji:'😎', req:{ level:2 } },
      { id:'etoiles', label:'Étoiles',    emoji:'🤩', req:{ stars:8 } },
      { id:'monocle', label:'Monocle',    emoji:'🧐', req:{ level:4 } },
      { id:'coeur',   label:'Cœurs',      emoji:'😍', req:{ trophy:'stars15' } },
      { id:'vr',      label:'Visière VR', emoji:'🕶️', req:{ level:6 } },
      { id:'or',      label:'Rondes dorées',  emoji:'👓', rarity:'rare',   req:{ tickets:4 },  look:{ frame:'#FFD24D' } },
      { id:'papillon',label:'Papillon',       emoji:'🦋', rarity:'rare',   req:{ streak:7 },   look:{ frame:'#E36B9E', lens:'#FF9EC4' } },
      { id:'pixel',   label:'Pixel rétro',    emoji:'🕹️', rarity:'epique', req:{ quests:15 },  look:{ frame:'#26283f', lens:'#5ED17B', square:true } },
      { id:'plongee', label:'Masque de plongée',emoji:'🤿', rarity:'rare', req:{ season:'ete', sdays:3 },   look:{ frame:'#1B82E0', lens:'#9BE7FF', square:true, big:true } },
      { id:'ski',     label:'Masque de ski',  emoji:'⛷️', rarity:'rare',   req:{ season:'hiver', sdays:3 }, look:{ frame:'#EEF1FA', lens:'#B8E7FF', square:true, big:true } }
    ],
    outfit: [
      { id:'none',     label:'Rien',       emoji:'🚫' },
      { id:'echarpe',  label:'Écharpe',    emoji:'🧣' },
      { id:'noeudpap', label:'Nœud pap',   emoji:'🤵', req:{ level:2 } },
      { id:'medaille', label:'Médaille',   emoji:'🏅', req:{ trophy:'win1' } },
      { id:'cape',     label:'Cape',       emoji:'🦸', req:{ level:5 } },
      { id:'armure',   label:'Col d\'armure',emoji:'🛡️', req:{ level:6 } },
      { id:'caperouge',   label:'Cape écarlate',   emoji:'❤️', rarity:'rare',       req:{ streak:3 },  look:{ cape:'#E8556B' } },
      { id:'capenuit',    label:'Cape de nuit',    emoji:'🌙', rarity:'epique',     req:{ streak:14 }, look:{ cape:'#232653', stars:true } },
      { id:'capearc',     label:'Cape arc-en-ciel',emoji:'🌈', rarity:'legendaire', req:{ quests:30 }, look:{ cape:'#9B5DE5', rainbow:true } },
      { id:'echarperayee',label:'Écharpe rayée',   emoji:'🧶', rarity:'rare',       req:{ tickets:3 }, look:{ scarf:'#1B82E0', c2:'#FFD24D' } },
      { id:'lei',         label:'Collier de fleurs',emoji:'🌺', rarity:'rare',      req:{ season:'ete', sdays:2 },     look:{ lei:['#FF7BAC','#FFE04D','#FF9EC4','#B8A6FF'] } },
      { id:'poncho',      label:'Poncho d\'automne',emoji:'🍁', rarity:'rare',      req:{ season:'automne', sdays:2 }, look:{ cape:'#B4562E' } },
      { id:'givre',       label:'Manteau givré',   emoji:'❄️', rarity:'epique',     req:{ season:'hiver', sdays:4 },   look:{ cape:'#BFE3FF', em:0.25 } },
      { id:'capeor',   label:'Cape dorée', emoji:'✨', req:{ level:10 }, ultimate:true }
    ],
    aura: [
      { id:'none',       label:'Rien',      emoji:'🚫' },
      { id:'etincelles', label:'Étincelles',emoji:'✨', req:{ level:2 } },
      { id:'etoiles',    label:'Étoiles',   emoji:'🌟', req:{ level:4 } },
      { id:'coeurs',     label:'Cœurs',     emoji:'💕', req:{ stars:8 } },
      { id:'feu',        label:'Flammes',   emoji:'🔥', req:{ level:5 } },
      { id:'electrique', label:'Électrique',emoji:'⚡', req:{ level:6 } },
      { id:'arcenciel',  label:'Arc-en-ciel',emoji:'🌈', req:{ trophy:'stars45' } },
      { id:'bulles',   label:'Bulles',          emoji:'🫧', rarity:'rare',       req:{ stars:10 },   fx:{ shape:'sphere', cols:['#9BE7FF','#CFEFFF'], motion:'rise', count:10, size:0.07 } },
      { id:'notes',    label:'Notes de musique',emoji:'🎵', rarity:'epique',     req:{ tickets:5 },  fx:{ shape:'box', cols:['#6E6BFF','#9B5DE5'], motion:'rise', count:8, size:0.06 } },
      { id:'galaxie',  label:'Galaxie',         emoji:'🌌', rarity:'legendaire', req:{ streak:21 },  fx:{ shape:'star', cols:['#B8A6FF','#7BE7FF','#FFD24D'], motion:'orbit', count:12, size:0.08 } },
      { id:'neige',    label:'Neige douce',     emoji:'☃️', rarity:'rare',       req:{ season:'hiver', sdays:2 },     fx:{ shape:'sphere', cols:['#FFFFFF','#DFEBFF'], motion:'fall', count:14, size:0.05 } },
      { id:'petales',  label:'Pétales',         emoji:'🌸', rarity:'rare',       req:{ season:'printemps', sdays:2 }, fx:{ shape:'petal', cols:['#FF9EC4','#FFC1DC'], motion:'fall', count:12, size:0.07 } },
      { id:'lucioles', label:'Lucioles d\'été', emoji:'💛', rarity:'rare',       req:{ season:'ete', sdays:2 },       fx:{ shape:'sphere', cols:['#FFE04D','#FFF3A0'], motion:'orbit', count:8, size:0.05 } },
      { id:'feuilles', label:'Feuilles d\'or',  emoji:'🍂', rarity:'rare',       req:{ season:'automne', sdays:2 },   fx:{ shape:'petal', cols:['#B4562E','#E8955B','#FFD24D'], motion:'fall', count:12, size:0.07 } },
      { id:'doree',      label:'Aura dorée',emoji:'👑', req:{ trophy:'completionist' }, ultimate:true }
    ],
    familiar: [
      { id:'none',      label:'Rien',       emoji:'🚫' },
      { id:'papillon',  label:'Papillon',   emoji:'🦋', req:{ level:2 } },
      { id:'luciole',   label:'Luciole',    emoji:'🪰', req:{ stars:5 } },
      { id:'oiseau',    label:'Oisillon',   emoji:'🐦', req:{ level:3 } },
      { id:'poisson',   label:'Poisson',    emoji:'🐠', req:{ level:4 } },
      { id:'robotmini', label:'Mini-robot', emoji:'🤖', req:{ trophy:'play3d' } },
      { id:'chouette',    label:'Chouette',      emoji:'🦉', rarity:'rare',       req:{ cours:5 },   fam:{ body:'#8B5E3C', wings:true, ears:'point' } },
      { id:'chaton',      label:'Chaton',        emoji:'🐈', rarity:'epique',     req:{ tickets:8 }, fam:{ body:'#F5A623', ears:'point', tail:true } },
      { id:'fantomette',  label:'Fantômette',    emoji:'👻', rarity:'epique',     req:{ quests:20 }, fam:{ body:'#EEF1FA', glow:0.4 } },
      { id:'filante',     label:'Étoile filante',emoji:'🌠', rarity:'legendaire', req:{ streak:30 }, fam:{ star:true, body:'#FFD24D', glow:1 } },
      { id:'crabe',       label:'Crabe',         emoji:'🦀', rarity:'rare',       req:{ season:'ete', sdays:3 },     fam:{ body:'#FF6B6B', claws:true } },
      { id:'renardeau',   label:'Renardeau',     emoji:'🦊', rarity:'rare',       req:{ season:'automne', sdays:3 }, fam:{ body:'#E8794A', ears:'point', tail:true } },
      { id:'pingouinmini',label:'Mini-pingouin', emoji:'🐧', rarity:'rare',       req:{ season:'hiver', sdays:3 },   fam:{ body:'#26283f', belly:'#FFFFFF' } },
      { id:'dragonnet', label:'Dragonnet',  emoji:'🐉', req:{ level:9 }, ultimate:true }
    ],
    background: [
      { id:'none',     label:'Studio',     emoji:'⚪' },
      { id:'ciel',     label:'Ciel',       emoji:'🌤️' },
      { id:'ocean',    label:'Océan',      emoji:'🌊', req:{ level:2 } },
      { id:'foret',    label:'Forêt',      emoji:'🌲', req:{ level:3 } },
      { id:'espace',   label:'Espace',     emoji:'🌌', req:{ trophy:'play3d' } },
      { id:'couchant', label:'Coucher de soleil',emoji:'🌅', req:{ stars:15 } },
      { id:'arcenciel',label:'Arc-en-ciel',emoji:'🌈', req:{ trophy:'stars45' } },
      { id:'neige',    label:'Neige',           emoji:'⛄', rarity:'rare',   req:{ season:'hiver', sdays:2 } },
      { id:'sakura',   label:'Cerisiers',       emoji:'🌸', rarity:'rare',   req:{ season:'printemps', sdays:2 } },
      { id:'plage',    label:'Plage',           emoji:'🏖️', rarity:'rare',   req:{ season:'ete', sdays:2 } },
      { id:'automne',  label:'Forêt d\'automne',emoji:'🍁', rarity:'rare',   req:{ season:'automne', sdays:2 } },
      { id:'nuit',     label:'Nuit étoilée',    emoji:'🌃', rarity:'rare',   req:{ trophy:'nightowl' } },
      { id:'aurore',   label:'Aurore boréale',  emoji:'❇️', rarity:'epique', req:{ streak:14 } },
      { id:'volcan',   label:'Volcan',          emoji:'🌋', rarity:'epique', req:{ tickets:10 } },
      { id:'bonbons',  label:'Bonbons',         emoji:'🍬', rarity:'rare',   req:{ tickets:6 } },
      { id:'doree',    label:'Salle dorée',emoji:'🏆', req:{ level:10 }, ultimate:true }
    ],
    pedestal: [
      { id:'none',     label:'Aucun',      emoji:'🚫' },
      { id:'disque',   label:'Disque',     emoji:'🟡' },
      { id:'coussin',  label:'Coussin',    emoji:'🛋️', req:{ level:2 } },
      { id:'nuage',    label:'Nuage',      emoji:'☁️', req:{ level:3 } },
      { id:'cristal',  label:'Cristal',    emoji:'💎', req:{ stars:15 } },
      { id:'glace',    label:'Banquise',        emoji:'🧊', rarity:'rare',   req:{ season:'hiver', sdays:2 },     ped:{ kind:'disc', col:'#BFE7FF', em:0.2 } },
      { id:'prairie',  label:'Prairie fleurie', emoji:'🌷', rarity:'rare',   req:{ season:'printemps', sdays:2 }, ped:{ kind:'disc', col:'#7BC86C', dots:['#FF9EC4','#FFE04D'] } },
      { id:'sable',    label:'Château de sable',emoji:'🏰', rarity:'rare',   req:{ season:'ete', sdays:2 },       ped:{ kind:'castle', col:'#E8C57A' } },
      { id:'rondin',   label:'Rondin de bois',  emoji:'🪵', rarity:'rare',   req:{ season:'automne', sdays:2 },   ped:{ kind:'disc', col:'#8B5E3C' } },
      { id:'neon',     label:'Anneau néon',     emoji:'💫', rarity:'epique', req:{ quests:25 },                   ped:{ kind:'ring', col:'#7BE7FF', em:1 } },
      { id:'podiumor', label:'Podium d\'or',emoji:'🥇', req:{ trophy:'completionist' }, ultimate:true }
    ],
    /* — Émotes de célébration : jouées à la réussite (contrôles, victoires) — */
    emote: [
      { id:'none',      label:'Confettis',       emoji:'🎊' },
      { id:'feux',      label:'Feux d\'artifice',emoji:'🎆', rarity:'rare',       req:{ level:3 },   glyphs:['🎆','✨','🎇'] },
      { id:'coeurs',    label:'Pluie de cœurs',  emoji:'💗', rarity:'rare',       req:{ stars:12 },  glyphs:['💗','💖','💕'] },
      { id:'etoiles',   label:'Pluie d\'étoiles',emoji:'🌟', rarity:'rare',       req:{ tickets:4 }, glyphs:['⭐','🌟','✨'] },
      { id:'eclairs',   label:'Super éclairs',   emoji:'⚡', rarity:'epique',     req:{ streak:10 }, glyphs:['⚡','💥'] },
      { id:'fleurs',    label:'Fleurs en fête',  emoji:'🌸', rarity:'rare',       req:{ season:'printemps', sdays:3 }, glyphs:['🌸','🌼','🌺'] },
      { id:'arcenciel', label:'Arc-en-ciel',     emoji:'🌈', rarity:'legendaire', req:{ quests:40 }, glyphs:['🌈','✨','⭐'] },
      { id:'royal',     label:'Sacre royal',     emoji:'👑', rarity:'legendaire', req:{ chest:3 },   glyphs:['👑','✨','💛'] }
    ]
  };

  /* Chaque item gaté connaît sa clé « cat:id » (achats/coffres → ach.owned). */
  (function stampKeys(){
    ['types','hat','glasses','outfit','aura','familiar','background','pedestal','emote'].forEach(function (cat) {
      (OPTIONS[cat]||[]).forEach(function (o) { if (o.req) o.req.key = cat + ':' + o.id; });
    });
  })();

  /* — Raretés (cadres colorés dans l'UI) — */
  var RARITIES = {
    commun:     { label:'Commun',     color:'#8892B0' },
    rare:       { label:'Rare',       color:'#1B82E0' },
    epique:     { label:'Épique',     color:'#9B5DE5' },
    legendaire: { label:'Légendaire', color:'#F5A623' }
  };
  function rarityOf(item) {
    if (!item) return 'commun';
    if (item.rarity) return item.rarity;
    if (item.ultimate) return 'legendaire';
    if (!item.req) return 'commun';
    var r = item.req;
    if ((r.level && r.level >= 6) || r.trophy === 'perfect5' || r.trophy === 'stars45' || r.trophy === 'completionist') return 'epique';
    return 'rare';
  }

  /* Catégories de cosmétiques (slots équipables), pour l'UI & la validation. */
  var SLOTS = ['hat', 'glasses', 'outfit', 'aura', 'familiar', 'background', 'pedestal', 'emote'];

  var DEFAULT = {
    type:'robot', color:'#6E6BFF', accent:'#F5A623', eyes:'joyeux',
    hat:'none', glasses:'none', outfit:'none', aura:'none', familiar:'none',
    background:'none', pedestal:'none', emote:'none', accessory:'none', name:'Konsti'
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function isHex(s) { return typeof s === 'string' && /^#[0-9a-fA-F]{6}$/.test(s); }
  function inList(list, id) { if (!list) return false; for (var i = 0; i < list.length; i++) if (list[i].id === id) return true; return false; }
  function findItem(list, id) { if (!list) return null; for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }

  /* Normalise/valide une config (évite tout état incohérent). */
  function sanitize(cfg) {
    var c = Object.assign(clone(DEFAULT), cfg || {});
    // Migration douce de l'ancien champ unique `accessory`.
    if (cfg && cfg.accessory && cfg.accessory !== 'none' && cfg.hat === undefined && cfg.glasses === undefined && cfg.outfit === undefined) {
      var map = { lunettes:['glasses','lunettes'], casque:['hat','casque'], chapeau:['hat','chapeau'], noeud:['hat','noeud'], echarpe:['outfit','echarpe'] };
      var m = map[cfg.accessory]; if (m) c[m[0]] = m[1];
    }
    if (!inList(OPTIONS.types, c.type)) c.type = DEFAULT.type;
    if (!inList(OPTIONS.eyes, c.eyes)) c.eyes = DEFAULT.eyes;
    SLOTS.forEach(function (k) { if (!inList(OPTIONS[k], c[k])) c[k] = 'none'; });
    if (!isHex(c.color)) c.color = DEFAULT.color;
    if (!isHex(c.accent)) c.accent = DEFAULT.accent;
    if (typeof c.name !== 'string') c.name = DEFAULT.name;
    c.name = c.name.slice(0, 24);
    return c;
  }

  function readLS() {
    try { var s = localStorage.getItem(LS_KEY); if (s) return sanitize(JSON.parse(s)); } catch (e) {}
    return null;
  }

  var _current = null;
  function current() { if (!_current) _current = readLS() || clone(DEFAULT); return _current; }

  /* ==========================================================================
   *  DÉBLOCABLES — dérivés de window.KonstrioAch (pas de triche facile)
   * ======================================================================== */
  var NEUTRAL_ACH = { xp:0, level:1, nextXp:150, unlocked:[], played:[], domains:[], stars:0, wins:0, perfect:0, cours:0,
                      tickets:0, owned:[], questsDone:0, streak:0, seasons:{}, week:{ opened:0 } };
  var SEASON_LABELS = { hiver:'hiver ❄️', printemps:'printemps 🌸', ete:'été ☀️', automne:'automne 🍂' };
  function readAch() {
    try { if (window.KonstrioAch && typeof window.KonstrioAch.get === 'function') return window.KonstrioAch.get(); } catch (e) {}
    return clone(NEUTRAL_ACH);
  }
  function meetsReq(req, ach) {
    if (!req) return true;
    ach = ach || readAch();
    // Possédé (acheté à la boutique 🎫 ou gagné dans un coffre) → toujours débloqué.
    if (req.key && (ach.owned || []).indexOf(req.key) >= 0) return true;
    if (req.tickets) return false; // uniquement via la boutique à tickets
    if (req.chest  && (((ach.week || {}).opened) || 0) < req.chest) return false;
    if (req.streak && (ach.streak || 0) < req.streak) return false;
    if (req.quests && (ach.questsDone || 0) < req.quests) return false;
    if (req.season && (((ach.seasons || {})[req.season]) || 0) < (req.sdays || 1)) return false;
    if (req.level  && (ach.level || 1) < req.level) return false;
    if (req.xp     && (ach.xp || 0) < req.xp) return false;
    if (req.stars  && (ach.stars || 0) < req.stars) return false;
    if (req.cours  && (ach.cours || 0) < req.cours) return false;
    if (req.played && (ach.played || []).length < req.played) return false;
    if (req.trophy && (ach.unlocked || []).indexOf(req.trophy) < 0) return false;
    return true;
  }
  function trophyName(id) {
    try {
      var L = (window.KonstrioAch && window.KonstrioAch.list) || [];
      for (var i = 0; i < L.length; i++) if (L[i].id === id) return (L[i].icon ? L[i].icon + ' ' : '') + L[i].name;
    } catch (e) {}
    return 'trophée';
  }
  function reqText(req) {
    if (!req) return 'Débloqué';
    if (req.tickets) return req.tickets + ' 🎫 à la boutique';
    if (req.chest)  return 'Ouvre ' + req.chest + ' coffre' + (req.chest > 1 ? 's' : '') + ' de la semaine';
    if (req.streak) return 'Série de ' + req.streak + ' jours 🔥';
    if (req.quests) return req.quests + ' objectifs du jour réussis 🎯';
    if (req.season) return (req.sdays || 1) + ' jour' + ((req.sdays || 1) > 1 ? 's' : '') + ' actif' + ((req.sdays || 1) > 1 ? 's' : '') + ' en ' + (SEASON_LABELS[req.season] || req.season);
    if (req.trophy) return 'Trophée « ' + trophyName(req.trophy) + ' »';
    if (req.level)  return 'Niveau ' + req.level;
    if (req.cours)  return req.cours + ' leçon' + (req.cours > 1 ? 's' : '') + ' de cours';
    if (req.stars)  return req.stars + ' ⭐ cumulées';
    if (req.played) return req.played + ' jeux différents';
    if (req.xp)     return req.xp + ' XP';
    return 'Débloqué';
  }
  function reqProgress(req, ach) {
    ach = ach || readAch();
    if (!req) return { have: 1, need: 1, ratio: 1, unlocked: true };
    if (req.key && (ach.owned || []).indexOf(req.key) >= 0) return { have: 1, need: 1, ratio: 1, unlocked: true };
    var have = 0, need = 1;
    if (req.trophy) { var u = (ach.unlocked || []).indexOf(req.trophy) >= 0; return { have: u ? 1 : 0, need: 1, ratio: u ? 1 : 0, unlocked: u }; }
    if (req.tickets) { have = Math.min(ach.tickets || 0, req.tickets); need = req.tickets;
      return { have: have, need: need, ratio: need ? Math.min(1, have / need) : 1, unlocked: false }; }
    if (req.chest)  { have = ((ach.week || {}).opened) || 0; need = req.chest; }
    else if (req.streak) { have = ach.streak || 0; need = req.streak; }
    else if (req.quests) { have = ach.questsDone || 0; need = req.quests; }
    else if (req.season) { have = ((ach.seasons || {})[req.season]) || 0; need = req.sdays || 1; }
    else if (req.level)  { have = ach.level || 1; need = req.level; }
    else if (req.cours)  { have = ach.cours || 0; need = req.cours; }
    else if (req.stars)  { have = ach.stars || 0; need = req.stars; }
    else if (req.played) { have = (ach.played || []).length; need = req.played; }
    else if (req.xp)     { have = ach.xp || 0; need = req.xp; }
    var ratio = need ? Math.max(0, Math.min(1, have / need)) : 1;
    return { have: have, need: need, ratio: ratio, unlocked: ratio >= 1 };
  }
  function itemUnlocked(cat, id, ach) {
    if (cat === 'colors' || cat === 'accents' || cat === 'eyes') return true; // toujours libres
    var it = findItem(OPTIONS[cat], id);
    if (!it) return false;
    return meetsReq(it.req, ach);
  }
  /* Ramène au défaut tout item verrouillé (recalcul à chaque chargement). */
  function enforce(cfg, ach) {
    var c = sanitize(cfg);
    ach = ach || readAch();
    if (!itemUnlocked('types', c.type, ach)) c.type = DEFAULT.type;
    SLOTS.forEach(function (k) { if (c[k] !== 'none' && !itemUnlocked(k, c[k], ach)) c[k] = 'none'; });
    return c;
  }

  /* ==========================================================================
   *  CONSTRUCTION PROCÉDURALE DE LA MASCOTTE
   * ======================================================================== */
  function buildAvatar(THREE, cfg) {
    var primary = new THREE.Color(cfg.color);
    var accent = new THREE.Color(cfg.accent);
    var dark = new THREE.Color('#20223c');
    var white = new THREE.Color('#fbfcff');
    var C = function (hex) { return new THREE.Color(hex); };

    function std(color, rough, metal, emissive, eInt) {
      var m = new THREE.MeshStandardMaterial({
        color: color, roughness: rough == null ? 0.55 : rough, metalness: metal == null ? 0.08 : metal
      });
      if (emissive) { m.emissive = emissive; m.emissiveIntensity = eInt == null ? 0.6 : eInt; }
      return m;
    }
    function glass(color, opacity, rough) {
      var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.15 : rough, metalness: 0, transparent: true, opacity: opacity });
      return m;
    }

    var root = new THREE.Group();
    var bob = new THREE.Group(); root.add(bob);
    var head = new THREE.Group(); bob.add(head);
    var parts = { root: root, bob: bob, head: head, breathe: [], eyeL: null, eyeR: null,
                  mouth: null, armL: null, armR: null, dispose: [], mouthKind: 'smile', tick: [] };

    function track(o) { parts.dispose.push(o); return o; }
    function geoMat(geo, mat) { track(geo); track(mat); return new THREE.Mesh(geo, mat); }
    function sph(r, mat, s1, s2, ps, pl, ts, tl) { return geoMat(new THREE.SphereGeometry(r, s1 || 28, s2 || 20, ps, pl, ts, tl), mat); }
    function cyl(rt, rb, h, mat, seg) { return geoMat(new THREE.CylinderGeometry(rt, rb, h, seg || 18), mat); }
    function cone(r, h, mat, seg) { return geoMat(new THREE.ConeGeometry(r, h, seg || 18), mat); }
    function tor(r, t, mat, seg, arc) { return geoMat(new THREE.TorusGeometry(r, t, seg || 12, 24, arc), mat); }
    function boxm(w, h, d, mat) { return geoMat(new THREE.BoxGeometry(w, h, d), mat); }

    /* Anchors renseignés par chaque type. */
    var cfgT = { headY: 0.75, faceR: 0.5, faceZ: 0.46, armX: 0.62, armY: 0.15, topY: 0.5, footY: -0.8 };

    /* ---- Base « animal tout rond » réutilisable ---- */
    function animalBase(furMat, o) {
      o = o || {};
      var bodyR = o.bodyR || 0.66, headR = o.headR || 0.52;
      var body = sph(bodyR, furMat, 34, 26);
      body.scale.set(o.bodyScaleX || 1, o.bodyScaleY || 0.92, o.bodyScaleZ || 0.95);
      body.position.y = o.bodyY != null ? o.bodyY : 0.02; bob.add(body); parts.breathe.push(body);
      var h = sph(headR, furMat, 34, 26);
      if (o.headScaleY) h.scale.y = o.headScaleY;
      head.add(h); head.position.y = o.headY != null ? o.headY : 0.72;
      cfgT.faceR = headR; cfgT.faceZ = headR * 0.86; cfgT.topY = headR * 0.98; cfgT.headY = head.position.y;
      cfgT.armX = o.armX || 0.56; cfgT.armY = o.armY != null ? o.armY : -0.05; cfgT.footY = o.footY != null ? o.footY : -0.78;
      return { body: body, headMesh: h, headR: headR };
    }
    function roundEars(headR, mat, innerMat, sx, sy) {
      sx = sx || 0.34; sy = sy || headR * 0.8;
      [-1, 1].forEach(function (s) {
        var ear = sph(headR * 0.38, mat, 20, 16); ear.position.set(s * headR * sx, sy, -0.02); head.add(ear);
        if (innerMat) { var inr = sph(headR * 0.2, innerMat, 16, 12); inr.position.set(s * headR * sx, sy + headR * 0.04, headR * 0.16); head.add(inr); }
      });
    }
    function pointyEars(headR, mat, innerMat, sx) {
      sx = sx || 0.32;
      [-1, 1].forEach(function (s) {
        var ear = cone(headR * 0.4, headR * 0.62, mat, 4); ear.position.set(s * headR * sx, headR * 0.86, -0.02); ear.rotation.z = -s * 0.16; head.add(ear);
        if (innerMat) { var inr = cone(headR * 0.2, headR * 0.34, innerMat, 4); inr.position.set(s * headR * sx, headR * 0.8, headR * 0.14); inr.rotation.z = -s * 0.16; head.add(inr); }
      });
    }
    function nose(y, z, r, mat) { var n = sph(r, mat, 14, 10); n.position.set(0, y, z); head.add(n); return n; }
    function tail(x, y, z, r, mat, longZ) { var t = sph(r, mat, 14, 10); if (longZ) t.scale.set(1, 1, longZ); t.position.set(x, y, z); bob.add(t); return t; }

    /* ------------------------------------------------ ROBOT */
    function buildRobot() {
      var bodyMat = std(primary, 0.42, 0.28);
      var body = geoMat(new THREE.BoxGeometry(0.95, 0.9, 0.62, 4, 4, 4), bodyMat);
      body.position.y = -0.02; roundify(body.geometry, 0.16); bob.add(body); parts.breathe.push(body);
      var belly = geoMat(new THREE.PlaneGeometry(0.5, 0.34), std(accent, 0.3, 0.1, accent, 0.25));
      belly.position.set(0, -0.02, 0.33); bob.add(belly);
      var headMesh = geoMat(new THREE.BoxGeometry(0.92, 0.8, 0.82, 4, 4, 4), std(primary, 0.4, 0.3));
      roundify(headMesh.geometry, 0.18); head.add(headMesh); head.position.y = 0.78;
      cfgT.headY = 0.78; cfgT.faceR = 0.46; cfgT.faceZ = 0.42; cfgT.topY = 0.46; cfgT.armX = 0.62; cfgT.armY = 0.08;
      var ant = cyl(0.03, 0.03, 0.3, std(dark, 0.5, 0.3), 8); ant.position.y = 0.55; head.add(ant);
      var bulb = sph(0.09, std(accent, 0.3, 0.1, accent, 1.1), 16, 12); bulb.position.y = 0.72; head.add(bulb); parts.blink2 = bulb;
      [-1, 1].forEach(function (s) { var ear = cyl(0.1, 0.1, 0.1, std(accent, 0.4, 0.2), 16); ear.rotation.z = Math.PI / 2; ear.position.set(s * 0.5, 0, 0); head.add(ear); });
      buildArms(std(primary, 0.4, 0.3), 'capsule'); buildFeet(std(dark, 0.5, 0.2));
    }

    /* ------------------------------------------------ BLOB */
    function buildBlob() {
      var mat = std(primary, 0.32, 0.02);
      var body = sph(0.78, mat, 40, 32); body.scale.set(1, 0.92, 1); body.position.y = 0.15; bob.add(body); parts.breathe.push(body);
      head.position.y = 0.32; cfgT.headY = 0.32; cfgT.faceR = 0.72; cfgT.faceZ = 0.6; cfgT.topY = 0.7; cfgT.armX = 0.66; cfgT.armY = -0.1; cfgT.footY = -0.7;
      var stem = cyl(0.02, 0.03, 0.16, std(accent, 0.4, 0.05), 8); stem.position.y = 0.7; head.add(stem);
      var leaf = sph(0.08, std(accent, 0.3, 0.05), 16, 12); leaf.scale.set(1, 1.3, 0.6); leaf.position.y = 0.82; head.add(leaf);
      buildArms(mat, 'blobArm'); buildFeet(std(shadeCol(THREE, primary, -18), 0.4, 0.02));
    }

    /* ------------------------------------------------ OURSON (animal) */
    function buildAnimal() {
      var fur = std(primary, 0.62, 0.02);
      animalBase(fur, { headR: 0.55, bodyR: 0.7, bodyScaleZ: 0.95 });
      roundEars(0.55, fur, std(accent, 0.5, 0.02), 0.62, 0.42);
      var snout = sph(0.2, std(shadeCol(THREE, primary, 22), 0.55, 0.02), 24, 18); snout.scale.set(1.1, 0.8, 0.8); snout.position.set(0, -0.12, 0.4); head.add(snout);
      nose(-0.05, 0.58, 0.06, std(dark, 0.4, 0.05));
      tail(0, -0.1, -0.66, 0.16, fur);
      buildArms(fur, 'blobArm'); buildFeet(fur);
    }

    /* ------------------------------------------------ CHAT */
    function buildCat() {
      var fur = std(primary, 0.6, 0.03);
      animalBase(fur, { headR: 0.54, bodyR: 0.6, bodyScaleY: 0.9 });
      pointyEars(0.54, fur, std(accent, 0.55, 0.02), 0.5);
      var nz = nose(-0.04, 0.5, 0.05, std(accent, 0.4, 0)); nz.scale.set(1.2, 0.8, 1);
      [-1, 1].forEach(function (s) { for (var k = -1; k <= 1; k++) { var w = cyl(0.006, 0.006, 0.34, std(white, 0.5, 0), 6); w.rotation.z = Math.PI / 2 + s * (0.1 + k * 0.14); w.position.set(s * 0.34, -0.08 + k * 0.05, 0.42); head.add(w); } });
      tail(0.34, -0.02, -0.5, 0.1, fur, 2.4);
      buildArms(fur, 'blobArm'); buildFeet(fur);
    }

    /* ------------------------------------------------ RENARD */
    function buildFox() {
      var fur = std(primary, 0.6, 0.02);
      var wmat = std(white, 0.6, 0.02);
      animalBase(fur, { headR: 0.52, bodyR: 0.6 });
      pointyEars(0.52, fur, std(dark, 0.6, 0), 0.48);
      // museau blanc pointu
      var snout = cone(0.22, 0.4, wmat, 16); snout.rotation.x = Math.PI / 2; snout.position.set(0, -0.12, 0.42); head.add(snout);
      nose(-0.12, 0.62, 0.06, std(dark, 0.4, 0.05));
      var cheek = sph(0.3, wmat, 20, 16); cheek.scale.set(1, 0.7, 0.5); cheek.position.set(0, -0.14, 0.26); head.add(cheek);
      // queue touffue à bout blanc
      var q = tail(0.34, -0.02, -0.54, 0.18, fur, 2.2);
      var qt = sph(0.14, wmat, 16, 12); qt.position.set(0.5, 0.04, -0.86); bob.add(qt);
      buildArms(fur, 'blobArm'); buildFeet(std(dark, 0.6, 0));
    }

    /* ------------------------------------------------ PANDA */
    function buildPanda() {
      var fur = std(white, 0.6, 0.02);
      var blk = std(C('#2a2b33'), 0.6, 0.02);
      animalBase(fur, { headR: 0.56, bodyR: 0.68 });
      roundEars(0.56, blk, null, 0.6, 0.44);
      // taches yeux noires
      [-1, 1].forEach(function (s) { var patch = sph(0.16, blk, 18, 14); patch.scale.set(1, 1.3, 0.5); patch.position.set(s * 0.22, 0.06, 0.44); patch.rotation.z = s * 0.4; head.add(patch); });
      nose(-0.06, 0.52, 0.06, blk);
      // épaule/bras noirs
      buildArms(blk, 'blobArm'); buildFeet(blk);
    }

    /* ------------------------------------------------ PINGOUIN */
    function buildPenguin() {
      var body = std(C('#2b2e44'), 0.5, 0.05);
      var belly = std(white, 0.5, 0.02);
      var b = sph(0.62, body, 32, 26); b.scale.set(0.92, 1.15, 0.92); b.position.y = 0.05; bob.add(b); parts.breathe.push(b);
      var bel = sph(0.5, belly, 28, 22); bel.scale.set(0.82, 1.05, 0.55); bel.position.set(0, 0.02, 0.32); bob.add(bel);
      var h = sph(0.44, body, 30, 24); head.add(h); head.position.y = 0.72;
      cfgT.faceR = 0.44; cfgT.faceZ = 0.4; cfgT.topY = 0.44; cfgT.armX = 0.5; cfgT.armY = 0; cfgT.footY = -0.7;
      var face = sph(0.34, belly, 24, 18); face.scale.set(1, 1, 0.4); face.position.set(0, -0.02, 0.28); head.add(face);
      var beak = cone(0.12, 0.24, std(accent, 0.4, 0.05), 12); beak.rotation.x = Math.PI / 2; beak.position.set(0, -0.08, 0.44); head.add(beak);
      // ailerons
      [-1, 1].forEach(function (s) { var w = sph(0.12, body, 16, 12); w.scale.set(0.5, 1.3, 0.8); w.position.set(s * 0.56, -0.05, 0); bob.add(w); if (s < 0) parts.armL = w; else parts.armR = w; });
      [-1, 1].forEach(function (s) { var f = sph(0.16, std(accent, 0.4, 0.05), 16, 12); f.scale.set(1.3, 0.4, 1.4); f.position.set(s * 0.24, -0.72, 0.16); bob.add(f); });
    }

    /* ------------------------------------------------ LAPIN */
    function buildRabbit() {
      var fur = std(primary, 0.62, 0.02);
      animalBase(fur, { headR: 0.5, bodyR: 0.58 });
      [-1, 1].forEach(function (s) {
        var ear = geoMat(new THREE.CapsuleGeometry(0.1, 0.5, 8, 14), fur); ear.position.set(s * 0.18, 0.7, -0.02); ear.rotation.z = -s * 0.12; head.add(ear);
        var inr = geoMat(new THREE.CapsuleGeometry(0.05, 0.4, 6, 10), std(C('#FFB6C9'), 0.6, 0)); inr.position.set(s * 0.18, 0.72, 0.06); inr.rotation.z = -s * 0.12; head.add(inr);
      });
      nose(-0.04, 0.5, 0.05, std(C('#FF8FB0'), 0.4, 0));
      tail(0, -0.08, -0.56, 0.16, std(white, 0.7, 0.02));
      buildArms(fur, 'blobArm'); buildFeet(fur);
    }

    /* ------------------------------------------------ POUSSIN */
    function buildChick() {
      var fluff = std(primary, 0.7, 0.02);
      var body = sph(0.62, fluff, 32, 26); body.scale.set(1, 1.05, 1); body.position.y = 0.06; bob.add(body); parts.breathe.push(body);
      var h = sph(0.46, fluff, 30, 24); head.add(h); head.position.y = 0.66;
      cfgT.faceR = 0.46; cfgT.faceZ = 0.42; cfgT.topY = 0.46; cfgT.footY = -0.66;
      var beak = cone(0.1, 0.2, std(accent, 0.4, 0.05), 4); beak.rotation.x = Math.PI / 2; beak.position.set(0, -0.06, 0.46); head.add(beak);
      // petite houppette
      var tuft = cone(0.06, 0.2, fluff, 8); tuft.position.y = 0.5; head.add(tuft);
      [-1, 1].forEach(function (s) { var w = sph(0.16, fluff, 16, 12); w.scale.set(0.4, 1, 0.9); w.position.set(s * 0.56, 0, 0); bob.add(w); if (s < 0) parts.armL = w; else parts.armR = w; });
      [-1, 1].forEach(function (s) { var leg = cyl(0.03, 0.03, 0.18, std(accent, 0.4, 0.05), 8); leg.position.set(s * 0.16, -0.62, 0.06); bob.add(leg); var f = sph(0.1, std(accent, 0.4, 0.05), 12, 8); f.scale.set(1.4, 0.3, 1.4); f.position.set(s * 0.16, -0.72, 0.14); bob.add(f); });
    }

    /* ------------------------------------------------ ABEILLE */
    function buildBee() {
      var yellow = std(primary, 0.5, 0.05);
      var body = sph(0.6, yellow, 32, 24); body.scale.set(1, 0.9, 1.15); body.position.y = 0.05; bob.add(body); parts.breathe.push(body);
      // rayures
      [-0.2, 0.1, 0.4].forEach(function (z) { var st = tor(0.55, 0.09, std(C('#2a2b33'), 0.5, 0.05), 10); st.rotation.x = Math.PI / 2; st.position.set(0, 0.05, z * -1); st.scale.set(1, 1, 0.5); bob.add(st); });
      var h = sph(0.42, yellow, 28, 22); head.add(h); head.position.y = 0.66;
      cfgT.faceR = 0.42; cfgT.faceZ = 0.38; cfgT.topY = 0.42; cfgT.footY = -0.68;
      // antennes
      [-1, 1].forEach(function (s) { var a = cyl(0.02, 0.02, 0.24, std(dark, 0.5, 0.1), 6); a.position.set(s * 0.12, 0.52, 0); a.rotation.z = s * 0.3; head.add(a); var b = sph(0.05, std(dark, 0.4, 0.1), 10, 8); b.position.set(s * 0.2, 0.66, 0); head.add(b); });
      // ailes translucides
      var wingMat = glass(C('#dff2ff'), 0.5, 0.1); track(wingMat);
      [-1, 1].forEach(function (s) { var w = geoMat(new THREE.SphereGeometry(0.28, 18, 12), wingMat); w.scale.set(0.5, 1, 0.15); w.position.set(s * 0.42, 0.34, -0.28); w.rotation.z = s * 0.4; bob.add(w); if (s < 0) parts._wL = w; else parts._wR = w; });
      parts.tick.push(function (t) { if (parts._wL) { parts._wL.rotation.y = Math.sin(t * 22) * 0.5; parts._wR.rotation.y = -Math.sin(t * 22) * 0.5; } });
      buildFeet(std(dark, 0.5, 0.05));
    }

    /* ------------------------------------------------ GRENOUILLE */
    function buildFrog() {
      var skin = std(primary, 0.5, 0.03);
      var body = sph(0.66, skin, 32, 24); body.scale.set(1.05, 0.82, 1); body.position.y = 0; bob.add(body); parts.breathe.push(body);
      var h = sph(0.5, skin, 30, 24); h.scale.set(1.1, 0.85, 1); head.add(h); head.position.y = 0.5;
      cfgT.faceR = 0.5; cfgT.faceZ = 0.44; cfgT.topY = 0.5; cfgT.footY = -0.62;
      // gros yeux bombés sur le dessus
      [-1, 1].forEach(function (s) { var bump = sph(0.2, skin, 20, 16); bump.position.set(s * 0.26, 0.42, 0.16); head.add(bump); });
      buildFeet(std(shadeCol(THREE, primary, -12), 0.5, 0.03));
      [-1, 1].forEach(function (s) { var arm = sph(0.14, skin, 16, 12); arm.scale.set(0.7, 1.1, 0.7); arm.position.set(s * 0.6, -0.28, 0.1); bob.add(arm); if (s < 0) parts.armL = arm; else parts.armR = arm; });
    }

    /* ------------------------------------------------ DINO (bébé) */
    function buildDino() {
      var skin = std(primary, 0.55, 0.03);
      var body = sph(0.66, skin, 32, 24); body.scale.set(1, 1.05, 1.05); body.position.y = 0.02; bob.add(body); parts.breathe.push(body);
      var h = sph(0.5, skin, 30, 24); head.add(h); head.position.y = 0.7;
      cfgT.faceR = 0.5; cfgT.faceZ = 0.46; cfgT.topY = 0.5; cfgT.footY = -0.74;
      // museau
      var snout = sph(0.26, skin, 20, 16); snout.scale.set(1, 0.7, 0.9); snout.position.set(0, -0.14, 0.4); head.add(snout);
      nose(-0.08, 0.62, 0.04, std(dark, 0.5, 0)); nose(-0.08, 0.62, 0.04, std(dark, 0.5, 0));
      // dossières (plaques dorsales)
      var plMat = std(accent, 0.5, 0.05);
      [0.4, 0.15, -0.1, -0.35].forEach(function (y, i) { var pl = cone(0.14 - i * 0.015, 0.2, plMat, 4); pl.position.set(0, 0.15 + y, -0.5 - i * 0.02); pl.rotation.x = -0.3; bob.add(pl); });
      // queue
      var q = cone(0.2, 0.5, skin, 12); q.rotation.x = -Math.PI / 2; q.position.set(0, -0.1, -0.68); bob.add(q);
      buildArms(skin, 'blobArm'); buildFeet(skin);
    }

    /* ------------------------------------------------ COCHON */
    function buildPig() {
      var pink = std(primary, 0.55, 0.02);
      animalBase(pink, { headR: 0.54, bodyR: 0.66 });
      [-1, 1].forEach(function (s) { var ear = cone(0.16, 0.24, pink, 3); ear.position.set(s * 0.32, 0.5, 0.02); ear.rotation.z = -s * 0.3; ear.rotation.x = -0.3; head.add(ear); });
      var snout = cyl(0.18, 0.18, 0.14, std(shadeCol(THREE, primary, -8), 0.5, 0.02), 20); snout.rotation.x = Math.PI / 2; snout.position.set(0, -0.1, 0.5); head.add(snout);
      [-1, 1].forEach(function (s) { var n2 = cyl(0.04, 0.04, 0.06, std(dark, 0.4, 0), 10); n2.rotation.x = Math.PI / 2; n2.position.set(s * 0.06, -0.1, 0.58); head.add(n2); });
      var q = geoMat(new THREE.TorusGeometry(0.1, 0.03, 8, 16, Math.PI * 1.6), pink); q.position.set(0, 0, -0.66); q.rotation.y = Math.PI / 2; bob.add(q);
      buildArms(pink, 'blobArm'); buildFeet(std(shadeCol(THREE, primary, -10), 0.5, 0.02));
    }

    /* ------------------------------------------------ MOUTON */
    function buildSheep() {
      var wool = std(white, 0.85, 0.0);
      var faceMat = std(C('#3a3b46'), 0.5, 0.03);
      // corps laineux : amas de sphères
      var pts = [[0, 0.1, 0, 0.56], [-0.4, 0.05, 0.1, 0.34], [0.4, 0.05, 0.1, 0.34], [0, 0.05, 0.42, 0.32], [0, 0.05, -0.42, 0.34], [-0.28, 0.35, 0, 0.3], [0.28, 0.35, 0, 0.3]];
      pts.forEach(function (a, i) { var s = sph(a[3], wool, 20, 16); s.position.set(a[0], a[1], a[2]); bob.add(s); if (i === 0) parts.breathe.push(s); });
      var h = sph(0.4, faceMat, 28, 22); head.add(h); head.position.y = 0.62;
      cfgT.faceR = 0.4; cfgT.faceZ = 0.36; cfgT.topY = 0.4; cfgT.footY = -0.62;
      var wtop = sph(0.34, wool, 20, 16); wtop.position.set(0, 0.28, -0.06); head.add(wtop);
      [-1, 1].forEach(function (s) { var ear = sph(0.12, faceMat, 14, 10); ear.scale.set(1.4, 0.6, 1); ear.position.set(s * 0.4, 0.08, 0); head.add(ear); });
      buildFeet(faceMat);
    }

    /* ------------------------------------------------ KOALA */
    function buildKoala() {
      var fur = std(primary, 0.7, 0.02);
      animalBase(fur, { headR: 0.56, bodyR: 0.62 });
      // grandes oreilles rondes touffues
      [-1, 1].forEach(function (s) { var ear = sph(0.28, fur, 22, 18); ear.position.set(s * 0.5, 0.34, -0.02); head.add(ear); var inr = sph(0.16, std(C('#f4d9e6'), 0.6, 0), 16, 12); inr.position.set(s * 0.5, 0.34, 0.1); head.add(inr); });
      var nz = sph(0.16, std(C('#3a3b46'), 0.4, 0.05), 20, 14); nz.scale.set(1, 1.5, 0.7); nz.position.set(0, -0.08, 0.5); head.add(nz);
      buildArms(fur, 'blobArm'); buildFeet(std(shadeCol(THREE, primary, -12), 0.6, 0.02));
    }

    /* ------------------------------------------------ HIBOU */
    function buildOwl() {
      var feather = std(primary, 0.62, 0.02);
      var body = sph(0.64, feather, 32, 26); body.scale.set(1, 1.1, 0.95); body.position.y = 0.02; bob.add(body); parts.breathe.push(body);
      var belly = sph(0.5, std(shadeCol(THREE, primary, 20), 0.6, 0.02), 28, 22); belly.scale.set(0.8, 1, 0.4); belly.position.set(0, -0.02, 0.36); bob.add(belly);
      var h = sph(0.52, feather, 30, 24); h.scale.set(1.1, 0.9, 1); head.add(h); head.position.y = 0.68;
      cfgT.faceR = 0.52; cfgT.faceZ = 0.46; cfgT.topY = 0.5; cfgT.footY = -0.7;
      // disques faciaux + gros yeux (via face générique, mais on ajoute cerclage)
      [-1, 1].forEach(function (s) { var ring = tor(0.18, 0.03, std(accent, 0.5, 0.05), 8); ring.position.set(s * 0.2, 0.06, 0.46); head.add(ring); });
      // aigrettes
      [-1, 1].forEach(function (s) { var t2 = cone(0.1, 0.24, feather, 5); t2.position.set(s * 0.28, 0.5, -0.06); t2.rotation.z = -s * 0.2; head.add(t2); });
      var beak = cone(0.08, 0.18, std(accent, 0.4, 0.05), 8); beak.rotation.x = Math.PI / 2; beak.position.set(0, -0.06, 0.5); head.add(beak);
      // ailes
      [-1, 1].forEach(function (s) { var w = sph(0.16, feather, 16, 12); w.scale.set(0.5, 1.3, 0.8); w.position.set(s * 0.58, -0.05, 0.05); bob.add(w); if (s < 0) parts.armL = w; else parts.armR = w; });
      buildFeet(std(accent, 0.4, 0.05));
    }

    /* ------------------------------------------------ ASTRONAUTE */
    function buildAstro() {
      var suit = std(white, 0.5, 0.05);
      var body = geoMat(new THREE.CapsuleGeometry(0.44, 0.34, 12, 24), suit); body.position.y = 0.05; bob.add(body); parts.breathe.push(body);
      var chest = geoMat(new THREE.BoxGeometry(0.34, 0.26, 0.1), std(primary, 0.4, 0.2)); roundify(chest.geometry, 0.05); chest.position.set(0, 0.02, 0.4); bob.add(chest);
      var pack = geoMat(new THREE.BoxGeometry(0.5, 0.5, 0.28), std(accent, 0.5, 0.1)); roundify(pack.geometry, 0.08); pack.position.set(0, 0.1, -0.42); bob.add(pack);
      var faceHead = sph(0.42, std(C('#ffd9b8'), 0.7, 0.0), 32, 24); head.add(faceHead); head.position.y = 0.78;
      cfgT.headY = 0.78; cfgT.faceR = 0.42; cfgT.faceZ = 0.4; cfgT.topY = 0.5; cfgT.armX = 0.56; cfgT.armY = 0.08;
      var glassMat = glass(C('#cfe8ff'), 0.28, 0.05); track(glassMat);
      var helmet = new THREE.Mesh(track(new THREE.SphereGeometry(0.54, 32, 24)), glassMat); head.add(helmet);
      var ring = tor(0.5, 0.06, std(primary, 0.4, 0.2), 12); ring.rotation.x = Math.PI / 2; ring.position.y = -0.2; head.add(ring);
      buildArms(suit, 'capsule'); buildFeet(std(primary, 0.4, 0.2));
    }

    /* ------------------------------------------------ ALIEN */
    function buildAlien() {
      var skin = std(primary, 0.4, 0.1);
      var body = sph(0.5, skin, 30, 24); body.scale.set(1, 1.1, 1); body.position.y = 0; bob.add(body); parts.breathe.push(body);
      var h = sph(0.56, skin, 32, 26); h.scale.set(1.1, 1.25, 1); head.add(h); head.position.y = 0.66;
      cfgT.faceR = 0.56; cfgT.faceZ = 0.5; cfgT.topY = 0.7; cfgT.footY = -0.62;
      // antennes à boule
      [-1, 1].forEach(function (s) { var a = cyl(0.02, 0.02, 0.3, skin, 6); a.position.set(s * 0.18, 0.66, 0); a.rotation.z = s * 0.25; head.add(a); var b = sph(0.07, std(accent, 0.3, 0.1, accent, 0.9), 12, 10); b.position.set(s * 0.26, 0.82, 0); head.add(b); parts.tick.push((function (bb, ph) { return function (t) { bb.material.emissiveIntensity = 0.6 + Math.abs(Math.sin(t * 3 + ph)) * 0.7; }; })(b, s)); });
      buildArms(skin, 'blobArm'); buildFeet(skin);
    }

    /* ------------------------------------------------ FANTÔME */
    function buildGhost() {
      var g = glass(white, 0.9, 0.6); track(g);
      var body = sph(0.6, g, 32, 24); body.scale.set(1, 1.2, 1); body.position.y = 0.28; bob.add(body); parts.breathe.push(body);
      var waves = [];
      for (var i = 0; i < 5; i++) { var w = sph(0.17, g, 16, 12); var a = (i - 2) * 0.24; w.position.set(a, -0.32, 0.0); bob.add(w); waves.push(w); }
      head.position.y = 0.44; cfgT.faceR = 0.56; cfgT.faceZ = 0.56; cfgT.topY = 0.62; cfgT.footY = -0.5;
      // petits bras nuage
      [-1, 1].forEach(function (s) { var arm = sph(0.14, g, 14, 10); arm.position.set(s * 0.56, 0.1, 0); bob.add(arm); if (s < 0) parts.armL = arm; else parts.armR = arm; });
      parts.tick.push(function (t) { waves.forEach(function (w, i) { w.position.y = -0.32 + Math.sin(t * 4 + i) * 0.06; }); });
    }

    /* ------------------------------------------------ CHAMPIGNON */
    function buildMushroom() {
      var stemMat = std(C('#f4efe4'), 0.7, 0.02);
      var cap = std(primary, 0.5, 0.03);
      var s = cyl(0.4, 0.46, 0.7, stemMat, 22); s.position.y = -0.1; bob.add(s); parts.breathe.push(s);
      var c = sph(0.68, cap, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2); c.scale.set(1, 0.8, 1); c.position.y = 0.34; bob.add(c);
      // pois
      var dotMat = std(white, 0.5, 0.02);
      [[0.3, 0.5, 0.3], [-0.34, 0.45, 0.2], [0.1, 0.6, -0.3], [-0.2, 0.5, -0.32], [0.36, 0.42, -0.1]].forEach(function (p) { var d = sph(0.09, dotMat, 12, 10); d.position.set(p[0], p[1], p[2]); bob.add(d); });
      head.position.y = 0.0; cfgT.faceR = 0.42; cfgT.faceZ = 0.42; cfgT.topY = 0.7; cfgT.footY = -0.5;
      buildArms(stemMat, 'blobArm');
    }

    /* ------------------------------------------------ POULPE */
    function buildOctopus() {
      var skin = std(primary, 0.5, 0.05);
      var h = sph(0.66, skin, 34, 26); h.scale.set(1, 1.1, 1); head.add(h); head.position.y = 0.35;
      cfgT.faceR = 0.66; cfgT.faceZ = 0.58; cfgT.topY = 0.7; cfgT.footY = -0.5;
      parts.breathe.push(h);
      // tentacules
      var tent = [];
      for (var i = 0; i < 6; i++) {
        var a = i * (Math.PI * 2 / 6);
        var tg = geoMat(new THREE.CapsuleGeometry(0.1, 0.34, 6, 12), skin);
        tg.position.set(Math.cos(a) * 0.42, -0.42, Math.sin(a) * 0.42); tg.rotation.x = Math.sin(a) * 0.3; tg.rotation.z = -Math.cos(a) * 0.3;
        bob.add(tg); tent.push(tg);
      }
      parts.tick.push(function (t) { tent.forEach(function (tg, i) { tg.position.y = -0.42 + Math.sin(t * 3 + i) * 0.05; }); });
    }

    /* ------------------------------------------------ ÉLÉMENTAIRES */
    function buildFire() {
      var flame = std(primary, 0.3, 0, primary, 0.9);
      var body = sph(0.58, flame, 32, 24); body.scale.set(1, 1.4, 1); body.position.y = 0.2; bob.add(body); parts.breathe.push(body);
      var tip = cone(0.34, 0.7, flame, 16); tip.position.y = 0.95; bob.add(tip);
      var inner = std(accent, 0.3, 0, accent, 1.1);
      var ic = cone(0.18, 0.55, inner, 12); ic.position.y = 0.55; bob.add(ic);
      head.position.y = 0.34; cfgT.faceR = 0.5; cfgT.faceZ = 0.52; cfgT.topY = 0.9; cfgT.footY = -0.45;
      parts.tick.push(function (t) { flame.emissiveIntensity = 0.8 + Math.sin(t * 8) * 0.25; inner.emissiveIntensity = 1.0 + Math.sin(t * 11) * 0.3; tip.scale.y = 1 + Math.sin(t * 9) * 0.14; });
    }
    function buildWater() {
      var drop = glass(primary, 0.75, 0.05); drop.metalness = 0.1; track(drop);
      var body = sph(0.6, drop, 34, 26); body.scale.set(1, 1.15, 1); body.position.y = 0.15; bob.add(body); parts.breathe.push(body);
      var tip = cone(0.26, 0.5, drop, 20); tip.position.y = 0.86; bob.add(tip);
      var shine = sph(0.12, std(white, 0.1, 0.1, white, 0.5), 14, 10); shine.position.set(-0.2, 0.35, 0.4); bob.add(shine);
      head.position.y = 0.28; cfgT.faceR = 0.5; cfgT.faceZ = 0.5; cfgT.topY = 0.86; cfgT.footY = -0.5;
    }
    function buildPlant() {
      var sprout = std(primary, 0.6, 0.03);
      var pot = std(accent, 0.6, 0.05);
      var potM = cyl(0.4, 0.34, 0.44, pot, 20); potM.position.y = -0.4; bob.add(potM);
      var soil = cyl(0.4, 0.4, 0.06, std(C('#5a4632'), 0.8, 0), 20); soil.position.y = -0.2; bob.add(soil);
      var body = sph(0.5, sprout, 30, 24); body.position.y = 0.16; bob.add(body); parts.breathe.push(body);
      head.position.y = 0.16; cfgT.faceR = 0.5; cfgT.faceZ = 0.46; cfgT.topY = 0.5; cfgT.footY = -0.62;
      // feuilles
      [-1, 1].forEach(function (s) { var leaf = sph(0.18, sprout, 16, 12); leaf.scale.set(0.5, 1, 0.3); leaf.position.set(s * 0.28, 0.55, 0); leaf.rotation.z = -s * 0.5; head.add(leaf); });
      var bud = sph(0.1, std(C('#FFD23F'), 0.4, 0.05), 14, 10); bud.position.set(0, 0.66, 0); head.add(bud);
    }
    function buildLightning() {
      var spark = std(primary, 0.3, 0.1, primary, 0.85);
      var body = sph(0.56, spark, 30, 24); body.scale.set(1, 1.05, 1); body.position.y = 0.1; bob.add(body); parts.breathe.push(body);
      head.position.y = 0.2; cfgT.faceR = 0.5; cfgT.faceZ = 0.46; cfgT.topY = 0.6; cfgT.footY = -0.5;
      // éclairs pointus
      var bolts = [];
      for (var i = 0; i < 6; i++) { var a = i * (Math.PI * 2 / 6); var b = cone(0.09, 0.4, std(accent, 0.3, 0.1, accent, 1), 4); b.position.set(Math.cos(a) * 0.6, 0.1, Math.sin(a) * 0.6); b.rotation.z = -Math.cos(a) * 1.2; b.rotation.x = Math.sin(a) * 1.2; bob.add(b); bolts.push(b); }
      var crest = cone(0.12, 0.5, std(accent, 0.3, 0.1, accent, 1), 4); crest.position.y = 0.62; head.add(crest);
      parts.tick.push(function (t) { spark.emissiveIntensity = 0.7 + Math.abs(Math.sin(t * 7)) * 0.5; bolts.forEach(function (b, i) { b.material.emissiveIntensity = 0.6 + Math.abs(Math.sin(t * 9 + i)) * 0.7; }); });
    }

    /* ------------------------------------------------ CUPCAKE */
    function buildCupcake() {
      var wrapMat = std(accent, 0.6, 0.03);
      var creamMat = std(primary, 0.5, 0.03);
      var wrap = cyl(0.5, 0.36, 0.5, wrapMat, 24); wrap.position.y = -0.3; bob.add(wrap);
      // cannelures
      for (var i = 0; i < 12; i++) { var a = i * (Math.PI * 2 / 12); var rib = boxm(0.03, 0.5, 0.06, std(shadeCol(THREE, accent, -12), 0.6, 0.03)); rib.position.set(Math.cos(a) * 0.46, -0.3, Math.sin(a) * 0.46); rib.lookAt(0, -0.3, 0); bob.add(rib); }
      // crème tourbillon
      var c1 = sph(0.46, creamMat, 28, 22); c1.scale.set(1, 0.7, 1); c1.position.y = 0.08; bob.add(c1); parts.breathe.push(c1);
      var c2 = sph(0.34, creamMat, 26, 20); c2.scale.set(1, 0.7, 1); c2.position.y = 0.34; bob.add(c2);
      var c3 = sph(0.22, creamMat, 22, 18); c3.scale.set(1, 0.8, 1); c3.position.y = 0.54; bob.add(c3);
      var cherry = sph(0.11, std(C('#FF5A5A'), 0.3, 0.05), 16, 12); cherry.position.y = 0.72; bob.add(cherry);
      head.position.y = 0.05; cfgT.faceR = 0.42; cfgT.faceZ = 0.44; cfgT.topY = 0.7; cfgT.footY = -0.56;
    }

    /* ------------------------------------------------ POMME */
    function buildApple() {
      var skinMat = std(primary, 0.4, 0.05);
      var body = sph(0.66, skinMat, 34, 28); body.scale.set(1, 0.94, 1); body.position.y = 0.02; bob.add(body); parts.breathe.push(body);
      // creux du haut
      var dent = sph(0.16, std(shadeCol(THREE, primary, -18), 0.5, 0), 16, 12); dent.position.set(0, 0.6, 0); bob.add(dent);
      var stem = cyl(0.03, 0.04, 0.2, std(C('#5a4632'), 0.8, 0), 8); stem.position.y = 0.72; bob.add(stem);
      var leaf = sph(0.12, std(C('#5ED17b'), 0.5, 0.03), 16, 12); leaf.scale.set(1.4, 1, 0.4); leaf.position.set(0.16, 0.74, 0); leaf.rotation.z = -0.5; bob.add(leaf);
      head.position.y = 0.05; cfgT.faceR = 0.5; cfgT.faceZ = 0.52; cfgT.topY = 0.66; cfgT.footY = -0.6;
      buildArms(skinMat, 'blobArm'); buildFeet(std(shadeCol(THREE, primary, -12), 0.5, 0.03));
    }

    /* ------------------------------------------------ GOLEM */
    function buildGolem() {
      var rock = std(primary, 0.85, 0.02);
      var body = geoMat(new THREE.BoxGeometry(0.9, 0.8, 0.7, 3, 3, 3), rock); roundify(body.geometry, 0.1); body.position.y = 0; bob.add(body); parts.breathe.push(body);
      // cristaux d'accent
      [[0.3, 0.2, 0.3], [-0.3, 0.1, -0.3], [0, 0.3, -0.4]].forEach(function (p) { var cr = geoMat(new THREE.OctahedronGeometry(0.12), std(accent, 0.2, 0.1, accent, 0.6)); cr.position.set(p[0], p[1], p[2]); bob.add(cr); });
      var h = geoMat(new THREE.BoxGeometry(0.72, 0.62, 0.66, 3, 3, 3), rock); roundify(h.geometry, 0.1); head.add(h); head.position.y = 0.74;
      cfgT.faceR = 0.4; cfgT.faceZ = 0.36; cfgT.topY = 0.4; cfgT.armX = 0.6; cfgT.armY = 0.05; cfgT.footY = -0.72;
      buildArms(rock, 'capsule'); buildFeet(rock);
    }

    /* ------------------------------------------------ NUAGE */
    function buildCloud() {
      var mm = std(white, 0.9, 0.0);
      var pts = [[0, 0.1, 0, 0.5], [-0.42, 0.02, 0.05, 0.34], [0.42, 0.02, 0.05, 0.34], [-0.18, 0.06, 0.3, 0.3], [0.2, 0.06, -0.28, 0.32], [0, 0.32, 0, 0.34]];
      pts.forEach(function (a, i) { var s = sph(a[3], mm, 22, 18); s.position.set(a[0], a[1], a[2]); bob.add(s); if (i === 0) parts.breathe.push(s); });
      head.position.y = 0.16; cfgT.faceR = 0.44; cfgT.faceZ = 0.44; cfgT.topY = 0.5; cfgT.footY = -0.42;
      // petite pluie/éclair d'accent
      var drop = cone(0.08, 0.2, std(accent, 0.4, 0.1, accent, 0.5), 4); drop.rotation.x = Math.PI; drop.position.set(0, -0.4, 0.2); bob.add(drop);
    }

    /* ------------------------------------------------ ÉTOILE */
    function buildStarType() {
      var starMat = std(primary, 0.4, 0.08, primary, 0.35);
      var body = makeStar(THREE, 0.72, starMat); body.scale.z = 0.5; body.position.y = 0.05; bob.add(body); parts.breathe.push(body);
      track(body.geometry);
      head.position.y = 0.05; cfgT.faceR = 0.42; cfgT.faceZ = 0.28; cfgT.topY = 0.7; cfgT.footY = -0.6;
      buildArms(starMat, 'blobArm'); buildFeet(std(accent, 0.4, 0.05));
    }

    /* ------------------------------------------------ LICORNE */
    function buildUnicorn() {
      var fur = std(primary, 0.55, 0.03);
      animalBase(fur, { headR: 0.5, bodyR: 0.64 });
      // museau allongé
      var snout = sph(0.28, fur, 22, 18); snout.scale.set(0.8, 0.8, 1.1); snout.position.set(0, -0.14, 0.4); head.add(snout);
      nose(-0.2, 0.6, 0.04, std(C('#f4a6c4'), 0.5, 0));
      [-1, 1].forEach(function (s) { var ear = cone(0.1, 0.24, fur, 5); ear.position.set(s * 0.28, 0.52, -0.04); ear.rotation.z = -s * 0.2; head.add(ear); });
      // corne dorée torsadée
      var horn = cone(0.09, 0.5, std(C('#FFD24D'), 0.3, 0.6), 12); horn.position.set(0, 0.66, 0.1); head.add(horn);
      // crinière arc-en-ciel
      var maneCols = ['#FF6B6B', '#FFA53D', '#FFE04D', '#5ED17b', '#4FB8FF', '#9B5DE5'];
      maneCols.forEach(function (c, i) { var m = sph(0.12, std(C(c), 0.5, 0.05), 14, 10); m.position.set(-0.05, 0.4 - i * 0.16, -0.36); head.add(m); });
      // queue arc-en-ciel
      maneCols.forEach(function (c, i) { var q = sph(0.1, std(C(c), 0.5, 0.05), 12, 10); q.position.set(0.02, -0.05 - i * 0.02, -0.66 - i * 0.03); bob.add(q); });
      buildArms(fur, 'blobArm'); buildFeet(std(C('#FFD24D'), 0.3, 0.4));
    }

    /* ------------------------------------------------ DRAGON */
    function buildDragon() {
      var scale = std(primary, 0.5, 0.06);
      var belly = std(accent, 0.5, 0.04);
      var body = sph(0.62, scale, 32, 26); body.scale.set(1, 1.05, 1.1); body.position.y = 0.02; bob.add(body); parts.breathe.push(body);
      var bel = sph(0.46, belly, 26, 20); bel.scale.set(0.75, 1, 0.4); bel.position.set(0, -0.05, 0.36); bob.add(bel);
      var h = sph(0.5, scale, 30, 24); head.add(h); head.position.y = 0.72;
      cfgT.faceR = 0.5; cfgT.faceZ = 0.46; cfgT.topY = 0.5; cfgT.footY = -0.72;
      var snout = sph(0.26, scale, 20, 16); snout.scale.set(1, 0.7, 1); snout.position.set(0, -0.14, 0.42); head.add(snout);
      // cornes
      [-1, 1].forEach(function (s) { var horn = cone(0.08, 0.28, std(accent, 0.4, 0.1), 8); horn.position.set(s * 0.22, 0.48, -0.1); horn.rotation.z = s * 0.3; head.add(horn); });
      // ailes membranées
      var wingMat = std(accent, 0.5, 0.04);
      [-1, 1].forEach(function (s) { var w = sph(0.34, wingMat, 18, 12); w.scale.set(0.12, 1, 0.9); w.position.set(s * 0.6, 0.25, -0.2); w.rotation.z = s * 0.4; w.rotation.y = s * 0.5; bob.add(w); if (s < 0) parts._wL = w; else parts._wR = w; });
      parts.tick.push(function (t) { if (parts._wL) { parts._wL.rotation.z = 0.4 + Math.sin(t * 4) * 0.25; parts._wR.rotation.z = -0.4 - Math.sin(t * 4) * 0.25; } });
      // crête dorsale
      [0.35, 0.1, -0.15, -0.4].forEach(function (z, i) { var pl = cone(0.1, 0.18, std(accent, 0.4, 0.06), 4); pl.position.set(0, 0.2 + z, -0.4 - i * 0.03); pl.rotation.x = -0.3; bob.add(pl); });
      var q = cone(0.16, 0.5, scale, 10); q.rotation.x = -Math.PI / 2; q.position.set(0, -0.1, -0.66); bob.add(q);
      buildArms(scale, 'blobArm'); buildFeet(scale);
    }

    /* ------------------------------------------------ LÉGENDE (ultime) */
    function buildLegend() {
      var gold = std(C('#FFD24D'), 0.2, 0.95, C('#FFB01F'), 0.25);
      var goldLight = std(C('#FFE9A8'), 0.15, 0.9, C('#FFD24D'), 0.3);
      var body = sph(0.62, gold, 40, 32); body.scale.set(1, 0.98, 1); body.position.y = 0.05; bob.add(body); parts.breathe.push(body);
      var chest = sph(0.34, goldLight, 26, 20); chest.scale.set(1, 0.9, 0.4); chest.position.set(0, 0.02, 0.42); bob.add(chest);
      var h = sph(0.52, gold, 36, 28); head.add(h); head.position.y = 0.76;
      cfgT.faceR = 0.52; cfgT.faceZ = 0.46; cfgT.topY = 0.52; cfgT.armX = 0.6; cfgT.armY = 0.05; cfgT.footY = -0.78;
      // oreilles/rubis
      [-1, 1].forEach(function (s) { var ear = geoMat(new THREE.OctahedronGeometry(0.12), std(C('#7BE7FF'), 0.1, 0.3, C('#4FB8FF'), 0.5)); ear.position.set(s * 0.5, 0.1, 0); head.add(ear); });
      // couronne intégrée
      var band = tor(0.42, 0.06, goldLight, 14); band.rotation.x = Math.PI / 2; band.position.y = 0.5; head.add(band);
      for (var i = 0; i < 5; i++) { var a = (i / 5) * Math.PI * 2; var sp = cone(0.06, 0.2, goldLight, 6); sp.position.set(Math.cos(a) * 0.4, 0.6, Math.sin(a) * 0.4); head.add(sp); var gem = geoMat(new THREE.OctahedronGeometry(0.05), std(C('#FF5A9E'), 0.1, 0.3, C('#FF5A9E'), 0.6)); gem.position.set(Math.cos(a) * 0.4, 0.7, Math.sin(a) * 0.4); head.add(gem); }
      // ailes dorées
      [-1, 1].forEach(function (s) { for (var k = 0; k < 3; k++) { var fe = sph(0.2, goldLight, 16, 12); fe.scale.set(0.12, 1, 0.5); fe.position.set(s * (0.6 + k * 0.12), 0.2 + k * 0.14, -0.3 - k * 0.05); fe.rotation.z = s * (0.5 + k * 0.15); bob.add(fe); } });
      // aura permanente dorée
      var auraG = new THREE.Group(); bob.add(auraG);
      var motes = [];
      for (var j = 0; j < 16; j++) { var mm = sph(0.06, std(C('#FFE9A8'), 0.1, 0.2, C('#FFD24D'), 1), 8, 6); auraG.add(mm); motes.push(mm); }
      var ring = tor(1.05, 0.03, std(C('#FFE9A8'), 0.1, 0.2, C('#FFD24D'), 0.8), 10); ring.rotation.x = Math.PI / 2; ring.position.y = -0.6; auraG.add(ring);
      parts.tick.push(function (t) { auraG.rotation.y = t * 0.5; motes.forEach(function (m, i) { var a = t * 1.5 + i * (Math.PI * 2 / motes.length); var rr = 0.95 + Math.sin(t * 2 + i) * 0.12; m.position.set(Math.cos(a) * rr, 0.2 + Math.sin(t * 2.5 + i) * 0.6, Math.sin(a) * rr); m.material.emissiveIntensity = 0.6 + 0.6 * Math.abs(Math.sin(t * 3 + i)); }); });
      buildArms(gold, 'capsule'); buildFeet(goldLight);
    }

    /* ---- Bras (pivot à l'épaule pour le salut) ---- */
    function buildArms(mat, kind) {
      [-1, 1].forEach(function (s) {
        var pivot = new THREE.Group();
        pivot.position.set(s * cfgT.armX, cfgT.armY, 0);
        var arm;
        if (kind === 'capsule') arm = geoMat(new THREE.CapsuleGeometry(0.11, 0.34, 8, 16), mat);
        else arm = sph(0.17, mat, 20, 16);
        if (kind === 'blobArm') arm.scale.set(0.8, 1.3, 0.8);
        arm.position.y = -0.28;
        var hand = sph(0.11, mat, 16, 12); hand.position.y = -0.5; pivot.add(hand);
        pivot.add(arm); pivot.rotation.z = s * 0.28; bob.add(pivot);
        if (s < 0) parts.armL = pivot; else parts.armR = pivot;
      });
    }
    function buildFeet(mat) {
      [-1, 1].forEach(function (s) {
        var foot = sph(0.2, mat, 20, 14); foot.scale.set(1, 0.55, 1.35); foot.position.set(s * 0.28, cfgT.footY + 0.02, 0.08); bob.add(foot);
      });
    }

    /* ---- Coins arrondis d'une BoxGeometry ---- */
    function roundify(geo, r) {
      var pos = geo.attributes.position, v = new THREE.Vector3();
      geo.computeBoundingBox();
      var bb = geo.boundingBox, hx = (bb.max.x - bb.min.x) / 2, hy = (bb.max.y - bb.min.y) / 2, hz = (bb.max.z - bb.min.z) / 2;
      for (var i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        var nx = v.x / hx, ny = v.y / hy, nz = v.z / hz;
        v.x -= Math.sign(v.x) * r * Math.min(1, Math.abs(nx)) * Math.min(1, Math.abs(ny) + Math.abs(nz)) * 0.5;
        v.y -= Math.sign(v.y) * r * Math.min(1, Math.abs(ny)) * Math.min(1, Math.abs(nx) + Math.abs(nz)) * 0.5;
        v.z -= Math.sign(v.z) * r * Math.min(1, Math.abs(nz)) * Math.min(1, Math.abs(nx) + Math.abs(ny)) * 0.5;
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      pos.needsUpdate = true; geo.computeVertexNormals();
    }
    function shadeCol(THREE, col, p) { var c = col.clone(); var hsl = {}; c.getHSL(hsl); hsl.l = Math.max(0, Math.min(1, hsl.l + p / 100)); c.setHSL(hsl.h, hsl.s, hsl.l); return c; }

    var TYPES = {
      robot: buildRobot, blob: buildBlob, animal: buildAnimal, chat: buildCat, renard: buildFox,
      panda: buildPanda, pingouin: buildPenguin, lapin: buildRabbit, poussin: buildChick, abeille: buildBee,
      grenouille: buildFrog, dino: buildDino, cochon: buildPig, mouton: buildSheep, koala: buildKoala,
      hibou: buildOwl, astro: buildAstro, alien: buildAlien, fantome: buildGhost, champignon: buildMushroom,
      poulpe: buildOctopus, feu: buildFire, eau: buildWater, plante: buildPlant, foudre: buildLightning,
      cupcake: buildCupcake, pomme: buildApple, golem: buildGolem, nuage: buildCloud, etoile: buildStarType,
      licorne: buildUnicorn, dragon: buildDragon, legend: buildLegend
    };
    (TYPES[cfg.type] || buildRobot)();

    /* ---- VISAGE (yeux + bouche + joues) — enfant de la tête ---- */
    var face = new THREE.Group(); head.add(face);
    var faceR = cfgT.faceR, fz = cfgT.faceZ;
    var eyeMatW = std(white, 0.25, 0.0);
    var eyeMatD = std(dark, 0.2, 0.05);

    function makeEye(sx) {
      var g = new THREE.Group();
      var w = geoMat(new THREE.SphereGeometry(faceR * 0.2, 20, 16), eyeMatW); w.scale.z = 0.55; g.add(w);
      var p = geoMat(new THREE.SphereGeometry(faceR * 0.11, 16, 12), eyeMatD); p.position.z = faceR * 0.12; g.add(p);
      var hl = geoMat(new THREE.SphereGeometry(faceR * 0.045, 10, 8), std(white, 0.1, 0, white, 0.8)); hl.position.set(faceR * 0.05, faceR * 0.06, faceR * 0.18); g.add(hl);
      g.position.set(sx * faceR * 0.4, faceR * 0.12, fz); face.add(g); return g;
    }
    parts.eyeL = makeEye(-1); parts.eyeR = makeEye(1);

    var blushMat = std(new THREE.Color('#ff8fb0'), 0.5, 0, new THREE.Color('#ff8fb0'), 0.15);
    [-1, 1].forEach(function (s) {
      var b = geoMat(new THREE.CircleGeometry(faceR * 0.13, 20), blushMat);
      b.position.set(s * faceR * 0.55, -faceR * 0.08, fz + 0.01); face.add(b);
      if (s < 0) parts.blushL = b; else parts.blushR = b;
    });

    var mouthMat = std(new THREE.Color('#5a2740'), 0.4, 0.0);
    var mouth = new THREE.Mesh(mouthGeo(THREE, 'smile', faceR), mouthMat);
    track(mouthMat);
    mouth.position.set(0, -faceR * 0.28, fz + 0.02); face.add(mouth); parts.mouth = mouth;
    parts.faceR = faceR; parts.mouthMat = mouthMat; parts.face = face;

    /* ---- Cosmétiques équipables ---- */
    buildHat(cfg.hat); buildGlasses(cfg.glasses); buildOutfit(cfg.outfit);
    buildAura(cfg.aura); buildFamiliar(cfg.familiar); buildPedestal(cfg.pedestal);

    /* ---- Expression initiale ---- */
    applyExpression(THREE, parts, cfg.eyes);

    /* ============================ COSMÉTIQUES ============================ */
    function buildHat(id) {
      if (!id || id === 'none') return;
      var r = cfgT.faceR, topY = cfgT.topY, fz = cfgT.faceZ;
      var accMat = std(accent, 0.5, 0.1);
      switch (id) {
        case 'noeud': {
          [-1, 1].forEach(function (s) { var wing = cone(r * 0.22, r * 0.34, accMat, 20); wing.rotation.z = s * Math.PI / 2; wing.position.set(s * r * 0.24, topY + r * 0.05, 0); head.add(wing); });
          var knot = sph(r * 0.1, accMat, 16, 12); knot.position.set(0, topY + r * 0.05, 0); head.add(knot); break;
        }
        case 'casque': {
          var band = tor(r * 0.92, r * 0.08, std(C('#26283f'), 0.5, 0.2), 12, Math.PI); band.position.y = r * 0.2; head.add(band);
          [-1, 1].forEach(function (s) { var cup = cyl(r * 0.2, r * 0.2, r * 0.18, accMat, 20); cup.rotation.z = Math.PI / 2; cup.position.set(s * r * 0.92, r * 0.1, 0); head.add(cup); }); break;
        }
        case 'casquette': {
          var dome = sph(r * 0.62, accMat, 24, 8, 0, Math.PI * 2, 0, Math.PI / 2); dome.position.y = topY - r * 0.1; head.add(dome);
          var visor = sph(r * 0.5, accMat, 20, 8, 0, Math.PI, 0, Math.PI / 2); visor.scale.set(1, 0.2, 1.3); visor.position.set(0, topY - r * 0.14, fz * 0.7); head.add(visor); break;
        }
        case 'chapeau': {
          var brim = cyl(r * 0.85, r * 0.85, r * 0.08, accMat, 28); brim.position.y = topY + r * 0.02; head.add(brim);
          var top = cyl(r * 0.5, r * 0.55, r * 0.7, accMat, 28); top.position.y = topY + r * 0.42; head.add(top);
          var stripe = tor(r * 0.53, r * 0.05, std(primary, 0.4, 0.1), 10); stripe.rotation.x = Math.PI / 2; stripe.position.y = topY + r * 0.14; head.add(stripe); break;
        }
        case 'beanie': {
          var cap = sph(r * 0.7, std(accent, 0.85, 0), 24, 12, 0, Math.PI * 2, 0, Math.PI / 1.7); cap.position.y = topY - r * 0.05; head.add(cap);
          var fold = tor(r * 0.66, r * 0.08, std(shadeCol(THREE, accent, -10), 0.85, 0), 10); fold.rotation.x = Math.PI / 2; fold.position.y = topY - r * 0.1; head.add(fold);
          var pom = sph(r * 0.16, std(white, 0.85, 0), 16, 12); pom.position.y = topY + r * 0.62; head.add(pom); break;
        }
        case 'party': {
          var hat = cone(r * 0.4, r * 0.9, std(accent, 0.5, 0.1), 20); hat.position.y = topY + r * 0.5; head.add(hat);
          var pom2 = sph(r * 0.12, std(primary, 0.4, 0.1), 14, 10); pom2.position.y = topY + r * 0.98; head.add(pom2);
          ['#FF6B6B', '#4FB8FF', '#5ED17b'].forEach(function (c, i) { var d = tor(r * (0.24 + i * 0.06), r * 0.03, std(C(c), 0.5, 0.05), 8); d.rotation.x = Math.PI / 2; d.position.y = topY + r * (0.28 + i * 0.22); head.add(d); }); break;
        }
        case 'fleur': {
          var petMat = std(accent, 0.5, 0.03);
          for (var i = 0; i < 5; i++) { var a = (i / 5) * Math.PI * 2; var pet = sph(r * 0.14, petMat, 14, 10); pet.scale.set(1, 0.5, 1.4); pet.position.set(Math.cos(a) * r * 0.28 - r * 0.42, topY + r * 0.2, Math.sin(a) * r * 0.28 + fz * 0.4); head.add(pet); }
          var mid = sph(r * 0.1, std(C('#FFD23F'), 0.5, 0.05), 14, 10); mid.position.set(-r * 0.42, topY + r * 0.2, fz * 0.4); head.add(mid); break;
        }
        case 'cornes': {
          [-1, 1].forEach(function (s) { var horn = cone(r * 0.12, r * 0.34, std(accent, 0.4, 0.1), 10); horn.position.set(s * r * 0.34, topY + r * 0.12, 0); horn.rotation.z = s * 0.4; head.add(horn); }); break;
        }
        case 'couronne': {
          var band2 = tor(r * 0.6, r * 0.08, std(C('#FFD24D'), 0.3, 0.7), 14); band2.rotation.x = Math.PI / 2; band2.position.y = topY + r * 0.1; head.add(band2);
          for (var j = 0; j < 6; j++) { var a2 = (j / 6) * Math.PI * 2; var sp = cone(r * 0.08, r * 0.24, std(C('#FFD24D'), 0.3, 0.7), 6); sp.position.set(Math.cos(a2) * r * 0.56, topY + r * 0.26, Math.sin(a2) * r * 0.56); head.add(sp); }
          var gem = geoMat(new THREE.OctahedronGeometry(r * 0.08), std(C('#FF5A9E'), 0.1, 0.3, C('#FF5A9E'), 0.5)); gem.position.set(0, topY + r * 0.14, r * 0.56); head.add(gem); break;
        }
        case 'halo': {
          var halo = tor(r * 0.42, r * 0.05, std(C('#FFE9A8'), 0.2, 0.3, C('#FFD24D'), 1), 12); halo.rotation.x = Math.PI / 2.2; halo.position.y = topY + r * 0.55; head.add(halo);
          parts.tick.push(function (t) { halo.material.emissiveIntensity = 0.7 + Math.sin(t * 2) * 0.3; }); break;
        }
        case 'mage': {
          var brim2 = cyl(r * 0.9, r * 0.9, r * 0.06, std(C('#3A3F5C'), 0.6, 0.05), 24); brim2.position.y = topY + r * 0.04; head.add(brim2);
          var cone2 = cone(r * 0.5, r * 1.1, std(C('#3A3F5C'), 0.6, 0.05), 24); cone2.position.y = topY + r * 0.6; cone2.rotation.z = 0.12; head.add(cone2);
          ['#FFD24D', '#4FB8FF'].forEach(function (c, i) { var st = makeStar(THREE, r * 0.1, std(C(c), 0.3, 0.1, C(c), 0.6)); track(st.geometry); st.position.set(r * 0.1, topY + r * (0.5 + i * 0.3), r * 0.4); head.add(st); }); break;
        }
        case 'couronneor': {
          var cb = tor(r * 0.62, r * 0.1, std(C('#FFD24D'), 0.15, 0.95, C('#FFB01F'), 0.4), 16); cb.rotation.x = Math.PI / 2; cb.position.y = topY + r * 0.12; head.add(cb);
          for (var k = 0; k < 8; k++) { var a3 = (k / 8) * Math.PI * 2; var sp2 = cone(r * 0.1, r * 0.3, std(C('#FFE9A8'), 0.15, 0.9, C('#FFD24D'), 0.5), 6); sp2.position.set(Math.cos(a3) * r * 0.58, topY + r * 0.3, Math.sin(a3) * r * 0.58); head.add(sp2); var g2 = geoMat(new THREE.OctahedronGeometry(r * 0.07), std(C('#7BE7FF'), 0.1, 0.3, C('#4FB8FF'), 0.6)); g2.position.set(Math.cos(a3) * r * 0.58, topY + r * 0.44, Math.sin(a3) * r * 0.58); head.add(g2); }
          parts.tick.push(function (t) { cb.material.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.2; }); break;
        }
        default: {
          var it = findItem(OPTIONS.hat, id);
          if (it && it.look) genHat(it.look, r, topY, fz);
        }
      }
    }

    /* Chapeaux génériques (nouveaux déblocables) : formes paramétrées. */
    function genHat(lk, r, topY, fz) {
      var c1 = std(C(lk.c1 || '#3A3F5C'), 0.6, 0.05);
      switch (lk.kind) {
        case 'beret': {
          var b = sph(r * 0.68, c1, 22, 10, 0, Math.PI * 2, 0, Math.PI / 2.6); b.scale.y = 0.5; b.position.y = topY + r * 0.02; b.rotation.z = 0.22; head.add(b);
          var stem = cyl(r * 0.03, r * 0.03, r * 0.12, c1, 6); stem.position.set(-r * 0.14, topY + r * 0.28, 0); head.add(stem); break;
        }
        case 'toque': {
          var wm = std(white, 0.85, 0);
          var base = cyl(r * 0.5, r * 0.52, r * 0.34, wm, 22); base.position.y = topY + r * 0.16; head.add(base);
          [[0, 0.42, 0.3, 0], [-0.26, 0.4, 0.24, 0.1], [0.26, 0.4, 0.24, 0.1], [0, 0.4, 0.24, -0.24]].forEach(function (p) { var puff = sph(r * p[2], wm, 16, 12); puff.position.set(p[0] * r, topY + r * p[1], p[3] * r); head.add(puff); }); break;
        }
        case 'pirate': {
          var dm = std(C('#26283f'), 0.6, 0.05);
          var dome = sph(r * 0.66, dm, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2.2); dome.position.y = topY - r * 0.06; head.add(dome);
          var brim = tor(r * 0.66, r * 0.09, dm, 10, Math.PI); brim.rotation.x = Math.PI / 2; brim.rotation.z = Math.PI; brim.position.set(0, topY + r * 0.06, r * 0.06); head.add(brim);
          var band = tor(r * 0.62, r * 0.04, std(C('#FFD24D'), 0.3, 0.6), 8); band.rotation.x = Math.PI / 2; band.position.y = topY - r * 0.02; head.add(band); break;
        }
        case 'viking': {
          var mm = std(C('#B8C0D8'), 0.35, 0.7);
          var dome2 = sph(r * 0.64, mm, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2.1); dome2.position.y = topY - r * 0.04; head.add(dome2);
          var rim = tor(r * 0.6, r * 0.05, std(C('#8B9AB8'), 0.4, 0.6), 8); rim.rotation.x = Math.PI / 2; rim.position.y = topY - r * 0.02; head.add(rim);
          [-1, 1].forEach(function (s) { var horn = cone(r * 0.11, r * 0.34, std(C('#F2EBDD'), 0.5, 0.05), 10); horn.position.set(s * r * 0.5, topY + r * 0.2, 0); horn.rotation.z = s * 0.7; head.add(horn); }); break;
        }
        case 'santa': {
          var red = std(C('#E8556B'), 0.6, 0.02);
          var cone3 = cone(r * 0.46, r * 0.85, red, 18); cone3.position.set(r * 0.1, topY + r * 0.4, 0); cone3.rotation.z = -0.3; head.add(cone3);
          var band3 = tor(r * 0.5, r * 0.09, std(white, 0.9, 0), 10); band3.rotation.x = Math.PI / 2; band3.position.y = topY + r * 0.04; head.add(band3);
          var pom3 = sph(r * 0.12, std(white, 0.9, 0), 14, 10); pom3.position.set(r * 0.34, topY + r * 0.78, 0); head.add(pom3); break;
        }
        case 'wreath': {
          var cols = lk.cols || ['#FF9EC4', '#FFE04D'];
          for (var i = 0; i < 8; i++) { var a = (i / 8) * Math.PI * 2; var f = sph(r * 0.1, std(C(cols[i % cols.length]), 0.5, 0.03), 12, 8); f.position.set(Math.cos(a) * r * 0.56, topY + r * 0.06, Math.sin(a) * r * 0.56); head.add(f); }
          var leaf = tor(r * 0.56, r * 0.03, std(C('#7BC86C'), 0.6, 0), 8); leaf.rotation.x = Math.PI / 2; leaf.position.y = topY + r * 0.04; head.add(leaf); break;
        }
        case 'straw': {
          var sm = std(C('#E8C57A'), 0.7, 0);
          var brim2 = cyl(r * 0.95, r * 0.95, r * 0.06, sm, 26); brim2.position.y = topY + r * 0.02; head.add(brim2);
          var dome3 = sph(r * 0.55, sm, 22, 9, 0, Math.PI * 2, 0, Math.PI / 2.4); dome3.position.y = topY; head.add(dome3);
          var rib = tor(r * 0.52, r * 0.045, std(C('#E8556B'), 0.5, 0.05), 8); rib.rotation.x = Math.PI / 2; rib.position.y = topY + r * 0.08; head.add(rib); break;
        }
        case 'dome': {
          var cap2 = sph(r * 0.68, c1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 1.8); cap2.position.y = topY - r * 0.04; head.add(cap2);
          if (lk.pom) { var pm = sph(r * 0.14, std(C(lk.pom), 0.6, 0.05), 14, 10); pm.position.y = topY + r * 0.6; head.add(pm); } break;
        }
        case 'tophat': {
          var brim3 = cyl(r * 0.85, r * 0.85, r * 0.08, c1, 26); brim3.position.y = topY + r * 0.02; head.add(brim3);
          var top2 = cyl(r * 0.52, r * 0.56, r * 0.55, c1, 26); top2.position.y = topY + r * 0.34; head.add(top2);
          var band4 = tor(r * 0.55, r * 0.05, std(C(lk.band || '#26283f'), 0.5, 0.1), 8); band4.rotation.x = Math.PI / 2; band4.position.y = topY + r * 0.14; head.add(band4); break;
        }
      }
    }

    function buildGlasses(id) {
      if (!id || id === 'none') return;
      var r = cfgT.faceR, fz = cfgT.faceZ;
      var gz = fz + r * 0.18;
      var frame = std(C('#26283f'), 0.3, 0.4);
      switch (id) {
        case 'lunettes': {
          [-1, 1].forEach(function (s) { var ring = tor(r * 0.22, r * 0.04, frame, 10); ring.position.set(s * r * 0.4, r * 0.12, gz); head.add(ring); });
          var bridge = cyl(r * 0.03, r * 0.03, r * 0.28, frame, 8); bridge.rotation.z = Math.PI / 2; bridge.position.set(0, r * 0.12, gz); head.add(bridge); break;
        }
        case 'soleil': {
          [-1, 1].forEach(function (s) { var lens = sph(r * 0.24, std(C('#1b1c2a'), 0.15, 0.5), 18, 14); lens.scale.set(1, 0.75, 0.3); lens.position.set(s * r * 0.4, r * 0.12, gz); head.add(lens); });
          var bridge2 = cyl(r * 0.03, r * 0.03, r * 0.28, frame, 8); bridge2.rotation.z = Math.PI / 2; bridge2.position.set(0, r * 0.16, gz); head.add(bridge2); break;
        }
        case 'etoiles': {
          [-1, 1].forEach(function (s) { var st = makeStar(THREE, r * 0.26, std(accent, 0.3, 0.1, accent, 0.4)); track(st.geometry); st.position.set(s * r * 0.4, r * 0.12, gz); st.scale.z = 0.3; head.add(st); }); break;
        }
        case 'monocle': {
          var ring2 = tor(r * 0.22, r * 0.045, std(C('#FFD24D'), 0.3, 0.6), 12); ring2.position.set(r * 0.4, r * 0.12, gz); head.add(ring2);
          var chain = cyl(r * 0.01, r * 0.01, r * 0.4, std(C('#FFD24D'), 0.3, 0.6), 6); chain.position.set(r * 0.5, -r * 0.05, gz); chain.rotation.z = 0.3; head.add(chain); break;
        }
        case 'coeur': {
          [-1, 1].forEach(function (s) { var h1 = sph(r * 0.13, std(C('#FF7BAC'), 0.3, 0.1, C('#FF7BAC'), 0.3), 14, 10); h1.scale.set(1, 1.1, 0.4); h1.position.set(s * r * 0.4, r * 0.12, gz); head.add(h1); }); break;
        }
        case 'vr': {
          var visor = geoMat(new THREE.BoxGeometry(r * 1.0, r * 0.42, r * 0.18), std(C('#1b1c2a'), 0.2, 0.5)); roundify(visor.geometry, r * 0.1); visor.position.set(0, r * 0.14, gz - r * 0.02); head.add(visor);
          var glow = geoMat(new THREE.PlaneGeometry(r * 0.8, r * 0.24), std(accent, 0.2, 0.1, accent, 0.6)); glow.position.set(0, r * 0.14, gz + r * 0.08); head.add(glow);
          parts.tick.push(function (t) { glow.material.emissiveIntensity = 0.4 + Math.sin(t * 3) * 0.3; }); break;
        }
        default: {
          var it = findItem(OPTIONS.glasses, id);
          if (it && it.look) genGlasses(it.look, r, gz);
        }
      }
    }

    /* Lunettes génériques (nouveaux déblocables). */
    function genGlasses(lk, r, gz) {
      var fm = std(C(lk.frame || '#26283f'), 0.3, 0.4);
      var sc = lk.big ? 1.35 : 1;
      if (lk.square) {
        var w = r * 0.46 * sc, h = r * 0.34 * sc;
        var box = geoMat(new THREE.BoxGeometry(w * 2.2, h, r * 0.12), fm); roundify(box.geometry, r * 0.06); box.position.set(0, r * 0.12, gz - r * 0.02); head.add(box);
        if (lk.lens) { var pl = geoMat(new THREE.PlaneGeometry(w * 1.9, h * 0.7), std(C(lk.lens), 0.2, 0.1, C(lk.lens), 0.45)); pl.position.set(0, r * 0.12, gz + r * 0.05); head.add(pl); }
      } else {
        [-1, 1].forEach(function (s) {
          var ring = tor(r * 0.22 * sc, r * 0.04, fm, 10); ring.position.set(s * r * 0.4, r * 0.12, gz); head.add(ring);
          if (lk.lens) { var lensM = sph(r * 0.19 * sc, std(C(lk.lens), 0.2, 0.1, C(lk.lens), 0.35), 14, 10); lensM.scale.z = 0.25; lensM.position.set(s * r * 0.4, r * 0.12, gz); head.add(lensM); }
        });
        var bridge = cyl(r * 0.03, r * 0.03, r * 0.28, fm, 8); bridge.rotation.z = Math.PI / 2; bridge.position.set(0, r * 0.12, gz); head.add(bridge);
      }
    }

    function buildOutfit(id) {
      if (!id || id === 'none') return;
      var r = cfgT.faceR, fz = cfgT.faceZ, headY = cfgT.headY;
      var accMat = std(accent, 0.7, 0.0);
      switch (id) {
        case 'echarpe': {
          var scarf = tor(r * 0.72, r * 0.16, accMat, 14); scarf.position.y = -r * 0.7; scarf.rotation.x = Math.PI / 2 + 0.15; head.add(scarf);
          var tail2 = boxm(r * 0.24, r * 0.5, r * 0.1, accMat); tail2.position.set(r * 0.35, -r * 1.0, fz * 0.6); tail2.rotation.z = 0.2; head.add(tail2); break;
        }
        case 'noeudpap': {
          [-1, 1].forEach(function (s) { var wing = cone(r * 0.18, r * 0.28, accMat, 16); wing.rotation.z = s * Math.PI / 2; wing.position.set(s * r * 0.2, -r * 0.85, fz * 0.7); head.add(wing); });
          var knot = sph(r * 0.08, accMat, 14, 10); knot.position.set(0, -r * 0.85, fz * 0.7); head.add(knot); break;
        }
        case 'medaille': {
          var ribbon = boxm(r * 0.12, r * 0.4, r * 0.05, std(primary, 0.6, 0.05)); ribbon.position.set(0, -r * 0.75, fz * 0.8); head.add(ribbon);
          var medal = cyl(r * 0.16, r * 0.16, r * 0.05, std(C('#FFD24D'), 0.3, 0.7), 20); medal.rotation.x = Math.PI / 2; medal.position.set(0, -r * 1.05, fz * 0.85); head.add(medal);
          var star = makeStar(THREE, r * 0.1, std(C('#FFF0B8'), 0.3, 0.6)); track(star.geometry); star.position.set(0, -r * 1.05, fz * 0.92); star.scale.z = 0.3; head.add(star); break;
        }
        case 'cape': {
          var cape = sph(r * 1.3, std(accent, 0.7, 0.02), 24, 18, 0, Math.PI * 2, 0, Math.PI / 1.6); cape.scale.set(1, 1.1, 0.7); cape.position.set(0, -r * 1.1, -r * 0.4); head.add(cape);
          var collar = tor(r * 0.6, r * 0.1, std(shadeCol(THREE, accent, -12), 0.6, 0.05), 12); collar.position.y = -r * 0.6; collar.rotation.x = Math.PI / 2; head.add(collar); break;
        }
        case 'armure': {
          var collar2 = tor(r * 0.7, r * 0.16, std(C('#B8C0D8'), 0.4, 0.6), 14); collar2.position.y = -r * 0.72; collar2.rotation.x = Math.PI / 2; head.add(collar2);
          [-1, 1].forEach(function (s) { var pad = sph(r * 0.28, std(C('#B8C0D8'), 0.4, 0.6), 18, 14); pad.scale.set(1, 0.6, 1); pad.position.set(s * r * 0.7, -r * 0.78, 0); head.add(pad); });
          var gem2 = geoMat(new THREE.OctahedronGeometry(r * 0.1), std(accent, 0.2, 0.2, accent, 0.5)); gem2.position.set(0, -r * 0.82, fz * 0.9); head.add(gem2); break;
        }
        case 'capeor': {
          var cape2 = sph(r * 1.4, std(C('#FFD24D'), 0.2, 0.85, C('#FFB01F'), 0.2), 26, 20, 0, Math.PI * 2, 0, Math.PI / 1.6); cape2.scale.set(1, 1.15, 0.7); cape2.position.set(0, -r * 1.15, -r * 0.45); head.add(cape2);
          var collar3 = tor(r * 0.62, r * 0.12, std(C('#FFE9A8'), 0.15, 0.9, C('#FFD24D'), 0.4), 14); collar3.position.y = -r * 0.62; collar3.rotation.x = Math.PI / 2; head.add(collar3);
          parts.tick.push(function (t) { cape2.material.emissiveIntensity = 0.2 + Math.sin(t * 1.5) * 0.12; }); break;
        }
        default: {
          var it = findItem(OPTIONS.outfit, id);
          if (it && it.look) genOutfit(it.look, r, fz);
        }
      }
    }

    /* Tenues génériques (capes colorées, écharpes, colliers). */
    function genOutfit(lk, r, fz) {
      if (lk.cape) {
        var cm = std(C(lk.cape), 0.7, 0.02, lk.em ? C(lk.cape) : undefined, lk.em || 0);
        var cape = sph(r * 1.3, cm, 24, 18, 0, Math.PI * 2, 0, Math.PI / 1.6); cape.scale.set(1, 1.1, 0.7); cape.position.set(0, -r * 1.1, -r * 0.4); head.add(cape);
        var collar = tor(r * 0.6, r * 0.1, std(shadeCol(THREE, C(lk.cape), -14), 0.6, 0.05), 12); collar.position.y = -r * 0.6; collar.rotation.x = Math.PI / 2; head.add(collar);
        if (lk.stars) { for (var i = 0; i < 5; i++) { var st = makeStar(THREE, r * 0.1, std(C('#FFE04D'), 0.3, 0.1, C('#FFE04D'), 0.6)); track(st.geometry); var a = -0.9 + i * 0.45; st.position.set(Math.sin(a) * r * 1.05, -r * (1.0 + (i % 2) * 0.35), -r * 0.75); st.scale.z = 0.3; head.add(st); } }
        if (lk.rainbow) { ['#FF5A5A', '#FFA53D', '#FFE04D', '#5ED17b', '#4FB8FF'].forEach(function (c, i) { var band = tor(r * (0.7 + i * 0.14), r * 0.035, std(C(c), 0.5, 0.05), 8, Math.PI); band.position.set(0, -r * 0.75, -r * 0.55); band.rotation.x = Math.PI / 2.6; head.add(band); }); }
      } else if (lk.scarf) {
        var sm = std(C(lk.scarf), 0.7, 0);
        var scarf = tor(r * 0.72, r * 0.16, sm, 14); scarf.position.y = -r * 0.7; scarf.rotation.x = Math.PI / 2 + 0.15; head.add(scarf);
        var tailS = boxm(r * 0.24, r * 0.5, r * 0.1, sm); tailS.position.set(r * 0.35, -r * 1.0, fz * 0.6); tailS.rotation.z = 0.2; head.add(tailS);
        if (lk.c2) { [0, 1, 2].forEach(function (i) { var stripe = boxm(r * 0.26, r * 0.07, r * 0.11, std(C(lk.c2), 0.7, 0)); stripe.position.set(r * 0.35, -r * (0.85 + i * 0.14), fz * 0.6); stripe.rotation.z = 0.2; head.add(stripe); }); }
      } else if (lk.lei) {
        for (var j = 0; j < 10; j++) { var a2 = (j / 10) * Math.PI * 2; var f = sph(r * 0.1, std(C(lk.lei[j % lk.lei.length]), 0.5, 0.03), 12, 8); f.position.set(Math.cos(a2) * r * 0.66, -r * 0.72 + Math.sin(a2) * r * 0.1, Math.sin(a2) * r * 0.5 + fz * 0.2); head.add(f); }
      }
    }

    function buildAura(id) {
      if (!id || id === 'none') return;
      var aura = new THREE.Group(); bob.add(aura); parts.aura = aura;
      function em(hex, r) { return std(C(hex), 0.3, 0.1, C(hex), 1); }
      if (id === 'etincelles') {
        var items = []; for (var i = 0; i < 9; i++) { var s = sph(0.05, std(accent, 0.3, 0.1, accent, 1), 8, 6); aura.add(s); items.push(s); }
        parts.tick.push(function (t) { items.forEach(function (s, i) { var a = t * 1.2 + i * (Math.PI * 2 / items.length); var rr = 0.95 + Math.sin(t * 2 + i) * 0.12; s.position.set(Math.cos(a) * rr, 0.2 + Math.sin(t * 2.5 + i) * 0.5, Math.sin(a) * rr); s.material.emissiveIntensity = 0.6 + 0.5 * Math.abs(Math.sin(t * 3 + i)); }); });
      } else if (id === 'etoiles') {
        var stars = []; for (var j = 0; j < 6; j++) { var st = makeStar(THREE, 0.11, em('#FFD24D')); track(st.geometry); aura.add(st); stars.push(st); }
        parts.tick.push(function (t) { stars.forEach(function (s, i) { var a = t * 1.4 + i * (Math.PI * 2 / 6); s.position.set(Math.cos(a) * 1.0, 0.25 + Math.sin(t * 2 + i) * 0.3, Math.sin(a) * 1.0); s.rotation.z += 0.03; }); });
      } else if (id === 'coeurs') {
        var hearts = []; for (var k = 0; k < 6; k++) { var h = sph(0.09, em('#FF7BAC'), 10, 8); h.scale.set(1, 1.1, 0.5); aura.add(h); hearts.push(h); }
        parts.tick.push(function (t) { hearts.forEach(function (h, i) { var ph = (t * 0.5 + i / 6) % 1; h.position.set(Math.sin(i * 2 + t) * 0.6, -0.4 + ph * 1.5, Math.cos(i * 2) * 0.5); h.material.emissiveIntensity = 0.4 + (1 - ph) * 0.6; h.scale.setScalar(0.6 + ph * 0.5); }); });
      } else if (id === 'feu') {
        var flames = []; for (var m = 0; m < 7; m++) { var f = cone(0.1, 0.34, em(m % 2 ? '#FF9E3D' : '#FF5A3D'), 8); var a = m * (Math.PI * 2 / 7); f.position.set(Math.cos(a) * 0.72, -0.5, Math.sin(a) * 0.72); aura.add(f); flames.push(f); }
        parts.tick.push(function (t) { flames.forEach(function (f, i) { f.scale.y = 1 + Math.sin(t * 10 + i) * 0.35; f.material.emissiveIntensity = 0.8 + Math.sin(t * 9 + i) * 0.4; }); });
      } else if (id === 'electrique') {
        var bolts = []; for (var n = 0; n < 8; n++) { var b = boxm(0.03, 0.4, 0.03, em('#8AD8FF')); var a = n * (Math.PI * 2 / 8); b.position.set(Math.cos(a) * 0.95, 0.2, Math.sin(a) * 0.95); b.rotation.z = Math.random(); aura.add(b); bolts.push(b); }
        parts.tick.push(function (t) { bolts.forEach(function (b, i) { b.visible = Math.sin(t * 14 + i * 1.7) > 0; }); });
      } else if (id === 'arcenciel') {
        ['#FF5A5A', '#FFA53D', '#FFE04D', '#5ED17b', '#4FB8FF', '#9B5DE5'].forEach(function (c, i) { var arc = tor(0.9 + i * 0.09, 0.03, em(c), 8, Math.PI); arc.position.y = 0.1; aura.add(arc); });
        parts.tick.push(function (t) { aura.rotation.y = Math.sin(t * 0.6) * 0.4; });
      } else if (id === 'doree') {
        var motes = []; for (var q = 0; q < 14; q++) { var mo = sph(0.07, std(C('#FFE9A8'), 0.1, 0.2, C('#FFD24D'), 1), 8, 6); aura.add(mo); motes.push(mo); }
        var ring = tor(1.02, 0.03, std(C('#FFE9A8'), 0.1, 0.2, C('#FFD24D'), 0.8), 10); ring.rotation.x = Math.PI / 2; ring.position.y = -0.6; aura.add(ring);
        parts.tick.push(function (t) { aura.rotation.y = t * 0.4; motes.forEach(function (s, i) { var a = t * 1.4 + i * (Math.PI * 2 / motes.length); var rr = 0.98 + Math.sin(t * 2 + i) * 0.12; s.position.set(Math.cos(a) * rr, 0.2 + Math.sin(t * 2.5 + i) * 0.6, Math.sin(a) * rr); s.material.emissiveIntensity = 0.6 + 0.5 * Math.abs(Math.sin(t * 3 + i)); }); });
      } else {
        var it = findItem(OPTIONS.aura, id);
        if (it && it.fx) genAura(aura, it.fx);
      }
    }

    /* Auras génériques : particules paramétrées (forme / couleurs / mouvement). */
    function genAura(aura, fx) {
      var cols = fx.cols || ['#FFD24D'];
      var n = fx.count || 10, size = fx.size || 0.06;
      var items = [];
      for (var i = 0; i < n; i++) {
        var col = C(cols[i % cols.length]);
        var mat = std(col, 0.3, 0.1, col, fx.motion === 'fall' ? 0.5 : 0.9);
        var p;
        if (fx.shape === 'star') { p = makeStar(THREE, size * 1.4, mat); track(p.geometry); track(mat); aura.add(p); }
        else if (fx.shape === 'box') { p = boxm(size, size * 1.4, size, mat); aura.add(p); }
        else if (fx.shape === 'petal') { p = sph(size, mat, 10, 8); p.scale.set(1, 0.4, 0.7); aura.add(p); }
        else { p = sph(size, mat, 10, 8); aura.add(p); }
        p.userData._ph = Math.random() * Math.PI * 2;
        p.userData._r = 0.75 + Math.random() * 0.45;
        items.push(p);
      }
      if (fx.motion === 'fall') {
        parts.tick.push(function (t) { items.forEach(function (p, i) { var ph = (t * 0.32 + p.userData._ph / 6) % 1; var a = p.userData._ph + i; p.position.set(Math.cos(a) * p.userData._r, 1.1 - ph * 2.0, Math.sin(a) * p.userData._r); p.rotation.z = t * 2 + i; p.material.opacity = 1; }); });
      } else if (fx.motion === 'rise') {
        parts.tick.push(function (t) { items.forEach(function (p, i) { var ph = (t * 0.3 + p.userData._ph / 6) % 1; var a = p.userData._ph + Math.sin(t + i) * 0.4; p.position.set(Math.cos(a) * p.userData._r * 0.8, -0.7 + ph * 1.8, Math.sin(a) * p.userData._r * 0.8); var sc = 0.6 + ph * 0.55; p.scale.setScalar(sc); p.material.emissiveIntensity = 0.4 + (1 - ph) * 0.6; }); });
      } else {
        parts.tick.push(function (t) { items.forEach(function (p, i) { var a = t * 1.2 + i * (Math.PI * 2 / items.length); p.position.set(Math.cos(a) * p.userData._r, 0.2 + Math.sin(t * 2 + i) * 0.45, Math.sin(a) * p.userData._r); p.rotation.z += 0.02; p.material.emissiveIntensity = 0.55 + 0.5 * Math.abs(Math.sin(t * 3 + i)); }); });
      }
    }

    function buildFamiliar(id) {
      if (!id || id === 'none') return;
      var fam = new THREE.Group(); root.add(fam); parts.familiar = fam;
      var wingRefs = null;
      if (id === 'papillon') {
        var b = sph(0.06, std(accent, 0.4, 0.1), 10, 8); fam.add(b);
        wingRefs = [];
        [-1, 1].forEach(function (s) { var w = geoMat(new THREE.CircleGeometry(0.12, 12), std(primary, 0.4, 0.1)); w.material.side = THREE.DoubleSide; w.position.x = s * 0.1; fam.add(w); wingRefs.push([w, s]); });
      } else if (id === 'luciole') {
        var l = sph(0.09, std(C('#FFF3A0'), 0.2, 0.1, C('#FFE04D'), 1.2), 12, 10); fam.add(l);
        parts.tick.push(function (t) { l.material.emissiveIntensity = 0.6 + Math.abs(Math.sin(t * 4)) * 0.8; });
      } else if (id === 'oiseau') {
        var body = sph(0.12, std(accent, 0.5, 0.05), 16, 12); fam.add(body);
        var beak = cone(0.04, 0.1, std(C('#FFB01F'), 0.4, 0.05), 8); beak.rotation.x = Math.PI / 2; beak.position.z = 0.14; fam.add(beak);
        wingRefs = [];
        [-1, 1].forEach(function (s) { var w = sph(0.08, std(shadeCol(THREE, accent, 12), 0.5, 0.05), 12, 8); w.scale.set(0.4, 1, 0.7); w.position.x = s * 0.12; fam.add(w); wingRefs.push([w, s]); });
      } else if (id === 'poisson') {
        var body2 = sph(0.13, std(accent, 0.3, 0.2), 18, 14); body2.scale.set(1.3, 1, 0.6); fam.add(body2);
        var tail3 = cone(0.1, 0.16, std(shadeCol(THREE, accent, 10), 0.3, 0.2), 4); tail3.rotation.z = Math.PI / 2; tail3.position.x = -0.2; fam.add(tail3);
      } else if (id === 'robotmini') {
        var head2 = boxm(0.16, 0.14, 0.14, std(primary, 0.4, 0.4)); roundify(head2.geometry, 0.04); fam.add(head2);
        var eye = geoMat(new THREE.PlaneGeometry(0.1, 0.05), std(accent, 0.2, 0.1, accent, 0.9)); eye.position.z = 0.08; fam.add(eye);
        var ant = cyl(0.01, 0.01, 0.1, std(dark, 0.5, 0.3), 6); ant.position.y = 0.12; fam.add(ant);
      } else if (id === 'dragonnet') {
        var body3 = sph(0.14, std(C('#FFD24D'), 0.3, 0.6, C('#FFB01F'), 0.2), 18, 14); fam.add(body3);
        wingRefs = [];
        [-1, 1].forEach(function (s) { var w = sph(0.14, std(C('#FFE9A8'), 0.2, 0.5), 14, 10); w.scale.set(0.1, 1, 0.7); w.position.set(s * 0.12, 0.05, -0.02); w.rotation.z = s * 0.4; fam.add(w); wingRefs.push([w, s]); });
        var horn = cone(0.03, 0.1, std(C('#FFE9A8'), 0.2, 0.5), 6); horn.position.set(0, 0.14, -0.04); fam.add(horn);
      } else {
        var it = findItem(OPTIONS.familiar, id);
        if (it && it.fam) wingRefs = genFamiliar(fam, it.fam);
      }
      if (wingRefs) parts.tick.push(function (t) { wingRefs.forEach(function (wr) { wr[0].rotation.y = wr[1] * Math.sin(t * 16) * 0.7; }); });
      parts.tick.push(function (t) { var a = t * 0.8; fam.position.set(Math.cos(a) * 1.35, 0.85 + Math.sin(t * 1.5) * 0.15, Math.sin(a) * 1.35); fam.rotation.y = -a + Math.PI / 2; });
    }

    /* Familiers génériques : petit corps + options (ailes, oreilles, lueur…). */
    function genFamiliar(fam, spec) {
      var col = C(spec.body || '#F5A623');
      var bm = spec.glow ? std(col, 0.3, 0.1, col, spec.glow) : std(col, 0.5, 0.08);
      var wingRefs = null;
      if (spec.star) {
        var st = makeStar(THREE, 0.14, bm); track(st.geometry); fam.add(st);
        var trail = []; for (var i = 0; i < 4; i++) { var tp = sph(0.05 - i * 0.008, std(C('#FFE9A8'), 0.2, 0.1, C('#FFD24D'), 0.9), 8, 6); tp.position.set(-0.14 - i * 0.09, -0.03 - i * 0.02, 0); fam.add(tp); trail.push(tp); }
        parts.tick.push(function (t) { st.rotation.z = t * 2; trail.forEach(function (p, i) { p.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(t * 5 + i)) * 0.6; }); });
        return null;
      }
      var body = sph(0.12, bm, 16, 12); fam.add(body);
      if (spec.belly) { var be = sph(0.09, std(C(spec.belly), 0.5, 0.03), 12, 10); be.scale.z = 0.6; be.position.z = 0.06; fam.add(be); }
      if (spec.ears === 'point') { [-1, 1].forEach(function (s) { var e = cone(0.045, 0.09, bm, 6); e.position.set(s * 0.07, 0.13, 0); fam.add(e); }); }
      else if (spec.ears === 'round') { [-1, 1].forEach(function (s) { var e = sph(0.05, bm, 10, 8); e.position.set(s * 0.09, 0.11, 0); fam.add(e); }); }
      if (spec.tail) { var tl = sph(0.05, bm, 10, 8); tl.scale.set(1, 1, 1.9); tl.position.set(-0.13, -0.02, -0.06); fam.add(tl); }
      if (spec.claws) { [-1, 1].forEach(function (s) { var cl = sph(0.05, bm, 10, 8); cl.scale.set(1.2, 0.8, 1); cl.position.set(s * 0.15, -0.02, 0.06); fam.add(cl); }); }
      if (spec.wings) {
        wingRefs = [];
        [-1, 1].forEach(function (s) { var w = sph(0.08, std(shadeCol(THREE, col, 12), 0.5, 0.05), 12, 8); w.scale.set(0.4, 1, 0.7); w.position.x = s * 0.12; fam.add(w); wingRefs.push([w, s]); });
      }
      var eyeM = std(C('#20223c'), 0.3, 0.05);
      [-1, 1].forEach(function (s) { var ey = sph(0.02, eyeM, 8, 6); ey.position.set(s * 0.045, 0.03, 0.11); fam.add(ey); });
      return wingRefs;
    }

    function buildPedestal(id) {
      if (!id || id === 'none') return;
      var y = cfgT.footY - 0.06;
      if (id === 'disque') {
        var d = cyl(0.85, 0.95, 0.14, std(accent, 0.4, 0.2), 32); d.position.y = y; root.add(d);
        var d2 = cyl(0.7, 0.7, 0.04, std(white, 0.3, 0.1, white, 0.2), 32); d2.position.y = y + 0.09; root.add(d2);
      } else if (id === 'coussin') {
        var c = boxm(1.2, 0.34, 1.2, std(accent, 0.7, 0)); roundify(c.geometry, 0.3); c.position.y = y - 0.02; root.add(c);
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (p) { var tu = sph(0.06, std(C('#FFD24D'), 0.4, 0.2), 10, 8); tu.position.set(p[0] * 0.52, y - 0.02, p[1] * 0.52); root.add(tu); });
      } else if (id === 'nuage') {
        var mm = std(white, 0.9, 0);
        [[0, 0, 0, 0.55], [-0.4, -0.05, 0.1, 0.34], [0.42, -0.05, 0.05, 0.36], [0, -0.05, 0.4, 0.3], [0, -0.02, -0.38, 0.32]].forEach(function (a) { var s = sph(a[3], mm, 16, 12); s.position.set(a[0], y + a[1], a[2]); root.add(s); });
      } else if (id === 'cristal') {
        var cm = glass(C('#9BE7FF'), 0.85, 0.1); cm.metalness = 0.2; cm.emissive = C('#6EC6FF'); cm.emissiveIntensity = 0.4; track(cm);
        var oc = geoMat(new THREE.OctahedronGeometry(0.72), cm); oc.scale.set(1, 0.5, 1); oc.position.y = y; root.add(oc);
      } else if (id === 'podiumor') {
        var base = cyl(0.95, 1.05, 0.24, std(C('#FFD24D'), 0.25, 0.9), 8); base.position.y = y; root.add(base);
        var top = cyl(0.8, 0.9, 0.1, std(C('#FFF0B8'), 0.2, 0.9), 8); top.position.y = y + 0.16; root.add(top);
      } else {
        var it = findItem(OPTIONS.pedestal, id);
        if (it && it.ped) genPedestal(it.ped, y);
      }
    }

    /* Socles génériques : disque / château / anneau paramétrés. */
    function genPedestal(spec, y) {
      var col = C(spec.col || '#8892B0');
      if (spec.kind === 'ring') {
        var ring = tor(0.9, 0.06, std(col, 0.2, 0.2, col, spec.em || 0.8), 14); ring.rotation.x = Math.PI / 2; ring.position.y = y + 0.05; root.add(ring);
        parts.tick.push(function (t) { ring.material.emissiveIntensity = (spec.em || 0.8) * (0.7 + Math.sin(t * 2.4) * 0.3); ring.rotation.z = t * 0.5; });
      } else if (spec.kind === 'castle') {
        var sm = std(col, 0.8, 0);
        var base = cyl(0.8, 0.9, 0.2, sm, 20); base.position.y = y; root.add(base);
        [[0.55, 0], [-0.55, 0], [0, 0.55], [0, -0.55]].forEach(function (p) { var tw = cyl(0.14, 0.16, 0.3, sm, 10); tw.position.set(p[0], y + 0.2, p[1]); root.add(tw); var tp = cone(0.16, 0.14, std(C('#E8556B'), 0.6, 0), 10); tp.position.set(p[0], y + 0.42, p[1]); root.add(tp); });
      } else {
        var m = spec.em ? std(col, 0.3, 0.15, col, spec.em) : std(col, 0.6, 0.1);
        var d = cyl(0.85, 0.95, 0.16, m, 28); d.position.y = y; root.add(d);
        if (spec.dots) { for (var i = 0; i < 8; i++) { var a = (i / 8) * Math.PI * 2; var f = sph(0.06, std(C(spec.dots[i % spec.dots.length]), 0.5, 0.03), 10, 8); f.position.set(Math.cos(a) * 0.62, y + 0.1, Math.sin(a) * 0.62); root.add(f); } }
      }
    }

    return parts;
  }

  /* Géométrie de bouche selon l'expression. */
  function mouthGeo(THREE, kind, r) {
    if (kind === 'o') return new THREE.TorusGeometry(r * 0.1, r * 0.045, 10, 20);
    if (kind === 'obig') return new THREE.TorusGeometry(r * 0.14, r * 0.05, 12, 22);
    if (kind === 'small') return new THREE.TorusGeometry(r * 0.11, r * 0.035, 8, 20, Math.PI);
    if (kind === 'flat') return new THREE.BoxGeometry(r * 0.26, r * 0.03, r * 0.03);
    return new THREE.TorusGeometry(r * 0.17, r * 0.045, 10, 24, Math.PI);
  }

  function applyExpression(THREE, parts, eyes) {
    var r = parts.faceR;
    parts.eyeL.scale.set(1, 1, 1); parts.eyeR.scale.set(1, 1, 1);
    parts.eyeL.position.y = r * 0.12; parts.eyeR.position.y = r * 0.12;
    parts.head.rotation.x = 0; parts.head.rotation.z = 0;
    if (parts.blushL) { parts.blushL.material.emissiveIntensity = 0.15; parts.blushR.material.emissiveIntensity = 0.15; }
    var kind = 'smile';
    switch (eyes) {
      case 'curieux':
        kind = 'o'; parts.eyeL.position.y = r * 0.18; parts.eyeR.position.y = r * 0.18;
        parts.head.rotation.z = 0.1; parts.head.rotation.x = -0.05; break;
      case 'fier':
        kind = 'small'; parts.eyeL.scale.y = 0.55; parts.eyeR.scale.y = 0.55; parts.head.rotation.x = 0.12; break;
      case 'clin':
        kind = 'smile'; parts.eyeR.scale.y = 0.12; break;
      case 'kawaii':
        kind = 'small'; parts.eyeL.scale.set(1.28, 1.28, 1.28); parts.eyeR.scale.set(1.28, 1.28, 1.28);
        if (parts.blushL) { parts.blushL.material.emissiveIntensity = 0.4; parts.blushR.material.emissiveIntensity = 0.4; } break;
      case 'surpris':
        kind = 'obig'; parts.eyeL.scale.set(1.3, 1.3, 1.3); parts.eyeR.scale.set(1.3, 1.3, 1.3);
        parts.eyeL.position.y = r * 0.16; parts.eyeR.position.y = r * 0.16; parts.head.rotation.x = -0.1; break;
      case 'amoureux':
        kind = 'small'; parts.eyeL.scale.set(1.2, 1.2, 1.2); parts.eyeR.scale.set(1.2, 1.2, 1.2);
        if (parts.blushL) { parts.blushL.material.emissiveIntensity = 0.55; parts.blushR.material.emissiveIntensity = 0.55; } break;
      case 'cool':
        kind = 'small'; parts.eyeL.scale.y = 0.5; parts.eyeR.scale.y = 0.5; parts.head.rotation.z = 0.05; break;
      case 'endormi':
        kind = 'small'; parts.eyeL.scale.y = 0.12; parts.eyeR.scale.y = 0.12; parts.head.rotation.x = 0.14; parts.head.rotation.z = 0.08; break;
      case 'determine':
        kind = 'flat'; parts.eyeL.scale.y = 0.45; parts.eyeR.scale.y = 0.45; parts.head.rotation.x = 0.1; break;
      default: kind = 'smile';
    }
    if (parts.mouthKind !== kind) {
      var old = parts.mouth.geometry;
      parts.mouth.geometry = mouthGeo(THREE, kind, r);
      old.dispose(); parts.mouthKind = kind;
    }
    parts.mouth.rotation.z = (kind === 'o' || kind === 'obig' || kind === 'flat') ? 0 : Math.PI;
  }

  /* ========================================================================== *
   *  INSTANCE (rendu + boucle d'animation + interactions)                      *
   * ========================================================================== */
  function AvatarInstance(container, opts) {
    opts = opts || {};
    this.opts = opts;
    this.container = container;
    this.cfg = sanitize(opts.config || current());
    this.ready = false;
    this.anim = null;
    this.animT0 = 0;
    this.queue = [];
    this.THREE = null;
    this._raf = 0;
    this._t = 0;
    this._nextBlink = 2 + Math.random() * 3;
    var self = this;

    if (getComputedStyle(container).position === 'static') container.style.position = 'relative';

    loadThree()
      .then(function (THREE) { self._init(THREE); })
      .catch(function (err) { self._fallback(err); });
  }

  AvatarInstance.prototype._init = function (THREE) {
    var self = this, opts = this.opts, container = this.container;
    this.THREE = THREE;

    var W = opts.size && opts.size !== 'auto' ? opts.size : (container.clientWidth || 240);
    var H = opts.size && opts.size !== 'auto' ? opts.size : (container.clientHeight || W);
    if (!H) H = W;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    var canvas = renderer.domElement;
    canvas.style.display = 'block'; canvas.style.width = '100%'; canvas.style.height = '100%';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Avatar 3D : ' + (this.cfg.name || 'compagnon'));
    container.appendChild(canvas);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a90c0, 1.0));
    var key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(3, 5, 4); scene.add(key);
    var fill = new THREE.DirectionalLight(0xbcd0ff, 0.5); fill.position.set(-4, 1, 2); scene.add(fill);
    var rim = new THREE.DirectionalLight(0xffe6c8, 0.7); rim.position.set(0, 2, -5); scene.add(rim);

    var shadowTex = makeRadialTexture(THREE);
    var shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 2.4),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.32, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.02; scene.add(shadow);
    this._shadow = shadow;

    this.scene = scene; this.camera = camera; this.renderer = renderer; this.canvas = canvas;

    this.orbit = {
      enabled: !!opts.interactive,
      theta: 0, phi: Math.PI * 0.46, radius: 6,
      targetTheta: 0, targetPhi: Math.PI * 0.46,
      autoRotate: !REDUCED && opts.interactive && opts.autoRotate !== false,
      dragging: false, lastX: 0, lastY: 0
    };
    if (opts.interactive) this._bindOrbit();

    this._buildMesh();

    if (!opts.size || opts.size === 'auto') {
      this._ro = new ResizeObserver(function () { self._resize(); });
      this._ro.observe(container);
    }

    canvas.style.cursor = opts.interactive ? 'grab' : 'pointer';
    this._onClick = function () { if (self._moved) return; self.play(self.anim === 'wave' ? 'jump' : 'wave'); };
    canvas.addEventListener('click', this._onClick);

    this.ready = true;
    this.queue.forEach(function (q) { self[q.m].apply(self, q.a); });
    this.queue = [];

    this._loop();
  };

  AvatarInstance.prototype._buildMesh = function () {
    var THREE = this.THREE;
    if (this.parts) this._disposeParts();
    var parts = buildAvatar(THREE, this.cfg);
    this.parts = parts;
    this.scene.add(parts.root);
    this._applyBackground(this.cfg.background);
    var box = new THREE.Box3().setFromObject(parts.root);
    var size = box.getSize(new THREE.Vector3());
    var center = box.getCenter(new THREE.Vector3());
    this._center = center;
    var maxDim = Math.max(size.x, size.y);
    var fov = this.camera.fov * Math.PI / 180;
    var dist = (maxDim / 2) / Math.tan(fov / 2) * 1.5;
    this._targetY = center.y;
    if (this.orbit) this.orbit.radius = dist;
    this.camera.position.set(0, center.y + size.y * 0.04, dist);
    this.camera.lookAt(0, center.y, 0);
    if (this._shadow) this._shadow.position.y = box.min.y - 0.02;
  };

  AvatarInstance.prototype._applyBackground = function (id) {
    var THREE = this.THREE;
    if (this._backdrop) { this.scene.remove(this._backdrop); if (this._backdrop.geometry) this._backdrop.geometry.dispose(); if (this._backdrop.material) { if (this._backdrop.material.map) this._backdrop.material.map.dispose(); this._backdrop.material.dispose(); } this._backdrop = null; }
    var spec = BG_SPECS[id];
    if (!spec) return;
    var tex = makeGradientTexture(THREE, spec);
    var dome = new THREE.Mesh(
      new THREE.SphereGeometry(18, 32, 24),
      new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, depthWrite: false })
    );
    this.scene.add(dome); this._backdrop = dome;
  };

  AvatarInstance.prototype._disposeParts = function () {
    if (!this.parts) return;
    this.scene.remove(this.parts.root);
    this.parts.dispose.forEach(function (o) { if (o && o.dispose) o.dispose(); });
    this.parts.root.traverse(function (n) {
      if (n.geometry && n.geometry.dispose) n.geometry.dispose();
      if (n.material) { (Array.isArray(n.material) ? n.material : [n.material]).forEach(function (m) { m.dispose && m.dispose(); }); }
    });
    this.parts = null;
  };

  AvatarInstance.prototype._resize = function () {
    if (!this.renderer) return;
    var W = this.container.clientWidth, H = this.container.clientHeight || W;
    if (!W || !H) return;
    this.camera.aspect = W / H; this.camera.updateProjectionMatrix();
    this.renderer.setSize(W, H);
  };

  AvatarInstance.prototype._bindOrbit = function () {
    var self = this, cv = this.canvas, o = this.orbit;
    this._onDown = function (e) {
      o.dragging = true; self._moved = false; cv.style.cursor = 'grabbing';
      o.lastX = (e.touches ? e.touches[0].clientX : e.clientX);
      o.lastY = (e.touches ? e.touches[0].clientY : e.clientY);
    };
    this._onMove = function (e) {
      if (!o.dragging) return;
      var x = (e.touches ? e.touches[0].clientX : e.clientX);
      var y = (e.touches ? e.touches[0].clientY : e.clientY);
      var dx = x - o.lastX, dy = y - o.lastY; o.lastX = x; o.lastY = y;
      if (Math.abs(dx) + Math.abs(dy) > 3) self._moved = true;
      o.targetTheta -= dx * 0.01;
      o.targetPhi = Math.max(Math.PI * 0.18, Math.min(Math.PI * 0.82, o.targetPhi - dy * 0.01));
      if (e.cancelable) e.preventDefault();
    };
    this._onUp = function () { o.dragging = false; cv.style.cursor = 'grab'; setTimeout(function () { self._moved = false; }, 30); };
    cv.addEventListener('mousedown', this._onDown);
    cv.addEventListener('touchstart', this._onDown, { passive: true });
    window.addEventListener('mousemove', this._onMove);
    cv.addEventListener('touchmove', this._onMove, { passive: false });
    window.addEventListener('mouseup', this._onUp);
    cv.addEventListener('touchend', this._onUp);
  };

  AvatarInstance.prototype._updateOrbit = function (dt) {
    var o = this.orbit; if (!o || !o.enabled) return;
    if (o.autoRotate && !o.dragging) o.targetTheta += dt * 0.35;
    o.theta += (o.targetTheta - o.theta) * 0.12;
    o.phi += (o.targetPhi - o.phi) * 0.12;
    var ty = this._targetY || 0;
    this.camera.position.set(
      Math.sin(o.phi) * Math.sin(o.theta) * o.radius,
      ty + Math.cos(o.phi) * o.radius,
      Math.sin(o.phi) * Math.cos(o.theta) * o.radius
    );
    this.camera.lookAt(0, ty, 0);
  };

  AvatarInstance.prototype._loop = function () {
    var self = this;
    this._raf = requestAnimationFrame(function () { self._loop(); });
    var dt = Math.min(0.05, this.clock ? this.clock.getDelta() : 0.016);
    if (!this.clock) { this.clock = new this.THREE.Clock(); dt = 0.016; }
    this._t += dt;
    this._animate(dt);
    this._updateOrbit(dt);
    this.renderer.render(this.scene, this.camera);
  };

  AvatarInstance.prototype._animate = function (dt) {
    var p = this.parts; if (!p) return;
    var t = this._t;
    var amp = REDUCED ? 0.25 : 1;

    var breatheS = 1 + Math.sin(t * 1.8) * 0.03 * amp;
    p.breathe.forEach(function (m) { m.scale.y = (m.userData._by || (m.userData._by = m.scale.y)) * breatheS; });
    p.bob.position.y = Math.sin(t * 1.8) * 0.03 * amp;
    if (!REDUCED) {
      p.head.rotation.y = Math.sin(t * 0.7) * 0.12;
      p.bob.rotation.z = Math.sin(t * 0.9) * 0.02;
    }
    if (p.blink2) p.blink2.material.emissiveIntensity = 0.7 + Math.sin(t * 3) * 0.4;

    // Cosmétiques/type animés (auras, familiers, ailes, flammes…)
    if (p.tick && p.tick.length) { for (var ti = 0; ti < p.tick.length; ti++) p.tick[ti](t, dt); }

    if (!REDUCED) {
      this._nextBlink -= dt;
      if (this._nextBlink <= 0) { this._blinkT = 0.14; this._nextBlink = 2.5 + Math.random() * 3.5; }
      if (this._blinkT > 0) {
        this._blinkT -= dt;
        var k = Math.max(0.08, Math.abs(this._blinkT - 0.07) / 0.07);
        if (p.eyeL && this.cfg.eyes !== 'clin' && this.cfg.eyes !== 'endormi') { p.eyeL.scale.y = k; }
        if (p.eyeR && this.cfg.eyes !== 'clin' && this.cfg.eyes !== 'endormi') { p.eyeR.scale.y = k; }
      }
    }

    if (this.anim) {
      var e = t - this.animT0;
      var done = false;
      if (this.anim === 'wave') {
        var dur = REDUCED ? 0.9 : 1.6;
        var k2 = e / dur;
        var lift = Math.sin(Math.min(k2, 1) * Math.PI);
        if (p.armR) p.armR.rotation.z = 0.28 + lift * 2.0 + Math.sin(e * 12) * 0.25 * (k2 < 1 ? lift : 0);
        p.head.rotation.z = lift * 0.12;
        if (k2 >= 1) { if (p.armR) p.armR.rotation.z = 0.28; done = true; }
      } else if (this.anim === 'jump') {
        var dur2 = REDUCED ? 0.5 : 0.75;
        var k3 = e / dur2;
        var jh = Math.sin(Math.min(k3, 1) * Math.PI);
        p.root.position.y = jh * (REDUCED ? 0.12 : 0.4);
        var sq = 1 + jh * 0.08;
        p.root.scale.set(1 + (1 - jh) * 0.04 - jh * 0.02, sq, 1 + (1 - jh) * 0.04 - jh * 0.02);
        if (p.armL) p.armL.rotation.z = -0.28 - jh * 1.6;
        if (p.armR) p.armR.rotation.z = 0.28 + jh * 1.6;
        if (k3 >= 1) { p.root.position.y = 0; p.root.scale.set(1, 1, 1); if (p.armL) p.armL.rotation.z = -0.28; if (p.armR) p.armR.rotation.z = 0.28; done = true; }
      } else if (this.anim === 'celebrate') {
        var dur3 = REDUCED ? 0.6 : 1.5;
        var k4 = e / dur3;
        if (!REDUCED) p.root.rotation.y = Math.min(k4, 1) * Math.PI * 2;
        var jh2 = Math.abs(Math.sin(Math.min(k4, 1) * Math.PI * 2));
        p.root.position.y = jh2 * (REDUCED ? 0.1 : 0.3);
        if (p.armL) p.armL.rotation.z = -0.28 - jh2 * 1.4;
        if (p.armR) p.armR.rotation.z = 0.28 + jh2 * 1.4;
        if (k4 >= 1) { p.root.rotation.y = 0; p.root.position.y = 0; if (p.armL) p.armL.rotation.z = -0.28; if (p.armR) p.armR.rotation.z = 0.28; done = true; }
      }
      if (done) this.anim = null;
    }
  };

  AvatarInstance.prototype.play = function (name) {
    if (!this.ready) { this.queue.push({ m: 'play', a: [name] }); return this; }
    this.anim = name; this.animT0 = this._t; return this;
  };

  AvatarInstance.prototype.setConfig = function (cfg) {
    this.cfg = sanitize(cfg);
    if (!this.ready) { this.queue.push({ m: 'setConfig', a: [this.cfg] }); return this; }
    this._buildMesh();
    if (this.canvas) this.canvas.setAttribute('aria-label', 'Avatar 3D : ' + (this.cfg.name || 'compagnon'));
    return this;
  };

  AvatarInstance.prototype.celebrate = function () {
    if (!this.ready) { this.queue.push({ m: 'celebrate', a: [] }); return this; }
    this.play('celebrate');
    this.say(pickCheer(this.cfg.name), 2600);
    if (!REDUCED) this._confetti();
    return this;
  };

  AvatarInstance.prototype.say = function (text, ms) {
    if (!this.ready) { this.queue.push({ m: 'say', a: [text, ms] }); return this; }
    if (this.opts.bubble === false) return this;
    var b = this._bubble;
    if (!b) {
      b = document.createElement('div'); b.className = 'ka-bubble';
      b.setAttribute('role', 'status'); b.setAttribute('aria-live', 'polite');
      this.container.appendChild(b); this._bubble = b;
      ensureStyles();
    }
    b.textContent = text;
    b.classList.add('show');
    clearTimeout(this._bubbleT);
    this._bubbleT = setTimeout(function () { b.classList.remove('show'); }, ms || 3200);
    return this;
  };

  AvatarInstance.prototype._confetti = function () {
    var host = this.container; ensureStyles();
    var c = document.createElement('div'); c.className = 'ka-confetti'; c.setAttribute('aria-hidden', 'true');
    // Émote de célébration équipée → pluie d'emojis au lieu des confettis.
    var emoteIt = (this.cfg.emote && this.cfg.emote !== 'none') ? findItem(OPTIONS.emote, this.cfg.emote) : null;
    var glyphs = emoteIt && emoteIt.glyphs;
    var cols = ['#6E6BFF', '#1B82E0', '#29B6E0', '#23A06E', '#F5A623', '#E36B9E'];
    for (var i = 0; i < (glyphs ? 26 : 36); i++) {
      var p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      if (glyphs) { p.className = 'g'; p.textContent = glyphs[i % glyphs.length]; p.style.fontSize = (13 + Math.random() * 12) + 'px'; }
      else { p.style.background = cols[i % cols.length]; }
      p.style.animationDuration = (1.2 + Math.random() * 1.1) + 's';
      p.style.animationDelay = (Math.random() * 0.25) + 's';
      c.appendChild(p);
    }
    host.appendChild(c);
    setTimeout(function () { c.remove(); }, 2600);
  };

  AvatarInstance.prototype._fallback = function (err) {
    try { console.warn('[KonstrioAvatar] rendu 3D indisponible :', err && err.message); } catch (e) {}
    var t = OPTIONS.types.filter(function (x) { return x.id === this.cfg.type; }, this)[0];
    var d = document.createElement('div');
    d.className = 'ka-fallback';
    d.setAttribute('role', 'img');
    d.setAttribute('aria-label', 'Avatar : ' + (this.cfg.name || 'compagnon'));
    d.textContent = (t && t.emoji) || '🤖';
    ensureStyles();
    this.container.appendChild(d);
  };

  AvatarInstance.prototype.dispose = function () {
    cancelAnimationFrame(this._raf);
    if (this._ro) this._ro.disconnect();
    if (this.canvas && this._onClick) this.canvas.removeEventListener('click', this._onClick);
    if (this._onMove) { window.removeEventListener('mousemove', this._onMove); window.removeEventListener('mouseup', this._onUp); }
    if (this.canvas && this._onDown) {
      this.canvas.removeEventListener('mousedown', this._onDown);
      this.canvas.removeEventListener('touchstart', this._onDown);
      this.canvas.removeEventListener('touchmove', this._onMove);
      this.canvas.removeEventListener('touchend', this._onUp);
    }
    this._disposeParts();
    if (this._backdrop) { this.scene.remove(this._backdrop); if (this._backdrop.geometry) this._backdrop.geometry.dispose(); if (this._backdrop.material) { if (this._backdrop.material.map) this._backdrop.material.map.dispose(); this._backdrop.material.dispose(); } this._backdrop = null; }
    if (this.renderer) { this.renderer.dispose(); if (this.renderer.forceContextLoss) this.renderer.forceContextLoss(); }
    if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    if (this._bubble && this._bubble.parentNode) this._bubble.parentNode.removeChild(this._bubble);
    var idx = INSTANCES.indexOf(this); if (idx >= 0) INSTANCES.splice(idx, 1);
  };

  /* ---- Étoile procédurale (partagée : type étoile + cosmétiques) ---- */
  function makeStar(THREE, r, mat) {
    var sh = new THREE.Shape(); var spikes = 5, inner = r * 0.46, outer = r;
    for (var i = 0; i < spikes * 2; i++) {
      var rad = i % 2 ? inner : outer;
      var a = i / (spikes * 2) * Math.PI * 2 - Math.PI / 2;
      var x = Math.cos(a) * rad, y = Math.sin(a) * rad;
      if (i === 0) sh.moveTo(x, y); else sh.lineTo(x, y);
    }
    sh.closePath();
    var geo = new THREE.ExtrudeGeometry(sh, { depth: r * 0.3, bevelEnabled: false });
    geo.center();
    return new THREE.Mesh(geo, mat);
  }

  /* ---- Texture radiale (ombre douce) ---- */
  function makeRadialTexture(THREE) {
    var s = 128, cv = document.createElement('canvas'); cv.width = cv.height = s;
    var ctx = cv.getContext('2d');
    var g = ctx.createRadialGradient(s / 2, s / 2, 4, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(20,22,44,0.9)'); g.addColorStop(0.55, 'rgba(20,22,44,0.35)'); g.addColorStop(1, 'rgba(20,22,44,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
    var tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; return tex;
  }

  /* ---- Décors de fond : dégradés générés au canvas (aucun asset) ---- */
  var BG_SPECS = {
    ciel:      { top: '#bfe3ff', bottom: '#eaf6ff', clouds: true },
    ocean:     { top: '#1c6fb0', bottom: '#8fe0d8' },
    foret:     { top: '#bfe6a8', bottom: '#4f9d5d' },
    espace:    { top: '#141336', bottom: '#3a2a63', stars: true },
    couchant:  { top: '#ff9e6b', bottom: '#ffd9a0', sun: true },
    arcenciel: { top: '#ffd6ec', bottom: '#d6f0ff', rainbow: true },
    doree:     { top: '#7a5a1a', bottom: '#ffdd88', rays: true },
    neige:     { top: '#cfe0f5', bottom: '#ffffff', snow: true },
    sakura:    { top: '#ffd6ec', bottom: '#fff3f9', petals: true },
    plage:     { top: '#7cc6ff', bottom: '#ffe9b8', sun: true },
    automne:   { top: '#ffca7a', bottom: '#b4562e', leaves: true },
    nuit:      { top: '#0b0d24', bottom: '#28306b', stars: true },
    aurore:    { top: '#0d1030', bottom: '#1c3550', stars: true, aurora: true },
    volcan:    { top: '#3a1020', bottom: '#ff7a3d', rays: true },
    bonbons:   { top: '#ffe3f2', bottom: '#d6f0ff', stripes: true }
  };
  function makeGradientTexture(THREE, spec) {
    var w = 512, h = 256, cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    var ctx = cv.getContext('2d');
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, spec.top); g.addColorStop(1, spec.bottom);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    if (spec.stars) { ctx.fillStyle = 'rgba(255,255,255,0.9)'; for (var i = 0; i < 120; i++) { var x = Math.random() * w, y = Math.random() * h * 0.8, rr = Math.random() * 1.6; ctx.globalAlpha = 0.4 + Math.random() * 0.6; ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; }
    if (spec.sun) { var sg = ctx.createRadialGradient(w * 0.5, h * 0.7, 6, w * 0.5, h * 0.7, 120); sg.addColorStop(0, 'rgba(255,255,220,0.95)'); sg.addColorStop(1, 'rgba(255,255,220,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, w, h); }
    if (spec.clouds) { ctx.fillStyle = 'rgba(255,255,255,0.75)'; [[120, 90, 40], [360, 60, 34], [250, 130, 46]].forEach(function (c) { for (var k = -2; k <= 2; k++) { ctx.beginPath(); ctx.arc(c[0] + k * c[2] * 0.7, c[1], c[2] * (1 - Math.abs(k) * 0.18), 0, 7); ctx.fill(); } }); }
    if (spec.rainbow) { var cols = ['#ff6b6b', '#ffa53d', '#ffe04d', '#5ed17b', '#4fb8ff', '#9b5de5']; cols.forEach(function (c, i) { ctx.strokeStyle = c; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(w * 0.5, h * 1.15, 150 - i * 11, Math.PI, 0); ctx.stroke(); }); }
    if (spec.rays) { ctx.save(); ctx.translate(w * 0.5, h * 0.5); ctx.globalAlpha = 0.15; ctx.fillStyle = '#fff6cf'; for (var r = 0; r < 12; r++) { ctx.rotate(Math.PI / 6); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(40, -400); ctx.lineTo(-40, -400); ctx.closePath(); ctx.fill(); } ctx.restore(); }
    if (spec.snow) { ctx.fillStyle = 'rgba(255,255,255,0.95)'; for (var sn = 0; sn < 70; sn++) { ctx.globalAlpha = 0.5 + Math.random() * 0.5; ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, 1.4 + Math.random() * 2.2, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; }
    if (spec.petals) { ctx.fillStyle = 'rgba(255,140,190,0.75)'; for (var pt = 0; pt < 46; pt++) { ctx.save(); ctx.translate(Math.random() * w, Math.random() * h); ctx.rotate(Math.random() * 6.28); ctx.globalAlpha = 0.4 + Math.random() * 0.5; ctx.beginPath(); ctx.ellipse(0, 0, 3.6, 1.8, 0, 0, 7); ctx.fill(); ctx.restore(); } ctx.globalAlpha = 1; }
    if (spec.leaves) { var lcols = ['rgba(200,90,40,0.8)', 'rgba(230,160,60,0.8)', 'rgba(160,60,30,0.8)']; for (var lf = 0; lf < 40; lf++) { ctx.save(); ctx.translate(Math.random() * w, Math.random() * h); ctx.rotate(Math.random() * 6.28); ctx.fillStyle = lcols[lf % 3]; ctx.beginPath(); ctx.ellipse(0, 0, 4, 2.2, 0, 0, 7); ctx.fill(); ctx.restore(); } }
    if (spec.aurora) { var acols = ['rgba(80,240,170,0.30)', 'rgba(120,200,255,0.25)', 'rgba(190,140,255,0.22)']; acols.forEach(function (c, ai) { ctx.strokeStyle = c; ctx.lineWidth = 26 - ai * 5; ctx.beginPath(); for (var ax = 0; ax <= w; ax += 8) { var ay = h * (0.28 + ai * 0.1) + Math.sin(ax / 46 + ai * 2) * 22; if (ax === 0) ctx.moveTo(ax, ay); else ctx.lineTo(ax, ay); } ctx.stroke(); }); }
    if (spec.stripes) { var scols = ['rgba(255,120,180,0.28)', 'rgba(130,200,255,0.25)', 'rgba(255,220,90,0.25)', 'rgba(150,230,170,0.25)']; ctx.save(); ctx.rotate(-0.35); for (var sp2 = -4; sp2 < 14; sp2++) { ctx.fillStyle = scols[(sp2 + 40) % 4]; ctx.fillRect(sp2 * 56, -h, 30, h * 3); } ctx.restore(); }
    var tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.mapping = THREE.EquirectangularReflectionMapping; return tex;
  }

  function pickCheer(name) {
    var arr = ['Bravo ' + (name || '') + ' !', 'Super travail !', 'Tu assures 🎉', 'Génial, continue !', 'Waouh, bien joué !'];
    return arr[Math.floor(Math.random() * arr.length)].replace('  ', ' ').trim();
  }

  /* ---- Styles (bulle / confettis / fallback) ---- */
  var _styled = false;
  function ensureStyles() {
    if (_styled) return; _styled = true;
    var css = [
      '.ka-bubble{position:absolute;left:50%;top:6%;transform:translateX(-50%) translateY(6px);max-width:82%;',
      'background:var(--surface,#fff);color:var(--fg,#13142B);border:1px solid var(--border,#E7E9F3);',
      'border-radius:14px;padding:8px 13px;font:700 13px/1.35 var(--font-body,system-ui);text-align:center;',
      'box-shadow:0 10px 30px rgba(19,20,43,.16);opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;z-index:5;}',
      '.ka-bubble.show{opacity:1;transform:translateX(-50%) translateY(0);}',
      '.ka-bubble::after{content:"";position:absolute;left:50%;bottom:-7px;transform:translateX(-50%) rotate(45deg);',
      'width:12px;height:12px;background:var(--surface,#fff);border-right:1px solid var(--border,#E7E9F3);border-bottom:1px solid var(--border,#E7E9F3);}',
      '.ka-confetti{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:4;}',
      '.ka-confetti i{position:absolute;top:-10%;width:8px;height:12px;border-radius:2px;opacity:.95;animation:kaFall linear forwards;}',
      '.ka-confetti i.g{width:auto;height:auto;background:none;border-radius:0;font-style:normal;line-height:1;}',
      '@keyframes kaFall{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(120%) rotate(540deg)}}',
      '.ka-fallback{position:absolute;inset:0;display:grid;place-items:center;font-size:min(46%,72px);line-height:1;}',
      '.ka-mini{position:relative;display:inline-grid;place-items:center;width:56px;height:56px;border-radius:50%;',
      'border:2.5px solid #F5A623;background:#6E6BFF;box-shadow:0 6px 18px rgba(19,20,43,.24);}',
      '.ka-mini-e{font-size:29px;line-height:1;transform:translateY(1px);}',
      '.ka-mini-hat{position:absolute;top:-9px;right:-5px;font-size:16px;line-height:1;}',
      '.ka-mini-fam{position:absolute;bottom:-4px;left:-6px;font-size:14px;line-height:1;}',
      '.ka-mini-aura{position:absolute;top:-6px;left:-6px;font-size:13px;line-height:1;}',
      '@media (prefers-reduced-motion:reduce){.ka-confetti{display:none}.ka-bubble{transition:none}}'
    ].join('');
    var el = document.createElement('style'); el.id = 'ka-styles'; el.textContent = css;
    document.head.appendChild(el);
  }

  /* ========================================================================== *
   *  API PUBLIQUE                                                               *
   * ========================================================================== */
  var INSTANCES = [];

  var KonstrioAvatar = {
    OPTIONS: OPTIONS,
    SLOTS: SLOTS.slice(),
    DEFAULT: clone(DEFAULT),
    REDUCED: REDUCED,

    get: function () { return clone(current()); },

    set: function (cfg) {
      _current = sanitize(Object.assign({}, current(), cfg));
      INSTANCES.forEach(function (i) { i.setConfig(_current); });
      return clone(_current);
    },

    save: function (cfg) {
      if (cfg) this.set(cfg);
      try { localStorage.setItem(LS_KEY, JSON.stringify(current())); } catch (e) {}
      // Succès « Question de style » 🎨 : 3 cosmétiques équipés en même temps.
      // KonstrioAch.unlock est idempotent → jamais re-crédité.
      try {
        if (this.equippedCount(current()) >= 3 && window.KonstrioAch && window.KonstrioAch.unlock) {
          window.KonstrioAch.unlock('styliste');
        }
      } catch (e) {}
      return clone(current());
    },

    /* Nombre de cosmétiques réellement équipés (slots ≠ 'none'). */
    equippedCount: function (cfg) {
      var c = sanitize(cfg || current()); var n = 0;
      SLOTS.forEach(function (k) { if (c[k] && c[k] !== 'none') n++; });
      return n;
    },

    /* Mini-portrait DOM léger (emoji) du compagnon équipé — pour l'afficher
       PARTOUT (lecteur de séquences, coins d'UI) sans payer le rendu 3D.
       Reflète le modèle, la couleur/accent et les cosmétiques visibles. */
    miniSprite: function (cfg) {
      var c = sanitize(cfg || current());
      var t = findItem(OPTIONS.types, c.type) || OPTIONS.types[0];
      var hat = c.hat !== 'none' ? findItem(OPTIONS.hat, c.hat) : null;
      var fam = c.familiar !== 'none' ? findItem(OPTIONS.familiar, c.familiar) : null;
      var aura = c.aura !== 'none' ? findItem(OPTIONS.aura, c.aura) : null;
      ensureStyles();
      var d = document.createElement('span');
      d.className = 'ka-mini';
      d.setAttribute('role', 'img');
      d.setAttribute('aria-label', 'Ton compagnon ' + (c.name || 'Konsti') + ' (' + t.label + ')');
      try {
        d.style.background = 'radial-gradient(circle at 32% 26%, color-mix(in srgb,' + c.color + ' 35%, #ffffff), ' + c.color + ')';
        d.style.borderColor = c.accent;
      } catch (e) {}
      d.innerHTML =
        '<span class="ka-mini-e" aria-hidden="true">' + t.emoji + '</span>' +
        (hat ? '<span class="ka-mini-hat" aria-hidden="true">' + hat.emoji + '</span>' : '') +
        (fam ? '<span class="ka-mini-fam" aria-hidden="true">' + fam.emoji + '</span>' : '') +
        (aura ? '<span class="ka-mini-aura" aria-hidden="true">' + aura.emoji + '</span>' : '');
      return d;
    },

    reset: function () { return this.set(clone(DEFAULT)); },

    mount: function (container, opts) {
      if (typeof container === 'string') container = document.querySelector(container);
      if (!container) { throw new Error('KonstrioAvatar.mount: conteneur introuvable'); }
      var inst = new AvatarInstance(container, opts || {});
      INSTANCES.push(inst);
      return inst;
    },

    celebrate: function () { INSTANCES.forEach(function (i) { i.celebrate(); }); return this; },
    say: function (text, ms) { INSTANCES.forEach(function (i) { i.say(text, ms); }); return this; },
    play: function (name) { INSTANCES.forEach(function (i) { i.play(name); }); return this; },

    // — Déblocables (dérivés de window.KonstrioAch) —
    ach: readAch,
    meetsReq: meetsReq,
    reqText: reqText,
    reqProgress: reqProgress,
    isUnlocked: itemUnlocked,
    enforce: enforce,
    RARITIES: RARITIES,
    rarityOf: rarityOf,

    instances: function () { return INSTANCES.slice(); }
  };

  window.KonstrioAvatar = KonstrioAvatar;
})();
