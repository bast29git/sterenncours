/**
 * build.mjs — Markdown → HTML pour les supports de cours de Sterenn.
 *
 * Zéro style en ligne : tout le rendu passe par le design system
 * (theme/cours.css) et par un jeu fermé de conteneurs `:::`.
 * Objectif TSA : une syntaxe = un bloc visuel, toujours le même,
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
const md = new MarkdownIt({ html: true, linkify: false, typographer: true })
  .use(attrs)
  .use(deflist);

// Blocs sémantiques : ::: definition Titre optionnel
for (const [nom, def] of Object.entries(BLOCS)) {
  md.use(container, nom, {
    render(tokens, idx) {
      if (tokens[idx].nesting !== 1) return '</div>\n';
      const suffixe = tokens[idx].info.trim().slice(nom.length).trim();
      const titre = suffixe ? `${def.libelle} — ${echapper(suffixe)}` : def.libelle;
      return `<div class="bloc ${def.classe}">\n`
           + `<p class="bloc-titre"><span class="picto" aria-hidden="true">${def.picto}</span>`
           + `<span>${titre}</span></p>\n`;
    },
  });
}

// ::: exercice 3 | entrainement | 10 min
md.use(container, 'exercice', {
  render(tokens, idx) {
    if (tokens[idx].nesting !== 1) return '</div>\n';
    const args = tokens[idx].info.trim().slice('exercice'.length).split('|').map((s) => s.trim());
    const num = args[0] || '';
    const cle = (args[1] || 'application').toLowerCase().replace(/[^a-z]/g, '');
    const niveau = NIVEAUX_EX[cle] || NIVEAUX_EX.application;
    const duree = args[2] || '';
    return `<section class="exercice">\n<div class="exercice-entete">`
         + `<span class="exercice-num">Exercice ${echapper(num)}</span>`
         + `<span class="exercice-niveau niveau-${cle}">${niveau}</span>`
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
         + (suffixe ? ` — ${echapper(suffixe)}` : '') + `</summary>\n<div class="corrige-corps">\n`;
  },
});

// ::: etapes  → liste ordonnée en pastilles numérotées
md.use(container, 'etapes', {
  render(tokens, idx) {
    if (tokens[idx].nesting !== 1) return '</div>\n';
    return '<div class="enveloppe-etapes">\n';
  },
});

// ::: formule-cle → encadré central
md.use(container, 'formule-cle', {
  render(tokens, idx) {
    return tokens[idx].nesting === 1 ? '<div class="formule-cle">\n' : '</div>\n';
  },
});

// ::: motscles / ::: echelle / ::: cartes / ::: cocher → listes stylées
for (const nom of ['motscles', 'echelle', 'cartes', 'cocher', 'grille']) {
  md.use(container, nom, {
    render(tokens, idx) {
      return tokens[idx].nesting === 1 ? `<div class="enveloppe-${nom}">\n` : '</div>\n';
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

/* ── Post-traitement : applique les classes aux listes enveloppées ────── */
function appliquerClassesListes(html) {
  return html
    .replace(/<div class="enveloppe-etapes">\s*<ol>/g, '<ol class="etapes">')
    .replace(/<div class="enveloppe-motscles">\s*<ul>/g, '<ul class="motscles">')
    .replace(/<div class="enveloppe-echelle">\s*<ul>/g, '<ul class="echelle">')
    .replace(/<div class="enveloppe-cartes">\s*<ul>/g, '<ul class="cartes">')
    .replace(/<div class="enveloppe-cocher">\s*<ul>/g, '<ul class="cocher">')
    .replace(/<div class="enveloppe-grille">\s*<table>/g, '<table class="grille">')
    .replace(/<\/(ol|ul|table)>\s*<\/div>/g, '</$1>');
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
<title>${echapper(meta.titre || 'Support de cours')} — ${typeDoc}</title>
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
for (const dossier of DOSSIERS_CONTENU) {
  for (const fichier of parcourir(path.join(RACINE, dossier))) {
    const relatif = path.relative(RACINE, fichier);
    const brut = fs.readFileSync(fichier, 'utf8');
    const { meta, corps } = lireFrontMatter(brut);
    const profondeur = relatif.split(path.sep).length - 1;
    const html = gabarit({
      meta,
      contenu: appliquerClassesListes(md.render(corps)),
      profondeur,
      chemin: relatif,
    });
    const cible = path.join(SORTIE, relatif.replace(/\.md$/, '.html'));
    fs.mkdirSync(path.dirname(cible), { recursive: true });
    fs.writeFileSync(cible, html);
    fiches.push({ relatif, meta });
  }
}

fs.writeFileSync(
  path.join(SORTIE, 'fiches.json'),
  JSON.stringify(fiches, null, 2),
);

console.log(`✅ ${fiches.length} fiche(s) générée(s) dans public/`);
