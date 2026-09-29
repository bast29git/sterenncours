/**
 * Félicitations du professeur pour un devoir rendu.
 *
 * GET   /api/felicitations : les dernières félicitations (les deux espaces).
 * POST  /api/felicitations : le professeur en écrit une ({ texte, matiere, ref,
 *        fichier_id }). Elle est aussi envoyée comme message, pour rester dans
 *        le fil des échanges.
 * PATCH /api/felicitations : Sterenn marque toutes les félicitations comme vues.
 *
 * Chaque félicitation vaut une étoile : elle compte dans les réussites.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, nouvelId, journaliser, MESSAGES, methodeNonPermise } from '../_commun.js';
import { lireCorps, texte as validerTexte, matiere as validerMatiere, ref as validerRef, identifiant, entier } from '../_valider.js';
import { PROGRAMME } from '../_programme.js';

export const onRequest = methodeNonPermise(['GET', 'POST', 'PATCH']);
const MATIERES = new Set(PROGRAMME.map((m) => m.id));

export async function lireFelicitations(DB, n = 60) {
  try {
    const r = await DB.prepare(
      'SELECT id, fichier_id, matiere, ref, texte, cree_le, vu_le FROM felicitations ORDER BY cree_le DESC LIMIT ?',
    ).bind(n).all();
    return r.results || [];
  } catch (e) { return []; }
}

export const onRequestGet = gerer(async (context) => {
  await exigerSession(context);
  // B163 : le nombre demandé est borné.
  const n = entier(new URL(context.request.url).searchParams.get('n'), 1, 300, 60);
  return json({ felicitations: await lireFelicitations(context.env.DB, n) });
});

export const onRequestPost = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const { DB } = context.env;
  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  // B160 : texte nettoyé, trois cents caractères au plus.
  const texte = validerTexte(corps.texte, 301);
  if (!texte) return erreur(MESSAGES.texte_obligatoire, 400, 'invalide', 'texte');
  if (texte.length > 300) return erreur('Trois cents caractères au plus.', 400, 'invalide', 'texte');
  // B161 : la matière doit être une matière du programme.
  const matiere = corps.matiere ? validerMatiere(corps.matiere) : null;
  if (corps.matiere && (!matiere || !MATIERES.has(matiere))) return erreur('Matière inconnue.', 400, 'invalide', 'matiere');
  const ref = corps.ref ? validerRef(corps.ref) : null;
  if (corps.ref && !ref) return erreur('Référence invalide.', 400, 'invalide', 'ref');
  const fichier = corps.fichier_id ? identifiant(corps.fichier_id) : null;
  if (corps.fichier_id && !fichier) return erreur('Fichier invalide.', 400, 'invalide', 'fichier_id');
  if (fichier) { const f = await DB.prepare('SELECT id FROM fichiers WHERE id = ?').bind(fichier).first(); if (!f) return erreur('Fichier introuvable.', 404); }
  const id = nouvelId();
  const le = maintenant();
  const contexte = 'Félicitations' + (matiere ? ' · ' + matiere + (ref ? ' ' + ref : '') : '');
  // B162 : la félicitation et son message partent dans le même lot : l'un n'existe jamais sans l'autre.
  await DB.batch([
    DB.prepare('INSERT INTO felicitations (id, fichier_id, matiere, ref, texte, cree_le) VALUES (?, ?, ?, ?, ?, ?)').bind(id, fichier, matiere, ref, texte, le),
    DB.prepare('INSERT INTO messages (id, auteur, texte, contexte, cree_le) VALUES (?, ?, ?, ?, ?)').bind(nouvelId(), 'prof', '🏆 ' + texte, contexte.slice(0, 120), le),
  ]);
  await journaliser(context.env, session, 'felicitation', id, null, texte.slice(0, 120));
  return json({ id, fichier_id: fichier, matiere, ref, texte, cree_le: le, vu_le: null });
});

export const onRequestPatch = gerer(async (context) => {
  const session = await exigerSession(context);
  if (session.role !== 'eleve') return json({ ok: true, vues: 0 });
  const r = await context.env.DB.prepare('UPDATE felicitations SET vu_le = ? WHERE vu_le IS NULL').bind(maintenant()).run();
  return json({ ok: true, vues: (r.meta && r.meta.changes) || 0 });
});
