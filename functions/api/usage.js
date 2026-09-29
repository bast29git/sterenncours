/**
 * A52 : compteurs d'usage par jour.
 *   POST /api/usage { cle }  : une action de plus aujourd'hui (fiche, serie, jeu, message, opale, connexion)
 *   GET  /api/usage?jours=14 : les compteurs des derniers jours (professeur)
 */
import { json, erreur, gerer, exigerSession, exigerProf, MESSAGES, methodeNonPermise } from '../_commun.js';
import { lireCorps } from '../_valider.js';

const CLES = ['fiche', 'serie', 'jeu', 'message', 'opale', 'connexion', 'connexion_echec', 'evaluation', 'perso', 'farce', 'scan', 'fichier', 'outils', 'compagnon', 'defi'];
export const onRequest = methodeNonPermise(['GET', 'POST']);

export async function compter(env, cle) {
  try {
    const jour = new Date().toISOString().slice(0, 10);
    await env.DB.prepare('INSERT INTO usage (jour, cle, n) VALUES (?, ?, 1) ON CONFLICT(jour, cle) DO UPDATE SET n = n + 1').bind(jour, cle).run();
  } catch (e) { /* table absente avant la migration */ }
}

export const onRequestPost = gerer(async (context) => {
  await exigerSession(context);
  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  const cle = String(corps.cle || '');
  if (!CLES.includes(cle)) return erreur('Compteur inconnu.', 400, 'invalide', 'cle');
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
    // B165 : les totaux par compteur sur la période, et B196 : purge des compteurs de plus de quatre cents jours.
    const totaux = {};
    for (const l of r.results || []) totaux[l.cle] = (totaux[l.cle] || 0) + Number(l.n || 0);
    if (context.waitUntil) context.waitUntil(context.env.DB.prepare('DELETE FROM usage WHERE jour < ?').bind(new Date(Date.now() - 400 * 86400000).toISOString().slice(0, 10)).run().catch(() => {}));
    return json({ usage: r.results || [], totaux, jours, depuis });
  } catch (e) { return json({ usage: [], totaux: {}, jours, depuis }); }
});
