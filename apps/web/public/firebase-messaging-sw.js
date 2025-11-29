importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

let firebaseConfig = null;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "FIREBASE_CONFIG") {
    firebaseConfig = event.data.config;
    initializeFirebase();
  }
});

function initializeFirebase() {
  if (!firebaseConfig) return;

  try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const notificationTitle = payload.notification?.title || "To Be Read";
      const notificationOptions = {
        body: payload.notification?.body || "",
        icon: "/icon-192.png",
        badge: "/badge-72.png",
        data: payload.data,
        tag: payload.data?.type || "default",
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data;
  let url = "/";

  if (data?.type === "like" && data?.reviewId) {
    url = `/review/${data.reviewId}`;
  } else if (data?.type === "comment" && data?.reviewId) {
    url = `/review/${data.reviewId}`;
  } else if (data?.type === "follow" && data?.userId) {
    url = `/user/${data.userId}`;
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
