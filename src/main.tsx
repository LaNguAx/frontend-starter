import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/App';
import '@/consts/i18n';
import '@/styles/index.css';

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS !== 'true') {
    return;
  }

  const { worker } = await import('@/mocks/browser');

  // `worker.start()` resolves once the Service Worker is ready to intercept requests
  return worker.start();
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
