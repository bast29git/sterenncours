/**
 * GET /api/profil : toutes les clés du profil, valeurs JSON décodées.
 * PUT /api/profil : { cle, valeur } ; Sterenn écrit les clés « moi.* »,
 *   le professeur toutes. valeur null efface la clé.
 */
import { json, erreur, gerer, exigerSession, maintenant } from '../_commun.js';

/* Une clé : des segments séparés par des points ; le dernier peut porter une référence
   de fiche (« maths/L01/cours »). Exemples : moi.carte, moi.trace.maths/L01/cours. */
const CLE = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_-]*(\/[A-Za-z0-9]+)*){1,4}$/;
const TAILLE_MAX = 20000;

export async function lireProfil(DB) {
  const sortie = {};
  try {
    const r = await DB.prepare('SELECT cle, valeur, maj_le, maj_par FROM profil').all();
    for (const l of r.results || []) {
      try { sortie[l.cle] = JSON.parse(l.valeur); } catch (e) { sortie[l.cle] = l.valeur; }
    }
  } catch (e) { /* table absente avant la migration */ }
  return sortie;
}

export const onRequestGet = gerer(async (context) => {
  await exigerSession(context);
  return json({ profil: await lireProfil(context.env.DB) });
});

export const onRequestPut = gerer(async (context) => {
  const session = await exigerSession(context);
  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }
  const cle = String(corps && corps.cle || '');
  if (!CLE.test(cle) || cle.length > 120) return erreur('Clé invalide.');
  if (session.role !== 'prof' && !cle.startsWith('moi.')) return erreur('Cette clé appartient au professeur.', 403);
  const { DB } = context.env;
  if (corps.valeur === null || corps.valeur === undefined) {
    await DB.prepare('DELETE FROM profil WHERE cle = ?').bind(cle).run();
    return json({ cle, valeur: null });
  }
  const valeur = JSON.stringify(corps.valeur);
  if (valeur.length > TAILLE_MAX) return erreur('Valeur trop longue.');
  await DB.prepare(
    `INSERT INTO profil (cle, valeur, maj_le, maj_par) VALUES (?, ?, ?, ?)
     ON CONFLICT(cle) DO UPDATE SET valeur = excluded.valeur, maj_le = excluded.maj_le, maj_par = excluded.maj_par`,
  ).bind(cle, valeur, maintenant(), session.role).run();
  return json({ cle, valeur: corps.valeur });
});
