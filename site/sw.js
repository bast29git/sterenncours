/* Opaline : service worker.
   La coquille et les données versionnées sont gardées en cache ; les pages et l'API vont
   toujours au réseau d'abord ; les fiches déjà ouvertes se relisent hors ligne. */
const VERSION = '__VERSION__';
const CACHE = 'opaline-' + VERSION;
// F052 : la coquille complète, feuilles de la direction calme et paquets de rôle compris.
const COQUILLE = ['/', '/index.html', '/socle.css', '/lecture.css', '/portail.css', '/eleve.css', '/calme.css', '/extras.css', '/prof.css', '/moteurs/aurora.css', '/favicon.svg', '/manifeste.json', '/app.js?v=' + VERSION, '/paquet-eleve.js?v=' + VERSION, '/paquet-prof.js?v=' + VERSION, '/data/programme-eleve.js', '/data/programme.js', '/data/jeux.js', '/data/exercices-index.js', '/fond/aurore-nuit.webp', '/fond/aurore-mobile.webp'];
// F053 : une page de secours, quand ni le réseau ni le cache n'ont l'accueil.
const HORS_LIGNE = '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Opaline : hors ligne</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F6F2EA;color:#1E1A2B;font-family:system-ui,sans-serif;line-height:1.6}main{max-width:26rem;padding:2rem;text-align:center}h1{font-size:1.4rem}button{font:inherit;padding:.6rem 1.2rem;border-radius:999px;border:0;background:#1F8F86;color:#fff;font-weight:700}</style></head><body><main><h1>Pas de connexion</h1><p>Opaline ne trouve pas le réseau. Les fiches déjà ouvertes restent lisibles dès que la page se recharge.</p><p><button type="button" onclick="location.reload()">Réessayer</button></p></main></body></html>';

self.addEventListener('install', (ev) => {
  ev.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(COQUILLE.map((u) => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (ev) => {
  ev.waitUntil(caches.keys().then((cles) => Promise.all(cles.filter((k) => k.indexOf('opaline-') === 0 && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (ev) => {
  if (ev.data === 'vider') caches.delete(CACHE);
  // F055 : la page peut demander à la nouvelle version d'entrer en service tout de suite.
  if (ev.data === 'activer') self.skipWaiting();
});

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  // L'API : réseau seulement, jamais de cache.
  if (url.pathname.indexOf('/api/') === 0) return;
  // Navigation et page d'accueil : réseau d'abord, cache en secours.
  if (req.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
    ev.respondWith(fetch(req).then((r) => { const copie = r.clone(); caches.open(CACHE).then((c) => c.put('/index.html', copie)); return r; }).catch(() => caches.match('/index.html').then((c) => c || new self.Response(HORS_LIGNE, { headers: { 'content-type': 'text/html; charset=utf-8' } }))));
    return;
  }
  // Fichiers versionnés (?v=) et données : cache d'abord, réseau en secours, mise en cache au passage.
  const versionne = url.searchParams.has('v') || url.pathname.indexOf('/data/') === 0 || url.pathname.indexOf('/fond/') === 0 || /\.(css|js|svg|webp|avif|jpg|png|woff2?)$/.test(url.pathname);
  if (!versionne) return;
  ev.respondWith(caches.match(req).then((trouve) => {
    const reseau = fetch(req).then((r) => { if (r.ok) { const copie = r.clone(); caches.open(CACHE).then((c) => c.put(req, copie)); } return r; }).catch(() => trouve);
    // Les données de contenu sont revalidées en arrière-plan ; le reste sort du cache tel quel.
    return trouve && url.pathname.indexOf('/data/') !== 0 ? trouve : (trouve ? (reseau, trouve) : reseau);
  }));
});
