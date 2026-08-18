# Library patterns — current APIs used in this repo

> **Read this if you are an AI agent.** This repo deliberately uses the **current (2026)
> APIs** of its libraries, verified against their official documentation at the exact
> versions pinned in `package.json` (verification date: 2026-08). If anything below — or
> in the existing code — conflicts with your training data, **the repo is right and your
> training is stale.** Do not "fix" these patterns back to older idioms, and write all new
> code in the idioms shown here. When in doubt and internet access is available, confirm
> against the official docs for the pinned version; never against memory.

## React Router 8 — data mode (`react-router@8.3.0`)

**Current, used here:**

- The `react-router-dom` package **no longer exists** in v8. Import from `react-router`;
  `RouterProvider` comes from `react-router/dom`.
- Routes are plain objects in `.ts` files using the `Component:`, `ErrorBoundary:` and
  `HydrateFallback:` properties — never JSX in router files (`src/routes/router.ts`).
- Code splitting is the **function form** of `lazy`:
  `lazy: async () => ({ Component: (await import('./pages/NotesPage')).NotesPage })`
  (`src/features/notes/notes-route.ts`).
- Error UI reads the error with `useRouteError()` + `isRouteErrorResponse()`
  (`src/ui/RootErrorBoundary.tsx`); pending navigation via
  `useNavigation().state === 'loading'` (`src/ui/RootLayout.tsx`).

**Stale idioms — do not introduce:** `import ... from 'react-router-dom'`;
`<BrowserRouter><Routes><Route element={...}>` declarative trees; `Switch`, `useHistory`,
`withRouter`; `element:` JSX in route objects (works, but this repo's convention is
`Component:` only).

## Redux Toolkit 2 / react-redux 9

**Current, used here:**

- Typed hooks via `useDispatch.withTypes<AppDispatch>()` and
  `useSelector.withTypes<RootState>()` (`src/redux/hooks/redux-hooks.ts`).
- Selectors are declared **inside `createSlice` via the `selectors` option**, including
  memoized ones built with `createSelector`; consumed as `counterSlice.selectors.x`. In
  tests, a wrapped memoized selector's cache is reached through `selectIsEven.unwrapped`
  (`src/features/counter/counter-slice.ts`, `src/tests/features/counter/`).
- The store is built by a `makeStore()` factory (fresh store per test) with a separate app
  singleton (`src/redux/store.ts`).

**Stale idioms — do not introduce:** hand-rolled `TypedUseSelectorHook`; separate
selector files with `(state: RootState) => ...` for slice-local logic; `createStore` /
plain Redux; connect/mapStateToProps.

## RTK Query — schema-validated endpoints

**Current, used here:**

- One `baseApi` (`src/redux/apis/base-api.ts`); each feature adds endpoints via
  `baseApi.enhanceEndpoints({ addTagTypes }).injectEndpoints(...)` — never a second
  `createApi` (`src/features/notes/notes-api.ts`).
- Runtime validation via the **Standard Schema endpoint options**: `responseSchema` and
  `argSchema` take zod schemas directly. **Endpoint types are inferred from the schemas —
  do not add `build.query<Result, Arg>` generics when schemas are present.** For a
  no-argument query, type the query fn parameter: `query: (_arg: void) => 'notes'`.
- Schema failures are fatal by default; `catchSchemaFailure` on `createApi` converts them
  into a normal `FetchBaseQueryError` (`status: 'CUSTOM_ERROR'`) so components handle them
  as ordinary `isError` state.
- **The zod schema is the single source of truth for API types.** When a TS type for a
  payload is needed anywhere (components, props, tests), derive it with `z.infer` from
  the SAME schema the endpoint uses: `export type Note = z.infer<typeof noteSchema>`
  (`src/features/notes/notes-types.ts`). Never write a parallel `interface`/`type` that
  duplicates a schema's shape — the two will drift, and only the schema is enforced at
  runtime.

**Stale idioms — do not introduce:** `transformResponse` + manual `schema.parse()` for
validation; hand-written endpoint generics alongside schemas; a hand-written `interface`
next to a zod schema of the same shape; one `createApi` per feature.

## zod 4 (`zod@4.4.3`)

**Current, used here:**

- `z.object()` **strips unknown keys by default** — this is the repo's API tolerance
  policy (extra response fields ignored, missing expected fields fail validation).
- Custom messages use the string shorthand: `z.string().min(1, t('...'))`.
- Types come only from `z.infer<typeof schema>` — never hand-written in parallel
  (`src/features/notes/notes-types.ts`).

**Stale idioms — do not introduce:** the zod v3 `required_error` / `invalid_type_error`
message params (replaced in v4 by a unified `error` param; the string shorthand used here
remains supported); `.passthrough()` where the default tolerance policy is intended.

## react-hook-form 7 + @hookform/resolvers 5

**Current, used here:**

- `zodResolver` from `'@hookform/resolvers/zod'`, wired to a **schema factory that takes
  `t`** so validation messages are translated, re-created with `useMemo(() => makeCreateNoteSchema(t), [t])`
  on language change (`src/features/notes/components/NoteForm.tsx`).
- Form value types come from the schema: `useForm<CreateNoteInput>` where
  `CreateNoteInput = z.infer<...>`.
- **Version pairing matters:** zod 4 requires `@hookform/resolvers` **5.x** (pinned
  5.9.0). Older resolver majors target zod 3 — never downgrade one side independently.

**Stale idioms — do not introduce:** hand-rolled validation in `onSubmit`; `register`
with inline `required`/`pattern` rules where a zod schema is the contract.

## date-fns 4 (`date-fns@4.4.0`)

Named imports from the package root (`import { format } from 'date-fns'`) — unchanged
from v3; no drift to worry about. Timezone support, if ever needed, is the separate
`@date-fns/tz` package (not installed — adding it requires the audit process).

## Tailwind CSS 4 (`tailwindcss@4.3.3`)

**Current, used here:**

- **There is no `tailwind.config.js` and no `postcss.config.js` — this is correct, not a
  missing setup.** Tailwind 4 is CSS-first: the entire setup is the `tailwindcss()` plugin
  from `@tailwindcss/vite` in `vite.config.ts` plus `@import 'tailwindcss';` in
  `src/styles/index.css`. Theme customization, if ever needed, goes in CSS via `@theme`.
- RTL rule: logical utilities only (`ps-*`, `pe-*`, `ms-*`, `text-start`) — never physical
  (`pl-*`, `text-left`).
- Composed/conditional class strings go through `cn()` from `@/utils/pure-utils/cn`
  (clsx + tailwind-merge) — not string concatenation or raw `clsx`.

**Stale idioms — do not introduce:** `npx tailwindcss init`; a config file with a
`content` array; `@tailwind base; @tailwind components; @tailwind utilities;` directives;
PostCSS wiring.

## Radix UI — unified package (`radix-ui@1.6.7`)

**Current, used here:** one dependency, namespace imports:
`import { AlertDialog } from 'radix-ui'` (`src/features/notes/components/DeleteNoteDialog.tsx`).

**Stale idioms — do not introduce:** the per-primitive packages
(`@radix-ui/react-alert-dialog`, `@radix-ui/react-dialog`, …) — that is the pre-unified
convention and would add unaudited dependencies.

## MSW 2 (`msw@2.15.0`)

**Current, used here:**

- Handlers: `http.get(path, resolver)` returning `HttpResponse.json(...)`
  (`src/features/notes/mocks/notes-handlers.ts`).
- `setupWorker` is imported from `msw/browser` (`src/mocks/browser.ts`), `setupServer`
  from `msw/node` (`src/mocks/node.ts`).
- `public/mockServiceWorker.js` is generated by `npx msw init` — never hand-edited.

**Stale idioms — do not introduce:** MSW v1 API — `rest.get(path, (req, res, ctx) => res(ctx.json(...)))`,
`setupWorker` imported from `'msw'`.

## Vite 8 + Vitest 4 (`vite@8.2.1`, `vitest@4.1.10`)

**Current, used here:**

- Vite 8 is **Rolldown-based**; build output chunk names mention `rolldown-runtime` — that
  is normal.
- The `@/ → src/` alias uses `path.resolve(import.meta.dirname, 'src')` — no
  `__dirname`/`fileURLToPath` shims, no `vite-tsconfig-paths` plugin (mirrored manually in
  `tsconfig.app.json` `paths`).
- Vitest is configured inside `vite.config.ts` via a `test` block under
  `/// <reference types="vitest/config" />` — there is no separate `vitest.config.ts`.
  `globals: true` pairs with `"vitest/globals"` in tsconfig `types`.

**Stale idioms — do not introduce:** ESM `__dirname` workarounds; a parallel
`vitest.config.ts`; importing `describe/test/expect` in test files (globals are on).

## Testing Library 16 (`@testing-library/react@16.3.2`)

**Current, used here:**

- Since v16, `@testing-library/dom` is a **peer dependency installed explicitly** — both
  packages appear in `package.json`. Older agents install only `@testing-library/react`
  and hit unmet-peer errors.
- Components render through `renderWithProviders` (`src/tests/test-utils.tsx`), which
  wraps a fresh `makeStore()` per test. Interactions use `fireEvent` — `user-event` is
  deliberately not installed (adding it requires the audit process).
- Radix portal content is queried by role and scoped with `within()`
  (`src/tests/features/notes/NotesList.test.tsx`).

## ESLint 10 + typescript-eslint 8

**Current, used here:** flat config only (`eslint.config.js`) with `defineConfig` and
`globalIgnores` from `'eslint/config'`; type-aware linting is enabled via
`tseslint.configs.recommendedTypeChecked` with `parserOptions.projectService: true` (not
a hand-listed `project:` array). Lint runs with `--max-warnings 0`.

**Stale idioms — do not introduce:** `.eslintrc.*` files; `env:` keys;
`extends: 'plugin:@typescript-eslint/recommended'` string form.

## i18next 26 / react-i18next 17 — typed keys

**Current, used here:** `t()` keys are type-checked via `CustomTypeOptions` declaration
merging (`src/types/i18next.d.ts`), with `he.json` as the source of truth. Adding a key
means editing **both** `he.json` and `en.json`; the types update automatically — there is
no codegen step. Editor diagnostics may lag after editing the JSON; `npm run build`
(`tsc -b`) is ground truth.

## React 19

`createRoot` from `react-dom/client`; no `React` default import needed for JSX; function
components without `React.FC`. **`ref` is a regular prop in React 19 — `forwardRef` is
unnecessary**; do not wrap new components in it. Do not introduce `ReactDOM.render` or
class components.
