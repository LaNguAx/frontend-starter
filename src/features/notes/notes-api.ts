import { baseApi } from '@/redux/apis/base-api';
import type { CreateNoteInput, Note } from '@/features/notes/notes-types';

// Feature-owned cache tags: declared here, not in the base api
const notesApiWithTag = baseApi.enhanceEndpoints({ addTagTypes: ['Note'] });

export const notesApi = notesApiWithTag.injectEndpoints({
  endpoints: (build) => ({
    getNotes: build.query<Note[], void>({
      query: () => 'notes',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Note' as const, id })), { type: 'Note' as const, id: 'LIST' }]
          : [{ type: 'Note' as const, id: 'LIST' }]
    }),
    createNote: build.mutation<Note, CreateNoteInput>({
      query: (body) => ({ url: 'notes', method: 'POST', body }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }]
    }),
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
