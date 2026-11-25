# Çalışma Günlüğü – Yunus Sorgut Kişisel Site

Bu dosyada proje sırasında yapılan çalışmalar, Claude'a sorulan sorular, alınan cevaplar ve öğrenilenler tarih sırasıyla kaydedilir.

---

## 23.11.2026 – Formspree adresinin herkese açık depoda durması


**Soru:** Formspree adresi (`https://formspree.io/f/xgakpvak`) herkese açık depoda açık durursa ne olur, risk var mı?

**Cevabın özeti:**

- **Ciddi bir güvenlik riski yok.** Depo gizli olsa bile adres canlı sitenin HTML kodunda herkese görünür. Ziyaretçiler F12 ya da "Sayfa kaynağını görüntüle" ile görebilir. Formspree adresleri zaten böyle kullanılmak üzere tasarlanmıştır.
- **Bu adres bir şifre ya da API anahtarı değil.** Adresle yalnızca forma mesaj gönderilebilir. Kimse gelen mesajları okuyamaz, form ayarlarını değiştiremez, Formspree hesabına giremez.
- **E-posta adresi görünmez.** Mesajların iletildiği e-posta adresi Formspree'de saklanır, sitede ya da depoda yazmaz.
- **Gerçekçi riskler:**
  1. **Spam:** Botlar adresi bulup otomatik mesaj gönderebilir, gelen kutusu dolabilir.
  2. **Kota dolması:** Ücretsiz planda aylık gönderim sınırı var. Spam bu sınırı doldurursa gerçek ziyaretçilerin mesajları o ay iletilmeyebilir.
  3. **Başka yerden kullanılması:** Biri adresi kendi sayfasındaki forma koyabilir. Mesajlar yine bize gelir.
- **Alınabilecek önlemler:**
  - Forma görünmez bir **bal küpü (`_gotcha`) alanı** eklemek. İnsanlar bu alanı görmez, botlar doldurur, dolu gelen mesajlar spam sayılır.
  - Formspree panelinde izin verilen alan adını kısıtlamak ve spam ayarlarına bakmak. Bazı seçenekler ücretli planlarda olabilir.
  - Gelen gönderimleri arada bir kontrol etmek. Spam artarsa Formspree'de yeni bir form açıp `index.html`'deki adresi değiştirmek yeterli.

**Yapılan:** Forma bal küpü alanı eklendi (commit `10aff76`). Görünmeyen `_gotcha` alanı doluysa mesaj Formspree'ye hiç gönderilmiyor, bota yine teşekkür mesajı gösteriliyor. Böylece kota da harcanmıyor.

**Öğrendiklerim:** Sitede herkesin görebildiği her bilgi gizli değildir ve gizli sayılmamalıdır. Asıl önemli olan, açık duran bir bilginin kötüye kullanılırsa neye yol açacağını bilmek ve buna karşı önlem almaktır. Şifre ve API anahtarları ise depoya asla konmamalıdır.

---

## 25.11.2026 – Hata ayıklama pratiği

**Soru:** Claude'dan `js/main.js` ve `css/style.css` içinde birer satırı bilerek bozması istendi. Amaç hatayı geliştirici araçlarıyla bulmaktı.

**Cevabın özeti:**

- **JavaScript:** `temayiUygula` yerine `temayiUygla` yazıldı. Tema düğmesine basınca konsolda `ReferenceError` çıkar ve tema değişmez.
- **CSS:** `.dugme` kuralında `background` yerine `backgroud` yazıldı. Konsola hata düşmez. Yeşil düğmelerin zemini kaybolur. Hata, Elements → Styles panelinde üstü çizili satır olarak görünür.

**Yapılan:** İki hata da `pratik/hata-ayiklama` dalında yapıldı ve `git restore` ile geri alındı.

**Öğrendiklerim:** JavaScript hataları Console'da, CSS hataları Elements → Styles panelinde aranır.

---

> Yeni bir kayıt eklerken aynı biçimi kullan: **Tarih – Konu**, ardından Soru, Cevabın özeti, Yapılan ve Öğrendiklerim.
