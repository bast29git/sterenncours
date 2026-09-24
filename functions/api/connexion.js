/**
 * POST /api/connexion : échange un code d'accès contre une session.
 *
 * Le code n'est jamais comparé en clair : KV ne contient qu'une dérivation
 * PBKDF2 avec sel, écrite au provisionnement. Les tentatives sont limitées
 * par adresse pour qu'un code court ne puisse pas être trouvé par essais.
 */
import { json, erreur, gerer, creerSession, cookieSession, deriver, egal, DUREE_SESSION, ROLES, MESSAGES, journaliser } from '../_commun.js';
import { compter } from './usage.js';

const MAX_TENTATIVES = 12;
const FENETRE = 600; // 10 minutes

export const onRequestPost = gerer(async (context) => {
  const { request, env } = context;
  if (!env.SESSIONS) return erreur('Stockage des sessions non configuré.', 503);

  const ip = request.headers.get('cf-connecting-ip') || 'inconnue';
  const cleLimite = 'tentatives:' + ip;
  const tentatives = parseInt(await env.SESSIONS.get(cleLimite) || '0', 10);
  if (tentatives >= MAX_TENTATIVES) {
    return erreur('Trop de tentatives. Réessaie dans quelques minutes.', 429);
  }

  let corps;
  try { corps = await request.json(); } catch (e) { return erreur(MESSAGES.requete_invalide); }
  const code = String(corps && corps.code || '').trim().toLowerCase();
  if (!code || code.length > 64) return erreur('Code manquant.');

  for (const role of ROLES) {
    const brut = await env.SESSIONS.get('auth:' + role);
    if (!brut) continue;
    const { sel, iterations, empreinte } = JSON.parse(brut);
    const candidat = await deriver(code, sel, iterations);
    if (egal(candidat, empreinte)) {
      await env.SESSIONS.delete(cleLimite);
      const jeton = await creerSession(env, role);
      if (env.DB) {
        await compter(env, 'connexion');
        // A18 : journal des connexions : rôle, heure, empreinte de navigateur tronquée ; purge à trente jours.
        try {
          const agent = String(request.headers.get('user-agent') || '').replace(/\s+/g, ' ').slice(0, 60);
          const pays = request.headers.get('cf-ipcountry') || '';
          await journaliser(env, { role }, 'connexion', role, null, (agent || 'navigateur inconnu') + (pays ? ' · ' + pays : ''));
          await env.DB.prepare('DELETE FROM journal WHERE quoi = ? AND quand < ?').bind('connexion', new Date(Date.now() - 30 * 86400000).toISOString()).run();
        } catch (e) { /* le journal ne bloque jamais la connexion */ }
      }
      return json({ role }, 200, { 'set-cookie': cookieSession(jeton, DUREE_SESSION) });
    }
  }

  await env.SESSIONS.put(cleLimite, String(tentatives + 1), { expirationTtl: FENETRE });
  return erreur('Ce code n\'est pas reconnu.', 401);
});
