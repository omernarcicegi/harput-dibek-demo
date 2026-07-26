# Üçüncü Fincan — Demo Kafe Sitesi

Kafelere satış görüşmesinde gösterilmek üzere hazırlanmış, QR koddan açılan,
mobil öncelikli bir demo kafe sitesi ve sahte verili yönetim paneli.

Üç adres barındırır:

| Adres | İçerik |
|---|---|
| `/` | Müşteri sitesi — hero, sinematik paneller, menü, hakkımızda, iletişim |
| `/admin` | Sahte girişli yönetim paneli (ürün, kategori, saat, iletişim) |
| `/qr` | A6 boyutunda yazdırılabilir masa kartı |

> **Bu site gerçek bir işletmeye ait değildir.** "Üçüncü Fincan" nötr bir yer
> tutucu addır. Menü, fiyatlar ve iletişim bilgileri uydurmadır.

---

## Kurulum

Node 20 veya üzeri gerekir (geliştirme Node 24 ile yapıldı).

```bash
npm install
```

## Geliştirme

```bash
npm run dev             # geliştirme sunucusu (http://localhost:5173)
npm run dev -- --host   # aynı wifi'daki telefondan açmak için
npm run build           # tip kontrolü + üretim derlemesi (dist/)
npm run preview         # derlenmiş çıktıyı yerelde sun (http://localhost:4173)
npm test                # testleri çalıştır (Vitest)
```

Telefondan denemek için `npm run dev -- --host` çalıştırıp terminalde görünen
`Network:` adresini telefonun tarayıcısına yaz.

## Yayına Alma

Statik bir sitedir; sunucu ve veritabanı gerekmez.

### Vercel

```bash
npm i -g vercel
vercel          # ilk seferde projeyi oluşturur
vercel --prod
```

`vercel.json` içindeki rewrite kuralı sayesinde `/admin` ve `/qr` adresleri
doğrudan açıldığında da çalışır. Yazı tipi ve görseller için uzun süreli
önbellek başlıkları da aynı dosyadadır.

### Netlify

`public/_redirects` aynı yönlendirmeyi Netlify için sağlar.
Derleme komutu `npm run build`, yayın klasörü `dist`.

### Yayından sonra

`src/config/brand.ts` içindeki `siteUrl` alanını yayınlanan adrese güncelle —
`/qr` sayfasındaki QR kod bu adresi kodlar.

---

## Markayı Değiştirme

**Tüm marka bilgisi tek dosyadadır: `src/config/brand.ts`.**
Bileşenlerin içinde gömülü hiçbir marka metni yoktur; bu kural bir testle
korunur (`src/config/brand.test.tsx`).

### En hızlı yol (30 saniye)

`src/config/brand.ts` dosyasında tek satır:

```ts
name: 'Üçüncü Fincan',     // ← burayı değiştir
```

Kafe adı hero'da, açılış animasyonunda, sayfa başlığında, alt bilgide, admin
panelinde ve QR kartında güncellenir.

### Tam markalama (5 dakika)

Aynı dosyadaki şu alanları sırayla gözden geçir:

| Alan | Ne yapar |
|---|---|
| `name` | Kafe adı |
| `nameAccent` | Adın altındaki el yazısı aksan kelime |
| `tagline` | Hero'daki tek cümlelik slogan |
| `shortDescription` | Sekme başlığı ve meta açıklaması |
| `siteUrl` | QR kodun kodladığı adres |
| `colors` | Renk paleti (aşağıdaki uyarıyı oku) |
| `fonts` | Yazı tipleri |
| `hero` | Açılış görseli, kısa etiket, düğme yazısı |
| `storyPanels` | Tam ekran hikâye panelleri (ekle/çıkar serbest) |
| `about` | Tanıtım metni ve 4 görsellik galeri |
| `sections`, `nav` | Bölüm başlıkları ve alt gezinme etiketleri |
| `admin` | Demo giriş bilgileri |
| `defaultContact`, `defaultHours` | Sıfırlamada dönülecek varsayılanlar |
| `qrCard` | Masa kartı metinleri |

### Renk değiştirirken dikkat

Renkler derleme sırasında `index.html` içine CSS değişkeni olarak gömülür
(`vite.config.ts` → `brandHtmlPlugin`), Tailwind de bu değişkenleri okur.
Yani tek dosyadan değiştirmek yeterlidir.

**Ancak kontrastı bozma.** Palet WCAG AA (4.5:1) sağlayacak şekilde seçildi ve
Lighthouse erişilebilirlik skoru 100. Özellikle `accent` rengi iki yerde
birden kullanılıyor: üzerine açık metin gelen düğmelerde **ve** açık zemin
üstünde metin olarak. Daha açık bir tona çekersen ikisi birden bozulur.
Değiştirdikten sonra ölç:

```bash
npm run build && npm run preview &
npx lighthouse http://localhost:4173/ --only-categories=accessibility \
  --chrome-flags="--headless --no-sandbox"
```

### Görselleri değiştirme

Görseller `public/images/` altındadır; `brand.ts` ve `src/data/seed.ts`
içinden yolla referans edilir.

```
public/images/
  hero.webp            1080×1440   açılış görseli
  panel-1..3.webp      1080×1440   hikâye panelleri
  gallery-1..4.webp    800×800     hakkımızda galerisi
  menu/*.webp          600×450     ürün görselleri
```

Yeni görsel koyarken **aynı en-boy oranını ve dosya adını koru** — böylece kod
değişikliği gerekmez ve sayfa kayması (layout shift) oluşmaz. Farklı bir boyut
kullanacaksan ilgili bileşendeki `width`/`height` değerlerini de güncelle.

WebP'ye çevirmek için:

```bash
brew install webp
cwebp -q 74 kaynak.jpg -o public/images/menu/urun.webp
```

**Görsel kaynakları:** Tüm fotoğraflar [Openverse](https://openverse.org)
üzerinden bulunan **CC0 / kamu malı** görsellerdir; atıf zorunluluğu yoktur.
Künye izlenebilirlik için `GORSEL-KAYNAKLARI.json` dosyasındadır.

### Yazı tiplerini değiştirme

Yazı tipleri `public/fonts/` altında barındırılır (çevrimdışı çalışsın ve
Lighthouse'ta dış istek beklenmesin diye). Değiştirmek için:

1. Yeni `.woff2` dosyalarını `public/fonts/` içine koy
2. `src/index.css` başındaki `@font-face` bloklarını güncelle
3. `src/config/brand.ts` içindeki `fonts` alanını güncelle
4. `index.html` içindeki `preload` bağlantılarını güncelle

> Türkçe için **hem `latin` hem `latin-ext`** alt kümesi gerekir:
> `ç ö ü` latin'de, `ğ ş İ` latin-ext'tedir. Yalnızca birini eklersen bazı
> harfler sistem yazı tipine düşer.

---

## Mimari

```
src/
├── config/brand.ts                ← TÜM marka bilgisi burada
├── data/seed.ts                   ← başlangıç menüsü (sıfırlama buraya döner)
├── types.ts
├── lib/
│   ├── createPersistentStore.ts   localStorage + abonelik + bozuk veriden kurtarma
│   ├── motion.tsx                 IntersectionObserver, Reveal, stagger
│   ├── router.tsx                 3 rotalık minimal yönlendirici
│   ├── format.ts                  fiyat / saat biçimlendirme
│   └── scroll.ts
├── stores/
│   ├── menuStore.ts               saf dönüştürücüler + bağlı eylemler
│   ├── siteInfoStore.ts           saatler ve iletişim
│   └── hooks.ts                   useSyncExternalStore bağlantısı
├── components/                    Intro, BottomSheet, BottomNav
├── sections/                      Hero, StoryPanels, Menu, About, Contact
├── admin/                         ürün / kategori / ayar sekmeleri
└── pages/                         CustomerPage, AdminPage, QrPage
```

**Veri akışı.** Admin paneli ve müşteri menüsü aynı state deposunu paylaşır
(`useSyncExternalStore`). Adminde yapılan değişiklik aynı render turunda menüye
yansır; veri `localStorage`'a yazıldığı için sayfa yenilendiğinde de korunur.
Bozuk veya elle kurcalanmış veri okunduğunda uygulama çökmez, başlangıç
verisine döner.

**Kod bölme.** `/admin` ve `/qr` ayrı parçalardır — QR'dan gelen müşteri
yönetim panelinin kodunu indirmez.

---

## Ölçümler

Üretim derlemesi üzerinde ölçüldü (`npm run build` + `npm run preview`,
Lighthouse 12, mobil profil):

| Ölçüm | Değer |
|---|---|
| Lighthouse mobil — Performance | **93** |
| Lighthouse mobil — Accessibility | **100** |
| Cumulative Layout Shift | 0 |
| Total Blocking Time | 0 ms |
| Müşteri sayfası JS (gzip) | 69,2 KB |
| CSS (gzip) | 6,4 KB |
| `/admin` parçası (gzip) | 4,7 KB |
| `/qr` parçası (gzip) | 9,4 KB |
| **Toplam JS (gzip, üç sayfa)** | **83,3 KB** — sınır 150 KB |
| Görseller | 948 KB (30 dosya) |
| Yazı tipleri | 132 KB (8 dosya) |
| Testler | 48 test / 5 dosya (~1,5 sn) |

Yeniden ölçmek için:

```bash
npm run build && npm run preview &
npx lighthouse http://localhost:4173/ \
  --only-categories=performance,accessibility \
  --chrome-flags="--headless --no-sandbox"
```

---

## Varsayımlar

Kodlama sırasında sorulmadan verilen kararlar:

1. **Kafe adı** "Üçüncü Fincan" seçildi — gerçek bir işletmeyle karışma
   ihtimali düşük, jenerik olmayan bir yer tutucu.
2. **Renk paleti** krem `#F7F2EA` / koyu kahve `#2A211B` / terrakota `#A8451F`.
   Terrakota ilk seçilenden (`#C0562F`) koyulaştırıldı: ilk ton WCAG AA
   kontrastını sağlamıyordu (düğmede 4,32 ve zemin üstü metinde 3,70).
3. **Yazı tipleri**: başlıklar **Anton** (referanstaki poster etkisini veren
   sıkıştırılmış karakter), gövde **Barlow**, hero'daki aksan kelime
   **Playfair Display Italic**. Üçü de Türkçe karakterleri destekler.
4. **Ürün adları ve fiyatları** Türkiye kafe piyasasına makul görünecek şekilde
   uyduruldu (espresso 65 ₺ … peynir tabağı 220 ₺). 4 kategori, 22 ürün.
   "Frappe" başlangıçta *tükendi* işaretlidir — o özellik demoda hemen
   gösterilebilsin diye.
5. **Çalışma saatleri** hafta içi 08:00–20:00, cuma–cumartesi 22:00'ye kadar,
   pazar kapalı varsayıldı.
6. **Adres ve telefon** uydurmadır (Kadıköy / İstanbul). Instagram bağlantısı
   `instagram.com` ana sayfasına gider.
7. **Kategori silinince içindeki ürünler de silinir.** Öksüz ürün bırakmamak
   için bilinçli tercih; panel silmeden önce kaç ürünün gideceğini söyler.
8. **Sıralama sürükle-bırak ile değil, yukarı/aşağı düğmeleriyle** yapılır —
   mobilde daha güvenilir ve klavyeyle erişilebilir.
9. **Görsel yükleme yoktur.** Admin, projeye gömülü görseller arasından seçer;
   kafe sahibinin kendi fotoğrafını yüklemesi kapsam dışıdır.
10. **Hikâye panelleri yapışkan (sticky) yığılma** ile geçer; referans videodaki
    katmanlı geçişin yalnızca `transform`/`opacity` kullanan, JS'siz karşılığı.
11. **Kaydırma hizalaması `proximity`** seçildi (`mandatory` değil) — aksi
    hâlde uzun menü listesi hizalama tuzağına düşüyordu.
12. **`react-router` kullanılmadı.** Üç rota var ve hiçbiri parametre almıyor;
    `src/lib/router.tsx` içindeki ~50 satır yeterli. Ayrıca kurulumda
    `npm audit` react-router'da yüksek önemde bir açık (RSC modu CSRF bypass)
    bildirdi; paketi çıkarmak bağımlılık ağacını temizledi (`0 vulnerabilities`).
13. **Animasyon kütüphanesi kullanılmadı.** Tüm gereksinimler CSS geçişleri ve
    `IntersectionObserver` ile karşılandı; ek paket maliyeti sıfır.
14. **Çalışma saati aç/kapa denetimi onay kutusu değil düğmedir** — onay kutusu
    20 px kalıyor ve 44 px dokunma hedefi kuralını karşılamıyordu.
15. **Test zaman aşımı 15 sn'ye yükseltildi** (`vite.config.ts`). Varsayılan
    5 sn, yüklü bir makinede bileşen testlerinde kararsızlığa yol açıyordu;
    `userEvent` tuş gecikmesi de kaldırıldı (süre 42 sn → ~1,5 sn).

---

## Güvenlik notu

`/admin` sayfasındaki giriş **gerçek bir kimlik doğrulama değildir.** Şifre
kaynak kodda düz metindir ve demo olduğu için giriş ekranında gösterilir.
Panelin üstünde kalıcı bir "DEMO" rozeti bulunur.

Bu proje gerçek bir kafeye teslim edilecekse yönetim paneli, sunucu tarafında
doğrulama yapan gerçek bir kimlik doğrulama sistemiyle değiştirilmelidir.
Mevcut hâliyle veriler yalnızca ziyaretçinin kendi tarayıcısında durur —
başkasının göreceği bir değişiklik yapmaz.

## Kapsam dışı

Online sipariş, sepet, ödeme; masa rezervasyonu; gerçek kullanıcı hesabı;
çok dilli destek; blog veya harici içerik yönetim sistemi entegrasyonu.
