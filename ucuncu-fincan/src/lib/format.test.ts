import { describe, expect, it } from 'vitest';
import { PRICE_ON_REQUEST_LABEL, formatDayHours, formatPrice, isOpenNow } from './format';
import type { DayHours } from '../types';

describe('formatPrice', () => {
  it('tam sayıyı TL simgesiyle biçimlendirir', () => {
    expect(formatPrice(145)).toBe('145 ₺');
  });

  it('ondalıklı fiyatı Türkçe biçimde gösterir', () => {
    expect(formatPrice(12.5)).toBe('12,5 ₺');
  });

  it('binlik ayırıcı kullanır', () => {
    expect(formatPrice(1250)).toBe('1.250 ₺');
  });

  it('fiyatı yayınlanmamış ürünlerde (0) “Mağazada” yazar', () => {
    // Paket ürünlerin raf fiyatı menüde yayınlanmıyor.
    expect(formatPrice(0)).toBe(PRICE_ON_REQUEST_LABEL);
  });
});

function day(overrides: Partial<DayHours> = {}): DayHours {
  return { day: 'pazartesi', closed: false, openTime: '08:00', closeTime: '23:00', ...overrides };
}

describe('formatDayHours', () => {
  it('açık günü saat aralığıyla gösterir', () => {
    expect(formatDayHours(day())).toBe('08:00 – 23:00');
  });

  it('kapalı günü “Kapalı” olarak gösterir', () => {
    expect(formatDayHours(day({ closed: true }))).toBe('Kapalı');
  });
});

describe('isOpenNow', () => {
  const hours: DayHours[] = [
    day({ day: 'pazartesi', openTime: '08:00', closeTime: '23:00' }),
    day({ day: 'sali', closed: true }),
    day({ day: 'carsamba', openTime: '20:00', closeTime: '02:00' }),
    day({ day: 'persembe' }),
    day({ day: 'cuma' }),
    day({ day: 'cumartesi' }),
    day({ day: 'pazar' }),
  ];

  // 2024-01-01 pazartesi
  it('çalışma saatleri içinde açık döner', () => {
    expect(isOpenNow(hours, new Date('2024-01-01T12:00:00'))).toBe(true);
  });

  it('açılıştan önce kapalı döner', () => {
    expect(isOpenNow(hours, new Date('2024-01-01T07:00:00'))).toBe(false);
  });

  it('kapanıştan sonra kapalı döner', () => {
    expect(isOpenNow(hours, new Date('2024-01-01T23:30:00'))).toBe(false);
  });

  it('kapalı işaretli günde kapalı döner', () => {
    // 2024-01-02 salı
    expect(isOpenNow(hours, new Date('2024-01-02T12:00:00'))).toBe(false);
  });

  it('gece yarısını aşan vardiyayı doğru değerlendirir', () => {
    // 2024-01-03 çarşamba, 20:00 – 02:00
    expect(isOpenNow(hours, new Date('2024-01-03T23:00:00'))).toBe(true);
    expect(isOpenNow(hours, new Date('2024-01-03T01:00:00'))).toBe(true);
    expect(isOpenNow(hours, new Date('2024-01-03T15:00:00'))).toBe(false);
  });

  it('geçersiz saat biçiminde kapalı döner', () => {
    const broken = [day({ day: 'pazartesi', openTime: 'sabah', closeTime: 'akşam' })];
    expect(isOpenNow(broken, new Date('2024-01-01T12:00:00'))).toBe(false);
  });
});
