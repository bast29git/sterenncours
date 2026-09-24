/**
 * PUT /api/suivi : positionne une leçon sur l'échelle des quatre niveaux.
 * Réservé à l'espace professeur : l'élève ne se note pas elle-même.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, nouvelId, MESSAGES } from '../_commun.js';

const NIVEAUX = ['insuffisant', 'fragile', 'satisfaisant', 'tresbien'];
const RAISONS = ['decision', 'serie', 'devoir', 'reprise', 'proposition', 'positionnement'];

/** GET /api/suivi?cle=<matiere>/<ref> : l'historique daté des positionnements d'une leçon. */
export const onRequestGet = gerer(async (context) => {
  await exigerSession(context);
  const url = new URL(context.request.url);
  const cle = String(url.searchParams.get('cle') || '');
  if (!/^[a-z0-9-]+\/[A-Za-z0-9]+$/.test(cle)) return erreur('Clé invalide.');
  try {
    const r = await context.env.DB.prepare('SELECT avant, apres, raison, par, quand FROM suivi_journal WHERE cle = ? ORDER BY quand DESC LIMIT 50').bind(cle).all();
    return json({ cle, journal: r.results || [] });
  } catch (e) { return json({ cle, journal: [] }); }
});

export const onRequestPut = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const { DB } = context.env;

  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur(MESSAGES.requete_invalide); }
  const { matiere, ref, niveau, note } = corps || {};
  if (!matiere || !ref) return erreur('matiere et ref sont requis.');
  if (niveau && !NIVEAUX.includes(niveau)) return erreur('Niveau inconnu.');

  const cle = matiere + '/' + ref;
  const raison = RAISONS.includes(corps.raison) ? corps.raison : 'decision';
  const avant = await DB.prepare('SELECT niveau FROM suivi WHERE cle = ?').bind(cle).first().catch(() => null);
  const journaliser = async (apres) => {
    if ((avant && avant.niveau) === (apres || null)) return;
    try {
      await DB.prepare('INSERT INTO suivi_journal (id, cle, avant, apres, raison, par, quand) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(nouvelId(), cle, avant ? avant.niveau : null, apres || null, raison, session.role, maintenant()).run();
    } catch (e) { /* table absente avant la migration 0008 */ }
  };
  if (!niveau) {
    await DB.prepare('DELETE FROM suivi WHERE cle = ?').bind(cle).run();
    await journaliser(null);
    return json({ cle, niveau: null });
  }

  await DB.prepare(
    `INSERT INTO suivi (cle, matiere, ref, niveau, note, maj_le, maj_par)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(cle) DO UPDATE SET niveau = excluded.niveau, note = excluded.note,
       maj_le = excluded.maj_le, maj_par = excluded.maj_par`,
  ).bind(cle, matiere, ref, niveau, note || null, maintenant(), session.role).run();
  await journaliser(niveau);

  return json({ cle, niveau, maj_le: maintenant() });
});
