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
        { route: 'documents', ico: 'ic-telecharger', texte: 'Dossiers PDF' },
      ],
    },
    {
      titre: 'Outils',
      items: [
        { route: 'planning', ico: 'ic-etincelle', texte: 'Générateur d\'année' },
        { route: 'reglages', ico: 'ic-reglage', texte: 'Réglages' },
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
      return `<li><a href="#/${i.route}"${actif}>
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

  function afficher(html, morceaux) {
    vue().innerHTML = html;
    nav();
    fil(morceaux || [{ t: 'Espace professeur' }]);
    fermerLateral();
    window.scrollTo(0, 0);
    vue().focus();
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
      try {
        await N.api('/suivi', {
          method: 'PUT',
          body: JSON.stringify({ matiere: mid, ref, niveau: s.value || null }),
        });
        await N.rafraichirEtat();
        N.signaler('Niveau enregistré.', 'succes');
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
    return (s.matieres || []).map((id) => {
      const m = N.matiere(id);
      return m ? `${m.icone} ${N.ech(m.nom)}` : '';
    }).filter(Boolean).join(' · ');
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
    const choixOuverts = N.etat.seances
      .filter((s) => (s.choix || []).length >= 2 && !s.choisi_le && s.date >= aujourd)
      .sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);

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
      + '<div class="p-grille2"><div>'
      + bloc('Le programme du jour',
        duJour.length
          ? duJour.map((s) => carteSeance(s)).join('')
          : `<p class="p-vide">Aucune séance aujourd'hui.
             ${suivantes.length ? 'Prochaine : ' + N.ech(N.enFrancais(suivantes[0].date, true)) + '.' : 'Le planning est vide.'}</p>`,
        duJour.length ? duJour.length + ' séance(s)' : '')
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
          ? `<ul class="p-liste">${choixOuverts.map((s) => `<li>
              <span class="num">${N.ech(N.enFrancais(s.date))}</span>
              <a href="#/seance/${s.id}">${(s.choix || []).length} leçons proposées</a>
              <span class="p-etat p-etat-vide" style="margin-left:auto">en attente</span></li>`).join('')}</ul>`
          : '<p class="p-vide">Aucun choix en attente.</p>')
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
      cellules.push(`<div class="${classes.join(' ')}">
        <div class="p-m-tete">
          <span class="p-m-num">${Number(jour.slice(8, 10))}</span>
          ${dedans ? `<button class="p-m-plus" type="button" data-nouvelle="${jour}"
            title="Ajouter une séance le ${N.ech(N.enFrancais(jour, true))}" aria-label="Ajouter une séance">+</button>` : ''}
        </div>
        ${liste.map((x) => `<a class="p-m-evt ${x.type === 'travail' ? 'travail' : ''} ${N.ech(x.statut || 'prevue')}"
            href="#/seance/${x.id}" title="${N.ech(x.objectif || '')}">
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
          <span class="p-evt-h">${N.ech(s.debut || '')} à ${N.ech(s.fin || '')}</span>
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
          : '<p class="p-vide">Aucune séance sur cette semaine.</p>',
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
    return PROGRAMME.matieres.map((m) => `<optgroup label="${N.ech(m.icone + ' ' + m.nom)}">`
      + m.lecons.map((l) => {
        const v = m.id + '/' + l.ref;
        return `<option value="${v}"${choisies.has(v) ? ' selected' : ''}>${l.ref} · ${N.ech(l.titre)}</option>`;
      }).join('') + '</optgroup>').join('');
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
            <select id="f-lecons" multiple size="12">${optionsLecons(s.lecons)}</select>
            <p class="p-aide">Plusieurs sélections possibles. Les matières se déduisent des leçons.</p></div>
          <div><label for="f-travail">Travail personnel qui suit</label>
            <textarea id="f-travail" rows="2" maxlength="500">${N.ech(s.travail || '')}</textarea></div>
          <div><label for="f-bilan">Bilan de la séance</label>
            <textarea id="f-bilan" rows="3" maxlength="800">${N.ech(s.bilan || '')}</textarea>
            <p class="p-aide">Ce qui a été acquis, ce qui reste à reprendre. Trois lignes suffisent.</p></div>
          <button class="p-bouton" type="submit">Enregistrer</button>
        </form>`)
      + '</div><div>'
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
            return info ? `<tr><td><a href="#/lecon/${info.m.id}/${info.l.ref}">${N.ech(info.l.titre)}</a></td>
              <td style="width:11rem">${choixNiveau(info.m.id, info.l.ref)}</td></tr>` : '';
          }).join('')}</tbody></table>`
          : '<p class="p-vide">Aucune leçon rattachée.</p>')
      + '</div></div>',
      [{ t: 'Pilotage' }, { t: 'Planning', h: '#/calendrier' }, { t: N.enFrancais(s.date) }],
    );

    brancherNiveaux(() => vueSeance(id));

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
        N.signaler('Séance enregistrée.', 'succes');
        vueSeance(id);
      } catch (e) { N.signaler(e.message); }
    });

    document.getElementById('p-supprimer').addEventListener('click', async () => {
      if (!window.confirm('Supprimer définitivement cette séance ?')) return;
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
      try {
        apercu = window.PLANIFICATEUR.generer(N.lundiDe(d), n, { mercredi });
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
        dernière le ${N.ech(N.enFrancais(apercu.seances[apercu.seances.length - 1].date, true))}.</p>`);
  }

  async function enregistrerPlanning() {
    if (!apercu) return;
    const bouton = document.getElementById('g-enregistrer');
    bouton.disabled = true;
    bouton.textContent = 'Enregistrement…';
    let crees = 0; let ignores = 0;
    try {
      for (let i = 0; i < apercu.seances.length; i += 200) {
        const paquet = apercu.seances.slice(i, i + 200);
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
    if (!window.confirm(`Supprimer ${cibles.length} séance(s) à venir ? Les séances déjà faites sont conservées.`)) return undefined;
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
        <td>${choixNiveau(m.id, l.ref)}</td>
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
      </table></div>` : '<p class="p-vide">Aucune leçon ne correspond à ces filtres.</p>';

    afficher(
      entete('Suivi des acquis',
        `${c.validees} validées sur ${c.total} · ${c.fragiles} à reprendre · ${c.pretes} entièrement rédigées · ${Object.keys(N.etat.resultats).filter((k) => k.indexOf('jeu/') === 0).length} jeu(x) joué(s)`,
        `<button class="p-bouton p-bouton-fantome" id="s-export" type="button">Exporter en CSV</button>
         <a class="p-bouton p-bouton-fantome" href="#/matieres">Voir les matières</a>`)

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
        + '<p class="p-vide">Chargement…</p>', [{ t: 'Échanges' }, { t: 'Messages' }]);
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
          </div>
          <div class="p-emojis" id="m-emojis" hidden>${M ? M.selecteurEmojis('p-emojis') : ''}</div>
          <button class="p-bouton" type="submit">Envoyer</button>
        </form>`),
      [{ t: 'Échanges' }, { t: 'Messages' }],
    );

    const filMsg = document.getElementById('p-fil-msg');
    filMsg.scrollTop = filMsg.scrollHeight;
    vue().querySelectorAll('[data-fil]').forEach((b) => b.addEventListener('click', () => {
      filProf = b.getAttribute('data-fil') || null;
      vueMessages(null, true);
    }));
    if (M) {
      const champ = document.getElementById('m-texte');
      M.brancherFormatage(vue(), champ);
      M.brancherReactions(filMsg, () => vueMessages(null, true));
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
        await N.api('/messages', {
          method: 'POST',
          body: JSON.stringify({ texte, contexte: document.getElementById('m-contexte').value.trim() || null, fil: document.getElementById('m-fil').value || null }),
        });
        vueMessages(null, true);
      } catch (e) { N.signaler(e.message); }
    });
  }

  /* =======================================================================
     Dépôts de fichiers
     ======================================================================= */
  const MODELES_FELICITATION = [
    'Ton devoir est rendu complet et dans les temps. La consigne est respectée du début à la fin.',
    'Ta rédaction est structurée : une introduction, des paragraphes, une conclusion. Le raisonnement se suit sans effort.',
    'Tes calculs sont posés, chaque étape est écrite. Le résultat est juste et l\'unité est là.',
    'Tu as relu ton travail : pas de faute d\'accord dans le texte. C\'est un acquis.',
  ];

  async function vueDepots() {
    afficher(entete('Dépôts', 'Ce que Sterenn rend, et ce que je lui transmets.')
      + '<p class="p-vide">Chargement…</p>', [{ t: 'Échanges' }, { t: 'Dépôts' }]);

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
                <span>${f.auteur === 'eleve' ? 'Sterenn' : 'Moi'} · ${N.ech(N.dateCourte(f.cree_le))} · ${N.ech(N.poids(f.taille))}${f.note ? ' · ' + N.ech(f.note) : ''}</span>
              </span>
              ${f.auteur === 'eleve' ? `<button class="p-bouton p-bouton-mini" data-feliciter="${f.id}" data-matiere="${N.ech(f.matiere || '')}" data-ref="${N.ech(f.ref || '')}" type="button">${felicite.has(f.id) ? '🏆 Félicitée' : 'Féliciter'}</button>` : ''}
              <button class="p-bouton p-bouton-danger p-bouton-mini" data-fichier="${f.id}" type="button">Supprimer</button>
            </li>`).join('')}</ul>`
          : '<p class="p-vide">Aucun fichier déposé.</p>',
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
        await N.api('/felicitations', { method: 'POST', body: JSON.stringify({
          texte, matiere: document.getElementById('f-matiere').value || null,
          ref: document.getElementById('f-ref').value.trim() || null,
          fichier_id: document.getElementById('f-fichier').value || null,
        }) });
        N.signaler('Félicitations envoyées à Sterenn : une étoile de plus pour elle.', 'succes');
        await N.rafraichirEtat();
        vueDepots();
      } catch (e) { N.signaler(e.message); }
    });

    vue().querySelectorAll('[data-fichier]').forEach((b) => b.addEventListener('click', async () => {
      if (!window.confirm('Supprimer ce fichier ?')) return;
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
        <table class="p-table">
          <thead><tr><th style="width:4rem">Réf.</th><th>Leçon</th><th>Notions</th>
            <th style="width:4rem">Période</th><th style="width:8.5rem">Documents</th>
            <th style="width:11rem">Niveau</th><th style="width:9rem">Accès</th>
            <th style="width:9rem"></th></tr></thead>
          <tbody>${m.lecons.map((l) => {
    const pret = (l.docs || []).length > 0;
    return `<tr>
      <td class="num">${N.ech(l.ref)}</td>
      <td>${pret ? `<a href="#/lecon/${m.id}/${l.ref}">${N.ech(l.titre)}</a>` : N.ech(l.titre)}</td>
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
    return undefined;
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
    afficher(entete(l.titre, '') + '<p class="p-vide">Chargement de la fiche…</p>',
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
        }).join('')}${N.banque(mid, ref) ? `<a href="#/exos/${mid}/${ref}">${N.ic('ic-cible')} Série d'exercices</a>` : ''}</nav>
              <article class="p-fiche">${doc.html}</article>
            </div>
            <aside class="p-rail">
              <div class="p-rail-bloc">
                <h2>Niveau atteint</h2>
                ${choixNiveau(mid, ref)}
                <h2 style="margin-top:.6rem">Accès de Sterenn</h2>
                ${choixOuverture(mid, ref)}
                <p class="p-aide" style="margin-top:.35rem">${lue ? 'Lue le ' + N.ech(N.dateCourte(lue.termine_le)) : 'Pas encore marquée comme lue.'}</p>
                ${res ? `<p class="p-aide">Exercices : ${res.meilleur}/${res.total} au mieux, ${res.series} série(s).</p>` : ''}
              </div>
              ${(doc.plan || []).length ? `<div class="p-rail-bloc"><h2>Plan de la fiche</h2>
                <ol>${doc.plan.map((s) => `<li><a href="#${s.id}">${N.ech(s.texte)}</a></li>`).join('')}</ol></div>` : ''}
              ${(doc.objectifs || []).length ? `<div class="p-rail-bloc"><h2>Objectifs</h2>
                <ul class="p-liste">${doc.objectifs.map((o) => `<li>${N.ech(o)}</li>`).join('')}</ul></div>` : ''}
              ${(doc.competences || []).length ? `<div class="p-rail-bloc"><h2>Compétences</h2>
                <p>${doc.competences.map((x) => `<span class="p-puce">${N.ech(x)}</span>`).join(' ')}</p></div>` : ''}
              <div class="p-rail-bloc"><h2>Actions</h2>
                <p><button class="p-bouton p-bouton-fantome p-bouton-mini" id="p-question" type="button">Écrire à Sterenn</button></p>
                <p style="margin-top:.35rem"><a class="p-bouton p-bouton-fantome p-bouton-mini"
                  href="#/mois">Placer dans une séance</a></p>
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
      return undefined;
    });
    return undefined;
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
          <tbody>${serie.map((q, i) => `<tr>
            <td class="num">${i + 1}</td>
            <td><span class="p-puce">${N.ech(q.type || 'qcm')}</span></td>
            <td>${q.q || ''}</td>
            <td>${N.ech(reponseAttendue(q))}</td>
            <td class="p-aide" style="margin:0">${N.ech(q.explication || '')}</td>
          </tr>`).join('')}</tbody>
        </table>`, serie.length + ' question(s)'),
      [{ t: 'Ressources' }, { t: 'Matières', h: '#/matieres' }, { t: m.nom, h: '#/matiere/' + mid }, { t: 'Exercices' }],
    );
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
  function vueRecherche(q) {
    const terme = (q || '').toLowerCase().trim();
    const trouves = [];
    if (terme) {
      PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => {
        const foin = [l.ref, l.titre, (l.notions || []).join(' '), m.nom].join(' ').toLowerCase();
        if (foin.indexOf(terme) !== -1) trouves.push({ m, l });
      }));
    }
    afficher(
      entete('Recherche', trouves.length ? `${trouves.length} leçon(s) pour « ${N.ech(q)} »` : `Aucune leçon pour « ${N.ech(q || '')} »`)
      + bloc('Résultats', trouves.length ? `
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
      + bloc('Ce qui ne se règle pas ici', `<p class="p-aide">Les codes d\'accès, les palettes et le thème sombre appartiennent à chaque écran : Sterenn choisit sa palette et son thème elle-même, dans son espace.</p>`),
    [{ t: 'Réglages' }]);
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
      case 'messages': return vueMessages(p[1] ? decodeURIComponent(p.slice(1).join('/')) : null);
      case 'depots': return vueDepots();
      case 'matieres': return vueMatieres();
      case 'matiere': return vueMatiere(p[1]);
      case 'lecon': return vueLecon(p[1], p[2], p[3]);
      case 'exos': return vueExos(p[1], p[2]);
      case 'programme': return vueProgramme();
      case 'documents': return vueDocuments();
      case 'reglages': return vueReglages();
      case 'recherche': return vueRecherche(p[1] ? decodeURIComponent(p.slice(1).join('/')) : '');
      default: return vueIntrouvable();
    }
  }

  window.VUE_PROF = { nav, rendre };
})();
