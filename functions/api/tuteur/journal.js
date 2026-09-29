/**
 * GET /api/tuteur/journal?n=150&mode=exercices&depuis=<iso> : les dernières questions posées à Opale (professeur).
 * La question, le mode, la matière, le contrôle appliqué. Jamais la réponse. B174 : pagination et filtres.
 */
import { json, gerer, exigerSession, exigerProf, methodeNonPermise } from '../../_commun.js';
import { entier, dateHeureIso, texte } from '../../_valider.js';

export const onRequest = methodeNonPermise(['GET']);
export const onRequestGet = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const url = new URL(context.request.url);
  const n = entier(url.searchParams.get('n'), 1, 500, 150);
  const mode = texte(url.searchParams.get('mode'), 20);
  const depuis = dateHeureIso(url.searchParams.get('depuis'));
  const conditions = []; const valeurs = [];
  if (mode) { conditions.push('mode = ?'); valeurs.push(mode); }
  if (depuis) { conditions.push('quand >= ?'); valeurs.push(depuis); }
  const ou = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  try {
    const r = await context.env.DB.prepare(`SELECT quand, role, mode, matiere, ref, question, controle FROM tuteur_journal ${ou} ORDER BY quand DESC LIMIT ?`).bind(...valeurs, n).all();
    const parControle = {};
    for (const l of r.results || []) parControle[l.controle || 'aucun'] = (parControle[l.controle || 'aucun'] || 0) + 1;
    return json({ journal: r.results || [], parControle, n });
  } catch (e) { return json({ journal: [], parControle: {}, n }); }
});
