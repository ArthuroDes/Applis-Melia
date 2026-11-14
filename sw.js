/* Service worker : met l'application en cache pour un fonctionnement hors ligne (si servie en http/https) */
const CACHE = 'aeroenglish-v2';
const FILES = ['./', 'index.html', 'manifest.json', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png', 'css/style.css',
  'js/data/vocab-1.js', 'js/data/vocab-2.js', 'js/data/vocab-3.js', 'js/data/vocab-4.js', 'js/data/vocab-5.js',
  'js/data/conversation.js', 'js/data/grammar.js', 'js/data/texts.js', 'js/data/dialogues.js',
  'js/core/util.js', 'js/core/storage.js', 'js/core/data.js', 'js/core/srs.js', 'js/core/audio.js', 'js/core/diagrams.js',
  'js/core/exercises.js', 'js/core/lesson.js', 'js/core/ai.js', 'js/app.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
/* Réseau d'abord : chaque mise à jour publiée est récupérée dès que le téléphone est en ligne ;
   hors ligne, on sert la dernière version en cache. */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
