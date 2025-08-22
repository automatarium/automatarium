import { injectManifest } from 'workbox-build';
import { glob } from 'glob';

const distFiles = glob.sync('dist/service-worker*.js');
if (distFiles.length === 0) {
  throw new Error('No service worker file found in dist/');
}
const sw = distFiles[0];

injectManifest({
  swSrc: sw,
  swDest: sw,
  globDirectory: 'dist',
  globPatterns: ["**/*.{js,css,html,svg,png,json,ttf}"],
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, 
}).then(({ count, size, warnings }) => {
  warnings.forEach(console.warn);
  console.log(`Generated ${sw}, precaching ${count} files, totaling ${size} bytes.`);
}).catch(err => {
  console.error('Error generating service worker:', err);
});
