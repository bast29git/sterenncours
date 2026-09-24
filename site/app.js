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
  const PALETTES = [
    { id: 'aurore', nom: 'Aurore', c1: '#2BB5A0', c2: '#C79CE6' },
    { id: 'turquoise', nom: 'Turquoise', c1: '#22A395', c2: '#8FE3D5' },
    { id: 'indien', nom: 'Bleu indien', c1: '#1F6F8E', c2: '#8CC3DA' },
    { id: 'violet', nom: 'Violet pastel', c1: '#A97AD1', c2: '#EBC6EC' },
    { id: 'rose', nom: 'Rose', c1: '#E8608E', c2: '#F7A8C4' },
    { id: 'lavande', nom: 'Lavande', c1: '#7B6BE8', c2: '#B4A8F5' },
    { id: 'prune', nom: 'Prune', c1: '#9046A8', c2: '#C79BD6' },
    { id: 'menthe', nom: 'Menthe', c1: '#1F9E86', c2: '#7FD3C1' },
    { id: 'corail', nom: 'Corail', c1: '#E96A43', c2: '#F7B199' },
    { id: 'ocean', nom: 'Océan', c1: '#2E7FC2', c2: '#8FC4E8' },
  ];

  const etat = {
    role: null,
    suivi: {}, resultats: {}, fiches: {}, ouvertures: {}, messagesNonLus: 0,
    seances: [],
    reglages: {},
  };
  /** Valeurs par défaut des réglages professeur, si le serveur ne répond pas. */
  const REGLAGES_DEFAUT = {
    pauses: true, tuteur: true, calculatrice: true,
    reactions: true, formatage: false, fils: true, felicitations: true,
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
  async function api(chemin, options = {}) {
    const reponse = await fetch('/api' + chemin, {
      credentials: 'same-origin',
      ...options,
      headers: options.body && !(options.body instanceof FormData)
        ? { 'content-type': 'application/json', ...(options.headers || {}) }
        : (options.headers || {}),
    });
    if (reponse.status === 401) { retourPortail(); throw new Error('Session expirée'); }
    const donnees = await reponse.json().catch(() => ({}));
    if (!reponse.ok) throw new Error(donnees.erreur || 'Erreur serveur');
    return donnees;
  }

  function signaler(message, type = 'erreur') {
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

  /* ---------- Utilitaires ---------------------------------------------------- */
  const ech = (t) => String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const estProf = () => etat.role === 'prof';
  const matiere = (id) => (window.PROGRAMME ? PROGRAMME.matieres.find((m) => m.id === id) : null) || null;
  const lecon = (m, ref) => (m ? m.lecons.find((l) => l.ref === ref) : null) || null;
  const cle = (mid, ref) => mid + '/' + ref;
  const banque = (mid, ref) => (window.EXERCICES || {})[cle(mid, ref)] || null;
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
  const enFrancais = (iso, complet) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR',
    complet ? { weekday: 'long', day: 'numeric', month: 'long' } : { weekday: 'short', day: 'numeric', month: 'short' });
  const dateCourte = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
      + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };
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
   * Accès progressif : Sterenn n'a pas les 69 leçons d'un bloc. Le professeur
   * pousse ou retient une leçon quand il le décide ; sans décision, la règle
   * automatique s'applique (première de la matière, précédente validée, ou
   * déjà mise au programme d'une séance passée).
   */
  function accessible(mid, ref) {
    if (estProf()) return true;
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
    Object.values(etat.resultats).forEach((r) => {
      if (r.total > 0 && r.meilleur / r.total >= SERIE_REUSSIE) series += 1;
    });
    let lecons = 0;
    Object.values(etat.suivi).forEach((s) => {
      if (s.niveau === 'satisfaisant' || s.niveau === 'tresbien') lecons += 1;
    });
    return { fiches, series, lecons, total: fiches + series + lecons * 3 };
  }

  /* ---------- Chargement ------------------------------------------------------ */
  function chargerScript(src, type) {
    return new Promise((ok, ko) => {
      if (document.querySelector(`script[src="${src}"]`)) return ok();
      const s = document.createElement('script');
      s.src = src;
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
  function chargerContenu(mid) {
    if (window.CONTENU && window.CONTENU[mid]) return Promise.resolve(window.CONTENU[mid]);
    if (enCours[mid]) return enCours[mid];
    enCours[mid] = new Promise((res) => {
      const s = document.createElement('script');
      s.src = (estProf() ? 'data/contenu/' : 'data/eleve/') + mid + '.js';
      s.onload = () => res((window.CONTENU || {})[mid] || null);
      s.onerror = () => res(null);
      document.head.appendChild(s);
    });
    return enCours[mid];
  }
  const chargerSeances = (du, au) => api(`/seances?du=${du}&au=${au}`).then((d) => d.seances || []).catch(() => []);

  /* ---------- Thème et palette -------------------------------------------------- */
  function appliquerTheme(v) {
    document.documentElement.setAttribute('data-theme', v === 'dark' ? 'dark' : 'light');
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
    etat.ouvertures = {}; etat.seances = []; etat.messagesNonLus = 0; etat.reglages = {};
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

    try {
      await chargerScript(role === 'prof' ? 'vue-prof.js' : 'vue-eleve.js');
      await chargerScript('data/programme.js');
      await chargerScript('data/exercices.js');
      try { await chargerScript('data/jeux.js'); } catch (e) { window.JEUX = []; }
      await chargerScript('planificateur.js');
    } catch (e) {
      signaler('Le programme n\'a pas pu être chargé. Recharge la page.');
      return;
    }

    await Promise.all([rafraichirEtat(), rafraichirSeances()]);

    if (role === 'eleve') {
      // Moteurs de l'espace de Sterenn : accessibilité, trophées, sons.
      chargerScript('moteurs/audio-engine.js').catch(() => {});
      chargerScript('moteurs/confort.js').catch(() => {});
      chargerScript('tuteur.js').catch(() => {});
      construirePalette();
      majBoutonTheme();
      majReussites();
    }

    if (minuteur) clearInterval(minuteur);
    minuteur = setInterval(sonder, 25000);
    router();
  }

  async function rafraichirEtat() {
    try {
      const d = await api('/etat');
      etat.suivi = d.suivi || {};
      etat.resultats = d.resultats || {};
      etat.fiches = d.fiches || {};
      etat.ouvertures = d.ouvertures || {};
      etat.reglages = d.reglages || {};
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
  async function sonder() {
    if (!etat.role) return;
    try {
      const d = await api('/etat');
      const avant = etat.messagesNonLus;
      etat.messagesNonLus = d.messagesNonLus || 0;
      if (d.reglages && JSON.stringify(d.reglages) !== JSON.stringify(etat.reglages)) {
        etat.reglages = d.reglages;
        appliquerReglages();
      }
      if (etat.messagesNonLus !== avant) {
        vueActive().nav();
        if (etat.messagesNonLus > avant) signaler('Nouveau message.', 'info');
      }
    } catch (e) { /* sonde silencieuse */ }
  }

  function majReussites() {
    const el = document.getElementById('e-etoiles');
    if (!el) return;
    const n = reussites().total;
    el.textContent = String(n);
    const jeton = document.getElementById('e-reussites');
    if (jeton) jeton.setAttribute('aria-label', `${n} étoile${n > 1 ? 's' : ''} gagnée${n > 1 ? 's' : ''}`);
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
    zone.innerHTML = PALETTES.map((p) => `<button type="button" data-palette="${p.id}"
      aria-pressed="${p.id === courante}" title="${p.nom}" aria-label="${p.nom}"
      style="background:linear-gradient(135deg,${p.c1},${p.c2})"></button>`).join('');
    zone.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      appliquerPalette(b.getAttribute('data-palette'));
      construirePalette();
      panneau.hidden = true;
    }));
  }
  document.getElementById('e-btn-palette').addEventListener('click', () => {
    const p = document.getElementById('e-palette-panneau');
    p.hidden = !p.hidden;
  });

  /** Le bouton du thème change de dessin et d'intitulé selon l'état courant. */
  function majBoutonTheme() {
    const b = document.getElementById('e-btn-theme');
    if (!b) return;
    const sombre = lire(CLE_THEME, 'light') === 'dark';
    b.querySelector('use').setAttribute('href', sombre ? '#ic-soleil' : '#ic-lune');
    b.setAttribute('aria-label', sombre ? 'Revenir au thème clair' : 'Passer en thème sombre');
    b.setAttribute('title', sombre ? 'Thème clair' : 'Thème sombre');
  }
  document.getElementById('e-btn-theme').addEventListener('click', () => {
    appliquerTheme(lire(CLE_THEME, 'light') === 'dark' ? 'light' : 'dark');
    majBoutonTheme();
  });

  /* ---------- Thème du back-office ------------------------------------------------------ */
  document.getElementById('p-theme').addEventListener('click', () => {
    appliquerTheme(lire(CLE_THEME, 'light') === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Routeur -------------------------------------------------------------------- */
  const vueActive = () => (estProf() ? window.VUE_PROF : window.VUE_ELEVE);
  function router() {
    if (!etat.role) return;
    const vue = vueActive();
    if (!vue) return;
    const parts = (location.hash || '#/').replace(/^#\/?/, '').split('/');
    vue.rendre(parts);
  }
  window.addEventListener('hashchange', router);

  /* ---------- Interface exposée aux modules de vue --------------------------------------- */
  window.NOYAU = {
    etat, api, signaler, ech, estProf,
    matiere, lecon, cle, banque, niveauDe, estValidee, dossierPdf, nomCourt,
    progression, chiffres, libelleLecon, accessible, raisonVerrou, programmee,
    jourIso, decaler, lundiDe, enFrancais, dateCourte, poids,
    chargerContenu, chargerSeances, chargerScript, rafraichirEtat, rafraichirSeances,
    majReussites, reussites, decision, reglementaire, router, lire, ecrire,
    reglage, appliquerReglages, REGLAGES_DEFAUT,
    NIVEAUX, TYPES_DOC, CRENEAUX, JOURS, PALETTES, DEGRADES, ic,
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
