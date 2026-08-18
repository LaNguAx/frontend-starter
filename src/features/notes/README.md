# Feature anatomy — the reference feature

`notes` is the template for every new feature in this project. To start a new feature, copy this
folder's _shape_ (not its code) and follow the same rules. Its counterpart is `features/counter`,
which demonstrates **client state** (a Redux slice); `notes` demonstrates **server state**
(RTK Query). Between the two, pick per this rule:

> Data that lives on a server and is fetched/mutated → RTK Query api file, **no slice**.
> Data that exists only in the browser (UI state, selections, toggles) → slice, **no api**.
> Never both for the same data — a slice duplicating the RTK Query cache is a bug.

**Permanent reference — never delete this feature.** It is the living documentation of
the server-state pattern (including its tests and mocks) and stays in the repo even after
real features exist. New features are built alongside it by copying its shape.

## Files and their roles

| File                      | Role                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `notes-types.ts`          | zod schemas are the single source of truth; TS types are inferred (`z.infer`), never hand-written in parallel. Form schemas are factories taking `t` so validation messages are translated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `notes-api.ts`            | RTK Query endpoints via `baseApi.enhanceEndpoints({ addTagTypes }).injectEndpoints(...)`. The feature owns its cache tags, following the **per-id + `LIST` pattern**: the list query provides one tag per note plus `{ type: 'Note', id: 'LIST' }`; creates invalidate `LIST`, deletes invalidate both — so refetching is automatic, with no manual refresh logic anywhere. `responseSchema`/`argSchema` enforce the zod contracts **at runtime** and infer the endpoint types — a malformed backend payload becomes a normal query error (via `catchSchemaFailure` in the base api) instead of corrupt UI state. Tolerance policy: **unknown response fields are stripped silently** (additive backend changes are safe); **missing expected fields fail validation**. |
| `mocks/notes-fixtures.ts` | Deterministic, hand-written mock data. Shared by handlers and tests so both agree on reality.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `mocks/notes-handlers.ts` | Feature-owned MSW handlers with in-memory state, so mutations behave realistically in dev. Stateful handlers **must** export a `reset*()` used in test `beforeEach`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `components/`             | Feature-private components. Production code outside the feature may not import them; tests may import them directly. Forms use react-hook-form + `zodResolver` with the translated schema factory, re-created via `useMemo(() => makeCreateNoteSchema(t), [t])` so error messages follow language changes (`NoteForm.tsx`). Interactive patterns that need real accessibility (dialogs, dropdowns, tooltips…) are built on Radix UI primitives, never hand-rolled — see `DeleteNoteDialog.tsx` (focus trap, Esc, ARIA roles for free).                                                                                                                                                                                                                                  |
| `pages/`                  | The routable page(s), loaded only through the feature route file below.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `notes-route.ts`          | The feature-owned `RouteObject`: path + `lazy` import of the page, so the feature code-splits into its own chunk. Registered with one line in `src/routes/router.ts`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

## Integration points (the only places a feature touches shared code)

1. **Route** — create `<feature>-route.ts` exporting a `RouteObject` (see `notes-route.ts`), then register it in the `children` array of `src/routes/router.ts`.
2. **Mocks** — `src/mocks/handlers.ts`: spread the feature's handler array.
3. **i18n** — `src/consts/i18n/he.json` + `en.json`: add a namespace object named after the feature.
4. **Navigation** — add a `NavLink` where appropriate (e.g. `src/ui/components/Sidebar.tsx`).

A feature may import from `@/redux`, `@/consts`, `@/utils`, `@/ui` — never from another
feature's internals. If two features need the same code, it moves to a shared folder.

## Testing

Component implementation files and tests named after those components use PascalCase. All
other files use kebab-case. Tests live under `src/tests/`; feature tests are flattened under
`src/tests/features/<feature>/` to match the permanent examples. Tests may import
feature-private components directly; production code outside the feature may not.

For this feature, the flattened test files are:

- `notes-api.test.ts` — endpoint behavior through real MSW responses, dispatched on a fresh store.
- `NoteForm.test.tsx` — validation and submit behavior via `renderWithProviders`.
- `NotesList.test.tsx` — rendering against the fixtures, plus the delete-confirmation flow (cancel keeps the note, confirm removes it).

Every test file touching the stateful handlers calls `resetNotes()` in `beforeEach`.
`renderWithProviders` gives Redux-only component tests a fresh store. Tests that need data
router context use `renderWithRouterAndProviders` with route objects and optional
`initialEntries`; it also creates a fresh store.

`@testing-library/jest-dom` and `@testing-library/user-event` are intentionally absent. Use
Vitest core matchers and Testing Library's `fireEvent` unless a separately approved dependency
change adds them.

## Conventions recap

- Follow the testing section's naming, location, and feature-privacy rule exactly.
- Text is never hardcoded — every user-facing string goes through `t()` with keys under the
  feature's i18n namespace (Hebrew is the primary language and the typed-key source).
- Styling: Tailwind utilities only; use logical variants (`ps-*`, `text-start`) — never
  physical (`pl-*`, `text-left`) — so RTL/LTR both render correctly. Composed/conditional
  class strings go through `cn()` from `@/utils/pure-utils/cn`.
- Fire-and-forget promises are explicitly marked with `void` (e.g.
  `() => void deleteNote(note.id)`, the `handleSubmit` wrapper in `NoteForm.tsx`) — the
  type-aware ESLint rules require unhandled promises to be deliberate, never accidental.
- Library APIs used here are the **current (2026)** ones — before writing or "fixing" any
  of this code, read `LIBRARY_PATTERNS.md` at the repo root.
