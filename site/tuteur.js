/**
 * Opale, la tutrice, dans tout l'espace de Sterenn.
 *
 * Un bouton flottant ouvre un panneau : discussion avec Opale (serveur
 * /api/tuteur, Workers AI) et calculatrice. Le panneau sait où Sterenn se
 * trouve (fiche, exercices, jeux, messages) et le dit au serveur ; il ne
 * transmet jamais les corrigés. La calculatrice est coupée pendant les
 * exercices de mathématiques et les évaluations, et quand le professeur la
 * désactive dans ses réglages.
 */
(function () {
  'use strict';
  const N = window.NOYAU;
  const CLE_FIL = 'opaline.opale.fil';
  const SUGGESTIONS = {
    cours: ['Explique-moi le plan de cette fiche', 'Donne-moi un exemple différent', 'Quels sont les mots à retenir ?'],
    revision: ['Pose-moi trois questions sur cette fiche', 'Comment retenir cette règle ?', 'Quels sont les pièges ?'],
    exercices: ['Un indice, sans la réponse', 'Par quoi je commence ?', 'Quelle règle du cours je dois relire ?'],
    jeux: ['Comment on joue ?', 'Qu\'est-ce que ce jeu m\'apprend ?', 'Comment gagner des étoiles ?'],
    messages: ['Aide-moi à formuler ma question', 'Comment envoyer une photo de mon devoir ?'],
    reussites: ['Comment on gagne des étoiles ?', 'C\'est quoi les paliers ?'],
    autre: ['Qu\'est-ce que je fais aujourd\'hui ?', 'Fais-moi visiter l\'application', 'Comment gagner des étoiles ?'],
  };

  /* Chaque avatar porte son propre dégradé : un dégradé défini dans un
     élément masqué (le bouton, une fois le panneau ouvert) ne se dessine pas. */
  let nAvatar = 0;
  const AVATAR_SRC = `<svg class="e-opale-avatar" viewBox="0 0 64 64" aria-hidden="true">
    <defs><linearGradient id="opale-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FF0C8"/><stop offset=".4" stop-color="#2BB5A0"/><stop offset=".72" stop-color="#2A7FA6"/><stop offset="1" stop-color="#C79CE6"/></linearGradient></defs>
    <path d="M32 6 54 26 32 60 10 26Z" fill="url(#opale-g)"/>
    <path d="M10 26h44L32 34Z" fill="#fff" opacity=".35"/>
    <circle class="oeil" cx="25" cy="32" r="3.2" fill="#0b1a3a"/><circle class="oeil" cx="39" cy="32" r="3.2" fill="#0b1a3a"/>
    <circle cx="26" cy="31" r="1" fill="#fff"/><circle cx="40" cy="31" r="1" fill="#fff"/>
    <path d="M27 40q5 4 10 0" stroke="#0b1a3a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M52 4c.4 2.6 1.1 4 2.3 4.9 1 .7 2.2 1.1 4.4 1.5-2.2.4-3.4.8-4.4 1.5-1.2.9-1.9 2.3-2.3 4.9-.4-2.6-1.1-4-2.3-4.9-1-.7-2.2-1.1-4.4-1.5 2.2-.4 3.4-.8 4.4-1.5 1.2-.9 1.9-2.3 2.3-4.9Z" fill="#fff"/>
  </svg>`;
  const avatar = () => { nAvatar += 1; return AVATAR_SRC.replace(/opale-g/g, 'opale-g' + nAvatar); };

  let panneau = null;
  let fil = [];
  let onglet = 'parler';
  let occupe = false;
  let contexteCourant = { mode: 'autre' };

  /* Un fil par leçon : la conversation se retrouve quand on revient sur la même fiche. */
  let cleFil = CLE_FIL;
  const cleDe = (c) => CLE_FIL + (c && c.matiere && c.ref ? '.' + c.matiere + '/' + c.ref : '');
  const lire = () => { try { return JSON.parse(sessionStorage.getItem(cleFil)) || []; } catch (e) { return []; } };
  const ecrire = () => { try { sessionStorage.setItem(cleFil, JSON.stringify(fil.slice(-20))); } catch (e) { /* privé */ } };

  /* ---------- Où est Sterenn ? ------------------------------------------------ */
  function contexte() {
    const p = (location.hash || '#/hub').replace(/^#\/?/, '').split('/');
    const c = { mode: 'autre', route: p[0] || 'hub' };
    if (p[0] === 'lecon' && p[1] && p[2]) {
      const m = N.matiere(p[1]); const l = N.lecon(m, p[2]);
      c.mode = p[3] === 'revision' ? 'revision' : p[3] === 'exercices' ? 'exercices' : 'cours';
      c.matiere = p[1]; c.ref = p[2];
      if (m && l) { c.matiereNom = m.nom; c.titre = l.titre; }
      const contenu = window.CONTENU && window.CONTENU[p[1]] && window.CONTENU[p[1]][p[2]];
      const doc = contenu && (contenu[p[3]] || contenu.cours);
      if (doc) {
        c.titre = doc.titre || c.titre; c.resume = doc.resume || '';
        c.objectifs = (doc.objectifs || []).slice(0, 8);
        c.plan = (doc.plan || []).map((x) => x.texte).slice(0, 12);
      }
    } else if (p[0] === 'exos' && p[1] && p[2]) {
      const m = N.matiere(p[1]); const l = N.lecon(m, p[2]);
      c.mode = 'exercices'; c.matiere = p[1]; c.ref = p[2];
      if (m && l) { c.matiereNom = m.nom; c.titre = l.titre; }
      // La question affichée et sa réponse attendue : le serveur vérifie
      // qu'Opale ne la livre pas. Elles ne sont jamais montrées à l'écran.
      const q = document.querySelector('.e-exo-question, .e-exo h2, .e-exo-enonce');
      if (q) c.question = q.textContent.trim().slice(0, 300);
      const b = N.banque(p[1], p[2]);
      const idx = Number((document.querySelector('[data-exo-index]') || {}).getAttribute
        ? document.querySelector('[data-exo-index]').getAttribute('data-exo-index') : NaN);
      const item = b && Array.isArray(b.items) && Number.isFinite(idx) ? b.items[idx] : null;
      if (item) {
        c.question = String(item.q || '').replace(/<[^>]+>/g, '').slice(0, 300);
        c.attendues = item.type === 'qcm' ? [item.choix[item.reponse]]
          : item.type === 'vraifaux' ? [] : (item.reponses || [item.reponse]).map(String);
      }
    } else if (p[0] === 'jeux') c.mode = 'jeux';
    else if (p[0] === 'messages' || p[0] === 'travail') c.mode = 'messages';
    else if (p[0] === 'reussites' || p[0] === 'progres') c.mode = 'reussites';
    // A44 : ce qu'elle a ouvert aujourd'hui, pour des réponses qui suivent la séance.
    try {
      const auj = N.jourIso();
      const ouvertes = JSON.parse(sessionStorage.getItem('opaline.ouvertes') || '[]');
      const terminees = Object.entries(N.etat.fiches).filter(([, f]) => String(f.termine_le || '').slice(0, 10) === auj).map(([k]) => k);
      c.fichesDuJour = [...new Set(ouvertes.concat(terminees))].slice(-8).map((k) => { const [mid, ref, t] = k.split('/'); const m = N.matiere(mid); const l = m && N.lecon(m, ref); return l ? `${l.titre} (${t || 'cours'})` : k; });
    } catch (e) { /* facultatif */ }
    return c;
  }

  function calculatriceAutorisee(c) {
    if (!N.reglage('calculatrice')) return false;
    if (c.mode === 'evaluation' && !N.reglage('calculatrice_evaluation')) return false;
    if (c.mode === 'exercices' && c.matiere === 'maths' && !N.reglage('calculatrice_maths')) return false;
    return true;
  }
  function libelleContexte(c) {
    if (c.mode === 'cours' || c.mode === 'revision' || c.mode === 'exercices') {
      const doc = c.mode === 'cours' ? 'fiche de cours' : c.mode === 'revision' ? 'fiche de révision' : 'exercices';
      return `${c.matiereNom || ''} · ${c.titre || ''} · ${doc}`;
    }
    return { jeux: 'Jeux et mondes 3D', messages: 'Messages', reussites: 'Mes réussites', autre: 'Accueil' }[c.mode] || 'Accueil';
  }

  /* ---------- Calculatrice ------------------------------------------------ */
  /** Évalue une expression arithmétique simple sans eval : + - × ÷ ^ ( ) √ %. */
  function calculer(src) {
    const s = String(src).replace(/,/g, '.').replace(/×/g, '*').replace(/÷/g, '/').replace(/√/g, 'sqrt').replace(/\s+/g, '');
    let i = 0;
    const peek = () => s[i];
    const nombre = () => {
      const m = /^(\d+(\.\d+)?|\.\d+)/.exec(s.slice(i));
      if (!m) throw new Error('nombre attendu');
      i += m[0].length; return parseFloat(m[0]);
    };
    function facteur() {
      if (peek() === '-') { i += 1; return -facteur(); }
      if (peek() === '+') { i += 1; return facteur(); }
      if (peek() === '(') { i += 1; const v = expr(); if (peek() !== ')') throw new Error('parenthèse'); i += 1; return v; }
      if (s.startsWith('sqrt', i)) { i += 4; const v = facteur(); if (v < 0) throw new Error('racine négative'); return Math.sqrt(v); }
      const v = nombre();
      if (peek() === '%') { i += 1; return v / 100; }
      return v;
    }
    function puissance() { let b = facteur(); if (peek() === '^') { i += 1; b = Math.pow(b, puissance()); } return b; }
    function terme() {
      let v = puissance();
      while (peek() === '*' || peek() === '/') {
        const op = s[i]; i += 1; const d = puissance();
        if (op === '/' && d === 0) throw new Error('division par zéro');
        v = op === '*' ? v * d : v / d;
      }
      return v;
    }
    function expr() {
      let v = terme();
      while (peek() === '+' || peek() === '-') { const op = s[i]; i += 1; const d = terme(); v = op === '+' ? v + d : v - d; }
      return v;
    }
    if (!s) return '';
    const v = expr();
    if (i < s.length) throw new Error('expression incomplète');
    if (!Number.isFinite(v)) throw new Error('résultat impossible');
    return String(Math.round(v * 1e10) / 1e10).replace('.', ',');
  }

  /* ---------- Panneau ------------------------------------------------------ */
  function construire() {
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'e-opale-bouton'; b.className = 'e-opale-bouton';
    b.setAttribute('aria-label', 'Ouvrir Opale, ta tutrice'); b.setAttribute('aria-expanded', 'false');
    b.innerHTML = avatar() + '<span>Opale</span>';
    b.addEventListener('click', () => (panneau.hidden ? ouvrir() : fermer()));

    panneau = document.createElement('aside');
    panneau.id = 'e-opale'; panneau.className = 'e-opale'; panneau.hidden = true;
    panneau.setAttribute('role', 'dialog'); panneau.setAttribute('aria-label', 'Opale, ta tutrice');
    panneau.innerHTML = `
      <header class="e-opale-tete">
        ${avatar()}
        <div><b>Opale</b><span id="e-opale-contexte"></span></div>
        <button type="button" class="e-opale-fermer" id="e-opale-fermer" aria-label="Fermer Opale">${N.ic('ic-croix')}</button>
      </header>
      <nav class="e-opale-onglets" aria-label="Opale">
        <button type="button" class="actif" data-onglet="parler">${N.ic('ic-message')} Parler</button>
        <button type="button" data-onglet="calculer" id="e-opale-ong-calc">${N.ic('ic-calculatrice')} Calculatrice</button>
      </nav>
      <section class="e-opale-corps" id="e-opale-parler">
        <div class="e-opale-fil" id="e-opale-fil" aria-live="polite"></div>
        <div class="e-opale-suggestions" id="e-opale-suggestions"></div>
        <form class="e-opale-form" id="e-opale-form">
          <label class="visuellement-cache" for="e-opale-q">Ta question à Opale</label>
          <textarea id="e-opale-q" rows="2" maxlength="600" placeholder="Écris ta question…"></textarea>
          <button type="submit" class="e-bouton" id="e-opale-envoyer" aria-label="Envoyer">${N.ic('ic-envoyer')}</button>
        </form>
        <p class="e-opale-note">Opale guide, elle ne donne pas les réponses. Ce que tu lui écris n'est pas envoyé à Bastien.</p>
      </section>
      <section class="e-opale-corps" id="e-opale-calculer" hidden>
        <p class="e-opale-calc-coupe" id="e-opale-calc-coupe" hidden></p>
        <div id="e-opale-calc">
          <label class="visuellement-cache" for="e-opale-expr">Calcul</label>
          <input id="e-opale-expr" class="e-opale-expr" type="text" inputmode="decimal" autocomplete="off" placeholder="Exemple : (3 + 5) × 2">
          <output class="e-opale-resultat" id="e-opale-resultat" for="e-opale-expr" aria-live="polite"></output>
          <div class="e-opale-touches" id="e-opale-touches"></div>
          <ul class="e-opale-historique" id="e-opale-historique" aria-label="Derniers calculs"></ul>
        </div>
      </section>`;
    document.getElementById('app-eleve').append(b, panneau);

    document.getElementById('e-opale-fermer').addEventListener('click', fermer);
    panneau.querySelectorAll('[data-onglet]').forEach((o) => o.addEventListener('click', () => choisirOnglet(o.getAttribute('data-onglet'))));
    document.getElementById('e-opale-form').addEventListener('submit', (ev) => { ev.preventDefault(); envoyer(document.getElementById('e-opale-q').value); });
    document.getElementById('e-opale-q').addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); envoyer(ev.target.value); }
    });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && !panneau.hidden) fermer(); });

    // Calculatrice : touches et saisie clavier.
    const touches = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', ',', '(', ')', '√', '^', '%', '+', 'C', '⌫', '='];
    document.getElementById('e-opale-touches').innerHTML = touches.map((t) =>
      `<button type="button" data-touche="${t}" class="${t === '=' ? 'egal' : /[0-9,]/.test(t) ? 'chiffre' : 'op'}">${t}</button>`).join('');
    const expr = document.getElementById('e-opale-expr');
    const montrer = () => {
      const out = document.getElementById('e-opale-resultat');
      try { const v = calculer(expr.value); out.textContent = v === '' ? '' : '= ' + v; out.classList.remove('erreur'); } catch (e) { out.textContent = expr.value ? '…' : ''; }
    };
    expr.addEventListener('input', montrer);
    expr.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); egal(); } });
    const historique = [];
    function rendreHistorique() {
      const ul = document.getElementById('e-opale-historique');
      ul.innerHTML = historique.slice(-8).reverse().map((h, k) => `<li><span>${N.ech(h.e)} = <b>${N.ech(h.v)}</b></span><button type="button" data-copier="${N.ech(h.v)}" title="Copier le résultat">copier</button>${document.getElementById('e-brouillon-texte') ? `<button type="button" data-brouillon="${N.ech(h.e + ' = ' + h.v)}" title="Ajouter à mon brouillon">brouillon</button>` : ''}</li>`).join('');
      ul.querySelectorAll('[data-copier]').forEach((b) => b.addEventListener('click', async () => { try { await navigator.clipboard.writeText(b.getAttribute('data-copier')); N.signaler('Résultat copié.', 'succes'); } catch (e) { expr.value = b.getAttribute('data-copier'); } }));
      ul.querySelectorAll('[data-brouillon]').forEach((b) => b.addEventListener('click', () => { const t = document.getElementById('e-brouillon-texte'); if (!t) return; t.value = (t.value ? t.value + '\n' : '') + b.getAttribute('data-brouillon'); t.dispatchEvent(new Event('input', { bubbles: true })); N.signaler('Ajouté à ton brouillon.', 'succes'); }));
    }
    function egal() {
      const out = document.getElementById('e-opale-resultat');
      try { const v = calculer(expr.value); out.textContent = v === '' ? '' : '= ' + v; out.classList.remove('erreur'); if (v !== '') { historique.push({ e: expr.value, v }); rendreHistorique(); } }
      catch (e) { out.textContent = 'Je ne comprends pas ce calcul (' + e.message + ').'; out.classList.add('erreur'); }
    }
    document.getElementById('e-opale-touches').addEventListener('click', (ev) => {
      const t = ev.target.closest('[data-touche]'); if (!t) return;
      const k = t.getAttribute('data-touche');
      if (k === 'C') expr.value = '';
      else if (k === '⌫') expr.value = expr.value.slice(0, -1);
      else if (k === '=') { egal(); return; }
      else expr.value += (k === '√' ? '√(' : k);
      montrer(); expr.focus();
    });

    fil = lire();
    rendreFil();
  }

  function choisirOnglet(o) {
    onglet = o;
    panneau.querySelectorAll('[data-onglet]').forEach((x) => x.classList.toggle('actif', x.getAttribute('data-onglet') === o));
    document.getElementById('e-opale-parler').hidden = o !== 'parler';
    document.getElementById('e-opale-calculer').hidden = o !== 'calculer';
    if (o === 'calculer') document.getElementById('e-opale-expr').focus();
    else document.getElementById('e-opale-q').focus();
  }

  function majContexte() {
    contexteCourant = contexte();
    const nouvelleCle = cleDe(contexteCourant);
    if (nouvelleCle !== cleFil) { ecrire(); cleFil = nouvelleCle; fil = lire(); rendreFil(); }
    document.getElementById('e-opale-contexte').textContent = libelleContexte(contexteCourant);
    const sugg = SUGGESTIONS[contexteCourant.mode] || SUGGESTIONS.autre;
    document.getElementById('e-opale-suggestions').innerHTML = sugg.map((s) =>
      `<button type="button" class="e-opale-puce">${N.ech(s)}</button>`).join('');
    document.getElementById('e-opale-suggestions').querySelectorAll('.e-opale-puce').forEach((p) =>
      p.addEventListener('click', () => envoyer(p.textContent)));
    const ok = calculatriceAutorisee(contexteCourant);
    const ong = document.getElementById('e-opale-ong-calc');
    ong.disabled = !ok;
    ong.title = ok ? '' : 'La calculatrice est coupée ici';
    const coupe = document.getElementById('e-opale-calc-coupe');
    coupe.hidden = ok;
    coupe.textContent = !N.reglage('calculatrice') ? 'La calculatrice est désactivée par ton professeur.'
      : contexteCourant.matiere === 'maths' && contexteCourant.mode === 'exercices' ? 'Ton professeur a coupé la calculatrice pendant les exercices de mathématiques : tu calcules à la main.'
        : 'Pas de calculatrice pendant une évaluation.';
    document.getElementById('e-opale-calc').hidden = !ok;
    if (!ok && onglet === 'calculer') choisirOnglet('parler');
  }

  let libererFocus = null;
  function ouvrir() {
    fermerBulle();
    majContexte();
    panneau.hidden = false;
    libererFocus = N.piegerFocus(panneau, document.getElementById('e-opale-bouton'));
    document.getElementById('e-opale-bouton').setAttribute('aria-expanded', 'true');
    document.body.classList.add('opale-ouverte');
    if (!fil.length) {
      ajouter('assistant', 'Bonjour Sterenn. Je suis Opale. Je peux t\'expliquer une notion, te donner une piste ou t\'aider à t\'organiser. Je ne donne pas les réponses : c\'est toi qui les trouves.');
    }
    choisirOnglet(onglet === 'calculer' && calculatriceAutorisee(contexteCourant) ? 'calculer' : 'parler');
  }
  function fermer() {
    panneau.hidden = true;
    document.getElementById('e-opale-bouton').setAttribute('aria-expanded', 'false');
    document.body.classList.remove('opale-ouverte');
    if (libererFocus) { libererFocus(); libererFocus = null; }
    document.getElementById('e-opale-bouton').focus();
  }

  function ajouter(role, texte, extra) {
    fil.push({ role, content: texte, extra: extra || null, le: Date.now() });
    fil = fil.slice(-20); ecrire(); rendreFil();
  }
  function rendreFil() {
    const el = document.getElementById('e-opale-fil');
    const dernierIdx = fil.map((m) => m.role).lastIndexOf('assistant');
    el.innerHTML = fil.map((m, k) => `<div class="e-opale-msg ${m.role === 'user' ? 'moi' : 'opale'}">
      ${m.role === 'assistant' ? avatar() : ''}<div class="e-opale-bulle">${paragraphes(m.content)}${m.extra || ''}${m.role === 'assistant' && k === dernierIdx && k > 0 && !occupe ? suites() : ''}</div></div>`).join('')
      + (occupe ? `<div class="e-opale-msg opale">${avatar()}<div class="e-opale-bulle e-opale-attente"><span></span><span></span><span></span></div></div>` : '');
    el.querySelectorAll('[data-suite]').forEach((b) => b.addEventListener('click', () => envoyer(b.getAttribute('data-suite'))));
    el.querySelectorAll('[data-section]').forEach((b) => b.addEventListener('click', () => { const ok = window.VUE_ELEVE && window.VUE_ELEVE.allerSection && window.VUE_ELEVE.allerSection(b.getAttribute('data-section')); if (!ok) N.signaler('Ouvre la fiche pour retrouver cette section.', 'info'); }));
    el.querySelectorAll('[data-lire]').forEach((b) => b.addEventListener('click', () => {
      if (!window.speechSynthesis) return;
      if (speechSynthesis.speaking) { speechSynthesis.cancel(); return; }
      const u = new SpeechSynthesisUtterance(b.closest('.e-opale-bulle').textContent.replace(/Plus simple|Plus court|On relit ensemble|Écouter/g, '').trim()); u.lang = 'fr-FR'; speechSynthesis.speak(u);
    }));
    el.querySelectorAll('[data-relire]').forEach((b) => b.addEventListener('click', () => relire(b)));
    el.scrollTop = el.scrollHeight;
  }
  /** Sous la dernière réponse : « plus simple », « plus court », et « on relit ensemble » quand une fiche est ouverte. */
  function suites() {
    const c = contexteCourant || {};
    const relire = c.plan && c.plan.length && c.matiere ? `<button type="button" class="e-opale-suite" data-relire="1">${N.ic('ic-livre')} On relit ensemble</button>` : '';
    const voix = window.speechSynthesis && document.documentElement.getAttribute('data-confort-sons') !== 'off' ? `<button type="button" class="e-opale-suite" data-lire="1" title="Lire cette réponse à voix haute">${N.ic('ic-envoyer')} Écouter</button>` : '';
    return `<div class="e-opale-suites"><button type="button" class="e-opale-suite" data-suite="Explique-moi la même chose comme à quelqu'un qui découvre, avec un exemple simple.">Plus simple</button><button type="button" class="e-opale-suite" data-suite="Redis-le en deux phrases, pas plus.">Plus court</button>${relire}${voix}</div>`;
  }
  /** C70 : la section de la fiche, choisie dans le plan, affichée dans le panneau. */
  function relire(bouton) {
    const c = contexteCourant || {};
    const contenu = window.CONTENU && window.CONTENU[c.matiere] && window.CONTENU[c.matiere][c.ref];
    const doc = contenu && (contenu[c.mode] || contenu.cours);
    if (!doc) { ajouter('assistant', 'Je ne retrouve pas la fiche ouverte. Rouvre-la et redemande.'); return; }
    const sections = decouper(doc.html);
    const boite = document.createElement('div'); boite.className = 'e-opale-relire';
    boite.innerHTML = `<label for="e-opale-section">Quelle section relit-on ?</label><select id="e-opale-section">${sections.map((x, k) => `<option value="${k}">${N.ech(x.titre)}</option>`).join('')}</select><div class="e-opale-section e-fiche" id="e-opale-section-corps"></div>`;
    bouton.closest('.e-opale-bulle').appendChild(boite); bouton.disabled = true;
    const montrer = () => { const k = Number(document.getElementById('e-opale-section').value); document.getElementById('e-opale-section-corps').innerHTML = `<h3>${N.ech(sections[k].titre)}</h3>${sections[k].html}`; };
    document.getElementById('e-opale-section').addEventListener('change', montrer); montrer();
  }
  function decouper(html) {
    const bac = document.createElement('div'); bac.innerHTML = html;
    const sections = []; let courante = null;
    [...bac.childNodes].forEach((n) => {
      if (n.nodeType === 1 && n.tagName === 'H2') { courante = { titre: n.textContent.trim(), html: '' }; sections.push(courante); return; }
      if (!courante) { courante = { titre: 'Introduction', html: '' }; sections.push(courante); }
      courante.html += n.outerHTML || n.textContent;
    });
    return sections.filter((x) => x.html.trim());
  }
  /* A45 : une ligne « Source : titre » devient un bouton qui ouvre la section dans la fiche. */
  const paragraphes = (t) => String(t).split(/\n{2,}|\n/).filter(Boolean).map((p) => {
    const m = /^\s*Source\s*:\s*(.+?)\s*\.?\s*$/i.exec(p);
    if (m) return `<p class="e-opale-source"><button type="button" class="e-opale-suite" data-section="${N.ech(m[1])}">${N.ic('ic-livre')} Source : ${N.ech(m[1])}</button></p>`;
    return `<p>${N.ech(p)}</p>`;
  }).join('');

  async function envoyer(texte) {
    texte = String(texte || '').trim();
    if (!texte || occupe) return;
    if (/visite|fais-moi visiter|montre-moi l'application/i.test(texte)) {
      ajouter('user', texte);
      ajouter('assistant', 'Je te fais visiter. Suis les étapes, tu peux arrêter quand tu veux avec Échap.');
      fermer();
      N.chargerScript('visite.js').then(() => { location.hash = '#/hub'; setTimeout(() => window.VISITE.lancer(0), 400); }).catch(() => {});
      return;
    }
    document.getElementById('e-opale-q').value = '';
    ajouter('user', texte);
    occupe = true; rendreFil();
    majContexte();
    try {
      const historique = fil.filter((m) => m.role === 'user' || m.role === 'assistant').slice(-9, -1).map((m) => ({ role: m.role, content: m.content }));
      const d = await N.api('/tuteur', { method: 'POST', body: JSON.stringify({ question: texte, contexte: contexteCourant, historique }) });
      occupe = false;
      if (d.indisponible) ajouter('assistant', d.message || 'Je ne peux pas répondre pour le moment.', secours());
      else ajouter('assistant', d.reponse);
    } catch (e) {
      occupe = false;
      ajouter('assistant', e.message === 'Opale est en pause pour le moment.' ? e.message : 'Je n\'arrive pas à répondre pour le moment.', secours());
    }
  }
  /** Quand Opale ne répond pas : le plan de la fiche et le message à Bastien. */
  function secours() {
    const c = contexteCourant;
    const plan = (c.plan || []).length ? `<p>Voici le plan de la fiche pour t'orienter :</p><ul>${c.plan.map((x) => `<li>${N.ech(x)}</li>`).join('')}</ul>` : '';
    const ctx = c.titre ? encodeURIComponent((c.matiereNom || '') + ' · ' + c.titre) : '';
    return plan + `<p><a class="e-bouton e-bouton-doux" href="#/messages${ctx ? '/' + ctx : ''}">${N.ic('ic-message')} Poser la question à Bastien</a></p>`;
  }

  /* ---------- Démarrage ---------------------------------------------------- */
  /* ---------- C68 : à l'ouverture d'une fiche, une phrase d'accueil et deux pistes, jamais plus ---------- */
  const ACCUEILS = {
    cours: 'Tu ouvres le cours. Lis une diapositive à la fois ; je suis là si un mot bloque.',
    revision: 'Une fiche de révision : courte, à relire deux fois. Je peux te poser des questions dessus.',
    exercices: 'Les exercices. Je donne des pistes, jamais la réponse : c\'est toi qui trouves.',
  };
  let bulle = null; let bulleMinuteur = null;
  function fermerBulle() { clearTimeout(bulleMinuteur); if (bulle) { bulle.remove(); bulle = null; } }
  function reagirAuContexte() {
    if (!N.reglage('tuteur')) return;
    const c = contexte();
    if (!ACCUEILS[c.mode] || !c.matiere || !c.ref) { fermerBulle(); return; }
    if (panneau && !panneau.hidden) return;
    const cle = 'opaline.opale.vu.' + c.matiere + '/' + c.ref + '/' + c.mode;
    try { if (sessionStorage.getItem(cle)) return; sessionStorage.setItem(cle, '1'); } catch (e) { /* privé */ }
    fermerBulle();
    const pistes = (SUGGESTIONS[c.mode] || []).slice(0, 2);
    bulle = document.createElement('div');
    bulle.className = 'e-opale-accueil'; bulle.setAttribute('role', 'status');
    bulle.innerHTML = `<button type="button" class="e-opale-accueil-fermer" aria-label="Fermer">${N.ic('ic-croix')}</button>
      <p><b>Opale</b> ${N.ech(ACCUEILS[c.mode])}</p>
      <div class="e-opale-accueil-pistes">${pistes.map((x) => `<button type="button" class="e-opale-puce">${N.ech(x)}</button>`).join('')}</div>`;
    document.body.appendChild(bulle);
    bulle.querySelector('.e-opale-accueil-fermer').addEventListener('click', fermerBulle);
    bulle.querySelectorAll('.e-opale-puce').forEach((b) => b.addEventListener('click', () => { const t = b.textContent; fermerBulle(); ouvrir(); envoyer(t); }));
    bulleMinuteur = setTimeout(fermerBulle, 14000);
  }

  function demarrer() {
    if (panneau) return;
    construire();
    window.addEventListener('hashchange', () => { if (panneau && !panneau.hidden) majContexte(); setTimeout(reagirAuContexte, 900); });
    setTimeout(reagirAuContexte, 1500);
  }
  window.OPALE = { demarrer, calculer, contexte, reagir: reagirAuContexte };
  if (document.getElementById('app-eleve')) demarrer();
})();
