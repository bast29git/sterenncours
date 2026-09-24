/**
 * PATCH /api/seances/:id/eleve : ce que Sterenn peut changer elle-même.
 *
 * Sur un cours : déclarer une absence, avec un commentaire, ou l'annuler.
 *   { absence: true | false, commentaire: "..." }
 * Sur un temps de travail personnel : le déplacer, dans la même semaine ou
 * la suivante, et changer son heure.
 *   { date: "AAAA-MM-JJ", debut: "HH:MM", fin: "HH:MM" }
 * Accessible aux deux espaces ; le professeur garde la main sur tout le reste.
 */
import { json, erreur, gerer, exigerSession, maintenant, MESSAGES } from '../../../_commun.js';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;
const ECART_MAX_JOURS = 7;

export const onRequestPatch = gerer(async (context) => {
  await exigerSession(context);
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur(MESSAGES.identifiant_invalide);
  const { DB } = context.env;
  const s = await DB.prepare('SELECT * FROM seances WHERE id = ?').bind(id).first();
  if (!s) return erreur('Séance introuvable.', 404);

  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur(MESSAGES.requete_invalide); }

  if (typeof corps.absence === 'boolean') {
    if (s.type !== 'cours') return erreur('Une absence se déclare sur un cours.');
    const commentaire = corps.absence ? String(corps.commentaire || '').trim().slice(0, 300) || null : null;
    await DB.prepare('UPDATE seances SET absence = ?, commentaire_eleve = ?, maj_le = ? WHERE id = ?')
      .bind(corps.absence ? 1 : 0, commentaire, maintenant(), id).run();
    return json({ id, absence: corps.absence, commentaire_eleve: commentaire });
  }

  if (corps.date || corps.debut || corps.fin) {
    if (s.type !== 'travail') return erreur('Seul un temps de travail personnel se déplace ici. Pour un cours, écris à Bastien.');
    const date = corps.date ? String(corps.date) : s.date;
    const debut = corps.debut ? String(corps.debut) : s.debut;
    const fin = corps.fin ? String(corps.fin) : s.fin;
    if (!DATE.test(date)) return erreur('Date invalide.');
    if (!HEURE.test(debut) || !HEURE.test(fin)) return erreur('Heure invalide (HH:MM attendu).');
    if (debut >= fin) return erreur('La fin doit venir après le début.');
    const ecart = Math.abs((new Date(date + 'T12:00:00') - new Date(s.date + 'T12:00:00')) / 86400000);
    if (ecart > ECART_MAX_JOURS) return erreur(`Un temps de travail se déplace de ${ECART_MAX_JOURS} jours au plus.`);
    await DB.prepare('UPDATE seances SET date = ?, debut = ?, fin = ?, maj_le = ? WHERE id = ?')
      .bind(date, debut, fin, maintenant(), id).run();
    return json({ id, date, debut, fin });
  }

  return erreur('Rien à changer.');
});
