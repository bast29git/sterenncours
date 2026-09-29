/**
 * _middleware.js : porte d'entrée de tout le site.
 *
 * Seule la coquille du portail est publique. Tout le contenu pédagogique,
 * les données et les API exigent une session valide, vérifiée côté serveur.
 * Les codes d'accès ne sont plus présents dans le code envoyé au navigateur.
 */
import { lireSession, prolongerSession, MESSAGES, maintenant } from './_commun.js';
import { lireAcces, accesOuvert } from './api/acces.js';

// La coquille statique est publique : elle ne contient ni code d'accès, ni
// contenu pédagogique, ni donnée de suivi. Les modules de vue, les données
// du programme et toutes les API restent derrière la session.
const PUBLIC_EXACT = new Set([
  '/', '/index.html', '/socle.css', '/portail.css', '/eleve.css', '/calme.css', '/prof.css', '/extras.css',
  '/lecture.css', '/app.js', '/sw.js', '/favicon.svg', '/favicon.ico', '/manifeste.json',
  '/robots.txt', '/api/connexion', '/api/moi', '/api/version',
]);
const PUBLIC_PREFIXES = ['/theme/', '/moteurs/', '/fond/'];
const URL_MAX = 2048;
const REQUETE_MAX = 1024;
const LENTEUR_MS = 3000;
const LECTURES_PAR_MINUTE = 600;
const ECRITURES_PAR_MINUTE = 60;

const estPublic = (chemin) =>
  PUBLIC_EXACT.has(chemin) || PUBLIC_PREFIXES.some((p) => chemin.startsWith(p));

const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'";

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const chemin = url.pathname;
  const api = chemin.startsWith('/api/');
  const ecriture = request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS';

  // B23, B24, B25 : une adresse trop longue, une requête trop longue ou un chemin qui tente de remonter sont refusés avant tout.
  if (request.url.length > URL_MAX) return reponseJson({ erreur: MESSAGES.adresse_trop_longue, code: 'adresse' }, 414);
  if (url.search.length > REQUETE_MAX) return reponseJson({ erreur: MESSAGES.adresse_trop_longue, code: 'adresse' }, 414);
  if (chemin.includes('..') || chemin.includes('//') || /[\u0000-\u001F]/.test(chemin)) return reponseJson({ erreur: MESSAGES.chemin_invalide, code: 'invalide' }, 400);

  // B37 : pas d'API ouverte aux autres origines : une pré-vérification CORS reçoit 204 sans autorisation.
  if (request.method === 'OPTIONS' && api) return entetes(new Response(null, { status: 204, headers: { allow: 'GET, POST, PUT, PATCH, DELETE' } }), 'no-store', chemin);

  // B38, B39 : une écriture doit venir du site lui-même. Un client sans en-tête (script de sauvegarde) passe ; une autre origine, non.
  if (api && ecriture) {
    const origine = request.headers.get('origin');
    if (origine && origine !== url.origin) return reponseJson({ erreur: MESSAGES.origine_refusee, code: 'origine' }, 403);
    const site = request.headers.get('sec-fetch-site');
    if (site && site !== 'same-origin' && site !== 'none') return reponseJson({ erreur: MESSAGES.origine_refusee, code: 'origine' }, 403);
    // B36 : un corps non vide doit être du JSON, sauf pour le dépôt de fichiers (multipart).
    const type = String(request.headers.get('content-type') || '').toLowerCase();
    const longueur = Number(request.headers.get('content-length') || 0);
    const aCorps = longueur > 0 || request.headers.has('transfer-encoding');
    if (aCorps && !chemin.startsWith('/api/fichiers') && !type.startsWith('application/json')) return reponseJson({ erreur: MESSAGES.type_non_supporte, code: 'type' }, 415);
  }

  if (estPublic(chemin)) {
    const reponse = await next();
    // Une réponse d'API ne se met jamais en cache, même publique : sans cela
    // le navigateur rejoue une ancienne réponse et croit la session perdue.
    if (api) return entetes(reponse, 'no-store', chemin);
    return entetes(reponse, chemin.startsWith('/theme/') || chemin.startsWith('/fond/') ? 'public, max-age=86400' : 'public, max-age=300', chemin);
  }

  const session = await lireSession(request, env);
  if (!session) {
    if (api) return reponseJson({ erreur: MESSAGES.non_authentifie, code: 'session' }, 401);
    return Response.redirect(url.origin + '/', 302);
  }
  context.data.session = session;
  if (context.waitUntil) context.waitUntil(prolongerSession(env, session));

  // Les corrigés et les grilles d'évaluation ne sont servis qu'au professeur.
  // L'espace de Sterenn lit sa propre version, générée sans eux au build.
  if (session.role !== 'prof' && chemin.startsWith('/data/contenu/')) {
    return reponseJson({ erreur: MESSAGES.reserve_prof_contenu, code: 'interdit' }, 403);
  }

  // Le sujet d'évaluation d'une leçon n'est servi à Sterenn que si le
  // professeur a ouvert cette évaluation : la décision est appliquée ici,
  // avant de servir le fichier, pas seulement masquée dans l'interface.
  const evaluation = /^\/data\/evaluations\/([a-z0-9-]+)\/([A-Za-z0-9]+)\.js$/.exec(chemin)
    // Pages sert aussi l'adresse sans « .html » : la règle vaut pour les deux.
    || /^\/evaluations\/([a-z0-9-]+)\/([A-Za-z0-9]+)(?:\.html)?$/.exec(chemin);
  if (session.role !== 'prof' && evaluation) {
    const acces = await lireAcces(env.DB);
    if (!accesOuvert(acces[evaluation[1] + '/' + evaluation[2] + '/evaluation'])) {
      return reponseJson({ erreur: MESSAGES.evaluation_fermee, code: 'interdit' }, 403);
    }
    const rep = await next();
    return entetes(rep, 'no-store', chemin);
  }

  // Écritures : corps borné à 32 Ko et soixante écritures par minute et par session.
  // B29 : les lectures aussi sont plafonnées (six cents par minute), pour protéger la base d'une boucle.
  if (api) {
    if (ecriture) {
      const taille = Number(request.headers.get('content-length') || 0);
      const fichier = chemin.startsWith('/api/fichiers');
      // Les lots de séances et la restauration d'un instantané portent une année entière.
      const volumineux = chemin === '/api/seances/lot' || chemin === '/api/sauvegarde/restaurer';
      const borne = volumineux ? 1048576 : 32768;
      if (!fichier && taille > borne) return reponseJson({ erreur: `Requête trop volumineuse (${volumineux ? '1 Mo' : '32 Ko'} au plus).`, code: 'trop_gros' }, 413);
    }
    const refus = await debitDepasse(context, session, ecriture ? 'ecriture' : 'lecture', ecriture ? ECRITURES_PAR_MINUTE : LECTURES_PAR_MINUTE);
    if (refus) return reponseJson({ erreur: MESSAGES.trop_vite, code: 'trop_vite' }, 429, { 'retry-after': '60' });
  }

  const t0 = Date.now();
  let reponse = await next();
  // B15 : une adresse d'API inconnue répond en JSON, jamais avec la page d'accueil ni une page HTML 404.
  // Pages renvoie la coquille (200, HTML) pour un chemin inconnu : sous /api/, c'est une adresse qui n'existe pas.
  if (api && (reponse.status === 404 || String(reponse.headers.get('content-type') || '').includes('text/html'))) {
    reponse = reponseJson({ erreur: MESSAGES.route_inconnue, code: 'introuvable', chemin }, 404);
  }
  const duree = Date.now() - t0;
  // A54 : temps de réponse des fonctions, cumulé par jour dans KV (moyenne et maximum sur la page santé).
  // B44 : un appel lent (plus de trois secondes) est consigné avec sa route dans la table des erreurs.
  if (api && env.SESSIONS && context.waitUntil) {
    context.waitUntil((async () => {
      try {
        const cle = 'perf:' + new Date().toISOString().slice(0, 10);
        const p = JSON.parse((await env.SESSIONS.get(cle)) || '{"n":0,"total":0,"max":0}');
        p.n += 1; p.total += duree;
        if (duree > (p.max || 0)) { p.max = duree; p.route = chemin; }
        await env.SESSIONS.put(cle, JSON.stringify(p), { expirationTtl: 60 * 60 * 30 });
        if (duree > LENTEUR_MS && env.DB) {
          const message = `lenteur : ${request.method} ${chemin} en ${duree} ms`;
          const octets = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('lenteur|' + request.method + '|' + chemin));
          const empreinte = [...new Uint8Array(octets)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
          const now = maintenant();
          await env.DB.prepare(`INSERT INTO erreurs (empreinte, message, source, ecran, role, n, premiere, derniere) VALUES (?, ?, ?, ?, ?, 1, ?, ?)
            ON CONFLICT(empreinte) DO UPDATE SET n = n + 1, derniere = excluded.derniere, message = excluded.message`).bind(empreinte, message, chemin, 'serveur', session.role, now, now).run();
        }
      } catch (e) { /* mesure facultative */ }
    })());
  }

  // Le contenu est réservé : il peut vivre dans le cache du navigateur,
  // jamais dans un cache partagé en bordure de réseau.
  const sortie = entetes(reponse, api ? 'no-store' : cachePour(chemin), chemin);
  // B28 : la durée côté serveur, lisible dans les outils du navigateur.
  if (api) sortie.headers.set('server-timing', `fn;dur=${duree}`);
  return sortie;
}

/** B22 : la bibliothèque 3D et les polices embarquées ne changent pas : un an de cache, le reste dix minutes. */
function cachePour(chemin) {
  if (chemin.startsWith('/learning/vendor/')) return 'private, max-age=31536000, immutable';
  if (/\.(woff2?|ttf|otf)$/.test(chemin)) return 'private, max-age=31536000, immutable';
  if (chemin.startsWith('/learning/assets/')) return 'private, max-age=86400';
  return 'private, max-age=600';
}

/** B31, B32 : le compteur est indexé par le jeton de session déjà lu ; l'écriture du compteur ne retarde pas la réponse. */
async function debitDepasse(context, session, genre, plafond) {
  const { env } = context;
  if (!env.SESSIONS) return false;
  try {
    const cle = 'debit:' + genre + ':' + String(session.jeton || session.role).slice(0, 24) + ':' + Math.floor(Date.now() / 60000);
    const n = Number(await env.SESSIONS.get(cle)) || 0;
    if (n >= plafond) return true;
    const ecrire = env.SESSIONS.put(cle, String(n + 1), { expirationTtl: 120 });
    if (context.waitUntil) context.waitUntil(ecrire.catch(() => {})); else await ecrire;
  } catch (e) { /* sans compteur, on laisse passer */ }
  return false;
}
function reponseJson(objet, statut, extra) {
  return entetes(new Response(JSON.stringify(objet), { status: statut, headers: { 'content-type': 'application/json; charset=utf-8', ...(extra || {}) } }), 'no-store', '/api/');
}

function entetes(reponse, cache, chemin) {
  const sortie = new Response(reponse.body, reponse);
  sortie.headers.set('cache-control', cache);
  sortie.headers.set('x-content-type-options', 'nosniff');
  sortie.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  sortie.headers.set('x-frame-options', 'SAMEORIGIN');
  sortie.headers.set('permissions-policy', 'camera=(self), microphone=(self), geolocation=()');
  // B16, B17, B18, B42 : transport strict, isolation d'origine, ressources réservées au site, pas de politique Flash.
  sortie.headers.set('strict-transport-security', 'max-age=31536000; includeSubDomains');
  sortie.headers.set('cross-origin-opener-policy', 'same-origin');
  sortie.headers.set('cross-origin-resource-policy', 'same-origin');
  sortie.headers.set('x-permitted-cross-domain-policies', 'none');
  // B20 : rien n'est indexable, le portail compris (robots.txt le dit déjà, l'en-tête le répète aux moteurs).
  sortie.headers.set('x-robots-tag', 'noindex, nofollow, noarchive');
  // B21, B34 : une réponse réservée varie selon le cookie ; les réponses d'API sont en français.
  if (cache.startsWith('private') || cache === 'no-store') sortie.headers.append('vary', 'Cookie');
  if (chemin && chemin.startsWith('/api/')) sortie.headers.set('content-language', 'fr');
  if (!sortie.headers.has('content-security-policy')) sortie.headers.set('content-security-policy', CSP);
  return sortie;
}
