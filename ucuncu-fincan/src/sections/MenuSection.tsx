// Menü: kategori sekmeleri, alt grup başlıkları ve ürün kartları.
// Karta dokununca ürün detayı alttan açılan panelde gösterilir.

import { useEffect, useMemo, useRef, useState } from 'react';
import { BADGE_LABELS, brand } from '../config/brand';
import { formatPrice } from '../lib/format';
import { Reveal } from '../lib/motion';
import { selectCategories, selectItemsByCategory } from '../stores/menuStore';
import { useMenu } from '../stores/hooks';
import { BottomSheet } from '../components/BottomSheet';
import type { ItemBadge, MenuItem } from '../types';
import { asset } from '../lib/asset';

const BADGE_STYLES: Record<ItemBadge, string> = {
  yeni: 'bg-gold text-on-gold',
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

/** Ürünleri alt gruplara böler; grup sırası ürün sırasını korur. */
function groupItems(items: MenuItem[]): { group: string | null; items: MenuItem[] }[] {
  const blocks: { group: string | null; items: MenuItem[] }[] = [];
  for (const item of items) {
    const last = blocks[blocks.length - 1];
    if (last && last.group === item.group) last.items.push(item);
    else blocks.push({ group: item.group, items: [item] });
  }
  return blocks;
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
  const blocks = useMemo(() => groupItems(items), [items]);

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
        /*
          Yapışkan şerit: kategoriler uzun menüde her zaman erişilebilir olsun.
          Zemin opak olmalı — şeffaf bırakılınca altından geçen kartlar
          yazıların arasından görünüyordu.
        */
        className="no-scrollbar sticky top-0 z-20 -mx-5 mt-8 flex gap-2 overflow-x-auto border-b border-line/60 bg-page px-5 py-3 sm:-mx-8 sm:px-8"
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
                  ? 'bg-gold text-on-gold shadow-md'
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
        className="category-enter mt-6"
      >
        {items.length === 0 ? (
          <p className="text-muted">Bu kategoride henüz ürün yok.</p>
        ) : (
          blocks.map((block) => (
            <div key={block.group ?? 'diger'} className="mt-8 first:mt-0">
              {block.group && (
                <Reveal>
                  <h3 className="mb-4 flex items-center gap-3 text-xl text-highlight">
                    <span className="h-px w-6 shrink-0 bg-gold" aria-hidden="true" />
                    {block.group}
                  </h3>
                </Reveal>
              )}

              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {block.items.map((item, index) => (
                  <Reveal key={item.id} index={index}>
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="press h-full w-full overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-sm"
                    >
                      <div className="relative">
                        <img
                          src={asset(item.imageUrl)}
                          alt={item.name}
                          width={480}
                          height={480}
                          loading="lazy"
                          decoding="async"
                          className={`aspect-square w-full object-cover ${
                            item.soldOut ? 'opacity-45 grayscale' : ''
                          }`}
                        />

                        {item.badge && (
                          <span className="absolute top-2 left-2">
                            <Badge badge={item.badge} />
                          </span>
                        )}

                        {item.soldOut && (
                          <span className="absolute top-2 right-2 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold tracking-wide text-page uppercase">
                            Tükendi
                          </span>
                        )}
                      </div>

                      <div className="p-3 sm:p-4">
                        <h4 className="font-display text-lg leading-tight text-ink uppercase sm:text-xl">
                          {item.name}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-xs text-muted sm:text-sm">
                          {item.description}
                        </p>
                        <span className="mt-2 inline-block font-display text-lg text-accent sm:text-xl">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
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
              src={asset(liveSelectedItem.imageUrl)}
              alt={liveSelectedItem.name}
              width={480}
              height={480}
              className="mx-auto aspect-square w-full max-w-xs rounded-2xl object-cover"
            />

            <div className="mt-5 flex items-start justify-between gap-4">
              <h3 className="text-3xl text-ink sm:text-4xl">{liveSelectedItem.name}</h3>
              <span className="shrink-0 font-display text-2xl text-accent sm:text-3xl">
                {formatPrice(liveSelectedItem.price)}
              </span>
            </div>

            {(liveSelectedItem.group || liveSelectedItem.badge || liveSelectedItem.soldOut) && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {liveSelectedItem.group && (
                  <span className="text-xs font-semibold tracking-[0.2em] text-highlight uppercase">
                    {liveSelectedItem.group}
                  </span>
                )}
                {liveSelectedItem.badge && <Badge badge={liveSelectedItem.badge} />}
                {liveSelectedItem.soldOut && (
                  <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold tracking-wide text-page uppercase">
                    Tükendi
                  </span>
                )}
              </div>
            )}

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
