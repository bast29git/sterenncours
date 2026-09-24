/**
 * Accès aux éléments d'une leçon et aux jeux, décidés par le professeur.
 *
 * GET /api/acces : toutes les décisions.
 * PUT /api/acces : { cle, etat: true | false | null, jusqu_au } ; null efface
 *   la décision et rend la main à la règle automatique.
 *
 * Clés : "<matiere>/<ref>/<cours|revision|exercices|serie|evaluation>" ou "jeu/<id>".
 * Règle automatique : cours, révision, exercices, série et jeux suivent
 * l'ouverture de la leçon ; l'évaluation est fermée tant qu'elle n'est pas
 * ouverte ici. Le serveur applique la décision sur l'évaluation : son sujet
 * n'est servi à Sterenn que si l'accès est ouvert (voir _middleware.js).
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant } from '../_commun.js';

export const CLE_ACCES = /^([a-z0-9-]+\/[A-Za-z0-9]+\/(cours|revision|exercices|serie|evaluation)|jeu\/[a-z0-9-]+)$/;

export async function lireAcces(DB) {
  const sortie = {};
  try {
    const r = await DB.prepare('SELECT cle, etat, jusqu_au FROM acces').all();
    for (const l of r.results || []) sortie[l.cle] = { etat: l.etat, jusqu_au: l.jusqu_au };
  } catch (e) { /* table absente avant la migration */ }
  return sortie;
}

/** Une décision d'ouverture encore valable ? (fermeture automatique à la date limite) */
export function accesOuvert(entree) {
  if (!entree) return null;
  if (entree.etat !== 1) return false;
  if (entree.jusqu_au && entree.jusqu_au < new Date().toISOString()) return false;
  return true;
}

export const onRequestGet = gerer(async (context) => {
  await exigerSession(context);
  return json({ acces: await lireAcces(context.env.DB) });
});

export const onRequestPut = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const { DB } = context.env;
  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }
  const cle = String(corps && corps.cle || '');
  if (!CLE_ACCES.test(cle)) return erreur('Clé d\'accès invalide.');
  const etat = corps.etat;
  if (etat === null || etat === undefined) {
    await DB.prepare('DELETE FROM acces WHERE cle = ?').bind(cle).run();
    return json({ cle, etat: null });
  }
  if (typeof etat !== 'boolean') return erreur('etat doit valoir true, false ou null.');
  let jusquAu = null;
  if (corps.jusqu_au) {
    const d = new Date(corps.jusqu_au);
    if (Number.isNaN(d.getTime())) return erreur('Date de fin invalide.');
    jusquAu = d.toISOString();
  }
  await DB.prepare(
    `INSERT INTO acces (cle, etat, jusqu_au, maj_le) VALUES (?, ?, ?, ?)
     ON CONFLICT(cle) DO UPDATE SET etat = excluded.etat, jusqu_au = excluded.jusqu_au, maj_le = excluded.maj_le`,
  ).bind(cle, etat ? 1 : 0, jusquAu, maintenant()).run();
  return json({ cle, etat, jusqu_au: jusquAu });
});
