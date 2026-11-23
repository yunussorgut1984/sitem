# Yunus Sorgut – Kişisel Site

Yunus Sorgut'un kişisel sitesi. Python ile yazılmış dosya düzenleme araçlarını, Kotlin ile geliştirilen deprem uygulamasını ve diğer GitHub projelerini tanıtır.

🔗 **Canlı site:** [https://sitem-xi.vercel.app](https://sitem-xi.vercel.app)

## Kullanılan Teknolojiler

- HTML
- CSS
- JavaScript

Site tamamen statiktir; kurulum veya derleme adımı gerektirmez. Dış kütüphane kullanılmaz.

## Oyunlar

[Oyunlar sayfasında](https://sitem-xi.vercel.app/oyunlar.html) tarayıcıda oynanan dört zekâ oyunu var:

| Oyun | Kısaca |
|---|---|
| Sudoku | Her oyunda yeni, tek çözümlü 9×9 tablo; Kolay, Orta, Zor |
| Kayan Sayı Bulmacası | 4×4, kareleri kaydırıp 1–15 sıraya dizme; hamle ve süre sayacı |
| Kelime Avı | 10×10 harf tablosunda 8 gizli Türkçe kelime; her oyunda yeni dizilim |
| Mini Çengel Bulmaca | 5×5, Türkçe ipuçlu 3 hazır bulmaca |

- Hepsi **klavyeyle ve fareyle** (dokunmatik ekranda parmakla) oynanır.
- Oyun bitince doğruluk kontrol edilir; yanlış hücreler kırmızıyla gösterilir.
- **Çevrimdışı çalışır:** Site bir kez açıldıktan sonra `sw.js` (service worker) tüm dosyaları tarayıcıya kaydeder; internet kesilse de sayfalar ve oyunlar açılır. Site dosyaları değişince `sw.js` içindeki `SURUM` değeri artırılmalıdır (`sitem-v1` → `sitem-v2`).

## Klasör Yapısı

```
sitem/
├── index.html       # Ana sayfa
├── oyunlar.html     # Oyunlar ana sayfası
├── oyunlar/         # Oyun sayfaları (sudoku, kayan-sayi, kelime-avi, cengel)
├── sw.js            # Çevrimdışı çalışma (service worker)
├── css/
│   ├── style.css    # Sayfa stilleri
│   └── oyunlar.css  # Oyun stilleri
├── js/
│   ├── main.js      # Sayfa etkileşimleri
│   └── oyunlar/     # Oyunların kodu (ortak.js + her oyun için bir dosya)
├── images/          # Logo, avatar, proje görselleri ve favicon
└── fonts/           # Siteye gömülü yazı tipleri (Inter, Shantell Sans)
```

## Yerelde Çalıştırma

`index.html` dosyasını tarayıcıda açmanız yeterlidir.

Çevrimdışı özelliğini denemek için siteyi yerel sunucuyla açın (service worker `file://` adreslerinde çalışmaz):

```
python -m http.server 8000
```

Ardından tarayıcıda **http://localhost:8000** adresine gidin.

## Yayın

Site [Vercel](https://vercel.com) üzerinde yayınlanmaktadır. `master` dalına yapılan her `git push` siteyi otomatik olarak günceller.
