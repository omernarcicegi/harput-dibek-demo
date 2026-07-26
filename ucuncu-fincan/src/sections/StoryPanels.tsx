// Sinematik hikâye panelleri.
//
// Paneller yapışkan (sticky) olarak yığılır: bir sonraki panel öncekinin
// üstüne kayar. Panel görünüme girdiğinde alttan yukarı doğru sıcak bir
// kahve dalgası yükselir (yalnızca transform ile).

import { brand } from '../config/brand';
import { Reveal } from '../lib/motion';
import { asset } from '../lib/asset';

export function StoryPanels() {
  return (
    <div className="panel-stack">
      {brand.storyPanels.map((panel) => (
        <section
          key={panel.id}
          className="snap-panel relative flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-page"
          aria-label={panel.title}
        >
          <img
            src={asset(panel.image)}
            alt={panel.imageAlt}
            width={1080}
            height={1440}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Kahve dalgası — dekoratif, panel görünüme girince yükselir. */}
          <Reveal className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3">
            <div className="panel-wash h-full w-full" aria-hidden="true" />
          </Reveal>

          <div className="photo-scrim absolute inset-x-0 bottom-0 h-[72%]" aria-hidden="true" />

          <div className="relative px-5 pb-24 sm:px-8 md:pb-28">
            <Reveal>
              <p className="mb-2 text-xs font-semibold tracking-[0.28em] text-highlight uppercase">
                {panel.eyebrow}
              </p>
              <h2 className="max-w-2xl text-[clamp(2.5rem,12vw,5.5rem)] text-ink">
                {panel.title}
              </h2>
              <p className="mt-4 max-w-md text-base text-muted sm:text-lg">{panel.body}</p>
            </Reveal>
          </div>
        </section>
      ))}
    </div>
  );
}
