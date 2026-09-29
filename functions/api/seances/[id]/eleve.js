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
import { json, erreur, gerer, exigerSession, maintenant, MESSAGES, journaliser, methodeNonPermise } from '../../../_commun.js';
import { lireCorps, texte as validerTexte, identifiant, dateIso, heure } from '../../../_valider.js';

export const onRequest = methodeNonPermise(['PATCH']);
const ECART_MAX_JOURS = 7;

export const onRequestPatch = gerer(async (context) => {
  const session = await exigerSession(context);
  const id = identifiant(context.params.id);
  if (!id) return erreur(MESSAGES.identifiant_invalide, 400, 'invalide', 'id');
  const { DB } = context.env;
  const s = await DB.prepare('SELECT * FROM seances WHERE id = ?').bind(id).first();
  if (!s) return erreur('Séance introuvable.', 404);

  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);

  if (typeof corps.absence === 'boolean') {
    if (s.type !== 'cours') return erreur('Une absence se déclare sur un cours.', 400, 'invalide', 'absence');
    // B133 : une absence se déclare sur un cours à venir, ou du jour même : pas sur un cours passé depuis plus d'un jour.
    const hier = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (corps.absence && s.date < hier) return erreur('Ce cours est passé : écris plutôt un mot à Bastien.', 400, 'invalide', 'absence');
    const commentaire = corps.absence ? validerTexte(corps.commentaire, 300) || null : null;
    const quand = maintenant();
    try { await DB.prepare('UPDATE seances SET absence = ?, commentaire_eleve = ?, absence_le = ?, maj_le = ? WHERE id = ?').bind(corps.absence ? 1 : 0, commentaire, corps.absence ? quand : null, quand, id).run(); } catch (e) { await DB.prepare('UPDATE seances SET absence = ?, commentaire_eleve = ?, maj_le = ? WHERE id = ?').bind(corps.absence ? 1 : 0, commentaire, quand, id).run(); }
    // B132 : la déclaration est journalisée, avec le début du mot.
    await journaliser(context.env, session, 'absence', id, s.absence ? 'absente' : 'présente', corps.absence ? 'absente' + (commentaire ? ' : ' + commentaire.slice(0, 80) : '') : 'présente');
    return json({ id, absence: corps.absence, commentaire_eleve: commentaire, absence_le: corps.absence ? quand : null });
  }

  if (corps.date || corps.debut || corps.fin) {
    if (s.type !== 'travail') return erreur('Seul un temps de travail personnel se déplace ici. Pour un cours, écris à Bastien.', 400, 'invalide', 'date');
    const date = corps.date ? dateIso(corps.date) : s.date;
    const debut = corps.debut ? heure(corps.debut) : s.debut;
    const fin = corps.fin ? heure(corps.fin) : s.fin;
    if (!date) return erreur(MESSAGES.date_invalide, 400, 'invalide', 'date');
    if (!debut || !fin) return erreur(MESSAGES.heure_invalide, 400, 'invalide', 'debut');
    if (debut >= fin) return erreur(MESSAGES.fin_avant_debut, 400, 'invalide', 'fin');
    const ecart = Math.abs((new Date(date + 'T12:00:00') - new Date(s.date + 'T12:00:00')) / 86400000);
    if (ecart > ECART_MAX_JOURS) return erreur(`Un temps de travail se déplace de ${ECART_MAX_JOURS} jours au plus.`, 400, 'invalide', 'date');
    // B134 : pas de temps personnel qui chevauche un cours le même jour.
    const cours = await DB.prepare('SELECT debut, fin FROM seances WHERE date = ? AND type = ? AND id != ?').bind(date, 'cours', id).all();
    const chevauche = (cours.results || []).some((c) => debut < c.fin && fin > c.debut);
    if (chevauche) return erreur('Ce créneau tombe sur un cours. Choisis un autre moment.', 409, 'conflit', 'debut');
    await DB.prepare('UPDATE seances SET date = ?, debut = ?, fin = ?, maj_le = ? WHERE id = ?')
      .bind(date, debut, fin, maintenant(), id).run();
    return json({ id, date, debut, fin });
  }

  return erreur('Rien à changer.', 400, 'invalide');
});
