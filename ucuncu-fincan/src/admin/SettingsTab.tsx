// Çalışma saatleri ve iletişim bilgilerinin düzenlenmesi.

import { DAY_LABELS } from '../config/brand';
import { siteInfoActions } from '../stores/siteInfoStore';
import { useSiteInfo } from '../stores/hooks';
import { Field, TextInput } from './fields';

export function SettingsTab() {
  const siteInfo = useSiteInfo();
  const { contact, hours } = siteInfo;

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-2xl border border-line bg-surface p-4">
        <h3 className="text-2xl text-ink">Çalışma saatleri</h3>

        <ul className="space-y-3">
          {hours.map((entry) => (
            <li key={entry.day} className="rounded-xl border border-line bg-page p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-ink">{DAY_LABELS[entry.day]}</span>

                {/*
                  Onay kutusu yerine aç/kapa düğmesi: mobilde dokunma hedefi
                  44 px'i geçiyor ve durum tek bakışta okunuyor.
                */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={!entry.closed}
                  aria-label={`${DAY_LABELS[entry.day]} günü açık mı`}
                  onClick={() =>
                    siteInfoActions.updateDayHours(entry.day, { closed: !entry.closed })
                  }
                  className={`press inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${
                    entry.closed
                      ? 'border-line bg-surface text-muted'
                      : 'border-accent bg-accent text-on-accent'
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      entry.closed ? 'bg-muted' : 'bg-on-accent'
                    }`}
                    aria-hidden="true"
                  />
                  {entry.closed ? 'Kapalı' : 'Açık'}
                </button>
              </div>

              {!entry.closed && (
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <Field label="Açılış" htmlFor={`open-${entry.day}`}>
                    <TextInput
                      id={`open-${entry.day}`}
                      type="time"
                      value={entry.openTime}
                      onChange={(event) =>
                        siteInfoActions.updateDayHours(entry.day, {
                          openTime: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Kapanış" htmlFor={`close-${entry.day}`}>
                    <TextInput
                      id={`close-${entry.day}`}
                      type="time"
                      value={entry.closeTime}
                      onChange={(event) =>
                        siteInfoActions.updateDayHours(entry.day, {
                          closeTime: event.target.value,
                        })
                      }
                    />
                  </Field>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-2xl border border-line bg-surface p-4">
        <h3 className="text-2xl text-ink">İletişim bilgileri</h3>

        <Field label="Adres" htmlFor="contact-address">
          <TextInput
            id="contact-address"
            value={contact.address}
            onChange={(event) => siteInfoActions.updateContact({ address: event.target.value })}
          />
        </Field>

        <Field label="Telefon (görünen)" htmlFor="contact-phone">
          <TextInput
            id="contact-phone"
            value={contact.phoneDisplay}
            onChange={(event) =>
              siteInfoActions.updateContact({ phoneDisplay: event.target.value })
            }
          />
        </Field>

        <Field
          label="Telefon (arama için)"
          htmlFor="contact-dial"
          hint="Boşluksuz, ülke koduyla. Örn. +902165553421"
        >
          <TextInput
            id="contact-dial"
            value={contact.phoneDial}
            onChange={(event) => siteInfoActions.updateContact({ phoneDial: event.target.value })}
          />
        </Field>

        <Field label="Harita bağlantısı" htmlFor="contact-maps">
          <TextInput
            id="contact-maps"
            value={contact.mapsUrl}
            onChange={(event) => siteInfoActions.updateContact({ mapsUrl: event.target.value })}
          />
        </Field>

        <Field label="Instagram bağlantısı" htmlFor="contact-instagram">
          <TextInput
            id="contact-instagram"
            value={contact.instagramUrl}
            onChange={(event) =>
              siteInfoActions.updateContact({ instagramUrl: event.target.value })
            }
          />
        </Field>
      </section>
    </div>
  );
}
