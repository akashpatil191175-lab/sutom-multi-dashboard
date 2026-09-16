// firebase-messaging-sw.js
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

// Background notification handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title || 'SUTOM Notification';
  const notificationOptions = {
    body: payload.notification.body || 'New alert in SUTOM system.',
    icon: './icon-192.png',
    vibrate: [500, 200, 500, 200, 500],
    sound: 'default'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click event to open app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === './' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
