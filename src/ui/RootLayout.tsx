import { Outlet, useNavigation } from 'react-router';
import clsx from 'clsx';
import { Header } from '@/ui/components/Header';
import { Sidebar } from '@/ui/components/Sidebar';
import { Main } from '@/ui/components/Main';
import { Footer } from '@/ui/components/Footer';

export function RootLayout() {
  // "loading" while the next route's chunk/data loads — the current page stays
  // visible, so we dim it instead of unmounting anything
  const navigation = useNavigation();
  const isNavigating = navigation.state === 'loading';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <Main>
          <div className={clsx('transition-opacity', isNavigating && 'opacity-50')}>
            <Outlet />
          </div>
        </Main>
      </div>
      <Footer />
    </div>
  );
}
