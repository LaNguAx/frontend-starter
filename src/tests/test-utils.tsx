import type { PropsWithChildren, ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeStore } from '@/redux/store';

// Renders with a FRESH store per call so tests never share state
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const store = makeStore();

  function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}
