import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { BottomSheet } from './BottomSheet';

/**
 * Gerçek kullanım düzeni: bir düğme paneli açar.
 * Odağın düğmeye geri dönmesini doğrulayabilmek için tetikleyici gerçek olmalı.
 */
function Harness() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Ürünü aç
      </button>
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} label="Ürün detayı">
        <p>Alerjen bilgisi</p>
        <button type="button">İç düğme</button>
      </BottomSheet>
    </>
  );
}

async function openSheet() {
  const user = userEvent.setup({ delay: null });
  render(<Harness />);
  await user.click(screen.getByRole('button', { name: 'Ürünü aç' }));
  return user;
}

/** Sürükleme jesti: userEvent yerine ham pointer olayları kullanılır. */
function dragDown(distance: number) {
  const handle = screen.getByTestId('sheet-drag-handle');
  fireEvent.pointerDown(handle, { clientY: 0, pointerId: 1 });
  fireEvent.pointerMove(handle, { clientY: distance, pointerId: 1 });
  fireEvent.pointerUp(handle, { clientY: distance, pointerId: 1 });
}

describe('BottomSheet', () => {
  it('kapalıyken hiçbir şey göstermez', () => {
    render(<Harness />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('açılınca içeriğiyle birlikte görünür', async () => {
    await openSheet();

    expect(screen.getByRole('dialog', { name: 'Ürün detayı' })).toBeInTheDocument();
    expect(screen.getByText('Alerjen bilgisi')).toBeInTheDocument();
  });

  it('kapatma düğmesiyle kapanır', async () => {
    const user = await openSheet();

    await user.click(screen.getByRole('button', { name: 'Kapat' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('Escape ile kapanır', async () => {
    const user = await openSheet();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('arka plana dokununca kapanır', async () => {
    const user = await openSheet();

    await user.click(screen.getByRole('button', { name: 'Paneli kapat' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('eşiği aşan aşağı sürükleme kapatır', async () => {
    await openSheet();

    dragDown(150);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('eşiğin altındaki sürükleme kapatmaz, panel yerine döner', async () => {
    await openSheet();

    dragDown(40);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveStyle({ transform: 'translateY(0px)' });
  });

  it('açılınca odak panel içine taşınır', async () => {
    await openSheet();

    expect(screen.getByRole('button', { name: 'Kapat' })).toHaveFocus();
  });

  it('kapanınca odak paneli açan düğmeye döner', async () => {
    const user = await openSheet();

    await user.click(screen.getByRole('button', { name: 'Kapat' }));

    expect(screen.getByRole('button', { name: 'Ürünü aç' })).toHaveFocus();
  });

  it('açıkken arka planın kaydırılması kilitlenir', async () => {
    const user = await openSheet();
    expect(document.body.style.overflow).toBe('hidden');

    await user.click(screen.getByRole('button', { name: 'Kapat' }));

    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
