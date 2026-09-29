/**
 * GET /api/journal?n=200&quoi=acces&depuis=<iso> : le journal d'audit des écritures sensibles (professeur).
 * B189, B190 : filtres par nature et par date ; B191 : les entrées de plus de cent quatre-vingts jours sont purgées.
 */
import { json, gerer, exigerSession, exigerProf, methodeNonPermise } from '../_commun.js';
import { entier, dateHeureIso, texte } from '../_valider.js';

export const onRequest = methodeNonPermise(['GET']);
export const onRequestGet = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const url = new URL(context.request.url);
  const n = entier(url.searchParams.get('n'), 10, 500, 200);
  const quoi = texte(url.searchParams.get('quoi'), 30);
  const depuis = dateHeureIso(url.searchParams.get('depuis'));
  const conditions = []; const valeurs = [];
  if (quoi) { conditions.push('quoi = ?'); valeurs.push(quoi); }
  if (depuis) { conditions.push('quand >= ?'); valeurs.push(depuis); }
  const ou = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  try {
    const r = await context.env.DB.prepare(`SELECT quand, qui, quoi, cle, avant, apres FROM journal ${ou} ORDER BY quand DESC LIMIT ?`).bind(...valeurs, n).all();
    const natures = await context.env.DB.prepare('SELECT quoi, COUNT(*) AS n FROM journal GROUP BY quoi ORDER BY n DESC').all().catch(() => ({ results: [] }));
    if (context.waitUntil) context.waitUntil(context.env.DB.prepare('DELETE FROM journal WHERE quand < ?').bind(new Date(Date.now() - 180 * 86400000).toISOString()).run().catch(() => {}));
    return json({ journal: r.results || [], natures: natures.results || [], n });
  } catch (e) { return json({ journal: [], natures: [], n }); }
});
