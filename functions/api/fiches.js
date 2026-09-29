/** PUT /api/fiches : marque une fiche comme terminée, ou annule ce marquage. */
import { json, erreur, gerer, exigerSession, maintenant, MESSAGES, methodeNonPermise } from '../_commun.js';
import { lireCorps, cleFiche } from '../_valider.js';
import { PROGRAMME } from '../_programme.js';
import { compter } from './usage.js';

export const onRequest = methodeNonPermise(['PUT']);
const LECONS = new Set(PROGRAMME.flatMap((m) => m.lecons.map((l) => m.id + '/' + l.ref)));

export const onRequestPut = gerer(async (context) => {
  await exigerSession(context);
  const { DB } = context.env;

  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  // B148 : la clé suit le format « matiere/ref/type » avec un type connu, et la leçon existe au programme.
  const cle = cleFiche(corps.cle);
  if (!cle) return erreur('Clé de fiche invalide.', 400, 'invalide', 'cle');
  if (!LECONS.has(cle.split('/').slice(0, 2).join('/'))) return erreur(MESSAGES.cle_lecon_invalide, 400, 'invalide', 'cle');

  if (corps.termine === false) {
    await DB.prepare('DELETE FROM fiches_lues WHERE cle = ?').bind(cle).run();
    return json({ cle, termine: false });
  }
  const deja = await DB.prepare('SELECT termine_le FROM fiches_lues WHERE cle = ?').bind(cle).first();
  const date = maintenant();
  await DB.prepare(
    `INSERT INTO fiches_lues (cle, termine_le) VALUES (?, ?)
     ON CONFLICT(cle) DO UPDATE SET termine_le = excluded.termine_le`,
  ).bind(cle, date).run();
  // Une fiche déjà terminée n'est pas recomptée dans l'usage du jour.
  if (!deja) await compter(context.env, 'fiche');
  return json({ cle, termine_le: date, premiere_fois: !deja });
});
