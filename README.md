# Frontend Starter

A production-grade, clone-and-start React template: an **exact-pinned, supply-chain-audited dependency set**, Hebrew-first RTL internationalization, a runtime-validated API boundary, and two reference features whose folders double as living documentation for how to build the next one.

## Requirements

- **Node ≥ 24.15.0** (current LTS line — declared in `engines` and `.nvmrc`; older Node fails jsdom's engine check)
- npm (bundled with Node)

## Getting started

```sh
npm ci            # installs the audited lockfile exactly — use this, not `npm install`
npm run dev:mock  # dev server with MSW mocking the API — fully self-contained, no backend needed
npm run dev       # dev server against a real backend at VITE_API_BASE_URL
```

The app boots with no `.env` file (schema defaults cover the baseline). It renders in **Hebrew (RTL) by default**; switch to English with the header toggle or `?lng=en` — the choice persists in localStorage. The browser language is never auto-detected.

**Starting a real project from this clone?** [CLAUDE.md](./CLAUDE.md) contains a one-time **First-clone setup** checklist — what to rename, which code is a deletable example vs. permanent infrastructure. Any AI coding agent (Claude Code, or AGENTS.md-aware tools) will surface it automatically in its first session.

## Scripts

| Script                  | What it does                                                  |
| ----------------------- | ------------------------------------------------------------- |
| `npm run dev`           | Vite dev server (expects a real API at `VITE_API_BASE_URL`)   |
| `npm run dev:mock`      | Dev server with MSW intercepting API calls (`--mode mock`)    |
| `npm run build`         | Type-check (`tsc -b`) + production bundle                     |
| `npm run preview`       | Serve the production build locally                            |
| `npm run test`          | Vitest in watch mode                                          |
| `npm run test:run`      | Full test suite once (CI mode)                                |
| `npm run test:coverage` | Test suite + V8 code-coverage report (written to `coverage/`) |
| `npm run lint`          | ESLint (flat config)                                          |
| `npm run format`        | Prettier write (`format:check` to verify only)                |

## The stack

Every version is **pinned exactly** (`save-exact` in `.npmrc`) and was audited package-by-package before adoption — see [SECURITY_AUDIT.md](./SECURITY_AUDIT.md).

The code uses these libraries' **current APIs** (React Router 8 data mode, RTK Query schema-validated endpoints, Tailwind 4 CSS-first, the unified `radix-ui` package…). [LIBRARY_PATTERNS.md](./LIBRARY_PATTERNS.md) documents each pattern next to the outdated idiom it replaces — written for AI coding agents whose training data predates them.

| Library                                        | Role                                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------------- |
| `react` / `react-dom` 19                       | UI                                                                     |
| `react-router` 8                               | Routing in **data mode** (route objects, no JSX in router files)       |
| `@reduxjs/toolkit` 2 + `react-redux`           | Client state (slices) and server state (RTK Query) — no TanStack Query |
| `zod` 4                                        | Schemas for env, API responses (runtime-enforced), and forms           |
| `react-hook-form` + `@hookform/resolvers`      | Forms wired to the zod schemas                                         |
| `i18next` 26 + `react-i18next`                 | Hebrew-first i18n with typed translation keys                          |
| `radix-ui`                                     | Accessible interaction primitives (see the notes delete confirmation)  |
| `tailwindcss` 4 + `clsx` + `tailwind-merge`    | Styling (logical properties for RTL), class composition                |
| `date-fns`                                     | Date formatting                                                        |
| `vite` 8 / `typescript` / `vitest` 4 / `msw` 2 | Build, types, tests, API mocking                                       |

## Project structure

```
src/
├── main.tsx                 # Entry: i18n init, optional MSW, then render
├── App.tsx                  # Composition root: Redux <Provider> → <RouterProvider>
├── consts/
│   ├── env.ts               # zod-validated import.meta.env — the only way to read env
│   └── i18n/                # i18next init + he.json (primary) / en.json
├── features/
│   ├── counter/             # Reference: client state (RTK slice) — has its own README
│   └── notes/               # Reference: server state (RTK Query) — has its own README
├── mocks/                   # MSW wiring: aggregated handlers + browser/node setup
├── redux/
│   ├── apis/base-api.ts     # The single createApi — features inject their endpoints
│   ├── hooks/redux-hooks.ts # Typed useAppDispatch / useAppSelector
│   └── store.ts             # makeStore() factory (fresh store per test) + app singleton
├── routes/router.ts         # Route composition — no JSX, `Component:` references only
├── styles/index.css         # Tailwind entry
├── tests/                   # ALL tests live here, mirroring src/ — never colocated
├── types/                   # Ambient types (t() keys typed from he.json)
├── ui/                      # App shell: layout, header/sidebar/footer, error boundary
└── utils/                   # Shared hooks / pure utilities
```

## Conventions

- **Naming:** `.tsx` components are PascalCase; every other file is kebab-case.
- **Tests are never colocated.** They live in `src/tests/`, mirroring the `src/` tree.
- **Router files contain no JSX** — routes reference components via the `Component:` property; each feature owns its `RouteObject` in a `<feature>-route.ts` file.
- **RTL-safe styling:** Tailwind logical utilities only (`ps-*`, `text-start`), never physical (`pl-*`, `text-left`).
- **No hardcoded user-facing text** — everything goes through `t()` with typed keys; Hebrew (`he.json`) is the primary language and the typed-key source.
- **Feature isolation:** a feature may import from `@/redux`, `@/consts`, `@/utils`, `@/ui` — never from another feature's internals.
- Auto-imports use the `@/` alias (workspace setting in `.vscode/settings.json`).

## Adding a feature

`src/features/notes/README.md` is the canonical guide (its counterpart `counter/README.md` covers client state). Both reference features are **permanent** — they stay in the repo as the living documentation every new feature copies; don't delete them. The short version:

1. Create `src/features/<name>/` with `components/`, `pages/`, `<name>-types.ts`, and either an api file (server state) or a slice (client state) — never both for the same data.
2. Export a `RouteObject` from `<name>-route.ts` (lazy page import) and register it with one line in `src/routes/router.ts`.
3. Add an i18n namespace to `he.json` + `en.json`, and a `NavLink` in the sidebar.
4. If it talks to the API: zod schemas in `<name>-types.ts` enforced via `responseSchema`/`argSchema`, MSW handlers in `mocks/`, spread into `src/mocks/handlers.ts`.
5. Tests in `src/tests/features/<name>/`.

## The API boundary

All server communication goes through one `baseApi` (RTK Query); features inject endpoints into it. Every endpoint declares its zod schema via `responseSchema`/`argSchema`, so contracts are enforced **at runtime**, and TS types are inferred from the same schemas — never written twice. The tolerance policy:

- **Extra fields** in a response are stripped silently — additive backend changes never break the UI.
- **Missing expected fields** fail validation — converted by `catchSchemaFailure` into a normal query error the UI handles as `isError`, instead of corrupt state.

## Mocking (MSW)

Mocking is **opt-in**: `npm run dev:mock` sets `VITE_ENABLE_MOCKS=true` (via `.env.mock`) and MSW intercepts requests with the feature-owned handlers. Plain `npm run dev` never loads it, and the production bundle contains zero MSW code (the gate is `import.meta.env.DEV`-guarded, so it is dead-code-eliminated). `public/mockServiceWorker.js` is MSW's generated worker — it must live in `public/` for service-worker scope reasons and is regenerated by `npx msw init`, not hand-edited. Tests run the same handlers via `src/mocks/node.ts`.

## Environment variables

**Every `VITE_`-prefixed variable is compiled into the public client bundle. Never put secrets in any `.env` file in a Vite project.**

| File                                          | Committed       | Purpose                                               |
| --------------------------------------------- | --------------- | ----------------------------------------------------- |
| `.env.example`                                | yes             | Documents every variable the app reads                |
| `.env.mock`                                   | yes             | Sets the mock flag for `npm run dev:mock`             |
| `.env.test`                                   | yes             | Test-mode API origin (matches jsdom's origin for MSW) |
| `.env`, `.env.development`, `.env.production` | no (gitignored) | Real per-environment values                           |

All access goes through `src/consts/env.ts`, which validates `import.meta.env` with zod at boot and provides defaults so a fresh clone runs with no `.env` at all.

## Testing

Vitest + Testing Library + jsdom, with MSW providing real HTTP behavior (no fetch mocking). `src/tests/setup.ts` manages the MSW server lifecycle; `renderWithProviders` gives every test a fresh Redux store via `makeStore()`. The existing suite doubles as the pattern reference: slice unit tests, endpoint tests through MSW, component tests including form validation and the delete-confirmation flow.

## Dependency & security policy

- Versions are **exact-pinned** and `package-lock.json` is committed — installs are byte-reproducible via `npm ci`. No ranges: malicious releases of popular packages overwhelmingly ship as innocent-looking patch/minor bumps, and ranges adopt them automatically; pins don't.
- Every package/version was individually audited (registry cadence, provenance, install scripts, changelog-to-tarball diffs, advisory databases) — findings in [SECURITY_AUDIT.md](./SECURITY_AUDIT.md).
- **Security floors — never downgrade below:** `react-router@8.3.0` (fixes GHSA-qwww-vcr4-c8h2; all earlier 8.x affected) and `vitest@4.1.10` (fixes CVE-2026-73653, Critical).
- **Upgrading a package:** check its advisories and the release diff first, prefer versions that have aged at least a few days, then bump the exact pin, `npm ci`, and run `npm run test:run && npm run build && npm run lint`.
