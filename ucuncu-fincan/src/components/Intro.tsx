// Açılış perdesi: koyu zemine yukarıdan kahve dökülür, akıntı ekranı basar
// ve perde kalkarak siteyi açar.
//
// Toplam süre 1120 ms (kabul kriteri: 1,2 sn'yi geçmemeli).
// Tüm hareketler yalnızca transform ve opacity ile yapılır.

import { useEffect, useState } from 'react';
import { brand } from '../config/brand';
import { usePrefersReducedMotion } from '../lib/motion';

const INTRO_SEEN_KEY = 'cafe.introSeen';
const INTRO_DURATION_MS = 1120;

/** Akıntının çevresine saçılan damlacıklar: [sol%, üst%, çap(px), gecikme(ms)] */
const DROPLETS: [number, number, number, number][] = [
  [38, 34, 10, 240],
  [63, 30, 7, 300],
  [33, 52, 6, 340],
  [68, 56, 9, 280],
  [42, 66, 5, 380],
  [59, 70, 7, 420],
];

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
      className="intro-curtain fixed inset-0 z-100 overflow-hidden"
      // Renk yapılandırmadan gelir; perde iki temada da koyu kalır.
      style={{ backgroundColor: brand.intro.curtainBg }}
      // Ekran okuyucu perdeyi okumasın; asıl içerik zaten arkada.
      aria-hidden="true"
    >
      {/*
        Dökülen akıntı. Ekranın ortasında dar bir şerit olarak başlar,
        aşağı doğru uzar, sonra yanlara taşarak ekranı basar.
      */}
      <svg
        className="pour-stream absolute inset-y-0 left-1/2 h-full w-16 -translate-x-1/2 text-gold"
        viewBox="0 0 64 400"
        preserveAspectRatio="none"
      >
        <path
          d="M32 0 C20 60, 44 110, 32 165 C20 220, 44 275, 32 330 C26 360, 30 380, 32 400"
          fill="none"
          stroke="currentColor"
          strokeWidth="22"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Sıçrayan damlacıklar */}
      {DROPLETS.map(([left, top, size, delay]) => (
        <span
          key={`${left}-${top}`}
          className="intro-droplet absolute rounded-full bg-gold"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
            animationDelay: `${delay}ms`,
          }}
        />
      ))}

      {/* Logo ve kafe adı akıntının önünde durur. */}
      <div
        className="intro-content relative flex h-full flex-col items-center justify-center gap-4 px-6"
        style={{ color: brand.intro.curtainInk }}
      >
        <img
          src={brand.logo.small}
          alt=""
          width={320}
          height={320}
          className="intro-name h-24 w-24 rounded-full shadow-2xl"
        />
        <h1 className="intro-name text-center text-[clamp(2.25rem,12vw,4.5rem)]">
          {brand.name}
        </h1>
        <p className="intro-tagline font-accent text-lg italic">{brand.nameAccent}</p>
      </div>
    </div>
  );
}
