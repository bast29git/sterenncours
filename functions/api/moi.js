/**
 * GET /api/moi : qui est connecté.
 * Répond 200 avec role à null quand aucune session n'est ouverte : le site
 * s'en sert au démarrage, et une absence de session n'est pas une erreur.
 */
import { json, gerer, lireSession } from '../_commun.js';

export const onRequestGet = gerer(async (context) => {
  const session = await lireSession(context.request, context.env);
  // Les trois booléens disent si les ressources Cloudflare sont bien reliées.
  // Ils ne révèlent aucune donnée : ils servent au diagnostic de déploiement.
  const relie = {
    kv: Boolean(context.env.SESSIONS),
    db: Boolean(context.env.DB),
    r2: Boolean(context.env.FICHIERS),
  };
  return session
    ? json({ role: session.role, depuis: session.cree, relie })
    : json({ role: null, relie });
});
