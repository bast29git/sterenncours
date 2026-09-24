/**
 * POST /api/seances/lot : crée plusieurs séances en une fois (professeur).
 *
 * Sert à pré-générer l'année. Idempotent par (date, créneau) : une séance déjà
 * présente sur le même créneau du même jour n'est pas dupliquée, elle est
 * ignorée. On peut donc relancer la génération sans abîmer le planning.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, MESSAGES } from '../../_commun.js';
import { REQUETE_INSERT, valeurs, construire, valider } from '../seances.js';

const MAX = 400;

export const onRequestPost = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur(MESSAGES.requete_invalide); }

  const liste = Array.isArray(corps && corps.seances) ? corps.seances : null;
  if (!liste) return erreur('Un tableau « seances » est attendu.');
  if (!liste.length) return erreur('Aucune séance à créer.');
  if (liste.length > MAX) return erreur(`Trop de séances d'un coup (maximum ${MAX}).`);

  for (const s of liste) {
    const probleme = valider(s);
    if (probleme) return erreur(probleme);
  }
  // A9 : un lot strictement identique reçu deux fois dans la minute est refusé (double clic, double envoi).
  if (context.env.SESSIONS) {
    const octets = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(liste)));
    const empreinte = [...new Uint8Array(octets)].slice(0, 16).map((b) => b.toString(16).padStart(2, '0')).join('');
    const cle = 'lot:' + empreinte;
    if (await context.env.SESSIONS.get(cle)) return erreur('Ce lot vient d\'être enregistré : rien à refaire.', 409);
    await context.env.SESSIONS.put(cle, '1', { expirationTtl: 60 });
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

  return json({ crees: aCreer.length, ignores: liste.length - aCreer.length, ids: aCreer.map((s) => s.id).filter(Boolean) }, 201);
});
