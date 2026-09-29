/**
 * PUT    /api/resultats : enregistre le résultat d'une série d'exercices.
 * DELETE /api/resultats?cle=<matiere>/<ref> : le professeur remet une série à zéro (B147).
 * Le meilleur score et le nombre de séries sont conservés dans le temps.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, MESSAGES, journaliser, methodeNonPermise } from '../_commun.js';
import { lireCorps, matiere as validerMatiere, ref as validerRef, cleLecon, liste } from '../_valider.js';
import { PROGRAMME } from '../_programme.js';
import { compter } from './usage.js';

export const onRequest = methodeNonPermise(['PUT', 'DELETE']);
const LECONS = new Set(PROGRAMME.flatMap((m) => m.lecons.map((l) => m.id + '/' + l.ref)));

export const onRequestPut = gerer(async (context) => {
  await exigerSession(context);
  const { DB } = context.env;

  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  // B145 : la clé doit désigner une leçon du programme.
  const matiere = validerMatiere(corps.matiere); const ref = validerRef(corps.ref);
  if (!matiere || !ref) return erreur('matiere et ref sont requis.', 400, 'invalide', matiere ? 'ref' : 'matiere');
  const cle = matiere + '/' + ref;
  if (!LECONS.has(cle)) return erreur(MESSAGES.cle_lecon_invalide, 400, 'invalide', 'ref');
  const justes = Number(corps.justes);
  const total = Number(corps.total);
  if (!Number.isInteger(justes) || !Number.isInteger(total) || total <= 0 || total > 200 || justes < 0 || justes > total) {
    return erreur('Score invalide.', 400, 'invalide', 'justes');
  }

  await DB.prepare(
    `INSERT INTO resultats (cle, matiere, ref, justes, total, meilleur, series, maj_le, genre)
     VALUES (?, ?, ?, ?, ?, ?, 1, ?, 'serie')
     ON CONFLICT(cle) DO UPDATE SET
       justes = excluded.justes,
       total = excluded.total,
       meilleur = MAX(resultats.meilleur, excluded.justes),
       series = resultats.series + 1,
       maj_le = excluded.maj_le,
       genre = 'serie'`,
  ).bind(cle, matiere, ref, justes, total, justes, maintenant()).run();
  // B146 : le détail d'une série (questions ratées, durée) est gardé, borné, pour la page de la leçon côté professeur.
  if (corps.detail && typeof corps.detail === 'object') {
    const d = corps.detail;
    const detail = { justes, total, ratees: liste(d.ratees, 15).map((x) => String(x).slice(0, 80)), duree_s: Math.min(36000, Math.max(0, Number(d.duree_s) || 0)), le: maintenant() };
    try { await DB.prepare('UPDATE resultats SET detail = ? WHERE cle = ?').bind(JSON.stringify(detail), cle).run(); } catch (e) { /* colonne absente avant la migration 0010 */ }
  }

  await compter(context.env, 'serie');
  const ligne = await DB.prepare('SELECT * FROM resultats WHERE cle = ?').bind(cle).first();
  return json({ ...ligne, reussie: justes / total >= 0.7 });
});

export const onRequestDelete = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const cle = cleLecon(new URL(context.request.url).searchParams.get('cle'));
  if (!cle) return erreur(MESSAGES.cle_lecon_invalide, 400, 'invalide', 'cle');
  const avant = await context.env.DB.prepare('SELECT meilleur, series FROM resultats WHERE cle = ?').bind(cle).first();
  if (!avant) return erreur('Aucune série enregistrée pour cette leçon.', 404);
  await context.env.DB.prepare('DELETE FROM resultats WHERE cle = ?').bind(cle).run();
  await journaliser(context.env, session, 'resultats', cle, avant, null);
  return json({ cle, supprime: true });
});
