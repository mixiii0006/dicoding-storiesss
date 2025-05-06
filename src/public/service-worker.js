  mas// Names of caches
const CACHE_NAME = "dicoding-stories-cache-v2";
const DATA_CACHE_NAME = "dicoding-stories-data-cache-v2";

// Files to cache for offline usage (Application Shell)
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/favicon.png",
  "/manifest.json",
  "/styles/styles.css",
  "/scripts/index.js",
  "/scripts/pages/app.js",
  "/scripts/pages/home/home-page.js",
  "/scripts/pages/home/home-presenter.js",
  "/scripts/routes/routes.js",
  "/scripts/routes/url-parser.js",
  "/scripts/data/api.js",
  "/scripts/config.js",
  "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://unpkg.com/leaflet/dist/leaflet.css",
  "https://unpkg.com/leaflet/dist/leaflet.js",
];

// Install event - cache application shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Pre-caching offline resources");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/stories")) {
    // Network first for API data
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) =>
        fetch(event.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          })
          .catch(() => cache.match(event.request))
      )
    );
    return;
  }

  // Cache first for other requests (application shell)
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Push event - show notification
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  const title = data.title || "Dicoding Stories";
  const options = {
    body: data.body || "You have a new notification.",
    icon: "/favicon.png",
    badge: "/favicon.png",
    data: data.url || "/",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event - open or focus the app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data);
      }
    })
  );
});
