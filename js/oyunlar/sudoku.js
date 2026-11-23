// =========================================================
// Sudoku - her oyunda yeni, tek çözümlü tablo üretir
// =========================================================

(() => {
  const tabloEl = document.getElementById("sudoku");
  const seviyeEl = document.getElementById("seviye");
  const bosEl = document.getElementById("bos");
  const sonucEl = document.getElementById("sonuc");
  const sure = Oyun.zamanlayici(document.getElementById("sure"));

  // Seviyeye göre başlangıçta verilen rakam sayısı
  const IPUCU = { kolay: 40, orta: 32, zor: 26 };

  let cozum = [];     // 81 hücrelik doğru çözüm
  let tablo = [];     // oyuncunun gördüğü tablo (0 = boş)
  let sabit = [];     // başlangıçta verilen hücreler
  let secili = 0;     // seçili hücrenin sırası (0-80)
  let bitti = false;
  const hucreler = [];

  // ---------- Tablo üretme ----------
  const satirOf = (i) => Math.floor(i / 9);
  const sutunOf = (i) => i % 9;
  const kutuOf = (i) => Math.floor(satirOf(i) / 3) * 3 + Math.floor(sutunOf(i) / 3);

  // i hücresine r rakamı konabilir mi?
  function uygunMu(t, i, r) {
    const s = satirOf(i), c = sutunOf(i);
    const ks = s - (s % 3), kc = c - (c % 3);
    for (let k = 0; k < 9; k++) {
      if (t[s * 9 + k] === r || t[k * 9 + c] === r) return false;
      if (t[(ks + Math.floor(k / 3)) * 9 + kc + (k % 3)] === r) return false;
    }
    return true;
  }

  // Boş tabloyu rastgele doldurur (geri izleme)
  function doldur(t) {
    const i = t.indexOf(0);
    if (i === -1) return true;
    for (const r of Oyun.karistir([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
      if (uygunMu(t, i, r)) {
        t[i] = r;
        if (doldur(t)) return true;
        t[i] = 0;
      }
    }
    return false;
  }

  // Çözüm sayısını sayar; "sinir"e ulaşınca durur (tek çözüm kontrolü için 2 yeterli)
  function cozumSay(t, sinir = 2) {
    // En az adaylı boş hücreyi seç (hızlı arama)
    let enIyi = -1, enIyiAdaylar = null;
    for (let i = 0; i < 81; i++) {
      if (t[i] !== 0) continue;
      const adaylar = [];
      for (let r = 1; r <= 9; r++) if (uygunMu(t, i, r)) adaylar.push(r);
      if (adaylar.length === 0) return 0;
      if (!enIyiAdaylar || adaylar.length < enIyiAdaylar.length) {
        enIyi = i; enIyiAdaylar = adaylar;
        if (adaylar.length === 1) break;
      }
    }
    if (enIyi === -1) return 1; // tablo dolu: bir çözüm bulundu

    let toplam = 0;
    for (const r of enIyiAdaylar) {
      t[enIyi] = r;
      toplam += cozumSay(t, sinir - toplam);
      t[enIyi] = 0;
      if (toplam >= sinir) break;
    }
    return toplam;
  }

  function bulmacaUret(ipucuSayisi) {
    const dolu = new Array(81).fill(0);
    doldur(dolu);
    const bulmaca = dolu.slice();
    let kalan = 81;
    for (const i of Oyun.karistir([...Array(81).keys()])) {
      if (kalan <= ipucuSayisi) break;
      const eski = bulmaca[i];
      bulmaca[i] = 0;
      if (cozumSay(bulmaca.slice()) !== 1) bulmaca[i] = eski; // tek çözüm bozulursa geri koy
      else kalan--;
    }
    return { cozum: dolu, bulmaca };
  }

  // ---------- Ekrana çizme ----------
  function tabloyuKur() {
    for (let s = 0; s < 9; s++) {
      const satir = document.createElement("div");
      satir.setAttribute("role", "row");
      satir.className = "tablo-satir";
      for (let c = 0; c < 9; c++) {
        const h = document.createElement("div");
        h.className = "sudoku__hucre tablo-hucre";
        h.setAttribute("role", "gridcell");
        h.dataset.satir = s;
        h.dataset.sutun = c;
        h.dataset.sira = s * 9 + c;
        h.tabIndex = -1;
        satir.appendChild(h);
        hucreler.push(h);
      }
      tabloEl.appendChild(satir);
    }
  }

  function hucreyiYaz(i) {
    const h = hucreler[i];
    h.textContent = tablo[i] || "";
    h.classList.toggle("sudoku__hucre--sabit", sabit[i]);
    h.setAttribute("aria-readonly", sabit[i] ? "true" : "false");
    h.setAttribute("aria-label",
      `Satır ${satirOf(i) + 1}, sütun ${sutunOf(i) + 1}: ${tablo[i] || "boş"}${sabit[i] ? ", verilen" : ""}`);
  }

  function vurgula() {
    const deger = tablo[secili];
    hucreler.forEach((h, i) => {
      const ayniBolge = satirOf(i) === satirOf(secili) || sutunOf(i) === sutunOf(secili) || kutuOf(i) === kutuOf(secili);
      h.classList.toggle("sudoku__hucre--secili", i === secili);
      h.classList.toggle("sudoku__hucre--ayni", i !== secili && deger !== 0 && tablo[i] === deger);
      h.classList.toggle("sudoku__hucre--vurgu", i !== secili && ayniBolge);
      h.tabIndex = i === secili ? 0 : -1;
    });
  }

  function sec(i, odakla = true) {
    secili = i;
    vurgula();
    if (odakla) hucreler[i].focus();
  }

  function bosSay() {
    const n = tablo.filter((d) => d === 0).length;
    bosEl.textContent = n;
    return n;
  }

  // ---------- Oyun akışı ----------
  function rakamYaz(r) {
    if (bitti || sabit[secili]) return;
    tablo[secili] = r;
    hucreler[secili].classList.remove("sudoku__hucre--yanlis");
    hucreyiYaz(secili);
    vurgula();
    sonucEl.textContent = "";
    if (bosSay() === 0) kontrolEt();
  }

  function kontrolEt() {
    if (bitti) return;
    let yanlis = 0;
    hucreler.forEach((h, i) => {
      const hatali = tablo[i] !== 0 && tablo[i] !== cozum[i];
      h.classList.toggle("sudoku__hucre--yanlis", hatali);
      if (hatali) yanlis++;
    });
    const bos = bosSay();

    if (yanlis > 0) {
      Oyun.sonuc(sonucEl, `${yanlis} hücre yanlış. Kırmızı hücreleri düzeltin.`, true);
    } else if (bos > 0) {
      Oyun.sonuc(sonucEl, `Şimdiye kadar yazdıklarınız doğru. ${bos} boş hücre kaldı.`);
    } else {
      bitti = true;
      Oyun.sonuc(sonucEl, `🎉 Tebrikler, Sudoku'yu çözdünüz! Süre: ${sure.durdur()}`);
    }
  }

  function yeniOyun() {
    const { cozum: c, bulmaca } = bulmacaUret(IPUCU[seviyeEl.value]);
    cozum = c;
    tablo = bulmaca;
    sabit = bulmaca.map((d) => d !== 0);
    bitti = false;
    sonucEl.textContent = "";
    hucreler.forEach((h, i) => { h.classList.remove("sudoku__hucre--yanlis"); hucreyiYaz(i); });
    bosSay();
    sec(sabit.indexOf(false), false);
    sure.baslat();
  }

  function temizle() {
    if (bitti) return;
    tablo = tablo.map((d, i) => (sabit[i] ? d : 0));
    hucreler.forEach((h, i) => { h.classList.remove("sudoku__hucre--yanlis"); hucreyiYaz(i); });
    bosSay();
    vurgula();
    sonucEl.textContent = "";
  }

  // ---------- Klavye ve fare ----------
  tabloEl.addEventListener("click", (e) => {
    const h = e.target.closest(".sudoku__hucre");
    if (h) sec(Number(h.dataset.sira));
  });

  tabloEl.addEventListener("keydown", (e) => {
    const s = satirOf(secili), c = sutunOf(secili);
    const yon = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
    if (yon) {
      e.preventDefault();
      const ys = Math.min(8, Math.max(0, s + yon[0]));
      const yc = Math.min(8, Math.max(0, c + yon[1]));
      sec(ys * 9 + yc);
    } else if (/^[1-9]$/.test(e.key)) {
      e.preventDefault();
      rakamYaz(Number(e.key));
    } else if (["Backspace", "Delete", "0"].includes(e.key)) {
      e.preventDefault();
      rakamYaz(0);
    }
  });

  document.getElementById("rakamTuslari").addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    rakamYaz(Number(t.dataset.rakam));
  });

  document.getElementById("kontrol").addEventListener("click", kontrolEt);
  document.getElementById("yeni").addEventListener("click", yeniOyun);
  document.getElementById("temizle").addEventListener("click", temizle);
  seviyeEl.addEventListener("change", yeniOyun);

  tabloyuKur();
  yeniOyun();
})();
