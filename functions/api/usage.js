/**
 * A52 : compteurs d'usage par jour.
 *   POST /api/usage { cle }  : une action de plus aujourd'hui (fiche, serie, jeu, message, opale, connexion)
 *   GET  /api/usage?jours=14 : les compteurs des derniers jours (professeur)
 */
import { json, erreur, gerer, exigerSession, exigerProf } from '../_commun.js';

const CLES = ['fiche', 'serie', 'jeu', 'message', 'opale', 'connexion', 'evaluation', 'perso'];

export async function compter(env, cle) {
  try {
    const jour = new Date().toISOString().slice(0, 10);
    await env.DB.prepare('INSERT INTO usage (jour, cle, n) VALUES (?, ?, 1) ON CONFLICT(jour, cle) DO UPDATE SET n = n + 1').bind(jour, cle).run();
  } catch (e) { /* table absente avant la migration */ }
}

export const onRequestPost = gerer(async (context) => {
  await exigerSession(context);
  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }
  const cle = String(corps && corps.cle || '');
  if (!CLES.includes(cle)) return erreur('Compteur inconnu.');
  await compter(context.env, cle);
  return json({ cle, compte: true });
});

export const onRequestGet = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const url = new URL(context.request.url);
  const jours = Math.min(90, Math.max(1, Number(url.searchParams.get('jours')) || 14));
  const depuis = new Date(Date.now() - jours * 86400000).toISOString().slice(0, 10);
  try {
    const r = await context.env.DB.prepare('SELECT jour, cle, n FROM usage WHERE jour >= ? ORDER BY jour').bind(depuis).all();
    return json({ usage: r.results || [] });
  } catch (e) { return json({ usage: [] }); }
});
