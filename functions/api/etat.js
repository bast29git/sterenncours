/**
 * GET /api/etat : tout l'état partagé en une seule requête.
 * Le site l'appelle au démarrage puis après chaque modification.
 */
import { json, gerer, exigerSession } from '../_commun.js';

export const onRequestGet = gerer(async (context) => {
  const session = await exigerSession(context);
  const { DB } = context.env;

  const [suivi, resultats, fiches, ouvertures, messages] = await Promise.all([
    DB.prepare('SELECT cle, niveau, note, maj_le, maj_par FROM suivi').all(),
    DB.prepare('SELECT cle, justes, total, meilleur, series, maj_le FROM resultats').all(),
    DB.prepare('SELECT cle, termine_le FROM fiches_lues').all(),
    DB.prepare('SELECT cle, etat FROM ouvertures').all(),
    DB.prepare('SELECT COUNT(*) AS n FROM messages WHERE auteur != ? AND lu_le IS NULL').bind(session.role).all(),
  ]);

  const enObjet = (lignes, cleChamp) => {
    const sortie = {};
    for (const l of lignes) {
      const { [cleChamp]: k, ...reste } = l;
      sortie[k] = reste;
    }
    return sortie;
  };

  return json({
    role: session.role,
    suivi: enObjet(suivi.results || [], 'cle'),
    resultats: enObjet(resultats.results || [], 'cle'),
    fiches: enObjet(fiches.results || [], 'cle'),
    ouvertures: enObjet(ouvertures.results || [], 'cle'),
    messagesNonLus: (messages.results && messages.results[0] && messages.results[0].n) || 0,
  });
});
