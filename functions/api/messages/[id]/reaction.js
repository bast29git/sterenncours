/**
 * POST /api/messages/:id/reaction : réagir à un message avec un émoji, ou
 * retirer sa réaction si elle existe déjà (bascule). Une réaction par émoji et
 * par espace. La liste des émojis autorisés est fermée.
 */
import { json, erreur, gerer, exigerSession, maintenant } from '../../../_commun.js';

export const REACTIONS = ['👍', '❤️', '🎉', '👏', '😂', '🤔', '💪', '⭐'];

export const onRequestPost = gerer(async (context) => {
  const session = await exigerSession(context);
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur('Identifiant invalide.');
  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }
  const emoji = String(corps && corps.emoji || '');
  if (!REACTIONS.includes(emoji)) return erreur('Réaction inconnue.');
  const { DB } = context.env;
  const message = await DB.prepare('SELECT id FROM messages WHERE id = ?').bind(id).first();
  if (!message) return erreur('Message introuvable.', 404);

  const existante = await DB.prepare(
    'SELECT 1 AS x FROM reactions WHERE message_id = ? AND auteur = ? AND emoji = ?',
  ).bind(id, session.role, emoji).first();
  if (existante) {
    await DB.prepare('DELETE FROM reactions WHERE message_id = ? AND auteur = ? AND emoji = ?').bind(id, session.role, emoji).run();
  } else {
    await DB.prepare('INSERT INTO reactions (message_id, auteur, emoji, cree_le) VALUES (?, ?, ?, ?)').bind(id, session.role, emoji, maintenant()).run();
  }
  const r = await DB.prepare('SELECT auteur, emoji FROM reactions WHERE message_id = ?').bind(id).all();
  const reactions = {};
  for (const l of r.results || []) (reactions[l.emoji] || (reactions[l.emoji] = [])).push(l.auteur);
  return json({ id, emoji, ajoutee: !existante, reactions });
});
