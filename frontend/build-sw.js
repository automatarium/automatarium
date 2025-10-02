import { injectManifest } from 'workbox-build';

const extraEntries = [];

injectManifest({
  swSrc: 'dist/service-worker.js',
  swDest: 'dist/service-worker.js',
  globDirectory: 'dist',
  globPatterns: ["**/*.{js,css,html,svg,png,json,ttf,webmanifest}"],
  additionalManifestEntries: extraEntries,
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, 
}).then(({ count, size, warnings }) => {
  warnings.forEach(console.warn);
  console.log(`Injected ${count} files, totaling ${size} bytes. (Not counting external files)`);
}).catch(err => {
  console.error('Error generating service worker:', err);
});
