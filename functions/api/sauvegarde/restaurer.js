/**
 * POST /api/sauvegarde/restaurer : remplace le contenu des tables par un
 * instantané. { cle, confirmation: "restaurer", simulation?: true }.
 * Un instantané de l'état courant est écrit juste avant, pour pouvoir revenir en arrière.
 * B183 : avec simulation, rien n'est écrit : le rapport dit ce qui se passerait.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, MESSAGES, journaliser, methodeNonPermise } from '../../_commun.js';
import { lireCorps } from '../../_valider.js';
import { TABLES, instantane, sha256, colonnesDe } from '../sauvegarde.js';

export const onRequest = methodeNonPermise(['POST']);
export const onRequestPost = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const { env } = context;
  if (!env.FICHIERS) return erreur('Le stockage R2 n\'est pas relié.', 503);
  const corps = await lireCorps(context.request, 1048576);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  const simulation = corps.simulation === true;
  if (!simulation && corps.confirmation !== 'restaurer') return erreur('Écris « restaurer » pour confirmer.', 400, 'invalide', 'confirmation');
  const cle = String(corps.cle || '');
  if (!cle.startsWith('sauvegardes/') || !/^[\w/.-]+$/.test(cle)) return erreur('Clé invalide.', 400, 'invalide', 'cle');
  const objet = await env.FICHIERS.get(cle);
  if (!objet) return erreur('Instantané introuvable.', 404);
  const donnees = await objet.json();
  if (!donnees || !donnees.tables) return erreur('Instantané illisible.', 400, 'invalide', 'cle');
  // B180 : l'empreinte de l'instantané doit correspondre à son contenu.
  if (donnees.empreinte && donnees.empreinte !== await sha256(JSON.stringify(donnees.tables))) return erreur('L\'instantané est abîmé : son empreinte ne correspond pas.', 409, 'conflit');

  // B182 : seules les colonnes qui existent dans la base sont réécrites ; les autres sont ignorées et signalées.
  const rapport = {}; const ignorees = {};
  const lots = [];
  for (const t of TABLES) {
    const lignes = donnees.tables[t];
    if (!Array.isArray(lignes)) { rapport[t] = 'ignorée'; continue; }
    const connues = new Set(await colonnesDe(env.DB, t));
    const colonnes = lignes.length ? Object.keys(lignes[0]).filter((c) => connues.has(c)) : [];
    const perdues = lignes.length ? Object.keys(lignes[0]).filter((c) => !connues.has(c)) : [];
    if (perdues.length) ignorees[t] = perdues;
    rapport[t] = lignes.length;
    if (simulation) continue;
    lots.push(env.DB.prepare(`DELETE FROM ${t}`));
    if (!lignes.length || !colonnes.length) continue;
    const marques = colonnes.map(() => '?').join(',');
    const requete = `INSERT OR REPLACE INTO ${t} (${colonnes.join(',')}) VALUES (${marques})`;
    for (const l of lignes) lots.push(env.DB.prepare(requete).bind(...colonnes.map((c) => (l[c] === undefined ? null : l[c]))));
  }
  if (simulation) return json({ simulation: true, cle, le: donnees.le, rapport, colonnes_ignorees: ignorees });

  // Filet : l'état courant est mis de côté avant d'être remplacé.
  const avant = await instantane(env.DB);
  const cleAvant = 'sauvegardes/avant-restauration-' + avant.le.replace(/[:.]/g, '-') + '.json';
  await env.FICHIERS.put(cleAvant, JSON.stringify(avant), { httpMetadata: { contentType: 'application/json; charset=utf-8' } });
  for (let i = 0; i < lots.length; i += 50) await env.DB.batch(lots.slice(i, i + 50));
  // B184 : la restauration est journalisée.
  await journaliser(context.env, session, 'restauration', cle, cleAvant, JSON.stringify(rapport).slice(0, 300));
  return json({ restaure: cle, filet: cleAvant, le: maintenant(), rapport, colonnes_ignorees: ignorees });
});
