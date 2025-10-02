import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching"
import { registerRoute } from 'workbox-routing';
import { PDAgifs, FSAgifs, TMgifs } from '../src/config/tour-gifs-manifest.json'

const manifest = self.__WB_MANIFEST || [];

const formatCacheEntries = (links) => {
  return links.map(url => ({url, revision: null}));
}

const extraCacheEntries = formatCacheEntries([...FSAgifs, ...PDAgifs, ...TMgifs]);

precacheAndRoute([...manifest, ...extraCacheEntries]);

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
const handler = createHandlerBoundToURL('/index.html');
registerRoute(
  ({ request }) => request.mode === 'navigate',
  handler
);