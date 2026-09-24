/**
 * POST /api/learning/game-score : un jeu terminé (coquille des jeux 2D et 3D).
 * Le résultat est rangé avec les séries d'exercices, sous la clé jeu/<id>,
 * pour qu'une partie gagnée compte comme une série réussie dans les étoiles.
 *
 * La coquille envoie les étoiles obtenues (0 à 3) et si la partie est gagnée.
 * Trois étoiles valent 100, deux valent 80, une seule 50 : seule une partie
 * à deux étoiles ou plus franchit le seuil de réussite (70 %). Sans étoiles,
 * une partie gagnée vaut 75, une partie perdue 40.
 */
import { json, erreur, gerer, exigerSession, maintenant } from '../../_commun.js';
import { compter } from '../usage.js';

export function noteSur100(corps) {
  const etoiles = Number(corps && corps.stars);
  if (Number.isFinite(etoiles) && etoiles >= 0) {
    return [30, 50, 80, 100][Math.min(3, Math.round(etoiles))];
  }
  return corps && corps.won === false ? 40 : 75;
}

export const onRequestPost = gerer(async (context) => {
  await exigerSession(context);
  const { DB } = context.env;

  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }
  const id = String((corps && corps.gameId) || '').replace(/[^a-z0-9-]/gi, '').slice(0, 60);
  if (!id) return erreur('gameId requis.');
  const justes = noteSur100(corps);
  const cle = 'jeu/' + id;

  await DB.prepare(
    `INSERT INTO resultats (cle, matiere, ref, justes, total, meilleur, series, maj_le, genre)
     VALUES (?, 'jeu', ?, ?, 100, ?, 1, ?, 'jeu')
     ON CONFLICT(cle) DO UPDATE SET
       justes = excluded.justes,
       meilleur = MAX(resultats.meilleur, excluded.justes),
       series = resultats.series + 1,
       maj_le = excluded.maj_le,
       genre = 'jeu'`,
  ).bind(cle, id, justes, justes, maintenant()).run();
  // D25 : le détail de la partie (justes, total, questions ratées, difficulté, mode), borné.
  if (corps.detail && typeof corps.detail === 'object') {
    const d = corps.detail;
    const detail = { justes: Number(d.justes) || 0, total: Number(d.total) || 0, difficulte: Number(d.difficulte) || null, mode: String(corps.mode || '').slice(0, 10), ratees: Array.isArray(d.ratees) ? d.ratees.slice(0, 10).map((x) => String(x).slice(0, 80)) : [], le: maintenant() };
    // E12, E17, E30 : questions de la leçon, journal de bord et mesures d'un monde 3D, bornés.
    if (d.banque && typeof d.banque === 'object') detail.banque = { justes: Number(d.banque.justes) || 0, total: Number(d.banque.total) || 0, ratees: Array.isArray(d.banque.ratees) ? d.banque.ratees.slice(0, 10).map((x) => String(x).slice(0, 80)) : [] };
    if (d.journal && typeof d.journal === 'object') detail.journal = { touches: Array.isArray(d.journal.touches) ? d.journal.touches.slice(0, 20).map((x) => String(x).slice(0, 60)) : [], fiche: Number(d.journal.fiche) || 0, guide: Number(d.journal.guide) || 0 };
    if (d.perf && typeof d.perf === 'object') detail.perf = { ips: Number(d.perf.ips) || null, chargement_ms: Number(d.perf.chargement_ms) || null, qualite: Number(d.perf.qualite) || null, ratio: Number(d.perf.ratio) || null, mobile: !!d.perf.mobile };
    if (d.duree_s != null) detail.duree_s = Math.min(36000, Math.max(0, Number(d.duree_s) || 0));
    try { await DB.prepare('UPDATE resultats SET detail = ? WHERE cle = ?').bind(JSON.stringify(detail), cle).run(); } catch (e) { /* colonne absente avant la migration 0010 */ }
  }
  await compter(context.env, 'jeu');

  const ligne = await DB.prepare('SELECT * FROM resultats WHERE cle = ?').bind(cle).first();
  return json({ ...ligne, reussie: justes >= 70 });
});
