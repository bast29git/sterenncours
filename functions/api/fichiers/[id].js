/**
 *   GET    /api/fichiers/:id   télécharge le fichier depuis R2
 *   DELETE /api/fichiers/:id   supprime le fichier (auteur, ou espace professeur)
 */
import { json, erreur, gerer, exigerSession, MESSAGES } from '../../_commun.js';

export const onRequestGet = gerer(async (context) => {
  await exigerSession(context);
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur(MESSAGES.identifiant_invalide);

  const ligne = await context.env.DB.prepare('SELECT * FROM fichiers WHERE id = ?').bind(id).first();
  if (!ligne) return erreur('Fichier introuvable.', 404);
  if (!context.env.FICHIERS) return erreur('Stockage indisponible.', 503);

  const objet = await context.env.FICHIERS.get(ligne.cle_r2);
  if (!objet) return erreur('Contenu introuvable.', 404);

  const entetes = new Headers();
  objet.writeHttpMetadata(entetes);
  entetes.set('etag', objet.httpEtag);
  entetes.set('cache-control', 'private, max-age=3600');
  entetes.set('content-disposition',
    `attachment; filename*=UTF-8''${encodeURIComponent(ligne.nom)}`);
  return new Response(objet.body, { headers: entetes });
});

export const onRequestDelete = gerer(async (context) => {
  const session = await exigerSession(context);
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur(MESSAGES.identifiant_invalide);

  const ligne = await context.env.DB.prepare('SELECT * FROM fichiers WHERE id = ?').bind(id).first();
  if (!ligne) return erreur('Fichier introuvable.', 404);
  if (session.role !== 'prof' && ligne.auteur !== session.role) {
    return erreur('Tu ne peux supprimer que tes propres fichiers.', 403);
  }

  if (context.env.FICHIERS) await context.env.FICHIERS.delete(ligne.cle_r2);
  await context.env.DB.prepare('DELETE FROM fichiers WHERE id = ?').bind(id).run();
  return json({ supprime: id });
});
