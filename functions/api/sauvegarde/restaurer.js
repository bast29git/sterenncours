/**
 * POST /api/sauvegarde/restaurer : remplace le contenu des tables par un
 * instantané. { cle, confirmation: "restaurer" }. Un instantané de l'état
 * courant est écrit juste avant, pour pouvoir revenir en arrière.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, MESSAGES } from '../../_commun.js';
import { TABLES, instantane } from '../sauvegarde.js';

export const onRequestPost = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const { env } = context;
  if (!env.FICHIERS) return erreur('Le stockage R2 n\'est pas relié.', 503);
  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur(MESSAGES.requete_invalide); }
  if (corps.confirmation !== 'restaurer') return erreur('Écris « restaurer » pour confirmer.');
  const cle = String(corps.cle || '');
  if (!cle.startsWith('sauvegardes/') || !/^[\w/.-]+$/.test(cle)) return erreur('Clé invalide.');
  const objet = await env.FICHIERS.get(cle);
  if (!objet) return erreur('Instantané introuvable.', 404);
  const donnees = await objet.json();
  if (!donnees || !donnees.tables) return erreur('Instantané illisible.');

  // Filet : l'état courant est mis de côté avant d'être remplacé.
  const avant = await instantane(env.DB);
  const cleAvant = 'sauvegardes/avant-restauration-' + avant.le.replace(/[:.]/g, '-') + '.json';
  await env.FICHIERS.put(cleAvant, JSON.stringify(avant), { httpMetadata: { contentType: 'application/json; charset=utf-8' } });

  const rapport = {};
  for (const t of TABLES) {
    const lignes = donnees.tables[t];
    if (!Array.isArray(lignes)) { rapport[t] = 'ignorée'; continue; }
    await env.DB.prepare(`DELETE FROM ${t}`).run();
    if (!lignes.length) { rapport[t] = 0; continue; }
    const colonnes = Object.keys(lignes[0]);
    const marques = colonnes.map(() => '?').join(',');
    const requete = `INSERT OR REPLACE INTO ${t} (${colonnes.join(',')}) VALUES (${marques})`;
    const lot = lignes.map((l) => env.DB.prepare(requete).bind(...colonnes.map((c) => (l[c] === undefined ? null : l[c]))));
    for (let i = 0; i < lot.length; i += 50) await env.DB.batch(lot.slice(i, i + 50));
    rapport[t] = lignes.length;
  }
  return json({ restaure: cle, filet: cleAvant, le: maintenant(), rapport });
});
