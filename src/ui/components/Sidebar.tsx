import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/pure-utils/cn';

export function Sidebar() {
  const { t } = useTranslation();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn('rounded px-3 py-2 hover:bg-green-300', isActive && 'bg-green-300 font-semibold');

  return (
    <aside className="w-64 bg-green-200 p-4">
      <nav className="flex flex-col gap-1">
        <NavLink to="/" end className={linkClass}>
          {t('layout.nav.home')}
        </NavLink>
        <NavLink to="/counter" className={linkClass}>
          {t('layout.nav.counter')}
        </NavLink>
        <NavLink to="/notes" className={linkClass}>
          {t('layout.nav.notes')}
        </NavLink>
      </nav>
    </aside>
  );
}
