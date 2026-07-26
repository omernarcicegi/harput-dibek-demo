// QR'dan gelen müşterinin gördüğü sayfa.

import { brand } from '../config/brand';
import { Intro, useIntro } from '../components/Intro';
import { BottomNav } from '../components/BottomNav';
import { ScrollCup } from '../components/ScrollCup';
import { Link } from '../lib/router';
import { Hero } from '../sections/Hero';
import { StoryPanels } from '../sections/StoryPanels';
import { MenuSection } from '../sections/MenuSection';
import { AboutSection } from '../sections/AboutSection';
import { HistorySection } from '../sections/HistorySection';
import { SocialSection } from '../sections/SocialSection';
import { ContactSection } from '../sections/ContactSection';

export default function CustomerPage() {
  const { showIntro, dismissIntro } = useIntro();

  return (
    <>
      {showIntro && <Intro onDone={dismissIntro} />}

      <ScrollCup />

      {/* pb: sabit alt gezinme çubuğunun içeriği kapatmaması için */}
      <main className="pb-20">
        <Hero />
        <StoryPanels />
        <MenuSection />
        <AboutSection />
        <HistorySection />
        <SocialSection />
        <ContactSection />

        <footer className="bg-surface px-5 py-10 text-center sm:px-8">
          <img
            src={brand.logo.small}
            alt={brand.logo.alt}
            width={320}
            height={320}
            loading="lazy"
            className="mx-auto mb-4 h-16 w-16 rounded-full"
          />
          <p className="text-3xl text-ink">{brand.name}</p>
          <p className="mt-1 font-accent text-lg text-accent italic">{brand.nameAccent}</p>
          <p className="mt-3 text-sm text-muted">{brand.tagline}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm font-semibold">
            <Link
              to="/admin"
              className="press inline-flex min-h-11 items-center px-3 text-accent"
            >
              Yönetim paneli
            </Link>
            <Link to="/qr" className="press inline-flex min-h-11 items-center px-3 text-accent">
              QR masa kartı
            </Link>
          </div>
        </footer>
      </main>

      <BottomNav />
    </>
  );
}
