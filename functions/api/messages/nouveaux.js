/**
 * B99 : GET /api/messages/nouveaux?depuis=<iso> : ce qu'il faut à la sonde, sans charger les messages.
 * Répond le nombre de messages non lus de l'autre espace, la date du dernier message visible, et par fil.
 */
import { json, gerer, exigerSession, maintenant, methodeNonPermise } from '../../_commun.js';
import { dateHeureIso } from '../../_valider.js';

export const onRequest = methodeNonPermise(['GET']);
export const onRequestGet = gerer(async (context) => {
  const session = await exigerSession(context);
  const depuis = dateHeureIso(new URL(context.request.url).searchParams.get('depuis'));
  const now = maintenant();
  const DB = context.env.DB;
  const [nonLus, dernier, parFil, recents] = await Promise.all([
    DB.prepare('SELECT COUNT(*) AS n FROM messages WHERE auteur != ? AND lu_le IS NULL AND (envoyer_le IS NULL OR envoyer_le <= ?)').bind(session.role, now).first().catch(() => ({ n: 0 })),
    DB.prepare('SELECT MAX(cree_le) AS le FROM messages WHERE envoyer_le IS NULL OR envoyer_le <= ? OR auteur = ?').bind(now, session.role).first().catch(() => ({ le: null })),
    DB.prepare('SELECT fil, COUNT(*) AS n FROM messages WHERE auteur != ? AND lu_le IS NULL AND (envoyer_le IS NULL OR envoyer_le <= ?) GROUP BY fil').bind(session.role, now).all().catch(() => ({ results: [] })),
    depuis ? DB.prepare('SELECT COUNT(*) AS n FROM messages WHERE cree_le > ? AND (envoyer_le IS NULL OR envoyer_le <= ? OR auteur = ?)').bind(depuis, now, session.role).first().catch(() => ({ n: 0 })) : Promise.resolve({ n: 0 }),
  ]);
  const fils = {};
  for (const l of parFil.results || []) fils[l.fil || 'general'] = l.n;
  return json({ nonLus: (nonLus && nonLus.n) || 0, dernier: (dernier && dernier.le) || null, fils, nouveaux: (recents && recents.n) || 0, serveur_le: now });
});
