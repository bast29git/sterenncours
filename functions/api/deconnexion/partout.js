/**
 * A14 : POST /api/deconnexion/partout : invalide toutes les sessions de son propre rôle,
 * sauf celle qui fait la demande. Utile après un code partagé par erreur.
 */
import { json, gerer, exigerSession } from '../../_commun.js';

export const onRequestPost = gerer(async (context) => {
  const session = await exigerSession(context);
  const { SESSIONS } = context.env;
  let fermees = 0;
  let curseur;
  do {
    const page = await SESSIONS.list({ prefix: 'session:', cursor: curseur, limit: 500 });
    for (const k of page.keys) {
      const jeton = k.name.slice('session:'.length);
      if (jeton === session.jeton) continue;
      const brut = await SESSIONS.get(k.name);
      let d = null; try { d = JSON.parse(brut); } catch (e) { d = null; }
      if (d && d.role === session.role) { await SESSIONS.delete(k.name); fermees += 1; }
    }
    curseur = page.list_complete ? null : page.cursor;
  } while (curseur);
  return json({ fermees });
});
