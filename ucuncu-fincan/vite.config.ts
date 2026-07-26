/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { brand } from './src/config/brand';

/**
 * brand.ts içindeki renk ve yazı tiplerinin CSS değişken karşılıkları.
 * Tailwind bu değişkenleri okur (src/index.css içindeki @theme bloğuna bak),
 * böylece renk değiştirmek için tek dosya yeterli olur.
 */
const COLOR_VARIABLES: Record<keyof typeof brand.colors, string> = {
  bg: '--brand-page',
  surface: '--brand-surface',
  ink: '--brand-ink',
  inkMuted: '--brand-muted',
  accent: '--brand-accent',
  onAccent: '--brand-on-accent',
  highlight: '--brand-highlight',
  border: '--brand-line',
  onPhoto: '--brand-on-photo',
};

const FONT_VARIABLES: Record<keyof typeof brand.fonts, string> = {
  display: '--brand-font-display',
  body: '--brand-font-body',
  accent: '--brand-font-accent',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Marka bilgisini derleme sırasında index.html'e gömer.
 *
 * Amaç tek gerçek kaynağı korumak: renkler ve başlık yalnızca brand.ts'te yazılı.
 * Değişkenler HTML'e gömüldüğü için JS yüklenmeden önce de zemin rengi doğru
 * görünür — açılışta beyaz parlama olmaz.
 */
function brandHtmlPlugin(): Plugin {
  return {
    name: 'cafe-brand-html',
    transformIndexHtml(html) {
      const colorDeclarations = Object.entries(COLOR_VARIABLES)
        .map(([key, cssVar]) => `${cssVar}:${brand.colors[key as keyof typeof brand.colors]}`)
        .join(';');

      const fontDeclarations = Object.entries(FONT_VARIABLES)
        .map(([key, cssVar]) => `${cssVar}:${brand.fonts[key as keyof typeof brand.fonts]}`)
        .join(';');

      const title = `${brand.name} — ${brand.shortDescription}`;
      const head = [
        `<style>:root{${colorDeclarations};${fontDeclarations}}html{background:${brand.colors.bg}}</style>`,
        `<title>${escapeHtml(title)}</title>`,
        `<meta name="description" content="${escapeHtml(brand.shortDescription)}" />`,
        `<meta name="theme-color" content="${brand.colors.bg}" />`,
        `<meta property="og:title" content="${escapeHtml(brand.name)}" />`,
        `<meta property="og:description" content="${escapeHtml(brand.tagline)}" />`,
      ].join('\n    ');

      return html.replace('<!--BRAND_HEAD-->', head);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), brandHtmlPlugin()],
  build: {
    // Paket boyutunu izleyebilmek için uyarı eşiğini düşük tutuyoruz.
    chunkSizeWarningLimit: 250,
  },
  test: {
    environment: 'jsdom',
    // Global yok: test fonksiyonları dosyalarda açıkça import edilir.
    globals: false,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    // Bileşen testleri jsdom + userEvent ile yavaştır; yüklü bir makinede
    // (ya da CI'da) 5 sn'lik varsayılan sınır yetmeyip kararsızlığa yol açıyordu.
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
