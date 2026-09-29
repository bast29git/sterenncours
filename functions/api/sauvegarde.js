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
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, journaliser, methodeNonPermise } from '../_commun.js';
import { VERSION } from '../_programme.js';

export const onRequest = methodeNonPermise(['GET', 'POST']);
// Les tables restaurées, et B179 : les journaux, lus dans l'instantané mais jamais réécrits.
export const TABLES = ['suivi', 'resultats', 'fiches_lues', 'messages', 'fichiers', 'seances', 'ouvertures', 'reglages', 'felicitations', 'reactions', 'acces', 'profil'];
export const TABLES_LECTURE = ['suivi_journal', 'journal', 'tuteur_journal', 'usage', 'erreurs'];
const PREFIXE = 'sauvegardes/';
const GARDER = 30;

export async function sha256(texte) {
  const octets = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texte));
  return [...new Uint8Array(octets)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** B181 : les colonnes réelles d'une table, pour décrire le schéma et contrôler une restauration. */
export async function colonnesDe(DB, table) {
  try { const r = await DB.prepare(`PRAGMA table_info(${table})`).all(); return (r.results || []).map((c) => c.name); } catch (e) { return []; }
}

export async function instantane(DB) {
  const sortie = { version: 2, site: VERSION, le: maintenant(), schema: {}, tables: {} };
  for (const t of TABLES.concat(TABLES_LECTURE)) {
    try {
      const r = await DB.prepare(`SELECT * FROM ${t}`).all();
      sortie.tables[t] = r.results || [];
      sortie.schema[t] = await colonnesDe(DB, t);
    } catch (e) { sortie.tables[t] = null; }
  }
  // B180 : une empreinte des tables, vérifiée à la restauration.
  sortie.empreinte = await sha256(JSON.stringify(sortie.tables));
  return sortie;
}

export const onRequestPost = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const { env } = context;
  if (!env.FICHIERS) return erreur('Le stockage R2 n\'est pas relié : sauvegarde impossible.', 503);
  const donnees = await instantane(env.DB);
  const cle = PREFIXE + donnees.le.replace(/[:.]/g, '-') + '.json';
  const corps = JSON.stringify(donnees);
  await env.FICHIERS.put(cle, corps, { httpMetadata: { contentType: 'application/json; charset=utf-8' }, customMetadata: { empreinte: donnees.empreinte, site: VERSION } });
  const lignes = Object.fromEntries(Object.entries(donnees.tables).map(([t, l]) => [t, l ? l.length : null]));
  // On garde trente instantanés : les plus anciens sont effacés (les filets « avant-restauration » comptent à part).
  const liste = await env.FICHIERS.list({ prefix: PREFIXE });
  const anciens = (liste.objects || []).map((o) => o.key).filter((k) => !k.includes('avant-restauration')).sort().slice(0, -GARDER);
  for (const k of anciens) await env.FICHIERS.delete(k);
  // B185 : la sauvegarde est journalisée avec sa taille.
  await journaliser(context.env, session, 'sauvegarde', cle, null, `${corps.length} octets, ${Object.values(lignes).reduce((a, b) => a + (b || 0), 0)} lignes`);
  return json({ cle, le: donnees.le, octets: corps.length, lignes, empreinte: donnees.empreinte, effaces: anciens.length });
});

export const onRequestGet = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const { env } = context;
  if (!env.FICHIERS) return json({ sauvegardes: [], stockage: false });
  const url = new URL(context.request.url);
  const cle = url.searchParams.get('cle');
  if (cle) {
    if (!cle.startsWith(PREFIXE) || !/^[\w/.-]+$/.test(cle)) return erreur('Clé invalide.', 400, 'invalide', 'cle');
    const objet = await env.FICHIERS.get(cle);
    if (!objet) return erreur('Instantané introuvable.', 404);
    return new Response(objet.body, { headers: { 'content-type': 'application/json; charset=utf-8', 'content-disposition': `attachment; filename="${cle.slice(PREFIXE.length)}"`, 'cache-control': 'no-store' } });
  }
  const liste = await env.FICHIERS.list({ prefix: PREFIXE });
  // B186 : l'âge en heures de chaque instantané, et le plus récent en tête.
  const sauvegardes = (liste.objects || []).map((o) => ({ cle: o.key, le: o.uploaded, octets: o.size, filet: o.key.includes('avant-restauration'), age_heures: o.uploaded ? Math.round((Date.now() - new Date(o.uploaded).getTime()) / 3600000) : null })).sort((a, b) => String(b.cle).localeCompare(String(a.cle)));
  return json({ sauvegardes, stockage: true, garder: GARDER });
});
