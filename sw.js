const CACHE_NAME = 'sutom-v2';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

/* ================= INSTALL ================= */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );

  self.skipWaiting();
});

/* ================= ACTIVATE ================= */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

/* ================= FETCH ================= */
self.addEventListener('fetch', (event) => {

  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

/* ================= PUSH NOTIFICATION ================= */
self.addEventListener('push', (event) => {

  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {
      title: 'SUTOM Alert',
      body: event.data ? event.data.text() : 'New notification'
    };
  }

  const title =
    data.notification?.title ||
    data.title ||
    'SUTOM Alert';

  const body =
    data.notification?.body ||
    data.body ||
    'New workflow notification';

  const options = {
    body: body,

    icon: './icon-192.png',

    badge: './icon-192.png',

    vibrate: [
      500,
      300,
      500,
      300,
      1000
    ],

    requireInteraction: true,

    tag: 'sutom-workflow-alert',

    renotify: true,

    data: {
      url: './'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/* ================= NOTIFICATION CLICK ================= */
self.addEventListener('notificationclick', (event) => {

  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {

      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow('./');
      }

    })
  );
});
