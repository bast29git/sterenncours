/**
 * POST /api/seances/:id/choix : Sterenn choisit la leçon qu'elle veut travailler.
 *
 * Accessible aux deux espaces. La leçon proposée doit faire partie des choix
 * enregistrés sur la séance : on ne peut pas choisir n'importe quoi.
 */
import { json, erreur, gerer, exigerSession, maintenant, MESSAGES, journaliser, methodeNonPermise } from '../../../_commun.js';
import { lireCorps, identifiant } from '../../../_valider.js';

export const onRequest = methodeNonPermise(['POST']);
export const onRequestPost = gerer(async (context) => {
  const session = await exigerSession(context);
  const id = identifiant(context.params.id);
  if (!id) return erreur(MESSAGES.identifiant_invalide, 400, 'invalide', 'id');

  const seance = await context.env.DB.prepare('SELECT * FROM seances WHERE id = ?').bind(id).first();
  if (!seance) return erreur('Séance introuvable.', 404);
  // B135 : une séance déjà faite ne se rechoisit pas.
  if (seance.statut === 'faite') return erreur('Cette séance est déjà faite : le choix ne change plus.', 409, 'conflit');

  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  const choisie = String(corps.lecon || '');

  let choix = [];
  try { choix = JSON.parse(seance.choix || '[]'); } catch (e) { choix = []; }
  if (!choix.length) return erreur('Cette séance ne propose pas de choix.', 400, 'invalide', 'lecon');
  if (!choix.includes(choisie)) return erreur('Cette leçon ne fait pas partie des choix proposés.', 400, 'invalide', 'lecon');

  let lecons = [];
  try { lecons = JSON.parse(seance.lecons || '[]'); } catch (e) { lecons = []; }
  const fixes = lecons.filter((r) => !choix.includes(r));
  const nouvelles = [...fixes, choisie];
  const matieres = [...new Set(nouvelles.map((r) => r.split('/')[0]))];

  const quand = maintenant();
  await context.env.DB.prepare(
    'UPDATE seances SET lecons = ?, matieres = ?, choisi_le = ?, maj_le = ? WHERE id = ?',
  ).bind(JSON.stringify(nouvelles), JSON.stringify(matieres), quand, quand, id).run();
  // B136 : le choix est journalisé.
  await journaliser(context.env, session, 'choix', id, seance.choisi_le ? lecons.filter((r) => choix.includes(r)).join(',') : null, choisie);
  return json({ id, lecons: nouvelles, matieres, choisi_le: quand });
});
