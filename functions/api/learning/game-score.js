/**
 * POST /api/learning/game-score : un jeu terminé (coquille des jeux 2D et 3D).
 * Le résultat est rangé avec les séries d'exercices, sous la clé jeu/<id>,
 * pour qu'une partie gagnée compte comme une série réussie dans les étoiles.
 */
import { json, erreur, gerer, exigerSession, maintenant } from '../../_commun.js';

export const onRequestPost = gerer(async (context) => {
  await exigerSession(context);
  const { DB } = context.env;

  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }
  const id = String((corps && corps.gameId) || '').replace(/[^a-z0-9-]/gi, '').slice(0, 60);
  let score = Number(corps && corps.score);
  if (!id) return erreur('gameId requis.');
  if (!Number.isFinite(score)) score = 0;
  // Un score sur 100 : une partie terminée vaut au moins la réussite d'une série.
  const justes = Math.max(70, Math.min(100, Math.round(score)));
  const cle = 'jeu/' + id;

  await DB.prepare(
    `INSERT INTO resultats (cle, matiere, ref, justes, total, meilleur, series, maj_le)
     VALUES (?, 'jeu', ?, ?, 100, ?, 1, ?)
     ON CONFLICT(cle) DO UPDATE SET
       justes = excluded.justes,
       meilleur = MAX(resultats.meilleur, excluded.justes),
       series = resultats.series + 1,
       maj_le = excluded.maj_le`,
  ).bind(cle, id, justes, justes, maintenant()).run();

  const ligne = await DB.prepare('SELECT * FROM resultats WHERE cle = ?').bind(cle).first();
  return json(ligne);
});
