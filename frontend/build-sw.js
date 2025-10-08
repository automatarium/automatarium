import { injectManifest } from 'workbox-build';
import tourGifs from './src/pages/Tutorials/guidedTour/data/tour-gifs.json' with { type: 'json' };
const { fsaTourGifs, pdaTourGifs, tmTourGifs } = tourGifs;


const formatCacheEntries = (links) => {
  return links.map(url => ({url, revision: null}));
}

const extraCacheEntries = formatCacheEntries([...FSAgifs, ...PDAgifs, ...TMgifs]);

injectManifest({
  swSrc: 'dist/service-worker.js',
  swDest: 'dist/service-worker.js',
  globDirectory: 'dist',
  globPatterns: ["**/*.{js,css,html,svg,png,json,ttf,webmanifest}"],
  additionalManifestEntries: extraCacheEntries,
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, 
}).then(({ count, size, warnings }) => {
  warnings.forEach(console.warn);
  console.log(`Injected ${count} files, totaling ${size} bytes. (Not counting external files)`);
}).catch(err => {
  console.error('Error generating service worker:', err);
});
