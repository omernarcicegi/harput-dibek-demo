// Çalışma saatleri ve iletişim bilgileri.
// Menüden ayrı bir depoda tutulur: farklı konular, farklı güncelleme sıklığı.

import { createPersistentStore } from '../lib/createPersistentStore';
import { SITE_INFO_SCHEMA_VERSION, createSeedSiteInfo } from '../data/seed';
import type { ContactInfo, DayHours, SiteInfoState, WeekDay } from '../types';

export const SITE_INFO_STORAGE_KEY = 'cafe.siteinfo.v1';

const WEEK_DAYS: readonly string[] = [
  'pazartesi',
  'sali',
  'carsamba',
  'persembe',
  'cuma',
  'cumartesi',
  'pazar',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseDayHours(raw: unknown): DayHours | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.day !== 'string' || !WEEK_DAYS.includes(raw.day)) return null;
  if (typeof raw.closed !== 'boolean') return null;
  if (typeof raw.openTime !== 'string') return null;
  if (typeof raw.closeTime !== 'string') return null;
  return {
    day: raw.day as WeekDay,
    closed: raw.closed,
    openTime: raw.openTime,
    closeTime: raw.closeTime,
  };
}

function parseContact(raw: unknown): ContactInfo | null {
  if (!isRecord(raw)) return null;
  const fields = ['address', 'phoneDisplay', 'phoneDial', 'mapsUrl', 'instagramUrl'] as const;
  for (const field of fields) {
    if (typeof raw[field] !== 'string') return null;
  }
  return {
    address: raw.address as string,
    phoneDisplay: raw.phoneDisplay as string,
    phoneDial: raw.phoneDial as string,
    mapsUrl: raw.mapsUrl as string,
    instagramUrl: raw.instagramUrl as string,
  };
}

export function parseSiteInfoState(raw: unknown): SiteInfoState | null {
  if (!isRecord(raw)) return null;
  if (!Array.isArray(raw.hours)) return null;

  const hours: DayHours[] = [];
  for (const candidate of raw.hours) {
    const day = parseDayHours(candidate);
    if (!day) return null;
    hours.push(day);
  }
  // Haftanın yedi günü de bulunmalı; eksikse veri güvenilir değildir.
  if (hours.length !== WEEK_DAYS.length) return null;

  const contact = parseContact(raw.contact);
  if (!contact) return null;

  return { schemaVersion: SITE_INFO_SCHEMA_VERSION, hours, contact };
}

// --- Dönüştürücüler (saf) --------------------------------------------------

export function updateDayHours(
  state: SiteInfoState,
  day: WeekDay,
  patch: Partial<Omit<DayHours, 'day'>>,
): SiteInfoState {
  return {
    ...state,
    hours: state.hours.map((entry) => (entry.day === day ? { ...entry, ...patch } : entry)),
  };
}

export function updateContact(
  state: SiteInfoState,
  patch: Partial<ContactInfo>,
): SiteInfoState {
  return { ...state, contact: { ...state.contact, ...patch } };
}

// --- Depo ------------------------------------------------------------------

export const siteInfoStore = createPersistentStore<SiteInfoState>({
  storageKey: SITE_INFO_STORAGE_KEY,
  schemaVersion: SITE_INFO_SCHEMA_VERSION,
  createSeed: createSeedSiteInfo,
  parse: parseSiteInfoState,
});

export const siteInfoActions = {
  updateDayHours: (day: WeekDay, patch: Partial<Omit<DayHours, 'day'>>) =>
    siteInfoStore.update((state) => updateDayHours(state, day, patch)),
  updateContact: (patch: Partial<ContactInfo>) =>
    siteInfoStore.update((state) => updateContact(state, patch)),
  reset: () => siteInfoStore.reset(),
};
