/**
 * PUT /api/ouvertures : ouvrir une leçon à Sterenn, la retenir, ou revenir
 * à la règle automatique.
 *
 * Trois états possibles :
 *   { ouvert: true }   la leçon est poussée, quoi qu'en dise la règle
 *   { ouvert: false }  la leçon est retenue, même si la règle l'ouvrirait
 *   { ouvert: null }   on efface la décision, la règle automatique reprend
 *
 * Réservé à l'espace professeur : c'est lui qui décide du rythme.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, journaliser, MESSAGES } from '../_commun.js';

export const onRequestPut = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const { DB } = context.env;

  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur(MESSAGES.requete_invalide); }
  const { matiere, ref } = corps || {};
  if (!matiere || !ref) return erreur('matiere et ref sont requis.');
  if (!/^[a-z0-9-]+$/.test(matiere) || !/^[A-Za-z0-9]+$/.test(ref)) return erreur('Identifiants invalides.');

  const cle = matiere + '/' + ref;
  const ouvert = corps.ouvert;

  const avant = await DB.prepare('SELECT etat FROM ouvertures WHERE cle = ?').bind(cle).first().catch(() => null);
  if (ouvert === null || ouvert === undefined) {
    await DB.prepare('DELETE FROM ouvertures WHERE cle = ?').bind(cle).run();
    await journaliser(context.env, session, 'ouverture', cle, avant, null);
    return json({ cle, ouvert: null });
  }
  if (typeof ouvert !== 'boolean') return erreur('ouvert doit valoir true, false ou null.');

  await DB.prepare(
    `INSERT INTO ouvertures (cle, matiere, ref, etat, maj_le) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(cle) DO UPDATE SET etat = excluded.etat, maj_le = excluded.maj_le`,
  ).bind(cle, matiere, ref, ouvert ? 1 : 0, maintenant()).run();

  await journaliser(context.env, session, 'ouverture', cle, avant, { ouvert });
  return json({ cle, ouvert });
});
