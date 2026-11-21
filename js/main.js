// =========================================================
// Yunus Sorgut kişisel site - Sayfa etkileşimleri
// =========================================================

// JavaScript çalışıyorsa belirme efektini etkinleştir
document.documentElement.classList.add("js");

// ---------- Mobil menü ----------
const menuDugme = document.getElementById("menuDugme");
const menu = document.getElementById("menu");

function menuyuKapat() {
  
  menuDugme.setAttribute("aria-label", acik ? "Menüyü kapat" : "Menüyü aç");
});

// Menüden bir linke tıklanınca menüyü kapat
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", menuyuKapat));

// Esc tuşu ile menüyü kapat
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") menuyuKapat();
});

// ---------- Kaydırınca üst menü gölgesi ve yukarı butonu ----------
const ust = document.getElementById("ust");
const yukari = document.getElementById("yukari");

function kaydirmaKontrol() {
  const y = window.scrollY;
  ust.classList.toggle("kaydi", y > 10);
  yukari.classList.toggle("gorunur", y > 600);
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

// ---------- İletişim formu kontrolü ----------
// Not: Form şimdilik gerçek bir mesaj göndermez. Alanları kontrol edip
// başarı mesajı gösterir. Gerçek gönderim için Formspree vb. bağlanabilir.
const form = document.getElementById("iletisimFormu");
const formSonuc = document.getElementById("formSonuc");

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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formSonuc.textContent = "";

  const alanlar = Object.keys(kurallar).map((ad) => form.elements[ad]);
  const gecerli = alanlar.map(alaniKontrolEt).every(Boolean);

  if (!gecerli) {
    alanlar.find((a) => a.getAttribute("aria-invalid") === "true").focus();
    return;
  }

  const ad = form.elements.ad.value.trim().split(" ")[0];
  formSonuc.textContent = `Teşekkürler ${ad}! Mesajınız alındı, en kısa sürede dönüş yapacağım.`;
  form.reset();
});

// ---------- Alt bilgideki yıl ----------
document.getElementById("yil").textContent = new Date().getFullYear();
