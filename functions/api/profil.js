/**
 * GET /api/profil : toutes les clés du profil, valeurs JSON décodées.
 * PUT /api/profil : { cle, valeur } ; Sterenn écrit les clés « moi.* »,
 *   le professeur toutes. valeur null efface la clé.
 */
import { json, erreur, gerer, exigerSession, maintenant, MESSAGES, journaliser, methodeNonPermise } from '../_commun.js';
import { lireCorps } from '../_valider.js';

export const onRequest = methodeNonPermise(['GET', 'PUT', 'DELETE']);
const CLES_MAX = 500;

/* Une clé : des segments séparés par des points ; le dernier peut porter une référence
   de fiche (« maths/L01/cours »). Exemples : moi.carte, moi.trace.maths/L01/cours. */
const CLE = /^[a-z][a-z0-9_]*(\.[a-z0-9][a-z0-9_-]*(\/[A-Za-z0-9]+)*){1,4}$/;
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
  // B155 : un préfixe filtre les clés renvoyées (« moi.compagnon », « prof. »).
  const prefixe = String(new URL(context.request.url).searchParams.get('prefixe') || '').slice(0, 60);
  const profil = await lireProfil(context.env.DB);
  if (!prefixe) return json({ profil });
  return json({ profil: Object.fromEntries(Object.entries(profil).filter(([k]) => k.startsWith(prefixe))), prefixe });
});

async function effacer(context, session, cle) {
  const { DB } = context.env;
  const avant = await DB.prepare('SELECT valeur FROM profil WHERE cle = ?').bind(cle).first().catch(() => null);
  await DB.prepare('DELETE FROM profil WHERE cle = ?').bind(cle).run();
  if (!cle.startsWith('moi.')) await journaliser(context.env, session, 'profil', cle, avant ? avant.valeur : null, null);
  return json({ cle, valeur: null });
}

export const onRequestPut = gerer(async (context) => {
  const session = await exigerSession(context);
  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  const cle = String(corps.cle || '');
  if (!CLE.test(cle) || cle.length > 120) return erreur('Clé invalide.', 400, 'invalide', 'cle');
  if (session.role !== 'prof' && !cle.startsWith('moi.')) return erreur('Cette clé appartient au professeur.', 403);
  const { DB } = context.env;
  if (corps.valeur === null || corps.valeur === undefined) return effacer(context, session, cle);
  const valeur = JSON.stringify(corps.valeur);
  if (valeur.length > TAILLE_MAX) return erreur('Valeur trop longue.', 400, 'invalide', 'valeur');
  // B153 : le profil ne grossit pas sans fin : cinq cents clés au plus.
  const existe = await DB.prepare('SELECT valeur FROM profil WHERE cle = ?').bind(cle).first().catch(() => null);
  if (!existe) {
    const n = await DB.prepare('SELECT COUNT(*) AS n FROM profil').first().catch(() => ({ n: 0 }));
    if (n && n.n >= CLES_MAX) return erreur('Le profil est plein : efface des clés inutiles.', 400, 'plafond', 'cle');
  }
  await DB.prepare(
    `INSERT INTO profil (cle, valeur, maj_le, maj_par) VALUES (?, ?, ?, ?)
     ON CONFLICT(cle) DO UPDATE SET valeur = excluded.valeur, maj_le = excluded.maj_le, maj_par = excluded.maj_par`,
  ).bind(cle, valeur, maintenant(), session.role).run();
  // B154 : les clés du professeur (réglages, défis, félicitations) sont journalisées.
  if (!cle.startsWith('moi.')) await journaliser(context.env, session, 'profil', cle, existe ? existe.valeur : null, valeur);
  return json({ cle, valeur: corps.valeur });
});

/** B156 : DELETE /api/profil?cle=... efface une clé (mêmes droits que l'écriture). */
export const onRequestDelete = gerer(async (context) => {
  const session = await exigerSession(context);
  const cle = String(new URL(context.request.url).searchParams.get('cle') || '');
  if (!CLE.test(cle) || cle.length > 120) return erreur('Clé invalide.', 400, 'invalide', 'cle');
  if (session.role !== 'prof' && !cle.startsWith('moi.')) return erreur('Cette clé appartient au professeur.', 403);
  return effacer(context, session, cle);
});
