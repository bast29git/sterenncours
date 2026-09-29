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
import { json, erreur, gerer, exigerSession, journaliser, exigerProf, maintenant, MESSAGES, methodeNonPermise } from '../_commun.js';
import { lireCorps, liste } from '../_valider.js';
import { PROGRAMME, JEUX_IDS } from '../_programme.js';

export const onRequest = methodeNonPermise(['GET', 'PUT']);
const LECONS = new Set(PROGRAMME.flatMap((m) => m.lecons.map((l) => m.id + '/' + l.ref)));
const JEUX = new Set(JEUX_IDS);

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

/** Applique une décision ; renvoie la réponse partielle, ou lève une erreur. */
async function decider(context, session, corps) {
  const { DB } = context.env;
  const cle = String(corps && corps.cle || '');
  if (!CLE_ACCES.test(cle)) throw erreur('Clé d\'accès invalide.', 400, 'invalide', 'cle');
  // B150 : la leçon ou le jeu visé doit exister.
  if (cle.startsWith('jeu/')) { if (JEUX.size && !JEUX.has(cle.slice(4))) throw erreur('Ce jeu n\'existe pas.', 400, 'invalide', 'cle'); }
  else if (!LECONS.has(cle.split('/').slice(0, 2).join('/'))) throw erreur(MESSAGES.cle_lecon_invalide, 400, 'invalide', 'cle');
  const etat = corps.etat;
  const avant = await DB.prepare('SELECT etat, jusqu_au FROM acces WHERE cle = ?').bind(cle).first().catch(() => null);
  if (etat === null || etat === undefined) {
    await DB.prepare('DELETE FROM acces WHERE cle = ?').bind(cle).run();
    await journaliser(context.env, session, 'acces', cle, avant, null);
    return { cle, etat: null };
  }
  if (typeof etat !== 'boolean') throw erreur('etat doit valoir true, false ou null.', 400, 'invalide', 'etat');
  let jusquAu = null;
  if (corps.jusqu_au) {
    const d = new Date(corps.jusqu_au);
    if (Number.isNaN(d.getTime())) throw erreur('Date de fin invalide.', 400, 'invalide', 'jusqu_au');
    // B151 : une date de fermeture déjà passée n'a pas de sens.
    if (d.getTime() < Date.now()) throw erreur('La date de fermeture est déjà passée.', 400, 'invalide', 'jusqu_au');
    jusquAu = d.toISOString();
  }
  await DB.prepare(
    `INSERT INTO acces (cle, etat, jusqu_au, maj_le) VALUES (?, ?, ?, ?)
     ON CONFLICT(cle) DO UPDATE SET etat = excluded.etat, jusqu_au = excluded.jusqu_au, maj_le = excluded.maj_le`,
  ).bind(cle, etat ? 1 : 0, jusquAu, maintenant()).run();
  await journaliser(context.env, session, 'acces', cle, avant, { etat, jusqu_au: jusquAu });
  return { cle, etat, jusqu_au: jusquAu };
}

export const onRequestPut = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  // B152 : plusieurs décisions d'un coup ({ decisions: [...] }), ou une seule.
  if (Array.isArray(corps.decisions)) {
    const decisions = liste(corps.decisions, 100);
    if (!decisions.length) return erreur('Aucune décision.', 400, 'invalide', 'decisions');
    const sortie = [];
    for (const d of decisions) sortie.push(await decider(context, session, d));
    return json({ decisions: sortie, acces: await lireAcces(context.env.DB) });
  }
  return json(await decider(context, session, corps));
});
