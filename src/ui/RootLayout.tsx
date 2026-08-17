import { Outlet } from 'react-router';
import { Header } from '@/ui/components/Header';
import { Sidebar } from '@/ui/components/Sidebar';
import { Main } from '@/ui/components/Main';
import { Footer } from '@/ui/components/Footer';

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <Main>
          <Outlet />
        </Main>
      </div>
      <Footer />
    </div>
  );
}
