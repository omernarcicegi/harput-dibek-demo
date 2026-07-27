/**
 * Siteyi GERÇEK mobil genişlikte doğrular (375x812, dokunma emülasyonu).
 *
 * Neden gerekli: `chrome --headless --window-size=375,812 --screenshot`
 * düzeni ~512 px'e göre hesaplayıp görüntüyü 375'e kırpıyor, yani yanıltıcı
 * ekran görüntüsü veriyor. iframe içine gömmek de işe yaramıyor — headless'ta
 * iframe içinde IntersectionObserver geri çağrıları hiç tetiklenmiyor
 * (bu yüzden "içerik görünmüyor" gibi sahte bir bulgu çıkıyor).
 * CDP + Emulation.setDeviceMetricsOverride tek güvenilir yol.
 *
 * Kullanım:
 *   1) Chrome'u hata ayıklama portuyla başlat:
 *      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *        --headless --disable-gpu --no-sandbox --remote-debugging-port=9222 \
 *        --user-data-dir=/tmp/cdp-profile about:blank &
 *   2) Siteyi sun:  npm run preview
 *   3) node scripts/verify.mjs [url]
 */

import { connect, openMobile, evaluate, scrollTo, screenshot } from './cdp.mjs';

const URL = process.argv[2] ?? 'http://localhost:4173/';
const { send, close } = await connect();

await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-color-scheme', value: 'dark' }],
});
await openMobile(send, URL);
await new Promise((r) => setTimeout(r, 2500));

// --- Yatay taşma -----------------------------------------------------------
const box = await evaluate(
  send,
  `({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })`,
);
console.log(`yatay kaydırma : ${box.sw}/${box.cw} ${box.sw <= box.cw ? '✓' : '!! TAŞMA'}`);

// --- Dokunma hedefleri (>= 44x44) -----------------------------------------
const small = await evaluate(
  send,
  `(() => {
    const bad = [];
    document.querySelectorAll('button, a[href], input, select').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.width < 44 || r.height < 44) {
        bad.push((el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 28));
      }
    });
    return [...new Set(bad)];
  })()`,
);
console.log(`dokunma hedefi : ${small.length === 0 ? 'hepsi >= 44x44 ✓' : small.join(', ')}`);

// --- Reveal: ekranda olup gizli kalan var mı? ------------------------------
const height = await evaluate(send, 'document.documentElement.scrollHeight');
let stuck = 0;
for (let y = 0; y < height - 812; y += 900) {
  await scrollTo(send, y);
  stuck += await evaluate(
    send,
    `[...document.querySelectorAll('.reveal')].filter((e) => {
      const r = e.getBoundingClientRect();
      return e.getAttribute('data-visible') !== 'true' && r.top < innerHeight && r.bottom > 0;
    }).length`,
  );
}
console.log(`gizli kalan içerik : ${stuck === 0 ? 'yok ✓' : stuck + ' öğe !!'}`);

// --- Yüklenmeyen görseller -------------------------------------------------
await scrollTo(send, 0);
await new Promise((r) => setTimeout(r, 1200));
const broken = await evaluate(
  send,
  `[...document.querySelectorAll('img')].filter((i) => {
    const r = i.getBoundingClientRect();
    const inView = r.top < innerHeight && r.bottom > 0 && r.width > 0;
    return inView && (!i.complete || i.naturalWidth === 0);
  }).length`,
);
console.log(`yüklenmeyen görsel : ${broken === 0 ? 'yok ✓' : broken + ' !!'}`);

await screenshot(send, 'verify-hero.png');
console.log('\nekran görüntüsü: verify-hero.png');
close();
