/**
 * POST /api/messages/:id/reaction : réagir à un message avec un émoji, ou
 * retirer sa réaction si elle existe déjà (bascule). Une réaction par émoji et
 * par espace. La liste des émojis autorisés est fermée.
 */
import { json, erreur, gerer, exigerSession, maintenant, MESSAGES, methodeNonPermise } from '../../../_commun.js';
import { lireCorps } from '../../../_valider.js';

export const onRequest = methodeNonPermise(['POST']);
const REACTIONS_PAR_AUTEUR = 3;

/* C57 : six autocollants d'opale dessinés dans la charte, en plus des émojis. */
export const AUTOCOLLANTS = [':opale-bravo:', ':opale-coeur:', ':opale-idee:', ':opale-etoile:', ':opale-rire:', ':opale-force:'];
export const REACTIONS = ['👍', '❤️', '🎉', '👏', '😂', '🤔', '💪', '⭐'].concat(AUTOCOLLANTS);

export const onRequestPost = gerer(async (context) => {
  const session = await exigerSession(context);
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur(MESSAGES.identifiant_invalide);
  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  const emoji = String(corps.emoji || '');
  if (!REACTIONS.includes(emoji)) return erreur('Réaction inconnue.', 400, 'invalide', 'emoji');
  const { DB } = context.env;
  const message = await DB.prepare('SELECT id FROM messages WHERE id = ?').bind(id).first();
  if (!message) return erreur('Message introuvable.', 404);

  const existante = await DB.prepare(
    'SELECT 1 AS x FROM reactions WHERE message_id = ? AND auteur = ? AND emoji = ?',
  ).bind(id, session.role, emoji).first();
  if (existante) {
    await DB.prepare('DELETE FROM reactions WHERE message_id = ? AND auteur = ? AND emoji = ?').bind(id, session.role, emoji).run();
  } else {
    // B85 : trois réactions différentes au plus par personne et par message.
    const deja = await DB.prepare('SELECT COUNT(*) AS n FROM reactions WHERE message_id = ? AND auteur = ?').bind(id, session.role).first();
    if (deja && deja.n >= REACTIONS_PAR_AUTEUR) return erreur(`Trois réactions au plus sur un message.`, 400, 'plafond', 'emoji');
    await DB.prepare('INSERT INTO reactions (message_id, auteur, emoji, cree_le) VALUES (?, ?, ?, ?)').bind(id, session.role, emoji, maintenant()).run();
  }
  const r = await DB.prepare('SELECT auteur, emoji FROM reactions WHERE message_id = ?').bind(id).all();
  const reactions = {};
  for (const l of r.results || []) (reactions[l.emoji] || (reactions[l.emoji] = [])).push(l.auteur);
  return json({ id, emoji, ajoutee: !existante, reactions });
});
