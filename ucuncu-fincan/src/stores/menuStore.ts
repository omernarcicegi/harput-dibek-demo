// Menü verisi: kategoriler ve ürünler.
//
// Aşağıdaki dönüştürücüler saf fonksiyonlardır — state alır, yeni state döner.
// Depoya bağlı `menuActions` bunları sarar. Bu ayrım sayesinde mantık,
// localStorage'a ihtiyaç duymadan test edilebilir.

import { createPersistentStore } from '../lib/createPersistentStore';
import { MENU_SCHEMA_VERSION, createSeedMenu } from '../data/seed';
import type { Category, ItemBadge, MenuItem, MenuState } from '../types';

export const MENU_STORAGE_KEY = 'cafe.menu.v1';

const VALID_BADGES: readonly string[] = ['yeni', 'cok-satan', 'vegan'];

/** Benzersiz kimlik üretir. crypto yoksa (eski tarayıcı, test ortamı) zaman damgasına düşer. */
let fallbackIdCounter = 0;
function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  fallbackIdCounter += 1;
  return `${prefix}-${Date.now()}-${fallbackIdCounter}`;
}

// ---------------------------------------------------------------------------
// Doğrulama
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseCategory(raw: unknown): Category | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.id !== 'string' || raw.id === '') return null;
  if (typeof raw.name !== 'string') return null;
  if (typeof raw.order !== 'number' || !Number.isFinite(raw.order)) return null;
  return { id: raw.id, name: raw.name, order: raw.order };
}

function parseMenuItem(raw: unknown): MenuItem | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.id !== 'string' || raw.id === '') return null;
  if (typeof raw.categoryId !== 'string' || raw.categoryId === '') return null;
  if (typeof raw.name !== 'string') return null;
  if (typeof raw.description !== 'string') return null;
  if (typeof raw.price !== 'number' || !Number.isFinite(raw.price)) return null;
  if (typeof raw.imageUrl !== 'string') return null;
  if (typeof raw.allergenNote !== 'string') return null;
  if (typeof raw.soldOut !== 'boolean') return null;
  if (typeof raw.order !== 'number' || !Number.isFinite(raw.order)) return null;

  const badge =
    typeof raw.badge === 'string' && VALID_BADGES.includes(raw.badge)
      ? (raw.badge as ItemBadge)
      : null;

  return {
    id: raw.id,
    categoryId: raw.categoryId,
    name: raw.name,
    description: raw.description,
    price: raw.price,
    imageUrl: raw.imageUrl,
    badge,
    allergenNote: raw.allergenNote,
    soldOut: raw.soldOut,
    order: raw.order,
  };
}

/** Ham veriyi doğrular. Tek bir kayıt bile bozuksa tamamını reddeder. */
export function parseMenuState(raw: unknown): MenuState | null {
  if (!isRecord(raw)) return null;
  if (!Array.isArray(raw.categories) || !Array.isArray(raw.items)) return null;

  const categories: Category[] = [];
  for (const candidate of raw.categories) {
    const category = parseCategory(candidate);
    if (!category) return null;
    categories.push(category);
  }

  const items: MenuItem[] = [];
  for (const candidate of raw.items) {
    const item = parseMenuItem(candidate);
    if (!item) return null;
    items.push(item);
  }

  return { schemaVersion: MENU_SCHEMA_VERSION, categories, items };
}

// ---------------------------------------------------------------------------
// Seçiciler
// ---------------------------------------------------------------------------

export function selectCategories(state: MenuState): Category[] {
  return [...state.categories].sort((a, b) => a.order - b.order);
}

export function selectItemsByCategory(state: MenuState, categoryId: string): MenuItem[] {
  return state.items
    .filter((item) => item.categoryId === categoryId)
    .sort((a, b) => a.order - b.order);
}

// ---------------------------------------------------------------------------
// Dönüştürücüler (saf)
// ---------------------------------------------------------------------------

export interface NewItemInput {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  badge: ItemBadge | null;
  allergenNote: string;
}

/** Bir kategorideki en yüksek sıra numarasının bir fazlasını verir. */
function nextItemOrder(state: MenuState, categoryId: string): number {
  const orders = state.items
    .filter((item) => item.categoryId === categoryId)
    .map((item) => item.order);
  return orders.length === 0 ? 0 : Math.max(...orders) + 1;
}

export function addItem(state: MenuState, input: NewItemInput): MenuState {
  const item: MenuItem = {
    ...input,
    id: createId('item'),
    soldOut: false,
    order: nextItemOrder(state, input.categoryId),
  };
  return { ...state, items: [...state.items, item] };
}

/** Ürünün verilen alanlarını değiştirir; id ve order korunur. */
export function updateItem(
  state: MenuState,
  id: string,
  patch: Partial<Omit<MenuItem, 'id' | 'order'>>,
): MenuState {
  return {
    ...state,
    items: state.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
  };
}

export function removeItem(state: MenuState, id: string): MenuState {
  return { ...state, items: state.items.filter((item) => item.id !== id) };
}

export function toggleSoldOut(state: MenuState, id: string): MenuState {
  return {
    ...state,
    items: state.items.map((item) =>
      item.id === id ? { ...item, soldOut: !item.soldOut } : item,
    ),
  };
}

/**
 * Sıralı bir listede iki komşunun `order` değerini takas eder.
 * Kenardaysa (yukarıdaki ilk / aşağıdaki son) liste değişmeden döner.
 */
function swapOrder<T extends { id: string; order: number }>(
  siblings: T[],
  id: string,
  direction: 'up' | 'down',
): Map<string, number> | null {
  const sorted = [...siblings].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((entry) => entry.id === id);
  if (index === -1) return null;

  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= sorted.length) return null;

  const current = sorted[index];
  const target = sorted[targetIndex];
  return new Map([
    [current.id, target.order],
    [target.id, current.order],
  ]);
}

export function moveItem(state: MenuState, id: string, direction: 'up' | 'down'): MenuState {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return state;

  const siblings = state.items.filter((entry) => entry.categoryId === item.categoryId);
  const newOrders = swapOrder(siblings, id, direction);
  if (!newOrders) return state;

  return {
    ...state,
    items: state.items.map((entry) =>
      newOrders.has(entry.id) ? { ...entry, order: newOrders.get(entry.id)! } : entry,
    ),
  };
}

export function addCategory(state: MenuState, name: string): MenuState {
  const orders = state.categories.map((category) => category.order);
  const category: Category = {
    id: createId('cat'),
    name,
    order: orders.length === 0 ? 0 : Math.max(...orders) + 1,
  };
  return { ...state, categories: [...state.categories, category] };
}

export function renameCategory(state: MenuState, id: string, name: string): MenuState {
  return {
    ...state,
    categories: state.categories.map((category) =>
      category.id === id ? { ...category, name } : category,
    ),
  };
}

/**
 * Kategoriyi ve içindeki TÜM ürünleri siler.
 * Öksüz ürün bırakmamak için bilinçli bir tercih; arayüz silmeden önce uyarır.
 */
export function removeCategory(state: MenuState, id: string): MenuState {
  return {
    ...state,
    categories: state.categories.filter((category) => category.id !== id),
    items: state.items.filter((item) => item.categoryId !== id),
  };
}

export function moveCategory(state: MenuState, id: string, direction: 'up' | 'down'): MenuState {
  const newOrders = swapOrder(state.categories, id, direction);
  if (!newOrders) return state;

  return {
    ...state,
    categories: state.categories.map((category) =>
      newOrders.has(category.id)
        ? { ...category, order: newOrders.get(category.id)! }
        : category,
    ),
  };
}

// ---------------------------------------------------------------------------
// Depo ve bağlı eylemler
// ---------------------------------------------------------------------------

export const menuStore = createPersistentStore<MenuState>({
  storageKey: MENU_STORAGE_KEY,
  schemaVersion: MENU_SCHEMA_VERSION,
  createSeed: createSeedMenu,
  parse: parseMenuState,
});

export const menuActions = {
  addItem: (input: NewItemInput) => menuStore.update((state) => addItem(state, input)),
  updateItem: (id: string, patch: Partial<Omit<MenuItem, 'id' | 'order'>>) =>
    menuStore.update((state) => updateItem(state, id, patch)),
  removeItem: (id: string) => menuStore.update((state) => removeItem(state, id)),
  toggleSoldOut: (id: string) => menuStore.update((state) => toggleSoldOut(state, id)),
  moveItem: (id: string, direction: 'up' | 'down') =>
    menuStore.update((state) => moveItem(state, id, direction)),
  addCategory: (name: string) => menuStore.update((state) => addCategory(state, name)),
  renameCategory: (id: string, name: string) =>
    menuStore.update((state) => renameCategory(state, id, name)),
  removeCategory: (id: string) => menuStore.update((state) => removeCategory(state, id)),
  moveCategory: (id: string, direction: 'up' | 'down') =>
    menuStore.update((state) => moveCategory(state, id, direction)),
  reset: () => menuStore.reset(),
};
