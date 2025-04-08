

importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID,
  };
  

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
if (!messaging) {
  console.error("FIREBASE MESSAGING NOT WORKING");
}
messaging.onBackgroundMessage((payload) => {
  console.log("RECEIVED BACKGROUND MESSAGE", payload);

  const notificationTitle = payload.notification.title;
  const link = payload.fcmOptions?.link || payload?.data?.link;

  const notificationOptions = {
    body: payload.notification.body,
    icon: "./file.svg",
    data: { url: link },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self?.addEventListener("notificationclick", function (event) {
  console.log("[firebase-messaging-sw.js] Notification click received");

  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        const url = event.notification.data.url;

        if (!url) {
          return;
        }

        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          console.log("OPENWINDOW ON CLIENT");
          return clients.openWindow(url);
        }
      })
  );
});
