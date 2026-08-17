import { useTranslation } from 'react-i18next';
import { NoteForm } from '@/features/notes/components/NoteForm';
import { NotesList } from '@/features/notes/components/NotesList';

export function NotesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">{t('notes.title')}</h1>
      <NoteForm />
      <NotesList />
    </div>
  );
}
