// =========================================================
// Service worker - siteyi ve oyunları çevrimdışı çalıştırır
// Site dosyaları değişince SURUM'ü artırın (sitem-v2, sitem-v3 ...);
// böylece eski önbellek silinir, yenisi kurulur.
// =========================================================

const SURUM = "sitem-v3";

const DOSYALAR = [
  "./",
  "index.html",
  "oyunlar.html",
  "oyunlar/sudoku.html",
  "oyunlar/kayan-sayi.html",
  "oyunlar/kelime-avi.html",
  "oyunlar/cengel.html",
  "css/style.css",
  "css/oyunlar.css",
  "js/main.js",
  "js/oyunlar/ortak.js",
  "js/oyunlar/sudoku.js",
  "js/oyunlar/kayan-sayi.js",
  "js/oyunlar/kelime-avi.js",
  "js/oyunlar/cengel.js",
  "fonts/inter-latin.woff2",
  "fonts/inter-latin-ext.woff2",
  "fonts/shantell-sans-latin.woff2",
  "fonts/shantell-sans-latin-ext.woff2",
  "images/favicon.svg",
  "images/logo.svg",
  "images/avatar-foto.jpg",
  "images/calisma-alani.svg",
  "images/projeler/dosya-duzenleyici.svg",
  "images/projeler/dosya-sayaci.svg",
  "images/projeler/deprem-kurtarici.svg",
  "images/projeler/sitem.svg",
];

// Kurulum: tüm dosyaları önbelleğe al
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SURUM).then((c) => c.addAll(DOSYALAR)).then(() => self.skipWaiting()));
});

// Etkinleşme: eski sürümlerin önbelleğini sil
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((adlar) => Promise.all(adlar.filter((a) => a !== SURUM).map((a) => caches.delete(a))))
      .then(() => self.clients.claim())
  );
});

// İstekler: önce önbellekten ver, arka planda internetten güncelle.
// Yalnızca sitenin kendi adresindeki GET istekleri; Formspree gibi dış istekler karışmaz.
self.addEventListener("fetch", (e) => {
  const istek = e.request;
  if (istek.method !== "GET" || new URL(istek.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.open(SURUM).then(async (onbellek) => {
      const kayitli = await onbellek.match(istek, { ignoreSearch: true });
      const ag = fetch(istek)
        .then((yanit) => {
          if (yanit.ok) onbellek.put(istek, yanit.clone());
          return yanit;
        })
        .catch(() => null);

      if (kayitli) {
        e.waitUntil(ag); // arka planda güncelle
        return kayitli;
      }
      const yanit = await ag;
      if (yanit) return yanit;
      // Çevrimdışı ve önbellekte yok: sayfa isteğiyse ana sayfayı göster
      if (istek.mode === "navigate") return onbellek.match("index.html");
      return Response.error();
    })
  );
});
