/**
 * PUT /api/codes : remplacer un code d'accès sans redéploiement (professeur).
 *   { role: "eleve" | "prof", actuel: "<code professeur actuel>", nouveau: "<nouveau code>" }
 * Le code professeur actuel est exigé à chaque changement. Le nouveau code est
 * dérivé (PBKDF2 avec sel) et écrit dans KV : l'ancien cesse d'ouvrir aussitôt.
 * Les sessions ouvertes restent valides jusqu'à leur expiration.
 */
import { json, erreur, gerer, exigerSession, exigerProf, deriver, egal, ROLES, ITERATIONS_MAX, journaliser, MESSAGES, methodeNonPermise } from '../_commun.js';
import { lireCorps } from '../_valider.js';

export const onRequest = methodeNonPermise(['PUT']);
// B56 : les codes trop faciles à deviner sont refusés.
const FAIBLES = ['123456', '1234567', '12345678', 'azerty', 'azertyuiop', 'qwerty', 'motdepasse', 'password', 'sterenn', 'bastien', 'opaline', 'abcdef', '000000', '111111', 'aaaaaa'];

const hex = (octets) => [...new Uint8Array(octets)].map((b) => b.toString(16).padStart(2, '0')).join('');

export const onRequestPut = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const { env } = context;
  if (!env.SESSIONS) return erreur('Stockage des sessions non configuré.', 503);
  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  const role = String(corps.role || '');
  if (!ROLES.includes(role)) return erreur('Rôle inconnu.', 400, 'invalide', 'role');
  const actuel = String(corps.actuel || '').trim().toLowerCase();
  const nouveau = String(corps.nouveau || '').trim().toLowerCase();
  if (nouveau.length < 6 || nouveau.length > 64) return erreur('Le nouveau code fait entre 6 et 64 caractères.', 400, 'invalide', 'nouveau');
  if (!/^[a-z0-9][a-z0-9_.-]*$/.test(nouveau)) return erreur('Lettres, chiffres, point, tiret et souligné seulement.', 400, 'invalide', 'nouveau');
  if (FAIBLES.includes(nouveau) || /^(.)\1+$/.test(nouveau) || /^(0123456789|1234567890|abcdefghij)/.test(nouveau)) return erreur('Ce code est trop facile à deviner.', 400, 'invalide', 'nouveau');
  // B55 : le nouveau code ne peut pas être le code actuel de cet espace.
  const brutRole = await env.SESSIONS.get('auth:' + role);
  if (brutRole) { const a = JSON.parse(brutRole); if (egal(await deriver(nouveau, a.sel, a.iterations), a.empreinte)) return erreur('C\'est déjà le code en place.', 400, 'invalide', 'nouveau'); }

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
  // B57 : sur demande, les sessions ouvertes de cet espace sont fermées (sauf celle qui demande).
  let fermees = 0;
  if (corps.fermer_sessions === true) {
    let curseur;
    do {
      const page = await env.SESSIONS.list({ prefix: 'session:', cursor: curseur, limit: 500 });
      for (const k of page.keys) {
        if (k.name === 'session:' + session.jeton) continue;
        let d = null; try { d = JSON.parse(await env.SESSIONS.get(k.name)); } catch (e) { d = null; }
        if (d && d.role === role) { await env.SESSIONS.delete(k.name); fermees += 1; }
      }
      curseur = page.list_complete ? null : page.cursor;
    } while (curseur);
  }
  await journaliser(context.env, session, 'code', role, null, 'changé' + (fermees ? ` · ${fermees} session(s) fermée(s)` : ''));
  return json({ role, change: true, sessions_fermees: fermees });
});
