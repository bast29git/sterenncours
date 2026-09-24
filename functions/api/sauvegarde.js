/**
 * Sauvegarde et restauration de la base (professeur).
 *
 * POST /api/sauvegarde            écrit un instantané JSON de toutes les tables
 *                                 dans R2 sous sauvegardes/<horodatage>.json
 * GET  /api/sauvegarde            liste les instantanés disponibles
 * GET  /api/sauvegarde?cle=<cle>  renvoie un instantané (téléchargement)
 * POST /api/sauvegarde/restaurer  (voir sauvegarde/restaurer.js)
 *
 * Un Worker planifié n'existe pas sur Pages : c'est un travail planifié GitHub
 * (.github/workflows/sauvegarde.yml) qui appelle cette route chaque nuit.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant } from '../_commun.js';

export const TABLES = ['suivi', 'resultats', 'fiches_lues', 'messages', 'fichiers', 'seances', 'ouvertures', 'reglages', 'felicitations', 'reactions', 'acces', 'profil'];
const PREFIXE = 'sauvegardes/';

export async function instantane(DB) {
  const sortie = { version: 1, le: maintenant(), tables: {} };
  for (const t of TABLES) {
    try {
      const r = await DB.prepare(`SELECT * FROM ${t}`).all();
      sortie.tables[t] = r.results || [];
    } catch (e) { sortie.tables[t] = null; }
  }
  return sortie;
}

export const onRequestPost = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const { env } = context;
  if (!env.FICHIERS) return erreur('Le stockage R2 n\'est pas relié : sauvegarde impossible.', 503);
  const donnees = await instantane(env.DB);
  const cle = PREFIXE + donnees.le.replace(/[:.]/g, '-') + '.json';
  const corps = JSON.stringify(donnees);
  await env.FICHIERS.put(cle, corps, { httpMetadata: { contentType: 'application/json; charset=utf-8' } });
  const lignes = Object.fromEntries(Object.entries(donnees.tables).map(([t, l]) => [t, l ? l.length : null]));
  // On garde trente instantanés : les plus anciens sont effacés.
  const liste = await env.FICHIERS.list({ prefix: PREFIXE });
  const anciens = (liste.objects || []).map((o) => o.key).sort().slice(0, -30);
  for (const k of anciens) await env.FICHIERS.delete(k);
  return json({ cle, le: donnees.le, octets: corps.length, lignes, effaces: anciens.length });
});

export const onRequestGet = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const { env } = context;
  if (!env.FICHIERS) return json({ sauvegardes: [], stockage: false });
  const url = new URL(context.request.url);
  const cle = url.searchParams.get('cle');
  if (cle) {
    if (!cle.startsWith(PREFIXE) || !/^[\w/.-]+$/.test(cle)) return erreur('Clé invalide.');
    const objet = await env.FICHIERS.get(cle);
    if (!objet) return erreur('Instantané introuvable.', 404);
    return new Response(objet.body, { headers: { 'content-type': 'application/json; charset=utf-8', 'content-disposition': `attachment; filename="${cle.slice(PREFIXE.length)}"`, 'cache-control': 'no-store' } });
  }
  const liste = await env.FICHIERS.list({ prefix: PREFIXE });
  const sauvegardes = (liste.objects || []).map((o) => ({ cle: o.key, le: o.uploaded, octets: o.size })).sort((a, b) => String(b.cle).localeCompare(String(a.cle)));
  return json({ sauvegardes, stockage: true });
});
