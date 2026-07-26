// Kabul kriterlerinin uçtan uca kanıtı:
//  - Adminden fiyat değiştirilince menüde anında güncellenir
//  - Sayfa yenilendiğinde korunur
//  - "Demo verisini sıfırla" başlangıç menüsünü geri getirir

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { brand } from './config/brand';
import { createSeedMenu } from './data/seed';
import { menuStore } from './stores/menuStore';
import { MenuSection } from './sections/MenuSection';
import AdminPage from './pages/AdminPage';

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

    const menu = within(screen.getByTestId('menu'));
    expect(menu.getByText('65 ₺')).toBeInTheDocument();

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
    expect(within(screen.getByTestId('menu')).getByText('199 ₺')).toBeInTheDocument();
    expect(within(screen.getByTestId('menu')).queryByText('65 ₺')).not.toBeInTheDocument();
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

    expect(within(screen.getByTestId('menu')).getByText('999 ₺')).toBeInTheDocument();

    await user.click(admin.getByRole('button', { name: 'Demo verisini sıfırla' }));

    const seedPrice = createSeedMenu().items.find((item) => item.id === 'item-espresso')?.price;
    expect(within(screen.getByTestId('menu')).getByText(`${seedPrice} ₺`)).toBeInTheDocument();
    expect(menuStore.getSnapshot()).toEqual(createSeedMenu());
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
