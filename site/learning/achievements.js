/* ============================================================
   KONSTRIO — Trophées & Achievements (XP, badges, secrets)
   + Boucle de rétention quotidienne :
     · Objectifs du jour (3 mini-quêtes déterministes par date, récompense
       bonus XP + 1 ticket 🎫)
     · Série (streak) maison avec PROTECTION : 1 « gel » 🧊 gagné par semaine
       complète, consommé automatiquement si UN jour est raté (jamais punitif).
     · Coffre hebdomadaire : 7 jours d'activité dans la semaine → coffre à
       réclamer (cosmétique aléatoire non possédé, côté page avatar).
     · Tickets 🎫 : gagnés via les quêtes, dépensés à la boutique de l'avatar.
   window.KonstrioAch : recordPlay / recordWin / unlock / get / level
     + getDaily / getStreak / getWeek / tickets / spendTickets /
       claimWeeklyChest / grantItem
   Stockage localStorage 'konstrio-ach'. Toast à chaque déblocage.
   Rétrocompatible : les anciens appels et l'ancien état restent valides.
   ============================================================ */
(function () {
  const KEY = 'konstrio-ach';
  const ACH = [
    { id:'first_play', icon:'🎮', name:'Premier pas', desc:'Lancer ton tout premier jeu.' },
    { id:'win1', icon:'⭐', name:'Première victoire', desc:'Terminer un jeu.' },
    { id:'perfect1', icon:'🌟', name:'Sans-faute', desc:'Obtenir 3 étoiles sur un jeu.' },
    { id:'cours1', icon:'🎓', name:'Élève appliqué', desc:'Réussir un jeu en mode Cours.' },
    { id:'explorer5', icon:'🧭', name:'Explorateur', desc:'Jouer à 5 jeux différents.' },
    { id:'explorer20', icon:'🗺️', name:'Globe-trotteur', desc:'Jouer à 20 jeux différents.' },
    { id:'play3d', icon:'🚀', name:'Astronaute', desc:'Explorer un monde 3D immersif.' },
    { id:'stars15', icon:'✨', name:'Collectionneur', desc:'Cumuler 15 étoiles.' },
    { id:'stars45', icon:'💫', name:'Star système', desc:'Cumuler 45 étoiles.' },
    { id:'perfect5', icon:'🏅', name:'Maître', desc:'Décrocher 3 étoiles sur 5 jeux.' },
    { id:'domains6', icon:'🧠', name:'Touche-à-tout', desc:'Jouer dans 6 domaines différents.' },
    { id:'level5', icon:'📈', name:'Niveau 5', desc:'Atteindre le niveau 5.' },
    // secrets
    { id:'nightowl', icon:'🦉', name:'Oiseau de nuit', desc:'Jouer entre minuit et 5 h du matin.', secret:true },
    { id:'darkmode', icon:'🌙', name:'Côté obscur', desc:'Activer le thème Nocturne.', secret:true },
    { id:'iss', icon:'🛰️', name:'Houston, ça capte', desc:'Repérer la Station spatiale dans le système solaire.', secret:true },
    { id:'astronomer', icon:'🔭', name:'Astronome', desc:'Ouvrir la vue planétarium.', secret:true },
    { id:'completionist', icon:'👑', name:'Légende Konstrio', desc:'Jouer aux 60 jeux de l’arcade.', secret:true },
    // Parcours « façon Duolingo » (langues & matières) — débloqués par le joueur de leçon.
    { id:'lang_first', icon:'🗣️', name:'Premier mot', desc:'Terminer ta toute première leçon de parcours.' },
    { id:'lang_check', icon:'📋', name:'Connaissances validées', desc:'Réussir un contrôle de connaissances.' },
    { id:'lang_perfect', icon:'💎', name:'Sans-faute (parcours)', desc:'Terminer une leçon de parcours à 100 %.' },
    { id:'streak7', icon:'🔥', name:'Une semaine en feu', desc:'Tenir une série de 7 jours d’affilée.', secret:true },
    // Séquences du Programme (lecon-player) — déclenchés par le lecteur via unlock().
    { id:'controle-parfait', icon:'💯', name:'Sans faute', desc:'Réussir un contrôle de séquence à 100 %.' },
    { id:'prog-complet', icon:'📚', name:'Programme terminé', desc:'Terminer les 3 séquences d’un même programme.' },
    { id:'niveau-complet', icon:'🏆', name:'Champion d’un niveau', desc:'Terminer toutes les séquences d’un niveau.' },
    // Compagnon (avatar) — déclenchés via unlock() par lecon-player.js / avatar.js (jamais re-crédités).
    { id:'fidele', icon:'🐾', name:'Inséparables', desc:'Jouer 10 séquences avec ton compagnon à tes côtés.' },
    { id:'styliste', icon:'🎨', name:'Question de style', desc:'Équiper 3 cosmétiques sur ton compagnon.' },
    // Boucle quotidienne
    { id:'quest10', icon:'🎯', name:'Chasseur d’objectifs', desc:'Réussir 10 objectifs du jour.' },
    { id:'chest1', icon:'🎁', name:'Ouvre-coffre', desc:'Ouvrir ton premier coffre de la semaine.' },
    { id:'streak30', icon:'🌋', name:'Un mois de feu', desc:'Tenir une série de 30 jours.', secret:true },
  ];
  const LEVELS = [0,150,400,800,1400,2200,3200,4500,6000,7800,10000];

  /* ── Objectifs du jour : pool de mini-quêtes (3 tirées par date) ── */
  const QUESTS = [
    { id:'q_lecon',   icon:'📖', label:'Termine 1 leçon',            c:'cours',    target:1 },
    { id:'q_win1',    icon:'🥇', label:'Gagne 1 partie',             c:'wins',     target:1 },
    { id:'q_win2',    icon:'🏆', label:'Gagne 2 parties',            c:'wins',     target:2 },
    { id:'q_play1',   icon:'🎮', label:'Lance 1 mini-jeu',           c:'plays',    target:1 },
    { id:'q_games2',  icon:'🧭', label:'Joue à 2 jeux différents',   c:'distinct', target:2 },
    { id:'q_xp50',    icon:'⚡', label:'Gagne 50 XP',                c:'xp',       target:50 },
    { id:'q_stars3',  icon:'⭐', label:'Décroche 3 étoiles',         c:'stars',    target:3 },
    { id:'q_perfect', icon:'💯', label:'Fais un sans-faute',         c:'perfect',  target:1 },
  ];
  const QUEST_XP = 20, TRIO_XP = 30, MAX_FREEZES = 3;

  function pad2(n){ return (n<10?'0':'')+n; }
  function dayStr(d){ d=d||new Date(); return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); }
  function diffDays(a,b){ // b - a en jours (dates locales 'YYYY-MM-DD')
    try { var pa=a.split('-'), pb=b.split('-');
      var da=new Date(+pa[0],+pa[1]-1,+pa[2]), db=new Date(+pb[0],+pb[1]-1,+pb[2]);
      return Math.round((db-da)/86400000);
    } catch(e){ return 99; }
  }
  function weekKey(d){ d=d||new Date(); var m=new Date(d); var wd=(m.getDay()+6)%7; m.setDate(m.getDate()-wd); return dayStr(m); }
  function seasonOf(d){ d=d||new Date(); var m=d.getMonth()+1;
    if (m===12||m<=2) return 'hiver'; if (m<=5) return 'printemps'; if (m<=8) return 'ete'; return 'automne'; }
  function seedOf(s){ var h=2166136261; for (var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
  function questsOfDay(dstr){
    var idx=[], h=seedOf(dstr);
    for (var i=0;i<QUESTS.length;i++) idx.push(i);
    for (var j=idx.length-1;j>0;j--){ h=(Math.imul(h,1664525)+1013904223)>>>0; var k=h%(j+1); var t=idx[j]; idx[j]=idx[k]; idx[k]=t; }
    return [QUESTS[idx[0]], QUESTS[idx[1]], QUESTS[idx[2]]];
  }

  const BASE = {
    unlocked:[], played:[], domains:[], stars:0, xp:0, wins:0, perfect:0, cours:0,
    tickets:0, owned:[], questsDone:0, seasons:{},
    daily:{ date:'', counts:{ plays:0, wins:0, stars:0, xp:0, perfect:0, cours:0, distinct:[] }, done:[], trio:false },
    streakO:{ count:0, best:0, last:'', freezes:0, savedOn:'', gelAt:'', lostFrom:0 },
    week:{ key:'', days:[], claimed:false, opened:0 },
  };
  function load(){
    try {
      var s = Object.assign(JSON.parse(JSON.stringify(BASE)), JSON.parse(localStorage.getItem(KEY)||'{}'));
      s.daily = Object.assign(JSON.parse(JSON.stringify(BASE.daily)), s.daily||{});
      s.daily.counts = Object.assign(JSON.parse(JSON.stringify(BASE.daily.counts)), s.daily.counts||{});
      s.streakO = Object.assign(JSON.parse(JSON.stringify(BASE.streakO)), s.streakO||{});
      s.week = Object.assign(JSON.parse(JSON.stringify(BASE.week)), s.week||{});
      if (!Array.isArray(s.owned)) s.owned = [];
      if (!s.seasons || typeof s.seasons !== 'object') s.seasons = {};
      return s;
    } catch(e){ return JSON.parse(JSON.stringify(BASE)); }
  }
  function save(s){ try { localStorage.setItem(KEY, JSON.stringify(s)); } catch(e){}
    try { document.dispatchEvent(new CustomEvent('konstrio-ach-change')); } catch(e){} }
  let state = load();

  function levelOf(xp){ let l=1; for (let i=1;i<LEVELS.length;i++) if (xp>=LEVELS[i]) l=i+1; return l; }
  function nextLevelXp(xp){ const l=levelOf(xp); return LEVELS[Math.min(l, LEVELS.length-1)] || (xp+1); }

  function ensureStyle(){
    if (document.getElementById('ach-style')) return;
    const s=document.createElement('style'); s.id='ach-style';
    s.textContent = `
      .ach-toast{position:fixed;left:20px;bottom:20px;z-index:300;background:var(--surface,#fff);border:1px solid var(--border,#e7e9f3);border-left:5px solid var(--brand-amber,#F5A623);border-radius:14px;box-shadow:0 18px 48px rgba(0,0,0,.25);padding:13px 16px;display:flex;gap:12px;align-items:center;font-family:'Manrope',system-ui,sans-serif;transform:translateY(120%);opacity:0;transition:.45s cubic-bezier(.22,1,.36,1);max-width:300px}
      .ach-toast.show{transform:none;opacity:1}
      .ach-toast .ai{font-size:30px;flex:none}
      .ach-toast .at{font-family:'Archivo',sans-serif;font-weight:800;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--brand-amber,#F5A623)}
      .ach-toast .an{font-weight:700;font-size:15px;color:var(--fg,#13142b)}
      .ach-toast .ad{font-size:12px;color:var(--fg-muted,#565b75)}`;
    document.head.appendChild(s);
  }
  let toastShift = 0;
  function toast(a, tag){
    ensureStyle();
    const el=document.createElement('div'); el.className='ach-toast';
    el.style.bottom = (20 + toastShift * 84) + 'px'; toastShift = (toastShift + 1) % 3;
    el.innerHTML=`<div class="ai">${a.icon}</div><div><div class="at">${tag||'Trophée débloqué'}</div><div class="an">${a.name}</div><div class="ad">${a.desc}</div></div>`;
    document.body.appendChild(el);
    requestAnimationFrame(()=>el.classList.add('show'));
    try { const c=new (window.AudioContext||window.webkitAudioContext)(); [660,880,1320].forEach((f,i)=>{ const o=c.createOscillator(),g=c.createGain(); o.frequency.value=f; o.type='sine'; g.gain.setValueAtTime(0,c.currentTime+i*0.08); g.gain.linearRampToValueAtTime(0.12,c.currentTime+i*0.08+0.01); g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+i*0.08+0.4); o.connect(g); g.connect(c.destination); o.start(c.currentTime+i*0.08); o.stop(c.currentTime+i*0.08+0.45); }); } catch(e){}
    setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>{ el.remove(); toastShift = Math.max(0, toastShift-1); },500); }, 4200);
  }
  function unlock(id){
    if (state.unlocked.includes(id)) return false;
    const a=ACH.find(x=>x.id===id); if (!a) return false;
    state.unlocked.push(id); save(state); toast(a); return true;
  }
  function evaluate(){
    if (state.played.length>=1) unlock('first_play');
    if (state.played.length>=5) unlock('explorer5');
    if (state.played.length>=20) unlock('explorer20');
    if (state.played.length>=60) unlock('completionist');
    if (state.wins>=1) unlock('win1');
    if (state.perfect>=1) unlock('perfect1');
    if (state.perfect>=5) unlock('perfect5');
    if (state.cours>=1) unlock('cours1');
    if (state.stars>=15) unlock('stars15');
    if (state.stars>=45) unlock('stars45');
    if (state.domains.length>=6) unlock('domains6');
    if (levelOf(state.xp)>=5) unlock('level5');
    if (state.questsDone>=10) unlock('quest10');
    if ((state.week.opened||0)>=1) unlock('chest1');
    if (state.streakO.count>=7) unlock('streak7');
    if (state.streakO.count>=30) unlock('streak30');
  }

  /* ── Série quotidienne (avec gel) + semaine + saison ── */
  function touchDay(){
    const d = dayStr(), st = state.streakO;
    if (st.last !== d) {
      if (!st.last) { st.count = 1; }
      else {
        const gap = diffDays(st.last, d);
        if (gap <= 0) { /* horloge bizarre : on ne casse rien */ }
        else if (gap === 1) st.count++;
        else if (gap === 2 && st.freezes > 0) {
          st.freezes--; st.count++; st.savedOn = d;
          toast({ icon:'🧊', name:'Série sauvée !', desc:'Ton gel a couvert le jour manqué — ta série continue.' }, 'Gel de série');
        } else {
          st.lostFrom = st.count;
          if (st.count >= 3) toast({ icon:'🌱', name:'Ta série repart', desc: st.count >= 7 ? 'Ton gel t’a manqué de peu ! Chaque jour compte, on repart ensemble.' : 'Pas grave du tout — aujourd’hui compte déjà pour ta nouvelle série.' }, 'Série');
          st.count = 1;
        }
      }
      st.last = d;
      if (st.count > st.best) st.best = st.count;
      // 1 gel gagné par semaine complète de série (7, 14, 21…), max 3 en réserve.
      if (st.count > 0 && st.count % 7 === 0 && st.gelAt !== d) {
        st.gelAt = d;
        if (st.freezes < MAX_FREEZES) {
          st.freezes++;
          toast({ icon:'🧊', name:'+1 gel de série', desc:'Semaine complète ! Ce gel protégera ta série si tu rates un jour.' }, 'Récompense');
        }
      }
      // Semaine (coffre) — la semaine change → nouvelle jauge.
      if (state.week.key !== weekKey()) state.week = { key: weekKey(), days: [], claimed:false, opened: state.week.opened||0 };
      if (state.week.days.indexOf(d) < 0) {
        state.week.days.push(d);
        if (state.week.days.length === 7 && !state.week.claimed)
          toast({ icon:'🎁', name:'Coffre de la semaine prêt !', desc:'7 jours d’activité — ouvre ton coffre sur la page Avatar.' }, 'Coffre');
      }
      // Saison : 1 jour actif = +1 au compteur de la saison en cours.
      const sn = seasonOf();
      state.seasons[sn] = (state.seasons[sn]||0) + 1;
      save(state);
    } else if (state.week.key !== weekKey()) {
      state.week = { key: weekKey(), days: [d], claimed:false, opened: state.week.opened||0 };
      save(state);
    }
  }

  /* ── Objectifs du jour ── */
  function ensureDaily(){
    const d = dayStr();
    if (state.daily.date !== d) {
      state.daily = { date:d, counts:{ plays:0, wins:0, stars:0, xp:0, perfect:0, cours:0, distinct:[] }, done:[], trio:false };
    }
  }
  function questHave(q, counts){ return q.c === 'distinct' ? (counts.distinct||[]).length : (counts[q.c]||0); }
  function checkQuests(){
    ensureDaily();
    const qs = questsOfDay(state.daily.date);
    qs.forEach(q => {
      if (state.daily.done.includes(q.id)) return;
      if (questHave(q, state.daily.counts) >= q.target) {
        state.daily.done.push(q.id);
        state.questsDone++;
        state.tickets++;
        state.xp += QUEST_XP;
        toast({ icon:q.icon, name:q.label, desc:'+'+QUEST_XP+' XP et +1 ticket 🎫 pour la boutique !' }, 'Objectif du jour réussi');
      }
    });
    if (!state.daily.trio && state.daily.done.length >= 3) {
      state.daily.trio = true;
      state.tickets++;
      state.xp += TRIO_XP;
      toast({ icon:'🎉', name:'Trio du jour !', desc:'Les 3 objectifs réussis : +'+TRIO_XP+' XP et +1 ticket 🎫 bonus.' }, 'Objectifs du jour');
    }
  }
  function bumpDaily(patch){
    ensureDaily(); touchDay();
    const c = state.daily.counts;
    if (patch.plays)   c.plays += patch.plays;
    if (patch.wins)    c.wins += patch.wins;
    if (patch.stars)   c.stars += patch.stars;
    if (patch.xp)      c.xp += patch.xp;
    if (patch.perfect) c.perfect += patch.perfect;
    if (patch.cours)   c.cours += patch.cours;
    if (patch.distinctId && c.distinct.indexOf(patch.distinctId) < 0) c.distinct.push(patch.distinctId);
    checkQuests(); save(state);
  }

  window.KonstrioAch = {
    list: ACH,
    questPool: QUESTS,
    get(){
      return Object.assign({}, state, {
        level: levelOf(state.xp), nextXp: nextLevelXp(state.xp),
        streak: state.streakO.count, streakBest: state.streakO.best,
        freezes: state.streakO.freezes,
        tickets: state.tickets, owned: state.owned.slice(),
        questsDone: state.questsDone, seasons: Object.assign({}, state.seasons),
      });
    },
    recordPlay(id, title, type, domain){
      if (id && !state.played.includes(id)) { state.played.push(id); }
      if (domain && !state.domains.includes(domain)) state.domains.push(domain);
      if (type==='3D') unlock('play3d');
      bumpDaily({ plays:1, distinctId: id || ('t'+Date.now()) });
      save(state); evaluate();
    },
    recordWin(id, o){
      o=o||{}; state.wins++; state.stars+=(o.stars||0);
      const gained = Math.round((o.score||0)/10) + (o.stars||0)*50 + 30;
      state.xp += gained;
      const isPerfect = (o.stars||0)>=3;
      if (isPerfect) state.perfect++;
      const isCours = o.mode==='cours';
      if (isCours) state.cours++;
      bumpDaily({ wins:1, stars:(o.stars||0), xp:gained, perfect:isPerfect?1:0, cours:isCours?1:0 });
      save(state); evaluate();
    },
    unlock(id){ const r = unlock(id); if (r) { checkQuests(); save(state); evaluate(); } return r; },
    levelOf,

    /* ── Boucle de rétention ── */
    getDaily(){
      ensureDaily();
      const qs = questsOfDay(state.daily.date);
      return {
        date: state.daily.date,
        quests: qs.map(q => ({
          id:q.id, icon:q.icon, label:q.label, target:q.target,
          have: Math.min(q.target, questHave(q, state.daily.counts)),
          done: state.daily.done.includes(q.id),
        })),
        doneCount: state.daily.done.length,
        allDone: state.daily.done.length >= 3,
        trio: state.daily.trio,
      };
    },
    getStreak(){
      const st = state.streakO;
      return { count:st.count, best:st.best, freezes:st.freezes, last:st.last,
               savedOn:st.savedOn, activeToday: st.last === dayStr(), maxFreezes: MAX_FREEZES };
    },
    getWeek(){
      const wk = weekKey();
      const days = [];
      const base = wk.split('-');
      const monday = new Date(+base[0], +base[1]-1, +base[2]);
      const list = state.week.key === wk ? state.week.days : [];
      for (let i=0;i<7;i++){ const dd=new Date(monday); dd.setDate(monday.getDate()+i); days.push(list.indexOf(dayStr(dd))>=0); }
      const count = list.length;
      return { key:wk, days, count, ready: count>=7 && !state.week.claimed, claimed: state.week.key===wk && state.week.claimed, opened: state.week.opened||0 };
    },
    tickets(){ return state.tickets; },
    spendTickets(n, itemKey){
      n = Math.max(0, Math.round(n||0));
      if (state.tickets < n) return false;
      if (itemKey && state.owned.includes(itemKey)) return false;
      state.tickets -= n;
      if (itemKey) state.owned.push(itemKey);
      save(state); evaluate();
      return true;
    },
    grantItem(itemKey){
      if (!itemKey || state.owned.includes(itemKey)) return false;
      state.owned.push(itemKey); save(state); return true;
    },
    claimWeeklyChest(itemKey){
      const wk = weekKey();
      if (state.week.key !== wk || state.week.days.length < 7 || state.week.claimed) return false;
      state.week.claimed = true;
      state.week.opened = (state.week.opened||0) + 1;
      if (itemKey && !state.owned.includes(itemKey)) state.owned.push(itemKey);
      else if (!itemKey) state.tickets += 2; // collection complète → tickets bonus
      save(state); evaluate();
      return true;
    },
  };
})();
