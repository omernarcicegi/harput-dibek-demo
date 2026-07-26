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

/**
 * Marka altını — logodan örneklendi. İki temada da aynı kalır ve
 * ÜZERİNE KOYU METİN gelecek şekilde kullanılır (rozet, dolgu, vurgu).
 * Metin rengi olarak `colors.<tema>.accent` kullanılır.
 */
const BRAND_GOLD = '#FCCC30';
const ON_GOLD = '#2A1B08';

export const brand = {
  // --- Kimlik --------------------------------------------------------------
  /** Kafe adı. Tek satır — tüm sitede burayı kullanır. */
  name: 'Harput Dibek',
  /** Hero'da adın altında el yazısıyla görünen aksan satırı. */
  nameAccent: 'Tarihten gelen kahve lezzeti',
  /** Hero'daki tek cümlelik slogan. */
  tagline: 'Dibek taşında dövülen çekirdek, kısık ateşte pişen gelenek.',
  /** Sekme başlığı ve meta açıklaması. */
  shortDescription: 'Dibek kahvesi, Türk kahvesi ve dünya kahveleri',
  /** Sosyal medyada kullanılan marka etiketi. */
  hashtag: '#EnLezzetliKahve',

  /** Logo dosyaları (public/images altında). */
  logo: {
    src: '/images/logo.webp',
    small: '/images/logo-sm.webp',
    alt: 'Harput Dibek logosu',
  },

  /** Yayınlanan adres. QR kodu bu adresi kodlar. */
  siteUrl: 'https://harput-dibek-demo.vercel.app',

  // --- Renk paleti ---------------------------------------------------------
  // İki tema da burada tanımlı. Değerler derleme sırasında CSS değişkenlerine
  // aktarılır (vite.config.ts). Kullanıcı tercihi yoksa cihazın sistem teması
  // kullanılır; kullanıcı düğmeyle değiştirirse seçimi hatırlanır.
  //
  // DİKKAT: Her iki paletteki tüm eşleşmeler WCAG AA (4.5:1) sağlar.
  // Ton değiştirirsen kontrastı yeniden ölç (README'deki komut).
  colors: {
    dark: {
      /** Sayfa zemini. */
      bg: '#16110D',
      /** Kartlar ve bölüm yüzeyleri. */
      surface: '#211A14',
      /** Ana metin. */
      ink: '#F4EADA',
      /** İkincil metin. */
      inkMuted: '#B9A991',
      /** Aksan — metin olarak da kullanılır. Koyu temada marka altını. */
      accent: BRAND_GOLD,
      /** Aksan zemininin üstündeki metin. */
      onAccent: ON_GOLD,
      /** Küçük etiketler (eyebrow). */
      highlight: '#E8B94A',
      /** Kenarlıklar. */
      border: '#3A2E24',
      /** Fotoğraf üstündeki açık metin. */
      onPhoto: '#FFF8EC',
    },
    light: {
      bg: '#FBF6EC',
      surface: '#F3E9D6',
      ink: '#241A12',
      inkMuted: '#6B5946',
      /** Açık zeminde altın okunmaz; metin için koyulaştırılmış bronz. */
      accent: '#8A5A0B',
      onAccent: '#FFF8EC',
      highlight: '#7A5A16',
      border: '#DFD0B4',
      onPhoto: '#FFF8EC',
    },
  },

  /** Logo sarısı — iki temada da dolgu olarak kullanılır. */
  gold: { fill: BRAND_GOLD, on: ON_GOLD },

  // --- Yazı tipleri --------------------------------------------------------
  fonts: {
    display: "'Anton', 'Arial Narrow', sans-serif",
    body: "'Barlow', system-ui, -apple-system, sans-serif",
    accent: "'Playfair Display', Georgia, serif",
  },

  // --- Açılış perdesi ------------------------------------------------------
  // Perde iki temada da koyudur: dökülen altın akıntı ancak koyu zeminde
  // görünür. Bu yüzden tema paletinden değil buradan okunur.
  intro: {
    curtainBg: '#1A120C',
    curtainInk: '#FFF3D6',
  },

  // --- Hero ----------------------------------------------------------------
  hero: {
    image: '/images/hero.webp',
    imageAlt: 'Koyu ahşap masada Türk kahvesi',
    /** Adın üstündeki küçük etiket. KISA tut — uzun metin taşar. */
    eyebrow: 'Elazığ · 2012’den beri',
    ctaLabel: 'Menüyü Gör',
  },

  // --- Sinematik hikâye panelleri -----------------------------------------
  // Dibek kahvesinin üç aşaması: çekirdek → kakule → cezve.
  storyPanels: [
    {
      id: 'panel-cekirdek',
      eyebrow: 'Çekirdek',
      title: 'Taşta Dövülür',
      body: 'Dibek, taştan oyulmuş bir havanın adı. Çekirdek öğütülmez, saatlerce dövülür; yağı hamurlaşır, aroması içine kilitlenir.',
      image: '/images/panel-1.webp',
      imageAlt: 'Koyu kavrulmuş kahve çekirdekleri',
    },
    {
      id: 'panel-kakule',
      eyebrow: 'Kakule',
      title: 'Kakuleyle Buluşur',
      body: 'Dövülmüş çekirdeğe kakule karışır. Dibek kahvesini Türk kahvesinden ayıran o yumuşak, baharatlı iz buradan gelir.',
      image: '/images/panel-2.webp',
      imageAlt: 'Yeşil kakule taneleri',
    },
    {
      id: 'panel-cezve',
      eyebrow: 'Cezve',
      title: 'Kısık Ateşte Pişer',
      body: 'Acele kaldırmaz. Cezve kısık ateşte bekler, köpüğü toplanır ve fincana öyle iner. Tarihten gelen lezzet tam da bu sabırda.',
      image: '/images/panel-3.webp',
      imageAlt: 'Harput Dibek fincanında servis edilen kahve',
    },
  ],

  // --- Hakkımızda ----------------------------------------------------------
  about: {
    eyebrow: 'Hakkımızda',
    title: 'Doğunun Samimiyeti',
    // Not: metinlerin içinde marka adını elle yazma — adı değiştirince
    // burası eski adla kalır. Ada ihtiyaç olursa bileşende `brand.name` kullan.
    body: 'Harput’un taş sokaklarından gelen bir alışkanlığı bugüne taşıyoruz: kahveyi acele etmeden hazırlamak. Çekirdeği kendi tesisimizde kavuruyor, dibekte dövüyor ve her fincanı aynı sabırla pişiriyoruz. Bugün otuzu aşkın coffee shop ve yüzlerce satış noktasıyla aynı lezzeti aynı şekilde sunuyoruz.',
    gallery: [
      { image: '/images/gallery-1.webp', alt: 'Harput Dibek fincanında sıcak kahve' },
      { image: '/images/gallery-2.webp', alt: 'Soğuk servis edilen Ice Dibek' },
      { image: '/images/gallery-3.webp', alt: 'Kalp formunda aşk pastası' },
      { image: '/images/gallery-4.webp', alt: 'Harput Dibek hediye seti' },
    ],
  },

  // --- Tarihçe -------------------------------------------------------------
  // Kaynak: harputdibek.com kurumsal sayfaları.
  history: {
    eyebrow: 'Tarihçe',
    title: 'Yolun Kilometre Taşları',
    intro: 'Küçük bir kavurma atölyesinden başlayıp sınırların ötesine uzanan bir hikâye.',
    milestones: [
      { year: '2012', title: 'İlk Kavurma', body: 'Harput Kahve kuruldu; üretim tek bir kavurma makinesiyle başladı.' },
      { year: '2015', title: 'Bayilik Ağı', body: 'Yurt içi ve yurt dışına yayılan profesyonel bayilik ağı kuruldu.' },
      { year: '2017', title: 'Raflarda', body: 'Doksana yakın alışveriş merkezinde satış noktası açıldı.' },
      { year: '2019', title: 'İlk Coffee Shop', body: 'İlk kendi şubemiz açıldı; kahve artık kendi mekânında servis ediliyor.' },
      { year: '2025', title: 'İki Marka', body: 'Dibek kahvesi “Harput Dibek”, diğer ürünler “Harput Kahve” çatısına ayrıldı.' },
    ],
    stats: [
      { value: '30+', label: 'Coffee Shop' },
      { value: '135+', label: 'Satış Noktası' },
      { value: '13', label: 'Yıllık Tecrübe' },
    ],
  },

  // --- Sosyal medya --------------------------------------------------------
  social: {
    eyebrow: 'Takipte Kal',
    title: 'Bizi Takip Edin',
    body: 'Yeni ürünler, kampanyalar ve şube haberleri için sosyal medyada buluşalım.',
    accounts: [
      { id: 'instagram', label: 'Instagram', handle: '@harputdibekcom', url: 'https://www.instagram.com/harputdibekcom/' },
      { id: 'facebook', label: 'Facebook', handle: 'harputdibekcom', url: 'https://www.facebook.com/harputdibekcom/' },
      { id: 'x', label: 'X', handle: '@harputdibekcom', url: 'https://x.com/harputdibekcom/' },
      { id: 'youtube', label: 'YouTube', handle: 'harputdibek', url: 'https://www.youtube.com/c/harputdibek' },
      { id: 'linkedin', label: 'LinkedIn', handle: 'harputdibek', url: 'https://www.linkedin.com/company/harputdibek' },
      { id: 'whatsapp', label: 'WhatsApp', handle: '0850 305 0 385', url: 'https://wa.me/908503050385' },
    ],
  },

  // --- Bölüm başlıkları ----------------------------------------------------
  sections: {
    menuEyebrow: 'Menü',
    menuTitle: 'Ne İçelim?',
    menuSubtitle: 'Fiyatlara KDV dahildir. İçerik ve alerjen bilgisi için ürüne dokunun.',
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
  admin: {
    username: 'kafe',
    password: 'demo1234',
    showCredentialHint: true,
  },

  // --- Varsayılan iletişim bilgileri --------------------------------------
  // Kaynak: harputdibek.com/iletisim (genel merkez).
  defaultContact: {
    address: 'Ataşehir Mah. Hacı Saadettin Efendi Bul. No:64, 23040 Elazığ',
    phoneDisplay: '0850 305 0 385',
    phoneDial: '+908503050385',
    mapsUrl: 'https://maps.google.com/?q=Ata%C5%9Fehir+Mah.+Hac%C4%B1+Saadettin+Efendi+Bul.+No:64+Elaz%C4%B1%C4%9F',
    instagramUrl: 'https://www.instagram.com/harputdibekcom/',
  } satisfies ContactInfo,

  // --- Varsayılan çalışma saatleri ----------------------------------------
  defaultHours: [
    { day: 'pazartesi', closed: false, openTime: '08:00', closeTime: '23:00' },
    { day: 'sali', closed: false, openTime: '08:00', closeTime: '23:00' },
    { day: 'carsamba', closed: false, openTime: '08:00', closeTime: '23:00' },
    { day: 'persembe', closed: false, openTime: '08:00', closeTime: '23:00' },
    { day: 'cuma', closed: false, openTime: '08:00', closeTime: '24:00' },
    { day: 'cumartesi', closed: false, openTime: '09:00', closeTime: '24:00' },
    { day: 'pazar', closed: false, openTime: '09:00', closeTime: '23:00' },
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
