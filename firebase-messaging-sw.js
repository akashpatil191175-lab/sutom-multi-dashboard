// SUTOM - Firebase Cloud Messaging Service Worker
// IMPORTANT: keep this file at the same origin/root as SUTOM_FINAL.html.

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBVieaz6NJuZ1d4pH0vccDZWeSRTKRO4xA",
  authDomain: "sutom-multi-dashboard.firebaseapp.com",
  databaseURL: "https://sutom-multi-dashboard-default-rtdb.firebaseio.com",
  projectId: "sutom-multi-dashboard",
  storageBucket: "sutom-multi-dashboard.firebasestorage.app",
  messagingSenderId: "202116185102",
  appId: "1:202116185102:web:28efd6421d0215d58ed05f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SUTOM SW] Background FCM:', payload);

  const data = payload.data || {};
  const notification = payload.notification || {};
  const title = notification.title || data.title || 'SUTOM Notification';
  const body = notification.body || data.body || 'New alert in SUTOM system.';

  // If the FCM message already contains a notification payload, browsers may
  // display it automatically. This handler is intentionally data-first so the
  // Cloud Function can send data-only messages and we always control the UI.
  self.registration.showNotification(title, {
    body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: data.notificationId || ('sutom-' + Date.now()),
    renotify: true,
    requireInteraction: true,
    vibrate: [500, 200, 500, 200, 500],
    data: { url: './', setupId: data.setupId || '' }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || './';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});
