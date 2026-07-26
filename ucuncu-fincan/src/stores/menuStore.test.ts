import { describe, expect, it } from 'vitest';
import { createSeedMenu, MENU_SCHEMA_VERSION } from '../data/seed';
import { createPersistentStore } from '../lib/createPersistentStore';
import {
  addCategory,
  addItem,
  moveCategory,
  moveItem,
  parseMenuState,
  removeCategory,
  removeItem,
  renameCategory,
  selectCategories,
  selectItemsByCategory,
  toggleSoldOut,
  updateItem,
} from './menuStore';
import type { MenuState } from '../types';

const TEST_KEY = 'test.menu';

function freshStore() {
  return createPersistentStore<MenuState>({
    storageKey: TEST_KEY,
    schemaVersion: MENU_SCHEMA_VERSION,
    createSeed: createSeedMenu,
    parse: parseMenuState,
  });
}

function newItemInput(categoryId: string) {
  return {
    categoryId,
    name: 'Deneme Kahvesi',
    description: 'Test için eklenen ürün.',
    price: 99,
    imageUrl: '/images/menu/espresso.webp',
    badge: null,
    allergenNote: 'Alerjen yok.',
  };
}

describe('menü dönüştürücüleri', () => {
  it('yeni ürün ekler ve kategorisinin sonuna koyar', () => {
    const state = createSeedMenu();
    const before = selectItemsByCategory(state, 'cat-sicak');

    const next = addItem(state, newItemInput('cat-sicak'));
    const after = selectItemsByCategory(next, 'cat-sicak');

    expect(after).toHaveLength(before.length + 1);
    expect(after[after.length - 1].name).toBe('Deneme Kahvesi');
    // Girdi state değişmemeli (saf fonksiyon).
    expect(selectItemsByCategory(state, 'cat-sicak')).toHaveLength(before.length);
  });

  it('fiyatı günceller', () => {
    const state = createSeedMenu();
    const next = updateItem(state, 'item-espresso', { price: 123 });

    const item = next.items.find((entry) => entry.id === 'item-espresso');
    expect(item?.price).toBe(123);
    // Diğer alanlar korunur.
    expect(item?.name).toBe('Espresso');
  });

  it('ürünü siler', () => {
    const state = createSeedMenu();
    const next = removeItem(state, 'item-espresso');

    expect(next.items.some((entry) => entry.id === 'item-espresso')).toBe(false);
    expect(next.items).toHaveLength(state.items.length - 1);
  });

  it('tükendi durumunu açıp kapatır', () => {
    const state = createSeedMenu();

    const marked = toggleSoldOut(state, 'item-espresso');
    expect(marked.items.find((entry) => entry.id === 'item-espresso')?.soldOut).toBe(true);

    const unmarked = toggleSoldOut(marked, 'item-espresso');
    expect(unmarked.items.find((entry) => entry.id === 'item-espresso')?.soldOut).toBe(false);
  });

  it('ürünü yukarı taşır', () => {
    const state = createSeedMenu();
    const before = selectItemsByCategory(state, 'cat-sicak').map((entry) => entry.id);

    const next = moveItem(state, before[2], 'up');
    const after = selectItemsByCategory(next, 'cat-sicak').map((entry) => entry.id);

    expect(after[1]).toBe(before[2]);
    expect(after[2]).toBe(before[1]);
  });

  it('listenin başındaki ürünü yukarı taşımaya çalışmak sırayı değiştirmez', () => {
    const state = createSeedMenu();
    const before = selectItemsByCategory(state, 'cat-sicak').map((entry) => entry.id);

    const next = moveItem(state, before[0], 'up');

    expect(selectItemsByCategory(next, 'cat-sicak').map((entry) => entry.id)).toEqual(before);
  });

  it('listenin sonundaki ürünü aşağı taşımaya çalışmak sırayı değiştirmez', () => {
    const state = createSeedMenu();
    const before = selectItemsByCategory(state, 'cat-sicak').map((entry) => entry.id);

    const next = moveItem(state, before[before.length - 1], 'down');

    expect(selectItemsByCategory(next, 'cat-sicak').map((entry) => entry.id)).toEqual(before);
  });

  it('kategori ekler ve sona koyar', () => {
    const state = createSeedMenu();
    const next = addCategory(state, 'Kahvaltı');
    const categories = selectCategories(next);

    expect(categories).toHaveLength(state.categories.length + 1);
    expect(categories[categories.length - 1].name).toBe('Kahvaltı');
  });

  it('kategoriyi yeniden adlandırır', () => {
    const state = createSeedMenu();
    const next = renameCategory(state, 'cat-tatli', 'Fırından');

    expect(next.categories.find((entry) => entry.id === 'cat-tatli')?.name).toBe('Fırından');
  });

  it('kategoriyi silince içindeki ürünler de silinir', () => {
    const state = createSeedMenu();
    const itemCount = selectItemsByCategory(state, 'cat-tatli').length;
    expect(itemCount).toBeGreaterThan(0);

    const next = removeCategory(state, 'cat-tatli');

    expect(next.categories.some((entry) => entry.id === 'cat-tatli')).toBe(false);
    expect(next.items.some((entry) => entry.categoryId === 'cat-tatli')).toBe(false);
    expect(next.items).toHaveLength(state.items.length - itemCount);
  });

  it('kategori sırasını değiştirir', () => {
    const state = createSeedMenu();
    const before = selectCategories(state).map((entry) => entry.id);

    const next = moveCategory(state, before[0], 'down');
    const after = selectCategories(next).map((entry) => entry.id);

    expect(after[0]).toBe(before[1]);
    expect(after[1]).toBe(before[0]);
  });
});

describe('menü kalıcılığı', () => {
  it('yazılan veri yeni bir depo örneğinde okunur (sayfa yenileme)', () => {
    const store = freshStore();
    store.update((state) => updateItem(state, 'item-espresso', { price: 456 }));

    // Yenileme: aynı anahtarla yepyeni bir depo kurulur.
    const reopened = freshStore();

    expect(
      reopened.getSnapshot().items.find((entry) => entry.id === 'item-espresso')?.price,
    ).toBe(456);
  });

  it('bozuk JSON kaydedilmişse çökmez, başlangıç verisine döner', () => {
    window.localStorage.setItem(TEST_KEY, '{bozuk json');

    const store = freshStore();

    expect(store.getSnapshot().items).toHaveLength(createSeedMenu().items.length);
  });

  it('şema sürümü uyuşmazsa başlangıç verisine döner', () => {
    const stale = { ...createSeedMenu(), schemaVersion: 999 };
    window.localStorage.setItem(TEST_KEY, JSON.stringify(stale));

    const store = freshStore();

    expect(store.getSnapshot().schemaVersion).toBe(MENU_SCHEMA_VERSION);
    expect(store.getSnapshot().items).toHaveLength(createSeedMenu().items.length);
  });

  it('yapısı bozuk veri (fiyat metin) reddedilir', () => {
    const broken = createSeedMenu();
    // Elle kurcalanmış gibi: fiyat sayı değil.
    const payload = JSON.parse(JSON.stringify(broken)) as Record<string, unknown>;
    (payload.items as Record<string, unknown>[])[0].price = 'bedava';
    window.localStorage.setItem(TEST_KEY, JSON.stringify(payload));

    const store = freshStore();

    expect(store.getSnapshot().items[0].price).toBe(createSeedMenu().items[0].price);
  });

  it('sıfırlama başlangıç menüsünü birebir geri getirir', () => {
    const store = freshStore();
    store.update((state) => removeCategory(state, 'cat-tatli'));
    store.update((state) => updateItem(state, 'item-espresso', { price: 1 }));
    expect(store.getSnapshot().categories).toHaveLength(3);

    store.reset();

    expect(store.getSnapshot()).toEqual(createSeedMenu());
  });

  it('abone değişiklikten haberdar edilir', () => {
    const store = freshStore();
    let notifications = 0;
    const unsubscribe = store.subscribe(() => {
      notifications += 1;
    });

    store.update((state) => updateItem(state, 'item-espresso', { price: 77 }));
    expect(notifications).toBe(1);

    unsubscribe();
    store.update((state) => updateItem(state, 'item-espresso', { price: 88 }));
    // Abonelik iptal edildikten sonra bildirim gelmez.
    expect(notifications).toBe(1);
  });

  it('anlık görüntü referansı veri değişmedikçe sabit kalır', () => {
    const store = freshStore();
    const first = store.getSnapshot();

    expect(store.getSnapshot()).toBe(first);

    store.update((state) => updateItem(state, 'item-espresso', { price: 5 }));
    expect(store.getSnapshot()).not.toBe(first);
  });
});
