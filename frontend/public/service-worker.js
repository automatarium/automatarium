import { precacheAndRoute } from "workbox-precaching"

// precache and route manifest urls during install phase.
// self.__WB_MANIFEST is populated by injectManifest in build-sw.ts
precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener("install", () => {
  // Activate this worker immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {

      const clientsList = await self.clients.matchAll({type: "window", includeUncontrolled: true });

      // Take control of all clients (pages) immediately
      await self.clients.claim();

      // Once install completes, tell clients that offline is ready
      for (const client of clientsList) {
        client.postMessage({ type: "OFFLINE_READY" });
      }

      })()
    );
  });