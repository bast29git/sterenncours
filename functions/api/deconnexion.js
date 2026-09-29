/** POST /api/deconnexion : invalide la session côté serveur. B53 : la déconnexion est journalisée. */
import { json, lireSession, supprimerSession, cookieSession, journaliser, methodeNonPermise } from '../_commun.js';

export const onRequest = methodeNonPermise(['POST']);
export async function onRequestPost(context) {
  const session = await lireSession(context.request, context.env);
  if (session) {
    await supprimerSession(context.env, session.jeton);
    await journaliser(context.env, session, 'deconnexion', session.role, null, 'volontaire');
  }
  return json({ deconnecte: true }, 200, { 'set-cookie': cookieSession('', 0) });
}
