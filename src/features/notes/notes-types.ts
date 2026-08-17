import { z } from 'zod';
import type { TFunction } from 'i18next';

// Single source of truth: types are inferred from schemas, never written twice
export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string()
});

// Form schemas take `t` so validation messages are translated (and re-created on language change)
export const makeCreateNoteSchema = (t: TFunction) =>
  z.object({
    title: z.string().min(1, t('notes.form.titleRequired')),
    content: z.string().min(1, t('notes.form.contentRequired'))
  });

export type Note = z.infer<typeof noteSchema>;
export type CreateNoteInput = z.infer<ReturnType<typeof makeCreateNoteSchema>>;
