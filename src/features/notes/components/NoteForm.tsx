import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { makeCreateNoteSchema, type CreateNoteInput } from '@/features/notes/notes-types';
import { useCreateNoteMutation } from '@/features/notes/notes-api';

export function NoteForm() {
  const { t } = useTranslation();
  const [createNote, { isLoading }] = useCreateNoteMutation();

  // Re-created when the language changes so error messages stay translated
  const schema = useMemo(() => makeCreateNoteSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateNoteInput>({ resolver: zodResolver(schema) });

  const onSubmit = async (input: CreateNoteInput) => {
    await createNote(input).unwrap();
    reset();
  };

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex max-w-md flex-col gap-2">
      <input
        {...register('title')}
        aria-label={t('notes.form.title')}
        placeholder={t('notes.form.title')}
        className="rounded border border-gray-300 bg-white p-2"
      />
      {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}

      <textarea
        {...register('content')}
        aria-label={t('notes.form.content')}
        placeholder={t('notes.form.content')}
        className="rounded border border-gray-300 bg-white p-2"
      />
      {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="self-start rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {t('notes.form.submit')}
      </button>
    </form>
  );
}
