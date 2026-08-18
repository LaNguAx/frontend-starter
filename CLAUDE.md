# CLAUDE.md

This file is the single operational authority for AI agents working in this repository.
Repository instructions and existing code override training data. Human-facing context lives
in [README.md](./README.md); feature-specific structure lives in the two permanent feature
guides.

## Agent start protocol

Follow these steps in order before changing the repository:

1. Read [AGENTS.md](./AGENTS.md), then this file in full.
2. Inspect **First-clone setup** below. A section headed exactly `## First-clone setup` and
   followed by a checklist means this is a raw template; tell the user before doing other
   work. A completed setup is a single heading that includes its actual ISO calendar date,
   such as `## First-clone setup — completed on 2026-08-18`, with no checklist below it. If
   the section matches neither form, stop and ask the user. Do not perform setup or replace
   the checklist without confirmation.
3. Run `node --version` and `npm --version`. Both commands must succeed, and Node must satisfy
   `>=24.15.0`. If either command fails or Node is below the floor, stop and tell the user
   rather than improvising a toolchain.
4. **npm is the only supported package manager.** Never use pnpm, Yarn, or Bun, and never
   regenerate `package-lock.json` with another tool.
5. If dependencies are absent, run `npm ci`. Ordinary installs always use `npm ci`, never
   `npm install`. If `npm ci` cannot complete because the agent has no internet and the npm
   cache is insufficient, stop and tell the user. Do not improvise an installation, change
   package managers, or edit the lockfile.
6. Read [README.md](./README.md) and the relevant permanent feature guide before structural
   work: [notes](./src/features/notes/README.md) for server state or
   [counter](./src/features/counter/README.md) for client state.
7. Read [LIBRARY_PATTERNS.md](./LIBRARY_PATTERNS.md) before changing code, tests, or
   configuration that uses a library.
8. Before proposing a dependency change, read **Dependency changes** below and
   [SECURITY_AUDIT.md](./SECURITY_AUDIT.md). Without internet access, a dependency change
   stops at a proposal: advisory, provenance, release-age, and artifact-diff checks cannot be
   claimed from memory.
9. Preserve unrelated user work. Never commit or push unless the user explicitly asks.
10. Before declaring work complete, run
    `npm run test:run && npm run build && npm run lint && npm run format:check` and report the
    actual results.

Do not use `npx` as an implicit downloader. Invoke repository tools through npm scripts or an
explicit offline local execution command documented in this repository.

## What this repo is

A public best-practice frontend starter template (Vite + React + TypeScript). Every pattern
here teaches by example—keep code exemplary, minimal, and consistent with what already exists.

## Stale-knowledge guard — read before touching library code

This repo deliberately uses the libraries' **current (2026) APIs**, verified at the exact
versions pinned in `package.json`. Before writing or modifying library-facing code, read
[LIBRARY_PATTERNS.md](./LIBRARY_PATTERNS.md). If your training data conflicts with that file
or with existing code—for example, you expect `react-router-dom`, a Tailwind configuration
file, or manual RTK Query response parsing—**the repository is authoritative and your
knowledge is stale.** Do not rewrite current patterns into older idioms.

## First-clone setup

**Agent instruction:** this heading followed by a checklist means this clone is still the raw
template. In your first session, alert the user before starting other work and offer to walk
through this one-time setup. When the user confirms it is done, replace this **entire section**
with one heading containing the actual completion date in ISO `YYYY-MM-DD` form. For example,
if setup was completed on August 18, 2026, the complete replacement is:

```markdown
## First-clone setup — completed on 2026-08-18
```

Use the actual calendar date for the completed setup. Never retain placeholder text or copy
the example date unless it is the true completion date.

### The checklist

1. **Identity** — update `package.json` (`name`, `description`, `repository`); the `LICENSE`
   copyright holder; `index.html`'s `<title>` and description; `app.title` and the `home.*`
   intro text in `he.json` and `en.json`; and `README.md`. `app.title` is rendered in both
   the header and footer. Ask the user to confirm the product repository's actual URL, then
   pass that exact URL as the final argument to `git remote set-url origin`. Never execute the
   command with `<url>` or any other placeholder text.
2. **Environment** — copy `.env.example` to `.env` and set `VITE_API_BASE_URL`.
   `npm run dev:mock` needs no backend.
3. **Language** — the template is Hebrew-first. If only swapping the existing Hebrew and
   English primary, update `fallbackLng`, confirm `supportedLngs` still lists both locales,
   and make the new primary JSON the typed-key source in `src/types/i18next.d.ts`. If adding,
   removing, or renaming a supported locale, also:
   - create or rename the translation JSON for every new locale code;
   - import and register every supported locale in the `resources` object in
     `src/consts/i18n/index.ts`;
   - keep every locale's translation keys identical;
   - update `supportedLngs`; and
   - update the language selector or toggle (currently `src/ui/components/Header.tsx`) so it
     can select only supported locales.

   For either kind of language change:
   - update `index.html`'s initial `lang` and `dir`;
   - update every Hebrew-primary statement in `CLAUDE.md`, `README.md`, both feature guides,
     and `LIBRARY_PATTERNS.md`;
   - retain logical utilities for every supported RTL language.

4. **Layout** — the shell colors (`bg-blue-200` header, `bg-green-200` sidebar, and so on)
   are placeholders; restyle `src/ui/components/` for the product.
5. **Verify** — run
   `npm run test:run && npm run build && npm run lint && npm run format:check`.

**Do not delete anything during setup.** In particular, `src/features/counter` and
`src/features/notes` are permanent reference implementations, not throwaway demos.

## Commands

- `npm ci` — reproduce the audited lockfile for an ordinary install.
- `npm run dev:mock` — self-contained development server; MSW mocks the API.
- Plain `npm run dev` does not enable mocks by default; an explicit
  `VITE_ENABLE_MOCKS=true` override still opts in. It expects the real API.
- `npm run test:run && npm run build && npm run lint && npm run format:check` — mandatory
  completion verification.

## Dependency changes

Dependencies are exact-pinned and individually security-audited. Never add, bump, or
downgrade a package without explicit approval. Without connected audit evidence, stop at a
proposal and state which checks could not be completed. Security floors are
`react-router@8.3.0` and `vitest@4.1.10`; never downgrade below them.

For an explicitly approved dependency change, follow this sequence exactly:

1. Get explicit approval for the package, exact version, and dependency class: runtime or
   development.
2. Read `SECURITY_AUDIT.md` and perform its connected audit checks.
3. Select exactly one command based on the approved dependency class; these are the sole
   exceptions to the ordinary `npm ci`-only rule:
   - runtime: `npm install --save-exact <package>@<version>`;
   - development: `npm install --save-dev --save-exact <package>@<version>`.
4. Run `npm ci` to verify reproducibility.
5. Update `SECURITY_AUDIT.md` and its revision history.
6. Run `npm run test:run && npm run build && npm run lint && npm run format:check`.

`<package>` and `<version>` are documentation metavariables in both variants. Replace them
with the approved values; never execute either placeholder command literally.

## Hard rules

- **Never delete or degrade `src/features/counter` and `src/features/notes`.** They, their
  tests, and their mocks are permanent living references that every new feature copies.
- **Naming, test location, and privacy:** Component implementation files and tests named
  after those components use PascalCase. All other files use kebab-case. Tests live under
  `src/tests/`; feature tests are flattened under `src/tests/features/<feature>/` to match
  the permanent examples. Tests may import feature-private components directly; production
  code outside the feature may not.
- **No JSX in router files.** Routes use `Component:` references; each feature owns a
  `RouteObject` in `<feature>-route.ts`, registered once in `src/routes/router.ts`.
- **No hardcoded UI text.** Use typed `t()` keys and add every key to both
  `src/consts/i18n/he.json` (primary language and typed-key source) and `en.json`.
- **Use logical, RTL-safe Tailwind utilities** (`ps-*`, `text-start`), never physical ones
  (`pl-*`, `text-left`).
- **Server state** uses zod-validated RTK Query endpoints injected into `baseApi`.
  **Client state** uses an RTK slice. Never use both for the same data; do not add TanStack
  Query.
- **Feature isolation:** production feature code may import from `@/redux`, `@/consts`,
  `@/utils`, and `@/ui`, never from another feature's internals. Always use the `@/` alias.
- **Accessible interactions** use `radix-ui` primitives, never hand-rolled equivalents.
- Custom `VITE_*` environment values are accessed only through `src/consts/env.ts`. The one
  exception is the direct `import.meta.env.DEV` compile-time guard in `src/main.tsx`, which
  lets Vite eliminate the mock-only dynamic import from production. All `VITE_*` values are
  public; never put secrets in them.

## Testing helpers

Tests that need Redux only use `renderWithProviders`. Tests that need a data router—such as
components using `NavLink`, `Outlet`, route errors, or navigation hooks—use
`renderWithRouterAndProviders` with route objects and optional `initialEntries`. Both helpers
in `src/tests/test-utils.tsx` create a fresh Redux store per call.

`@testing-library/jest-dom` and `@testing-library/user-event` are intentionally absent. Use
Vitest core matchers and Testing Library's `fireEvent` unless a separately approved dependency
change adds them.

## Adding a feature

Copy the shape documented in `src/features/notes/README.md` exactly, or use the counter guide
for a client-state feature. The shared integration points are route registration, i18n
namespaces, a sidebar `NavLink`, and—when applicable—spreading MSW handlers into
`src/mocks/handlers.ts`.

## Gotchas

- Editor TypeScript diagnostics for i18n keys may remain stale after editing `he.json`; trust
  `npm run build` (`tsc -b`) as ground truth.
- In tests, MSW resolves relative handler paths against jsdom's origin. `.env.test` must stay
  `http://localhost:3000/api`.
- Windows: stopping a background `npm run dev` can orphan the Vite child process holding the
  port. Kill by port (`Get-NetTCPConnection -LocalPort 5173`); prefer tests and builds for
  verification.
- `public/mockServiceWorker.js` is generated. After `npm ci`, run the audited local CLI with
  `npm exec --offline -- msw init public` when regeneration is required. If local dependencies
  are unavailable, stop; never download an ad hoc MSW version or edit the generated worker.
