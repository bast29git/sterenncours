/* =========================================================================
   app.js : espace de cours de 4e.
   Application d'une seule page, sans dependance externe.
   Donnees : window.PROGRAMME et window.CONTENU (generes par le build),
   window.EXERCICES (banque d'exercices interactifs, ecrite a la main).
   ========================================================================= */
(function () {
  'use strict';

  const CODES = { sanka29: 'eleve', babas29: 'prof' };
  const CLE_ROLE = 'cours4e.role';
  const CLE_SUIVI = 'cours4e.suivi.v1';
  const CLE_EXOS = 'cours4e.exos.v1';
  const CLE_FICHES = 'cours4e.fiches.v1';
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
  const FICHIERS_DOC = {
    cours: '1-cours', revision: '2-revision',
    exercices: '3-exercices', evaluation: '4-evaluation',
  };

  let role = null;
  let suivi = lire(CLE_SUIVI, {});
  let resultats = lire(CLE_EXOS, {});
  let fiches = lire(CLE_FICHES, {});
  let observateur = null;

  /* ---------- Stockage ---------------------------------------------------- */
  function lire(cle, defaut) {
    try { return JSON.parse(localStorage.getItem(cle)) || defaut; }
    catch (e) { return defaut; }
  }
  function ecrire(cle, valeur) {
    try { localStorage.setItem(cle, JSON.stringify(valeur)); } catch (e) { /* mode privé */ }
  }

  /* ---------- Utilitaires -------------------------------------------------- */
  const ech = (t) => String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const matiere = (id) => PROGRAMME.matieres.find((m) => m.id === id) || null;
  const lecon = (m, ref) => (m ? m.lecons.find((l) => l.ref === ref) : null) || null;
  const cle = (mid, ref) => mid + '/' + ref;
  const banque = (mid, ref) => (window.EXERCICES || {})[cle(mid, ref)] || null;
  const niveauDe = (mid, ref) => (suivi[cle(mid, ref)] || {}).niveau || null;
  const estValidee = (mid, ref) => ['satisfaisant', 'tresbien'].indexOf(niveauDe(mid, ref)) !== -1;
  const dossierPdf = (mid) => 'pdf/dossiers/' + mid + '.pdf';

  function progression(m) {
    const faites = m.lecons.filter((l) => estValidee(m.id, l.ref)).length;
    return { faites, total: m.lecons.length, pct: Math.round((faites / m.lecons.length) * 100) };
  }
  function pastille(id) {
    const n = NIVEAUX.find((x) => x.id === id);
    return n
      ? `<span class="niv niv-${n.id}">${n.picto} ${n.libelle}</span>`
      : '<span class="niv niv-vide">non évaluée</span>';
  }
  function anneau(pct, taille = 52) {
    const r = (taille - 7) / 2;
    const c = 2 * Math.PI * r;
    return `<span class="anneau" aria-hidden="true">
      <svg width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}">
        <circle class="piste" cx="${taille / 2}" cy="${taille / 2}" r="${r}" fill="none" stroke-width="5"/>
        <circle class="part" cx="${taille / 2}" cy="${taille / 2}" r="${r}" fill="none" stroke-width="5"
                stroke-dasharray="${(c * pct) / 100} ${c}"/>
      </svg><span class="pourcent">${pct}%</span></span>`;
  }

  /* ---------- Chargement du contenu à la demande --------------------------- */
  const enCours = {};
  function chargerContenu(mid) {
    if (window.CONTENU && window.CONTENU[mid]) return Promise.resolve(window.CONTENU[mid]);
    if (enCours[mid]) return enCours[mid];
    enCours[mid] = new Promise((resoudre) => {
      const s = document.createElement('script');
      s.src = 'data/contenu/' + mid + '.js';
      s.onload = () => resoudre((window.CONTENU || {})[mid] || null);
      s.onerror = () => resoudre(null);
      document.head.appendChild(s);
    });
    return enCours[mid];
  }

  /* ---------- Thème --------------------------------------------------------- */
  function appliquerTheme(valeur) {
    const racine = document.documentElement;
    if (valeur === 'clair') racine.setAttribute('data-theme', 'clair');
    else if (valeur === 'sombre') racine.setAttribute('data-theme', 'sombre');
    else racine.removeAttribute('data-theme');
    ecrire(CLE_THEME, valeur);
  }
  appliquerTheme(lire(CLE_THEME, 'auto'));

  document.getElementById('btn-theme').addEventListener('click', () => {
    const ordre = ['auto', 'clair', 'sombre'];
    const suivant = ordre[(ordre.indexOf(lire(CLE_THEME, 'auto')) + 1) % 3];
    appliquerTheme(suivant);
    document.getElementById('btn-theme').setAttribute(
      'aria-label', 'Thème : ' + suivant + '. Cliquer pour changer.',
    );
  });

  /* ---------- Portail -------------------------------------------------------- */
  function ouvrirPortail() {
    document.body.classList.add('portail-ouvert');
    document.getElementById('portail').hidden = false;
    document.getElementById('app').hidden = true;
    document.getElementById('code').focus();
  }
  function ouvrirApp(r) {
    role = r;
    document.body.classList.remove('portail-ouvert');
    document.getElementById('portail').hidden = true;
    document.getElementById('app').hidden = false;
    document.getElementById('badge-role').textContent = r === 'prof' ? 'Professeur' : 'Sterenn';
    router();
  }

  document.getElementById('form-portail').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const saisi = document.getElementById('code').value.trim().toLowerCase();
    const r = CODES[saisi];
    const err = document.getElementById('portail-erreur');
    if (!r) {
      err.classList.remove('visible');
      void err.offsetWidth;
      err.classList.add('visible');
      return;
    }
    err.classList.remove('visible');
    try { sessionStorage.setItem(CLE_ROLE, r); } catch (e) { /* ignore */ }
    ouvrirApp(r);
  });

  document.getElementById('btn-sortir').addEventListener('click', () => {
    try { sessionStorage.removeItem(CLE_ROLE); } catch (e) { /* ignore */ }
    role = null;
    location.hash = '';
    document.getElementById('code').value = '';
    ouvrirPortail();
  });

  /* ---------- Barre latérale -------------------------------------------------- */
  const lateral = document.getElementById('lateral');
  const voile = document.getElementById('voile');
  function basculerLateral(ouvrir) {
    lateral.classList.toggle('ouverte', ouvrir);
    voile.hidden = !ouvrir;
  }
  document.getElementById('btn-ouvrir-lateral').addEventListener('click', () => basculerLateral(true));
  document.getElementById('btn-fermer-lateral').addEventListener('click', () => basculerLateral(false));
  voile.addEventListener('click', () => basculerLateral(false));

  function construireLateral() {
    const courant = location.hash || '#/accueil';
    const lien = (href, ico, texte, extra = '') =>
      `<li><a href="${href}" class="${courant.split('/')[1] === href.split('/')[1] ? 'actif' : ''}">
        <span class="ico" aria-hidden="true">${ico}</span><span>${texte}</span>${extra}</a></li>`;

    const matieres = PROGRAMME.matieres.map((m) => {
      const p = progression(m);
      const actif = courant.indexOf('#/matiere/' + m.id) === 0
        || courant.indexOf('#/lecon/' + m.id + '/') === 0
        || courant.indexOf('#/dossier/' + m.id) === 0
        || courant.indexOf('#/exos/' + m.id + '/') === 0;
      const prets = m.lecons.filter((l) => l.docs && l.docs.length).length;
      return `<li style="--m:var(--c-${m.id})">
        <a href="#/matiere/${m.id}" class="${actif ? 'actif' : ''}">
          <span class="ico" aria-hidden="true">${m.icone}</span>
          <span>${ech(m.nom)}</span>
          <span class="compteur">${prets}/${m.lecons.length}</span>
        </a>
        <span class="mini-jauge"><i style="width:${p.pct}%"></i></span>
      </li>`;
    }).join('');

    const pilotage = role === 'prof'
      ? `<div class="lateral-groupe"><h2>Pilotage</h2><ul>
          ${lien('#/suivi', '📈', 'Suivi des acquis')}
          ${lien('#/programme', '🎓', 'Programme officiel')}
          ${lien('#/ressources', '🗂️', 'Ressources')}
        </ul></div>`
      : `<div class="lateral-groupe"><h2>Moi</h2><ul>
          ${lien('#/progres', '🏅', 'Mes progrès')}
        </ul></div>`;

    document.getElementById('nav-lateral').innerHTML =
      `<div class="lateral-groupe"><h2>Parcours</h2><ul>
        ${lien('#/accueil', '🏠', 'Accueil')}
        ${lien('#/matieres', '📚', 'Toutes les matières')}
      </ul></div>
      <div class="lateral-groupe"><h2>Matières</h2><ul>${matieres}</ul></div>
      ${pilotage}`;
  }

  function fil(morceaux) {
    document.getElementById('fil').innerHTML = morceaux.map((m, i) => {
      const sep = i ? '<span aria-hidden="true">›</span>' : '';
      return sep + (m.href ? `<a href="${m.href}">${ech(m.texte)}</a>` : `<b>${ech(m.texte)}</b>`);
    }).join('');
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

  /* ---------- Recherche -------------------------------------------------------- */
  document.getElementById('form-recherche').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = document.getElementById('q').value.trim();
    if (q) location.hash = '#/recherche/' + encodeURIComponent(q);
  });

  function vueRecherche(q) {
    const terme = (q || '').toLowerCase();
    const trouves = [];
    PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => {
      const foin = (l.ref + ' ' + l.titre + ' ' + l.notions.join(' ')).toLowerCase();
      if (foin.indexOf(terme) !== -1) trouves.push({ m, l });
    }));
    afficher(
      `<h1>Recherche</h1><p class="intro">${trouves.length} résultat(s) pour « ${ech(q)} ».</p>` +
      (trouves.length
        ? `<ul class="liste-lecons">${trouves.map(({ m, l }) => ligneLecon(m, l, true)).join('')}</ul>`
        : '<p class="vide">Aucune leçon ne correspond. Essaie un mot du titre ou une notion.</p>'),
      [{ texte: 'Accueil', href: '#/accueil' }, { texte: 'Recherche' }],
    );
  }

  /* ---------- Accueil ----------------------------------------------------------- */
  function chiffresGlobaux() {
    let total = 0; let validees = 0; let pretes = 0;
    PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => {
      total += 1;
      if (estValidee(m.id, l.ref)) validees += 1;
      if (l.docs && l.docs.length === 4) pretes += 1;
    }));
    return { total, validees, pretes };
  }
  const tuile = (v, t) => `<li><strong>${ech(v)}</strong><span>${ech(t)}</span></li>`;

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

  function vueAccueil() {
    const c = chiffresGlobaux();
    const suivante = prochaineLecon();
    const reprise = `<div class="encart"><h3>${suivante ? 'À faire maintenant' : 'Tout est à jour'}</h3>` +
      (suivante
        ? `<p><strong>${ech(suivante.m.nom)}</strong> · ${ech(suivante.l.titre)}</p>
           <p class="barre-actions" style="margin-bottom:0">
             <a class="bouton" href="#/lecon/${suivante.m.id}/${suivante.l.ref}/cours">Ouvrir la leçon</a>
             ${banque(suivante.m.id, suivante.l.ref) ? `<a class="bouton bouton-doux" href="#/exos/${suivante.m.id}/${suivante.l.ref}">S'entraîner</a>` : ''}
           </p>`
        : '<p>Aucune leçon prête n\'attend. Les prochaines arriveront au fil de l\'année.</p>') +
      '</div>';

    if (role === 'prof') {
      return afficher(
        `<h1>Tableau de bord</h1>
         <p class="intro">L'année de 4ᵉ en un coup d'œil, matière par matière.</p>
         <ul class="tuiles">
           ${tuile(PROGRAMME.matieres.length, 'matières')}
           ${tuile(c.total, 'leçons au programme')}
           ${tuile(c.pretes, 'leçons prêtes')}
           ${tuile(c.validees, 'leçons validées')}
         </ul>
         ${reprise}
         <h2 class="titre-section">Avancement par matière</h2>
         ${grilleMatieres()}`,
        [{ texte: 'Tableau de bord' }],
      );
    }

    return afficher(
      `<h1>Bonjour Sterenn</h1>
       <p class="intro">Voilà où tu en es, et ce qui vient ensuite.</p>
       <ul class="tuiles">
         ${tuile(c.validees, 'leçons validées')}
         ${tuile(c.total - c.validees, 'leçons à venir')}
         ${tuile(Math.round((c.validees / c.total) * 100) + ' %', 'de l\'année')}
       </ul>
       ${reprise}
       <h2 class="titre-section">Tes matières</h2>
       ${grilleMatieres()}`,
      [{ texte: 'Accueil' }],
    );
  }

  function grilleMatieres() {
    return `<ul class="grille-matieres">${PROGRAMME.matieres.map((m) => {
      const p = progression(m);
      const prets = m.lecons.filter((l) => l.docs && l.docs.length === 4).length;
      return `<li><a class="carte-matiere" href="#/matiere/${m.id}" style="--m:var(--c-${m.id})">
        ${anneau(p.pct)}
        <span class="m-nom">${m.icone} ${ech(m.nom)}</span>
        <span class="m-info">${m.lecons.length} leçons · ${prets} prêtes · ${p.faites} validées</span>
      </a></li>`;
    }).join('')}</ul>`;
  }

  function vueMatieres() {
    const c = chiffresGlobaux();
    afficher(
      `<h1>Les matières</h1>
       <p class="intro">${PROGRAMME.matieres.length} matières, ${c.total} leçons sur l'année.</p>
       ${grilleMatieres()}`,
      [{ texte: 'Accueil', href: '#/accueil' }, { texte: 'Matières' }],
    );
  }

  /* ---------- Une matière -------------------------------------------------------- */
  function ligneLecon(m, l, avecMatiere) {
    const dispo = l.docs || [];
    const actions = TYPES_DOC
      .filter((t) => dispo.indexOf(t.id) !== -1)
      .map((t) => `<a href="#/lecon/${m.id}/${l.ref}/${t.id}">${t.picto} ${t.libelle}</a>`);
    if (banque(m.id, l.ref)) {
      actions.push(`<a href="#/exos/${m.id}/${l.ref}">🎯 S'entraîner</a>`);
    }
    const manquants = TYPES_DOC.length - dispo.length;
    if (manquants > 0) {
      actions.push(`<span class="indispo">⏳ ${dispo.length === 0 ? 'en préparation' : manquants + ' à venir'}</span>`);
    }
    const nom = dispo.length
      ? `<a href="#/lecon/${m.id}/${l.ref}/${dispo[0]}">${ech(l.titre)}</a>`
      : ech(l.titre);
    return `<li class="${dispo.length ? 'prete' : ''}" style="--m:var(--c-${m.id})">
      <p class="lecon-ligne">
        <span class="puce-ref">${ech(l.ref)}</span>
        <span class="lecon-nom">${nom}</span>
        <span class="lecon-fin">${avecMatiere ? `<span class="discret">${ech(m.nom)}</span>` : ''}${pastille(niveauDe(m.id, l.ref))}</span>
      </p>
      <p class="lecon-notions">${l.notions.map(ech).join(' · ')}</p>
      <p class="lecon-actions">${actions.join('')}</p>
    </li>`;
  }

  function vueMatiere(mid) {
    const m = matiere(mid);
    if (!m) return vueIntrouvable();
    const p = progression(m);
    const aDuContenu = m.lecons.some((l) => l.docs && l.docs.length);

    const periodes = [1, 2, 3, 4, 5].map((per) => {
      const lecons = m.lecons.filter((l) => l.periode === per);
      if (!lecons.length) return '';
      return `<h2 class="titre-section">Période ${per}</h2>
        <ul class="liste-lecons">${lecons.map((l) => ligneLecon(m, l)).join('')}</ul>`;
    }).join('');

    afficher(
      `<h1>${m.icone} ${ech(m.nom)}</h1>
       <p class="intro">${ech(m.horaire)} · ${m.lecons.length} leçons · ${p.faites} validées</p>
       <ul class="tuiles">
         ${tuile(m.lecons.length, 'leçons au programme')}
         ${tuile(m.lecons.filter((l) => l.docs && l.docs.length === 4).length, 'leçons prêtes')}
         ${tuile(p.faites, 'validées')}
         ${tuile(p.pct + ' %', 'de la matière')}
       </ul>
       ${aDuContenu ? `<p class="barre-actions">
         <a class="bouton" href="#/dossier/${m.id}">📖 Lire le dossier complet</a>
         <a class="bouton bouton-doux" href="${dossierPdf(m.id)}" download>⬇️ Télécharger le PDF</a>
       </p>` : ''}
       <div class="encart" style="--accent:var(--c-${m.id});--accent-trait:var(--c-${m.id})">
         <h3>Les thèmes officiels</h3>
         <ul>${m.themes.map((t) => `<li>${ech(t)}</li>`).join('')}</ul>
       </div>
       ${role === 'prof' ? `<div class="encart encart-prof"><h3>Attendus de fin d'année</h3>
         <ul>${m.attendus.map((a) => `<li>${ech(a)}</li>`).join('')}</ul></div>` : ''}
       ${periodes}`,
      [{ texte: 'Accueil', href: '#/accueil' }, { texte: 'Matières', href: '#/matieres' }, { texte: m.nom }],
    );
  }

  /* ---------- Lecteur de fiche ------------------------------------------------- */
  function vueLecon(mid, ref, type) {
    const m = matiere(mid);
    const l = lecon(m, ref);
    if (!m || !l) return vueIntrouvable();
    const dispo = l.docs || [];
    if (!dispo.length) return vueIntrouvable();
    const actif = dispo.indexOf(type) !== -1 ? type : dispo[0];

    afficher('<p class="vide">Chargement de la fiche…</p>',
      [{ texte: 'Accueil', href: '#/accueil' },
       { texte: m.nom, href: '#/matiere/' + m.id },
       { texte: l.titre }]);

    chargerContenu(mid).then((contenu) => {
      const doc = contenu && contenu[ref] && contenu[ref][actif];
      if (!doc) return afficher('<p class="vide">Cette fiche n\'est pas encore disponible.</p>');

      const onglets = TYPES_DOC
        .filter((t) => dispo.indexOf(t.id) !== -1)
        .map((t) => `<a href="#/lecon/${mid}/${ref}/${t.id}" class="${t.id === actif ? 'actif' : ''}">${t.picto} ${t.libelle}</a>`)
        .join('') + (banque(mid, ref) ? `<a href="#/exos/${mid}/${ref}">🎯 S'entraîner</a>` : '');

      const plan = doc.plan.length
        ? `<div class="rail-bloc"><h2>Dans cette fiche</h2><ol>${
            doc.plan.map((s) => `<li><a href="#${s.id}" data-ancre="${s.id}">${ech(s.texte)}</a></li>`).join('')
          }</ol></div>`
        : '';

      const cleFiche = cle(mid, ref) + '/' + actif;
      const luLe = fiches[cleFiche];
      const actionsRail = role === 'prof'
        ? `<div class="rail-bloc"><h2>Positionnement</h2>
             <p>${pastille(niveauDe(mid, ref))}</p>
             <select id="select-niveau" aria-label="Niveau atteint">
               <option value="">non évaluée</option>
               ${NIVEAUX.map((n) => `<option value="${n.id}"${niveauDe(mid, ref) === n.id ? ' selected' : ''}>${n.picto} ${n.libelle}</option>`).join('')}
             </select></div>`
        : `<div class="rail-bloc"><h2>Cette fiche</h2>
             <p class="discret" id="etat-fiche">${luLe ? 'Terminée le ' + ech(luLe) : 'Pas encore terminée'}</p>
             <button class="bouton bouton-doux" id="btn-fini" type="button">${luLe ? '↺ Annuler' : '✓ J\'ai terminé'}</button></div>`;

      const vue = document.getElementById('vue');
      vue.innerHTML =
        `<div class="lecteur" style="--m:var(--c-${mid});--accent:var(--c-${mid});--accent-trait:var(--c-${mid})">
          <div class="lecteur-corps">
            <header class="lecteur-tete">
              <p class="discret"><span class="puce-ref">${ech(l.ref)}</span> ${ech(m.nom)} · Période ${l.periode}</p>
              <h1>${ech(doc.titre)}</h1>
              ${doc.resume ? `<p>${ech(doc.resume)}</p>` : ''}
              <ul class="meta">
                ${doc.duree ? `<li>⏱️ ${ech(doc.duree)}</li>` : ''}
                ${doc.competences.length ? `<li>🧩 ${doc.competences.map(ech).join(' · ')}</li>` : ''}
              </ul>
            </header>
            <nav class="onglets" aria-label="Documents de la leçon">${onglets}</nav>
            ${doc.objectifs.length ? `<div class="bloc bloc-objectif">
              <p class="bloc-titre"><span class="picto" aria-hidden="true">🎯</span><span>Objectif${doc.objectifs.length > 1 ? 's' : ''}</span></p>
              <ul>${doc.objectifs.map((o) => `<li>${ech(o)}</li>`).join('')}</ul></div>` : ''}
            <article class="fiche-rendue">${doc.html}</article>
            <p class="barre-actions">
              <a class="bouton bouton-neutre" href="#/matiere/${mid}">← Retour à ${ech(m.nom)}</a>
              <a class="bouton bouton-doux" href="${dossierPdf(mid)}" download>⬇️ PDF de la matière</a>
            </p>
          </div>
          <aside class="rail">${plan}${actionsRail}</aside>
        </div>`;
      fil([{ texte: 'Accueil', href: '#/accueil' },
           { texte: m.nom, href: '#/matiere/' + m.id },
           { texte: l.ref + ' · ' + doc.titre }]);
      construireLateral();
      window.scrollTo(0, 0);
      brancherRail(doc.plan);

      const select = document.getElementById('select-niveau');
      if (select) {
        select.addEventListener('change', (ev) => {
          const v = ev.target.value;
          if (!v) delete suivi[cle(mid, ref)];
          else suivi[cle(mid, ref)] = { niveau: v, date: new Date().toISOString().slice(0, 10) };
          ecrire(CLE_SUIVI, suivi);
          construireLateral();
          select.previousElementSibling.innerHTML = pastille(v || null);
        });
      }
      const btnFini = document.getElementById('btn-fini');
      if (btnFini) {
        btnFini.addEventListener('click', () => {
          if (fiches[cleFiche]) delete fiches[cleFiche];
          else fiches[cleFiche] = new Date().toISOString().slice(0, 10);
          ecrire(CLE_FICHES, fiches);
          vueLecon(mid, ref, actif);
        });
      }
    });
  }

  function brancherRail(plan) {
    if (!plan.length || !('IntersectionObserver' in window)) return;
    const liens = {};
    document.querySelectorAll('.rail-bloc a[data-ancre]').forEach((a) => {
      liens[a.getAttribute('data-ancre')] = a;
    });
    observateur = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (!e.isIntersecting) return;
        Object.keys(liens).forEach((k) => liens[k].classList.remove('actif'));
        if (liens[e.target.id]) liens[e.target.id].classList.add('actif');
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    plan.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observateur.observe(el);
    });
  }

  /* ---------- Dossier complet lu dans le site ----------------------------------- */
  function vueDossier(mid) {
    const m = matiere(mid);
    if (!m) return vueIntrouvable();
    afficher('<p class="vide">Assemblage du dossier…</p>',
      [{ texte: 'Accueil', href: '#/accueil' },
       { texte: m.nom, href: '#/matiere/' + m.id },
       { texte: 'Dossier complet' }]);

    chargerContenu(mid).then((contenu) => {
      const lecons = m.lecons.filter((l) => contenu && contenu[l.ref]);
      if (!lecons.length) return afficher('<p class="vide">Aucune leçon n\'est encore rédigée dans cette matière.</p>');

      const sommaire = lecons.map((l) =>
        `<li><a href="#doc-${l.ref}"><span class="puce-ref">${ech(l.ref)}</span> ${ech(l.titre)}</a></li>`).join('');

      const corps = lecons.map((l) => TYPES_DOC
        .filter((t) => contenu[l.ref][t.id])
        .map((t, i) => {
          const d = contenu[l.ref][t.id];
          return `<section class="dossier-doc"${i === 0 ? ` id="doc-${l.ref}"` : ''}>
            <p class="dossier-fil"><span class="puce-ref">${ech(l.ref)}</span> ${ech(l.titre)}</p>
            <h2>${ech(d.titre)}</h2>
            <p><span class="etiquette-doc">${t.picto} ${t.libelle}</span></p>
            <article class="fiche-rendue">${d.html}</article>
          </section>`;
        }).join('')).join('');

      const vue = document.getElementById('vue');
      vue.innerHTML =
        `<div style="--m:var(--c-${mid});--accent:var(--c-${mid});--accent-trait:var(--c-${mid})">
          <h1>${m.icone} ${ech(m.nom)} : dossier complet</h1>
          <p class="intro">Toutes les leçons rédigées, avec leurs quatre documents à la suite. Rien à ouvrir, rien à télécharger.</p>
          <p class="barre-actions">
            <a class="bouton bouton-doux" href="${dossierPdf(mid)}" download>⬇️ Télécharger ce dossier en PDF</a>
            <a class="bouton bouton-neutre" href="#/matiere/${mid}">← Retour à ${ech(m.nom)}</a>
          </p>
          <div class="encart"><h3>Attendus de fin d'année</h3>
            <ul>${m.attendus.map((a) => `<li>${ech(a)}</li>`).join('')}</ul></div>
          <h2 class="titre-section">Leçons contenues</h2>
          <ul class="sommaire-dossier-site">${sommaire}</ul>
          ${corps}
        </div>`;
      construireLateral();
      window.scrollTo(0, 0);
    });
  }

  /* ---------- Exercices interactifs --------------------------------------------- */
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
    let corps;
    if (item.type === 'qcm' || item.type === 'vraifaux') {
      const choix = item.type === 'vraifaux' ? ['Vrai', 'Faux'] : item.choix;
      corps = `<ul class="exo-choix">${choix.map((c, i) =>
        `<li><button type="button" data-choix="${i}">${c}</button></li>`).join('')}</ul>`;
    } else {
      corps = `<form class="exo-saisie" id="form-saisie">
        <input id="saisie" type="text" autocomplete="off" placeholder="ta réponse" aria-label="Ta réponse">
        <button class="bouton" type="submit">Vérifier</button></form>`;
    }

    afficher(
      `<div style="--m:var(--c-${s.mid});--accent:var(--c-${s.mid});--accent-trait:var(--c-${s.mid})">
        <h1>🎯 ${ech(l.titre)}</h1>
        <p class="intro">Tu peux te tromper : chaque réponse est expliquée.</p>
        ${barreProgression()}
        <div class="exo-carte">
          <p class="exo-compteur">Question ${s.index + 1} sur ${s.items.length}</p>
          <p class="exo-question">${item.q}</p>
          ${corps}
          <div id="zone-retour"></div>
        </div>
      </div>`,
      [{ texte: 'Accueil', href: '#/accueil' },
       { texte: m.nom, href: '#/matiere/' + m.id },
       { texte: l.ref + ' · entraînement' }],
    );

    document.querySelectorAll('.exo-choix button').forEach((b) => {
      b.addEventListener('click', (ev) => repondre(parseInt(ev.currentTarget.getAttribute('data-choix'), 10)));
    });
    const form = document.getElementById('form-saisie');
    if (form) {
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        repondre(document.getElementById('saisie').value);
      });
      document.getElementById('saisie').focus();
    }
  }

  function barreProgression() {
    const s = session;
    return `<div class="exo-barre" aria-hidden="true">${s.items.map((_, i) => {
      let c = '';
      if (s.reponses[i] === true) c = 'ok';
      else if (s.reponses[i] === false) c = 'ko';
      else if (i === s.index) c = 'en-cours';
      return `<i class="${c}"></i>`;
    }).join('')}</div>`;
  }

  const normaliser = (v) => String(v).toLowerCase().trim()
    .replace(/,/g, '.').replace(/\s+/g, ' ').replace(/[.;!?]+$/, '');

  function repondre(valeur) {
    const s = session;
    const item = s.items[s.index];
    let juste;
    if (item.type === 'qcm') juste = valeur === item.reponse;
    else if (item.type === 'vraifaux') juste = (valeur === 0) === (item.reponse === true);
    else juste = item.reponses.some((r) => normaliser(r) === normaliser(valeur));
    s.reponses[s.index] = juste;

    const bonIdx = item.type === 'vraifaux' ? (item.reponse === true ? 0 : 1) : item.reponse;
    document.querySelectorAll('.exo-choix button').forEach((b) => {
      b.disabled = true;
      const idx = parseInt(b.getAttribute('data-choix'), 10);
      if (idx === bonIdx) b.classList.add('juste');
      else if (idx === valeur) b.classList.add('faux');
    });
    const form = document.getElementById('form-saisie');
    if (form) {
      form.querySelector('input').disabled = true;
      form.querySelector('button').disabled = true;
    }

    const dernier = s.index === s.items.length - 1;
    document.getElementById('zone-retour').innerHTML =
      `<div class="exo-retour ${juste ? 'ok' : 'ko'}">
        <strong>${juste ? '✅ C\'est juste' : '🔁 Pas encore'}</strong>
        ${juste ? '' : `<p>La bonne réponse : <strong>${bonneReponse(item)}</strong></p>`}
        <p>${item.explication}</p>
      </div>
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

  function enregistrer() {
    const s = session;
    const justes = s.reponses.filter(Boolean).length;
    const precedent = resultats[cle(s.mid, s.ref)];
    resultats[cle(s.mid, s.ref)] = {
      justes,
      total: s.items.length,
      date: new Date().toISOString().slice(0, 10),
      meilleur: Math.max(justes, (precedent && precedent.meilleur) || 0),
      series: ((precedent && precedent.series) || 0) + 1,
    };
    ecrire(CLE_EXOS, resultats);
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
      `<div style="--m:var(--c-${s.mid});--accent:var(--c-${s.mid});--accent-trait:var(--c-${s.mid})">
        <h1>${pct === 100 ? '🏆' : '📊'} Résultat</h1>
        <p class="intro">${ech(l.titre)}</p>
        <ul class="tuiles">
          ${tuile(justes + ' / ' + s.items.length, 'bonnes réponses')}
          ${tuile(pct + ' %', 'de réussite')}
        </ul>
        <div class="encart"><h3>Ce que ça veut dire</h3><p>${ech(message)}</p></div>
        ${ratees.length ? `<div class="encart encart-prof"><h3>À revoir</h3><ul>${
          ratees.map((r) => `<li>${r.q}</li>`).join('')}</ul></div>` : ''}
        <p class="barre-actions">
          <button class="bouton" id="btn-refaire" type="button">↺ Refaire la série</button>
          ${(l.docs || []).indexOf('revision') !== -1 ? `<a class="bouton bouton-doux" href="#/lecon/${s.mid}/${s.ref}/revision">🧠 Fiche de révision</a>` : ''}
          <a class="bouton bouton-neutre" href="#/matiere/${s.mid}">← ${ech(m.nom)}</a>
        </p>
      </div>`,
      [{ texte: 'Accueil', href: '#/accueil' },
       { texte: m.nom, href: '#/matiere/' + m.id },
       { texte: 'Résultat' }],
    );
    document.getElementById('btn-refaire').addEventListener('click', () => vueExos(s.mid, s.ref));
  }

  /* ---------- Mes progrès --------------------------------------------------------- */
  function periodeBouclee() {
    for (let p = 1; p <= 5; p += 1) {
      const lecons = [];
      PROGRAMME.matieres.forEach((m) => m.lecons.forEach((l) => { if (l.periode === p) lecons.push({ m, l }); }));
      if (lecons.length && lecons.every((x) => estValidee(x.m.id, x.l.ref))) return true;
    }
    return false;
  }

  function vueProgres() {
    const c = chiffresGlobaux();
    const series = Object.keys(resultats).reduce((n, k) => n + (resultats[k].series || 1), 0);
    const parfaits = Object.keys(resultats).filter((k) => resultats[k].meilleur === resultats[k].total).length;
    const fichesLues = Object.keys(fiches).length;

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
       <ul class="tuiles">
         ${tuile(c.validees, 'leçons validées')}
         ${tuile(fichesLues, 'fiches terminées')}
         ${tuile(series, 'séries d\'exercices')}
         ${tuile(parfaits, 'séries sans faute')}
       </ul>
       <h2 class="titre-section">Mes badges</h2>
       <ul class="badges">${badges.map((b) =>
         `<li class="${b.ok ? 'obtenu' : ''}"><span class="b-icone" aria-hidden="true">${b.i}</span>
          <span>${ech(b.n)}${b.ok ? '' : ' <span class="discret">(à venir)</span>'}</span></li>`).join('')}</ul>
       <h2 class="titre-section">Matière par matière</h2>
       ${grilleMatieres()}`,
      [{ texte: 'Accueil', href: '#/accueil' }, { texte: 'Mes progrès' }],
    );
  }

  /* ---------- Suivi des acquis (professeur) ---------------------------------------- */
  function vueSuivi() {
    if (role !== 'prof') return vueAccueil();
    const lignes = PROGRAMME.matieres.map((m) => {
      const entete = `<tr class="ligne-matiere"><th colspan="6"
        style="background:var(--c-${m.id}-bg);color:var(--c-${m.id})">${m.icone} ${ech(m.nom)}</th></tr>`;
      const corps = m.lecons.map((l) => {
        const k = cle(m.id, l.ref);
        const e = suivi[k] || {};
        const r = resultats[k];
        const pret = l.docs && l.docs.length === 4;
        return `<tr>
          <td>${ech(l.ref)}</td>
          <td>${pret ? `<a href="#/lecon/${m.id}/${l.ref}/cours">${ech(l.titre)}</a>` : ech(l.titre)}</td>
          <td>P${l.periode}</td>
          <td>${pret ? '✅' : (l.docs && l.docs.length ? '◐' : '⏳')}</td>
          <td><select data-cle="${k}">
            <option value="">non évaluée</option>
            ${NIVEAUX.map((n) => `<option value="${n.id}"${e.niveau === n.id ? ' selected' : ''}>${n.picto} ${n.libelle}</option>`).join('')}
          </select></td>
          <td>${r ? `${r.meilleur || r.justes}/${r.total} · ${r.series || 1} série(s)` : ''}</td>
        </tr>`;
      }).join('');
      return entete + corps;
    }).join('');

    afficher(
      `<h1>Suivi des acquis</h1>
       <p class="intro">Les ${chiffresGlobaux().total} leçons de l'année, positionnées sur les quatre niveaux.</p>
       <div class="encart encart-prof"><h3>Où sont stockées ces données</h3>
         <p>Le suivi est enregistré <strong>dans ce navigateur uniquement</strong>. Il ne part sur aucun serveur et n'est pas partagé entre appareils. L'export sert à le sauvegarder ou à le transférer.</p></div>
       <p class="barre-actions">
         <button class="bouton bouton-doux" id="btn-export" type="button">⬇️ Exporter le suivi</button>
         <button class="bouton bouton-neutre" id="btn-import" type="button">⬆️ Importer un suivi</button>
         <input type="file" id="fichier-import" accept="application/json" hidden>
       </p>
       <table class="tableau-suivi"><thead><tr>
         <th>Réf</th><th>Leçon</th><th>Période</th><th>Docs</th><th>Niveau atteint</th><th>Entraînement</th>
       </tr></thead><tbody>${lignes}</tbody></table>`,
      [{ texte: 'Accueil', href: '#/accueil' }, { texte: 'Suivi des acquis' }],
    );

    document.querySelectorAll('.tableau-suivi select').forEach((s) => {
      s.addEventListener('change', (ev) => {
        const k = ev.currentTarget.getAttribute('data-cle');
        const v = ev.currentTarget.value;
        if (!v) delete suivi[k];
        else suivi[k] = { niveau: v, date: new Date().toISOString().slice(0, 10) };
        ecrire(CLE_SUIVI, suivi);
        construireLateral();
      });
    });
    document.getElementById('btn-export').addEventListener('click', exporter);
    document.getElementById('btn-import').addEventListener('click', () => document.getElementById('fichier-import').click());
    document.getElementById('fichier-import').addEventListener('change', importer);
  }

  function exporter() {
    const donnees = JSON.stringify({ suivi, resultats, fiches, export: new Date().toISOString() }, null, 2);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([donnees], { type: 'application/json' }));
    a.download = 'suivi-4e-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importer(ev) {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    const lecteur = new FileReader();
    lecteur.onload = () => {
      try {
        const d = JSON.parse(lecteur.result);
        if (d.suivi) { suivi = d.suivi; ecrire(CLE_SUIVI, suivi); }
        if (d.resultats) { resultats = d.resultats; ecrire(CLE_EXOS, resultats); }
        if (d.fiches) { fiches = d.fiches; ecrire(CLE_FICHES, fiches); }
        vueSuivi();
      } catch (e) {
        alert('Ce fichier n\'est pas un export de suivi valide.');
      }
    };
    lecteur.readAsText(f);
  }

  /* ---------- Programme officiel et ressources ------------------------------------- */
  function vueProgramme() {
    if (role !== 'prof') return vueAccueil();
    afficher(
      `<h1>Programme officiel de 4ᵉ</h1>
       <p class="intro">Les thèmes et les attendus de fin d'année, matière par matière.</p>
       ${PROGRAMME.matieres.map((m) => `
         <div style="--accent:var(--c-${m.id});--accent-trait:var(--c-${m.id})">
           <h2 class="titre-section">${m.icone} <a href="#/matiere/${m.id}" style="color:inherit">${ech(m.nom)}</a></h2>
           <p class="discret">${ech(m.horaire)} · ${m.lecons.length} leçons</p>
           <div class="encart"><h3>Thèmes officiels</h3>
             <ul>${m.themes.map((t) => `<li>${ech(t)}</li>`).join('')}</ul></div>
           <div class="encart encart-prof"><h3>Attendus de fin d'année</h3>
             <ul>${m.attendus.map((a) => `<li>${ech(a)}</li>`).join('')}</ul></div>
           <div class="encart"><h3>Compétences évaluées</h3><p>${m.competences.map(ech).join(' · ')}</p></div>
         </div>`).join('')}`,
      [{ texte: 'Accueil', href: '#/accueil' }, { texte: 'Programme officiel' }],
    );
  }

  function vueRessources() {
    if (role !== 'prof') return vueAccueil();
    const docs = [
      ['00-pilotage/synthese-programme-4e.html', 'Synthèse complète du programme', 'Panorama des 8 matières, socle commun, plan des leçons, progression.'],
      ['00-pilotage/cadre-pedagogique.html', 'Cadre pédagogique et séances', 'Rythme de la semaine, déroulé d\'une séance, écran et écriture, validation des acquis.'],
      ['00-pilotage/progression-annuelle.html', 'Progression annuelle', 'Répartition des leçons sur les 5 périodes et semaines de reprise.'],
      ['00-pilotage/journal-seances/modele-seance.html', 'Modèle de fiche de séance', 'Gabarit à copier pour chaque séance.'],
      ['outils/methode-analyser-document.html', 'Méthode : analyser un document', 'La grille en 5 questions.'],
      ['outils/methode-developpement-construit.html', 'Méthode : développement construit', 'Plan type, connecteurs, exemple rédigé.'],
      ['outils/methode-probleme-maths.html', 'Méthode : résoudre un problème', 'Les 6 étapes et les mots de l\'énoncé.'],
      ['outils/cartes-revision.html', 'Cartes de révision', 'Méthode des trois paquets et premier jeu.'],
      ['outils/planificateur-seance.html', 'Planificateur de séance', 'Trame minutée et fiche vierge.'],
      ['outils/suivi-acquis.html', 'Suivi des acquis (papier)', 'Tableau des leçons à imprimer.'],
    ];
    afficher(
      `<h1>Ressources</h1>
       <p class="intro">Les documents de pilotage et les outils transversaux.</p>
       <ul class="grille-matieres">${docs.map(([url, titre, desc]) =>
         `<li><a class="carte-matiere" href="${url}" target="_blank" rel="noopener" style="--m:var(--accent);grid-template-columns:1fr">
            <span class="m-nom">${ech(titre)}</span>
            <span class="m-info">${ech(desc)}</span></a></li>`).join('')}</ul>`,
      [{ texte: 'Accueil', href: '#/accueil' }, { texte: 'Ressources' }],
    );
  }

  function vueIntrouvable() {
    afficher('<h1>Page introuvable</h1><p class="vide">Ce lien ne correspond à rien.<br><a class="bouton bouton-doux" href="#/accueil">Revenir à l\'accueil</a></p>',
      [{ texte: 'Accueil', href: '#/accueil' }, { texte: 'Introuvable' }]);
  }

  /* ---------- Routeur ---------------------------------------------------------------- */
  function router() {
    if (!role) return;
    const p = (location.hash || '#/accueil').replace(/^#\/?/, '').split('/');
    switch (p[0]) {
      case '': case 'accueil': return vueAccueil();
      case 'matieres': return vueMatieres();
      case 'matiere': return vueMatiere(p[1]);
      case 'lecon': return vueLecon(p[1], p[2], p[3]);
      case 'dossier': return vueDossier(p[1]);
      case 'exos': return vueExos(p[1], p[2]);
      case 'progres': return vueProgres();
      case 'suivi': return vueSuivi();
      case 'programme': return vueProgramme();
      case 'ressources': return vueRessources();
      case 'recherche': return vueRecherche(decodeURIComponent(p.slice(1).join('/')));
      default: return vueIntrouvable();
    }
  }
  window.addEventListener('hashchange', router);

  /* ---------- Démarrage ---------------------------------------------------------------- */
  let repris = null;
  try { repris = sessionStorage.getItem(CLE_ROLE); } catch (e) { /* ignore */ }
  if (repris === 'eleve' || repris === 'prof') ouvrirApp(repris);
  else ouvrirPortail();
})();
