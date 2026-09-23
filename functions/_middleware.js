/**
 * _middleware.js : porte d'entrée de tout le site.
 *
 * Seule la coquille du portail est publique. Tout le contenu pédagogique,
 * les données et les API exigent une session valide, vérifiée côté serveur.
 * Les codes d'accès ne sont plus présents dans le code envoyé au navigateur.
 */
import { lireSession } from './_commun.js';

// La coquille statique est publique : elle ne contient ni code d'accès, ni
// contenu pédagogique, ni donnée de suivi. Les modules de vue, les données
// du programme et toutes les API restent derrière la session.
const PUBLIC_EXACT = new Set([
  '/', '/index.html', '/socle.css', '/portail.css', '/eleve.css', '/prof.css',
  '/lecture.css', '/app.js', '/favicon.svg', '/favicon.ico', '/manifeste.json',
  '/robots.txt', '/api/connexion', '/api/moi',
]);
const PUBLIC_PREFIXES = ['/theme/', '/moteurs/'];

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

  context.data.session = session;
  const reponse = await next();

  // Le contenu est réservé : il peut vivre dans le cache du navigateur,
  // jamais dans un cache partagé en bordure de réseau.
  return entetes(reponse, chemin.startsWith('/api/') ? 'no-store' : 'private, max-age=600');
}

function entetes(reponse, cache) {
  const sortie = new Response(reponse.body, reponse);
  sortie.headers.set('cache-control', cache);
  sortie.headers.set('x-content-type-options', 'nosniff');
  sortie.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  return sortie;
}
