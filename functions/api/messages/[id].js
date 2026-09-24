/**
 * DELETE /api/messages/:id : retirer son propre message envoyé par erreur,
 * dans les cinq minutes qui suivent l'envoi (ou tant qu'il est différé).
 */
import { json, erreur, gerer, exigerSession, MESSAGES } from '../../_commun.js';

const DELAI_MS = 5 * 60 * 1000;

export const onRequestDelete = gerer(async (context) => {
  const session = await exigerSession(context);
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur(MESSAGES.identifiant_invalide);
  const { DB } = context.env;
  const m = await DB.prepare('SELECT * FROM messages WHERE id = ?').bind(id).first();
  if (!m) return erreur('Message introuvable.', 404);
  if (m.auteur !== session.role) return erreur('Ce message n\'est pas le tien.', 403);
  const differe = m.envoyer_le && m.envoyer_le > new Date().toISOString();
  if (!differe && Date.now() - new Date(m.cree_le).getTime() > DELAI_MS) return erreur('Un message se retire dans les cinq minutes qui suivent son envoi.');
  await DB.prepare('DELETE FROM reactions WHERE message_id = ?').bind(id).run().catch(() => {});
  await DB.prepare('DELETE FROM messages WHERE id = ?').bind(id).run();
  return json({ id, supprime: true });
});
