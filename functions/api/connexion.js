/**
 * POST /api/connexion : échange un code d'accès contre une session.
 *
 * Le code n'est jamais comparé en clair : KV ne contient qu'une dérivation
 * PBKDF2 avec sel, écrite au provisionnement. Les tentatives sont limitées
 * par adresse pour qu'un code court ne puisse pas être trouvé par essais.
 */
import { json, erreur, creerSession, cookieSession, deriver, egal, DUREE_SESSION, ROLES } from '../_commun.js';

const MAX_TENTATIVES = 12;
const FENETRE = 600; // 10 minutes

export async function onRequestPost(context) {
  const { request, env } = context;

  const ip = request.headers.get('cf-connecting-ip') || 'inconnue';
  const cleLimite = 'tentatives:' + ip;
  const tentatives = parseInt(await env.SESSIONS.get(cleLimite) || '0', 10);
  if (tentatives >= MAX_TENTATIVES) {
    return erreur('Trop de tentatives. Réessaie dans quelques minutes.', 429);
  }

  let corps;
  try { corps = await request.json(); } catch (e) { return erreur('Requête invalide.'); }
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
      return json({ role }, 200, { 'set-cookie': cookieSession(jeton, DUREE_SESSION) });
    }
  }

  await env.SESSIONS.put(cleLimite, String(tentatives + 1), { expirationTtl: FENETRE });
  return erreur('Ce code n\'est pas reconnu.', 401);
}
