/* =========================================================================
   app.js : espace de cours de 4e.

   Deux applications dans une seule page.
   - Espace professeur : un back-office de pilotage. Le quotidien d'abord
     (la seance du jour, la semaine, ce qui a ete depose, les echanges),
     le programme et les cours relegues au rang de ressources.
   - Espace de Sterenn : une seule action principale par ecran, peu
     d'elements, beaucoup d'air.
   ========================================================================= */
(function () {
  'use strict';

  const CLE_THEME = 'cours4e.theme';

  const NIVEAUX = [
    { id: 'insuffisant', libelle: 'Insuffisant', picto: '◔' },
    { id: 'fragile', libelle: 'Fragile', picto: '◑' },
    { id: 'satisfaisant', libelle: 'Satisfaisant', picto: '◕' },
    { id: 'tresbien', libelle: 'Très bien', picto: '●' },
  ];
  const TYPES_DOC = [
    { id: 'cours', libelle: 'Cours', picto: '📘' },
    { id: 'revision', libelle: 'Révision', picto: '🧠' },
    { id: 'exercices', libelle: 'Exercices', picto: '✍️' },
    { id: 'evaluation', libelle: 'Évaluation', picto: '📊' },
  ];
  const CRENEAUX = { A: 'Lundi', B: 'Mercredi', C: 'Vendredi' };
  const NOMS_COURTS = {
    'maths': 'Maths', 'francais': 'Français', 'physique-chimie': 'Phys-Chimie',
    'svt': 'SVT', 'histoire-geo': 'Hist-Géo', 'emc': 'EMC',
    'anglais-lv1': 'Anglais', 'espagnol-lv2': 'Espagnol',
  };
  const nomCourt = (id) => NOMS_COURTS[id] || id;
  const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const STATUTS = { prevue: 'Prévue', faite: 'Faite', reportee: 'Reportée' };

  let role = null;
  let etat = { suivi: {}, resultats: {}, fiches: {}, messagesNonLus: 0 };
  let observateur = null;
  let minuteur = null;

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
    const zone = document.getElementById('bandeau');
    zone.className = 'bandeau bandeau-' + type;
    zone.textContent = message;
    zone.hidden = false;
    clearTimeout(signaler.minuteur);
    signaler.minuteur = setTimeout(() => { zone.hidden = true; }, 5000);
  }

  /* ---------- Préférences locales -------------------------------------------- */
  const lire = (c, d) => { try { return JSON.parse(localStorage.getItem(c)) || d; } catch (e) { return d; } };
  const ecrire = (c, v) => { try { localStorage.setItem(c, JSON.stringify(v)); } catch (e) { /* privé */ } };

  /* ---------- Utilitaires ------------------------------------------------------ */
  const ech = (t) => String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const matiere = (id) => PROGRAMME.matieres.find((m) => m.id === id) || null;
  const lecon = (m, ref) => (m ? m.lecons.find((l) => l.ref === ref) : null) || null;
  const cle = (mid, ref) => mid + '/' + ref;
  const banque = (mid, ref) => (window.EXERCICES || {})[cle(mid, ref)] || null;
  const niveauDe = (mid, ref) => (etat.suivi[cle(mid, ref)] || {}).niveau || null;
  const estValidee = (mid, ref) => ['satisfaisant', 'tresbien'].indexOf(niveauDe(mid, ref)) !== -1;
  const dossierPdf = (mid) => 'pdf/dossiers/' + mid + '.pdf';
  const estProf = () => role === 'prof';

  const jourIso = (d = new Date()) => {
    const x = new Date(d);
    x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
    return x.toISOString().slice(0, 10);
  };
  const decaler = (iso, jours) => {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + jours);
    return jourIso(d);
  };
  const lundiDe = (iso) => {
    const d = new Date(iso + 'T12:00:00');
    const j = (d.getDay() + 6) % 7;
    return decaler(iso, -j);
  };
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
  function pastille(id) {
    const n = NIVEAUX.find((x) => x.id === id);
    return n ? `<span class="niv niv-${n.id}">${n.picto} ${n.libelle}</span>`
      : '<span class="niv niv-vide">non évaluée</span>';
  }
  function anneau(pct, taille = 52) {
    const r = (taille - 7) / 2;
    const c = 2 * Math.PI * r;
    return `<span class="anneau" aria-hidden="true"><svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}">
      <circle class="piste" cx="${taille / 2}" cy="${taille / 2}" r="${r}" fill="none" stroke-width="5"/>
      <circle class="part" cx="${taille / 2}" cy="${taille / 2}" r="${r}" fill="none" stroke-width="5"
              stroke-dasharray="${(c * pct) / 100} ${c}"/></svg><span class="pourcent">${pct}%</span></span>`;
  }
  function libelleLecon(ref) {
    const [mid, r] = String(ref).split('/');
    const m = matiere(mid);
    const l = lecon(m, r);
    return m && l ? { m, l, texte: m.nom + ' · ' + l.titre } : null;
  }

  /* ---------- Chargement des scripts protégés ---------------------------------- */
  function chargerScript(src) {
    return new Promise((ok, ko) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = ok;
      s.onerror = () => ko(new Error('Chargement impossible : ' + src));
      document.head.appendChild(s);
    });
  }
  let donneesChargees = false;
  async function chargerDonnees() {
    if (donneesChargees) return;
    await chargerScript('data/programme.js');
    await chargerScript('data/exercices.js');
    await chargerScript('planificateur.js');
    donneesChargees = true;
  }
  const enCours = {};
  function chargerContenu(mid) {
    if (window.CONTENU && window.CONTENU[mid]) return Promise.resolve(window.CONTENU[mid]);
    if (enCours[mid]) return enCours[mid];
    enCours[mid] = new Promise((res) => {
      const s = document.createElement('script');
      s.src = 'data/contenu/' + mid + '.js';
      s.onload = () => res((window.CONTENU || {})[mid] || null);
      s.onerror = () => res(null);
      document.head.appendChild(s);
    });
    return enCours[mid];
  }

  /* ---------- Thème -------------------------------------------------------------- */
  function appliquerTheme(v) {
    const r = document.documentElement;
    if (v === 'clair') r.setAttribute('data-theme', 'clair');
    else if (v === 'sombre') r.setAttribute('data-theme', 'sombre');
    else r.removeAttribute('data-theme');
    ecrire(CLE_THEME, v);
    const b = document.getElementById('btn-theme');
    if (b) b.setAttribute('aria-label', 'Thème : ' + v + '. Cliquer pour changer.');
  }
  appliquerTheme(lire(CLE_THEME, 'auto'));
  document.getElementById('btn-theme').addEventListener('click', () => {
    const o = ['auto', 'clair', 'sombre'];
    appliquerTheme(o[(o.indexOf(lire(CLE_THEME, 'auto')) + 1) % 3]);
  });

  /* ---------- Portail --------------------------------------------------------------- */
  function ouvrirPortail() {
    document.body.classList.add('portail-ouvert');
    document.body.removeAttribute('data-espace');
    document.getElementById('portail').hidden = false;
    document.getElementById('app').hidden = true;
    document.getElementById('code').focus();
  }
  function retourPortail() {
    role = null;
    etat = { suivi: {}, resultats: {}, fiches: {}, messagesNonLus: 0 };
    if (minuteur) { clearInterval(minuteur); minuteur = null; }
    location.hash = '';
    document.getElementById('code').value = '';
    ouvrirPortail();
  }
  async function ouvrirApp(r) {
    role = r;
    document.body.classList.remove('portail-ouvert');
    document.body.setAttribute('data-espace', r);
    document.getElementById('portail').hidden = true;
    document.getElementById('app').hidden = false;
    document.getElementById('marque-nom').textContent = estProf() ? 'Pilotage' : 'Mes cours';
    document.getElementById('marque-sous').textContent = estProf() ? 'Classe de 4ᵉ · Sterenn' : 'Classe de 4ᵉ';
    try {
      await chargerDonnees();
    } catch (e) {
      document.getElementById('vue').innerHTML = '<p class="vide">Le programme n\'a pas pu être chargé. Recharge la page.</p>';
      signaler(e.message);
      return;
    }
    await rafraichirEtat();
    if (minuteur) clearInterval(minuteur);
    minuteur = setInterval(sonder, 25000);
    router();
  }
  async function rafraichirEtat() {
    try {
      const d = await api('/etat');
      etat = { suivi: d.suivi || {}, resultats: d.resultats || {}, fiches: d.fiches || {}, messagesNonLus: d.messagesNonLus || 0 };
      role = d.role || role;
    } catch (e) {
      if (e.message !== 'Session expirée') signaler('Données indisponibles : ' + e.message);
    }
  }
  async function sonder() {
    if (!role) return;
    try {
      const d = await api('/etat');
      const avant = etat.messagesNonLus;
      etat.messagesNonLus = d.messagesNonLus || 0;
      if (etat.messagesNonLus !== avant) {
        construireLateral();
        if (etat.messagesNonLus > avant) signaler('Nouveau message.', 'info');
      }
    } catch (e) { /* une sonde ratée n'alerte pas */ }
  }

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

  document.getElementById('btn-sortir').addEventListener('click', async () => {
    try { await api('/deconnexion', { method: 'POST' }); } catch (e) { /* on sort quand même */ }
    retourPortail();
  });

  /* ---------- Squelette ------------------------------------------------------------- */
  const lateral = document.getElementById('lateral');
  const voile = document.getElementById('voile');
  const basculerLateral = (o) => { lateral.classList.toggle('ouverte', o); voile.hidden = !o; };
  document.getElementById('btn-ouvrir-lateral').addEventListener('click', () => basculerLateral(true));
  document.getElementById('btn-fermer-lateral').addEventListener('click', () => basculerLateral(false));
  voile.addEventListener('click', () => basculerLateral(false));

  function construireLateral() {
    const courant = (location.hash || '#/accueil').split('/')[1] || 'accueil';
    const lien = (route, ico, texte, extra = '') =>
      `<li><a href="#/${route}" class="${courant === route ? 'actif' : ''}">
        <span class="ico" aria-hidden="true">${ico}</span><span>${texte}</span>${extra}</a></li>`;
    const alerte = etat.messagesNonLus ? `<span class="pastille-alerte">${etat.messagesNonLus}</span>` : '';

    if (estProf()) {
      document.getElementById('nav-lateral').innerHTML =
        `<div class="lateral-groupe"><h2>Quotidien</h2><ul>
           ${lien('accueil', '📌', 'Aujourd\'hui')}
           ${lien('calendrier', '🗓️', 'Calendrier')}
           ${lien('planning', '⚙️', 'Configurer le planning')}
           ${lien('suivi', '📈', 'Suivi des acquis')}
         </ul></div>
         <div class="lateral-groupe"><h2>Échanges</h2><ul>
           ${lien('messages', '💬', 'Messages', alerte)}
           ${lien('depots', '📥', 'Dépôts de Sterenn')}
         </ul></div>
         <div class="lateral-groupe"><h2>Ressources</h2><ul>
           ${lien('matieres', '📚', 'Cours et leçons')}
           ${lien('programme', '🎓', 'Programme officiel')}
           ${lien('documents', '🗂️', 'Documents')}
         </ul></div>`;
      return;
    }

    document.getElementById('nav-lateral').innerHTML =
      `<div class="lateral-groupe"><ul>
         ${lien('accueil', '📌', 'Aujourd\'hui')}
         ${lien('calendrier', '🗓️', 'Mon calendrier')}
         ${lien('matieres', '📚', 'Mes matières')}
         ${lien('progres', '🏅', 'Mes progrès')}
         ${lien('messages', '💬', 'Messages', alerte)}
         ${lien('travail', '📤', 'Mon travail')}
       </ul></div>`;
  }

  function fil(morceaux) {
    document.getElementById('fil').innerHTML = morceaux.map((m, i) =>
      (i ? '<span aria-hidden="true">›</span>' : '')
      + (m.href ? `<a href="${m.href}">${ech(m.texte)}</a>` : `<b>${ech(m.texte)}</b>`)).join('');
  }

  function afficher(html, ariane) {
    if (observateur) { observateur.disconnect(); observateur = null; }
    const vue = document.getElementById('vue');
    vue.innerHTML = html;
    fil(ariane || [{ texte: 'Accueil' }]);
    construireLateral();
    basculerLateral(false);
    window.scrollTo(0, 0);
    vue.focus();
  }

  document.getElementById('form-recherche').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = document.getElementById('q').value.trim();
    if (q) location.hash = '#/recherche/' + encodeURIComponent(q);
  });

  /* ---------- Séances ------------------------------------------------------------- */
  const chargerSeances = (du, au) => api(`/seances?du=${du}&au=${au}`).then((d) => d.seances || []).catch(() => []);

  function carteSeance(s, options = {}) {
    const mats = (s.matieres || []).map((id) => {
      const m = matiere(id);
      return m ? `${m.icone} ${ech(m.nom)}` : ech(id);
    }).join(' · ');
    const lecons = (s.lecons || []).map((r) => {
      const info = libelleLecon(r);
      if (!info) return '';
      const cible = (info.l.docs || []).length ? `#/lecon/${info.m.id}/${info.l.ref}/cours` : `#/matiere/${info.m.id}`;
      return `<a class="jeton" href="${cible}">${ech(info.l.ref)} · ${ech(info.l.titre)}</a>`;
    }).join('');

    return `<article class="seance ${s.statut}" data-seance="${s.id}">
      <p class="seance-tete">
        <span class="seance-date">${ech(enFrancais(s.date, true))}</span>
        <span class="seance-creneau">${ech(s.creneau)}</span>
        <span class="seance-statut">${ech(STATUTS[s.statut] || s.statut)}</span>
      </p>
      ${mats ? `<p class="discret">${mats}</p>` : ''}
      ${s.objectif ? `<p class="seance-objectif">${ech(s.objectif)}</p>` : ''}
      ${lecons ? `<p class="seance-lecons">${lecons}</p>` : ''}
      ${s.travail ? `<p class="seance-travail"><strong>À faire ensuite :</strong> ${ech(s.travail)}</p>` : ''}
      ${s.bilan ? `<p class="discret"><strong>Bilan :</strong> ${ech(s.bilan)}</p>` : ''}
      ${options.actions === false ? '' : `<p class="seance-actions">
        ${s.statut !== 'faite' ? `<button class="bouton bouton-petit" data-action="faite" data-id="${s.id}" type="button">✓ Marquer faite</button>` : ''}
        ${s.statut !== 'reportee' ? `<button class="bouton bouton-neutre bouton-petit" data-action="reportee" data-id="${s.id}" type="button">Reporter</button>` : ''}
        <button class="bouton bouton-neutre bouton-petit" data-action="bilan" data-id="${s.id}" type="button">Bilan et travail</button>
        <button class="bouton bouton-danger bouton-petit" data-action="supprimer" data-id="${s.id}" type="button">Supprimer</button>
      </p>`}
    </article>`;
  }

  function brancherActionsSeance(rafraichir) {
    document.querySelectorAll('[data-action][data-id]').forEach((b) => {
      b.addEventListener('click', async () => {
        const id = b.getAttribute('data-id');
        const action = b.getAttribute('data-action');
        try {
          if (action === 'supprimer') {
            if (!confirm('Supprimer cette séance ?')) return;
            await api('/seances/' + id, { method: 'DELETE' });
          } else if (action === 'bilan') {
            const bilan = prompt('Bilan de la séance (ce qui a été fait, ce qui a bloqué)');
            if (bilan === null) return;
            const travail = prompt('Travail à faire d\'ici la prochaine fois');
            if (travail === null) return;
            await api('/seances/' + id, { method: 'PATCH', body: JSON.stringify({ bilan, travail }) });
          } else {
            await api('/seances/' + id, { method: 'PATCH', body: JSON.stringify({ statut: action }) });
          }
          signaler('Séance mise à jour.', 'succes');
          rafraichir();
        } catch (e) { signaler(e.message); }
      });
    });
  }

  /* ---------- Calendrier de la semaine ------------------------------------------------ */
  function evenement(s, aujourd) {
    const mats = (s.matieres || []).map((id) => {
      const m = matiere(id);
      return m ? `<span class="evt-mat" style="color:var(--c-${id})">${m.icone} ${ech(nomCourt(id))}</span>` : '';
    }).join('');

    if (s.type === 'travail') {
      return `<div class="evt evt-travail">
        <span class="evt-heure">${ech(s.debut)} · 15 min</span>
        <span class="evt-titre">Travail personnel</span>
        ${s.travail ? `<span class="evt-texte" title="${ech(s.travail)}">${ech(s.travail)}</span>` : ''}
      </div>`;
    }

    const aChoisir = (s.choix || []).length >= 2 && !s.choisi_le;
    // Une leçon pas encore rédigée n'affiche pas de lien : la pastille de
    // matière dit déjà de quoi il s'agit, inutile d'encombrer la case.
    const liens = (s.lecons || []).map((r) => {
      const info = libelleLecon(r);
      if (!info || !(info.l.docs || []).length) return '';
      return `<a href="#/lecon/${info.m.id}/${info.l.ref}/cours">${ech(info.l.ref)} · ouvrir</a>`;
    }).join('');

    const actions = estProf()
      ? `<button data-action="faite" data-id="${s.id}" type="button">✓ faite</button>
         <button data-action="bilan" data-id="${s.id}" type="button">bilan</button>`
      : '';

    return `<div class="evt evt-${s.statut}">
      <span class="evt-heure">${ech(s.debut)} à ${ech(s.fin)}${s.statut !== 'prevue' ? ' · ' + ech(STATUTS[s.statut]) : ''}</span>
      <span class="evt-titre">${String(s.objectif || 'Séance de travail').split(' · ')
      .map((part) => `<span class="evt-part">${ech(part)}</span>`).join('')}</span>
      ${mats ? `<span class="evt-mats">${mats}</span>` : ''}
      ${aChoisir ? '<span class="evt-drapeau">À choisir</span>' : ''}
      ${liens || actions ? `<span class="evt-liens">${liens}${actions}</span>` : ''}
    </div>`;
  }

  function blocChoix(seances) {
    const ouverts = seances.filter((s) => (s.choix || []).length >= 2 && !s.choisi_le);
    if (!ouverts.length) return '';
    return ouverts.map((s) => `<section class="choix-bloc" data-choix="${s.id}">
      <h2>${estProf() ? 'Choix proposé à Sterenn' : 'À toi de choisir'}</h2>
      <p class="aide">${estProf()
      ? `Séance du ${ech(enFrancais(s.date, true))} : elle choisira la deuxième leçon parmi ces trois.`
      : `Pour la séance du ${ech(enFrancais(s.date, true))}, tu choisis la deuxième leçon. Les trois sont au programme : prends celle qui te tente le plus.`}</p>
      <ul class="choix-options">${(s.choix || []).map((r) => {
      const info = libelleLecon(r);
      if (!info) return '';
      return `<li><button type="button" data-seance="${s.id}" data-lecon="${r}">
        <span class="m" style="color:var(--c-${info.m.id})">${info.m.icone} ${ech(info.m.nom)}</span>
        <b>${ech(info.l.titre)}</b>
        <span>${info.l.notions.slice(0, 3).map(ech).join(' · ')}</span>
      </button></li>`;
    }).join('')}</ul></section>`).join('');
  }

  function brancherChoix(rafraichir) {
    document.querySelectorAll('[data-seance][data-lecon]').forEach((b) => {
      b.addEventListener('click', async () => {
        try {
          await api('/seances/' + b.getAttribute('data-seance') + '/choix', {
            method: 'POST', body: JSON.stringify({ lecon: b.getAttribute('data-lecon') }),
          });
          signaler('Choix enregistré.', 'succes');
          rafraichir();
        } catch (e) { signaler(e.message); }
      });
    });
  }

  async function vueCalendrier(depart) {
    const valide = depart && /^\d{4}-\d{2}-\d{2}$/.test(depart);
    const lundi = lundiDe(valide ? depart : jourIso());
    const aujourd = jourIso();
    afficher('<p class="vide">Chargement du calendrier…</p>', [{ texte: 'Calendrier' }]);
    const seances = await chargerSeances(lundi, decaler(lundi, 6));

    const colonnes = JOURS.map((nom, i) => {
      const jour = decaler(lundi, i);
      const duJour = seances.filter((s) => s.date === jour)
        .sort((a, b) => String(a.debut).localeCompare(String(b.debut)));
      const classes = ['cal-jour'];
      if (!duJour.length) classes.push('vide');
      if (jour === aujourd) classes.push('aujourdhui');
      else if (jour < aujourd) classes.push('passe');
      return `<div class="${classes.join(' ')}">
        <p class="cal-jour-tete"><span class="cal-jour-nom">${nom}</span>
          <span class="cal-jour-num">${Number(jour.slice(8, 10))}</span></p>
        ${duJour.length ? duJour.map((s) => evenement(s, aujourd)).join('')
        : '<p class="cal-repos">Rien de prévu</p>'}
      </div>`;
    }).join('');

    const total = seances.filter((s) => s.type === 'cours').length;
    afficher(
      `<h1>${estProf() ? 'Calendrier' : 'Mon calendrier'}</h1>
       <p class="intro">${estProf()
        ? 'La semaine en un coup d\'œil. Les séances se configurent dans « Configurer le planning ».'
        : 'Ta semaine. Les cours sont le lundi, le mercredi et le vendredi de 13 h à 14 h 30.'}</p>
       ${blocChoix(seances)}
       <div class="cal-tete">
         <button class="bouton-secondaire" id="cal-prec" type="button">← Semaine précédente</button>
         <h2>Semaine du ${ech(enFrancais(lundi, true))}</h2>
         <button class="bouton-secondaire" id="cal-auj" type="button">Cette semaine</button>
         <button class="bouton-secondaire" id="cal-suiv" type="button">Semaine suivante →</button>
       </div>
       <div class="calendrier">${colonnes}</div>
       ${total ? '' : `<p class="vide">Aucune séance cette semaine.${estProf() ? ' <a href="#/planning">Configurer le planning</a>.' : ''}</p>`}`,
      [{ texte: estProf() ? 'Calendrier' : 'Mon calendrier' }],
    );

    document.getElementById('cal-prec').addEventListener('click', () => { location.hash = '#/calendrier/' + decaler(lundi, -7); });
    document.getElementById('cal-suiv').addEventListener('click', () => { location.hash = '#/calendrier/' + decaler(lundi, 7); });
    document.getElementById('cal-auj').addEventListener('click', () => { location.hash = '#/calendrier/' + jourIso(); });
    brancherActionsSeance(() => vueCalendrier(lundi));
    brancherChoix(() => vueCalendrier(lundi));
  }

  /* ---------- PROFESSEUR : aujourd'hui ---------------------------------------------- */
  async function vueProfAujourdhui() {
    const aujourd = jourIso();
    afficher('<p class="vide">Chargement du jour…</p>', [{ texte: 'Aujourd\'hui' }]);

    const [seances, fichiers] = await Promise.all([
      chargerSeances(decaler(aujourd, -21), decaler(aujourd, 21)),
      api('/fichiers').then((d) => d.fichiers || []).catch(() => []),
    ]);

    const duJour = seances.filter((s) => s.date === aujourd);
    const aVenir = seances.filter((s) => s.date > aujourd).slice(0, 3);
    const enRetard = seances.filter((s) => s.date < aujourd && s.statut === 'prevue');
    const faites30 = seances.filter((s) => s.statut === 'faite' && s.date >= decaler(aujourd, -30)).length;
    const derniere = seances.filter((s) => s.statut === 'faite' && s.travail).sort((a, b) => b.date.localeCompare(a.date))[0];
    const depots = fichiers.filter((f) => f.auteur === 'eleve').slice(0, 4);

    const c = chiffres();
    const aReprendre = [];
    PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => {
      const n = niveauDe(m.id, l.ref);
      if (n === 'insuffisant' || n === 'fragile') aReprendre.push({ m, l, n });
    }));

    afficher(
      `<h1>Aujourd'hui</h1>
       <p class="intro">${ech(enFrancais(aujourd, true))}</p>
       <ul class="indicateurs">
         <li><strong>${duJour.length}</strong><span>séance(s) aujourd'hui</span></li>
         <li><strong>${faites30}</strong><span>séances faites sur 30 jours</span></li>
         <li class="${enRetard.length ? 'alerte' : ''}"><strong>${enRetard.length}</strong><span>séances passées non closes</span></li>
         <li class="${aReprendre.length ? 'alerte' : ''}"><strong>${aReprendre.length}</strong><span>leçons à reprendre</span></li>
         <li><strong>${c.validees} / ${c.total}</strong><span>leçons validées</span></li>
       </ul>

       <h2 class="titre-section">La séance du jour</h2>
       <div id="zone-jour">${duJour.length
        ? duJour.map((s) => carteSeance(s)).join('')
        : `<div class="carte"><p class="discret">Aucune séance prévue aujourd'hui.</p>
             <p class="barre-actions" style="margin-bottom:0"><a class="bouton" href="#/planning">Ouvrir le planning</a></p></div>`}</div>

       ${derniere ? `<h2 class="titre-section">Travail donné la dernière fois</h2>
         <div class="carte"><p style="margin:0">${ech(derniere.travail)}</p>
         <p class="discret" style="margin:0.3rem 0 0">Séance du ${ech(enFrancais(derniere.date, true))}</p></div>` : ''}

       <div class="colonnes" style="margin-top:1.6rem">
         <section>
           <h2 class="titre-section" style="margin-top:0">Prochaines séances</h2>
           <div class="semaine">${aVenir.length
            ? aVenir.map((s) => carteSeance(s, { actions: false })).join('')
            : '<p class="carte discret">Rien de planifié. <a href="#/planning">Planifier la semaine</a>.</p>'}</div>
         </section>
         <section>
           <h2 class="titre-section" style="margin-top:0">Derniers dépôts de Sterenn</h2>
           ${depots.length ? `<ul class="liste-fichiers">${depots.map((f) => `<li>
              <span class="fichier-ico" aria-hidden="true">${f.type.startsWith('image/') ? '🖼️' : (f.type === 'application/pdf' ? '📕' : '📄')}</span>
              <span class="fichier-corps"><a href="/api/fichiers/${f.id}">${ech(f.nom)}</a>
              <span class="discret">${ech(dateCourte(f.cree_le))} · ${poids(f.taille)}</span></span></li>`).join('')}</ul>`
            : '<p class="carte discret">Aucun dépôt pour le moment.</p>'}
           ${etat.messagesNonLus ? `<p class="barre-actions"><a class="bouton bouton-doux" href="#/messages">💬 ${etat.messagesNonLus} message(s) non lu(s)</a></p>` : ''}
         </section>
       </div>

       ${enRetard.length ? `<h2 class="titre-section">Séances passées non closes</h2>
         <div class="semaine">${enRetard.map((s) => carteSeance(s)).join('')}</div>` : ''}

       ${aReprendre.length ? `<h2 class="titre-section">À reprendre en priorité</h2>
         <ul class="liste-nue">${aReprendre.slice(0, 8).map(({ m, l, n }) => `<li class="carte" style="padding:0.45rem 0.7rem">
            <a href="#/lecon/${m.id}/${l.ref}/cours">${ech(m.nom)} · ${ech(l.titre)}</a> ${pastille(n)}</li>`).join('')}</ul>
         <p class="discret">Insuffisant : reprendre le cours. Fragile : répéter sur une semaine.</p>` : ''}`,
      [{ texte: 'Aujourd\'hui' }],
    );
    brancherActionsSeance(vueProfAujourdhui);
  }

  /* ---------- PROFESSEUR : configuration du planning --------------------------------- */
  async function vuePlanning(depart) {
    const valide = depart && /^\d{4}-\d{2}-\d{2}$/.test(depart);
    const lundi = lundiDe(valide ? depart : jourIso());
    afficher('<p class="vide">Chargement…</p>', [{ texte: 'Configurer le planning' }]);
    const seances = await chargerSeances(lundi, decaler(lundi, 6));

    const optionsLecons = PROGRAMME.matieres.map((m) =>
      `<optgroup label="${ech(m.nom)}">${m.lecons.map((l) =>
        `<option value="${m.id}/${l.ref}">${ech(l.ref)} · ${ech(l.titre)}</option>`).join('')}</optgroup>`).join('');

    afficher(
      `<h1>Configurer le planning</h1>
       <p class="intro">Rythme par défaut : lundi, mercredi et vendredi de 13 h à 14 h 30, plus deux temps de travail personnel le mardi et le jeudi.</p>

       <section class="carte">
         <p class="carte-titre">🪄 Pré-générer l'année</p>
         <p class="discret" style="margin-top:0">Répartit les 69 leçons sur les trois séances hebdomadaires en alternant les matières, et place les temps de travail personnel entre les cours. Une séance sur quatre laisse à Sterenn le choix entre trois leçons. Rien n'est écrasé : une séance déjà présente sur un créneau est conservée.</p>
         <form class="form-seance" id="form-generer">
           <div class="ligne">
             <div><label for="g-debut">Premier lundi</label>
               <input type="date" id="g-debut" value="${lundiDe(jourIso())}" required></div>
             <div><label for="g-semaines">Nombre de semaines</label>
               <input type="number" id="g-semaines" value="36" min="1" max="45" required></div>
           </div>
           <button class="bouton" type="submit" id="btn-generer">Générer le planning</button>
         </form>
       </section>

       <h2 class="titre-section">Semaine du ${ech(enFrancais(lundi, true))}</h2>
       <div class="cal-tete">
         <button class="bouton-secondaire" id="sem-prec" type="button">← Précédente</button>
         <button class="bouton-secondaire" id="sem-auj" type="button">Cette semaine</button>
         <button class="bouton-secondaire" id="sem-suiv" type="button">Suivante →</button>
         <a class="bouton bouton-doux" href="#/calendrier/${lundi}">Voir en calendrier</a>
       </div>
       <div class="semaine" id="zone-semaine">${seances.length
        ? seances.map((s) => carteSeance(s)).join('')
        : '<p class="carte discret">Aucune séance cette semaine.</p>'}</div>

       <h2 class="titre-section">Ajouter une séance</h2>
       <form class="carte form-seance" id="form-seance">
         <div class="ligne">
           <div><label for="s-date">Date</label><input type="date" id="s-date" value="${lundi}" required></div>
           <div><label for="s-creneau">Jour type</label>
             <select id="s-creneau">${Object.entries(CRENEAUX).map(([k, v]) =>
              `<option value="${k}">${ech(v)}</option>`).join('')}</select></div>
           <div><label for="s-debut">Début</label><input type="time" id="s-debut" value="13:00"></div>
           <div><label for="s-fin">Fin</label><input type="time" id="s-fin" value="14:30"></div>
         </div>
         <div><label for="s-objectif">Objectif de la séance</label>
           <input type="text" id="s-objectif" maxlength="300" placeholder="Pythagore : calculer un côté et rédiger la démonstration"></div>
         <div><label for="s-lecons">Leçons travaillées</label>
           <select id="s-lecons" multiple size="6">${optionsLecons}</select>
           <p class="discret" style="margin:0.25rem 0 0">Maintenir Ctrl ou Cmd pour en choisir plusieurs.</p></div>
         <div><label for="s-travail">Travail à faire d'ici la prochaine fois</label>
           <textarea id="s-travail" rows="2" maxlength="500" placeholder="Exercices 9 à 12, à la main"></textarea></div>
         <button class="bouton" type="submit">Ajouter la séance</button>
       </form>`,
      [{ texte: 'Configurer le planning' }],
    );

    document.getElementById('sem-prec').addEventListener('click', () => { location.hash = '#/planning/' + decaler(lundi, -7); });
    document.getElementById('sem-suiv').addEventListener('click', () => { location.hash = '#/planning/' + decaler(lundi, 7); });
    document.getElementById('sem-auj').addEventListener('click', () => { location.hash = '#/planning/' + jourIso(); });
    brancherActionsSeance(() => vuePlanning(lundi));

    document.getElementById('form-generer').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const bouton = document.getElementById('btn-generer');
      const debut = lundiDe(document.getElementById('g-debut').value);
      const semaines = Math.max(1, Math.min(45, Number(document.getElementById('g-semaines').value) || 36));
      bouton.disabled = true;
      bouton.textContent = 'Génération…';
      try {
        const { seances: liste, restants } = window.PLANIFICATEUR.generer(debut, semaines);
        let crees = 0;
        let ignores = 0;
        for (let i = 0; i < liste.length; i += 200) {
          const r = await api('/seances/lot', { method: 'POST', body: JSON.stringify({ seances: liste.slice(i, i + 200) }) });
          crees += r.crees;
          ignores += r.ignores;
        }
        signaler(`${crees} séance(s) créée(s)` + (ignores ? `, ${ignores} déjà en place` : '')
          + (restants ? `. ${restants} bloc(s) non placés : ajoute des semaines.` : '.'), 'succes');
        vuePlanning(lundi);
      } catch (e) {
        signaler(e.message);
      } finally {
        bouton.disabled = false;
        bouton.textContent = 'Générer le planning';
      }
    });

    document.getElementById('form-seance').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const lecons = [...document.getElementById('s-lecons').selectedOptions].map((o) => o.value);
      try {
        await api('/seances', {
          method: 'POST',
          body: JSON.stringify({
            date: document.getElementById('s-date').value,
            creneau: document.getElementById('s-creneau').value,
            debut: document.getElementById('s-debut').value,
            fin: document.getElementById('s-fin').value,
            objectif: document.getElementById('s-objectif').value,
            travail: document.getElementById('s-travail').value,
            lecons,
            matieres: [...new Set(lecons.map((r) => r.split('/')[0]))],
          }),
        });
        signaler('Séance ajoutée.', 'succes');
        vuePlanning(lundi);
      } catch (e) { signaler(e.message); }
    });
  }


  /* ---------- ÉLÈVE : aujourd'hui ---------------------------------------------------- */
  async function vueEleveAujourdhui() {
    const aujourd = jourIso();
    afficher('<p class="vide">Chargement…</p>', [{ texte: 'Aujourd\'hui' }]);
    const seances = await chargerSeances(decaler(aujourd, -14), decaler(aujourd, 21));

    const coursJour = seances.find((s) => s.date === aujourd && s.type === 'cours');
    const travailJour = seances.find((s) => s.date === aujourd && s.type === 'travail');
    const prochaine = seances.filter((s) => s.date > aujourd && s.type === 'cours')
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    const aFaire = seances.filter((s) => s.date <= aujourd && s.travail && s.type === 'cours')
      .sort((a, b) => b.date.localeCompare(a.date))[0];

    const vedette = coursJour || prochaine;
    const suivante = prochaineLecon();
    const cible = vedette && (vedette.lecons || []).length
      ? libelleLecon(vedette.lecons[0])
      : (suivante ? { m: suivante.m, l: suivante.l } : null);
    const c = chiffres();

    const quand = coursJour ? 'Aujourd\'hui' : (prochaine ? 'Prochaine séance' : 'À faire maintenant');
    const detail = vedette
      ? (coursJour ? `De ${ech(vedette.debut)} à ${ech(vedette.fin)}` : ech(enFrancais(vedette.date, true)))
        + ' · ' + (vedette.matieres || []).map((id) => {
          const m = matiere(id);
          return m ? m.icone + ' ' + ech(m.nom) : '';
        }).filter(Boolean).join(' · ')
      : (cible ? ech(cible.m.nom) : 'Les prochaines leçons arriveront bientôt.');

    afficher(
      `<section class="aujourdhui">
        <p class="quand">${quand}</p>
        <h1>${vedette ? ech(vedette.objectif || 'Séance de travail')
        : (cible ? ech(cible.l.titre) : 'Rien à faire pour l\'instant')}</h1>
        <p class="detail">${detail}</p>
        <p class="barre-actions">
          ${cible && (cible.l.docs || []).length
        ? `<a class="bouton" href="#/lecon/${cible.m.id}/${cible.l.ref}/cours">📘 Ouvrir ma leçon</a>` : ''}
          ${cible && banque(cible.m.id, cible.l.ref)
        ? `<a class="bouton bouton-doux" href="#/exos/${cible.m.id}/${cible.l.ref}">🎯 M'entraîner</a>` : ''}
          <a class="bouton bouton-neutre" href="#/calendrier">🗓️ Voir ma semaine</a>
        </p>
       </section>

       ${blocChoix(seances.filter((s) => s.date >= aujourd))}

       ${travailJour ? `<div class="carte" style="margin-bottom:1.2rem">
         <p class="carte-titre">⏱️ Ton temps de travail personnel, aujourd'hui</p>
         <p style="margin:0">${ech(travailJour.travail || 'Un temps court de révision.')}</p></div>` : ''}

       ${aFaire && !travailJour ? `<div class="carte" style="margin-bottom:1.2rem">
         <p class="carte-titre">📝 À faire d'ici la prochaine fois</p>
         <p style="margin:0">${ech(aFaire.travail)}</p></div>` : ''}

       <ul class="actions-eleve">
         <li><a href="#/calendrier"><span class="ico" aria-hidden="true">🗓️</span><b>Mon calendrier</b><span>Ma semaine en un coup d'œil</span></a></li>
         <li><a href="#/matieres"><span class="ico" aria-hidden="true">📚</span><b>Mes matières</b><span>Toutes mes leçons</span></a></li>
         <li><a href="#/travail"><span class="ico" aria-hidden="true">📤</span><b>Envoyer mon travail</b><span>Une photo, un document</span></a></li>
         <li><a href="#/messages"><span class="ico" aria-hidden="true">💬</span><b>Messages</b><span>${etat.messagesNonLus ? etat.messagesNonLus + ' non lu(s)' : 'Poser une question'}</span></a></li>
         <li><a href="#/progres"><span class="ico" aria-hidden="true">🏅</span><b>Mes progrès</b><span>${c.validees} leçon(s) validée(s)</span></a></li>
       </ul>`,
      [{ texte: 'Aujourd\'hui' }],
    );
    brancherChoix(vueEleveAujourdhui);
  }


  /* ---------- Commun : matières et leçons ------------------------------------------------ */
  function chiffres() {
    let total = 0; let validees = 0; let pretes = 0;
    PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => {
      total += 1;
      if (estValidee(m.id, l.ref)) validees += 1;
      if (l.docs && l.docs.length === 4) pretes += 1;
    }));
    return { total, validees, pretes };
  }
  function prochaineLecon() {
    for (let p = 1; p <= 5; p += 1) {
      for (const m of PROGRAMME.matieres) {
        for (const l of m.lecons) {
          if (l.periode === p && l.docs && l.docs.length && !estValidee(m.id, l.ref)) return { m, l };
        }
      }
    }
    return null;
  }
  function grilleMatieres() {
    return `<ul class="grille-matieres">${PROGRAMME.matieres.map((m) => {
      const p = progression(m);
      const prets = m.lecons.filter((l) => l.docs && l.docs.length === 4).length;
      return `<li><a class="carte-matiere" href="#/matiere/${m.id}" style="--m:var(--c-${m.id})">
        ${anneau(p.pct)}
        <span class="m-nom">${m.icone} ${ech(m.nom)}</span>
        <span class="m-info">${estProf() ? `${m.lecons.length} leçons · ${prets} prêtes · ${p.faites} validées`
        : `${prets} leçon(s) disponible(s)`}</span></a></li>`;
    }).join('')}</ul>`;
  }

  function vueMatieres() {
    const c = chiffres();
    afficher(
      `<h1>${estProf() ? 'Cours et leçons' : 'Mes matières'}</h1>
       <p class="intro">${estProf() ? `${PROGRAMME.matieres.length} matières, ${c.total} leçons, ${c.pretes} prêtes.`
        : 'Choisis une matière pour voir tes leçons.'}</p>
       ${grilleMatieres()}`,
      [{ texte: estProf() ? 'Cours et leçons' : 'Mes matières' }],
    );
  }

  function ligneLecon(m, l, avecMatiere) {
    const dispo = l.docs || [];
    const actions = TYPES_DOC.filter((t) => dispo.indexOf(t.id) !== -1)
      .map((t) => `<a href="#/lecon/${m.id}/${l.ref}/${t.id}">${t.picto} ${t.libelle}</a>`);
    if (banque(m.id, l.ref)) actions.push(`<a href="#/exos/${m.id}/${l.ref}">🎯 ${estProf() ? 'Exercices' : 'M\'entraîner'}</a>`);
    const manquants = TYPES_DOC.length - dispo.length;
    if (manquants > 0) actions.push(`<span class="indispo">⏳ ${dispo.length === 0 ? 'en préparation' : manquants + ' à venir'}</span>`);
    const nom = dispo.length ? `<a href="#/lecon/${m.id}/${l.ref}/${dispo[0]}">${ech(l.titre)}</a>` : ech(l.titre);
    return `<li class="${dispo.length ? 'prete' : ''}" style="--m:var(--c-${m.id})">
      <p class="lecon-ligne">
        <span class="puce-ref">${ech(l.ref)}</span>
        <span class="lecon-nom">${nom}</span>
        <span class="lecon-fin">${avecMatiere ? `<span class="discret">${ech(m.nom)}</span>` : ''}${pastille(niveauDe(m.id, l.ref))}</span>
      </p>
      <p class="lecon-notions">${l.notions.map(ech).join(' · ')}</p>
      <p class="lecon-actions">${actions.join('')}</p></li>`;
  }

  function vueMatiere(mid) {
    const m = matiere(mid);
    if (!m) return vueIntrouvable();
    const p = progression(m);
    const aDuContenu = m.lecons.some((l) => l.docs && l.docs.length);
    const periodes = [1, 2, 3, 4, 5].map((per) => {
      const lecons = m.lecons.filter((l) => l.periode === per);
      if (!lecons.length) return '';
      const pretes = lecons.filter((l) => l.docs && l.docs.length);
      const liste = estProf() ? lecons : (pretes.length ? pretes : []);
      if (!liste.length) return '';
      return `<h2 class="titre-section">Période ${per}</h2>
        <ul class="liste-lecons">${liste.map((l) => ligneLecon(m, l)).join('')}</ul>`;
    }).join('');

    afficher(
      `<h1>${m.icone} ${ech(m.nom)}</h1>
       <p class="intro">${estProf() ? `${ech(m.horaire)} · ${m.lecons.length} leçons · ${p.faites} validées`
        : `${p.faites} leçon(s) validée(s) sur ${p.total}`}</p>
       ${aDuContenu ? `<p class="barre-actions">
         <a class="bouton" href="#/dossier/${m.id}">📖 Lire le dossier complet</a>
         <a class="bouton bouton-doux" href="${dossierPdf(m.id)}" download>⬇️ Télécharger le PDF</a></p>` : ''}
       ${estProf() ? `<div class="carte"><p class="carte-titre">Thèmes officiels</p>
         <ul style="margin:0">${m.themes.map((t) => `<li>${ech(t)}</li>`).join('')}</ul></div>` : ''}
       ${periodes || '<p class="vide">Les leçons de cette matière arrivent bientôt.</p>'}`,
      [{ texte: estProf() ? 'Cours et leçons' : 'Mes matières', href: '#/matieres' }, { texte: m.nom }],
    );
  }

  /* ---------- Lecteur ---------------------------------------------------------------------- */
  function vueLecon(mid, ref, type) {
    const m = matiere(mid);
    const l = lecon(m, ref);
    if (!m || !l || !(l.docs || []).length) return vueIntrouvable();
    const dispo = l.docs;
    const actif = dispo.indexOf(type) !== -1 ? type : dispo[0];

    afficher('<p class="vide">Chargement de la fiche…</p>',
      [{ texte: estProf() ? 'Cours et leçons' : 'Mes matières', href: '#/matieres' },
        { texte: m.nom, href: '#/matiere/' + m.id }, { texte: l.titre }]);

    chargerContenu(mid).then((contenu) => {
      const doc = contenu && contenu[ref] && contenu[ref][actif];
      if (!doc) return afficher('<p class="vide">Cette fiche n\'est pas encore disponible.</p>');

      const onglets = TYPES_DOC.filter((t) => dispo.indexOf(t.id) !== -1)
        .map((t) => `<a href="#/lecon/${mid}/${ref}/${t.id}" class="${t.id === actif ? 'actif' : ''}">${t.picto} ${t.libelle}</a>`)
        .join('') + (banque(mid, ref) ? `<a href="#/exos/${mid}/${ref}">🎯 S'entraîner</a>` : '');

      const plan = doc.plan.length ? `<div class="rail-bloc"><h2>Dans cette fiche</h2><ol>${
        doc.plan.map((s) => `<li><a href="#${s.id}" data-ancre="${s.id}">${ech(s.texte)}</a></li>`).join('')}</ol></div>` : '';

      const cleFiche = cle(mid, ref) + '/' + actif;
      const luLe = etat.fiches[cleFiche];
      const rail = estProf()
        ? `<div class="rail-bloc"><h2>Positionnement</h2>
             <p id="zone-pastille" style="margin:0 0 0.4rem">${pastille(niveauDe(mid, ref))}</p>
             <select id="select-niveau" aria-label="Niveau atteint"><option value="">non évaluée</option>
               ${NIVEAUX.map((n) => `<option value="${n.id}"${niveauDe(mid, ref) === n.id ? ' selected' : ''}>${n.picto} ${n.libelle}</option>`).join('')}
             </select></div>
           <div class="rail-bloc"><h2>Actions</h2>
             <p style="margin:0 0 0.4rem"><a class="bouton bouton-doux bouton-petit" href="${dossierPdf(mid)}" download>⬇️ PDF de la matière</a></p>
             <button class="bouton bouton-neutre bouton-petit" id="btn-question" type="button">💬 Écrire à Sterenn</button></div>`
        : `<div class="rail-bloc"><h2>Cette fiche</h2>
             <p class="discret" id="etat-fiche">${luLe ? 'Terminée le ' + ech(dateCourte(luLe.termine_le)) : 'Pas encore terminée'}</p>
             <button class="bouton bouton-doux" id="btn-fini" type="button">${luLe ? '↺ Annuler' : '✓ J\'ai terminé'}</button></div>
           <div class="rail-bloc"><h2>Besoin d'aide ?</h2>
             <button class="bouton bouton-neutre" id="btn-question" type="button">💬 Poser une question</button></div>`;

      document.getElementById('vue').innerHTML =
        `<div class="lecteur" style="--m:var(--c-${mid})">
          <div class="lecteur-corps">
            <header class="lecteur-tete">
              <p class="discret"><span class="puce-ref">${ech(l.ref)}</span> ${ech(m.nom)}</p>
              <h1>${ech(doc.titre)}</h1>
              ${doc.resume ? `<p>${ech(doc.resume)}</p>` : ''}
              <ul class="meta">${doc.duree ? `<li>⏱️ ${ech(doc.duree)}</li>` : ''}
                ${estProf() && doc.competences.length ? `<li>🧩 ${doc.competences.map(ech).join(' · ')}</li>` : ''}</ul>
            </header>
            <nav class="onglets" aria-label="Documents de la leçon">${onglets}</nav>
            ${doc.objectifs.length ? `<div class="bloc bloc-objectif">
              <p class="bloc-titre"><span class="picto" aria-hidden="true">🎯</span><span>Objectif${doc.objectifs.length > 1 ? 's' : ''}</span></p>
              <ul>${doc.objectifs.map((o) => `<li>${ech(o)}</li>`).join('')}</ul></div>` : ''}
            <article class="fiche-rendue">${doc.html}</article>
            <p class="barre-actions"><a class="bouton bouton-neutre" href="#/matiere/${mid}">← Retour à ${ech(m.nom)}</a></p>
          </div>
          <aside class="rail">${plan}${rail}</aside>
        </div>`;
      fil([{ texte: estProf() ? 'Cours et leçons' : 'Mes matières', href: '#/matieres' },
        { texte: m.nom, href: '#/matiere/' + m.id }, { texte: l.ref + ' · ' + doc.titre }]);
      construireLateral();
      window.scrollTo(0, 0);
      brancherRail(doc.plan);

      const select = document.getElementById('select-niveau');
      if (select) select.addEventListener('change', async (ev) => {
        const v = ev.target.value;
        try {
          await api('/suivi', { method: 'PUT', body: JSON.stringify({ matiere: mid, ref, niveau: v || null }) });
          if (v) etat.suivi[cle(mid, ref)] = { niveau: v }; else delete etat.suivi[cle(mid, ref)];
          document.getElementById('zone-pastille').innerHTML = pastille(v || null);
          signaler('Positionnement enregistré.', 'succes');
        } catch (e) { signaler(e.message); }
      });

      const btnFini = document.getElementById('btn-fini');
      if (btnFini) btnFini.addEventListener('click', async () => {
        const termine = !etat.fiches[cleFiche];
        try {
          const r = await api('/fiches', { method: 'PUT', body: JSON.stringify({ cle: cleFiche, termine }) });
          if (termine) etat.fiches[cleFiche] = { termine_le: r.termine_le }; else delete etat.fiches[cleFiche];
          vueLecon(mid, ref, actif);
          if (termine) signaler('Bravo, fiche terminée.', 'succes');
        } catch (e) { signaler(e.message); }
      });

      document.getElementById('btn-question').addEventListener('click', () => {
        location.hash = '#/messages/' + encodeURIComponent(m.nom + ' · ' + l.ref + ' ' + l.titre);
      });
    });
  }

  function brancherRail(plan) {
    if (!plan.length || !('IntersectionObserver' in window)) return;
    const liens = {};
    document.querySelectorAll('.rail-bloc a[data-ancre]').forEach((a) => { liens[a.getAttribute('data-ancre')] = a; });
    observateur = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (!e.isIntersecting) return;
        Object.keys(liens).forEach((k) => liens[k].classList.remove('actif'));
        if (liens[e.target.id]) liens[e.target.id].classList.add('actif');
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    plan.forEach((s) => { const el = document.getElementById(s.id); if (el) observateur.observe(el); });
  }

  function vueDossier(mid) {
    const m = matiere(mid);
    if (!m) return vueIntrouvable();
    afficher('<p class="vide">Assemblage du dossier…</p>',
      [{ texte: m.nom, href: '#/matiere/' + m.id }, { texte: 'Dossier complet' }]);
    chargerContenu(mid).then((contenu) => {
      const lecons = m.lecons.filter((l) => contenu && contenu[l.ref]);
      if (!lecons.length) return afficher('<p class="vide">Aucune leçon rédigée dans cette matière.</p>');
      const sommaire = lecons.map((l) =>
        `<li><a href="#doc-${l.ref}"><span class="puce-ref">${ech(l.ref)}</span> ${ech(l.titre)}</a></li>`).join('');
      const corps = lecons.map((l) => TYPES_DOC.filter((t) => contenu[l.ref][t.id]).map((t, i) => {
        const d = contenu[l.ref][t.id];
        return `<section class="dossier-doc"${i === 0 ? ` id="doc-${l.ref}"` : ''}>
          <p class="dossier-fil"><span class="puce-ref">${ech(l.ref)}</span> ${ech(l.titre)}</p>
          <h2>${ech(d.titre)}</h2><p><span class="etiquette-doc">${t.picto} ${t.libelle}</span></p>
          <article class="fiche-rendue">${d.html}</article></section>`;
      }).join('')).join('');
      document.getElementById('vue').innerHTML =
        `<div style="--m:var(--c-${mid})">
          <h1>${m.icone} ${ech(m.nom)} : dossier complet</h1>
          <p class="intro">Toutes les leçons rédigées, à la suite. Rien à ouvrir, rien à télécharger.</p>
          <p class="barre-actions">
            <a class="bouton bouton-doux" href="${dossierPdf(mid)}" download>⬇️ Télécharger en PDF</a>
            <a class="bouton bouton-neutre" href="#/matiere/${mid}">← Retour</a></p>
          <h2 class="titre-section">Leçons contenues</h2>
          <ul class="sommaire-dossier-site">${sommaire}</ul>${corps}</div>`;
      construireLateral();
      window.scrollTo(0, 0);
    });
  }

  /* ---------- Exercices ---------------------------------------------------------------------- */
  let session = null;
  function vueExos(mid, ref) {
    const m = matiere(mid);
    const l = lecon(m, ref);
    const b = banque(mid, ref);
    if (!m || !l || !b) return vueIntrouvable();
    session = { mid, ref, items: b.items, index: 0, reponses: [], termine: false };
    rendreExo();
  }
  function rendreExo() {
    const s = session;
    const m = matiere(s.mid);
    const l = lecon(m, s.ref);
    if (s.termine) return rendreBilan();
    const item = s.items[s.index];
    const corps = (item.type === 'qcm' || item.type === 'vraifaux')
      ? `<ul class="exo-choix">${(item.type === 'vraifaux' ? ['Vrai', 'Faux'] : item.choix)
        .map((c, i) => `<li><button type="button" data-choix="${i}">${c}</button></li>`).join('')}</ul>`
      : `<form class="exo-saisie" id="form-saisie">
          <input id="saisie" type="text" autocomplete="off" placeholder="ta réponse" aria-label="Ta réponse">
          <button class="bouton" type="submit">Vérifier</button></form>`;

    afficher(
      `<div style="--m:var(--c-${s.mid})">
        <h1>🎯 ${ech(l.titre)}</h1>
        <p class="intro">Tu peux te tromper : chaque réponse est expliquée.</p>
        ${barreProgression()}
        <div class="exo-carte">
          <p class="exo-compteur">Question ${s.index + 1} sur ${s.items.length}</p>
          <p class="exo-question">${item.q}</p>${corps}<div id="zone-retour"></div>
        </div></div>`,
      [{ texte: m.nom, href: '#/matiere/' + m.id }, { texte: 'Entraînement' }]);

    document.querySelectorAll('.exo-choix button').forEach((b) =>
      b.addEventListener('click', (ev) => repondre(parseInt(ev.currentTarget.getAttribute('data-choix'), 10))));
    const f = document.getElementById('form-saisie');
    if (f) {
      f.addEventListener('submit', (ev) => { ev.preventDefault(); repondre(document.getElementById('saisie').value); });
      document.getElementById('saisie').focus();
    }
  }
  function barreProgression() {
    const s = session;
    return `<div class="exo-barre" aria-hidden="true">${s.items.map((_, i) => {
      let c = '';
      if (s.reponses[i] === true) c = 'ok'; else if (s.reponses[i] === false) c = 'ko'; else if (i === s.index) c = 'en-cours';
      return `<i class="${c}"></i>`;
    }).join('')}</div>`;
  }
  const normaliser = (v) => String(v).toLowerCase().trim().replace(/,/g, '.').replace(/\s+/g, ' ').replace(/[.;!?]+$/, '');
  function repondre(valeur) {
    const s = session;
    const item = s.items[s.index];
    let juste;
    if (item.type === 'qcm') juste = valeur === item.reponse;
    else if (item.type === 'vraifaux') juste = (valeur === 0) === (item.reponse === true);
    else juste = item.reponses.some((r) => normaliser(r) === normaliser(valeur));
    s.reponses[s.index] = juste;

    const bon = item.type === 'vraifaux' ? (item.reponse === true ? 0 : 1) : item.reponse;
    document.querySelectorAll('.exo-choix button').forEach((b) => {
      b.disabled = true;
      const i = parseInt(b.getAttribute('data-choix'), 10);
      if (i === bon) b.classList.add('juste'); else if (i === valeur) b.classList.add('faux');
    });
    const f = document.getElementById('form-saisie');
    if (f) { f.querySelector('input').disabled = true; f.querySelector('button').disabled = true; }

    const dernier = s.index === s.items.length - 1;
    document.getElementById('zone-retour').innerHTML =
      `<div class="exo-retour ${juste ? 'ok' : 'ko'}">
        <strong>${juste ? '✅ C\'est juste' : '🔁 Pas encore'}</strong>
        ${juste ? '' : `<p>La bonne réponse : <strong>${bonneReponse(item)}</strong></p>`}
        <p>${item.explication}</p></div>
      <button class="bouton" id="btn-suivant" type="button">${dernier ? 'Voir mon résultat' : 'Question suivante'}</button>`;
    document.getElementById('btn-suivant').addEventListener('click', () => {
      if (dernier) { s.termine = true; enregistrer(); } else { s.index += 1; }
      rendreExo();
    });
    document.getElementById('btn-suivant').focus();
  }
  function bonneReponse(item) {
    if (item.type === 'qcm') return item.choix[item.reponse];
    if (item.type === 'vraifaux') return item.reponse ? 'Vrai' : 'Faux';
    return ech(item.reponses[0]);
  }
  async function enregistrer() {
    const s = session;
    const justes = s.reponses.filter(Boolean).length;
    try {
      const ligne = await api('/resultats', {
        method: 'PUT', body: JSON.stringify({ matiere: s.mid, ref: s.ref, justes, total: s.items.length }),
      });
      etat.resultats[cle(s.mid, s.ref)] = ligne;
    } catch (e) { signaler('Résultat non enregistré : ' + e.message); }
  }
  function rendreBilan() {
    const s = session;
    const m = matiere(s.mid);
    const l = lecon(m, s.ref);
    const justes = s.reponses.filter(Boolean).length;
    const pct = Math.round((justes / s.items.length) * 100);
    let message;
    if (pct === 100) message = 'Tout juste. Cette notion est solide.';
    else if (pct >= 75) message = 'Très bon résultat. Reprends seulement les questions ratées.';
    else if (pct >= 50) message = 'La base est là. Relis la fiche de révision, puis refais la série.';
    else message = 'Reprends la fiche de cours avant de refaire la série. Ce n\'est pas un problème d\'entraînement, c\'est une notion à revoir.';
    const ratees = s.items.filter((_, i) => s.reponses[i] === false);

    afficher(
      `<div style="--m:var(--c-${s.mid})">
        <h1>${pct === 100 ? '🏆' : '📊'} ${justes} sur ${s.items.length}</h1>
        <p class="intro">${ech(l.titre)}</p>
        <div class="carte"><p style="margin:0">${ech(message)}</p></div>
        ${ratees.length ? `<h2 class="titre-section">À revoir</h2><ul class="liste-nue">${
        ratees.map((r) => `<li class="carte" style="padding:0.45rem 0.7rem">${r.q}</li>`).join('')}</ul>` : ''}
        <p class="barre-actions">
          <button class="bouton" id="btn-refaire" type="button">↺ Refaire</button>
          ${(l.docs || []).indexOf('revision') !== -1 ? `<a class="bouton bouton-doux" href="#/lecon/${s.mid}/${s.ref}/revision">🧠 Fiche de révision</a>` : ''}
          <a class="bouton bouton-neutre" href="#/matiere/${s.mid}">← ${ech(m.nom)}</a></p></div>`,
      [{ texte: m.nom, href: '#/matiere/' + m.id }, { texte: 'Résultat' }]);
    document.getElementById('btn-refaire').addEventListener('click', () => vueExos(s.mid, s.ref));
  }

  /* ---------- Progrès ------------------------------------------------------------------------- */
  function periodeBouclee() {
    for (let p = 1; p <= 5; p += 1) {
      const lecons = [];
      PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => { if (l.periode === p) lecons.push({ m, l }); }));
      if (lecons.length && lecons.every((x) => estValidee(x.m.id, x.l.ref))) return true;
    }
    return false;
  }
  function vueProgres() {
    const c = chiffres();
    const cles = Object.keys(etat.resultats);
    const series = cles.reduce((n, k) => n + (etat.resultats[k].series || 1), 0);
    const parfaits = cles.filter((k) => etat.resultats[k].meilleur === etat.resultats[k].total).length;
    const fichesLues = Object.keys(etat.fiches).length;
    const badges = [
      { i: '🚀', n: 'Première leçon validée', ok: c.validees >= 1 },
      { i: '🎯', n: 'Une série sans faute', ok: parfaits >= 1 },
      { i: '📖', n: 'Cinq fiches terminées', ok: fichesLues >= 5 },
      { i: '🔟', n: 'Dix leçons validées', ok: c.validees >= 10 },
      { i: '📚', n: 'Une matière entière', ok: PROGRAMME.matieres.some((m) => progression(m).pct === 100) },
      { i: '🧭', n: 'Une période bouclée', ok: periodeBouclee() },
      { i: '🏅', n: 'La moitié de l\'année', ok: c.validees >= Math.ceil(c.total / 2) },
      { i: '👑', n: 'L\'année complète', ok: c.validees === c.total },
    ];
    afficher(
      `<h1>Mes progrès</h1>
       <p class="intro">Ce qui est validé reste validé.</p>
       <ul class="indicateurs">
         <li><strong>${c.validees}</strong><span>leçons validées</span></li>
         <li><strong>${fichesLues}</strong><span>fiches terminées</span></li>
         <li><strong>${series}</strong><span>séries d'exercices</span></li>
         <li><strong>${parfaits}</strong><span>séries sans faute</span></li>
       </ul>
       <h2 class="titre-section">Mes badges</h2>
       <ul class="badges">${badges.map((b) => `<li class="${b.ok ? 'obtenu' : ''}">
         <span class="b-icone" aria-hidden="true">${b.i}</span><span>${ech(b.n)}</span></li>`).join('')}</ul>
       <h2 class="titre-section">Matière par matière</h2>${grilleMatieres()}`,
      [{ texte: 'Mes progrès' }]);
  }

  /* ---------- Suivi (professeur) ---------------------------------------------------------------- */
  function vueSuivi() {
    if (!estProf()) return vueAccueil();
    const lignes = PROGRAMME.matieres.map((m) => {
      const entete = `<tr class="ligne-matiere"><th colspan="6">${m.icone} ${ech(m.nom)}</th></tr>`;
      return entete + m.lecons.map((l) => {
        const k = cle(m.id, l.ref);
        const e = etat.suivi[k] || {};
        const r = etat.resultats[k];
        const pret = l.docs && l.docs.length === 4;
        return `<tr>
          <td>${ech(l.ref)}</td>
          <td>${(l.docs || []).length ? `<a href="#/lecon/${m.id}/${l.ref}/cours">${ech(l.titre)}</a>` : ech(l.titre)}</td>
          <td>P${l.periode}</td>
          <td>${pret ? '✅' : ((l.docs || []).length ? '◐' : '⏳')}</td>
          <td><select data-matiere="${m.id}" data-ref="${l.ref}"><option value="">non évaluée</option>
            ${NIVEAUX.map((n) => `<option value="${n.id}"${e.niveau === n.id ? ' selected' : ''}>${n.picto} ${n.libelle}</option>`).join('')}
          </select></td>
          <td>${r ? `${r.meilleur}/${r.total} · ${r.series} série(s)` : ''}</td></tr>`;
      }).join('');
    }).join('');

    afficher(
      `<h1>Suivi des acquis</h1>
       <p class="intro">Ce que tu enregistres ici apparaît immédiatement dans l'espace de Sterenn.</p>
       <table class="tableau"><thead><tr>
         <th>Réf</th><th>Leçon</th><th>Pér.</th><th>Docs</th><th>Niveau atteint</th><th>Entraînement</th>
       </tr></thead><tbody>${lignes}</tbody></table>`,
      [{ texte: 'Suivi des acquis' }]);

    document.querySelectorAll('.tableau select').forEach((s) => s.addEventListener('change', async (ev) => {
      const c = ev.currentTarget;
      const mid = c.getAttribute('data-matiere');
      const ref = c.getAttribute('data-ref');
      try {
        await api('/suivi', { method: 'PUT', body: JSON.stringify({ matiere: mid, ref, niveau: c.value || null }) });
        if (c.value) etat.suivi[cle(mid, ref)] = { niveau: c.value }; else delete etat.suivi[cle(mid, ref)];
      } catch (e) { signaler(e.message); }
    }));
  }

  /* ---------- Messagerie -------------------------------------------------------------------------- */
  function vueMessages(contexte) {
    afficher(
      `<h1>Messages</h1>
       <p class="intro">${estProf() ? 'Tes échanges avec Sterenn.' : 'Pose ta question, Bastien la verra.'}</p>
       <div class="fil-messages" id="fil-messages"><p class="vide">Chargement…</p></div>
       <form class="zone-message" id="form-message">
         ${contexte ? `<p class="contexte-message">À propos de : <strong>${ech(contexte)}</strong>
           <button type="button" class="retirer-contexte" id="btn-retirer-contexte" aria-label="Retirer">✕</button></p>` : ''}
         <label class="visuellement-cache" for="texte-message">Message</label>
         <textarea id="texte-message" rows="3" maxlength="2000" placeholder="${estProf() ? 'Écrire à Sterenn…' : 'Écris ta question…'}"></textarea>
         <button class="bouton" type="submit">Envoyer</button>
       </form>`,
      [{ texte: 'Messages' }]);

    let ctx = contexte || null;
    const btn = document.getElementById('btn-retirer-contexte');
    if (btn) btn.addEventListener('click', () => { ctx = null; document.querySelector('.contexte-message').remove(); });

    async function charger() {
      try {
        const { messages } = await api('/messages');
        const zone = document.getElementById('fil-messages');
        if (!zone) return;
        zone.innerHTML = messages.length ? messages.map((m) => `<article class="message ${m.auteur === role ? 'moi' : 'autre'}">
          <p class="message-tete"><strong>${m.auteur === 'prof' ? 'Bastien' : 'Sterenn'}</strong>
            <span class="discret">${ech(dateCourte(m.cree_le))}</span></p>
          ${m.contexte ? `<p class="message-contexte">${ech(m.contexte)}</p>` : ''}
          <p class="message-texte">${ech(m.texte)}</p></article>`).join('')
          : '<p class="vide">Aucun message pour le moment.</p>';
        zone.scrollTop = zone.scrollHeight;
        await api('/messages', { method: 'PATCH' });
        etat.messagesNonLus = 0;
        construireLateral();
      } catch (e) { signaler(e.message); }
    }
    charger();

    document.getElementById('form-message').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const champ = document.getElementById('texte-message');
      const texte = champ.value.trim();
      if (!texte) return;
      try {
        await api('/messages', { method: 'POST', body: JSON.stringify({ texte, contexte: ctx }) });
        champ.value = '';
        await charger();
      } catch (e) { signaler(e.message); }
    });
  }

  /* ---------- Fichiers ------------------------------------------------------------------------------ */
  function vueFichiers() {
    const eleve = !estProf();
    afficher(
      `<h1>${eleve ? 'Mon travail' : 'Dépôts'}</h1>
       <p class="intro">${eleve ? 'Envoie une photo de ton travail, ou récupère un document de Bastien.'
        : 'Ce que Sterenn a déposé, et ce que tu lui as transmis.'}</p>
       <form class="depot" id="form-depot">
         <label for="fichier">${eleve ? 'Choisir une photo ou un document' : 'Déposer un document'}</label>
         <input type="file" id="fichier" name="fichier" required>
         <label for="note-fichier">Un mot pour dire ce que c'est</label>
         <input type="text" id="note-fichier" maxlength="300" placeholder="${eleve ? 'Exercice 21, fait à la main' : 'Énoncé du devoir de maths'}">
         <button class="bouton" type="submit" id="btn-envoi">Envoyer</button>
         <p class="discret">Images, PDF, documents texte. 15 Mo maximum.</p>
       </form>
       <h2 class="titre-section">Fichiers échangés</h2>
       <div id="liste-fichiers"><p class="vide">Chargement…</p></div>`,
      [{ texte: eleve ? 'Mon travail' : 'Dépôts' }]);

    async function charger() {
      try {
        const { fichiers, stockage } = await api('/fichiers');
        const zone = document.getElementById('liste-fichiers');
        if (!zone) return;
        if (!stockage) {
          zone.innerHTML = '<p class="vide">Le stockage de fichiers n\'est pas activé sur le compte.</p>';
          document.getElementById('form-depot').hidden = true;
          return;
        }
        zone.innerHTML = fichiers.length ? `<ul class="liste-fichiers">${fichiers.map((f) => `<li>
          <span class="fichier-ico" aria-hidden="true">${f.type.startsWith('image/') ? '🖼️' : (f.type === 'application/pdf' ? '📕' : '📄')}</span>
          <span class="fichier-corps"><a href="/api/fichiers/${f.id}">${ech(f.nom)}</a>
            ${f.note ? `<span class="discret">${ech(f.note)}</span>` : ''}
            <span class="discret"><span class="pastille-auteur">${f.auteur === 'prof' ? 'Bastien' : 'Sterenn'}</span>
              ${ech(dateCourte(f.cree_le))} · ${poids(f.taille)}</span></span>
          ${(estProf() || f.auteur === role) ? `<button class="bouton-secondaire" data-supprimer="${f.id}" type="button">Supprimer</button>` : ''}
        </li>`).join('')}</ul>` : '<p class="vide">Aucun fichier pour le moment.</p>';

        zone.querySelectorAll('[data-supprimer]').forEach((b) => b.addEventListener('click', async () => {
          if (!confirm('Supprimer ce fichier définitivement ?')) return;
          try { await api('/fichiers/' + b.getAttribute('data-supprimer'), { method: 'DELETE' }); charger(); }
          catch (e) { signaler(e.message); }
        }));
      } catch (e) { signaler(e.message); }
    }
    charger();

    document.getElementById('form-depot').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const champ = document.getElementById('fichier');
      const bouton = document.getElementById('btn-envoi');
      if (!champ.files || !champ.files[0]) return;
      const d = new FormData();
      d.append('fichier', champ.files[0]);
      d.append('note', document.getElementById('note-fichier').value);
      bouton.disabled = true; bouton.textContent = 'Envoi…';
      try {
        await api('/fichiers', { method: 'POST', body: d });
        champ.value = ''; document.getElementById('note-fichier').value = '';
        signaler('Fichier envoyé.', 'succes');
        charger();
      } catch (e) { signaler(e.message); }
      finally { bouton.disabled = false; bouton.textContent = 'Envoyer'; }
    });
  }

  /* ---------- Ressources (professeur) ------------------------------------------------------------------ */
  function vueProgramme() {
    if (!estProf()) return vueAccueil();
    afficher(
      `<h1>Programme officiel de 4ᵉ</h1>
       <p class="intro">Référence : thèmes et attendus de fin d'année, matière par matière.</p>
       ${PROGRAMME.matieres.map((m) => `<div class="carte" style="margin-bottom:0.65rem">
         <p class="carte-titre">${m.icone} <a href="#/matiere/${m.id}">${ech(m.nom)}</a>
           <span class="compte">${ech(m.horaire)} · ${m.lecons.length} leçons</span></p>
         <p class="discret" style="margin:0 0 0.3rem"><strong>Thèmes :</strong> ${m.themes.map(ech).join(' · ')}</p>
         <p style="margin:0 0 0.2rem"><strong>Attendus de fin d'année</strong></p>
         <ul style="margin:0">${m.attendus.map((a) => `<li>${ech(a)}</li>`).join('')}</ul>
         <p class="discret" style="margin:0.4rem 0 0"><strong>Compétences :</strong> ${m.competences.map(ech).join(' · ')}</p>
       </div>`).join('')}`,
      [{ texte: 'Programme officiel' }]);
  }

  function vueDocuments() {
    if (!estProf()) return vueAccueil();
    const docs = [
      ['00-pilotage/synthese-programme-4e.html', 'Synthèse du programme', 'Panorama des 8 matières, socle, plan des leçons.'],
      ['00-pilotage/cadre-pedagogique.html', 'Cadre pédagogique', 'Rythme, déroulé de séance, écran et écriture, validation.'],
      ['00-pilotage/progression-annuelle.html', 'Progression annuelle', 'Répartition sur les 5 périodes.'],
      ['00-pilotage/journal-seances/modele-seance.html', 'Modèle de fiche de séance', 'Gabarit papier.'],
      ['outils/methode-analyser-document.html', 'Analyser un document', 'La grille en 5 questions.'],
      ['outils/methode-developpement-construit.html', 'Développement construit', 'Plan type et connecteurs.'],
      ['outils/methode-probleme-maths.html', 'Résoudre un problème', 'Les 6 étapes.'],
      ['outils/cartes-revision.html', 'Cartes de révision', 'Méthode des trois paquets.'],
      ['outils/planificateur-seance.html', 'Planificateur de séance', 'Trame minutée.'],
      ['outils/suivi-acquis.html', 'Suivi papier', 'Tableau à imprimer.'],
    ];
    afficher(
      `<h1>Documents</h1>
       <p class="intro">Les documents de pilotage et les outils transversaux, à lire ou à imprimer.</p>
       <ul class="liste-nue">${docs.map(([u, t, d]) => `<li class="carte">
         <p class="carte-titre" style="margin-bottom:0.2rem"><a href="${u}" target="_blank" rel="noopener">${ech(t)}</a></p>
         <p class="discret" style="margin:0">${ech(d)}</p></li>`).join('')}</ul>`,
      [{ texte: 'Documents' }]);
  }

  function vueRecherche(q) {
    const terme = (q || '').toLowerCase();
    const trouves = [];
    PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => {
      if ((l.ref + ' ' + l.titre + ' ' + l.notions.join(' ')).toLowerCase().indexOf(terme) !== -1) trouves.push({ m, l });
    }));
    afficher(`<h1>Recherche</h1><p class="intro">${trouves.length} résultat(s) pour « ${ech(q)} ».</p>`
      + (trouves.length ? `<ul class="liste-lecons">${trouves.map(({ m, l }) => ligneLecon(m, l, true)).join('')}</ul>`
        : '<p class="vide">Aucune leçon ne correspond.</p>'),
    [{ texte: 'Recherche' }]);
  }

  function vueIntrouvable() {
    afficher('<h1>Page introuvable</h1><p class="vide">Ce lien ne correspond à rien.<br><a class="bouton bouton-doux" href="#/accueil">Revenir</a></p>',
      [{ texte: 'Introuvable' }]);
  }

  const vueAccueil = () => (estProf() ? vueProfAujourdhui() : vueEleveAujourdhui());

  /* ---------- Routeur ------------------------------------------------------------------------------------ */
  function router() {
    if (!role) return;
    const p = (location.hash || '#/accueil').replace(/^#\/?/, '').split('/');
    switch (p[0]) {
      case '': case 'accueil': return vueAccueil();
      case 'calendrier': return vueCalendrier(p[1]);
      case 'planning': return estProf() ? vuePlanning(p[1]) : vueCalendrier(p[1]);
      case 'matieres': return vueMatieres();
      case 'matiere': return vueMatiere(p[1]);
      case 'lecon': return vueLecon(p[1], p[2], p[3]);
      case 'dossier': return vueDossier(p[1]);
      case 'exos': return vueExos(p[1], p[2]);
      case 'progres': return estProf() ? vueSuivi() : vueProgres();
      case 'suivi': return vueSuivi();
      case 'messages': return vueMessages(p[1] ? decodeURIComponent(p.slice(1).join('/')) : null);
      case 'depots': case 'travail': return vueFichiers();
      case 'programme': return vueProgramme();
      case 'documents': return vueDocuments();
      case 'recherche': return vueRecherche(decodeURIComponent(p.slice(1).join('/')));
      default: return vueIntrouvable();
    }
  }
  window.addEventListener('hashchange', router);

  /* ---------- Démarrage ------------------------------------------------------------------------------------- */
  (async function demarrer() {
    try {
      const moi = await fetch('/api/moi', { credentials: 'same-origin' });
      const d = moi.ok ? await moi.json() : {};
      if (d.role) { await ouvrirApp(d.role); return; }
    } catch (e) { /* hors ligne */ }
    ouvrirPortail();
  })();
})();
