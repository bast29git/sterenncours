/**
 * Messagerie entre les deux espaces.
 *   GET   /api/messages?apres=<iso>  liste les messages
 *   POST  /api/messages              envoie un message
 *   PATCH /api/messages              marque comme lus ceux de l'autre espace
 */
import { json, erreur, gerer, exigerSession, maintenant, nouvelId } from '../_commun.js';

const LONGUEUR_MAX = 2000;

export const onRequestGet = gerer(async (context) => {
  await exigerSession(context);
  const url = new URL(context.request.url);
  const apres = url.searchParams.get('apres');

  const requete = apres
    ? context.env.DB.prepare(
      'SELECT * FROM messages WHERE cree_le > ? ORDER BY cree_le ASC LIMIT 200').bind(apres)
    : context.env.DB.prepare(
      'SELECT * FROM messages ORDER BY cree_le DESC LIMIT 100');

  const { results } = await requete.all();
  const messages = apres ? results : (results || []).reverse();
  return json({ messages });
});

export const onRequestPost = gerer(async (context) => {
  const session = await exigerSession(context);
  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }

  const texte = String(corps && corps.texte || '').trim();
  if (!texte) return erreur('Message vide.');
  if (texte.length > LONGUEUR_MAX) return erreur('Message trop long.');
  const contexte = corps.contexte ? String(corps.contexte).slice(0, 120) : null;

  const message = {
    id: nouvelId(), auteur: session.role, texte, contexte,
    cree_le: maintenant(), lu_le: null,
  };
  await context.env.DB.prepare(
    'INSERT INTO messages (id, auteur, texte, contexte, cree_le) VALUES (?, ?, ?, ?, ?)',
  ).bind(message.id, message.auteur, message.texte, message.contexte, message.cree_le).run();

  return json(message, 201);
});

export const onRequestPatch = gerer(async (context) => {
  const session = await exigerSession(context);
  await context.env.DB.prepare(
    'UPDATE messages SET lu_le = ? WHERE auteur != ? AND lu_le IS NULL',
  ).bind(maintenant(), session.role).run();
  return json({ lus: true });
});
