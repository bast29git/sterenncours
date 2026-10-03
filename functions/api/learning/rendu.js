/**
 * B202 : POST /api/learning/rendu : le diagnostic de rendu d'un monde 3D, envoyé par la garde de rendu de la
 * coquille (F237) quand une image noire a été détectée, qu'un contexte WebGL a été perdu, ou une fois en fin de
 * garde. Il va au journal (quoi = rendu3d) que le professeur lit sur /api/journal?quoi=rendu3d : carte graphique,
 * WebGL 2, mobile, rapport de pixels, étapes de dégradation, erreurs de shader, images par seconde.
 */
import { json, erreur, gerer, exigerSession, journaliser, MESSAGES, methodeNonPermise } from '../../_commun.js';
import { lireCorps } from '../../_valider.js';

export const onRequest = methodeNonPermise(['POST']);

export const onRequestPost = gerer(async (context) => {
  const session = await exigerSession(context);
  const corps = await lireCorps(context.request);
  if (!corps || typeof corps !== 'object' || !Object.keys(corps).length) return erreur(MESSAGES.requete_invalide);
  const jeu = String(corps.jeu || '').replace(/[^a-z0-9-]/gi, '').slice(0, 60) || null;
  const texte = (v, n) => (v == null ? '' : String(v).slice(0, n));
  const diag = {
    gpu: texte(corps.gpu, 80), webgl2: !!corps.webgl2, mobile: !!corps.mobile, ratio: Number(corps.ratio) || null,
    etapes: Array.isArray(corps.etapes) ? corps.etapes.slice(0, 6).map((e) => texte(e, 40)) : [],
    shaders: Math.min(99, Number(corps.shaders) || 0), contexte: Math.min(99, Number(corps.contexte) || 0),
    verifs: Math.min(999, Number(corps.verifs) || 0), noir: !!corps.noir, ips: Number(corps.ips) || null,
    raison: texte(corps.raison, 40), erreur: texte(corps.erreur, 160), ecran: texte(corps.ecran, 20),
  };
  await journaliser(context.env, session, 'rendu3d', jeu, null, diag);
  return json({ note: true });
});
