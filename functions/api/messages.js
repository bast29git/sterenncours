/**
 * Messagerie entre les deux espaces.
 *   GET   /api/messages?apres=<iso>  liste les messages
 *   POST  /api/messages              envoie un message
 *   PATCH /api/messages              marque comme lus ceux de l'autre espace
 */
import { json, erreur, gerer, exigerSession, maintenant, nouvelId } from '../_commun.js';
import { compter } from './usage.js';

const LONGUEUR_MAX = 2000;

export const onRequestGet = gerer(async (context) => {
  const session = await exigerSession(context);
  const url = new URL(context.request.url);
  const apres = url.searchParams.get('apres');

  // Un message différé n'existe pour l'autre espace qu'à partir de son heure d'envoi.
  const now = maintenant();
  const visible = '(envoyer_le IS NULL OR envoyer_le <= ? OR auteur = ?)';
  const requete = apres
    ? context.env.DB.prepare(
      `SELECT * FROM messages WHERE cree_le > ? AND ${visible} ORDER BY cree_le ASC LIMIT 200`).bind(apres, now, session.role)
    : context.env.DB.prepare(
      `SELECT * FROM messages WHERE ${visible} ORDER BY cree_le DESC LIMIT 100`).bind(now, session.role);

  let results;
  try { results = (await requete.all()).results; } catch (e) {
    // Avant la migration 0007 : sans colonne « envoyer_le ».
    const r = apres
      ? await context.env.DB.prepare('SELECT * FROM messages WHERE cree_le > ? ORDER BY cree_le ASC LIMIT 200').bind(apres).all()
      : await context.env.DB.prepare('SELECT * FROM messages ORDER BY cree_le DESC LIMIT 100').all();
    results = r.results;
  }
  const messages = apres ? results : (results || []).reverse();

  // Réactions des messages listés, regroupées par message puis par émoji.
  const parMessage = {};
  if (messages.length) {
    try {
      const ids = messages.map((m) => m.id);
      const marques = ids.map(() => '?').join(',');
      const r = await context.env.DB.prepare(
        `SELECT message_id, auteur, emoji FROM reactions WHERE message_id IN (${marques})`,
      ).bind(...ids).all();
      for (const l of r.results || []) {
        const m = parMessage[l.message_id] || (parMessage[l.message_id] = {});
        (m[l.emoji] || (m[l.emoji] = [])).push(l.auteur);
      }
    } catch (e) { /* table absente avant la migration */ }
  }
  for (const m of messages) m.reactions = parMessage[m.id] || {};
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
  const fil = corps.fil && /^[a-z0-9-]{1,30}$/.test(String(corps.fil)) ? String(corps.fil) : null;
  // Envoi différé : une date future, sept jours au plus.
  let envoyerLe = null;
  if (corps.envoyer_le) {
    const d = new Date(String(corps.envoyer_le));
    if (Number.isNaN(d.getTime())) return erreur('Date d\'envoi invalide.');
    if (d.getTime() > Date.now() + 7 * 86400000) return erreur('Un envoi se programme sept jours à l\'avance au plus.');
    if (d.getTime() > Date.now()) envoyerLe = d.toISOString();
  }
  // Réponse citée : le message cité doit exister.
  let reponseA = null;
  if (corps.reponse_a) {
    const idCite = String(corps.reponse_a);
    if (!/^[0-9a-f]{24}$/.test(idCite)) return erreur('Message cité invalide.');
    const cite = await context.env.DB.prepare('SELECT id FROM messages WHERE id = ?').bind(idCite).first();
    if (!cite) return erreur('Message cité introuvable.', 404);
    reponseA = idCite;
  }

  const message = {
    id: nouvelId(), auteur: session.role, texte, contexte, fil,
    cree_le: envoyerLe || maintenant(), lu_le: null, envoyer_le: envoyerLe, reponse_a: reponseA,
  };
  try {
    await context.env.DB.prepare(
      'INSERT INTO messages (id, auteur, texte, contexte, fil, cree_le, envoyer_le, reponse_a) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ).bind(message.id, message.auteur, message.texte, message.contexte, message.fil, message.cree_le, message.envoyer_le, message.reponse_a).run();
  } catch (e) {
    if (envoyerLe || reponseA) return erreur('La base n\'accepte pas encore l\'envoi différé : le message est à envoyer normalement.');
    await context.env.DB.prepare(
      'INSERT INTO messages (id, auteur, texte, contexte, fil, cree_le) VALUES (?, ?, ?, ?, ?, ?)',
    ).bind(message.id, message.auteur, message.texte, message.contexte, message.fil, message.cree_le).run();
  }
  message.reactions = {};
  await compter(context.env, 'message');

  return json(message, 201);
});

export const onRequestPatch = gerer(async (context) => {
  const session = await exigerSession(context);
  const now = maintenant();
  try {
    await context.env.DB.prepare(
      'UPDATE messages SET lu_le = ? WHERE auteur != ? AND lu_le IS NULL AND (envoyer_le IS NULL OR envoyer_le <= ?)',
    ).bind(now, session.role, now).run();
  } catch (e) {
    await context.env.DB.prepare('UPDATE messages SET lu_le = ? WHERE auteur != ? AND lu_le IS NULL').bind(now, session.role).run();
  }
  return json({ lus: true });
});
