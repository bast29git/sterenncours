/**
 *   PATCH  /api/seances/:id   met à jour une séance (professeur)
 *   DELETE /api/seances/:id   supprime une séance (professeur)
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant } from '../../_commun.js';

const STATUTS = ['prevue', 'faite', 'reportee'];
const CRENEAUX = ['A', 'B', 'C'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export const onRequestPatch = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur('Identifiant invalide.');

  const existante = await context.env.DB.prepare('SELECT * FROM seances WHERE id = ?').bind(id).first();
  if (!existante) return erreur('Séance introuvable.', 404);

  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }

  if (corps.statut && !STATUTS.includes(corps.statut)) return erreur('Statut invalide.');
  if (corps.creneau && !CRENEAUX.includes(corps.creneau)) return erreur('Créneau invalide.');
  if (corps.date && !DATE.test(corps.date)) return erreur('Date invalide.');

  const fusion = {
    date: corps.date || existante.date,
    creneau: corps.creneau || existante.creneau,
    matieres: corps.matieres ? JSON.stringify(corps.matieres) : existante.matieres,
    lecons: corps.lecons ? JSON.stringify(corps.lecons) : existante.lecons,
    objectif: corps.objectif !== undefined ? (corps.objectif ? String(corps.objectif).slice(0, 300) : null) : existante.objectif,
    travail: corps.travail !== undefined ? (corps.travail ? String(corps.travail).slice(0, 500) : null) : existante.travail,
    statut: corps.statut || existante.statut,
    bilan: corps.bilan !== undefined ? (corps.bilan ? String(corps.bilan).slice(0, 800) : null) : existante.bilan,
  };

  await context.env.DB.prepare(
    `UPDATE seances SET date = ?, creneau = ?, matieres = ?, lecons = ?, objectif = ?,
       travail = ?, statut = ?, bilan = ?, maj_le = ? WHERE id = ?`,
  ).bind(fusion.date, fusion.creneau, fusion.matieres, fusion.lecons, fusion.objectif,
    fusion.travail, fusion.statut, fusion.bilan, maintenant(), id).run();

  const lire = (v) => { try { return JSON.parse(v || '[]'); } catch (e) { return []; } };
  return json({ id, ...fusion, matieres: lire(fusion.matieres), lecons: lire(fusion.lecons) });
});

export const onRequestDelete = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur('Identifiant invalide.');
  await context.env.DB.prepare('DELETE FROM seances WHERE id = ?').bind(id).run();
  return json({ supprime: id });
});
