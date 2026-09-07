/*
 * coi-serviceworker.js
 *
 * Adds Cross-Origin-Opener-Policy / Cross-Origin-Embedder-Policy headers to
 * every response via a service worker, so the page becomes "cross-origin
 * isolated" without needing to configure server headers — which static
 * hosts like GitHub Pages don't let you do.
 *
 * This is required for the multi-threaded ffmpeg.wasm build (used for the
 * optional MP4 export) to access SharedArrayBuffer. WebM export works fine
 * without it.
 */
(function () {
  const IS_WORKER = typeof window === 'undefined';

  if (IS_WORKER) {
    self.addEventListener('install', () => self.skipWaiting());
    self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener('fetch', function (event) {
      const request = event.request;
      if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return;

      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response.status === 0) return response;
            const newHeaders = new Headers(response.headers);
            newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
            newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
            return new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: newHeaders,
            });
          })
          .catch((err) => {
            console.error('[coi-serviceworker] fetch failed:', err);
          })
      );
    });
  } else {
    (async function () {
      if (window.crossOriginIsolated !== false) return; // already isolated or unsupported
      if (!('serviceWorker' in navigator)) return;

      try {
        const registration = await navigator.serviceWorker.register(window.document.currentScript.src);
        registration.addEventListener('updatefound', () => window.location.reload());
        if (registration.active && !navigator.serviceWorker.controller) {
          window.location.reload();
        }
      } catch (err) {
        console.error('[coi-serviceworker] registration failed:', err);
      }
    })();
  }
})();
