// jsdom'da IntersectionObserver yok. Testlerin "öğe görünüme girdi" anını
// elle tetikleyebilmesi için kontrol edilebilir bir taklit kuruyoruz.

import { vi } from 'vitest';

interface ObserverRecord {
  callback: IntersectionObserverCallback;
  instance: IntersectionObserver;
  elements: Set<Element>;
  disconnected: boolean;
}

export const observerRegistry: ObserverRecord[] = [];

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly scrollMargin: string = '';
  readonly thresholds: readonly number[] = [];

  private record: ObserverRecord;

  constructor(callback: IntersectionObserverCallback) {
    this.record = {
      callback,
      instance: this,
      elements: new Set(),
      disconnected: false,
    };
    observerRegistry.push(this.record);
  }

  observe(element: Element): void {
    this.record.elements.add(element);
  }

  unobserve(element: Element): void {
    this.record.elements.delete(element);
  }

  disconnect(): void {
    this.record.elements.clear();
    this.record.disconnected = true;
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

export function installIntersectionObserverMock(): void {
  observerRegistry.length = 0;
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
}

/**
 * Gözlenen tüm öğeler için kesişim olayı tetikler.
 * Gerçek tarayıcı davranışını taklit eder: yalnızca hâlâ gözlenen öğeler bildirilir.
 */
export function triggerIntersection(isIntersecting: boolean): void {
  for (const record of observerRegistry) {
    if (record.disconnected || record.elements.size === 0) continue;
    const entries = [...record.elements].map(
      (element) =>
        ({
          target: element,
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
          boundingClientRect: element.getBoundingClientRect(),
          intersectionRect: element.getBoundingClientRect(),
          rootBounds: null,
          time: 0,
        }) as IntersectionObserverEntry,
    );
    record.callback(entries, record.instance);
  }
}

/** Şu an gözlenen toplam öğe sayısı — "observer hiç kurulmadı" testleri için. */
export function observedElementCount(): number {
  return observerRegistry
    .filter((record) => !record.disconnected)
    .reduce((total, record) => total + record.elements.size, 0);
}
