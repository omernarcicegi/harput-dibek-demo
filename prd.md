# PRD — Demo Kafe Websitesi ve Sahte Verili Admin Paneli

## Problem

Kafelere website satmaya çalışıyorum ama elimde gösterecek somut bir şey yok. Görüşmede "size şöyle bir site yapabilirim" deyip anlatmaya çalışmak ikna etmiyor; kafe sahibi ekranda dokunabileceği bir şey görmek istiyor. Portföy olarak başka müşterilerin sitelerini göstermek de mümkün değil, çünkü henüz müşterim yok.

İki ayrı şeyi aynı anda satmam gerekiyor:

1. **Müşterilerinin göreceği site.** Kafeye gelen kişi masadaki QR kodu okutacak ve telefonunda menüyü açacak. Yani site telefonda kusursuz görünmeli — yavaş açılan, yatay kayan, yazıları küçük bir site satışı bitirir. Sunum yaptığım an kafe sahibinin telefonunu alıp QR'ı okutabilmeliyim.
2. **Kafe sahibinin kendisinin kullanacağı panel.** Sorulacak ilk soru belli: "fiyat değişince ne olacak, her seferinde sana mı geleceğim?" Buna "hayır, telefonundan kendin değiştirirsin" diye cevap verip anında göstermem gerekiyor.

Ayrıca her görüşme farklı bir kafeyle. Aynı demoyu "Kahve Dünyası" adıyla bir kafeye, ertesi gün başka bir adla başka kafeye göstermek istiyorum. Marka bilgisini değiştirmek dakikalar sürmeli, dosyaların içinde tek tek isim aramak değil.

Referans olarak üç video paylaştım; özellikle bir berber dükkanı için yapılmış olan (Dapper Dave's Barber Lounge) tam olarak istediğim seviyede: tam ekran sinematik fotoğraflar, dev tipografi, akıcı geçişler. Benim kafe demom da o kalitede görünmeli — çünkü satın alınan şey aslında o "vay" hissi.

## Çözüm

Statik olarak yayınlanan, sunucusuz ve veritabansız tek bir React uygulaması kuruyoruz. Üç adres barındırıyor:

- `/` — QR'dan gelen müşterinin göreceği kafe sitesi
- `/admin` — kafe sahibine gösterilecek, sahte girişli yönetim paneli
- `/qr` — masaya konacak A6 kartın yazdırılabilir hâli

**Görsel dil.** Referans videodaki berber sitesinin yapısını alıp sıcak açık tonlu bir palete uyarlıyoruz: krem zemin, koyu kahve metin, terrakota aksan. Yapı korunuyor — tam ekran hero fotoğrafı üzerinde dev sıkıştırılmış büyük harf başlık, ardından çapraz geçişle akan tam ekran hikâye panelleri, sonra normal kaydırmayla menü, hakkımızda ve iletişim. Fotoğraf üzerindeki metinlerin okunabilirliği açık tonlu degrade maskelerle sağlanıyor.

**Anında güncellenen menü.** Admin paneli ve müşteri sitesi aynı state deposunu paylaşıyor. Kafe sahibi fiyatı değiştirdiği anda menüde görünüyor; veriler tarayıcının `localStorage`'ında tutulduğu için sayfa yenilendiğinde de duruyor. Tek tuşla başlangıç menüsüne dönülüyor, yani her görüşmeye temiz başlanıyor.

**Dakikalar içinde markalama.** Kafe adı, slogan, renkler, yazı tipleri, iletişim bilgileri ve hikâye paneli metinleri tek bir yapılandırma dosyasında. Bileşenlerin içinde tek bir marka metni bulunmuyor; adı değiştirmek o dosyada tek satır.

**Çevrimdışı çalışır.** Fotoğraflar ve QR üretimi projeye gömülü. Kafenin wifi'ı yoksa veya mobil veri çekmiyorsa demo yine açılıyor.

## Kullanıcı Hikayeleri

### QR kodu okutan kafe müşterisi

1. Bir kafe müşterisi olarak, masadaki QR kodu okuttuğumda sitenin bir saniye içinde açılmasını istiyorum, böylece uygulama indirmeden menüye ulaşabilirim.
2. Bir kafe müşterisi olarak, site açılırken kafe adının kısa bir animasyonla belirmesini istiyorum, böylece doğru yerde olduğumu anlarım ve mekân bana özenli görünür.
3. Bir kafe müşterisi olarak, açılışta tam ekran bir kafe fotoğrafı ve tek bir "Menüyü Gör" düğmesi görmek istiyorum, böylece ne yapacağımı düşünmeden menüye geçebilirim.
4. Bir kafe müşterisi olarak, menüyü dört kategoriye ayrılmış görmek istiyorum, böylece sıcak içecek mi tatlı mı arıyorsam doğrudan oraya gidebilirim.
5. Bir kafe müşterisi olarak, kategoriler arasında geçerken sayfanın yenilenmemesini istiyorum, böylece beklemeden karşılaştırma yapabilirim.
6. Bir kafe müşterisi olarak, her üründe görsel, ad, tek cümlelik açıklama ve fiyat görmek istiyorum, böylece garsonu çağırmadan karar verebilirim.
7. Bir kafe müşterisi olarak, "yeni", "çok satan" veya "vegan" etiketlerini görmek istiyorum, böylece ne denemem gerektiğine hızlı karar veririm.
8. Bir kafe müşterisi olarak, bir ürüne dokununca alttan açılan bir panelde büyük görselini ve detayını görmek istiyorum, böylece sipariş etmeden önce ne olduğunu anlarım.
9. Alerjisi olan bir kafe müşterisi olarak, ürün detayında içerik ve alerjen notunu görmek istiyorum, böylece güvenle sipariş verebilirim.
10. Bir kafe müşterisi olarak, açılan paneli aşağı sürükleyerek kapatabilmek istiyorum, böylece telefonu tek elle kullanırken kapatma düğmesine uzanmak zorunda kalmam.
11. Bir kafe müşterisi olarak, tükenen ürünlerin açıkça "tükendi" olarak işaretlenmesini istiyorum, böylece olmayan bir şeyi istemenin hayal kırıklığını yaşamam.
12. Bir kafe müşterisi olarak, ekranın altında sabit duran bir gezinme çubuğu istiyorum, böylece telefonu tek elle tutarken başparmağımla bölümler arasında geçebilirim.
13. Bir kafe müşterisi olarak, kafenin kısa hikâyesini ve birkaç fotoğrafını görmek istiyorum, böylece mekân hakkında fikir sahibi olurum.
14. Bir kafe müşterisi olarak, telefon numarasına dokununca aramanın başlamasını istiyorum, böylece numarayı elle kopyalamam gerekmez.
15. Bir kafe müşterisi olarak, adrese dokununca harita uygulamamın açılmasını istiyorum, böylece yol tarifini tek dokunuşla alırım.
16. Bir kafe müşterisi olarak, çalışma saatlerini ve bugün açık olup olmadığını görmek istiyorum, böylece boşuna yola çıkmam.
17. Bir kafe müşterisi olarak, Instagram hesabına tek dokunuşla gitmek istiyorum, böylece mekânı takip edebilirim.
18. Hareket hassasiyeti olan bir kafe müşterisi olarak, telefonumdaki "hareketi azalt" ayarına sitenin uymasını istiyorum, böylece animasyonlardan rahatsız olmam.
19. Bir kafe müşterisi olarak, sayfayı kaydırırken yazıların ve görsellerin yerinden zıplamamasını istiyorum, böylece okumaya çalıştığım şey elimden kaçmaz.
20. Küçük ekranlı telefon kullanan bir kafe müşterisi olarak, hiçbir sayfada yana kaydırma olmamasını istiyorum, böylece içeriğin bir kısmını kaçırmam.

### Kafe sahibi (admin paneli kullanıcısı)

21. Bir kafe sahibi olarak, `/admin` adresinde bir giriş ekranı görmek istiyorum, böylece panelin korunduğunu hissederim.
22. Bir kafe sahibi olarak, demo giriş bilgilerinin ekranda yazılı olmasını istiyorum, böylece sunum sırasında şifre hatırlamakla uğraşmayız.
23. Bir kafe sahibi olarak, bir ürünün fiyatını değiştirdiğimde menüde anında görmek istiyorum, böylece değişikliğin işe yaradığına orada ikna olurum.
24. Bir kafe sahibi olarak, yeni ürün ekleyebilmek istiyorum, böylece sezonluk bir içeceği kendim menüye koyarım.
25. Bir kafe sahibi olarak, ürünün adını, açıklamasını, görselini, etiketini ve alerjen notunu düzenleyebilmek istiyorum, böylece menüyü güncel tutarım.
26. Bir kafe sahibi olarak, ürünü silebilmek istiyorum, böylece artık yapmadığımız şeyler menüde kalmaz.
27. Bir kafe sahibi olarak, bir ürünü "tükendi" işaretleyebilmek istiyorum, böylece silmeden geçici olarak kapatırım ve yarın tek dokunuşla geri açarım.
28. Bir kafe sahibi olarak, kategori ekleyip düzenleyip silebilmek istiyorum, böylece menümün yapısını kendi işime uydururum.
29. Bir kafe sahibi olarak, ürünlerin ve kategorilerin sırasını değiştirebilmek istiyorum, böylece öne çıkarmak istediğim şeyi üste alırım.
30. Bir kafe sahibi olarak, içi dolu bir kategoriyi silmeye çalıştığımda uyarılmak istiyorum, böylece yanlışlıkla on ürünü birden kaybetmem.
31. Bir kafe sahibi olarak, çalışma saatlerimi düzenleyebilmek istiyorum, böylece bayram tatilini kendim güncellerim.
32. Bir kafe sahibi olarak, bir günü "kapalı" işaretleyebilmek istiyorum, böylece pazar günü kapalıysak müşteri boşuna gelmez.
33. Bir kafe sahibi olarak, adres, telefon ve Instagram bilgimi düzenleyebilmek istiyorum, böylece taşındığımızda siteyi kendim güncellerim.
34. Bir kafe sahibi olarak, yaptığım değişikliklerin sayfayı kapatıp açtığımda durmasını istiyorum, böylece emeğim boşa gitmez.
35. Bir kafe sahibi olarak, paneli telefonumdan kullanabilmek istiyorum, böylece tezgâhın arkasındayken bilgisayara gitmem gerekmez.
36. Bir kafe sahibi olarak, panelde dokunacağım düğmelerin parmağıma yetecek büyüklükte olmasını istiyorum, böylece yanlış tuşa basmam.

### Site satıcısı (ben)

37. Bir satıcı olarak, kafe adını tek dosyada tek satır değiştirerek tüm siteye yansıtmak istiyorum, böylece her görüşme öncesi demoyu o kafenin adına uyarlarım.
38. Bir satıcı olarak, renk paletini ve yazı tiplerini aynı dosyadan değiştirebilmek istiyorum, böylece kafenin tabelasına yakın bir görünüm yakalarım.
39. Bir satıcı olarak, "Demo verisini sıfırla" düğmesiyle başlangıç menüsünü tek tıkla geri getirmek istiyorum, böylece bir önceki görüşmede yapılan değişikliklerle karşılaşmam.
40. Bir satıcı olarak, `/qr` adresinde yazdırılabilir bir A6 masa kartı istiyorum, böylece kafeye somut bir örnek bırakabilirim.
41. Bir satıcı olarak, QR kodunun internet olmadan da üretilmesini istiyorum, böylece bağlantısı zayıf bir mekânda demo çökmesin.
42. Bir satıcı olarak, fotoğrafların projeye gömülü olmasını istiyorum, böylece kafenin wifi'ı olmasa bile site tam görünsün.
43. Bir satıcı olarak, siteyi Vercel'e tek komutla yayınlamak istiyorum, böylece kafe sahibinin kendi telefonundan girip deneyebilmesini sağlarım.
44. Bir satıcı olarak, kafe sahibi kendi telefonundan girdiğinde `/admin` ve `/qr` adreslerinin doğrudan çalışmasını istiyorum, böylece "linki bulamadım" durumu yaşanmaz.
45. Bir satıcı olarak, README'de markayı değiştirme adımlarının yazılı olmasını istiyorum, böylece aylar sonra döndüğümde hatırlamak zorunda kalmam.
46. Bir satıcı olarak, fotoğrafların kaynaklarının ve nasıl değiştirileceğinin yazılı olmasını istiyorum, böylece gerçek müşteriye geçerken kendi fotoğraflarını koyabilirim.

## Uygulama Kararları

### Teknoloji yığını

**Vite + React 19 + TypeScript + Tailwind CSS.** Gerekçe: hem müşteri menüsü (kategori geçişi, bottom sheet) hem admin paneli (CRUD, sıralama) uygulama gibi davranan reaktif arayüzler ve ikisinin *aynı* veriyi anlık paylaşması gerekiyor; React'in tek state ağacı bunu ek kod yazmadan çözüyor. Vite statik çıktı üretiyor, sunucu gerekmiyor. Tahmini bundle react+react-dom+router+qrcode ≈ 65 KB gzip — 150 KB sınırının çok altında. TypeScript `strict: true`, `any` kullanılmıyor.

Bağımlılıklar sınırlı tutulur: `react`, `react-dom`, `react-router-dom`, `qrcode` (QR üretimi), `tailwindcss`. Animasyon kütüphanesi **kullanılmıyor** — gereksinimlerin tamamı CSS `transform`/`opacity` geçişleri ve `IntersectionObserver` ile karşılanıyor, dolayısıyla ek bundle maliyeti sıfır.

### Rotalar

| Adres | İçerik |
|---|---|
| `/` | Müşteri sitesi (tek sayfa, bölümler) |
| `/admin` | Sahte giriş + yönetim paneli |
| `/qr` | A6 yazdırılabilir masa kartı |

Gerçek yol (hash değil) kullanılıyor. Statik hostingde derin bağlantıların çalışması için `vercel.json` içine SPA rewrite kuralı, Netlify için `public/_redirects` dosyası ekleniyor.

### Modüller

**1. Marka yapılandırması (derin modül).** Kafe adı, slogan, renk paleti, yazı tipleri, hero ve hikâye paneli metinleri, varsayılan iletişim/saat bilgileri ve site URL'i tek bir yapılandırma dosyasında toplanıyor. Dışa dönük arayüzü tek bir salt-okunur nesne. Renkler bu dosyadan CSS değişkenlerine aktarılıyor; Tailwind bu değişkenler üzerinden okuyor, böylece renk değişikliği tek noktadan tüm siteye yayılıyor. **Hiçbir bileşende marka metni gömülü değil** — bu kural testle korunuyor.

Yer tutucu kafe adı: **"Üçüncü Fincan"**. Gerçek bir işletmeyle karışma ihtimali düşük, jenerik değil, "üçüncü dalga kahve" çağrışımı var.

**2. Kalıcı state deposu (derin modül).** Bu, projenin en derin modülü: `localStorage` okuma/yazma, JSON ayrıştırma, şema sürümü kontrolü, bozuk veya elle kurcalanmış veriden kurtarma, başlangıç verisine dönüş ve React'e abonelik mantığının tamamını içeriyor. Dışa dönük arayüzü küçük ve kararlı: mevcut veriyi okuma, bir güncelleyici fonksiyonla yazma, sıfırlama. Bileşenler `localStorage`'ı hiç doğrudan görmüyor.

Kritik davranış: **okuma başarısız olursa uygulama çökmüyor**, başlangıç verisine düşüyor. Kaydedilmiş verinin şema sürümü beklenenden farklıysa yine başlangıç verisine dönülüyor — demo aracında karmaşık göç mantığı taşımaya değmez.

React bağlantısı `useSyncExternalStore` ile kuruluyor; aynı sekmede admin değişikliği müşteri menüsüne anında yansıyor. Ayrı sekmeler arası senkronizasyon için `storage` olayı da dinleniyor (kafe sahibi paneli ikinci sekmede açtığında da çalışsın diye).

İki ayrı depo var:
- `cafe.menu.v1` — kategoriler ve ürünler
- `cafe.siteinfo.v1` — çalışma saatleri ve iletişim bilgileri

**3. Hareket ilkelleri (derin modül).** `IntersectionObserver` kurulumu, tek seferlik tetikleme, gecikmeli sıralı belirme (stagger) ve `prefers-reduced-motion` denetimi bu modülde toplanıyor. Bileşenler sadece bir sarmalayıcı kullanıyor; observer mantığını görmüyorlar. Hareket azaltma tercihi açıksa observer hiç kurulmuyor ve içerik anında görünür durumda render ediliyor — sadece animasyonu gizlemek değil, hiç başlatmamak.

**4. Bottom sheet (derin modül).** Açılma/kapanma, parmakla aşağı sürükleyerek kapatma eşiği, sürükleme sırasında `transform` takibi, `Esc` ile kapanma, arka planın kaydırılmasının kilitlenmesi ve odak yönetimi tek bileşende. Dışa dönük arayüzü: açık mı, ne gösteriliyor, kapanınca ne olacak.

**5. Müşteri bölümleri.** Hero, hikâye panelleri, menü (kategori sekmeleri + ürün kartları), hakkımızda + galeri, iletişim, alt sabit gezinme çubuğu, açılış animasyonu.

**6. Admin.** Sahte giriş kapısı, ürün editörü, kategori editörü, sıralama denetimi, saat editörü, iletişim editörü, demo sıfırlama.

**7. QR sayfası.** `qrcode` kütüphanesiyle canvas üzerine üretim + A6 baskı stilleri.

### Veri modeli

```
MenuState
  schemaVersion: number
  categories: Category[]
  items: MenuItem[]

Category
  id: string            // kararlı, üretilmiş
  name: string          // "Sıcak İçecekler"
  order: number

MenuItem
  id: string
  categoryId: string
  name: string
  description: string   // tek cümle
  price: number         // kuruş değil, TL cinsinden sayı
  imageUrl: string      // projeye gömülü görsel yolu
  badge: 'yeni' | 'cok-satan' | 'vegan' | null
  allergenNote: string  // bottom sheet'te gösterilir
  soldOut: boolean
  order: number

SiteInfoState
  schemaVersion: number
  hours: DayHours[]     // 7 kayıt, pazartesiden pazara
  contact: ContactInfo

DayHours
  day: 'pazartesi' | ... | 'pazar'
  closed: boolean
  openTime: string      // "08:00"
  closeTime: string     // "22:00"

ContactInfo
  address: string
  phone: string         // tel: bağlantısı için ham hâli ayrıca tutulur
  mapsUrl: string
  instagramUrl: string
```

Sıralama `order` alanı üzerinden yürüyor; yukarı/aşağı düğmeleri komşu iki kaydın `order` değerini takas ediyor. Sürükle-bırak kullanılmıyor — mobilde sürükle-bırak hem erişilebilirlik hem dokunma güvenilirliği açısından zayıf, yukarı/aşağı düğmeleri 44×44 px hedefiyle daha sağlam.

Fiyat `number` olarak tutuluyor, gösterimde Türkçe biçimlendiriliyor. Admin girişinde negatif ve sayı olmayan değerler reddediliyor.

### Başlangıç (seed) verisi

Dört kategori: Sıcak İçecekler, Soğuk İçecekler, Tatlılar, Atıştırmalıklar. Kategori başına 5–6 ürün, toplam ~22 ürün. Etiketler dağıtılmış hâlde, en az bir ürün "tükendi" durumunda (kafe sahibine o özelliği göstermek için).

### Sahte kimlik doğrulama

Kullanıcı adı ve şifre yapılandırma dosyasında düz metin. Giriş ekranında ipucu olarak gösteriliyor. Oturum `sessionStorage`'da bir bayrakla tutuluyor. **Bu gerçek bir güvenlik mekanizması değil ve öyle sunulmuyor**; kodda ve README'de bunun bir demo olduğu açıkça yazılıyor. Panelin üstünde kalıcı bir "DEMO" rozeti duruyor.

### Animasyon kararları

| Gereksinim | Karar |
|---|---|
| Açılış animasyonu | Kafe adı `opacity` + `translateY` ile belirir, toplam 1000 ms, ardından hero'ya geçer. `sessionStorage` bayrağıyla aynı oturumda tekrarlanmaz. |
| Kaydırma animasyonu | `IntersectionObserver`, eşik %15, `translateY(20px) → 0` ve `opacity 0 → 1`, 400 ms. Her öğe için bir kez; tetiklendikten sonra gözlem bırakılır. |
| Stagger | Grup içindeki öğelere 70 ms artan `transition-delay`. En fazla 8 öğe gecikir, sonrası aynı gecikmede kalır — uzun listede son ürünün 2 saniye beklemesini önler. |
| Bölüm geçişi | 300 ms `opacity` + hafif `translateY`. Hikâye panelleri çapraz geçişle (referans videodaki gibi) katman hâlinde. |
| Dokunma tepkisi | `:active` durumunda `scale(0.97)` + gölge artışı, 120 ms; bırakınca yaylanan `cubic-bezier` ile dönüş. |
| Kısıt | Yalnızca `transform` ve `opacity`. `width`/`height`/`top`/`left` animasyonu yok. Animasyonlu katmanlara `will-change` ölçülü uygulanır. |
| Hareket azaltma | `prefers-reduced-motion: reduce` etkinken açılış animasyonu atlanır, observer kurulmaz, tüm geçişler kapatılır, içerik anında görünür. |

Hikâye panellerinde `scroll-snap-type: y mandatory` kullanılıyor; menüden itibaren snap kapatılıyor (uzun liste içinde snap kullanımı bozar).

### Görseller

Unsplash/Pexels'ten seçilen telifsiz fotoğraflar indirilip WebP'ye çevrilerek `public/images/` altına gömülüyor. Boyut hedefleri: hero ve panel görselleri 1600 px genişlik, menü ürün görselleri 600 px, galeri 800 px. Hepsi `loading="lazy"` (hero hariç — o `fetchpriority="high"` ile öncelikli), hepsinde sabit `width`/`height` veya `aspect-ratio` var, böylece kaydırma sırasında layout shift oluşmuyor. Kaynak listesi ve değiştirme adımları README'ye yazılıyor.

### Mobil ve erişilebilirlik

375 px temel alınarak tasarlanıyor, ardından 768 px ve 1280 px kırılımları ekleniyor. Tüm dokunulabilir hedefler en az 44×44 px. Alt gezinme çubuğu `env(safe-area-inset-bottom)` ile iPhone çentik alanına saygı duyuyor. Kategori sekmeleri yatay kaydırmalı ama sayfa gövdesi asla yatay kaymıyor (`overflow-x: hidden` gövdede + taşan öğeler kendi kapsayıcısında kaydırılıyor).

Erişilebilirlik: her görselde anlamlı `alt`, bottom sheet'te `role="dialog"` + odak tuzağı + `Esc`, kategori sekmelerinde klavye ile gezinme, tüm etkileşimli öğeler gerçek `button`/`a` etiketleri, kontrast oranı AA seviyesinde (açık palette terrakota aksanın krem üzerindeki kontrastı doğrulanacak).

### Yayına alma

Vercel hedefleniyor, `vercel.json` içinde SPA rewrite. QR sayfası yapılandırmadaki site URL'ini kodluyor. Netlify için `_redirects` de bulunuyor.

## Test Kararları

**İyi testin tanımı.** Testler yalnızca dışa dönük davranışı doğrular: modülün arayüzüne veri verilir, çıkan sonuca bakılır. İç uygulama ayrıntıları (bir fonksiyonun kaç kez çağrıldığı, state'in iç şekli, sınıf adları) test edilmez — bunlar değişince testin kırılması yanlış alarmdır. Bileşen testleri kullanıcının yaptığı işi taklit eder: "şu yazıyı bul, ona tıkla, şu sonucu gör".

**Araç.** Vitest + React Testing Library + jsdom. `localStorage` her testten önce temizlenir.

**Test edilecek modüller** (dördü de onaylandı):

**1. Kalıcı state deposu — en kapsamlı test edilen modül.**
- Yeni ürün eklenir, listede görünür
- Fiyat güncellenir, okunan değer değişmiştir
- Ürün silinir, listeden çıkar
- Ürün "tükendi" işaretlenir ve geri alınır
- Sıralama değiştirilir, öğelerin sırası beklendiği gibi olur
- Kategori silindiğinde altındaki ürünlerin ne olduğu tanımlı davranışa uyar
- Yazılan veri `localStorage`'a gider ve yeni bir depo örneği onu okur (yenileme senaryosu)
- Bozuk JSON kaydedildiğinde uygulama çökmez, başlangıç verisine döner
- Şema sürümü uyuşmadığında başlangıç verisine döner
- Sıfırlama çağrıldığında başlangıç menüsü birebir geri gelir
- Saat ve iletişim bilgisi güncellemeleri kalıcıdır

**2. Hareket yardımcıları.**
- `prefers-reduced-motion: reduce` etkinken içerik ilk render'da görünür durumdadır ve `IntersectionObserver` hiç kurulmaz
- Tercih kapalıyken öğe görünüm alanına girene kadar gizli, girdikten sonra görünürdür
- Bir öğe için görünürlük bir kez tetiklenir; öğe görünümden çıkıp tekrar girdiğinde animasyon yeniden başlamaz
- Stagger gecikmeleri sırayla artar ve üst sınırda durur

**3. Bottom sheet.**
- Ürüne tıklanınca açılır ve ürünün adı, fiyatı, alerjen notu görünür
- Kapatma düğmesiyle kapanır
- `Esc` ile kapanır
- Eşiği aşan aşağı sürükleme kapatır; eşiğin altında kalan sürükleme kapatmaz, panel yerine döner
- Açıkken odak panel içinde kalır, kapanınca odak tetikleyen karta döner

**4. Marka config bütünlüğü** (bekçi testi).
- Yapılandırmadaki kafe adı değiştirildiğinde hero, açılış animasyonu ve sayfa başlığı yeni adı gösterir
- Bileşen kaynak dosyalarında yer tutucu kafe adı geçmez — yani hiçbir marka metni gömülü değildir

**Entegrasyon testi (kabul kriterlerinin kanıtı).**
- Admin panelinden fiyat değiştirilir → müşteri menüsünde yeni fiyat görünür → sayfa yeniden monte edilir → fiyat hâlâ yenidir
- "Demo verisini sıfırla" tıklanır → menü başlangıç hâline döner

**Manuel doğrulama** (otomatik testin kapsamadıkları, README'ye yazılır): gerçek iOS Safari ve Android Chrome'da açılış, Lighthouse mobil ölçümü, A6 kart baskı önizlemesi, 375 px'te yatay kaydırma denetimi.

## Kabul Kriterleri

Aşağıdakilerin **tamamı** sağlanmadan iş "tamamlandı" sayılmaz. Her madde kanıtla kapatılır (komut çıktısı, ölçüm sonucu veya ekran görüntüsü).

### Derleme ve testler
1. `npm run build` hatasız tamamlanır; TypeScript hatası ve uyarısı yoktur.
2. `npx tsc --noEmit` temiz geçer (`strict: true` açıkken).
3. `npm test` çalışır ve **tüm testler geçer**; yukarıdaki dört modülün her biri için test bulunur.
4. Üretim bundle'ı gzip hâlde **150 KB'ın altındadır**; ölçülen değer README'ye yazılır.

### Müşteri sitesi
5. 375 px genişlikte `/`, `/admin` ve `/qr` sayfalarının hiçbirinde yatay kaydırma oluşmaz (`document.documentElement.scrollWidth <= clientWidth`).
6. Menüde en az 4 kategori vardır ve kategori değişimi sayfa yenilemeden gerçekleşir.
7. Her üründe görsel, ad, açıklama ve fiyat görünür; en az bir üründe her etiket türü (yeni / çok satan / vegan) örneklenmiştir.
8. Ürün kartına dokununca bottom sheet açılır; büyük görsel, açıklama, alerjen notu ve fiyat gösterir; hem aşağı sürükleyerek hem kapatma düğmesiyle kapanır.
9. Hakkımızda bölümünde tanıtım metni ve **4 görsellik** galeri vardır.
10. İletişim bölümünde telefon numarasına dokunmak `tel:` bağlantısını, harita düğmesi harita uygulamasını, Instagram bağlantısı doğru profili açar.
11. Alt sabit gezinme çubuğu üç bölüme (Menü / Hakkımızda / İletişim) götürür ve tek elle erişilebilir konumdadır.
12. Tüm dokunulabilir öğeler en az 44×44 px'dir.

### Admin
13. `/admin` sahte giriş ekranı gösterir ve demo kullanıcı adı/şifresi ekranda ipucu olarak yazılıdır.
14. **Adminden fiyat değiştirildiğinde menüde anında güncellenir ve sayfa yenilendiğinde korunur.**
15. Admin ürün ve kategori ekleyebilir, düzenleyebilir, silebilir; ürünü "tükendi" işaretleyebilir; sıralamayı değiştirebilir.
16. Admin çalışma saatlerini ve iletişim bilgilerini düzenleyebilir; değişiklik müşteri sitesine yansır ve yenilemede korunur.
17. **"Demo verisini sıfırla" düğmesi başlangıç menüsünü tek tıkla geri getirir.**
18. Admin paneli 375 px genişlikte kullanılabilir; hiçbir form alanı veya düğme ekran dışına taşmaz.

### Animasyon
19. Açılış animasyonu **1,2 saniyeyi geçmez** ve `sessionStorage` sayesinde aynı oturumda tekrar oynamaz.
20. Bölümler görünüm alanına girdiğinde 16–24 px aşağıdan yukarı kayarak ve opaklık 0→1 giderek belirir; her öğe için yalnızca bir kez tetiklenir.
21. Kart gruplarında 60–80 ms aralıklı sıralı belirme vardır.
22. **`prefers-reduced-motion: reduce` etkinken hiçbir giriş veya geçiş animasyonu çalışmaz**, içerik anında görünür.
23. Kaynak kodda giriş/geçiş animasyonları için `width`, `height`, `top`, `left` özellikleri animasyonlanmaz — yalnızca `transform` ve `opacity` kullanılır.

### Performans ve QR
24. **Lighthouse mobil ölçümünde Performance ≥ 90 ve Accessibility ≥ 90** (üretim derlemesi üzerinde, `/` sayfası). Ölçüm çıktısı paylaşılır.
25. Görseller `loading="lazy"` ile geç yüklenir ve sabit en-boy oranıyla yerleştirilir; Cumulative Layout Shift 0,1'in altındadır.
26. `/qr` sayfası site adresini QR koda çevirir; QR **projeye dahil bir kütüphaneyle üretilir**, dış web servisi çağrılmaz ve internet bağlantısı olmadan çalışır.
27. `/qr` sayfası A6 (105 × 148 mm) boyutunda yazdırılabilir; baskı önizlemesinde kart tek sayfaya sığar ve arayüz öğeleri (düğmeler) baskıda görünmez.

### Marka ve dokümantasyon
28. **Kafe adı tek dosyada tek satır değiştirilerek tüm sitede güncellenir** — hero, açılış animasyonu, sayfa başlığı, alt bilgi ve QR kartı dahil.
29. Renk paleti, yazı tipleri, iletişim bilgileri, çalışma saatleri ve sosyal medya bağlantıları aynı yapılandırma dosyasındadır; hiçbir bileşende gömülü marka metni yoktur.
30. README şu başlıkları içerir: **Kurulum, Geliştirme, Yayına Alma, Markayı Değiştirme, Varsayımlar** — ayrıca görsel kaynakları ve değiştirme adımları.
31. Arayüz metinleri Türkçe; değişken ve fonksiyon adları İngilizce; yorum satırları Türkçe.

## Kapsam Dışı

- Online sipariş, sepet, ödeme altyapısı
- Masa rezervasyonu
- Gerçek kullanıcı hesabı, gerçek kimlik doğrulama, şifre sıfırlama
- Sunucu, veritabanı, API
- Çok dilli destek
- Blog veya harici içerik yönetim sistemi entegrasyonu
- Marka bilgilerinin (kafe adı, renkler, slogan, hikâye paneli metinleri) admin panelinden düzenlenmesi — bunlar yapılandırma dosyasında kalır
- Sürükle-bırak ile sıralama — yukarı/aşağı düğmeleriyle çözülür
- Görsel yükleme (kafe sahibinin panelden fotoğraf yüklemesi); görseller projeye gömülüdür, panelde görsel yolu seçilir
- Birden fazla kafe/şube desteği
- PWA, çevrimdışı service worker, ana ekrana ekleme
- Analitik, çerez izni, izleme

## Notlar

### Alınan kararlar ve gerekçeleri

- **Palet açık tona alındı.** Referans videodaki berber sitesi koyu/sinematik; kafe uyarlamasında krem (#F7F2EA) zemin, koyu kahve (#2A211B) metin, terrakota (#C0562F) aksan tercih edildi. Yapı (tam ekran fotoğraf panelleri, dev sıkıştırılmış tipografi, çapraz geçişler) korunuyor, sadece renk dünyası değişiyor. Fotoğraf üzerindeki metinlerin okunabilirliği için açık tonlu degrade maske kullanılacak; bu, koyu palete göre daha dikkatli ayar gerektiriyor ve kontrast oranı ölçülerek doğrulanacak.

- **Hibrit kaydırma modeli.** Hero ve hikâye panelleri tam ekran ve snap'li; menüden itibaren normal akış. Gerekçe: 22 ürünlük bir menüyü tam ekran panel içinde iç kaydırmayla göstermek mobilde kullanımı bozar ve QR'dan gelen müşterinin asıl aradığı şey menüdür.

- **Yazı tipi tercihi** (küçük tercih, sorulmadı): başlıklar için sıkıştırılmış bir display yazı tipi (referanstaki etkiyi veren şey bu), gövde için okunaklı bir sans-serif. Yazı tipleri **projeye gömülü olarak sunulacak** (Google Fonts CDN'den değil) — hem çevrimdışı çalışsın hem Lighthouse'ta dış istek beklenmesin diye. `font-display: swap` kullanılacak.

- **Örnek ürün adları ve fiyatları** (küçük tercih, sorulmadı): Türkiye kafe piyasasına makul görünecek adlar ve fiyatlar seçilecek; README'nin Varsayımlar başlığında belirtilecek.

- **Fiyat birimi.** Fiyat sayı olarak tutuluyor, TL simgesiyle Türkçe biçimlendiriliyor. Ondalık kuruş desteklenir ama başlangıç verisinde tam sayı kullanılır.

### Ortam doğrulaması (kontrol edildi)

- Node v24.12.0, npm 11.6.2 — Node 20+ kısıtı sağlanıyor.
- İnternet erişimi var; Unsplash'ten görsel indirilebiliyor (derleme zamanı; çalışma zamanında gerekmiyor).
- Google Chrome kurulu — Lighthouse CLI ile mobil ölçüm yapılabilir, kabul kriteri 24 gerçekten doğrulanabilir.
- Proje dizini şu an boş (yalnızca `referance/` klasörü var), git deposu değil. Git kullanılacaksa başlangıçta `git init` gerekir ve `referance/` klasörü ile `node_modules` `.gitignore`'a alınmalıdır.

### Riskler ve dikkat edilecekler

- **Lighthouse Performance ≥ 90 en kırılgan kriter.** React SPA + tam ekran fotoğraflar bu skoru zorlayabilir. Önlemler: hero görseli öncelikli ve doğru boyutta yüklenir, diğer tüm görseller lazy, `admin` ve `qr` rotaları kod bölmeyle ayrılır (müşteri sayfası admin kodunu indirmez), yazı tipleri preload edilir. Ölçüm hedefin altında kalırsa görsel boyutları ve kod bölme sınırları yeniden ayarlanacak; gerekirse durum raporlanacak.

- **Açık palette fotoğraf üzeri metin kontrastı.** Koyu paletteki kadar kolay değil. Her hikâye panelinde kontrast ölçülüp gerekirse maske yoğunluğu artırılacak.

- **Sahte kimlik doğrulama açıkça demo.** Şifre kaynak kodda düz metin ve ekranda yazılı — bu bilinçli bir demo tercihi, güvenlik açığı değil. Ancak bu proje gerçek bir kafeye teslim edilirse admin panelinin gerçek bir arka uçla değiştirilmesi gerekir; bu README'de açıkça belirtilecek.

- **`referance/` klasörü** yaklaşık 87 MB video içeriyor. Proje deposuna dahil edilmemeli.

### Çalışma biçimi

Kodlamaya başlamadan önce dosya ağacı, sayfa listesi ve veri modeli içeren uygulama planı sunulacak ve onay beklenecek. Her aşama sonunda derleme komutu çalıştırılıp hatalar düzeltilecek.
