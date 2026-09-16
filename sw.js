// 1. Firebase Scripts Import (Background Notifications साठी)
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Firebase Configuration
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

// 2. Cache Configuration (Offline Support साठी)
const CACHE_NAME = 'sutom-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install Event: कॅशे फाईल्स सेव्ह करणे
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: जुना कॅशे साफ करणे
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Offline Files & Firebase API Handling
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  
  // Firebase किंवा इतर API कॉल्ससाठी कॅशे न वापरता थेट नेटवर्क वापरणे
  if (url.origin.includes('firebaseio.com') || url.origin.includes('googleapis.com')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // इतर लोकल फाईल्ससाठी कॅशे प्रथम तपासणे
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// 3. Background Notification Handler (PWA बंद असताना नोटिफिकेशन मिळण्यासाठी)
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Received background message: ', payload);

  const title = (payload.notification && payload.notification.title) || 'SUTOM Notification';
  const body = (payload.notification && payload.notification.body) || 'नवीन वर्कफ्लो अपडेट उपलब्ध आहे.';

  const options = {
    body: body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: 'sutom-persistent-alert',
    renotify: true,
    requireInteraction: true,
    vibrate: [500, 200, 500, 200, 500],
    data: payload.data || {}
  };

  self.registration.showNotification(title, options);
});

// Notification Click Handler: नोटिफिकेशनवर क्लिक केल्यावर app उघडणे
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
