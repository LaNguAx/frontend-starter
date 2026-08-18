# Agent Contract Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the starter deterministic and safe for newly arrived, offline, or stale-knowledge agents by aligning its instructions, code, configuration, tests, and security record.

**Architecture:** `CLAUDE.md` becomes the single operational contract, with `AGENTS.md` as its portable entry point and the remaining guides serving non-overlapping roles. Small behavior and configuration corrections are protected by focused Vitest tests using only the existing dependency set; security claims are updated only from repository evidence or fresh connected npm output.

**Tech Stack:** Node.js 24.15+, npm, TypeScript 6, Vite 8, Vitest 4, React 19, React Router 8, i18next 26, Tailwind CSS 4.

**Spec:** `docs/superpowers/specs/2026-08-18-agent-contract-alignment-design.md`

## Global Constraints

- Never delete or degrade `src/features/counter` or `src/features/notes`, including their tests and mocks.
- Do not add, remove, upgrade, or downgrade any dependency.
- Use npm only; never use pnpm, Yarn, or Bun.
- Before library-facing edits, follow `LIBRARY_PATTERNS.md`; its pinned 2026 APIs override model memory.
- Components use PascalCase filenames; component-named tests preserve PascalCase; other files use kebab-case.
- All tests remain under `src/tests/`; feature tests stay flattened under `src/tests/features/<feature>/` as documented by the permanent examples.
- Add typed UI text to both `he.json` and `en.json`; Hebrew remains the current typed-key source.
- Use logical Tailwind utilities for inline-direction behavior.
- Do not commit or push unless the user separately requests it.
- Stop rather than inventing evidence if network-backed security checks cannot run.

---

### Task 1: Establish the toolchain and baseline

**Files:** None.

**Interfaces:**

- Consumes: `package.json`, `package-lock.json`, `.nvmrc`.
- Produces: an installed exact dependency tree and recorded baseline results for later comparison.

- [ ] **Step 1: Verify the runtime before installation**

Run:

```powershell
node --version
npm --version
```

Expected: Node is at least `v24.15.0`; npm reports a version. If either command is unavailable, fix only the local command invocation or stop and report the environment problem—do not change repository package-manager files.

- [ ] **Step 2: Install the audited lockfile exactly**

Run:

```powershell
npm ci
```

Expected: exit 0 without changing `package.json` or `package-lock.json`. If the agent is offline and the cache is insufficient, stop; do not use another package manager or `npm install`.

- [ ] **Step 3: Run and record the pre-change baseline**

Run each command independently so every status is known:

```powershell
npm run test:run
npm run build
npm run lint
npm run format:check
```

Expected: record exact pass/fail output. Existing failures do not authorize unrelated fixes; later tasks must distinguish baseline failures from regressions.

- [ ] **Step 4: Confirm the initial diff contains only the approved design and plan**

Run:

```powershell
git status --short
git diff -- docs/superpowers/specs/2026-08-18-agent-contract-alignment-design.md docs/superpowers/plans/2026-08-18-agent-contract-alignment.md
```

Expected: no product/source changes yet.

---

### Task 2: Fix configuration violations with targeted checks

**Files:**

- Modify: `.nvmrc`
- Modify: `.gitignore`
- Modify: `tsconfig.app.json`
- Modify: `tsconfig.node.json`
- Modify: `src/main.tsx`
- Modify: `src/features/notes/components/DeleteNoteDialog.tsx`

**Interfaces:**

- Consumes: `package.json` engine metadata and the repository's source/configuration text.
- Produces: aligned Node pinning, strict TypeScript, validated custom env access, logical dialog positioning, and correct ignore behavior.

- [ ] **Step 1: Capture the pre-change violations with read-only checks**

Run:

```powershell
node -e "const fs=require('fs');const p=require('./package.json');process.exit(fs.readFileSync('.nvmrc','utf8').trim()===p.engines.node.replace(/^>=/,'')?0:1)"
rg -n "import\.meta\.env\.VITE_ENABLE_MOCKS" src/main.tsx
rg -n "left-1/2|-translate-x-1/2" src/features/notes/components/DeleteNoteDialog.tsx
rg -n '"strict": true' tsconfig.app.json tsconfig.node.json
git check-ignore -v --no-index .vscode/settings.json
git check-ignore -q --no-index .env.staging
```

Expected: the Node comparison exits 1; the direct env and physical-centering searches match;
strict has no matches; Git reports the final `.vscode` rule; and the `.env.staging` check exits
1, demonstrating that an arbitrary mode file is incorrectly trackable before the fix.

- [ ] **Step 2: Apply the minimal configuration/source fixes**

Change `.nvmrc` to:

```text
24.15.0
```

Add `"strict": true` to both TypeScript configs.

In `src/main.tsx`, import the validated env value and preserve the direct Vite production constant:

```ts
import { env } from '@/consts/env';

async function enableMocking() {
  if (!import.meta.env.DEV || env.VITE_ENABLE_MOCKS !== 'true') {
    return;
  }
```

In `DeleteNoteDialog.tsx`, replace the centering segment with:

```tsx
className =
  'fixed top-1/2 start-1/2 w-[90vw] max-w-sm ltr:-translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 rounded border border-gray-300 bg-white p-6 shadow-lg';
```

In `.gitignore`, replace the environment rules with default-deny behavior and exact public
allowlists, then delete the final `.vscode` line that overrides `!.vscode/settings.json`:

```gitignore
# Environment files are default-deny so real values never enter git.
# Only these public fixtures are committed on purpose.
.env*
!.env.example
!.env.mock
!.env.test
```

- [ ] **Step 3: Re-run the targeted checks**

Run:

```powershell
node -e "const fs=require('fs');const p=require('./package.json');process.exit(fs.readFileSync('.nvmrc','utf8').trim()===p.engines.node.replace(/^>=/,'')?0:1)"
rg -n "import\.meta\.env\.VITE_ENABLE_MOCKS|\bleft-" src/main.tsx src/features/notes/components/DeleteNoteDialog.tsx
rg -n '"strict": true' tsconfig.app.json tsconfig.node.json
git check-ignore -q --no-index .vscode/settings.json
if ($LASTEXITCODE -ne 1) { throw '.vscode/settings.json must be trackable' }
git check-ignore -q --no-index .env.staging
if ($LASTEXITCODE -ne 0) { throw '.env.staging must be ignored' }
git check-ignore -q --no-index .env.test.local
if ($LASTEXITCODE -ne 0) { throw '.env.test.local must be ignored' }
git check-ignore -q --no-index .env.example
if ($LASTEXITCODE -ne 1) { throw '.env.example must be trackable' }
git check-ignore -q --no-index .env.mock
if ($LASTEXITCODE -ne 1) { throw '.env.mock must be trackable' }
git check-ignore -q --no-index .env.test
if ($LASTEXITCODE -ne 1) { throw '.env.test must be trackable' }
```

Expected: the Node comparison exits 0; the banned source search produces no matches; the
settings-file `git check-ignore -q` exits 1; both TypeScript configs contain strict mode; the
two representative private environment paths are ignored; and exactly `.env.example`,
`.env.mock`, and `.env.test` are allowlisted as trackable.

- [ ] **Step 4: Verify TypeScript strict mode against the real project**

Run:

```powershell
npm run build
```

Expected: exit 0. Fix only diagnostics caused by enabling strict mode, preserving documented library patterns.

- [ ] **Step 5: Review checkpoint**

Run:

```powershell
git diff -- .nvmrc .gitignore tsconfig.app.json tsconfig.node.json src/main.tsx src/features/notes/components/DeleteNoteDialog.tsx
```

Expected: only the four enforced policies plus the environment default-deny/exact-allowlist
and editor-settings `.gitignore` corrections.

---

### Task 3: Add a router-aware rendering utility test-first

**Files:**

- Create: `src/tests/test-utils.test.tsx`
- Modify: `src/tests/test-utils.tsx`

**Interfaces:**

- Consumes: `RouteObject[]`, optional `initialEntries: string[]`, the existing `makeStore()` factory, and Testing Library `RenderOptions`.
- Produces: `renderWithRouterAndProviders(routes, options)` returning `{ store, router, ...renderResult }`.

- [ ] **Step 1: Write the failing router-context test**

Create `src/tests/test-utils.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { useLocation } from 'react-router';
import { renderWithRouterAndProviders } from '@/tests/test-utils';

function LocationProbe() {
  return <span>{useLocation().pathname}</span>;
}

test('renderWithRouterAndProviders supplies router context and an initial entry', () => {
  renderWithRouterAndProviders([{ path: '/target', Component: LocationProbe }], {
    initialEntries: ['/target']
  });

  expect(screen.getByText('/target')).toBeDefined();
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npm run test:run -- src/tests/test-utils.test.tsx
```

Expected: compile/test failure because `renderWithRouterAndProviders` is not exported.

- [ ] **Step 3: Implement the minimal helper**

Extend `src/tests/test-utils.tsx` with:

```tsx
import { createMemoryRouter, type RouteObject } from 'react-router';
import { RouterProvider } from 'react-router/dom';

interface RouterRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
}

export function renderWithRouterAndProviders(
  routes: RouteObject[],
  { initialEntries = ['/'], ...options }: RouterRenderOptions = {}
) {
  const store = makeStore();
  const router = createMemoryRouter(routes, { initialEntries });

  return {
    store,
    router,
    ...render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>,
      options
    )
  };
}
```

Keep the existing `renderWithProviders` API unchanged.

- [ ] **Step 4: Run the helper test and verify GREEN**

Run:

```powershell
npm run test:run -- src/tests/test-utils.test.tsx
```

Expected: 1 test passes without warnings.

- [ ] **Step 5: Review checkpoint**

Run:

```powershell
git diff -- src/tests/test-utils.tsx src/tests/test-utils.test.tsx
```

Expected: one focused helper and one real router-context test.

---

### Task 4: Translate route errors and render real app identity test-first

**Files:**

- Create: `src/tests/ui/RootErrorBoundary.test.tsx`
- Create: `src/tests/ui/components/Header.test.tsx`
- Create: `src/tests/ui/components/Footer.test.tsx`
- Modify: `src/ui/RootErrorBoundary.tsx`
- Modify: `src/ui/components/Header.tsx`
- Modify: `src/ui/components/Footer.tsx`
- Modify: `src/consts/i18n/he.json`
- Modify: `src/consts/i18n/en.json`

**Interfaces:**

- Consumes: typed `t()` keys and `renderWithRouterAndProviders` from Task 3.
- Produces: `common.somethingWentWrong`, `common.unknownError`, and visible `app.title` shell identity.

- [ ] **Step 1: Write failing shell identity tests**

Create `src/tests/ui/components/Header.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { Header } from '@/ui/components/Header';

test('renders the translated app title', () => {
  renderWithProviders(<Header />);
  expect(screen.getByText('סטארטר פרונטאנד')).toBeDefined();
});
```

Create `src/tests/ui/components/Footer.test.tsx` with the same test structure for `<Footer />`.

- [ ] **Step 2: Write the failing translated error-boundary test**

Create `src/tests/ui/RootErrorBoundary.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { renderWithRouterAndProviders } from '@/tests/test-utils';
import { RootErrorBoundary } from '@/ui/RootErrorBoundary';

test('renders translated fallback text for an unknown route error', async () => {
  renderWithRouterAndProviders([
    {
      path: '/',
      loader: () => {
        throw new Error('');
      },
      ErrorBoundary: RootErrorBoundary
    }
  ]);

  expect(await screen.findByRole('heading', { name: 'משהו השתבש' })).toBeDefined();
  expect(screen.getByText('שגיאה לא ידועה')).toBeDefined();
});
```

- [ ] **Step 3: Run the three tests and verify RED**

Run:

```powershell
npm run test:run -- src/tests/ui/components/Header.test.tsx src/tests/ui/components/Footer.test.tsx src/tests/ui/RootErrorBoundary.test.tsx
```

Expected: header/footer fail because they render layout placeholders; error test fails because the fallback strings are hardcoded in English.

- [ ] **Step 4: Add matching typed translations**

In both language files, replace the `common` object with matching keys. Hebrew:

```json
"common": {
  "loading": "טוען…",
  "somethingWentWrong": "משהו השתבש",
  "unknownError": "שגיאה לא ידועה"
}
```

English:

```json
"common": {
  "loading": "Loading…",
  "somethingWentWrong": "Something went wrong",
  "unknownError": "Unknown error"
}
```

Remove `layout.header`, `layout.sidebar`, and `layout.footer` from both files.

- [ ] **Step 5: Implement the translated UI behavior**

In `Header.tsx` and `Footer.tsx`, render `t('app.title')` instead of the layout placeholder keys.

In `RootErrorBoundary.tsx`, add `useTranslation()` and replace the hardcoded fallback branch with:

```tsx
const { t } = useTranslation();

return (
  <main className="p-8">
    <h1 className="text-2xl font-bold">{t('common.somethingWentWrong')}</h1>
    <p>{error instanceof Error && error.message ? error.message : t('common.unknownError')}</p>
  </main>
);
```

- [ ] **Step 6: Run the three tests and verify GREEN**

Run the same targeted command from Step 3.

Expected: 3 tests pass without unhandled-router warnings.

- [ ] **Step 7: Verify translation shape and types**

Run:

```powershell
npm run build
```

Expected: exit 0; typed keys and both JSON resources agree.

- [ ] **Step 8: Review checkpoint**

Run:

```powershell
git diff -- src/ui src/consts/i18n src/tests/ui
```

Expected: no hardcoded fallback UI strings and no generic shell-label keys.

---

### Task 5: Make the agent contract authoritative and offline-safe

**Files:**

- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`
- Modify: `README.md`
- Modify: `LIBRARY_PATTERNS.md`
- Modify: `src/features/notes/README.md`
- Modify: `src/features/counter/README.md`
- Modify: `index.html` only if wording needs a comment; keep its current Hebrew default values.

**Interfaces:**

- Consumes: the approved design and the working source conventions from Tasks 2–4.
- Produces: one deterministic entry path and non-conflicting human, library, and feature guides.

- [ ] **Step 1: Add the ordered start protocol to `CLAUDE.md`**

Insert an `## Agent start protocol` before “What this repo is” containing the ten ordered steps from the design: read instructions; surface first-clone state; check Node/npm; npm-only rule; `npm ci`/offline stop; read structural guides; read library patterns; connected dependency-audit gate; preserve user work/no commits; four-command verification.

Use these exact safety sentences:

```markdown
**npm is the only supported package manager.** Never use pnpm, Yarn, or Bun, and never regenerate `package-lock.json` with another tool.

If `npm ci` cannot complete because the agent has no internet and the npm cache is insufficient, stop and tell the user. Do not improvise an installation, change package managers, or edit the lockfile.

Without internet access, a dependency change stops at a proposal: advisory, provenance, release-age, and artifact-diff checks cannot be claimed from memory.
```

- [ ] **Step 2: Replace the impossible dependency workflow**

In `CLAUDE.md` and README, distinguish normal installs (`npm ci`, never `npm install`) from explicitly approved dependency maintenance. Document this exact sequence:

```markdown
1. Get explicit approval for the package and exact version.
2. Read `SECURITY_AUDIT.md` and perform its connected audit checks.
3. Run `npm install --save-exact <package>@<version>` to update the manifest and lockfile together; this is the sole exception to the ordinary `npm ci`-only rule.
4. Run `npm ci` to verify reproducibility.
5. Update `SECURITY_AUDIT.md` and its revision history.
6. Run `npm run test:run && npm run build && npm run lint && npm run format:check`.
```

State that agents must never execute the placeholder command literally; `<package>` and `<version>` are documentation metavariables.

- [ ] **Step 3: Align first-clone and language instructions**

Update the identity checklist to say `app.title` is rendered by header/footer. Remove the README phrase “which code is a deletable example.”

Extend the language checklist to include:

```markdown
- update `index.html`'s initial `lang` and `dir`;
- update every Hebrew-primary statement in `CLAUDE.md`, `README.md`, both feature guides, and `LIBRARY_PATTERNS.md`;
- retain logical utilities for every supported RTL language.
```

- [ ] **Step 4: Clarify testing and privacy conventions**

Use one consistent rule everywhere:

```markdown
Component implementation files and tests named after those components use PascalCase. All other files use kebab-case. Tests live under `src/tests/`; feature tests are flattened under `src/tests/features/<feature>/` to match the permanent examples. Tests may import feature-private components directly; production code outside the feature may not.
```

Document both rendering helpers and state that `@testing-library/jest-dom` and `user-event` are intentionally absent; use Vitest core matchers and `fireEvent` unless a separately approved dependency change adds them.

- [ ] **Step 5: Expand stale-knowledge protection**

Add a TypeScript 6 section to `LIBRARY_PATTERNS.md` documenting `strict: true`, `ignoreDeprecations: "6.0"`, and `erasableSyntaxOnly: true` as intentional current settings.

Expand the ESLint section to preserve the exact preset APIs:

```markdown
`reactHooks.configs.flat.recommended` and `reactRefresh.configs.vite` are valid current flat-config presets; do not expand them into legacy hand-wired rule objects.
```

Expand Testing Library guidance with the intentional `jest-dom` absence and the router-aware helper.

Clarify that direct `import.meta.env.DEV` in `main.tsx` is the sole environment-access exception because Vite must statically eliminate the mock-only import from production; custom `VITE_*` values still go through `env.ts`.

Replace `npx msw init` guidance with:

```markdown
After `npm ci`, run the audited local CLI with `npm exec --offline -- msw init public` when regeneration is required. If local dependencies are unavailable, stop; never download an ad hoc MSW version or edit the generated worker.
```

- [ ] **Step 6: Correct mock-mode wording**

Every occurrence of “plain `npm run dev` never loads/enables mocks” becomes “plain `npm run dev` does not enable mocks by default; an explicit `VITE_ENABLE_MOCKS=true` override still opts in.”

- [ ] **Step 7: Run targeted documentation consistency scans**

Run:

```powershell
rg -n "deletable example|Plain `npm run dev` never|Never `npm install`|layout\.(header|sidebar|footer)|react-router-dom|tailwind\.config|@testing-library/jest-dom|user-event|pnpm|Yarn|Bun|npm exec --offline" README.md CLAUDE.md AGENTS.md LIBRARY_PATTERNS.md src/features
```

Expected: obsolete phrases have no matches; intentional warnings and modern-pattern examples appear only in their explanatory contexts.

- [ ] **Step 8: Review checkpoint**

Read `AGENTS.md` as if entering cold, follow every link/step in order, then read the diff:

```powershell
git diff -- AGENTS.md CLAUDE.md README.md LIBRARY_PATTERNS.md src/features/notes/README.md src/features/counter/README.md index.html
```

Expected: no duplicated alternative workflow and no instruction requiring internet without an offline stop condition.

---

### Task 6: Reconcile the current security record from evidence

**Files:**

- Modify: `SECURITY_AUDIT.md`

**Interfaces:**

- Consumes: 36 manifest dependencies, the existing four addendum assessments, current Node/npm output, installed-tree output, and connected npm security output when available.
- Produces: a current executive summary that preserves clearly labeled historical evidence.

- [ ] **Step 1: Capture repository-verifiable current counts**

Run:

```powershell
node -e "const p=require('./package.json'); console.log({runtime:Object.keys(p.dependencies).length,dev:Object.keys(p.devDependencies).length,total:Object.keys(p.dependencies).length+Object.keys(p.devDependencies).length})"
npm ls --all --parseable
node --version
npm --version
```

Expected manifest count: `{ runtime: 15, dev: 21, total: 36 }`. Record the actual installed-tree and runtime outputs rather than copying old prose.

- [ ] **Step 2: Capture connected security evidence**

Run:

```powershell
npm audit --json
npm audit signatures
```

Expected from the last recorded audit: zero vulnerabilities and signed packages. If these commands cannot access the registry, retain the dated 2026-08-18 addendum evidence and label it as the latest connected result; do not invent fresh totals.

- [ ] **Step 3: Update current-scope and verdict summaries**

Make these repository-verifiable corrections:

- current direct dependencies: 36;
- verdict summary: 13 clean approvals, 23 approvals with notes, 0 holds;
- pinned versions: 36/36 clean at the recorded connected audit;
- package-name malicious history: 35/36 have no malicious-code advisory history; `react-hook-form` has the documented historical 7.73.0 incident, while pinned 7.85.0 is approved;
- add the four addendum packages to the verdict matrix or explicitly include them in a current-state continuation table;
- remove “planned” from the implemented alias statement.

Use fresh tree/signature counts only if Step 2 produced them. Keep original 32/304 figures only where explicitly labeled “initial audit before Addendum A.”

- [ ] **Step 4: Correct environment provenance**

Keep the initial audit environment as historical evidence and add a separate “Current verification environment” row using Step 1 output. Do not rewrite the original 7-agent audit as if it ran under the newer environment.

- [ ] **Step 5: Reconcile all repeated totals**

Run:

```powershell
rg -n "32|304|36|394|393|183|17 of 32|32/32|12 clean|20 approvals|planned" SECURITY_AUDIT.md
```

For every match, label it clearly as initial/historical or update it to the evidenced current value. The executive summary, §5.1, §5.3, §5.6, the verdict matrix, §9, and Addendum A must agree.

- [ ] **Step 6: Review checkpoint**

Run:

```powershell
git diff -- SECURITY_AUDIT.md
```

Expected: no security claim exceeds the available evidence, and the historical RHF incident is acknowledged consistently.

---

### Task 7: Run full verification and perform a cold-entry audit

**Files:** All modified files; no new implementation files beyond those listed above.

**Interfaces:**

- Consumes: all task deliverables.
- Produces: evidence that behavior, types, formatting, production bundling, and agent onboarding agree.

- [ ] **Step 1: Run the full required suite**

Run each independently and preserve the outputs:

```powershell
npm run test:run
npm run build
npm run lint
npm run format:check
```

Expected: all exit 0, with no warnings treated as success.

- [ ] **Step 2: Verify production application chunks exclude and do not register MSW**

After the successful build, run:

```powershell
rg -n "setupWorker|msw/browser|enableMocking|mockServiceWorker\.js|serviceWorker\.register" dist/index.html dist/assets
Test-Path dist/mockServiceWorker.js
```

Expected: the application-file search has no matches and `Test-Path` returns `True`. The generated public worker is intentionally copied to `dist/`, but the production application chunks must not contain the imported MSW runtime or import/register that worker. Inspect any match; do not infer this result from filename size alone.

- [ ] **Step 3: Re-run repository invariants**

Run:

```powershell
node -e "const fs=require('fs');const p=require('./package.json');process.exit(fs.readFileSync('.nvmrc','utf8').trim()===p.engines.node.replace(/^>=/,'')?0:1)"
rg -n "from ['\"]\.{1,2}/|import ['\"]\.{1,2}/" src
rg -n "\b(useSelector|useDispatch)\b" src --glob "!src/redux/hooks/redux-hooks.ts" --glob "!**/README.md"
rg -n "(pl|pr|ml|mr)-|text-(left|right)|\b(left|right)-" src --glob "*.tsx"
rg -n "Something went wrong|Unknown error|layout\.(header|sidebar|footer)" src --glob "!src/consts/i18n/*.json"
rg -n '"somethingWentWrong"|"unknownError"' src/consts/i18n/he.json src/consts/i18n/en.json
git check-ignore -q --no-index .env.staging
if ($LASTEXITCODE -ne 0) { throw '.env.staging must be ignored' }
git check-ignore -q --no-index .env.test.local
if ($LASTEXITCODE -ne 0) { throw '.env.test.local must be ignored' }
git check-ignore -q --no-index .env.example
if ($LASTEXITCODE -ne 1) { throw '.env.example must be trackable' }
git check-ignore -q --no-index .env.mock
if ($LASTEXITCODE -ne 1) { throw '.env.mock must be trackable' }
git check-ignore -q --no-index .env.test
if ($LASTEXITCODE -ne 1) { throw '.env.test must be trackable' }
```

Expected: the Node invariant exits 0; the first four searches return no violations; the
translation-resource search finds both keys in both locale files; the two representative
private environment paths are ignored; and the three intentional public fixtures are
trackable.

- [ ] **Step 4: Simulate a new offline/stale agent**

Starting with only `AGENTS.md`, write down the exact path an agent follows for:

1. a fresh clone with no `node_modules` and no internet;
2. adding a server-state feature;
3. writing a route-aware component test;
4. proposing a dependency upgrade while offline;
5. completing ordinary code work.

Expected: every path reaches an explicit command or stop condition without relying on unstated library knowledge.

- [ ] **Step 5: Inspect the final diff and worktree**

Run:

```powershell
git status --short
git diff --check
git diff --stat
git diff -- .
```

Expected: no whitespace errors, no generated `dist/` or dependency artifacts tracked, no deleted reference implementation, and no unrelated user changes.

- [ ] **Step 6: Report actual evidence without committing**

Report files changed, tests/build/lint/format results, security checks that did or did not have network evidence, and any remaining open question. Do not commit or push.
