// Basic cache (optional). Update CACHE_NAME when releasing.
const CACHE_NAME = "de-nhi-web-meta-2.4.4";
const ASSETS = ["./", "./index.html", "./styles.2.4.4.css", "./app.2.4.4.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME ? caches.delete(k) : null)))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Network-first for SPA navigation (HTML) so users receive updates.
  if(req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")){
    event.respondWith((async () => {
      try{
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      }catch{
        const cached = await caches.match(req);
        return cached || caches.match("/index.html");
      }
    })());
    return;
  }

  // Stale-while-revalidate for static assets
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    const fetchPromise = fetch(req).then((res) => {
      if(res && res.ok) cache.put(req, res.clone());
      return res;
    }).catch(() => null);

    return cached || (await fetchPromise) || new Response("", {status: 504});
  })());
});
