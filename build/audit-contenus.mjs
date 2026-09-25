/**
 * audit-contenus.mjs : l'état de chaque leçon, en un tableau.
 *
 * Pour les 84 leçons : les quatre documents, le nombre d'exercices, ceux sur
 * écran et ceux à la main, le sujet de type devoir, les corrigés, la banque
 * interactive, la grille d'évaluation, les fichiers générés (cahier, sujet en
 * ligne, sujet papier et corrigé papier), les jeux rattachés. Le rapport est
 * écrit dans 00-pilotage/audit-contenus.md et le script sort en erreur si un
 * manque bloquant subsiste.
 *
 *   node build/audit-contenus.mjs        (après npm run build)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const programme = JSON.parse(fs.readFileSync(path.join(RACINE, '00-pilotage', 'programme.json'), 'utf8'));
const lire = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null);

// La banque et les jeux sont des scripts navigateur : on les évalue dans un faux window.
function chargerScript(rel) {
  const w = {};
  const src = lire(path.join(RACINE, 'site', 'data', rel)) || '';
  new Function('window', src)(w);
  return w;
}
const BANQUE = chargerScript('exercices.js').EXERCICES || {};
const JEUX = chargerScript('jeux.js').JEUX || [];

const lignes = []; const manques = []; const alertes = [];
let totaux = { lecons: 0, exercices: 0, main: 0, ecran: 0, banque: 0 };
for (const m of programme.matieres) {
  for (const l of m.lecons) {
    const dossier = path.join(RACINE, 'matieres', m.id, l.dossier || '');
    const docs = ['1-cours.md', '2-revision.md', '3-exercices.md', '4-evaluation.md'].map((f) => lire(path.join(dossier, f)));
    const cle = `${m.id}/${l.ref}`;
    const ligne = { cle, titre: l.titre, docs: docs.filter(Boolean).length };
    const exos = docs[2] || '';
    const entetes = [...exos.matchAll(/^::: exercice\s+(\d+)\s*\|\s*([a-z]+)\s*\|\s*([^|]+)\|\s*(ecran|main)\s*$/gm)];
    const blocs = exos.split(/^::: exercice /m).slice(1);
    ligne.exercices = entetes.length;
    ligne.ecran = entetes.filter((e) => e[4] === 'ecran').length;
    ligne.main = entetes.filter((e) => e[4] === 'main').length;
    ligne.corriges = blocs.filter((b) => /^::: corrige/m.test(b)).length;
    const dernier = blocs[blocs.length - 1] || '';
    ligne.devoir = /devoir/i.test(dernier) || /sur 20/.test(dernier);
    const sansSupport = blocs.length - entetes.length;
    const grille = docs[3] || '';
    const criteres = (grille.match(/^\| \*\*\d+\. /gm) || []).length;
    ligne.criteres = criteres;
    ligne.banque = (BANQUE[cle] && BANQUE[cle].items || []).length;
    ligne.jeux = JEUX.filter((j) => (j.lecons || []).includes(`${m.id}:${l.ref}`)).length;
    const pub = (rel) => fs.existsSync(path.join(RACINE, 'public', rel));
    ligne.cahier = pub(`cahiers/${m.id}/${l.ref}.html`);
    ligne.sujet = pub(`data/evaluations/${m.id}/${l.ref}.js`);
    ligne.papier = pub(`evaluations/${m.id}/${l.ref}.html`);
    ligne.corrigePapier = pub(`data/contenu/${m.id}/${l.ref}-evaluation-corrige.html`);

    if (ligne.docs < 4) manques.push(`${cle} : ${4 - ligne.docs} document(s) manquant(s)`);
    if (ligne.exercices < 15) manques.push(`${cle} : ${ligne.exercices} exercices (15 attendus au moins)`);
    if (ligne.ecran !== 4) alertes.push(`${cle} : ${ligne.ecran} exercice(s) sur écran (4 attendus)`);
    if (ligne.main < 8) manques.push(`${cle} : ${ligne.main} exercice(s) à la main seulement`);
    if (sansSupport > 0) manques.push(`${cle} : ${sansSupport} exercice(s) sans support ecran/main`);
    if (ligne.corriges < ligne.exercices) manques.push(`${cle} : ${ligne.exercices - ligne.corriges} exercice(s) sans corrigé`);
    if (!ligne.devoir) manques.push(`${cle} : pas de sujet de type devoir noté sur 20`);
    if (criteres < 6) manques.push(`${cle} : ${criteres} critère(s) dans la grille (6 à 10 attendus)`);
    if (ligne.banque < 12) manques.push(`${cle} : banque interactive de ${ligne.banque} question(s) (12 au moins)`);
    if (!ligne.cahier) manques.push(`${cle} : cahier à imprimer absent`);
    if (!ligne.sujet) manques.push(`${cle} : sujet d'évaluation en ligne absent`);
    if (!ligne.papier) manques.push(`${cle} : sujet d'évaluation papier absent`);
    if (!ligne.corrigePapier) manques.push(`${cle} : corrigé papier du professeur absent`);
    if (!ligne.jeux) alertes.push(`${cle} : aucun jeu rattaché`);
    totaux.lecons += 1; totaux.exercices += ligne.exercices; totaux.main += ligne.main; totaux.ecran += ligne.ecran; totaux.banque += ligne.banque;
    lignes.push(ligne);
  }
}

const oui = (b) => (b ? '✓' : '✗');
const md = `---
type: pilotage
matiere: pilotage
titre: Audit des contenus
resume: L'état de chaque leçon, généré par build/audit-contenus.mjs. Documents, exercices, corrigés, banque, grille, fichiers à imprimer et jeux.
duree: 10 min
---

# Audit des contenus

Généré le ${new Date().toISOString().slice(0, 10)} par \`node build/audit-contenus.mjs\`.

::: retenir En un coup d'œil
- **${totaux.lecons} leçons**, toutes avec leurs quatre documents : ${lignes.filter((x) => x.docs === 4).length}.
- **${totaux.exercices} exercices** corrigés, dont ${totaux.ecran} sur écran et **${totaux.main} à la main** dans les cahiers à imprimer.
- **${totaux.banque} questions** dans les séries interactives.
- ${lignes.filter((x) => x.cahier).length} cahiers, ${lignes.filter((x) => x.sujet).length} sujets d'évaluation en ligne, ${lignes.filter((x) => x.papier).length} sujets papier et ${lignes.filter((x) => x.corrigePapier).length} corrigés papier générés.
- **${manques.length} manque(s) bloquant(s)**, ${alertes.length} alerte(s).
:::

## Manques bloquants

${manques.length ? manques.map((x) => `- ${x}`).join('\n') : 'Aucun.'}

## Alertes

${alertes.length ? alertes.map((x) => `- ${x}`).join('\n') : 'Aucune.'}

## Le détail par leçon

::: grille
| Leçon | Docs | Exos | Écran | Main | Corrigés | Devoir | Grille | Banque | Cahier | Sujet | Papier | Corrigé prof | Jeux |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
${lignes.map((x) => `| ${x.cle} · ${x.titre} | ${x.docs}/4 | ${x.exercices} | ${x.ecran} | ${x.main} | ${x.corriges} | ${oui(x.devoir)} | ${x.criteres} | ${x.banque} | ${oui(x.cahier)} | ${oui(x.sujet)} | ${oui(x.papier)} | ${oui(x.corrigePapier)} | ${x.jeux} |`).join('\n')}
:::
`;
fs.writeFileSync(path.join(RACINE, '00-pilotage', 'audit-contenus.md'), md);
console.log(`Audit : ${totaux.lecons} leçons, ${totaux.exercices} exercices (${totaux.main} à la main), ${totaux.banque} questions ; ${manques.length} manque(s), ${alertes.length} alerte(s).`);
manques.slice(0, 40).forEach((x) => console.log('  ✗ ' + x));
alertes.slice(0, 15).forEach((x) => console.log('  ⚠ ' + x));
process.exit(manques.length ? 1 : 0);
