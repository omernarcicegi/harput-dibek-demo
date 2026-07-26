import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setPrefersDark } from '../test/mediaQuery';

/**
 * themeStore modül seviyesinde tekil ve tercihi import anında okuyor.
 * Her test taze bir örnekle çalışsın diye modülleri sıfırlayıp yeniden alıyoruz.
 */
async function freshStore() {
  vi.resetModules();
  const { themeStore, THEME_STORAGE_KEY } = await import('./themeStore');
  return { themeStore, THEME_STORAGE_KEY };
}

beforeEach(() => {
  document.documentElement.removeAttribute('data-theme');
});

describe('tema tercihi', () => {
  it('varsayılan olarak sistem tercihine uyar', async () => {
    const { themeStore } = await freshStore();

    expect(themeStore.getPreference()).toBe('system');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('sistem koyu tema istiyorsa görünen tema koyudur', async () => {
    setPrefersDark(true);
    const { themeStore } = await freshStore();

    expect(themeStore.getResolved()).toBe('dark');
  });

  it('sistem açık tema istiyorsa görünen tema açıktır', async () => {
    setPrefersDark(false);
    const { themeStore } = await freshStore();

    expect(themeStore.getResolved()).toBe('light');
  });

  it('seçim yapılınca html üzerinde data-theme yazılır', async () => {
    const { themeStore } = await freshStore();

    themeStore.set('dark');

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(themeStore.getResolved()).toBe('dark');
  });

  it('sisteme dönülünce data-theme kaldırılır', async () => {
    const { themeStore } = await freshStore();
    themeStore.set('dark');

    themeStore.set('system');

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(themeStore.getPreference()).toBe('system');
  });

  it('seçim localStorage’a kaydedilir ve yeniden yüklemede korunur', async () => {
    const { themeStore, THEME_STORAGE_KEY } = await freshStore();

    themeStore.set('light');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');

    // Yenileme: modül yeniden yüklenir, tercih depodan okunur.
    const reloaded = await freshStore();
    expect(reloaded.themeStore.getPreference()).toBe('light');
  });

  it('sistem tercihi seçilince kayıt silinir', async () => {
    const { themeStore, THEME_STORAGE_KEY } = await freshStore();
    themeStore.set('dark');

    themeStore.set('system');

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('toggle görünen temanın tersine geçer', async () => {
    setPrefersDark(true);
    const { themeStore } = await freshStore();
    expect(themeStore.getResolved()).toBe('dark');

    themeStore.toggle();
    expect(themeStore.getResolved()).toBe('light');

    themeStore.toggle();
    expect(themeStore.getResolved()).toBe('dark');
  });

  it('abone değişiklikten haberdar edilir', async () => {
    const { themeStore } = await freshStore();
    let calls = 0;
    const unsubscribe = themeStore.subscribe(() => {
      calls += 1;
    });

    themeStore.set('dark');
    expect(calls).toBe(1);

    unsubscribe();
    themeStore.set('light');
    expect(calls).toBe(1);
  });
});
