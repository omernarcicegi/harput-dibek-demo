# Harput Dibek — Demo Kafe Sitesi

Kafelere satış görüşmesinde gösterilmek üzere hazırlanmış, QR koddan açılan,
mobil öncelikli bir demo kafe sitesi ve sahte verili yönetim paneli.

> **Bu sürüm Harput Dibek markasına uyarlanmıştır.** Menü, fiyatlar ve ürün
> görselleri `menu.harputdibek.com` adresindeki güncel menüden alınmıştır;
> açıklama ve alerjen notları bu demo için yazılmıştır. Marka Harput Dibek'e
> aittir, site onlarla ilişkili değildir — yalnızca yetenek gösterimidir.
>
> Önceki nötr sürüme (“Üçüncü Fincan”) dönmek için: `git log` ile ilk kaydı
> bulup `git checkout <kayıt> -- ucuncu-fincan` çalıştır.

Üç adres barındırır:

| Adres | İçerik |
|---|---|
| `/` | Müşteri sitesi — hero, sinematik paneller, menü, hakkımızda, iletişim |
| `/admin` | Sahte girişli yönetim paneli (ürün, kategori, saat, iletişim) |
| `/qr` | A6 boyutunda yazdırılabilir masa kartı |

### Bu sürümde ne var

| Özellik | Durum |
|---|---|
| Menü | **152 ürün**, 4 kategori, 17 alt başlık — gerçek menüden |
| Ürün görselleri | 152 adet, markanın kendi fotoğrafları |
| Tema | Açık + **koyu mod**, cihaz tercihine uyar, düğmeyle değişir |
| Animasyon | Açılışta dökülen kahve perdesi, kaydırınca dolan fincan, panel dalgası |
| Bölümler | Hero, 3 hikâye paneli, menü, hakkımızda, **tarihçe**, **sosyal medya**, iletişim |

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

**Canlı adres: https://omernarcicegi.github.io/harput-dibek-demo/**

Statik bir sitedir; sunucu ve veritabanı gerekmez.

### Güncelleme (GitHub Pages)

```bash
npm run deploy      # derler ve gh-pages dalına gönderir
```

`npm run deploy` şunları yapar: alt dizin tabanıyla derler
(`--base=/harput-dibek-demo/`), SPA geri dönüşü için `404.html` üretir ve
`dist/` klasörünü `gh-pages` dalına gönderir. Pages o dalı sunar.

> GitHub Pages HTML'i ~10 dakika önbelleğe alır. Yayından hemen sonra
> değişikliği görmüyorsan sert yenile (Cmd+Shift+R) ya da adrese `?v=1` ekle.

Her `git push` sonrası otomatik yayın istersen `docs/OTOMATIK-YAYIN.md`.

### Başka bir yere taşımak

Site kökte de alt dizinde de çalışır — görsel yolları `src/lib/asset.ts`
üzerinden taban yola göre çözülür, router da taban yolu tanır.

**Vercel:** `npm i -g vercel && vercel --prod`. `vercel.json` içindeki rewrite
sayesinde `/admin` ve `/qr` doğrudan açılır. Kökte sunulduğu için
`npm run build` (base `/`) yeterli.

**Netlify:** `public/_redirects` aynı yönlendirmeyi sağlar. Derleme komutu
`npm run build`, yayın klasörü `dist`.

### Yayından sonra

`src/config/brand.ts` içindeki `siteUrl` alanını yayınlanan adrese güncelle —
`/qr` sayfasındaki QR kod bu adresi kodlar.

---

## Koyu Mod

Site üç durumu destekler:

| Durum | Nasıl olur |
|---|---|
| **Sistem** (varsayılan) | Cihazın `prefers-color-scheme` ayarına uyar |
| **Açık** | Kullanıcı düğmeye basıp açığı seçer |
| **Koyu** | Kullanıcı düğmeye basıp koyuyu seçer |

Seçim `localStorage`'da (`cafe.theme`) saklanır ve sistem ayarını ezer.
Tercih **React yüklenmeden**, `index.html`'e gömülü küçük bir betikle
uygulanır — aksi hâlde açılışta bir an yanlış tema görünürdü.

Tema düğmesi alt gezinme çubuğunun sağ ucundadır. Renkler `brand.ts`
içindeki `colors.light` / `colors.dark` paletlerinden gelir.

---

## Animasyonlar

Tümü yalnızca `transform` ve `opacity` kullanır; `prefers-reduced-motion`
açıkken kapanır.

| Animasyon | Nerede |
|---|---|
| **Dökülen kahve perdesi** | Açılışta: koyu zemine altın akıntı iner → ekranı basar → perde kalkar (1120 ms) |
| Kahve dolan fincan | Sayfanın üstünde, kaydırma ilerlemesini gösterir |
| Kahve dalgası | Hikâye panelleri görünüme girdiğinde alttan yükselir |
| Sıralı belirme | Kart gruplarında 70 ms aralıkla |
| Yapışkan yığılma | Hikâye panelleri üst üste kayar |

> Kaydırma göstergesi hareket azaltma açıkken de dolum oranını gösterir —
> çünkü o bir animasyon değil, **bilgidir**. Yalnızca yumuşatma kapanır.

---

## Markayı Değiştirme

**Tüm marka bilgisi tek dosyadadır: `src/config/brand.ts`.**
Bileşenlerin içinde gömülü hiçbir marka metni yoktur; bu kural bir testle
korunur (`src/config/brand.test.tsx`).

### En hızlı yol (30 saniye)

`src/config/brand.ts` dosyasında tek satır:

```ts
name: 'Harput Dibek',     // ← burayı değiştir
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
| `colors` | **İki paletli** renk şeması: `colors.light` ve `colors.dark` |
| `gold` | Logo sarısı — iki temada da dolgu olarak kullanılır |
| `logo` | Logo dosyaları |
| `history` | Tarihçe: kilometre taşları ve sayılar |
| `social` | Sosyal medya hesapları |
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

**Ancak kontrastı bozma.** Her iki palet de WCAG AA (4.5:1) sağlayacak şekilde
seçildi; Lighthouse erişilebilirlik skoru 100 ve iki temada da sayfa genelinde
düşük kontrastlı metin yok.

İki tuzağa dikkat:

1. `accent` hem **üzerine metin gelen dolgu** hem de **zemin üstünde metin**
   olarak kullanılıyor. Bu yüzden açık temada aksan koyu bronz (`#8A5A0B`),
   koyu temada logo sarısı (`#FCCC30`). Açık temada sarıyı metin rengi
   yaparsan okunmaz olur.
2. `gold` (logo sarısı) **her zaman** koyu metinle (`gold.on`) eşleşir.

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
  logo.webp / logo-sm.webp         marka logosu
  hero.webp            1080×1440   açılış görseli
  panel-1..3.webp      1080×1440   hikâye panelleri
  gallery-1..4.webp    800×800     hakkımızda galerisi
  menu/*.webp          480×480     152 ürün görseli (kare)
```

Yeni görsel koyarken **aynı en-boy oranını ve dosya adını koru** — böylece kod
değişikliği gerekmez ve sayfa kayması (layout shift) oluşmaz. Farklı bir boyut
kullanacaksan ilgili bileşendeki `width`/`height` değerlerini de güncelle.

WebP'ye çevirmek için:

```bash
brew install webp
cwebp -q 74 kaynak.jpg -o public/images/menu/urun.webp
```

**Görsel kaynakları:**

- **Ürün görselleri (152 adet) ve logo:** Harput Dibek'in kendi görselleri
  (`menu.harputdibek.com`). Bu demo dışında kullanılmamalıdır.
- **Hero ve hikâye panelleri (çekirdek, kakule):** [Openverse](https://openverse.org)
  üzerinden bulunan **CC0 / kamu malı** fotoğraflar; atıf zorunluluğu yoktur.
  Künye `GORSEL-KAYNAKLARI.json` dosyasındadır.
- **`panel-3.webp`:** markanın ürün fotoğrafı koyu zemine kompoze edilerek
  üretildi (kaynak fotoğraf tam ekran panel için yeterince büyük değildi).

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
│   ├── themeStore.ts              açık / koyu / sistem tercihi
│   └── hooks.ts                   useSyncExternalStore bağlantısı
├── components/                    Intro, BottomSheet, BottomNav,
│                                  ScrollCup, ThemeToggle
├── sections/                      Hero, StoryPanels, Menu, About,
│                                  History, Social, Contact
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

## Doğrulama (geliştirici)

Değişiklikten sonra siteyi **gerçek mobil genişlikte** kontrol et:

```bash
# 1) Chrome'u hata ayıklama portuyla başlat
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox --remote-debugging-port=9222 \
  --user-data-dir=/tmp/cdp-profile about:blank &

# 2) Siteyi sun ve doğrula
npm run preview &
node scripts/verify.mjs                 # yerel
node scripts/verify.mjs https://omernarcicegi.github.io/harput-dibek-demo/
```

Yatay taşma, 44 px dokunma hedefleri, ekranda gizli kalan içerik ve
yüklenmeyen görselleri kontrol eder.

> `chrome --headless --window-size=375,812 --screenshot` **kullanma** —
> düzeni ~512 px'e göre hesaplayıp görüntüyü kırpıyor, yanıltıcı sonuç
> veriyor. Sayfayı iframe'e gömmek de olmaz: headless'ta iframe içinde
> IntersectionObserver hiç tetiklenmiyor.

---

## Ölçümler

Üretim derlemesi üzerinde ölçüldü (`npm run build` + `npm run preview`,
Lighthouse 12, mobil profil):

| Ölçüm | Değer |
|---|---|
| Lighthouse mobil — Performance | **94** (canlı sitede ölçüldü) |
| Lighthouse mobil — Accessibility | **100** |
| Lighthouse mobil — Best Practices / SEO | **100 / 100** |
| Cumulative Layout Shift | 0 |
| Total Blocking Time | 0 ms |
| Düşük kontrastlı metin (iki temada, 8 konumda) | **0** |
| Müşteri sayfası JS (gzip) | 79,6 KB |
| CSS (gzip) | 7,1 KB |
| `/admin` parçası (gzip) | 4,9 KB |
| `/qr` parçası (gzip) | 9,4 KB |
| **Toplam JS (gzip, üç sayfa)** | **93,9 KB** — sınır 150 KB |
| Görseller | 3,2 MB (162 dosya, hepsi lazy) |
| Yazı tipleri | 132 KB (8 dosya) |
| Testler | 71 test / 7 dosya (~1,7 sn) |

Yeniden ölçmek için:

```bash
npm run build && npm run preview &
npx lighthouse http://localhost:4173/ \
  --only-categories=performance,accessibility \
  --chrome-flags="--headless --no-sandbox"
```

---

## Varsayımlar

Bu sürüme özel kararlar:

1. **Menünün tamamı alındı** — `menu.harputdibek.com` adresindeki 4 kategori,
   17 alt başlık ve 152 ürün. Ürün adları, fiyatları ve görselleri kaynaktan;
   **açıklama ve içerik/alerjen notları bu demo için yazıldı**.
2. **Paket ürünlerin fiyatı "Mağazada" gösteriliyor.** Kaynak menüde bu
   ürünlerin fiyatı `₺ 0,00` olarak duruyor, yani raf fiyatı yayınlanmamış.
3. **Renkler logodan örneklendi**: altın `#FCCC30`, koyu kahve `#6C3018`.
   Açık temada altın metin olarak okunmadığı için aksan bronza (`#8A5A0B`)
   çevrildi; logo sarısı iki temada da dolgu olarak korunuyor.
4. **Tarihçe ve sosyal medya bilgileri** `harputdibek.com` kurumsal
   sayfalarından alındı (2012 kuruluş, 2019 ilk coffee shop, 30+ şube).
5. **İletişim bilgisi genel merkez** (Elazığ) olarak alındı; şubeye özel
   demo yapılacaksa `brand.defaultContact` güncellenmeli.
6. **Çalışma saatleri varsayıldı** (08:00–23:00, hafta sonu 24:00'e kadar) —
   kaynakta şube saatleri yayınlanmıyor.
7. **Alt grup başlıkları kategori içinde gösteriliyor**, ayrı sekme
   yapılmadı: 17 sekme mobilde kullanılamaz olurdu.
8. **Ürün kartları kare**, çünkü markanın fotoğrafları kare (512×512).
9. **Sıralama sürükle-bırak ile değil, yukarı/aşağı düğmeleriyle** yapılır —
   mobilde daha güvenilir ve klavyeyle erişilebilir.
10. **Görsel yükleme yoktur.** Admin, projeye gömülü görseller arasından seçer.
11. **`react-router` kullanılmadı.** Üç rota var ve hiçbiri parametre almıyor;
    `src/lib/router.tsx` içindeki ~50 satır yeterli. Ayrıca kurulumda
    `npm audit` react-router'da yüksek önemde bir açık (RSC modu CSRF bypass)
    bildirdi; paketi çıkarmak bağımlılık ağacını temizledi.
12. **Animasyon kütüphanesi kullanılmadı.** CSS geçişleri ve
    `IntersectionObserver` yeterli oldu.
13. **Başlık satır yüksekliği 1.12 + `padding-block`.** Daha sıkı değerlerde
    Türkçe büyük harflerdeki Ü/İ/Ç aksanları komşu satırlara biniyordu —
    masaüstünde 128 px'lik başlıkta bariz bir hataydı.
14. **Test zaman aşımı 15 sn** (`vite.config.ts`). Varsayılan 5 sn, yüklü bir
    makinede kararsızlığa yol açıyordu; `userEvent` tuş gecikmesi de kaldırıldı.

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
