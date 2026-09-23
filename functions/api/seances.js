/**
 * Planning des séances.
 *   GET  /api/seances?du=AAAA-MM-JJ&au=AAAA-MM-JJ   liste la période
 *   POST /api/seances                                crée une séance (professeur)
 *
 * L'élève peut lire le planning : c'est ce qui lui dit ce qu'on fait aujourd'hui.
 * Seul l'espace professeur le modifie.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, nouvelId } from '../_commun.js';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const CRENEAUX = ['A', 'B', 'C'];
const STATUTS = ['prevue', 'faite', 'reportee'];

export const onRequestGet = gerer(async (context) => {
  await exigerSession(context);
  const url = new URL(context.request.url);
  const du = url.searchParams.get('du');
  const au = url.searchParams.get('au');

  const requete = (du && au && DATE.test(du) && DATE.test(au))
    ? context.env.DB.prepare(
      'SELECT * FROM seances WHERE date BETWEEN ? AND ? ORDER BY date ASC, creneau ASC').bind(du, au)
    : context.env.DB.prepare('SELECT * FROM seances ORDER BY date ASC, creneau ASC LIMIT 400');

  const { results } = await requete.all();
  return json({ seances: (results || []).map(decoder) });
});

export const onRequestPost = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }

  const erreurChamp = valider(corps);
  if (erreurChamp) return erreur(erreurChamp);

  const date = maintenant();
  const seance = {
    id: nouvelId(),
    date: corps.date,
    creneau: corps.creneau,
    matieres: JSON.stringify(corps.matieres || []),
    lecons: JSON.stringify(corps.lecons || []),
    objectif: corps.objectif ? String(corps.objectif).slice(0, 300) : null,
    travail: corps.travail ? String(corps.travail).slice(0, 500) : null,
    statut: corps.statut && STATUTS.includes(corps.statut) ? corps.statut : 'prevue',
    bilan: null,
    cree_le: date,
    maj_le: date,
  };

  await context.env.DB.prepare(
    `INSERT INTO seances (id, date, creneau, matieres, lecons, objectif, travail, statut, bilan, cree_le, maj_le)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(seance.id, seance.date, seance.creneau, seance.matieres, seance.lecons,
    seance.objectif, seance.travail, seance.statut, seance.bilan, seance.cree_le, seance.maj_le).run();

  return json(decoder(seance), 201);
});

function valider(corps) {
  if (!corps || !DATE.test(String(corps.date || ''))) return 'Date invalide (AAAA-MM-JJ attendu).';
  if (!CRENEAUX.includes(corps.creneau)) return 'Créneau invalide (A, B ou C).';
  if (corps.matieres && !Array.isArray(corps.matieres)) return 'matieres doit être une liste.';
  if (corps.lecons && !Array.isArray(corps.lecons)) return 'lecons doit être une liste.';
  return null;
}

function decoder(ligne) {
  const lire = (v) => { try { return JSON.parse(v || '[]'); } catch (e) { return []; } };
  return { ...ligne, matieres: lire(ligne.matieres), lecons: lire(ligne.lecons) };
}
