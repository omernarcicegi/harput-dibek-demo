import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { installIntersectionObserverMock } from './intersectionMock';
import { installMatchMediaMock } from './mediaQuery';

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  installIntersectionObserverMock();
  installMatchMediaMock();

  // Bölümler arası kaydırma jsdom'da yok; testler çökmesin.
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
