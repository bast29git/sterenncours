/**
 *   GET    /api/fichiers/:id   télécharge le fichier depuis R2 (B112 : en ligne pour images, PDF et audio ; B113 : 304 ; B114 : plages)
 *   HEAD   /api/fichiers/:id   les en-têtes seulement (B117)
 *   DELETE /api/fichiers/:id   supprime le fichier (auteur, ou espace professeur)
 */
import { json, erreur, gerer, exigerSession, MESSAGES, journaliser, methodeNonPermise } from '../../_commun.js';
import { identifiant } from '../../_valider.js';

export const onRequest = methodeNonPermise(['GET', 'HEAD', 'DELETE']);
const EN_LIGNE = (type) => /^(image\/|audio\/|application\/pdf)/.test(String(type || ''));

async function servir(context, sansCorps) {
  await exigerSession(context);
  const id = identifiant(context.params.id);
  if (!id) return erreur(MESSAGES.identifiant_invalide, 400, 'invalide', 'id');

  const ligne = await context.env.DB.prepare('SELECT * FROM fichiers WHERE id = ?').bind(id).first();
  if (!ligne) return erreur('Fichier introuvable.', 404);
  if (!context.env.FICHIERS) return erreur(MESSAGES.stockage_indisponible, 503);

  const siPas = context.request.headers.get('if-none-match');
  const plage = context.request.headers.get('range');
  const options = {};
  if (siPas) options.onlyIf = { etagDoesNotMatch: siPas.replace(/^W\//, '').replace(/"/g, '') };
  if (plage && !sansCorps) options.range = context.request.headers;
  const objet = await context.env.FICHIERS.get(ligne.cle_r2, options);
  if (!objet) return erreur('Contenu introuvable.', 404);

  const entetes = new Headers();
  objet.writeHttpMetadata(entetes);
  entetes.set('etag', objet.httpEtag);
  entetes.set('cache-control', 'private, max-age=3600');
  entetes.set('accept-ranges', 'bytes');
  entetes.set('x-content-type-options', 'nosniff');
  // B115 : un fichier servi ne peut ni exécuter de script ni être encadré ailleurs.
  entetes.set('content-security-policy', "default-src 'none'; sandbox");
  entetes.set('content-disposition', `${EN_LIGNE(ligne.type) ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(ligne.nom)}`);
  if (objet.body === undefined || objet.body === null) return new Response(null, { status: 304, headers: entetes });
  if (objet.range) {
    const debut = objet.range.offset || 0; const longueur = objet.range.length || (objet.size - debut);
    entetes.set('content-range', `bytes ${debut}-${debut + longueur - 1}/${objet.size}`);
    entetes.set('content-length', String(longueur));
    return new Response(sansCorps ? null : objet.body, { status: 206, headers: entetes });
  }
  entetes.set('content-length', String(objet.size));
  return new Response(sansCorps ? null : objet.body, { headers: entetes });
}

export const onRequestGet = gerer((context) => servir(context, false));
export const onRequestHead = gerer((context) => servir(context, true));

export const onRequestDelete = gerer(async (context) => {
  const session = await exigerSession(context);
  const id = identifiant(context.params.id);
  if (!id) return erreur(MESSAGES.identifiant_invalide, 400, 'invalide', 'id');

  const ligne = await context.env.DB.prepare('SELECT * FROM fichiers WHERE id = ?').bind(id).first();
  if (!ligne) return erreur('Fichier introuvable.', 404);
  if (session.role !== 'prof' && ligne.auteur !== session.role) {
    return erreur('Tu ne peux supprimer que tes propres fichiers.', 403);
  }

  if (context.env.FICHIERS) await context.env.FICHIERS.delete(ligne.cle_r2);
  await context.env.DB.prepare('DELETE FROM fichiers WHERE id = ?').bind(id).run();
  // B116 : la suppression est journalisée.
  await journaliser(context.env, session, 'fichier', id, ligne.nom, 'supprimé');
  return json({ supprime: id });
});
