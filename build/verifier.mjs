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

export function verifierForme() {
  const manquements = [];
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
