/** POST /api/deconnexion : invalide la session côté serveur. */
import { json, lireSession, supprimerSession, cookieSession } from '../_commun.js';

export async function onRequestPost(context) {
  const session = await lireSession(context.request, context.env);
  if (session) await supprimerSession(context.env, session.jeton);
  return json({ deconnecte: true }, 200, { 'set-cookie': cookieSession('', 0) });
}
