import { baseApi } from '@/redux/apis/base-api';
import { createNoteInputSchema, noteSchema } from '@/features/notes/notes-types';

// Feature-owned cache tags: declared here, not in the base api
const notesApiWithTag = baseApi.enhanceEndpoints({ addTagTypes: ['Note'] });

export const notesApi = notesApiWithTag.injectEndpoints({
  endpoints: (build) => ({
    // responseSchema validates every response at runtime AND infers the result type —
    // a malformed backend payload becomes a query error instead of corrupt UI state
    getNotes: build.query({
      query: (_arg: void) => 'notes',
      responseSchema: noteSchema.array(),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Note' as const, id })), { type: 'Note' as const, id: 'LIST' }]
          : [{ type: 'Note' as const, id: 'LIST' }]
    }),
    createNote: build.mutation({
      query: (body) => ({ url: 'notes', method: 'POST', body }),
      argSchema: createNoteInputSchema,
      responseSchema: noteSchema,
      invalidatesTags: [{ type: 'Note', id: 'LIST' }]
    }),
    // DELETE returns 204 No Content — nothing to validate
    deleteNote: build.mutation<void, string>({
      query: (id) => ({ url: `notes/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Note', id },
        { type: 'Note', id: 'LIST' }
      ]
    })
  })
});

export const { useGetNotesQuery, useCreateNoteMutation, useDeleteNoteMutation } = notesApi;
