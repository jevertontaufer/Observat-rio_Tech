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
