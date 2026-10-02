/**
 * audit-contenus.mjs : l'état de chaque leçon, en un tableau.
 *
 * Pour les 84 leçons : les quatre documents, le nombre d'exercices, ceux sur
 * écran et ceux à la main, le sujet de type devoir, les corrigés, la banque
 * interactive, la grille d'évaluation, les fichiers générés (cahier, sujet en
 * ligne, sujet papier et corrigé papier), les jeux rattachés. Puis la forme de
 * chaque document (plan, pauses, matériel, mots-clés, auto-test, trois niveaux
 * d'exercices, corrigés détaillés, échelle à quatre niveaux, barème), la banque
 * question par question (types, réponses, explications rédigées), l'univers de
 * Sterenn dans les énoncés, et la couverture des attendus du programme officiel
 * par les leçons. Le rapport est écrit dans 00-pilotage/audit-contenus.md et le
 * script sort en erreur si un manque bloquant subsiste.
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
const UNIVERS = (() => { try { return JSON.parse(lire(path.join(RACINE, 'public', 'data', 'univers.json')) || '{}'); } catch (e) { return {}; } })();
const NIVEAUX = ['application', 'entrainement', 'approfondissement'];
const ENTETE_GRILLE = '| Critère | ◔ Insuffisant | ◑ Fragile | ◕ Satisfaisant | ● Très bien |';
const mots = (t) => String(t || '').split(/\s+/).filter(Boolean).length;
const corps = (t) => String(t || '').replace(/^---[\s\S]*?---/, '');
/** Les mots porteurs d'un texte, pour rapprocher un attendu d'une leçon. */
const VIDES = new Set('les des une dans pour avec sur par et ou en de du la le au aux un a à l d y est sont son sa ses leur leurs ce cette ces qui que quoi dont comme plus moins entre sans sous vers chez tout tous toute toutes autre autres leur notamment selon aussi puis'.split(' '));
const porteurs = (t) => [...new Set(String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !VIDES.has(w)).map((w) => w.replace(/(s|x|es|aux)$/, '')))];
const detailsQualite = []; const couverture = [];

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

    // La forme de chaque document, document par document.
    const cours = corps(docs[0]); const revision = corps(docs[1]); const evaluation = corps(docs[3]);
    const forme = [];
    if (docs[0]) {
      if (!/^::: plan/m.test(cours)) manques.push(`${cle} : la fiche de cours n'ouvre pas sur « Plan de la fiche »`);
      if (!/^::: pause|🔁/m.test(cours)) forme.push('cours sans point de pause');
      if (!/^::: materiel|[Mm]atériel/m.test(cours)) forme.push('cours sans matériel annoncé');
      const n = mots(cours); if (n < 1200 || n > 4200) forme.push(`cours de ${n} mots (1 200 à 4 200 attendus)`);
      if ((cours.match(/^## /gm) || []).length < 4) forme.push('cours de moins de quatre parties');
    }
    if (docs[1]) {
      if (!/^::: plan/m.test(revision)) manques.push(`${cle} : la fiche de révision n'ouvre pas sur « Plan de la fiche »`);
      if (!/[Aa]uto-test/.test(revision)) manques.push(`${cle} : la fiche de révision n'a pas d'auto-test`);
      if (!/^::: motscles|[Mm]ots-clés/m.test(revision)) forme.push('révision sans bloc de mots-clés');
      if (!/^::: piege|[Pp]ièges?/m.test(revision)) forme.push('révision sans pièges à éviter');
      const n = mots(revision); if (n < 450 || n > 2400) forme.push(`révision de ${n} mots (450 à 2 400 attendus)`);
    }
    if (docs[2]) {
      const niveauxPresents = NIVEAUX.filter((nv) => entetes.some((e) => e[2] === nv));
      if (niveauxPresents.length < 3) manques.push(`${cle} : niveaux d'exercices manquants (${NIVEAUX.filter((nv) => !niveauxPresents.includes(nv)).join(', ')})`);
      entetes.forEach((e) => { if (!NIVEAUX.includes(e[2])) manques.push(`${cle} : exercice ${e[1]} avec un niveau inconnu « ${e[2]} »`); });
      if (ligne.exercices > 25) forme.push(`${ligne.exercices} exercices (25 au plus conseillés)`);
      const courts = [];
      [...exos.matchAll(/^::: exercice\s+(\d+)[^\n]*\n([\s\S]*?)(?=^::: exercice |\n## |$(?![\s\S]))/gm)].forEach((b) => {
        const c = b[2].match(/^::: corrige\s*\n([\s\S]*?)^:::\s*$/m);
        if (c && c[1].trim().length < 120) courts.push(b[1]);
      });
      if (courts.length) forme.push(`corrigé(s) trop court(s) : exercice(s) ${courts.join(', ')}`);
      const premiers = entetes.slice(0, 4);
      if (premiers.length === 4 && premiers.some((e) => e[4] !== 'ecran')) forme.push('les exercices 1 à 4 ne sont pas tous sur écran');
      if (entetes.slice(4).some((e) => e[4] !== 'main')) forme.push('un exercice après le 4ᵉ est sur écran');
    }
    if (docs[3]) {
      if (!evaluation.includes(ENTETE_GRILLE)) manques.push(`${cle} : la grille n'a pas l'en-tête à quatre niveaux exact`);
      if (criteres > 10) forme.push(`${criteres} critères (10 au plus)`);
      if (!/[Bb]arème/.test(evaluation)) forme.push('évaluation sans barème');
      if (!/Insuffisant[\s\S]*Fragile[\s\S]*Satisfaisant[\s\S]*Très bien/.test(evaluation)) manques.push(`${cle} : les quatre niveaux ne sont pas dans l'ordre officiel`);
    }
    // La banque, question par question.
    const items = (BANQUE[cle] && BANQUE[cle].items) || [];
    items.forEach((q, i) => {
      const n = i + 1;
      if (!['qcm', 'vraifaux', 'saisie', 'associer', 'trous'].includes(q.type)) manques.push(`${cle} : question ${n} de type inconnu « ${q.type} »`);
      if (!q.q || String(q.q).trim().length < 8) manques.push(`${cle} : question ${n} sans énoncé`);
      if (q.type === 'associer' && (!Array.isArray(q.paires) || q.paires.length < 3 || q.paires.some((pa) => !Array.isArray(pa) || pa.length !== 2))) manques.push(`${cle} : question ${n} (associer) : trois paires au moins attendues`);
      if (q.type === 'trous' && (!q.texte || !/___/.test(q.texte) || !Array.isArray(q.reponses) || q.reponses.length !== (String(q.texte).match(/___/g) || []).length || q.reponses.some((r) => !Array.isArray(r) || !r.length))) manques.push(`${cle} : question ${n} (trous) : chaque trou ___ doit avoir sa liste de réponses`);
      if (!q.explication || String(q.explication).trim().length < 50) manques.push(`${cle} : question ${n} sans explication rédigée (50 caractères au moins)`);
      if (q.type === 'qcm' && (!Array.isArray(q.choix) || q.choix.length < 3 || q.choix.length > 5 || typeof q.reponse !== 'number' || q.reponse < 0 || q.reponse >= q.choix.length)) manques.push(`${cle} : question ${n} (qcm) : choix ou réponse invalides`);
      if (q.type === 'vraifaux' && typeof q.reponse !== 'boolean') manques.push(`${cle} : question ${n} (vrai ou faux) : la réponse doit être vrai ou faux`);
      if (q.type === 'saisie' && (q.reponse == null || String(q.reponse).trim() === '') && !Array.isArray(q.reponses)) manques.push(`${cle} : question ${n} (saisie) : réponse attendue absente`);
    });
    if (items.length > 30) forme.push(`banque de ${items.length} questions (30 au plus conseillées)`);
    // L'univers de Sterenn : un exercice sur cinq au moins.
    const u = (UNIVERS.lecons || {})[cle];
    ligne.univers = u ? u.relies : null;
    if (u && u.relies < Math.ceil(u.exercices / 5)) forme.push(`univers de Sterenn dans ${u.relies} exercice(s) sur ${u.exercices} (un sur cinq attendu)`);
    if (!Array.isArray(l.notions) || !l.notions.length) manques.push(`${cle} : aucune notion déclarée dans programme.json`);
    if (!(l.periode >= 1 && l.periode <= 5)) manques.push(`${cle} : période absente ou hors de 1 à 5`);
    ligne.forme = forme.length;
    forme.forEach((f) => { alertes.push(`${cle} : ${f}`); detailsQualite.push({ cle, f }); });

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
  // Chaque attendu de fin d'année doit se retrouver dans au moins une leçon (titre, notions, objectifs des quatre fiches).
  const textesLecons = m.lecons.map((l) => {
    const dossier = path.join(RACINE, 'matieres', m.id, l.dossier || '');
    const fm = ['1-cours.md', '2-revision.md', '3-exercices.md', '4-evaluation.md'].map((f) => (lire(path.join(dossier, f)) || '').match(/^---([\s\S]*?)---/)).map((x) => (x ? x[1] : '')).join('\n');
    return { ref: l.ref, titre: l.titre, mots: new Set(porteurs([l.titre, ...(l.notions || []), fm].join(' '))) };
  });
  (m.attendus || []).forEach((a) => {
    const cles = porteurs(a);
    const seuil = cles.length <= 3 ? 1 : 2;
    const scores = textesLecons.map((t) => ({ ref: t.ref, titre: t.titre, n: cles.filter((w) => t.mots.has(w)).length })).filter((x) => x.n >= seuil).sort((x, y) => y.n - x.n);
    couverture.push({ matiere: m.nom, attendu: a, lecons: scores.slice(0, 3) });
    if (!scores.length) alertes.push(`${m.id} : attendu sans leçon repérée : « ${a} »`);
  });
  // Une matière à huit leçons ou plus se répartit sur les cinq périodes.
  const periodes = new Set(m.lecons.map((l) => l.periode));
  if (m.lecons.length >= 8) [1, 2, 3, 4, 5].filter((k) => !periodes.has(k)).forEach((k) => alertes.push(`${m.id} : aucune leçon en période ${k}`));
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
- **${lignes.filter((x) => !x.forme).length} leçons** sans aucune alerte de forme ; ${couverture.filter((c) => c.lecons.length).length}/${couverture.length} attendus du programme repérés dans une leçon.
- **${manques.length} manque(s) bloquant(s)**, ${alertes.length} alerte(s).
:::

## Manques bloquants

${manques.length ? manques.map((x) => `- ${x}`).join('\n') : 'Aucun.'}

## Alertes

${alertes.length ? alertes.map((x) => `- ${x}`).join('\n') : 'Aucune.'}

## La couverture du programme officiel

Chaque attendu de fin d'année, et les leçons où il se retrouve (titre, notions, objectifs).

::: grille
| Matière | Attendu | Leçons |
|---|---|---|
${couverture.map((c) => `| ${c.matiere} | ${c.attendu} | ${c.lecons.length ? c.lecons.map((x) => `${x.ref} ${x.titre}`).join(' · ') : '**aucune repérée**'} |`).join('\n')}
:::

## Le détail par leçon

::: grille
| Leçon | Docs | Exos | Écran | Main | Corrigés | Devoir | Grille | Banque | Univers | Cahier | Sujet | Papier | Corrigé prof | Jeux | Alertes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
${lignes.map((x) => `| ${x.cle} · ${x.titre} | ${x.docs}/4 | ${x.exercices} | ${x.ecran} | ${x.main} | ${x.corriges} | ${oui(x.devoir)} | ${x.criteres} | ${x.banque} | ${x.univers == null ? '?' : x.univers} | ${oui(x.cahier)} | ${oui(x.sujet)} | ${oui(x.papier)} | ${oui(x.corrigePapier)} | ${x.jeux} | ${x.forme || ''} |`).join('\n')}
:::
`;
fs.writeFileSync(path.join(RACINE, '00-pilotage', 'audit-contenus.md'), md);
console.log(`Audit : ${totaux.lecons} leçons, ${totaux.exercices} exercices (${totaux.main} à la main), ${totaux.banque} questions ; ${manques.length} manque(s), ${alertes.length} alerte(s).`);
manques.slice(0, 40).forEach((x) => console.log('  ✗ ' + x));
alertes.slice(0, 60).forEach((x) => console.log('  ⚠ ' + x));
if (alertes.length > 60) console.log(`  … et ${alertes.length - 60} autre(s) alerte(s) dans 00-pilotage/audit-contenus.md`);
process.exit(manques.length ? 1 : 0);
