// =========================================================
// Mini çengel bulmaca - 5×5, hazır bulmacalar
// "#" siyah kare demektir. Numaralar ve kelimeler tablodan
// otomatik çıkarılır; ipuçları kelimeye göre eşleştirilir.
// =========================================================

(() => {
  const BULMACALAR = [
    {
      tablo: ["KALEM", "A#A#A", "ZAMAN", "M#B#G", "ARABA"],
      ipucu: {
        KALEM: "Yazı yazmaya yarayan araç",
        ZAMAN: "Saatle ölçülen şey; vakit",
        ARABA: "Dört tekerlekli taşıt",
        KAZMA: "Toprağı kazmaya yarayan uçlu araç",
        LAMBA: "Işık veren aydınlatma aracı",
        MANGA: "Bir onbaşı ya da çavuş komutasındaki en küçük asker birliği",
      },
    },
    {
      tablo: ["BALIK", "U#İ#O", "LİMAN", "U#O#A", "TANIK"],
      ipucu: {
        BALIK: "Suda yaşayan, solungaçla nefes alan hayvan",
        LİMAN: "Gemilerin yanaştığı, korunaklı kıyı yeri",
        TANIK: "Bir olayı gören ve anlatan kişi; şahit",
        BULUT: "Gökyüzünde yağmur getiren su buharı kümesi",
        LİMON: "Ekşi, sarı bir meyve",
        KONAK: "Büyük ve gösterişli ev",
      },
    },
    {
      tablo: ["KAYIK", "E#I#A", "KALIN", "İ#A#A", "KONUT"],
      ipucu: {
        KAYIK: "Kürekle yürütülen küçük tekne",
        KALIN: "İnce olmayan",
        KONUT: "Oturulacak yer; ev",
        KEKİK: "Kokulu bir baharat bitkisi",
        YILAN: "Ayaksız, sürünerek ilerleyen hayvan",
        KANAT: "Kuşların uçmaya yarayan organı",
      },
    },
  ];

  const BOYUT = 5;
  const HARFLER = new Set(Array.from("ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ"));

  const tabloEl = document.getElementById("cengel");
  const yatayEl = document.getElementById("yatay");
  const dikeyEl = document.getElementById("dikey");
  const sonucEl = document.getElementById("sonuc");
  const adEl = document.getElementById("bulmacaAdi");

  let sira = 0;          // kaçıncı bulmaca
  let cozum = [];        // 25 hücre: harf ya da null (siyah)
  let kelimeler = [];    // { no, yon, hucreler, kelime, ipucu, dugme }
  let girdiler = [];     // 25 hücre: input ya da null
  let kutular = [];      // 25 hücre: div
  let aktif = 0;
  let yon = "yatay";
  let bitti = false;

  const sat = (i) => Math.floor(i / BOYUT);
  const sut = (i) => i % BOYUT;
  const beyazMi = (s, c) => s >= 0 && s < BOYUT && c >= 0 && c < BOYUT && cozum[s * BOYUT + c] !== null;

  // ---------- Bulmacayı kurma ----------
  function kelimeleriCikar() {
    const liste = [];
    let no = 0;
    const numara = new Array(BOYUT * BOYUT).fill(0);
    for (let s = 0; s < BOYUT; s++) {
      for (let c = 0; c < BOYUT; c++) {
        if (!beyazMi(s, c)) continue;
        const yatayBas = !beyazMi(s, c - 1) && beyazMi(s, c + 1);
        const dikeyBas = !beyazMi(s - 1, c) && beyazMi(s + 1, c);
        if (!yatayBas && !dikeyBas) continue;
        numara[s * BOYUT + c] = ++no;
        [["yatay", yatayBas, 0, 1], ["dikey", dikeyBas, 1, 0]].forEach(([y, bas, ds, dc]) => {
          if (!bas) return;
          const hucreler = [];
          for (let k = 0; beyazMi(s + ds * k, c + dc * k); k++) hucreler.push((s + ds * k) * BOYUT + c + dc * k);
          const kelime = hucreler.map((i) => cozum[i]).join("");
          liste.push({ no, yon: y, hucreler, kelime });
        });
      }
    }
    return { liste, numara };
  }

  function kur() {
    const b = BULMACALAR[sira];
    cozum = b.tablo.join("").split("").map((h) => (h === "#" ? null : h));
    const { liste, numara } = kelimeleriCikar();
    kelimeler = liste.map((k) => ({ ...k, ipucu: b.ipucu[k.kelime] || "" }));

    tabloEl.innerHTML = "";
    girdiler = [];
    kutular = [];
    for (let s = 0; s < BOYUT; s++) {
      const satir = document.createElement("div");
      satir.setAttribute("role", "row");
      satir.className = "tablo-satir";
      for (let c = 0; c < BOYUT; c++) {
        const i = s * BOYUT + c;
        const kutu = document.createElement("div");
        kutu.setAttribute("role", "gridcell");
        kutu.className = "cengel__hucre";
        if (cozum[i] === null) {
          kutu.classList.add("cengel__hucre--siyah");
          kutu.setAttribute("aria-label", "Siyah kare");
          girdiler.push(null);
        } else {
          if (numara[i]) {
            const n = document.createElement("span");
            n.className = "cengel__no";
            n.textContent = numara[i];
            n.setAttribute("aria-hidden", "true");
            kutu.appendChild(n);
          }
          const g = document.createElement("input");
          g.type = "text";
          g.className = "tablo-hucre";
          g.dataset.sira = i;
          g.tabIndex = -1;
          g.autocomplete = "off";
          g.spellcheck = false;
          g.setAttribute("autocapitalize", "characters");
          g.setAttribute("aria-label", `Satır ${s + 1}, sütun ${c + 1}${numara[i] ? `, ${numara[i]} numara` : ""}`);
          kutu.appendChild(g);
          girdiler.push(g);
        }
        satir.appendChild(kutu);
        kutular.push(kutu);
      }
      tabloEl.appendChild(satir);
    }

    [["yatay", yatayEl], ["dikey", dikeyEl]].forEach(([y, el]) => {
      el.innerHTML = "";
      kelimeler.filter((k) => k.yon === y).forEach((k) => {
        const li = document.createElement("li");
        const d = document.createElement("button");
        d.type = "button";
        d.innerHTML = `<strong>${k.no}.</strong><span></span>`;
        d.querySelector("span").textContent = `${k.ipucu} (${k.hucreler.length})`;
        d.addEventListener("click", () => {
          yon = k.yon;
          const bos = k.hucreler.find((i) => !girdiler[i].value);
          sec(bos ?? k.hucreler[0]);
        });
        k.dugme = d;
        li.appendChild(d);
        el.appendChild(li);
      });
    });

    bitti = false;
    sonucEl.textContent = "";
    adEl.textContent = `(Bulmaca ${sira + 1}/${BULMACALAR.length})`;
    yon = "yatay";
    sec(cozum.findIndex((h) => h !== null), false);
  }

  // ---------- Seçim ve vurgu ----------
  const kelimeBul = (i, y) => kelimeler.find((k) => k.yon === y && k.hucreler.includes(i));

  function vurgula() {
    const k = kelimeBul(aktif, yon);
    kutular.forEach((kutu, i) => {
      kutu.classList.toggle("cengel__hucre--aktif", i === aktif);
      kutu.classList.toggle("cengel__hucre--kelimede", !!k && i !== aktif && k.hucreler.includes(i));
    });
    girdiler.forEach((g, i) => { if (g) g.tabIndex = i === aktif ? 0 : -1; });
    kelimeler.forEach((x) => x.dugme.classList.toggle("ipucu--aktif", x === k));
  }

  function sec(i, odakla = true) {
    aktif = i;
    // Bu yönde kelime yoksa (tek harflik boşluk) diğer yöne geç
    if (!kelimeBul(i, yon)) yon = yon === "yatay" ? "dikey" : "yatay";
    vurgula();
    if (odakla) { girdiler[i].focus(); girdiler[i].select(); }
  }

  function yonDegistir() {
    const diger = yon === "yatay" ? "dikey" : "yatay";
    if (kelimeBul(aktif, diger)) { yon = diger; vurgula(); }
  }

  // Kelime içinde ileri/geri git
  function kelimedeGit(adim) {
    const k = kelimeBul(aktif, yon);
    if (!k) return;
    const yeni = k.hucreler[k.hucreler.indexOf(aktif) + adim];
    if (yeni !== undefined) sec(yeni);
  }

  // Ok yönünde bir sonraki beyaz kareye git
  function okIleGit(ds, dc) {
    let s = sat(aktif) + ds, c = sut(aktif) + dc;
    while (s >= 0 && s < BOYUT && c >= 0 && c < BOYUT) {
      if (beyazMi(s, c)) {
        yon = ds === 0 ? "yatay" : "dikey";
        sec(s * BOYUT + c);
        return;
      }
      s += ds; c += dc;
    }
  }

  // ---------- Kontrol ----------
  function kontrolEt() {
    if (bitti) return;
    let yanlis = 0, bos = 0;
    girdiler.forEach((g, i) => {
      if (!g) return;
      const hatali = g.value !== "" && g.value !== cozum[i];
      kutular[i].classList.toggle("cengel__hucre--yanlis", hatali);
      if (hatali) yanlis++;
      if (g.value === "") bos++;
    });
    if (yanlis > 0) {
      Oyun.sonuc(sonucEl, `${yanlis} harf yanlış. Kırmızı kareleri düzeltin.`, true);
    } else if (bos > 0) {
      Oyun.sonuc(sonucEl, `Şimdiye kadar yazdıklarınız doğru. ${bos} boş kare kaldı.`);
    } else {
      bitti = true;
      girdiler.forEach((g) => { if (g) g.readOnly = true; });
      const sonraki = sira < BULMACALAR.length - 1 ? " Sonraki bulmacaya geçebilirsiniz." : "";
      Oyun.sonuc(sonucEl, `🎉 Tebrikler, bulmacayı çözdünüz!${sonraki}`);
    }
  }

  // ---------- Klavye, yazma ve fare ----------
  // Değişiklikten önceki harfi sakla; yeni yazılan harfi ondan ayırt etmek için
  tabloEl.addEventListener("beforeinput", (e) => {
    const g = e.target.closest("input");
    if (g) g.dataset.onceki = g.value;
  });

  tabloEl.addEventListener("input", (e) => {
    const g = e.target;
    if (bitti) return;
    const buyuk = (s) => Array.from((s || "").toLocaleUpperCase("tr-TR")).filter((h) => HARFLER.has(h));
    const yazilan = buyuk(e.data);
    const harfler = buyuk(g.value);
    const onceki = g.dataset.onceki || "";
    // Önce yeni yazılan harf; yoksa eski harften farklı olan; o da yoksa ilk harf
    const ch = (yazilan.length === 1 ? yazilan[0] : harfler.find((h) => h !== onceki)) || harfler[0] || "";
    g.value = ch;
    kutular[Number(g.dataset.sira)].classList.remove("cengel__hucre--yanlis");
    sonucEl.textContent = "";
    if (ch) {
      if (girdiler.every((x) => !x || x.value)) { kontrolEt(); return; }
      kelimedeGit(1);
    }
  });

  tabloEl.addEventListener("keydown", (e) => {
    const yonlar = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    if (yonlar[e.key]) {
      e.preventDefault();
      okIleGit(...yonlar[e.key]);
    } else if (e.key === " ") {
      e.preventDefault();
      yonDegistir();
    } else if (e.key === "Backspace" && !bitti) {
      e.preventDefault();
      const g = girdiler[aktif];
      if (g.value) { g.value = ""; kutular[aktif].classList.remove("cengel__hucre--yanlis"); }
      else {
        kelimedeGit(-1);
        girdiler[aktif].value = "";
        kutular[aktif].classList.remove("cengel__hucre--yanlis");
      }
      sonucEl.textContent = "";
    }
  });

  // Aynı kareye tekrar tıklanınca yön değişir
  tabloEl.addEventListener("pointerdown", (e) => {
    const g = e.target.closest("input");
    if (!g) return;
    const i = Number(g.dataset.sira);
    if (i === aktif && document.activeElement === g) { e.preventDefault(); yonDegistir(); }
  });

  tabloEl.addEventListener("focusin", (e) => {
    const g = e.target.closest("input");
    if (!g) return;
    const i = Number(g.dataset.sira);
    if (i !== aktif) sec(i, false);
    g.select();
  });

  document.getElementById("kontrol").addEventListener("click", kontrolEt);
  document.getElementById("temizle").addEventListener("click", () => {
    if (bitti) return;
    girdiler.forEach((g, i) => { if (g) { g.value = ""; kutular[i].classList.remove("cengel__hucre--yanlis"); } });
    sonucEl.textContent = "";
    sec(aktif);
  });
  document.getElementById("sonraki").addEventListener("click", () => {
    sira = (sira + 1) % BULMACALAR.length;
    kur();
  });

  kur();
})();
