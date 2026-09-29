/**
 * _commun.js : helpers partagés par les fonctions du Worker.
 * Le préfixe « _ » exclut ce fichier du routage : il n'est jamais servi.
 */

import { MESSAGES } from './_messages.js';
export { MESSAGES };

export const COOKIE = 'sc_session';
export const DUREE_SESSION = 60 * 60 * 24 * 30; // 30 jours
export const ROLES = ['eleve', 'prof'];

export const maintenant = () => new Date().toISOString();

export function json(donnees, statut = 200, entetes = {}) {
  return new Response(JSON.stringify(donnees), {
    status: statut,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...entetes,
    },
  });
}

/* A33 : chaque erreur porte un code stable en plus du message en français. */
const CODES = { 400: 'invalide', 401: 'session', 403: 'interdit', 404: 'introuvable', 405: 'methode', 409: 'conflit', 413: 'trop_gros', 414: 'adresse', 415: 'type', 429: 'trop_vite', 500: 'interne', 503: 'indisponible' };
/** B5 : une erreur porte un message, un code stable, et le champ fautif quand il est connu. */
export const erreur = (message, statut = 400, code, champ) => json({ erreur: message, code: code || CODES[statut] || 'erreur', ...(champ ? { champ } : {}) }, statut, statut === 429 ? { 'retry-after': '60' } : {});
export const erreurChamp = (champ, message) => erreur(message, 400, 'invalide', champ);

/* A4 : journal d'audit des écritures sensibles. Ne bloque jamais l'écriture elle-même. */
export async function journaliser(env, session, quoi, cle, avant, apres) {
  try {
    if (!env || !env.DB) return;
    const enTexte = (v) => (v === undefined || v === null ? null : typeof v === 'string' ? v.slice(0, 400) : JSON.stringify(v).slice(0, 400));
    await env.DB.prepare('INSERT INTO journal (id, quand, qui, quoi, cle, avant, apres) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(nouvelId(), maintenant(), (session && session.role) || 'inconnu', quoi, cle || null, enTexte(avant), enTexte(apres)).run();
  } catch (e) { /* table absente avant la migration 0009 */ }
}

/* ---------- Cookies ------------------------------------------------------- */
export function lireCookie(request, nom) {
  const brut = request.headers.get('cookie') || '';
  for (const morceau of brut.split(';')) {
    const [c, ...v] = morceau.trim().split('=');
    if (c === nom) return decodeURIComponent(v.join('='));
  }
  return null;
}

export function cookieSession(jeton, dureeSecondes) {
  const base = `${COOKIE}=${jeton}; Path=/; HttpOnly; Secure; SameSite=Lax`;
  return dureeSecondes > 0 ? `${base}; Max-Age=${dureeSecondes}` : `${base}; Max-Age=0`;
}

/* ---------- Sessions ------------------------------------------------------ */
const hex = (octets) => [...new Uint8Array(octets)].map((o) => o.toString(16).padStart(2, '0')).join('');

/** B50 : la session retient un extrait du navigateur et le pays, pour la liste des sessions du professeur. */
export async function creerSession(env, role, request) {
  const jeton = hex(crypto.getRandomValues(new Uint8Array(32)));
  const agent = request ? String(request.headers.get('user-agent') || '').replace(/\s+/g, ' ').slice(0, 80) : '';
  const pays = request ? String(request.headers.get('cf-ipcountry') || '').slice(0, 2) : '';
  await env.SESSIONS.put(
    'session:' + jeton,
    JSON.stringify({ role, cree: maintenant(), renouvele: maintenant(), agent, pays }),
    { expirationTtl: DUREE_SESSION },
  );
  return jeton;
}

/** B62 : une révocation globale (professeur) rend caduque toute session ouverte avant cette date. */
export async function revocationGlobale(env) {
  try { return (await env.SESSIONS.get('revoque_avant')) || null; } catch (e) { return null; }
}

export async function lireSession(request, env) {
  const jeton = lireCookie(request, COOKIE);
  if (!jeton || !/^[0-9a-f]{64}$/.test(jeton)) return null;
  const brut = await env.SESSIONS.get('session:' + jeton);
  if (!brut) return null;
  try {
    const donnees = JSON.parse(brut);
    if (!ROLES.includes(donnees.role)) return null;
    const revoque = await revocationGlobale(env);
    if (revoque && donnees.cree && donnees.cree < revoque) return null;
    return { ...donnees, jeton };
  } catch (e) {
    return null;
  }
}

/** B26 : session glissante. Une session utilisée est prolongée, au plus une fois par jour, sans changer de jeton. */
export async function prolongerSession(env, session) {
  try {
    if (!session || !session.jeton) return;
    const dernier = session.renouvele || session.cree;
    if (dernier && Date.now() - new Date(dernier).getTime() < 86400000) return;
    const { jeton, ...donnees } = session;
    await env.SESSIONS.put('session:' + jeton, JSON.stringify({ ...donnees, renouvele: maintenant() }), { expirationTtl: DUREE_SESSION });
  } catch (e) { /* la prolongation est facultative */ }
}

/** B51 : les sessions ouvertes, sans leur jeton complet. */
export async function listerSessions(env) {
  const sortie = [];
  let curseur;
  do {
    const page = await env.SESSIONS.list({ prefix: 'session:', cursor: curseur, limit: 500 });
    for (const k of page.keys) {
      const brut = await env.SESSIONS.get(k.name);
      let d = null; try { d = JSON.parse(brut); } catch (e) { d = null; }
      if (d) sortie.push({ id: k.name.slice('session:'.length, 'session:'.length + 12), role: d.role, cree: d.cree, renouvele: d.renouvele || null, agent: d.agent || '', pays: d.pays || '' });
    }
    curseur = page.list_complete ? null : page.cursor;
  } while (curseur);
  return sortie.sort((a, b) => String(b.cree).localeCompare(String(a.cree)));
}

export async function supprimerSession(env, jeton) {
  if (jeton) await env.SESSIONS.delete('session:' + jeton);
}

/* ---------- Dérivation de code -------------------------------------------- */
function versOctets(chaineHex) {
  const sortie = new Uint8Array(chaineHex.length / 2);
  for (let i = 0; i < sortie.length; i += 1) {
    sortie[i] = parseInt(chaineHex.substr(i * 2, 2), 16);
  }
  return sortie;
}

/** Cloudflare plafonne PBKDF2 à 100 000 itérations : au-delà, l'appel échoue. */
export const ITERATIONS_MAX = 100000;

export async function deriver(code, selHex, iterations) {
  const tours = Math.min(Number(iterations) || ITERATIONS_MAX, ITERATIONS_MAX);
  const cle = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(code), 'PBKDF2', false, ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: versOctets(selHex), iterations: tours, hash: 'SHA-256' }, cle, 256,
  );
  return hex(bits);
}

/** Comparaison à temps constant : la durée ne doit pas révéler le préfixe correct. */
export function egal(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let ecart = 0;
  for (let i = 0; i < a.length; i += 1) ecart |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return ecart === 0;
}

/* ---------- Garde ---------------------------------------------------------- */
export async function exigerSession(context) {
  const session = await lireSession(context.request, context.env);
  if (!session) throw erreur(MESSAGES.session_expiree, 401);
  return session;
}

export function exigerProf(session) {
  if (session.role !== 'prof') throw erreur(MESSAGES.reserve_prof, 403);
  return session;
}

/** B2 : une erreur serveur est comptée dans la table des erreurs, dédoublonnée par empreinte, sans bloquer la réponse. */
async function consignerErreurServeur(context, e) {
  try {
    const env = context.env; if (!env || !env.DB) return;
    const message = ('serveur : ' + String((e && e.message) || e)).slice(0, 300);
    const source = new URL(context.request.url).pathname.slice(0, 200);
    const octets = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message + '|' + source));
    const empreinte = [...new Uint8Array(octets)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
    const now = maintenant();
    const role = (context.data && context.data.session && context.data.session.role) || 'serveur';
    await env.DB.prepare(
      `INSERT INTO erreurs (empreinte, message, source, ecran, role, n, premiere, derniere) VALUES (?, ?, ?, ?, ?, 1, ?, ?)
       ON CONFLICT(empreinte) DO UPDATE SET n = n + 1, derniere = excluded.derniere`,
    ).bind(empreinte, message, source, context.request.method, role, now, now).run();
  } catch (e2) { /* jamais bloquant */ }
}

/** Enveloppe un gestionnaire pour transformer les Response jetées en réponses.
 *  B1 : le détail interne n'est renvoyé qu'avec la variable DEBUG ; B3 : chaque réponse porte un identifiant de requête. */
export function gerer(fonction) {
  return async (context) => {
    const idRequete = nouvelId();
    try {
      const reponse = await fonction(context);
      if (reponse && reponse.headers && !reponse.headers.has('x-request-id')) {
        const sortie = new Response(reponse.body, reponse);
        sortie.headers.set('x-request-id', idRequete);
        return sortie;
      }
      return reponse;
    } catch (e) {
      if (e instanceof Response) return e;
      const debug = context.env && context.env.DEBUG;
      if (context.waitUntil) context.waitUntil(consignerErreurServeur(context, e)); else await consignerErreurServeur(context, e);
      return json({ erreur: MESSAGES.erreur_interne, code: 'interne', requete: idRequete, ...(debug ? { detail: String((e && e.message) || e) } : {}) }, 500, { 'x-request-id': idRequete });
    }
  };
}

/** B14 : un gestionnaire de repli pour les méthodes qu'une route n'implémente pas. */
export const methodeNonPermise = (permises) => () => json({ erreur: MESSAGES.methode_non_permise, code: 'methode', permises }, 405, { allow: permises.join(', ') });

/* ---------- Identifiants --------------------------------------------------- */
export const nouvelId = () => hex(crypto.getRandomValues(new Uint8Array(12)));
