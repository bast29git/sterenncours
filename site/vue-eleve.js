/* =========================================================================
   vue-eleve.js : l'espace de Sterenn.

   Navigation centrale, pas de barre latérale. L'accueil est une carte du
   jour suivie de l'orbite des matières. Les leçons s'ouvrent au fil du
   parcours : ce qui n'a pas encore été mis au programme reste fermé, avec
   la raison écrite noir sur blanc.
   ========================================================================= */
(function () {
  'use strict';
  const N = window.NOYAU;
  const vue = () => document.getElementById('vue-eleve');
  let observateurOrbite = null;

  const ONGLETS = [
    { route: 'hub', ico: '🏠', texte: 'Aujourd\'hui' },
    { route: 'matieres', ico: '🪐', texte: 'Mes matières' },
    { route: 'calendrier', ico: '🗓️', texte: 'Ma semaine' },
    { route: 'messages', ico: '💬', texte: 'Messages' },
    { route: 'travail', ico: '📤', texte: 'Mon travail' },
  ];

  function nav() {
    const courant = (location.hash || '#/hub').replace(/^#\/?/, '').split('/')[0] || 'hub';
    const actif = (r) => (r === courant
      || (r === 'matieres' && ['matiere', 'lecon', 'exos'].includes(courant)) ? ' class="actif"' : '');
    document.getElementById('e-nav').innerHTML = ONGLETS.map((o) => {
      const bulle = o.route === 'messages' && N.etat.messagesNonLus
        ? `<span class="bulle">${N.etat.messagesNonLus}</span>` : '';
      return `<a href="#/${o.route}"${actif(o.route)}>
        <span class="ico" aria-hidden="true">${o.ico}</span><span>${o.texte}</span>${bulle}</a>`;
    }).join('');
    N.majReussites();
  }

  function afficher(html) {
    if (observateurOrbite) { try { observateurOrbite.dispose(); } catch (e) { /* ignore */ } observateurOrbite = null; }
    vue().innerHTML = html;
    nav();
    document.getElementById('e-palette-panneau').hidden = true;
    window.scrollTo(0, 0);
    vue().focus();
  }

  /* ---------- Accueil ------------------------------------------------------- */
  function seanceDuJour() {
    const a = N.jourIso();
    return N.etat.seances.find((s) => s.date === a && s.type === 'cours');
  }
  function prochaineSeance() {
    const a = N.jourIso();
    return N.etat.seances.filter((s) => s.date > a && s.type === 'cours')
      .sort((x, y) => x.date.localeCompare(y.date))[0];
  }
  function travailDuJour() {
    const a = N.jourIso();
    return N.etat.seances.find((s) => s.date === a && s.type === 'travail');
  }
  function prochaineLeconOuverte() {
    for (const m of PROGRAMME.matieres) {
      for (const l of m.lecons) {
        if ((l.docs || []).length && N.accessible(m.id, l.ref) && !N.estValidee(m.id, l.ref)) return { m, l };
      }
    }
    return null;
  }

  function blocChoix(seances) {
    const ouverts = seances.filter((s) => (s.choix || []).length >= 2 && !s.choisi_le && s.date >= N.jourIso());
    if (!ouverts.length) return '';
    const s = ouverts[0];
    return `<section class="e-choix-jour" data-choix="${s.id}">
      <h2>✨ À toi de choisir</h2>
      <p class="aide">Pour la séance du ${N.ech(N.enFrancais(s.date, true))}, tu décides de la deuxième leçon. Les trois sont au programme : prends celle qui te tente.</p>
      <ul class="e-choix-liste">${(s.choix || []).map((r) => {
    const info = N.libelleLecon(r);
    if (!info) return '';
    return `<li><button type="button" data-seance="${s.id}" data-lecon="${r}">
      <span class="m">${info.m.icone} ${N.ech(info.m.nom)}</span>
      <b>${N.ech(info.l.titre)}</b>
      <span>${info.l.notions.slice(0, 3).map(N.ech).join(' · ')}</span></button></li>`;
  }).join('')}</ul></section>`;
  }

  function brancherChoix(apres) {
    vue().querySelectorAll('[data-seance][data-lecon]').forEach((b) => {
      b.addEventListener('click', async () => {
        try {
          await N.api('/seances/' + b.getAttribute('data-seance') + '/choix', {
            method: 'POST', body: JSON.stringify({ lecon: b.getAttribute('data-lecon') }),
          });
          await N.rafraichirSeances();
          N.signaler('C\'est noté, bon choix.', 'succes');
          apres();
        } catch (e) { N.signaler(e.message); }
      });
    });
  }

  function vueHub() {
    const jour = seanceDuJour();
    const suivante = prochaineSeance();
    const travail = travailDuJour();
    const vedette = jour || suivante;
    const ouverte = prochaineLeconOuverte();
    const cible = vedette && (vedette.lecons || []).length ? N.libelleLecon(vedette.lecons[0]) : ouverte;
    const c = N.chiffres();

    const titre = vedette
      ? N.ech(vedette.objectif || 'Séance de travail')
      : (cible ? N.ech(cible.l.titre) : 'Rien à faire pour l\'instant');
    const detail = vedette
      ? (jour ? `De ${N.ech(vedette.debut)} à ${N.ech(vedette.fin)}` : N.ech(N.enFrancais(vedette.date, true)))
        + ' · ' + (vedette.matieres || []).map((id) => {
          const m = N.matiere(id);
          return m ? m.icone + ' ' + N.ech(m.nom) : '';
        }).filter(Boolean).join(' · ')
      : (cible ? N.ech(cible.m.nom) : 'Les prochaines leçons arriveront bientôt.');

    afficher(
      `<section class="e-jour">
        <p class="quand">${jour ? 'Aujourd\'hui' : (suivante ? 'Prochaine séance' : 'À faire maintenant')}</p>
        <h1>${titre}</h1>
        <p class="detail">${detail}</p>
        <p class="e-actions">
          ${cible && (cible.l.docs || []).length && N.accessible(cible.m.id, cible.l.ref)
        ? `<a class="e-bouton" href="#/lecon/${cible.m.id}/${cible.l.ref}/cours">Ouvrir ma leçon</a>` : ''}
          ${cible && N.banque(cible.m.id, cible.l.ref)
        ? `<a class="e-bouton e-bouton-doux" href="#/exos/${cible.m.id}/${cible.l.ref}">M'entraîner</a>` : ''}
        </p>
       </section>

       ${blocChoix(N.etat.seances)}

       ${travail ? `<div class="e-carte" style="margin-bottom:1.4rem">
         <h2 style="font-size:1.05rem;margin-bottom:.3rem">⏱️ Ton temps perso, aujourd'hui</h2>
         <p style="margin:0;color:var(--e-encre-doux)">${N.ech(travail.travail || 'Un temps court de révision.')}</p></div>` : ''}

       <div class="e-orbite-titre">
         <h2>Mes matières</h2>
         <span>Fais tourner, clique sur une planète</span>
       </div>
       <div class="e-orbite" id="e-orbite"></div>

       <ul class="e-tuiles">
         <li><a href="#/reussites"><span class="ico" aria-hidden="true">⭐</span>
           <b>Mes réussites</b><span>${N.reussites().total} étoile(s)</span></a></li>
         <li><a href="#/travail"><span class="ico" aria-hidden="true">📤</span>
           <b>Envoyer mon travail</b><span>Une photo, un document</span></a></li>
         <li><a href="#/messages"><span class="ico" aria-hidden="true">💬</span>
           <b>Messages</b><span>${N.etat.messagesNonLus ? N.etat.messagesNonLus + ' non lu(s)' : 'Poser une question'}</span></a></li>
         <li><a href="#/calendrier"><span class="ico" aria-hidden="true">🗓️</span>
           <b>Ma semaine</b><span>Ce qui est prévu</span></a></li>
       </ul>`,
    );
    brancherChoix(vueHub);
    monterOrbite();
  }

  async function monterOrbite() {
    const hote = document.getElementById('e-orbite');
    if (!hote) return;
    const mondes = PROGRAMME.matieres.map((m) => {
      const p = N.progression(m);
      const prets = m.lecons.filter((l) => (l.docs || []).length).length;
      return {
        id: m.id, titre: m.nom,
        sousTitre: prets ? `${prets} leçon(s) · ${p.pct} %` : 'bientôt',
        grad: N.DEGRADES[m.id] || ['#7B6BE8', '#B4A8F5'],
        emoji: m.icone, url: '#/matiere/' + m.id, badge: p.faites ? String(p.faites) : '',
      };
    });
    try {
      await N.chargerScript('moteurs/worlds-orbit.js');
      if (!window.KonstrioWorldsOrbit) throw new Error('indisponible');
      observateurOrbite = window.KonstrioWorldsOrbit.mount(hote, mondes, {
        onOpen: (monde) => { location.hash = '#/matiere/' + monde.id; },
      });
    } catch (e) {
      hote.classList.add('e-carte');
      hote.innerHTML = `<ul class="e-tuiles">${mondes.map((w) => `<li><a href="${w.url}">
        <span class="ico" aria-hidden="true">${w.emoji}</span>
        <b>${N.ech(w.titre)}</b><span>${N.ech(w.sousTitre)}</span></a></li>`).join('')}</ul>`;
    }
  }

  /* ---------- Mes matières ---------------------------------------------------- */
  function vueMatieres() {
    afficher(
      `<h1>Mes matières</h1>
       <p class="e-intro">Choisis une matière pour voir ton parcours.</p>
       <ul class="e-tuiles">${PROGRAMME.matieres.map((m) => {
        const p = N.progression(m);
        const prets = m.lecons.filter((l) => (l.docs || []).length).length;
        return `<li><a href="#/matiere/${m.id}">
          <span class="ico" aria-hidden="true">${m.icone}</span>
          <b>${N.ech(m.nom)}</b>
          <span>${prets ? `${prets} leçon(s) disponible(s) · ${p.faites} validée(s)` : 'Bientôt disponible'}</span>
        </a></li>`;
      }).join('')}</ul>`,
    );
  }

  function vueMatiere(mid) {
    const m = N.matiere(mid);
    if (!m) return vueIntrouvable();
    const p = N.progression(m);

    const etapes = m.lecons.map((l, i) => {
      const dispo = (l.docs || []).length;
      const ouverte = N.accessible(mid, l.ref);
      const faite = N.estValidee(mid, l.ref);
      const classe = faite ? 'faite' : (ouverte && dispo ? 'ouverte' : 'verrouillee');
      const actions = (ouverte && dispo)
        ? `<a class="pleine" href="#/lecon/${mid}/${l.ref}/cours">Ouvrir</a>`
          + N.TYPES_DOC.filter((t) => t.id !== 'cours' && l.docs.indexOf(t.id) !== -1)
            .map((t) => `<a href="#/lecon/${mid}/${l.ref}/${t.id}">${t.picto} ${t.libelle}</a>`).join('')
          + (N.banque(mid, l.ref) ? `<a href="#/exos/${mid}/${l.ref}">🎯 M'entraîner</a>` : '')
        : `<span class="e-cadenas">🔒 ${dispo ? N.ech(N.raisonVerrou(mid, l.ref)) : 'Cette leçon est en préparation.'}</span>`;
      return `<li class="e-etape ${classe}">
        <span class="e-pastille" aria-hidden="true">${faite ? '✓' : (ouverte && dispo ? i + 1 : '🔒')}</span>
        <div class="e-etape-corps">
          <p class="e-etape-titre">${N.ech(l.titre)}</p>
          <p class="e-etape-note">${l.notions.slice(0, 3).map(N.ech).join(' · ')}</p>
          <p class="e-etape-actions">${actions}</p>
        </div></li>`;
    }).join('');

    afficher(
      `<section class="e-matiere-tete">
        <span class="e-matiere-emoji" aria-hidden="true">${m.icone}</span>
        <div>
          <h1>${N.ech(m.nom)}</h1>
          <p class="e-sous">${p.faites} leçon(s) validée(s) sur ${p.total}</p>
        </div>
        <div class="e-jauge">
          <span class="e-jauge-barre"><i style="width:${p.pct}%"></i></span>
          <span class="e-jauge-texte">${p.pct} % du parcours</span>
        </div>
       </section>
       <ul class="e-parcours">${etapes}</ul>`,
    );
  }

  /* ---------- Lecteur ---------------------------------------------------------- */
  function vueLecon(mid, ref, type) {
    const m = N.matiere(mid);
    const l = N.lecon(m, ref);
    if (!m || !l || !(l.docs || []).length) return vueIntrouvable();
    if (!N.accessible(mid, ref)) {
      return afficher(`<div class="e-carte e-vide"><p>🔒 ${N.ech(N.raisonVerrou(mid, ref))}</p>
        <p><a class="e-bouton e-bouton-doux" href="#/matiere/${mid}">Revenir au parcours</a></p></div>`);
    }
    const actif = l.docs.indexOf(type) !== -1 ? type : l.docs[0];
    afficher('<p class="e-vide">Chargement…</p>');

    N.chargerContenu(mid).then((contenu) => {
      const doc = contenu && contenu[ref] && contenu[ref][actif];
      if (!doc) return afficher('<p class="e-vide">Cette fiche n\'est pas encore disponible.</p>');
      const cleFiche = N.cle(mid, ref) + '/' + actif;
      const lu = N.etat.fiches[cleFiche];

      afficher(
        `<div class="e-lecteur">
          <header class="e-lecteur-tete">
            <p style="margin:0;color:var(--e-encre-doux);font-size:.85rem">${m.icone} ${N.ech(m.nom)}</p>
            <h1>${N.ech(doc.titre)}</h1>
            ${doc.resume ? `<p style="margin:0;color:var(--e-encre-doux)">${N.ech(doc.resume)}</p>` : ''}
            <nav class="e-onglets">${l.docs.map((t) => {
          const info = N.TYPES_DOC.find((x) => x.id === t);
          return `<a href="#/lecon/${mid}/${ref}/${t}" class="${t === actif ? 'actif' : ''}">${info.picto} ${info.libelle}</a>`;
        }).join('')}${N.banque(mid, ref) ? `<a href="#/exos/${mid}/${ref}">🎯 M'entraîner</a>` : ''}</nav>
          </header>
          <article class="e-fiche">${doc.html}</article>
          <div class="e-actions">
            <button class="e-bouton" id="e-fini" type="button">${lu ? '↺ Pas encore terminée' : '✓ J\'ai terminé'}</button>
            ${N.banque(mid, ref) ? `<a class="e-bouton e-bouton-doux" href="#/exos/${mid}/${ref}">M'entraîner</a>` : ''}
            <button class="e-bouton e-bouton-fin" id="e-question" type="button">💬 Poser une question</button>
            <a class="e-bouton e-bouton-fin" href="#/matiere/${mid}">← Mon parcours</a>
          </div>
         </div>`,
      );

      document.getElementById('e-fini').addEventListener('click', async () => {
        const termine = !N.etat.fiches[cleFiche];
        try {
          const r = await N.api('/fiches', { method: 'PUT', body: JSON.stringify({ cle: cleFiche, termine }) });
          if (termine) {
            N.etat.fiches[cleFiche] = { termine_le: r.termine_le };
            N.signaler('Bravo, fiche terminée.', 'succes');
            try { window.KonstrioAch && window.KonstrioAch.recordWin && window.KonstrioAch.recordWin('fiche-' + cleFiche, 100); } catch (e) { /* ignore */ }
          } else { delete N.etat.fiches[cleFiche]; }
          vueLecon(mid, ref, actif);
        } catch (e) { N.signaler(e.message); }
      });
      document.getElementById('e-question').addEventListener('click', () => {
        location.hash = '#/messages/' + encodeURIComponent(m.nom + ' · ' + l.titre);
      });
    });
  }

  /* ---------- Exercices ---------------------------------------------------------- */
  let session = null;
  function vueExos(mid, ref) {
    const m = N.matiere(mid);
    const l = N.lecon(m, ref);
    const b = N.banque(mid, ref);
    if (!m || !l || !b) return vueIntrouvable();
    session = { mid, ref, items: b.items, index: 0, reponses: [], termine: false };
    rendreExo();
  }
  function rendreExo() {
    const s = session;
    const l = N.lecon(N.matiere(s.mid), s.ref);
    if (s.termine) return rendreBilan();
    const item = s.items[s.index];
    const corps = (item.type === 'qcm' || item.type === 'vraifaux')
      ? `<ul class="e-exo-choix">${(item.type === 'vraifaux' ? ['Vrai', 'Faux'] : item.choix)
        .map((c, i) => `<li><button type="button" data-choix="${i}">${c}</button></li>`).join('')}</ul>`
      : `<form class="e-exo-saisie" id="e-form-saisie">
          <input id="e-saisie" type="text" autocomplete="off" placeholder="ta réponse" aria-label="Ta réponse">
          <button class="e-bouton" type="submit">Vérifier</button></form>`;

    afficher(
      `<div class="e-exo">
        <h1 style="font-size:1.4rem;margin-bottom:.9rem">${N.ech(l.titre)}</h1>
        <div class="e-exo-barre" aria-hidden="true">${s.items.map((_, i) => {
        let c = '';
        if (s.reponses[i] === true) c = 'ok'; else if (s.reponses[i] === false) c = 'ko'; else if (i === s.index) c = 'en-cours';
        return `<i class="${c}"></i>`;
      }).join('')}</div>
        <div class="e-exo-carte">
          <p class="e-exo-compteur">Question ${s.index + 1} sur ${s.items.length}</p>
          <p class="e-exo-question">${item.q}</p>${corps}
          <div id="e-retour"></div>
        </div></div>`,
    );
    vue().querySelectorAll('.e-exo-choix button').forEach((b) =>
      b.addEventListener('click', (ev) => repondre(parseInt(ev.currentTarget.getAttribute('data-choix'), 10))));
    const f = document.getElementById('e-form-saisie');
    if (f) {
      f.addEventListener('submit', (ev) => { ev.preventDefault(); repondre(document.getElementById('e-saisie').value); });
      document.getElementById('e-saisie').focus();
    }
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
    vue().querySelectorAll('.e-exo-choix button').forEach((b) => {
      b.disabled = true;
      const i = parseInt(b.getAttribute('data-choix'), 10);
      if (i === bon) b.classList.add('juste'); else if (i === valeur) b.classList.add('faux');
    });
    const f = document.getElementById('e-form-saisie');
    if (f) { f.querySelector('input').disabled = true; f.querySelector('button').disabled = true; }
    try { window.KonstrioAudio && window.KonstrioAudio[juste ? 'good' : 'soft'] && window.KonstrioAudio[juste ? 'good' : 'soft'](); } catch (e) { /* ignore */ }

    const dernier = s.index === s.items.length - 1;
    document.getElementById('e-retour').innerHTML =
      `<div class="e-exo-retour ${juste ? 'ok' : 'ko'}">
        <strong>${juste ? '✅ C\'est juste' : '🔁 Pas encore'}</strong>
        ${juste ? '' : `<p>La bonne réponse : <strong>${bonneReponse(item)}</strong></p>`}
        <p>${item.explication}</p></div>
      <button class="e-bouton" id="e-suivant" type="button">${dernier ? 'Voir mon résultat' : 'Question suivante'}</button>`;
    document.getElementById('e-suivant').addEventListener('click', () => {
      if (dernier) { s.termine = true; enregistrer(); } else { s.index += 1; }
      rendreExo();
    });
    document.getElementById('e-suivant').focus();
  }
  function bonneReponse(item) {
    if (item.type === 'qcm') return item.choix[item.reponse];
    if (item.type === 'vraifaux') return item.reponse ? 'Vrai' : 'Faux';
    return N.ech(item.reponses[0]);
  }
  async function enregistrer() {
    const s = session;
    const justes = s.reponses.filter(Boolean).length;
    try {
      const ligne = await N.api('/resultats', {
        method: 'PUT', body: JSON.stringify({ matiere: s.mid, ref: s.ref, justes, total: s.items.length }),
      });
      N.etat.resultats[N.cle(s.mid, s.ref)] = ligne;
      try {
        if (window.KonstrioAch) {
          window.KonstrioAch.recordPlay && window.KonstrioAch.recordPlay(N.cle(s.mid, s.ref), s.mid);
          window.KonstrioAch.recordWin && window.KonstrioAch.recordWin(N.cle(s.mid, s.ref), Math.round((justes / s.items.length) * 100));
        }
      } catch (e) { /* les trophées ne doivent jamais bloquer */ }
      N.majReussites();
    } catch (e) { N.signaler('Résultat non enregistré : ' + e.message); }
  }
  function rendreBilan() {
    const s = session;
    const m = N.matiere(s.mid);
    const l = N.lecon(m, s.ref);
    const justes = s.reponses.filter(Boolean).length;
    const pct = Math.round((justes / s.items.length) * 100);
    let message;
    if (pct === 100) message = 'Tout juste. Cette notion est solide.';
    else if (pct >= 75) message = 'Très bon résultat. Reprends seulement les questions ratées.';
    else if (pct >= 50) message = 'La base est là. Relis la fiche de révision, puis refais la série.';
    else message = 'Reprends la fiche de cours avant de refaire la série. Ce n\'est pas un problème d\'entraînement, c\'est une notion à revoir.';
    const ratees = s.items.filter((_, i) => s.reponses[i] === false);

    afficher(
      `<div class="e-exo">
        <h1 style="font-size:1.8rem;text-align:center">${pct === 100 ? '🏆' : '📊'} ${justes} sur ${s.items.length}</h1>
        <p class="e-intro" style="text-align:center">${N.ech(l.titre)}</p>
        <div class="e-carte" style="margin-bottom:1rem"><p style="margin:0">${N.ech(message)}</p></div>
        ${ratees.length ? `<div class="e-carte" style="margin-bottom:1rem">
          <h2 style="font-size:1rem;margin-bottom:.4rem">À revoir</h2>
          <ul style="margin:0;padding-left:1.1rem">${ratees.map((r) => `<li>${r.q}</li>`).join('')}</ul></div>` : ''}
        <div class="e-actions" style="justify-content:center">
          <button class="e-bouton" id="e-refaire" type="button">↺ Refaire</button>
          ${(l.docs || []).indexOf('revision') !== -1 ? `<a class="e-bouton e-bouton-doux" href="#/lecon/${s.mid}/${s.ref}/revision">🧠 Fiche de révision</a>` : ''}
          <a class="e-bouton e-bouton-fin" href="#/matiere/${s.mid}">← ${N.ech(m.nom)}</a>
        </div></div>`,
    );
    document.getElementById('e-refaire').addEventListener('click', () => vueExos(s.mid, s.ref));
  }

  /* ---------- Calendrier ------------------------------------------------------------ */
  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  /** Le mois affiché en bandeau : une pastille par jour, les séances repérées. */
  function bandeauMois(ancre, seances) {
    const premier = ancre.slice(0, 8) + '01';
    const d = new Date(premier + 'T12:00:00');
    const jours = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const decalage = (d.getDay() + 6) % 7;
    const aujourd = N.jourIso();
    const lundiCourant = N.lundiDe(ancre);

    const cases = [];
    for (let i = 0; i < decalage; i += 1) cases.push('<li class="vide" aria-hidden="true"></li>');
    for (let n = 1; n <= jours; n += 1) {
      const iso = premier.slice(0, 8) + String(n).padStart(2, '0');
      const duJour = seances.filter((x) => x.date === iso);
      const cours = duJour.some((x) => x.type === 'cours');
      const perso = duJour.some((x) => x.type === 'travail');
      const classes = [];
      if (iso === aujourd) classes.push('auj');
      if (N.lundiDe(iso) === lundiCourant) classes.push('semaine');
      if (cours) classes.push('cours');
      else if (perso) classes.push('perso');
      cases.push(`<li class="${classes.join(' ')}"><a href="#/calendrier/${iso}"
        aria-label="${N.ech(N.enFrancais(iso, true))}">${n}</a></li>`);
    }

    return `<section class="e-mois">
      <div class="e-mois-tete">
        <button class="e-rond" type="button" data-mois="${N.decaler(premier, -1)}" aria-label="Mois précédent">‹</button>
        <h2>${MOIS[d.getMonth()]} ${d.getFullYear()}</h2>
        <button class="e-rond" type="button" data-mois="${N.decaler(premier, jours)}" aria-label="Mois suivant">›</button>
      </div>
      <ol class="e-mois-entetes" aria-hidden="true">
        <li>L</li><li>M</li><li>M</li><li>J</li><li>V</li><li>S</li><li>D</li>
      </ol>
      <ol class="e-mois-jours">${cases.join('')}</ol>
      <p class="e-mois-legende">
        <span class="p cours"></span> cours
        <span class="p perso"></span> travail perso
      </p>
    </section>`;
  }

  async function vueCalendrier(depart) {
    const valide = depart && /^\d{4}-\d{2}-\d{2}$/.test(depart);
    const ancre = valide ? depart : N.jourIso();
    const lundi = N.lundiDe(ancre);
    const aujourd = N.jourIso();
    afficher('<p class="e-vide">Chargement…</p>');

    // On charge large : le bandeau du mois et la semaine affichée.
    const seances = await N.chargerSeances(N.decaler(ancre.slice(0, 8) + '01', -7),
      N.decaler(ancre.slice(0, 8) + '01', 44));

    const colonnes = N.JOURS.map((nom, i) => {
      const jour = N.decaler(lundi, i);
      const duJour = seances.filter((x) => x.date === jour)
        .sort((a, b) => String(a.debut).localeCompare(String(b.debut)));
      return `<div class="e-jour-col${jour === aujourd ? ' auj' : ''}">
        <p class="e-jour-nom">${nom}<b>${Number(jour.slice(8, 10))}</b></p>
        ${duJour.length
    ? duJour.map(evenement).join('')
    : '<p class="e-jour-repos">Rien de prévu</p>'}
      </div>`;
    }).join('');

    const semaine = seances.filter((x) => x.date >= lundi && x.date <= N.decaler(lundi, 4));
    const cours = semaine.filter((x) => x.type === 'cours').length;

    afficher(
      `<h1>Ma semaine</h1>
       <p class="e-intro">Cours le lundi, le mercredi et le vendredi. Deux temps courts le mardi et le jeudi.</p>
       ${blocChoix(seances)}
       ${bandeauMois(ancre, seances)}
       <section class="e-semaine">
         <div class="e-semaine-tete">
           <button class="e-rond" id="e-prec" type="button" aria-label="Semaine précédente">‹</button>
           <div>
             <h2>Du ${N.ech(N.enFrancais(lundi))} au ${N.ech(N.enFrancais(N.decaler(lundi, 4)))}</h2>
             <p>${cours} cours cette semaine</p>
           </div>
           <button class="e-rond" id="e-suiv" type="button" aria-label="Semaine suivante">›</button>
         </div>
         <div class="e-semaine-grille">${colonnes}</div>
         <p class="e-semaine-pied"><button class="e-bouton e-bouton-fin" id="e-auj" type="button">Revenir à aujourd'hui</button></p>
       </section>`,
    );
    document.getElementById('e-prec').addEventListener('click', () => { location.hash = '#/calendrier/' + N.decaler(lundi, -7); });
    document.getElementById('e-suiv').addEventListener('click', () => { location.hash = '#/calendrier/' + N.decaler(lundi, 7); });
    document.getElementById('e-auj').addEventListener('click', () => { location.hash = '#/calendrier/' + N.jourIso(); });
    vue().querySelectorAll('[data-mois]').forEach((b) => b.addEventListener('click',
      () => { location.hash = '#/calendrier/' + b.getAttribute('data-mois'); }));
    brancherChoix(() => vueCalendrier(ancre));
  }

  function evenement(s) {
    if (s.type === 'travail') {
      return `<article class="e-evt perso">
        <p class="h">${N.ech(s.debut)} · 15 min</p>
        <p class="t">Temps perso</p>
        <p class="d">${N.ech(court(String(s.travail || 'À voir ensemble'), 78))}</p>
      </article>`;
    }
    const liens = (s.lecons || []).map((r) => {
      const info = N.libelleLecon(r);
      if (!info || !(info.l.docs || []).length || !N.accessible(info.m.id, info.l.ref)) return '';
      return `<a class="o" href="#/lecon/${info.m.id}/${info.l.ref}/cours">${info.m.icone} Ouvrir</a>`;
    }).filter(Boolean).join('');
    const titres = String(s.objectif || 'Séance').split(' · ');
    return `<article class="e-evt cours${s.statut === 'faite' ? ' faite' : ''}">
      <p class="h">${N.ech(s.debut)} à ${N.ech(s.fin)}</p>
      ${titres.map((t) => `<p class="t">${N.ech(t)}</p>`).join('')}
      ${(s.choix || []).length && !s.choisi_le ? '<p class="c">✨ à toi de choisir</p>' : ''}
      ${liens ? `<p class="l">${liens}</p>` : ''}
    </article>`;
  }

  /** Coupe sur un espace, sans casser un mot en deux. */
  function court(texte, max) {
    const t = String(texte || '');
    if (t.length <= max) return t;
    const coupe = t.slice(0, max);
    const espace = coupe.lastIndexOf(' ');
    return (espace > max * 0.6 ? coupe.slice(0, espace) : coupe).replace(/[\s,.;:·]+$/, '') + '…';
  }

  /* ---------- Mes réussites -------------------------------------------------- */
  const PALIERS = [
    { s: 1, i: '🌱', n: 'La première étoile', d: 'Une fiche lue jusqu\'au bout.' },
    { s: 5, i: '🔆', n: 'Cinq étoiles', d: 'Le pli est pris.' },
    { s: 12, i: '🎯', n: 'Douze étoiles', d: 'Une série sans faute vaut son étoile.' },
    { s: 25, i: '🚀', n: 'Vingt-cinq étoiles', d: 'Plusieurs matières avancent en même temps.' },
    { s: 50, i: '🏅', n: 'Cinquante étoiles', d: 'La moitié de l\'année est derrière toi.' },
    { s: 100, i: '👑', n: 'Cent étoiles', d: 'L\'année complète.' },
  ];

  function vueReussites() {
    const r = N.reussites();
    const c = N.chiffres();
    const parfaits = Object.values(N.etat.resultats)
      .filter((x) => x.meilleur === x.total && x.total > 0).length;
    const suivant = PALIERS.find((x) => r.total < x.s);
    const atteint = PALIERS.filter((x) => r.total >= x.s).pop();
    const bas = atteint ? atteint.s : 0;
    const haut = suivant ? suivant.s : (atteint ? atteint.s : 1);
    const part = suivant ? Math.round(((r.total - bas) / (haut - bas)) * 100) : 100;

    afficher(
      `<h1>Mes réussites</h1>
       <p class="e-intro">Une étoile se gagne pour de bon. Rien ne redescend, jamais.</p>

       <section class="e-etoiles-tete">
         <p class="e-etoiles-compte"><span aria-hidden="true">⭐</span> ${r.total}</p>
         <p class="e-etoiles-libelle">${r.total > 1 ? 'étoiles gagnées' : 'étoile gagnée'}</p>
         ${suivant
    ? `<div class="e-jauge" role="img" aria-label="${part} % du chemin vers ${N.ech(suivant.n)}">
              <i style="width:${part}%"></i></div>
            <p class="e-etoiles-suite">Encore ${suivant.s - r.total} pour ${N.ech(suivant.n.toLowerCase())}.</p>`
    : '<p class="e-etoiles-suite">Tous les paliers sont atteints.</p>'}
       </section>

       <h2 class="e-titre-section">D'où viennent tes étoiles</h2>
       <ul class="e-stats">
         <li><strong>${r.fiches}</strong><span>fiches terminées<em>1 étoile chacune</em></span></li>
         <li><strong>${r.series}</strong><span>séries réussies<em>1 étoile chacune</em></span></li>
         <li><strong>${r.lecons}</strong><span>leçons validées<em>3 étoiles chacune</em></span></li>
         <li><strong>${parfaits}</strong><span>séries sans faute<em>le maximum</em></span></li>
       </ul>

       <h2 class="e-titre-section">Les paliers</h2>
       <ul class="e-badges">${PALIERS.map((b) => `<li class="${r.total >= b.s ? 'obtenu' : ''}">
         <span class="b" aria-hidden="true">${b.i}</span>
         <span><b>${N.ech(b.n)}</b><em>${N.ech(b.d)}</em></span>
         ${r.total >= b.s ? '<span class="coche" aria-label="obtenu">✓</span>' : `<span class="reste">${b.s - r.total}</span>`}
       </li>`).join('')}</ul>

       <h2 class="e-titre-section">Matière par matière</h2>
       <ul class="e-tuiles">${PROGRAMME.matieres.map((m) => {
    const pr = N.progression(m);
    return `<li><a href="#/matiere/${m.id}"><span class="ico" aria-hidden="true">${m.icone}</span>
          <b>${N.ech(m.nom)}</b><span>${pr.faites} sur ${pr.total} validées</span></a></li>`;
  }).join('')}</ul>
       <p class="e-note-fin">${c.validees} leçon(s) validée(s) sur les ${c.total} de l'année.</p>`,
    );
  }

  /* ---------- Messagerie ------------------------------------------------------------------ */
  const RAPIDES = ['J\'ai terminé 🎉', 'Je bloque sur un exercice', 'Tu peux me donner un indice ?', 'C\'était trop facile 😄', 'On peut revoir ça ensemble ?'];

  function vueMessages(contexte) {
    afficher(
      `<h1>Messages</h1>
       <p class="e-intro">Écris à Bastien, il te répondra ici.</p>
       <div class="e-tchat" id="e-tchat"><p class="e-vide">Chargement…</p></div>
       <div class="e-rapides">${RAPIDES.map((r) => `<button type="button" data-rapide="${N.ech(r)}">${N.ech(r)}</button>`).join('')}</div>
       ${contexte ? `<p style="font-size:.85rem;color:var(--e-encre-doux);margin:0 0 .5rem">À propos de <strong>${N.ech(contexte)}</strong>
         <button type="button" id="e-retirer-ctx" style="border:0;background:transparent;cursor:pointer;color:inherit">✕</button></p>` : ''}
       <form class="e-ecrire" id="e-form-msg">
         <label class="visuellement-cache" for="e-texte">Message</label>
         <textarea id="e-texte" rows="2" maxlength="2000" placeholder="Écris ton message…"></textarea>
         <button class="e-bouton" type="submit">Envoyer</button>
       </form>`,
    );

    let ctx = contexte || null;
    const btnCtx = document.getElementById('e-retirer-ctx');
    if (btnCtx) btnCtx.addEventListener('click', (ev) => { ctx = null; ev.target.parentElement.remove(); });

    async function charger() {
      try {
        const { messages } = await N.api('/messages');
        const zone = document.getElementById('e-tchat');
        if (!zone) return;
        zone.innerHTML = messages.length ? messages.map((m) => {
          const moi = m.auteur === 'eleve';
          return `<article class="e-msg ${moi ? 'moi' : ''}">
            <span class="e-msg-pastille" aria-hidden="true">${moi ? 'S' : 'B'}</span>
            <div><p class="e-msg-tete">${moi ? 'Moi' : 'Bastien'} · ${N.ech(N.dateCourte(m.cree_le))}</p>
              <div class="e-bulle">${m.contexte ? `<span class="contexte">${N.ech(m.contexte)}</span>` : ''}
                <p class="texte">${N.ech(m.texte)}</p></div></div></article>`;
        }).join('') : '<p class="e-vide">Aucun message pour le moment. Lance la conversation !</p>';
        zone.scrollTop = zone.scrollHeight;
        await N.api('/messages', { method: 'PATCH' });
        N.etat.messagesNonLus = 0;
        nav();
      } catch (e) { N.signaler(e.message); }
    }
    charger();

    vue().querySelectorAll('[data-rapide]').forEach((b) => b.addEventListener('click', () => {
      const champ = document.getElementById('e-texte');
      champ.value = b.getAttribute('data-rapide');
      champ.focus();
    }));

    document.getElementById('e-form-msg').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const champ = document.getElementById('e-texte');
      const texte = champ.value.trim();
      if (!texte) return;
      try {
        await N.api('/messages', { method: 'POST', body: JSON.stringify({ texte, contexte: ctx }) });
        champ.value = '';
        await charger();
      } catch (e) { N.signaler(e.message); }
    });
  }

  /* ---------- Mon travail ------------------------------------------------------------------- */
  function vueTravail() {
    afficher(
      `<h1>Mon travail</h1>
       <p class="e-intro">Prends une photo de ce que tu as fait à la main, et envoie-la.</p>
       <form class="e-depot" id="e-depot">
         <span class="ico" aria-hidden="true">📸</span>
         <p id="e-depot-texte">Glisse ton fichier ici, ou clique pour le choisir.</p>
         <input type="file" id="e-fichier" accept="image/*,application/pdf,text/plain">
         <button class="e-bouton e-bouton-doux" type="button" id="e-choisir">Choisir un fichier</button>
         <input type="text" id="e-note" maxlength="300" placeholder="Un mot : exercice 21, rédaction…">
         <p style="margin:.9rem 0 0"><button class="e-bouton" type="submit" id="e-envoyer">Envoyer</button></p>
       </form>
       <h2 class="e-titre-section">Ce qu'on s'est envoyé</h2>
       <div id="e-liste-fichiers"><p class="e-vide">Chargement…</p></div>`,
    );

    const zone = document.getElementById('e-depot');
    const champ = document.getElementById('e-fichier');
    const texte = document.getElementById('e-depot-texte');
    document.getElementById('e-choisir').addEventListener('click', () => champ.click());
    champ.addEventListener('change', () => {
      if (champ.files && champ.files[0]) texte.innerHTML = `<span class="nom-fichier">${N.ech(champ.files[0].name)}</span>`;
    });
    ['dragenter', 'dragover'].forEach((t) => zone.addEventListener(t, (e) => { e.preventDefault(); zone.classList.add('survol'); }));
    ['dragleave', 'drop'].forEach((t) => zone.addEventListener(t, (e) => { e.preventDefault(); zone.classList.remove('survol'); }));
    zone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        champ.files = e.dataTransfer.files;
        texte.innerHTML = `<span class="nom-fichier">${N.ech(e.dataTransfer.files[0].name)}</span>`;
      }
    });

    async function charger() {
      try {
        const { fichiers, stockage } = await N.api('/fichiers');
        const liste = document.getElementById('e-liste-fichiers');
        if (!liste) return;
        if (!stockage) { liste.innerHTML = '<p class="e-vide">L\'envoi de fichiers n\'est pas disponible.</p>'; zone.hidden = true; return; }
        liste.innerHTML = fichiers.length ? `<ul class="e-fichiers">${fichiers.map((f) => `<li>
          <span class="vignette" aria-hidden="true">${f.type.startsWith('image/') ? '🖼️' : (f.type === 'application/pdf' ? '📕' : '📄')}</span>
          <span class="corps"><a href="/api/fichiers/${f.id}">${N.ech(f.nom)}</a>
            <span>${f.auteur === 'prof' ? 'Bastien' : 'Moi'} · ${N.ech(N.dateCourte(f.cree_le))} · ${N.poids(f.taille)}</span></span>
        </li>`).join('')}</ul>` : '<p class="e-vide">Rien d\'envoyé pour le moment.</p>';
      } catch (e) { N.signaler(e.message); }
    }
    charger();

    zone.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (!champ.files || !champ.files[0]) { N.signaler('Choisis d\'abord un fichier.'); return; }
      const bouton = document.getElementById('e-envoyer');
      const d = new FormData();
      d.append('fichier', champ.files[0]);
      d.append('note', document.getElementById('e-note').value);
      bouton.disabled = true; bouton.textContent = 'Envoi…';
      try {
        await N.api('/fichiers', { method: 'POST', body: d });
        champ.value = ''; document.getElementById('e-note').value = '';
        texte.textContent = 'Glisse ton fichier ici, ou clique pour le choisir.';
        N.signaler('C\'est envoyé, Bastien va le voir.', 'succes');
        charger();
      } catch (e) { N.signaler(e.message); }
      finally { bouton.disabled = false; bouton.textContent = 'Envoyer'; }
    });
  }

  function vueIntrouvable() {
    afficher('<div class="e-vide"><p>Cette page n\'existe pas.</p><p><a class="e-bouton e-bouton-doux" href="#/hub">Revenir à l\'accueil</a></p></div>');
  }

  /* ---------- Routage --------------------------------------------------------------------------- */
  function rendre(p) {
    switch (p[0]) {
      case '': case 'hub': case 'accueil': return vueHub();
      case 'matieres': return vueMatieres();
      case 'matiere': return vueMatiere(p[1]);
      case 'lecon': return vueLecon(p[1], p[2], p[3]);
      case 'exos': return vueExos(p[1], p[2]);
      case 'calendrier': return vueCalendrier(p[1]);
      case 'progres': case 'reussites': return vueReussites();
      case 'messages': return vueMessages(p[1] ? decodeURIComponent(p.slice(1).join('/')) : null);
      case 'travail': return vueTravail();
      default: return vueIntrouvable();
    }
  }

  window.VUE_ELEVE = { nav, rendre };
})();
