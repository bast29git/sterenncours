/** PUT /api/fiches : marque une fiche comme terminée, ou annule ce marquage. */
import { json, erreur, gerer, exigerSession, maintenant, MESSAGES } from '../_commun.js';
import { compter } from './usage.js';

export const onRequestPut = gerer(async (context) => {
  await exigerSession(context);
  const { DB } = context.env;

  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur(MESSAGES.requete_invalide); }
  const cle = String(corps && corps.cle || '');
  if (!/^[a-z0-9-]+\/[A-Za-z0-9]+\/[a-z]+$/.test(cle)) return erreur('Clé de fiche invalide.');

  if (corps.termine === false) {
    await DB.prepare('DELETE FROM fiches_lues WHERE cle = ?').bind(cle).run();
    return json({ cle, termine: false });
  }
  const date = maintenant();
  await DB.prepare(
    `INSERT INTO fiches_lues (cle, termine_le) VALUES (?, ?)
     ON CONFLICT(cle) DO UPDATE SET termine_le = excluded.termine_le`,
  ).bind(cle, date).run();
  await compter(context.env, 'fiche');
  return json({ cle, termine_le: date });
});
