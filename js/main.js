// =========================================================
// Yunus Sorgut kişisel site - Sayfa etkileşimleri
// =========================================================

// JavaScript çalışıyorsa belirme efektini etkinleştir
document.documentElement.classList.add("js");

// ---------- Mobil menü ----------
const menuDugme = document.getElementById("menuDugme");
const menu = document.getElementById("menu");

function menuyuKapat() {
  menu.classList.remove("acik");
  menuDugme.setAttribute("aria-expanded", "false");
  menuDugme.setAttribute("aria-label", "Menüyü aç");
}

menuDugme.addEventListener("click", () => {
  const acik = menu.classList.toggle("acik");
  menuDugme.setAttribute("aria-expanded", String(acik));
  menuDugme.setAttribute("aria-label", acik ? "Menüyü kapat" : "Menüyü aç");
});

// Menüden bir linke tıklanınca menüyü kapat
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", menuyuKapat));

// Esc tuşu ile menüyü kapat
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") menuyuKapat();
});

// ---------- Koyu / açık tema düğmesi ----------
// İlk tema <head> içindeki betikte seçilir (kayıtlı seçim, yoksa sistem tercihi).
// Düğmeye basılınca seçim localStorage'a kaydedilir; seçim yapılmamışsa site sistemi izler.
const temaDugme = document.getElementById("temaDugme");
const sistemKoyu = window.matchMedia("(prefers-color-scheme: dark)");
const temaRengi = document.querySelector('meta[name="theme-color"]');

function kayitliTema() {
  try { return localStorage.getItem("tema"); } catch (e) { return null; }
}

function temayiUygula(tema) {
  const koyu = tema === "koyu";
  document.documentElement.setAttribute("data-tema", koyu ? "koyu" : "acik");
  if (temaRengi) temaRengi.setAttribute("content", koyu ? "#1A1D2B" : "#587152");
  if (temaDugme) {
    temaDugme.setAttribute("aria-pressed", String(koyu));
    temaDugme.title = koyu ? "Açık temaya geç" : "Koyu temaya geç";
  }
}

temayiUygula(document.documentElement.getAttribute("data-tema") || (sistemKoyu.matches ? "koyu" : "acik"));

if (temaDugme) {
  temaDugme.addEventListener("click", () => {
    const yeni = document.documentElement.getAttribute("data-tema") === "koyu" ? "acik" : "koyu";
    temayiUygula(yeni);
    try { localStorage.setItem("tema", yeni); } catch (e) { /* gizli sekme vb.: kaydedilemese de çalışır */ }
  });
}

sistemKoyu.addEventListener("change", (e) => {
  if (!kayitliTema()) temayiUygula(e.matches ? "koyu" : "acik");
});

// ---------- Kaydırınca üst menü gölgesi ve yukarı butonu ----------
const ust = document.getElementById("ust");
const yukari = document.getElementById("yukari");
const ilerleme = document.getElementById("ilerleme");

function kaydirmaKontrol() {
  const y = window.scrollY;
  if (ust) ust.classList.toggle("kaydi", y > 10);
  if (yukari) yukari.classList.toggle("gorunur", y > 600);
  if (ilerleme) {
    // Okuma ilerlemesi: 0 (en üst) ile 1 (en alt) arasında
    const toplam = document.documentElement.scrollHeight - window.innerHeight;
    const oran = toplam > 0 ? Math.min(y / toplam, 1) : 0;
    ilerleme.style.transform = `scaleX(${oran})`;
  }
}
window.addEventListener("scroll", kaydirmaKontrol, { passive: true });
kaydirmaKontrol();

// ---------- Bölümler göründükçe belirme efekti ----------
const belirenler = document.querySelectorAll(".belir");

if ("IntersectionObserver" in window) {
  const gozlemci = new IntersectionObserver(
    (girdiler) => {
      girdiler.forEach((girdi) => {
        if (girdi.isIntersecting) {
          girdi.target.classList.add("gorundu");
          gozlemci.unobserve(girdi.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  belirenler.forEach((el) => gozlemci.observe(el));
} else {
  belirenler.forEach((el) => el.classList.add("gorundu"));
}

// ---------- Rakamların sayarak artması ----------
const hareketAzalt = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rakamlar = document.querySelectorAll("[data-sayi]");

function say(el) {
  const hedef = Number(el.dataset.sayi);
  const on = el.dataset.on || "";
  const ek = el.dataset.ek || "";
  const sure = 1400;
  const baslangic = performance.now();

  function adim(simdi) {
    const ilerleme = Math.min((simdi - baslangic) / sure, 1);
    const deger = Math.round(hedef * (1 - Math.pow(1 - ilerleme, 3)));
    el.textContent = on + deger + ek;
    if (ilerleme < 1) requestAnimationFrame(adim);
  }
  requestAnimationFrame(adim);
}

if (!hareketAzalt && "IntersectionObserver" in window) {
  const sayac = new IntersectionObserver((girdiler) => {
    girdiler.forEach((girdi) => {
      if (girdi.isIntersecting) {
        say(girdi.target);
        sayac.unobserve(girdi.target);
      }
    });
  }, { threshold: 0.6 });
  rakamlar.forEach((el) => sayac.observe(el));
}

// ---------- İletişim formu kontrolü ve gönderimi ----------
// Alanlar kontrol edildikten sonra mesaj, formun action adresindeki
// Formspree'ye sayfa yenilenmeden (fetch ile) gönderilir.
const form = document.getElementById("iletisimFormu");
const formSonuc = document.getElementById("formSonuc");

if (form) {
  const kurallar = {
    ad: (d) => (d.trim().length < 3 ? "Lütfen adınızı ve soyadınızı yazın." : ""),
    eposta: (d) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.trim()) ? "" : "Lütfen geçerli bir e-posta adresi yazın."),
    mesaj: (d) => (d.trim().length < 10 ? "Mesajınız en az 10 karakter olmalı." : ""),
  };

  function alaniKontrolEt(alan) {
    const hataMesaji = kurallar[alan.name](alan.value);
    const kutu = alan.closest(".alan");
    kutu.classList.toggle("hatali", Boolean(hataMesaji));
    kutu.querySelector(".hata").textContent = hataMesaji;
    alan.setAttribute("aria-invalid", hataMesaji ? "true" : "false");
    return !hataMesaji;
  }

  Object.keys(kurallar).forEach((ad) => {
    const alan = form.elements[ad];
    alan.addEventListener("blur", () => alaniKontrolEt(alan));
    alan.addEventListener("input", () => {
      if (alan.closest(".alan").classList.contains("hatali")) alaniKontrolEt(alan);
    });
  });

  const gonderDugme = form.querySelector('button[type="submit"]');
  const gonderYazisi = gonderDugme.textContent;

  function sonucGoster(metin, hataMi) {
    formSonuc.textContent = metin;
    formSonuc.classList.toggle("form__sonuc--hata", hataMi);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formSonuc.textContent = "";

    const alanlar = Object.keys(kurallar).map((ad) => form.elements[ad]);
    const gecerli = alanlar.map(alaniKontrolEt).every(Boolean);

    if (!gecerli) {
      alanlar.find((a) => a.getAttribute("aria-invalid") === "true").focus();
      return;
    }

    // Bal küpü: görünmeyen _gotcha alanı doluysa gönderen bottur.
    // Formspree'ye hiç gönderilmez (kota harcanmaz), bota başarılı gibi görünür.
    if (form.elements._gotcha.value) {
      sonucGoster("İlginiz için teşekkür ederiz. Mesajınız bize ulaştı. En kısa sürede tarafınıza dönüş yapılacaktır.", false);
      form.reset();
      return;
    }

    gonderDugme.disabled = true;
    gonderDugme.textContent = "Gönderiliyor…";

    const veri = new FormData(form);
    veri.append("email", form.elements.eposta.value.trim()); // Formspree'de "Yanıtla" gönderene gitsin

    try {
      const yanit = await fetch(form.action, {
        method: "POST",
        body: veri,
        headers: { Accept: "application/json" },
      });
      if (!yanit.ok) throw new Error("Formspree yanıtı: " + yanit.status);

      sonucGoster("İlginiz için teşekkür ederiz. Mesajınız bize ulaştı. En kısa sürede tarafınıza dönüş yapılacaktır.", false);
      form.reset();
    } catch (hata) {
      sonucGoster("Gönderilemedi, tekrar deneyin.", true);
    } finally {
      gonderDugme.disabled = false;
      gonderDugme.textContent = gonderYazisi;
    }
  });
}

// ---------- Alt bilgideki yıl ----------
const yil = document.getElementById("yil");
if (yil) yil.textContent = new Date().getFullYear();

// ---------- Çevrimdışı çalışma (service worker) ----------
// sw.js kök klasörde durur; sayfa alt klasörde olsa da main.js'in
// adresinden kök klasör bulunur. file:// ile açılan sayfada çalışmaz.
if ("serviceWorker" in navigator && document.currentScript) {
  const kok = document.currentScript.src.replace(/js\/main\.js.*$/, "");
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(kok + "sw.js").catch(() => {});
  });
}
