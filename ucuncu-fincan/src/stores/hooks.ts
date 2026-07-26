// Depoları React'e bağlayan kancalar.
// useSyncExternalStore sayesinde admin panelindeki değişiklik,
// aynı state'i okuyan müşteri menüsüne aynı render turunda yansır.

import { useSyncExternalStore } from 'react';
import { menuStore } from './menuStore';
import { siteInfoStore } from './siteInfoStore';
import type { MenuState, SiteInfoState } from '../types';

export function useMenu(): MenuState {
  return useSyncExternalStore(
    menuStore.subscribe,
    menuStore.getSnapshot,
    menuStore.getSnapshot,
  );
}

export function useSiteInfo(): SiteInfoState {
  return useSyncExternalStore(
    siteInfoStore.subscribe,
    siteInfoStore.getSnapshot,
    siteInfoStore.getSnapshot,
  );
}
