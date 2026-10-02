/**
 * Modules hors programme de l'espace de Sterenn.
 *
 *  - « Faire connaissance » : huit écrans. La première séance annoncée pas à pas
 *    (et cochée au fil de l'heure), ses univers (ils habillent les énoncés), sa
 *    carte, comment elle apprend (cinq choix, chacun dit ce que Bastien fera),
 *    le jeu des trois questions (ses réponses face à celles de Bastien), la carte
 *    de Bastien et sa réponse, les règles signées et imprimables en pacte, un
 *    premier jeu tiré de ses univers.
 *  - « Où j'en suis » : cinq questions par matière, faites ensemble, sans note,
 *    pour un point de départ dans le suivi.
 * Les réponses vivent dans le profil partagé (clés « moi.* »).
 */
(function () {
  'use strict';
  const N = window.NOYAU;
  const vue = () => document.getElementById('vue-eleve');
  const ic = (id) => N.ic(id);

  /* ======================= Faire connaissance ============================== */
  const GOUTS = ['Les mangas', 'Dessiner aux feutres', 'Les aurores boréales', 'Lire', 'La musique', 'Les animaux', 'Les jeux vidéo', 'Cuisiner', 'Le dessin numérique', 'Les séries', 'Marcher dehors', 'Les sciences'];
  const AIDES = ['Un exemple concret', 'Un schéma', 'Relire la fiche seule', 'Un peu de silence', 'Une courte pause', 'Qu\'on découpe en étapes', 'Qu\'on me montre d\'abord', 'Qu\'on me laisse essayer'];
  const PREVENIR = [['veille', 'La veille, par message'], ['debut', 'Au début de la séance'], ['juste', 'Juste avant, ça me va']];
  const REGLES = [
    ['pause', 'Une pause de cinq minutes toutes les vingt-cinq minutes'],
    ['stop', 'Je peux dire « stop » quand c\'est trop, sans avoir à expliquer'],
    ['consigne', 'Une seule consigne à la fois'],
    ['fin', 'La séance finit à l\'heure, même quand ça se passe bien'],
    ['acquis', 'Ce qui est acquis est nommé et coché devant moi'],
    ['plan', 'Le plan de la séance est annoncé au début'],
  ];
  const PROGRAMME_SEANCE = [
    ['13 h 00', '20 min', 'On fait connaissance', 'Nos deux cartes, nos règles. Tu ne réponds qu\'à ce que tu veux.'],
    ['13 h 20', '15 min', 'Visite de l\'application', 'Opale te montre les six écrans, à ton rythme.'],
    ['13 h 35', '5 min', 'Pause', 'On se lève, on boit, on ne parle pas de travail.'],
    ['13 h 40', '30 min', '« Où j\'en suis »', 'Quarante questions courtes, à deux, sans note. Juste pour savoir d\'où on part.'],
    ['14 h 10', '15 min', 'On prépare la suite', 'On regarde la semaine prochaine ensemble, et tu choisis ton premier jeu.'],
    ['14 h 30', '', 'Fin', 'À l\'heure, comme toujours.'],
  ];
  const ETAPES_DECOUVERTE = ['Notre première séance', 'Mon univers', 'Ma carte', 'Comment j\'apprends', 'Le jeu des trois questions', 'La carte de Bastien', 'Nos règles', 'Un premier jeu'];
  /* Les univers de Sterenn : chacun dit ce qu'il change dans les énoncés, avec un exemple vrai tiré des fiches. */
  const UNIVERS = [
    { id: 'maomao', nom: 'Maomao et l\'apothicairerie', ico: '🌿', phrase: 'Remèdes, dosages, plantes, enquêtes : des proportions et de la chimie dans les énoncés.', exemple: 'Maomao prépare 250 g d\'une pommade à 12 % de camphre. Quelle masse de camphre pèse-t-elle ?', jeu: '3d-23-apothicairerie' },
    { id: 'myne', nom: 'Myne et les livres', ico: '📚', phrase: 'Papier, encre, ateliers, commerce : de l\'histoire et de la physique dans les énoncés.', exemple: 'Myne vend 3 feuilles pour 12 pièces. Combien coûtent 20 feuilles au même prix ?', jeu: '3d-22-atelier-papier' },
    { id: 'yuzu', nom: 'Yuzu, les saisons et les fêtes', ico: '🏮', phrase: 'Famille, fêtes, créatures du folklore japonais : des textes et des dialogues dans les énoncés.', exemple: 'Yuzu prépare la fête des lanternes : 48 lanternes en rangées de 6. Combien de rangées ?', jeu: '2d-108-litterature' },
    { id: 'aurores', nom: 'Les aurores boréales', ico: '🌌', phrase: 'Lumière, magnétisme, latitude, pays nordiques : de la physique, de la géographie et de l\'anglais.', exemple: 'Une aurore verte brille à 110 km d\'altitude. Quel gaz émet cette lumière ?', jeu: '3d-21-aurore-boreale' },
    { id: 'feutres', nom: 'Les feutres et le dessin', ico: '🖍️', phrase: 'Mélanges, dégradés, nuanciers : des pourcentages et de la lumière dans les énoncés.', exemple: 'Un dégradé de 8 cases va du turquoise au violet. Quelle part du chemin la 3ᵉ case a-t-elle parcourue ?', jeu: '2d-22-pourcentages' },
  ];
  const COULEURS = [['turquoise', 'Turquoise clair', '#5fd3c8'], ['indien', 'Bleu indien', '#4a6fd6'], ['violet', 'Violet pastel', '#b79ce6'], ['rose', 'Rose', '#e8608e'], ['vert', 'Vert opale', '#2bb5a0'], ['ambre', 'Ambre', '#f4c542']];
  /* La couleur choisie devient la palette de l'espace (la même que dans le panneau d'affichage). */
  const PALETTE_DE = { turquoise: 'turquoise', indien: 'indien', violet: 'violet', rose: 'rose', vert: 'menthe', ambre: 'corail' };
  /* Comment j'apprends : cinq choix, chacun dit ce que Bastien fera. */
  const APPRENDS = [
    { cle: 'bloque', q: 'Quand je bloque sur un exercice', options: [['seule', 'Je réessaie seule d\'abord', 'Bastien attend que tu le demandes avant d\'aider.'], ['indice', 'Je veux un indice tout de suite', 'Le premier indice vient sans attendre, le second seulement si tu le demandes.'], ['ensemble', 'On fait le premier pas ensemble', 'Bastien commence la première ligne avec toi, puis tu continues.']] },
    { cle: 'consigne', q: 'La consigne que je comprends le mieux', options: [['phrase', '« Calcule le périmètre. »', 'Une phrase, une action : c\'est la forme de toutes les fiches.'], ['liste', '« 1. Mesure. 2. Additionne. 3. Écris l\'unité. »', 'Les consignes longues seront toujours découpées en liste.'], ['exemple', 'Un exemple fait, puis à moi', 'Chaque nouvelle notion commence par un exemple guidé.']] },
    { cle: 'rythme', q: 'Mon rythme', options: [['lent', 'Lentement et sûrement', 'On fait moins d\'exercices, mais chacun jusqu\'au bout.'], ['vite', 'Vite, quitte à revenir', 'On avance, et on garde une liste de ce qu\'on revoit.'], ['selon', 'Ça dépend de la matière', 'Tu le diras au début de chaque séance.']] },
    { cle: 'pause', q: 'Les pauses', options: [['20', 'Toutes les 20 minutes', 'Une pause de 5 minutes toutes les 20 minutes.'], ['25', 'Toutes les 25 minutes', 'Une pause de 5 minutes toutes les 25 minutes.'], ['demande', 'Quand je le demande', 'Tu dis « pause » et c\'est une pause, sans explication.']] },
    { cle: 'bruit', q: 'Autour de moi, pendant que je travaille', options: [['silence', 'Le silence complet', 'Pas de musique, pas de sons dans l\'application.'], ['doux', 'Un fond sonore doux', 'Les sons de l\'application restent, discrets.'], ['egal', 'Peu importe', 'On essaie les deux et tu décides.']] },
  ];
  const TROIS = [['endroit', 'Un endroit où tu aimerais aller'], ['fort', 'Une chose que tu sais bien faire'], ['plat', 'Un plat que tu pourrais manger tous les jours']];
  const TROIS_BASTIEN_DEFAUT = { endroit: 'La Norvège, pour voir une aurore en vrai.', fort: 'Construire des choses qui marchent, et réparer celles qui ne marchent plus.', plat: 'Des crêpes.' };

  function carteDefaut() {
    return { prenom: 'Sterenn', aime: [], aimePas: '', matierePref: '', matiereInquiete: '', prevenir: 'veille', aide: [], regles: REGLES.map((r) => r[0]), autre: '', univers: [], universAutre: '', couleur: '', apprends: {}, trois: {}, question: '', signature: '', seanceFaite: [] };
  }
  const CARTE_BASTIEN_DEFAUT = 'Je m\'appelle Bastien. Je prépare tes cours et je les fais avec toi trois fois par semaine. Ce que j\'aime : construire des choses, comprendre comment ça marche, et les aurores boréales aussi. Ce que je te promets : je te dis toujours ce qu\'on va faire avant de le faire, je ne te compare à personne, et quand tu dis stop, on s\'arrête.';

  /** Deux réponses ont-elles un mot en commun ? (quatre lettres au moins, sans accents) */
  function pointCommun(a, b) {
    const mots = (t) => new Set(String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length >= 4));
    const ma = mots(a); for (const w of mots(b)) if (ma.has(w)) return w;
    return null;
  }

  /** Le pacte imprimable : une page crème, les règles signées des deux côtés. */
  function imprimerPacte(carte) {
    const regles = REGLES.filter((r) => (carte.regles || []).indexOf(r[0]) !== -1).map((r) => r[1]).concat(carte.autre ? [carte.autre] : []);
    const aides = (carte.aide || []);
    const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Notre pacte de travail</title>
      <style>body{font-family:Nunito,Arial,sans-serif;background:#fbf7ef;color:#1e2733;margin:0;padding:2.2rem;line-height:1.7}h1{font-size:1.7rem;margin:0 0 .3rem}p.sous{color:#4a5563;margin:0 0 1.6rem}h2{font-size:1.05rem;letter-spacing:.06em;text-transform:uppercase;color:#1d6f6a;margin:1.4rem 0 .5rem}ol,ul{margin:0;padding-left:1.3rem}li{margin:.25rem 0}.sign{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-top:2.2rem}.sign div{border-top:2px solid #1e2733;padding-top:.4rem;font-weight:700}@media print{body{padding:1.2rem}}</style></head><body>
      <h1>Notre pacte de travail</h1><p class="sous">${N.ech(carte.prenom || 'Sterenn')} et Bastien, le ${N.ech(date)}. Trois séances par semaine, de 13 h à 14 h 30.</p>
      <h2>Nos règles</h2><ol>${regles.map((r) => `<li>${N.ech(r)}</li>`).join('')}</ol>
      ${aides.length ? `<h2>Ce qui aide ${N.ech(carte.prenom || 'Sterenn')} quand elle bloque</h2><ul>${aides.map((a) => `<li>${N.ech(a)}</li>`).join('')}</ul>` : ''}
      <h2>Ce que Bastien promet</h2><ul><li>Dire ce qu'on va faire avant de le faire.</li><li>Ne comparer ${N.ech(carte.prenom || 'Sterenn')} à personne.</li><li>S'arrêter quand elle dit stop.</li></ul>
      <div class="sign"><div>${N.ech(carte.signature || carte.prenom || 'Sterenn')}</div><div>Bastien</div></div>
      <script>setTimeout(function(){ window.print(); }, 300);</script></body></html>`;
    const w = window.open('', '_blank');
    if (!w) { N.signaler('Autorise l\'ouverture d\'une fenêtre pour imprimer le pacte.'); return; }
    w.document.open(); w.document.write(html); w.document.close();
  }

  function vueDecouverte(etape) {
    let carte = Object.assign(carteDefaut(), N.profil('moi.carte', {}));
    carte.apprends = carte.apprends || {}; carte.trois = carte.trois || {}; carte.univers = carte.univers || []; carte.seanceFaite = carte.seanceFaite || [];
    let i = Math.max(0, Math.min(ETAPES_DECOUVERTE.length - 1, Number(etape) || 0));
    const fait = !!N.profil('moi.decouverte_fait', false);
    const troisBastien = Object.assign({}, TROIS_BASTIEN_DEFAUT, N.profil('bastien.trois', {}) || {});
    const reponseBastien = N.profil('bastien.reponse', '');

    const puce = (liste, cle, val) => `<button type="button" class="e-puce ${liste.indexOf(val) !== -1 ? 'actif' : ''}" data-puce="${cle}" data-val="${N.ech(val)}" aria-pressed="${liste.indexOf(val) !== -1}">${N.ech(val)}</button>`;
    const corps = () => {
      if (i === 0) {
        const faits = carte.seanceFaite.length;
        return `
        <p class="e-module-intro">Voici comment se passe notre première séance, minute par minute. Rien d'autre n'est prévu, et rien ne dure plus longtemps que ce qui est écrit. Coche chaque temps quand il est passé : la barre avance avec toi.</p>
        <p class="e-seance-avancee"><span class="e-pos-barre" aria-hidden="true"><i style="width:${Math.round((faits / PROGRAMME_SEANCE.length) * 100)}%"></i></span><b>${faits} sur ${PROGRAMME_SEANCE.length}</b></p>
        <ol class="e-horaire e-horaire-coche">${PROGRAMME_SEANCE.map((x, k) => `<li class="${carte.seanceFaite.indexOf(k) !== -1 ? 'fait' : ''}"><b>${x[0]}</b><span><label><input type="checkbox" data-temps="${k}" ${carte.seanceFaite.indexOf(k) !== -1 ? 'checked' : ''}> <strong>${N.ech(x[2])}</strong>${x[1] ? ` <em>${x[1]}</em>` : ''}</label><br>${N.ech(x[3])}</span></li>`).join('')}</ol>`;
      }
      if (i === 1) return `
        <p class="e-module-intro">Tes univers. Ce que tu choisis ici habille les énoncés de tes exercices : la fiction change le décor, jamais la réponse. Touche un univers pour voir un exemple vrai.</p>
        <ul class="e-univers">${UNIVERS.map((u) => `<li><button type="button" class="e-univers-tuile ${carte.univers.indexOf(u.id) !== -1 ? 'actif' : ''}" data-univers="${u.id}" aria-pressed="${carte.univers.indexOf(u.id) !== -1}"><span class="ico" aria-hidden="true">${u.ico}</span><b>${N.ech(u.nom)}</b><span class="phrase">${N.ech(u.phrase)}</span></button></li>`).join('')}</ul>
        <div class="e-univers-exemple" id="m-exemple" ${carte.univers.length ? '' : 'hidden'}><b>Dans tes cours, ça donne :</b><p id="m-exemple-texte">${N.ech((UNIVERS.find((u) => u.id === carte.univers[carte.univers.length - 1]) || {}).exemple || '')}</p></div>
        <label class="e-form-libre">Un autre univers que tu aimes <input type="text" id="m-univers-autre" maxlength="120" value="${N.ech(carte.universAutre || '')}" placeholder="Un livre, une série, un sport, un lieu…"></label>
        <p class="e-module-q">Ma couleur préférée <small>(elle colore ton espace et tes réussites)</small></p>
        <div class="e-couleurs">${COULEURS.map((c) => `<button type="button" class="e-couleur ${carte.couleur === c[0] ? 'actif' : ''}" data-couleur="${c[0]}" style="--c:${c[2]}" aria-pressed="${carte.couleur === c[0]}" aria-label="${N.ech(c[1])}" title="${N.ech(c[1])}"></button>`).join('')}</div>`;
      if (i === 2) return `
        <p class="e-module-intro">Ta carte. Tu remplis ce que tu veux, tu passes le reste. Bastien la lira, personne d'autre.</p>
        <div class="e-form-grille">
          <label>Le prénom qu'on utilise <input type="text" id="m-prenom" maxlength="40" value="${N.ech(carte.prenom)}"></label>
          <label>La matière que je préfère <select id="m-pref"><option value="">Je ne sais pas encore</option>${PROGRAMME.matieres.map((m) => `<option value="${m.id}" ${carte.matierePref === m.id ? 'selected' : ''}>${m.icone} ${N.ech(m.nom)}</option>`).join('')}</select></label>
          <label>Celle qui m'inquiète un peu <select id="m-inq"><option value="">Aucune</option>${PROGRAMME.matieres.map((m) => `<option value="${m.id}" ${carte.matiereInquiete === m.id ? 'selected' : ''}>${m.icone} ${N.ech(m.nom)}</option>`).join('')}</select></label>
        </div>
        <p class="e-module-q">Ce que j'aime <small>(clique, plusieurs réponses possibles)</small></p>
        <div class="e-puces">${GOUTS.map((g) => puce(carte.aime, 'aime', g)).join('')}</div>
        <label class="e-form-libre">Autre chose que j'aime, ou que je n'aime pas du tout <textarea id="m-aimepas" rows="2" maxlength="300">${N.ech(carte.aimePas)}</textarea></label>
        <p class="e-module-q">Quand quelque chose change dans le programme, je préfère qu'on me prévienne :</p>
        <div class="e-puces">${PREVENIR.map((x) => `<button type="button" class="e-puce ${carte.prevenir === x[0] ? 'actif' : ''}" data-radio="prevenir" data-val="${x[0]}" aria-pressed="${carte.prevenir === x[0]}">${x[1]}</button>`).join('')}</div>`;
      if (i === 3) return `
        <p class="e-module-intro">Comment tu apprends le mieux. Cinq questions, une réponse chacune. Sous chaque choix, ce que Bastien fera concrètement.</p>
        ${APPRENDS.map((a) => `<div class="e-choix-bloc"><p class="e-module-q">${N.ech(a.q)}</p>
          <div class="e-choix-cartes" role="group" aria-label="${N.ech(a.q)}">${a.options.map((o) => `<button type="button" class="e-choix-carte ${carte.apprends[a.cle] === o[0] ? 'actif' : ''}" data-apprends="${a.cle}" data-val="${o[0]}" aria-pressed="${carte.apprends[a.cle] === o[0]}"><b>${N.ech(o[1])}</b><span>${N.ech(o[2])}</span></button>`).join('')}</div></div>`).join('')}`;
      if (i === 4) {
        const repondu = TROIS.filter((t) => (carte.trois[t[0]] || '').trim()).length;
        return `
        <p class="e-module-intro">Le jeu des trois questions. Tu réponds en une ligne ; la réponse de Bastien s'affiche quand la tienne est écrite. Trois réponses : on compte les points communs.</p>
        <ul class="e-trois">${TROIS.map((t) => { const mienne = (carte.trois[t[0]] || '').trim(); const sienne = troisBastien[t[0]] || ''; const commun = mienne ? pointCommun(mienne, sienne) : null; return `<li>
          <p class="e-trois-q">${N.ech(t[1])}</p>
          <label class="e-form-libre">Ma réponse <input type="text" data-trois="${t[0]}" maxlength="140" value="${N.ech(mienne)}"></label>
          <p class="e-trois-bastien" ${mienne ? '' : 'hidden'}><b>Bastien :</b> ${N.ech(sienne)}${commun ? ` <span class="e-trois-commun">point commun : « ${N.ech(commun)} »</span>` : ''}</p></li>`; }).join('')}</ul>
        <p class="e-module-q" id="m-trois-bilan">${repondu === 3 ? 'Trois réponses chacun. De quoi parler cinq minutes.' : `${repondu} réponse(s) sur 3.`}</p>`;
      }
      if (i === 5) return `
        <p class="e-module-intro">La carte de Bastien, écrite par lui.</p>
        <blockquote class="e-carte-bastien">${N.ech(N.profil('bastien.carte', CARTE_BASTIEN_DEFAUT))}</blockquote>
        <p class="e-module-q">Une question que tu voudrais lui poser <small>(facultatif, il y répond pendant la séance ou ici)</small></p>
        <label class="e-form-libre"><textarea id="m-question" rows="2" maxlength="300">${N.ech(carte.question || '')}</textarea></label>
        ${reponseBastien ? `<div class="e-univers-exemple"><b>Sa réponse :</b><p>${N.ech(reponseBastien)}</p></div>` : ''}`;
      if (i === 6) return `
        <p class="e-module-intro">Nos règles pour travailler ensemble. Elles sont proposées ; tu décoches celles que tu ne veux pas, et tu ajoutes ce qui manque. À la fin, tu signes, et le pacte s'imprime.</p>
        <ul class="e-regles">${REGLES.map((r) => `<li><label><input type="checkbox" data-regle="${r[0]}" ${carte.regles.indexOf(r[0]) !== -1 ? 'checked' : ''}> ${r[1]}</label></li>`).join('')}</ul>
        <p class="e-module-q">Ce qui m'aide quand je bloque <small>(plusieurs réponses possibles)</small></p>
        <div class="e-puces">${AIDES.map((a) => puce(carte.aide, 'aide', a)).join('')}</div>
        <label class="e-form-libre">Une règle à ajouter <input type="text" id="m-autre" maxlength="200" value="${N.ech(carte.autre)}"></label>
        <div class="e-pacte-signature"><label class="e-form-libre">Je signe (mon prénom) <input type="text" id="m-signature" maxlength="40" value="${N.ech(carte.signature || '')}"></label>
          <button type="button" class="e-bouton e-bouton-doux" id="m-imprimer">${ic('ic-telecharger')} Imprimer notre pacte</button></div>`;
      const choisis = UNIVERS.filter((u) => carte.univers.indexOf(u.id) !== -1).map((u) => u.jeu);
      const ids = choisis.concat(['3d-09-globe', '3d-01-systeme-solaire', '3d-12-ecosysteme', '2d-24-fractions']).filter((x, k, arr) => arr.indexOf(x) === k).slice(0, 4);
      const jeux = ids.map((id) => (window.JEUX || []).find((j) => j.id === id)).filter(Boolean);
      return `
        <p class="e-module-intro">Pour finir, un premier jeu ou un premier monde, au choix.${choisis.length ? ' Les premiers viennent de tes univers.' : ''} Une partie terminée vaut déjà une étoile.</p>
        <ul class="e-tuiles">${jeux.map((j) => `<li><a href="${j.url}"><span class="ico" aria-hidden="true">${j.ico}</span><b>${N.ech(j.titre)}</b><span>${j.type === '3d' ? 'Monde 3D' : 'Jeu'}</span></a></li>`).join('')}</ul>
        <p class="e-module-intro">Quand tu as fini, clique sur « J'ai fini ce module » : ta carte, tes univers et tes règles sont enregistrés, Bastien les voit.</p>`;
    };

    N.VUE.afficher(`<h1>${ic('ic-etincelle')} Faire connaissance</h1>
      <p class="e-intro">Le module de notre première séance. Huit écrans, dans l'ordre, sans surprise.${fait ? ' Tu l\'as déjà terminé : tu peux relire ou modifier.' : ''}</p>
      <section class="e-diapo e-module">
        <div class="e-diapo-barre"><ol class="e-diapo-etapes">${ETAPES_DECOUVERTE.map((t, k) => `<li><button type="button" data-etape="${k}" class="${k === i ? 'actif' : k < i ? 'vu' : ''}" ${k === i ? 'aria-current="step"' : ''}><b>${k + 1}</b><span>${N.ech(t)}</span></button></li>`).join('')}</ol></div>
        <div class="e-diapo-jauge"><i style="width:${Math.round(((i + 1) / ETAPES_DECOUVERTE.length) * 100)}%"></i></div>
        <div class="e-diapo-corps e-module-corps"><h2>${N.ech(ETAPES_DECOUVERTE[i])}</h2>${corps()}</div>
        <div class="e-diapo-pied">
          <button type="button" class="e-bouton e-bouton-doux" id="m-prec" ${i === 0 ? 'disabled' : ''}>${ic('ic-gauche')} Précédent</button>
          <span class="e-diapo-compte">${i + 1} sur ${ETAPES_DECOUVERTE.length}</span>
          <button type="button" class="e-bouton" id="m-suiv">${i === ETAPES_DECOUVERTE.length - 1 ? ic('ic-coche') + ' J\'ai fini ce module' : 'Suivant ' + ic('ic-droite')}</button>
        </div>
      </section>`);

    const lireEcran = () => {
      const g = (id) => document.getElementById(id);
      if (g('m-prenom')) carte.prenom = g('m-prenom').value.trim() || 'Sterenn';
      if (g('m-pref')) carte.matierePref = g('m-pref').value;
      if (g('m-inq')) carte.matiereInquiete = g('m-inq').value;
      if (g('m-aimepas')) carte.aimePas = g('m-aimepas').value.trim();
      if (g('m-question')) carte.question = g('m-question').value.trim();
      if (g('m-autre')) carte.autre = g('m-autre').value.trim();
      if (g('m-univers-autre')) carte.universAutre = g('m-univers-autre').value.trim();
      if (g('m-signature')) carte.signature = g('m-signature').value.trim();
      vue().querySelectorAll('[data-trois]').forEach((x) => { carte.trois[x.getAttribute('data-trois')] = x.value.trim(); });
      const regles = vue().querySelectorAll('[data-regle]');
      if (regles.length) carte.regles = [...regles].filter((c) => c.checked).map((c) => c.getAttribute('data-regle'));
    };
    const sauver = async (finir) => {
      lireEcran();
      try {
        await N.enregistrerProfil('moi.carte', carte);
        await N.enregistrerProfil('moi.decouverte_etape', i);
        if (finir) { await N.enregistrerProfil('moi.decouverte_fait', new Date().toISOString()); N.signaler('Module terminé. Ta carte est enregistrée.', 'succes'); }
      } catch (e) { N.signaler(e.message); }
    };
    vue().querySelectorAll('[data-puce]').forEach((b) => b.addEventListener('click', () => {
      const liste = carte[b.getAttribute('data-puce')];
      const v = b.getAttribute('data-val');
      const k = liste.indexOf(v);
      if (k === -1) liste.push(v); else liste.splice(k, 1);
      b.classList.toggle('actif', k === -1); b.setAttribute('aria-pressed', String(k === -1));
    }));
    vue().querySelectorAll('[data-radio]').forEach((b) => b.addEventListener('click', () => {
      carte[b.getAttribute('data-radio')] = b.getAttribute('data-val');
      vue().querySelectorAll(`[data-radio="${b.getAttribute('data-radio')}"]`).forEach((x) => { x.classList.toggle('actif', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    }));
    // Écran 1 : les temps de la séance se cochent et la barre avance.
    vue().querySelectorAll('[data-temps]').forEach((c) => c.addEventListener('change', () => {
      const k = Number(c.getAttribute('data-temps')); const pos = carte.seanceFaite.indexOf(k);
      if (c.checked && pos === -1) carte.seanceFaite.push(k); if (!c.checked && pos !== -1) carte.seanceFaite.splice(pos, 1);
      c.closest('li').classList.toggle('fait', c.checked);
      const barre = vue().querySelector('.e-seance-avancee'); if (barre) { barre.querySelector('i').style.width = Math.round((carte.seanceFaite.length / PROGRAMME_SEANCE.length) * 100) + '%'; barre.querySelector('b').textContent = `${carte.seanceFaite.length} sur ${PROGRAMME_SEANCE.length}`; }
      N.enregistrerProfil('moi.carte', carte).catch(() => {});
    }));
    // Écran 2 : les univers et la couleur.
    vue().querySelectorAll('[data-univers]').forEach((b) => b.addEventListener('click', () => {
      const id = b.getAttribute('data-univers'); const k = carte.univers.indexOf(id);
      if (k === -1) carte.univers.push(id); else carte.univers.splice(k, 1);
      b.classList.toggle('actif', k === -1); b.setAttribute('aria-pressed', String(k === -1));
      const u = UNIVERS.find((x) => x.id === id); const zone = document.getElementById('m-exemple');
      if (zone && u) { zone.hidden = false; document.getElementById('m-exemple-texte').textContent = u.exemple; }
    }));
    vue().querySelectorAll('[data-couleur]').forEach((b) => b.addEventListener('click', () => {
      carte.couleur = carte.couleur === b.getAttribute('data-couleur') ? '' : b.getAttribute('data-couleur');
      if (N.appliquerPalette) N.appliquerPalette(PALETTE_DE[carte.couleur] || 'aurore');
      vue().querySelectorAll('[data-couleur]').forEach((x) => { const on = x.getAttribute('data-couleur') === carte.couleur; x.classList.toggle('actif', on); x.setAttribute('aria-pressed', String(on)); });
    }));
    // Écran 4 : un choix par question.
    vue().querySelectorAll('[data-apprends]').forEach((b) => b.addEventListener('click', () => {
      const cle = b.getAttribute('data-apprends'); carte.apprends[cle] = b.getAttribute('data-val');
      vue().querySelectorAll(`[data-apprends="${cle}"]`).forEach((x) => { x.classList.toggle('actif', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    }));
    // Écran 5 : la réponse de Bastien apparaît dès que la sienne est écrite.
    vue().querySelectorAll('[data-trois]').forEach((x) => x.addEventListener('input', () => {
      const li = x.closest('li'); const sienne = li.querySelector('.e-trois-bastien'); const cle = x.getAttribute('data-trois');
      carte.trois[cle] = x.value.trim(); sienne.hidden = !carte.trois[cle];
      const commun = carte.trois[cle] ? pointCommun(carte.trois[cle], troisBastien[cle]) : null;
      sienne.innerHTML = `<b>Bastien :</b> ${N.ech(troisBastien[cle] || '')}${commun ? ` <span class="e-trois-commun">point commun : « ${N.ech(commun)} »</span>` : ''}`;
      const n = TROIS.filter((t) => (carte.trois[t[0]] || '').trim()).length; const bilan = document.getElementById('m-trois-bilan');
      if (bilan) bilan.textContent = n === 3 ? 'Trois réponses chacun. De quoi parler cinq minutes.' : `${n} réponse(s) sur 3.`;
    }));
    const btnImprimer = document.getElementById('m-imprimer');
    if (btnImprimer) btnImprimer.addEventListener('click', async () => { lireEcran(); await sauver(false); imprimerPacte(carte); });
    vue().querySelectorAll('[data-etape]').forEach((b) => b.addEventListener('click', async () => { await sauver(false); vueDecouverte(Number(b.getAttribute('data-etape'))); }));
    document.getElementById('m-prec').addEventListener('click', async () => { await sauver(false); vueDecouverte(i - 1); });
    document.getElementById('m-suiv').addEventListener('click', async () => {
      if (i === ETAPES_DECOUVERTE.length - 1) { await sauver(true); location.hash = '#/hub'; return; }
      await sauver(false); vueDecouverte(i + 1);
    });
  }

  /* ======================= Où j'en suis ==================================== */
  const PAR_MATIERE = 5;
  function questionsPositionnement() {
    const liste = [];
    PROGRAMME.matieres.forEach((m) => {
      const [a, b] = m.lecons;
      // On lit la banque directement : le point de départ porte aussi sur des
      // leçons encore verrouillées, c'est le but.
      const B = window.EXERCICES || {};
      const ba = a && B[m.id + '/' + a.ref]; const bb = b && B[m.id + '/' + b.ref];
      const items = [].concat(ba && ba.items ? ba.items.slice(0, 3).map((q) => ({ ...q, ref: a.ref })) : [], bb && bb.items ? bb.items.slice(0, 2).map((q) => ({ ...q, ref: b.ref })) : []);
      items.slice(0, PAR_MATIERE).forEach((q) => liste.push({ ...q, mid: m.id }));
    });
    return liste;
  }
  const normaliser = (v) => String(v).toLowerCase().trim().replace(/,/g, '.').replace(/\s+/g, ' ').replace(/[.;!?]+$/, '');
  let pos = null;

  function vuePositionnement() {
    if (!window.EXERCICES) {
      N.VUE.afficher('<p class="e-vide">Préparation des questions…</p>');
      N.chargerBanque().then(vuePositionnement).catch(() => N.signaler('Les questions n\'ont pas pu être chargées.'));
      return;
    }
    const deja = N.profil('moi.positionnement', null);
    if (!pos) {
      if (deja && !deja.enCours) {
        return rendreBilanPositionnement(deja);
      }
      pos = { items: questionsPositionnement(), index: 0, reponses: [] };
    }
    rendreQuestionPositionnement();
  }
  function rendreQuestionPositionnement() {
    const p = pos;
    if (p.index >= p.items.length) return finirPositionnement();
    const item = p.items[p.index];
    const m = N.matiere(item.mid);
    const corps = item.type !== 'saisie'
      ? `<ul class="e-exo-choix">${(item.type === 'vraifaux' ? ['Vrai', 'Faux'] : item.choix).map((c, k) => `<li><button type="button" data-choix="${k}">${c}</button></li>`).join('')}</ul>`
      : `<form class="e-exo-saisie" id="pos-form"><input id="pos-saisie" type="text" autocomplete="off" placeholder="ta réponse" aria-label="Ta réponse"><button class="e-bouton" type="submit">Vérifier</button></form>`;
    N.VUE.afficher(`<div class="e-exo">
      <h1 style="font-size:1.4rem;margin-bottom:.3rem">${ic('ic-cible')} Où j'en suis</h1>
      <p class="e-intro">Sans note. On regarde ensemble ce que tu sais déjà, matière par matière.</p>
      <div class="e-exo-barre" aria-hidden="true">${p.items.map((_, k) => `<i class="${k < p.index ? (p.reponses[k] ? 'ok' : 'ko') : k === p.index ? 'en-cours' : ''}"></i>`).join('')}</div>
      <div class="e-exo-carte">
        <p class="e-exo-compteur">${m.icone} ${N.ech(m.nom)} · question ${p.index + 1} sur ${p.items.length}</p>
        <p class="e-exo-question">${item.q}</p>${corps}
        <div id="pos-retour"></div>
      </div></div>`);
    vue().querySelectorAll('[data-choix]').forEach((b) => b.addEventListener('click', () => repondrePositionnement(Number(b.getAttribute('data-choix')))));
    const f = document.getElementById('pos-form');
    if (f) { f.addEventListener('submit', (ev) => { ev.preventDefault(); repondrePositionnement(document.getElementById('pos-saisie').value); }); document.getElementById('pos-saisie').focus(); }
  }
  function repondrePositionnement(valeur) {
    const p = pos; const item = p.items[p.index];
    let juste;
    if (item.type === 'qcm') juste = valeur === item.reponse;
    else if (item.type === 'vraifaux') juste = (valeur === 0) === (item.reponse === true);
    else juste = (item.reponses || []).some((r) => normaliser(r) === normaliser(valeur));
    p.reponses[p.index] = juste;
    vue().querySelectorAll('.e-exo-choix button').forEach((b) => { b.disabled = true; });
    const f = document.getElementById('pos-form'); if (f) { f.querySelector('input').disabled = true; f.querySelector('button').disabled = true; }
    document.getElementById('pos-retour').innerHTML = `<div class="e-exo-retour ${juste ? 'ok' : 'ko'}">
      <p><b>${juste ? 'Juste.' : 'Pas cette fois.'}</b> ${N.ech(item.explication || '')}</p>
      <button type="button" class="e-bouton" id="pos-suite">${p.index + 1 < p.items.length ? 'Question suivante' : 'Voir le bilan'}</button></div>`;
    document.getElementById('pos-suite').addEventListener('click', () => { p.index += 1; rendreQuestionPositionnement(); });
    document.getElementById('pos-suite').focus();
  }
  async function finirPositionnement() {
    const p = pos;
    const matieres = {};
    p.items.forEach((it, k) => {
      const m = matieres[it.mid] || (matieres[it.mid] = { justes: 0, total: 0 });
      m.total += 1; if (p.reponses[k]) m.justes += 1;
    });
    const bilan = { date: new Date().toISOString(), matieres };
    pos = null;
    try { await N.enregistrerProfil('moi.positionnement', bilan); } catch (e) { N.signaler(e.message); }
    rendreBilanPositionnement(bilan);
  }
  function rendreBilanPositionnement(bilan) {
    const lignes = PROGRAMME.matieres.map((m) => {
      const r = bilan.matieres[m.id] || { justes: 0, total: 0 };
      const pct = r.total ? Math.round((r.justes / r.total) * 100) : 0;
      return `<li><span class="e-pos-mat">${m.icone} ${N.ech(m.nom)}</span><span class="e-pos-barre"><i style="width:${pct}%"></i></span><b>${r.justes} sur ${r.total}</b></li>`;
    }).join('');
    N.VUE.afficher(`<h1>${ic('ic-cible')} Où j'en suis</h1>
      <p class="e-intro">Ton point de départ, fait le ${N.ech(N.dateCourte(bilan.date))}. Ce n'est pas une note : c'est la carte de ce qu'on va travailler en premier.</p>
      <section class="e-carte">
        <ul class="e-pos-liste">${lignes}</ul>
        <p class="e-module-intro">Une barre courte n'est pas un problème : c'est une leçon qu'on fera ensemble bientôt. Une barre longue, c'est une base sur laquelle on s'appuie.</p>
        <p class="e-actions"><button type="button" class="e-bouton e-bouton-doux" id="pos-refaire">Refaire le point plus tard</button><a class="e-bouton e-bouton-fin" href="#/hub">← Accueil</a></p>
      </section>`);
    document.getElementById('pos-refaire').addEventListener('click', () => { pos = null; N.etat.profil['moi.positionnement'] = { ...bilan, enCours: true }; vuePositionnement(); });
  }

  window.MODULES_ELEVE = { vueDecouverte, vuePositionnement, CARTE_BASTIEN_DEFAUT, REGLES, PREVENIR, UNIVERS, APPRENDS, TROIS, TROIS_BASTIEN_DEFAUT, COULEURS };
})();
