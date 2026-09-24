/**
 * Modules hors programme de l'espace de Sterenn.
 *
 *  - « Faire connaissance » : la première séance, annoncée pas à pas ; sa carte,
 *    la carte de Bastien, les règles de travail, un premier jeu.
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
  const ETAPES_DECOUVERTE = ['Notre première séance', 'Ma carte', 'La carte de Bastien', 'Nos règles', 'Un premier jeu'];

  function carteDefaut() {
    return { prenom: 'Sterenn', aime: [], aimePas: '', matierePref: '', matiereInquiete: '', prevenir: 'veille', aide: [], regles: REGLES.map((r) => r[0]), autre: '' };
  }
  const CARTE_BASTIEN_DEFAUT = 'Je m\'appelle Bastien. Je prépare tes cours et je les fais avec toi trois fois par semaine. Ce que j\'aime : construire des choses, comprendre comment ça marche, et les aurores boréales aussi. Ce que je te promets : dire ce qu\'on va faire avant de le faire, ne jamais prolonger une séance, et nommer précisément ce que tu as réussi. Si quelque chose te gêne, tu me le dis, ou tu me l\'écris dans les messages : c\'est fait pour ça.';

  function vueDecouverte(etape) {
    let carte = Object.assign(carteDefaut(), N.profil('moi.carte', {}));
    let i = Math.max(0, Math.min(ETAPES_DECOUVERTE.length - 1, Number(etape) || 0));
    const fait = !!N.profil('moi.decouverte_fait', false);

    const puce = (liste, cle, val) => `<button type="button" class="e-puce ${liste.indexOf(val) !== -1 ? 'actif' : ''}" data-puce="${cle}" data-val="${N.ech(val)}" aria-pressed="${liste.indexOf(val) !== -1}">${N.ech(val)}</button>`;
    const corps = () => {
      if (i === 0) return `
        <p class="e-module-intro">Voici comment se passe notre première séance, minute par minute. Rien d'autre n'est prévu, et rien ne dure plus longtemps que ce qui est écrit.</p>
        <ol class="e-horaire">${PROGRAMME_SEANCE.map((x) => `<li><b>${x[0]}</b><span><strong>${N.ech(x[2])}</strong>${x[1] ? ` <em>${x[1]}</em>` : ''}<br>${N.ech(x[3])}</span></li>`).join('')}</ol>`;
      if (i === 1) return `
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
      if (i === 2) return `
        <p class="e-module-intro">La carte de Bastien, écrite par lui.</p>
        <blockquote class="e-carte-bastien">${N.ech(N.profil('bastien.carte', CARTE_BASTIEN_DEFAUT))}</blockquote>
        <p class="e-module-q">Une question que tu voudrais lui poser <small>(facultatif, il y répond pendant la séance)</small></p>
        <label class="e-form-libre"><textarea id="m-question" rows="2" maxlength="300">${N.ech(carte.question || '')}</textarea></label>`;
      if (i === 3) return `
        <p class="e-module-intro">Nos règles pour travailler ensemble. Elles sont proposées ; tu décoches celles que tu ne veux pas, et tu ajoutes ce qui manque.</p>
        <ul class="e-regles">${REGLES.map((r) => `<li><label><input type="checkbox" data-regle="${r[0]}" ${carte.regles.indexOf(r[0]) !== -1 ? 'checked' : ''}> ${r[1]}</label></li>`).join('')}</ul>
        <p class="e-module-q">Ce qui m'aide quand je bloque <small>(plusieurs réponses possibles)</small></p>
        <div class="e-puces">${AIDES.map((a) => puce(carte.aide, 'aide', a)).join('')}</div>
        <label class="e-form-libre">Une règle à ajouter <input type="text" id="m-autre" maxlength="200" value="${N.ech(carte.autre)}"></label>`;
      return `
        <p class="e-module-intro">Pour finir, un premier jeu ou un premier monde, au choix. Une partie terminée vaut déjà une étoile.</p>
        <ul class="e-tuiles">${(window.JEUX || []).filter((j) => ['3d-09-globe', '3d-01-systeme-solaire', '3d-12-ecosysteme'].indexOf(j.id) !== -1 || j.id.indexOf('2d-0') === 0).slice(0, 6).map((j) => `<li><a href="${j.url}"><span class="ico" aria-hidden="true">${j.ico}</span><b>${N.ech(j.titre)}</b><span>${j.type === '3d' ? 'Monde 3D' : 'Jeu'}</span></a></li>`).join('')}</ul>
        <p class="e-module-intro">Quand tu as fini, clique sur « J'ai fini ce module » : ta carte et tes règles sont enregistrées, Bastien les voit.</p>`;
    };

    N.VUE.afficher(`<h1>${ic('ic-etincelle')} Faire connaissance</h1>
      <p class="e-intro">Le module de notre première séance. Cinq écrans, dans l'ordre, sans surprise.${fait ? ' Tu l\'as déjà terminé : tu peux relire ou modifier.' : ''}</p>
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
      const regles = vue().querySelectorAll('[data-regle]');
      if (regles.length) carte.regles = [...regles].filter((c) => c.checked).map((c) => c.getAttribute('data-regle'));
    };
    const sauver = async (fin) => {
      lireEcran();
      try {
        await N.enregistrerProfil('moi.carte', carte);
        if (fin) { await N.enregistrerProfil('moi.decouverte_fait', new Date().toISOString()); N.signaler('Module terminé. Ta carte est enregistrée.', 'succes'); }
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

  window.MODULES_ELEVE = { vueDecouverte, vuePositionnement, CARTE_BASTIEN_DEFAUT, REGLES, PREVENIR };
})();
