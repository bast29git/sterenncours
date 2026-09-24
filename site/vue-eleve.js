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
  /** Les documents ouverts à Sterenn. La grille d'évaluation reste au professeur. */
  const TYPES_ELEVE = ['cours', 'revision', 'exercices', 'evaluation'];
  /** Les documents que Sterenn peut ouvrir : selon l'accès décidé par le professeur. */
  const docsVisibles = (l) => (l.docs || []).filter((t) => TYPES_ELEVE.indexOf(t) !== -1
    && (!l.matiere || N.accesDoc(l.matiere, l.ref, t)));
  const vue = () => document.getElementById('vue-eleve');
  let observateurOrbite = null;

  const ONGLETS = [
    { route: 'hub', ico: 'ic-accueil', texte: 'Aujourd\'hui' },
    { route: 'matieres', ico: 'ic-planete', texte: 'Mes matières' },
    { route: 'calendrier', ico: 'ic-calendrier', texte: 'Ma semaine' },
    { route: 'jeux', ico: 'ic-etincelle', texte: 'Jeux' },
    { route: 'messages', ico: 'ic-message', texte: 'Messages' },
  ];

  /** Les jeux 2D et 3D rattachés à une leçon, ou à une matière entière. */
  const jeuxDe = (mid, ref) => (window.JEUX || []).filter((j) => N.accesJeu(j.id) && j.lecons.some((c) => c === mid + ':' + ref));
  const jeuxMatiere = (mid) => (window.JEUX || []).filter((j) => N.accesJeu(j.id) && j.lecons.some((c) => c.split(':')[0] === mid));
  const jeuGagne = (j) => { const r = N.etat.resultats['jeu/' + j.id]; return !!(r && r.meilleur >= 70); };
  const lienJeu = (j, classe) => `<a class="${classe || ''}" href="${j.url}" title="${N.ech(j.type === '3d' ? 'Monde 3D' : 'Jeu')} : ${N.ech(j.titre)}">${j.ico} ${N.ech(j.titre)}${jeuGagne(j) ? ' ✓' : ''}</a>`;

  function nav() {
    const courant = (location.hash || '#/hub').replace(/^#\/?/, '').split('/')[0] || 'hub';
    const actif = (r) => (r === courant
      || (r === 'matieres' && ['matiere', 'lecon', 'exos'].includes(courant))
      || (r === 'messages' && courant === 'travail') ? ' class="actif"' : '');
    document.getElementById('e-nav').innerHTML = ONGLETS.map((o) => {
      const bulle = o.route === 'messages' && N.etat.messagesNonLus
        ? `<span class="bulle">${N.etat.messagesNonLus}</span>` : '';
      return `<a href="#/${o.route}"${actif(o.route)}>
        <svg class="ic" aria-hidden="true"><use href="#${o.ico}"/></svg><span>${o.texte}</span>${bulle}</a>`;
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
        if (docsVisibles(l).length && N.accessible(m.id, l.ref) && !N.estValidee(m.id, l.ref)) return { m, l };
      }
    }
    return null;
  }

  /** Les séances à choix à venir, de la plus proche à la plus lointaine. */
  const seancesAChoix = (seances) => seances
    .filter((s) => (s.choix || []).length >= 2 && s.date >= N.jourIso())
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  /** Le choix se fait au plus tard deux jours avant la séance. */
  const dateLimiteChoix = (s) => N.decaler(s.date, -2);
  function etatChoix(s) {
    const aujourd = N.jourIso();
    const limite = dateLimiteChoix(s);
    const jours = Math.round((new Date(limite + 'T12:00:00') - new Date(aujourd + 'T12:00:00')) / 86400000);
    if (s.choisi_le) return { code: 'fait', texte: 'Choix fait. Tu peux encore changer d\'avis jusqu\'au ' + N.enFrancais(s.date, true) + '.' };
    if (jours < 0) return { code: 'retard', texte: 'La date limite est passée : choisis maintenant, sinon Bastien prendra la première leçon.' };
    if (jours === 0) return { code: 'urgent', texte: 'C\'est le dernier jour pour choisir.' };
    if (jours <= 3) return { code: 'bientot', texte: `Il te reste ${jours} jour${jours > 1 ? 's' : ''} pour choisir (avant le ${N.enFrancais(limite, true)}).` };
    return { code: 'ok', texte: `À choisir avant le ${N.enFrancais(limite, true)}.` };
  }
  /** Le choix actuel d'une séance : la leçon de la séance qui fait partie des choix. */
  const leconChoisie = (s) => (s.lecons || []).find((r) => (s.choix || []).indexOf(r) !== -1) || null;

  function carteChoix(s, ouverte) {
    const e = etatChoix(s);
    const choisie = leconChoisie(s);
    const info = choisie ? N.libelleLecon(choisie) : null;
    const liste = `<ul class="e-choix-liste">${(s.choix || []).map((r) => {
      const x = N.libelleLecon(r);
      if (!x) return '';
      const actuelle = s.choisi_le && r === choisie;
      return `<li><button type="button" data-seance="${s.id}" data-lecon="${r}" class="${actuelle ? 'actuelle' : ''}" aria-pressed="${actuelle ? 'true' : 'false'}">
        <span class="m">${x.m.icone} ${N.ech(x.m.nom)}</span>
        <b>${N.ech(x.l.titre)}</b>
        <span>${x.l.notions.slice(0, 3).map(N.ech).join(' · ')}</span>
        ${actuelle ? '<span class="coche">✓ ton choix</span>' : ''}</button></li>`;
    }).join('')}</ul>`;
    return `<article class="e-choix-carte etat-${e.code}" data-choix="${s.id}">
      <p class="e-choix-quand">${N.ic('ic-calendrier')} Séance du ${N.ech(N.enFrancais(s.date, true))}, de ${N.ech(s.debut)} à ${N.ech(s.fin)}</p>
      <p class="e-choix-etat">${e.code === 'retard' || e.code === 'urgent' ? N.ic('ic-horloge') : ''} ${N.ech(e.texte)}</p>
      ${s.choisi_le && !ouverte
    ? `<p class="e-choix-fait">Tu as choisi : <b>${info ? N.ech(info.m.icone + ' ' + info.l.titre) : '?'}</b>
         <button type="button" class="e-bouton e-bouton-fin" data-changer="${s.id}">Changer</button></p>`
    : liste}
    </article>`;
  }

  /** Sur l'accueil : les trois prochaines séances à choix, la plus proche ouverte. */
  function blocChoix(seances) {
    const liste = seancesAChoix(seances);
    if (!liste.length) return '';
    const proches = liste.slice(0, 3);
    return `<section class="e-choix-jour" aria-labelledby="e-choix-titre">
      <h2 id="e-choix-titre">${N.ic('ic-etincelle')} À toi de choisir</h2>
      <p class="aide">Une séance sur quatre, la deuxième leçon est à toi. Trois leçons sont proposées, toutes au programme : <b>clique sur celle que tu veux</b>. Tu peux changer d'avis jusqu'au jour de la séance.</p>
      ${proches.map((s, k) => carteChoix(s, k === 0 && !s.choisi_le)).join('')}
      ${liste.length > 3 ? `<p class="e-actions"><a class="e-bouton e-bouton-doux" href="#/choix">Voir tous mes choix (${liste.length})</a></p>` : ''}
    </section>`;
  }

  /** Bandeau de rappel : un choix en retard ou à faire dans les trois jours. */
  function rappelChoix(seances) {
    const s = seancesAChoix(seances).find((x) => !x.choisi_le && ['retard', 'urgent', 'bientot'].indexOf(etatChoix(x).code) !== -1);
    if (!s) return '';
    const e = etatChoix(s);
    return `<p class="e-rappel ${e.code === 'retard' ? 'e-rappel-fort' : ''}">${N.ic('ic-horloge')} <b>Un choix t'attend</b> pour la séance du ${N.ech(N.enFrancais(s.date, true))}. ${N.ech(e.texte)} <a href="#/choix">Choisir maintenant</a></p>`;
  }

  /** Page « Mes choix » : toutes les séances à choix à venir, modifiables. */
  function vueChoix() {
    const liste = seancesAChoix(N.etat.seances);
    afficher(`<h1>Mes choix</h1>
      <p class="e-intro">Une séance sur quatre, tu décides de la deuxième leçon. Ici, tu vois tous les choix à venir et tu peux en changer un, jusqu'au jour de la séance.</p>
      ${liste.length ? liste.map((s) => carteChoix(s, !s.choisi_le)).join('') : '<div class="e-carte e-vide"><p>Aucune séance à choix pour l\'instant. Elles apparaîtront ici dès que le planning en proposera.</p></div>'}`);
    brancherChoix(vueChoix);
  }

  function brancherChoix(apres) {
    vue().querySelectorAll('[data-changer]').forEach((b) => b.addEventListener('click', () => {
      const s = N.etat.seances.find((x) => x.id === b.getAttribute('data-changer'));
      const carte = b.closest('.e-choix-carte');
      if (!s || !carte) return;
      carte.outerHTML = carteChoix(s, true);
      brancherChoix(apres);
    }));
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

  /** Sur l'accueil : la dernière félicitation pas encore vue, mise en avant. */
  function blocMotNouveau() {
    const f = (N.etat.felicitations || []).find((x) => !x.vu_le);
    if (!f) return '';
    return `<section class="e-carte e-mot-vedette" aria-label="Un mot de Bastien">
      <span class="e-mot-ico" aria-hidden="true">${N.ic('ic-trophee')}</span>
      <div><p class="quand">Un mot de Bastien</p><p class="e-mot-texte">${N.ech(f.texte)}</p>
      <p class="e-actions"><a class="e-bouton e-bouton-doux" href="#/reussites">Voir mes réussites</a>
      <button class="e-bouton e-bouton-fin" type="button" id="e-mot-vu">J'ai lu</button></p></div>
    </section>`;
  }
  async function marquerMotsVus() {
    if (!(N.etat.felicitations || []).some((x) => !x.vu_le)) return;
    try {
      await N.api('/felicitations', { method: 'PATCH' });
      const le = new Date().toISOString();
      N.etat.felicitations.forEach((x) => { if (!x.vu_le) x.vu_le = le; });
    } catch (e) { /* on réessaiera à la prochaine visite */ }
  }

  function vueHub() {
    const jour = seanceDuJour();
    const suivante = prochaineSeance();
    const travail = travailDuJour();
    const vedette = jour || suivante;
    const ouverte = prochaineLeconOuverte();
    const cible = vedette && (vedette.lecons || []).length
      ? ((vedette.lecons || []).map((r) => N.libelleLecon(r)).find((x) => x && x.m.id !== 'module') || ouverte)
      : ouverte;
    const c = N.chiffres();

    const moduleVedette = vedette && (vedette.lecons || []).map((r) => N.libelleLecon(r)).find((x) => x && x.m.id === 'module');
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
          ${moduleVedette ? `<a class="e-bouton" href="${moduleVedette.l.url}">${moduleVedette.l.icone} ${N.ech(moduleVedette.l.titre)}</a>` : ''}
          ${cible && cible.m.id !== 'module' && docsVisibles(cible.l).length && N.accessible(cible.m.id, cible.l.ref)
        ? `<a class="e-bouton${moduleVedette ? ' e-bouton-doux' : ''}" href="#/lecon/${cible.m.id}/${cible.l.ref}/cours">Ouvrir ma leçon</a>` : ''}
          ${cible && N.banque(cible.m.id, cible.l.ref)
        ? `<a class="e-bouton e-bouton-doux" href="#/exos/${cible.m.id}/${cible.l.ref}">M'entraîner</a>` : ''}
        </p>
       </section>

       ${rappelChoix(N.etat.seances)}
       ${blocMotNouveau()}
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
         <li><a href="#/reussites"><span class="ico" aria-hidden="true"><svg class="ic"><use href="#ic-etoile"/></svg></span>
           <b>Mes réussites</b><span>${N.reussites().total} étoile(s)</span></a></li>
         <li><a href="#/messages"><span class="ico" aria-hidden="true"><svg class="ic"><use href="#ic-message"/></svg></span>
           <b>Messages</b><span>${N.etat.messagesNonLus ? N.etat.messagesNonLus + ' non lu(s)' : 'Écrire, envoyer une photo'}</span></a></li>
         <li><a href="#/calendrier"><span class="ico" aria-hidden="true"><svg class="ic"><use href="#ic-calendrier"/></svg></span>
           <b>Ma semaine</b><span>Ce qui est prévu</span></a></li>
         <li><a href="#/matieres"><span class="ico" aria-hidden="true"><svg class="ic"><use href="#ic-planete"/></svg></span>
           <b>Mes matières</b><span>Ouvrir un parcours</span></a></li>
         <li><a href="#/jeux"><span class="ico" aria-hidden="true"><svg class="ic"><use href="#ic-etincelle"/></svg></span>
           <b>Jeux</b><span>${(window.JEUX || []).length} jeux et mondes 3D</span></a></li>
       </ul>

       <h2 class="e-titre-section">${N.ic('ic-cible')} Pour commencer</h2>
       <ul class="e-tuiles e-tuiles-modules">
         <li class="${N.profil('moi.decouverte_fait') ? 'fait' : ''}"><a href="#/decouverte"><span class="ico" aria-hidden="true">🤝</span>
           <b>Faire connaissance</b><span>${N.profil('moi.decouverte_fait') ? 'Terminé ✓ · relire ma carte' : 'Notre première séance, pas à pas'}</span></a></li>
         <li class="${N.profil('moi.visite_faite') && N.profil('moi.visite_faite') !== 'interrompue' ? 'fait' : ''}"><a href="#/visite"><span class="ico" aria-hidden="true">🗺️</span>
           <b>Visite guidée</b><span>${N.profil('moi.visite_faite') && N.profil('moi.visite_faite') !== 'interrompue' ? 'Vue ✓ · la refaire' : 'Sept étapes avec Opale'}</span></a></li>
         <li class="${N.profil('moi.positionnement') && !N.profil('moi.positionnement').enCours ? 'fait' : ''}"><a href="#/positionnement"><span class="ico" aria-hidden="true">🧭</span>
           <b>Où j'en suis</b><span>${N.profil('moi.positionnement') && !N.profil('moi.positionnement').enCours ? 'Fait ✓ · voir mon point de départ' : 'À faire avec Bastien, sans note'}</span></a></li>
       </ul>`,
    );
    brancherChoix(vueHub);
    monterOrbite();
    const vu = document.getElementById('e-mot-vu');
    if (vu) vu.addEventListener('click', async () => { await marquerMotsVus(); vueHub(); });
  }

  async function monterOrbite() {
    const hote = document.getElementById('e-orbite');
    if (!hote) return;
    const mondes = PROGRAMME.matieres.map((m) => {
      const p = N.progression(m);
      const prets = m.lecons.filter((l) => docsVisibles(l).length).length;
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
        const prets = m.lecons.filter((l) => docsVisibles(l).length).length;
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
      const dispo = docsVisibles(l).length;
      const ouverte = N.accessible(mid, l.ref);
      const faite = N.estValidee(mid, l.ref);
      const classe = faite ? 'faite' : (ouverte && dispo ? 'ouverte' : 'verrouillee');
      const actions = (ouverte && dispo)
        ? `<a class="pleine" href="#/lecon/${mid}/${l.ref}/cours">Ouvrir</a>`
          + N.TYPES_DOC.filter((t) => t.id !== 'cours' && docsVisibles(l).indexOf(t.id) !== -1)
            .map((t) => `<a href="#/lecon/${mid}/${l.ref}/${t.id}">${N.ic(t.ico)} ${t.libelle}</a>`).join('')
          + (N.banque(mid, l.ref) ? `<a href="#/exos/${mid}/${l.ref}">${N.ic('ic-cible')} M'entraîner</a>` : '')
          + jeuxDe(mid, l.ref).map((j) => lienJeu(j)).join('')
        : `<span class="e-cadenas">${N.ic('ic-verrou')} ${dispo ? N.ech(N.raisonVerrou(mid, l.ref)) : 'Cette leçon est en préparation.'}</span>`;
      return `<li class="e-etape ${classe}">
        <span class="e-pastille" aria-hidden="true">${faite ? N.ic('ic-coche') : (ouverte && dispo ? i + 1 : N.ic('ic-verrou'))}</span>
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
    if (!m || !l || !docsVisibles(l).length) return vueIntrouvable();
    if (!N.accessible(mid, ref)) {
      return afficher(`<div class="e-carte e-vide"><p>${N.ic('ic-verrou')} ${N.ech(N.raisonVerrou(mid, ref))}</p>
        <p><a class="e-bouton e-bouton-doux" href="#/matiere/${mid}">Revenir au parcours</a></p></div>`);
    }
    const ouverts = docsVisibles(l);
    if (type === 'evaluation' && ouverts.indexOf('evaluation') === -1) {
      return afficher(`<div class="e-lecteur"><header class="e-lecteur-tete">
        <p style="margin:0;color:var(--e-encre-doux);font-size:.85rem">${m.icone} ${N.ech(m.nom)}</p>
        <h1>Évaluation : ${N.ech(l.titre)}</h1>${ongletsLecon(mid, ref, ouverts, '')}</header>
        <div class="e-carte e-vide"><p>${N.ic('ic-verrou')} Cette évaluation n'est pas encore ouverte. Bastien l'ouvre quand la leçon est prête ; tu seras prévenue.</p>
        <p><a class="e-bouton e-bouton-doux" href="#/lecon/${mid}/${ref}/${ouverts[0] || 'cours'}">Revenir à la fiche</a></p></div></div>`);
    }
    const actif = ouverts.indexOf(type) !== -1 ? type : ouverts[0];
    afficher('<p class="e-vide">Chargement…</p>');
    if (actif === 'evaluation') return vueEvaluation(m, l, mid, ref, ouverts);

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
            ${ongletsLecon(mid, ref, ouverts, actif)}
          </header>
          <div id="e-fiche-hote"></div>
          <div class="e-actions">
            <button class="e-bouton" id="e-fini" type="button">${lu ? '↺ Pas encore terminée' : '✓ J\'ai terminé'}</button>
            ${N.banque(mid, ref) ? `<a class="e-bouton e-bouton-doux" href="#/exos/${mid}/${ref}">M'entraîner</a>` : ''}
            <button class="e-bouton e-bouton-fin" id="e-question" type="button">${N.ic('ic-message')} Poser une question</button>
            <a class="e-bouton e-bouton-fin" href="#/matiere/${mid}">← Mon parcours</a>
          </div>
         </div>`,
      );

      rendreFiche(document.getElementById('e-fiche-hote'), doc, cleFiche, () => document.getElementById('e-fini').click());

      document.getElementById('e-fini').addEventListener('click', async () => {
        const termine = !N.etat.fiches[cleFiche];
        try {
          const r = await N.api('/fiches', { method: 'PUT', body: JSON.stringify({ cle: cleFiche, termine }) });
          if (termine) {
            N.etat.fiches[cleFiche] = { termine_le: r.termine_le };
            N.signaler('Bravo, fiche terminée.', 'succes');
            N.majReussites();
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

  /* ---------- Évaluation : le sujet, servi par le serveur si l'accès est ouvert --- */
  function ongletsLecon(mid, ref, ouverts, actif) {
    return `<nav class="e-onglets">${ouverts.map((t) => {
      const info = N.TYPES_DOC.find((x) => x.id === t);
      return `<a href="#/lecon/${mid}/${ref}/${t}" class="${t === actif ? 'actif' : ''}">${N.ic(info.ico)} ${info.libelle}</a>`;
    }).join('')}${N.banque(mid, ref) ? `<a href="#/exos/${mid}/${ref}">${N.ic('ic-cible')} M'entraîner</a>` : ''}${ouverts.indexOf('exercices') !== -1 ? `<a href="/cahiers/${mid}/${ref}.html" target="_blank" rel="noopener">${N.ic('ic-crayon')} Cahier à imprimer</a>` : ''}${jeuxDe(mid, ref).map((j) => lienJeu(j)).join('')}</nav>`;
  }
  async function vueEvaluation(m, l, mid, ref, ouverts) {
    let e = null;
    try {
      await N.chargerScript(`data/evaluations/${mid}/${ref}.js`);
      e = (window.EVALUATIONS || {})[N.cle(mid, ref)] || null;
    } catch (err) { e = null; }
    const decision = N.decisionAcces(N.cle(mid, ref) + '/evaluation');
    const a = N.etat.acces[N.cle(mid, ref) + '/evaluation'];
    const limite = a && a.jusqu_au ? N.dateCourte(a.jusqu_au) : null;
    afficher(`<div class="e-lecteur">
      <header class="e-lecteur-tete">
        <p style="margin:0;color:var(--e-encre-doux);font-size:.85rem">${m.icone} ${N.ech(m.nom)}</p>
        <h1>Évaluation : ${N.ech(l.titre)}</h1>
        ${ongletsLecon(mid, ref, ouverts, 'evaluation')}
      </header>
      ${!e || decision !== true
    ? `<div class="e-carte e-vide"><p>${N.ic('ic-verrou')} Cette évaluation n'est pas ouverte pour le moment. Bastien l'ouvre quand la leçon est prête.</p></div>`
    : `<section class="e-carte e-eval-consignes">
          <h2>${N.ic('ic-graphique')} Comment ça se passe</h2>
          <ol>
            <li>Tu fais ce sujet <b>sur papier</b>, seule, en une fois, dans la durée indiquée.</li>
            <li>Tu écris ton prénom, la date et le numéro de chaque question.</li>
            <li>Quand tu as fini, tu <b>photographies ta copie</b> et tu l'envoies avec le bouton en bas.</li>
            <li>Bastien corrige avec la grille ci-dessous et te dit où tu en es sur chaque critère.</li>
          </ol>
          ${limite ? `<p class="e-eval-limite">${N.ic('ic-horloge')} Ouverte jusqu'au ${N.ech(limite)}.</p>` : ''}
        </section>
        <article class="e-fiche e-fiche-page e-eval-sujet">${e.sujet}</article>
        ${e.criteres ? `<details class="e-carte e-eval-criteres"><summary>${N.ic('ic-cible')} Ce qui est attendu : la grille des critères</summary><div class="e-fiche e-fiche-page">${e.criteres}</div></details>` : ''}
        <div class="e-actions">
          <a class="e-bouton" href="#/messages/${encodeURIComponent('Évaluation · ' + m.nom + ' · ' + l.titre)}">${N.ic('ic-photo')} Envoyer la photo de ma copie</a>
          <a class="e-bouton e-bouton-fin" href="#/matiere/${mid}">← Mon parcours</a>
        </div>`}
    </div>`);
  }

  /* ---------- Lecteur de fiche : en diapositives, ou en page ------------------- */
  const CLE_LECTURE = 'opaline.lecture';
  /** Découpe le HTML d'une fiche en sections, sur ses titres de niveau 2. */
  function decouperFiche(html) {
    const morceaux = String(html || '').split(/(?=<h2 id=")/);
    const sections = [];
    morceaux.forEach((m) => {
      const t = /^<h2 id="([^"]*)">([\s\S]*?)<\/h2>/.exec(m);
      if (t) sections.push({ id: t[1], titre: t[2].replace(/<[^>]+>/g, '').trim(), html: m.slice(t[0].length) });
      else if (m.replace(/<[^>]+>/g, '').trim()) sections.push({ id: 'debut', titre: 'Avant de commencer', html: m, debut: true });
    });
    return sections;
  }
  const titreCourt = (t) => t.replace(/^\d+[.)]\s*/, '');

  /**
   * Une fiche se lit une section à la fois : un pas à gauche et à droite, une
   * jauge, les étapes en haut. Le mode « page entière » reste à un clic et se
   * mémorise. Les flèches du clavier passent d'une diapositive à l'autre.
   */
  function rendreFiche(hote, doc, cleFiche, terminer) {
    const sections = decouperFiche(doc.html);
    const mode = N.lire(CLE_LECTURE, 'diapo');
    if (mode === 'page' || sections.length < 2) {
      hote.innerHTML = `<div class="e-lecture-mode"><button type="button" class="e-bouton e-bouton-fin" id="e-mode-diapo">${N.ic('ic-droite')} Lire en diapositives</button></div>
        <article class="e-fiche e-fiche-page">${doc.html}</article>`;
      const b = document.getElementById('e-mode-diapo');
      if (b) b.addEventListener('click', () => { N.ecrire(CLE_LECTURE, 'diapo'); rendreFiche(hote, doc, cleFiche, terminer); });
      return;
    }
    const clePos = 'opaline.diapo.' + cleFiche;
    let i = 0;
    try { i = Math.min(sections.length - 1, Math.max(0, Number(sessionStorage.getItem(clePos)) || 0)); } catch (e) { i = 0; }

    hote.innerHTML = `<section class="e-diapo" aria-label="Fiche en diapositives">
      <div class="e-diapo-barre">
        <ol class="e-diapo-etapes" id="e-diapo-etapes">${sections.map((x, k) => `<li><button type="button" data-diapo="${k}" title="${N.ech(x.titre)}"><b>${k + 1}</b><span>${N.ech(titreCourt(x.titre))}</span></button></li>`).join('')}</ol>
        <button type="button" class="e-diapo-mode" id="e-mode-page" title="Afficher toute la fiche sur une page">${N.ic('ic-livre')}<span>Page entière</span></button>
      </div>
      <div class="e-diapo-jauge" role="progressbar" aria-valuemin="1" aria-valuemax="${sections.length}" aria-valuenow="1" aria-label="Avancement dans la fiche"><i id="e-diapo-jauge"></i></div>
      <article class="e-fiche e-diapo-corps" id="e-diapo-corps" tabindex="-1"></article>
      <div class="e-diapo-pied">
        <button type="button" class="e-bouton e-bouton-doux" id="e-diapo-prec">${N.ic('ic-gauche')} Précédent</button>
        <span class="e-diapo-compte" id="e-diapo-compte"></span>
        <button type="button" class="e-bouton" id="e-diapo-suiv">Suivant ${N.ic('ic-droite')}</button>
      </div>
    </section>`;

    const corps = document.getElementById('e-diapo-corps');
    const montrer = (k, defiler) => {
      i = Math.min(sections.length - 1, Math.max(0, k));
      try { sessionStorage.setItem(clePos, String(i)); } catch (e) { /* privé */ }
      const x = sections[i];
      corps.innerHTML = `<h2 id="${N.ech(x.id)}">${N.ech(x.titre)}</h2>${x.html}`;
      hote.querySelectorAll('[data-diapo]').forEach((b) => {
        const actif = Number(b.getAttribute('data-diapo')) === i;
        b.classList.toggle('actif', actif);
        b.classList.toggle('vu', Number(b.getAttribute('data-diapo')) < i);
        if (actif) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        if (actif) {
          // On fait défiler la liste des étapes seule, jamais la page entière.
          const liste = b.closest('.e-diapo-etapes');
          if (liste) liste.scrollLeft = Math.max(0, b.offsetLeft - liste.clientWidth / 2 + b.offsetWidth / 2);
        }
      });
      document.getElementById('e-diapo-jauge').style.width = Math.round(((i + 1) / sections.length) * 100) + '%';
      hote.querySelector('.e-diapo-jauge').setAttribute('aria-valuenow', String(i + 1));
      document.getElementById('e-diapo-compte').textContent = `${i + 1} sur ${sections.length}`;
      const prec = document.getElementById('e-diapo-prec');
      const suiv = document.getElementById('e-diapo-suiv');
      prec.disabled = i === 0;
      const dernier = i === sections.length - 1;
      suiv.innerHTML = dernier ? `${N.ic('ic-coche')} J'ai terminé la fiche` : `Suivant ${N.ic('ic-droite')}`;
      suiv.classList.toggle('e-bouton-fin', false);
      if (defiler) {
        const haut = hote.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: Math.max(0, haut), behavior: 'smooth' });
        corps.focus({ preventScroll: true });
      }
    };
    hote.querySelectorAll('[data-diapo]').forEach((b) => b.addEventListener('click', () => montrer(Number(b.getAttribute('data-diapo')), true)));
    document.getElementById('e-diapo-prec').addEventListener('click', () => montrer(i - 1, true));
    document.getElementById('e-diapo-suiv').addEventListener('click', () => {
      if (i === sections.length - 1) { if (terminer) terminer(); return; }
      montrer(i + 1, true);
    });
    document.getElementById('e-mode-page').addEventListener('click', () => { N.ecrire(CLE_LECTURE, 'page'); rendreFiche(hote, doc, cleFiche, terminer); });
    hote.__diapo = { avancer: () => montrer(i + 1, true), reculer: () => montrer(i - 1, true) };
    montrer(i, false);
  }
  // Flèches du clavier : uniquement quand une fiche en diapositives est à l'écran.
  document.addEventListener('keydown', (ev) => {
    const hote = document.getElementById('e-fiche-hote');
    if (!hote || !hote.__diapo || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    const cible = ev.target;
    if (cible && (cible.tagName === 'INPUT' || cible.tagName === 'TEXTAREA' || cible.isContentEditable)) return;
    if (ev.key === 'ArrowRight') { ev.preventDefault(); hote.__diapo.avancer(); }
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); hote.__diapo.reculer(); }
  });

  /* ---------- Exercices ---------------------------------------------------------- */
  let session = null;
  function vueExos(mid, ref) {
    if (!window.EXERCICES) {
      afficher('<p class="e-vide">Chargement de la série…</p>');
      N.chargerBanque().then(() => vueExos(mid, ref)).catch(() => afficher('<p class="e-vide">La série n\'a pas pu être chargée. Recharge la page.</p>'));
      return undefined;
    }
    const m = N.matiere(mid);
    const l = N.lecon(m, ref);
    const b = N.banque(mid, ref);
    if (!m || !l || !b || !b.items) return vueIntrouvable();
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
      `<div class="e-exo" data-exo-index="${s.index}">
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
    try { window.KonstrioAudio && window.KonstrioAudio.play(juste ? 'bravo' : 'indice'); } catch (e) { /* ignore */ }

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
        <h1 style="font-size:1.8rem;text-align:center">${justes} sur ${s.items.length}</h1>
        <p class="e-intro" style="text-align:center">${N.ech(l.titre)}</p>
        <div class="e-carte" style="margin-bottom:1rem"><p style="margin:0">${N.ech(message)}</p></div>
        ${ratees.length ? `<div class="e-carte" style="margin-bottom:1rem">
          <h2 style="font-size:1rem;margin-bottom:.4rem">À revoir</h2>
          <ul style="margin:0;padding-left:1.1rem">${ratees.map((r) => `<li>${r.q}</li>`).join('')}</ul></div>` : ''}
        <div class="e-actions" style="justify-content:center">
          <button class="e-bouton" id="e-refaire" type="button">↺ Refaire</button>
          ${docsVisibles(l).indexOf('revision') !== -1 ? `<a class="e-bouton e-bouton-doux" href="#/lecon/${s.mid}/${s.ref}/revision">${N.ic('ic-cerveau')} Fiche de révision</a>` : ''}
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
    brancherSemaine(() => vueCalendrier(ancre));
  }

  /** Absences et déplacements : ce que Sterenn règle elle-même dans sa semaine. */
  function brancherSemaine(apres) {
    vue().querySelectorAll('[data-annuler]').forEach((b) => b.addEventListener('click', () => { b.closest('form').hidden = true; }));
    vue().querySelectorAll('[data-absence]').forEach((b) => b.addEventListener('click', async () => {
      const id = b.getAttribute('data-absence');
      const s = N.etat.seances.find((x) => x.id === id) || {};
      if (s.absence) {
        try {
          await N.api(`/seances/${id}/eleve`, { method: 'PATCH', body: JSON.stringify({ absence: false }) });
          await N.rafraichirSeances(); N.signaler('C\'est noté : tu seras là.', 'succes'); apres();
        } catch (e) { N.signaler(e.message); }
        return;
      }
      const f = vue().querySelector(`[data-form-absence="${id}"]`);
      f.hidden = false; f.querySelector('input').focus();
    }));
    vue().querySelectorAll('[data-form-absence]').forEach((f) => f.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const id = f.getAttribute('data-form-absence');
      try {
        await N.api(`/seances/${id}/eleve`, { method: 'PATCH', body: JSON.stringify({ absence: true, commentaire: f.commentaire.value.trim() }) });
        await N.rafraichirSeances(); N.signaler('Bastien est prévenu de ton absence.', 'succes'); apres();
      } catch (e) { N.signaler(e.message); }
    }));
    vue().querySelectorAll('[data-deplacer]').forEach((b) => b.addEventListener('click', () => {
      const f = vue().querySelector(`[data-form-deplacer="${b.getAttribute('data-deplacer')}"]`);
      f.hidden = !f.hidden;
    }));
    vue().querySelectorAll('[data-form-deplacer]').forEach((f) => f.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const id = f.getAttribute('data-form-deplacer');
      try {
        await N.api(`/seances/${id}/eleve`, { method: 'PATCH', body: JSON.stringify({ date: f.date.value, debut: f.debut.value, fin: f.fin.value }) });
        await N.rafraichirSeances(); N.signaler('Temps de travail déplacé.', 'succes');
        location.hash = '#/calendrier/' + f.date.value;
        if (location.hash === '#/calendrier/' + f.date.value) apres();
      } catch (e) { N.signaler(e.message); }
    }));
  }

  const dureeMinutes = (s) => {
    const [h1, m1] = String(s.debut || '0:0').split(':').map(Number);
    const [h2, m2] = String(s.fin || '0:0').split(':').map(Number);
    const d = (h2 * 60 + m2) - (h1 * 60 + m1);
    return d > 0 ? d : 15;
  };
  function evenement(s) {
    const futur = s.date >= N.jourIso();
    if (s.type === 'travail') {
      return `<article class="e-evt perso" data-evt="${s.id}">
        <p class="h">${N.ech(s.debut)} · ${dureeMinutes(s)} min</p>
        <p class="t">Temps perso</p>
        <p class="d">${N.ech(court(String(s.travail || 'À voir ensemble'), 78))}</p>
        ${futur ? `<p class="l"><button type="button" class="o" data-deplacer="${s.id}">${N.ic('ic-horloge')} Déplacer</button></p>
        <form class="e-evt-form" data-form-deplacer="${s.id}" hidden>
          <label>Jour <input type="date" name="date" value="${N.ech(s.date)}" required></label>
          <label>Début <input type="time" name="debut" value="${N.ech(s.debut)}" required></label>
          <label>Fin <input type="time" name="fin" value="${N.ech(s.fin)}" required></label>
          <span class="e-evt-form-actions"><button type="submit" class="e-bouton">Valider</button><button type="button" class="e-bouton e-bouton-fin" data-annuler>Annuler</button></span>
        </form>` : ''}
      </article>`;
    }
    const liens = (s.lecons || []).map((r) => {
      const info = N.libelleLecon(r);
      if (!info || !docsVisibles(info.l).length || !N.accessible(info.m.id, info.l.ref)) return '';
      return `<a class="o" href="#/lecon/${info.m.id}/${info.l.ref}/cours">${info.m.icone} Ouvrir</a>`;
    }).filter(Boolean).join('');
    const titres = String(s.objectif || 'Séance').split(' · ');
    return `<article class="e-evt cours${s.statut === 'faite' ? ' faite' : ''}${s.absence ? ' absente' : ''}" data-evt="${s.id}">
      <p class="h">${N.ech(s.debut)} à ${N.ech(s.fin)}</p>
      ${s.absence ? `<p class="e-evt-absence">${N.ic('ic-croix')} Tu as prévenu : absente${s.commentaire_eleve ? ' · ' + N.ech(s.commentaire_eleve) : ''}</p>` : ''}
      ${titres.map((t) => `<p class="t">${N.ech(t)}</p>`).join('')}
      ${futur ? `<p class="l"><button type="button" class="o" data-absence="${s.id}">${s.absence ? 'Finalement je serai là' : 'Je serai absente'}</button></p>
      <form class="e-evt-form" data-form-absence="${s.id}" hidden>
        <label>Pourquoi, en quelques mots (facultatif) <input type="text" name="commentaire" maxlength="300" placeholder="rendez-vous, sortie, fatigue…"></label>
        <span class="e-evt-form-actions"><button type="submit" class="e-bouton">Prévenir Bastien</button><button type="button" class="e-bouton e-bouton-fin" data-annuler>Annuler</button></span>
      </form>` : ''}
      ${(s.choix || []).length >= 2 && s.date >= N.jourIso() ? `<p class="c"><a href="#/choix">${N.ic('ic-etincelle')} ${s.choisi_le ? 'changer mon choix' : 'à toi de choisir'}</a></p>` : ''}
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
    { s: 1, i: '✨', n: 'Première lueur', d: 'Une fiche lue jusqu\'au bout : l\'aurore commence.' },
    { s: 5, i: '🌿', n: 'Apprentie apothicaire', d: 'Cinq étoiles. Comme Maomao, tu observes avant de conclure.' },
    { s: 12, i: '📗', n: 'Faiseuse de livres', d: 'Douze étoiles. Une série sans faute vaut son étoile, comme Myne fabrique sa première page.' },
    { s: 25, i: '🎨', n: 'Palette complète', d: 'Vingt-cinq étoiles. Turquoise, bleu indien, violet pastel : plusieurs matières avancent ensemble.' },
    { s: 50, i: '🌌', n: 'Aurore boréale', d: 'Cinquante étoiles. La moitié de l\'année est derrière toi.' },
    { s: 100, i: '👑', n: 'Couronne d\'Opaline', d: 'Cent étoiles. L\'année complète.' },
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
         <p class="e-etoiles-compte">${N.ic('ic-etoile', 'ic-plein')}<span>${r.total}</span></p>
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
         <li><strong>${r.jeux}</strong><span>mondes et jeux gagnés<em>1 étoile chacun</em></span></li>
         <li><strong>${r.lecons}</strong><span>leçons validées<em>3 étoiles chacune</em></span></li>
         <li><strong>${r.felicitations}</strong><span>félicitations de Bastien<em>1 étoile chacune</em></span></li>
         <li><strong>${parfaits}</strong><span>séries sans faute<em>le maximum</em></span></li>
       </ul>

       ${motsDeBastien()}

       <h2 class="e-titre-section">Tes dernières réussites</h2>
       ${journalReussites()}

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
    marquerMotsVus();
  }

  /** Les félicitations écrites par Bastien, la plus récente en premier. */
  function motsDeBastien() {
    const liste = N.etat.felicitations || [];
    if (!liste.length) {
      return `<h2 class="e-titre-section">Les mots de Bastien</h2>
        <p class="e-vide">Quand tu rends un devoir écrit, Bastien peut t'écrire un mot ici. Chaque mot vaut une étoile.</p>`;
    }
    return `<h2 class="e-titre-section">Les mots de Bastien</h2>
      <ul class="e-mots">${liste.slice(0, 12).map((f) => {
      const l = f.matiere && f.ref ? N.libelleLecon(f.matiere + '/' + f.ref) : null;
      const ou = l ? `${l.m.icone} ${N.ech(l.m.nom)} · ${N.ech(l.l.titre)}` : (f.matiere && N.matiere(f.matiere) ? N.ech(N.matiere(f.matiere).nom) : '');
      return `<li class="${f.vu_le ? '' : 'nouveau'}">
        <span class="e-mot-ico" aria-hidden="true">${N.ic('ic-trophee')}</span>
        <span class="e-mot-corps"><b>${N.ech(f.texte)}</b><em>${ou ? ou + ' · ' : ''}${N.ech(N.dateCourte(f.cree_le))}</em></span>
        ${f.vu_le ? '' : '<span class="e-mot-nouveau">nouveau</span>'}
      </li>`;
    }).join('')}</ul>`;
  }

  /** Journal : les huit derniers acquis, toutes origines confondues, datés. */
  function journalReussites() {
    const ev = [];
    Object.entries(N.etat.fiches).forEach(([k, v]) => {
      const [mid, ref, type] = k.split('/');
      const l = N.libelleLecon(mid + '/' + ref);
      const info = N.TYPES_DOC.find((x) => x.id === type);
      if (l) ev.push({ le: v.termine_le, ico: 'ic-livre', t: `Fiche ${info ? info.libelle.toLowerCase() : type} terminée`, d: `${l.m.nom} · ${l.l.titre}`, e: 1 });
    });
    Object.entries(N.etat.resultats).forEach(([k, r]) => {
      if (!(r.total > 0 && r.meilleur / r.total >= 0.7)) return;
      if (k.indexOf('jeu/') === 0) {
        const j = (window.JEUX || []).find((x) => x.id === k.slice(4));
        ev.push({ le: r.maj_le, ico: 'ic-etincelle', t: j ? `${j.type === '3d' ? 'Monde' : 'Jeu'} gagné : ${j.titre}` : 'Jeu gagné', d: `${r.meilleur} sur 100`, e: 1 });
      } else {
        const l = N.libelleLecon(k);
        if (l) ev.push({ le: r.maj_le, ico: 'ic-cible', t: `Série réussie : ${r.meilleur} sur ${r.total}`, d: `${l.m.nom} · ${l.l.titre}`, e: 1 });
      }
    });
    Object.entries(N.etat.suivi).forEach(([k, v]) => {
      if (v.niveau !== 'satisfaisant' && v.niveau !== 'tresbien') return;
      const l = N.libelleLecon(k);
      if (l) ev.push({ le: v.maj_le, ico: 'ic-coche', t: `Leçon validée : ${v.niveau === 'tresbien' ? 'très bien' : 'satisfaisant'}`, d: `${l.m.nom} · ${l.l.titre}`, e: 3 });
    });
    (N.etat.felicitations || []).forEach((f) => {
      ev.push({ le: f.cree_le, ico: 'ic-trophee', t: 'Félicitations de Bastien', d: f.texte, e: 1 });
    });
    if (!ev.length) return '<p class="e-vide">Tes réussites s\'afficheront ici, datées, au fur et à mesure.</p>';
    ev.sort((a, b) => String(b.le).localeCompare(String(a.le)));
    return `<ol class="e-journal">${ev.slice(0, 8).map((x) => `<li>
      <span class="e-journal-ico" aria-hidden="true">${N.ic(x.ico)}</span>
      <span class="e-journal-corps"><b>${N.ech(x.t)}</b><em>${N.ech(x.d)}</em></span>
      <span class="e-journal-etoiles">${N.ic('ic-etoile', 'ic-plein')} ${x.e > 1 ? '+' + x.e : '+1'}</span>
      <time datetime="${N.ech(x.le || '')}">${N.ech(N.dateCourte(x.le))}</time>
    </li>`).join('')}</ol>`;
  }

  /* ---------- Conversation : messages et travail au même endroit ------------ */
  const RAPIDES = [
    { t: "J'ai terminé", i: 'ic-coche' },
    { t: 'Je bloque sur un exercice', i: 'ic-verrou' },
    { t: 'Tu peux me donner un indice ?', i: 'ic-etincelle' },
    { t: "C'était facile", i: 'ic-etoile' },
    { t: 'On peut revoir ça ensemble ?', i: 'ic-message' },
  ];
  const HUMEURS = ['🙂', '😀', '😅', '🤔', '😴', '🎉', '💪', '❤️'];
  const CLE_BROUILLON = 'cours4e.brouillon';

  const estImage = (t) => String(t || '').indexOf('image/') === 0;
  const jourDe = (iso) => String(iso || '').slice(0, 10);

  /** Sépare la conversation par jour, avec un libellé lisible. */
  function libelleJour(iso) {
    const a = N.jourIso();
    if (iso === a) return "Aujourd'hui";
    if (iso === N.decaler(a, -1)) return 'Hier';
    return N.enFrancais(iso, true);
  }

  function vueMessages(contexte) {
    const M = window.MESSAGERIE || null;
    let filActif = null;
    const lecons = [];
    PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => {
      if (docsVisibles(l).length && N.accessible(m.id, l.ref)) {
        lecons.push({ v: m.nom + ' · ' + l.titre, m, l });
      }
    }));

    afficher(
      `<h1>Messages</h1>
       <p class="e-intro">Écris à Bastien, envoie une photo de ton travail, pose une question. Tout est au même endroit.</p>

       <div id="e-fils"></div>
       <div class="e-tchat" id="e-tchat"><p class="e-vide">Chargement…</p></div>

       <div class="e-rapides" id="e-rapides">${RAPIDES.map((r) => `<button type="button" data-rapide="${N.ech(r.t)}">
         <svg class="ic" aria-hidden="true"><use href="#${r.i}"/></svg>${N.ech(r.t)}</button>`).join('')}</div>

       <form class="e-ecrire" id="e-form-msg">
         <div class="e-ctx" id="e-ctx-zone"${contexte ? '' : ' hidden'}>
           <svg class="ic" aria-hidden="true"><use href="#ic-livre"/></svg>
           <span id="e-ctx-texte">${N.ech(contexte || '')}</span>
           <button type="button" id="e-ctx-retirer" aria-label="Retirer le sujet">
             <svg class="ic" aria-hidden="true"><use href="#ic-croix"/></svg></button>
         </div>

         <div class="e-piece" id="e-piece" hidden>
           <span class="apercu" id="e-piece-apercu" aria-hidden="true"></span>
           <span class="infos"><b id="e-piece-nom"></b><span id="e-piece-poids"></span></span>
           <button type="button" id="e-piece-retirer" aria-label="Retirer la pièce jointe">
             <svg class="ic" aria-hidden="true"><use href="#ic-croix"/></svg></button>
         </div>

         ${M ? M.barreFormatage('e-formatage') : ''}
         <label class="visuellement-cache" for="e-texte">Message</label>
         <textarea id="e-texte" rows="2" maxlength="2000" placeholder="Écris ton message…"></textarea>

         <div class="e-outils">
           <button type="button" class="e-outil" id="e-btn-fichier" title="Joindre un document" aria-label="Joindre un document">
             <svg class="ic" aria-hidden="true"><use href="#ic-trombone"/></svg></button>
           <button type="button" class="e-outil" id="e-btn-photo" title="Prendre ou choisir une photo" aria-label="Prendre une photo">
             <svg class="ic" aria-hidden="true"><use href="#ic-photo"/></svg></button>
           <button type="button" class="e-outil" id="e-btn-humeur" title="Ajouter une émoticône" aria-label="Ajouter une émoticône">
             <svg class="ic" aria-hidden="true"><use href="#ic-etincelle"/></svg></button>
           <button type="button" class="e-outil" id="e-btn-sujet" title="Choisir la leçon concernée" aria-label="Choisir la leçon concernée">
             <svg class="ic" aria-hidden="true"><use href="#ic-livre"/></svg></button>
           <span class="e-compteur" id="e-compteur">0 / 2000</span>
           <button class="e-bouton" type="submit" id="e-envoi">
             <svg class="ic" aria-hidden="true"><use href="#ic-envoyer"/></svg>Envoyer</button>
         </div>

         <div class="e-humeurs" id="e-humeurs" hidden>${M ? M.selecteurEmojis('e-emojis') : HUMEURS.map((h) => `<button type="button" data-emoji-insere="${h}">${h}</button>`).join('')}</div>

         <div class="e-sujets" id="e-sujets" hidden>
           <p>De quelle leçon veux-tu parler ?</p>
           <ul>${lecons.map((x) => `<li><button type="button" data-sujet="${N.ech(x.v)}">
             <span class="m">${x.m.icone} ${N.ech(x.m.nom)}</span><b>${N.ech(x.l.titre)}</b></button></li>`).join('')
    || '<li class="vide">Aucune leçon ouverte pour l\'instant.</li>'}</ul>
         </div>

         <input type="file" id="e-fichier" accept="image/*,application/pdf,text/plain,.doc,.docx,.odt" hidden>
         <input type="file" id="e-photo" accept="image/*" capture="environment" hidden>
         <p class="e-aide-envoi">Entrée pour aller à la ligne, Ctrl et Entrée pour envoyer.</p>
       </form>`,
    );

    const zoneT = document.getElementById('e-tchat');
    const champT = document.getElementById('e-texte');
    const compteur = document.getElementById('e-compteur');
    const piece = document.getElementById('e-piece');
    let ctx = contexte || null;
    let joint = null;

    /* --- Brouillon : ce qui est tapé n'est jamais perdu en changeant d'écran --- */
    const brouillon = N.lire(CLE_BROUILLON, '');
    if (brouillon && !contexte) champT.value = brouillon;
    const majCompteur = () => {
      compteur.textContent = `${champT.value.length} / 2000`;
      compteur.classList.toggle('plein', champT.value.length > 1900);
      N.ecrire(CLE_BROUILLON, champT.value);
    };
    champT.addEventListener('input', majCompteur);
    majCompteur();

    /* --- Sujet de la conversation ------------------------------------------- */
    const zoneCtx = document.getElementById('e-ctx-zone');
    const poserCtx = (v) => {
      ctx = v || null;
      document.getElementById('e-ctx-texte').textContent = ctx || '';
      zoneCtx.hidden = !ctx;
    };
    document.getElementById('e-ctx-retirer').addEventListener('click', () => poserCtx(null));
    const panneauSujets = document.getElementById('e-sujets');
    document.getElementById('e-btn-sujet').addEventListener('click', () => {
      panneauSujets.hidden = !panneauSujets.hidden;
      document.getElementById('e-humeurs').hidden = true;
    });
    vue().querySelectorAll('[data-sujet]').forEach((b) => b.addEventListener('click', () => {
      poserCtx(b.getAttribute('data-sujet'));
      panneauSujets.hidden = true;
      champT.focus();
    }));

    /* --- Émoticônes ---------------------------------------------------------- */
    const panneauHumeurs = document.getElementById('e-humeurs');
    document.getElementById('e-btn-humeur').addEventListener('click', () => {
      panneauHumeurs.hidden = !panneauHumeurs.hidden;
      panneauSujets.hidden = true;
    });
    if (M) M.brancherFormatage(vue(), champT);
    vue().querySelectorAll('[data-emoji-insere]').forEach((b) => b.addEventListener('click', () => {
      const e = b.getAttribute('data-emoji-insere');
      if (M) M.inserer(champT, (champT.value && !/\s$/.test(champT.value.slice(0, champT.selectionStart)) ? ' ' : '') + e + ' ', '');
      else champT.value += (champT.value && !/\s$/.test(champT.value) ? ' ' : '') + e;
      majCompteur();
      panneauHumeurs.hidden = true;
      champT.focus();
    }));

    /* --- Pièce jointe : document, photo, ou glisser-déposer ------------------ */
    function poserPiece(f) {
      joint = f || null;
      if (!joint) { piece.hidden = true; return; }
      document.getElementById('e-piece-nom').textContent = joint.name;
      document.getElementById('e-piece-poids').textContent = N.poids(joint.size);
      const apercu = document.getElementById('e-piece-apercu');
      apercu.innerHTML = '';
      if (estImage(joint.type)) {
        const img = document.createElement('img');
        img.alt = '';
        img.src = URL.createObjectURL(joint);
        img.onload = () => URL.revokeObjectURL(img.src);
        apercu.appendChild(img);
      } else {
        apercu.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#ic-boite"/></svg>';
      }
      piece.hidden = false;
    }
    document.getElementById('e-piece-retirer').addEventListener('click', () => {
      poserPiece(null);
      document.getElementById('e-fichier').value = '';
      document.getElementById('e-photo').value = '';
    });
    const champF = document.getElementById('e-fichier');
    const champP = document.getElementById('e-photo');
    document.getElementById('e-btn-fichier').addEventListener('click', () => champF.click());
    document.getElementById('e-btn-photo').addEventListener('click', () => champP.click());
    [champF, champP].forEach((c) => c.addEventListener('change', () => {
      if (c.files && c.files[0]) poserPiece(c.files[0]);
    }));

    const formulaire = document.getElementById('e-form-msg');
    ['dragenter', 'dragover'].forEach((t) => formulaire.addEventListener(t, (e) => {
      e.preventDefault(); formulaire.classList.add('survol');
    }));
    ['dragleave', 'drop'].forEach((t) => formulaire.addEventListener(t, (e) => {
      e.preventDefault(); formulaire.classList.remove('survol');
    }));
    formulaire.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) poserPiece(e.dataTransfer.files[0]);
    });

    /* --- Réponses rapides ---------------------------------------------------- */
    vue().querySelectorAll('[data-rapide]').forEach((b) => b.addEventListener('click', () => {
      champT.value = b.getAttribute('data-rapide');
      majCompteur();
      champT.focus();
    }));

    /* --- Le fil : messages et fichiers mêlés, dans l'ordre du temps ---------- */
    async function charger(defiler) {
      let messages = [];
      let fichiers = [];
      let stockage = true;
      try {
        const rep = await Promise.all([N.api('/messages'), N.api('/fichiers')]);
        messages = rep[0].messages || [];
        fichiers = rep[1].fichiers || [];
        stockage = rep[1].stockage !== false;
      } catch (e) { N.signaler(e.message); return; }
      if (!stockage) {
        document.getElementById('e-btn-fichier').disabled = true;
        document.getElementById('e-btn-photo').disabled = true;
      }

      const zoneFils = document.getElementById('e-fils');
      if (M && zoneFils) {
        zoneFils.innerHTML = M.barreFils(messages, filActif, 'e-fils-barre');
        zoneFils.querySelectorAll('[data-fil]').forEach((b) => b.addEventListener('click', () => {
          filActif = b.getAttribute('data-fil') || null;
          charger();
        }));
      }
      const visibles = M ? M.filtrer(messages, filActif) : messages;
      const fichiersVisibles = filActif ? fichiers.filter((f) => f.matiere === filActif || (f.matiere && N.matiere(filActif) && String(f.matiere).toLowerCase().indexOf(N.matiere(filActif).nom.toLowerCase()) === 0)) : fichiers;
      const fil = []
        .concat(visibles.map((m) => ({ genre: 'texte', date: m.cree_le, d: m })))
        .concat(fichiersVisibles.map((f) => ({ genre: 'fichier', date: f.cree_le, d: f })))
        .sort((a, b) => String(a.date).localeCompare(String(b.date)));

      if (!fil.length) {
        zoneT.innerHTML = filActif
          ? '<p class="e-vide">Rien dans ce fil pour l\'instant. Ce que tu écris ici y restera rangé.</p>'
          : '<p class="e-vide">Rien encore. Lance la conversation, ou envoie une photo de ton travail.</p>';
        return;
      }

      let jour = '';
      zoneT.innerHTML = fil.map((x) => {
        let avant = '';
        const j = jourDe(x.date);
        if (j !== jour) { jour = j; avant = `<p class="e-jour-sep"><span>${N.ech(libelleJour(j))}</span></p>`; }
        const moi = (x.genre === 'texte' ? x.d.auteur : x.d.auteur) === 'eleve';
        const qui = moi ? 'Moi' : 'Bastien';
        const heure = String(x.date).slice(11, 16);
        const tete = `<p class="e-msg-tete">${qui} · ${heure}</p>`;

        if (x.genre === 'fichier') {
          const f = x.d;
          const apercu = estImage(f.type)
            ? `<a class="e-jointe-img" href="/api/fichiers/${f.id}" target="_blank" rel="noopener">
                 <img src="/api/fichiers/${f.id}" alt="${N.ech(f.nom)}" loading="lazy"></a>`
            : `<a class="e-jointe-doc" href="/api/fichiers/${f.id}">
                 <svg class="ic" aria-hidden="true"><use href="#ic-boite"/></svg>
                 <span><b>${N.ech(f.nom)}</b><span>${N.ech(N.poids(f.taille))}</span></span>
                 <svg class="ic" aria-hidden="true"><use href="#ic-telecharger"/></svg></a>`;
          return `${avant}<article class="e-msg ${moi ? 'moi' : ''}">
            <span class="e-msg-pastille" aria-hidden="true">${moi ? 'S' : 'B'}</span>
            <div>${tete}<div class="e-bulle e-bulle-jointe">
              ${f.matiere ? `<span class="contexte">${N.ech(f.matiere)}${f.ref ? ' · ' + N.ech(f.ref) : ''}</span>` : ''}
              ${apercu}${f.note ? `<p class="texte">${N.ech(f.note)}</p>` : ''}</div></div></article>`;
        }

        const m = x.d;
        const lu = moi && m.lu_le ? '<span class="e-lu" title="Lu">✓✓</span>' : '';
        const corpsTexte = M ? M.formater(m.texte, N.reglage('formatage')) : N.ech(m.texte);
        return `${avant}<article class="e-msg ${moi ? 'moi' : ''}" data-message="${m.id}">
          <span class="e-msg-pastille" aria-hidden="true">${moi ? 'S' : 'B'}</span>
          <div>${tete}<div class="e-bulle">
            ${m.contexte ? `<span class="contexte">${N.ech(m.contexte)}</span>` : ''}
            <div class="texte">${corpsTexte}</div>${lu}</div>${M ? M.reactionsHTML(m, 'eleve', 'e-reactions') : ''}</div></article>`;
      }).join('');

      if (defiler !== false) zoneT.scrollTop = zoneT.scrollHeight;
      try {
        await N.api('/messages', { method: 'PATCH' });
        N.etat.messagesNonLus = 0;
        nav();
      } catch (e) { /* le marquage peut attendre */ }
    }
    charger();
    if (M) M.brancherReactions(zoneT, () => charger(false));

    /* --- Envoi ---------------------------------------------------------------- */
    async function envoyer() {
      const texte = champT.value.trim();
      if (!texte && !joint) { N.signaler('Écris un message, ou joins un fichier.'); return; }
      const bouton = document.getElementById('e-envoi');
      bouton.disabled = true;
      try {
        if (joint) {
          const d = new FormData();
          d.append('fichier', joint);
          if (texte) d.append('note', texte);
          if (ctx) d.append('matiere', ctx);
          await N.api('/fichiers', { method: 'POST', body: d });
        } else {
          const matCtx = ctx ? PROGRAMME.matieres.find((x) => ctx.toLowerCase().indexOf(x.nom.toLowerCase()) === 0) : null;
          await N.api('/messages', { method: 'POST', body: JSON.stringify({ texte, contexte: ctx, fil: matCtx ? matCtx.id : filActif }) });
        }
        champT.value = '';
        poserPiece(null);
        champF.value = ''; champP.value = '';
        N.ecrire(CLE_BROUILLON, '');
        majCompteur();
        await charger();
      } catch (e) {
        N.signaler(e.message);
      } finally {
        bouton.disabled = false;
      }
    }
    formulaire.addEventListener('submit', (ev) => { ev.preventDefault(); envoyer(); });
    champT.addEventListener('keydown', (ev) => {
      if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') { ev.preventDefault(); envoyer(); }
    });
  }

  /* ---------- Jeux : l'arcade rattachée au programme ------------------------- */
  function vueJeux(mid) {
    const jeux = window.JEUX || [];
    const gagnes = jeux.filter(jeuGagne).length;
    const matieres = PROGRAMME.matieres.filter((m) => jeuxMatiere(m.id).length);
    const selection = mid && N.matiere(mid) ? [N.matiere(mid)] : matieres;
    const blocs = selection.map((m) => {
      const liste = jeuxMatiere(m.id).sort((a, b) => (a.type === b.type ? 0 : a.type === '3d' ? -1 : 1));
      return `<h2 class="e-titre-section">${m.icone} ${N.ech(m.nom)}</h2>
        <ul class="e-tuiles e-tuiles-jeux">${liste.map((j) => {
          const lecons = j.lecons.filter((c) => c.split(':')[0] === m.id).map((c) => {
            const l = N.lecon(m, c.split(':')[1]); return l ? l.titre : c.split(':')[1];
          });
          return `<li class="${jeuGagne(j) ? 'gagne' : ''}"><a href="${j.url}">
            <span class="ico" aria-hidden="true">${j.ico}</span>
            <b>${N.ech(j.titre)}${jeuGagne(j) ? ' ✓' : ''}</b>
            <span>${j.type === '3d' ? 'Monde 3D · ' : ''}${N.ech(lecons.join(' · '))}</span></a></li>`;
        }).join('')}</ul>`;
    }).join('');
    afficher(
      `<h1>Jeux</h1>
       <p class="e-intro">${jeux.length} jeux et mondes 3D, chacun rattaché à une leçon du programme. Une partie terminée vaut une étoile, comme une série réussie.${gagnes ? ` Déjà ${gagnes} gagné(s).` : ''}</p>
       <p class="e-filtre-jeux"><a href="#/jeux" class="${mid ? '' : 'actif'}">Tout</a>${matieres.map((m) => `<a href="#/jeux/${m.id}" class="${mid === m.id ? 'actif' : ''}">${m.icone} ${N.ech(N.nomCourt(m.id))}</a>`).join('')}</p>
       ${blocs || '<p class="e-vide">Aucun jeu pour le moment.</p>'}`,
    );
  }

  /** Les modules et la visite vivent dans leurs propres fichiers, chargés à la demande. */
  function module(nom, arg) {
    afficher('<p class="e-vide">Chargement…</p>');
    N.chargerScript('modules.js').then(() => window.MODULES_ELEVE[nom](arg)).catch(() => afficher('<p class="e-vide">Ce module n\'a pas pu être chargé. Recharge la page.</p>'));
  }
  function visite() {
    N.chargerScript('visite.js').then(() => { location.hash = '#/hub'; setTimeout(() => window.VISITE.lancer(0), 400); }).catch(() => N.signaler('La visite n\'a pas pu démarrer.'));
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
      case 'choix': return vueChoix();
      case 'decouverte': return module('vueDecouverte', p[1]);
      case 'positionnement': return module('vuePositionnement');
      case 'visite': return visite();
      case 'jeux': return vueJeux(p[1]);
      case 'progres': case 'reussites': return vueReussites();
      case 'messages': return vueMessages(p[1] ? decodeURIComponent(p.slice(1).join('/')) : null);
      case 'travail': return vueMessages(null);
      default: return vueIntrouvable();
    }
  }

  window.VUE_ELEVE = { nav, rendre, afficher };
  N.VUE = window.VUE_ELEVE;
})();
