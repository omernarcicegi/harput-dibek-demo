// Tam ekran açılış bölümü: fotoğraf, kafe adı, slogan ve tek çağrı düğmesi.

import { brand } from '../config/brand';
import { scrollToSection } from '../lib/scroll';

export function Hero() {
  return (
    <section
      className="snap-panel relative flex min-h-[100dvh] flex-col justify-end overflow-hidden"
      aria-label={`${brand.name} açılış`}
    >
      <img
        src={brand.hero.image}
        alt={brand.hero.imageAlt}
        width={1080}
        height={1440}
        // LCP görseli: geç yükleme yok, öncelikli indirilir.
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/*
        Metin fotoğrafın üstünde değil, alttan yükselen krem alanda duruyor.
        Koyu kahve metin krem zeminde ~13:1 kontrast veriyor — fotoğraf
        ne kadar açık ya da koyu olursa olsun okunabilirlik garanti.
      */}
      <div className="photo-scrim absolute inset-x-0 bottom-0 h-[78%]" aria-hidden="true" />

      <div className="relative px-5 pb-32 sm:px-8 md:pb-36">
        <p className="mb-3 text-xs font-semibold tracking-[0.28em] text-highlight uppercase">
          {brand.hero.eyebrow}
        </p>

        <h1 className="text-[clamp(3.25rem,17vw,8rem)] text-ink">{brand.name}</h1>

        <p className="mt-1 font-accent text-2xl text-accent italic sm:text-3xl">
          {brand.nameAccent}
        </p>

        <p className="mt-4 max-w-md text-lg text-muted">{brand.tagline}</p>

        <button
          type="button"
          onClick={() => scrollToSection('menu')}
          className="press mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-8 text-base font-semibold text-on-accent shadow-lg"
        >
          {brand.hero.ctaLabel}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 3v12M4 10l5 5 5-5" />
          </svg>
        </button>
      </div>
    </section>
  );
}
