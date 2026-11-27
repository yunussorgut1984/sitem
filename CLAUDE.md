# CLAUDE.md

Bu dosya, Claude Code'un bu projede çalışırken uyacağı kuralları içerir.

## Çalışma Kuralları

1. **Dil:** Tüm cevaplar Türkçe verilmelidir.
2. **Önce plan:** Kod yazmadan veya dosya değiştirmeden önce yapılacakların planı anlatılmalı ve kullanıcının onayı beklenmelidir. Onay gelmeden değişiklik yapılmaz.
3. **Silme yasağı:** Hiçbir dosya silinmez. Bir dosyanın artık gerekmediği düşünülüyorsa bu kullanıcıya bildirilir, silme işlemi kullanıcıya bırakılır.
4. **Test talimatı:** Her değişiklikten sonra, değişikliğin nasıl test edileceği adım adım anlatılmalıdır (örneğin hangi dosyanın tarayıcıda açılacağı, neye bakılacağı).
5. **Özellik sonrası inceleme:** Her özellik bittikten sonra yeni bir oturum açılır (`/clear`) ve `/code-review` çalıştırılır. Çıkan bulgulardan en az 2'si düzeltilir. Düzeltmeler de 2. kurala uyar: önce plan anlatılır, onay beklenir. 2'den az bulgu çıkarsa bu kullanıcıya bildirilir.

## HTML Sayfa Standartları

Her HTML sayfasında şunlar zorunludur:

- `<html lang="tr">`
- `<meta charset="UTF-8">`
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Sayfaya özgü, anlamlı bir `<title>`
- Sayfaya özgü bir `<meta name="description" content="...">`
- Tüm `<img>` etiketlerinde açıklayıcı bir `alt` metni

Örnek iskelet:

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sayfa Başlığı</title>
  <meta name="description" content="Sayfanın kısa açıklaması.">
</head>
<body>
  <img src="ornek.jpg" alt="Görselin ne gösterdiğini anlatan metin">
</body>
</html>
```

## Çevrimdışı Önbellek (sw.js)

Site, `sw.js` (service worker) ile çevrimdışı çalışır. Bu yüzden:

- Önbelleğe alınan bir site dosyası değiştiğinde `sw.js` içindeki `SURUM` değeri bir artırılır (`sitem-v1` → `sitem-v2` → `sitem-v3` ...). Bu dosyalar: HTML sayfaları, `css/`, `js/`, `images/`, `fonts/`. Sürüm artırma işi, değişikliğin yapıldığı commit'e dahil edilir.
- Yalnızca `README.md`, `test.md`, `gunluk.md` gibi önbelleğe alınmayan dosyalar değiştiğinde sürüm artırılmaz.
- Siteye yeni bir sayfa, CSS, JS, görsel ya da yazı tipi eklendiğinde dosyanın yolu `sw.js` içindeki `DOSYALAR` listesine de eklenir. Kullanılmayan bir dosya listeden çıkarılır.
- Yapılan planda ve değişiklik sonrası özette sürümün hangi değere çıkarıldığı belirtilir.
