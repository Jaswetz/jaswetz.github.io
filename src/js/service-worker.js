/**
 * Service Worker for Portfolio Caching and Performance
 * Implements caching strategies for static assets and offline support
 */

const CACHE_NAME = "portfolio-v1.0.0";
const STATIC_CACHE = "portfolio-static-v1.0.0";
const IMAGE_CACHE = "portfolio-images-v1.0.0";
const FONT_CACHE = "portfolio-fonts-v1.0.0";

// Assets to cache immediately on install
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/work.html",
  "/contact.html",
  "/css/main.css",
  "/js/main.js",
  "/js/enhanced-image-loader.js",
  "/js/analytics/simple-analytics.js",
  "/assets/favicons/favicon.ico",
  "/assets/favicons/apple-icon.png",
];

// Runtime caching strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets
  static: {
    cacheName: STATIC_CACHE,
    strategy: "cache-first",
  },
  // Network first for HTML pages
  pages: {
    cacheName: CACHE_NAME,
    strategy: "network-first",
  },
  // Cache first for images
  images: {
    cacheName: IMAGE_CACHE,
    strategy: "cache-first",
  },
  // Cache first for fonts
  fonts: {
    cacheName: FONT_CACHE,
    strategy: "cache-first",
  },
};

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[Service Worker] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("[Service Worker] Installation complete");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[Service Worker] Installation failed:", error);
      })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== IMAGE_CACHE &&
              cacheName !== FONT_CACHE &&
              !cacheName.startsWith(CACHE_NAME)
            ) {
              console.log("[Service Worker] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("[Service Worker] Activation complete");
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip external requests (except allowed domains)
  if (
    !url.origin.includes(self.location.origin) &&
    !url.origin.includes("fonts.googleapis.com") &&
    !url.origin.includes("fonts.gstatic.com") &&
    !url.origin.includes("www.google-analytics.com") &&
    !url.origin.includes("www.googletagmanager.com")
  ) {
    return;
  }

  // Handle different resource types
  if (request.destination === "document") {
    // HTML pages - Network first
    event.respondWith(handlePageRequest(request));
  } else if (
    request.destination === "image" ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)
  ) {
    // Images - Cache first
    event.respondWith(handleImageRequest(request));
  } else if (
    request.destination === "font" ||
    url.pathname.match(/\.(woff|woff2|ttf|eot)$/)
  ) {
    // Fonts - Cache first
    event.respondWith(handleFontRequest(request));
  } else if (
    request.destination === "script" ||
    request.destination === "style"
  ) {
    // Scripts and styles - Cache first
    event.respondWith(handleStaticRequest(request));
  } else {
    // Default - Network first
    event.respondWith(fetch(request));
  }
});

// Handle HTML page requests (Network First)
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Update cache with fresh response
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log(
      "[Service Worker] Network failed, trying cache for:",
      request.url
    );
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Ultimate fallback - offline page
  return (
    caches.match("/offline.html") ||
    new Response("<h1>Offline</h1><p>This page is not available offline.</p>", {
      headers: { "Content-Type": "text/html" },
    })
  );
}

// Handle image requests (Cache First)
async function handleImageRequest(request) {
  // Check cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Fetch from network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("[Service Worker] Image fetch failed:", request.url);
    // Return a placeholder or cached version if available
    return new Response("", { status: 404 });
  }
}

// Handle font requests (Cache First)
async function handleFontRequest(request) {
  // Check cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Fetch from network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(FONT_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("[Service Worker] Font fetch failed:", request.url);
    return new Response("", { status: 404 });
  }
}

// Handle static asset requests (Cache First)
async function handleStaticRequest(request) {
  // Check cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Fetch from network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("[Service Worker] Static asset fetch failed:", request.url);
    return new Response("", { status: 404 });
  }
}

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Background sync for analytics (if supported)
if (
  "serviceWorker" in navigator &&
  "sync" in window.ServiceWorkerRegistration.prototype
) {
  self.addEventListener("sync", (event) => {
    if (event.tag === "background-sync-analytics") {
      event.waitUntil(syncAnalyticsData());
    }
  });
}

async function syncAnalyticsData() {
  // Implementation for syncing queued analytics data
  console.log("[Service Worker] Syncing analytics data");
  // This would typically send queued analytics events to your server
}
