// Ürün yönetimi: ekleme, düzenleme, silme, tükendi işaretleme, sıralama.

import { useMemo, useState } from 'react';
import { BADGE_LABELS } from '../config/brand';
import { createSeedMenu } from '../data/seed';
import { formatPrice } from '../lib/format';
import { menuActions, selectCategories, selectItemsByCategory } from '../stores/menuStore';
import { useMenu } from '../stores/hooks';
import type { ItemBadge, MenuItem } from '../types';
import { Button, Field, IconButton, Select, TextArea, TextInput } from './fields';

/** Projeye gömülü görsellerin listesi; admin bunlar arasından seçer. */
const BUNDLED_IMAGES = Array.from(
  new Set(createSeedMenu().items.map((item) => item.imageUrl)),
).sort();

const BADGE_OPTIONS: (ItemBadge | '')[] = ['', 'yeni', 'cok-satan', 'vegan'];

interface FormState {
  id: string | null;
  categoryId: string;
  name: string;
  group: string;
  description: string;
  price: string;
  imageUrl: string;
  badge: ItemBadge | '';
  allergenNote: string;
}

function emptyForm(categoryId: string): FormState {
  return {
    id: null,
    categoryId,
    name: '',
    group: '',
    description: '',
    price: '',
    imageUrl: BUNDLED_IMAGES[0] ?? '',
    badge: '',
    allergenNote: '',
  };
}

function formFromItem(item: MenuItem): FormState {
  return {
    id: item.id,
    categoryId: item.categoryId,
    name: item.name,
    group: item.group ?? '',
    description: item.description,
    // Türkçe girişte ondalık ayırıcı virgül.
    price: String(item.price).replace('.', ','),
    imageUrl: item.imageUrl,
    badge: item.badge ?? '',
    allergenNote: item.allergenNote,
  };
}

/** "145,50" → 145.5 ; geçersizse null. */
function parsePrice(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.');
  if (normalized === '') return null;
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

export function ItemsTab() {
  const menu = useMenu();
  const categories = useMemo(() => selectCategories(menu), [menu]);
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? '');
  const [form, setForm] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentCategoryId = categories.some((category) => category.id === activeCategoryId)
    ? activeCategoryId
    : (categories[0]?.id ?? '');

  const items = useMemo(
    () => (currentCategoryId ? selectItemsByCategory(menu, currentCategoryId) : []),
    [menu, currentCategoryId],
  );

  /** Menüde hâlihazırda kullanılan alt başlıklar — form önerisi için. */
  const existingGroups = useMemo(
    () =>
      [...new Set(menu.items.map((item) => item.group).filter((g): g is string => !!g))].sort(),
    [menu.items],
  );

  function handleSubmit() {
    if (!form) return;

    const nextErrors: Record<string, string> = {};
    if (form.name.trim() === '') nextErrors.name = 'Ürün adı boş olamaz.';
    const price = parsePrice(form.price);
    if (price === null) nextErrors.price = 'Fiyat 0 veya daha büyük bir sayı olmalı.';
    if (form.imageUrl.trim() === '') nextErrors.imageUrl = 'Bir görsel seçin.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      categoryId: form.categoryId,
      name: form.name.trim(),
      group: form.group.trim() === '' ? null : form.group.trim(),
      description: form.description.trim(),
      price: price as number,
      imageUrl: form.imageUrl,
      badge: form.badge === '' ? null : form.badge,
      allergenNote: form.allergenNote.trim(),
    };

    if (form.id) {
      menuActions.updateItem(form.id, payload);
    } else {
      menuActions.addItem(payload);
    }
    setForm(null);
    setErrors({});
  }

  function handleDelete(item: MenuItem) {
    if (!window.confirm(`"${item.name}" silinsin mi? Bu işlem geri alınamaz.`)) return;
    menuActions.removeItem(item.id);
    if (form?.id === item.id) setForm(null);
  }

  if (categories.length === 0) {
    return (
      <p className="rounded-xl border border-line bg-surface p-4 text-muted">
        Önce “Kategoriler” sekmesinden bir kategori ekleyin.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {/* Kategori seçimi */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategoryId(category.id)}
            className={`press min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold whitespace-nowrap ${
              category.id === currentCategoryId
                ? 'bg-ink text-page'
                : 'border border-line bg-surface text-muted'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {form === null && (
        <Button variant="primary" onClick={() => setForm(emptyForm(currentCategoryId))}>
          + Yeni ürün ekle
        </Button>
      )}

      {form !== null && (
        <div className="space-y-4 rounded-2xl border border-accent bg-surface p-4">
          <h3 className="text-2xl text-ink">
            {form.id ? 'Ürünü düzenle' : 'Yeni ürün'}
          </h3>

          <Field label="Ürün adı" htmlFor="item-name" error={errors.name}>
            <TextInput
              id="item-name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </Field>

          <Field
            label="Alt başlık"
            htmlFor="item-group"
            hint="Menüde ürünün altında listeleneceği grup. Boş bırakılabilir."
          >
            <TextInput
              id="item-group"
              list="group-options"
              value={form.group}
              placeholder="Örn. Geleneksel Kahvelerimiz"
              onChange={(event) => setForm({ ...form, group: event.target.value })}
            />
            {/* Mevcut gruplar öneri olarak sunulur; yenisi de yazılabilir. */}
            <datalist id="group-options">
              {existingGroups.map((group) => (
                <option key={group} value={group} />
              ))}
            </datalist>
          </Field>

          <Field label="Açıklama" htmlFor="item-desc" hint="Kartta görünen tek cümle.">
            <TextArea
              id="item-desc"
              rows={2}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Fiyat (₺)" htmlFor="item-price" error={errors.price}>
              <TextInput
                id="item-price"
                inputMode="decimal"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
              />
            </Field>

            <Field label="Kategori" htmlFor="item-category">
              <Select
                id="item-category"
                value={form.categoryId}
                onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Görsel" htmlFor="item-image" error={errors.imageUrl}>
            <Select
              id="item-image"
              value={form.imageUrl}
              onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
            >
              {BUNDLED_IMAGES.map((image) => (
                <option key={image} value={image}>
                  {image.replace('/images/menu/', '').replace('.webp', '')}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Etiket" htmlFor="item-badge">
            <Select
              id="item-badge"
              value={form.badge}
              onChange={(event) =>
                setForm({ ...form, badge: event.target.value as ItemBadge | '' })
              }
            >
              {BADGE_OPTIONS.map((badge) => (
                <option key={badge || 'none'} value={badge}>
                  {badge === '' ? 'Yok' : BADGE_LABELS[badge]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="İçerik / alerjen notu" htmlFor="item-allergen">
            <TextArea
              id="item-allergen"
              rows={2}
              value={form.allergenNote}
              onChange={(event) => setForm({ ...form, allergenNote: event.target.value })}
            />
          </Field>

          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSubmit}>
              Kaydet
            </Button>
            <Button
              onClick={() => {
                setForm(null);
                setErrors({});
              }}
            >
              Vazgeç
            </Button>
          </div>
        </div>
      )}

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-3"
          >
            <img
              src={item.imageUrl}
              alt=""
              width={600}
              height={450}
              loading="lazy"
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate font-semibold text-ink">{item.name}</p>
                <span className="shrink-0 font-semibold text-accent">
                  {formatPrice(item.price)}
                </span>
              </div>

              {item.group && (
                <p className="mt-0.5 truncate text-[11px] tracking-wide text-highlight uppercase">
                  {item.group}
                </p>
              )}
              <p className="mt-0.5 truncate text-sm text-muted">{item.description}</p>

              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                {item.badge && (
                  <span className="rounded-full bg-ink px-2 py-0.5 font-semibold text-page">
                    {BADGE_LABELS[item.badge]}
                  </span>
                )}
                {item.soldOut && (
                  <span className="rounded-full bg-accent px-2 py-0.5 font-semibold text-on-accent">
                    Tükendi
                  </span>
                )}
              </div>

              <div className="mt-2.5 flex flex-wrap gap-2">
                <Button onClick={() => setForm(formFromItem(item))}>Düzenle</Button>
                <Button onClick={() => menuActions.toggleSoldOut(item.id)}>
                  {item.soldOut ? 'Stoğa al' : 'Tükendi'}
                </Button>
                <Button variant="danger" onClick={() => handleDelete(item)}>
                  Sil
                </Button>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-1.5">
              <IconButton
                label={`${item.name} yukarı taşı`}
                disabled={index === 0}
                onClick={() => menuActions.moveItem(item.id, 'up')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 12V4M4 8l4-4 4 4" />
                </svg>
              </IconButton>
              <IconButton
                label={`${item.name} aşağı taşı`}
                disabled={index === items.length - 1}
                onClick={() => menuActions.moveItem(item.id, 'down')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 4v8M4 8l4 4 4-4" />
                </svg>
              </IconButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
