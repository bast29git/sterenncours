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

/* ---------- Lot F5 : structure du site ---------- */
/** F176 : chaque feuille de style a autant d'accolades ouvrantes que fermantes (une accolade perdue
 *  avale le reste de la feuille sans que rien ne le dise). */
export function verifierAccolades() {
  const manquements = [];
  const dossier = path.join(RACINE, 'site');
  for (const f of fs.readdirSync(dossier).filter((x) => x.endsWith('.css'))) {
    const css = fs.readFileSync(path.join(dossier, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const ouvre = (css.match(/\{/g) || []).length; const ferme = (css.match(/\}/g) || []).length;
    if (ouvre !== ferme) manquements.push(`site/${f} : ${ouvre} accolade(s) ouvrante(s) pour ${ferme} fermante(s)`);
  }
  return manquements;
}
/** F177 : aucun identifiant en double dans la coquille ; F178 : chaque pictogramme utilisé existe. */
export function verifierCoquille() {
  const manquements = [];
  const html = fs.readFileSync(path.join(RACINE, 'site', 'index.html'), 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const vus = new Set(); const doubles = new Set();
  ids.forEach((i) => { if (vus.has(i)) doubles.add(i); vus.add(i); });
  doubles.forEach((i) => manquements.push(`site/index.html : identifiant en double « ${i} »`));
  const pictos = new Set([...html.matchAll(/<g id="(ic-[a-z-]+)"/g)].map((m) => m[1]));
  const dossier = path.join(RACINE, 'site');
  for (const f of fs.readdirSync(dossier).filter((x) => x.endsWith('.js'))) {
    const js = fs.readFileSync(path.join(dossier, f), 'utf8');
    const utilises = new Set([...js.matchAll(/#(ic-[a-z-]+)/g)].map((m) => m[1]).concat([...js.matchAll(/ic\('(ic-[a-z-]+)'/g)].map((m) => m[1])));
    for (const u of utilises) if (!pictos.has(u)) manquements.push(`site/${f} : pictogramme inconnu « ${u} »`);
  }
  // F198 : tout fichier que le service worker met en cache à l'installation doit exister.
  const sw = fs.readFileSync(path.join(dossier, 'sw.js'), 'utf8');
  const liste = /const COQUILLE = \[([\s\S]*?)\];/.exec(sw);
  if (liste) {
    for (const m of liste[1].matchAll(/'(\/[^'?]+)'/g)) {
      const rel = m[1].replace(/^\//, '');
      const existe = fs.existsSync(path.join(dossier, rel)) || fs.existsSync(path.join(RACINE, 'public', rel)) || /^data\//.test(rel) || /^paquet-/.test(rel);
      if (!existe) manquements.push(`site/sw.js : fichier de coquille absent « ${m[1]} »`);
    }
  }
  return manquements;
}
/** F179 : la banque d'exercices est bien formée ; F180 : le programme est cohérent. */
export function verifierDonnees() {
  const manquements = [];
  try {
    const brut = fs.readFileSync(path.join(RACINE, 'site', 'data', 'exercices.js'), 'utf8');
    const sandbox = { window: {} };
    new Function('window', brut)(sandbox.window);
    const banque = sandbox.window.EXERCICES || {};
    const TYPES = new Set(['qcm', 'vraifaux', 'saisie', 'associer', 'trous']);
    for (const [cle, b] of Object.entries(banque)) {
      if (!/^[a-z][a-z0-9-]+\/[A-Z]?\d{1,2}$/.test(cle)) manquements.push(`exercices : clé invalide « ${cle} »`);
      if (!b || !Array.isArray(b.items) || !b.items.length) { manquements.push(`exercices ${cle} : aucune question`); continue; }
      b.items.forEach((q, i) => {
        if (!q || !TYPES.has(q.type)) manquements.push(`exercices ${cle} #${i + 1} : type inconnu « ${q && q.type} »`);
        if (!q || !String(q.q || '').trim()) manquements.push(`exercices ${cle} #${i + 1} : énoncé vide`);
        if (!q || !String(q.explication || '').trim()) manquements.push(`exercices ${cle} #${i + 1} : explication manquante`);
        if (q && q.type === 'qcm' && (!Array.isArray(q.choix) || q.choix.length < 2 || !Number.isInteger(q.reponse) || q.reponse < 0 || q.reponse >= q.choix.length)) manquements.push(`exercices ${cle} #${i + 1} : QCM mal formé`);
        if (q && q.type === 'vraifaux' && typeof q.reponse !== 'boolean') manquements.push(`exercices ${cle} #${i + 1} : vrai/faux sans réponse booléenne`);
        if (q && q.type === 'saisie' && (!Array.isArray(q.reponses) || !q.reponses.length)) manquements.push(`exercices ${cle} #${i + 1} : saisie sans réponses`);
      });
    }
  } catch (e) { manquements.push('exercices : banque illisible (' + String(e.message).split('\n')[0] + ')'); }
  try {
    const programme = JSON.parse(fs.readFileSync(path.join(RACINE, '00-pilotage', 'programme.json'), 'utf8'));
    const ids = new Set();
    for (const m of programme.matieres || []) {
      if (!/^[a-z][a-z0-9-]{1,30}$/.test(m.id)) manquements.push(`programme : identifiant de matière invalide « ${m.id} »`);
      if (ids.has(m.id)) manquements.push(`programme : matière en double « ${m.id} »`); ids.add(m.id);
      const refs = new Set();
      for (const l of m.lecons || []) {
        if (!/^[A-Z]?\d{1,2}$/.test(l.ref)) manquements.push(`programme ${m.id} : référence invalide « ${l.ref} »`);
        if (refs.has(l.ref)) manquements.push(`programme ${m.id} : référence en double « ${l.ref} »`); refs.add(l.ref);
        if (!l.titre || !String(l.titre).trim()) manquements.push(`programme ${m.id}/${l.ref} : titre vide`);
        if (!(l.periode >= 1 && l.periode <= 5)) manquements.push(`programme ${m.id}/${l.ref} : période hors de 1 à 5`);
      }
    }
  } catch (e) { manquements.push('programme : fichier illisible (' + String(e.message).split('\n')[0] + ')'); }
  return manquements;
}
export const verifierStructure = () => verifierAccolades().concat(verifierCoquille(), verifierDonnees());
