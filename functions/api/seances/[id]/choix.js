/**
 * POST /api/seances/:id/choix : Sterenn choisit la leçon qu'elle veut travailler.
 *
 * Accessible aux deux espaces. La leçon proposée doit faire partie des choix
 * enregistrés sur la séance : on ne peut pas choisir n'importe quoi.
 */
import { json, erreur, gerer, exigerSession, maintenant } from '../../../_commun.js';

export const onRequestPost = gerer(async (context) => {
  await exigerSession(context);
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur('Identifiant invalide.');

  const seance = await context.env.DB.prepare('SELECT * FROM seances WHERE id = ?').bind(id).first();
  if (!seance) return erreur('Séance introuvable.', 404);

  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }
  const choisie = String(corps && corps.lecon || '');

  let choix = [];
  try { choix = JSON.parse(seance.choix || '[]'); } catch (e) { choix = []; }
  if (!choix.length) return erreur('Cette séance ne propose pas de choix.');
  if (!choix.includes(choisie)) return erreur('Cette leçon ne fait pas partie des choix proposés.');

  let lecons = [];
  try { lecons = JSON.parse(seance.lecons || '[]'); } catch (e) { lecons = []; }
  const fixes = lecons.filter((r) => !choix.includes(r));
  const nouvelles = [...fixes, choisie];
  const matieres = [...new Set(nouvelles.map((r) => r.split('/')[0]))];

  await context.env.DB.prepare(
    'UPDATE seances SET lecons = ?, matieres = ?, choisi_le = ?, maj_le = ? WHERE id = ?',
  ).bind(JSON.stringify(nouvelles), JSON.stringify(matieres), maintenant(), maintenant(), id).run();

  return json({ id, lecons: nouvelles, matieres, choisi_le: maintenant() });
});
