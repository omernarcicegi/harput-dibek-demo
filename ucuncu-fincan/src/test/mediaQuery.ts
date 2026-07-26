// jsdom matchMedia sağlamaz. Testlerin hareket azaltma tercihini
// değiştirebilmesi için kontrol edilebilir bir taklit.

import { vi } from 'vitest';

let prefersReducedMotion = false;
let prefersDark = false;
type ChangeListener = () => void;
const listeners = new Set<ChangeListener>();

/** Hareket azaltma tercihini değiştirir; render'dan ÖNCE çağrılmalı. */
export function setPrefersReducedMotion(value: boolean): void {
  prefersReducedMotion = value;
  for (const listener of listeners) listener();
}

/** Sistem koyu tema tercihini değiştirir; modül import'undan ÖNCE çağrılmalı. */
export function setPrefersDark(value: boolean): void {
  prefersDark = value;
  for (const listener of listeners) listener();
}

export function installMatchMediaMock(): void {
  prefersReducedMotion = false;
  prefersDark = false;
  listeners.clear();

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => {
      const isMotionQuery = query.includes('prefers-reduced-motion');
      const isDarkQuery = query.includes('prefers-color-scheme: dark');
      return {
        get matches() {
          if (isMotionQuery) return prefersReducedMotion;
          if (isDarkQuery) return prefersDark;
          return false;
        },
        media: query,
        onchange: null,
        addEventListener: (_event: string, listener: ChangeListener) => {
          if (isMotionQuery || isDarkQuery) listeners.add(listener);
        },
        removeEventListener: (_event: string, listener: ChangeListener) => {
          listeners.delete(listener);
        },
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }),
  );
}
