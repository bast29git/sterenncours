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
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, nouvelId } from '../_commun.js';

export async function lireFelicitations(DB) {
  try {
    const r = await DB.prepare(
      'SELECT id, fichier_id, matiere, ref, texte, cree_le, vu_le FROM felicitations ORDER BY cree_le DESC LIMIT 60',
    ).all();
    return r.results || [];
  } catch (e) { return []; }
}

export const onRequestGet = gerer(async (context) => {
  await exigerSession(context);
  return json({ felicitations: await lireFelicitations(context.env.DB) });
});

export const onRequestPost = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const { DB } = context.env;
  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }
  const texte = String(corps && corps.texte || '').trim().slice(0, 600);
  if (!texte) return erreur('Écris un mot pour Sterenn.');
  const matiere = corps.matiere && /^[a-z0-9-]+$/.test(corps.matiere) ? corps.matiere : null;
  const ref = corps.ref && /^[A-Za-z0-9]+$/.test(corps.ref) ? corps.ref : null;
  const fichier = corps.fichier_id && /^[0-9a-f]{24}$/.test(corps.fichier_id) ? corps.fichier_id : null;
  const id = nouvelId();
  const le = maintenant();

  await DB.prepare(
    'INSERT INTO felicitations (id, fichier_id, matiere, ref, texte, cree_le) VALUES (?, ?, ?, ?, ?, ?)',
  ).bind(id, fichier, matiere, ref, texte, le).run();

  // Le mot part aussi dans la messagerie, avec son contexte.
  const contexte = 'Félicitations' + (matiere ? ' · ' + matiere + (ref ? ' ' + ref : '') : '');
  await DB.prepare(
    'INSERT INTO messages (id, auteur, texte, contexte, cree_le) VALUES (?, ?, ?, ?, ?)',
  ).bind(nouvelId(), 'prof', '🏆 ' + texte, contexte.slice(0, 120), le).run();

  return json({ id, fichier_id: fichier, matiere, ref, texte, cree_le: le, vu_le: null });
});

export const onRequestPatch = gerer(async (context) => {
  const session = await exigerSession(context);
  if (session.role !== 'eleve') return json({ ok: true, vues: 0 });
  const r = await context.env.DB.prepare('UPDATE felicitations SET vu_le = ? WHERE vu_le IS NULL').bind(maintenant()).run();
  return json({ ok: true, vues: (r.meta && r.meta.changes) || 0 });
});
