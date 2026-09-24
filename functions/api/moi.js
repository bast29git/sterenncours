/**
 * GET /api/moi : qui est connecté, et l'état du déploiement.
 * Répond 200 avec role à null quand aucune session n'est ouverte : le site
 * s'en sert au démarrage, et une absence de session n'est pas une erreur.
 * Pour le professeur, la réponse porte aussi la santé (A51) : tailles des
 * tables, dernière sauvegarde, version déployée, temps de réponse moyen.
 */
import { json, gerer, lireSession } from '../_commun.js';
import { VERSION } from '../_programme.js';

async function sante(env) {
  const sortie = { version: VERSION, tables: {}, sauvegarde: null, perf: null };
  const tables = ['suivi', 'resultats', 'fiches_lues', 'ouvertures', 'messages', 'fichiers', 'seances', 'felicitations', 'acces', 'profil', 'journal', 'tuteur_journal', 'usage', 'erreurs'];
  await Promise.all(tables.map(async (t) => {
    try { const r = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${t}`).first(); sortie.tables[t] = r ? r.n : 0; } catch (e) { sortie.tables[t] = null; }
  }));
  if (env.FICHIERS) {
    try {
      const liste = await env.FICHIERS.list({ prefix: 'sauvegardes/' });
      const derniere = (liste.objects || []).sort((a, b) => String(b.key).localeCompare(String(a.key)))[0];
      if (derniere) {
        const quand = derniere.uploaded ? new Date(derniere.uploaded).toISOString() : derniere.key.replace('sauvegardes/', '').replace('.json', '');
        sortie.sauvegarde = { cle: derniere.key, quand, octets: derniere.size, age_heures: Math.round((Date.now() - new Date(quand).getTime()) / 3600000) };
      }
    } catch (e) { sortie.sauvegarde = null; }
  }
  if (env.SESSIONS) {
    try {
      const jour = new Date().toISOString().slice(0, 10);
      const brut = await env.SESSIONS.get('perf:' + jour);
      if (brut) { const p = JSON.parse(brut); sortie.perf = { n: p.n, moyenne_ms: p.n ? Math.round(p.total / p.n) : null, max_ms: p.max || null }; }
    } catch (e) { sortie.perf = null; }
  }
  return sortie;
}

export const onRequestGet = gerer(async (context) => {
  const session = await lireSession(context.request, context.env);
  // Les trois booléens disent si les ressources Cloudflare sont bien reliées.
  const relie = {
    kv: Boolean(context.env.SESSIONS),
    db: Boolean(context.env.DB),
    r2: Boolean(context.env.FICHIERS),
    ia: Boolean(context.env.AI),
  };
  if (!session) return json({ role: null, relie, version: VERSION });
  const reponse = { role: session.role, depuis: session.cree, relie, version: VERSION };
  if (session.role === 'prof' && context.env.DB) reponse.sante = await sante(context.env);
  return json(reponse);
});
