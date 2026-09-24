/* =========================================================================
   vue-prof.js : le back-office.

   Une barre latérale, un fil d'Ariane, des tableaux. On y pilote une année :
   ce qui est prévu, ce qui a été fait, ce qui a été déposé, où en est chaque
   leçon sur l'échelle des quatre niveaux. Le programme officiel et les fiches
   y sont des ressources que l'on consulte, pas le coeur de l'outil.
   ========================================================================= */
(function () {
  'use strict';
  const N = window.NOYAU;
  const vue = () => document.getElementById('vue-prof');

  const JOURS_MS = 86400000;
  const REPRISE_JOURS = 21;

  let sante = null;         // état des ressources Cloudflare, lu une fois
  let brancheChrome = false; // barre latérale et recherche : branchées une fois

  const GROUPES = [
    {
      titre: 'Pilotage',
      items: [
        { route: 'accueil', ico: 'ic-accueil', texte: 'Aujourd\'hui' },
        { route: 'mois', ico: 'ic-calendrier', texte: 'Planning' },
        { route: 'suivi', ico: 'ic-graphique', texte: 'Suivi des acquis' },
        { route: 'socle', ico: 'ic-cible', texte: 'Socle par domaine' },
        { route: 'periodes', ico: 'ic-livre', texte: 'Vue par période' },
        { route: 'acces', ico: 'ic-verrou', texte: 'Accès et déblocages' },
        { route: 'sterenn', ico: 'ic-etoile', texte: 'Sterenn' },
      ],
    },
    {
      titre: 'Échanges',
      items: [
        { route: 'messages', ico: 'ic-message', texte: 'Messages' },
        { route: 'depots', ico: 'ic-boite', texte: 'Dépôts' },
      ],
    },
    {
      titre: 'Ressources',
      items: [
        { route: 'matieres', ico: 'ic-planete', texte: 'Matières' },
        { route: 'programme', ico: 'ic-livre', texte: 'Programme officiel' },
        { route: 'jeux', ico: 'ic-etincelle', texte: 'Jeux et mondes' },
        { route: 'documents', ico: 'ic-telecharger', texte: 'Dossiers PDF' },
      ],
    },
    {
      titre: 'Outils',
      items: [
        { route: 'planning', ico: 'ic-etincelle', texte: 'Générateur d\'année' },
        { route: 'reglages', ico: 'ic-reglage', texte: 'Réglages' },
        { route: 'journal', ico: 'ic-loupe', texte: 'Journal et santé' },
        { route: 'aide', ico: 'ic-livre', texte: 'Aide' },
      ],
    },
  ];

  const PARENT = {
    matiere: 'matieres', lecon: 'matieres', exos: 'matieres',
    seance: 'mois', calendrier: 'mois', recherche: 'matieres',
  };

  /* ---------- Chrome : barre latérale, fil d'Ariane, recherche ------------- */
  function nav() {
    const brut = (location.hash || '#/accueil').replace(/^#\/?/, '').split('/')[0] || 'accueil';
    const courant = PARENT[brut] || brut;
    const c = N.chiffres();
    const compteurs = {
      suivi: `${c.validees}/${c.total}`,
      matieres: String(PROGRAMME.matieres.length),
      mois: String(N.etat.seances.length),
    };

    document.getElementById('p-nav').innerHTML = GROUPES.map((g) => `
      <section class="p-groupe">
        <h2>${N.ech(g.titre)}</h2>
        <ul>${g.items.map((i) => {
      const actif = i.route === courant ? ' class="actif"' : '';
      const alerte = i.route === 'messages' && N.etat.messagesNonLus
        ? `<span class="alerte">${N.etat.messagesNonLus}</span>` : '';
      const compte = !alerte && compteurs[i.route] ? `<span class="compte">${compteurs[i.route]}</span>` : '';
      return `<li><a href="#/${i.route}"${actif} data-libelle="${N.ech(i.texte)}">
        ${N.ic(i.ico, 'ico')}<span>${N.ech(i.texte)}</span>${alerte}${compte}</a></li>`;
    }).join('')}</ul>
      </section>`).join('');

    const relie = sante && sante.relie ? sante.relie : {};
    document.getElementById('p-lateral-pied').innerHTML = `
      <p class="ligne"><span>Sessions</span><b>${relie.kv ? 'reliées' : 'absentes'}</b></p>
      <p class="ligne"><span>Base de suivi</span><b>${relie.db ? 'reliée' : 'absente'}</b></p>
      <p class="ligne"><span>Fichiers</span><b>${relie.r2 ? 'reliés' : 'absents'}</b></p>`;
  }

  function fil(morceaux) {
    document.getElementById('p-fil').innerHTML = morceaux.map((m, i) => {
      const dernier = i === morceaux.length - 1;
      const texte = dernier ? `<b>${N.ech(m.t)}</b>` : (m.h ? `<a href="${m.h}">${N.ech(m.t)}</a>` : N.ech(m.t));
      return (i ? '<i aria-hidden="true">/</i>' : '') + texte;
    }).join('');
  }

  /** B46 : une suppression se confirme en tapant le mot, pas d'une boîte à un clic. */
  function confirmerParMot(mot, message) {
    return new Promise((resoudre) => {
      const el = document.createElement('div'); el.className = 'p-voile-modale';
      el.innerHTML = `<form class="p-modale" role="dialog" aria-modal="true" aria-labelledby="p-modale-titre">
        <h2 id="p-modale-titre">Confirmer</h2><p>${N.ech(message)}</p>
        <label for="p-modale-mot">Écris « ${N.ech(mot)} » pour confirmer</label><input id="p-modale-mot" type="text" autocomplete="off">
        <div class="p-seance-actions"><button class="p-bouton p-bouton-danger" type="submit" disabled>Confirmer</button><button class="p-bouton p-bouton-fantome" type="button" data-annuler>Annuler</button></div></form>`;
      document.body.appendChild(el);
      const liberer = N.piegerFocus(el, document.activeElement);
      const fermer = (v) => { liberer(); el.remove(); resoudre(v); };
      const champ = el.querySelector('input'); const ok = el.querySelector('[type=submit]');
      champ.addEventListener('input', () => { ok.disabled = champ.value.trim().toLowerCase() !== mot; });
      el.querySelector('form').addEventListener('submit', (ev) => { ev.preventDefault(); if (!ok.disabled) fermer(true); });
      el.querySelector('[data-annuler]').addEventListener('click', () => fermer(false));
      el.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') fermer(false); });
    });
  }
  /** B47 : un bandeau « Annuler » pendant dix secondes après une action réversible. */
  let annulerMinuteur = null;
  function annulable(message, revenir) {
    const zone = document.getElementById('p-bandeau'); if (!zone) return;
    clearTimeout(annulerMinuteur);
    zone.className = 'p-bandeau p-bandeau-succes p-bandeau-annulable';
    zone.innerHTML = `${N.ech(message)} <button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" id="p-annuler">Annuler</button>`;
    zone.hidden = false;
    document.getElementById('p-annuler').addEventListener('click', async () => {
      zone.hidden = true;
      try { await revenir(); N.signaler('Action annulée.', 'succes'); } catch (e) { N.signaler(e.message); }
    });
    annulerMinuteur = setTimeout(() => { zone.hidden = true; }, 10000);
  }
  /** B43 : sans fil d'Ariane fourni, on le déduit de la route et de son groupe. */
  function filDeRoute() {
    const p = (location.hash || '#/accueil').replace(/^#\/?/, '').split('/');
    const courant = PARENT[p[0]] || p[0];
    for (const g of GROUPES) { const i = g.items.find((x) => x.route === courant); if (i) return [{ t: g.titre }, { t: i.texte, h: '#/' + i.route }]; }
    return [{ t: 'Espace professeur' }];
  }
  // B40 : g puis a (accueil), p (planning), s (suivi), m (messages) ; « / » pour la recherche.
  let touchePrefixe = false;
  document.addEventListener('keydown', (ev) => {
    if (!N.estProf() || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const c = ev.target; if (c && (c.tagName === 'INPUT' || c.tagName === 'TEXTAREA' || c.tagName === 'SELECT' || c.isContentEditable)) return;
    if (ev.key === '/') { ev.preventDefault(); const q = document.getElementById('p-q'); if (q) q.focus(); return; }
    if (ev.key === 'g') { touchePrefixe = true; setTimeout(() => { touchePrefixe = false; }, 1200); return; }
    if (touchePrefixe) { const cible = { a: 'accueil', p: 'mois', s: 'suivi', m: 'messages', d: 'depots', r: 'reglages' }[ev.key]; if (cible) { ev.preventDefault(); location.hash = '#/' + cible; } touchePrefixe = false; }
  });

  function afficher(html, morceaux) {
    vue().innerHTML = html;
    etiqueterTableaux(vue());
    nav();
    fil(morceaux || filDeRoute());
    fermerLateral();
    window.scrollTo(0, 0);
    vue().focus();
  }

  /** Sous 40 rem, chaque tableau devient une pile de cartes : les cellules reçoivent le libellé de leur colonne. */
  function etiqueterTableaux(racine) {
    racine.querySelectorAll('table.p-table').forEach((t) => {
      if (t.classList.contains('p-acces')) return;
      const entetes = [...t.querySelectorAll('thead th')].map((th) => th.textContent.trim());
      if (!entetes.length) return;
      t.classList.add('p-cartes');
      t.querySelectorAll('tbody tr:not(.grp)').forEach((tr) => {
        [...tr.children].forEach((td, i) => { if (entetes[i] && td.textContent.trim()) td.setAttribute('data-etiquette', entetes[i]); });
      });
    });
  }

  const lateral = () => document.getElementById('p-lateral');
  const voile = () => document.getElementById('p-voile');
  function ouvrirLateral() { lateral().classList.add('ouverte'); voile().hidden = false; }
  function fermerLateral() { lateral().classList.remove('ouverte'); voile().hidden = true; }

  function brancherChromeUneFois() {
    if (brancheChrome) return;
    brancheChrome = true;
    document.getElementById('p-ouvrir').addEventListener('click', ouvrirLateral);
    document.getElementById('p-fermer').addEventListener('click', fermerLateral);
    voile().addEventListener('click', fermerLateral);
    document.getElementById('p-form-recherche').addEventListener('submit', (ev) => {
      ev.preventDefault();
      const q = document.getElementById('p-q').value.trim();
      location.hash = q ? '#/recherche/' + encodeURIComponent(q) : '#/matieres';
    });
    N.api('/moi').then((d) => { sante = d; nav(); }).catch(() => { /* diagnostic facultatif */ });
  }

  /* ---------- Petits fabricants d'HTML ------------------------------------- */
  const entete = (titre, sous, actions) => `
    <header class="p-entete">
      <div><h1>${N.ech(titre)}</h1>${sous ? `<p class="p-sous">${sous}</p>` : ''}</div>
      ${actions ? `<div class="p-actions">${actions}</div>` : ''}
    </header>`;

  const bloc = (titre, corps, compte, actions) => `
    <section class="p-bloc">
      <div class="p-bloc-tete"><h2>${N.ech(titre)}</h2>
        ${compte ? `<span class="p-compte">${N.ech(compte)}</span>` : ''}
        ${actions || ''}</div>
      <div class="p-bloc-corps">${corps}</div>
    </section>`;

  function etiquette(niveau) {
    const n = N.NIVEAUX.find((x) => x.id === niveau);
    return n
      ? `<span class="p-etat p-etat-${n.id}">${n.picto} ${N.ech(n.libelle)}</span>`
      : '<span class="p-etat p-etat-vide">non évaluée</span>';
  }

  /**
   * Niveau proposé par les faits, quand le professeur n'a rien décidé :
   * série à 90 % et trois fiches lues → très bien ; série à 70 % → satisfaisant ;
   * une série jouée ou une fiche lue → fragile. Le professeur confirme.
   */
  function niveauPropose(mid, ref) {
    if (N.niveauDe(mid, ref)) return null;
    const cle = N.cle(mid, ref);
    const res = N.etat.resultats[cle];
    const lues = N.TYPES_DOC.filter((t) => N.etat.fiches[cle + '/' + t.id]).length;
    const pct = res && res.total ? res.meilleur / res.total : 0;
    if (pct >= 0.9 && lues >= 3) return 'tresbien';
    if (pct >= 0.7) return 'satisfaisant';
    if (res || lues) return 'fragile';
    return null;
  }
  function boutonProposition(mid, ref) {
    const p = niveauPropose(mid, ref);
    if (!p) return '';
    const n = N.NIVEAUX.find((x) => x.id === p);
    return `<button type="button" class="p-bouton p-bouton-fantome p-bouton-mini p-proposition" data-valider="${mid}/${ref}" data-niveau="${p}" title="Proposé d'après les séries et les fiches lues : cliquer pour confirmer">proposé : ${N.ech(n ? n.libelle : p)} ✓</button>`;
  }
  function brancherPropositions(apres) {
    vue().querySelectorAll('[data-valider]').forEach((b) => b.addEventListener('click', async () => {
      const [matiere, ref] = b.getAttribute('data-valider').split('/');
      try {
        await N.api('/suivi', { method: 'PUT', body: JSON.stringify({ matiere, ref, niveau: b.getAttribute('data-niveau') }) });
        await N.rafraichirEtat(); N.signaler('Niveau confirmé.', 'succes'); apres();
      } catch (e) { N.signaler(e.message); }
    }));
  }

  function choixNiveau(mid, ref) {
    const actuel = N.niveauDe(mid, ref) || '';
    return `<select data-niveau data-mid="${mid}" data-ref="${ref}" aria-label="Niveau atteint">
      <option value=""${actuel ? '' : ' selected'}>non évaluée</option>
      ${N.NIVEAUX.map((n) => `<option value="${n.id}"${actuel === n.id ? ' selected' : ''}>${N.ech(n.libelle)}</option>`).join('')}
    </select>`;
  }

  /**
   * Trois états d'ouverture : automatique (la règle décide), poussée (Sterenn
   * y a accès tout de suite), retenue (elle attendra). C'est ce qui permet de
   * livrer les leçons au fil de l'apprentissage plutôt que d'un bloc.
   */
  function choixOuverture(mid, ref) {
    const d = N.decision(mid, ref);
    const auto = N.reglementaire(mid, ref);
    return `<span class="p-pousse" role="group" aria-label="Accès de Sterenn à cette leçon">
      <button type="button" class="auto" data-pousse="auto" data-mid="${mid}" data-ref="${ref}"
        aria-pressed="${d === null}" title="La règle décide : ${auto ? 'ouverte' : 'fermée'} aujourd'hui">auto</button>
      <button type="button" data-pousse="oui" data-mid="${mid}" data-ref="${ref}"
        aria-pressed="${d === 1}" title="Ouvrir maintenant">ouvrir</button>
      <button type="button" class="non" data-pousse="non" data-mid="${mid}" data-ref="${ref}"
        aria-pressed="${d === 0}" title="Retenir encore">retenir</button>
    </span>`;
  }

  function brancherOuvertures(apres) {
    vue().querySelectorAll('[data-pousse]').forEach((b) => b.addEventListener('click', async () => {
      const v = b.getAttribute('data-pousse');
      try {
        await N.api('/ouvertures', {
          method: 'PUT',
          body: JSON.stringify({
            matiere: b.getAttribute('data-mid'),
            ref: b.getAttribute('data-ref'),
            ouvert: v === 'auto' ? null : v === 'oui',
          }),
        });
        await N.rafraichirEtat();
        N.signaler(v === 'auto' ? 'Retour à la règle automatique.'
          : (v === 'oui' ? 'Leçon ouverte à Sterenn.' : 'Leçon retenue.'), 'succes');
        if (apres) apres();
      } catch (e) { N.signaler(e.message); }
    }));
  }

  function brancherNiveaux(apres) {
    vue().querySelectorAll('[data-niveau]').forEach((s) => s.addEventListener('change', async () => {
      const mid = s.getAttribute('data-mid');
      const ref = s.getAttribute('data-ref');
      const avant = N.niveauDe(mid, ref);
      try {
        await N.api('/suivi', {
          method: 'PUT',
          body: JSON.stringify({ matiere: mid, ref, niveau: s.value || null, raison: s.getAttribute('data-raison') || 'decision' }),
        });
        await N.rafraichirEtat();
        annulable('Niveau enregistré.', async () => { await N.api('/suivi', { method: 'PUT', body: JSON.stringify({ matiere: mid, ref, niveau: avant, raison: 'decision' }) }); await N.rafraichirEtat(); if (apres) apres(); });
        if (apres) apres();
      } catch (e) { N.signaler(e.message); }
    }));
  }

  /**
   * Les quatre documents d'une leçon, chacun cliquable quand il existe.
   * Un document absent reste affiché en creux, pour qu'on voie d'un coup d'oeil
   * ce qui manque sans avoir à compter.
   */
  function pastillesDocs(mid, l) {
    return N.TYPES_DOC.map((t) => {
      const present = (l.docs || []).indexOf(t.id) !== -1;
      if (!present) {
        return `<span class="p-doc absent" title="${N.ech(t.libelle)} : à rédiger"
          aria-label="${N.ech(t.libelle)} : à rédiger">${N.ic(t.ico)}</span>`;
      }
      return `<a class="p-doc" href="#/lecon/${mid}/${l.ref}/${t.id}"
        title="Ouvrir : ${N.ech(t.libelle)}" aria-label="Ouvrir ${N.ech(t.libelle)}">${N.ic(t.ico)}</a>`;
    }).join('');
  }

  /** Une barre de progression courte, avec sa valeur lisible à côté. */
  function jauge(faites, total, couleur) {
    const pct = total ? Math.round((faites / total) * 100) : 0;
    return `<span class="p-jauge" role="img" aria-label="${faites} sur ${total}, soit ${pct} pour cent">
      <span class="piste"><i style="width:${pct}%${couleur ? ';background:' + couleur : ''}"></i></span>
      <b>${faites}/${total}</b></span>`;
  }

  /** La couleur propre à une matière, reprise du jeu commun. */
  const teinte = (mid) => (N.DEGRADES[mid] || ['#5C6675'])[0];

  /** Une date en JJ/MM, pour les colonnes serrées d'un tableau. */
  const jourCourt = (iso) => (iso ? iso.slice(8, 10) + '/' + iso.slice(5, 7) : '');

  /** Coupe proprement, sur un espace, et pose des points de suspension. */
  function court(texte, max) {
    const t = String(texte || '');
    if (t.length <= max) return t;
    const coupe = t.slice(0, max);
    const espace = coupe.lastIndexOf(' ');
    return (espace > max * 0.6 ? coupe.slice(0, espace) : coupe).replace(/[\s,.;:·]+$/, '') + '…';
  }

  const seancesDu = (iso) => N.etat.seances.filter((s) => s.date === iso)
    .sort((a, b) => String(a.debut || '').localeCompare(String(b.debut || '')));

  function resumeMatieres(s) {
    const modules = (s.lecons || []).filter((r) => r.indexOf('module/') === 0).map((r) => {
      const info = N.libelleLecon(r);
      return info ? `${info.l.icone} ${N.ech(info.l.titre)}` : '';
    });
    return modules.concat((s.matieres || []).map((id) => {
      const m = N.matiere(id);
      return m ? `${m.icone} ${N.ech(m.nom)}` : '';
    })).filter(Boolean).join(' · ');
  }

  function carteSeance(s, options) {
    const o = options || {};
    const aujourd = N.jourIso();
    const lecons = (s.lecons || []).map((r) => {
      const info = N.libelleLecon(r);
      return info
        ? `<a class="p-jeton" href="#/lecon/${info.m.id}/${info.l.ref}">${info.m.icone} ${N.ech(info.l.titre)}</a>`
        : '';
    }).join('');
    const enAttente = (s.choix || []).length >= 2 && !s.choisi_le;
    return `<article class="p-seance ${N.ech(s.statut || 'prevue')}" data-carte="${s.id}">
      <div class="p-seance-tete">
        <span class="p-seance-date">${N.ech(N.enFrancais(s.date, true))}</span>
        <span class="p-seance-heure">${N.ech(s.debut || '')} à ${N.ech(s.fin || '')}</span>
        <span class="p-puce">${s.type === 'travail' ? 'travail personnel' : 'cours'}</span>
        ${s.date < aujourd && s.statut === 'prevue' ? '<span class="p-etat p-etat-fragile">à clore</span>' : ''}
        ${enAttente ? '<span class="p-etat p-etat-tresbien">choix ouvert</span>' : ''}
        <span class="p-seance-statut">${N.ech(s.statut || 'prevue')}</span>
      </div>
      <p class="p-seance-obj">${N.ech(s.objectif || 'Sans objectif noté')}</p>
      ${resumeMatieres(s) ? `<p class="p-sous" style="margin:.15rem 0 0;font-size:.76rem">${resumeMatieres(s)}</p>` : ''}
      ${lecons ? `<p class="p-seance-lecons">${lecons}</p>` : ''}
      ${s.travail ? `<p class="p-seance-travail">Travail personnel : ${N.ech(s.travail)}</p>` : ''}
      ${s.bilan ? `<p class="p-seance-travail">Bilan : ${N.ech(s.bilan)}</p>` : ''}
      ${o.sansActions ? '' : `<div class="p-seance-actions">
        ${s.statut !== 'faite' ? `<button class="p-bouton p-bouton-mini" data-statut="faite" data-id="${s.id}" type="button">Marquer faite</button>` : ''}
        ${s.statut !== 'reportee' ? `<button class="p-bouton p-bouton-fantome p-bouton-mini" data-statut="reportee" data-id="${s.id}" type="button">Reporter</button>` : ''}
        ${s.statut !== 'prevue' ? `<button class="p-bouton p-bouton-fantome p-bouton-mini" data-statut="prevue" data-id="${s.id}" type="button">Remettre en prévu</button>` : ''}
        <a class="p-bouton p-bouton-fantome p-bouton-mini" href="#/seance/${s.id}">Ouvrir</a>
      </div>`}
    </article>`;
  }

  /** La séance du jour, minutée : deux blocs, une pause, les fiches à ouvrir, le bilan en trois lignes. */
  function carteSeanceJour(s, aVenir) {
    const [h1, m1] = String(s.debut || '13:00').split(':').map(Number);
    const [h2, m2] = String(s.fin || '14:30').split(':').map(Number);
    const total = (h2 * 60 + m2) - (h1 * 60 + m1);
    const heure = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')} h ${String(min % 60).padStart(2, '0')}`;
    const debut = h1 * 60 + m1;
    const lecons = (s.lecons || []).map((r) => N.libelleLecon(r)).filter(Boolean);
    const blocs = lecons.length ? lecons : [null];
    const accueil = 5; const pause = lecons.length > 1 ? 5 : 0; const fin = 5;
    const parBloc = Math.max(10, Math.floor((total - accueil - pause - fin) / blocs.length));
    let t = debut;
    const lignes = [];
    lignes.push(`<li><b>${heure(t)}</b><span><strong>Accueil</strong> <em>${accueil} min</em><br>Le plan de la séance est annoncé, le travail personnel est relu.</span></li>`); t += accueil;
    blocs.forEach((info, k) => {
      const module = info && info.m.id === 'module';
      lignes.push(`<li><b>${heure(t)}</b><span><strong>${info ? N.ech(info.l.titre) : 'Bloc de travail'}</strong> <em>${parBloc} min</em>${info ? `<br>${module ? `<a class="p-jeton" href="${info.l.url}">${info.l.icone} ouvrir le module (côté Sterenn)</a>` : `<a class="p-jeton" href="#/lecon/${info.m.id}/${info.l.ref}/cours">${info.m.icone} cours</a> <a class="p-jeton" href="#/lecon/${info.m.id}/${info.l.ref}/exercices">exercices 1 à 4 sur écran</a>${N.banque(info.m.id, info.l.ref) ? ` <a class="p-jeton" href="#/exos/${info.m.id}/${info.l.ref}">série</a>` : ''}`}` : ''}</span></li>`);
      t += parBloc;
      if (k < blocs.length - 1 && pause) { lignes.push(`<li><b>${heure(t)}</b><span><strong>Pause</strong> <em>${pause} min</em></span></li>`); t += pause; }
    });
    lignes.push(`<li><b>${heure(t)}</b><span><strong>Ce qui est acquis, ce qui vient</strong> <em>${fin} min</em><br>On nomme l'acquis, on annonce le travail personnel.</span></li>`);
    return `<article class="p-seance p-seance-jour ${N.ech(s.statut || 'prevue')}" data-carte="${s.id}">
      <div class="p-seance-tete">
        <span class="p-seance-date">${aVenir ? 'Prochaine : ' : ''}${N.ech(N.enFrancais(s.date, true))}</span>
        <span class="p-seance-heure">${N.ech(s.debut)} à ${N.ech(s.fin)}</span>
        ${s.absence ? '<span class="p-etat p-etat-insuffisant">absente</span>' : ''}
        <span class="p-seance-statut">${N.ech(s.statut || 'prevue')}</span>
      </div>
      <p class="p-seance-obj">${N.ech(s.objectif || 'Sans objectif noté')}</p>
      <ol class="p-ordre-jour">${lignes.join('')}</ol>
      ${s.travail ? `<p class="p-seance-travail">Travail personnel annoncé : ${N.ech(s.travail)}</p>` : ''}
      ${aVenir ? `<div class="p-seance-actions"><a class="p-bouton p-bouton-fantome p-bouton-mini" href="#/seance/${s.id}">Préparer</a></div>` : `
      <form class="p-form p-bilan-rapide" data-bilan="${s.id}">
        <div class="ligne">
          <div><label for="b-acquis-${s.id}">Acquis nommé</label><input id="b-acquis-${s.id}" name="acquis" type="text" maxlength="200" placeholder="ce qu'elle sait faire maintenant"></div>
          <div><label for="b-reprendre-${s.id}">À reprendre</label><input id="b-reprendre-${s.id}" name="reprendre" type="text" maxlength="200" placeholder="ce qui reste fragile"></div>
          <div><label for="b-suite-${s.id}">Prochaine étape</label><input id="b-suite-${s.id}" name="suite" type="text" maxlength="200" placeholder="ce qu'on fait la prochaine fois"></div>
        </div>
        <div class="p-seance-actions">
          <button class="p-bouton p-bouton-mini" type="submit">${s.statut === 'faite' ? 'Mettre à jour le bilan' : 'Séance faite, bilan enregistré'}</button>
          <label class="p-case" style="margin:0"><input type="checkbox" name="message" checked> envoyer le bilan à Sterenn en message</label>
          <a class="p-bouton p-bouton-fantome p-bouton-mini" href="#/seance/${s.id}">Ouvrir</a>
        </div>
      </form>`}
    </article>`;
  }
  function brancherSeanceJour(apres) {
    vue().querySelectorAll('[data-bilan]').forEach((f) => f.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const id = f.getAttribute('data-bilan');
      const acquis = f.acquis.value.trim(); const reprendre = f.reprendre.value.trim(); const suite = f.suite.value.trim();
      const bilan = [acquis && 'Acquis : ' + acquis, reprendre && 'À reprendre : ' + reprendre, suite && 'Prochaine étape : ' + suite].filter(Boolean).join('\n');
      try {
        await N.api('/seances/' + id, { method: 'PATCH', body: JSON.stringify({ statut: 'faite', bilan: bilan || null }) });
        if (f.message.checked && bilan) {
          const texte = 'Bilan de la séance :\n' + bilan.split('\n').map((l) => '- ' + l).join('\n');
          await N.api('/messages', { method: 'POST', body: JSON.stringify({ texte, contexte: 'Bilan de séance' }) });
        }
        await N.rafraichirSeances(); N.signaler('Séance close, bilan enregistré.', 'succes'); apres();
      } catch (e) { N.signaler(e.message); }
    }));
  }
  /** Report : la séance passe « reportée », ses leçons s'ajoutent à la séance de cours suivante. */
  async function reporterSeance(id, apres) {
    const s = N.etat.seances.find((x) => x.id === id);
    if (!s) return;
    const suivante = N.etat.seances.filter((x) => x.type === 'cours' && x.date > s.date && x.statut === 'prevue').sort((a, b) => a.date.localeCompare(b.date))[0];
    if (!suivante) { N.signaler('Aucune séance suivante pour accueillir ses leçons.'); return; }
    try {
      const lecons = [...new Set([...(suivante.lecons || []), ...(s.lecons || [])])];
      const matieres = [...new Set(lecons.map((r) => r.split('/')[0]).filter((m) => m !== 'module'))];
      await N.api('/seances/' + id, { method: 'PATCH', body: JSON.stringify({ statut: 'reportee' }) });
      await N.api('/seances/' + suivante.id, { method: 'PATCH', body: JSON.stringify({ lecons, matieres, objectif: [suivante.objectif, s.objectif].filter(Boolean).join(' · ') }) });
      await N.rafraichirSeances(); N.signaler('Séance reportée : ses leçons sont ajoutées au ' + N.enFrancais(suivante.date) + '.', 'succes'); apres();
    } catch (e) { N.signaler(e.message); }
  }
  /** Le dernier message de Sterenn et un champ de réponse, sans changer de page. */
  async function reponseRapide() {
    const zone = document.getElementById('p-reponse-rapide');
    if (!zone) return;
    let messages = [];
    try { messages = (await N.api('/messages')).messages || []; } catch (e) { zone.innerHTML = '<p class="p-vide">Messages indisponibles.</p>'; return; }
    const dernier = [...messages].reverse().find((m) => m.auteur === 'eleve');
    zone.innerHTML = `${dernier ? `<div class="p-msg"><div class="p-msg-tete"><b>Sterenn</b><span>${N.ech(N.dateCourte(dernier.cree_le))}</span>${!dernier.lu_le ? '<span class="p-etat p-etat-fragile">nouveau</span>' : ''}</div>${dernier.contexte ? `<p class="p-msg-ctx">${N.ech(dernier.contexte)}</p>` : ''}<div class="p-msg-texte">${N.ech(dernier.texte)}</div></div>` : '<p class="p-vide">Pas encore de message de Sterenn.</p>'}
      <form class="p-form" id="p-form-rapide"><div><label for="r-texte">Ta réponse</label><textarea id="r-texte" rows="2" maxlength="2000" required></textarea></div>
      <div class="p-seance-actions"><button class="p-bouton p-bouton-mini" type="submit">Envoyer</button><a class="p-bouton p-bouton-fantome p-bouton-mini" href="#/messages">Toute la conversation</a></div></form>`;
    const formRapide = document.getElementById('p-form-rapide');
    if (!formRapide) return;
    formRapide.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const texte = document.getElementById('r-texte').value.trim();
      if (!texte) return;
      try {
        await N.api('/messages', { method: 'POST', body: JSON.stringify({ texte, contexte: dernier && dernier.contexte ? dernier.contexte : null, fil: dernier ? dernier.fil : null }) });
        if (dernier && !dernier.lu_le) await N.api('/messages', { method: 'PATCH' });
        await N.rafraichirEtat(); N.signaler('Réponse envoyée.', 'succes'); reponseRapide(); nav();
      } catch (e) { N.signaler(e.message); }
    });
  }

  function brancherStatuts(apres) {
    vue().querySelectorAll('[data-statut][data-id]').forEach((b) => b.addEventListener('click', async () => {
      try {
        await N.api('/seances/' + b.getAttribute('data-id'), {
          method: 'PATCH', body: JSON.stringify({ statut: b.getAttribute('data-statut') }),
        });
        await N.rafraichirSeances();
        N.signaler('Séance mise à jour.', 'succes');
        if (apres) apres();
      } catch (e) { N.signaler(e.message); }
    }));
  }

  /* =======================================================================
     Aujourd'hui
     ======================================================================= */
  function vueAccueil() {
    const aujourd = N.jourIso();
    const lundi = N.lundiDe(aujourd);
    const vendredi = N.decaler(lundi, 4);
    const c = N.chiffres();

    const duJour = seancesDu(aujourd);
    const semaine = N.etat.seances.filter((s) => s.date >= lundi && s.date <= vendredi);
    const faites = semaine.filter((s) => s.statut === 'faite').length;
    const aClore = N.etat.seances
      .filter((s) => s.date < aujourd && s.statut === 'prevue')
      .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
    const suivantes = N.etat.seances
      .filter((s) => s.date > aujourd)
      .sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
    const prochainCours = N.etat.seances
      .filter((s) => s.date > aujourd && s.type === 'cours' && s.statut === 'prevue')
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    const choixOuverts = N.etat.seances
      .filter((s) => (s.choix || []).length >= 2 && !s.choisi_le && s.date >= aujourd)
      .sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);

    const propositions = [];
    PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => { if (niveauPropose(m.id, l.ref)) propositions.push({ m, l }); }));
    const absences = N.etat.seances.filter((s) => s.absence && s.date >= aujourd).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
    const pos = N.profil('moi.positionnement', null);

    const aReprendre = [];
    PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => {
      const s = N.etat.suivi[N.cle(m.id, l.ref)];
      if (!s || ['insuffisant', 'fragile'].indexOf(s.niveau) === -1) return;
      const jours = s.maj_le ? Math.floor((Date.now() - new Date(s.maj_le).getTime()) / JOURS_MS) : 0;
      aReprendre.push({ m, l, s, jours });
    }));
    aReprendre.sort((a, b) => b.jours - a.jours);

    afficher(
      entete('Aujourd\'hui', N.ech(N.enFrancais(aujourd, true)) + ' · semaine du ' + N.ech(N.enFrancais(lundi)),
        `<a class="p-bouton p-bouton-fantome" href="#/mois">Voir le planning</a>
         <a class="p-bouton" href="#/suivi">Suivi des acquis</a>`)
      + `<ul class="p-kpis">
          <li class="pos"><span class="v">${c.validees}</span><span class="l">leçons validées sur ${c.total}</span></li>
          <li class="${c.fragiles ? 'att' : ''}"><span class="v">${c.fragiles}</span><span class="l">à reprendre</span></li>
          <li><span class="v">${c.pretes}</span><span class="l">leçons entièrement rédigées</span></li>
          <li><span class="v">${Object.keys(N.etat.resultats).filter((k) => k.indexOf('jeu/') === 0 && N.etat.resultats[k].meilleur >= 70).length}</span><span class="l">jeux gagnés par Sterenn</span></li>
          <li><span class="v">${faites}/${semaine.length}</span><span class="l">séances faites cette semaine</span></li>
          <li class="${aClore.length ? 'neg' : ''}"><span class="v">${aClore.length}</span><span class="l">séances à clore</span></li>
          <li class="${N.etat.messagesNonLus ? 'att' : ''}"><span class="v">${N.etat.messagesNonLus}</span><span class="l">messages non lus</span></li>
        </ul>`
      + (sante && sante.sante && (!sante.sante.sauvegarde || sante.sante.sauvegarde.age_heures > 48) ? `<p class="p-bandeau p-bandeau-erreur" style="border-radius:7px;margin-bottom:.8rem">${sante.sante.sauvegarde ? 'La dernière sauvegarde de la base date de ' + sante.sante.sauvegarde.age_heures + ' heures.' : 'Aucune sauvegarde de la base n\'a été trouvée.'} <a href="#/journal">Voir la santé</a> · <a href="#/reglages">Sauvegarder maintenant</a></p>` : '')
      + (absences.length ? `<div class="p-bandeau p-bandeau-erreur p-absences">${absences.map((s) => `<p>Sterenn a prévenu qu'elle sera <b>absente le ${N.ech(N.enFrancais(s.date, true))}</b>${s.commentaire_eleve ? ' : « ' + N.ech(s.commentaire_eleve) + ' »' : ''}.
          ${s.statut !== 'reportee' ? `<button type="button" class="p-bouton p-bouton-mini" data-reporter="${s.id}">Reporter ses leçons à la séance suivante</button>` : '<span class="p-etat p-etat-vide">reportée</span>'}</p>`).join('')}</div>` : '')
      + '<div class="p-grille2"><div>'
      + bloc('La séance du jour',
        (duJour.length
          ? duJour.map((s) => (s.type === 'cours' ? carteSeanceJour(s) : carteSeance(s))).join('')
          : `<p class="p-vide">Aucune séance aujourd'hui.
             ${suivantes.length ? 'Prochaine : ' + N.ech(N.enFrancais(suivantes[0].date, true)) + '.' : 'Le planning est vide.'}</p>`)
          + (!duJour.some((s) => s.type === 'cours') && prochainCours ? carteSeanceJour(prochainCours, true) : ''),
        duJour.length ? duJour.length + ' séance(s)' : '')
      + bloc('Répondre à Sterenn', `<div id="p-reponse-rapide"><p class="p-vide">Chargement…</p></div>`)
      + bloc('Séances passées restées ouvertes',
        aClore.length
          ? aClore.map((s) => carteSeance(s)).join('')
          : '<p class="p-vide">Tout est à jour.</p>',
        aClore.length ? String(aClore.length) : '')
      + '</div><div>'
      + bloc('Ce qui arrive',
        suivantes.length
          ? `<ul class="p-liste">${suivantes.map((s) => `<li>
              <span class="num">${N.ech(N.enFrancais(s.date))}</span>
              <a href="#/seance/${s.id}">${N.ech(s.objectif || (s.type === 'travail' ? 'Travail personnel' : 'Séance'))}</a>
              <span class="p-puce" style="margin-left:auto">${s.type === 'travail' ? 'perso' : 'cours'}</span></li>`).join('')}</ul>`
          : '<p class="p-vide">Aucune séance planifiée. Le générateur d\'année pose la base en une fois.</p>',
        '', suivantes.length ? '' : '<a class="p-bouton p-bouton-mini" href="#/planning" style="margin-left:auto">Générer</a>')
      + bloc('Choix laissés à Sterenn',
        choixOuverts.length
          ? `<ul class="p-liste p-choix-attente">${choixOuverts.map((s) => {
            const limite = N.decaler(s.date, -2);
            const retard = limite < aujourd;
            return `<li>
              <span class="num">${N.ech(N.enFrancais(s.date))}</span>
              <a href="#/seance/${s.id}">${(s.choix || []).length} leçons proposées</a>
              <span class="p-etat ${retard ? 'p-etat-insuffisant' : 'p-etat-vide'}" style="margin-left:auto">${retard ? 'date limite passée' : 'à choisir avant le ' + N.ech(N.enFrancais(limite))}</span>
              <button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" data-choisir="${s.id}">Choisir à sa place</button>
              <span class="p-choix-options" data-options="${s.id}" hidden>${(s.choix || []).map((r) => { const info = N.libelleLecon(r); return info ? `<button type="button" class="p-bouton p-bouton-mini" data-choix-seance="${s.id}" data-choix-lecon="${r}">${info.m.icone} ${N.ech(info.l.titre)}</button>` : ''; }).join('')}</span></li>`;
          }).join('')}</ul>`
          : '<p class="p-vide">Aucun choix en attente. Les séances au choix sont posées par le <a href="#/planning">générateur d\'année</a>.</p>')
      + bloc('Niveaux proposés par les faits',
        propositions.length
          ? `<ul class="p-liste">${propositions.slice(0, 8).map((x) => `<li><a href="#/lecon/${x.m.id}/${x.l.ref}">${x.m.icone} ${N.ech(x.l.titre)}</a>${boutonProposition(x.m.id, x.l.ref)}</li>`).join('')}</ul>
             <p class="p-aide">D'après les séries jouées et les fiches lues. Un clic confirme ; le suivi complet est dans « Suivi des acquis ».</p>`
          : '<p class="p-vide">Rien à confirmer pour l\'instant.</p>',
        propositions.length ? String(propositions.length) : '')
      + (pos && !pos.enCours ? bloc('Point de départ (« Où j\'en suis »)', `<ul class="p-liste">${PROGRAMME.matieres.map((m) => { const r = pos.matieres[m.id] || { justes: 0, total: 0 }; return `<li><span style="min-width:10rem">${m.icone} ${N.ech(m.nom)}</span><span class="p-jauge"><i style="width:${r.total ? Math.round((r.justes / r.total) * 100) : 0}%"></i></span><b>${r.justes}/${r.total}</b></li>`; }).join('')}</ul>`) : '')
      + bloc('À reprendre',
        aReprendre.length
          ? `<table class="p-table"><thead><tr><th>Leçon</th><th>Niveau</th><th>Depuis</th></tr></thead><tbody>
             ${aReprendre.slice(0, 10).map((x) => `<tr>
               <td><a href="#/lecon/${x.m.id}/${x.l.ref}">${x.m.icone} ${N.ech(x.l.titre)}</a></td>
               <td>${etiquette(x.s.niveau)}</td>
               <td class="num">${x.jours} j${x.jours >= REPRISE_JOURS ? ' ⚠' : ''}</td></tr>`).join('')}
             </tbody></table>`
          : '<p class="p-vide">Rien de fragile pour le moment.</p>',
        aReprendre.length ? String(aReprendre.length) : '')
      + '</div></div>',
      [{ t: 'Pilotage' }, { t: 'Aujourd\'hui' }],
    );
    brancherStatuts(vueAccueil);
    brancherPropositions(vueAccueil);
    brancherSeanceJour(vueAccueil);
    reponseRapide();
    vue().querySelectorAll('[data-reporter]').forEach((b) => b.addEventListener('click', () => reporterSeance(b.getAttribute('data-reporter'), vueAccueil)));
    vue().querySelectorAll('[data-choisir]').forEach((b) => b.addEventListener('click', () => { const o = vue().querySelector(`[data-options="${b.getAttribute('data-choisir')}"]`); o.hidden = !o.hidden; }));
    vue().querySelectorAll('[data-choix-seance]').forEach((b) => b.addEventListener('click', async () => {
      try {
        await N.api('/seances/' + b.getAttribute('data-choix-seance') + '/choix', { method: 'POST', body: JSON.stringify({ lecon: b.getAttribute('data-choix-lecon') }) });
        await N.rafraichirSeances(); N.signaler('Choix fait à sa place.', 'succes'); vueAccueil();
      } catch (e) { N.signaler(e.message); }
    }));
    
  }

  /* =======================================================================
     Planning : vue semaine
     ======================================================================= */
  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const ENTETES = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const moisDe = (iso) => iso.slice(0, 8) + '01';
  const nbJours = (iso) => {
    const d = new Date(iso + 'T12:00:00');
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  };

  /** Vue mois : la grille complète, six semaines au plus, tout le planning dessus. */
  function vueMois(iso) {
    const base = /^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? iso : N.jourIso();
    const premier = moisDe(base);
    const d = new Date(premier + 'T12:00:00');
    const total = nbJours(premier);
    const aujourd = N.jourIso();
    const debutGrille = N.lundiDe(premier);
    const dernier = premier.slice(0, 8) + String(total).padStart(2, '0');
    const finGrille = N.decaler(N.lundiDe(dernier), 6);
    const nb = Math.round((new Date(finGrille + 'T12:00:00') - new Date(debutGrille + 'T12:00:00')) / 86400000) + 1;

    const duMois = N.etat.seances.filter((x) => x.date >= premier && x.date <= dernier);
    const faites = duMois.filter((x) => x.statut === 'faite').length;
    const cours = duMois.filter((x) => x.type === 'cours').length;

    const cellules = [];
    for (let i = 0; i < nb; i += 1) {
      const jour = N.decaler(debutGrille, i);
      const dedans = jour >= premier && jour <= dernier;
      const liste = seancesDu(jour);
      const classes = ['p-m-jour'];
      if (!dedans) classes.push('hors');
      if (jour === aujourd) classes.push('auj');
      if (jour < aujourd) classes.push('passe');
      cellules.push(`<div class="${classes.join(' ')}" data-jour="${jour}">
        <div class="p-m-tete">
          <span class="p-m-num">${Number(jour.slice(8, 10))}</span>
          ${dedans ? `<button class="p-m-plus" type="button" data-nouvelle="${jour}"
            title="Ajouter une séance le ${N.ech(N.enFrancais(jour, true))}" aria-label="Ajouter une séance">+</button>` : ''}
        </div>
        ${liste.map((x) => `<a class="p-m-evt ${x.type === 'travail' ? 'travail' : ''} ${N.ech(x.statut || 'prevue')}" draggable="${x.statut === 'prevue' ? 'true' : 'false'}" data-glisse="${x.id}"
            href="#/seance/${x.id}" title="${N.ech(x.objectif || '')}${x.statut === 'prevue' ? ' (glisser pour déplacer)' : ''}">
          <span class="h">${N.ech(x.debut || '')}</span>
          <span class="t">${N.ech(court(x.objectif || (x.type === 'travail' ? 'Travail personnel' : 'Séance'), 46))}</span>
        </a>`).join('')}
      </div>`);
    }

    afficher(
      entete('Planning', `${MOIS[d.getMonth()]} ${d.getFullYear()} · ${duMois.length} séance(s), ${cours} cours, ${faites} faite(s)`,
        `<button class="p-bouton p-bouton-fantome" data-mois="${N.decaler(premier, -1)}" type="button">◀ Mois précédent</button>
         <button class="p-bouton p-bouton-fantome" data-mois="${N.jourIso()}" type="button">Ce mois-ci</button>
         <button class="p-bouton p-bouton-fantome" data-mois="${N.decaler(dernier, 1)}" type="button">Mois suivant ▶</button>
         <a class="p-bouton p-bouton-fantome" href="#/calendrier/${base}">Vue semaine</a>
         <button class="p-bouton p-bouton-fantome" id="p-ics" type="button" title="Fichier calendrier pour le téléphone">Exporter (.ics)</button>
         <a class="p-bouton" href="#/planning">Générer l'année</a>`)
      + `<div class="p-mois">
          <div class="p-m-entetes">${ENTETES.map((j) => `<span>${j}</span>`).join('')}</div>
          <div class="p-m-grille">${cellules.join('')}</div>
        </div>`,
      [{ t: 'Pilotage' }, { t: 'Planning', h: '#/planning-mois' }, { t: `${MOIS[d.getMonth()]} ${d.getFullYear()}` }],
    );

    vue().querySelectorAll('[data-mois]').forEach((b) => b.addEventListener('click',
      () => { location.hash = '#/mois/' + b.getAttribute('data-mois'); }));
    vue().querySelectorAll('[data-nouvelle]').forEach((b) => b.addEventListener('click',
      () => creerSeance(b.getAttribute('data-nouvelle'))));
    document.getElementById('p-ics').addEventListener('click', exporterIcs);
    // B18 : glisser une séance prévue sur un autre jour du mois.
    vue().querySelectorAll('[data-glisse][draggable="true"]').forEach((a) => a.addEventListener('dragstart', (ev) => { ev.dataTransfer.setData('text/plain', a.getAttribute('data-glisse')); ev.dataTransfer.effectAllowed = 'move'; a.classList.add('glisse'); }));
    vue().querySelectorAll('.p-m-jour[data-jour]:not(.hors)').forEach((cell) => {
      cell.addEventListener('dragover', (ev) => { ev.preventDefault(); cell.classList.add('cible'); });
      cell.addEventListener('dragleave', () => cell.classList.remove('cible'));
      cell.addEventListener('drop', async (ev) => {
        ev.preventDefault(); cell.classList.remove('cible');
        const id = ev.dataTransfer.getData('text/plain'); const jour = cell.getAttribute('data-jour');
        const s = N.etat.seances.find((x) => x.id === id);
        if (!s || !jour || s.date === jour) return;
        try {
          await N.api('/seances/' + id, { method: 'PATCH', body: JSON.stringify({ date: jour }) });
          await N.rafraichirSeances(); N.signaler('Séance déplacée au ' + N.enFrancais(jour) + '.', 'succes'); vueMois(jour);
        } catch (e) { N.signaler(e.message); }
      });
    });
  }
  /** B22 : le planning en fichier calendrier, importable sur un téléphone. */
  function exporterIcs() {
    const ech = (t) => String(t || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
    const dt = (date, heure) => date.replace(/-/g, '') + 'T' + String(heure || '13:00').replace(':', '') + '00';
    const lignes = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Opaline//Planning//FR', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Opaline'];
    N.etat.seances.filter((x) => x.statut !== 'annulee').forEach((x) => {
      const titre = (x.type === 'travail' ? 'Temps perso : ' : 'Séance : ') + (x.objectif || (x.lecons || []).map((r) => { const i = N.libelleLecon(r); return i ? i.l.titre : r; }).join(' · ') || 'Opaline');
      lignes.push('BEGIN:VEVENT', 'UID:' + x.id + '@opaline', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART;TZID=Europe/Paris:' + dt(x.date, x.debut), 'DTEND;TZID=Europe/Paris:' + dt(x.date, x.fin), 'SUMMARY:' + ech(titre), 'DESCRIPTION:' + ech((x.travail ? 'Travail : ' + x.travail : '') + (x.statut !== 'prevue' ? ' [' + x.statut + ']' : '')), 'END:VEVENT');
    });
    lignes.push('END:VCALENDAR');
    const blob = new Blob([lignes.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'opaline-planning.ics'; document.body.appendChild(a); a.click(); a.remove();
    N.signaler('Fichier calendrier téléchargé : ' + N.etat.seances.length + ' séances.', 'succes');
  }

  function vueCalendrier(iso) {
    const base = /^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? iso : N.jourIso();
    const lundi = N.lundiDe(base);
    const aujourd = N.jourIso();
    const jours = [0, 1, 2, 3, 4].map((i) => N.decaler(lundi, i));
    const semaine = N.etat.seances
      .filter((s) => s.date >= jours[0] && s.date <= jours[4])
      .sort((a, b) => a.date.localeCompare(b.date) || String(a.debut).localeCompare(String(b.debut)));

    const cellule = (d, i) => {
      const liste = seancesDu(d);
      return `<div class="p-cal-jour ${d === aujourd ? 'auj' : ''} ${d < aujourd ? 'passe' : ''}">
        <div class="p-cal-tete">
          <span class="p-cal-nom">${N.ech(N.JOURS[i])}</span>
          <span class="p-cal-num">${d.slice(8)}</span>
        </div>
        ${liste.map((s) => `<a class="p-evt ${s.type === 'travail' ? 'travail' : ''} ${s.statut === 'faite' ? 'faite' : ''}"
            href="#/seance/${s.id}" style="display:block;text-decoration:none;color:inherit">
          <span class="p-evt-h">${N.ech(s.debut || '')} à ${N.ech(s.fin || '')}${s.absence ? ' <b class="p-evt-abs">absente</b>' : ''}</span>
          <span class="p-evt-t">${N.ech(court(s.objectif || (s.type === 'travail' ? 'Travail personnel' : 'Séance'), 68))}</span>
          <span class="p-evt-m">${resumeMatieres(s) || (s.type === 'travail' ? 'perso' : 'cours')}</span>
        </a>`).join('')
        || '<p class="p-evt-m" style="opacity:.6">rien de prévu</p>'}
        <button class="p-bouton p-bouton-fantome p-bouton-mini" data-nouvelle="${d}" type="button"
          style="margin-top:.3rem">+ Séance</button>
      </div>`;
    };

    afficher(
      entete('Planning', 'Semaine du ' + N.ech(N.enFrancais(jours[0], true)) + ' au ' + N.ech(N.enFrancais(jours[4], true)),
        `<button class="p-bouton p-bouton-fantome" data-semaine="${N.decaler(lundi, -7)}" type="button">◀ Semaine précédente</button>
         <button class="p-bouton p-bouton-fantome" data-semaine="${N.lundiDe(aujourd)}" type="button">Cette semaine</button>
         <button class="p-bouton p-bouton-fantome" data-semaine="${N.decaler(lundi, 7)}" type="button">Semaine suivante ▶</button>
         <a class="p-bouton p-bouton-fantome" href="#/mois/${base}">Vue mois</a>
         <a class="p-bouton" href="#/planning">Générer l'année</a>`)
      + `<div class="p-cal">${jours.map(cellule).join('')}</div>`
      + bloc('Le détail de la semaine',
        semaine.length
          ? semaine.map((s) => carteSeance(s)).join('')
          : '<p class="p-vide">Aucune séance sur cette semaine. Le bouton « + » d\'un jour en crée une, le <a href="#/planning">générateur</a> pose l\'année.</p>',
        semaine.length ? semaine.length + ' séance(s)' : ''),
      [{ t: 'Pilotage' }, { t: 'Planning', h: '#/planning-mois' }, { t: 'Semaine du ' + N.enFrancais(jours[0]) }],
    );

    vue().querySelectorAll('[data-semaine]').forEach((b) => b.addEventListener('click',
      () => { location.hash = '#/calendrier/' + b.getAttribute('data-semaine'); }));
    vue().querySelectorAll('[data-nouvelle]').forEach((b) => b.addEventListener('click',
      () => creerSeance(b.getAttribute('data-nouvelle'))));
    brancherStatuts(() => vueCalendrier(base));
  }

  async function creerSeance(date) {
    const jour = new Date(date + 'T12:00:00').getDay();
    const creneau = jour === 1 || jour === 2 ? 'A' : (jour === 3 || jour === 4 ? 'B' : 'C');
    try {
      const s = await N.api('/seances', {
        method: 'POST',
        body: JSON.stringify({
          date, creneau, type: 'cours', debut: '13:00', fin: '14:30',
          objectif: 'Nouvelle séance', matieres: [], lecons: [],
        }),
      });
      await N.rafraichirSeances();
      location.hash = '#/seance/' + s.id;
    } catch (e) { N.signaler(e.message); }
  }

  /* =======================================================================
     Planning : une séance
     ======================================================================= */
  function optionsLecons(selection) {
    const choisies = new Set(selection || []);
    const planifiees = new Set();
    N.etat.seances.forEach((x) => (x.lecons || []).forEach((r) => planifiees.add(r)));
    return PROGRAMME.matieres.map((m) => `<optgroup label="${N.ech(m.icone + ' ' + m.nom)}">`
      + m.lecons.map((l) => {
        const v = m.id + '/' + l.ref;
        return `<option value="${v}"${choisies.has(v) ? ' selected' : ''} data-texte="${N.ech((l.ref + ' ' + l.titre + ' ' + (l.notions || []).join(' ')).toLowerCase())}">${l.ref} · ${N.ech(l.titre)}${planifiees.has(v) && !choisies.has(v) ? ' · déjà planifiée' : ''}</option>`;
      }).join('') + '</optgroup>').join('')
      + `<optgroup label="✨ Modules">${Object.values(N.MODULES).map((x) => {
        const v = 'module/' + x.ref;
        return `<option value="${v}"${choisies.has(v) ? ' selected' : ''}>${x.icone} ${N.ech(x.titre)}</option>`;
      }).join('')}</optgroup>`;
  }

  function vueSeance(id) {
    const s = N.etat.seances.find((x) => x.id === id);
    if (!s) return vueIntrouvable();
    const opt = (v, courant, libelle) => `<option value="${v}"${v === courant ? ' selected' : ''}>${N.ech(libelle)}</option>`;

    afficher(
      entete(N.enFrancais(s.date, true), 'Séance ' + N.ech(s.creneau) + ' · ' + (s.type === 'travail' ? 'travail personnel' : 'cours'),
        `<a class="p-bouton p-bouton-fantome" href="#/calendrier/${N.lundiDe(s.date)}">Retour au planning</a>
         <button class="p-bouton p-bouton-danger" id="p-supprimer" type="button">Supprimer</button>`)
      + '<div class="p-grille2"><div>'
      + bloc('Ce qui est prévu', `
        <form class="p-form" id="p-form-seance">
          <div class="ligne">
            <div><label for="f-date">Date</label><input id="f-date" type="date" value="${N.ech(s.date)}"></div>
            <div><label for="f-creneau">Créneau</label><select id="f-creneau">
              ${['A', 'B', 'C'].map((k) => opt(k, s.creneau, k + ' · ' + N.CRENEAUX[k])).join('')}</select></div>
            <div><label for="f-statut">Statut</label><select id="f-statut">
              ${opt('prevue', s.statut, 'Prévue')}${opt('faite', s.statut, 'Faite')}${opt('reportee', s.statut, 'Reportée')}</select></div>
          </div>
          <div class="ligne">
            <div><label for="f-debut">Début</label><input id="f-debut" type="time" value="${N.ech(s.debut || '13:00')}"></div>
            <div><label for="f-fin">Fin</label><input id="f-fin" type="time" value="${N.ech(s.fin || '14:30')}"></div>
            <div><label for="f-type">Type</label><select id="f-type">
              ${opt('cours', s.type, 'Cours')}${opt('travail', s.type, 'Travail personnel')}</select></div>
          </div>
          <div><label for="f-objectif">Objectif annoncé</label>
            <input id="f-objectif" type="text" maxlength="300" value="${N.ech(s.objectif || '')}"></div>
          <div><label for="f-lecons">Leçons travaillées</label>
            <input id="f-filtre" type="search" placeholder="Filtrer : un mot du titre, une notion, une référence" autocomplete="off" aria-controls="f-lecons">
            <select id="f-lecons" multiple size="12">${optionsLecons(s.lecons)}</select>
            <p class="p-aide">Plusieurs sélections possibles. Les matières se déduisent des leçons. Une leçon « déjà planifiée » est placée dans une autre séance.</p></div>
          <div><label for="f-visio">Lien de visio (facultatif)</label>
            <input id="f-visio" type="url" maxlength="300" placeholder="https://…" value="${N.ech(N.profil('visio.' + s.id, '') || '')}">
            <p class="p-aide">Affiché des deux côtés le jour de la séance, avec un bouton « rejoindre ».</p></div>
          <div><label for="f-travail">Travail personnel qui suit</label>
            <textarea id="f-travail" rows="2" maxlength="500">${N.ech(s.travail || '')}</textarea></div>
          <div><label for="f-bilan">Bilan de la séance</label>
            <textarea id="f-bilan" rows="3" maxlength="800">${N.ech(s.bilan || '')}</textarea>
            <p class="p-aide">Ce qui a été acquis, ce qui reste à reprendre. Trois lignes suffisent.</p></div>
          <label class="p-case"><input type="checkbox" id="f-meme-jour"> Appliquer cet horaire à toutes les séances de cours à venir du même jour de la semaine</label>
          <button class="p-bouton" type="submit">Enregistrer</button>
        </form>`)
      + '</div><div>'
      + (() => {
        if (s.type !== 'cours') return '';
        const prec = N.etat.seances.filter((x) => x.date < s.date && x.travail && x.statut !== 'annulee').sort((a, b) => b.date.localeCompare(a.date))[0];
        if (!prec) return '';
        const etat = N.profil('travail.' + prec.id, null);
        return bloc('Travail personnel annoncé la fois d\'avant', `<p class="p-rappel-travail">${N.ech(prec.travail)}</p>
          <p class="p-aide">Annoncé le ${N.ech(N.enFrancais(prec.date))}.${etat ? ' Noté : ' + (etat.fait ? 'fait' : 'pas fait, à reprendre') + '.' : ''}</p>
          <div class="p-seance-actions"><button type="button" class="p-bouton p-bouton-mini ${etat && etat.fait ? '' : 'p-bouton-fantome'}" data-travail-fait="${prec.id}" data-valeur="1">Fait</button>
          <button type="button" class="p-bouton p-bouton-mini ${etat && !etat.fait ? '' : 'p-bouton-fantome'}" data-travail-fait="${prec.id}" data-valeur="0">Pas fait, à reprendre</button></div>`);
      })()
      + (s.absence ? bloc('Absence déclarée par Sterenn', `<p class="p-bandeau p-bandeau-erreur" style="border-radius:7px;margin:0">Sterenn a prévenu qu'elle sera absente.${s.commentaire_eleve ? ' Son mot : « ' + N.ech(s.commentaire_eleve) + ' »' : ''}</p>`) : '')
      + bloc('Aperçu', carteSeance(s, { sansActions: true }))
      + ((s.choix || []).length
        ? bloc('Choix proposé à Sterenn',
          `<ul class="p-liste">${s.choix.map((r) => {
            const info = N.libelleLecon(r);
            const retenue = (s.lecons || []).indexOf(r) !== -1;
            return info ? `<li><a href="#/lecon/${info.m.id}/${info.l.ref}">${info.m.icone} ${N.ech(info.l.titre)}</a>
              ${retenue && s.choisi_le ? '<span class="p-etat p-etat-satisfaisant" style="margin-left:auto">choisie</span>' : ''}</li>` : '';
          }).join('')}</ul>
          <p class="p-aide">${s.choisi_le ? 'Choix fait le ' + N.ech(N.dateCourte(s.choisi_le)) + '.' : 'En attente de son choix.'}</p>`)
        : '')
      + bloc('Niveaux des leçons de la séance',
        (s.lecons || []).length
          ? `<table class="p-table"><tbody>${s.lecons.map((r) => {
            const info = N.libelleLecon(r);
            if (info && info.m.id === 'module') return `<tr><td>${info.l.icone} ${N.ech(info.l.titre)} <small class="p-faible">module, sans niveau</small></td><td></td></tr>`;
            return info ? `<tr><td><a href="#/lecon/${info.m.id}/${info.l.ref}">${N.ech(info.l.titre)}</a></td>
              <td style="width:11rem">${choixNiveau(info.m.id, info.l.ref)}</td></tr>` : '';
          }).join('')}</tbody></table>`
          : '<p class="p-vide">Aucune leçon rattachée : choisis-la dans « Leçons travaillées », à gauche, puis enregistre.</p>')
      + '</div></div>',
      [{ t: 'Pilotage' }, { t: 'Planning', h: '#/calendrier' }, { t: N.enFrancais(s.date) }],
    );

    brancherNiveaux(() => vueSeance(id));
    const filtre = document.getElementById('f-filtre');
    if (filtre) filtre.addEventListener('input', () => {
      const q = filtre.value.trim().toLowerCase();
      document.querySelectorAll('#f-lecons option').forEach((o) => { o.hidden = !!q && (o.getAttribute('data-texte') || '').indexOf(q) === -1 && !o.selected; });
    });
    vue().querySelectorAll('[data-travail-fait]').forEach((b) => b.addEventListener('click', async () => {
      const fait = b.getAttribute('data-valeur') === '1';
      try {
        await N.enregistrerProfil('travail.' + b.getAttribute('data-travail-fait'), { fait, le: new Date().toISOString() });
        if (!fait) { const t = document.getElementById('f-travail'); const prec = N.etat.seances.find((x) => x.id === b.getAttribute('data-travail-fait')); if (t && prec && t.value.indexOf('Reprendre :') === -1) t.value = (t.value ? t.value + '\n' : '') + 'Reprendre : ' + prec.travail; }
        N.signaler(fait ? 'Travail noté comme fait.' : 'Travail à reprendre : ajouté au travail personnel qui suit, enregistre la séance.', 'succes');
        vue().querySelectorAll('[data-travail-fait]').forEach((x) => x.classList.toggle('p-bouton-fantome', x !== b));
      } catch (e) { N.signaler(e.message); }
    }));

    document.getElementById('p-form-seance').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const lecons = Array.from(document.getElementById('f-lecons').selectedOptions).map((o) => o.value);
      const matieres = Array.from(new Set(lecons.map((r) => r.split('/')[0])));
      try {
        await N.api('/seances/' + id, {
          method: 'PATCH',
          body: JSON.stringify({
            date: document.getElementById('f-date').value,
            creneau: document.getElementById('f-creneau').value,
            debut: document.getElementById('f-debut').value,
            fin: document.getElementById('f-fin').value,
            type: document.getElementById('f-type').value,
            statut: document.getElementById('f-statut').value,
            objectif: document.getElementById('f-objectif').value,
            travail: document.getElementById('f-travail').value,
            bilan: document.getElementById('f-bilan').value,
            lecons, matieres,
          }),
        });
        await N.rafraichirSeances();
        const visio = document.getElementById('f-visio').value.trim();
        if (visio !== (N.profil('visio.' + id, '') || '')) await N.enregistrerProfil('visio.' + id, visio || null).catch(() => {});
        if (document.getElementById('f-meme-jour').checked) {
          const r = await N.api('/seances/horaire', { method: 'POST', body: JSON.stringify({
            jour: new Date(document.getElementById('f-date').value + 'T12:00:00').getDay(),
            debut: document.getElementById('f-debut').value, fin: document.getElementById('f-fin').value,
            depuis: document.getElementById('f-date').value,
          }) });
          N.signaler(`Horaire appliqué à ${r.modifiees} séance(s).`, 'succes');
        }
        N.signaler('Séance enregistrée.', 'succes');
        vueSeance(id);
      } catch (e) { N.signaler(e.message); }
    });

    document.getElementById('p-supprimer').addEventListener('click', async () => {
      if (!(await confirmerParMot('supprimer', 'Cette séance sera supprimée définitivement.'))) return;
      try {
        await N.api('/seances/' + id, { method: 'DELETE' });
        await N.rafraichirSeances();
        N.signaler('Séance supprimée.', 'succes');
        location.hash = '#/calendrier/' + N.lundiDe(s.date);
      } catch (e) { N.signaler(e.message); }
    });
  }

  /* =======================================================================
     Générateur d'année
     ======================================================================= */
  let apercu = null;

  /** Le lundi de rentrée, ou le prochain lundi si la rentrée est passée. */
  function premierLundi() {
    const rentree = (window.PLANIFICATEUR && window.PLANIFICATEUR.RENTREE) || null;
    if (rentree && rentree >= N.jourIso()) return rentree;
    const l = N.lundiDe(N.jourIso());
    return l >= N.jourIso() ? l : N.decaler(l, 7);
  }

  function vuePlanning() {
    const existantes = N.etat.seances.length;
    const debut = premierLundi();

    afficher(
      entete('Générateur d\'année', 'Trois séances par semaine, lundi, mercredi et vendredi de 13 h à 14 h 30, plus deux temps de travail personnel.',
        '<a class="p-bouton p-bouton-fantome" href="#/mois">Voir le planning</a>')
      + '<div class="p-grille2"><div>'
      + bloc('Paramètres', `
        <form class="p-form" id="p-form-planning">
          <div class="ligne">
            <div><label for="g-debut">Premier lundi</label><input id="g-debut" type="date" value="${debut}"></div>
            <div><label for="g-semaines">Nombre de semaines</label><input id="g-semaines" type="number" min="1" max="52" value="36"></div>
          </div>
          <div class="ligne">
            <div><label for="g-merc-debut">Mercredi : début</label><input id="g-merc-debut" type="time" value="13:00"></div>
            <div><label for="g-merc-fin">Mercredi : fin</label><input id="g-merc-fin" type="time" value="14:30"></div>
            <div><label for="g-perso">Temps perso</label><select id="g-perso"><option value="15">15 min</option><option value="20" selected>20 min</option><option value="30">30 min</option></select></div>
          </div>
          <div><label for="g-vacances">Vacances et semaines sans cours (une par ligne : du AAAA-MM-JJ au AAAA-MM-JJ, nom)</label>
            <textarea id="g-vacances" rows="5" placeholder="2026-10-17 au 2026-11-02 Toussaint&#10;2026-12-19 au 2027-01-04 Noël">${N.ech((N.profil('prof.vacances', []) || []).map((v) => `${v.du} au ${v.au} ${v.nom || ''}`.trim()).join('\n'))}</textarea>
            <p class="p-aide">Ces semaines sont sautées par le générateur et grisées dans le planning.</p>
          </div>
          <p class="p-aide">Le lundi et le vendredi restent de 13 h à 14 h 30. Le mercredi se règle ici pour
            toute l'année, et se corrige ensuite séance par séance.</p>
          <p class="p-aide">Le générateur répartit les ${N.chiffres().total} leçons en trois blocs chacune, fait tourner
            les matières pour qu'aucune semaine ne se répète, place les temps de travail personnel du mardi et du jeudi,
            et réserve une séance sur quatre au choix de Sterenn.</p>
          <div class="p-actions" style="display:flex;gap:.4rem">
            <button class="p-bouton p-bouton-fantome" type="submit">Prévisualiser</button>
            <button class="p-bouton" id="g-enregistrer" type="button" disabled>Enregistrer dans le planning</button>
          </div>
        </form>`)
      + bloc('Planning actuel', `
        <ul class="p-kpis" style="margin:0">
          <li><span class="v">${existantes}</span><span class="l">séances enregistrées</span></li>
          <li><span class="v">${N.etat.seances.filter((s) => s.statut === 'faite').length}</span><span class="l">déjà faites</span></li>
          <li><span class="v">${N.etat.seances.filter((s) => s.date >= N.jourIso()).length}</span><span class="l">à venir</span></li>
        </ul>
        <p class="p-aide">L'enregistrement est idempotent : une séance déjà présente sur le même jour et le même créneau
          est ignorée, jamais dupliquée. On peut donc relancer la génération sans abîmer ce qui existe.</p>
        <button class="p-bouton p-bouton-danger p-bouton-mini" id="g-vider" type="button">Supprimer les séances à venir</button>`)
      + '</div><div id="g-apercu">'
      + bloc('Aperçu', '<p class="p-vide">Lance une prévisualisation pour voir la répartition avant d\'enregistrer.</p>')
      + '</div></div>',
      [{ t: 'Outils' }, { t: 'Générateur d\'année' }],
    );

    document.getElementById('p-form-planning').addEventListener('submit', (ev) => {
      ev.preventDefault();
      const d = document.getElementById('g-debut').value;
      const n = parseInt(document.getElementById('g-semaines').value, 10);
      if (!d || !n) return N.signaler('Indique un premier lundi et un nombre de semaines.');
      const mercredi = {
        debut: document.getElementById('g-merc-debut').value || '13:00',
        fin: document.getElementById('g-merc-fin').value || '14:30',
      };
      if (mercredi.debut >= mercredi.fin) return N.signaler('Le mercredi doit finir après avoir commencé.');
      const vacances = document.getElementById('g-vacances').value.split('\n').map((l) => /^(\d{4}-\d{2}-\d{2})\s+au\s+(\d{4}-\d{2}-\d{2})\s*(.*)$/.exec(l.trim())).filter(Boolean).map((x) => ({ du: x[1], au: x[2], nom: x[3] || '' }));
      N.enregistrerProfil('prof.vacances', vacances).catch(() => {});
      try {
        apercu = window.PLANIFICATEUR.generer(N.lundiDe(d), n, { mercredi, vacances, dureePerso: Number(document.getElementById('g-perso').value) || 20 });
        rendreApercu();
        document.getElementById('g-enregistrer').disabled = false;
      } catch (e) { N.signaler(e.message); }
      return undefined;
    });

    document.getElementById('g-enregistrer').addEventListener('click', enregistrerPlanning);
    document.getElementById('g-vider').addEventListener('click', viderAVenir);
  }

  function rendreApercu() {
    if (!apercu) return;
    const cours = apercu.seances.filter((s) => s.type === 'cours');
    const travail = apercu.seances.filter((s) => s.type === 'travail');
    const avecChoix = apercu.seances.filter((s) => (s.choix || []).length >= 2);

    const parMatiere = {};
    cours.forEach((s) => (s.lecons || []).forEach((r) => {
      const mid = r.split('/')[0];
      parMatiere[mid] = (parMatiere[mid] || 0) + 1;
    }));

    document.getElementById('g-apercu').innerHTML = bloc('Aperçu', `
      <ul class="p-kpis" style="margin:0 0 .7rem">
        <li><span class="v">${apercu.seances.length}</span><span class="l">séances au total</span></li>
        <li><span class="v">${cours.length}</span><span class="l">cours</span></li>
        <li><span class="v">${travail.length}</span><span class="l">travail personnel</span></li>
        <li><span class="v">${avecChoix.length}</span><span class="l">séances au choix</span></li>
        <li class="${apercu.restants ? 'neg' : 'pos'}"><span class="v">${apercu.restants}</span><span class="l">blocs non placés</span></li>
      </ul>
      <table class="p-table"><thead><tr><th>Matière</th><th>Blocs placés</th><th>Blocs attendus</th></tr></thead><tbody>
      ${PROGRAMME.matieres.map((m) => {
    const place = parMatiere[m.id] || 0;
    const attendu = m.lecons.length * window.PLANIFICATEUR.BLOCS_PAR_LECON;
    return `<tr><td>${m.icone} ${N.ech(m.nom)}</td>
      <td class="num">${place}</td>
      <td class="num">${attendu}${place === attendu ? ' ✓' : ''}</td></tr>`;
  }).join('')}</tbody></table>
      <p class="p-aide">Première séance le ${N.ech(N.enFrancais(apercu.seances[0].date, true))},
        dernière le ${N.ech(N.enFrancais(apercu.seances[apercu.seances.length - 1].date, true))}.</p>`)
      + bloc('Les huit premières semaines', apercuSemaines(apercu.seances, 8));
  }
  /** B16 : une grille des premières semaines, une pastille colorée par matière, avant d'enregistrer. */
  function apercuSemaines(seances, n) {
    const lundis = [...new Set(seances.map((x) => N.lundiDe(x.date)))].sort().slice(0, n);
    const pastille = (r) => { const mid = r.split('/')[0]; const info = N.libelleLecon(r); return `<span class="p-pastille-mat" style="--teinte:${mid === 'module' ? '#5C6675' : teinte(mid)}" title="${N.ech(info ? info.l.titre : r)}">${N.ech(info ? (info.m.id === 'module' ? info.l.icone : N.nomCourt(mid)) : mid)}</span>`; };
    return `<div class="p-tableau-defilant"><table class="p-table p-semaines-apercu"><thead><tr><th>Semaine</th>${N.JOURS.map((j) => `<th>${j}</th>`).join('')}</tr></thead><tbody>${lundis.map((lundi) => `<tr><td class="num">${N.ech(N.enFrancais(lundi))}</td>${[0, 1, 2, 3, 4].map((i) => { const jour = N.decaler(lundi, i); const du = seances.filter((x) => x.date === jour); return `<td>${du.map((x) => `<div class="p-apercu-seance ${x.type}">${(x.lecons || []).map(pastille).join('')}${(x.choix || []).length >= 2 ? '<span class="p-puce">choix</span>' : ''}</div>`).join('')}</td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  async function enregistrerPlanning() {
    if (!apercu) return;
    const bouton = document.getElementById('g-enregistrer');
    bouton.disabled = true;
    bouton.textContent = 'Enregistrement…';
    let crees = 0; let ignores = 0;
    try {
      for (let i = 0; i < apercu.seances.length; i += 50) {
        const paquet = apercu.seances.slice(i, i + 50);
        const r = await N.api('/seances/lot', { method: 'POST', body: JSON.stringify({ seances: paquet }) });
        crees += r.crees || 0;
        ignores += r.ignores || 0;
      }
      await N.rafraichirSeances();
      N.signaler(`${crees} séance(s) créée(s), ${ignores} déjà présente(s).`, 'succes');
      vuePlanning();
    } catch (e) {
      N.signaler(e.message);
      bouton.disabled = false;
      bouton.textContent = 'Enregistrer dans le planning';
    }
  }

  async function viderAVenir() {
    const aujourd = N.jourIso();
    const cibles = N.etat.seances.filter((s) => s.date >= aujourd && s.statut !== 'faite');
    if (!cibles.length) return N.signaler('Aucune séance à venir à supprimer.', 'info');
    if (!(await confirmerParMot('supprimer', `${cibles.length} séance(s) à venir seront supprimées. Les séances déjà faites sont conservées.`))) return undefined;
    try {
      for (const s of cibles) await N.api('/seances/' + s.id, { method: 'DELETE' });
      await N.rafraichirSeances();
      N.signaler(`${cibles.length} séance(s) supprimée(s).`, 'succes');
      vuePlanning();
    } catch (e) { N.signaler(e.message); }
    return undefined;
  }

  /* =======================================================================
     Suivi des acquis
     ======================================================================= */
  const filtres = { matiere: '', niveau: '', periode: '', q: '', pretes: false };

  function vueSuivi() {
    const aujourd = N.jourIso();

    /* Dernière séance où chaque leçon a été travaillée, et prochaine prévue. */
    const vues = {};
    const aVenir = {};
    N.etat.seances.forEach((x) => {
      (x.lecons || []).forEach((r) => {
        if (x.date <= aujourd) { if (!vues[r] || x.date > vues[r]) vues[r] = x.date; }
        else if (!aVenir[r] || x.date < aVenir[r]) aVenir[r] = x.date;
      });
    });

    const lignes = [];
    PROGRAMME.matieres.forEach((m) => {
      if (filtres.matiere && m.id !== filtres.matiere) return;
      const gardees = m.lecons.filter((l) => {
        const niv = N.niveauDe(m.id, l.ref) || '';
        if (filtres.niveau === 'nonevaluee' && niv) return false;
        if (filtres.niveau && filtres.niveau !== 'nonevaluee' && niv !== filtres.niveau) return false;
        if (filtres.pretes && (l.docs || []).length !== 4) return false;
        if (filtres.periode && String(l.periode) !== filtres.periode) return false;
        if (filtres.q) {
          const foin = (l.ref + ' ' + l.titre + ' ' + (l.notions || []).join(' ')).toLowerCase();
          if (foin.indexOf(filtres.q.toLowerCase()) === -1) return false;
        }
        return true;
      });
      if (!gardees.length) return;
      lignes.push({ m, lecons: gardees });
    });

    const c = N.chiffres();
    const affichees = lignes.reduce((n, g) => n + g.lecons.length, 0);

    /* Répartition de l'année sur les quatre niveaux, plus les non évaluées. */
    const repartition = { insuffisant: 0, fragile: 0, satisfaisant: 0, tresbien: 0, vide: 0 };
    PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => {
      const n = N.niveauDe(m.id, l.ref);
      repartition[n || 'vide'] += 1;
    }));

    const ligne = (m, l) => {
      const cle = N.cle(m.id, l.ref);
      const suivi = N.etat.suivi[cle] || {};
      const res = N.etat.resultats[cle];
      const pret = (l.docs || []).length === 4;
      const lues = N.TYPES_DOC.filter((t) => N.etat.fiches[cle + '/' + t.id]).length;
      const jours = suivi.maj_le
        ? Math.floor((Date.now() - new Date(suivi.maj_le).getTime()) / JOURS_MS) : null;
      const aReprendre = jours !== null && jours >= REPRISE_JOURS
        && ['insuffisant', 'fragile'].indexOf(suivi.niveau) !== -1;
      return `<tr${aReprendre ? ' class="alerte"' : ''}>
        <td class="num">${N.ech(l.ref)}</td>
        <td class="titre">${pret
    ? `<a href="#/lecon/${m.id}/${l.ref}">${N.ech(l.titre)}</a>`
    : N.ech(l.titre)}
          <span class="notions">${N.ech((l.notions || []).slice(0, 2).join(' · '))}</span></td>
        <td class="num">P${l.periode}</td>
        <td class="docs">${pastillesDocs(m.id, l)}</td>
        <td class="num">${lues ? lues + '/' + (l.docs || []).length : '·'}</td>
        <td class="num">${res
    ? `<span title="${res.series} série(s)">${res.meilleur}/${res.total}</span>` : '·'}</td>
        <td>${choixNiveau(m.id, l.ref)}${boutonProposition(m.id, l.ref)}</td>
        <td>${pret ? choixOuverture(m.id, l.ref) : '<span class="p-puce">à rédiger</span>'}</td>
        <td><input data-note data-mid="${m.id}" data-ref="${l.ref}" type="text" maxlength="200"
              value="${N.ech(suivi.note || '')}" placeholder="ce qui reste à reprendre"></td>
        <td class="num">${vues[cle] ? N.ech(jourCourt(vues[cle])) : '·'}</td>
        <td class="num">${aVenir[cle] ? N.ech(jourCourt(aVenir[cle])) : '·'}</td>
        <td class="num">${jours === null ? '·'
    : `<span${aReprendre ? ' class="chaud"' : ''}>${jours} j</span>`}</td>
      </tr>`;
    };

    const corps = lignes.length ? `
      <div class="p-defile">
      <table class="p-table p-table-suivi">
        <thead><tr>
          <th>Réf.</th><th>Leçon</th><th>Pér.</th><th>Documents</th><th title="Fiches marquées lues">Lues</th>
          <th title="Meilleur score à la série d'exercices">Exos</th>
          <th>Niveau</th><th>Accès</th><th>Note de suivi</th>
          <th title="Dernière séance où la leçon a été travaillée">Vue le</th>
          <th title="Prochaine séance où elle est prévue">Prévue</th>
          <th title="Jours écoulés depuis le dernier positionnement">Depuis</th>
        </tr></thead>
        <tbody>${lignes.map((g) => {
    const p = N.progression(g.m);
    const prets = g.m.lecons.filter((l) => (l.docs || []).length === 4).length;
    return `<tr class="grp" style="--teinte:${teinte(g.m.id)}">
            <td colspan="4"><span class="nom">${g.m.icone} ${N.ech(g.m.nom)}</span></td>
            <td colspan="4">${jauge(p.faites, p.total, teinte(g.m.id))} validées</td>
            <td colspan="4">${prets} leçon(s) entièrement rédigée(s)
              · <a href="#/matiere/${g.m.id}">ouvrir la matière</a></td>
          </tr>${g.lecons.map((l) => ligne(g.m, l)).join('')}`;
  }).join('')}
        </tbody>
      </table></div>` : '<p class="p-vide">Aucune leçon ne correspond à ces filtres. <button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" id="s-raz">Effacer les filtres</button></p>';

    afficher(
      entete('Suivi des acquis',
        `${c.validees} validées sur ${c.total} · ${c.fragiles} à reprendre · ${c.pretes} entièrement rédigées · ${Object.keys(N.etat.resultats).filter((k) => k.indexOf('jeu/') === 0).length} jeu(x) joué(s)`,
        `<a class="p-bouton p-bouton-fantome" href="#/bulletin/${N.periodeCourante()}">Bulletin de période</a>
         <button class="p-bouton p-bouton-fantome" id="s-export" type="button">Exporter en CSV</button>
         <a class="p-bouton p-bouton-fantome" href="#/matieres">Voir les matières</a>`)

      + bloc('Étoiles par semaine', courbeEtoiles(12), '', '<span class="p-aide">fiches, séries réussies, félicitations, leçons validées</span>')
      + `<ul class="p-kpis">
          <li class="pos"><span class="v">${repartition.tresbien}</span><span class="l">Très bien</span></li>
          <li class="pos"><span class="v">${repartition.satisfaisant}</span><span class="l">Satisfaisant</span></li>
          <li class="att"><span class="v">${repartition.fragile}</span><span class="l">Fragile</span></li>
          <li class="neg"><span class="v">${repartition.insuffisant}</span><span class="l">Insuffisant</span></li>
          <li><span class="v">${repartition.vide}</span><span class="l">non évaluées</span></li>
          <li><span class="v">${c.pretes}</span><span class="l">leçons rédigées</span></li>
        </ul>`

      + bloc('Où en est l\'année', `
        <div class="p-barre-empilee" role="img"
             aria-label="${repartition.tresbien} très bien, ${repartition.satisfaisant} satisfaisant, ${repartition.fragile} fragile, ${repartition.insuffisant} insuffisant, ${repartition.vide} non évaluées">
          ${['tresbien', 'satisfaisant', 'fragile', 'insuffisant', 'vide'].map((k) => {
    const n = repartition[k];
    return n ? `<i class="seg-${k}" style="flex:${n}" title="${n} leçon(s)"></i>` : '';
  }).join('')}
        </div>
        <p class="p-legende">
          <span class="seg-tresbien"></span> Très bien
          <span class="seg-satisfaisant"></span> Satisfaisant
          <span class="seg-fragile"></span> Fragile
          <span class="seg-insuffisant"></span> Insuffisant
          <span class="seg-vide"></span> non évaluée
        </p>
        <div class="p-matieres-jauges">${PROGRAMME.matieres.map((m) => {
    const p = N.progression(m);
    return `<a class="p-mj" href="#/matiere/${m.id}" style="--teinte:${teinte(m.id)}">
            <span class="n">${m.icone} ${N.ech(N.nomCourt(m.id))}</span>
            ${jauge(p.faites, p.total, teinte(m.id))}</a>`;
  }).join('')}</div>`)

      + bloc('Filtres', `
        <div class="p-form"><div class="ligne">
          <div><label for="s-q">Rechercher</label>
            <input id="s-q" type="search" value="${N.ech(filtres.q || '')}" placeholder="titre, notion, référence"></div>
          <div><label for="s-matiere">Matière</label><select id="s-matiere">
            <option value="">toutes</option>
            ${PROGRAMME.matieres.map((m) => `<option value="${m.id}"${filtres.matiere === m.id ? ' selected' : ''}>${N.ech(m.nom)}</option>`).join('')}
          </select></div>
          <div><label for="s-periode">Période</label><select id="s-periode">
            <option value="">toutes</option>
            ${[1, 2, 3, 4, 5].map((n) => `<option value="${n}"${filtres.periode === String(n) ? ' selected' : ''}>Période ${n}</option>`).join('')}
          </select></div>
          <div><label for="s-niveau">Niveau</label><select id="s-niveau">
            <option value="">tous</option>
            <option value="nonevaluee"${filtres.niveau === 'nonevaluee' ? ' selected' : ''}>non évaluées</option>
            ${N.NIVEAUX.map((n) => `<option value="${n.id}"${filtres.niveau === n.id ? ' selected' : ''}>${N.ech(n.libelle)}</option>`).join('')}
          </select></div>
          <div><label for="s-pretes">Contenu</label><select id="s-pretes">
            <option value=""${filtres.pretes ? '' : ' selected'}>toutes les leçons</option>
            <option value="1"${filtres.pretes ? ' selected' : ''}>seulement les 4 documents rédigés</option>
          </select></div>
        </div>
        <p class="p-aide">Une ligne surlignée signale une leçon fragile ou insuffisante laissée
          sans reprise depuis plus de ${REPRISE_JOURS} jours.</p></div>`)

      + bloc('Les leçons de l\'année', corps, affichees + ' leçon(s) affichée(s)'),
      [{ t: 'Pilotage' }, { t: 'Suivi des acquis' }],
    );

    const relier = (id, champ) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', (e) => { filtres[champ] = e.target.value; vueSuivi(); });
    };
    relier('s-matiere', 'matiere');
    relier('s-periode', 'periode');
    relier('s-niveau', 'niveau');
    document.getElementById('s-pretes').addEventListener('change', (e) => { filtres.pretes = Boolean(e.target.value); vueSuivi(); });
    const champQ = document.getElementById('s-q');
    champQ.addEventListener('change', () => { filtres.q = champQ.value.trim(); vueSuivi(); });

    brancherNiveaux(vueSuivi);
    brancherOuvertures(vueSuivi);
    document.getElementById('s-export').addEventListener('click', exporterSuivi);
    const raz = document.getElementById('s-raz'); if (raz) raz.addEventListener('click', () => { Object.assign(filtres, { matiere: '', niveau: '', periode: '', q: '', pretes: false }); vueSuivi(); });

    vue().querySelectorAll('[data-note]').forEach((i) => i.addEventListener('change', async () => {
      const mid = i.getAttribute('data-mid');
      const ref = i.getAttribute('data-ref');
      const niveau = N.niveauDe(mid, ref);
      if (!niveau) return N.signaler('Positionne d\'abord un niveau, la note s\'y rattache.', 'info');
      try {
        await N.api('/suivi', { method: 'PUT', body: JSON.stringify({ matiere: mid, ref, niveau, note: i.value }) });
        await N.rafraichirEtat();
        N.signaler('Note enregistrée.', 'succes');
      } catch (e) { N.signaler(e.message); }
      return undefined;
    }));
  }

  /** Export du suivi complet, lisible dans un tableur. */
  /** B15 : les étoiles gagnées semaine par semaine, empilées par matière, pour voir les creux. */
  function courbeEtoiles(nSemaines) {
    const auj = N.jourIso();
    const lundis = []; let l = N.lundiDe(auj);
    for (let i = 0; i < nSemaines; i += 1) { lundis.unshift(l); l = N.decaler(l, -7); }
    const parSemaine = lundis.map(() => ({}));
    const poser = (date, mid, n) => { if (!date) return; const lu = N.lundiDe(String(date).slice(0, 10)); const k = lundis.indexOf(lu); if (k === -1) return; parSemaine[k][mid] = (parSemaine[k][mid] || 0) + n; };
    Object.entries(N.etat.fiches).forEach(([k, f]) => poser(f.termine_le, k.split('/')[0], 1));
    Object.entries(N.etat.resultats).forEach(([k, r]) => { if (k.indexOf('jeu/') === 0) { if (r.meilleur >= 70) poser(r.maj_le, 'jeu', 1); } else if (r.total > 0 && r.meilleur / r.total >= 0.7) poser(r.maj_le, k.split('/')[0], 1); });
    (N.etat.felicitations || []).forEach((f) => poser(f.cree_le, f.matiere || 'autre', 1));
    Object.entries(N.etat.suivi).forEach(([k, s]) => { if (s.niveau === 'satisfaisant' || s.niveau === 'tresbien') poser(s.maj_le, k.split('/')[0], 3); });
    const max = Math.max(1, ...parSemaine.map((sem) => Object.values(sem).reduce((a, b) => a + b, 0)));
    const H = 120; const W = 640; const lg = W / nSemaines;
    const barres = parSemaine.map((sem, i) => {
      let y = H;
      const parts = Object.entries(sem).map(([mid, n]) => { const h = (n / max) * (H - 10); y -= h; return `<rect x="${(i * lg + 6).toFixed(1)}" y="${y.toFixed(1)}" width="${(lg - 12).toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${mid === 'jeu' || mid === 'autre' ? '#8C96A5' : teinte(mid)}"><title>${N.ech((N.matiere(mid) || { nom: mid }).nom)} : ${n}</title></rect>`; });
      const total = Object.values(sem).reduce((a, b) => a + b, 0);
      return parts.join('') + `<text x="${(i * lg + lg / 2).toFixed(1)}" y="${H + 14}" text-anchor="middle" font-size="9" fill="currentColor">${N.ech(lundis[i].slice(8, 10) + '/' + lundis[i].slice(5, 7))}</text>` + (total ? `<text x="${(i * lg + lg / 2).toFixed(1)}" y="${Math.max(10, y - 3).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">${total}</text>` : '');
    });
    return `<svg class="p-courbe" viewBox="0 0 ${W} ${H + 20}" role="img" aria-label="Étoiles gagnées par semaine sur ${nSemaines} semaines">${barres.join('')}</svg>
      <p class="p-legende-mat">${PROGRAMME.matieres.map((m) => `<span><i style="background:${teinte(m.id)}"></i>${N.ech(N.nomCourt(m.id))}</span>`).join('')}<span><i style="background:#8C96A5"></i>jeux, autres</span></p>`;
  }

  const DOMAINES = { D1: 'Les langages pour penser et communiquer', D2: 'Les méthodes et outils pour apprendre', D3: 'La formation de la personne et du citoyen', D4: 'Les systèmes naturels et les systèmes techniques', D5: 'Les représentations du monde et l\'activité humaine' };
  const POIDS = { insuffisant: 1, fragile: 2, satisfaisant: 3, tresbien: 4 };
  /** A4, A46, A51, A52, A53, A54, A55 : journal d'audit, questions à Opale, santé, usage, erreurs. */
  async function vueJournal() {
    afficher(entete('Journal et santé', 'Ce qui a été écrit, ce qui a été demandé à Opale, l\'état du déploiement.') + N.squelette('serie'), [{ t: 'Outils' }, { t: 'Journal et santé' }]);
    const [moi, journal, usage, erreurs] = await Promise.all([N.api('/moi').catch(() => ({})), N.api('/journal?n=150').catch(() => ({ journal: [] })), N.api('/usage?jours=14').catch(() => ({ usage: [] })), N.api('/erreur').catch(() => ({ erreurs: [] }))]);
    const sa = moi.sante || {};
    const LIB = { acces: 'accès', reglage: 'réglage', ouverture: 'ouverture', seance: 'séance', felicitation: 'félicitation', code: 'code d\'accès', profil: 'profil' };
    const parJour = {};
    (usage.usage || []).forEach((u) => { (parJour[u.jour] = parJour[u.jour] || {})[u.cle] = u.n; });
    const cles = ['connexion', 'fiche', 'serie', 'jeu', 'message', 'opale', 'evaluation', 'perso'];
    const alerte = sa.sauvegarde ? (sa.sauvegarde.age_heures > 48 ? `<p class="p-bandeau p-bandeau-erreur" style="border-radius:7px">La dernière sauvegarde date de ${sa.sauvegarde.age_heures} heures : le travail planifié de nuit ne tourne plus. Vérifie le secret CODE_PROF du dépôt, ou sauvegarde à la main dans Réglages.</p>` : '') : '<p class="p-bandeau p-bandeau-erreur" style="border-radius:7px">Aucune sauvegarde trouvée dans le stockage. Lance-en une depuis Réglages.</p>';
    afficher(entete('Journal et santé', `Version ${N.ech(sa.version || '?')} · ${Object.values(sa.tables || {}).reduce((a, b) => a + (b || 0), 0)} lignes en base`,
      '<a class="p-bouton p-bouton-fantome" href="#/reglages">Réglages et sauvegardes</a>')
      + alerte
      + '<div class="p-grille2"><div>'
      + bloc('Santé', `<dl class="p-fiche-carte">
          <dt>Version déployée</dt><dd><code>${N.ech(sa.version || '?')}</code></dd>
          <dt>Liaisons</dt><dd>${['kv', 'db', 'r2', 'ia'].map((k) => `<span class="p-etat ${moi.relie && moi.relie[k] ? 'p-etat-satisfaisant' : 'p-etat-insuffisant'}">${k.toUpperCase()}</span>`).join(' ')}</dd>
          <dt>Dernière sauvegarde</dt><dd>${sa.sauvegarde ? `${N.ech(N.dateCourte(sa.sauvegarde.quand))} · ${N.ech(N.poids(sa.sauvegarde.octets))} · il y a ${sa.sauvegarde.age_heures} h` : 'aucune'}</dd>
          <dt>Temps de réponse (aujourd'hui)</dt><dd>${sa.perf ? `${sa.perf.n} requêtes · moyenne ${sa.perf.moyenne_ms} ms · maximum ${sa.perf.max_ms} ms` : 'pas encore mesuré'}</dd>
        </dl>
        <table class="p-table" style="margin-top:.6rem"><thead><tr><th>Table</th><th>Lignes</th></tr></thead><tbody>${Object.entries(sa.tables || {}).map(([t, n]) => `<tr><td>${N.ech(t)}</td><td class="num">${n === null ? '<span class="p-faible">absente</span>' : n}</td></tr>`).join('')}</tbody></table>`)
      + bloc('Usage des quatorze derniers jours', Object.keys(parJour).length ? `<div class="p-tableau-defilant"><table class="p-table"><thead><tr><th>Jour</th>${cles.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${Object.keys(parJour).sort().reverse().map((j) => `<tr><td class="num">${N.ech(j.slice(5))}</td>${cles.map((c) => `<td class="num">${parJour[j][c] || '·'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : '<p class="p-vide">Rien de compté encore : les compteurs démarrent avec la première action.</p>')
      + '</div><div>'
      + bloc('Journal d\'audit', (journal.journal || []).length ? `<ul class="p-journal">${journal.journal.map((j) => `<li><time>${N.ech(N.dateCourte(j.quand))}</time> <b>${N.ech(LIB[j.quoi] || j.quoi)}</b> ${N.ech(j.cle || '')} <small>${N.ech(j.avant || '∅')} → ${N.ech(j.apres || '∅')}</small></li>`).join('')}</ul>` : '<p class="p-vide">Aucune écriture journalisée encore.</p>', String((journal.journal || []).length))
      + bloc('Erreurs du navigateur', (erreurs.erreurs || []).length ? `<ul class="p-journal">${erreurs.erreurs.map((e) => `<li><time>${N.ech(N.dateCourte(e.derniere))}</time> <b>×${e.n}</b> ${N.ech(e.message)} <small>${N.ech(e.source || '')} ${N.ech(e.ecran || '')} (${N.ech(e.role || '')})</small></li>`).join('')}</ul><p><button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" id="j-vider">Vider la liste</button></p>` : '<p class="p-vide">Aucune erreur remontée. C\'est bon signe.</p>', String((erreurs.erreurs || []).length))
      + bloc('Questions posées à Opale', '<div id="j-opale"><p class="p-aide">Chargement…</p></div>')
      + '</div></div>',
    [{ t: 'Outils' }, { t: 'Journal et santé' }]);
    const vider = document.getElementById('j-vider'); if (vider) vider.addEventListener('click', async () => { await N.api('/erreur', { method: 'DELETE' }); vueJournal(); });
    N.api('/tuteur/journal').then((d) => { const z = document.getElementById('j-opale'); if (!z) return; z.innerHTML = (d.journal || []).length ? `<ul class="p-journal">${d.journal.map((q) => `<li><time>${N.ech(N.dateCourte(q.quand))}</time> <b>${N.ech(q.role)}</b> ${N.ech(q.mode || '')} ${N.ech(q.matiere ? q.matiere + '/' + (q.ref || '') : '')}<br>« ${N.ech(q.question)} » <small>${N.ech(q.controle || '')}</small></li>`).join('')}</ul><p class="p-aide">La question, le mode et le contrôle appliqué. Jamais la réponse d'Opale.</p>` : '<p class="p-vide">Aucune question encore.</p>'; }).catch(() => { const z = document.getElementById('j-opale'); if (z) z.innerHTML = '<p class="p-vide">Journal indisponible.</p>'; });
  }

  /** D17 : les jeux et mondes, avec ce que Sterenn y a fait : parties, meilleur score, dernière fois, questions ratées. */
  function vueJeuxProf() {
    const jeux = window.JEUX || [];
    const lignes = jeux.map((j) => {
      const r = N.etat.resultats['jeu/' + j.id];
      let detail = null; try { detail = r && r.detail ? (typeof r.detail === 'string' ? JSON.parse(r.detail) : r.detail) : null; } catch (e) { detail = null; }
      const lecons = (j.lecons || []).map((c) => { const [mid, ref] = c.split(':'); const m = N.matiere(mid); const l = m && N.lecon(m, ref); return l ? `<a href="#/lecon/${mid}/${ref}">${m.icone} ${N.ech(l.titre)}</a>` : N.ech(c); }).join(', ');
      return { j, r, detail, lecons };
    });
    const joues = lignes.filter((x) => x.r).length;
    const gagnes = lignes.filter((x) => x.r && x.r.meilleur >= 70).length;
    afficher(entete('Jeux et mondes', `${jeux.length} jeux · ${joues} joués par Sterenn · ${gagnes} gagnés (deux étoiles ou plus)`,
      `<a class="p-bouton p-bouton-fantome" href="#/acces">Accès des jeux</a>`)
      + bloc('Ce que Sterenn a joué', `<div class="p-tableau-defilant"><table class="p-table"><thead><tr><th>Jeu</th><th>Leçon servie</th><th>Parties</th><th>Meilleur</th><th>Dernière fois</th><th>Questions ratées à la dernière partie</th></tr></thead><tbody>
        ${lignes.sort((a, b) => (b.r ? b.r.maj_le : '').localeCompare(a.r ? a.r.maj_le : '')).map((x) => `<tr class="${x.r ? '' : 'p-faible'}"><td>${x.j.ico} <a href="${x.j.url}" target="_blank" rel="noopener">${N.ech(x.j.titre)}</a>${x.j.type === '3d' ? ' <span class="p-puce">3D</span>' : ''}</td><td>${x.lecons}</td><td class="num">${x.r ? x.r.series : '·'}</td><td class="num">${x.r ? `<span class="p-etat ${x.r.meilleur >= 70 ? 'p-etat-satisfaisant' : 'p-etat-fragile'}">${x.r.meilleur}</span>` : '·'}</td><td class="num">${x.r ? N.ech(N.dateCourte(x.r.maj_le)) : '·'}</td><td>${x.detail && x.detail.ratees && x.detail.ratees.length ? `<small>${x.detail.ratees.map(N.ech).join(' · ')}</small>` : (x.detail ? `<small class="p-faible">${x.detail.justes}/${x.detail.total}, aucune ratée</small>` : '<span class="p-faible">·</span>')}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="p-aide">Le détail (questions ratées, difficulté) n'est envoyé que par les jeux à questions ; les mondes 3D envoient leurs étoiles.</p>`, String(jeux.length)),
    [{ t: 'Ressources' }, { t: 'Jeux et mondes' }]);
  }

  /** B50 : les règles du système en une page. */
  function vueAideProf() {
    const R = [
      ['Étoiles', 'Fiche terminée : 1. Série réussie à 70 % : 1. Jeu ou monde gagné avec deux étoiles : 1. Leçon validée (satisfaisant ou très bien) : 3. Félicitation : 1. Rien ne redescend.'],
      ['Verrous des leçons', 'Une leçon s\'ouvre si c\'est la première de sa matière, si la précédente est validée, ou si elle est mise au programme d\'une séance passée. « Ouvrir » et « retenir » forcent la règle ; « auto » y revient.'],
      ['Accès par élément', 'Cours, révision, exercices, série, évaluation, jeu : trois états, automatique, ouvert, fermé, avec une date de fermeture facultative. Une évaluation n\'est servie que si elle est ouverte.'],
      ['Choix de Sterenn', 'Une séance sur quatre propose trois leçons. Elle choisit jusqu\'au jour même ; deux jours avant, elle est relancée ; passé le délai, tu choisis à sa place depuis l\'accueil.'],
      ['Positionnement', 'Quatre niveaux, dans cet ordre : Insuffisant, Fragile, Satisfaisant, Très bien. Chaque changement est daté avec sa raison. Une proposition automatique apparaît après une série et des fiches lues ; un clic la confirme.'],
      ['Évaluations', 'Le sujet est le devoir type de la fiche d\'exercices. Elle dépose trois photos au plus ; tu corriges avec la grille en ligne ; le résultat lui est rendu dans l\'application.'],
      ['Opale', 'Elle explique et guide, jamais la réponse : la réponse attendue est filtrée et un second passage contrôle. Quotas par jour : 150 questions pour Sterenn, 60 pour toi. Calculatrice coupée en évaluation et, si tu le veux, en exercices de maths.'],
      ['Sauvegardes', 'Un instantané chaque nuit dans le stockage de fichiers, trente conservés. Restaurer écrit un filet avant. Les codes d\'accès se changent dans Réglages.'],
      ['Données', 'Tout vit dans la base et le stockage du compte Cloudflare, rien ailleurs. Sterenn voit la liste de ce que l\'application sait d\'elle et peut la télécharger.'],
    ];
    afficher(entete('Aide', 'Les règles du système, en une page.') + bloc('Règles', `<dl class="p-qr">${R.map((x) => `<dt>${N.ech(x[0])}</dt><dd>${N.ech(x[1])}</dd>`).join('')}</dl>`), [{ t: 'Réglages', h: '#/reglages' }, { t: 'Aide' }]);
  }
  /** B14 : le bulletin d'une période, prêt à imprimer, à partir des données. */
  function vueBulletin(periode) {
    const p = Number(periode) || N.periodeCourante();
    const lignes = PROGRAMME.matieres.map((m) => {
      const lecons = m.lecons.filter((l) => Number(l.periode) === p);
      if (!lecons.length) return '';
      return `<tr class="grp"><td colspan="4"><span class="nom">${m.icone} ${N.ech(m.nom)}</span></td></tr>${lecons.map((l) => {
        const niv = N.niveauDe(m.id, l.ref); const ev = N.profil('eval.' + N.cle(m.id, l.ref), null); const su = N.etat.suivi[N.cle(m.id, l.ref)] || {};
        return `<tr><td>${N.ech(l.titre)}</td><td>${niv ? `<span class="p-etat p-etat-${niv}">${N.ech((N.NIVEAUX.find((n) => n.id === niv) || {}).libelle)}</span>` : '<span class="p-faible">non évaluée</span>'}</td><td class="num">${ev && ev.note != null ? N.ech(String(ev.note)) + '/20' : '·'}</td><td>${N.ech(ev && ev.mot ? ev.mot : su.note || '')}</td></tr>`;
      }).join('')}`;
    }).join('');
    const mots = (N.etat.felicitations || []).filter((f) => f.cree_le && N.periodeCourante(new Date(f.cree_le)) === p).slice(0, 6);
    afficher(entete(`Bulletin de la période ${p}`, 'Niveaux, notes des devoirs, mots du professeur, à partir des données enregistrées.',
      `${[1, 2, 3, 4, 5].map((k) => `<a class="p-bouton ${k === p ? '' : 'p-bouton-fantome'}" href="#/bulletin/${k}">P${k}</a>`).join('')}<button class="p-bouton" id="b-imprimer" type="button">Imprimer</button>`)
      + `<section class="p-bulletin"><header class="p-bulletin-tete"><h2>Opaline · Sterenn · classe de 4ᵉ</h2><p>Période ${p} · édité le ${N.ech(N.enFrancais(N.jourIso(), true))}</p></header>
        <table class="p-table"><thead><tr><th>Leçon</th><th>Positionnement</th><th>Devoir</th><th>Observation</th></tr></thead><tbody>${lignes}</tbody></table>
        ${mots.length ? `<h3>Mots du professeur</h3><ul class="p-liste">${mots.map((f) => `<li>${N.ech(f.texte)} <small class="p-faible">${N.ech(N.dateCourte(f.cree_le))}</small></li>`).join('')}</ul>` : ''}
        <p class="p-aide">Échelle : Insuffisant, Fragile, Satisfaisant, Très bien. Une leçon est validée à partir de Satisfaisant.</p></section>`,
    [{ t: 'Pilotage' }, { t: 'Suivi des acquis', h: '#/suivi' }, { t: 'Bulletin P' + p }]);
    document.getElementById('b-imprimer').addEventListener('click', () => window.print());
  }

  /** B9 : les critères des grilles agrégés par domaine du socle, avec le niveau des leçons positionnées. */
  function vueSocle() {
    const parDomaine = {}; Object.keys(DOMAINES).forEach((d) => { parDomaine[d] = { lecons: [], competences: {} }; });
    PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => (l.socle || []).forEach((x) => {
      if (!parDomaine[x.domaine]) return;
      const niv = N.niveauDe(m.id, l.ref) || null;
      parDomaine[x.domaine].lecons.push({ m, l, niv, competence: x.competence, criteres: x.criteres });
      const c = parDomaine[x.domaine].competences[x.competence] || (parDomaine[x.domaine].competences[x.competence] = { n: 0, positionnees: 0, somme: 0 });
      c.n += 1; if (niv) { c.positionnees += 1; c.somme += POIDS[niv]; }
    })));
    const moyenne = (c) => (c.positionnees ? (c.somme / c.positionnees) : 0);
    const libelleMoy = (v) => (!v ? 'non positionné' : v < 1.75 ? 'Insuffisant' : v < 2.5 ? 'Fragile' : v < 3.5 ? 'Satisfaisant' : 'Très bien');
    const classeMoy = (v) => (!v ? 'vide' : v < 1.75 ? 'insuffisant' : v < 2.5 ? 'fragile' : v < 3.5 ? 'satisfaisant' : 'tresbien');
    afficher(entete('Socle commun par domaine', 'Les compétences des grilles d\'évaluation, regroupées par domaine du socle, avec le niveau des leçons déjà positionnées. C\'est la base du livret.',
      '<a class="p-bouton p-bouton-fantome" href="#/suivi">Suivi des acquis</a>')
      + Object.entries(DOMAINES).map(([d, nom]) => {
        const info = parDomaine[d];
        const positionnees = info.lecons.filter((x) => x.niv);
        const comp = Object.entries(info.competences).sort((a, b) => b[1].n - a[1].n);
        return bloc(`${d} · ${nom}`, info.lecons.length ? `
          <table class="p-table"><thead><tr><th>Compétence</th><th>Leçons</th><th>Positionnées</th><th>Niveau moyen</th></tr></thead><tbody>
          ${comp.map(([nomC, c]) => `<tr><td>${N.ech(nomC)}</td><td class="num">${c.n}</td><td class="num">${c.positionnees}</td><td><span class="p-etat p-etat-${classeMoy(moyenne(c))}">${libelleMoy(moyenne(c))}</span></td></tr>`).join('')}
          </tbody></table>
          <details class="p-details"><summary>${info.lecons.length} rattachement(s) de leçons, ${positionnees.length} positionné(s)</summary>
          <ul class="p-liste">${info.lecons.map((x) => `<li><a href="#/lecon/${x.m.id}/${x.l.ref}">${x.m.icone} ${N.ech(x.l.titre)}</a><small class="p-faible">${N.ech(x.competence)}${x.criteres.length ? ' · critères ' + x.criteres.join(', ') : ''}</small>${x.niv ? `<span class="p-etat p-etat-${x.niv}" style="margin-left:auto">${N.ech((N.NIVEAUX.find((n) => n.id === x.niv) || {}).libelle || x.niv)}</span>` : '<span class="p-puce" style="margin-left:auto">non évaluée</span>'}</li>`).join('')}</ul></details>`
          : '<p class="p-vide">Aucune grille ne rattache encore de compétence à ce domaine.</p>', String(info.lecons.length));
      }).join(''),
    [{ t: 'Pilotage' }, { t: 'Socle par domaine' }]);
  }
  /** B21 : les cinq périodes en colonnes, les leçons placées dans le planning, les manques en rouge. */
  function vuePeriodes() {
    const placees = {};
    N.etat.seances.forEach((x) => (x.lecons || []).forEach((r) => { placees[r] = (placees[r] || 0) + 1; }));
    const blocsAttendus = (window.PLANIFICATEUR && window.PLANIFICATEUR.BLOCS_PAR_LECON) || 3;
    const manques = [];
    const colonnes = [1, 2, 3, 4, 5].map((p) => {
      const lignes = PROGRAMME.matieres.map((m) => {
        const lecons = m.lecons.filter((l) => Number(l.periode) === p);
        if (!lecons.length) return '';
        return `<li><b style="color:${teinte(m.id)}">${m.icone} ${N.ech(N.nomCourt(m.id))}</b>${lecons.map((l) => { const n = placees[N.cle(m.id, l.ref)] || 0; const valide = N.estValidee(m.id, l.ref); if (!n) manques.push(m.id + '/' + l.ref); return `<a class="p-periode-lecon ${n ? (n >= blocsAttendus ? 'pleine' : 'partielle') : 'manque'} ${valide ? 'validee' : ''}" href="#/lecon/${m.id}/${l.ref}" title="${N.ech(l.titre)} : ${n} bloc(s) placé(s) sur ${blocsAttendus}${valide ? ', validée' : ''}">${N.ech(l.ref)}${valide ? ' ✓' : ''}</a>`; }).join('')}</li>`;
      }).join('');
      return `<section class="p-periode"><h2>Période ${p}</h2><ul>${lignes}</ul></section>`;
    });
    afficher(entete('Vue par période', `Les 72 leçons par période : ${Object.keys(placees).filter((k) => k.indexOf('module/') !== 0).length} placées dans le planning, ${manques.length} sans séance.`,
      '<a class="p-bouton p-bouton-fantome" href="#/planning">Générateur d\'année</a><a class="p-bouton p-bouton-fantome" href="#/mois">Planning</a>')
      + `<p class="p-acces-legende"><span><i class="p-periode-lecon pleine" style="display:inline-block;padding:0 .4rem">L00</i> trois blocs placés</span><span><i class="p-periode-lecon partielle" style="display:inline-block;padding:0 .4rem">L00</i> un ou deux blocs</span><span><i class="p-periode-lecon manque" style="display:inline-block;padding:0 .4rem">L00</i> aucune séance</span><span>✓ validée</span></p>
      <div class="p-periodes">${colonnes.join('')}</div>`,
    [{ t: 'Pilotage' }, { t: 'Vue par période' }]);
  }

  function exporterSuivi() {
    const entetes = ['Matiere', 'Ref', 'Titre', 'Periode', 'Documents', 'Niveau', 'Note', 'Maj'];
    const lignes = [entetes];
    PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => {
      const s = N.etat.suivi[N.cle(m.id, l.ref)] || {};
      const n = N.NIVEAUX.find((x) => x.id === s.niveau);
      lignes.push([m.nom, l.ref, l.titre, 'P' + l.periode, (l.docs || []).length + '/4',
        n ? n.libelle : '', s.note || '', s.maj_le ? String(s.maj_le).slice(0, 10) : '']);
    }));
    const csv = lignes.map((r) => r.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(';')).join('\n');
    const lien = document.createElement('a');
    lien.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    lien.download = `suivi-des-acquis-${N.jourIso()}.csv`;
    document.body.appendChild(lien);
    lien.click();
    lien.remove();
    URL.revokeObjectURL(lien.href);
    N.signaler('Suivi exporté.', 'succes');
  }

  /* =======================================================================
     Messages
     ======================================================================= */
  let filProf = null;
  async function vueMessages(contexte, sansChargement) {
    const M = window.MESSAGERIE || null;
    if (!sansChargement) {
      afficher(entete('Messages', 'La conversation avec Sterenn, de son espace au tien.')
        + N.squelette('serie'), [{ t: 'Échanges' }, { t: 'Messages' }]);
    }

    let messages = [];
    try { messages = (await N.api('/messages')).messages || []; } catch (e) { N.signaler(e.message); }
    const visibles = M ? M.filtrer(messages, filProf) : messages;
    const brouillon = sansChargement ? { t: (document.getElementById('m-texte') || {}).value || '', c: (document.getElementById('m-contexte') || {}).value || '' } : null;

    afficher(
      entete('Messages', `${messages.length} message(s) · ${N.etat.messagesNonLus} non lu(s)`)
      + (M ? M.barreFils(messages, filProf, 'p-fils-barre') : '')
      + `<div class="p-fil-msg" id="p-fil-msg">${visibles.length ? visibles.map((m) => `
          <div class="p-msg ${m.auteur === 'prof' ? 'moi' : ''}" data-message="${m.id}">
            <div class="p-msg-tete"><b>${m.auteur === 'prof' ? 'Moi' : 'Sterenn'}</b>
              <span>${N.ech(N.dateCourte(m.cree_le))}</span>
              ${m.auteur !== 'prof' && !m.lu_le ? '<span class="p-etat p-etat-fragile">nouveau</span>' : ''}</div>
            ${m.contexte ? `<p class="p-msg-ctx">${N.ech(m.contexte)}</p>` : ''}
            ${m.reponse_a && messages.find((y) => y.id === m.reponse_a) ? `<blockquote class="p-cite">${messages.find((y) => y.id === m.reponse_a).auteur === 'prof' ? 'Moi' : 'Sterenn'} : ${N.ech(court(messages.find((y) => y.id === m.reponse_a).texte, 120))}</blockquote>` : ''}
            ${m.envoyer_le && m.envoyer_le > new Date().toISOString() ? `<p class="p-msg-ctx">⏱ programmé pour ${N.ech(N.dateCourte(m.envoyer_le))} <button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" data-retirer-msg="${m.id}">Retirer</button></p>` : ''}
            <div class="p-msg-texte">${M ? M.formater(m.texte, N.reglage('formatage')) : N.ech(m.texte)}</div>
            ${M ? M.reactionsHTML(m, 'prof', 'p-reactions') : ''}
          </div>`).join('') : `<p class="p-vide">${filProf ? 'Aucun message dans ce fil.' : 'Aucun message pour le moment.'}</p>`}</div>`
      + bloc('Écrire', `
        <form class="p-form" id="p-form-msg">
          <div class="ligne">
            <div><label for="m-fil">Fil</label><select id="m-fil">
              <option value="">Général</option>
              ${PROGRAMME.matieres.map((x) => `<option value="${x.id}" ${filProf === x.id ? 'selected' : ''}>${N.ech(x.nom)}</option>`).join('')}
            </select></div>
            <div><label for="m-contexte">Contexte (facultatif)</label>
              <input id="m-contexte" type="text" maxlength="120" value="${N.ech(brouillon ? brouillon.c : (contexte || ''))}"
                placeholder="par exemple : Mathématiques · Pythagore"></div>
          </div>
          ${M ? M.barreFormatage('p-formatage') : ''}
          <div><label for="m-texte">Message</label>
            <textarea id="m-texte" rows="3" maxlength="2000" required>${N.ech(brouillon ? brouillon.t : '')}</textarea></div>
          <div class="p-modeles">
            <button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" id="m-emojis-btn" aria-expanded="false">${N.ic('ic-emoji')} Émojis</button>
            <select id="m-modele" aria-label="Modèle de message"><option value="">Modèle…</option>${MODELES_MESSAGE.map((t, i) => `<option value="${i}">${N.ech(t.nom)}</option>`).join('')}</select>
            <select id="m-differe" aria-label="Envoyer plus tard"><option value="">Envoyer maintenant</option><option value="soir">Ce soir à 18 h</option><option value="matin">Demain à 8 h</option><option value="lundi">Lundi à 8 h</option></select>
          </div>
          <div class="p-emojis" id="m-emojis" hidden>${M ? M.selecteurEmojis('p-emojis') : ''}</div>
          <button class="p-bouton" type="submit">Envoyer</button>
        </form>`),
      [{ t: 'Échanges' }, { t: 'Messages' }],
    );

    const filMsg = document.getElementById('p-fil-msg');
    filMsg.scrollTop = filMsg.scrollHeight;
    filMsg.querySelectorAll('[data-retirer-msg]').forEach((b) => b.addEventListener('click', async () => { try { await N.api('/messages/' + b.getAttribute('data-retirer-msg'), { method: 'DELETE' }); N.signaler('Message retiré.', 'succes'); vueMessages(null, true); } catch (e) { N.signaler(e.message); } }));
    vue().querySelectorAll('[data-fil]').forEach((b) => b.addEventListener('click', () => {
      filProf = b.getAttribute('data-fil') || null;
      vueMessages(null, true);
    }));
    if (M) {
      const champ = document.getElementById('m-texte');
      M.brancherFormatage(vue(), champ);
      M.brancherReactions(filMsg, () => vueMessages(null, true));
      document.getElementById('m-modele').addEventListener('change', (ev) => {
        const t = MODELES_MESSAGE[Number(ev.target.value)]; if (!t) return;
        const prochaine = N.etat.seances.filter((x) => x.type === 'cours' && x.date >= N.jourIso()).sort((a, b) => a.date.localeCompare(b.date))[0];
        const lecon = prochaine ? (prochaine.lecons || []).map((r) => N.libelleLecon(r)).filter((x) => x && x.m.id !== 'module')[0] : null;
        champ.value = t.texte.replace(/\{date\}/g, prochaine ? N.enFrancais(prochaine.date, true) : 'la prochaine séance').replace(/\{heure\}/g, prochaine ? prochaine.debut : '13 h').replace(/\{lecon\}/g, lecon ? lecon.l.titre : 'la leçon prévue').replace(/\{travail\}/g, (N.etat.seances.filter((x) => x.type === 'travail' && x.date >= N.jourIso()).sort((a, b) => a.date.localeCompare(b.date))[0] || {}).travail || 'le travail annoncé');
        ev.target.value = ''; champ.focus();
      });
      const btnE = document.getElementById('m-emojis-btn');
      const boiteE = document.getElementById('m-emojis');
      btnE.addEventListener('click', () => { boiteE.hidden = !boiteE.hidden; btnE.setAttribute('aria-expanded', String(!boiteE.hidden)); });
      boiteE.querySelectorAll('[data-emoji-insere]').forEach((b) => b.addEventListener('click', () => {
        M.inserer(champ, (champ.value && !/\s$/.test(champ.value.slice(0, champ.selectionStart)) ? ' ' : '') + b.getAttribute('data-emoji-insere') + ' ', '');
      }));
    }

    if (N.etat.messagesNonLus) {
      try {
        await N.api('/messages', { method: 'PATCH' });
        await N.rafraichirEtat();
        nav();
      } catch (e) { /* le marquage peut attendre */ }
    }

    document.getElementById('p-form-msg').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const texte = document.getElementById('m-texte').value.trim();
      if (!texte) return;
      try {
        const quand = document.getElementById('m-differe').value;
        let envoyerLe = null;
        if (quand) { const d = new Date(); if (quand === 'soir') { if (d.getHours() >= 18) d.setDate(d.getDate() + 1); d.setHours(18, 0, 0, 0); } else if (quand === 'matin') { d.setDate(d.getDate() + 1); d.setHours(8, 0, 0, 0); } else { const j = d.getDay(); d.setDate(d.getDate() + ((8 - j) % 7 || 7)); d.setHours(8, 0, 0, 0); } envoyerLe = d.toISOString(); }
        await N.api('/messages', {
          method: 'POST',
          body: JSON.stringify({ texte, contexte: document.getElementById('m-contexte').value.trim() || null, fil: document.getElementById('m-fil').value || null, envoyer_le: envoyerLe }),
        });
        if (envoyerLe) N.signaler('Message programmé pour ' + N.dateCourte(envoyerLe) + '.', 'succes');
        document.getElementById('m-texte').value = '';
        vueMessages(null, true);
      } catch (e) { N.signaler(e.message); }
    });
  }

  /* =======================================================================
     Dépôts de fichiers
     ======================================================================= */
  const MODELES_MESSAGE = [
    { nom: 'Rappel du travail personnel', texte: 'Pour {date}, le travail annoncé est : {travail}. Quinze minutes suffisent, et tu me dis si quelque chose bloque.' },
    { nom: 'Encouragement', texte: 'Ta dernière série sur « {lecon} » montre que la méthode est là. On continue dans ce sens {date}.' },
    { nom: 'Changement d\'horaire', texte: 'La séance de {date} commence à {heure} au lieu de l\'heure habituelle. Rien d\'autre ne change.' },
    { nom: 'Avant la séance', texte: 'Séance de {date} à {heure} : on ouvre « {lecon} ». Prends ton cahier et une calculatrice.' },
  ];
  const MODELES_FELICITATION = [
    'Ton devoir est rendu complet et dans les temps. La consigne est respectée du début à la fin.',
    'Ta rédaction est structurée : une introduction, des paragraphes, une conclusion. Le raisonnement se suit sans effort.',
    'Tes calculs sont posés, chaque étape est écrite. Le résultat est juste et l\'unité est là.',
    'Tu as relu ton travail : pas de faute d\'accord dans le texte. C\'est un acquis.',
  ];

  /** B34 : la copie en grand, zoom, rotation, annotation simple (trait, cercle), renvoi annoté. */
  function visionneuse(id, nom) {
    const el = document.createElement('div'); el.className = 'p-voile-modale p-visionneuse';
    el.innerHTML = `<div class="p-modale p-visionneuse-cadre" role="dialog" aria-label="Copie en grand">
      <div class="p-visionneuse-barre">
        <b>${N.ech(nom || 'Copie')}</b>
        <button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" data-z="-">−</button><span id="p-vz">100 %</span><button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" data-z="+">+</button>
        <button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" data-rot>Tourner</button>
        <span class="p-visionneuse-outils"><button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" data-outil="trait" aria-pressed="true">Trait</button><button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" data-outil="cercle" aria-pressed="false">Cercle</button><button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" data-effacer>Effacer</button></span>
        <button type="button" class="p-bouton p-bouton-mini" data-renvoyer>Renvoyer annotée</button>
        <button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" data-fermer>Fermer</button>
      </div>
      <div class="p-visionneuse-corps"><div class="p-visionneuse-scene" id="p-scene"><img id="p-vimg" alt="" crossorigin="use-credentials"><canvas id="p-vcanvas"></canvas></div></div></div>`;
    document.body.appendChild(el);
    const liberer = N.piegerFocus(el, document.activeElement);
    const fermer = () => { liberer(); el.remove(); };
    const img = el.querySelector('#p-vimg'); const canvas = el.querySelector('#p-vcanvas'); const scene = el.querySelector('#p-scene');
    let zoom = 1; let rot = 0; let outil = 'trait'; const traits = [];
    const ctx = canvas.getContext('2d');
    const dessiner = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.lineWidth = 4; ctx.strokeStyle = '#E5484D'; ctx.lineCap = 'round'; traits.forEach((t) => { ctx.beginPath(); if (t.type === 'cercle') { const r = Math.hypot(t.x2 - t.x1, t.y2 - t.y1); ctx.arc(t.x1, t.y1, r, 0, Math.PI * 2); } else { ctx.moveTo(t.x1, t.y1); ctx.lineTo(t.x2, t.y2); } ctx.stroke(); }); };
    const appliquer = () => { scene.style.transform = `scale(${zoom}) rotate(${rot}deg)`; el.querySelector('#p-vz').textContent = Math.round(zoom * 100) + ' %'; };
    img.addEventListener('load', () => { canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; canvas.style.width = img.width + 'px'; canvas.style.height = img.height + 'px'; appliquer(); });
    img.src = '/api/fichiers/' + id;
    const point = (ev) => { const r = canvas.getBoundingClientRect(); const p = ev.touches ? ev.touches[0] : ev; return { x: (p.clientX - r.left) / r.width * canvas.width, y: (p.clientY - r.top) / r.height * canvas.height }; };
    let courant = null;
    canvas.addEventListener('pointerdown', (ev) => { const p = point(ev); courant = { type: outil, x1: p.x, y1: p.y, x2: p.x, y2: p.y }; traits.push(courant); });
    canvas.addEventListener('pointermove', (ev) => { if (!courant) return; const p = point(ev); courant.x2 = p.x; courant.y2 = p.y; dessiner(); });
    ['pointerup', 'pointerleave'].forEach((t) => canvas.addEventListener(t, () => { courant = null; }));
    el.querySelectorAll('[data-z]').forEach((b) => b.addEventListener('click', () => { zoom = Math.min(4, Math.max(0.4, zoom + (b.getAttribute('data-z') === '+' ? 0.25 : -0.25))); appliquer(); }));
    el.querySelector('[data-rot]').addEventListener('click', () => { rot = (rot + 90) % 360; appliquer(); });
    el.querySelectorAll('[data-outil]').forEach((b) => b.addEventListener('click', () => { outil = b.getAttribute('data-outil'); el.querySelectorAll('[data-outil]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); }));
    el.querySelector('[data-effacer]').addEventListener('click', () => { traits.length = 0; dessiner(); });
    el.querySelector('[data-fermer]').addEventListener('click', fermer);
    el.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') fermer(); });
    el.querySelector('[data-renvoyer]').addEventListener('click', async () => {
      const sortie = document.createElement('canvas'); sortie.width = canvas.width; sortie.height = canvas.height;
      const c = sortie.getContext('2d'); c.drawImage(img, 0, 0); c.drawImage(canvas, 0, 0);
      sortie.toBlob(async (blob) => {
        if (!blob) { N.signaler('Impossible de préparer l\'image annotée.'); return; }
        const d = new FormData(); d.append('fichier', new File([blob], 'annotee-' + (nom || 'copie').replace(/\.[a-z]+$/i, '') + '.png', { type: 'image/png' })); d.append('note', 'Copie annotée par Bastien');
        try { await N.api('/fichiers', { method: 'POST', body: d }); N.signaler('Copie annotée renvoyée à Sterenn.', 'succes'); fermer(); vueDepots(); } catch (e) { N.signaler(e.message); }
      }, 'image/png');
    });
  }

  async function vueDepots() {
    afficher(entete('Dépôts', 'Ce que Sterenn rend, et ce que je lui transmets.')
      + N.squelette('serie'), [{ t: 'Échanges' }, { t: 'Dépôts' }]);

    let donnees = { fichiers: [], stockage: true };
    try { donnees = await N.api('/fichiers'); } catch (e) { N.signaler(e.message); }
    const fichiers = donnees.fichiers || [];
    const delle = fichiers.filter((f) => f.auteur === 'eleve');
    const felicite = new Set((N.etat.felicitations || []).map((x) => x.fichier_id).filter(Boolean));

    afficher(
      entete('Dépôts', `${fichiers.length} fichier(s) · ${delle.length} déposé(s) par Sterenn`)
      + (donnees.stockage ? '' : '<p class="p-bandeau p-bandeau-erreur" style="border-radius:7px;margin-bottom:.85rem">Le stockage de fichiers n\'est pas activé sur ce compte : les dépôts sont impossibles.</p>')
      + '<div class="p-grille2"><div>'
      + bloc('Ce qui a été déposé',
        fichiers.length
          ? `<ul class="p-fichiers">${fichiers.map((f) => `<li>
              <span class="ic" aria-hidden="true">${String(f.type).indexOf('image') === 0 ? '🖼' : '📄'}</span>
              <span class="c">
                <a href="/api/fichiers/${f.id}" download>${N.ech(f.nom)}</a>
                <span>${f.auteur === 'eleve' ? 'Sterenn' : 'Moi'} · ${N.ech(N.dateCourte(f.cree_le))} · ${N.ech(N.poids(f.taille))}${f.note ? ' · ' + N.ech(f.note) : ''}${(() => { const fe = (N.etat.felicitations || []).find((x) => x.fichier_id === f.id); return fe ? (fe.vu_le ? ' · félicitation vue le ' + N.ech(N.dateCourte(fe.vu_le)) : ' · félicitation pas encore vue') : ''; })()}</span>
              </span>
              ${String(f.type).indexOf('image') === 0 ? `<button class="p-bouton p-bouton-fantome p-bouton-mini" data-voir="${f.id}" data-nom="${N.ech(f.nom)}" type="button">Voir en grand</button>` : ''}
              ${f.auteur === 'eleve' && f.ref && N.matiere(f.matiere) ? `<a class="p-bouton p-bouton-fantome p-bouton-mini" href="#/lecon/${N.ech(f.matiere)}/${N.ech(f.ref)}/evaluation" title="Noter cette copie avec la grille">Noter</a>` : ''}
              ${f.auteur === 'eleve' ? `<button class="p-bouton p-bouton-mini" data-feliciter="${f.id}" data-matiere="${N.ech(f.matiere || '')}" data-ref="${N.ech(f.ref || '')}" type="button">${felicite.has(f.id) ? '🏆 Félicitée' : 'Féliciter'}</button>` : ''}
              <button class="p-bouton p-bouton-danger p-bouton-mini" data-fichier="${f.id}" type="button">Supprimer</button>
            </li>`).join('')}</ul>`
          : '<p class="p-vide">Aucun fichier déposé. Demande une photo du cahier par <a href="#/messages">message</a>, ou transmets un document ci-contre.</p>',
        fichiers.length ? String(fichiers.length) : '')
      + '</div><div>'
      + bloc('Féliciter Sterenn', `
        <form class="p-form" id="p-form-feliciter">
          <p class="p-aide">Pour un devoir rendu, sur l'écran ou sur papier. Le mot s'affiche sur son accueil, dans ses réussites et dans les messages. Il vaut une étoile. Nomme l'acquis, pas l'effort.</p>
          <input type="hidden" id="f-fichier" value="">
          <div class="p-modeles">${MODELES_FELICITATION.map((t, i) => `<button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" data-modele="${i}">${N.ech(t.slice(0, 38))}…</button>`).join('')}</div>
          <div><label for="f-texte">Le mot</label><textarea id="f-texte" rows="3" maxlength="600" required placeholder="Ta rédaction est structurée en trois parties, avec une thèse claire dès l'introduction."></textarea></div>
          <div class="ligne">
            <div><label for="f-matiere">Matière</label><select id="f-matiere">
              <option value="">aucune</option>
              ${PROGRAMME.matieres.map((m) => `<option value="${m.id}">${N.ech(m.nom)}</option>`).join('')}
            </select></div>
            <div><label for="f-ref">Leçon</label><input id="f-ref" type="text" maxlength="10" placeholder="L08"></div>
          </div>
          <p class="p-aide" id="f-cible"></p>
          <button class="p-bouton" type="submit">Envoyer les félicitations</button>
        </form>`)
      + bloc('Transmettre un fichier', `
        <form class="p-form" id="p-form-depot">
          <div><label for="d-fichier">Fichier</label><input id="d-fichier" type="file" required></div>
          <div class="ligne">
            <div><label for="d-matiere">Matière</label><select id="d-matiere">
              <option value="">aucune</option>
              ${PROGRAMME.matieres.map((m) => `<option value="${m.id}">${N.ech(m.nom)}</option>`).join('')}
            </select></div>
            <div><label for="d-ref">Leçon</label><input id="d-ref" type="text" maxlength="10" placeholder="L08"></div>
          </div>
          <div><label for="d-note">Note</label><input id="d-note" type="text" maxlength="300" placeholder="à quoi sert ce fichier"></div>
          <button class="p-bouton" type="submit">Envoyer</button>
          <p class="p-aide">15 Mo maximum. Images, PDF, texte et documents bureautiques.</p>
        </form>`)
      + '</div></div>',
      [{ t: 'Échanges' }, { t: 'Dépôts' }],
    );

    vue().querySelectorAll('[data-voir]').forEach((b) => b.addEventListener('click', () => visionneuse(b.getAttribute('data-voir'), b.getAttribute('data-nom'))));
    vue().querySelectorAll('[data-feliciter]').forEach((b) => b.addEventListener('click', () => {
      document.getElementById('f-fichier').value = b.getAttribute('data-feliciter');
      document.getElementById('f-matiere').value = b.getAttribute('data-matiere') || '';
      document.getElementById('f-ref').value = b.getAttribute('data-ref') || '';
      const nom = b.closest('li').querySelector('a').textContent;
      document.getElementById('f-cible').textContent = 'Pour le dépôt « ' + nom + ' ».';
      document.getElementById('f-texte').focus();
      document.getElementById('p-form-feliciter').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }));
    vue().querySelectorAll('[data-modele]').forEach((b) => b.addEventListener('click', () => {
      document.getElementById('f-texte').value = MODELES_FELICITATION[Number(b.getAttribute('data-modele'))];
      document.getElementById('f-texte').focus();
    }));
    document.getElementById('p-form-feliciter').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const texte = document.getElementById('f-texte').value.trim();
      if (!texte) return;
      try {
        const f = await N.api('/felicitations', { method: 'POST', body: JSON.stringify({
          texte, matiere: document.getElementById('f-matiere').value || null,
          ref: document.getElementById('f-ref').value.trim() || null,
          fichier_id: document.getElementById('f-fichier').value || null,
        }) });
        await N.rafraichirEtat();
        vueDepots();
        if (f && f.id) annulable('Félicitations envoyées à Sterenn : une étoile de plus pour elle.', async () => { await N.api('/felicitations/' + f.id, { method: 'DELETE' }); await N.rafraichirEtat(); vueDepots(); });
        else N.signaler('Félicitations envoyées à Sterenn : une étoile de plus pour elle.', 'succes');
      } catch (e) { N.signaler(e.message); }
    });

    vue().querySelectorAll('[data-fichier]').forEach((b) => b.addEventListener('click', async () => {
      if (!(await confirmerParMot('supprimer', 'Ce fichier sera supprimé définitivement.'))) return;
      try {
        await N.api('/fichiers/' + b.getAttribute('data-fichier'), { method: 'DELETE' });
        N.signaler('Fichier supprimé.', 'succes');
        vueDepots();
      } catch (e) { N.signaler(e.message); }
    }));

    document.getElementById('p-form-depot').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const champ = document.getElementById('d-fichier');
      if (!champ.files || !champ.files[0]) return;
      const corps = new FormData();
      corps.append('fichier', champ.files[0]);
      corps.append('matiere', document.getElementById('d-matiere').value);
      corps.append('ref', document.getElementById('d-ref').value);
      corps.append('note', document.getElementById('d-note').value);
      try {
        await N.api('/fichiers', { method: 'POST', body: corps });
        N.signaler('Fichier envoyé.', 'succes');
        vueDepots();
      } catch (e) { N.signaler(e.message); }
    });
  }

  /* =======================================================================
     Ressources : matières, leçons, fiches
     ======================================================================= */
  function vueMatieres() {
    const c = N.chiffres();
    afficher(
      entete('Matières', `${PROGRAMME.matieres.length} matières · ${c.total} leçons · ${c.pretes} entièrement rédigées`,
        '<a class="p-bouton p-bouton-fantome" href="#/programme">Programme officiel</a>')
      + '<div class="p-grille3">'
      + PROGRAMME.matieres.map((m) => {
        const p = N.progression(m);
        const pretes = m.lecons.filter((l) => (l.docs || []).length === 4).length;
        return bloc(m.icone + ' ' + m.nom, `
          <ul class="p-kpis" style="margin:0 0 .5rem">
            <li class="pos"><span class="v">${p.faites}</span><span class="l">validées</span></li>
            <li><span class="v">${m.lecons.length}</span><span class="l">leçons</span></li>
            <li><span class="v">${pretes}</span><span class="l">rédigées</span></li>
          </ul>
          <p class="p-aide" style="margin-bottom:.5rem">${N.ech((m.themes || []).join(' · '))}</p>
          <div style="display:flex;gap:.3rem;flex-wrap:wrap">
            <a class="p-bouton p-bouton-mini" href="#/matiere/${m.id}">Ouvrir</a>
            ${pretes ? `<a class="p-bouton p-bouton-fantome p-bouton-mini" href="${N.dossierPdf(m.id)}" download>Dossier PDF</a>` : ''}
          </div>`);
      }).join('')
      + '</div>',
      [{ t: 'Ressources' }, { t: 'Matières' }],
    );
  }

  function vueMatiere(mid) {
    const m = N.matiere(mid);
    if (!m) return vueIntrouvable();
    const p = N.progression(m);
    const pretes = m.lecons.filter((l) => (l.docs || []).length === 4).length;

    afficher(
      entete(m.icone + ' ' + m.nom, `${p.faites} validées sur ${m.lecons.length} · ${pretes} leçons entièrement rédigées · ${N.ech(m.horaire || '')}`,
        `${pretes ? `<a class="p-bouton p-bouton-fantome" href="${N.dossierPdf(m.id)}" download>Dossier PDF</a>` : ''}
         <a class="p-bouton p-bouton-fantome" href="#/programme">Programme</a>`)
      + bloc('Les leçons', `
        <label class="p-case"><input type="checkbox" id="m-ouvertes" ${filtreOuvertes ? 'checked' : ''}> Seulement ce que Sterenn a ouvert : fiches lues, séries jouées, avec les dates</label>
        <table class="p-table">
          <thead><tr><th style="width:4rem">Réf.</th><th>Leçon</th><th>Notions</th>
            <th style="width:4rem">Période</th><th style="width:8.5rem">Documents</th>
            <th style="width:11rem">Niveau</th><th style="width:9rem">Accès</th>
            <th style="width:9rem"></th></tr></thead>
          <tbody>${m.lecons.filter((l) => !filtreOuvertes || activiteDe(m.id, l.ref).length).map((l) => {
    const pret = (l.docs || []).length > 0;
    const activite = activiteDe(m.id, l.ref);
    return `<tr>
      <td class="num">${N.ech(l.ref)}</td>
      <td>${pret ? `<a href="#/lecon/${m.id}/${l.ref}">${N.ech(l.titre)}</a>` : N.ech(l.titre)}${activite.length ? `<br><small class="p-faible">${activite.map(N.ech).join(' · ')}</small>` : ''}</td>
      <td class="p-aide" style="margin:0">${N.ech((l.notions || []).join(' · '))}</td>
      <td class="num">P${l.periode}</td>
      <td class="docs">${pastillesDocs(m.id, l)}</td>
      <td>${choixNiveau(m.id, l.ref)}</td>
      <td>${pret ? choixOuverture(m.id, l.ref) : '<span class="p-puce">à rédiger</span>'}</td>
      <td>${pret ? `<a class="p-bouton p-bouton-fantome p-bouton-mini" href="#/lecon/${m.id}/${l.ref}">Lire</a>` : ''}
        ${N.banque(m.id, l.ref) ? `<a class="p-bouton p-bouton-fantome p-bouton-mini" href="#/exos/${m.id}/${l.ref}">Exos</a>` : ''}</td>
    </tr>`;
  }).join('')}</tbody>
        </table>`, m.lecons.length + ' leçon(s)'),
      [{ t: 'Ressources' }, { t: 'Matières', h: '#/matieres' }, { t: m.nom }],
    );
    brancherNiveaux(() => vueMatiere(mid));
    brancherOuvertures(() => vueMatiere(mid));
    document.getElementById('m-ouvertes').addEventListener('change', (ev) => { filtreOuvertes = ev.target.checked; vueMatiere(mid); });
    return undefined;
  }
  let filtreOuvertes = false;
  /** Ce que Sterenn a fait sur une leçon : fiches lues et séries, datées. */
  function activiteDe(mid, ref) {
    const cle = N.cle(mid, ref); const sortie = [];
    N.TYPES_DOC.forEach((t) => { const f = N.etat.fiches[cle + '/' + t.id]; if (f) sortie.push(`${t.libelle.toLowerCase()} lu le ${N.dateCourte(f.termine_le).slice(0, 5)}`); });
    const r = N.etat.resultats[cle]; if (r) sortie.push(`série ${r.meilleur}/${r.total} le ${N.dateCourte(r.maj_le).slice(0, 5)}`);
    return sortie;
  }

  function vueLecon(mid, ref, type) {
    const m = N.matiere(mid);
    const l = N.lecon(m, ref);
    if (!m || !l) return vueIntrouvable();
    if (!(l.docs || []).length) {
      return afficher(entete(l.titre, m.icone + ' ' + N.ech(m.nom))
        + bloc('Contenu', '<p class="p-vide">Cette leçon est déclarée dans le programme mais ses quatre documents ne sont pas encore rédigés.</p>'),
      [{ t: 'Ressources' }, { t: 'Matières', h: '#/matieres' }, { t: m.nom, h: '#/matiere/' + mid }, { t: l.titre }]);
    }

    const actif = l.docs.indexOf(type) !== -1 ? type : l.docs[0];
    afficher(entete(l.titre, '') + N.squelette('fiche'),
      [{ t: 'Ressources' }, { t: 'Matières', h: '#/matieres' }, { t: m.nom, h: '#/matiere/' + mid }, { t: l.titre }]);

    N.chargerContenu(mid).then((contenu) => {
      const doc = contenu && contenu[ref] && contenu[ref][actif];
      if (!doc) {
        return afficher(entete(l.titre, '') + bloc('Contenu', '<p class="p-vide">Cette fiche n\'a pas pu être chargée.</p>'),
          [{ t: 'Ressources' }, { t: m.nom, h: '#/matiere/' + mid }, { t: l.titre }]);
      }
      const cleFiche = N.cle(mid, ref) + '/' + actif;
      const lue = N.etat.fiches[cleFiche];
      const res = N.etat.resultats[N.cle(mid, ref)];

      afficher(
        entete(doc.titre, `${m.icone} ${N.ech(m.nom)} · ${N.ech(l.ref)} · période ${l.periode}${doc.duree ? ' · ' + N.ech(doc.duree) : ''}`,
          `<a class="p-bouton p-bouton-fantome" href="#/matiere/${mid}">Retour à la matière</a>
           <a class="p-bouton p-bouton-fantome" href="${N.dossierPdf(mid)}" download>Dossier PDF</a>`)
        + `<div class="p-lecteur">
            <div class="p-lecteur-corps">
              <nav class="p-onglets">${l.docs.map((t) => {
          const info = N.TYPES_DOC.find((x) => x.id === t);
          return `<a href="#/lecon/${mid}/${ref}/${t}" class="${t === actif ? 'actif' : ''}">${N.ic(info.ico)} ${info.libelle}</a>`;
        }).join('')}${N.banque(mid, ref) ? `<a href="#/exos/${mid}/${ref}">${N.ic('ic-cible')} Série d'exercices</a>` : ''}<a href="/cahiers/${mid}/${ref}.html" target="_blank" rel="noopener">${N.ic('ic-crayon')} Cahier à imprimer</a></nav>
          <p class="p-eval-acces">${(() => { const d = N.decisionAcces(N.cle(mid, ref) + '/evaluation'); const a = N.etat.acces[N.cle(mid, ref) + '/evaluation']; return d === true
            ? `<span class="p-etat p-etat-satisfaisant">évaluation ouverte à Sterenn${a && a.jusqu_au ? ' jusqu\'au ' + N.ech(N.dateCourte(a.jusqu_au)) : ''}</span> <button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" data-eval-acces="fermer">Fermer</button>`
            : `<span class="p-etat p-etat-vide">évaluation fermée</span> <button type="button" class="p-bouton p-bouton-mini" data-eval-acces="ouvrir">Ouvrir l'évaluation pour sept jours</button>`; })()}</p>
              <article class="p-fiche">${doc.html}</article>
            </div>
            <aside class="p-rail">
              <div class="p-rail-bloc">
                <h2>Niveau atteint</h2>
                ${choixNiveau(mid, ref)}
                <h2 style="margin-top:.6rem">Accès de Sterenn</h2>
                ${choixOuverture(mid, ref)}
                <p class="p-aide" style="margin-top:.35rem">${lue ? 'Lue le ' + N.ech(N.dateCourte(lue.termine_le)) : 'Pas encore marquée comme lue.'}</p>
                ${(() => { const t = N.profil('moi.trace.' + N.cle(mid, ref) + '/' + actif, null); const pos = Number(N.profil('moi.diapo.' + N.cle(mid, ref) + '/' + actif, 0)); const CASES = { compris: 'a compris l\'idée principale', exemple: 'saurait refaire l\'exemple guidé', question: 'garde une question pour toi' };
                  return (t ? `<h2 style="margin-top:.6rem">Ce qu'elle retient</h2><blockquote class="p-trace">${t.texte ? `<p>« ${N.ech(t.texte)} »</p>` : ''}${(t.cases || []).length ? `<ul>${t.cases.map((c) => `<li>${N.ech(CASES[c] || c)}</li>`).join('')}</ul>` : ''}<small>${N.ech(N.dateCourte(t.date))}</small></blockquote>` : '')
                    + (pos > 0 && !lue ? `<p class="p-aide">Elle en est à la diapositive ${pos + 1}.</p>` : ''); })()}
                ${res ? `<p class="p-aide">Exercices : ${res.meilleur}/${res.total} au mieux, ${res.series} série(s).</p>` : ''}
              </div>
              ${(doc.plan || []).length ? `<div class="p-rail-bloc"><h2>Plan de la fiche</h2>
                <ol>${doc.plan.map((s) => `<li><a href="#${s.id}">${N.ech(s.texte)}</a></li>`).join('')}</ol></div>` : ''}
              ${(doc.objectifs || []).length ? `<div class="p-rail-bloc"><h2>Objectifs</h2>
                <ul class="p-liste">${doc.objectifs.map((o) => `<li>${N.ech(o)}</li>`).join('')}</ul></div>` : ''}
              ${(doc.competences || []).length ? `<div class="p-rail-bloc"><h2>Compétences</h2>
                <p>${doc.competences.map((x) => `<span class="p-puce">${N.ech(x)}</span>`).join(' ')}</p></div>` : ''}
              <div class="p-rail-bloc"><h2>Ce qu'elle voit</h2>${vueCommeElle(mid, ref, l)}</div>
              <div class="p-rail-bloc"><h2>Points de pause de cette fiche</h2>${(() => { const v = N.profil('pauses.' + cleFiche, null); return `<span class="p-pousse" role="group" aria-label="Pauses de cette fiche"><button type="button" data-pauses-fiche="" aria-pressed="${v === null}" title="Suit le réglage général">réglage</button><button type="button" data-pauses-fiche="1" aria-pressed="${v === true}">avec</button><button type="button" class="non" data-pauses-fiche="0" aria-pressed="${v === false}">sans</button></span>`; })()}</div>
              <div class="p-rail-bloc"><h2>Mes notes de préparation</h2><textarea id="p-prepa" rows="4" maxlength="2000" placeholder="Visible de toi seul : ce que tu veux dire, l'exemple à prendre, le piège à montrer.">${N.ech(N.profil('prepa.' + cleFiche, '') || '')}</textarea><p class="p-aide" id="p-prepa-etat"></p></div>
              <div class="p-rail-bloc"><h2>Historique du niveau</h2><div id="p-journal"><p class="p-aide">Chargement…</p></div></div>
              <div class="p-rail-bloc"><h2>Actions</h2>
                <p><button class="p-bouton p-bouton-fantome p-bouton-mini" id="p-question" type="button">Écrire à Sterenn</button></p>
                <p style="margin-top:.35rem"><a class="p-bouton p-bouton-fantome p-bouton-mini"
                  href="#/mois">Placer dans une séance</a></p>
                <p style="margin-top:.35rem"><button class="p-bouton p-bouton-fantome p-bouton-mini" id="p-reprise" type="button" title="Crée un temps de travail personnel dans trois semaines avec cette leçon">Reprendre dans trois semaines</button></p>
              </div>
            </aside>
          </div>`,
        [{ t: 'Ressources' }, { t: 'Matières', h: '#/matieres' }, { t: m.nom, h: '#/matiere/' + mid }, { t: l.titre }],
      );

      brancherNiveaux(() => vueLecon(mid, ref, actif));
      brancherOuvertures(() => vueLecon(mid, ref, actif));
      document.getElementById('p-question').addEventListener('click', () => {
        location.hash = '#/messages/' + encodeURIComponent(m.nom + ' · ' + l.titre);
      });
      // B10 : l'historique daté des positionnements
      N.api('/suivi?cle=' + encodeURIComponent(N.cle(mid, ref))).then((d) => {
        const z = document.getElementById('p-journal'); if (!z) return;
        const LIB = { decision: 'décision', serie: 'série', devoir: 'devoir', reprise: 'reprise', proposition: 'proposition acceptée', positionnement: 'positionnement' };
        z.innerHTML = (d.journal || []).length ? `<ul class="p-journal">${d.journal.map((j) => `<li><time>${N.ech(N.dateCourte(j.quand))}</time> ${N.ech((N.NIVEAUX.find((n) => n.id === j.avant) || { libelle: 'non évaluée' }).libelle)} → <b>${N.ech((N.NIVEAUX.find((n) => n.id === j.apres) || { libelle: 'non évaluée' }).libelle)}</b> <small>${N.ech(LIB[j.raison] || j.raison || '')}</small></li>`).join('')}</ul>` : '<p class="p-aide">Aucun changement enregistré.</p>';
      }).catch(() => { const z = document.getElementById('p-journal'); if (z) z.innerHTML = '<p class="p-aide">Historique indisponible.</p>'; });
      // B11 : reprise planifiée
      document.getElementById('p-reprise').addEventListener('click', async () => {
        const cible = N.decaler(N.jourIso(), 21);
        const jour = new Date(cible + 'T12:00:00').getDay();
        const mardi = N.decaler(cible, jour <= 2 ? 2 - jour : 9 - jour);
        try {
          await N.api('/seances', { method: 'POST', body: JSON.stringify({ date: mardi, creneau: 'A', type: 'travail', debut: '17:00', fin: '17:20', lecons: [N.cle(mid, ref)], matieres: [mid], objectif: 'Reprise : ' + l.titre, travail: `Reprendre « ${l.titre} » : relire la fiche de révision, refaire la série.` }) });
          await N.rafraichirSeances();
          N.signaler('Reprise placée le ' + N.enFrancais(mardi, true) + ' en temps personnel.', 'succes');
        } catch (e) { N.signaler(e.message); }
      });
      brancherGrille(mid, ref, doc, actif);
      // B36 : pauses de cette fiche
      vue().querySelectorAll('[data-pauses-fiche]').forEach((b) => b.addEventListener('click', async () => {
        const v = b.getAttribute('data-pauses-fiche');
        try { await N.enregistrerProfil('pauses.' + cleFiche, v === '' ? null : v === '1'); vue().querySelectorAll('[data-pauses-fiche]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); N.signaler('Pauses de la fiche : ' + (v === '' ? 'réglage général' : v === '1' ? 'affichées' : 'masquées') + '.', 'succes'); } catch (e) { N.signaler(e.message); }
      }));
      // B28 : notes de préparation, enregistrées à la volée
      let attentePrepa = null;
      document.getElementById('p-prepa').addEventListener('input', (ev) => {
        clearTimeout(attentePrepa);
        document.getElementById('p-prepa-etat').textContent = '…';
        attentePrepa = setTimeout(async () => { try { await N.enregistrerProfil('prepa.' + cleFiche, ev.target.value.trim() || null); document.getElementById('p-prepa-etat').textContent = 'Enregistré.'; } catch (e) { document.getElementById('p-prepa-etat').textContent = e.message; } }, 1200);
      });
      vue().querySelectorAll('[data-eval-acces]').forEach((b) => b.addEventListener('click', async () => {
        const ouvrir = b.getAttribute('data-eval-acces') === 'ouvrir';
        try {
          await N.api('/acces', { method: 'PUT', body: JSON.stringify({ cle: N.cle(mid, ref) + '/evaluation', etat: ouvrir ? true : null, jusqu_au: ouvrir ? new Date(Date.now() + 7 * 86400000).toISOString() : null }) });
          await N.rafraichirEtat(); N.signaler(ouvrir ? 'Évaluation ouverte à Sterenn pour sept jours.' : 'Évaluation fermée.', 'succes'); vueLecon(mid, ref, actif);
        } catch (e) { N.signaler(e.message); }
      }));
      return undefined;
    });
    return undefined;
  }

  /** B25 : ce que Sterenn voit de cette leçon, document par document, avec la raison. */
  function vueCommeElle(mid, ref, l) {
    const cle = N.cle(mid, ref);
    const verrou = N.etat.verrous[cle];
    const ouverte = typeof verrou === 'boolean' ? verrou : (N.decision(mid, ref) === 1 ? true : N.decision(mid, ref) === 0 ? false : N.reglementaire(mid, ref));
    const docs = ['cours', 'revision', 'exercices', 'evaluation'].filter((t) => (l.docs || []).indexOf(t) !== -1 || t === 'evaluation');
    const ligne = (t) => { const ok = ouverte && N.accesDoc(mid, ref, t); const info = N.TYPES_DOC.find((x) => x.id === t) || { libelle: t }; return `<li><span class="${ok ? 'p-ok' : 'p-faible'}">${ok ? '✓' : '✕'}</span> ${N.ech(info.libelle)}${t === 'evaluation' && ok ? '<small class="p-faible"> (ouverte)</small>' : ''}</li>`; };
    return `<ul class="p-comme-elle">${docs.map(ligne).join('')}<li><span class="${ouverte && N.accesDoc(mid, ref, 'serie') && N.banque(mid, ref) ? 'p-ok' : 'p-faible'}">${ouverte && N.accesDoc(mid, ref, 'serie') && N.banque(mid, ref) ? '✓' : '✕'}</span> Série d'exercices</li></ul>
      <p class="p-aide">${ouverte ? 'La leçon est ouverte dans son parcours.' : 'La leçon est verrouillée pour elle : ' + N.ech(N.raisonVerrou(mid, ref))}</p>`;
  }

  /** B12 : la grille d'évaluation remplissable en ligne, avec l'auto-positionnement de Sterenn en regard. */
  function grilleEnLigne(mid, ref, doc) {
    const bac = document.createElement('div'); bac.innerHTML = doc.html;
    const table = [...bac.querySelectorAll('table')].find((t) => /crit/i.test(((t.querySelector('thead th') || t.querySelector('tr th, tr td')) || {}).textContent || ''));
    const criteres = table ? [...table.querySelectorAll('tbody tr')].map((tr) => { const td = tr.querySelector('td'); return td ? td.textContent.trim().replace(/^\d+\.\s*/, '') : ''; }).filter(Boolean).slice(0, 10) : [];
    if (!criteres.length) return '';
    const cle = N.cle(mid, ref);
    const r = N.profil('eval.' + cle, {}) || {};
    const auto = N.profil('moi.autoeval.' + cle, {}) || {};
    const nivDe = (i) => (Array.isArray(r.criteres) && r.criteres[i] ? r.criteres[i].niveau : '');
    return `<form class="p-form p-grille-ligne" id="p-grille" data-cle="${cle}">
      <h2>Corriger avec la grille</h2>
      <p class="p-aide">Un clic par critère. La colonne « elle » montre ce que Sterenn a coché avant la correction. Enregistrer rend le résultat visible dans son application, sur la page de l'évaluation.</p>
      <table class="p-table"><thead><tr><th>Critère</th>${N.NIVEAUX.map((n) => `<th>${n.picto} ${N.ech(n.libelle)}</th>`).join('')}<th>Elle</th></tr></thead><tbody>
      ${criteres.map((c, i) => `<tr><td>${i + 1}. ${N.ech(c)}</td>${N.NIVEAUX.map((n) => `<td class="p-grille-case"><label><input type="radio" name="g-${i}" value="${n.id}" ${nivDe(i) === n.id ? 'checked' : ''}><span class="visuellement-cache">${N.ech(n.libelle)}</span></label></td>`).join('')}<td>${auto[i] ? `<span class="p-etat p-etat-${auto[i]}">${N.ech((N.NIVEAUX.find((n) => n.id === auto[i]) || {}).libelle || auto[i])}</span>` : '<span class="p-faible">·</span>'}</td></tr>`).join('')}
      </tbody></table>
      <div class="ligne">
        <div><label for="g-note">Note sur 20</label><input id="g-note" type="number" min="0" max="20" step="0.5" value="${r.note != null ? N.ech(String(r.note)) : ''}"></div>
        <div><label for="g-pos">Positionnement global</label><select id="g-pos"><option value="">à choisir</option>${N.NIVEAUX.map((n) => `<option value="${n.id}" ${r.positionnement === n.id ? 'selected' : ''}>${N.ech(n.libelle)}</option>`).join('')}</select></div>
      </div>
      <div><label for="g-mot">Le mot pour Sterenn</label><textarea id="g-mot" rows="2" maxlength="600">${N.ech(r.mot || '')}</textarea></div>
      <div><label for="g-refaire">Ce qu'elle refait</label><input id="g-refaire" type="text" maxlength="300" value="${N.ech(r.refaire || '')}"></div>
      <label class="p-case"><input type="checkbox" id="g-suivi" checked> Reporter le positionnement global dans le suivi des acquis (raison : devoir)</label>
      <div class="p-seance-actions"><button class="p-bouton" type="submit">${r.rendu_le ? 'Mettre à jour le résultat' : 'Rendre le résultat à Sterenn'}</button>${r.rendu_le ? `<span class="p-aide">Rendu le ${N.ech(N.dateCourte(r.rendu_le))}.</span>` : ''}</div>
    </form>`;
  }
  function brancherGrille(mid, ref, doc, actif) {
    if (actif !== 'evaluation') return;
    const fiche = vue().querySelector('.p-fiche'); if (!fiche) return;
    const html = grilleEnLigne(mid, ref, doc); if (!html) return;
    fiche.insertAdjacentHTML('beforebegin', html);
    const f = document.getElementById('p-grille');
    f.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const cle = f.getAttribute('data-cle');
      const criteres = [...f.querySelectorAll('tbody tr')].map((tr) => ({ libelle: tr.querySelector('td').textContent.replace(/^\d+\.\s*/, '').trim(), niveau: (tr.querySelector('input:checked') || {}).value || null }));
      const note = document.getElementById('g-note').value; const positionnement = document.getElementById('g-pos').value;
      try {
        await N.enregistrerProfil('eval.' + cle, { criteres, note: note === '' ? null : Number(note), positionnement: positionnement || null, mot: document.getElementById('g-mot').value.trim(), refaire: document.getElementById('g-refaire').value.trim(), rendu_le: new Date().toISOString() });
        if (document.getElementById('g-suivi').checked && positionnement) await N.api('/suivi', { method: 'PUT', body: JSON.stringify({ matiere: mid, ref, niveau: positionnement, raison: 'devoir' }) });
        await N.api('/messages', { method: 'POST', body: JSON.stringify({ texte: `Ton évaluation « ${N.lecon(N.matiere(mid), ref).titre} » est corrigée : le résultat est sur la page de l'évaluation.`, contexte: 'Évaluation corrigée', fil: mid }) }).catch(() => {});
        await N.rafraichirEtat(); N.signaler('Résultat rendu à Sterenn.', 'succes'); vueLecon(mid, ref, actif);
      } catch (e) { N.signaler(e.message); }
    });
  }

  /* =======================================================================
     Série d'exercices : l'aperçu du côté professeur
     ======================================================================= */
  function vueExos(mid, ref) {
    if (!window.EXERCICES) {
      afficher(entete('Série d\'exercices', '') + '<p class="p-vide">Chargement de la série…</p>', [{ t: 'Matières', h: '#/matieres' }, { t: 'Série' }]);
      N.chargerBanque().then(() => vueExos(mid, ref)).catch((e) => N.signaler(e.message));
      return undefined;
    }
    const m = N.matiere(mid);
    const l = N.lecon(m, ref);
    const banque = N.banque(mid, ref);
    const serie = banque && Array.isArray(banque.items) ? banque.items : null;
    if (!m || !l || !serie) return vueIntrouvable();
    const res = N.etat.resultats[N.cle(mid, ref)];

    afficher(
      entete('Série d\'exercices : ' + (banque.titre || l.titre), `${serie.length} question(s) · ${m.icone} ${N.ech(m.nom)}`,
        `<a class="p-bouton p-bouton-fantome" href="#/lecon/${mid}/${ref}">Voir la fiche</a>`)
      + (res ? `<ul class="p-kpis">
          <li class="pos"><span class="v">${res.meilleur}/${res.total}</span><span class="l">meilleur score</span></li>
          <li><span class="v">${res.justes}/${res.total}</span><span class="l">dernier passage</span></li>
          <li><span class="v">${res.series}</span><span class="l">série(s) faites</span></li>
          <li><span class="v">${N.ech(N.dateCourte(res.maj_le).slice(0, 5))}</span><span class="l">dernière fois</span></li>
        </ul>` : '<p class="p-aide" style="margin-bottom:.85rem">Sterenn n\'a pas encore fait cette série.</p>')
      + bloc('Les questions et leurs corrigés', `
        <table class="p-table">
          <thead><tr><th style="width:3rem">#</th><th style="width:6rem">Type</th><th>Question</th>
            <th style="width:12rem">Réponse attendue</th><th>Explication</th></tr></thead>
          <tbody>${serie.map((q, i) => `<tr data-question="${i}">
            <td class="num">${i + 1}${N.profil('question.' + N.cle(mid, ref) + '/' + i, null) ? '<br><span class="p-puce">modifiée</span>' : ''}${i >= (window.EXERCICES[N.cle(mid, ref)] || { items: [] }).items.length ? '<br><span class="p-puce">ajoutée</span>' : ''}</td>
            <td><span class="p-puce">${N.ech(q.type || 'qcm')}</span></td>
            <td>${q.q || ''}</td>
            <td>${N.ech(reponseAttendue(q))}</td>
            <td class="p-aide" style="margin:0">${N.ech(q.explication || '')}<br><button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" data-modifier="${i}">Modifier</button></td>
          </tr>`).join('')}</tbody>
        </table>`, serie.length + ' question(s)', '<button type="button" class="p-bouton p-bouton-mini" id="q-ajouter">Ajouter une question</button>'),
      [{ t: 'Ressources' }, { t: 'Matières', h: '#/matieres' }, { t: m.nom, h: '#/matiere/' + mid }, { t: 'Exercices' }],
    );
    const cle = N.cle(mid, ref);
    const nOrigine = (window.EXERCICES[cle] || { items: [] }).items.length;
    const formulaireQuestion = (q, i) => `<form class="p-form p-question-form" data-form-question="${i == null ? '' : i}">
      <div class="ligne"><div><label>Type</label><select name="type"><option value="qcm" ${(q.type || 'qcm') === 'qcm' ? 'selected' : ''}>qcm</option><option value="vraifaux" ${q.type === 'vraifaux' ? 'selected' : ''}>vrai ou faux</option><option value="saisie" ${q.type === 'saisie' ? 'selected' : ''}>saisie</option></select></div></div>
      <div><label>Question</label><input name="q" type="text" maxlength="400" required value="${N.ech(q.q || '')}"></div>
      <div><label>Propositions (qcm : une par ligne, la bonne en premier ; saisie : les réponses acceptées, une par ligne)</label><textarea name="choix" rows="4">${N.ech(q.type === 'saisie' ? (q.reponses || []).join('\n') : q.type === 'vraifaux' ? (q.reponse === true ? 'Vrai' : 'Faux') : (q.choix ? [q.choix[q.reponse]].concat(q.choix.filter((_, k) => k !== q.reponse)) : []).join('\n'))}</textarea></div>
      <div><label>Explication (ce qu'une réponse fausse doit apprendre)</label><textarea name="explication" rows="2" maxlength="600">${N.ech(q.explication || '')}</textarea></div>
      <div class="p-seance-actions"><button class="p-bouton p-bouton-mini" type="submit">Enregistrer</button><button class="p-bouton p-bouton-fantome p-bouton-mini" type="button" data-fermer>Annuler</button>${i != null && N.profil('question.' + cle + '/' + i, null) ? `<button class="p-bouton p-bouton-danger p-bouton-mini" type="button" data-retablir="${i}">Rétablir l'original</button>` : ''}${i != null && i >= nOrigine ? `<button class="p-bouton p-bouton-danger p-bouton-mini" type="button" data-supprimer-q="${i}">Supprimer</button>` : ''}</div></form>`;
    const lireForm = (f) => {
      const type = f.type.value; const lignes = f.choix.value.split('\n').map((x) => x.trim()).filter(Boolean);
      const q = { type, q: f.q.value.trim(), explication: f.explication.value.trim() };
      if (type === 'qcm') { if (lignes.length < 2) throw new Error('Un qcm demande au moins deux propositions.'); const bonne = lignes[0]; const melange = lignes.slice(); q.choix = melange; q.reponse = melange.indexOf(bonne); }
      else if (type === 'vraifaux') q.reponse = /^v/i.test(lignes[0] || 'vrai');
      else { if (!lignes.length) throw new Error('Une saisie demande au moins une réponse acceptée.'); q.reponses = lignes; }
      return q;
    };
    const ouvrirForm = (i) => {
      vue().querySelectorAll('.p-question-form').forEach((f) => f.closest('tr, .p-question-hote') && (f.closest('tr') ? f.closest('tr').remove() : f.remove()));
      const q = i == null ? { type: 'qcm' } : serie[i];
      const html = formulaireQuestion(q, i);
      if (i == null) { const hote = document.createElement('div'); hote.className = 'p-question-hote'; hote.innerHTML = html; vue().querySelector('.p-bloc table').insertAdjacentElement('beforebegin', hote); }
      else { const tr = document.createElement('tr'); tr.innerHTML = `<td colspan="5">${html}</td>`; vue().querySelector(`tr[data-question="${i}"]`).insertAdjacentElement('afterend', tr); }
      const f = vue().querySelector('.p-question-form');
      f.querySelector('[data-fermer]').addEventListener('click', () => vueExos(mid, ref));
      f.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        try {
          const q = lireForm(f);
          if (i == null || i >= nOrigine) { const liste = (N.profil('questions.' + cle, []) || []).slice(); if (i == null) liste.push(q); else liste[i - nOrigine] = q; await N.enregistrerProfil('questions.' + cle, liste); }
          else await N.enregistrerProfil('question.' + cle + '/' + i, q);
          N.signaler('Question enregistrée : Sterenn la verra à sa prochaine série.', 'succes'); vueExos(mid, ref);
        } catch (e) { N.signaler(e.message); }
      });
      const r = f.querySelector('[data-retablir]'); if (r) r.addEventListener('click', async () => { await N.enregistrerProfil('question.' + cle + '/' + i, null); N.signaler('Question d\'origine rétablie.', 'succes'); vueExos(mid, ref); });
      const sup = f.querySelector('[data-supprimer-q]'); if (sup) sup.addEventListener('click', async () => { const liste = (N.profil('questions.' + cle, []) || []).slice(); liste.splice(i - nOrigine, 1); await N.enregistrerProfil('questions.' + cle, liste.length ? liste : null); N.signaler('Question retirée.', 'succes'); vueExos(mid, ref); });
    };
    vue().querySelectorAll('[data-modifier]').forEach((b) => b.addEventListener('click', () => ouvrirForm(Number(b.getAttribute('data-modifier')))));
    document.getElementById('q-ajouter').addEventListener('click', () => ouvrirForm(null));
    return undefined;
  }

  /** Même lecture que l'espace de Sterenn : qcm par index, vraifaux, saisie. */
  function reponseAttendue(q) {
    if (q.type === 'vraifaux') return q.reponse === true ? 'Vrai' : 'Faux';
    if (q.type === 'saisie') return Array.isArray(q.reponses) ? q.reponses[0] : String(q.reponse == null ? '' : q.reponse);
    if (Array.isArray(q.choix)) {
      const i = typeof q.reponse === 'number' ? q.reponse : -1;
      const brut = i >= 0 && q.choix[i] != null ? String(q.choix[i]) : String(q.reponse == null ? '' : q.reponse);
      return brut.replace(/<[^>]+>/g, '');
    }
    return String(q.reponse == null ? '' : q.reponse);
  }

  /* =======================================================================
     Programme officiel
     ======================================================================= */
  function vueProgramme() {
    afficher(
      entete('Programme officiel de 4ᵉ', 'Thèmes, attendus de fin d\'année et compétences, matière par matière. C\'est la référence, pas le plan de travail.',
        '<a class="p-bouton p-bouton-fantome" href="#/matieres">Voir les leçons</a>')
      + PROGRAMME.matieres.map((m) => bloc(m.icone + ' ' + m.nom, `
        <div class="p-grille2">
          <div>
            <h3 style="font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--p-faible);margin-bottom:.3rem">Thèmes</h3>
            <ul class="p-liste">${(m.themes || []).map((t) => `<li>${N.ech(t)}</li>`).join('')}</ul>
            <h3 style="font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--p-faible);margin:.7rem 0 .3rem">Compétences</h3>
            <p>${(m.competences || []).map((x) => `<span class="p-puce">${N.ech(x)}</span>`).join(' ')}</p>
          </div>
          <div>
            <h3 style="font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--p-faible);margin-bottom:.3rem">Attendus de fin d'année</h3>
            <ul class="p-liste">${(m.attendus || []).map((a) => `<li>${N.ech(a)}</li>`).join('')}</ul>
          </div>
        </div>`, `${m.lecons.length} leçons · ${N.ech(m.horaire || '')}`,
      `<a class="p-bouton p-bouton-fantome p-bouton-mini" href="#/matiere/${m.id}" style="margin-left:.5rem">Ouvrir</a>`)).join(''),
      [{ t: 'Ressources' }, { t: 'Programme officiel' }],
    );
  }

  /* =======================================================================
     Dossiers PDF
     ======================================================================= */
  async function vueDocuments() {
    afficher(entete('Dossiers PDF', 'Un dossier complet par matière, plus les documents de pilotage et les outils.')
      + '<p class="p-vide">Chargement…</p>', [{ t: 'Ressources' }, { t: 'Dossiers PDF' }]);

    let fiches = [];
    try { fiches = await (await fetch('fiches.json', { credentials: 'same-origin' })).json(); } catch (e) { fiches = []; }
    const annexes = fiches.filter((f) => /^(00-pilotage|outils)\//.test(f.relatif));

    afficher(
      entete('Dossiers PDF', 'Un dossier complet par matière, plus les documents de pilotage et les outils.')
      + '<div class="p-grille2"><div>'
      + bloc('Par matière', `
        <table class="p-table">
          <thead><tr><th>Matière</th><th style="width:7rem">Leçons rédigées</th><th style="width:7rem"></th></tr></thead>
          <tbody>${PROGRAMME.matieres.map((m) => {
    const pretes = m.lecons.filter((l) => (l.docs || []).length === 4).length;
    return `<tr><td>${m.icone} ${N.ech(m.nom)}</td>
      <td class="num">${pretes}/${m.lecons.length}</td>
      <td>${pretes ? `<a class="p-bouton p-bouton-fantome p-bouton-mini" href="${N.dossierPdf(m.id)}" download>PDF</a>`
    : '<span class="p-puce">à venir</span>'}</td></tr>`;
  }).join('')}</tbody>
        </table>
        <p class="p-aide">Chaque dossier réunit, pour toutes les leçons rédigées de la matière, la fiche de cours,
          la fiche de révision, les exercices corrigés et la grille d'évaluation.</p>`)
      + '</div><div>'
      + bloc('Pilotage et outils',
        annexes.length
          ? `<ul class="p-fichiers">${annexes.map((f) => `<li>
              <span class="ic" aria-hidden="true">${f.relatif.indexOf('outils/') === 0 ? '🧰' : '🧭'}</span>
              <span class="c"><a href="${f.relatif.replace(/\.md$/, '.html')}">${N.ech(f.meta.titre || f.relatif)}</a>
                <span>${N.ech(f.meta.resume || '')}</span></span>
              <a class="p-bouton p-bouton-fantome p-bouton-mini"
                 href="pdf/${f.relatif.replace(/\.md$/, '.pdf')}" download>PDF</a>
            </li>`).join('')}</ul>`
          : '<p class="p-vide">Lance npm run build puis npm run pdf pour produire ces documents.</p>',
        annexes.length ? String(annexes.length) : '')
      + '</div></div>',
      [{ t: 'Ressources' }, { t: 'Dossiers PDF' }],
    );
  }

  /* =======================================================================
     Recherche
     ======================================================================= */
  async function vueRecherche(q) {
    const terme = (q || '').toLowerCase().trim();
    const trouves = [];
    const dansTexte = [];
    if (terme) {
      PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => {
        const foin = [l.ref, l.titre, (l.notions || []).join(' '), m.nom].join(' ').toLowerCase();
        if (foin.indexOf(terme) !== -1) trouves.push({ m, l });
      }));
      // B30 : le texte des fiches, matière par matière (chargé une fois, gardé en mémoire).
      if (terme.length >= 3) {
        afficher(entete('Recherche', 'Dans les titres, les notions et le texte des fiches…') + N.squelette('serie'), [{ t: 'Ressources' }, { t: 'Recherche' }]);
        await Promise.all(PROGRAMME.matieres.map((m) => N.chargerContenu(m.id).catch(() => null)));
        const bac = document.createElement('div');
        const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const nq = norm(terme);
        PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => {
          const contenu = window.CONTENU && window.CONTENU[m.id] && window.CONTENU[m.id][l.ref];
          if (!contenu) return;
          ['cours', 'revision', 'exercices', 'evaluation'].forEach((t) => {
            if (!contenu[t] || dansTexte.length >= 40) return;
            bac.innerHTML = contenu[t].html;
            let titreSection = '';
            [...bac.children].some((el) => {
              if (el.tagName === 'H2') { titreSection = el.textContent.trim(); return false; }
              const texte = el.textContent || ''; const pos = norm(texte).indexOf(nq);
              if (pos === -1) return false;
              dansTexte.push({ m, l, t, section: titreSection, extrait: texte.slice(Math.max(0, pos - 60), pos + 90).replace(/\s+/g, ' ') });
              return true;
            });
          });
        }));
      }
    }
    const info = (t) => (N.TYPES_DOC.find((x) => x.id === t) || { libelle: t }).libelle;
    afficher(
      entete('Recherche', trouves.length || dansTexte.length ? `${trouves.length} leçon(s), ${dansTexte.length} passage(s) pour « ${N.ech(q)} »` : `Rien pour « ${N.ech(q || '')} »`)
      + (dansTexte.length ? bloc('Dans le texte des fiches', `<ul class="p-liste p-resultats-texte">${dansTexte.map((x) => `<li><a href="#/lecon/${x.m.id}/${x.l.ref}/${x.t}">${x.m.icone} ${N.ech(x.l.titre)} · ${N.ech(info(x.t))}${x.section ? ' · ' + N.ech(x.section) : ''}</a><small class="p-faible">…${N.ech(x.extrait)}…</small></li>`).join('')}</ul>`, String(dansTexte.length)) : '')
      + bloc('Leçons', trouves.length ? `
        <table class="p-table">
          <thead><tr><th style="width:4rem">Réf.</th><th>Leçon</th><th>Matière</th><th>Notions</th>
            <th style="width:11rem">Niveau</th></tr></thead>
          <tbody>${trouves.map((x) => `<tr>
            <td class="num">${N.ech(x.l.ref)}</td>
            <td><a href="#/lecon/${x.m.id}/${x.l.ref}">${N.ech(x.l.titre)}</a></td>
            <td>${x.m.icone} ${N.ech(x.m.nom)}</td>
            <td class="p-aide" style="margin:0">${N.ech((x.l.notions || []).join(' · '))}</td>
            <td>${choixNiveau(x.m.id, x.l.ref)}</td></tr>`).join('')}</tbody>
        </table>` : '<p class="p-vide">Essaie un autre mot : un titre de leçon, une notion ou une référence.</p>'),
      [{ t: 'Recherche' }, { t: q || '' }],
    );
    brancherNiveaux(() => vueRecherche(q));
  }

  function vueIntrouvable() {
    afficher(entete('Page introuvable', '')
      + bloc('', '<p class="p-vide">Cette page n\'existe pas. <a href="#/accueil">Revenir à Aujourd\'hui</a></p>'),
    [{ t: 'Page introuvable' }]);
    return undefined;
  }

  /* ---------- Réglages : ce que Sterenn voit ---------------------------------- */
  const REGLAGES_TEXTES = {
    pauses: ['Points de pause dans les fiches',
      'Les blocs « Pause conseillée » qui rythment chaque fiche. Désactivés, ils disparaissent de l\'écran de Sterenn ; ils restent dans les PDF.'],
    tuteur: ['Opale, la tutrice, dans tout l\'espace de Sterenn',
      'Le bouton Opale est présent sur chaque écran. Elle guide sans donner les réponses et connaît le programme et la leçon ouverte.'],
    calculatrice: ['Calculatrice d\'Opale',
      'Une calculatrice simple dans le panneau d\'Opale, disponible par défaut sur tous les écrans.'],
    calculatrice_maths: ['Calculatrice pendant les exercices de mathématiques',
      'Désactivée, Sterenn calcule à la main dans les exercices et les séries de maths ; Opale le lui dit.'],
    calculatrice_evaluation: ['Calculatrice pendant une évaluation',
      'Par défaut coupée : une évaluation se fait sans calculatrice, sauf si tu l\'autorises ici.'],
    reactions: ['Réactions animées sur les messages',
      'Sterenn et toi pouvez réagir à un message avec une petite icône animée.'],
    formatage: ['Mise en forme du texte dans les messages',
      'Gras, italique et listes avec des étoiles et des tirets. Désactivée, les messages restent en texte simple.'],
    fils: ['Fils de discussion par matière',
      'La messagerie propose un fil par matière en plus du fil général.'],
    felicitations: ['Message d\'encouragement automatique',
      'Quand Sterenn réussit une série ou termine un monde 3D, Opale la félicite sur l\'écran, dans la limite d\'un message par réussite.'],
  };

  function vueReglages() {
    const r = N.etat.reglages || {};
    const lignes = Object.keys(REGLAGES_TEXTES).map((c) => {
      const actif = c in r ? !!r[c] : !!N.REGLAGES_DEFAUT[c];
      const [titre, aide] = REGLAGES_TEXTES[c];
      return `<li>
        <div class="p-reglage-texte"><b id="reg-${c}">${N.ech(titre)}</b><span>${N.ech(aide)}</span></div>
        <button type="button" class="p-interrupteur" role="switch" aria-checked="${actif}" aria-labelledby="reg-${c}" data-cle="${c}">
          <span class="p-interrupteur-texte">${actif ? 'Activé' : 'Désactivé'}</span></button>
      </li>`;
    }).join('');
    afficher(entete('Réglages', 'Ce que Sterenn voit dans son espace. Chaque changement s\'applique chez elle en moins de trente secondes.')
      + bloc('Affichage et aides', `<ul class="p-reglages">${lignes}</ul>`)
      + bloc('Sauvegardes de la base', `
        <p class="p-aide">Un instantané de toutes les tables est écrit chaque nuit dans le stockage de fichiers (travail planifié du dépôt). Tu peux en faire un à la main, en télécharger un, ou restaurer un instantané : l'état courant est mis de côté juste avant.</p>
        <p class="p-modeles"><button type="button" class="p-bouton" id="r-sauver">Sauvegarder maintenant</button></p>
        <div id="r-sauvegardes"><p class="p-vide">Chargement…</p></div>`)
      + bloc('Sonde et notifications', `<p class="p-aide">L'espace interroge le serveur à intervalle régulier pour voir les nouveaux messages et réglages. Plus court, plus réactif ; plus long, moins de requêtes.</p>
        <label for="r-sonde">Délai de la sonde</label> <select id="r-sonde">${[20, 30, 45, 60, 90, 120, 180].map((v) => `<option value="${v}" ${Number(N.reglage('sonde')) === v ? 'selected' : ''}>${v} s</option>`).join('')}</select>`)
      + bloc('Affichage du pilotage', `<p class="p-aide">Retenu sur cet appareil, sans effet chez Sterenn.</p>
        <div class="ligne"><div><label for="r-accent">Couleur d'accent</label><select id="r-accent">${[['bleu', 'Bleu'], ['vert', 'Vert opale'], ['prune', 'Prune']].map(([v, t]) => `<option value="${v}" ${(N.lire('opaline.pilotage', {}).accent || 'bleu') === v ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
        <div><label for="r-densite">Densité des tableaux</label><select id="r-densite">${[['confortable', 'Confortable'], ['compacte', 'Compacte']].map(([v, t]) => `<option value="${v}" ${(N.lire('opaline.pilotage', {}).densite || 'confortable') === v ? 'selected' : ''}>${t}</option>`).join('')}</select></div></div>
        <p class="p-aide">Le thème clair ou sombre se change avec le bouton ◐ de la barre du haut. Raccourcis : <kbd>g</kbd> puis <kbd>a</kbd> accueil, <kbd>p</kbd> planning, <kbd>s</kbd> suivi, <kbd>m</kbd> messages, <kbd>d</kbd> dépôts, <kbd>r</kbd> réglages ; <kbd>/</kbd> recherche.</p>`)
      + bloc('Codes d\'accès', `<form class="p-form" id="r-codes">
        <p class="p-aide">Le code se change ici, sans redéploiement. Le code professeur actuel est demandé à chaque fois. Un code fait au moins six caractères : lettres, chiffres, point, tiret. L'ancien code cesse d'ouvrir aussitôt ; les sessions déjà ouvertes restent valides.</p>
        <div class="ligne"><div><label for="c-role">Espace</label><select id="c-role"><option value="eleve">Sterenn</option><option value="prof">Professeur</option></select></div>
        <div><label for="c-actuel">Code professeur actuel</label><input id="c-actuel" type="password" autocomplete="current-password" required></div>
        <div><label for="c-nouveau">Nouveau code</label><input id="c-nouveau" type="text" autocomplete="off" minlength="6" maxlength="64" required></div></div>
        <button class="p-bouton" type="submit">Changer le code</button></form>`),
    [{ t: 'Réglages' }]);
    document.getElementById('r-sonde').addEventListener('change', async (ev) => { try { const d = await N.api('/reglages', { method: 'PUT', body: JSON.stringify({ cle: 'sonde', valeur: Number(ev.target.value) }) }); N.etat.reglages = d.reglages || N.etat.reglages; N.signaler('Sonde : toutes les ' + ev.target.value + ' secondes.', 'succes'); } catch (e) { N.signaler(e.message); } });
    document.getElementById('r-accent').addEventListener('change', (ev) => N.appliquerPilotage({ accent: ev.target.value }));
    document.getElementById('r-densite').addEventListener('change', (ev) => N.appliquerPilotage({ densite: ev.target.value }));
    document.getElementById('r-codes').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const role = document.getElementById('c-role').value;
      if (!(await confirmerParMot('changer', `Le code de l'espace ${role === 'prof' ? 'professeur' : 'de Sterenn'} va être remplacé.`))) return;
      try {
        await N.api('/codes', { method: 'PUT', body: JSON.stringify({ role, actuel: document.getElementById('c-actuel').value, nouveau: document.getElementById('c-nouveau').value }) });
        N.signaler('Code changé. Note-le quelque part de sûr.', 'succes'); document.getElementById('r-codes').reset();
      } catch (e) { N.signaler(e.message); }
    });
    const listerSauvegardes = async () => {
      const zone = document.getElementById('r-sauvegardes');
      try {
        const d = await N.api('/sauvegarde');
        if (!d.stockage) { zone.innerHTML = '<p class="p-vide">Le stockage de fichiers n\'est pas relié : pas de sauvegarde possible.</p>'; return; }
        zone.innerHTML = d.sauvegardes.length ? `<ul class="p-liste">${d.sauvegardes.slice(0, 12).map((x) => `<li><span>${N.ech(x.cle.replace('sauvegardes/', ''))}</span><small class="p-faible">${N.ech(N.poids(x.octets))}</small>
          <a class="p-bouton p-bouton-fantome p-bouton-mini" href="/api/sauvegarde?cle=${encodeURIComponent(x.cle)}">Télécharger</a>
          <button type="button" class="p-bouton p-bouton-danger p-bouton-mini" data-restaurer="${N.ech(x.cle)}">Restaurer</button></li>`).join('')}</ul>` : '<p class="p-vide">Aucun instantané pour l\'instant.</p>';
        zone.querySelectorAll('[data-restaurer]').forEach((b) => b.addEventListener('click', async () => {
          const mot = window.prompt('Restaurer cet instantané remplace toutes les données actuelles (un filet est écrit avant). Écris « restaurer » pour confirmer.');
          if (mot !== 'restaurer') return;
          try {
            const r = await N.api('/sauvegarde/restaurer', { method: 'POST', body: JSON.stringify({ cle: b.getAttribute('data-restaurer'), confirmation: 'restaurer' }) });
            N.signaler('Restauration faite. Filet : ' + r.filet.replace('sauvegardes/', ''), 'succes');
            await N.rafraichirEtat(); await N.rafraichirSeances(); listerSauvegardes();
          } catch (e) { N.signaler(e.message); }
        }));
      } catch (e) { zone.innerHTML = `<p class="p-vide">${N.ech(e.message)}</p>`; }
    };
    listerSauvegardes();
    document.getElementById('r-sauver').addEventListener('click', async () => {
      try { const r = await N.api('/sauvegarde', { method: 'POST' }); N.signaler(`Sauvegarde écrite (${N.poids(r.octets)}).`, 'succes'); listerSauvegardes(); }
      catch (e) { N.signaler(e.message); }
    });
    vue().querySelectorAll('.p-interrupteur').forEach((b) => b.addEventListener('click', async () => {
      const cle = b.getAttribute('data-cle');
      const valeur = b.getAttribute('aria-checked') !== 'true';
      b.disabled = true;
      try {
        const d = await N.api('/reglages', { method: 'PUT', body: JSON.stringify({ cle, valeur }) });
        N.etat.reglages = d.reglages || N.etat.reglages;
        N.appliquerReglages();
        b.setAttribute('aria-checked', String(valeur));
        b.querySelector('.p-interrupteur-texte').textContent = valeur ? 'Activé' : 'Désactivé';
        N.signaler(valeur ? 'Réglage activé.' : 'Réglage désactivé.', 'succes');
      } catch (e) { N.signaler(e.message); }
      b.disabled = false;
    }));
  }

  /* ---------- Accès : ce que Sterenn peut ouvrir, élément par élément --------- */
  const COLONNES_ACCES = [
    { id: 'cours', t: 'Cours' }, { id: 'revision', t: 'Révision' }, { id: 'exercices', t: 'Exercices' },
    { id: 'serie', t: 'Série' }, { id: 'evaluation', t: 'Évaluation' },
  ];
  function celluleAcces(cle, defaut) {
    const a = N.etat.acces[cle];
    const etat = a ? (a.etat === 1 ? 'ouvert' : 'ferme') : 'auto';
    const perime = a && a.etat === 1 && a.jusqu_au && a.jusqu_au < new Date().toISOString();
    const libelle = { auto: defaut ? 'auto (ouvert)' : 'auto (fermé)', ouvert: perime ? 'ouvert, échu' : 'ouvert', ferme: 'fermé' }[etat];
    const glyphe = { auto: '○', ouvert: '✓', ferme: '✕' }[etat];
    return `<button type="button" class="p-acces-cell etat-${etat}${perime ? ' echu' : ''}${etat === 'auto' && defaut ? ' auto-ouvert' : ''}" data-acces="${cle}" data-etat="${etat}" title="${N.ech(libelle)}. Clic : auto, ouvert, fermé." aria-label="${N.ech(cle + ' : ' + libelle)}">${glyphe}<span>${N.ech(libelle)}</span></button>`
      + (a && a.etat === 1 && cle.endsWith('/evaluation') ? `<input type="datetime-local" class="p-acces-date" data-date="${cle}" value="${a.jusqu_au ? N.ech(a.jusqu_au.slice(0, 16)) : ''}" title="Fermeture automatique (facultatif)" aria-label="Date de fermeture">` : '');
  }
  function vueAcces() {
    const blocs = PROGRAMME.matieres.map((m) => bloc(m.icone + ' ' + m.nom, `<div class="p-tableau-defilant"><table class="p-table p-acces">
      <thead><tr><th>Leçon</th><th>Ouverture</th>${COLONNES_ACCES.map((c) => `<th>${c.t}</th>`).join('')}</tr></thead>
      <tbody>${m.lecons.map((l) => {
        const k = N.cle(m.id, l.ref);
        const verrou = N.etat.verrous[k];
        const d = N.decision(m.id, l.ref);
        const ouv = d === 1 ? 'ouvert' : d === 0 ? 'ferme' : 'auto';
        return `<tr>
          <td><b>${N.ech(l.ref)}</b> ${N.ech(l.titre)}<br><small class="${verrou ? 'p-ok' : 'p-faible'}">${verrou ? 'ouverte à Sterenn' : 'verrouillée pour Sterenn'}</small></td>
          <td><button type="button" class="p-acces-cell etat-${ouv}${ouv === 'auto' && verrou ? ' auto-ouvert' : ''}" data-ouverture="${k}" data-etat="${ouv}" title="Ouverture de la leçon : auto, poussée, retenue">${{ auto: '○', ouvert: '✓', ferme: '✕' }[ouv]}<span>${{ auto: 'auto', ouvert: 'poussée', ferme: 'retenue' }[ouv]}</span></button></td>
          ${COLONNES_ACCES.map((c) => `<td>${celluleAcces(k + '/' + c.id, c.id === 'evaluation' ? false : !!verrou)}</td>`).join('')}
        </tr>`;
      }).join('')}</tbody></table></div>`)).join('');
    const jeux = (window.JEUX || []);
    const blocJeux = bloc('Jeux et mondes 3D', `<ul class="p-liste p-acces-jeux">${jeux.map((j) => `<li>
        <span>${j.ico} <b>${N.ech(j.titre)}</b> <small>${j.type === '3d' ? 'monde 3D' : 'jeu'} · ${j.lecons.map(N.ech).join(', ')}</small></span>
        ${celluleAcces('jeu/' + j.id, true)}</li>`).join('')}</ul>`, String(jeux.length));

    afficher(entete('Accès et déblocages', 'Ce que Sterenn peut ouvrir, décidé ici et appliqué par le serveur. Trois états par élément : automatique, ouvert, fermé.')
      + `<div class="p-acces-legende">
          <span><i class="p-acces-cell etat-auto auto-ouvert">○</i> automatique : suit l'ouverture de la leçon (l'évaluation reste fermée)</span>
          <span><i class="p-acces-cell etat-ouvert">✓</i> ouvert, quoi qu'en dise la règle ; une évaluation peut porter une date de fermeture</span>
          <span><i class="p-acces-cell etat-ferme">✕</i> fermé, même si la leçon est ouverte</span>
        </div>`
      + blocs + blocJeux, [{ t: 'Pilotage' }, { t: 'Accès' }]);

    const suivant = { auto: true, ouvert: false, ferme: null };
    vue().querySelectorAll('[data-acces]').forEach((b) => b.addEventListener('click', async () => {
      const cle = b.getAttribute('data-acces');
      const valeur = suivant[b.getAttribute('data-etat')];
      const avantAcces = N.etat.acces[b.getAttribute('data-acces')] ? { etat: N.etat.acces[b.getAttribute('data-acces')].etat === 1, jusqu_au: N.etat.acces[b.getAttribute('data-acces')].jusqu_au } : { etat: null };
      try {
        await N.api('/acces', { method: 'PUT', body: JSON.stringify({ cle, etat: valeur }) });
        await N.rafraichirEtat();
        annulable('Accès enregistré.', async () => { await N.api('/acces', { method: 'PUT', body: JSON.stringify({ cle, etat: avantAcces.etat, jusqu_au: avantAcces.jusqu_au || null }) }); await N.rafraichirEtat(); vueAcces(); });
        vueAcces();
      } catch (e) { N.signaler(e.message); }
    }));
    vue().querySelectorAll('[data-date]').forEach((i) => i.addEventListener('change', async () => {
      const cle = i.getAttribute('data-date');
      try {
        await N.api('/acces', { method: 'PUT', body: JSON.stringify({ cle, etat: true, jusqu_au: i.value ? new Date(i.value).toISOString() : null }) });
        await N.rafraichirEtat();
        N.signaler(i.value ? 'Fermeture automatique enregistrée.' : 'Sans date de fermeture.', 'succes');
        vueAcces();
      } catch (e) { N.signaler(e.message); }
    }));
    vue().querySelectorAll('[data-ouverture]').forEach((b) => b.addEventListener('click', async () => {
      const [matiere, ref] = b.getAttribute('data-ouverture').split('/');
      const valeur = suivant[b.getAttribute('data-etat')];
      try {
        await N.api('/ouvertures', { method: 'PUT', body: JSON.stringify({ matiere, ref, ouvert: valeur }) });
        await N.rafraichirEtat();
        vueAcces();
      } catch (e) { N.signaler(e.message); }
    }));
  }

  /* ---------- Sterenn : sa carte, ses règles, son point de départ ------------ */
  function vueSterenn() {
    const c = N.profil('moi.carte', null);
    const pos = N.profil('moi.positionnement', null);
    const nomMat = (id) => { const m = N.matiere(id); return m ? m.icone + ' ' + m.nom : 'non renseignée'; };
    const REGLES = { pause: 'Une pause de cinq minutes toutes les vingt-cinq minutes', stop: 'Elle peut dire « stop » sans expliquer', consigne: 'Une seule consigne à la fois', fin: 'La séance finit à l\'heure', acquis: 'Ce qui est acquis est nommé et coché', plan: 'Le plan de la séance est annoncé au début' };
    const PREVENIR = { veille: 'la veille, par message', debut: 'au début de la séance', juste: 'juste avant' };
    const carte = c ? `
      <dl class="p-fiche-carte">
        <dt>Prénom à utiliser</dt><dd>${N.ech(c.prenom || 'Sterenn')}</dd>
        <dt>Ce qu'elle aime</dt><dd>${(c.aime || []).length ? c.aime.map(N.ech).join(' · ') : '<i>rien coché</i>'}${c.aimePas ? '<br><small>' + N.ech(c.aimePas) + '</small>' : ''}</dd>
        <dt>Matière préférée</dt><dd>${nomMat(c.matierePref)}</dd>
        <dt>Matière qui l'inquiète</dt><dd>${c.matiereInquiete ? nomMat(c.matiereInquiete) : 'aucune'}</dd>
        <dt>Prévenir d'un changement</dt><dd>${PREVENIR[c.prevenir] || 'la veille'}</dd>
        <dt>Ce qui l'aide quand elle bloque</dt><dd>${(c.aide || []).length ? c.aide.map(N.ech).join(' · ') : '<i>rien coché</i>'}</dd>
        <dt>Règles retenues</dt><dd><ul class="p-liste">${(c.regles || []).map((r) => `<li>${N.ech(REGLES[r] || r)}</li>`).join('')}${c.autre ? `<li><b>Ajoutée par elle :</b> ${N.ech(c.autre)}</li>` : ''}</ul></dd>
        ${c.question ? `<dt>Sa question pour toi</dt><dd>${N.ech(c.question)}</dd>` : ''}
      </dl>` : '<p class="p-vide">Elle n\'a pas encore rempli sa carte. Le module « Faire connaissance » est sur son accueil.</p>';
    const bilan = pos && !pos.enCours ? `<ul class="p-liste">${PROGRAMME.matieres.map((m) => {
      const r = pos.matieres[m.id] || { justes: 0, total: 0 };
      const pct = r.total ? Math.round((r.justes / r.total) * 100) : 0;
      return `<li><span style="min-width:11rem">${m.icone} ${N.ech(m.nom)}</span><span class="p-jauge"><i style="width:${pct}%"></i></span><b>${r.justes}/${r.total}</b></li>`;
    }).join('')}</ul><p class="p-aide">Fait le ${N.ech(N.dateCourte(pos.date))}. Cinq questions par matière, prises dans les deux premières leçons.</p>` : '<p class="p-vide">Pas encore fait. Le module « Où j\'en suis » se fait ensemble, sur écran, sans note.</p>';
    const modules = `<ul class="p-liste">
      <li>Faire connaissance : ${N.profil('moi.decouverte_fait') ? '<span class="p-etat p-etat-satisfaisant">terminé</span>' : '<span class="p-etat p-etat-fragile">à faire</span>'}</li>
      <li>Visite guidée : ${N.profil('moi.visite_faite') && N.profil('moi.visite_faite') !== 'interrompue' ? '<span class="p-etat p-etat-satisfaisant">vue</span>' : '<span class="p-etat p-etat-fragile">à faire</span>'}</li>
      <li>Où j'en suis : ${pos && !pos.enCours ? '<span class="p-etat p-etat-satisfaisant">fait</span>' : '<span class="p-etat p-etat-fragile">à faire</span>'}</li>
    </ul>`;
    afficher(entete('Sterenn', 'Sa carte, ses règles, son point de départ, et ta carte à toi.')
      + '<div class="p-grille2"><div>'
      + bloc('Sa carte', carte)
      + bloc('Son point de départ', bilan)
      + '</div><div>'
      + bloc('Les modules de début d\'année', modules)
      + bloc('Ta carte, telle qu\'elle la lit', `<form class="p-form" id="p-form-carte">
          <div><label for="c-texte">Texte</label><textarea id="c-texte" rows="8" maxlength="1200">${N.ech(N.profil('bastien.carte', ''))}</textarea>
          <p class="p-aide">Vide, le texte par défaut du module s'affiche. Écris-la à la première personne, en tutoyant.</p></div>
          <button class="p-bouton" type="submit">Enregistrer</button></form>`)
      + '</div></div>', [{ t: 'Pilotage' }, { t: 'Sterenn' }]);
    document.getElementById('p-form-carte').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      try {
        const t = document.getElementById('c-texte').value.trim();
        await N.enregistrerProfil('bastien.carte', t || null);
        N.signaler('Carte enregistrée.', 'succes');
      } catch (e) { N.signaler(e.message); }
    });
  }

  /* ---------- Routage ------------------------------------------------------- */
  function rendre(p) {
    brancherChromeUneFois();
    switch (p[0]) {
      case '': case 'accueil': return vueAccueil();
      case 'mois': return vueMois(p[1]);
      case 'calendrier': return vueCalendrier(p[1]);
      case 'seance': return vueSeance(p[1]);
      case 'planning': return vuePlanning();
      case 'suivi': return vueSuivi();
      case 'socle': return vueSocle();
      case 'aide': return vueAideProf();
      case 'journal': return vueJournal();
      case 'jeux': return vueJeuxProf();
      case 'bulletin': return vueBulletin(p[1]);
      case 'periodes': return vuePeriodes();
      case 'messages': return vueMessages(p[1] ? decodeURIComponent(p.slice(1).join('/')) : null);
      case 'depots': return vueDepots();
      case 'matieres': return vueMatieres();
      case 'matiere': return vueMatiere(p[1]);
      case 'lecon': return vueLecon(p[1], p[2], p[3]);
      case 'exos': return vueExos(p[1], p[2]);
      case 'programme': return vueProgramme();
      case 'documents': return vueDocuments();
      case 'reglages': return vueReglages();
      case 'acces': return vueAcces();
      case 'sterenn': return vueSterenn();
      case 'recherche': return vueRecherche(p[1] ? decodeURIComponent(p.slice(1).join('/')) : '');
      default: return vueIntrouvable();
    }
  }

  window.VUE_PROF = { nav, rendre };
})();
