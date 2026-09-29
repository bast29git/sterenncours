/**
 * Planning des séances.
 *   GET  /api/seances?du=AAAA-MM-JJ&au=AAAA-MM-JJ&type=cours&statut=prevue   liste la période (B129, B130)
 *   POST /api/seances                                                        crée une séance (professeur)
 *
 * L'élève peut lire le planning : c'est ce qui lui dit ce qu'on fait aujourd'hui.
 * Seul l'espace professeur le modifie.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, nouvelId, MESSAGES, journaliser, methodeNonPermise } from '../_commun.js';
import { lireCorps, texte as validerTexte, dateIso } from '../_valider.js';
import { PROGRAMME } from '../_programme.js';

export const onRequest = methodeNonPermise(['GET', 'POST']);
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const CRENEAUX = ['A', 'B', 'C'];
const STATUTS = ['prevue', 'faite', 'reportee'];
const TYPES = ['cours', 'travail'];
const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;
const MATIERES = new Set(PROGRAMME.map((m) => m.id));
const LECONS = new Set(PROGRAMME.flatMap((m) => m.lecons.map((l) => m.id + '/' + l.ref)));
const PERIODE_MAX_JOURS = 400;
export { STATUTS, CRENEAUX, TYPES, HEURE, DATE };

const jours = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000);

export const onRequestGet = gerer(async (context) => {
  await exigerSession(context);
  const url = new URL(context.request.url);
  let du = dateIso(url.searchParams.get('du'));
  let au = dateIso(url.searchParams.get('au'));
  const type = TYPES.includes(url.searchParams.get('type')) ? url.searchParams.get('type') : null;
  const statut = STATUTS.includes(url.searchParams.get('statut')) ? url.searchParams.get('statut') : null;
  // B128 : du avant au, et une période bornée ; B131 : sans bornes, toute l'année (la limite couvre deux années pleines).
  if (du && au && du > au) return erreur('La date de début vient après la date de fin.', 400, 'invalide', 'du');
  if (du && au && jours(du, au) > PERIODE_MAX_JOURS) return erreur(`La période ne dépasse pas ${PERIODE_MAX_JOURS} jours.`, 400, 'invalide', 'au');
  if (du && !au) au = new Date(new Date(du + 'T12:00:00').getTime() + PERIODE_MAX_JOURS * 86400000).toISOString().slice(0, 10);
  if (au && !du) du = new Date(new Date(au + 'T12:00:00').getTime() - PERIODE_MAX_JOURS * 86400000).toISOString().slice(0, 10);
  const conditions = []; const valeurs = [];
  if (du) { conditions.push('date >= ?'); valeurs.push(du); }
  if (au) { conditions.push('date <= ?'); valeurs.push(au); }
  if (type) { conditions.push('type = ?'); valeurs.push(type); }
  if (statut) { conditions.push('statut = ?'); valeurs.push(statut); }
  const ou = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const { results } = await context.env.DB.prepare(`SELECT * FROM seances ${ou} ORDER BY date ASC, creneau ASC LIMIT 1200`).bind(...valeurs).all();
  return json({ seances: (results || []).map(decoder), du: du || null, au: au || null });
});

export const onRequestPost = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);

  const erreurChamp = valider(corps);
  if (erreurChamp) return erreur(erreurChamp.message, 400, 'invalide', erreurChamp.champ);
  // B124 : pas deux séances sur le même créneau du même jour.
  const deja = await context.env.DB.prepare('SELECT id FROM seances WHERE date = ? AND creneau = ?').bind(corps.date, corps.creneau).first();
  if (deja) return erreur('Une séance existe déjà sur ce créneau ce jour-là.', 409, 'conflit', 'creneau');

  const date = maintenant();
  const seance = construire(corps, date);
  await context.env.DB.prepare(REQUETE_INSERT).bind(...valeurs(seance)).run();
  await journaliser(context.env, session, 'seance', seance.id, null, { date: seance.date, creneau: seance.creneau, type: seance.type });
  return json(decoder(seance), 201);
});

export const REQUETE_INSERT =
  `INSERT INTO seances (id, date, creneau, debut, fin, type, matieres, lecons, choix,
     objectif, travail, statut, bilan, cree_le, maj_le)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

export const valeurs = (s) => [s.id, s.date, s.creneau, s.debut, s.fin, s.type, s.matieres,
  s.lecons, s.choix, s.objectif, s.travail, s.statut, s.bilan, s.cree_le, s.maj_le];

/** B121, B122, B123 : matières, leçons et choix limités à ce que le programme connaît, dédoublonnés. */
const matieresConnues = (v) => [...new Set((Array.isArray(v) ? v : []).map(String).filter((m) => MATIERES.has(m)))].slice(0, 8);
const leconsConnues = (v) => [...new Set((Array.isArray(v) ? v : []).map(String).filter((l) => LECONS.has(l) || /^module\/[a-z-]+$/.test(l)))].slice(0, 12);

export function construire(corps, date) {
  const lecons = leconsConnues(corps.lecons);
  const choix = leconsConnues(corps.choix);
  const matieres = matieresConnues(corps.matieres);
  return {
    id: nouvelId(),
    date: corps.date,
    creneau: corps.creneau,
    debut: HEURE.test(String(corps.debut || '')) ? corps.debut : '13:00',
    fin: HEURE.test(String(corps.fin || '')) ? corps.fin : '14:30',
    type: TYPES.includes(corps.type) ? corps.type : 'cours',
    matieres: JSON.stringify(matieres.length ? matieres : [...new Set(lecons.map((l) => l.split('/')[0]).filter((m) => MATIERES.has(m)))]),
    lecons: JSON.stringify(lecons),
    choix: JSON.stringify(choix),
    objectif: validerTexte(corps.objectif, 300) || null,
    travail: validerTexte(corps.travail, 500) || null,
    statut: corps.statut && STATUTS.includes(corps.statut) ? corps.statut : 'prevue',
    bilan: null,
    cree_le: date,
    maj_le: date,
  };
}

/** Renvoie { message, champ } ou null. */
export function valider(corps) {
  if (!corps || !DATE.test(String(corps.date || ''))) return { message: MESSAGES.date_invalide, champ: 'date' };
  // B126 : une date à plus de quatre cents jours d'aujourd'hui est une faute de frappe.
  if (Math.abs(jours(new Date().toISOString().slice(0, 10), corps.date)) > PERIODE_MAX_JOURS) return { message: 'Cette date est trop loin de l\'année en cours.', champ: 'date' };
  if (!CRENEAUX.includes(corps.creneau)) return { message: 'Créneau invalide (A, B ou C).', champ: 'creneau' };
  if (corps.matieres && !Array.isArray(corps.matieres)) return { message: 'matieres doit être une liste.', champ: 'matieres' };
  if (corps.lecons && !Array.isArray(corps.lecons)) return { message: 'lecons doit être une liste.', champ: 'lecons' };
  if (corps.choix && !Array.isArray(corps.choix)) return { message: 'choix doit être une liste.', champ: 'choix' };
  if (corps.debut && !HEURE.test(String(corps.debut))) return { message: MESSAGES.heure_invalide, champ: 'debut' };
  if (corps.fin && !HEURE.test(String(corps.fin))) return { message: MESSAGES.heure_invalide, champ: 'fin' };
  // B125 : le début précède la fin.
  if ((corps.debut || '13:00') >= (corps.fin || '14:30')) return { message: MESSAGES.fin_avant_debut, champ: 'fin' };
  return null;
}

export function decoder(ligne) {
  const lire = (v) => { try { return JSON.parse(v || '[]'); } catch (e) { return []; } };
  return { ...ligne, matieres: lire(ligne.matieres), lecons: lire(ligne.lecons), choix: lire(ligne.choix) };
}
