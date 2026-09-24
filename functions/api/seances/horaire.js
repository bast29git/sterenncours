/**
 * POST /api/seances/horaire : le professeur change l'horaire de toutes les
 * séances de cours à venir d'un même jour de la semaine, d'un coup.
 *   { jour: 3, debut: "14:00", fin: "15:30", depuis: "AAAA-MM-JJ" }
 * jour : 1 lundi … 5 vendredi ; depuis : facultatif, aujourd'hui par défaut.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant } from '../../_commun.js';

const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;

export const onRequestPost = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }
  const jour = Number(corps && corps.jour);
  if (!(jour >= 1 && jour <= 5)) return erreur('Jour de semaine invalide (1 à 5).');
  const debut = String(corps.debut || ''); const fin = String(corps.fin || '');
  if (!HEURE.test(debut) || !HEURE.test(fin) || debut >= fin) return erreur('Horaire invalide.');
  const depuis = /^\d{4}-\d{2}-\d{2}$/.test(String(corps.depuis || '')) ? corps.depuis : new Date().toISOString().slice(0, 10);

  const { results } = await context.env.DB.prepare('SELECT id, date FROM seances WHERE type = ? AND date >= ?').bind('cours', depuis).all();
  const cibles = (results || []).filter((s) => {
    const d = new Date(s.date + 'T12:00:00').getDay();
    return d === jour;
  });
  const le = maintenant();
  const lot = cibles.map((s) => context.env.DB.prepare('UPDATE seances SET debut = ?, fin = ?, maj_le = ? WHERE id = ?').bind(debut, fin, le, s.id));
  for (let i = 0; i < lot.length; i += 50) await context.env.DB.batch(lot.slice(i, i + 50));
  return json({ modifiees: cibles.length, jour, debut, fin, depuis });
});
