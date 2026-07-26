// Tarihçe: kilometre taşları ve sayılarla marka hikâyesi.

import { brand } from '../config/brand';
import { Reveal } from '../lib/motion';

export function HistorySection() {
  return (
    <section className="bg-page px-5 py-16 sm:px-8 md:py-24">
      <Reveal>
        <p className="text-xs font-semibold tracking-[0.28em] text-highlight uppercase">
          {brand.history.eyebrow}
        </p>
        <h2 className="mt-2 text-[clamp(2.5rem,11vw,4.5rem)] text-ink">
          {brand.history.title}
        </h2>
        <p className="mt-3 max-w-lg text-muted">{brand.history.intro}</p>
      </Reveal>

      {/* Sayılar */}
      <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-5">
        {brand.history.stats.map((stat, index) => (
          <Reveal key={stat.label} index={index}>
            <div className="rounded-2xl border border-line bg-surface p-4 text-center">
              <p className="font-display text-3xl text-accent sm:text-5xl">{stat.value}</p>
              <p className="mt-1 text-[11px] tracking-wide text-muted uppercase sm:text-xs">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Zaman çizgisi */}
      <ol className="relative mt-12 ml-3 border-l-2 border-line">
        {brand.history.milestones.map((milestone, index) => (
          <li key={milestone.year} className="relative pb-8 pl-6 last:pb-0 sm:pl-8">
            <Reveal index={index}>
              {/* Çizgi üzerindeki nokta */}
              <span
                className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-page bg-gold"
                aria-hidden="true"
              />
              <p className="font-display text-2xl text-accent sm:text-3xl">{milestone.year}</p>
              <h3 className="mt-1 text-xl text-ink sm:text-2xl">{milestone.title}</h3>
              <p className="mt-1.5 max-w-md text-sm text-muted sm:text-base">{milestone.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
