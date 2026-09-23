/**
 * build.mjs : Markdown → HTML pour les supports de cours de Sterenn.
 *
 * Zéro style en ligne : tout le rendu passe par le design system
 * (theme/cours.css) et par un jeu fermé de conteneurs `:::`.
 * Objectif : une syntaxe = un bloc visuel, toujours le même,
 * avec pictogramme + libellé + couleur (redondance du sens).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import attrs from 'markdown-it-attrs';
import deflist from 'markdown-it-deflist';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SORTIE = path.join(RACINE, 'public');
const DOSSIERS_CONTENU = ['00-pilotage', 'matieres', 'outils'];

/* ── Lexique FIXE des blocs (picto + libellé + classe) ─────────────────── */
const BLOCS = {
  objectif:   { picto: '🎯', libelle: 'Objectif',            classe: 'bloc-objectif' },
  plan:       { picto: '🧭', libelle: 'Plan de la fiche',    classe: 'bloc-plan' },
  materiel:   { picto: '🎒', libelle: 'Ce dont tu as besoin',classe: 'bloc-plan' },
  definition: { picto: '📘', libelle: 'Définition',          classe: 'bloc-definition' },
  formule:    { picto: '🧮', libelle: 'Formule à connaître', classe: 'bloc-formule' },
  exemple:    { picto: '💡', libelle: 'Exemple guidé',       classe: 'bloc-exemple' },
  piege:      { picto: '⚠️', libelle: 'Piège à éviter',      classe: 'bloc-piege' },
  retenir:    { picto: '🧠', libelle: 'À retenir',           classe: 'bloc-retenir' },
  methode:    { picto: '🧰', libelle: 'Méthode pas à pas',   classe: 'bloc-methode' },
  aide:       { picto: '🆘', libelle: 'Coup de pouce',       classe: 'bloc-aide' },
  pause:      { picto: '🔁', libelle: 'Pause conseillée',    classe: 'bloc-pause' },
  info:       { picto: 'ℹ️', libelle: 'Bon à savoir',        classe: 'bloc-aide' },
};

const NIVEAUX_EX = {
  application: 'Application',
  entrainement: 'Entraînement',
  approfondissement: 'Approfondissement',
};

const TYPES_DOC = {
  cours:      'Fiche de cours',
  revision:   'Fiche de révision',
  exercices:  'Exercices corrigés',
  evaluation: "Grille d'évaluation",
  pilotage:   'Document de pilotage',
  outil:      'Outil complémentaire',
  index:      'Sommaire',
};

const MATIERES = {
  'maths':            'Mathématiques',
  'francais':         'Français',
  'physique-chimie':  'Physique-Chimie',
  'svt':              'SVT',
  'histoire-geo':     'Histoire-Géographie',
  'emc':              'EMC',
  'anglais-lv1':      'Anglais (LV1)',
  'espagnol-lv2':     'Espagnol (LV2)',
  'pilotage':         'Pilotage',
};

/* ── Front-matter (sous-ensemble YAML : scalaires + listes) ────────────── */
function lireFrontMatter(brut) {
  if (!brut.startsWith('---')) return { meta: {}, corps: brut };
  const fin = brut.indexOf('\n---', 3);
  if (fin === -1) return { meta: {}, corps: brut };
  const bloc = brut.slice(4, fin);
  const corps = brut.slice(brut.indexOf('\n', fin + 1) + 1);
  const meta = {};
  let cleListe = null;
  for (const ligne of bloc.split('\n')) {
    if (!ligne.trim() || ligne.trim().startsWith('#')) continue;
    const item = ligne.match(/^\s+-\s+(.*)$/);
    if (item && cleListe) { meta[cleListe].push(deciter(item[1])); continue; }
    const paire = ligne.match(/^([A-Za-zÀ-ÿ0-9_-]+)\s*:\s*(.*)$/);
    if (!paire) continue;
    const [, cle, valeur] = paire;
    if (valeur.trim() === '') { cleListe = cle; meta[cle] = []; }
    else { cleListe = null; meta[cle] = deciter(valeur.trim()); }
  }
  return { meta, corps };
}
const deciter = (v) => v.replace(/^["'](.*)["']$/, '$1').trim();
const echapper = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/* ── Markdown ───────────────────────────────────────────────────────────── */
// breaks: true → une ligne écrite = une ligne affichée. C'est la règle de
// lisibilité du projet : on n'écrit jamais une phrase coupée en deux lignes.
const md = new MarkdownIt({ html: true, breaks: true, linkify: false, typographer: true })
  .use(attrs)
  .use(deflist);

// Blocs sémantiques : ::: definition Titre optionnel
for (const [nom, def] of Object.entries(BLOCS)) {
  md.use(container, nom, {
    render(tokens, idx) {
      if (tokens[idx].nesting !== 1) return '</div>\n';
      const suffixe = tokens[idx].info.trim().slice(nom.length).trim();
      const titre = suffixe ? `${def.libelle} : ${echapper(suffixe)}` : def.libelle;
      return `<div class="bloc ${def.classe}">\n`
           + `<p class="bloc-titre"><span class="picto" aria-hidden="true">${def.picto}</span>`
           + `<span>${titre}</span></p>\n`;
    },
  });
}

// ::: exercice 3 | entrainement | 10 min
md.use(container, 'exercice', {
  render(tokens, idx) {
    if (tokens[idx].nesting !== 1) return '</section>\n';
    const args = tokens[idx].info.trim().slice('exercice'.length).split('|').map((s) => s.trim());
    const num = args[0] || '';
    const cle = (args[1] || 'application').toLowerCase().replace(/[^a-z]/g, '');
    const niveau = NIVEAUX_EX[cle] || NIVEAUX_EX.application;
    const duree = args[2] || '';
    // 4e argument : le support attendu. « main » pour les exercices faits en
    // autonomie (travail de l'écriture), « ecran » pour ceux faits à deux.
    const support = (args[3] || '').toLowerCase();
    const badgeSupport = support === 'main'
      ? '<span class="exercice-support support-main">✍️ à la main</span>'
      : (support === 'ecran' ? '<span class="exercice-support support-ecran">💻 sur écran</span>' : '');
    return `<section class="exercice">\n<div class="exercice-entete">`
         + `<span class="exercice-num">Exercice ${echapper(num)}</span>`
         + `<span class="exercice-niveau niveau-${cle}">${niveau}</span>`
         + badgeSupport
         + (duree ? `<span class="exercice-duree">⏱️ ${echapper(duree)}</span>` : '')
         + `</div>\n`;
  },
});

// ::: corrige   → dépliable à l'écran, toujours déplié à l'impression
md.use(container, 'corrige', {
  render(tokens, idx) {
    if (tokens[idx].nesting !== 1) return '</div>\n</details>\n';
    const suffixe = tokens[idx].info.trim().slice('corrige'.length).trim();
    return `<details class="corrige" open>\n<summary>Corrigé détaillé`
         + (suffixe ? ` : ${echapper(suffixe)}` : '') + `</summary>\n<div class="corrige-corps">\n`;
  },
});

// ::: etapes  → liste ordonnée en pastilles numérotées
md.use(container, 'etapes', {
  render(tokens, idx) {
    if (tokens[idx].nesting !== 1) return '</div><!--env-->\n';
    return '<div class="enveloppe-etapes">\n';
  },
});

// ::: frise : conteneur simple pour une frise SVG
md.use(container, 'frise', {
  render: (tokens, idx) => (tokens[idx].nesting === 1 ? '<div class="frise">\n' : '</div>\n'),
});

// ::: formule-cle → encadré central
md.use(container, 'formule-cle', {
  render(tokens, idx) {
    return tokens[idx].nesting === 1 ? '<div class="formule-cle">\n' : '</div>\n';
  },
});

// ::: motscles / ::: echelle / ::: cartes / ::: cocher → listes stylées
for (const nom of ['motscles', 'echelle', 'cartes', 'cocher', 'grille', 'panorama', 'chiffres']) {
  md.use(container, nom, {
    render(tokens, idx) {
      return tokens[idx].nesting === 1
        ? `<div class="enveloppe-${nom}">\n`
        : '</div><!--env-->\n';
    },
  });
}

// ::: reponse 5 → lignes vierges à remplir au stylo
md.use(container, 'reponse', {
  render(tokens, idx) {
    if (tokens[idx].nesting !== 1) return '</div>\n';
    const n = parseInt(tokens[idx].info.trim().slice('reponse'.length), 10) || 4;
    return `<div class="lignes-reponse" aria-label="Zone de réponse">\n${'<span></span>\n'.repeat(n)}`;
  },
});

// ::: saut → saut de page à l'impression
md.use(container, 'saut', {
  render: (tokens, idx) => (tokens[idx].nesting === 1 ? '<div class="saut-page"></div>\n' : ''),
});

/* ── Normalisation de l'imbrication des conteneurs ─────────────────────
   markdown-it-container exige que le conteneur EXTÉRIEUR ouvre avec plus de
   deux-points que l'intérieur. Plutôt que d'imposer cette règle à la rédaction
   (source d'erreurs silencieuses), on la recalcule automatiquement : chaque
   conteneur reçoit 3 + (profondeur de ses enfants) deux-points.
   On peut donc écrire `:::` partout dans le Markdown.                       */
const NOMS_CONTENEURS = new Set([
  ...Object.keys(BLOCS),
  'exercice', 'corrige', 'etapes', 'formule-cle', 'frise',
  'motscles', 'echelle', 'cartes', 'cocher', 'grille', 'panorama', 'chiffres',
  'reponse', 'saut',
]);

function normaliserConteneurs(corps) {
  const lignes = corps.split('\n');
  const pile = [];
  const noeuds = [];
  let dansFence = false;

  for (let i = 0; i < lignes.length; i += 1) {
    const ligne = lignes[i];
    if (/^\s*(```|~~~)/.test(ligne)) { dansFence = !dansFence; continue; }
    if (dansFence) continue;

    const ouvre = ligne.match(/^(:{3,})\s*([a-zA-Z][a-zA-Z0-9-]*)(\s.*)?$/);
    if (ouvre && NOMS_CONTENEURS.has(ouvre[2].toLowerCase())) {
      const noeud = { ouverture: i, fermeture: -1, hauteur: 0, hauteurEnfants: 0 };
      pile.push(noeud);
      noeuds.push(noeud);
      continue;
    }
    if (/^:{3,}\s*$/.test(ligne) && pile.length) {
      const noeud = pile.pop();
      noeud.fermeture = i;
      noeud.hauteur = noeud.hauteurEnfants;
      if (pile.length) {
        const parent = pile[pile.length - 1];
        parent.hauteurEnfants = Math.max(parent.hauteurEnfants, noeud.hauteur + 1);
      }
    }
  }

  for (const noeud of noeuds) {
    if (noeud.fermeture === -1) {
      console.warn(`   ⚠️  conteneur non fermé ligne ${noeud.ouverture + 1}`);
      continue;
    }
    const marque = ':'.repeat(3 + noeud.hauteur);
    lignes[noeud.ouverture] = lignes[noeud.ouverture].replace(/^:{3,}/, marque);
    lignes[noeud.fermeture] = marque;
  }
  return lignes.join('\n');
}

/* ── Post-traitement : applique les classes aux listes enveloppées ────── */
function appliquerClassesListes(html) {
  return html
    .replace(/<div class="enveloppe-etapes">\s*<ol>/g, '<ol class="etapes">')
    .replace(/<div class="enveloppe-motscles">\s*<ul>/g, '<ul class="motscles">')
    .replace(/<div class="enveloppe-echelle">\s*<ul>/g, '<ul class="echelle">')
    .replace(/<div class="enveloppe-cartes">\s*<ul>/g, '<ul class="cartes">')
    .replace(/<div class="enveloppe-cocher">\s*<ul>/g, '<ul class="cocher">')
    .replace(/<div class="enveloppe-panorama">\s*<ul>/g, '<ul class="panorama">')
    .replace(/<div class="enveloppe-chiffres">\s*<ul>/g, '<ul class="chiffres">')
    .replace(/<div class="enveloppe-grille">\s*<table>/g, '<table class="grille">')
    // On ne supprime QUE les fermetures d'enveloppe dont l'ouverture a été absorbée
    // par la liste ou le tableau ci-dessus. Les autres gardent leur </div>.
    .replace(/<\/(ol|ul|table)>\s*<\/div><!--env-->/g, '</$1>')
    .replace(/<!--env-->/g, '');
}

/* ── Gabarit HTML ───────────────────────────────────────────────────────── */
function gabarit({ meta, contenu, profondeur, chemin }) {
  const matiere = meta.matiere || 'pilotage';
  const typeDoc = TYPES_DOC[meta.type] || TYPES_DOC.pilotage;
  const versRacine = '../'.repeat(profondeur) || './';
  const filAriane = [
    MATIERES[matiere] || matiere,
    meta.lecon ? `Leçon ${meta.lecon}` : null,
  ].filter(Boolean).join(' · ');

  const meta_items = [
    meta.duree ? `⏱️ ${echapper(meta.duree)}` : null,
    meta.niveau ? `📚 ${echapper(meta.niveau)}` : '📚 Classe de 4ᵉ',
    Array.isArray(meta.competences) && meta.competences.length
      ? `🧩 ${meta.competences.map(echapper).join(' · ')}` : null,
  ].filter(Boolean).map((t) => `<li>${t}</li>`).join('');

  const objectifs = Array.isArray(meta.objectifs) && meta.objectifs.length
    ? `<div class="bloc bloc-objectif">
<p class="bloc-titre"><span class="picto" aria-hidden="true">🎯</span><span>Objectif${meta.objectifs.length > 1 ? 's' : ''} de cette fiche</span></p>
<ul>${meta.objectifs.map((o) => `<li>${md.renderInline(o)}</li>`).join('')}</ul>
</div>` : '';

  return `<!DOCTYPE html>
<html lang="fr" data-matiere="${echapper(matiere)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${echapper(meta.titre || 'Support de cours')} : ${typeDoc}</title>
<meta name="description" content="${echapper(meta.resume || `${typeDoc} · ${filAriane} · classe de 4ᵉ`)}">
<link rel="stylesheet" href="${versRacine}theme/cours.css">
</head>
<body>
<main class="page">
<header class="fiche-entete">
  <p class="fiche-fil">${echapper(filAriane)}</p>
  <h1>${echapper(meta.titre || 'Support de cours')}</h1>
  <p><span class="fiche-type">${typeDoc}</span></p>
  ${meta.resume ? `<p>${md.renderInline(meta.resume)}</p>` : ''}
  ${meta_items ? `<ul class="fiche-meta">${meta_items}</ul>` : ''}
</header>
${objectifs}
${contenu}
<footer class="fiche-pied">
  <span>Sterenn · Classe de 4ᵉ · ${echapper(MATIERES[matiere] || matiere)}</span>
  <span>${typeDoc}</span>
</footer>
</main>
</body>
</html>
`;
}

/* ── Parcours des fichiers ──────────────────────────────────────────────── */
function parcourir(dossier, liste = []) {
  if (!fs.existsSync(dossier)) return liste;
  for (const entree of fs.readdirSync(dossier, { withFileTypes: true })) {
    const complet = path.join(dossier, entree.name);
    if (entree.isDirectory()) parcourir(complet, liste);
    else if (entree.name.endsWith('.md')) liste.push(complet);
  }
  return liste;
}

function copierDossier(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entree of fs.readdirSync(src, { withFileTypes: true })) {
    const a = path.join(src, entree.name);
    const b = path.join(dest, entree.name);
    if (entree.isDirectory()) copierDossier(a, b);
    else fs.copyFileSync(a, b);
  }
}

/* ── Exécution ──────────────────────────────────────────────────────────── */
fs.rmSync(SORTIE, { recursive: true, force: true });
fs.mkdirSync(SORTIE, { recursive: true });
copierDossier(path.join(RACINE, 'theme'), path.join(SORTIE, 'theme'));
copierDossier(path.join(RACINE, 'site'), path.join(SORTIE, 'site'));

const fiches = [];
let avertissements = 0;
for (const dossier of DOSSIERS_CONTENU) {
  for (const fichier of parcourir(path.join(RACINE, dossier))) {
    const relatif = path.relative(RACINE, fichier);
    const brut = fs.readFileSync(fichier, 'utf8');
    const { meta, corps } = lireFrontMatter(brut);
    const profondeur = relatif.split(path.sep).length - 1;
    const html = gabarit({
      meta,
      contenu: appliquerClassesListes(md.render(normaliserConteneurs(corps))),
      profondeur,
      chemin: relatif,
    });
    const cible = path.join(SORTIE, relatif.replace(/\.md$/, '.html'));
    fs.mkdirSync(path.dirname(cible), { recursive: true });
    fs.writeFileSync(cible, html);

    // Garde-fou : un front-matter incomplet ou abîmé doit être visible tout de
    // suite, pas découvert plus tard dans un sommaire qui affiche des chemins.
    const manquants = ['type', 'matiere', 'titre'].filter((c) => !meta[c]);
    if (manquants.length) {
      console.warn(`   ⚠️  ${relatif} : front-matter incomplet : ${manquants.join(', ')}`);
      avertissements += 1;
    }
    for (const [cle, valeur] of Object.entries(meta)) {
      if (typeof valeur === 'string' && /\s[a-z_-]+:\s/.test(valeur)) {
        console.warn(`   ⚠️  ${relatif} : la clé « ${cle} » semble avoir absorbé la ligne suivante`);
        avertissements += 1;
      }
    }

    fiches.push({ relatif, meta });
  }
}

fs.writeFileSync(
  path.join(SORTIE, 'fiches.json'),
  JSON.stringify(fiches, null, 2),
);

/* ── Sommaire général (public/index.html) ───────────────────────────────── */
const ORDRE_MATIERES = [
  'maths', 'francais', 'physique-chimie', 'svt',
  'histoire-geo', 'emc', 'anglais-lv1', 'espagnol-lv2',
];
const ORDRE_DOCS = ['cours', 'revision', 'exercices', 'evaluation'];
const PICTO_DOC = { cours: '📘', revision: '🧠', exercices: '✍️', evaluation: '📊' };
const LIBELLE_DOC = { cours: 'Cours', revision: 'Révision', exercices: 'Exercices', evaluation: 'Grille' };

function construireSommaire() {
  const pilotage = fiches.filter((f) => f.relatif.startsWith('00-pilotage'));
  const outils = fiches.filter((f) => f.relatif.startsWith('outils'));
  const lecons = new Map();     // 'matiere/L01-slug' → { matiere, ref, titre, docs }

  for (const fiche of fiches) {
    const parts = fiche.relatif.split(path.sep);
    if (parts[0] !== 'matieres' || parts.length < 4) continue;
    const [, matiere, dossier] = parts;
    const cle = `${matiere}/${dossier}`;
    if (!lecons.has(cle)) {
      lecons.set(cle, { matiere, dossier, ref: fiche.meta.lecon || dossier.split('-')[0], titre: '', docs: {} });
    }
    const lecon = lecons.get(cle);
    lecon.docs[fiche.meta.type] = fiche.relatif.replace(/\.md$/, '.html').split(path.sep).join('/');
    if (fiche.meta.type === 'cours' && fiche.meta.titre) lecon.titre = fiche.meta.titre;
    if (!lecon.titre && fiche.meta.titre) lecon.titre = fiche.meta.titre.replace(/  : .*$/, '');
  }

  const sections = [];
  for (const matiere of ORDRE_MATIERES) {
    const liste = [...lecons.values()]
      .filter((l) => l.matiere === matiere)
      .sort((a, b) => a.dossier.localeCompare(b.dossier, 'fr'));
    if (!liste.length) continue;
    const lignes = liste.map((l) => {
      const liens = ORDRE_DOCS
        .map((t) => (l.docs[t]
          ? `<a href="${l.docs[t]}">${PICTO_DOC[t]} ${LIBELLE_DOC[t]}</a>`
          : `<span class="manquant">${PICTO_DOC[t]} ${LIBELLE_DOC[t]}</span>`))
        .join('');
      const complet = ORDRE_DOCS.every((t) => l.docs[t]);
      return `<li class="lecon${complet ? ' lecon-complete' : ''}">
<p class="lecon-titre"><span class="lecon-ref">${echapper(l.ref)}</span> ${echapper(l.titre || l.dossier)}</p>
<p class="lecon-liens">${liens}</p></li>`;
    }).join('\n');
    sections.push(`<section data-matiere="${matiere}">
<h2>${MATIERES[matiere]}</h2>
<ul class="lecons">\n${lignes}\n</ul>
</section>`);
  }

  const bloc = (titre, liste) => (liste.length ? `<section data-matiere="pilotage">
<h2>${titre}</h2>
<ul class="cartes">${liste.map((f) => `<li><a href="${f.relatif.replace(/\.md$/, '.html').split(path.sep).join('/')}"><strong>${echapper(f.meta.titre || f.relatif)}</strong><span>${echapper(f.meta.resume || '')}</span></a></li>`).join('')}</ul>
</section>` : '');

  return `<!DOCTYPE html>
<html lang="fr" data-matiere="pilotage">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cours de 4ᵉ : Sommaire</title>
<link rel="stylesheet" href="theme/cours.css">
</head>
<body>
<main class="page">
<header class="fiche-entete">
  <p class="fiche-fil">Sterenn · Classe de 4ᵉ</p>
  <h1>Sommaire des supports de cours</h1>
  <p>Tous les documents de l'année, classés par matière. Chaque leçon comporte quatre documents : cours, révision, exercices corrigés et grille d'évaluation.</p>
  <ul class="fiche-meta"><li>📚 ${lecons.size} leçon(s) commencée(s)</li><li>📄 ${fiches.length} document(s)</li></ul>
  <p><a class="fiche-type" style="text-decoration:none" href="site/index.html">🌐 Ouvrir le portail de cours</a></p>
</header>
${bloc('Pilotage', pilotage)}
${sections.join('\n')}
${bloc('Outils complémentaires', outils)}
<footer class="fiche-pied"><span>Sterenn · Classe de 4ᵉ</span><span>Sommaire général</span></footer>
</main>
</body>
</html>
`;
}

fs.writeFileSync(path.join(SORTIE, 'index.html'), construireSommaire());

/* ── Données du site : programme + disponibilité des documents ──────────── */
const FICHIERS_DOC = {
  cours: '1-cours', revision: '2-revision',
  exercices: '3-exercices', evaluation: '4-evaluation',
};

function construireDonneesSite() {
  const source = path.join(RACINE, '00-pilotage', 'programme.json');
  if (!fs.existsSync(source)) {
    console.warn('   ⚠️  00-pilotage/programme.json introuvable : données du site non générées');
    return 0;
  }
  const programme = JSON.parse(fs.readFileSync(source, 'utf8'));
  const attendus = new Set();
  let incomplets = 0;

  for (const m of programme.matieres) {
    for (const l of m.lecons) {
      attendus.add(`${m.id}/${l.dossier}`);
      l.docs = Object.entries(FICHIERS_DOC)
        .filter(([, fichier]) => fs.existsSync(
          path.join(RACINE, 'matieres', m.id, l.dossier, `${fichier}.md`),
        ))
        .map(([type]) => type);
      if (l.docs.length > 0 && l.docs.length < 4) incomplets += 1;
    }
  }

  // Un dossier de leçon présent sur le disque mais absent du programme est une
  // dérive silencieuse : il n'apparaîtrait nulle part dans le site.
  for (const m of programme.matieres) {
    const dossierMatiere = path.join(RACINE, 'matieres', m.id);
    if (!fs.existsSync(dossierMatiere)) continue;
    for (const e of fs.readdirSync(dossierMatiere, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      if (!attendus.has(`${m.id}/${e.name}`)) {
        console.warn(`   ⚠️  matieres/${m.id}/${e.name} n'est pas déclaré dans 00-pilotage/programme.json`);
        avertissements += 1;
      }
    }
  }

  const cible = path.join(SORTIE, 'site', 'data', 'programme.js');
  fs.mkdirSync(path.dirname(cible), { recursive: true });
  fs.writeFileSync(cible,
    '/* Généré par build/build.mjs : ne pas modifier à la main. */\n'
    + 'window.PROGRAMME = ' + JSON.stringify(programme, null, 2) + ';\n');

  const prets = programme.matieres.reduce((n, m) =>
    n + m.lecons.filter((l) => l.docs.length === 4).length, 0);
  const total = programme.matieres.reduce((n, m) => n + m.lecons.length, 0);
  console.log(`   🌐 site : ${prets}/${total} leçons complètes` + (incomplets ? `, ${incomplets} partielle(s)` : ''));
  return programme;
}

const programmeSite = construireDonneesSite();

/* ── Dossiers complets par matière (un seul document imprimable) ────────── */
function construireDossiersMatiere(programme) {
  if (!programme) return 0;
  const dossierSortie = path.join(SORTIE, 'dossiers');
  fs.mkdirSync(dossierSortie, { recursive: true });
  let produits = 0;

  for (const m of programme.matieres) {
    const lecons = m.lecons.filter((l) => l.docs.length > 0);
    if (!lecons.length) continue;

    const sommaire = lecons.map((l) => {
      const manquants = 4 - l.docs.length;
      return `<li><span class="puce-ref">${echapper(l.ref)}</span> ${echapper(l.titre)}`
        + (manquants ? ` <span class="discret">(${manquants} document(s) à venir)</span>` : '')
        + '</li>';
    }).join('');

    let corps = `<header class="fiche-entete">
  <p class="fiche-fil">Classe de 4ᵉ</p>
  <h1>${echapper(m.nom)} : dossier complet</h1>
  <p><span class="fiche-type">Cours · Révision · Exercices · Évaluation</span></p>
  <ul class="fiche-meta"><li>📚 ${lecons.length} leçon(s) sur ${m.lecons.length}</li><li>⏱️ ${echapper(m.horaire)}</li></ul>
</header>
<div class="bloc bloc-plan">
  <p class="bloc-titre"><span class="picto" aria-hidden="true">🧭</span><span>Les thèmes officiels</span></p>
  <ul>${m.themes.map((t) => `<li>${echapper(t)}</li>`).join('')}</ul>
</div>
<div class="bloc bloc-retenir">
  <p class="bloc-titre"><span class="picto" aria-hidden="true">🧠</span><span>Attendus de fin d'année</span></p>
  <ul>${m.attendus.map((a) => `<li>${echapper(a)}</li>`).join('')}</ul>
</div>
<h2>Leçons contenues dans ce dossier</h2>
<ul class="sommaire-dossier">${sommaire}</ul>
`;

    for (const l of lecons) {
      for (const [type, fichier] of Object.entries(FICHIERS_DOC)) {
        if (!l.docs.includes(type)) continue;
        const source = path.join(RACINE, 'matieres', m.id, l.dossier, `${fichier}.md`);
        const { meta, corps: brut } = lireFrontMatter(fs.readFileSync(source, 'utf8'));
        corps += `<section class="doc-dossier saut-page">
<p class="doc-fil"><span class="puce-ref">${echapper(l.ref)}</span> ${echapper(l.titre)}</p>
<h2>${echapper(meta.titre || l.titre)}</h2>
<p><span class="fiche-type">${TYPES_DOC[type] || type}</span></p>
${appliquerClassesListes(md.render(normaliserConteneurs(brut)))}
</section>`;
      }
    }

    const page = `<!DOCTYPE html>
<html lang="fr" data-matiere="${m.id}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${echapper(m.nom)} : dossier complet de 4ᵉ</title>
<link rel="stylesheet" href="../theme/cours.css">
</head>
<body>
<main class="page">
${corps}
<footer class="fiche-pied"><span>Sterenn · Classe de 4ᵉ</span><span>${echapper(m.nom)} : dossier complet</span></footer>
</main>
</body>
</html>
`;
    fs.writeFileSync(path.join(dossierSortie, `${m.id}.html`), page);
    produits += 1;
  }

  console.log(`   📚 ${produits} dossier(s) complet(s) par matière dans public/dossiers/`);
  return produits;
}

construireDossiersMatiere(programmeSite);

/* ── Vérification des liens internes ────────────────────────────────────── */
function verifierLiens() {
  const pages = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name !== 'pdf') walk(p); }
      else if (e.name.endsWith('.html')) pages.push(p);
    }
  })(SORTIE);

  let casses = 0;
  for (const page of pages) {
    const html = fs.readFileSync(page, 'utf8');
    for (const m of html.matchAll(/href="([^"#][^"]*)"/g)) {
      const lien = m[1];
      if (/^(https?:|mailto:)/.test(lien)) continue;
      const cible = path.resolve(path.dirname(page), lien.split('#')[0]);
      if (!fs.existsSync(cible)) {
        console.warn(`   ⚠️  lien cassé dans ${path.relative(SORTIE, page)} → ${lien}`);
        casses += 1;
      }
    }
  }
  return casses;
}

const liensCasses = verifierLiens();

console.log(`✅ ${fiches.length} fiche(s) générée(s) dans public/ (+ sommaire)`);
if (avertissements || liensCasses) {
  console.error(`❌ ${avertissements} avertissement(s) de front-matter, ${liensCasses} lien(s) cassé(s), corrige avant de committer.`);
  process.exitCode = 1;
}
