/**
 * _commun.js : helpers partagés par les fonctions du Worker.
 * Le préfixe « _ » exclut ce fichier du routage : il n'est jamais servi.
 */

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

export const erreur = (message, statut = 400) => json({ erreur: message }, statut);

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

export async function creerSession(env, role) {
  const jeton = hex(crypto.getRandomValues(new Uint8Array(32)));
  await env.SESSIONS.put(
    'session:' + jeton,
    JSON.stringify({ role, cree: maintenant() }),
    { expirationTtl: DUREE_SESSION },
  );
  return jeton;
}

export async function lireSession(request, env) {
  const jeton = lireCookie(request, COOKIE);
  if (!jeton || !/^[0-9a-f]{64}$/.test(jeton)) return null;
  const brut = await env.SESSIONS.get('session:' + jeton);
  if (!brut) return null;
  try {
    const donnees = JSON.parse(brut);
    if (!ROLES.includes(donnees.role)) return null;
    return { ...donnees, jeton };
  } catch (e) {
    return null;
  }
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
  if (!session) throw erreur('Session expirée. Reconnecte-toi.', 401);
  return session;
}

export function exigerProf(session) {
  if (session.role !== 'prof') throw erreur('Réservé à l\'espace professeur.', 403);
  return session;
}

/** Enveloppe un gestionnaire pour transformer les Response jetées en réponses. */
export function gerer(fonction) {
  return async (context) => {
    try {
      return await fonction(context);
    } catch (e) {
      if (e instanceof Response) return e;
      return json({ erreur: 'Erreur interne', detail: String(e && e.message || e) }, 500);
    }
  };
}

/* ---------- Identifiants --------------------------------------------------- */
export const nouvelId = () => hex(crypto.getRandomValues(new Uint8Array(12)));
