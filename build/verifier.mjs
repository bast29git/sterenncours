/**
 * Vérifications de forme sur le contenu et le site, lancées par le build :
 *   - aucun tiret long ni demi-cadratin dans les fiches, le pilotage, les
 *     outils, les scripts et les feuilles du site ;
 *   - aucun mot de la liste de discrétion (diagnostics, profils) dans les
 *     documents ni dans l'interface. La liste est encodée pour ne pas figurer
 *     en clair dans le dépôt.
 * Renvoie le nombre de manquements ; le build échoue s'il n'est pas nul.
 */
import fs from 'node:fs';
import path from 'node:path';

const RACINE = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DOSSIERS = ['00-pilotage', 'matieres', 'outils'];
const SITE = ['site/index.html', 'site/app.js', 'site/vue-eleve.js', 'site/vue-prof.js', 'site/messagerie.js', 'site/tuteur.js', 'site/modules.js', 'site/visite.js', 'site/planificateur.js', 'site/data/exercices.js', 'site/data/jeux.js', 'site/eleve.css', 'site/prof.css', 'site/portail.css'];
const EXCEPTIONS_TIRETS = ['matieres/francais/L02-individu-societe', 'matieres/francais/L07-discours-rapporte'];
const MOTS = ['YXV0aXN0', 'YXV0aXNt', 'dHNhKG5vbi1saXNzw6kp', 'dGRhaA==', 'ZHlzbGV4', 'ZHlzcHJheA==', 'dHJvdWJsZSBkdQ==', 'bmV1cm8tYXR5cA==', 'bmV1cm9hdHlw', 'YXNwZXJnZXI='].map((b) => Buffer.from(b, 'base64').toString('utf8')).filter((m) => !m.includes('('));

function fichiers(dossier) {
  const sortie = [];
  const marcher = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) marcher(p);
      else if (/\.(md|json)$/.test(e.name)) sortie.push(p);
    }
  };
  if (fs.existsSync(dossier)) marcher(dossier);
  return sortie;
}

/* C75 : la variante foncée de chaque palette (70 % de la couleur vive, 30 % d'encre #0b1a3a,
   comme dans eleve.css) doit garder un contraste d'au moins 4,5 sur du blanc. */
const ENCRE = [0x0b, 0x1a, 0x3a];
const hexVersRvb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lineaire = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const luminance = (rvb) => 0.2126 * lineaire(rvb[0]) + 0.7152 * lineaire(rvb[1]) + 0.0722 * lineaire(rvb[2]);
const contrasteSurBlanc = (rvb) => (1.05) / (luminance(rvb) + 0.05);
export function verifierContrastes() {
  const manquements = [];
  const css = fs.readFileSync(path.join(RACINE, 'site', 'eleve.css'), 'utf8');
  const melange = /--e-vif-fonce:\s*color-mix\(in srgb, var\(--e-vif\) (\d+)%/.exec(css);
  const part = melange ? Number(melange[1]) / 100 : 0.7;
  for (const m of css.matchAll(/--e-([a-z]+)-1:\s*(#[0-9a-fA-F]{6})/g)) {
    const vif = hexVersRvb(m[2]);
    const fonce = vif.map((c, i) => Math.round(c * part + ENCRE[i] * (1 - part)));
    const ratio = contrasteSurBlanc(fonce);
    if (ratio < 4.5) manquements.push(`palette ${m[1]} : contraste ${ratio.toFixed(2)} de la variante foncée sur blanc (4,5 attendu)`);
  }
  return manquements;
}

export function verifierForme() {
  const manquements = verifierContrastes();
  const cibles = DOSSIERS.flatMap((d) => fichiers(path.join(RACINE, d))).concat(SITE.map((f) => path.join(RACINE, f)).filter((f) => fs.existsSync(f)));
  for (const f of cibles) {
    const relatif = path.relative(RACINE, f);
    const texte = fs.readFileSync(f, 'utf8');
    if (!EXCEPTIONS_TIRETS.some((e) => relatif.startsWith(e)) && !relatif.endsWith('audit-ameliorations.md')) {
      const tirets = (texte.match(/[–—]/g) || []).length;
      if (tirets) manquements.push(`${relatif} : ${tirets} tiret(s) long(s) ou demi-cadratin(s)`);
    }
    const bas = texte.toLowerCase();
    for (const m of MOTS) {
      if (bas.includes(m)) manquements.push(`${relatif} : mot de la liste de discrétion (${m.slice(0, 3)}…)`);
    }
  }
  return manquements;
}

if (process.argv[1] && process.argv[1].endsWith('verifier.mjs')) {
  const m = verifierForme();
  m.forEach((x) => console.error('   ⚠️  ' + x));
  console.log(m.length ? `❌ ${m.length} manquement(s) de forme` : '✅ forme vérifiée : aucun tiret long, aucun mot de la liste de discrétion');
  process.exit(m.length ? 1 : 0);
}
