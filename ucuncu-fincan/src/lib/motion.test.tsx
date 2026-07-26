import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { Reveal, STAGGER_MAX_STEPS, STAGGER_STEP_MS, staggerDelayMs } from './motion';
import { observedElementCount, triggerIntersection } from '../test/intersectionMock';
import { setPrefersReducedMotion } from '../test/mediaQuery';

describe('Reveal — normal hareket', () => {
  it('görünüm alanına girene kadar gizlidir', () => {
    render(<Reveal>İçerik</Reveal>);

    expect(screen.getByText('İçerik')).toHaveAttribute('data-visible', 'false');
  });

  it('görünüm alanına girince belirir', () => {
    render(<Reveal>İçerik</Reveal>);

    act(() => triggerIntersection(true));

    expect(screen.getByText('İçerik')).toHaveAttribute('data-visible', 'true');
  });

  it('her öğe için yalnızca bir kez tetiklenir', () => {
    render(<Reveal>İçerik</Reveal>);
    expect(observedElementCount()).toBe(1);

    act(() => triggerIntersection(true));

    // Tetiklendikten sonra gözlem bırakılır: geri kaydırınca animasyon tekrarlamaz.
    expect(observedElementCount()).toBe(0);

    act(() => triggerIntersection(false));
    expect(screen.getByText('İçerik')).toHaveAttribute('data-visible', 'true');
  });

  it('sıra numarasına göre gecikme uygular', () => {
    render(<Reveal index={3}>İçerik</Reveal>);

    expect(screen.getByText('İçerik')).toHaveStyle({
      transitionDelay: `${3 * STAGGER_STEP_MS}ms`,
    });
  });
});

describe('Reveal — hareket azaltma açık', () => {
  it('içerik ilk render’da görünürdür', () => {
    setPrefersReducedMotion(true);

    render(<Reveal>İçerik</Reveal>);

    expect(screen.getByText('İçerik')).toHaveAttribute('data-visible', 'true');
  });

  it('IntersectionObserver hiç kurulmaz', () => {
    setPrefersReducedMotion(true);

    render(<Reveal>İçerik</Reveal>);

    expect(observedElementCount()).toBe(0);
  });

  it('gecikme uygulanmaz', () => {
    setPrefersReducedMotion(true);

    render(<Reveal index={5}>İçerik</Reveal>);

    expect((screen.getByText('İçerik') as HTMLElement).style.transitionDelay).toBe('');
  });
});

describe('staggerDelayMs', () => {
  it('sıra ilerledikçe gecikme artar', () => {
    expect(staggerDelayMs(0)).toBe(0);
    expect(staggerDelayMs(1)).toBe(STAGGER_STEP_MS);
    expect(staggerDelayMs(3)).toBe(3 * STAGGER_STEP_MS);
  });

  it('gecikme üst sınırda durur — uzun listede son kart beklemez', () => {
    const ceiling = STAGGER_MAX_STEPS * STAGGER_STEP_MS;

    expect(staggerDelayMs(STAGGER_MAX_STEPS)).toBe(ceiling);
    expect(staggerDelayMs(50)).toBe(ceiling);
  });

  it('gecikme referans aralığında (60–80 ms)', () => {
    expect(STAGGER_STEP_MS).toBeGreaterThanOrEqual(60);
    expect(STAGGER_STEP_MS).toBeLessThanOrEqual(80);
  });
});
