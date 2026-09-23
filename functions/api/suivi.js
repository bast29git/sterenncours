/**
 * PUT /api/suivi : positionne une leçon sur l'échelle des quatre niveaux.
 * Réservé à l'espace professeur : l'élève ne se note pas elle-même.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant } from '../_commun.js';

const NIVEAUX = ['insuffisant', 'fragile', 'satisfaisant', 'tresbien'];

export const onRequestPut = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const { DB } = context.env;

  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }
  const { matiere, ref, niveau, note } = corps || {};
  if (!matiere || !ref) return erreur('matiere et ref sont requis.');
  if (niveau && !NIVEAUX.includes(niveau)) return erreur('Niveau inconnu.');

  const cle = matiere + '/' + ref;
  if (!niveau) {
    await DB.prepare('DELETE FROM suivi WHERE cle = ?').bind(cle).run();
    return json({ cle, niveau: null });
  }

  await DB.prepare(
    `INSERT INTO suivi (cle, matiere, ref, niveau, note, maj_le, maj_par)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(cle) DO UPDATE SET niveau = excluded.niveau, note = excluded.note,
       maj_le = excluded.maj_le, maj_par = excluded.maj_par`,
  ).bind(cle, matiere, ref, niveau, note || null, maintenant(), session.role).run();

  return json({ cle, niveau, maj_le: maintenant() });
});
