/**
 * pdf.mjs : HTML (public/) → PDF A4 prêts à imprimer (public/pdf/).
 *
 * Utilise Chromium en mode headless (`--print-to-pdf`). Aucune dépendance npm.
 * Le chemin du navigateur est détecté automatiquement ; il peut être forcé
 * avec la variable d'environnement CHROME_BIN.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(RACINE, 'public');
const SORTIE = path.join(RACINE, 'public', 'pdf');

const CANDIDATS = [
  process.env.CHROME_BIN,
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].filter(Boolean);

function trouverNavigateur() {
  for (const c of CANDIDATS) if (fs.existsSync(c)) return c;
  const motif = '/opt/pw-browsers';
  if (fs.existsSync(motif)) {
    for (const d of fs.readdirSync(motif)) {
      const p = path.join(motif, d, 'chrome-linux', 'chrome');
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

/**
 * Par défaut on n'imprime QUE ce qui se lit sur papier : un dossier complet par
 * matière, les documents de pilotage et les outils. Les fiches individuelles
 * sont déjà contenues dans les dossiers ; `--tout` les imprime séparément.
 */
const TOUT = process.argv.includes('--tout');

function aImprimer(relatif) {
  const chemin = relatif.split(path.sep).join('/');
  if (chemin === 'index.html' || chemin === 'documents.html') return false;
  if (TOUT) return true;
  return chemin.startsWith('dossiers/')
    || chemin.startsWith('cahiers/')
    || chemin.startsWith('00-pilotage/')
    || chemin.startsWith('outils/');
}

function parcourir(dossier, liste = []) {
  for (const e of fs.readdirSync(dossier, { withFileTypes: true })) {
    if (e.name === 'pdf' || e.name === 'theme' || e.name === 'data') continue;
    const complet = path.join(dossier, e.name);
    if (e.isDirectory()) parcourir(complet, liste);
    else if (e.name.endsWith('.html') && aImprimer(path.relative(SOURCE, complet))) {
      liste.push(complet);
    }
  }
  return liste;
}

const navigateur = trouverNavigateur();
if (!navigateur) {
  console.error('❌ Chromium introuvable. Définis CHROME_BIN vers un navigateur Chrome/Chromium.');
  process.exit(1);
}
if (!fs.existsSync(SOURCE)) {
  console.error('❌ public/ est vide. Lance d\'abord : npm run build');
  process.exit(1);
}

const fichiers = parcourir(SOURCE);
let ok = 0;

for (const fichier of fichiers) {
  const relatif = path.relative(SOURCE, fichier);
  const cible = path.join(SORTIE, relatif.replace(/\.html$/, '.pdf'));
  fs.mkdirSync(path.dirname(cible), { recursive: true });
  try {
    execFileSync(navigateur, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      '--run-all-compositor-stages-before-draw',
      '--virtual-time-budget=4000',
      `--print-to-pdf=${cible}`,
      pathToFileURL(fichier).href,
    ], { stdio: 'ignore', timeout: 60_000 });
    ok += 1;
    console.log(`   📄 ${relatif.replace(/\.html$/, '.pdf')}`);
  } catch (err) {
    console.error(`   ⚠️  échec sur ${relatif} : ${err.message}`);
  }
}

console.log(`✅ ${ok}/${fichiers.length} PDF générés dans public/pdf/`);
