// Ekranda gösterilecek değerlerin Türkçe biçimlendirmesi.

import type { DayHours, WeekDay } from '../types';

const priceFormatter = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Fiyatı yayınlanmamış ürünler için gösterilen metin.
 * Paket ürünlerde raf fiyatı menüde yayınlanmıyor (kaynak menüde de "0").
 */
export const PRICE_ON_REQUEST_LABEL = 'Mağazada';

/** 145 → "145 ₺" ; 0 → "Mağazada" */
export function formatPrice(price: number): string {
  if (price <= 0) return PRICE_ON_REQUEST_LABEL;
  return `${priceFormatter.format(price)} ₺`;
}

/**
 * JavaScript'in gün numarasını (0 = pazar) bizim anahtarlarımıza çevirir.
 */
const DAY_BY_INDEX: readonly WeekDay[] = [
  'pazar',
  'pazartesi',
  'sali',
  'carsamba',
  'persembe',
  'cuma',
  'cumartesi',
];

export function getTodayKey(now: Date = new Date()): WeekDay {
  return DAY_BY_INDEX[now.getDay()];
}

/** "08:00" → dakika cinsinden 480. Geçersiz biçimde null döner. */
function toMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/**
 * Kafe şu an açık mı?
 * Kapanış saati açılıştan küçükse (örn. 20:00 → 02:00) gece yarısını aşan
 * vardiya kabul edilir.
 */
export function isOpenNow(hours: DayHours[], now: Date = new Date()): boolean {
  const today = hours.find((entry) => entry.day === getTodayKey(now));
  if (!today || today.closed) return false;

  const open = toMinutes(today.openTime);
  const close = toMinutes(today.closeTime);
  if (open === null || close === null) return false;

  const current = now.getHours() * 60 + now.getMinutes();
  if (close <= open) return current >= open || current < close;
  return current >= open && current < close;
}

export function formatDayHours(entry: DayHours): string {
  return entry.closed ? 'Kapalı' : `${entry.openTime} – ${entry.closeTime}`;
}
