# Feature anatomy — the reference feature

`notes` is the template for every new feature in this project. To start a new feature, copy this
folder's _shape_ (not its code) and follow the same rules. Its counterpart is `features/counter`,
which demonstrates **client state** (a Redux slice); `notes` demonstrates **server state**
(RTK Query). Between the two, pick per this rule:

> Data that lives on a server and is fetched/mutated → RTK Query api file, **no slice**.
> Data that exists only in the browser (UI state, selections, toggles) → slice, **no api**.
> Never both for the same data — a slice duplicating the RTK Query cache is a bug.

## Files and their roles

| File                | Role                                                                                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `notes-types.ts`    | zod schemas are the single source of truth; TS types are inferred (`z.infer`), never hand-written in parallel. Form schemas are factories taking `t` so validation messages are translated.                               |
| `notes-api.ts`      | RTK Query endpoints via `baseApi.enhanceEndpoints({ addTagTypes }).injectEndpoints(...)`. The feature owns its cache tags. Mutations invalidate tags so queries refetch automatically — no manual refresh logic anywhere. |
| `notes-fixtures.ts` | Deterministic, hand-written mock data. Shared by handlers and tests so both agree on reality.                                                                                                                             |
| `notes-handlers.ts` | Feature-owned MSW handlers with in-memory state, so mutations behave realistically in dev. Stateful handlers **must** export a `reset*()` used in test `beforeEach`.                                                      |
| `components/`       | Feature-private components. Nothing outside the feature may import them (except its own page).                                                                                                                            |
| `pages/`            | The routable page(s), referenced from `src/routes/router.ts` via a **lazy** route so the feature code-splits.                                                                                                             |

## Integration points (the only places a feature touches shared code)

1. **Route** — `src/routes/router.ts`: add a `lazy` child route importing the page.
2. **Mocks** — `src/mocks/handlers.ts`: spread the feature's handler array.
3. **i18n** — `src/consts/i18n/he.json` + `en.json`: add a namespace object named after the feature.
4. **Navigation** — add a `NavLink` where appropriate (e.g. `src/ui/components/Sidebar.tsx`).

A feature may import from `@/redux`, `@/consts`, `@/utils`, `@/ui` — never from another
feature's internals. If two features need the same code, it moves to a shared folder.

## Testing

Tests live in `src/tests/features/notes/`, mirroring this folder (never colocated):

- `notes-api.test.ts` — endpoint behavior through real MSW responses, dispatched on a fresh store.
- `NoteForm.test.tsx` — validation and submit behavior via `renderWithProviders`.
- `NotesList.test.tsx` — rendering against the fixtures.

Every test file touching the stateful handlers calls `resetNotes()` in `beforeEach`;
`renderWithProviders`/`makeStore` already guarantee a fresh Redux store per test.

## Conventions recap

- `.tsx` components: PascalCase. Everything else: kebab-case, prefixed with the feature name.
- Text is never hardcoded — every user-facing string goes through `t()` with keys under the
  feature's i18n namespace (Hebrew is the primary language and the typed-key source).
- Styling: Tailwind utilities only; use logical variants (`ps-*`, `text-start`) — never
  physical (`pl-*`, `text-left`) — so RTL/LTR both render correctly.
