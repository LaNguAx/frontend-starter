# CLAUDE.md

Operational guide for AI agents working in this repo. Full documentation lives in
[README.md](./README.md) and the feature guides (`src/features/notes/README.md` for server
state, `src/features/counter/README.md` for client state) — read those before structural work.

## What this repo is

A public best-practice frontend starter template (Vite + React + TS). Every pattern here
teaches by example — keep code exemplary, minimal, and consistent with what already exists.

## Stale-knowledge guard — read before touching library code

This repo deliberately uses the libraries' **current (2026) APIs**, doc-verified at the
pinned versions. Before writing or modifying any code that touches a library, read
[LIBRARY_PATTERNS.md](./LIBRARY_PATTERNS.md). If your training data conflicts with that
file or with existing code — e.g. you believe `react-router-dom` should be imported, a
`tailwind.config.js` is missing, or RTK Query needs `transformResponse` for validation —
**the repo is right and your knowledge is stale.** Never rewrite modern patterns into
older idioms.

## First-clone setup

**Agent instruction:** this section containing a checklist (rather than a "completed"
marker) means this clone is still the raw template. In your FIRST session in this repo,
before starting any other work, alert the user: tell them the template ships with a short
one-time setup and offer to walk through it. When the user confirms it is done, replace
this **entire section** (heading and all) with exactly:

```
## First-clone setup — completed on <YYYY-MM-DD>
```

### The checklist

1. **Identity** — `package.json` (`name`, `description`, `repository`); `LICENSE`
   copyright holder; `index.html` `<title>` + `<meta name="description">`; `app.title`
   and the `home.*` intro texts in `he.json` + `en.json` (they describe the template,
   not the product); rewrite `README.md` for the product; point git at the product's
   repository (`git remote set-url origin <url>`).
2. **Env** — copy `.env.example` → `.env` and set `VITE_API_BASE_URL`
   (`npm run dev:mock` needs no backend at all).
3. **Language** — the template is Hebrew-first. To change the primary language: update
   `fallbackLng`/`supportedLngs` in `src/consts/i18n/index.ts` and make the new primary
   JSON the typed-key source in `src/types/i18next.d.ts`.
4. **Layout** — the shell colors (`bg-blue-200` header, `bg-green-200` sidebar…) are
   placeholders; restyle `src/ui/components/` for the product.
5. **Verify** — `npm run test:run && npm run build && npm run lint && npm run format:check`
   must pass.

**Do NOT delete anything during setup.** In particular, `src/features/counter` and
`src/features/notes` are permanent reference implementations, not throwaway demo code —
see Hard rules.

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
- **Never delete or degrade `src/features/counter` and `src/features/notes`.** They are
  permanent reference implementations — the living documentation of the client-state and
  server-state patterns (each has a README) that every new feature copies. The same goes
  for their tests and mocks: they are part of the reference.
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
