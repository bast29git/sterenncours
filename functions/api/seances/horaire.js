/**
 * POST /api/seances/horaire : le professeur change l'horaire de toutes les
 * séances de cours à venir d'un même jour de la semaine, d'un coup.
 *   { jour: 3, debut: "14:00", fin: "15:30", depuis: "AAAA-MM-JJ" }
 * jour : 1 lundi … 5 vendredi ; depuis : facultatif, aujourd'hui par défaut.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, MESSAGES, journaliser, methodeNonPermise } from '../../_commun.js';
import { lireCorps, heure, dateIso, jourSemaine } from '../../_valider.js';

export const onRequest = methodeNonPermise(['POST']);
export const onRequestPost = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  const jour = jourSemaine(corps.jour);
  if (!jour || jour > 5) return erreur('Jour de semaine invalide (1 à 5).', 400, 'invalide', 'jour');
  const debut = heure(corps.debut); const fin = heure(corps.fin);
  if (!debut || !fin) return erreur(MESSAGES.heure_invalide, 400, 'invalide', 'debut');
  if (debut >= fin) return erreur(MESSAGES.fin_avant_debut, 400, 'invalide', 'fin');
  // B138 : « depuis » est une vraie date, ou aujourd'hui.
  if (corps.depuis && !dateIso(corps.depuis)) return erreur(MESSAGES.date_invalide, 400, 'invalide', 'depuis');
  const depuis = dateIso(corps.depuis) || new Date().toISOString().slice(0, 10);

  const { results } = await context.env.DB.prepare('SELECT id, date FROM seances WHERE type = ? AND date >= ?').bind('cours', depuis).all();
  const cibles = (results || []).filter((s) => new Date(s.date + 'T12:00:00').getDay() === jour);
  const le = maintenant();
  const lot = cibles.map((s) => context.env.DB.prepare('UPDATE seances SET debut = ?, fin = ?, maj_le = ? WHERE id = ?').bind(debut, fin, le, s.id));
  for (let i = 0; i < lot.length; i += 50) await context.env.DB.batch(lot.slice(i, i + 50));
  await journaliser(context.env, session, 'seance', 'horaire', null, `jour ${jour} : ${debut} à ${fin} depuis ${depuis} (${cibles.length} séance(s))`);
  return json({ modifiees: cibles.length, jour, debut, fin, depuis });
});
