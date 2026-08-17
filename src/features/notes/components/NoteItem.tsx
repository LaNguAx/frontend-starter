import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import type { Note } from '@/features/notes/notes-types';
import { useDeleteNoteMutation } from '@/features/notes/notes-api';

export function NoteItem({ note }: { note: Note }) {
  const { t } = useTranslation();
  const [deleteNote] = useDeleteNoteMutation();

  return (
    <li className="rounded border border-gray-300 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{note.title}</h3>
        <button type="button" onClick={() => deleteNote(note.id)} className="text-sm text-red-600 hover:underline">
          {t('notes.delete')}
        </button>
      </div>
      <p>{note.content}</p>
      <time className="text-xs text-gray-500">{format(new Date(note.createdAt), 'dd/MM/yyyy')}</time>
    </li>
  );
}
