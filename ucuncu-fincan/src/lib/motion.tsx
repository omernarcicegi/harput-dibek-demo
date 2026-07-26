// Kaydırma animasyonlarının tek yeri.
//
// IntersectionObserver kurulumu, tek seferlik tetikleme, sıralı belirme (stagger)
// ve hareket azaltma tercihi burada kapsanır. Bileşenler sadece <Reveal> kullanır.

import { useEffect, useRef, useState, type ReactNode } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Stagger gecikmesi (ms). Referans aralık 60–80 ms. */
export const STAGGER_STEP_MS = 70;

/**
 * Gecikmenin uygulanacağı en fazla öğe sayısı.
 * Sınır olmasaydı 20 ürünlük listede son kart 1,4 sn beklerdi.
 */
export const STAGGER_MAX_STEPS = 8;

export function staggerDelayMs(index: number): number {
  return Math.min(index, STAGGER_MAX_STEPS) * STAGGER_STEP_MS;
}

/** Kullanıcı işletim sisteminde hareketi azaltmayı seçmiş mi? */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = () => setPrefersReduced(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
}

interface RevealProps {
  children: ReactNode;
  /** Grup içindeki sıra; sıralı belirme gecikmesini belirler. */
  index?: number;
  className?: string;
  /** Öğenin ne kadarı görününce tetiklensin. */
  threshold?: number;
}

/**
 * Görünüm alanına giren içeriği aşağıdan yukarı kaydırarak belirir.
 * Her öğe için yalnızca bir kez tetiklenir; sonra gözlem bırakılır.
 *
 * Hareket azaltma açıkken IntersectionObserver hiç kurulmaz ve içerik
 * ilk render'da görünür durumdadır.
 */
export function Reveal({ children, index = 0, className = '', threshold = 0.15 }: RevealProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(prefersReduced);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Tercih sonradan açılırsa içeriği anında göster ve gözlem kurma.
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    // Test ortamı veya çok eski tarayıcı: API yoksa içeriği gizli bırakma.
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setIsVisible(true);
          // Tek seferlik: geri kaydırınca animasyon yeniden oynamasın.
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '0px 0px -5% 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [prefersReduced, threshold]);

  return (
    <div
      ref={elementRef}
      data-visible={isVisible ? 'true' : 'false'}
      className={`reveal ${className}`}
      style={
        // Gecikme yalnızca giriş animasyonu için anlamlı.
        prefersReduced ? undefined : { transitionDelay: `${staggerDelayMs(index)}ms` }
      }
    >
      {children}
    </div>
  );
}
