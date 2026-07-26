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

function getPathname(): string {
  if (typeof window === 'undefined') return '/';
  // Sondaki eğik çizgiyi at, böylece "/admin" ve "/admin/" aynı rotadır.
  const path = window.location.pathname.replace(/\/+$/, '');
  return path === '' ? '/' : path;
}

/** Geçerli yolu döndürür ve değiştiğinde bileşeni yeniden render eder. */
export function useRoute(): string {
  return useSyncExternalStore(subscribe, getPathname, () => '/');
}

/** Sayfa yenilemeden başka bir yola gider. */
export function navigate(to: string): void {
  if (getPathname() === to) return;
  window.history.pushState({}, '', to);
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
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
