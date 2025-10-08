import { injectManifest } from 'workbox-build';
import tourGifs from './src/pages/Tutorials/guidedTour/data/tour-gifs.json' with { type: 'json' };
const { fsaTourGifs, pdaTourGifs, tmTourGifs } = tourGifs;

const formatManifestEntries = (links) => {
  return links.map(url => ({url, revision: null}));
}

const additionalManifestEntries = formatManifestEntries([
  ...fsaTourGifs,
  ...pdaTourGifs,
   ...tmTourGifs
]);

// replaces self.__WB_MANIFEST placeholder with populated manifest
injectManifest({
  swSrc: 'dist/service-worker.js',
  swDest: 'dist/service-worker.js',
  globDirectory: 'dist',
  globPatterns: ["**/*.{js,css,html,svg,png,json,ttf,webmanifest}"],
  additionalManifestEntries,
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MiB 
}).then(({ count, warnings }) => {
  warnings.forEach(console.warn);
  console.log(`Injected ${count} files.`);
}).catch(err => {
  console.error('Error generating service worker:', err);
});
