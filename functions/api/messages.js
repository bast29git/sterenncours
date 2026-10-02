/**
 * Messagerie entre les deux espaces.
 *   GET    /api/messages?apres=<iso>            les messages depuis une date (sonde)
 *   GET    /api/messages?avant=<iso>&limite=50  les messages plus anciens (pagination vers le passé)
 *   GET    /api/messages?fil=<matiere>&q=<mot>  filtre par fil et recherche plein texte côté serveur
 *   POST   /api/messages                        envoie un message
 *   PATCH  /api/messages { ids? }               marque comme lus ceux de l'autre espace (tous, ou une liste)
 *   DELETE /api/messages?fil=<id|general>       efface toute une discussion (professeur)
 */
import { json, erreur, gerer, exigerSession, maintenant, nouvelId, MESSAGES, journaliser, methodeNonPermise } from '../_commun.js';
import { lireCorps, paragraphe, estVide, entier, dateHeureIso, identifiant, liste, matiere as validerMatiere } from '../_valider.js';
import { PROGRAMME } from '../_programme.js';
import { compter } from './usage.js';

export const onRequest = methodeNonPermise(['GET', 'POST', 'PATCH', 'DELETE']);
const LONGUEUR_MAX = 2000;
const FARCES = ['tarte', 'neige', 'confettis', 'coeurs', 'feu'];
export const FARCE_DELAI = 20000;
const MATIERES = new Set(PROGRAMME.map((m) => m.id));
const CONTEXTE = /^[^\u0000-\u001F<>]{1,120}$/;

/** Les réactions des messages listés, regroupées par message puis par émoji. */
async function joindreReactions(DB, messages) {
  const parMessage = {};
  if (messages.length) {
    try {
      const ids = messages.map((m) => m.id);
      const marques = ids.map(() => '?').join(',');
      const r = await DB.prepare(`SELECT message_id, auteur, emoji FROM reactions WHERE message_id IN (${marques})`).bind(...ids).all();
      for (const l of r.results || []) {
        const m = parMessage[l.message_id] || (parMessage[l.message_id] = {});
        (m[l.emoji] || (m[l.emoji] = [])).push(l.auteur);
      }
    } catch (e) { /* table absente avant la migration */ }
  }
  for (const m of messages) m.reactions = parMessage[m.id] || {};
  return messages;
}

export const onRequestGet = gerer(async (context) => {
  const session = await exigerSession(context);
  const url = new URL(context.request.url);
  const apres = dateHeureIso(url.searchParams.get('apres'));
  const avant = dateHeureIso(url.searchParams.get('avant'));
  // B67 : la taille de page est bornée ; B68, B69 : fil et recherche sont appliqués par la base, pas par le navigateur.
  const limite = entier(url.searchParams.get('limite'), 1, 200, avant ? 50 : 100);
  const fil = url.searchParams.get('fil') === 'general' ? 'general' : validerMatiere(url.searchParams.get('fil'));
  const q = String(url.searchParams.get('q') || '').trim().slice(0, 80);

  const now = maintenant();
  const conditions = ['(envoyer_le IS NULL OR envoyer_le <= ? OR auteur = ?)'];
  const valeurs = [now, session.role];
  if (apres) { conditions.push('cree_le > ?'); valeurs.push(apres); }
  if (avant) { conditions.push('cree_le < ?'); valeurs.push(avant); }
  if (fil === 'general') conditions.push('fil IS NULL');
  else if (fil) { conditions.push('fil = ?'); valeurs.push(fil); }
  if (q) { conditions.push("texte LIKE ? ESCAPE '\\'"); valeurs.push('%' + q.replace(/[\\%_]/g, (c) => '\\' + c) + '%'); }
  const ordre = apres ? 'ASC' : 'DESC';
  let results;
  try {
    results = (await context.env.DB.prepare(`SELECT * FROM messages WHERE ${conditions.join(' AND ')} ORDER BY cree_le ${ordre} LIMIT ?`).bind(...valeurs, limite + 1).all()).results || [];
  } catch (e) {
    // Avant la migration 0007 : sans colonne « envoyer_le ».
    const sansDiffere = conditions.slice(1); const v = valeurs.slice(2);
    results = (await context.env.DB.prepare(`SELECT * FROM messages ${sansDiffere.length ? 'WHERE ' + sansDiffere.join(' AND ') : ''} ORDER BY cree_le ${ordre} LIMIT ?`).bind(...v, limite + 1).all()).results || [];
  }
  // B70 : « suite » dit s'il reste des messages au-delà de la page.
  const suite = results.length > limite;
  const page = suite ? results.slice(0, limite) : results;
  const messages = apres ? page : page.reverse();
  await joindreReactions(context.env.DB, messages);
  return json({ messages, suite, limite, fil: fil || null, q: q || null });
});

export const onRequestPost = gerer(async (context) => {
  const session = await exigerSession(context);
  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);

  // B71, B100 : texte nettoyé, et un message fait d'espaces ou de caractères invisibles est vide.
  const texte = paragraphe(corps.texte, LONGUEUR_MAX + 1);
  if (estVide(texte)) return erreur('Message vide.', 400, 'invalide', 'texte');
  if (texte.length > LONGUEUR_MAX) return erreur('Message trop long.', 400, 'invalide', 'texte');
  // B73, B74 : le contexte est une courte étiquette ; une farce doit exister dans la liste.
  const contexte = corps.contexte ? String(corps.contexte).slice(0, 120) : null;
  if (contexte && !CONTEXTE.test(contexte)) return erreur('Contexte invalide.', 400, 'invalide', 'contexte');
  const farce = contexte && contexte.startsWith('farce:') ? contexte.slice(6) : null;
  if (farce && !FARCES.includes(farce)) return erreur('Cette farce n\'existe pas.', 400, 'invalide', 'contexte');
  // B76 : un fil est une matière du programme, ou rien.
  const fil = corps.fil ? validerMatiere(corps.fil) : null;
  if (corps.fil && (!fil || !MATIERES.has(fil))) return erreur('Ce fil n\'existe pas.', 400, 'invalide', 'fil');
  // Envoi différé : une date future, sept jours au plus.
  let envoyerLe = null;
  if (corps.envoyer_le) {
    const d = new Date(String(corps.envoyer_le));
    if (Number.isNaN(d.getTime())) return erreur('Date d\'envoi invalide.', 400, 'invalide', 'envoyer_le');
    if (d.getTime() > Date.now() + 7 * 86400000) return erreur('Un envoi se programme sept jours à l\'avance au plus.', 400, 'invalide', 'envoyer_le');
    if (d.getTime() > Date.now()) envoyerLe = d.toISOString();
  }
  // Réponse citée : le message cité doit exister et être visible de l'auteur (B77).
  let reponseA = null;
  if (corps.reponse_a) {
    const idCite = identifiant(corps.reponse_a);
    if (!idCite) return erreur('Message cité invalide.', 400, 'invalide', 'reponse_a');
    const cite = await context.env.DB.prepare('SELECT id, auteur, envoyer_le FROM messages WHERE id = ?').bind(idCite).first();
    if (!cite) return erreur('Message cité introuvable.', 404);
    if (cite.auteur !== session.role && cite.envoyer_le && cite.envoyer_le > maintenant()) return erreur('Ce message n\'est pas encore visible.', 403);
    reponseA = idCite;
  }
  const DB = context.env.DB;
  // B72 : le même texte envoyé deux fois en dix secondes est un double clic, pas un second message.
  const dernier = await DB.prepare('SELECT id, texte, cree_le FROM messages WHERE auteur = ? ORDER BY cree_le DESC LIMIT 1').bind(session.role).first().catch(() => null);
  if (dernier && dernier.texte === texte && !farce && Date.now() - new Date(dernier.cree_le).getTime() < 10000) return erreur(MESSAGES.doublon, 409, 'doublon');
  // B75, B201 : une farce toutes les vingt secondes au plus. Le stockage clé-valeur n'accepte pas une durée de vie
  // sous soixante secondes : on garde l'heure du dernier envoi une minute et on compare.
  if (farce && context.env.SESSIONS) {
    const cle = 'farce:' + session.role;
    const dernier = Number(await context.env.SESSIONS.get(cle)) || 0;
    if (Date.now() - dernier < FARCE_DELAI) return erreur('Une farce à la fois : attends vingt secondes.', 429, 'trop_vite');
    await context.env.SESSIONS.put(cle, String(Date.now()), { expirationTtl: 60 });
  }

  const message = {
    id: nouvelId(), auteur: session.role, texte, contexte, fil,
    cree_le: envoyerLe || maintenant(), lu_le: null, envoyer_le: envoyerLe, reponse_a: reponseA,
  };
  try {
    await DB.prepare(
      'INSERT INTO messages (id, auteur, texte, contexte, fil, cree_le, envoyer_le, reponse_a) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ).bind(message.id, message.auteur, message.texte, message.contexte, message.fil, message.cree_le, message.envoyer_le, message.reponse_a).run();
  } catch (e) {
    if (envoyerLe || reponseA) return erreur('La base n\'accepte pas encore l\'envoi différé : le message est à envoyer normalement.');
    await DB.prepare(
      'INSERT INTO messages (id, auteur, texte, contexte, fil, cree_le) VALUES (?, ?, ?, ?, ?, ?)',
    ).bind(message.id, message.auteur, message.texte, message.contexte, message.fil, message.cree_le).run();
  }
  message.reactions = {};
  await compter(context.env, farce ? 'farce' : 'message');
  return json(message, 201);
});

/** B78, B79 : tout marquer comme lu, ou seulement une liste d'identifiants ; le nombre est renvoyé. */
export const onRequestPatch = gerer(async (context) => {
  const session = await exigerSession(context);
  const now = maintenant();
  const corps = (await lireCorps(context.request)) || {};
  const ids = liste(corps.ids, 200).map(identifiant).filter(Boolean);
  let r;
  try {
    r = ids.length
      ? await context.env.DB.prepare(`UPDATE messages SET lu_le = ? WHERE auteur != ? AND lu_le IS NULL AND (envoyer_le IS NULL OR envoyer_le <= ?) AND id IN (${ids.map(() => '?').join(',')})`).bind(now, session.role, now, ...ids).run()
      : await context.env.DB.prepare('UPDATE messages SET lu_le = ? WHERE auteur != ? AND lu_le IS NULL AND (envoyer_le IS NULL OR envoyer_le <= ?)').bind(now, session.role, now).run();
  } catch (e) {
    r = await context.env.DB.prepare('UPDATE messages SET lu_le = ? WHERE auteur != ? AND lu_le IS NULL').bind(now, session.role).run();
  }
  return json({ lus: true, n: (r && r.meta && r.meta.changes) || 0 });
});

/** Le professeur efface une discussion entière : le fil d'une matière, ou le fil général. B80, B81 : un seul lot, journalisé. */
export const onRequestDelete = gerer(async (context) => {
  const session = await exigerSession(context);
  if (session.role !== 'prof') return erreur('Seul le professeur peut effacer une discussion.', 403);
  const fil = new URL(context.request.url).searchParams.get('fil') || 'general';
  if (!/^[a-z0-9-]{1,30}$/.test(fil)) return erreur(MESSAGES.identifiant_invalide, 400, 'invalide', 'fil');
  const DB = context.env.DB;
  const ids = fil === 'general' ? await DB.prepare('SELECT id FROM messages WHERE fil IS NULL').all() : await DB.prepare('SELECT id FROM messages WHERE fil = ?').bind(fil).all();
  const liste2 = (ids.results || []).map((x) => x.id);
  const lot = [];
  for (let i = 0; i < liste2.length; i += 50) {
    const tranche = liste2.slice(i, i + 50);
    lot.push(DB.prepare(`DELETE FROM reactions WHERE message_id IN (${tranche.map(() => '?').join(',')})`).bind(...tranche));
  }
  lot.push(fil === 'general' ? DB.prepare('DELETE FROM messages WHERE fil IS NULL') : DB.prepare('DELETE FROM messages WHERE fil = ?').bind(fil));
  try { await DB.batch(lot); } catch (e) { for (const req of lot) await req.run().catch(() => {}); }
  await journaliser(context.env, session, 'messages', fil, `${liste2.length} message(s)`, 'discussion effacée');
  return json({ effaces: liste2.length, fil });
});
