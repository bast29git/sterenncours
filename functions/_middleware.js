/**
 * _middleware.js : porte d'entrée de tout le site.
 *
 * Seule la coquille du portail est publique. Tout le contenu pédagogique,
 * les données et les API exigent une session valide, vérifiée côté serveur.
 * Les codes d'accès ne sont plus présents dans le code envoyé au navigateur.
 */
import { lireSession } from './_commun.js';
import { lireAcces, accesOuvert } from './api/acces.js';

// La coquille statique est publique : elle ne contient ni code d'accès, ni
// contenu pédagogique, ni donnée de suivi. Les modules de vue, les données
// du programme et toutes les API restent derrière la session.
const PUBLIC_EXACT = new Set([
  '/', '/index.html', '/socle.css', '/portail.css', '/eleve.css', '/prof.css',
  '/lecture.css', '/app.js', '/favicon.svg', '/favicon.ico', '/manifeste.json',
  '/robots.txt', '/api/connexion', '/api/moi',
]);
const PUBLIC_PREFIXES = ['/theme/', '/moteurs/', '/fond/'];

const estPublic = (chemin) =>
  PUBLIC_EXACT.has(chemin) || PUBLIC_PREFIXES.some((p) => chemin.startsWith(p));

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const chemin = url.pathname;

  if (estPublic(chemin)) {
    const reponse = await next();
    // Une réponse d'API ne se met jamais en cache, même publique : sans cela
    // le navigateur rejoue une ancienne réponse et croit la session perdue.
    if (chemin.startsWith('/api/')) return entetes(reponse, 'no-store');
    return entetes(reponse, chemin.startsWith('/theme/') ? 'public, max-age=3600' : 'public, max-age=300');
  }

  const session = await lireSession(request, env);
  if (!session) {
    if (chemin.startsWith('/api/')) {
      return new Response(JSON.stringify({ erreur: 'Non authentifié' }), {
        status: 401,
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      });
    }
    return Response.redirect(url.origin + '/', 302);
  }

  // Les corrigés et les grilles d'évaluation ne sont servis qu'au professeur.
  // L'espace de Sterenn lit sa propre version, générée sans eux au build.
  if (session.role !== 'prof' && chemin.startsWith('/data/contenu/')) {
    return new Response(JSON.stringify({ erreur: 'Réservé à l\'espace professeur' }), {
      status: 403,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }

  // Le sujet d'évaluation d'une leçon n'est servi à Sterenn que si le
  // professeur a ouvert cette évaluation : la décision est appliquée ici,
  // avant de servir le fichier, pas seulement masquée dans l'interface.
  const evaluation = /^\/data\/evaluations\/([a-z0-9-]+)\/([A-Za-z0-9]+)\.js$/.exec(chemin);
  if (session.role !== 'prof' && evaluation) {
    const acces = await lireAcces(env.DB);
    if (!accesOuvert(acces[evaluation[1] + '/' + evaluation[2] + '/evaluation'])) {
      return new Response(JSON.stringify({ erreur: 'Cette évaluation n\'est pas ouverte.' }), {
        status: 403,
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      });
    }
    context.data.session = session;
    const rep = await next();
    return entetes(rep, 'no-store');
  }

  // Écritures : corps borné à 32 Ko et soixante écritures par minute et par session.
  if (chemin.startsWith('/api/') && request.method !== 'GET' && request.method !== 'HEAD') {
    const taille = Number(request.headers.get('content-length') || 0);
    const fichier = chemin.startsWith('/api/fichiers');
    // Les lots de séances et la restauration d'un instantané portent une année entière.
    const volumineux = chemin === '/api/seances/lot' || chemin === '/api/sauvegarde/restaurer';
    const borne = volumineux ? 1048576 : 32768;
    if (!fichier && taille > borne) return reponseJson({ erreur: `Requête trop volumineuse (${volumineux ? '1 Mo' : '32 Ko'} au plus).` }, 413);
    const refus = await debitDepasse(env, session, request);
    if (refus) return reponseJson({ erreur: 'Trop de requêtes d\'un coup : attends une minute.' }, 429);
  }

  context.data.session = session;
  const t0 = Date.now();
  const reponse = await next();
  // A54 : temps de réponse des fonctions, cumulé par jour dans KV (moyenne et maximum sur la page santé).
  if (chemin.startsWith('/api/') && env.SESSIONS) {
    context.waitUntil((async () => {
      try {
        const duree = Date.now() - t0;
        const cle = 'perf:' + new Date().toISOString().slice(0, 10);
        const p = JSON.parse((await env.SESSIONS.get(cle)) || '{"n":0,"total":0,"max":0}');
        p.n += 1; p.total += duree; p.max = Math.max(p.max || 0, duree);
        await env.SESSIONS.put(cle, JSON.stringify(p), { expirationTtl: 60 * 60 * 30 });
      } catch (e) { /* mesure facultative */ }
    })());
  }

  // Le contenu est réservé : il peut vivre dans le cache du navigateur,
  // jamais dans un cache partagé en bordure de réseau.
  return entetes(reponse, chemin.startsWith('/api/') ? 'no-store' : 'private, max-age=600');
}

const ECRITURES_PAR_MINUTE = 60;
async function debitDepasse(env, session, request) {
  if (!env.SESSIONS) return false;
  try {
    const jeton = (request.headers.get('cookie') || '').replace(/^.*sc_session=([^;]+).*$/, '$1').slice(0, 24) || session.role;
    const cle = 'debit:' + jeton + ':' + Math.floor(Date.now() / 60000);
    const n = Number(await env.SESSIONS.get(cle)) || 0;
    if (n >= ECRITURES_PAR_MINUTE) return true;
    await env.SESSIONS.put(cle, String(n + 1), { expirationTtl: 120 });
  } catch (e) { /* sans compteur, on laisse passer */ }
  return false;
}
function reponseJson(objet, statut) {
  return new Response(JSON.stringify(objet), { status: statut, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

function entetes(reponse, cache) {
  const sortie = new Response(reponse.body, reponse);
  sortie.headers.set('cache-control', cache);
  sortie.headers.set('x-content-type-options', 'nosniff');
  sortie.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  sortie.headers.set('x-frame-options', 'SAMEORIGIN');
  sortie.headers.set('permissions-policy', 'camera=(self), microphone=(self), geolocation=()');
  if (!sortie.headers.has('content-security-policy')) {
    sortie.headers.set('content-security-policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; worker-src 'self' blob:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'");
  }
  return sortie;
}
