/**
 * PUT /api/resultats : enregistre le résultat d'une série d'exercices.
 * Le meilleur score et le nombre de séries sont conservés dans le temps.
 */
import { json, erreur, gerer, exigerSession, maintenant } from '../_commun.js';

export const onRequestPut = gerer(async (context) => {
  await exigerSession(context);
  const { DB } = context.env;

  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }
  const { matiere, ref } = corps || {};
  const justes = Number(corps && corps.justes);
  const total = Number(corps && corps.total);
  if (!matiere || !ref) return erreur('matiere et ref sont requis.');
  if (!Number.isInteger(justes) || !Number.isInteger(total) || total <= 0 || justes < 0 || justes > total) {
    return erreur('Score invalide.');
  }

  const cle = matiere + '/' + ref;
  await DB.prepare(
    `INSERT INTO resultats (cle, matiere, ref, justes, total, meilleur, series, maj_le)
     VALUES (?, ?, ?, ?, ?, ?, 1, ?)
     ON CONFLICT(cle) DO UPDATE SET
       justes = excluded.justes,
       total = excluded.total,
       meilleur = MAX(resultats.meilleur, excluded.justes),
       series = resultats.series + 1,
       maj_le = excluded.maj_le`,
  ).bind(cle, matiere, ref, justes, total, justes, maintenant()).run();

  const ligne = await DB.prepare('SELECT * FROM resultats WHERE cle = ?').bind(cle).first();
  return json(ligne);
});
