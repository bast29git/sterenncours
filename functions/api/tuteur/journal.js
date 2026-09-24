/**
 * GET /api/tuteur/journal : les dernières questions posées à Opale (professeur).
 * La question, le mode, la matière, le contrôle appliqué. Jamais la réponse.
 */
import { json, gerer, exigerSession, exigerProf } from '../../_commun.js';

export const onRequestGet = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  try {
    const r = await context.env.DB.prepare('SELECT quand, role, mode, matiere, ref, question, controle FROM tuteur_journal ORDER BY quand DESC LIMIT 150').all();
    return json({ journal: r.results || [] });
  } catch (e) { return json({ journal: [] }); }
});
