// Kabul kriterlerinin uçtan uca kanıtı:
//  - Adminden fiyat değiştirilince menüde anında güncellenir
//  - Sayfa yenilendiğinde korunur
//  - "Demo verisini sıfırla" başlangıç menüsünü geri getirir

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { brand } from './config/brand';
import { createSeedMenu } from './data/seed';
import { formatPrice } from './lib/format';
import { menuStore } from './stores/menuStore';
import { MenuSection } from './sections/MenuSection';
import AdminPage from './pages/AdminPage';

/** Menüdeki belirli bir ürünün kartını döndürür (fiyat metni benzersiz değil). */
function menuCardOf(name: string): HTMLElement {
  const menu = within(screen.getByTestId('menu'));
  const card = menu.getByText(name, { selector: 'h4' }).closest('button');
  if (!card) throw new Error(`"${name}" kartı bulunamadı`);
  return card;
}

function Both() {
  return (
    <>
      <div data-testid="admin">
        <AdminPage />
      </div>
      <div data-testid="menu">
        <MenuSection />
      </div>
    </>
  );
}

async function loginAsAdmin(user: ReturnType<typeof userEvent.setup>) {
  const admin = within(screen.getByTestId('admin'));
  await user.type(admin.getByLabelText('Kullanıcı adı'), brand.admin.username);
  await user.type(admin.getByLabelText('Şifre'), brand.admin.password);
  await user.click(admin.getByRole('button', { name: 'Giriş yap' }));
}

beforeEach(() => {
  // Depo modül seviyesinde tekil; her test temiz menüyle başlasın.
  menuStore.reset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('admin → müşteri menüsü', () => {
  it('adminden değiştirilen fiyat menüde anında görünür', async () => {
    const user = userEvent.setup({ delay: null });
    render(<Both />);

    const seedPrice = createSeedMenu().items.find((i) => i.id === 'item-espresso')!.price;
    expect(menuCardOf('Espresso')).toHaveTextContent(formatPrice(seedPrice));

    await loginAsAdmin(user);

    const admin = within(screen.getByTestId('admin'));
    const row = admin.getByText('Espresso').closest('li');
    expect(row).not.toBeNull();

    await user.click(within(row as HTMLElement).getByRole('button', { name: 'Düzenle' }));

    const priceField = admin.getByLabelText('Fiyat (₺)');
    await user.clear(priceField);
    await user.type(priceField, '199');
    await user.click(admin.getByRole('button', { name: 'Kaydet' }));

    // Sayfa yenilenmeden müşteri menüsü güncellendi.
    expect(menuCardOf('Espresso')).toHaveTextContent('199 ₺');
    expect(menuCardOf('Espresso')).not.toHaveTextContent(formatPrice(seedPrice));
  });

  it('değişiklik sayfa yenilendiğinde korunur', async () => {
    const user = userEvent.setup({ delay: null });
    render(<Both />);
    await loginAsAdmin(user);

    const admin = within(screen.getByTestId('admin'));
    const row = admin.getByText('Espresso').closest('li') as HTMLElement;
    await user.click(within(row).getByRole('button', { name: 'Düzenle' }));
    const priceField = admin.getByLabelText('Fiyat (₺)');
    await user.clear(priceField);
    await user.type(priceField, '250');
    await user.click(admin.getByRole('button', { name: 'Kaydet' }));

    // Yenileme: modüller sıfırlanır, depo localStorage'dan yeniden okur.
    vi.resetModules();
    const { MenuSection: FreshMenuSection } = await import('./sections/MenuSection');
    render(<FreshMenuSection />, { container: document.body.appendChild(document.createElement('div')) });

    expect(await screen.findAllByText('250 ₺')).not.toHaveLength(0);
  });

  it('“Demo verisini sıfırla” başlangıç menüsünü geri getirir', async () => {
    const user = userEvent.setup({ delay: null });
    // Sıfırlama onay ister; testte otomatik onaylıyoruz.
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<Both />);
    await loginAsAdmin(user);

    const admin = within(screen.getByTestId('admin'));
    const row = admin.getByText('Espresso').closest('li') as HTMLElement;
    await user.click(within(row).getByRole('button', { name: 'Düzenle' }));
    const priceField = admin.getByLabelText('Fiyat (₺)');
    await user.clear(priceField);
    await user.type(priceField, '999');
    await user.click(admin.getByRole('button', { name: 'Kaydet' }));

    expect(menuCardOf('Espresso')).toHaveTextContent('999 ₺');

    await user.click(admin.getByRole('button', { name: 'Demo verisini sıfırla' }));

    const seedPrice = createSeedMenu().items.find((item) => item.id === 'item-espresso')!.price;
    expect(menuCardOf('Espresso')).toHaveTextContent(formatPrice(seedPrice));
    expect(menuStore.getSnapshot()).toEqual(createSeedMenu());
  });
});

describe('menü alt grupları', () => {
  it('kategori içindeki alt başlıklar gösterilir', () => {
    render(<Both />);
    const menu = within(screen.getByTestId('menu'));

    // Seed'deki ilk kategorinin gruplarını veriden okuyup ekranda arıyoruz.
    const seed = createSeedMenu();
    const firstCategory = seed.categories[0].id;
    const groups = [
      ...new Set(
        seed.items
          .filter((item) => item.categoryId === firstCategory)
          .map((item) => item.group)
          .filter((group): group is string => group !== null),
      ),
    ];

    expect(groups.length).toBeGreaterThan(1);
    for (const group of groups) {
      expect(menu.getByText(group, { selector: 'h3' })).toBeInTheDocument();
    }
  });

  it('ürün detayında alt grup adı görünür', async () => {
    const user = userEvent.setup({ delay: null });
    render(<Both />);

    await user.click(menuCardOf('Espresso'));

    const dialog = within(screen.getByRole('dialog'));
    const espresso = createSeedMenu().items.find((i) => i.id === 'item-espresso')!;
    expect(espresso.group).not.toBeNull();
    expect(dialog.getByText(espresso.group as string)).toBeInTheDocument();
  });
});

describe('tükendi işareti müşteri tarafında görünür', () => {
  it('adminde tükendi işaretlenen ürün menüde etiketlenir', async () => {
    const user = userEvent.setup({ delay: null });
    render(<Both />);
    await loginAsAdmin(user);

    const admin = within(screen.getByTestId('admin'));
    const row = admin.getByText('Espresso').closest('li') as HTMLElement;
    await user.click(within(row).getByRole('button', { name: 'Tükendi' }));

    const menu = within(screen.getByTestId('menu'));
    expect(menu.getAllByText('Tükendi').length).toBeGreaterThan(0);
  });
});
