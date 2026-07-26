// Ekranın altında sabit gezinme çubuğu — tek elle kullanılabilsin diye.
// Hangi bölümde olunduğu IntersectionObserver ile izlenir.

import { useEffect, useState } from 'react';
import { brand } from '../config/brand';
import { scrollToSection } from '../lib/scroll';
import { ThemeToggle } from './ThemeToggle';

const NAV_ICONS: Record<string, React.ReactNode> = {
  menu: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  ),
  hakkimizda: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20V8l8-4 8 4v12" />
      <path d="M9 20v-6h6v6" />
    </svg>
  ),
  iletisim: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
};

export function BottomNav() {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const sections = brand.nav
      .map((entry) => document.getElementById(entry.id))
      .filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Ekranın ortasına en yakın bölüm etkin sayılır.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Bölüm gezinmesi"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-page/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm"
    >
      <ul className="mx-auto flex max-w-lg items-center">
        {brand.nav.map((entry) => {
          const isActive = activeSection === entry.id;
          return (
            <li key={entry.id} className="flex-1">
              <button
                type="button"
                onClick={() => scrollToSection(entry.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`press flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-2 py-2 text-[11px] font-semibold transition-colors ${
                  isActive ? 'text-accent' : 'text-muted'
                }`}
              >
                {NAV_ICONS[entry.id]}
                {entry.label}
              </button>
            </li>
          );
        })}

        {/*
          Tema düğmesi çubuğun sonunda: yüzen düğme olarak dururken
          iletişim bölümündeki saat tablosunun üstünü kapatıyordu.
        */}
        <li className="shrink-0 border-l border-line/60 px-2">
          <ThemeToggle className="border-0 bg-transparent" />
        </li>
      </ul>
    </nav>
  );
}
