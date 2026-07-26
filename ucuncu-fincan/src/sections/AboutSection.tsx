// Hakkımızda: kısa tanıtım metni ve dört görsellik galeri.

import { brand } from '../config/brand';
import { Reveal } from '../lib/motion';

export function AboutSection() {
  return (
    <section id="hakkimizda" className="scroll-mt-4 bg-surface px-5 py-16 sm:px-8 md:py-24">
      <Reveal>
        <p className="text-xs font-semibold tracking-[0.28em] text-highlight uppercase">
          {brand.about.eyebrow}
        </p>
        <h2 className="mt-2 text-[clamp(2.5rem,11vw,4.5rem)] text-ink">{brand.about.title}</h2>
        <p className="mt-4 max-w-xl text-lg text-muted">{brand.about.body}</p>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {brand.about.gallery.map((photo, index) => (
          <Reveal key={photo.image} index={index}>
            <img
              src={photo.image}
              alt={photo.alt}
              width={512}
              height={512}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full rounded-2xl object-cover shadow-sm"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
