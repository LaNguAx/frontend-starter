import { z } from 'zod';
import type { TFunction } from 'i18next';

// Single source of truth: types are inferred from schemas, never written twice.
// These schemas are also enforced AT RUNTIME by the api layer (responseSchema/argSchema).
export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string()
});

// The API contract for creating a note (no user-facing messages — see the form factory below)
export const createNoteInputSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1)
});

// Form schemas take `t` so validation messages are translated (and re-created on language change).
// Same shape as the API contract; only the messages differ.
export const makeCreateNoteSchema = (t: TFunction) =>
  z.object({
    title: z.string().min(1, t('notes.form.titleRequired')),
    content: z.string().min(1, t('notes.form.contentRequired'))
  });

export type Note = z.infer<typeof noteSchema>;
export type CreateNoteInput = z.infer<typeof createNoteInputSchema>;
