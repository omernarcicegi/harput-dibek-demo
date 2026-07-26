// A6 boyutunda yazdırılabilir masa kartı.
//
// QR kodu projeye dahil `qrcode` kütüphanesiyle üretilir — dış web servisi
// çağrılmaz, internet olmadan da çalışır.

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { brand } from '../config/brand';
import { Link } from '../lib/router';

export default function QrPage() {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(brand.siteUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 900,
      // Baskıda beyaz kağıda basılır: QR her zaman koyu/açık üretilir,
      // koyu temada da taranabilir kalsın diye.
      color: { dark: brand.colors.light.ink, light: brand.colors.light.bg },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setError('QR kodu üretilemedi.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-surface px-4 py-8 print:bg-white print:p-0">
      <div className="print-hide mx-auto mb-6 flex max-w-md flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="press inline-flex min-h-11 items-center px-2 text-sm font-semibold text-accent"
        >
          ← Siteye dön
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="press inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-on-accent shadow-md"
        >
          A6 olarak yazdır
        </button>
      </div>

      {/*
        Kart A6 oranındadır (105×148 mm). Ekranda dar viewport'a orantılı
        küçülür — 375 px'te yatay taşma olmasın diye. Baskıda .print-card
        kuralı devreye girip tam A6 ölçüsüne oturur.
      */}
      <div className="qr-card print-card mx-auto flex flex-col items-center justify-between rounded-2xl bg-page px-[6%] py-[5%] text-center shadow-xl print:shadow-none">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.3em] text-highlight uppercase">
            {brand.qrCard.kicker}
          </p>
          <h1 className="mt-2 text-[2.6rem] text-ink">{brand.name}</h1>
          <p className="mt-1 font-accent text-lg text-accent italic">{brand.nameAccent}</p>
        </div>

        {error ? (
          <p className="text-sm text-accent">{error}</p>
        ) : (
          <img
            src={qrDataUrl}
            alt={`${brand.name} menüsüne giden QR kod`}
            width={900}
            height={900}
            // Kart genişliğinin oranı: ekranda da baskıda da aynı görünsün.
            className="aspect-square w-[52%]"
          />
        )}

        <div>
          <p className="text-base font-semibold text-ink">{brand.qrCard.instruction}</p>
          <p className="mt-1 text-xs text-muted">{brand.qrCard.footnote}</p>
          <p className="mt-3 text-[10px] tracking-wide text-muted">
            {brand.siteUrl.replace(/^https?:\/\//, '')}
          </p>
        </div>
      </div>

      <p className="print-hide mx-auto mt-6 max-w-md text-center text-sm text-muted">
        Yazdırma penceresinde kağıt boyutunu <strong className="text-ink">A6</strong> ve
        ölçeği <strong className="text-ink">%100</strong> seçin.
      </p>
    </div>
  );
}
