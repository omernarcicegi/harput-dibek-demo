// Üç sayfalık bir demo için minimal yönlendirici.
//
// react-router yerine bu tercih edildi: parametre yok, iç içe rota yok,
// veri yükleyici yok. ~40 satır, sıfır bağımlılık ve ~15 KB daha küçük paket.

import { useCallback, useSyncExternalStore, type ReactNode } from 'react';

const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('popstate', listener);
  };
}

/**
 * Sitenin sunulduğu taban yol. Kökte "/", GitHub Pages gibi alt dizinde
 * "/depo-adi/" olur. Vite derleme sırasında doldurur.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Taban yolu çıkarıp uygulama içi yolu verir. */
function stripBase(pathname: string): string {
  if (BASE && pathname.startsWith(BASE)) return pathname.slice(BASE.length) || '/';
  return pathname;
}

function getPathname(): string {
  if (typeof window === 'undefined') return '/';
  // Sondaki eğik çizgiyi at, böylece "/admin" ve "/admin/" aynı rotadır.
  const path = stripBase(window.location.pathname).replace(/\/+$/, '');
  return path === '' ? '/' : path;
}

/** Uygulama içi yolu tarayıcıya verilecek tam yola çevirir. */
export function href(to: string): string {
  return `${BASE}${to}`.replace(/\/{2,}/g, '/') || '/';
}

/** Geçerli yolu döndürür ve değiştiğinde bileşeni yeniden render eder. */
export function useRoute(): string {
  return useSyncExternalStore(subscribe, getPathname, () => '/');
}

/** Sayfa yenilemeden başka bir yola gider. */
export function navigate(to: string): void {
  if (getPathname() === to) return;
  window.history.pushState({}, '', href(to));
  notify();
  window.scrollTo(0, 0);
}

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

/** Sayfa yenilemeyen bağlantı. Yeni sekmede açma (Cmd/Ctrl+tık) korunur. */
export function Link({ to, children, className }: LinkProps) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      navigate(to);
    },
    [to],
  );

  return (
    <a href={href(to)} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
