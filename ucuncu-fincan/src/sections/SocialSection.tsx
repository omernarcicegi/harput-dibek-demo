// Sosyal medya hesapları.

import type { ReactNode } from 'react';
import { brand } from '../config/brand';
import { Reveal } from '../lib/motion';

/** Hesap kimliğine göre ikon. Emoji değil, SVG kullanılır. */
const ICONS: Record<string, ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: <path d="M14 8.5h2.5V5.5H14A3.5 3.5 0 0 0 10.5 9v2H8.5v3h2v6.5h3.5V14h2.3l.5-3h-2.8V9.2c0-.4.3-.7.7-.7z" />,
  x: <path d="M4 4l7.2 9.3L4.4 20h2.2l5.4-5.6L16.2 20H20l-7.5-9.7L19.6 4h-2.2l-5 5.2L8.1 4H4z" />,
  youtube: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="4" />
      <path d="M10.5 9.8v4.4l4-2.2z" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5V17M7.5 7.6v.1M11.5 17v-3.6a2 2 0 0 1 4 0V17" />
    </>
  ),
  whatsapp: (
    <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3zm4.3 12.2c-.2.5-1 1-1.5 1.1-.4 0-.9.2-3-.6-2.5-1-4.1-3.6-4.2-3.8-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.5-.3.3c-.1.1-.2.3 0 .5.2.3.7 1.2 1.5 1.9 1 .9 1.8 1.1 2 1.2.3.1.4.1.6-.1l.8-1c.2-.2.3-.2.5-.1l2 1c.2.1.4.2.4.3z" />
  ),
};

export function SocialSection() {
  return (
    <section className="bg-surface px-5 py-16 sm:px-8 md:py-24">
      <Reveal>
        <p className="text-xs font-semibold tracking-[0.28em] text-highlight uppercase">
          {brand.social.eyebrow}
        </p>
        <h2 className="mt-2 text-[clamp(2.5rem,11vw,4.5rem)] text-ink">{brand.social.title}</h2>
        <p className="mt-3 max-w-lg text-muted">{brand.social.body}</p>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {brand.social.accounts.map((account, index) => (
          <Reveal key={account.id} index={index}>
            <a
              href={account.url}
              target="_blank"
              rel="noreferrer"
              className="press flex min-h-16 items-center gap-3 rounded-2xl border border-line bg-page p-3 sm:p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-on-gold">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {ICONS[account.id]}
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{account.label}</span>
                <span className="block truncate text-xs text-muted">{account.handle}</span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-8 text-center font-display text-2xl tracking-wide text-accent sm:text-3xl">
          {brand.hashtag}
        </p>
      </Reveal>
    </section>
  );
}
