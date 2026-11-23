// =========================================================
// Kayan sayı bulmacası (15 bulmacası)
// Karıştırma çözülmüş tablodan geçerli hamlelerle yapılır,
// bu yüzden her bulmaca çözülebilir.
// =========================================================

(() => {
  const tabloEl = document.getElementById("kayan");
  const hamleEl = document.getElementById("hamle");
  const yerindeEl = document.getElementById("yerinde");
  const sonucEl = document.getElementById("sonuc");
  const sureEl = document.getElementById("sure");
  const sure = Oyun.zamanlayici(sureEl);

  const BOYUT = 4;
  const COZUM = [...Array(BOYUT * BOYUT - 1).keys()].map((i) => i + 1).concat(0); // 1..15, 0 = boşluk

  let tablo = [];
  let hamle = 0;
  let basladi = false;
  let bitti = false;
  const kareler = [];

  const komsuMu = (a, b) =>
    (Math.abs(a - b) === BOYUT) ||
    (Math.abs(a - b) === 1 && Math.floor(a / BOYUT) === Math.floor(b / BOYUT));

  function komsular(i) {
    return [i - BOYUT, i + BOYUT, i - 1, i + 1].filter((k) => k >= 0 && k < BOYUT * BOYUT && komsuMu(i, k));
  }

  function karistir() {
    tablo = COZUM.slice();
    let bos = tablo.indexOf(0);
    let onceki = -1;
    for (let n = 0; n < 300; n++) {
      const secenek = komsular(bos).filter((k) => k !== onceki); // hemen geri dönme
      const k = secenek[Math.floor(Math.random() * secenek.length)];
      [tablo[bos], tablo[k]] = [tablo[k], tablo[bos]];
      onceki = bos;
      bos = k;
    }
    if (cozulduMu()) karistir(); // çok düşük ihtimal: karışmadıysa tekrar
  }

  const cozulduMu = () => tablo.every((d, i) => d === COZUM[i]);

  function kur() {
    for (let i = 0; i < BOYUT * BOYUT; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "kayan__kare";
      b.dataset.sira = i;
      tabloEl.appendChild(b);
      kareler.push(b);
    }
  }

  function ciz() {
    let yerinde = 0;
    const bos = tablo.indexOf(0);
    kareler.forEach((b, i) => {
      const d = tablo[i];
      const bosMu = d === 0;
      b.textContent = bosMu ? "" : d;
      b.classList.toggle("kayan__kare--bos", bosMu);
      b.classList.toggle("kayan__kare--yerinde", !bosMu && d === COZUM[i]);
      b.tabIndex = bosMu ? -1 : 0;
      if (bosMu) {
        b.setAttribute("aria-hidden", "true");
        b.removeAttribute("aria-label");
      } else {
        b.removeAttribute("aria-hidden");
        b.setAttribute("aria-label", `Kare ${d}${komsuMu(i, bos) ? ", kaydırılabilir" : ""}`);
      }
      if (!bosMu && d === COZUM[i]) yerinde++;
    });
    hamleEl.textContent = hamle;
    yerindeEl.textContent = yerinde;
    tabloEl.classList.toggle("kayan--bitti", bitti);
  }

  // i sırasındaki kareyi boşluğa kaydırır; kaydırdıysa true döner
  function kaydir(i) {
    if (bitti) return false;
    const bos = tablo.indexOf(0);
    if (!komsuMu(i, bos)) return false;
    [tablo[bos], tablo[i]] = [tablo[i], tablo[bos]];
    hamle++;
    if (!basladi) { basladi = true; sure.baslat(); }
    if (cozulduMu()) {
      bitti = true;
      Oyun.sonuc(sonucEl, `🎉 Tebrikler! Bulmacayı ${hamle} hamlede, ${sure.durdur()} sürede çözdünüz.`);
    }
    ciz();
    // Odak, kaydırılan karenin yeni yerinde kalsın
    if (document.activeElement && tabloEl.contains(document.activeElement)) kareler[bos].focus();
    return true;
  }

  function yeniOyun() {
    karistir();
    hamle = 0;
    basladi = false;
    bitti = false;
    sure.durdur();
    sureEl.textContent = "0:00";
    sonucEl.textContent = "";
    ciz();
  }

  // ---------- Fare / dokunmatik / Enter-Space ----------
  tabloEl.addEventListener("click", (e) => {
    const b = e.target.closest(".kayan__kare");
    if (b) kaydir(Number(b.dataset.sira));
  });

  // ---------- Ok tuşları ----------
  // Ok yönü, karenin gideceği yöndür: ↑ basınca boşluğun altındaki kare yukarı çıkar.
  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target.closest("input, textarea, select, [contenteditable]")) return;
    const bos = tablo.indexOf(0);
    const kaynak = { ArrowUp: bos + BOYUT, ArrowDown: bos - BOYUT, ArrowLeft: bos + 1, ArrowRight: bos - 1 }[e.key];
    if (kaynak === undefined) return;
    if (kaynak >= 0 && kaynak < BOYUT * BOYUT && komsuMu(kaynak, bos) && kaydir(kaynak)) e.preventDefault();
  });

  document.getElementById("yeni").addEventListener("click", yeniOyun);

  kur();
  yeniOyun();
})();
