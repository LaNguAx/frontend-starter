import { useTranslation } from 'react-i18next';
import { useGetNotesQuery } from '@/features/notes/notes-api';
import { NoteItem } from '@/features/notes/components/NoteItem';

export function NotesList() {
  const { t } = useTranslation();
  const { data: notes, isLoading, isError } = useGetNotesQuery();

  if (isLoading) {
    return <p>{t('notes.loading')}</p>;
  }

  if (isError) {
    return <p className="text-red-600">{t('notes.error')}</p>;
  }

  if (!notes || notes.length === 0) {
    return <p>{t('notes.empty')}</p>;
  }

  return (
    <ul className="flex max-w-md flex-col gap-2">
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </ul>
  );
}
