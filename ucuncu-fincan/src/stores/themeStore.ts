// Tema tercihi: açık, koyu ya da cihazın sistem ayarı.
//
// Seçim <html data-theme="..."> özniteliğiyle uygulanır; renkler zaten
// index.html'e gömülü CSS değişkenlerinden gelir (vite.config.ts).
// Tercih yoksa öznitelik hiç yazılmaz ve prefers-color-scheme devreye girer.

export type ThemePreference = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'cafe.theme';

function readPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Depolama kapalı olabilir; sistem tercihine düşeriz.
  }
  return 'system';
}

function writePreference(preference: ThemePreference): void {
  try {
    if (preference === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Kaydedilemezse tercih yalnızca bu sayfa açıkken geçerli olur.
  }
}

function applyToDocument(preference: ThemePreference): void {
  const root = document.documentElement;
  if (preference === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', preference);
}

let preference: ThemePreference = typeof window === 'undefined' ? 'system' : readPreference();
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

/** Sistem koyu tema mı istiyor? */
function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const themeStore = {
  getPreference: () => preference,
  /** Ekranda o an hangi tema görünüyor? */
  getResolved: (): 'light' | 'dark' =>
    preference === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : preference,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  set: (next: ThemePreference) => {
    preference = next;
    writePreference(next);
    applyToDocument(next);
    notify();
  },
  /** Açık ↔ koyu arasında geçiş yapar; sistem seçiliyken görünenin tersine geçer. */
  toggle: () => {
    const resolved = themeStore.getResolved();
    themeStore.set(resolved === 'dark' ? 'light' : 'dark');
  },
};

// Sistem teması değişirse (kullanıcı tercihi yokken) aboneleri uyar.
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (preference === 'system') notify();
  });
}
