// İletişim: adres, arama başlatan telefon, harita düğmesi, saatler, Instagram.

import { DAY_LABELS, brand } from '../config/brand';
import { formatDayHours, getTodayKey, isOpenNow } from '../lib/format';
import { Reveal } from '../lib/motion';
import { useSiteInfo } from '../stores/hooks';

export function ContactSection() {
  const siteInfo = useSiteInfo();
  const { contact, hours } = siteInfo;
  const today = getTodayKey();
  const openNow = isOpenNow(hours);

  return (
    <section id="iletisim" className="scroll-mt-4 bg-page px-5 py-16 sm:px-8 md:py-24">
      <Reveal>
        <p className="text-xs font-semibold tracking-[0.28em] text-highlight uppercase">
          {brand.sections.contactEyebrow}
        </p>
        <h2 className="mt-2 text-[clamp(2.5rem,11vw,4.5rem)] text-ink">
          {brand.sections.contactTitle}
        </h2>
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Reveal>
          <div className="space-y-6">
            {/* Şu an açık mı? Kaydırmadan görünen tek satırlık cevap. */}
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold">
              <span
                className={`h-2.5 w-2.5 rounded-full ${openNow ? 'bg-highlight' : 'bg-accent'}`}
                aria-hidden="true"
              />
              {openNow ? 'Şu anda açığız' : 'Şu anda kapalıyız'}
            </p>

            <div>
              <h3 className="text-sm tracking-[0.2em] text-muted">Adres</h3>
              <p className="mt-1.5 text-lg text-ink">{contact.address}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${contact.phoneDial}`}
                className="press inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 text-base font-semibold text-on-accent shadow-md"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M2.5 3.5A1.5 1.5 0 014 2h1.6a1.5 1.5 0 011.45 1.1l.6 2.1a1.5 1.5 0 01-.4 1.5L6.2 7.9a11.5 11.5 0 005.9 5.9l1.2-1.05a1.5 1.5 0 011.5-.4l2.1.6A1.5 1.5 0 0118 14.4V16a1.5 1.5 0 01-1.5 1.5C8.8 17.5 2.5 11.2 2.5 3.5z" />
                </svg>
                {contact.phoneDisplay}
              </a>

              <a
                href={contact.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="press inline-flex min-h-12 items-center gap-2 rounded-full border border-line bg-surface px-6 text-base font-semibold text-ink"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10 2a5.5 5.5 0 00-5.5 5.5c0 4 5.5 10.5 5.5 10.5s5.5-6.5 5.5-10.5A5.5 5.5 0 0010 2zm0 7.5a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
                Yol tarifi al
              </a>

              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="press inline-flex min-h-12 items-center gap-2 rounded-full border border-line bg-surface px-6 text-base font-semibold text-ink"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="text-sm tracking-[0.2em] text-muted">Çalışma saatleri</h3>
            <dl className="mt-3">
              {hours.map((entry) => {
                const isToday = entry.day === today;
                return (
                  <div
                    key={entry.day}
                    className={`flex items-center justify-between border-b border-line/60 py-2.5 last:border-b-0 ${
                      isToday ? 'font-semibold text-ink' : 'text-muted'
                    }`}
                  >
                    <dt>
                      {DAY_LABELS[entry.day]}
                      {isToday && <span className="ml-2 text-xs text-accent">bugün</span>}
                    </dt>
                    <dd>{formatDayHours(entry)}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
