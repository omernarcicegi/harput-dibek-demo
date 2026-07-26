// jsdom matchMedia sağlamaz. Testlerin hareket azaltma tercihini
// değiştirebilmesi için kontrol edilebilir bir taklit.

import { vi } from 'vitest';

let prefersReducedMotion = false;
type ChangeListener = () => void;
const listeners = new Set<ChangeListener>();

/** Tercihi değiştirir; render'dan ÖNCE çağrılmalı. */
export function setPrefersReducedMotion(value: boolean): void {
  prefersReducedMotion = value;
  for (const listener of listeners) listener();
}

export function installMatchMediaMock(): void {
  prefersReducedMotion = false;
  listeners.clear();

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => {
      const isMotionQuery = query.includes('prefers-reduced-motion');
      return {
        get matches() {
          return isMotionQuery ? prefersReducedMotion : false;
        },
        media: query,
        onchange: null,
        addEventListener: (_event: string, listener: ChangeListener) => {
          if (isMotionQuery) listeners.add(listener);
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
