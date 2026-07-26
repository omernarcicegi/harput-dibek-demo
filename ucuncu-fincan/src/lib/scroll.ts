// Bölümler arası yumuşak geçiş.

/**
 * Verilen bölüme kaydırır.
 * Hareket azaltma açıkken anında atlar (yumuşak kaydırma da bir animasyondur).
 */
export function scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const prefersReduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  element.scrollIntoView({
    behavior: prefersReduced ? 'auto' : 'smooth',
    block: 'start',
  });
}
