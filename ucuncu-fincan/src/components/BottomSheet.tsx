// Alttan açılan panel.
//
// Açılma/kapanma, parmakla aşağı sürükleyerek kapatma, Esc, odak yönetimi ve
// arka planın kaydırma kilidi burada toplanır. Çağıran sadece açık mı,
// ne gösterilecek ve kapanınca ne olacak bilgisini verir.

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/** Bu mesafeden fazla aşağı sürüklenirse panel kapanır (px). */
const CLOSE_THRESHOLD_PX = 100;

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** Ekran okuyucuya panelin ne olduğunu söyler. */
  label: string;
  children: ReactNode;
}

export function BottomSheet({ isOpen, onClose, label, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Panel açılmadan önce odakta olan öğe; kapanınca oraya dönülür.
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartYRef = useRef(0);

  // --- Odak yönetimi ve arka plan kilidi ---
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  // --- Klavye: Esc kapatır, Tab panel içinde döner ---
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const sheet = sheetRef.current;
      if (!sheet) return;

      const focusable = sheet.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      // Odak paneli terk etmesin: uçlarda başa/sona sar.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Panel her açıldığında sürükleme durumu sıfırlanır.
  useEffect(() => {
    if (isOpen) setDragOffset(0);
  }, [isOpen]);

  // --- Sürükleyerek kapatma ---
  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    dragStartYRef.current = event.clientY;
    setIsDragging(true);
    // jsdom'da bu API yok; testlerin çökmemesi için korumalı çağrı.
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const delta = event.clientY - dragStartYRef.current;
      // Yalnızca aşağı yönde hareket; yukarı çekmek paneli büyütmez.
      setDragOffset(delta > 0 ? delta : 0);
    },
    [isDragging],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > CLOSE_THRESHOLD_PX) {
      onClose();
    } else {
      setDragOffset(0);
    }
  }, [isDragging, dragOffset, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Paneli kapat"
        onClick={onClose}
        className="backdrop-enter absolute inset-0 h-full w-full cursor-default bg-ink/45"
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="sheet-enter relative flex max-h-[88dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-page shadow-2xl"
        style={{
          transform: `translateY(${dragOffset}px)`,
          // Sürüklerken geçiş kapalı: parmağı birebir takip etsin.
          transition: isDragging ? 'none' : 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Sürükleme alanı: tutamak ve kapatma satırı */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          data-testid="sheet-drag-handle"
          className="flex shrink-0 cursor-grab touch-none items-center justify-between px-4 pt-3 pb-2 active:cursor-grabbing"
        >
          <span className="w-11" aria-hidden="true" />
          <span className="h-1.5 w-12 rounded-full bg-line" aria-hidden="true" />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>
  );
}
