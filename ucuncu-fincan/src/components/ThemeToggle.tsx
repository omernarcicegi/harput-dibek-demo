// Açık/koyu tema düğmesi.

import { useSyncExternalStore } from 'react';
import { themeStore } from '../stores/themeStore';

export function useResolvedTheme(): 'light' | 'dark' {
  return useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getResolved,
    () => 'light' as const,
  );
}

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const resolved = useResolvedTheme();
  const goingDark = resolved === 'light';

  return (
    <button
      type="button"
      onClick={() => themeStore.toggle()}
      aria-label={goingDark ? 'Koyu temaya geç' : 'Açık temaya geç'}
      title={goingDark ? 'Koyu tema' : 'Açık tema'}
      className={`press flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink ${className}`}
    >
      {goingDark ? (
        // Ay ikonu — koyu temaya geçiş
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      ) : (
        // Güneş ikonu — açık temaya geçiş
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
