// Menü: kategori sekmeleri ve ürün kartları.
// Karta dokununca ürün detayı alttan açılan panelde gösterilir.

import { useEffect, useMemo, useRef, useState } from 'react';
import { BADGE_LABELS, brand } from '../config/brand';
import { formatPrice } from '../lib/format';
import { Reveal } from '../lib/motion';
import { selectCategories, selectItemsByCategory } from '../stores/menuStore';
import { useMenu } from '../stores/hooks';
import { BottomSheet } from '../components/BottomSheet';
import type { ItemBadge, MenuItem } from '../types';

const BADGE_STYLES: Record<ItemBadge, string> = {
  yeni: 'bg-accent text-on-accent',
  'cok-satan': 'bg-ink text-page',
  vegan: 'bg-highlight text-page',
};

function Badge({ badge }: { badge: ItemBadge }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${BADGE_STYLES[badge]}`}
    >
      {BADGE_LABELS[badge]}
    </span>
  );
}

export function MenuSection() {
  const menu = useMenu();
  const categories = useMemo(() => selectCategories(menu), [menu]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Admin kategoriyi silmiş olabilir; seçili kategori yoksa ilkine dön.
  useEffect(() => {
    const stillExists = categories.some((category) => category.id === activeCategoryId);
    if (!stillExists && categories.length > 0) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  const items = useMemo(
    () => (activeCategoryId ? selectItemsByCategory(menu, activeCategoryId) : []),
    [menu, activeCategoryId],
  );

  // Panel açıkken ürün adminde güncellenirse gösterilen bilgi de tazelensin.
  const liveSelectedItem = useMemo(
    () => (selectedItem ? (menu.items.find((item) => item.id === selectedItem.id) ?? null) : null),
    [menu.items, selectedItem],
  );

  function handleTabKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + offset + categories.length) % categories.length;
    const nextCategory = categories[nextIndex];
    setActiveCategoryId(nextCategory.id);
    tabRefs.current[nextCategory.id]?.focus();
  }

  return (
    <section id="menu" className="scroll-mt-4 bg-page px-5 py-16 sm:px-8 md:py-24">
      <Reveal>
        <p className="text-xs font-semibold tracking-[0.28em] text-highlight uppercase">
          {brand.sections.menuEyebrow}
        </p>
        <h2 className="mt-2 text-[clamp(2.5rem,11vw,4.5rem)] text-ink">
          {brand.sections.menuTitle}
        </h2>
        <p className="mt-3 max-w-md text-muted">{brand.sections.menuSubtitle}</p>
      </Reveal>

      {/* Kategori sekmeleri: yatay kaydırılır, sayfa gövdesi kaymaz. */}
      <div
        role="tablist"
        aria-label="Menü kategorileri"
        className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8"
      >
        {categories.map((category, index) => {
          const isActive = category.id === activeCategoryId;
          return (
            <button
              key={category.id}
              ref={(element) => {
                tabRefs.current[category.id] = element;
              }}
              type="button"
              role="tab"
              id={`tab-${category.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${category.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveCategoryId(category.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`press min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-ink text-page'
                  : 'border border-line bg-surface text-muted hover:text-ink'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      <div
        // key: kategori değişince kartlar yeniden monte edilir ve
        // giriş animasyonu baştan oynar (sayfa yenilenmeden).
        key={activeCategoryId}
        id={`panel-${activeCategoryId}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeCategoryId}`}
        className="category-enter mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {items.length === 0 ? (
          <p className="text-muted">Bu kategoride henüz ürün yok.</p>
        ) : (
          items.map((item, index) => (
            <Reveal key={item.id} index={index}>
              <button
                type="button"
                onClick={() => setSelectedItem(item)}
                className="press w-full overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-sm"
              >
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    width={600}
                    height={450}
                    loading="lazy"
                    decoding="async"
                    className={`aspect-[4/3] w-full object-cover ${
                      item.soldOut ? 'opacity-45 grayscale' : ''
                    }`}
                  />

                  {item.badge && (
                    <span className="absolute top-3 left-3">
                      <Badge badge={item.badge} />
                    </span>
                  )}

                  {item.soldOut && (
                    <span className="absolute top-3 right-3 rounded-full bg-ink px-3 py-1 text-[11px] font-semibold tracking-wide text-page uppercase">
                      Tükendi
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-2xl leading-tight text-ink">{item.name}</h3>
                    <span className="shrink-0 font-display text-xl text-accent">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted">{item.description}</p>
                </div>
              </button>
            </Reveal>
          ))
        )}
      </div>

      <BottomSheet
        isOpen={liveSelectedItem !== null}
        onClose={() => setSelectedItem(null)}
        label={liveSelectedItem ? `${liveSelectedItem.name} detayı` : 'Ürün detayı'}
      >
        {liveSelectedItem && (
          <div className="px-5 pb-2">
            <img
              src={liveSelectedItem.imageUrl}
              alt={liveSelectedItem.name}
              width={600}
              height={450}
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />

            <div className="mt-5 flex items-start justify-between gap-4">
              <h3 className="text-4xl leading-none text-ink">{liveSelectedItem.name}</h3>
              <span className="shrink-0 font-display text-3xl text-accent">
                {formatPrice(liveSelectedItem.price)}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {liveSelectedItem.badge && <Badge badge={liveSelectedItem.badge} />}
              {liveSelectedItem.soldOut && (
                <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold tracking-wide text-page uppercase">
                  Tükendi
                </span>
              )}
            </div>

            <p className="mt-4 text-base text-ink">{liveSelectedItem.description}</p>

            <div className="mt-5 rounded-xl border border-line bg-surface p-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-highlight uppercase">
                İçerik ve alerjen
              </p>
              <p className="mt-1.5 text-sm text-muted">{liveSelectedItem.allergenNote}</p>
            </div>
          </div>
        )}
      </BottomSheet>
    </section>
  );
}
