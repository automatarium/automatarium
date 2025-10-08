import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching"
import { registerRoute } from 'workbox-routing';
import { googleFontsCache } from 'workbox-recipes';

// precache and route manifest urls during install phase.
// self.__WB_MANIFEST is populated by injectManifest in build-sw.js
precacheAndRoute(self.__WB_MANIFEST || []);

// Workbox provided recipe for caching google fonts
// https://developer.chrome.com/docs/workbox/modules/workbox-recipes#google_fonts_cache
googleFontsCache();

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

// Route navigations to index.html because SPA
const handler = createHandlerBoundToURL('./index.html');
registerRoute(
  ({ request }) => request.mode === 'navigate',
  handler
);