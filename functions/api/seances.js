/**
 * Planning des séances.
 *   GET  /api/seances?du=AAAA-MM-JJ&au=AAAA-MM-JJ   liste la période
 *   POST /api/seances                                crée une séance (professeur)
 *
 * L'élève peut lire le planning : c'est ce qui lui dit ce qu'on fait aujourd'hui.
 * Seul l'espace professeur le modifie.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, nouvelId, MESSAGES } from '../_commun.js';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const CRENEAUX = ['A', 'B', 'C'];
const STATUTS = ['prevue', 'faite', 'reportee'];
const TYPES = ['cours', 'travail'];
const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;

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
  try { corps = await context.request.json(); } catch (e) { return erreur(MESSAGES.requete_invalide); }

  const erreurChamp = valider(corps);
  if (erreurChamp) return erreur(erreurChamp);

  const date = maintenant();
  const seance = construire(corps, date);
  await context.env.DB.prepare(REQUETE_INSERT).bind(...valeurs(seance)).run();
  return json(decoder(seance), 201);
});

export const REQUETE_INSERT =
  `INSERT INTO seances (id, date, creneau, debut, fin, type, matieres, lecons, choix,
     objectif, travail, statut, bilan, cree_le, maj_le)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

export const valeurs = (s) => [s.id, s.date, s.creneau, s.debut, s.fin, s.type, s.matieres,
  s.lecons, s.choix, s.objectif, s.travail, s.statut, s.bilan, s.cree_le, s.maj_le];

export function construire(corps, date) {
  return {
    id: nouvelId(),
    date: corps.date,
    creneau: corps.creneau,
    debut: HEURE.test(String(corps.debut || '')) ? corps.debut : '13:00',
    fin: HEURE.test(String(corps.fin || '')) ? corps.fin : '14:30',
    type: TYPES.includes(corps.type) ? corps.type : 'cours',
    matieres: JSON.stringify(corps.matieres || []),
    lecons: JSON.stringify(corps.lecons || []),
    choix: JSON.stringify(corps.choix || []),
    objectif: corps.objectif ? String(corps.objectif).slice(0, 300) : null,
    travail: corps.travail ? String(corps.travail).slice(0, 500) : null,
    statut: corps.statut && STATUTS.includes(corps.statut) ? corps.statut : 'prevue',
    bilan: null,
    cree_le: date,
    maj_le: date,
  };
}

export function valider(corps) {
  if (!corps || !DATE.test(String(corps.date || ''))) return 'Date invalide (AAAA-MM-JJ attendu).';
  if (!CRENEAUX.includes(corps.creneau)) return 'Créneau invalide (A, B ou C).';
  if (corps.matieres && !Array.isArray(corps.matieres)) return 'matieres doit être une liste.';
  if (corps.lecons && !Array.isArray(corps.lecons)) return 'lecons doit être une liste.';
  return null;
}

export function decoder(ligne) {
  const lire = (v) => { try { return JSON.parse(v || '[]'); } catch (e) { return []; } };
  return { ...ligne, matieres: lire(ligne.matieres), lecons: lire(ligne.lecons), choix: lire(ligne.choix) };
}
