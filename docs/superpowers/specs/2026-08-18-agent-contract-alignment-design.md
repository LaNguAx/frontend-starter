# Agent Contract Alignment Design

## Purpose

Make this repository safe and deterministic for a newly arrived coding agent, including an agent with 2024-era library knowledge or no internet access. The repository must teach the agent how to enter, inspect, change, and verify the project without guessing or substituting older conventions.

## Scope

This change aligns the existing starter rather than adding product functionality. It covers:

- the cold-entry instruction path (`AGENTS.md` → `CLAUDE.md` → task-specific guides);
- offline and stale-knowledge behavior;
- dependency-change authorization, audit, lockfile, and verification steps;
- first-clone identity and language customization;
- test location, naming, privacy, and router-aware rendering conventions;
- security-audit metadata that became stale after four dependencies were added;
- existing source/config violations found by the alignment audit;
- automated regression checks that fit the existing dependency set.

No dependency will be added, removed, or upgraded. The permanent `counter` and `notes` reference features, their tests, and their mocks will remain intact.

## Authoritative Documentation Model

`CLAUDE.md` is the operational contract. It will contain one ordered agent-entry protocol and the hard rules that apply to every change.

`AGENTS.md` remains a short portable entry point. It will require the agent to read `CLAUDE.md` completely and will summarize only the rules needed to prevent work from starting incorrectly.

`README.md` remains the human-facing project overview. It must agree with the operational contract but must not introduce an alternative workflow.

`LIBRARY_PATTERNS.md` is the offline stale-knowledge correction layer. It documents current library APIs and deliberate configuration choices that an older agent could otherwise "fix" incorrectly.

The feature READMEs remain the canonical implementation guides for server-state and client-state features. Their exceptions for tests and feature-private imports must be explicit.

`SECURITY_AUDIT.md` remains a historical and current security record. Historical counts must be clearly labeled, while the executive summary and current-state totals must describe the current 36 direct dependencies.

## Cold-Entry Agent Protocol

The operational contract will prescribe this order:

1. Read `AGENTS.md`, then `CLAUDE.md` in full.
2. If the first-clone checklist is still present, notify the user before doing other work; do not perform or mark setup complete without confirmation.
3. Check `node --version` and `npm --version`. Node must satisfy `>=24.15.0`.
4. Use npm only. Never substitute pnpm, Yarn, or Bun, and never regenerate `package-lock.json` with another package manager.
5. If dependencies are absent, use `npm ci`. If it cannot complete because the agent is offline and the cache is insufficient, stop and tell the user; do not improvise.
6. Read README and the relevant feature guide before structural work.
7. Read `LIBRARY_PATTERNS.md` before changing code, tests, or configuration that uses a library.
8. Before proposing a dependency change, read the dependency policy and security audit. Without internet access, stop at a proposal because advisories, provenance, release age, and artifact diffs cannot be verified.
9. Preserve unrelated user changes and never commit or push without explicit authorization.
10. Before declaring work complete, run `npm run test:run && npm run build && npm run lint && npm run format:check` and report the actual results.

Commands that can contact the network, especially `npx`, must not be used as an implicit downloader. The MSW worker regeneration instruction will require the audited local package after `npm ci`; an offline agent with no dependencies must stop rather than download or hand-edit the worker.

## Dependency Change Workflow

The current "bump the pin, then npm ci" sequence is impossible because `npm ci` refuses a manifest/lock mismatch. The aligned workflow will distinguish ordinary installation from authorized dependency maintenance:

1. Obtain explicit user approval for the named package and exact version.
2. With internet access, perform the security checks described by the audit methodology: advisory history, release age/cadence, provenance/publisher, install scripts, changelog-to-artifact diff, maintainer surface, and transitive-tree impact.
3. Update `package.json` and `package-lock.json` together using npm and an exact version. This is the sole documented exception to the ordinary "never npm install" rule.
4. Run `npm ci` to prove the committed lockfile reproduces cleanly.
5. Update `SECURITY_AUDIT.md`, including the current summary/matrix or an addendum and revision history as appropriate.
6. Run the complete four-command verification suite.

An offline agent cannot complete steps 2–3 safely and must not claim the dependency change is ready.

## First-Clone and Language Setup

The first-clone checklist will reference only identity strings that are actually rendered. The header and footer will render `app.title`; the generic `layout.header`, `layout.sidebar`, and `layout.footer` keys will be removed so a completed setup cannot leave visible template labels.

Changing the primary language must update:

- `fallbackLng` and `supportedLngs`;
- the typed resource source in `src/types/i18next.d.ts`;
- the initial `<html lang>` and `dir` attributes in `index.html`;
- every agent-facing statement that names Hebrew as the primary or typed-key language.

Logical RTL-safe utilities remain mandatory even when the primary language changes, because supported languages can still include RTL languages.

The README will stop promising a "deletable example": both reference features are permanent and the setup process deletes nothing.

## Source and Configuration Corrections

- Translate the root error boundary's fallback and unknown-error text through typed keys in both language files.
- Read `VITE_ENABLE_MOCKS` through the validated `env` export. Keep direct `import.meta.env.DEV` only as a documented compile-time exception used to eliminate MSW from production builds.
- Change documentation from "plain dev never loads mocks" to "plain dev does not enable mocks by default," because an explicit environment override remains supported.
- Remove the final `.vscode` ignore rule that overrides the intended settings-file exception; list `.env.test` among intentionally committed environment files.
- Replace the dialog's physical centering with `start-1/2`, `ltr:-translate-x-1/2`, and `rtl:translate-x-1/2`. This keeps the inline-start positioning and transform direction paired correctly in both writing directions.
- Pin `.nvmrc` to `24.15.0` so it agrees with `engines` and jsdom's floor.
- Enable `strict: true` in both TypeScript project configs and fix every resulting repository diagnostic. Document the setting alongside the other intentional TypeScript 6 options so an agent does not remove it or disable it as a shortcut.

## Test Conventions and Regression Protection

The intended convention will be made explicit:

- production component files and tests named after those components use PascalCase;
- other files use kebab-case;
- all tests live under `src/tests/`;
- feature tests mirror through `src/tests/features/<feature>/` and may be flattened there, matching the permanent examples;
- tests may import feature-private components directly; production code outside the feature may not;
- `@testing-library/jest-dom` and `user-event` are not installed, so tests use Vitest core matchers and `fireEvent` unless a separately approved dependency change occurs.

Add a router-aware test utility using the already installed React Router data APIs, while keeping `renderWithProviders` for components that need only Redux. The router helper will provide a fresh Redux store and a memory router so agents have a correct pattern for `NavLink`, `Outlet`, route errors, and navigation hooks.

Behavior changes will be test-first:

- a root-error-boundary test will first demonstrate that fallback text comes from i18n;
- a test for the router-aware render helper will first demonstrate rendering a component that requires router context;
- environment/mock behavior will be verified through build output and existing tests; add a focused test only if it can test observable behavior without coupling to Vite compile-time replacement.

Documentation/config-only changes will use targeted static checks in addition to the repository's full verification suite. No new policy-check dependency will be introduced.

## Security Audit Reconciliation

The current document must no longer present the original 32-package/304-package state as current. It will:

- state that the manifest currently has 36 direct dependencies;
- reconcile the current installed-tree/signature totals using fresh npm output;
- update the verdict summary to include the four addendum packages;
- correct the executive claim about malicious-package history to acknowledge the historical `react-hook-form@7.73.0` incident while preserving the clean verdict for the pinned version;
- update the recorded Node environment or clearly label older environment evidence;
- remove stale "planned" wording for the implemented path alias;
- preserve the original audit history rather than rewriting it as if later dependencies were present from the start.

If fresh network-backed security commands cannot run, claims that require them will not be invented. Repository-verifiable counts will be corrected, and unresolved external totals will be clearly dated or marked as requiring a connected re-audit.

## Verification and Success Criteria

The change is complete only when:

- a new agent can follow one ordered entry protocol without choosing between contradictory commands;
- offline failure behavior is explicit and safe;
- every documented dependency step is executable and preserves exact pins plus the audited lockfile;
- all current library patterns that commonly conflict with 2024 knowledge are explicitly protected;
- first-clone and language customization leave no stale identity or documentation claims;
- source conventions, test exceptions, and router-aware testing are unambiguous;
- Hebrew and English translation key sets remain identical;
- production application HTML and chunks exclude the imported MSW browser runtime and mock
  bootstrap and do not import or register the worker; the inert generated worker copied to
  `dist/mockServiceWorker.js` is expected;
- `npm run test:run`, `npm run build`, `npm run lint`, and `npm run format:check` all pass;
- `git diff` contains only intentional alignment changes, with no commit or push unless the user separately requests it.
