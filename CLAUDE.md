# CLAUDE.md

Bu dosya, Claude Code'un bu projede çalışırken uyacağı kuralları içerir.

## Çalışma Kuralları

1. **Dil:** Tüm cevaplar Türkçe verilmelidir.
2. **Önce plan:** Kod yazmadan veya dosya değiştirmeden önce yapılacakların planı anlatılmalı ve kullanıcının onayı beklenmelidir. Onay gelmeden değişiklik yapılmaz.
3. **Silme yasağı:** Hiçbir dosya silinmez. Bir dosyanın artık gerekmediği düşünülüyorsa bu kullanıcıya bildirilir, silme işlemi kullanıcıya bırakılır.
4. **Test talimatı:** Her değişiklikten sonra, değişikliğin nasıl test edileceği adım adım anlatılmalıdır (örneğin hangi dosyanın tarayıcıda açılacağı, neye bakılacağı).

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
