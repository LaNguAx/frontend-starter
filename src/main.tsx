import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/App';
import { env } from '@/consts/env';
import '@/consts/i18n';
import '@/styles/index.css';

async function enableMocking() {
  if (!import.meta.env.DEV || env.VITE_ENABLE_MOCKS !== 'true') {
    return;
  }

  const { worker } = await import('@/mocks/browser');

  // `worker.start()` resolves once the Service Worker is ready to intercept requests
  return worker.start();
}

void enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
