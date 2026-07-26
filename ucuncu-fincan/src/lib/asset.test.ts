import { describe, expect, it } from 'vitest';
import { asset } from './asset';

/*
  Bu testler sitenin KÖKTE sunulduğu durumu doğrular (test ortamında
  BASE_URL "/" olur). Alt dizin davranışı derleme zamanı ayarıdır ve
  `npm run build:pages` çıktısı üzerinde doğrulanır.

  Buradaki asıl güvence: yollar helper'dan geçtiğinde kökte bozulmuyor
  ve dış bağlantılar/veri URL'leri olduğu gibi kalıyor.
*/
describe('asset', () => {
  it('kök yolu değiştirmeden döndürür', () => {
    expect(asset('/images/logo.webp')).toBe('/images/logo.webp');
  });

  it('baştaki eğik çizgi olmasa da çalışır', () => {
    expect(asset('images/logo.webp')).toBe('/images/logo.webp');
  });

  it('tam URL’lere dokunmaz', () => {
    const url = 'https://cdn.example.com/a.webp';
    expect(asset(url)).toBe(url);
  });

  it('protokolsüz tam URL’lere dokunmaz', () => {
    // "//" ile başlayan her şey protokolsüz URL sayılır ve olduğu gibi kalır.
    // Projede görsel yolları hep tek "/" ile yazılır, bu yüzden çakışma olmaz.
    expect(asset('//cdn.example.com/a.webp')).toBe('//cdn.example.com/a.webp');
  });

  it('menü verisindeki tüm görsel yolları helper’dan geçince geçerli kalır', () => {
    // Gerçek veriyle duman testi: hiçbiri çift eğik çizgi veya boş üretmemeli.
    const paths = ['/images/hero.webp', '/images/menu/espresso.webp', '/images/logo-sm.webp'];
    for (const p of paths) {
      const out = asset(p);
      expect(out.startsWith('/')).toBe(true);
      expect(out).not.toContain('//');
      expect(out.endsWith('.webp')).toBe(true);
    }
  });

  it('data URL’lerine dokunmaz', () => {
    const data = 'data:image/png;base64,iVBORw0KGgo=';
    expect(asset(data)).toBe(data);
  });
});
