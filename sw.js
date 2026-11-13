// Service worker commun à La Boîte à concours et à ses trois préparations.
const VERSION = "boite-concours-v3";
const SHELL = ["./", "index.html", "manifest.webmanifest", "firebase-config.js", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png",
  "aae/", "aae/index.html", "aae/free-data.js", "sa-paris/", "sa-paris/index.html", "sa-paris/free-data.js", "sacn/", "sacn/index.html", "sacn/free-data.js", "adjoint/", "adjoint/index.html", "adjoint/free-data.js"];
const CACHEABLE_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com", "www.gstatic.com"];
const MODULES = ["aae", "sa-paris", "sacn", "adjoint"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Page de secours hors ligne : l'accueil, ou la préparation dans laquelle on navigue.
function secours(url){
  const base = new URL(self.registration.scope);
  const rel = url.pathname.slice(base.pathname.length);
  const m = MODULES.find(x => rel === x || rel.startsWith(x + "/"));
  return caches.match(m ? m + "/index.html" : "index.html");
}
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // Fichiers de l'application : réseau d'abord, copie locale si hors ligne.
    e.respondWith(
      fetch(req).then(r => { const copy = r.clone(); if (r.ok) caches.open(VERSION).then(c => c.put(req, copy)); return r; })
        .catch(() => caches.match(req).then(m => m || (req.mode === "navigate" ? secours(url) : undefined)))
    );
    return;
  }
  if (CACHEABLE_HOSTS.includes(url.hostname)) {
    // Polices et bibliothèques : copie locale d'abord.
    e.respondWith(caches.match(req).then(m => m || fetch(req).then(r => { const copy = r.clone(); if (r.ok || r.type === "opaque") caches.open(VERSION).then(c => c.put(req, copy)); return r; })));
  }
  // Tout le reste (Firebase, Stripe…) passe directement par le réseau.
});
