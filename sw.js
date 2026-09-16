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

// बॅकग्राउंड नोटिफिकेशन हँडल करणे (App बंद किंवा Minimize असताना)
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification ? payload.notification.title : 'SUTOM Notification';
  const notificationOptions = {
    body: payload.notification ? payload.notification.body : 'नवीन इव्हेंट किंवा इश्यू आला आहे.',
    icon: '/icon.png',
    sound: 'default',
    vibrate: [500, 200, 500, 200, 500], // व्हायब्रेशन पॅटर्न
    requireInteraction: true, // जोपर्यंत युजर क्लिक करत नाही तोपर्यंत नोटिफिकेशन स्क्रीनवर राहील
    data: {
      url: payload.data && payload.data.url ? payload.data.url : '/'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// नोटिफिकेशनवर क्लिक केल्यावर ॲप ओपन करणे
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
