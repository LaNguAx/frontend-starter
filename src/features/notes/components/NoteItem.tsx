import { format } from 'date-fns';
import type { Note } from '@/features/notes/notes-types';
import { useDeleteNoteMutation } from '@/features/notes/notes-api';
import { DeleteNoteDialog } from '@/features/notes/components/DeleteNoteDialog';

export function NoteItem({ note }: { note: Note }) {
  const [deleteNote] = useDeleteNoteMutation();

  return (
    <li className="rounded border border-gray-300 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{note.title}</h3>
        <DeleteNoteDialog onConfirm={() => void deleteNote(note.id)} />
      </div>
      <p>{note.content}</p>
      <time className="text-xs text-gray-500">{format(new Date(note.createdAt), 'dd/MM/yyyy')}</time>
    </li>
  );
}
