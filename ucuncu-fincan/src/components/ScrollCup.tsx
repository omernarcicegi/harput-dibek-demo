// Sayfanın üstünde duran kaydırma göstergesi: ilerledikçe fincan kahveyle dolar.
//
// Dolum yalnızca `transform: scaleY()` ile yapılır (yükseklik animasyonu yok).
// Kaydırma olayı requestAnimationFrame ile sınırlanır, böylece her karede
// en fazla bir kez okuma/yazma olur.

import { useEffect, useRef } from 'react';

export function ScrollCup() {
  const liquidRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;

      liquidRef.current?.style.setProperty('--fill', String(progress));
      // Üstteki ince çubuk aynı oranı yatayda gösterir.
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    }

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-40"
      // Bir ilerleme göstergesi; ekran okuyucuya bilgi değeri yok.
      aria-hidden="true"
    >
      {/* İnce ilerleme çubuğu */}
      <div className="h-[3px] w-full bg-line/40">
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-gold"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Dolan fincan */}
      <div className="flex justify-end px-4 pt-2">
        <div className="relative flex items-end">
          {/* Kulp */}
          <span className="absolute -right-[7px] top-[7px] h-3.5 w-3.5 rounded-full border-2 border-ink/45" />
          {/* Fincan gövdesi */}
          <div className="relative h-[26px] w-[22px] overflow-hidden rounded-b-[10px] rounded-t-[3px] border-2 border-ink/45 bg-surface/70 backdrop-blur-sm">
            <div
              ref={liquidRef}
              className="coffee-liquid absolute inset-x-0 bottom-0 h-full bg-gold"
              style={{ ['--fill' as string]: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
