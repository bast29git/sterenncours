/**
 *   GET    /api/messages/:id   un message et ses réactions (B83 : lien direct depuis une notification)
 *   PATCH  /api/messages/:id   corriger son propre message dans les cinq minutes (B84), { texte }
 *   DELETE /api/messages/:id   retirer son propre message envoyé par erreur, dans les cinq minutes (ou tant qu'il est différé)
 */
import { json, erreur, gerer, exigerSession, MESSAGES, maintenant, journaliser, methodeNonPermise } from '../../_commun.js';
import { lireCorps, paragraphe, estVide, identifiant } from '../../_valider.js';

export const onRequest = methodeNonPermise(['GET', 'PATCH', 'DELETE']);
const DELAI_MS = 5 * 60 * 1000;

async function charger(context) {
  const session = await exigerSession(context);
  const id = identifiant(context.params.id);
  if (!id) throw erreur(MESSAGES.identifiant_invalide, 400, 'invalide', 'id');
  const m = await context.env.DB.prepare('SELECT * FROM messages WHERE id = ?').bind(id).first();
  if (!m) throw erreur('Message introuvable.', 404);
  return { session, id, m };
}
const modifiable = (m) => (m.envoyer_le && m.envoyer_le > new Date().toISOString()) || Date.now() - new Date(m.cree_le).getTime() <= DELAI_MS;

export const onRequestGet = gerer(async (context) => {
  const { session, id, m } = await charger(context);
  if (m.auteur !== session.role && m.envoyer_le && m.envoyer_le > maintenant()) return erreur('Ce message n\'est pas encore visible.', 403);
  const r = await context.env.DB.prepare('SELECT auteur, emoji FROM reactions WHERE message_id = ?').bind(id).all().catch(() => ({ results: [] }));
  const reactions = {};
  for (const l of r.results || []) (reactions[l.emoji] || (reactions[l.emoji] = [])).push(l.auteur);
  return json({ ...m, reactions });
});

export const onRequestPatch = gerer(async (context) => {
  const { session, id, m } = await charger(context);
  if (m.auteur !== session.role) return erreur('Ce message n\'est pas le tien.', 403);
  if (!modifiable(m)) return erreur('Un message se corrige dans les cinq minutes qui suivent son envoi.', 400, 'delai');
  if (m.contexte && m.contexte.startsWith('farce:')) return erreur('Une farce ne se corrige pas.', 400, 'invalide');
  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  const texte = paragraphe(corps.texte, 2001);
  if (estVide(texte)) return erreur('Message vide.', 400, 'invalide', 'texte');
  if (texte.length > 2000) return erreur('Message trop long.', 400, 'invalide', 'texte');
  const quand = maintenant();
  try { await context.env.DB.prepare('UPDATE messages SET texte = ?, modifie_le = ? WHERE id = ?').bind(texte, quand, id).run(); } catch (e) { await context.env.DB.prepare('UPDATE messages SET texte = ? WHERE id = ?').bind(texte, id).run(); }
  return json({ id, texte, modifie_le: quand });
});

export const onRequestDelete = gerer(async (context) => {
  const { session, id, m } = await charger(context);
  if (m.auteur !== session.role) return erreur('Ce message n\'est pas le tien.', 403);
  if (!modifiable(m)) return erreur('Un message se retire dans les cinq minutes qui suivent son envoi.', 400, 'delai');
  const { DB } = context.env;
  try { await DB.batch([DB.prepare('DELETE FROM reactions WHERE message_id = ?').bind(id), DB.prepare('DELETE FROM messages WHERE id = ?').bind(id)]); } catch (e) { await DB.prepare('DELETE FROM messages WHERE id = ?').bind(id).run(); }
  // B82 : le retrait est journalisé, avec le début du texte.
  await journaliser(context.env, session, 'message', id, String(m.texte || '').slice(0, 80), 'retiré');
  return json({ id, supprime: true });
});
