/**
 *   GET    /api/seances/:id   une séance (B140)
 *   PATCH  /api/seances/:id   met à jour une séance (professeur)
 *   DELETE /api/seances/:id   supprime une séance (professeur)
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, journaliser, MESSAGES, methodeNonPermise } from '../../_commun.js';
import { lireCorps, texte as validerTexte, identifiant } from '../../_valider.js';
import { decoder, STATUTS, CRENEAUX, TYPES, HEURE, DATE } from '../seances.js';
import { PROGRAMME } from '../../_programme.js';

export const onRequest = methodeNonPermise(['GET', 'PATCH', 'DELETE']);
const LECONS = new Set(PROGRAMME.flatMap((m) => m.lecons.map((l) => m.id + '/' + l.ref)));
const MATIERES = new Set(PROGRAMME.map((m) => m.id));

export const onRequestGet = gerer(async (context) => {
  await exigerSession(context);
  const id = identifiant(context.params.id);
  if (!id) return erreur(MESSAGES.identifiant_invalide, 400, 'invalide', 'id');
  const s = await context.env.DB.prepare('SELECT * FROM seances WHERE id = ?').bind(id).first();
  if (!s) return erreur('Séance introuvable.', 404);
  return json(decoder(s));
});

export const onRequestPatch = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const id = identifiant(context.params.id);
  if (!id) return erreur(MESSAGES.identifiant_invalide, 400, 'invalide', 'id');

  const existante = await context.env.DB.prepare('SELECT * FROM seances WHERE id = ?').bind(id).first();
  if (!existante) return erreur('Séance introuvable.', 404);

  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);

  if (corps.statut && !STATUTS.includes(corps.statut)) return erreur('Statut invalide.', 400, 'invalide', 'statut');
  if (corps.creneau && !CRENEAUX.includes(corps.creneau)) return erreur('Créneau invalide.', 400, 'invalide', 'creneau');
  if (corps.date && !DATE.test(corps.date)) return erreur(MESSAGES.date_invalide, 400, 'invalide', 'date');
  if (corps.type && !TYPES.includes(corps.type)) return erreur('Type invalide.', 400, 'invalide', 'type');
  if (corps.debut && !HEURE.test(String(corps.debut))) return erreur(MESSAGES.heure_invalide, 400, 'invalide', 'debut');
  if (corps.fin && !HEURE.test(String(corps.fin))) return erreur(MESSAGES.heure_invalide, 400, 'invalide', 'fin');
  if ((corps.debut || existante.debut) >= (corps.fin || existante.fin)) {
    return erreur(MESSAGES.fin_avant_debut, 400, 'invalide', 'fin');
  }
  if (corps.matieres && !Array.isArray(corps.matieres)) return erreur('matieres doit être une liste.', 400, 'invalide', 'matieres');
  if (corps.lecons && !Array.isArray(corps.lecons)) return erreur('lecons doit être une liste.', 400, 'invalide', 'lecons');
  // Un déplacement ne doit pas tomber sur un créneau déjà pris.
  if ((corps.date && corps.date !== existante.date) || (corps.creneau && corps.creneau !== existante.creneau)) {
    const deja = await context.env.DB.prepare('SELECT id FROM seances WHERE date = ? AND creneau = ? AND id != ?').bind(corps.date || existante.date, corps.creneau || existante.creneau, id).first();
    if (deja) return erreur('Une autre séance occupe déjà ce créneau.', 409, 'conflit', 'creneau');
  }

  const lecons = corps.lecons ? [...new Set(corps.lecons.map(String).filter((l) => LECONS.has(l) || /^module\/[a-z-]+$/.test(l)))].slice(0, 12) : null;
  const matieres = corps.matieres ? [...new Set(corps.matieres.map(String).filter((m) => MATIERES.has(m)))].slice(0, 8) : null;
  const fusion = {
    date: corps.date || existante.date,
    creneau: corps.creneau || existante.creneau,
    debut: corps.debut || existante.debut,
    fin: corps.fin || existante.fin,
    type: corps.type || existante.type,
    matieres: matieres ? JSON.stringify(matieres) : existante.matieres,
    lecons: lecons ? JSON.stringify(lecons) : existante.lecons,
    // B127 : les textes libres sont nettoyés (caractères de contrôle) et bornés.
    objectif: corps.objectif !== undefined ? (validerTexte(corps.objectif, 300) || null) : existante.objectif,
    travail: corps.travail !== undefined ? (validerTexte(corps.travail, 500) || null) : existante.travail,
    statut: corps.statut || existante.statut,
    bilan: corps.bilan !== undefined ? (validerTexte(corps.bilan, 800) || null) : existante.bilan,
  };

  await context.env.DB.prepare(
    `UPDATE seances SET date = ?, creneau = ?, debut = ?, fin = ?, type = ?, matieres = ?,
       lecons = ?, objectif = ?, travail = ?, statut = ?, bilan = ?, maj_le = ? WHERE id = ?`,
  ).bind(fusion.date, fusion.creneau, fusion.debut, fusion.fin, fusion.type, fusion.matieres,
    fusion.lecons, fusion.objectif, fusion.travail, fusion.statut, fusion.bilan, maintenant(), id).run();

  const lire = (v) => { try { return JSON.parse(v || '[]'); } catch (e) { return []; } };
  await journaliser(context.env, session, 'seance', id, { date: existante.date, statut: existante.statut, lecons: existante.lecons }, { date: fusion.date, statut: fusion.statut, lecons: fusion.lecons });
  return json({ id, ...fusion, matieres: lire(fusion.matieres), lecons: lire(fusion.lecons) });
});

export const onRequestDelete = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const id = identifiant(context.params.id);
  if (!id) return erreur(MESSAGES.identifiant_invalide, 400, 'invalide', 'id');
  const avant = await context.env.DB.prepare('SELECT date, creneau, type, objectif FROM seances WHERE id = ?').bind(id).first().catch(() => null);
  // B139 : supprimer une séance qui n'existe pas est une erreur, pas un silence.
  if (!avant) return erreur('Séance introuvable.', 404);
  await context.env.DB.prepare('DELETE FROM seances WHERE id = ?').bind(id).run();
  await journaliser(context.env, session, 'seance', id, avant, null);
  return json({ supprime: id });
});
