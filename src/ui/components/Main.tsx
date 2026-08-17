import type { ReactNode } from 'react';

export function Main({ children }: { children: ReactNode }) {
  return <main className="flex-1 bg-yellow-100 p-4">{children}</main>;
}
