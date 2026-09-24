/**
 * GET /api/journal?n=200 : le journal d'audit des écritures sensibles (professeur).
 */
import { json, gerer, exigerSession, exigerProf } from '../_commun.js';

export const onRequestGet = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const url = new URL(context.request.url);
  const n = Math.min(500, Math.max(10, Number(url.searchParams.get('n')) || 200));
  try {
    const r = await context.env.DB.prepare('SELECT quand, qui, quoi, cle, avant, apres FROM journal ORDER BY quand DESC LIMIT ?').bind(n).all();
    return json({ journal: r.results || [] });
  } catch (e) { return json({ journal: [] }); }
});
