// =========================================================
// Oyunlar - ortak yardımcılar (tüm oyun sayfalarında yüklenir)
// =========================================================

const Oyun = {
  // Diziyi yerinde rastgele karıştırır (Fisher-Yates) ve geri döndürür
  karistir(dizi) {
    for (let i = dizi.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dizi[i], dizi[j]] = [dizi[j], dizi[i]];
    }
    return dizi;
  },

  // 75 → "1:15"
  sureYaz(saniye) {
    const dk = Math.floor(saniye / 60);
    const sn = String(saniye % 60).padStart(2, "0");
    return `${dk}:${sn}`;
  },

  // Ekrandaki bir öğeye saniye saniye süre yazan zamanlayıcı
  zamanlayici(el) {
    let baslangic = 0;
    let kimlik = null;
    let gecen = 0;
    const yaz = () => {
      gecen = Math.floor((Date.now() - baslangic) / 1000);
      el.textContent = Oyun.sureYaz(gecen);
    };
    return {
      baslat() {
        clearInterval(kimlik);
        baslangic = Date.now();
        gecen = 0;
        el.textContent = "0:00";
        kimlik = setInterval(yaz, 1000);
      },
      durdur() {
        if (kimlik !== null) { yaz(); clearInterval(kimlik); kimlik = null; }
        return Oyun.sureYaz(gecen);
      },
    };
  },

  // Sonuç kutusuna mesaj yazar; hata ise kırmızı gösterir
  sonuc(el, metin, hataMi = false) {
    el.textContent = metin;
    el.classList.toggle("oyun__sonuc--hata", hataMi);
  },
};
