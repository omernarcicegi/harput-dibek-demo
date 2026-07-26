// Marka bütünlüğü bekçisi.
//
// Kabul kriteri: "Kafe adı tek dosyada tek satır değiştirilerek tüm sitede
// güncellenir." Bu testler o garantiyi korur.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { cwd } from 'node:process';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Yapılandırmadaki adı değiştirip bileşenlerin onu kullandığını doğruluyoruz.
const TEST_NAME = 'Zeytin Kahve';
const TEST_ACCENT = 'Deneme Şubesi';

vi.mock('./brand', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./brand')>();
  return {
    ...actual,
    brand: { ...actual.brand, name: TEST_NAME, nameAccent: TEST_ACCENT },
  };
});

const { Hero } = await import('../sections/Hero');
const { Intro } = await import('../components/Intro');
// Mock'lanmamış gerçek değerler (yer tutucu ad, slogan, renkler) için.
const { brand: realBrand } = await vi.importActual<typeof import('./brand')>('./brand');

describe('marka adı yapılandırmadan okunur', () => {
  it('hero yapılandırmadaki adı gösterir', () => {
    render(<Hero />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(TEST_NAME);
    expect(screen.getByText(TEST_ACCENT)).toBeInTheDocument();
  });

  it('açılış animasyonu yapılandırmadaki adı gösterir', () => {
    render(<Intro onDone={() => {}} />);

    // Perde aria-hidden olduğu için erişilebilirlik ağacında yok;
    // bu bilinçli — asıl içerik arkada duruyor. Metinle sorguluyoruz.
    expect(screen.getByText(TEST_NAME)).toBeInTheDocument();
  });
});

// --- Kaynak taraması --------------------------------------------------------

// Vitest proje kökünden çalışır.
const SRC_DIR = join(cwd(), 'src');

/** brand.ts dışında marka metni barındırmaması gereken dosyalar. */
function collectSourceFiles(directory: string): string[] {
  const collected: string[] = [];
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    if (statSync(fullPath).isDirectory()) {
      collected.push(...collectSourceFiles(fullPath));
      continue;
    }
    if (!/\.(ts|tsx)$/.test(entry)) continue;
    // Yapılandırmanın kendisi ve testler hariç.
    if (entry.includes('.test.')) continue;
    if (fullPath.endsWith(join('config', 'brand.ts'))) continue;
    /*
      Demo menü verisi hariç: ürün adlarının markayı içermesi doğaldır
      ("Harput Dibek Kahvesi" bir üründür). Bu testin amacı BİLEŞENLERDE
      gömülü marka metni olmamasıdır, içerik dosyalarında değil.
    */
    if (fullPath.endsWith(join('data', 'seed.ts'))) continue;
    collected.push(fullPath);
  }
  return collected;
}

describe('bileşenlerde gömülü marka metni yok', () => {
  const files = collectSourceFiles(SRC_DIR);

  it('taranacak dosya bulur', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it('hiçbir bileşende yer tutucu kafe adı geçmez', () => {
    // Mock edilen ad değil, brand.ts'teki GERÇEK ad aranır.
    // Sabit yazmak yerine yapılandırmadan okunur; marka değişince test de takip eder.
    const placeholderName = realBrand.name;
    const offenders = files.filter((file) =>
      readFileSync(file, 'utf8').includes(placeholderName),
    );

    expect(offenders.map((file) => relative(SRC_DIR, file))).toEqual([]);
  });

  it('hiçbir bileşende slogan gömülü değil', () => {
    const offenders = files.filter((file) =>
      readFileSync(file, 'utf8').includes(realBrand.tagline),
    );

    expect(offenders.map((file) => relative(SRC_DIR, file))).toEqual([]);
  });

  it('hiçbir bileşende renk paleti sabit kodlanmamış', () => {
    // Renkler yalnızca brand.ts'te; bileşenler Tailwind token'larını kullanır.
    const offenders = files.filter((file) =>
      readFileSync(file, 'utf8').includes(realBrand.colors.dark.accent),
    );

    expect(offenders.map((file) => relative(SRC_DIR, file))).toEqual([]);
  });
});
