// Açılış perdesi: logo belirir, altındaki fincan kahveyle dolar, sonra siteye geçilir.
// Toplam süre 1160 ms (kabul kriteri: 1,2 sn'yi geçmemeli).

import { useEffect, useState } from 'react';
import { brand } from '../config/brand';
import { usePrefersReducedMotion } from '../lib/motion';

const INTRO_SEEN_KEY = 'cafe.introSeen';
const INTRO_DURATION_MS = 1160;

/** sessionStorage kapalıysa (özel mod) uygulama çökmemeli. */
function hasSeenIntro(): boolean {
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markIntroSeen(): void {
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, '1');
  } catch {
    // Kaydedilemezse en fazla açılış bir kez daha oynar; kritik değil.
  }
}

/**
 * Açılış perdesinin gösterilip gösterilmeyeceğine karar verir.
 * Aynı oturumda ikinci kez ve hareket azaltma açıkken hiç gösterilmez.
 */
export function useIntro(): { showIntro: boolean; dismissIntro: () => void } {
  const prefersReduced = usePrefersReducedMotion();
  const [showIntro, setShowIntro] = useState(() => !hasSeenIntro());

  useEffect(() => {
    if (prefersReduced && showIntro) {
      markIntroSeen();
      setShowIntro(false);
    }
  }, [prefersReduced, showIntro]);

  return {
    showIntro: showIntro && !prefersReduced,
    dismissIntro: () => {
      markIntroSeen();
      setShowIntro(false);
    },
  };
}

interface IntroProps {
  onDone: () => void;
}

export function Intro({ onDone }: IntroProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, INTRO_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="intro-curtain fixed inset-0 z-100 flex flex-col items-center justify-center gap-6 bg-page px-6"
      // Ekran okuyucu perdeyi okumasın; asıl içerik zaten arkada.
      aria-hidden="true"
    >
      <img
        src={brand.logo.small}
        alt=""
        width={320}
        height={320}
        className="intro-name h-24 w-24 rounded-full"
      />

      <h1 className="intro-name text-center text-[clamp(2.5rem,13vw,5rem)] text-ink">
        {brand.name}
      </h1>

      {/* Dolan fincan */}
      <div className="intro-tagline relative flex items-end">
        <span className="absolute -right-3 top-3 h-6 w-6 rounded-full border-[3px] border-ink/40" />
        <div className="relative h-[52px] w-[42px] overflow-hidden rounded-b-[18px] rounded-t-[4px] border-[3px] border-ink/40">
          <div className="coffee-pour absolute inset-x-0 bottom-0 h-full bg-gold" />
        </div>
      </div>

      <p className="intro-tagline font-accent text-lg text-accent italic">{brand.nameAccent}</p>
    </div>
  );
}
