/*
   Pages secondaires de l'espace professeur (A27) : journal et santé, jeux, aide, bulletin, socle,
   périodes, documents, programme, recherche. Chargées à la demande par vue-prof.js, avec ses aides.
*/
window.VUE_PROF_PAGES = function (P) {
  const { DOMAINES, N, POIDS, afficher, bloc, brancherNiveaux, choixNiveau, entete, teinte } = P;
  /** A4, A46, A51, A52, A53, A54, A55 : journal d'audit, questions à Opale, santé, usage, erreurs. */
  async function vueJournal() {
    afficher(entete('Journal et santé', 'Ce qui a été écrit, ce qui a été demandé à Opale, l\'état du déploiement.') + N.squelette('serie'), [{ t: 'Outils' }, { t: 'Journal et santé' }]);
    const [moi, journal, usage, erreurs] = await Promise.all([N.api('/moi').catch(() => ({})), N.api('/journal?n=150').catch(() => ({ journal: [] })), N.api('/usage?jours=14').catch(() => ({ usage: [] })), N.api('/erreur').catch(() => ({ erreurs: [] }))]);
    const sa = moi.sante || {};
    const LIB = { acces: 'accès', reglage: 'réglage', ouverture: 'ouverture', seance: 'séance', felicitation: 'félicitation', code: 'code d\'accès', profil: 'profil', connexion: 'connexion' };
    const connexions = (journal.journal || []).filter((j) => j.quoi === 'connexion');
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
      + bloc('Connexions des trente derniers jours', connexions.length ? `<ul class="p-journal">${connexions.slice(0, 40).map((j) => `<li><time>${N.ech(N.dateCourte(j.quand))}</time> <b>${j.cle === 'eleve' ? 'Sterenn' : 'Moi'}</b> <small>${N.ech(j.apres || '')}</small></li>`).join('')}</ul>` : '<p class="p-vide">Aucune connexion journalisée pour l\'instant.</p>', connexions.length ? String(connexions.length) : '')
      + bloc('Erreurs du navigateur', (erreurs.erreurs || []).length ? `<ul class="p-journal">${erreurs.erreurs.map((e) => `<li><time>${N.ech(N.dateCourte(e.derniere))}</time> <b>×${e.n}</b> ${N.ech(e.message)} <small>${N.ech(e.source || '')} ${N.ech(e.ecran || '')} (${N.ech(e.role || '')})</small></li>`).join('')}</ul><p><button type="button" class="p-bouton p-bouton-fantome p-bouton-mini" id="j-vider">Vider la liste</button></p>` : '<p class="p-vide">Aucune erreur remontée. C\'est bon signe.</p>', String((erreurs.erreurs || []).length))
      + bloc('Questions posées à Opale', '<div id="j-opale"><p class="p-aide">Chargement…</p></div>')
      + '</div></div>',
    [{ t: 'Outils' }, { t: 'Journal et santé' }]);
    const vider = document.getElementById('j-vider'); if (vider) vider.addEventListener('click', async () => { await N.api('/erreur', { method: 'DELETE' }); vueJournal(); });
    N.api('/tuteur/journal').then((d) => { const z = document.getElementById('j-opale'); if (!z) return; z.innerHTML = (d.journal || []).length ? `<ul class="p-journal">${d.journal.map((q) => `<li><time>${N.ech(N.dateCourte(q.quand))}</time> <b>${N.ech(q.role)}</b> ${N.ech(q.mode || '')} ${N.ech(q.matiere ? q.matiere + '/' + (q.ref || '') : '')}<br>« ${N.ech(q.question)} » <small>${N.ech(q.controle || '')}</small></li>`).join('')}</ul><p class="p-aide">La question, le mode et le contrôle appliqué. Jamais la réponse d'Opale.</p>` : '<p class="p-vide">Aucune question encore.</p>'; }).catch(() => { const z = document.getElementById('j-opale'); if (z) z.innerHTML = '<p class="p-vide">Journal indisponible.</p>'; });
  }
  /** D17 : les jeux et mondes, avec ce que Sterenn y a fait : parties, meilleur score, dernière fois, questions ratées. */
  /** E17, E30 : le journal de bord et les mesures d'un monde, en une cellule. */
  function detailMonde(d) {
    if (!d || (!d.journal && !d.banque && !d.perf)) return '<span class="p-faible">·</span>';
    const parts = [];
    if (d.journal && d.journal.touches && d.journal.touches.length) parts.push(`<small>Regardé : ${d.journal.touches.slice(0, 8).map(N.ech).join(', ')}${d.journal.touches.length > 8 ? '…' : ''}</small>`);
    if (d.journal && d.journal.fiche) parts.push(`<small>Fiche ouverte ${d.journal.fiche} fois</small>`);
    if (d.banque && d.banque.total) parts.push(`<small>Questions de la leçon : <b>${d.banque.justes}/${d.banque.total}</b>${d.banque.ratees && d.banque.ratees.length ? ' · ratées : ' + d.banque.ratees.map(N.ech).join(' · ') : ''}</small>`);
    if (d.perf && d.perf.ips) parts.push(`<small class="${d.perf.ips < 30 ? 'p-alerte' : 'p-faible'}">Rendu : ${d.perf.ips} images/s, qualité ${['', 'basse', 'moyenne', 'haute'][d.perf.qualite] || '?'}${d.perf.mobile ? ', téléphone' : ''}${d.perf.chargement_ms ? ', chargé en ' + (d.perf.chargement_ms / 1000).toFixed(1) + ' s' : ''}${d.perf.ips < 30 ? ' : conseiller la qualité basse' : ''}</small>`);
    if (d.duree_s) parts.push(`<small class="p-faible">${Math.round(d.duree_s / 60)} min de jeu</small>`);
    return parts.join('<br>') || '<span class="p-faible">·</span>';
  }
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
      + bloc('Ce que Sterenn a joué', `<div class="p-tableau-defilant"><table class="p-table"><thead><tr><th>Jeu</th><th>Leçon servie</th><th>Parties</th><th>Meilleur</th><th>Dernière fois</th><th>Questions ratées à la dernière partie</th><th>Monde : regardé, questions, rendu</th></tr></thead><tbody>
        ${lignes.sort((a, b) => (b.r ? b.r.maj_le : '').localeCompare(a.r ? a.r.maj_le : '')).map((x) => `<tr class="${x.r ? '' : 'p-faible'}"><td>${x.j.ico} <a href="${x.j.url}" target="_blank" rel="noopener">${N.ech(x.j.titre)}</a>${x.j.type === '3d' ? ' <span class="p-puce">3D</span>' : ''}</td><td>${x.lecons}</td><td class="num">${x.r ? x.r.series : '·'}</td><td class="num">${x.r ? `<span class="p-etat ${x.r.meilleur >= 70 ? 'p-etat-satisfaisant' : 'p-etat-fragile'}">${x.r.meilleur}</span>` : '·'}</td><td class="num">${x.r ? N.ech(N.dateCourte(x.r.maj_le)) : '·'}</td><td>${x.detail && x.detail.ratees && x.detail.ratees.length ? `<small>${x.detail.ratees.map(N.ech).join(' · ')}</small>` : (x.detail ? `<small class="p-faible">${x.detail.justes}/${x.detail.total}, aucune ratée</small>` : '<span class="p-faible">·</span>')}</td><td>${detailMonde(x.detail)}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="p-aide">Les jeux à questions envoient leurs questions ratées et la difficulté. Les mondes 3D envoient ce que Sterenn a touché, son résultat aux cinq questions de la leçon, et la fluidité du rendu (images par seconde, qualité choisie) pour régler la qualité par appareil.</p>`, String(jeux.length)),
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
  return { vueJournal, vueJeuxProf, vueAideProf, vueBulletin, vueSocle, vuePeriodes, vueDocuments, vueProgramme, vueRecherche };
};
