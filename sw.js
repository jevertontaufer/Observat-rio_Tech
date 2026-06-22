/* ============================================================
   Observatório de Tecnologia Global — Service Worker
   - Cache "rede primeiro": online você sempre vê a versão nova;
     o cache só entra em ação quando estiver offline.
   - Nunca guarda chamadas /api/ (dados sempre atualizados).
   - Notificações (Web Push) na parte de baixo.
   ============================================================ */
const CACHE = 'otg-v1';
const CORE = ['./', 'index.html', 'manifest.json', 'fornecedores.js', 'icon-192.png'];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(function (c) {
      // guarda cada arquivo individualmente (se um faltar, não quebra os outros)
      return Promise.allSettled(CORE.map(function (u) { return c.add(u); }));
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  // dados dinâmicos sempre direto da rede (cotação, notícias, fornecedores, IA, push)
  if (url.pathname.indexOf('/api/') === 0) return;

  event.respondWith(
    fetch(req).then(function (res) {
      // salva uma cópia dos arquivos do próprio site para uso offline
      if (res && res.status === 200 && url.origin === self.location.origin) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
      }
      return res;
    }).catch(function () {
      // offline: tenta o cache; se for navegação, cai no index.html
      return caches.match(req).then(function (r) { return r || caches.match('index.html'); });
    })
  );
});

/* ============================================================
   AVISOS DE FEIRAS (Web Push)
   ============================================================ */
self.addEventListener('push', function (event) {
  var data = {};
  try { data = event.data.json(); } catch (e) { data = { body: (event.data && event.data.text) ? event.data.text() : '' }; }
  var title = data.title || 'Observatório de Tecnologia';
  var options = {
    body: data.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf(url) >= 0 && 'focus' in list[i]) return list[i].focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
/* ============================================================
   AVISOS DE FEIRAS (Web Push)
   Cole este trecho NO FINAL do seu arquivo sw.js (não apague o resto).
   ============================================================ */
self.addEventListener('push', function (event) {
  var data = {};
  try { data = event.data.json(); } catch (e) { data = { body: (event.data && event.data.text) ? event.data.text() : '' }; }
  var title = data.title || 'Observatório de Tecnologia';
  var options = {
    body: data.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf(url) >= 0 && 'focus' in list[i]) return list[i].focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
