// Service worker COSMOS: показывает push-напоминания и открывает приложение по нажатию.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : '' };
  }
  // iPhone требует показывать уведомление на каждый push
  event.waitUntil(
    self.registration.showNotification(data.title || 'COSMOS', {
      body: data.body || '',
      icon: 'icons/Icon-192.png',
      badge: 'icons/Icon-192.png',
      tag: data.tag || undefined,
      data: data.data || {},
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      return self.clients.openWindow('./');
    }),
  );
});
