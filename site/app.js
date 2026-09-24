/* =========================================================================
   app.js : noyau commun aux deux espaces.

   Il ne dessine rien. Il gère l'authentification, l'état partagé, le
   chargement des données et des moteurs, le thème, la palette, et il
   distribue les routes au module de vue correspondant au rôle :
     window.VUE_ELEVE  (vue-eleve.js)
     window.VUE_PROF   (vue-prof.js)
   ========================================================================= */
(function () {
  'use strict';

  const CLE_THEME = 'cours4e.theme';
  const CLE_PALETTE = 'cours4e.palette';

  const NIVEAUX = [
    { id: 'insuffisant', libelle: 'Insuffisant', picto: '◔' },
    { id: 'fragile', libelle: 'Fragile', picto: '◑' },
    { id: 'satisfaisant', libelle: 'Satisfaisant', picto: '◕' },
    { id: 'tresbien', libelle: 'Très bien', picto: '●' },
  ];
  const TYPES_DOC = [
    { id: 'cours', libelle: 'Cours', ico: 'ic-livre' },
    { id: 'revision', libelle: 'Révision', ico: 'ic-cerveau' },
    { id: 'exercices', libelle: 'Exercices', ico: 'ic-crayon' },
    { id: 'evaluation', libelle: 'Évaluation', ico: 'ic-graphique' },
  ];
  /** Un pictogramme du jeu commun, à la taille du texte qui l'entoure. */
  const ic = (nom, classe) => `<svg class="ic${classe ? ' ' + classe : ''}" aria-hidden="true"><use href="#${nom}"/></svg>`;
  const CRENEAUX = { A: 'Lundi', B: 'Mercredi', C: 'Vendredi' };
  const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const NOMS_COURTS = {
    'maths': 'Maths', 'francais': 'Français', 'physique-chimie': 'Phys-Chimie',
    'svt': 'SVT', 'histoire-geo': 'Hist-Géo', 'emc': 'EMC',
    'anglais-lv1': 'Anglais', 'espagnol-lv2': 'Espagnol',
  };
  const DEGRADES = {
    'maths': ['#2E7FC2', '#6FB6E8'], 'francais': ['#8046A8', '#C79BD6'],
    'physique-chimie': ['#C2481B', '#F0A184'], 'svt': ['#1F7A3C', '#7FCB9A'],
    'histoire-geo': ['#A2600F', '#E6B573'], 'emc': ['#0F6B63', '#6FC9BF'],
    'anglais-lv1': ['#3A45A8', '#9AA3E8'], 'espagnol-lv2': ['#A3154F', '#EB92B5'],
  };
  /** Les palettes. « palier » : le nombre d'étoiles qui débloque la palette (0 : toujours ouverte). */
  const PALETTES = [
    { id: 'aurore', nom: 'Aurore', c1: '#2BB5A0', c2: '#C79CE6', palier: 0 },
    { id: 'turquoise', nom: 'Turquoise', c1: '#22A395', c2: '#8FE3D5', palier: 0 },
    { id: 'rose', nom: 'Rose', c1: '#E8608E', c2: '#F7A8C4', palier: 0 },
    { id: 'indien', nom: 'Bleu indien', c1: '#1F6F8E', c2: '#8CC3DA', palier: 5 },
    { id: 'violet', nom: 'Violet pastel', c1: '#A97AD1', c2: '#EBC6EC', palier: 10 },
    { id: 'lavande', nom: 'Lavande', c1: '#7B6BE8', c2: '#B4A8F5', palier: 16 },
    { id: 'menthe', nom: 'Menthe', c1: '#1F9E86', c2: '#7FD3C1', palier: 24 },
    { id: 'corail', nom: 'Corail', c1: '#E96A43', c2: '#F7B199', palier: 34 },
    { id: 'ocean', nom: 'Océan', c1: '#2E7FC2', c2: '#8FC4E8', palier: 46 },
    { id: 'prune', nom: 'Prune', c1: '#9046A8', c2: '#C79BD6', palier: 60 },
  ];
  /** Une palette est ouverte quand le nombre d'étoiles atteint son palier. Le professeur voit tout. */
  const paletteOuverte = (id) => { const p = PALETTES.find((x) => x.id === id); return !p || !p.palier || estProf() || reussites().total >= p.palier; };
  /** Le prochain palier à atteindre, ou null quand tout est ouvert. */
  function prochainPalier() {
    const n = reussites().total;
    return PALETTES.filter((p) => p.palier > n).sort((a, b) => a.palier - b.palier)[0] || null;
  }

  const etat = {
    role: null,
    suivi: {}, resultats: {}, fiches: {}, ouvertures: {}, messagesNonLus: 0,
    seances: [],
    reglages: {},
    felicitations: [],
    acces: {}, verrous: {},
    profil: {},
  };
  /** Les modules hors programme : découverte, positionnement, visite. */
  const MODULES = {
    decouverte: { ref: 'decouverte', titre: 'Faire connaissance', icone: '🤝', url: '#/decouverte', notions: ['Nos cartes', 'Nos règles', 'Un premier jeu'] },
    positionnement: { ref: 'positionnement', titre: 'Où j\'en suis', icone: '🧭', url: '#/positionnement', notions: ['Cinq questions par matière', 'Sans note'] },
    visite: { ref: 'visite', titre: 'Visite guidée de l\'application', icone: '🗺️', url: '#/visite', notions: ['Six étapes avec Opale'] },
  };
  const MATIERE_MODULE = { id: 'module', nom: 'Module', icone: '✨', lecons: Object.values(MODULES) };
  /** Valeurs par défaut des réglages professeur, si le serveur ne répond pas. */
  const REGLAGES_DEFAUT = {
    pauses: true, tuteur: true, calculatrice: true, calculatrice_maths: true, calculatrice_evaluation: false,
    reactions: true, formatage: false, fils: true, felicitations: true, sonde: 45,
  };
  const reglage = (c) => (c in etat.reglages ? etat.reglages[c] : REGLAGES_DEFAUT[c]);
  /** Les réglages qui changent l'affichage sont portés par <html> : le CSS s'en sert. */
  function appliquerReglages() {
    const h = document.documentElement;
    ['pauses', 'tuteur', 'calculatrice', 'reactions', 'formatage', 'fils'].forEach((c) => {
      h.setAttribute('data-' + c, reglage(c) ? '1' : '0');
    });
  }
  let minuteur = null;

  /* ---------- Stockage local ------------------------------------------------ */
  const lire = (c, d) => { try { return JSON.parse(localStorage.getItem(c)) || d; } catch (e) { return d; } };
  const ecrire = (c, v) => { try { localStorage.setItem(c, JSON.stringify(v)); } catch (e) { /* privé */ } };

  /* ---------- Réseau -------------------------------------------------------- */
  /* A29 : une lecture qui échoue sur le réseau est reprise une fois, deux secondes plus tard.
     Une écriture n'est jamais rejouée d'elle-même. Hors ligne, le bandeau le dit. */
  async function api(chemin, options = {}) {
    const methode = (options.method || 'GET').toUpperCase();
    const appel = () => fetch('/api' + chemin, {
      credentials: 'same-origin',
      ...options,
      headers: options.body && !(options.body instanceof FormData)
        ? { 'content-type': 'application/json', ...(options.headers || {}) }
        : (options.headers || {}),
    });
    let reponse;
    try { reponse = await appel(); } catch (e) {
      if (methode !== 'GET' || options.sansReprise) { horsLigne(true); throw new Error(navigator.onLine === false ? 'Pas de connexion : réessaie quand le réseau revient.' : 'Le serveur ne répond pas.'); }
      await new Promise((r) => setTimeout(r, 2000));
      try { reponse = await appel(); } catch (e2) { horsLigne(true); throw new Error(navigator.onLine === false ? 'Pas de connexion : réessaie quand le réseau revient.' : 'Le serveur ne répond pas.'); }
    }
    horsLigne(false);
    if (reponse.status === 401) { retourPortail(); throw new Error('Session expirée'); }
    const donnees = await reponse.json().catch(() => ({}));
    if (!reponse.ok) { const err = new Error(donnees.erreur || 'Erreur serveur'); err.code = donnees.code; err.statut = reponse.status; throw err; }
    return donnees;
  }
  let etaitHorsLigne = false;
  function horsLigne(oui) {
    if (oui === etaitHorsLigne) return;
    etaitHorsLigne = oui;
    document.documentElement.setAttribute('data-hors-ligne', oui ? '1' : '0');
    if (!oui) rejouerAttente();
  }
  window.addEventListener('online', () => { horsLigne(false); });
  window.addEventListener('offline', () => { horsLigne(true); });
  /* C87 : les écritures faites hors ligne attendent dans l'appareil et repartent au retour du réseau. */
  const CLE_ATTENTE = 'opaline.attente';
  function mettreEnAttente(chemin, options) {
    const liste = lire(CLE_ATTENTE, []);
    liste.push({ chemin, options: { method: options.method, body: options.body }, le: Date.now() });
    ecrire(CLE_ATTENTE, liste.slice(-50));
  }
  let rejeuEnCours = false;
  async function rejouerAttente() {
    if (rejeuEnCours || !etat.role) return;
    const liste = lire(CLE_ATTENTE, []);
    if (!liste.length) return;
    rejeuEnCours = true;
    const restantes = [];
    for (const x of liste) {
      try { await api(x.chemin, { ...x.options, sansReprise: true }); } catch (e) { if (!e.statut) restantes.push(x); }
    }
    ecrire(CLE_ATTENTE, restantes);
    rejeuEnCours = false;
    if (liste.length !== restantes.length) { signaler((liste.length - restantes.length) + ' action(s) envoyée(s) au retour du réseau.', 'succes'); rafraichirEtat(); }
  }
  /* A53 : les erreurs JavaScript sont remontées, dix par minute au plus, sans jamais gêner l'écran. */
  const erreursVues = new Set();
  function remonterErreur(message, source) {
    try {
      const cle = String(message).slice(0, 80);
      if (!etat.role || erreursVues.has(cle) || erreursVues.size > 10) return;
      erreursVues.add(cle);
      fetch('/api/erreur', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: String(message).slice(0, 300), source: String(source || '').slice(0, 200), ecran: location.hash.slice(0, 120) }) }).catch(() => {});
    } catch (e) { /* jamais d'erreur dans le rapport d'erreur */ }
  }
  window.addEventListener('error', (ev) => remonterErreur(ev.message || 'Erreur', (ev.filename || '') + ':' + (ev.lineno || '')));
  window.addEventListener('unhandledrejection', (ev) => remonterErreur('Promesse rejetée : ' + (ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason)), ''));

  /** C77 : toutes les annonces vocales passent par une seule région, jamais deux lecteurs en même temps. */
  function annoncer(texte) {
    const z = document.getElementById('e-annonces'); if (!z || !texte) return;
    z.textContent = ''; setTimeout(() => { z.textContent = String(texte); }, 30);
  }
  /* C91, C81 : quatre sons courts et doux, réglables, coupés en évaluation ; chacun a son équivalent visuel. */
  const CLE_SONS = 'opaline.sons';
  let ctxAudio = null;
  const SONS = { ok: [[660, 0.09], [880, 0.12]], etoile: [[523, 0.12], [659, 0.12], [784, 0.2]], message: [[740, 0.08]], fin: [[392, 0.1], [523, 0.16]] };
  const LIBELLES_SONS = { ok: 'réussite', etoile: 'étoile', message: 'message', fin: 'fin de série' };
  function sonsActifs() {
    if (estProf()) return false;
    if (document.documentElement.getAttribute('data-confort-sons') === 'off') return false;
    if (lire(CLE_SONS, true) === false) return false;
    if (/\/evaluation/.test(location.hash)) return false;
    return true;
  }
  function montrerSon(nom) {
    if (!document.getElementById('app-eleve') || lire(CLE_SONS, true) === false) return;
    let z = document.getElementById('e-son-visuel');
    if (!z) { z = document.createElement('p'); z.id = 'e-son-visuel'; z.className = 'e-son-visuel'; z.setAttribute('aria-hidden', 'true'); document.body.appendChild(z); }
    z.textContent = '♪ ' + (LIBELLES_SONS[nom] || nom); z.classList.add('visible');
    clearTimeout(montrerSon.t); montrerSon.t = setTimeout(() => z.classList.remove('visible'), 1400);
  }
  function son(nom) {
    montrerSon(nom);
    if (!sonsActifs()) return;
    try {
      ctxAudio = ctxAudio || new (window.AudioContext || window.webkitAudioContext)();
      let t = ctxAudio.currentTime;
      (SONS[nom] || SONS.ok).forEach(([f, d]) => {
        const o = ctxAudio.createOscillator(); const g = ctxAudio.createGain(); o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.07, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g); g.connect(ctxAudio.destination); o.start(t); o.stop(t + d + 0.02); t += d * 0.8;
      });
    } catch (e) { /* pas de son sur cet appareil */ }
  }
  function signaler(message, type = 'erreur') {
    annoncer(message);
    if (type === 'succes') son('ok');
    const id = estProf() ? 'p-bandeau' : 'e-bandeau';
    const prefixe = estProf() ? 'p-bandeau' : 'e-bandeau';
    const zone = document.getElementById(id);
    if (!zone) return;
    zone.className = `${prefixe} ${prefixe}-${type}`;
    zone.textContent = message;
    zone.hidden = false;
    clearTimeout(signaler.t);
    signaler.t = setTimeout(() => { zone.hidden = true; }, 5000);
  }

  /** C89 : l'opale d'une matière, dessinée dans ses couleurs. */
  let nGemme = 0;
  function gemme(mid, classe) {
    const [c1, c2] = DEGRADES[mid] || ['#2BB5A0', '#C79CE6'];
    nGemme += 1; const id = 'gemme-' + nGemme;
    return `<svg class="e-gemme ${classe || ''}" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c1}"/></linearGradient></defs><path d="M32 4 56 24 32 60 8 24Z" fill="url(#${id})"/><path d="M8 24h48L32 34Z" fill="#fff" opacity=".32"/><path d="M32 4 20 24h24Z" fill="#fff" opacity=".18"/></svg>`;
  }

  /** C92, C48 : l'aurore du fond. Une teinte par période de l'année, ou celle qu'elle a choisie parmi les paliers. */
  const AURORES = [
    { id: 'verte', nom: 'Aurore verte', teinte: 0, palier: 0 },
    { id: 'violette', nom: 'Aurore violette', teinte: 70, palier: 10 },
    { id: 'rose', nom: 'Aurore rose', teinte: 200, palier: 25 },
    { id: 'doree', nom: 'Aurore dorée', teinte: 300, palier: 50 },
  ];
  const CLE_AURORE = 'opaline.aurore';
  function periodeCourante(d = new Date()) {
    const m = d.getMonth() + 1;
    return m >= 9 && m <= 10 ? 1 : m >= 11 ? 2 : m <= 2 ? 3 : m <= 4 ? 4 : 5;
  }
  const auroreOuverte = (a) => !a.palier || estProf() || reussites().total >= a.palier;
  function auroreCourante() {
    const choisie = AURORES.find((a) => a.id === lire(CLE_AURORE, null));
    if (choisie && auroreOuverte(choisie)) return choisie;
    return AURORES[(periodeCourante() - 1) % AURORES.length];
  }
  const CLE_ECO = 'opaline.eco';
  const ecoActive = () => lire(CLE_ECO, false) === true || (navigator.connection && navigator.connection.saveData === true);
  function basculerEco(oui) { ecrire(CLE_ECO, !!oui); appliquerAurore(); }
  function appliquerAurore() {
    document.documentElement.toggleAttribute('data-eco', ecoActive());
    const a = auroreCourante();
    document.documentElement.setAttribute('data-aurore', a.id);
    document.documentElement.style.setProperty('--e-aurore-teinte', a.teinte + 'deg');
    document.documentElement.setAttribute('data-periode', String(periodeCourante()));
  }
  function choisirAurore(id) { ecrire(CLE_AURORE, id); appliquerAurore(); }

  /** C46 : les jours où elle a travaillé, pour la série de jours (sans pénalité de rupture). */
  const CLE_JOURS = 'opaline.jours';
  function marquerJour() {
    const jours = lire(CLE_JOURS, []);
    const auj = jourIso();
    if (jours.indexOf(auj) === -1) { jours.push(auj); ecrire(CLE_JOURS, jours.slice(-120)); }
  }
  function serieJours() {
    const jours = new Set(lire(CLE_JOURS, []));
    Object.values(etat.fiches).forEach((f) => { if (f.termine_le) jours.add(String(f.termine_le).slice(0, 10)); });
    Object.values(etat.resultats).forEach((r) => { if (r.maj_le) jours.add(String(r.maj_le).slice(0, 10)); });
    const auj = jourIso();
    let n = 0; let d = jours.has(auj) ? auj : decaler(auj, -1);
    while (jours.has(d)) { n += 1; d = decaler(d, -1); }
    return { n, aujourdhui: jours.has(auj), reprise: n === 0 && jours.size > 0 };
  }

  /** C78 : la taille du texte en trois crans, depuis la barre du haut, en accord avec le panneau de confort. */
  function cranTaille(sens) {
    let s = {};
    try { s = JSON.parse(localStorage.getItem('konstrio-confort') || '{}') || {}; } catch (e) { s = {}; }
    const actuel = Number(s.taille) > 0 ? Math.min(2, Number(s.taille)) : 0;
    const suivant = sens === undefined ? (actuel + 1) % 3 : Math.max(0, Math.min(2, actuel + sens));
    s.taille = suivant;
    try { localStorage.setItem('konstrio-confort', JSON.stringify(s)); } catch (e) { /* privé */ }
    const h = document.documentElement;
    h.classList.remove('cf-scale-n1', 'cf-scale-1', 'cf-scale-2', 'cf-scale-3');
    if (suivant > 0) h.classList.add('cf-scale-' + suivant);
    if (window.__konstrioConfort && window.__konstrioConfort.state) { try { window.__konstrioConfort.state().taille = suivant; } catch (e) { /* ignore */ } }
    const b = document.getElementById('e-btn-taille');
    if (b) { b.setAttribute('aria-label', 'Taille du texte : ' + ['normale', 'grande', 'très grande'][suivant] + '. Cliquer pour changer.'); b.setAttribute('data-cran', String(suivant)); }
    signaler('Texte ' + ['normal', 'plus grand', 'très grand'][suivant] + '.', 'info');
  }

  /** C84 : un squelette de chargement, à la forme de ce qui arrive (fiche ou série). */
  function squelette(genre) {
    const lignes = (n) => Array.from({ length: n }, (_, i) => `<i style="width:${[92, 78, 85, 60, 88, 70][i % 6]}%"></i>`).join('');
    if (genre === 'serie') return `<div class="e-squelette e-squelette-serie" role="status" aria-label="Chargement de la série"><b></b><div class="bloc">${lignes(2)}<span></span><span></span><span></span></div></div>`;
    return `<div class="e-squelette" role="status" aria-label="Chargement de la fiche"><b></b><em></em><div class="bloc">${lignes(6)}</div><div class="bloc">${lignes(4)}</div></div>`;
  }

  /* ---------- Utilitaires ---------------------------------------------------- */
  const ech = (t) => String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const estProf = () => etat.role === 'prof';
  const matiere = (id) => (window.PROGRAMME ? PROGRAMME.matieres.find((m) => m.id === id) : null) || null;
  const lecon = (m, ref) => (m ? m.lecons.find((l) => l.ref === ref) : null) || null;
  const cle = (mid, ref) => mid + '/' + ref;
  /**
   * La banque d'exercices pèse plus de 500 ko : au démarrage on ne charge qu'un
   * index (titre et nombre de questions par leçon). La banque complète arrive
   * à la première série ouverte, par chargerBanque().
   */
  /** Les questions modifiées ou ajoutées par le professeur (profil « question.* » et « questions.* ») s'appliquent par-dessus la banque. */
  function appliquerSurcharges(k, b) {
    if (!b || !Array.isArray(b.items)) return b;
    const ajoutees = etat.profil['questions.' + k];
    let items = b.items;
    let change = false;
    items = items.map((q, i) => { const s = etat.profil['question.' + k + '/' + i]; if (s && typeof s === 'object') { change = true; return { ...q, ...s }; } return q; });
    if (Array.isArray(ajoutees) && ajoutees.length) { change = true; items = items.concat(ajoutees.filter((q) => q && q.q)); }
    return change ? { ...b, items } : b;
  }
  const banque = (mid, ref) => {
    const k = cle(mid, ref);
    if (!estProf() && etat.role && !accesDoc(mid, ref, 'serie')) return null;
    if (window.EXERCICES && window.EXERCICES[k]) return appliquerSurcharges(k, window.EXERCICES[k]);
    const i = (window.EXERCICES_INDEX || {})[k];
    return i ? { titre: i.titre, n: i.n, items: null } : null;
  };
  let banquePromise = null;
  function chargerBanque() {
    if (window.EXERCICES) return Promise.resolve(window.EXERCICES);
    if (!banquePromise) banquePromise = chargerScript('data/exercices.js').then(() => window.EXERCICES || {});
    return banquePromise;
  }
  const niveauDe = (mid, ref) => (etat.suivi[cle(mid, ref)] || {}).niveau || null;
  const estValidee = (mid, ref) => ['satisfaisant', 'tresbien'].indexOf(niveauDe(mid, ref)) !== -1;
  const dossierPdf = (mid) => 'pdf/dossiers/' + mid + '.pdf';
  const nomCourt = (id) => NOMS_COURTS[id] || id;

  const jourIso = (d = new Date()) => {
    const x = new Date(d);
    x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
    return x.toISOString().slice(0, 10);
  };
  const decaler = (iso, n) => {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + n);
    return jourIso(d);
  };
  const lundiDe = (iso) => decaler(iso, -((new Date(iso + 'T12:00:00').getDay() + 6) % 7));
  /* A34 : une seule fonction de formatage. ISO en base, heure de Paris à l'écran, quel que soit l'appareil. */
  const FUSEAU = 'Europe/Paris';
  const STYLES_DATE = {
    jour: { weekday: 'short', day: 'numeric', month: 'short' }, complet: { weekday: 'long', day: 'numeric', month: 'long' },
    long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, court: { day: '2-digit', month: '2-digit' },
    heure: { hour: '2-digit', minute: '2-digit' }, mois: { month: 'long', year: 'numeric' },
  };
  function formaterDate(iso, style) {
    if (!iso) return '';
    const seul = /^\d{4}-\d{2}-\d{2}$/.test(String(iso));
    const d = new Date(seul ? iso + 'T12:00:00' : iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    try { return new Intl.DateTimeFormat('fr-FR', Object.assign({ timeZone: FUSEAU }, STYLES_DATE[style] || STYLES_DATE.jour)).format(d); }
    catch (e) { return d.toLocaleDateString('fr-FR'); }
  }
  const enFrancais = (iso, complet) => formaterDate(iso, complet ? 'complet' : 'jour');
  const dateCourte = (iso) => (iso ? formaterDate(iso, 'court') + ' à ' + formaterDate(iso, 'heure') : '');
  const poids = (o) => (o > 1048576 ? (o / 1048576).toFixed(1) + ' Mo' : Math.max(1, Math.round(o / 1024)) + ' Ko');

  function progression(m) {
    const faites = m.lecons.filter((l) => estValidee(m.id, l.ref)).length;
    return { faites, total: m.lecons.length, pct: Math.round((faites / m.lecons.length) * 100) };
  }
  function chiffres() {
    let total = 0; let validees = 0; let pretes = 0; let fragiles = 0;
    PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => {
      total += 1;
      const n = niveauDe(m.id, l.ref);
      if (n === 'satisfaisant' || n === 'tresbien') validees += 1;
      if (n === 'insuffisant' || n === 'fragile') fragiles += 1;
      if (l.docs && l.docs.length === 4) pretes += 1;
    }));
    return { total, validees, pretes, fragiles };
  }
  function libelleLecon(ref) {
    const [mid, r] = String(ref).split('/');
    if (mid === 'module') return MODULES[r] ? { m: MATIERE_MODULE, l: MODULES[r] } : null;
    const m = matiere(mid);
    const l = lecon(m, r);
    return m && l ? { m, l } : null;
  }

  /** Une leçon est-elle déjà passée dans une séance planifiée ? */
  function programmee(mid, ref) {
    const aujourd = jourIso();
    return etat.seances.some((s) => s.date <= aujourd && (s.lecons || []).indexOf(cle(mid, ref)) !== -1);
  }

  /** Décision explicite du professeur : 1 poussée, 0 retenue, null règle auto. */
  function decision(mid, ref) {
    const o = etat.ouvertures[cle(mid, ref)];
    return o ? o.etat : null;
  }

  /**
   * Accès à un élément d'une leçon (cours, revision, exercices, serie, evaluation)
   * ou à un jeu (accesJeu), décidé par le professeur dans la page Accès. Sans
   * décision : tout suit l'ouverture de la leçon, sauf l'évaluation, fermée.
   * Une ouverture peut porter une date de fin.
   */
  function decisionAcces(k) {
    const a = etat.acces[k];
    if (!a) return null;
    if (a.etat !== 1) return false;
    if (a.jusqu_au && a.jusqu_au < new Date().toISOString()) return false;
    return true;
  }
  function accesDoc(mid, ref, type) {
    if (estProf()) return true;
    const d = decisionAcces(cle(mid, ref) + '/' + type);
    if (d !== null) return d;
    return type !== 'evaluation' && accessible(mid, ref);
  }
  function accesJeu(id) {
    if (estProf()) return true;
    const d = decisionAcces('jeu/' + id);
    return d === null ? true : d;
  }

  /** Profil partagé : lecture, et écriture d'une clé (Sterenn : « moi.* »). */
  const profil = (k, defaut) => (k in etat.profil ? etat.profil[k] : defaut);
  async function enregistrerProfil(k, valeur) {
    const d = await api('/profil', { method: 'PUT', body: JSON.stringify({ cle: k, valeur }) });
    if (d.valeur === null) delete etat.profil[k]; else etat.profil[k] = d.valeur;
    return d.valeur;
  }

  /** Ce que dirait la règle automatique, sans tenir compte de la décision. */
  function reglementaire(mid, ref) {
    const m = matiere(mid);
    if (!m) return false;
    const i = m.lecons.findIndex((l) => l.ref === ref);
    if (i <= 0) return true;
    if (programmee(mid, ref)) return true;
    return estValidee(mid, m.lecons[i - 1].ref);
  }

  /**
   * Accès progressif : Sterenn n'a pas les 72 leçons d'un bloc. Le professeur
   * pousse ou retient une leçon quand il le décide ; sans décision, la règle
   * automatique s'applique (première de la matière, précédente validée, ou
   * déjà mise au programme d'une séance passée).
   */
  function accessible(mid, ref) {
    if (estProf()) return true;
    const v = etat.verrous[cle(mid, ref)];
    if (typeof v === 'boolean') return v;
    const d = decision(mid, ref);
    if (d === 1) return true;
    if (d === 0) return false;
    return reglementaire(mid, ref);
  }

  function raisonVerrou(mid, ref) {
    if (decision(mid, ref) === 0) return 'Cette leçon arrivera un peu plus tard.';
    const m = matiere(mid);
    const i = m.lecons.findIndex((l) => l.ref === ref);
    const precedente = i > 0 ? m.lecons[i - 1] : null;
    return precedente
      ? `S'ouvre quand « ${precedente.titre} » est validée, ou quand elle est mise au programme.`
      : 'Pas encore ouverte.';
  }

  /**
   * Les réussites remplacent la notion de niveau : elles comptent des acquis
   * réels, pas du temps passé. Une fiche terminée, une série réussie, une
   * leçon validée. Rien ne se perd, rien ne descend.
   */
  const SERIE_REUSSIE = 0.7;
  function reussites() {
    const fiches = Object.keys(etat.fiches).length;
    let series = 0;
    let jeux = 0;
    Object.entries(etat.resultats).forEach(([k, r]) => {
      if (!(r.total > 0 && r.meilleur / r.total >= SERIE_REUSSIE)) return;
      if (k.indexOf('jeu/') === 0) jeux += 1; else series += 1;
    });
    let lecons = 0;
    Object.values(etat.suivi).forEach((s) => {
      if (s.niveau === 'satisfaisant' || s.niveau === 'tresbien') lecons += 1;
    });
    const felicitations = (etat.felicitations || []).length;
    // C35 : une étoile bonus par semaine où le défi du jour a été fait cinq jours sur cinq.
    const semaines = {};
    Object.keys(etat.profil || {}).forEach((k) => {
      if (k.indexOf('moi.defi.') !== 0) return;
      const j = k.slice(9); const v = profil(k, null);
      if (/^\d{4}-\d{2}-\d{2}$/.test(j) && v && v.fait) { const l = lundiDe(j); semaines[l] = (semaines[l] || 0) + 1; }
    });
    const defis = Object.values(semaines).filter((n) => n >= 5).length;
    // C50 : les défis lancés par Bastien et réussis valent une étoile bonus chacun.
    const defisBastien = (profil('prof.defis', []) || []).filter((d) => d && d.etat === 'reussi').length;
    return { fiches, series, jeux, lecons, felicitations, defis, defisBastien, total: fiches + series + jeux + lecons * 3 + felicitations + defis + defisBastien };
  }

  /**
   * Fête d'une étoile gagnée : comparée à la dernière valeur connue sur cet
   * appareil, la première augmentation déclenche une célébration. Le message
   * dit d'où vient l'étoile. Coupée par le réglage « felicitations ».
   */
  const CLE_ETOILES = 'opaline.etoiles';
  function celebrer(titre, detail) {
    if (!reglage('felicitations') || !document.getElementById('app-eleve')) return;
    const ancien = document.getElementById('e-fete'); if (ancien) ancien.remove();
    const el = document.createElement('div');
    el.id = 'e-fete'; el.className = 'e-fete'; el.setAttribute('aria-hidden', 'true');
    annoncer(titre + (detail ? '. ' + detail : '')); son('etoile');
    el.innerHTML = `<div class="e-fete-carte">
      <svg class="e-fete-opale" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="fete-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FF0C8"/><stop offset=".4" stop-color="#2BB5A0"/><stop offset=".72" stop-color="#2A7FA6"/><stop offset="1" stop-color="#C79CE6"/></linearGradient></defs><path d="M32 6 54 26 32 60 10 26Z" fill="url(#fete-g)"/><path d="M10 26h44L32 34Z" fill="#fff" opacity=".35"/><circle cx="25" cy="32" r="3.2" fill="#0b1a3a"/><circle cx="39" cy="32" r="3.2" fill="#0b1a3a"/><path d="M27 40q5 4 10 0" stroke="#0b1a3a" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
      <p class="e-fete-titre">${ech(titre)}</p>
      ${detail ? `<p class="e-fete-detail">${ech(detail)}</p>` : ''}
      <span class="e-fete-etoiles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <button type="button" class="e-bouton e-fete-ok">Continuer</button>
    </div>`;
    document.body.appendChild(el);
    const liberer = piegerFocus(el, document.activeElement);
    const fermer = () => { liberer(); el.classList.add('fin'); setTimeout(() => el.remove(), 250); };
    el.querySelector('.e-fete-ok').addEventListener('click', fermer);
    el.addEventListener('click', (ev) => { if (ev.target === el) fermer(); });
    setTimeout(fermer, 7000);
    try { if (window.KonstrioAudio && window.KonstrioAudio.play) window.KonstrioAudio.play('bravo'); } catch (e) { /* silence */ }
  }
  function feterNouvellesEtoiles() {
    const r = reussites();
    const avant = lire(CLE_ETOILES, null);
    ecrire(CLE_ETOILES, { total: r.total, fiches: r.fiches, series: r.series, jeux: r.jeux, lecons: r.lecons, felicitations: r.felicitations });
    if (!avant || typeof avant.total !== 'number' || r.total <= avant.total) return;
    const gain = r.total - avant.total;
    let detail = '';
    if (r.felicitations > (avant.felicitations || 0)) {
      const f = (etat.felicitations || [])[0];
      detail = f ? 'Bastien te félicite : ' + f.texte : 'Bastien te félicite pour ton devoir.';
    } else if (r.lecons > (avant.lecons || 0)) detail = 'Une leçon validée par Bastien, trois étoiles.';
    else if (r.jeux > (avant.jeux || 0)) detail = 'Un monde terminé avec au moins deux étoiles.';
    else if (r.series > (avant.series || 0)) detail = 'Une série réussie à 70 % ou plus.';
    else if (r.fiches > (avant.fiches || 0)) detail = 'Une fiche terminée.';
    celebrer(gain > 1 ? `${gain} étoiles de plus` : 'Une étoile de plus', detail);
  }

  /* ---------- Chargement ------------------------------------------------------ */
  const VERSION = window.OPALINE_VERSION || '';
  function chargerScript(src, type) {
    return new Promise((ok, ko) => {
      // Déjà livré par le paquet du rôle : rien à charger.
      if (window.PAQUET_CHARGE && window.PAQUET_CHARGE[src]) return ok();
      if (document.querySelector(`script[src="${src}"], script[src="${src}?v=${VERSION}"]`)) return ok();
      const s = document.createElement('script');
      s.src = VERSION && !/^data\//.test(src) && src.indexOf('?') === -1 ? src + '?v=' + VERSION : src;
      if (type) s.type = type;
      s.onload = ok;
      s.onerror = () => ko(new Error('Chargement impossible : ' + src));
      document.head.appendChild(s);
    });
  }
  const enCours = {};
  /**
   * Le professeur lit `data/contenu`, complet. Sterenn lit `data/eleve`, généré
   * sans les corrigés ni les grilles d'évaluation. Le serveur refuse l'autre
   * chemin à son rôle : ce n'est pas seulement un masquage côté navigateur.
   */
  const matieresCompletes = new Set();
  /** A25 : avec `ref`, on charge le seul fichier de la leçon (douze fois plus léger) ; sans `ref`, toute la matière. */
  function chargerContenu(mid, ref) {
    if (ref && window.CONTENU && window.CONTENU[mid] && window.CONTENU[mid][ref]) return Promise.resolve(window.CONTENU[mid]);
    if (!ref && matieresCompletes.has(mid) && window.CONTENU && window.CONTENU[mid]) return Promise.resolve(window.CONTENU[mid]);
    const cle = ref ? mid + '/' + ref : mid;
    if (enCours[cle]) return enCours[cle];
    enCours[cle] = new Promise((res) => {
      const s = document.createElement('script');
      s.src = (estProf() ? 'data/contenu/' : 'data/eleve/') + (ref ? mid + '/' + ref : mid) + '.js';
      s.onload = () => { if (!ref) matieresCompletes.add(mid); res((window.CONTENU || {})[mid] || null); };
      s.onerror = () => { if (ref) { chargerContenu(mid).then(res); return; } res(null); };
      document.head.appendChild(s);
    });
    return enCours[cle];
  }
  const chargerSeances = (du, au) => api(`/seances?du=${du}&au=${au}`).then((d) => d.seances || []).catch(() => []);

  /* ---------- Thème et palette -------------------------------------------------- */
  const THEMES = ['light', 'dark', 'chaud'];
  function appliquerTheme(v) {
    document.documentElement.setAttribute('data-theme', THEMES.indexOf(v) === -1 ? 'light' : v);
    ecrire(CLE_THEME, v);
  }
  function appliquerPalette(id) {
    document.documentElement.setAttribute('data-palette', id);
    ecrire(CLE_PALETTE, id);
  }
  appliquerTheme(lire(CLE_THEME, 'light'));
  appliquerPalette(lire(CLE_PALETTE, 'aurore'));

  /* ---------- Portail ------------------------------------------------------------ */
  function ouvrirPortail() {
    document.body.className = 'corps-portail';
    document.getElementById('portail').hidden = false;
    document.getElementById('app-eleve').hidden = true;
    document.getElementById('app-prof').hidden = true;
    document.getElementById('code').focus();
  }
  function retourPortail() {
    etat.role = null;
    etat.suivi = {}; etat.resultats = {}; etat.fiches = {};
    etat.ouvertures = {}; etat.seances = []; etat.messagesNonLus = 0; etat.reglages = {}; etat.felicitations = [];
    etat.acces = {}; etat.verrous = {}; etat.profil = {};
    if (minuteur) { clearInterval(minuteur); minuteur = null; }
    location.hash = '';
    document.getElementById('code').value = '';
    ouvrirPortail();
  }

  async function ouvrirApp(role) {
    etat.role = role;
    document.getElementById('portail').hidden = true;
    if (role === 'prof') {
      document.body.className = 'corps-prof';
      document.getElementById('app-prof').hidden = false;
      document.getElementById('app-eleve').hidden = true;
    } else {
      document.body.className = 'corps-eleve';
      document.getElementById('app-eleve').hidden = false;
      document.getElementById('app-prof').hidden = true;
    }

    // Tout part en même temps : scripts de la vue et des données, état partagé,
    // séances. Le premier écran attend le plus lent, pas la somme de tous.
    try {
      // Le paquet du rôle d'abord ; s'il manque (ancien build), les fichiers un par un.
      await chargerScript(role === 'prof' ? 'paquet-prof.js' : 'paquet-eleve.js').catch(() => {});
      // Le premier écran n'attend que l'essentiel : la vue, le programme, l'état, les séances.
      // L'index des séries et le catalogue des jeux arrivent juste après et l'écran se met à jour.
      const secondaires = Promise.all([
        chargerScript('data/exercices-index.js').catch(() => chargerScript('data/exercices.js')).catch(() => {}),
        chargerScript('data/jeux.js').catch(() => { window.JEUX = []; }),
      ]).then(() => { etat.secondairesPrets = true; });
      await Promise.all([
        chargerScript(role === 'prof' ? 'vue-prof.js' : 'vue-eleve.js'),
        chargerScript(role === 'prof' ? 'data/programme.js' : 'data/programme-eleve.js').catch(() => chargerScript('data/programme.js')),
        chargerScript('planificateur.js'),
        rafraichirEtat(), rafraichirSeances(),
        role === 'prof' ? secondaires : null,
      ]);
      if (role === 'eleve') secondaires.then(() => {
        // Le premier écran a pu se dessiner sans les jeux ni les séries : on le redessine une fois.
        const r = (location.hash || '#/').replace(/^#\/?/, '').split('/')[0];
        if (etat.role && ['', 'hub', 'accueil', 'jeux', 'matiere', 'matieres', 'lecon'].indexOf(r) !== -1 && !document.querySelector('.e-exo, .p-form')) router();
      });
    } catch (e) {
      signaler('Le programme n\'a pas pu être chargé. Recharge la page.');
      return;
    }
    if (window.PROGRAMME) PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => { l.matiere = m.id; }));
    majTitre();

    try { await chargerScript('messagerie.js'); } catch (e) { /* la messagerie reste en texte simple */ }

    if (role === 'eleve') {
      // Moteurs de l'espace de Sterenn : accessibilité, trophées, sons.
      chargerScript('moteurs/audio-engine.js').catch(() => {});
      chargerScript('moteurs/confort.js').catch(() => {});
      chargerScript('tuteur.js').catch(() => {});
      construirePalette();
      majBoutonTheme();
      majReussites();
      appliquerAurore();
      const bt = document.getElementById('e-btn-taille');
      if (bt && !bt.__branche) { bt.__branche = true; bt.addEventListener('click', () => cranTaille()); }
    }

    if (minuteur) clearInterval(minuteur);
    minuteur = setInterval(sonder, Math.max(20, Math.min(300, Number(reglage('sonde')) || 45)) * 1000);
    if (role === 'prof') appliquerPilotage();
    if (!estProf() && !sessionStorage.getItem('opaline.connexion-notee')) {
      // C98 : elle voit ses propres connexions ; une seule note par session du navigateur.
      try {
        sessionStorage.setItem('opaline.connexion-notee', '1');
        const c = profil('moi.connexions', {}) || {};
        enregistrerProfil('moi.connexions', { derniere: new Date().toISOString(), precedente: c.derniere || null, nombre: (Number(c.nombre) || 0) + 1 }).catch(() => {});
      } catch (e) { /* sans mémoire de connexion */ }
    }
    if (!reprendreDernier()) router();
    rejouerAttente();
    // A23 : le service worker garde la coquille et les fiches ouvertes pour le hors-ligne.
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }
  /** B39, B48 : accent et densité de l'espace professeur, retenus sur l'appareil. */
  const CLE_PILOTAGE = 'opaline.pilotage';
  function appliquerPilotage(changement) {
    const p = Object.assign({ accent: 'bleu', densite: 'confortable' }, lire(CLE_PILOTAGE, {}), changement || {});
    if (changement) ecrire(CLE_PILOTAGE, p);
    document.documentElement.setAttribute('data-accent', p.accent);
    document.documentElement.setAttribute('data-densite', p.densite);
    return p;
  }

  async function rafraichirEtat() {
    try {
      const d = await api('/etat');
      etat.suivi = d.suivi || {};
      etat.resultats = d.resultats || {};
      etat.fiches = d.fiches || {};
      etat.ouvertures = d.ouvertures || {};
      etat.reglages = d.reglages || {};
      etat.felicitations = d.felicitations || [];
      etat.acces = d.acces || {};
      etat.verrous = d.verrous || {};
      etat.profil = d.profil || {};
      etat.messagesNonLus = d.messagesNonLus || 0;
      etat.role = d.role || etat.role;
      appliquerReglages();
    } catch (e) {
      if (e.message !== 'Session expirée') signaler('Données indisponibles : ' + e.message);
    }
  }
  async function rafraichirSeances() {
    try { etat.seances = (await api('/seances')).seances || []; } catch (e) { etat.seances = []; }
  }
  let empreinteEtat = null;
  async function sonder() {
    if (!etat.role) return;
    try {
      const reponse = await fetch('/api/etat', { credentials: 'same-origin', headers: empreinteEtat ? { 'if-none-match': empreinteEtat } : {} });
      if (reponse.status === 304) return;
      if (reponse.status === 401) { retourPortail(); return; }
      if (!reponse.ok) return;
      empreinteEtat = reponse.headers.get('etag');
      const d = await reponse.json();
      const avant = etat.messagesNonLus;
      etat.messagesNonLus = d.messagesNonLus || 0;
      if (etat.messagesNonLus > avant && etat.role === 'eleve') son('message');
      if (d.reglages && JSON.stringify(d.reglages) !== JSON.stringify(etat.reglages)) {
        const avantSonde = reglage('sonde');
        etat.reglages = d.reglages;
        appliquerReglages();
        if (reglage('sonde') !== avantSonde) { clearInterval(minuteur); minuteur = setInterval(sonder, Math.max(20, Math.min(300, Number(reglage('sonde')) || 45)) * 1000); }
      }
      if (etat.role === 'eleve') {
        etat.suivi = d.suivi || etat.suivi;
        etat.resultats = d.resultats || etat.resultats;
        etat.fiches = d.fiches || etat.fiches;
        etat.felicitations = d.felicitations || etat.felicitations;
        etat.acces = d.acces || etat.acces;
        etat.verrous = d.verrous || etat.verrous;
        majReussites();
      }
      if (etat.messagesNonLus !== avant) {
        vueActive().nav();
        majTitre();
        if (etat.messagesNonLus > avant) signaler('Nouveau message.', 'info');
      }
    } catch (e) { /* sonde silencieuse */ }
    verifierRappel();
  }

  /** C52 : le titre de l'onglet dit les messages non lus, sans son. */
  const TITRE_BASE = document.title;
  function majTitre() {
    const n = etat.role ? etat.messagesNonLus : 0;
    document.title = n ? `(${n}) ${TITRE_BASE}` : TITRE_BASE;
  }

  /** C60 : un rappel du navigateur une heure avant le temps personnel, si Sterenn l'a accepté. */
  const CLE_RAPPEL = 'opaline.rappel';
  function rappelActif() { return lire(CLE_RAPPEL, false) === true && typeof Notification !== 'undefined' && Notification.permission === 'granted'; }
  async function activerRappel(oui) {
    if (!oui) { ecrire(CLE_RAPPEL, false); return false; }
    if (typeof Notification === 'undefined') { signaler('Ton navigateur ne sait pas afficher de rappel.'); return false; }
    let perm = Notification.permission;
    if (perm !== 'granted') { try { perm = await Notification.requestPermission(); } catch (e) { perm = 'denied'; } }
    if (perm !== 'granted') { signaler('Le rappel n\'est pas autorisé par le navigateur.'); ecrire(CLE_RAPPEL, false); return false; }
    ecrire(CLE_RAPPEL, true);
    return true;
  }
  function verifierRappel() {
    if (etat.role !== 'eleve' || !rappelActif()) return;
    const auj = jourIso();
    const maintenant = new Date();
    const minutes = maintenant.getHours() * 60 + maintenant.getMinutes();
    etat.seances.filter((s) => s.date === auj && s.statut !== 'annulee' && s.statut !== 'reportee').forEach((s) => {
      const [h, m] = String(s.debut || '').split(':').map(Number);
      if (Number.isNaN(h)) return;
      const dans = h * 60 + (m || 0) - minutes;
      if (dans <= 0 || dans > 60) return;
      const cle = 'opaline.rappel.fait.' + s.id;
      if (lire(cle, false)) return;
      ecrire(cle, true);
      const titre = s.type === 'travail' ? 'Ton temps perso commence dans ' + dans + ' min' : 'Ta séance commence dans ' + dans + ' min';
      try { new Notification(titre, { body: s.travail || s.objectif || 'Opaline', tag: 'opaline-' + s.id }); } catch (e) { signaler(titre, 'info'); }
    });
  }

  /** C76 : le focus reste dans un panneau ouvert ; la fonction rendue le libère. */
  function piegerFocus(el, rendreA) {
    const focusables = () => [...el.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter((x) => x.offsetParent !== null || x === document.activeElement);
    const gardien = (ev) => {
      if (ev.key !== 'Tab') return;
      const f = focusables(); if (!f.length) return;
      const premier = f[0]; const dernier = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === premier) { ev.preventDefault(); dernier.focus(); }
      else if (!ev.shiftKey && document.activeElement === dernier) { ev.preventDefault(); premier.focus(); }
    };
    el.addEventListener('keydown', gardien);
    const f = focusables(); if (f.length) f[0].focus();
    return () => { el.removeEventListener('keydown', gardien); if (rendreA && rendreA.focus) rendreA.focus(); };
  }

  function majReussites() {
    const el = document.getElementById('e-etoiles');
    if (!el) return;
    const n = reussites().total;
    el.textContent = String(n);
    const jeton = document.getElementById('e-reussites');
    if (jeton) jeton.setAttribute('aria-label', `${n} étoile${n > 1 ? 's' : ''} gagnée${n > 1 ? 's' : ''}`);
    feterNouvellesEtoiles();
  }

  /* ---------- Connexion ------------------------------------------------------------ */
  document.getElementById('form-portail').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const bouton = ev.target.querySelector('.entree-bouton');
    const champ = document.getElementById('code');
    const err = document.getElementById('portail-erreur');
    bouton.disabled = true;
    try {
      const rep = await fetch('/api/connexion', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code: champ.value }),
      });
      const d = await rep.json().catch(() => ({}));
      if (!rep.ok) { err.textContent = d.erreur || 'Ce code n\'est pas reconnu.'; err.classList.add('visible'); return; }
      err.classList.remove('visible');
      await ouvrirApp(d.role);
    } catch (e) {
      err.textContent = 'Connexion impossible. Vérifie ta connexion internet.';
      err.classList.add('visible');
    } finally { bouton.disabled = false; }
  });

  async function sortir() {
    try { await api('/deconnexion', { method: 'POST' }); } catch (e) { /* on sort quand même */ }
    retourPortail();
  }
  document.getElementById('e-sortir').addEventListener('click', sortir);
  document.getElementById('p-sortir').addEventListener('click', sortir);

  /* ---------- Palette (espace de Sterenn) --------------------------------------------- */
  function construirePalette() {
    const zone = document.getElementById('e-palette-choix');
    const panneau = document.getElementById('e-palette-panneau');
    const courante = lire(CLE_PALETTE, 'rose');
    zone.innerHTML = PALETTES.map((p) => {
      const ouverte = paletteOuverte(p.id);
      const libelle = ouverte ? p.nom : `${p.nom} : s'ouvre à ${p.palier} étoiles`;
      return `<button type="button" data-palette="${p.id}" class="${ouverte ? '' : 'fermee'}"
      aria-pressed="${p.id === courante}" aria-disabled="${!ouverte}" title="${libelle}" aria-label="${libelle}"
      style="background:linear-gradient(135deg,${p.c1},${p.c2})">${ouverte ? '' : '<svg class="ic" aria-hidden="true"><use href="#ic-verrou"/></svg>'}</button>`;
    }).join('');
    const zoneAurore = document.getElementById('e-aurore-choix');
    if (zoneAurore) {
      const courante = auroreCourante();
      zoneAurore.innerHTML = AURORES.map((a) => { const ouverte = auroreOuverte(a); return `<button type="button" data-aurore="${a.id}" class="${ouverte ? '' : 'fermee'}" aria-pressed="${a.id === courante.id}" aria-disabled="${!ouverte}" title="${ouverte ? a.nom : a.nom + ' : à ' + a.palier + ' étoiles'}" style="--t:${a.teinte}deg"><i></i><span>${a.nom.replace('Aurore ', '')}</span>${ouverte ? '' : ' 🔒'}</button>`; }).join('');
      zoneAurore.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
        const a = AURORES.find((x) => x.id === b.getAttribute('data-aurore'));
        if (!auroreOuverte(a)) { signaler(`« ${a.nom} » s'ouvre à ${a.palier} étoiles. Tu en as ${reussites().total}.`, 'info'); return; }
        choisirAurore(a.id); construirePalette();
      }));
    }
    const suivant = prochainPalier();
    const legende = document.getElementById('e-palette-legende');
    if (legende) legende.textContent = suivant ? `Prochaine palette « ${suivant.nom} » à ${suivant.palier} étoiles (tu en as ${reussites().total}).` : 'Toutes les palettes sont ouvertes.';
    zone.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      const id = b.getAttribute('data-palette');
      if (!paletteOuverte(id)) { const p = PALETTES.find((x) => x.id === id); signaler(`« ${p.nom} » s'ouvre à ${p.palier} étoiles. Tu en as ${reussites().total}.`, 'info'); return; }
      appliquerPalette(id);
      construirePalette();
      panneau.hidden = true;
    }));
  }
  document.getElementById('e-btn-confort').addEventListener('click', (ev) => {
    // Le panneau se ferme sur tout clic hors de lui : le clic qui l'ouvre ne
    // doit pas remonter jusqu'au document, sinon il se referme aussitôt.
    ev.stopPropagation();
    if (window.__konstrioConfort && window.__konstrioConfort.open) window.__konstrioConfort.open();
    else chargerScript('moteurs/confort.js').then(() => window.__konstrioConfort && window.__konstrioConfort.open()).catch(() => signaler('Le panneau de confort n\'est pas disponible.'));
  });
  document.getElementById('e-btn-palette').addEventListener('click', () => {
    const p = document.getElementById('e-palette-panneau');
    p.hidden = !p.hidden;
    document.getElementById('e-btn-palette').setAttribute('aria-expanded', String(!p.hidden));
  });

  /** Le bouton du thème change de dessin et d'intitulé selon l'état courant. */
  function majBoutonTheme() {
    const b = document.getElementById('e-btn-theme');
    if (!b) return;
    const t = lire(CLE_THEME, 'light');
    const suivant = THEMES[(THEMES.indexOf(t) + 1) % THEMES.length];
    const noms = { light: 'thème clair', dark: 'thème sombre', chaud: 'nuit chaude (crème sombre)' };
    b.querySelector('use').setAttribute('href', suivant === 'light' ? '#ic-soleil' : '#ic-lune');
    b.setAttribute('aria-label', 'Thème actuel : ' + noms[t] + '. Cliquer pour passer au ' + noms[suivant] + '.');
    b.setAttribute('title', 'Passer au ' + noms[suivant]);
  }
  document.getElementById('e-btn-theme').addEventListener('click', () => {
    const t = lire(CLE_THEME, 'light');
    appliquerTheme(THEMES[(THEMES.indexOf(t) + 1) % THEMES.length]);
    majBoutonTheme();
  });

  /* ---------- Thème du back-office ------------------------------------------------------ */
  document.getElementById('p-theme').addEventListener('click', () => {
    appliquerTheme(lire(CLE_THEME, 'light') === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Routeur -------------------------------------------------------------------- */
  const vueActive = () => (estProf() ? window.VUE_PROF : window.VUE_ELEVE);
  const CLE_DERNIER = 'opaline.dernier';
  function router() {
    if (!etat.role) return;
    const vue = vueActive();
    if (!vue) return;
    const parts = (location.hash || '#/').replace(/^#\/?/, '').split('/');
    vue.rendre(parts);
    // C8 : on retient le dernier écran de travail de Sterenn (fiche, série, jeu, semaine).
    if (etat.role === 'eleve' && ['lecon', 'exos', 'calendrier', 'matiere', 'choix', 'notes'].indexOf(parts[0]) !== -1) { ecrire(CLE_DERNIER, { hash: location.hash, le: Date.now() }); if (parts[0] === 'lecon' || parts[0] === 'exos') marquerJour(); }
  }
  window.addEventListener('hashchange', router);
  /** C8 : à l'ouverture, revenir là où elle était, avec une ligne qui le dit. */
  function reprendreDernier() {
    if (etat.role !== 'eleve') return false;
    const d = lire(CLE_DERNIER, null);
    if (!d || !d.hash || (location.hash && location.hash !== '#/' && location.hash !== '#/hub')) return false;
    if (Date.now() - (d.le || 0) > 3 * 86400000) return false;
    const p = d.hash.replace(/^#\/?/, '').split('/');
    let libelle = 'ton dernier écran';
    if (p[0] === 'lecon' || p[0] === 'exos') { const m = matiere(p[1]); const l = m && lecon(m, p[2]); if (l) libelle = (p[0] === 'exos' ? 'la série de « ' : 'la fiche « ') + l.titre + ' »'; }
    else if (p[0] === 'calendrier') libelle = 'ta semaine';
    else if (p[0] === 'matiere') { const m = matiere(p[1]); if (m) libelle = 'le parcours de ' + m.nom; }
    location.hash = d.hash;
    setTimeout(() => signaler('Tu étais ici : ' + libelle + '. L\'accueil est dans la barre.', 'info'), 600);
    return true;
  }
  // C7 : « ? » ouvre l'aide, hors champ de saisie.
  document.addEventListener('keydown', (ev) => {
    if (ev.key !== '?' || etat.role !== 'eleve') return;
    const c = ev.target; if (c && (c.tagName === 'INPUT' || c.tagName === 'TEXTAREA' || c.isContentEditable)) return;
    ev.preventDefault(); location.hash = '#/aide';
  });

  /* ---------- Interface exposée aux modules de vue --------------------------------------- */
  window.NOYAU = {
    etat, api, signaler, ech, estProf,
    matiere, lecon, cle, banque, chargerBanque, niveauDe, accesDoc, accesJeu, decisionAcces,
    MODULES, profil, enregistrerProfil, estValidee, dossierPdf, nomCourt,
    progression, chiffres, libelleLecon, accessible, raisonVerrou, programmee,
    jourIso, decaler, lundiDe, enFrancais, dateCourte, formaterDate, poids, son, annoncer, basculerEco, ecoActive, CLE_SONS, THEMES,
    chargerContenu, chargerSeances, chargerScript, rafraichirEtat, rafraichirSeances,
    majReussites, reussites, decision, reglementaire, router, lire, ecrire,
    reglage, appliquerReglages, REGLAGES_DEFAUT, celebrer,
    NIVEAUX, TYPES_DOC, CRENEAUX, JOURS, PALETTES, DEGRADES, ic, paletteOuverte, prochainPalier,
    majTitre, rappelActif, activerRappel, verifierRappel, piegerFocus, squelette, mettreEnAttente, rejouerAttente,
    gemme, AURORES, auroreCourante, auroreOuverte, periodeCourante, serieJours, marquerJour, cranTaille, appliquerPilotage,
    appliquerTheme, appliquerPalette,
  };

  /* ---------- Démarrage -------------------------------------------------------------------- */
  (async function demarrer() {
    try {
      const moi = await fetch('/api/moi', { credentials: 'same-origin' });
      const d = moi.ok ? await moi.json() : {};
      if (d.role) { await ouvrirApp(d.role); return; }
    } catch (e) { /* hors ligne */ }
    ouvrirPortail();
  })();
})();
