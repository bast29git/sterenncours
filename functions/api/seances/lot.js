/**
 * POST /api/seances/lot : crée plusieurs séances en une fois (professeur).
 *
 * Sert à pré-générer l'année. Idempotent par (date, créneau) : une séance déjà
 * présente sur le même créneau du même jour n'est pas dupliquée, elle est
 * ignorée. On peut donc relancer la génération sans abîmer le planning.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant } from '../../_commun.js';
import { REQUETE_INSERT, valeurs, construire, valider } from '../seances.js';

const MAX = 400;

export const onRequestPost = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }

  const liste = Array.isArray(corps && corps.seances) ? corps.seances : null;
  if (!liste) return erreur('Un tableau « seances » est attendu.');
  if (!liste.length) return erreur('Aucune séance à créer.');
  if (liste.length > MAX) return erreur(`Trop de séances d'un coup (maximum ${MAX}).`);

  for (const s of liste) {
    const probleme = valider(s);
    if (probleme) return erreur(probleme);
  }

  const { results } = await context.env.DB
    .prepare('SELECT date, creneau FROM seances').all();
  const existantes = new Set((results || []).map((r) => r.date + '|' + r.creneau));

  const date = maintenant();
  const aCreer = [];
  for (const s of liste) {
    const empreinte = s.date + '|' + s.creneau;
    if (existantes.has(empreinte)) continue;
    existantes.add(empreinte);
    aCreer.push(construire(s, date));
  }

  if (aCreer.length) {
    const requete = context.env.DB.prepare(REQUETE_INSERT);
    await context.env.DB.batch(aCreer.map((s) => requete.bind(...valeurs(s))));
  }

  return json({ crees: aCreer.length, ignores: liste.length - aCreer.length }, 201);
});
