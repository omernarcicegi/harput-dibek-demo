// ============================================================================
// MARKA YAPILANDIRMASI — SİTENİN TEK GERÇEK KAYNAĞI
// ============================================================================
// Yeni bir kafeye demo göstermeden önce SADECE bu dosyayı düzenle.
// Bileşenlerin içinde hiçbir marka metni gömülü değildir; hepsi buradan okunur.
//
// En hızlı başlangıç: aşağıdaki `name` satırını değiştir — kafe adı hero'da,
// açılış animasyonunda, sayfa başlığında, alt bilgide ve QR kartında güncellenir.
// ============================================================================

import type { ContactInfo, DayHours } from '../types';

export const brand = {
  // --- Kimlik --------------------------------------------------------------
  /** Kafe adı. Tek satır — tüm sitede burayı kullanır. */
  name: 'Üçüncü Fincan',
  /** Hero'da adın altında el yazısıyla görünen aksan kelime. */
  nameAccent: 'Kahve Evi',
  /** Hero'daki tek cümlelik slogan. */
  tagline: 'Günün en iyi molası burada başlar.',
  /** Sekme başlığı ve QR kartında kullanılan kısa tanım. */
  shortDescription: 'Üçüncü dalga kahve, taze fırın ve sakin bir köşe.',

  /** Yayınlanan adres. QR kodu bu adresi kodlar. */
  siteUrl: 'https://ucuncu-fincan.vercel.app',

  // --- Renk paleti ---------------------------------------------------------
  // Sıcak açık ton. Değerler derleme sırasında CSS değişkenlerine aktarılır,
  // Tailwind bu değişkenler üzerinden okur (vite.config.ts içindeki eklentiye bak).
  colors: {
    /** Sayfa zemini — krem. */
    bg: '#F7F2EA',
    /** Zeminden bir ton koyu yüzey — kartlar, bölüm ayrımları. */
    surface: '#EFE7DA',
    /** Ana metin — koyu kahve. */
    ink: '#2A211B',
    /** İkincil metin — soluk kahve. */
    inkMuted: '#6B5B4E',
    /**
     * Aksan / çağrı düğmeleri — terrakota.
     * Not: bu ton hem üzerine gelen açık metinle (onAccent) hem de zemin
     * üstünde metin olarak kullanıldığında WCAG AA (4.5:1) sağlayacak kadar
     * koyu seçildi. Daha açık bir tona çekersen kontrastı yeniden ölç.
     */
    accent: '#A8451F',
    /** Aksan üzerindeki metin. */
    onAccent: '#FFF8F0',
    /** Küçük etiket ve vurgular — zeytin yeşili. */
    highlight: '#5C6B4A',
    /** Kenarlıklar. */
    border: '#DDD1BE',
    /** Fotoğraf üstündeki açık metin. */
    onPhoto: '#FFF9F0',
  },

  // --- Yazı tipleri --------------------------------------------------------
  // public/fonts altında self-host edilir (çevrimdışı çalışsın ve
  // Lighthouse'ta dış istek beklenmesin diye).
  fonts: {
    /** Dev başlıklar — sıkıştırılmış poster karakteri. */
    display: "'Anton', 'Arial Narrow', sans-serif",
    /** Gövde metni ve arayüz. */
    body: "'Barlow', system-ui, -apple-system, sans-serif",
    /** Hero'daki aksan kelime — el yazısı hissi veren italik serif. */
    accent: "'Playfair Display', Georgia, serif",
  },

  // --- Hero ----------------------------------------------------------------
  hero: {
    image: '/images/hero.webp',
    imageAlt: 'Sabah ışığı alan kafenin içi',
    /** Adın üstündeki küçük etiket. KISA tut — uzun metin iki satıra taşar. */
    eyebrow: 'Kadıköy · 2019’dan beri',
    ctaLabel: 'Menüyü Gör',
  },

  // --- Sinematik hikâye panelleri -----------------------------------------
  // Referans videodaki tam ekran panellerin karşılığı.
  // Panel eklemek/çıkarmak için diziye eleman ekle/çıkar; site kendini uydurur.
  storyPanels: [
    {
      id: 'panel-cekirdek',
      eyebrow: 'Çekirdek',
      title: 'Her Sabah Taze',
      body: 'Çekirdekleri haftalık kavuruyoruz. Demlemeden önce öğütüyoruz. Fincana geleni tesadüfe bırakmıyoruz.',
      image: '/images/panel-1.webp',
      imageAlt: 'Öğütülmüş kahve çekirdekleri',
    },
    {
      id: 'panel-mekan',
      eyebrow: 'Mekân',
      title: 'Oturmak İçin Bir Sebep',
      body: 'Ahşap masalar, bol ışık ve acele ettirmeyen bir servis. Dizüstünü aç ya da kapat — burası ikisine de uygun.',
      image: '/images/panel-2.webp',
      imageAlt: 'Kafenin oturma alanı',
    },
    {
      id: 'panel-firin',
      eyebrow: 'Fırın',
      title: 'Gün Sıcak Başlar',
      body: 'Kruvasan ve kekler her sabah yerinde pişiyor. Öğleden sonraya kalanı yoktur, erken gelmekte fayda var.',
      image: '/images/panel-3.webp',
      imageAlt: 'Fırından yeni çıkmış hamur işleri',
    },
  ],

  // --- Hakkımızda ----------------------------------------------------------
  about: {
    eyebrow: 'Hakkımızda',
    title: 'Küçük Bir Köşe',
    // Not: metinlerin içinde kafe adını elle yazma — adı değiştirince
    // burası eski adla kalır. Ada ihtiyaç olursa bileşende `brand.name` kullan.
    body: 'Burası, iyi kahvenin gösterişe ihtiyacı olmadığına inanan birkaç kişinin açtığı bir mahalle kafesi. Çekirdeği doğrudan üreticiden alıyor, kendi kavurmamızı yapıyor ve her fincanı elimizle demliyoruz. Acelesi olana hızlı, oturmak isteyene sakin bir yer.',
    gallery: [
      { image: '/images/gallery-1.webp', alt: 'Barista espresso hazırlıyor' },
      { image: '/images/gallery-2.webp', alt: 'Pencere kenarındaki masa' },
      { image: '/images/gallery-3.webp', alt: 'Latte art yapılmış kahve' },
      { image: '/images/gallery-4.webp', alt: 'Tezgâhtaki tatlılar' },
    ],
  },

  // --- Bölüm başlıkları ----------------------------------------------------
  sections: {
    menuEyebrow: 'Menü',
    menuTitle: 'Ne İçelim?',
    menuSubtitle: 'Fiyatlar KDV dahildir. Alerjenler için ürüne dokunun.',
    contactEyebrow: 'Ziyaret',
    contactTitle: 'Bize Uğrayın',
  },

  // --- Alt gezinme çubuğu --------------------------------------------------
  nav: [
    { id: 'menu', label: 'Menü' },
    { id: 'hakkimizda', label: 'Hakkımızda' },
    { id: 'iletisim', label: 'İletişim' },
  ],

  // --- Admin paneli --------------------------------------------------------
  // DİKKAT: Bu gerçek bir kimlik doğrulama değildir. Sadece satış demosunda
  // "panel korumalı" hissi vermek için vardır ve bilgiler ekranda gösterilir.
  // Gerçek bir müşteriye teslim edilecekse arka uçlu bir çözümle değiştirilmeli.
  admin: {
    username: 'kafe',
    password: 'demo1234',
    /** Giriş ekranında bilgileri ipucu olarak göster. */
    showCredentialHint: true,
  },

  // --- Varsayılan iletişim bilgileri --------------------------------------
  // Admin panelinden düzenlenebilir; "Demo verisini sıfırla" buraya döner.
  defaultContact: {
    address: 'Bahçelievler Mah. Fındık Sok. No 12, Kadıköy / İstanbul',
    phoneDisplay: '0216 555 34 21',
    phoneDial: '+902165553421',
    mapsUrl: 'https://maps.google.com/?q=Kadıköy+İstanbul',
    instagramUrl: 'https://instagram.com',
  } satisfies ContactInfo,

  // --- Varsayılan çalışma saatleri ----------------------------------------
  defaultHours: [
    { day: 'pazartesi', closed: false, openTime: '08:00', closeTime: '20:00' },
    { day: 'sali', closed: false, openTime: '08:00', closeTime: '20:00' },
    { day: 'carsamba', closed: false, openTime: '08:00', closeTime: '20:00' },
    { day: 'persembe', closed: false, openTime: '08:00', closeTime: '20:00' },
    { day: 'cuma', closed: false, openTime: '08:00', closeTime: '22:00' },
    { day: 'cumartesi', closed: false, openTime: '09:00', closeTime: '22:00' },
    { day: 'pazar', closed: true, openTime: '09:00', closeTime: '18:00' },
  ] satisfies DayHours[],

  // --- QR masa kartı -------------------------------------------------------
  qrCard: {
    kicker: 'Menümüz telefonunuzda',
    instruction: 'Kamerayı QR koda tutun',
    footnote: 'Uygulama indirmenize gerek yok.',
  },
} as const;

/** Gün anahtarlarının Türkçe gösterimi. */
export const DAY_LABELS: Record<string, string> = {
  pazartesi: 'Pazartesi',
  sali: 'Salı',
  carsamba: 'Çarşamba',
  persembe: 'Perşembe',
  cuma: 'Cuma',
  cumartesi: 'Cumartesi',
  pazar: 'Pazar',
};

/** Ürün rozetlerinin ekranda görünen karşılığı. */
export const BADGE_LABELS: Record<string, string> = {
  yeni: 'Yeni',
  'cok-satan': 'Çok Satan',
  vegan: 'Vegan',
};
