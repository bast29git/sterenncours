/* =========================================================================
   app.js : portail de cours de 4e.
   Application d'une seule page, sans dependance externe.
   Donnees : window.PROGRAMME (genere par le build) et window.EXERCICES.
   ========================================================================= */
(function () {
  'use strict';

  var CODES = { sanka29: 'eleve', babas29: 'prof' };
  var CLE_SESSION = 'cours4e.role';
  var CLE_SUIVI = 'cours4e.suivi.v1';
  var CLE_EXOS = 'cours4e.exos.v1';

  var NIVEAUX = [
    { id: 'insuffisant', libelle: 'Insuffisant', picto: '◔' },
    { id: 'fragile', libelle: 'Fragile', picto: '◑' },
    { id: 'satisfaisant', libelle: 'Satisfaisant', picto: '◕' },
    { id: 'tresbien', libelle: 'Très bien', picto: '●' }
  ];
  var TYPES_DOC = [
    { id: 'cours', fichier: '1-cours', libelle: 'Cours', picto: '📘' },
    { id: 'revision', fichier: '2-revision', libelle: 'Révision', picto: '🧠' },
    { id: 'exercices', fichier: '3-exercices', libelle: 'Exercices', picto: '✍️' },
    { id: 'evaluation', fichier: '4-evaluation', libelle: 'Évaluation', picto: '📊' }
  ];

  var role = null;
  var suivi = lire(CLE_SUIVI, {});
  var resultats = lire(CLE_EXOS, {});

  /* ---------- Utilitaires ------------------------------------------------ */
  function lire(cle, defaut) {
    try { return JSON.parse(localStorage.getItem(cle)) || defaut; }
    catch (e) { return defaut; }
  }
  function ecrire(cle, valeur) {
    try { localStorage.setItem(cle, JSON.stringify(valeur)); } catch (e) { /* mode privé */ }
  }
  function ech(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function matiere(id) {
    return PROGRAMME.matieres.filter(function (m) { return m.id === id; })[0] || null;
  }
  function lecon(m, ref) {
    return m.lecons.filter(function (l) { return l.ref === ref; })[0] || null;
  }
  function cleLecon(mid, ref) { return mid + '/' + ref; }
  function urlDoc(mid, dossier, fichier) {
    return '../matieres/' + mid + '/' + dossier + '/' + fichier + '.html';
  }
  function banque(mid, ref) {
    return (window.EXERCICES || {})[cleLecon(mid, ref)] || null;
  }
  function niveauDe(mid, ref) {
    var e = suivi[cleLecon(mid, ref)];
    return e ? e.niveau : null;
  }
  function infoNiveau(id) {
    return NIVEAUX.filter(function (n) { return n.id === id; })[0] || null;
  }
  function pastilleNiveau(id) {
    var n = infoNiveau(id);
    if (!n) return '<span class="niv niv-vide">non évaluée</span>';
    return '<span class="niv niv-' + n.id + '">' + n.picto + ' ' + n.libelle + '</span>';
  }
  function estValidee(mid, ref) {
    var n = niveauDe(mid, ref);
    return n === 'satisfaisant' || n === 'tresbien';
  }
  function progression(m) {
    var faites = m.lecons.filter(function (l) { return estValidee(m.id, l.ref); }).length;
    return { faites: faites, total: m.lecons.length, pct: Math.round((faites / m.lecons.length) * 100) };
  }

  /* ---------- Portail ---------------------------------------------------- */
  function ouvrirPortail() {
    document.getElementById('portail').hidden = false;
    document.getElementById('app').hidden = true;
    document.getElementById('code').focus();
  }
  function ouvrirApp(r) {
    role = r;
    document.getElementById('portail').hidden = true;
    document.getElementById('app').hidden = false;
    document.getElementById('badge-role').textContent = r === 'prof' ? 'Espace professeur' : 'Espace de Sterenn';
    construireNav();
    router();
  }

  document.getElementById('form-portail').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var saisi = document.getElementById('code').value.trim().toLowerCase();
    var r = CODES[saisi];
    var err = document.getElementById('portail-erreur');
    if (!r) { err.classList.add('visible'); return; }
    err.classList.remove('visible');
    try { sessionStorage.setItem(CLE_SESSION, r); } catch (e) { /* ignore */ }
    ouvrirApp(r);
  });

  document.getElementById('btn-sortir').addEventListener('click', function () {
    try { sessionStorage.removeItem(CLE_SESSION); } catch (e) { /* ignore */ }
    role = null;
    location.hash = '';
    document.getElementById('code').value = '';
    ouvrirPortail();
  });

  /* ---------- Navigation -------------------------------------------------- */
  function construireNav() {
    var liens = [
      { href: '#/accueil', texte: 'Accueil' },
      { href: '#/matieres', texte: 'Matières' }
    ];
    if (role === 'prof') {
      liens.push({ href: '#/suivi', texte: 'Suivi des acquis' });
      liens.push({ href: '#/programme', texte: 'Programme officiel' });
      liens.push({ href: '#/ressources', texte: 'Ressources' });
    } else {
      liens.push({ href: '#/progres', texte: 'Mes progrès' });
    }
    document.getElementById('nav-principal').innerHTML = liens.map(function (l) {
      return '<a href="' + l.href + '">' + l.texte + '</a>';
    }).join('');
  }

  function marquerNav() {
    var courant = location.hash || '#/accueil';
    var liens = document.querySelectorAll('#nav-principal a');
    for (var i = 0; i < liens.length; i++) {
      var base = liens[i].getAttribute('href').split('/')[1];
      liens[i].classList.toggle('actif', courant.split('/')[1] === base);
    }
  }

  function afficher(html) {
    var vue = document.getElementById('vue');
    vue.innerHTML = html;
    vue.focus();
    window.scrollTo(0, 0);
    marquerNav();
  }

  /* ---------- Vue : accueil ---------------------------------------------- */
  function vueAccueil() {
    var total = 0, validees = 0, dispo = 0;
    PROGRAMME.matieres.forEach(function (m) {
      m.lecons.forEach(function (l) {
        total += 1;
        if (estValidee(m.id, l.ref)) validees += 1;
        if (l.docs && l.docs.length === 4) dispo += 1;
      });
    });

    if (role === 'prof') {
      return afficher(
        '<h1>Tableau de bord</h1>' +
        '<p class="intro">Vue d\'ensemble de l\'année, matière par matière.</p>' +
        '<ul class="tuiles">' +
        tuile(PROGRAMME.matieres.length, 'matières') +
        tuile(total, 'leçons au programme') +
        tuile(dispo, 'leçons prêtes') +
        tuile(validees, 'leçons validées') +
        '</ul>' +
        '<h2 class="section-titre">Avancement par matière</h2>' +
        grilleMatieres() +
        '<div class="encart prof-seul"><h3>Où trouver quoi</h3>' +
        '<p><strong>Matières</strong> : le détail de chaque leçon, avec ses quatre documents et ses exercices interactifs.<br>' +
        '<strong>Suivi des acquis</strong> : le positionnement des 69 leçons sur les quatre niveaux, exportable.<br>' +
        '<strong>Programme officiel</strong> : les thèmes et les attendus de fin d\'année, matière par matière.</p></div>'
      );
    }

    var prochaine = prochaineLecon();
    return afficher(
      '<h1>Bonjour Sterenn</h1>' +
      '<p class="intro">Voilà où tu en es, et ce qui vient ensuite.</p>' +
      '<ul class="tuiles">' +
      tuile(validees, 'leçons validées') +
      tuile(total - validees, 'leçons à venir') +
      tuile(Math.round((validees / total) * 100) + ' %', 'de l\'année') +
      '</ul>' +
      (prochaine
        ? '<div class="encart"><h3>La prochaine leçon</h3>' +
          '<p><strong>' + ech(prochaine.m.nom) + '</strong> · ' + ech(prochaine.l.titre) + '</p>' +
          '<p><a class="btn btn-doux" href="#/lecon/' + prochaine.m.id + '/' + prochaine.l.ref + '">Ouvrir cette leçon</a></p></div>'
        : '') +
      '<h2 class="section-titre">Tes matières</h2>' +
      grilleMatieres()
    );
  }

  function tuile(valeur, libelle) {
    return '<li><strong>' + ech(valeur) + '</strong><span>' + ech(libelle) + '</span></li>';
  }

  function prochaineLecon() {
    for (var p = 1; p <= 5; p += 1) {
      for (var i = 0; i < PROGRAMME.matieres.length; i += 1) {
        var m = PROGRAMME.matieres[i];
        for (var j = 0; j < m.lecons.length; j += 1) {
          var l = m.lecons[j];
          if (l.periode === p && l.docs && l.docs.length && !estValidee(m.id, l.ref)) {
            return { m: m, l: l };
          }
        }
      }
    }
    return null;
  }

  function grilleMatieres() {
    return '<ul class="grille-matieres">' + PROGRAMME.matieres.map(function (m) {
      var p = progression(m);
      var prets = m.lecons.filter(function (l) { return l.docs && l.docs.length === 4; }).length;
      return '<li><a href="#/matiere/' + m.id + '" style="--m:var(--c-' + m.id + ')">' +
        '<span class="m-icone" aria-hidden="true">' + m.icone + '</span>' +
        '<span class="m-nom">' + ech(m.nom) + '</span>' +
        '<span class="m-info">' + m.lecons.length + ' leçons · ' + prets + ' prêtes</span>' +
        '<span class="jauge"><i style="width:' + p.pct + '%"></i></span>' +
        '<span class="jauge-legende">' + p.faites + ' / ' + p.total + ' validées</span>' +
        '</a></li>';
    }).join('') + '</ul>';
  }

  /* ---------- Vue : liste des matières ------------------------------------ */
  function vueMatieres() {
    afficher(
      '<h1>Les matières</h1>' +
      '<p class="intro">Huit matières, ' + PROGRAMME.matieres.reduce(function (n, m) { return n + m.lecons.length; }, 0) + ' leçons sur l\'année.</p>' +
      grilleMatieres()
    );
  }

  /* ---------- Vue : une matière ------------------------------------------- */
  function vueMatiere(mid) {
    var m = matiere(mid);
    if (!m) return vueIntrouvable();
    var p = progression(m);
    var parPeriode = [1, 2, 3, 4, 5].map(function (per) {
      var lecons = m.lecons.filter(function (l) { return l.periode === per; });
      if (!lecons.length) return '';
      return '<h2 class="section-titre">Période ' + per + '</h2>' +
        '<ul class="liste-lecons">' + lecons.map(function (l) { return ligneLecon(m, l); }).join('') + '</ul>';
    }).join('');

    afficher(
      '<h1><span aria-hidden="true">' + m.icone + '</span> ' + ech(m.nom) + '</h1>' +
      '<p class="intro">' + ech(m.horaire) + ' · ' + m.lecons.length + ' leçons · ' + p.faites + ' validées</p>' +
      '<div class="encart" style="--accent:var(--c-' + m.id + ');--accent-trait:var(--c-' + m.id + ')">' +
      '<h3>Les thèmes officiels</h3><ul>' + m.themes.map(function (t) { return '<li>' + ech(t) + '</li>'; }).join('') + '</ul></div>' +
      (role === 'prof'
        ? '<div class="encart prof-seul"><h3>Attendus de fin d\'année</h3><ul>' +
          m.attendus.map(function (a) { return '<li>' + ech(a) + '</li>'; }).join('') + '</ul></div>'
        : '') +
      parPeriode
    );
  }

  function ligneLecon(m, l) {
    var dispo = l.docs || [];
    // Une leçon non encore rédigée affiche UNE mention, pas quatre boutons
    // désactivés : moins de bruit visuel, et l'information reste exacte.
    var actions = TYPES_DOC
      .filter(function (t) { return dispo.indexOf(t.id) !== -1; })
      .map(function (t) {
        return '<a href="' + urlDoc(m.id, l.dossier, t.fichier) + '" target="_blank" rel="noopener">' +
          t.picto + ' ' + t.libelle + '</a>';
      });
    var manquants = TYPES_DOC.length - dispo.length;
    if (manquants > 0) {
      actions.push('<span class="indispo">⏳ ' +
        (dispo.length === 0 ? 'en préparation' : manquants + ' document' + (manquants > 1 ? 's' : '') + ' à venir') +
        '</span>');
    }
    if (banque(m.id, l.ref)) {
      actions.unshift('<a href="#/exos/' + m.id + '/' + l.ref + '">🎯 Exercices interactifs</a>');
    }
    return '<li class="' + (dispo.length ? 'prete' : '') + '" style="--m:var(--c-' + m.id + ')">' +
      '<p class="lecon-ligne"><span class="puce-ref">' + ech(l.ref) + '</span>' +
      '<span class="lecon-nom">' + ech(l.titre) + '</span>' +
      '<span class="lecon-periode">' + pastilleNiveau(niveauDe(m.id, l.ref)) + '</span></p>' +
      '<p class="lecon-notions">' + l.notions.map(ech).join(' · ') + '</p>' +
      '<p class="lecon-actions">' + actions.join('') + '</p></li>';
  }

  /* ---------- Vue : exercices interactifs --------------------------------- */
  var session = null;

  function vueExos(mid, ref) {
    var m = matiere(mid);
    var l = m && lecon(m, ref);
    var b = banque(mid, ref);
    if (!m || !l || !b) return vueIntrouvable();
    session = { mid: mid, ref: ref, items: b.items, index: 0, reponses: [], termine: false };
    rendreExo();
  }

  function rendreExo() {
    var s = session;
    var m = matiere(s.mid);
    var l = lecon(m, s.ref);
    if (s.termine) return rendreBilanExo();

    var item = s.items[s.index];
    var corps = '';
    if (item.type === 'qcm' || item.type === 'vraifaux') {
      var choix = item.type === 'vraifaux' ? ['Vrai', 'Faux'] : item.choix;
      corps = '<ul class="exo-choix">' + choix.map(function (c, i) {
        return '<li><button type="button" data-choix="' + i + '">' + ech(c) + '</button></li>';
      }).join('') + '</ul>';
    } else {
      corps = '<form class="exo-saisie" id="form-saisie">' +
        '<input id="saisie" type="text" autocomplete="off" placeholder="ta réponse" aria-label="Ta réponse">' +
        '<button class="btn" type="submit">Vérifier</button></form>';
    }

    afficher(
      '<p class="discret"><a href="#/matiere/' + s.mid + '">← ' + ech(m.nom) + '</a></p>' +
      '<h1>' + ech(l.titre) + '</h1>' +
      '<p class="intro">Exercices interactifs. Tu peux te tromper : chaque réponse est expliquée.</p>' +
      barreProgression() +
      '<div class="exo-carte" style="--accent:var(--c-' + s.mid + ')">' +
      '<p class="exo-compteur">Question ' + (s.index + 1) + ' sur ' + s.items.length + '</p>' +
      '<p class="exo-question">' + item.q + '</p>' +
      corps +
      '<div id="zone-retour"></div>' +
      '</div>'
    );

    var boutons = document.querySelectorAll('.exo-choix button');
    for (var i = 0; i < boutons.length; i++) {
      boutons[i].addEventListener('click', function (ev) {
        repondre(parseInt(ev.currentTarget.getAttribute('data-choix'), 10));
      });
    }
    var form = document.getElementById('form-saisie');
    if (form) {
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        repondre(document.getElementById('saisie').value);
      });
      document.getElementById('saisie').focus();
    }
  }

  function barreProgression() {
    var s = session;
    return '<div class="exo-barre" aria-hidden="true">' + s.items.map(function (_, i) {
      var cls = '';
      if (s.reponses[i] === true) cls = 'ok';
      else if (s.reponses[i] === false) cls = 'ko';
      else if (i === s.index) cls = 'en-cours';
      return '<i class="' + cls + '"></i>';
    }).join('') + '</div>';
  }

  function normaliser(v) {
    return String(v).toLowerCase().trim()
      .replace(/,/g, '.')
      .replace(/\s+/g, ' ')
      .replace(/[.;!?]+$/, '');
  }

  function repondre(valeur) {
    var s = session;
    var item = s.items[s.index];
    var juste;
    if (item.type === 'qcm') juste = valeur === item.reponse;
    else if (item.type === 'vraifaux') juste = (valeur === 0) === (item.reponse === true);
    else juste = item.reponses.some(function (r) { return normaliser(r) === normaliser(valeur); });

    s.reponses[s.index] = juste;

    var boutons = document.querySelectorAll('.exo-choix button');
    for (var i = 0; i < boutons.length; i++) {
      boutons[i].disabled = true;
      var idx = parseInt(boutons[i].getAttribute('data-choix'), 10);
      var bonIdx = item.type === 'vraifaux' ? (item.reponse === true ? 0 : 1) : item.reponse;
      if (idx === bonIdx) boutons[i].classList.add('juste');
      else if (idx === valeur) boutons[i].classList.add('faux');
    }
    var form = document.getElementById('form-saisie');
    if (form) {
      form.querySelector('input').disabled = true;
      form.querySelector('button').disabled = true;
    }

    var dernier = s.index === s.items.length - 1;
    document.getElementById('zone-retour').innerHTML =
      '<div class="exo-retour ' + (juste ? 'ok' : 'ko') + '">' +
      '<strong>' + (juste ? '✅ C\'est juste' : '🔁 Pas encore') + '</strong>' +
      (juste ? '' : '<p>La bonne réponse : <strong>' + ech(bonneReponseTexte(item)) + '</strong></p>') +
      '<p>' + item.explication + '</p></div>' +
      '<button class="btn" id="btn-suivant" type="button">' +
      (dernier ? 'Voir mon résultat' : 'Question suivante') + '</button>';

    document.getElementById('btn-suivant').addEventListener('click', function () {
      if (dernier) { s.termine = true; enregistrerResultat(); }
      else { s.index += 1; }
      rendreExo();
    });
    document.getElementById('btn-suivant').focus();
  }

  function bonneReponseTexte(item) {
    if (item.type === 'qcm') return item.choix[item.reponse];
    if (item.type === 'vraifaux') return item.reponse ? 'Vrai' : 'Faux';
    return item.reponses[0];
  }

  function enregistrerResultat() {
    var s = session;
    var justes = s.reponses.filter(Boolean).length;
    resultats[cleLecon(s.mid, s.ref)] = {
      justes: justes,
      total: s.items.length,
      date: new Date().toISOString().slice(0, 10)
    };
    ecrire(CLE_EXOS, resultats);
  }

  function rendreBilanExo() {
    var s = session;
    var m = matiere(s.mid);
    var l = lecon(m, s.ref);
    var justes = s.reponses.filter(Boolean).length;
    var pct = Math.round((justes / s.items.length) * 100);
    var message;
    if (pct === 100) message = 'Tout juste. Cette notion est solide.';
    else if (pct >= 75) message = 'Très bon résultat. Reprends seulement les questions ratées.';
    else if (pct >= 50) message = 'La base est là. Relis la fiche de révision, puis refais la série.';
    else message = 'Reprends la fiche de cours avant de refaire la série. Ce n\'est pas un problème d\'entraînement, c\'est une notion à revoir.';

    afficher(
      '<p class="discret"><a href="#/matiere/' + s.mid + '">← ' + ech(m.nom) + '</a></p>' +
      '<h1>Résultat</h1>' +
      '<p class="intro">' + ech(l.titre) + '</p>' +
      '<ul class="tuiles">' +
      tuile(justes + ' / ' + s.items.length, 'bonnes réponses') +
      tuile(pct + ' %', 'de réussite') +
      '</ul>' +
      '<div class="encart"><h3>Ce que ça veut dire</h3><p>' + ech(message) + '</p></div>' +
      '<div class="outils-actions">' +
      '<button class="btn" id="btn-refaire" type="button">Refaire la série</button>' +
      '<a class="btn btn-doux" href="' + urlDoc(s.mid, l.dossier, '2-revision') + '" target="_blank" rel="noopener">Ouvrir la fiche de révision</a>' +
      '<a class="btn btn-neutre" href="#/matiere/' + s.mid + '">Revenir à la matière</a>' +
      '</div>'
    );
    document.getElementById('btn-refaire').addEventListener('click', function () {
      vueExos(s.mid, s.ref);
    });
  }

  /* ---------- Vue : mes progrès (élève) ----------------------------------- */
  function vueProgres() {
    var total = 0, validees = 0;
    PROGRAMME.matieres.forEach(function (m) {
      m.lecons.forEach(function (l) {
        total += 1;
        if (estValidee(m.id, l.ref)) validees += 1;
      });
    });
    var series = Object.keys(resultats).length;
    var parfaits = Object.keys(resultats).filter(function (k) {
      return resultats[k].justes === resultats[k].total;
    }).length;

    var badges = [
      { icone: '🚀', nom: 'Première leçon validée', obtenu: validees >= 1 },
      { icone: '🎯', nom: 'Première série sans faute', obtenu: parfaits >= 1 },
      { icone: '🔟', nom: 'Dix leçons validées', obtenu: validees >= 10 },
      { icone: '📚', nom: 'Une matière entière validée', obtenu: PROGRAMME.matieres.some(function (m) { return progression(m).pct === 100; }) },
      { icone: '🧭', nom: 'Une période bouclée', obtenu: periodeBouclee() },
      { icone: '🏅', nom: 'La moitié de l\'année', obtenu: validees >= Math.ceil(total / 2) }
    ];

    afficher(
      '<h1>Mes progrès</h1>' +
      '<p class="intro">Ce qui est validé reste validé.</p>' +
      '<ul class="tuiles">' +
      tuile(validees, 'leçons validées') +
      tuile(series, 'séries d\'exercices faites') +
      tuile(parfaits, 'séries sans faute') +
      '</ul>' +
      '<h2 class="section-titre">Mes badges</h2>' +
      '<ul class="badges">' + badges.map(function (b) {
        return '<li class="' + (b.obtenu ? 'obtenu' : '') + '">' +
          '<span class="b-icone" aria-hidden="true">' + b.icone + '</span>' + ech(b.nom) +
          (b.obtenu ? '' : ' <span class="discret">(à venir)</span>') + '</li>';
      }).join('') + '</ul>' +
      '<h2 class="section-titre">Matière par matière</h2>' +
      grilleMatieres()
    );
  }

  function periodeBouclee() {
    for (var p = 1; p <= 5; p += 1) {
      var lecons = [];
      PROGRAMME.matieres.forEach(function (m) {
        m.lecons.forEach(function (l) { if (l.periode === p) lecons.push({ m: m, l: l }); });
      });
      if (lecons.length && lecons.every(function (x) { return estValidee(x.m.id, x.l.ref); })) return true;
    }
    return false;
  }

  /* ---------- Vue : suivi des acquis (prof) -------------------------------- */
  function vueSuivi() {
    if (role !== 'prof') return vueAccueil();
    var lignes = '';
    PROGRAMME.matieres.forEach(function (m) {
      lignes += '<tr><th colspan="5" style="background:var(--c-' + m.id + '-bg);color:var(--c-' + m.id + ')">' +
        m.icone + ' ' + ech(m.nom) + '</th></tr>';
      m.lecons.forEach(function (l) {
        var cle = cleLecon(m.id, l.ref);
        var e = suivi[cle] || {};
        var res = resultats[cle];
        lignes += '<tr>' +
          '<td>' + ech(l.ref) + '</td>' +
          '<td>' + ech(l.titre) + '</td>' +
          '<td>P' + l.periode + '</td>' +
          '<td><select data-cle="' + cle + '">' +
          '<option value="">non évaluée</option>' +
          NIVEAUX.map(function (n) {
            return '<option value="' + n.id + '"' + (e.niveau === n.id ? ' selected' : '') + '>' +
              n.picto + ' ' + n.libelle + '</option>';
          }).join('') +
          '</select></td>' +
          '<td>' + (res ? res.justes + '/' + res.total + ' le ' + res.date : '') + '</td>' +
          '</tr>';
      });
    });

    afficher(
      '<h1>Suivi des acquis</h1>' +
      '<p class="intro">Les 69 leçons de l\'année, positionnées sur les quatre niveaux.</p>' +
      '<div class="encart prof-seul"><h3>Où sont stockées ces données</h3>' +
      '<p>Le suivi est enregistré <strong>dans ce navigateur uniquement</strong>. Il ne part sur aucun serveur et n\'est pas partagé entre appareils. Utilise l\'export pour le sauvegarder ou le transférer.</p></div>' +
      '<div class="outils-actions">' +
      '<button class="btn btn-doux" id="btn-export" type="button">Exporter le suivi</button>' +
      '<button class="btn btn-neutre" id="btn-import" type="button">Importer un suivi</button>' +
      '<input type="file" id="fichier-import" accept="application/json" hidden>' +
      '</div>' +
      '<table class="tableau-suivi"><thead><tr>' +
      '<th>Réf</th><th>Leçon</th><th>Période</th><th>Niveau atteint</th><th>Dernière série</th>' +
      '</tr></thead><tbody>' + lignes + '</tbody></table>'
    );

    var selects = document.querySelectorAll('.tableau-suivi select');
    for (var i = 0; i < selects.length; i++) {
      selects[i].addEventListener('change', function (ev) {
        var cle = ev.currentTarget.getAttribute('data-cle');
        var val = ev.currentTarget.value;
        if (!val) delete suivi[cle];
        else suivi[cle] = { niveau: val, date: new Date().toISOString().slice(0, 10) };
        ecrire(CLE_SUIVI, suivi);
      });
    }
    document.getElementById('btn-export').addEventListener('click', exporterSuivi);
    document.getElementById('btn-import').addEventListener('click', function () {
      document.getElementById('fichier-import').click();
    });
    document.getElementById('fichier-import').addEventListener('change', importerSuivi);
  }

  function exporterSuivi() {
    var donnees = JSON.stringify({ suivi: suivi, resultats: resultats, export: new Date().toISOString() }, null, 2);
    var blob = new Blob([donnees], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'suivi-4e-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importerSuivi(ev) {
    var fichier = ev.target.files && ev.target.files[0];
    if (!fichier) return;
    var lecteur = new FileReader();
    lecteur.onload = function () {
      try {
        var d = JSON.parse(lecteur.result);
        if (d.suivi) { suivi = d.suivi; ecrire(CLE_SUIVI, suivi); }
        if (d.resultats) { resultats = d.resultats; ecrire(CLE_EXOS, resultats); }
        vueSuivi();
      } catch (e) {
        alert('Ce fichier n\'est pas un export de suivi valide.');
      }
    };
    lecteur.readAsText(fichier);
  }

  /* ---------- Vue : programme officiel (prof) ------------------------------ */
  function vueProgramme() {
    if (role !== 'prof') return vueAccueil();
    afficher(
      '<h1>Programme officiel de 4ᵉ</h1>' +
      '<p class="intro">Les thèmes et les attendus de fin d\'année, matière par matière.</p>' +
      PROGRAMME.matieres.map(function (m) {
        return '<h2 class="section-titre" style="--accent:var(--c-' + m.id + ');--accent-trait:var(--c-' + m.id + ')">' +
          m.icone + ' ' + ech(m.nom) + '</h2>' +
          '<p class="discret">' + ech(m.horaire) + ' · ' + m.lecons.length + ' leçons</p>' +
          '<div class="encart" style="--accent:var(--c-' + m.id + ')"><h3>Thèmes officiels</h3><ul>' +
          m.themes.map(function (t) { return '<li>' + ech(t) + '</li>'; }).join('') + '</ul></div>' +
          '<div class="encart prof-seul"><h3>Attendus de fin d\'année</h3><ul>' +
          m.attendus.map(function (a) { return '<li>' + ech(a) + '</li>'; }).join('') + '</ul></div>' +
          '<div class="encart"><h3>Compétences évaluées</h3><p>' + m.competences.map(ech).join(' · ') + '</p></div>';
      }).join('')
    );
  }

  /* ---------- Vue : ressources (prof) ------------------------------------- */
  function vueRessources() {
    if (role !== 'prof') return vueAccueil();
    var docs = [
      { url: '../00-pilotage/synthese-programme-4e.html', titre: 'Synthèse complète du programme', desc: 'Panorama des 8 matières, socle commun, plan des 69 leçons, progression.' },
      { url: '../00-pilotage/cadre-pedagogique.html', titre: 'Cadre pédagogique et séances', desc: 'Rythme de la semaine, déroulé d\'une séance, écran et écriture, validation des acquis.' },
      { url: '../00-pilotage/progression-annuelle.html', titre: 'Progression annuelle', desc: 'Répartition des leçons sur les 5 périodes et semaines de reprise.' },
      { url: '../00-pilotage/journal-seances/modele-seance.html', titre: 'Modèle de fiche de séance', desc: 'Gabarit à copier pour chaque séance.' },
      { url: '../outils/methode-analyser-document.html', titre: 'Méthode : analyser un document', desc: 'La grille en 5 questions, valable en histoire, géo, EMC et français.' },
      { url: '../outils/methode-developpement-construit.html', titre: 'Méthode : développement construit', desc: 'Plan type, connecteurs, exemple rédigé.' },
      { url: '../outils/methode-probleme-maths.html', titre: 'Méthode : résoudre un problème', desc: 'Les 6 étapes et les mots de l\'énoncé.' },
      { url: '../outils/cartes-revision.html', titre: 'Cartes de révision', desc: 'Méthode des trois paquets et premier jeu de cartes.' },
      { url: '../outils/planificateur-seance.html', titre: 'Planificateur de séance', desc: 'Trame minutée et fiche vierge.' },
      { url: '../outils/suivi-acquis.html', titre: 'Suivi des acquis (version papier)', desc: 'Tableau des 69 leçons à imprimer.' }
    ];
    afficher(
      '<h1>Ressources</h1>' +
      '<p class="intro">Les documents de pilotage et les outils transversaux.</p>' +
      '<ul class="grille-matieres">' + docs.map(function (d) {
        return '<li><a href="' + d.url + '" target="_blank" rel="noopener">' +
          '<span class="m-nom">' + ech(d.titre) + '</span>' +
          '<span class="m-info">' + ech(d.desc) + '</span></a></li>';
      }).join('') + '</ul>'
    );
  }

  function vueIntrouvable() {
    afficher('<h1>Page introuvable</h1><p class="intro">Ce lien ne correspond à rien.</p>' +
      '<p><a class="btn btn-doux" href="#/accueil">Revenir à l\'accueil</a></p>');
  }

  /* ---------- Routeur ------------------------------------------------------ */
  function router() {
    if (!role) return;
    var parts = (location.hash || '#/accueil').replace(/^#\/?/, '').split('/');
    switch (parts[0]) {
      case '': case 'accueil': return vueAccueil();
      case 'matieres': return vueMatieres();
      case 'matiere': return vueMatiere(parts[1]);
      case 'exos': return vueExos(parts[1], parts[2]);
      case 'progres': return vueProgres();
      case 'suivi': return vueSuivi();
      case 'programme': return vueProgramme();
      case 'ressources': return vueRessources();
      default: return vueIntrouvable();
    }
  }

  window.addEventListener('hashchange', router);

  /* ---------- Démarrage ---------------------------------------------------- */
  var repris = null;
  try { repris = sessionStorage.getItem(CLE_SESSION); } catch (e) { /* ignore */ }
  if (repris === 'eleve' || repris === 'prof') ouvrirApp(repris);
  else ouvrirPortail();
})();
