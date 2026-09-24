/**
 * DELETE /api/felicitations/:id : retirer une félicitation envoyée par erreur,
 * dans les dix minutes (professeur). L'étoile associée disparaît avec elle.
 */
import { json, erreur, gerer, exigerSession, exigerProf, MESSAGES } from '../../_commun.js';

export const onRequestDelete = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur(MESSAGES.identifiant_invalide);
  const { DB } = context.env;
  const f = await DB.prepare('SELECT id, cree_le FROM felicitations WHERE id = ?').bind(id).first();
  if (!f) return erreur('Félicitation introuvable.', 404);
  if (Date.now() - new Date(f.cree_le).getTime() > 10 * 60 * 1000) return erreur('Une félicitation se retire dans les dix minutes.');
  await DB.prepare('DELETE FROM felicitations WHERE id = ?').bind(id).run();
  return json({ id, supprimee: true });
});
