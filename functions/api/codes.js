/**
 * PUT /api/codes : remplacer un code d'accès sans redéploiement (professeur).
 *   { role: "eleve" | "prof", actuel: "<code professeur actuel>", nouveau: "<nouveau code>" }
 * Le code professeur actuel est exigé à chaque changement. Le nouveau code est
 * dérivé (PBKDF2 avec sel) et écrit dans KV : l'ancien cesse d'ouvrir aussitôt.
 * Les sessions ouvertes restent valides jusqu'à leur expiration.
 */
import { json, erreur, gerer, exigerSession, exigerProf, deriver, egal, ROLES, ITERATIONS_MAX, journaliser, MESSAGES } from '../_commun.js';

const hex = (octets) => [...new Uint8Array(octets)].map((b) => b.toString(16).padStart(2, '0')).join('');

export const onRequestPut = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const { env } = context;
  if (!env.SESSIONS) return erreur('Stockage des sessions non configuré.', 503);
  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur(MESSAGES.requete_invalide); }
  const role = String(corps && corps.role || '');
  if (!ROLES.includes(role)) return erreur('Rôle inconnu.');
  const actuel = String(corps.actuel || '').trim().toLowerCase();
  const nouveau = String(corps.nouveau || '').trim().toLowerCase();
  if (nouveau.length < 6 || nouveau.length > 64) return erreur('Le nouveau code fait entre 6 et 64 caractères.');
  if (!/^[a-z0-9][a-z0-9_.-]*$/.test(nouveau)) return erreur('Lettres, chiffres, point, tiret et souligné seulement.');

  const brutProf = await env.SESSIONS.get('auth:prof');
  if (!brutProf) return erreur('Code professeur introuvable.', 500);
  const prof = JSON.parse(brutProf);
  const candidat = await deriver(actuel, prof.sel, prof.iterations);
  if (!egal(candidat, prof.empreinte)) return erreur('Le code professeur actuel ne correspond pas.', 403);

  // Le nouveau code ne doit pas ouvrir l'autre espace.
  const autre = ROLES.find((r) => r !== role);
  const brutAutre = await env.SESSIONS.get('auth:' + autre);
  if (brutAutre) {
    const a = JSON.parse(brutAutre);
    if (egal(await deriver(nouveau, a.sel, a.iterations), a.empreinte)) return erreur('Ce code est déjà celui de l\'autre espace.');
  }

  const sel = hex(crypto.getRandomValues(new Uint8Array(16)));
  const empreinte = await deriver(nouveau, sel, ITERATIONS_MAX);
  await env.SESSIONS.put('auth:' + role, JSON.stringify({ sel, iterations: ITERATIONS_MAX, empreinte, change_le: new Date().toISOString() }));
  await journaliser(context.env, session, 'code', role, null, 'changé');
  return json({ role, change: true });
});
