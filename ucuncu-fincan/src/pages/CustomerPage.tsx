// QR'dan gelen müşterinin gördüğü sayfa.

import { brand } from '../config/brand';
import { Intro, useIntro } from '../components/Intro';
import { BottomNav } from '../components/BottomNav';
import { Link } from '../lib/router';
import { Hero } from '../sections/Hero';
import { StoryPanels } from '../sections/StoryPanels';
import { MenuSection } from '../sections/MenuSection';
import { AboutSection } from '../sections/AboutSection';
import { ContactSection } from '../sections/ContactSection';

export default function CustomerPage() {
  const { showIntro, dismissIntro } = useIntro();

  return (
    <>
      {showIntro && <Intro onDone={dismissIntro} />}

      {/* pb: sabit alt gezinme çubuğunun içeriği kapatmaması için */}
      <main className="pb-20">
        <Hero />
        <StoryPanels />
        <MenuSection />
        <AboutSection />
        <ContactSection />

        <footer className="bg-surface px-5 py-10 text-center sm:px-8">
          <p className="text-3xl text-ink">{brand.name}</p>
          <p className="mt-1 font-accent text-lg text-accent italic">{brand.nameAccent}</p>
          <p className="mt-3 text-sm text-muted">{brand.tagline}</p>

          {/* min-h-11 + px: dokunma hedefi en az 44 px yüksekliğinde olsun. */}
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
