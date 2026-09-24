/**
 * build.mjs : Markdown → HTML pour les supports de cours de Sterenn.
 *
 * Zéro style en ligne : tout le rendu passe par le design system
 * (theme/cours.css) et par un jeu fermé de conteneurs `:::`.
 * Objectif : une syntaxe = un bloc visuel, toujours le même,
 * avec pictogramme + libellé + couleur (redondance du sens).
 */
import fs from 'node:fs';
import { verifierForme } from './verifier.mjs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import attrs from 'markdown-it-attrs';
import deflist from 'markdown-it-deflist';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SORTIE = path.join(RACINE, 'public');
const DOSSIERS_CONTENU = ['00-pilotage', 'matieres', 'outils'];

/* ── Pictogrammes des blocs ────────────────────────────────────────────────
   Dessinés au trait, et posés en SVG *en clair* dans la page : un emoji change
   de dessin d'un appareil à l'autre, ne suit pas la couleur du texte, et
   s'imprime mal. Le tracé est inséré tel quel plutôt que par référence, pour
   que les pages autonomes et les PDF n'aient besoin d'aucun fichier externe. */
const TRACES = {
  cible:    '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
  boussole: '<circle cx="12" cy="12" r="8.2"/><path d="M15.2 8.8 13.5 13.5 8.8 15.2 10.5 10.5Z"/>',
  sac:      '<path d="M5 8.5h14l-1 11.5a1.6 1.6 0 0 1-1.6 1.5H7.6A1.6 1.6 0 0 1 6 20Z"/><path d="M9 8.5V6a3 3 0 0 1 6 0v2.5"/>',
  livre:    '<path d="M12 6.6C10.5 5.2 8.6 4.5 6 4.5H3.5v13H6c2.6 0 4.5.7 6 2.1"/><path d="M12 6.6c1.5-1.4 3.4-2.1 6-2.1h2.5v13H18c-2.6 0-4.5.7-6 2.1"/><path d="M12 6.6v13"/>',
  formule:  '<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M7.5 8h9M7.5 12h4M7.5 16h4M14.5 12v4M12.5 14h4"/>',
  ampoule:  '<path d="M9.2 16.5a6 6 0 1 1 5.6 0"/><path d="M9.5 18.5h5M10.2 21h3.6"/><path d="M12 10v6.5"/>',
  alerte:   '<path d="M12 3.8 21 19.5H3Z"/><path d="M12 9.8v4.4"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/>',
  cerveau:  '<path d="M12 5.2a3.2 3.2 0 0 0-5.8 1.4A3 3 0 0 0 4.6 11a3 3 0 0 0 1.5 4.3 3.1 3.1 0 0 0 5.9 1.1"/><path d="M12 5.2a3.2 3.2 0 0 1 5.8 1.4A3 3 0 0 1 19.4 11a3 3 0 0 1-1.5 4.3 3.1 3.1 0 0 1-5.9 1.1"/><path d="M12 5.2v14.2"/>',
  outils:   '<path d="M14.5 6.2a3.6 3.6 0 0 1 4.8 4.6l-9 9-4.6-4.6 9-9Z"/><path d="M4 20l1.7-4.6"/><path d="M12.8 7.9l3.3 3.3"/>',
  bouee:    '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="3.4"/><path d="M6.2 6.2l3.4 3.4M17.8 6.2l-3.4 3.4M6.2 17.8l3.4-3.4M17.8 17.8l-3.4-3.4"/>',
  pause:    '<path d="M20 11.5a8 8 0 1 1-2.4-5.7"/><path d="M20.5 3.5v4.6h-4.6"/>',
  info:     '<circle cx="12" cy="12" r="8.2"/><path d="M12 11v5.2"/><circle cx="12" cy="8" r="1" fill="currentColor" stroke="none"/>',
  horloge:  '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
  main:     '<path d="M16.1 3.9a2.2 2.2 0 0 1 3.1 3.1L8.3 17.9 4 19.3l1.4-4.3Z"/><path d="M14.4 5.6 17.6 8.8"/>',
  ecran:    '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M8.5 20.5h7M12 16.5v4"/>',
  son:      '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5Z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/>',
};
const picto = (nom) => '<svg class="ic-bloc" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'
  + TRACES[nom] + '</svg>';

/* ── Lexique FIXE des blocs (picto + libellé + classe) ─────────────────── */
const BLOCS = {
  objectif:   { picto: picto('cible'),    libelle: 'Objectif',            classe: 'bloc-objectif' },
  plan:       { picto: picto('boussole'), libelle: 'Plan de la fiche',    classe: 'bloc-plan' },
  materiel:   { picto: picto('sac'),      libelle: 'Ce dont tu as besoin',classe: 'bloc-materiel' },
  definition: { picto: picto('livre'),    libelle: 'Définition',          classe: 'bloc-definition' },
  formule:    { picto: picto('formule'),  libelle: 'Formule à connaître', classe: 'bloc-formule' },
  exemple:    { picto: picto('ampoule'),  libelle: 'Exemple guidé',       classe: 'bloc-exemple' },
  piege:      { picto: picto('alerte'),   libelle: 'Piège à éviter',      classe: 'bloc-piege' },
  retenir:    { picto: picto('cerveau'),  libelle: 'À retenir',           classe: 'bloc-retenir' },
  methode:    { picto: picto('outils'),   libelle: 'Méthode pas à pas',   classe: 'bloc-methode' },
  aide:       { picto: picto('bouee'),    libelle: 'Coup de pouce',       classe: 'bloc-aide' },
  pause:      { picto: picto('pause'),    libelle: 'Pause conseillée',    classe: 'bloc-pause' },
  info:       { picto: picto('info'),     libelle: 'Bon à savoir',        classe: 'bloc-info' },
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
  curiosite:  'Fiche curiosité',
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

// ::: audio en-GB Titre optionnel  → script d'écoute, lu à voix haute par le
// navigateur dans la langue indiquée (bouton branché par lecteur.js). Le texte
// reste lisible et imprimable : la transcription est le document lui-même.
md.use(container, 'audio', {
  render(tokens, idx) {
    if (tokens[idx].nesting !== 1) return '</div>\n</div>\n';
    const args = tokens[idx].info.trim().slice('audio'.length).trim();
    const m = args.match(/^([a-z]{2}(?:-[A-Z]{2})?)\s*(.*)$/);
    const langue = m ? m[1] : 'fr-FR';
    const titre = m && m[2] ? m[2] : 'Script à écouter';
    return `<div class="bloc bloc-audio" data-audio-langue="${echapper(langue)}">\n`
         + `<p class="bloc-titre"><span class="picto" aria-hidden="true">${picto('son')}</span>`
         + `<span>Écoute : ${echapper(titre)}</span>`
         + `<button type="button" class="audio-ecouter" data-ecouter="${echapper(langue)}" aria-pressed="false">Écouter</button></p>\n`
         + `<div class="audio-script" lang="${echapper(langue.slice(0, 2))}">\n`;
  },
});

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
      ? `<span class="exercice-support support-main">${picto('main')} à la main</span>`
      : (support === 'ecran' ? `<span class="exercice-support support-ecran">${picto('ecran')} sur écran</span>` : '');
    return `<section class="exercice">\n<div class="exercice-entete">`
         + `<span class="exercice-num">Exercice ${echapper(num)}</span>`
         + `<span class="exercice-niveau niveau-${cle}">${niveau}</span>`
         + badgeSupport
         + (duree ? `<span class="exercice-duree">${picto('horloge')} ${echapper(duree)}</span>` : '')
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
      avertissements += 1;
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

/* Index léger de la banque d'exercices : titre et nombre de questions par leçon.
   Le site le charge au démarrage à la place des 500 ko de la banque complète. */
function construireIndexExercices() {
  const source = path.join(RACINE, 'site', 'data', 'exercices.js');
  if (!fs.existsSync(source)) return;
  const bac = {};
  new Function('window', fs.readFileSync(source, 'utf8'))(bac);
  const index = {};
  for (const [k, v] of Object.entries(bac.EXERCICES || {})) index[k] = { titre: v.titre, n: (v.items || []).length };
  fs.mkdirSync(path.join(SORTIE, 'data'), { recursive: true });
  fs.writeFileSync(path.join(SORTIE, 'data', 'exercices-index.js'),
    '/* Généré par build/build.mjs : ne pas modifier à la main. */\nwindow.EXERCICES_INDEX = ' + JSON.stringify(index) + ';\n');
}
construireIndexExercices();

/* ── Un seul script par rôle : les modules de vue sont concaténés dans l'ordre
      de chargement. app.js charge le paquet de son rôle et n'appelle plus les
      fichiers un par un. L'empreinte de version rend le cache sûr. ────────── */
function construirePaquets() {
  const crypto = require('node:crypto');
  const lire = (f) => fs.readFileSync(path.join(RACINE, 'site', f), 'utf8');
  const paquets = {
    'paquet-eleve.js': ['lecteur.js', 'vue-eleve.js', 'messagerie.js', 'tuteur.js', 'planificateur.js'],
    'paquet-prof.js': ['lecteur.js', 'vue-prof.js', 'messagerie.js', 'planificateur.js'],
  };
  let version = '';
  for (const [nom, fichiers] of Object.entries(paquets)) {
    const corps = fichiers.map((f) => `/* ---- ${f} ---- */\n` + lire(f)).join('\n;\n') + '\nwindow.PAQUET_CHARGE = window.PAQUET_CHARGE || {};\n' + fichiers.map((f) => `window.PAQUET_CHARGE[${JSON.stringify(f)}] = true;`).join('\n') + '\n';
    fs.writeFileSync(path.join(SORTIE, nom), corps);
    version += crypto.createHash('sha1').update(corps).digest('hex').slice(0, 8);
  }
  version = crypto.createHash('sha1').update(version + lire('app.js') + lire('eleve.css') + lire('prof.css')).digest('hex').slice(0, 10);
  const index = path.join(SORTIE, 'index.html');
  fs.writeFileSync(index, fs.readFileSync(index, 'utf8').replace('<script src="app.js"></script>', `<script>window.OPALINE_VERSION = ${JSON.stringify(version)};</script>\n<script src="app.js?v=${version}"></script>`));
  fs.writeFileSync(path.join(SORTIE, 'version.json'), JSON.stringify({ version, le: new Date().toISOString() }));
  // A23 : le service worker porte la version du build dans le nom de son cache.
  const sw = path.join(SORTIE, 'sw.js');
  if (fs.existsSync(sw)) fs.writeFileSync(sw, fs.readFileSync(sw, 'utf8').replace('__VERSION__', version));
  // A42 : l'empreinte des jeux, pour savoir quelle version est en ligne.
  const jeux = ['games-2d', 'games-3d'].flatMap((d) => fs.readdirSync(path.join(RACINE, 'site', 'learning', d)).filter((f) => f.endsWith('.html')).map((f) => d + '/' + f));
  const empreinteJeux = crypto.createHash('sha1').update(jeux.map((f) => fs.readFileSync(path.join(RACINE, 'site', 'learning', f))).reduce((h, b) => h + crypto.createHash('sha1').update(b).digest('hex'), '') + fs.readFileSync(path.join(RACINE, 'site', 'learning', 'shell.js'), 'utf8')).digest('hex').slice(0, 10);
  fs.mkdirSync(path.join(SORTIE, 'learning'), { recursive: true });
  fs.writeFileSync(path.join(SORTIE, 'learning', 'version.json'), JSON.stringify({ version: empreinteJeux, jeux: jeux.length, le: new Date().toISOString() }));
  console.log(`   📦 paquets par rôle générés, version ${version}`);
}
copierDossier(path.join(RACINE, 'site'), SORTIE);

/* A24 : les fonds d'aurore en AVIF, plus une version 1 280 px pour les écrans moyens.
   Produits dans public/ seulement, à partir des JPEG de site/fond. Sans sharp, on s'en passe. */
await (async () => {
  let sharp = null;
  try { sharp = (await import('sharp')).default; } catch (e) { console.log('   🖼  sharp absent : pas de fonds AVIF'); return; }
  const dossier = path.join(RACINE, 'site', 'fond');
  const cible = path.join(SORTIE, 'fond');
  let n = 0;
  for (const f of fs.readdirSync(dossier).filter((x) => x.endsWith('.jpg'))) {
    const base = f.replace(/\.jpg$/, '');
    const src = path.join(dossier, f);
    const taches = [
      [path.join(cible, base + '.avif'), (img) => img.avif({ quality: 48, effort: 4 })],
      [path.join(cible, base + '-1280.avif'), (img) => img.resize({ width: 1280, withoutEnlargement: true }).avif({ quality: 48, effort: 4 })],
      [path.join(cible, base + '-1280.webp'), (img) => img.resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 72 })],
    ];
    for (const [sortie, transformer] of taches) {
      try { await transformer(sharp(src)).toFile(sortie); n += 1; } catch (e) { console.warn(`   ⚠️  fond ${base} : ${e.message}`); }
    }
  }
  console.log(`   🖼  ${n} fond(s) d'écran dérivés (AVIF, 1 280 px)`);
  // C86 : icônes PNG de l'application installable, dérivées du favicon SVG (192, 512, et une version « maskable » avec marge).
  try {
    const svg = fs.readFileSync(path.join(RACINE, 'site', 'favicon.svg'));
    fs.mkdirSync(path.join(SORTIE, 'icones'), { recursive: true });
    for (const t of [192, 512]) await sharp(svg, { density: 384 }).resize(t, t).png().toFile(path.join(SORTIE, 'icones', `opaline-${t}.png`));
    await sharp(svg, { density: 384 }).resize(400, 400).extend({ top: 56, bottom: 56, left: 56, right: 56, background: '#0b1a3a' }).png().toFile(path.join(SORTIE, 'icones', 'opaline-maskable-512.png'));
  } catch (e) { console.warn(`   ⚠️  icônes : ${e.message}`); }
})();
construirePaquets();

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
    // A38 : le front-matter suit un schéma : types connus, matière connue, durée au format attendu, listes non vides.
    const problemes = [];
    if (meta.type && !TYPES_DOC[meta.type]) problemes.push(`type inconnu « ${meta.type} »`);
    if (meta.matiere && !MATIERES[meta.matiere] && !['pilotage', 'outils', 'outil', 'transversal'].includes(meta.matiere)) problemes.push(`matière inconnue « ${meta.matiere} »`);
    if (meta.duree && !/\d+\s*(min|h)\b|séance/i.test(String(meta.duree))) problemes.push(`durée « ${meta.duree} » (attendu : « 45 min », « 1 h », « 3 séances de 45 min »)`);
    if (['cours', 'revision', 'exercices', 'evaluation'].includes(meta.type)) {
      if (!meta.lecon || !/^[A-Za-z]?\d{1,3}[A-Za-z]?$/.test(String(meta.lecon))) problemes.push(`référence de leçon « ${meta.lecon || ''} »`);
      if (!Array.isArray(meta.objectifs) || !meta.objectifs.length) problemes.push('objectifs vides');
      if (!Array.isArray(meta.competences) || !meta.competences.length) problemes.push('compétences vides');
    }
    if (problemes.length) {
      console.warn(`   ⚠️  ${relatif} : front-matter hors schéma : ${problemes.join(' ; ')}`);
      avertissements += 1;
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
    if (!lecon.titre && fiche.meta.titre) lecon.titre = fiche.meta.titre.replace(/ {2}: .*$/, '');
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
  <h1>Tous les documents</h1>
  <p>Tous les documents de l'année, classés par matière. Chaque leçon comporte quatre documents : cours, révision, exercices corrigés et grille d'évaluation.</p>
  <ul class="fiche-meta"><li>📚 ${lecons.size} leçon(s) commencée(s)</li><li>📄 ${fiches.length} document(s)</li></ul>
  <p><a class="fiche-type" style="text-decoration:none" href="index.html">🌐 Revenir au portail de cours</a></p>
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

fs.writeFileSync(path.join(SORTIE, 'documents.html'), construireSommaire());

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
  // Ordre logique de l'année : chaque matière liste ses leçons par période, puis
  // par référence. L'accès progressif (leçon précédente validée) et le générateur
  // d'année suivent cet ordre, pas celui de la déclaration.
  for (const m of programme.matieres) {
    m.lecons.sort((a, b) => (Number(a.periode) - Number(b.periode)) || String(a.ref).localeCompare(String(b.ref), 'fr', { numeric: true }));
  }
  const attendus = new Set();
  let incomplets = 0;

  /* Le lien avec le socle : la grille « Compétence | Critères | Domaine » de la fiche
     d'évaluation, reprise par leçon pour la vue par domaine de l'espace professeur. */
  const lireSocle = (chemin) => {
    if (!fs.existsSync(chemin)) return [];
    const texte = fs.readFileSync(chemin, 'utf8');
    const section = /## 4\. Le lien avec les compétences[\s\S]*?(?=\n## |$)/.exec(texte);
    if (!section) return [];
    const sortie = [];
    for (const ligne of section[0].split('\n')) {
      const m = /^\|\s*\*{0,2}([^|*]+?)\*{0,2}\s*\|\s*([^|]*?)\s*\|\s*(D[1-5])\b[^|]*\|/.exec(ligne);
      if (!m || /^Compétence|^---/.test(m[1].trim())) continue;
      sortie.push({ competence: m[1].trim(), criteres: m[2].split(/[,\s]+/).map(Number).filter((n) => n > 0), domaine: m[3] });
    }
    return sortie;
  };

  for (const m of programme.matieres) {
    for (const l of m.lecons) {
      l.socle = lireSocle(path.join(RACINE, 'matieres', m.id, l.dossier || '', '4-evaluation.md'));
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

  const cible = path.join(SORTIE, 'data', 'programme.js');
  fs.mkdirSync(path.dirname(cible), { recursive: true });
  fs.writeFileSync(cible,
    '/* Généré par build/build.mjs : ne pas modifier à la main. */\n'
    + 'window.PROGRAMME = ' + JSON.stringify(programme, null, 2) + ';\n');
  // A21 : la version de Sterenn se passe des attendus, thèmes et compétences (lus par le professeur seul).
  const programmeEleve = { ...programme, matieres: programme.matieres.map((m) => { const reste = { ...m }; delete reste.attendus; delete reste.themes; delete reste.competences; return reste; }) };
  fs.writeFileSync(path.join(SORTIE, 'data', 'programme-eleve.js'),
    '/* Généré par build/build.mjs : ne pas modifier à la main. */\n'
    + 'window.PROGRAMME = ' + JSON.stringify(programmeEleve) + ';\n');

  // Résumé du programme pour la tutrice Opale (fonction serveur) : matières,
  // leçons, notions. Assez pour situer une question, sans le contenu des fiches.
  const resume = programme.matieres.map((m) => ({
    id: m.id, nom: m.nom,
    lecons: m.lecons.map((l) => ({ ref: l.ref, titre: l.titre, periode: l.periode, notions: (l.notions || []).slice(0, 6) })),
  }));
  const cibleFonctions = path.join(RACINE, 'functions', '_programme.js');
  // La version du build est aussi connue des fonctions serveur (page santé).
  let versionBuild = '';
  try { versionBuild = JSON.parse(fs.readFileSync(path.join(SORTIE, 'version.json'), 'utf8')).version || ''; } catch (e) { versionBuild = ''; }
  fs.writeFileSync(cibleFonctions,
    '/* Généré par build/build.mjs à partir de 00-pilotage/programme.json : ne pas modifier à la main. */\n'
    + 'export const PROGRAMME = ' + JSON.stringify(resume) + ';\n'
    + 'export const VERSION = ' + JSON.stringify(versionBuild) + ';\n');

  const prets = programme.matieres.reduce((n, m) =>
    n + m.lecons.filter((l) => l.docs.length === 4).length, 0);
  const total = programme.matieres.reduce((n, m) => n + m.lecons.length, 0);
  console.log(`   🌐 site : ${prets}/${total} leçons complètes` + (incomplets ? `, ${incomplets} partielle(s)` : ''));
  return programme;
}

const programmeSite = construireDonneesSite();

/* ── Contenu embarqué dans le site (lecture sans ouvrir de PDF) ─────────── */
function ancrer(html) {
  // Donne un identifiant stable à chaque titre de niveau 2 et renvoie le plan,
  // qui alimente le sommaire latéral du lecteur.
  const plan = [];
  let n = 0;
  const sortie = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, contenu) => {
    n += 1;
    const id = 'p' + n;
    plan.push({ id, texte: contenu.replace(/<[^>]+>/g, '').trim() });
    return `<h2 id="${id}">${contenu}</h2>`;
  });
  return { html: sortie, plan };
}

/**
 * Retire les corrigés d'un document rendu.
 *
 * Les corrigés vivent dans un <details class="corrige"> ... </details>. On les
 * remplace par un repère neutre, pour que l'élève voie qu'un corrigé existe
 * sans pouvoir le lire. Le découpage se fait par comptage de balises, et non
 * par expression régulière : un corrigé peut contenir d'autres <details>.
 */
function retirerCorriges(html) {
  const OUVRE = '<details class="corrige" open>';
  let sortie = '';
  let reste = html;
  let retires = 0;
  for (;;) {
    const debut = reste.indexOf(OUVRE);
    if (debut === -1) { sortie += reste; break; }
    sortie += reste.slice(0, debut);
    let i = debut + OUVRE.length;
    let profondeur = 1;
    while (profondeur > 0 && i < reste.length) {
      const ouvrant = reste.indexOf('<details', i);
      const fermant = reste.indexOf('</details>', i);
      if (fermant === -1) { i = reste.length; break; }
      if (ouvrant !== -1 && ouvrant < fermant) { profondeur += 1; i = ouvrant + 8; }
      else { profondeur -= 1; i = fermant + 10; }
    }
    sortie += '<p class="corrige-cache">Corrigé disponible auprès de ton professeur.</p>';
    retires += 1;
    reste = reste.slice(i);
  }
  return { html: sortie, retires };
}

/* C99 : un énoncé sur trois relié aux univers de Sterenn. On compte, par leçon, les
   exercices qui citent au moins un mot-clé de ces univers ; le rapport est écrit dans
   public/data/univers.json et résumé à l'écran. Ce n'est pas bloquant. */
const MOTS_UNIVERS = ['maomao', 'apothicaire', 'jinshi', 'myne', 'faiseuse', 'benno', 'lutz', 'papier', 'encre', 'yuzu', 'ogre', 'ayakashi', 'aurore', 'boréal', 'feutre', 'turquoise', 'bleu indien', 'violet pastel', 'manga', 'nuancier', 'dégradé', 'cour impériale', 'remède', 'poison', 'atelier'];
function rapportUnivers(programme) {
  const rapport = {}; let exercices = 0; let relies = 0; const faibles = [];
  for (const m of programme.matieres) {
    for (const l of m.lecons) {
      if (!l.dossier) continue;
      const source = path.join(RACINE, 'matieres', m.id, l.dossier, '3-exercices.md');
      if (!fs.existsSync(source)) continue;
      const corps = lireFrontMatter(fs.readFileSync(source, 'utf8')).corps;
      const blocs = corps.split(/^::: exercice /m).slice(1);
      const total = blocs.length;
      const n = blocs.filter((b) => { const t = b.toLowerCase(); return MOTS_UNIVERS.some((mot) => t.includes(mot)); }).length;
      rapport[m.id + '/' + l.ref] = { exercices: total, relies: n };
      exercices += total; relies += n;
      if (total >= 6 && n / total < 0.2) faibles.push(`${m.id}/${l.ref} (${n}/${total})`);
    }
  }
  fs.mkdirSync(path.join(SORTIE, 'data'), { recursive: true });
  fs.writeFileSync(path.join(SORTIE, 'data', 'univers.json'), JSON.stringify({ genere_le: new Date().toISOString(), exercices, relies, lecons: rapport }, null, 1));
  console.log(`   🎨 ${relies}/${exercices} exercices reliés aux univers de Sterenn (${Math.round((relies / Math.max(1, exercices)) * 100)} %)${faibles.length ? ' ; sous 20 % : ' + faibles.length + ' leçon(s)' : ''}`);
  return faibles;
}

function construireContenuSite(programme) {
  if (!programme) return 0;
  const racineContenu = path.join(SORTIE, 'data', 'contenu');
  const racineEleve = path.join(SORTIE, 'data', 'eleve');
  fs.mkdirSync(racineContenu, { recursive: true });
  fs.mkdirSync(racineEleve, { recursive: true });
  let documents = 0;
  let corrigesRetires = 0;

  // La grille d'évaluation sert au professeur : elle n'est pas servie à l'élève.
  const RESERVE_PROF = new Set(['evaluation']);

  for (const m of programme.matieres) {
    const parLecon = {};
    const parLeconEleve = {};
    for (const l of m.lecons) {
      if (!l.docs.length) continue;
      const docs = {};
      const docsEleve = {};
      for (const [type, fichier] of Object.entries(FICHIERS_DOC)) {
        if (!l.docs.includes(type)) continue;
        const source = path.join(RACINE, 'matieres', m.id, l.dossier, `${fichier}.md`);
        const { meta, corps } = lireFrontMatter(fs.readFileSync(source, 'utf8'));
        const rendu = ancrer(appliquerClassesListes(md.render(normaliserConteneurs(corps))));
        const commun = {
          titre: meta.titre || l.titre,
          resume: meta.resume || '',
          duree: meta.duree || '',
          objectifs: Array.isArray(meta.objectifs) ? meta.objectifs : [],
          competences: Array.isArray(meta.competences) ? meta.competences : [],
          plan: rendu.plan,
        };
        docs[type] = { ...commun, html: rendu.html };
        if (!RESERVE_PROF.has(type)) {
          const sans = retirerCorriges(rendu.html);
          corrigesRetires += sans.retires;
          docsEleve[type] = { ...commun, html: sans.html };
        }
        documents += 1;
      }
      parLecon[l.ref] = docs;
      if (Object.keys(docsEleve).length) parLeconEleve[l.ref] = docsEleve;
    }
    global.CONTENU_PROF = global.CONTENU_PROF || {};
    global.CONTENU_PROF[m.id] = parLecon;
    if (!Object.keys(parLecon).length) continue;
    const entete = '/* Généré par build/build.mjs : ne pas modifier à la main. */\n'
      + 'window.CONTENU = window.CONTENU || {};\n';
    fs.writeFileSync(path.join(racineContenu, `${m.id}.js`),
      entete + `window.CONTENU[${JSON.stringify(m.id)}] = ${JSON.stringify(parLecon)};\n`);
    fs.writeFileSync(path.join(racineEleve, `${m.id}.js`),
      entete + `window.CONTENU[${JSON.stringify(m.id)}] = ${JSON.stringify(parLeconEleve)};\n`);
    // A25 : un fichier par leçon, chargé en premier par le lecteur ; le fichier par matière reste pour la recherche et la comparaison.
    fs.mkdirSync(path.join(racineContenu, m.id), { recursive: true }); fs.mkdirSync(path.join(racineEleve, m.id), { recursive: true });
    const enteteLecon = entete + `window.CONTENU[${JSON.stringify(m.id)}] = window.CONTENU[${JSON.stringify(m.id)}] || {};\n`;
    for (const [ref, docs] of Object.entries(parLecon)) fs.writeFileSync(path.join(racineContenu, m.id, `${ref}.js`), enteteLecon + `window.CONTENU[${JSON.stringify(m.id)}][${JSON.stringify(ref)}] = ${JSON.stringify(docs)};\n`);
    for (const [ref, docs] of Object.entries(parLeconEleve)) fs.writeFileSync(path.join(racineEleve, m.id, `${ref}.js`), enteteLecon + `window.CONTENU[${JSON.stringify(m.id)}][${JSON.stringify(ref)}] = ${JSON.stringify(docs)};\n`);
  }

  console.log(`   📖 ${documents} document(s) lisibles dans le site`
    + `, ${corrigesRetires} corrigé(s) retiré(s) de la version élève`);
  return documents;
}

construireContenuSite(programmeSite);

/* ── C100 : les fiches curiosité, hors programme, sans étoile, une par matière et par période ── */
function construireCuriosites() {
  const dossier = path.join(RACINE, 'outils', 'curiosites');
  if (!fs.existsSync(dossier)) return 0;
  const liste = [];
  for (const f of fs.readdirSync(dossier).filter((x) => x.endsWith('.md')).sort()) {
    const { meta, corps } = lireFrontMatter(fs.readFileSync(path.join(dossier, f), 'utf8'));
    if (meta.type !== 'curiosite') continue;
    const rendu = ancrer(appliquerClassesListes(md.render(normaliserConteneurs(corps))));
    liste.push({ id: String(meta.id || f.replace(/\.md$/, '')).replace(/[^A-Za-z0-9]/g, ''), matiere: meta.matiere, periode: Number(meta.periode) || 1, titre: meta.titre || f, resume: meta.resume || '', duree: meta.duree || '', plan: rendu.plan, html: rendu.html });
  }
  fs.mkdirSync(path.join(SORTIE, 'data'), { recursive: true });
  fs.writeFileSync(path.join(SORTIE, 'data', 'curiosites.js'), '/* Généré par build/build.mjs : ne pas modifier à la main. */\nwindow.CURIOSITES = ' + JSON.stringify(liste) + ';\n');
  console.log(`   🔭 ${liste.length} fiche(s) curiosité`);
  return liste.length;
}
construireCuriosites();

/* ── Sujets d'évaluation : un fichier par leçon, servi par le serveur selon
      l'accès décidé par le professeur (functions/_middleware.js) ────────────── */
function extraireSection(html, motif) {
  const debut = html.search(motif);
  if (debut === -1) return '';
  const suite = html.slice(debut);
  const fin = suite.slice(1).search(/<h2 id="/);
  return fin === -1 ? suite : suite.slice(0, fin + 1);
}
function construireEvaluations(programme) {
  if (!programme) return 0;
  const racine = path.join(SORTIE, 'data', 'evaluations');
  let n = 0;
  for (const m of programme.matieres) {
    const contenu = (global.CONTENU_PROF || {})[m.id];
    if (!contenu) continue;
    for (const l of m.lecons) {
      const docs = contenu[l.ref];
      if (!docs || !docs.exercices) continue;
      // Le sujet : la dernière partie de la fiche d'exercices si son titre parle
      // de devoir, sinon le dernier exercice (le sujet de type devoir), sans corrigé.
      const html = docs.exercices.html;
      const titres = [...html.matchAll(/<h2 id="[^"]*">([^<]*)<\/h2>/g)];
      const dernierTitre = titres.length ? titres[titres.length - 1] : null;
      let brut = '';
      if (dernierTitre && /devoir/i.test(dernierTitre[1])) brut = html.slice(dernierTitre.index);
      else {
        const secs = [...html.matchAll(/<section class="exercice">[\s\S]*?<\/section>/g)];
        const derniere = secs.length ? secs[secs.length - 1] : null;
        if (derniere) {
          const avant = html.slice(0, derniere.index);
          const cond = /<div class="bloc bloc-info">(?:(?!<\/div>)[\s\S])*<\/div>\s*$/.exec(avant);
          brut = (cond ? cond[0] : '') + derniere[0];
        }
      }
      const sujet = retirerCorriges(brut).html;
      // Les attentes : la grille des critères de la fiche d'évaluation.
      const criteres = docs.evaluation ? extraireSection(docs.evaluation.html, /<h2 id="[^"]*">3\. La grille/) : '';
      if (!sujet) continue;
      const dossier = path.join(racine, m.id);
      fs.mkdirSync(dossier, { recursive: true });
      fs.writeFileSync(path.join(dossier, `${l.ref}.js`),
        '/* Généré par build/build.mjs : ne pas modifier à la main. */\n'
        + 'window.EVALUATIONS = window.EVALUATIONS || {};\n'
        + `window.EVALUATIONS[${JSON.stringify(m.id + '/' + l.ref)}] = ${JSON.stringify({ titre: docs.exercices.titre, sujet, criteres })};\n`);
      n += 1;
    }
  }
  console.log(`   📝 ${n} sujet(s) d'évaluation générés dans public/data/evaluations/`);
  return n;
}
construireEvaluations(programmeSite);

/* ── Cahiers à imprimer : les exercices « à la main » d'une leçon, sans corrigé,
      sur une seule page imprimable ─────────────────────────────────────────── */
function construireCahiers(programme) {
  if (!programme) return 0;
  const racine = path.join(SORTIE, 'cahiers');
  let n = 0;
  for (const m of programme.matieres) {
    const contenu = (global.CONTENU_PROF || {})[m.id];
    if (!contenu) continue;
    for (const l of m.lecons) {
      const docs = contenu[l.ref];
      if (!docs || !docs.exercices) continue;
      const html = retirerCorriges(docs.exercices.html).html;
      const sections = [];
      const re = /<section class="exercice">[\s\S]*?<\/section>/g;
      let t;
      while ((t = re.exec(html))) {
        if (!t[0].includes('support-main')) continue;
        // Sur papier, pas de renvoi au corrigé : l'espace de réponse suffit.
        // Un script d'écoute ne s'imprime pas : on l'écoute dans le site, on écrit sur le cahier.
        sections.push(t[0].replace(/<p class="corrige-cache">[\s\S]*?<\/p>/g, '')
          .replace(/<button type="button" class="audio-ecouter"[^>]*>Écouter<\/button>/g, '')
          .replace(/<div class="audio-script"[^>]*>[\s\S]*?<\/div>\n<\/div>/g, '<div class="audio-script"><p><em>Script à écouter dans le site, avec le bouton Écouter, autant de fois que nécessaire. Le texte n\'est pas imprimé : on écrit ses réponses ici après l\'écoute.</em></p></div>\n</div>'));
      }
      if (!sections.length) continue;
      const dossier = path.join(racine, m.id);
      fs.mkdirSync(dossier, { recursive: true });
      const page = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cahier · ${echapper(l.titre)}</title>
<link rel="stylesheet" href="../../theme/cours.css">
<style>
  body { max-width: 52rem; margin: 0 auto; padding: 1.5rem 1.2rem 3rem; }
  .cahier-tete { display: flex; flex-wrap: wrap; gap: 0.6rem 1rem; align-items: center; justify-content: space-between; margin-bottom: 1.2rem; }
  .cahier-tete h1 { margin: 0; font-size: 1.5rem; }
  .cahier-tete p { margin: 0.2rem 0 0; color: var(--texte-doux); }
  .cahier-bouton { font: inherit; font-weight: 700; padding: 0.55rem 1rem; border-radius: 8px; border: 1px solid var(--trait-fort); background: var(--fond-doux); cursor: pointer; }
  .cahier-ligne { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 0 0 1rem; font-size: 0.95rem; }
  .cahier-ligne span { border-bottom: 1px solid var(--trait-fort); padding: 0.3rem 0; }
  .reponse-libre { min-height: 5.5rem; border: 1px dashed var(--trait-fort); border-radius: 6px; margin: 0.6rem 0 0; }
  .exercice { break-inside: avoid; }
  @media print { .cahier-bouton { display: none; } body { padding: 0; } }
</style>
</head>
<body class="fiche">
<header class="cahier-tete">
  <div><h1>${echapper(l.titre)}</h1><p>${echapper(m.nom)} · Cahier d'exercices à faire à la main · ${sections.length} exercice${sections.length > 1 ? 's' : ''}</p></div>
  <button class="cahier-bouton" type="button" onclick="window.print()">Imprimer ou enregistrer en PDF</button>
</header>
<div class="cahier-ligne"><span>Prénom : Sterenn</span><span>Date : </span></div>
${sections.map((x) => x.replace('</section>', '<div class="reponse-libre" aria-hidden="true"></div></section>')).join('\n')}
</body>
</html>`;
      fs.writeFileSync(path.join(dossier, `${l.ref}.html`), page);
      n += 1;
    }
  }
  console.log(`   🖨  ${n} cahier(s) à imprimer générés dans public/cahiers/`);
  return n;
}
construireCahiers(programmeSite);
if (programmeSite) rapportUnivers(programmeSite);

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
      if (e.isDirectory()) { if (e.name !== 'pdf' && e.name !== 'data') walk(p); }
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
const manquementsForme = verifierForme();
manquementsForme.forEach((m) => console.warn('   ⚠️  ' + m));
avertissements += manquementsForme.length;

/* A41 : un rapport de build, écrit dans public/ et comparé au build précédent. */
(() => {
  const poids = (rel) => { try { return fs.statSync(path.join(SORTIE, rel)).size; } catch (e) { return 0; } };
  const dossierPoids = (rel) => { try { return fs.readdirSync(path.join(SORTIE, rel)).reduce((t, f) => t + poids(rel + '/' + f), 0); } catch (e) { return 0; } };
  const rapport = {
    version: (() => { try { return JSON.parse(fs.readFileSync(path.join(SORTIE, 'version.json'), 'utf8')).version; } catch (e) { return ''; } })(),
    le: new Date().toISOString(),
    fiches: fiches.length,
    avertissements, liensCasses,
    poids: { programme: poids('data/programme.js'), paquetEleve: poids('paquet-eleve.js'), paquetProf: poids('paquet-prof.js'), contenu: dossierPoids('data/contenu'), exercices: poids('data/exercices.js'), css: poids('eleve.css') + poids('prof.css') },
  };
  fs.writeFileSync(path.join(SORTIE, 'rapport-build.json'), JSON.stringify(rapport, null, 1));
  const cache = path.join(RACINE, 'node_modules', '.cache');
  const precedent = path.join(cache, 'opaline-rapport.json');
  try {
    if (fs.existsSync(precedent)) {
      const avant = JSON.parse(fs.readFileSync(precedent, 'utf8'));
      const diffs = [];
      if (avant.fiches !== rapport.fiches) diffs.push(`fiches ${avant.fiches} → ${rapport.fiches}`);
      for (const k of Object.keys(rapport.poids)) { const d = rapport.poids[k] - (avant.poids ? avant.poids[k] || 0 : 0); if (Math.abs(d) > 2048) diffs.push(`${k} ${d > 0 ? '+' : ''}${Math.round(d / 1024)} Ko`); }
      console.log('   📊 rapport : ' + (diffs.length ? diffs.join(', ') : 'aucune différence notable avec le build précédent'));
    }
    fs.mkdirSync(cache, { recursive: true });
    fs.writeFileSync(precedent, JSON.stringify(rapport));
  } catch (e) { /* le rapport est facultatif */ }
})();

console.log(`✅ ${fiches.length} fiche(s) générée(s) dans public/ (+ sommaire)`);
if (avertissements || liensCasses) {
  console.error(`❌ ${avertissements} avertissement(s) de front-matter, ${liensCasses} lien(s) cassé(s), corrige avant de committer.`);
  process.exitCode = 1;
}
