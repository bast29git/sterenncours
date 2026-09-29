/**
 * B187 : GET /api/sante : chaque liaison est réellement sollicitée, avec sa durée.
 *   base (SELECT 1), sessions KV (lecture), fichiers R2 (liste d'un objet), IA (présence de la liaison).
 * Réservé au professeur ; la sauvegarde nocturne peut aussi l'appeler pour surveiller le site.
 */
import { json, gerer, exigerSession, exigerProf, methodeNonPermise } from '../_commun.js';
import { VERSION, DEPLOYE_LE } from '../_programme.js';

export const onRequest = methodeNonPermise(['GET']);
async function mesurer(nom, fn) {
  const t0 = Date.now();
  try { await fn(); return { nom, ok: true, ms: Date.now() - t0 }; } catch (e) { return { nom, ok: false, ms: Date.now() - t0, erreur: String((e && e.message) || e).slice(0, 120) }; }
}
export const onRequestGet = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const { env } = context;
  const controles = await Promise.all([
    mesurer('base', () => (env.DB ? env.DB.prepare('SELECT 1 AS un').first() : Promise.reject(new Error('non reliée')))),
    mesurer('sessions', () => (env.SESSIONS ? env.SESSIONS.get('auth:prof') : Promise.reject(new Error('non relié')))),
    mesurer('fichiers', () => (env.FICHIERS ? env.FICHIERS.list({ limit: 1 }) : Promise.reject(new Error('non relié')))),
    mesurer('ia', () => (env.AI ? Promise.resolve() : Promise.reject(new Error('non reliée')))),
  ]);
  const ok = controles.filter((c) => c.nom !== 'ia').every((c) => c.ok);
  return json({ ok, version: VERSION, deploye_le: DEPLOYE_LE, controles, le: new Date().toISOString() }, ok ? 200 : 503);
});
