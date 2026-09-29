/**
 * B62 : POST /api/deconnexion/tout : le professeur rend caduques toutes les sessions ouvertes
 * jusqu'ici, la sienne comprise. À utiliser si un code a été vu par quelqu'un d'autre :
 * changer le code ne ferme pas les sessions déjà ouvertes, ceci oui.
 */
import { json, gerer, exigerSession, exigerProf, journaliser, maintenant, cookieSession, methodeNonPermise } from '../../_commun.js';

export const onRequest = methodeNonPermise(['POST']);
export const onRequestPost = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const quand = maintenant();
  await context.env.SESSIONS.put('revoque_avant', quand);
  await journaliser(context.env, session, 'deconnexion', 'tous', null, 'révocation globale ' + quand);
  return json({ revoque_avant: quand }, 200, { 'set-cookie': cookieSession('', 0) });
});
