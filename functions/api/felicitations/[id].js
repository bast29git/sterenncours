/**
 * DELETE /api/felicitations/:id : retirer une félicitation envoyée par erreur,
 * dans les dix minutes (professeur). L'étoile associée disparaît avec elle,
 * et le message miroir de la messagerie aussi (B164).
 */
import { json, erreur, gerer, exigerSession, exigerProf, MESSAGES, journaliser, methodeNonPermise } from '../../_commun.js';
import { identifiant } from '../../_valider.js';

export const onRequest = methodeNonPermise(['DELETE']);
export const onRequestDelete = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const id = identifiant(context.params.id);
  if (!id) return erreur(MESSAGES.identifiant_invalide, 400, 'invalide', 'id');
  const { DB } = context.env;
  const f = await DB.prepare('SELECT id, texte, cree_le FROM felicitations WHERE id = ?').bind(id).first();
  if (!f) return erreur('Félicitation introuvable.', 404);
  if (Date.now() - new Date(f.cree_le).getTime() > 10 * 60 * 1000) return erreur('Une félicitation se retire dans les dix minutes.', 400, 'delai');
  await DB.batch([
    DB.prepare('DELETE FROM felicitations WHERE id = ?').bind(id),
    DB.prepare('DELETE FROM messages WHERE auteur = ? AND cree_le = ? AND texte = ?').bind('prof', f.cree_le, '🏆 ' + f.texte),
  ]);
  await journaliser(context.env, session, 'felicitation', id, f.texte.slice(0, 120), 'retirée');
  return json({ id, supprimee: true });
});
