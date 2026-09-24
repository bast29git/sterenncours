/* Opaline : service worker.
   La coquille et les données versionnées sont gardées en cache ; les pages et l'API vont
   toujours au réseau d'abord ; les fiches déjà ouvertes se relisent hors ligne. */
const VERSION = '__VERSION__';
const CACHE = 'opaline-' + VERSION;
const COQUILLE = ['/', '/index.html', '/socle.css', '/lecture.css', '/portail.css', '/eleve.css', '/prof.css', '/moteurs/aurora.css', '/favicon.svg', '/manifeste.json', '/data/programme-eleve.js', '/data/programme.js', '/data/jeux.js', '/data/exercices-index.js', '/fond/aurore-nuit.webp', '/fond/aurore-mobile.webp'];

self.addEventListener('install', (ev) => {
  ev.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(COQUILLE.map((u) => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (ev) => {
  ev.waitUntil(caches.keys().then((cles) => Promise.all(cles.filter((k) => k.indexOf('opaline-') === 0 && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (ev) => { if (ev.data === 'vider') caches.delete(CACHE); });

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  // L'API : réseau seulement, jamais de cache.
  if (url.pathname.indexOf('/api/') === 0) return;
  // Navigation et page d'accueil : réseau d'abord, cache en secours.
  if (req.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
    ev.respondWith(fetch(req).then((r) => { const copie = r.clone(); caches.open(CACHE).then((c) => c.put('/index.html', copie)); return r; }).catch(() => caches.match('/index.html')));
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
