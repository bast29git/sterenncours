/**
 * B51, B52 : les sessions ouvertes, vues par le professeur.
 *   GET    /api/sessions          la liste (rôle, ouverture, dernier renouvellement, navigateur, pays)
 *   DELETE /api/sessions?id=<12 hex>   ferme une session par le début de son jeton
 */
import { json, erreur, gerer, exigerSession, exigerProf, listerSessions, journaliser, methodeNonPermise } from '../_commun.js';

export const onRequest = methodeNonPermise(['GET', 'DELETE']);
export const onRequestGet = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const sessions = await listerSessions(context.env);
  return json({ sessions: sessions.map((s) => ({ ...s, moi: session.jeton.startsWith(s.id) })), n: sessions.length });
});

export const onRequestDelete = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const id = String(new URL(context.request.url).searchParams.get('id') || '');
  if (!/^[0-9a-f]{12}$/.test(id)) return erreur('Identifiant de session invalide.', 400, 'invalide', 'id');
  const page = await context.env.SESSIONS.list({ prefix: 'session:' + id, limit: 5 });
  let fermees = 0;
  for (const k of page.keys || []) {
    if (k.name === 'session:' + session.jeton) continue;
    await context.env.SESSIONS.delete(k.name); fermees += 1;
  }
  if (!fermees) return erreur('Session introuvable, ou c\'est la tienne.', 404);
  await journaliser(context.env, session, 'deconnexion', id, null, 'fermée par le professeur');
  return json({ fermees });
});
