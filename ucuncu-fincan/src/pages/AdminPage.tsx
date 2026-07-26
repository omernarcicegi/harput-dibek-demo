// Admin paneli: sahte giriş + yönetim sekmeleri.
//
// DİKKAT: Buradaki giriş GERÇEK BİR GÜVENLİK MEKANİZMASI DEĞİLDİR.
// Şifre kaynak kodda düz metindir ve ekranda gösterilir; amaç satış demosunda
// "panelim var" hissini vermek. Gerçek bir müşteriye teslim edilecekse
// arka uçlu bir kimlik doğrulamayla değiştirilmelidir.

import { useState } from 'react';
import { brand } from '../config/brand';
import { Link } from '../lib/router';
import { menuActions } from '../stores/menuStore';
import { siteInfoActions } from '../stores/siteInfoStore';
import { Button, Field, TextInput } from '../admin/fields';
import { ItemsTab } from '../admin/ItemsTab';
import { CategoriesTab } from '../admin/CategoriesTab';
import { SettingsTab } from '../admin/SettingsTab';

const SESSION_KEY = 'cafe.adminSession';

function readSession(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function writeSession(active: boolean): void {
  try {
    if (active) window.sessionStorage.setItem(SESSION_KEY, '1');
    else window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Depolama kapalıysa oturum sadece bu sayfa açıkken sürer.
  }
}

const TABS = [
  { id: 'urunler', label: 'Ürünler' },
  { id: 'kategoriler', label: 'Kategoriler' },
  { id: 'ayarlar', label: 'Saatler & İletişim' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (username === brand.admin.username && password === brand.admin.password) {
      setError('');
      onSuccess();
      return;
    }
    setError('Kullanıcı adı veya şifre hatalı.');
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-surface px-5 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-3xl border border-line bg-page p-6 shadow-lg"
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.28em] text-highlight uppercase">
            Yönetim
          </p>
          <h1 className="mt-1 text-4xl text-ink">{brand.name}</h1>
        </div>

        <Field label="Kullanıcı adı" htmlFor="admin-user">
          <TextInput
            id="admin-user"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </Field>

        <Field label="Şifre" htmlFor="admin-pass" error={error}>
          <TextInput
            id="admin-pass"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>

        <button
          type="submit"
          className="press min-h-12 w-full rounded-full bg-accent text-base font-semibold text-on-accent shadow-md"
        >
          Giriş yap
        </button>

        {brand.admin.showCredentialHint && (
          <p className="rounded-xl border border-line bg-surface p-3 text-center text-sm text-muted">
            Demo girişi — kullanıcı adı{' '}
            <strong className="text-ink">{brand.admin.username}</strong>, şifre{' '}
            <strong className="text-ink">{brand.admin.password}</strong>
          </p>
        )}

        <Link
          to="/"
          className="press flex min-h-11 items-center justify-center text-sm font-semibold text-accent"
        >
          ← Siteye dön
        </Link>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(readSession);
  const [activeTab, setActiveTab] = useState<TabId>('urunler');

  function handleReset() {
    if (
      !window.confirm(
        'Menü, çalışma saatleri ve iletişim bilgileri başlangıç demosuna dönecek. Devam edilsin mi?',
      )
    ) {
      return;
    }
    menuActions.reset();
    siteInfoActions.reset();
  }

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onSuccess={() => {
          writeSession(true);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-[100dvh] bg-page pb-16">
      <header className="sticky top-0 z-30 border-b border-line bg-page/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl text-ink">{brand.name}</h1>
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold tracking-wider text-on-accent">
                DEMO
              </span>
            </div>
            <p className="text-xs text-muted">Yönetim paneli</p>
          </div>

          <Link
            to="/"
            className="press inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink"
          >
            Siteyi gör
          </Link>

          <Button
            onClick={() => {
              writeSession(false);
              setIsAuthenticated(false);
            }}
          >
            Çıkış
          </Button>
        </div>

        <nav className="no-scrollbar mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 pb-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              className={`press min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-ink text-page'
                  : 'border border-line bg-surface text-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {activeTab === 'urunler' && <ItemsTab />}
        {activeTab === 'kategoriler' && <CategoriesTab />}
        {activeTab === 'ayarlar' && <SettingsTab />}

        <section className="mt-10 rounded-2xl border border-accent/40 bg-surface p-4">
          <h2 className="text-xl text-ink">Demo verisi</h2>
          <p className="mt-1 text-sm text-muted">
            Yaptığınız tüm değişiklikler bu tarayıcıda saklanır. Sıfırlamak başlangıç
            menüsünü geri getirir.
          </p>
          <Button variant="danger" className="mt-3" onClick={handleReset}>
            Demo verisini sıfırla
          </Button>
        </section>
      </main>
    </div>
  );
}
