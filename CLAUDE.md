# CLAUDE.md

Operational guide for AI agents working in this repo. Full documentation lives in
[README.md](./README.md) and the feature guides (`src/features/notes/README.md` for server
state, `src/features/counter/README.md` for client state) — read those before structural work.

## What this repo is

A public best-practice frontend starter template (Vite + React + TS). Every pattern here
teaches by example — keep code exemplary, minimal, and consistent with what already exists.

## Commands

- `npm ci` — install. Never `npm install`; the lockfile is part of the security audit.
- Before declaring any change done, ALL of these must pass:
  `npm run test:run && npm run build && npm run lint && npm run format:check`
- `npm run dev:mock` — self-contained dev server (MSW mocks the API). Plain `npm run dev` expects a real backend.
- Never commit or push unless the user explicitly asks.

## Hard rules

- **Dependencies are exact-pinned and individually security-audited** (see SECURITY_AUDIT.md).
  Never add, bump, or downgrade a package without explicit user approval. Security floors —
  never go below: `react-router` 8.3.0, `vitest` 4.1.10.
- **Naming:** `.tsx` components PascalCase; every other file kebab-case.
- **Tests are never colocated** — only under `src/tests/`, mirroring the `src/` tree.
- **No JSX in router files** — routes use `Component:` references; each feature owns its
  `RouteObject` in `<feature>-route.ts`, registered with one line in `src/routes/router.ts`.
- **No hardcoded UI text** — always `t()` with typed keys. Add keys to BOTH
  `src/consts/i18n/he.json` (primary language and the typed-key source) and `en.json`.
- **Tailwind logical utilities only** (`ps-*`, `text-start`), never physical (`pl-*`,
  `text-left`) — the app is Hebrew-first RTL.
- **Server state** = RTK Query endpoints injected into `baseApi`, with zod
  `responseSchema`/`argSchema`. **Client state** = RTK slice. Never both for the same data;
  never TanStack Query.
- **Feature isolation:** features import from `@/redux`, `@/consts`, `@/utils`, `@/ui` —
  never from another feature's internals. Always import via the `@/` alias.
- **Accessible interactions** (dialogs, dropdowns, tooltips…) are built on `radix-ui`
  primitives, never hand-rolled.
- Environment access only through `src/consts/env.ts`. `VITE_` vars are public — never secrets.

## Adding a feature

Copy the shape documented in `src/features/notes/README.md` exactly (or `counter` for
client-state features). Integration points: route registration, i18n namespaces, sidebar
`NavLink`, and (if applicable) spreading MSW handlers into `src/mocks/handlers.ts`.

## Gotchas

- Editor TS diagnostics for i18n keys go stale after editing `he.json` — trust
  `npm run build` (`tsc -b`), not the editor.
- In tests, MSW resolves relative handler paths against jsdom's origin — `.env.test` must
  stay `http://localhost:3000/api`.
- Windows: stopping a background `npm run dev` orphans the Vite child process holding the
  port. Kill by port (`Get-NetTCPConnection -LocalPort 5173`); prefer tests/build over dev
  servers for verification.
- `public/mockServiceWorker.js` is MSW-generated — never edit it (it is lint/format-ignored).
