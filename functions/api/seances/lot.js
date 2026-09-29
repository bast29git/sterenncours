/**
 * POST /api/seances/lot : crée plusieurs séances en une fois (professeur).
 *
 * Sert à pré-générer l'année. Idempotent par (date, créneau) : une séance déjà
 * présente sur le même créneau du même jour n'est pas dupliquée, elle est
 * ignorée. On peut donc relancer la génération sans abîmer le planning.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, MESSAGES, journaliser, methodeNonPermise } from '../../_commun.js';
import { lireCorps } from '../../_valider.js';
import { REQUETE_INSERT, valeurs, construire, valider } from '../seances.js';

export const onRequest = methodeNonPermise(['POST']);
const MAX = 400;

export const onRequestPost = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const corps = await lireCorps(context.request, 1048576);
  if (!corps) return erreur(MESSAGES.requete_invalide);

  const liste = Array.isArray(corps.seances) ? corps.seances : null;
  if (!liste) return erreur('Un tableau « seances » est attendu.', 400, 'invalide', 'seances');
  if (!liste.length) return erreur('Aucune séance à créer.', 400, 'invalide', 'seances');
  if (liste.length > MAX) return erreur(`Trop de séances d'un coup (maximum ${MAX}).`, 400, 'invalide', 'seances');

  // B137 : chaque problème est signalé avec l'index de la séance fautive.
  for (let i = 0; i < liste.length; i += 1) {
    const probleme = valider(liste[i]);
    if (probleme) return erreur(`Séance ${i + 1} : ${probleme.message}`, 400, 'invalide', `seances[${i}].${probleme.champ}`);
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
    for (let i = 0; i < aCreer.length; i += 50) await context.env.DB.batch(aCreer.slice(i, i + 50).map((s) => requete.bind(...valeurs(s))));
  }
  await journaliser(context.env, session, 'seance', 'lot', null, `${aCreer.length} créée(s), ${liste.length - aCreer.length} ignorée(s)`);
  return json({ crees: aCreer.length, ignores: liste.length - aCreer.length, ids: aCreer.map((s) => s.id) }, 201);
});
