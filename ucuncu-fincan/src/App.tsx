import { Suspense, lazy } from 'react';
import { useRoute } from './lib/router';
import CustomerPage from './pages/CustomerPage';

// Admin ve QR sayfaları ayrı parçalara bölünür: QR'dan gelen müşteri
// yönetim panelinin kodunu hiç indirmez (Lighthouse Performance için önemli).
const AdminPage = lazy(() => import('./pages/AdminPage'));
const QrPage = lazy(() => import('./pages/QrPage'));

function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 px-6 text-center">
      <h1 className="text-5xl text-ink">Sayfa bulunamadı</h1>
      <a
        href="/"
        className="press inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-semibold text-on-accent"
      >
        Ana sayfaya dön
      </a>
    </div>
  );
}

export default function App() {
  const route = useRoute();

  if (route === '/') return <CustomerPage />;

  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-page" />}>
      {route === '/admin' ? <AdminPage /> : route === '/qr' ? <QrPage /> : <NotFound />}
    </Suspense>
  );
}
