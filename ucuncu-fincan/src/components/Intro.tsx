// Açılış perdesi: ilk yüklemede kafe adı belirir, sonra siteye geçilir.
// Toplam süre 1000 ms (kabul kriteri: 1,2 sn'yi geçmemeli).

import { useEffect, useState } from 'react';
import { brand } from '../config/brand';
import { usePrefersReducedMotion } from '../lib/motion';

const INTRO_SEEN_KEY = 'cafe.introSeen';
const INTRO_DURATION_MS = 1000;

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
      className="intro-curtain fixed inset-0 z-100 flex flex-col items-center justify-center bg-page px-6"
      // Ekran okuyucu perdeyi okumasın; asıl içerik zaten arkada.
      aria-hidden="true"
    >
      <h1 className="intro-name text-center text-[clamp(3rem,16vw,7rem)] leading-[0.9] text-ink">
        {brand.name}
      </h1>
      <p className="intro-tagline mt-3 font-accent text-xl text-accent italic">
        {brand.nameAccent}
      </p>
    </div>
  );
}
