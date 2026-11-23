// =========================================================
// Kelime avı - her oyunda kelimeler yeniden seçilir ve dizilir
// =========================================================

(() => {
  const tabloEl = document.getElementById("kelime");
  const listeEl = document.getElementById("liste");
  const bulunanEl = document.getElementById("bulunan");
  const toplamEl = document.getElementById("toplam");
  const sonucEl = document.getElementById("sonuc");
  const sure = Oyun.zamanlayici(document.getElementById("sure"));

  const BOYUT = 10;
  const KELIME_SAYISI = 8;
  const ALFABE = Array.from("ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ");
  const KELIMELER = [
    "ELMA", "ARMUT", "KİRAZ", "ÜZÜM", "ÇİLEK", "KARPUZ", "KAVUN", "İNCİR", "ŞEFTALİ", "PORTAKAL",
    "KEDİ", "KÖPEK", "ASLAN", "KAPLAN", "ZÜRAFA", "PENGUEN", "KARTAL", "BALIK", "TAVŞAN", "ÖRDEK",
    "GÜNEŞ", "BULUT", "YAĞMUR", "DENİZ", "ORMAN", "NEHİR", "ÇİÇEK", "YILDIZ", "GÖKKUŞAĞI", "ŞELALE",
    "KİTAP", "KALEM", "DEFTER", "OKUL", "SANDALYE", "KLAVYE", "EKRAN", "ŞEHİR", "KÖPRÜ", "BİSİKLET",
  ];
  // 8 yön: yatay, dikey, çapraz; ileri ve geri
  const YONLER = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];

  let harfler = [];        // 100 harf
  let aranan = [];         // { kelime, bulundu }
  let bulunanHucre = new Set();
  let bekleyen = null;     // tıklama / klavye ile seçilen ilk harf
  let surukleme = null;    // sürüklemenin başladığı harf
  let suruklemeSon = null;
  let odak = 0;
  let bitti = false;
  const hucreler = [];

  const sat = (i) => Math.floor(i / BOYUT);
  const sut = (i) => i % BOYUT;

  // ---------- Bulmaca üretme ----------
  function yerlestir(tablo, kelime) {
    const h = Array.from(kelime);
    for (let deneme = 0; deneme < 200; deneme++) {
      const [ds, dc] = YONLER[Math.floor(Math.random() * YONLER.length)];
      const s0 = Math.floor(Math.random() * BOYUT);
      const c0 = Math.floor(Math.random() * BOYUT);
      const sS = s0 + ds * (h.length - 1), sC = c0 + dc * (h.length - 1);
      if (sS < 0 || sS >= BOYUT || sC < 0 || sC >= BOYUT) continue;
      const yerler = h.map((_, k) => (s0 + ds * k) * BOYUT + (c0 + dc * k));
      if (yerler.every((y, k) => tablo[y] === null || tablo[y] === h[k])) {
        yerler.forEach((y, k) => { tablo[y] = h[k]; });
        return true;
      }
    }
    return false;
  }

  function uret() {
    for (;;) {
      const secilen = Oyun.karistir(KELIMELER.slice()).slice(0, KELIME_SAYISI)
        .sort((a, b) => Array.from(b).length - Array.from(a).length); // uzunlar önce
      const tablo = new Array(BOYUT * BOYUT).fill(null);
      if (secilen.every((k) => yerlestir(tablo, k))) {
        harfler = tablo.map((h) => h ?? ALFABE[Math.floor(Math.random() * ALFABE.length)]);
        aranan = secilen.sort((a, b) => a.localeCompare(b, "tr")).map((kelime) => ({ kelime, bulundu: false }));
        return;
      }
    }
  }

  // a'dan b'ye düz bir çizgideki hücreler; düz değilse null
  function cizgi(a, b) {
    const ds = sat(b) - sat(a), dc = sut(b) - sut(a);
    if (!(ds === 0 || dc === 0 || Math.abs(ds) === Math.abs(dc))) return null;
    const n = Math.max(Math.abs(ds), Math.abs(dc));
    const as = Math.sign(ds), ac = Math.sign(dc);
    return [...Array(n + 1).keys()].map((k) => (sat(a) + as * k) * BOYUT + sut(a) + ac * k);
  }

  // ---------- Ekrana çizme ----------
  function kur() {
    for (let s = 0; s < BOYUT; s++) {
      const satir = document.createElement("div");
      satir.setAttribute("role", "row");
      satir.className = "tablo-satir";
      for (let c = 0; c < BOYUT; c++) {
        const h = document.createElement("div");
        h.className = "kelime__harf tablo-hucre";
        h.setAttribute("role", "gridcell");
        h.dataset.sira = s * BOYUT + c;
        h.tabIndex = -1;
        satir.appendChild(h);
        hucreler.push(h);
      }
      tabloEl.appendChild(satir);
    }
  }

  function ciz() {
    hucreler.forEach((h, i) => {
      h.textContent = harfler[i];
      const bulundu = bulunanHucre.has(i);
      h.classList.toggle("kelime__harf--bulundu", bulundu);
      h.setAttribute("aria-label", `Satır ${sat(i) + 1}, sütun ${sut(i) + 1}: ${harfler[i]}${bulundu ? ", bulunan kelimede" : ""}`);
      h.tabIndex = i === odak ? 0 : -1;
    });
    listeEl.innerHTML = "";
    aranan.forEach((a) => {
      const li = document.createElement("li");
      li.textContent = a.kelime;
      if (a.bulundu) li.className = "bulundu";
      listeEl.appendChild(li);
    });
    const n = aranan.filter((a) => a.bulundu).length;
    bulunanEl.textContent = n;
    toplamEl.textContent = aranan.length;
  }

  function secimGoster(liste) {
    const set = new Set(liste || []);
    hucreler.forEach((h, i) => {
      h.classList.toggle("kelime__harf--secim", set.has(i));
      h.setAttribute("aria-selected", set.has(i) ? "true" : "false");
    });
    hucreler.forEach((h, i) => h.classList.toggle("kelime__harf--baslangic", i === bekleyen));
  }

  function hataliGoster(liste) {
    liste.forEach((i) => hucreler[i].classList.add("kelime__harf--hatali"));
    setTimeout(() => liste.forEach((i) => hucreler[i].classList.remove("kelime__harf--hatali")), 600);
  }

  // ---------- Seçimi kontrol etme ----------
  function secimiBitir(a, b) {
    bekleyen = null;
    secimGoster(null);
    if (bitti || a === b) return;
    const liste = cizgi(a, b);
    if (!liste) {
      hataliGoster([a, b]);
      Oyun.sonuc(sonucEl, "Harfler düz bir çizgide olmalı: yatay, dikey ya da çapraz.", true);
      return;
    }
    const yazi = liste.map((i) => harfler[i]).join("");
    const ters = Array.from(yazi).reverse().join("");
    const hedef = aranan.find((x) => !x.bulundu && (x.kelime === yazi || x.kelime === ters));
    if (!hedef) {
      hataliGoster(liste);
      Oyun.sonuc(sonucEl, `"${yazi}" listede yok. Tekrar deneyin.`, true);
      return;
    }
    hedef.bulundu = true;
    liste.forEach((i) => bulunanHucre.add(i));
    ciz();
    if (aranan.every((x) => x.bulundu)) {
      bitti = true;
      Oyun.sonuc(sonucEl, `🎉 Tebrikler, tüm kelimeleri buldunuz! Süre: ${sure.durdur()}`);
    } else {
      const kalan = aranan.filter((x) => !x.bulundu).length;
      Oyun.sonuc(sonucEl, `✔ ${hedef.kelime} bulundu! ${kalan} kelime kaldı.`);
    }
  }

  function yeniOyun() {
    uret();
    bulunanHucre = new Set();
    bekleyen = null;
    surukleme = null;
    bitti = false;
    odak = 0;
    sonucEl.textContent = "";
    ciz();
    secimGoster(null);
    sure.baslat();
  }

  function goster() {
    if (bitti) return;
    // Kalan kelimelerin yerini tablodan bul (8 yönde ara)
    aranan.filter((x) => !x.bulundu).forEach((x) => {
      const h = Array.from(x.kelime);
      for (let i = 0; i < BOYUT * BOYUT; i++) {
        for (const [ds, dc] of YONLER) {
          const yer = h.map((_, k) => [sat(i) + ds * k, sut(i) + dc * k]);
          if (yer.every(([s, c], k) => s >= 0 && s < BOYUT && c >= 0 && c < BOYUT && harfler[s * BOYUT + c] === h[k])) {
            yer.forEach(([s, c]) => bulunanHucre.add(s * BOYUT + c));
            x.bulundu = true;
            return;
          }
        }
      }
    });
    bitti = true;
    sure.durdur();
    ciz();
    secimGoster(null);
    Oyun.sonuc(sonucEl, "Kelimeler gösterildi. Yeni oyunla tekrar deneyebilirsiniz.");
  }

  // ---------- Fare / dokunmatik ----------
  const hucreBul = (x, y) => {
    const el = document.elementFromPoint(x, y);
    return el && el.classList.contains("kelime__harf") ? Number(el.dataset.sira) : null;
  };

  tabloEl.addEventListener("pointerdown", (e) => {
    const i = hucreBul(e.clientX, e.clientY);
    if (i === null || bitti) return;
    e.preventDefault();
    odak = i;
    hucreler.forEach((h, k) => { h.tabIndex = k === odak ? 0 : -1; });
    hucreler[i].focus({ preventScroll: true });
    if (bekleyen !== null) { secimiBitir(bekleyen, i); return; }
    surukleme = i;
    suruklemeSon = i;
    secimGoster([i]);
  });

  tabloEl.addEventListener("pointermove", (e) => {
    if (surukleme === null) return;
    const i = hucreBul(e.clientX, e.clientY);
    if (i === null || i === suruklemeSon) return;
    suruklemeSon = i;
    secimGoster(cizgi(surukleme, i) || [surukleme]);
  });

  document.addEventListener("pointerup", () => {
    if (surukleme === null) return;
    const a = surukleme, b = suruklemeSon;
    surukleme = null;
    if (a === b) {
      // Sürüklenmedi: tıklama ile seçim, ikinci tıklama bekleniyor
      bekleyen = a;
      secimGoster(null);
    } else {
      secimiBitir(a, b);
    }
  });

  // ---------- Klavye ----------
  tabloEl.addEventListener("keydown", (e) => {
    const yon = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
    if (yon) {
      e.preventDefault();
      const s = Math.min(BOYUT - 1, Math.max(0, sat(odak) + yon[0]));
      const c = Math.min(BOYUT - 1, Math.max(0, sut(odak) + yon[1]));
      odak = s * BOYUT + c;
      hucreler.forEach((h, k) => { h.tabIndex = k === odak ? 0 : -1; });
      hucreler[odak].focus();
      if (bekleyen !== null) secimGoster(cizgi(bekleyen, odak) || [bekleyen]);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (bitti) return;
      if (bekleyen === null) { bekleyen = odak; secimGoster(null); }
      else secimiBitir(bekleyen, odak);
    } else if (e.key === "Escape") {
      bekleyen = null;
      secimGoster(null);
    }
  });

  tabloEl.addEventListener("focusin", (e) => {
    const h = e.target.closest(".kelime__harf");
    if (h) odak = Number(h.dataset.sira);
  });

  document.getElementById("yeni").addEventListener("click", yeniOyun);
  document.getElementById("goster").addEventListener("click", goster);

  kur();
  yeniOyun();
})();
