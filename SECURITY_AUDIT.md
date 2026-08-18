# Security & Dependency Audit

|                                      |                                                                                                                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Project**                          | `frontend-starter` — Vite + React + TypeScript starter template                                                                                                                    |
| **Repository**                       | <https://github.com/LaNguAx/frontend-starter>                                                                                                                                      |
| **Initial audit date**               | 2026-08-17                                                                                                                                                                         |
| **Document revision**                | 8 (2026-08-18) — see [Revision history](#revision-history)                                                                                                                         |
| **Current scope**                    | All 36 direct dependencies (15 runtime, 21 development) at their exact pinned versions, plus the locked and installed transitive tree                                              |
| **Initial audit scope**              | 32 direct dependencies, 304 verified packages, and the 2025–2026 npm supply-chain threat landscape                                                                                 |
| **Initial method**                   | 7 parallel Claude Opus 5 audit agents (285 verification actions), cross-checked against the npm registry, OSV.dev/GHSA, vendor IOC datasets, and upstream changelogs/tarball diffs |
| **Initial audit environment**        | Node.js v24.12.0 (LTS) · npm 11.12.1 · Windows 11 Pro                                                                                                                              |
| **Current verification environment** | Node.js v24.19.0 (LTS) · npm 11.12.1 · Windows 11 Pro — re-verified by the maintainer 2026-08-18                                                                                   |

---

## 1. Executive summary

**All 36 currently pinned dependency versions are approved for this repository: 13 clean approvals, 23 approvals with recorded caveats, 0 holds.**

- **Zero vulnerabilities at the current pins.** The initial 32 `package@version` pairs and the four later additions were checked as recorded below. No currently pinned version is affected. At the package-name level, 35 of 36 names have no malicious-code advisory history; `react-hook-form@7.73.0` is the documented historical exception, while the pinned `7.85.0` is clean and approved (Addendum A).
- **Two pins are security floors.** `react-router@8.3.0` and `vitest@4.1.10` are themselves the patched releases for a High and a Critical advisory respectively. They must never be downgraded (§5.2).
- **The current transitive tree is verified and locked.** `package-lock.json` contains 438 non-root dependency entries. On 2026-08-18, connected `npm audit --json` reported 0 vulnerabilities across those 438 entries; `npm ls --all --parseable` exposed 393 installed package paths (394 lines including the project root); and `npm audit signatures` verified registry signatures for all 393 installed packages, with 183 verified attestations.
- **One package executes code at install time.** `msw` has a `postinstall` hook; it was extracted and read line-by-line and is benign (§7, msw entry).
- **Every release-pattern anomaly was investigated and cleared** — including four that matched the classic shape of a supply-chain compromise (§5.4).

The original 2026-08-17 audit remains historical evidence: it covered 32 direct dependencies and a 304-package installed tree. Addendum A records the four later direct-dependency assessments; revision 7 reconciles their totals without attributing them to the earlier 7-agent run.

---

## 2. Technology stack

### 2.1 Stack composition

| Layer                   | Choice                                                                                           | Version                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| Build tool / dev server | Vite (Rolldown-based v8 line)                                                                    | 8.2.1                                             |
| UI library              | React + React DOM                                                                                | 19.2.8                                            |
| Language                | TypeScript (6.0 bridge line — see §2.3)                                                          | 6.0.3                                             |
| State management        | Redux Toolkit (includes RTK Query for server state) + React-Redux                                | 2.12.0 / 9.3.0                                    |
| Routing                 | React Router                                                                                     | 8.3.0                                             |
| Validation              | Zod                                                                                              | 4.4.3                                             |
| Dates                   | date-fns                                                                                         | 4.4.0                                             |
| Forms                   | react-hook-form + @hookform/resolvers (zod bridge) — see Addendum A                              | 7.85.0 / 5.9.0                                    |
| UI primitives           | Radix UI (unified package) — see Addendum A                                                      | 1.6.7                                             |
| Internationalization    | i18next + react-i18next + browser language detector                                              | 26.3.6 / 17.0.11 / 8.2.1                          |
| Styling                 | Tailwind CSS v4 (CSS-first config) via first-party Vite plugin                                   | 4.3.3                                             |
| Class utilities         | clsx + tailwind-merge                                                                            | 2.1.1 / 3.6.0                                     |
| Test runner             | Vitest                                                                                           | 4.1.10                                            |
| Component testing       | Testing Library (react + dom) on jsdom                                                           | 16.3.2 / 10.4.1 / 30.0.1                          |
| API mocking             | Mock Service Worker (MSW)                                                                        | 2.15.0                                            |
| Linting                 | ESLint 10 (flat config) + typescript-eslint + react-hooks + react-refresh + @eslint/js + globals | 10.8.1 / 8.65.0 / 7.1.1 / 0.5.4 / 10.0.1 / 17.7.0 |
| Formatting              | Prettier                                                                                         | 3.9.6                                             |
| React plugin            | @vitejs/plugin-react                                                                             | 6.0.5                                             |
| Type declarations       | @types/node · @types/react · @types/react-dom                                                    | 24.13.3 / 19.2.18 / 19.2.4                        |

### 2.2 Deliberate stack decisions

- **Redux Toolkit + RTK Query** over TanStack Query for server state — one prescribed pattern, RTK Query included in the same package (no additional dependency).
- **MSW with static, hand-written fixtures** — no faker-style data generator; deterministic fixtures are preferred for tests, and MSW mocks at the network layer so RTK Query code runs unmodified in tests and browser dev.
- **No `eslint-config-prettier`** — ESLint 10's recommended configs (and typescript-eslint's) ship no formatting rules, so there is nothing for Prettier to conflict with. This also keeps the project clear of a package with a 2025 compromise history (§8.1).
- **No path-alias plugin** — the single `@/ → src/` alias is configured directly in `tsconfig` + `vite.config.ts` rather than via `vite-tsconfig-paths`.
- **jsdom over happy-dom** — Testing Library's assumed environment; more spec-compliant.

### 2.3 TypeScript 6.0 vs 7.x

The pinned `typescript@6.0.3` is deliberately one generation behind the registry `latest` (7.0.2). TypeScript 7 is the Go-native compiler rewrite; 6.0 is the final JavaScript-based line, designed by Microsoft as the bridge release. The Vite scaffold itself pins the 6.0 line, and ecosystem tooling (typescript-eslint's typed linting in particular — its 8.65.0 release adds an explicit TS 7 guard that errors out) is not yet assumed TS 7-ready. Revisit when typescript-eslint declares TS 7 support.

---

## 3. Version pinning policy

### 3.1 Policy

1. **Exact pins in `package.json`** — no `^`/`~` range operators. Rationale: nearly every malicious release in the 2025–2026 npm attack waves shipped as a _patch_ bump on a trusted package (`debug@4.4.2`, `eslint-config-prettier@10.1.7`, `chalk@5.6.1`), which is precisely the digit that range operators float.
2. **`.npmrc` → `save-exact=true`** — every future `npm install <pkg>` records an exact version automatically.
3. **Committed `package-lock.json`, installs via `npm ci`** — extends pinning to all 438 current non-root lockfile entries with integrity hashes; `npm ci` refuses to run if lock and manifest disagree.
4. **Upgrades are deliberate events** — follow [CLAUDE.md's dependency-change workflow](./CLAUDE.md#dependency-changes). Explicit approval must cover the package, exact version, and runtime or development dependency class; the workflow then requires connected audit checks, an exact npm update, reproducibility, an audit-record update, and complete verification. Dependency approval never grants commit or push authority; those actions require a separate explicit user request. If the repository adopts Renovate/Dependabot, configure minor-level updates only (for example, Renovate `matchUpdateTypes: ["minor"]`) so upgrades arrive as reviewable proposals.

### 3.2 Pinned versions intentionally behind registry `latest`

Verified against the registry on the audit date:

| Package             | Pinned  | Registry latest | Reason                                                 |
| ------------------- | ------- | --------------- | ------------------------------------------------------ |
| `typescript`        | 6.0.3   | 7.0.2           | Bridge-line decision (§2.3)                            |
| `@types/node`       | 24.13.3 | 26.2.0          | Types track Node majors; project targets Node 24 LTS   |
| `typescript-eslint` | 8.65.0  | 8.67.0          | Audited scaffold version; two-minor gap, no advisories |
| `globals`           | 17.7.0  | 17.11.0         | Audited scaffold version; data-only package, minor gap |

All 28 other pins in the initial 32-package audit were the registry `latest` at audit time. The last two rows are candidates for the deliberate minor-bump workflow. Addendum A records the later packages separately and does not retroactively expand this point-in-time registry comparison.

---

## 4. Audit methodology

Each of the initial 32 packages was audited individually for:

1. **Release-cadence anomalies** — full `npm view <pkg> time` history; out-of-band publishes, dormancy-then-burst patterns, weekend/rushed releases.
2. **Publish provenance** — presence of SLSA v1 provenance attestations (`dist.attestations`) and the publishing identity (`_npmUser`): GitHub Actions OIDC trusted publishing vs. human/bot token.
3. **Install-time scripts** — `preinstall`/`install`/`postinstall` hooks that execute on consumer machines (maintainer-only hooks such as `prepare`, `prepack`, `preversion` were identified and excluded).
4. **Changelog-to-artifact verification** — release notes checked against the actual published artifact: `npm diff` between the pinned version and its predecessor, tarball unpacking, file-count and unpacked-size deltas. Claims were verified, not trusted.
5. **Advisory history** — GitHub Advisory Database, OSV.dev, Snyk; both the pinned version and the package's full history, including any past supply-chain incident even if remediated.
6. **Maintainer surface** — npm maintainer roster, publisher continuity across recent releases, repository moves.

In parallel, an ecosystem sweep catalogued 2025–2026 npm supply-chain incidents and checked every incident's IOC list against this dependency set (§8). The check harness was validated with positive controls (nine known-malicious `package@version` pairs, all correctly flagged).

For the initial audit, the resolved tree was verified with `npm ls` (32/32 direct dependencies at pinned versions, no invalid peers), `npm audit` (0 vulnerabilities / 304 packages), `npm audit signatures` (304 verified signatures, 114 verified attestations), and a production build + lint pass. Addendum A records the four later package assessments and the then-current tree result; §9 records the fresh revision-7 verification.

---

## 5. Findings

### 5.1 Verdict summary

| Verdict               | Count | Meaning                            |
| --------------------- | ----- | ---------------------------------- |
| ✅ Approve            | 13    | No concerns worth a caveat         |
| 🟡 Approve with notes | 23    | Safe to use; caveat recorded below |
| ⛔ Hold               | 0     | —                                  |

### 5.2 Security floors — do not downgrade

| Package        | Floor      | Advisory fixed by this version                                                                                                                |
| -------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `react-router` | **8.3.0**  | GHSA-qwww-vcr4-c8h2 — RSC-mode CSRF bypass, High, CVSS 7.1. Affected: ≥8.0.0 <8.3.0 and ≥7.12.0 <7.18.2. Every 8.x below 8.3.0 is vulnerable. |
| `vitest`       | **4.1.10** | CVE-2026-73653 / GHSA-p63j-vcc4-9vmv — Browser Mode file-access permission-gate bypass, Critical, CVSS 9.4 (`@vitest/browser` ≤4.1.9).        |

### 5.3 Advisory clearance — clarifications

- **36/36 current pinned versions are clean; 35/36 package names have never carried a malicious-code (`MAL-*`) advisory.** The exception is the historical `react-hook-form@7.73.0` incident; pinned `react-hook-form@7.85.0` is unaffected and approved (Addendum A).
- "No advisory at the pinned version" ≠ "no advisories ever": several names carry ordinary vulnerabilities at _other_ versions — `vite` (22 GHSAs, incl. the 2026 dev-server advisories CVE-2026-39363/-39364/-39365 and CVE-2026-53571, all patched below 8.2.x), `react-router` (20), `vitest` (2), `react` (2), `react-dom` (1), `zod` (1: CVE-2026-6991, ≤4.3.6), `i18next` (2, incl. CVE-2026-63402 prototype pollution, ≤26.3.3), and `react-hook-form` (the single malicious release above). **None affects the pinned versions.** The other 28 names have no advisory at any version in the recorded checks.
- **React2Shell (CVE-2025-55182, Critical RCE) does not apply**: it affects the React Server Components payload packages (`react-server-dom-webpack`/`-turbopack`/`-parcel`), not `react`/`react-dom` client rendering in a Vite SPA. Same for the related DoS advisories CVE-2025-55184 and CVE-2026-23869.
- The only advisory ever filed against `eslint` itself (CVE-2025-50537, RuleTester) was withdrawn on 2026-02-03.

### 5.4 Release-pattern anomalies investigated and cleared

Four release patterns matched classic compromise signatures; each was verified benign through artifact-level evidence:

| Package                       | Anomaly                                                                                                                          | Clearance                                                                                                                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `date-fns@4.4.0`              | ~20-month dormancy, then 4 releases in 11 days                                                                                   | Package _shrank_ 21.3 MB → 10.9 MB (CDN builds extracted to `@date-fns/cdn`); zero deps; no `scripts` field at all                                                                  |
| `react-redux@9.3.0`           | 17-month gap since 9.2.0                                                                                                         | Coordinated same-day Redux release (64 min after RTK 2.12.0); diff is a single `connect` deprecation marker (+5.5 KB); release _restored_ OIDC trusted publishing that 9.2.0 lacked |
| `react-i18next@17.0.11`       | `<Trans>` parser dep `html-parse-stringify` revived after 5 years dormancy under a new repo/publisher, 6 min before this release | Publicly documented handover to the i18next org; original owners retained; no install hooks anywhere in the chain                                                                   |
| `@testing-library/dom@10.4.1` | No provenance, 370-day gap, Sunday publish via shared bot token                                                                  | Dependency diff exactly matches changelog (chalk → picocolors); tarball shrank; 386 days of high-volume exposure since, zero advisories                                             |

### 5.5 Install-time execution surface

`msw` is the **only** package in the set with a consumer-executed install hook. Its `postinstall` was extracted from the registry tarball and read in full: it no-ops unless the consuming project's `package.json` contains an `msw.workerDirectory` field, in which case it re-runs msw's own `cli init` to refresh the local service-worker file. No network access, no dynamic code, no filesystem access outside the project. All other packages: no `preinstall`/`install`/`postinstall`.

### 5.6 Provenance coverage

Current connected verification found SLSA v1 provenance attestations for 19 of 36 direct pinned releases. The 17 without attestations are `@eslint/js`, `@hookform/resolvers`, `@testing-library/dom`, the three DefinitelyTyped packages, `clsx`, `date-fns`, `eslint`, `eslint-plugin-react-hooks`, `globals`, the i18next trio, `prettier`, `react-hook-form`, and `typescript`. The initial audit found 17 of its 32 direct releases attested; the two attested later additions are `radix-ui` and `@vitest/coverage-v8`. Provenance ties an artifact to its publishing workflow but is not, by itself, a safety verdict (§10).

---

## 6. Dependency verdict matrix

Age is measured at the audit date (2026-08-17). "Prov." = SLSA provenance attestation on the pinned release.

| Package                            | Version | Type    | Released   | Age (d) | Publisher                                    | Prov. | Verdict |
| ---------------------------------- | ------- | ------- | ---------- | ------- | -------------------------------------------- | ----- | ------- |
| `react`                            | 19.2.8  | runtime | 2026-07-21 | 27      | Meta (react-bot, OIDC)                       | ✅    | 🟡      |
| `react-dom`                        | 19.2.8  | runtime | 2026-07-21 | 27      | Meta (react-bot, OIDC)                       | ✅    | 🟡      |
| `@reduxjs/toolkit`                 | 2.12.0  | runtime | 2026-05-15 | 94      | Redux team (6 maintainers, OIDC)             | ✅    | 🟡      |
| `react-redux`                      | 9.3.0   | runtime | 2026-05-15 | 94      | Redux team (5 maintainers, OIDC)             | ✅    | 🟡      |
| `react-router`                     | 8.3.0   | runtime | 2026-07-22 | 26      | Remix/Shopify (2 maintainers, OIDC)          | ✅    | 🟡      |
| `zod`                              | 4.4.3   | runtime | 2026-05-04 | 105     | colinhacks (solo, OIDC)                      | ✅    | 🟡      |
| `date-fns`                         | 4.4.0   | runtime | 2026-05-29 | 80      | kossnocorp (solo)                            | —     | 🟡      |
| `i18next`                          | 26.3.6  | runtime | 2026-07-09 | 39      | i18next org (adrai, jamuhl)                  | —     | ✅      |
| `react-i18next`                    | 17.0.11 | runtime | 2026-07-22 | 26      | i18next org (adrai, jamuhl)                  | —     | 🟡      |
| `i18next-browser-languagedetector` | 8.2.1   | runtime | 2026-02-12 | 186     | i18next org (adrai, jamuhl)                  | —     | ✅      |
| `clsx`                             | 2.1.1   | runtime | 2024-04-23 | 846     | lukeed (solo)                                | —     | 🟡      |
| `tailwind-merge`                   | 3.6.0   | runtime | 2026-05-10 | 99      | dcastil (solo, OIDC)                         | ✅    | 🟡      |
| `vite`                             | 8.2.1   | dev     | 2026-08-06 | 11      | VoidZero (Evan You + vitebot, OIDC)          | ✅    | 🟡      |
| `@vitejs/plugin-react`             | 6.0.5   | dev     | 2026-07-30 | 18      | VoidZero (OIDC)                              | ✅    | ✅      |
| `typescript`                       | 6.0.3   | dev     | 2026-04-16 | 123     | Microsoft (typescript-bot token)             | —     | 🟡      |
| `tailwindcss`                      | 4.3.3   | dev     | 2026-07-16 | 32      | Tailwind Labs (3 maintainers)                | ✅    | ✅      |
| `@tailwindcss/vite`                | 4.3.3   | dev     | 2026-07-16 | 32      | Tailwind Labs (3 maintainers)                | ✅    | ✅      |
| `prettier`                         | 3.9.6   | dev     | 2026-07-21 | 27      | Prettier org (11 maintainers)                | —     | 🟡      |
| `vitest`                           | 4.1.10  | dev     | 2026-07-06 | 42      | Vitest team / VoidZero (5 maintainers, OIDC) | ✅    | 🟡      |
| `msw`                              | 2.15.0  | dev     | 2026-07-08 | 40      | kettanaito (solo, OIDC)                      | ✅    | 🟡      |
| `jsdom`                            | 30.0.1  | dev     | 2026-07-29 | 19      | jsdom org (6 maintainers, OIDC)              | ✅    | 🟡      |
| `@testing-library/react`           | 16.3.2  | dev     | 2026-01-19 | 210     | Testing Library org (17 maintainers, OIDC)   | ✅    | ✅      |
| `@testing-library/dom`             | 10.4.1  | dev     | 2025-07-27 | 386     | Testing Library org (bot token)              | —     | 🟡      |
| `eslint`                           | 10.8.1  | dev     | 2026-08-07 | 10      | OpenJS Foundation (eslintbot token)          | —     | 🟡      |
| `@eslint/js`                       | 10.0.1  | dev     | 2026-02-06 | 192     | OpenJS Foundation (eslintbot token)          | —     | ✅      |
| `typescript-eslint`                | 8.65.0  | dev     | 2026-07-20 | 28      | typescript-eslint (2 maintainers, OIDC)      | ✅    | ✅      |
| `eslint-plugin-react-hooks`        | 7.1.1   | dev     | 2026-04-17 | 122     | Meta (react-bot token)                       | —     | 🟡      |
| `eslint-plugin-react-refresh`      | 0.5.4   | dev     | 2026-08-10 | 7       | arnaud-barre (solo, OIDC)                    | ✅    | 🟡      |
| `globals`                          | 17.7.0  | dev     | 2026-06-22 | 56      | sindresorhus + 3 maintainers                 | —     | ✅      |
| `@types/node`                      | 24.13.3 | dev     | 2026-07-08 | 40      | DefinitelyTyped (Microsoft bot)              | —     | ✅      |
| `@types/react`                     | 19.2.18 | dev     | 2026-07-30 | 18      | DefinitelyTyped (Microsoft bot)              | —     | ✅      |
| `@types/react-dom`                 | 19.2.4  | dev     | 2026-07-30 | 18      | DefinitelyTyped (Microsoft bot)              | —     | ✅      |

### 6.1 Current-state continuation

The matrix above preserves the initial 32-package audit. These four later assessments complete the current 36-package verdict set; their evidence trails are in Addendum A.

| Package               | Version | Type    | Prov. | Verdict |
| --------------------- | ------- | ------- | ----- | ------- |
| `radix-ui`            | 1.6.7   | runtime | ✅    | 🟡      |
| `react-hook-form`     | 7.85.0  | runtime | —     | 🟡      |
| `@hookform/resolvers` | 5.9.0   | runtime | —     | 🟡      |
| `@vitest/coverage-v8` | 4.1.10  | dev     | ✅    | ✅      |

---

## 7. Per-package assessments

### Runtime dependencies

**`react@19.2.8` / `react-dom@19.2.8` — 🟡** Single-change patch (RSC decoding performance, PR #37087), versioned in lockstep; react has zero dependencies and no `scripts` field, react-dom's only dependency is `scheduler ^0.27.0`. Full SLSA provenance from `.github/workflows/runtime_release_from_ci.yml`; the react tarball is 6 bytes _smaller_ than 19.2.7. Notes: the repository is now `react/react` — the legitimate October 2025 transfer to the React Foundation, not a hijack; and the React 19 train's serious 2025–2026 advisory history (incl. CVSS 10.0 CVE-2025-55182) lives entirely in the `react-server-dom-*` sibling packages, none of which lists `react`/`react-dom` as affected.

**`@reduxjs/toolkit@2.12.0` — 🟡** OIDC-published with provenance, no install hooks, six maintainers, dependency set byte-identical to 2.11.2, and no advisory has ever been filed against it. Tarball diff fully explained: +13 Markdown files (a new `skills/` folder of AI-agent guidance now shipped in the package — a new but first-party, publicly announced surface), −93 test files, accounting exactly for the ~1 MB size drop. The 5-month release gap matches the project's own historical cadence.

**`react-redux@9.3.0` — 🟡** The 17-month gap since 9.2.0 was investigated as a takeover signal and cleared (§5.4); the release is a cosmetic `connect` deprecation with unchanged dependencies, and it _restored_ OIDC trusted publishing (9.2.0 had been a manual personal-token publish). Operational caveat: a package that can go 17 months between releases has a slow security-response cadence.

**`react-router@8.3.0` — 🟡, security floor** This release _is_ the fix for GHSA-qwww-vcr4-c8h2 (§5.2) and additionally moves session-ID generation to `crypto.randomUUID()`. Verified not affected by the July 2026 advisory cluster (CVE-2026-55685, -53666, -53667, -53668 — all confined to 7.x ranges). Caveats: the highest advisory velocity in this set (~10 advisories across 2025–2026, incl. a vendored-turbo-stream RCE, CVE-2026-42211) and the thinnest maintainer roster (2), offset by OIDC provenance publishing.

**`zod@4.4.3` — 🟡** 105 days old, zero runtime dependencies, no install hooks; verified diff is +3.3 KB of two documented regression fixes for 4.4.0. CVE-2026-6991 (Moderate, CUID handler) affects ≤4.3.6 only. Caveat: solo publisher (colinhacks) on a ~139M-weekly-download package — materially mitigated by OIDC trusted publishing with provenance, the control that blunts credential-theft takeover.

**`date-fns@4.4.0` — 🟡** The most compromise-shaped release profile in the set, investigated in depth and cleared (§5.4): the artifact _shrank_ by ~10 MB, has zero dependencies and no `scripts` field whatsoever, and no advisory exists against core date-fns at any version. Caveats: solo publisher (kossnocorp), no provenance attestation.

**`i18next@26.3.6` — ✅** Metadata-only release (+25 bytes: widens the optional `typescript` peer range to admit TS 7). Sits ahead of the only recent core advisory (CVE-2026-63402, prototype pollution, fixed in 26.3.4). Two long-standing org maintainers with verified publisher continuity. No provenance attestation (project has not adopted it).

**`react-i18next@17.0.11` — 🟡** The `html-parse-stringify` dormant-revival pattern was investigated as a hijack signal and cleared — a documented, legitimate re-homing under the i18next org with original owners retained (§5.4). No consumer install hooks anywhere in the chain; no advisory affects this package (the historical CVE-2021-23346 ReDoS was in the _old_ parser version, long superseded).

**`i18next-browser-languagedetector@8.2.1` — ✅** Six months in the field, +320-byte types-only diff matching its one-line changelog, no advisories at any version, same org maintainers with verified publisher continuity.

**`clsx@2.1.1` — 🟡** 846 days old, ~102M weekly downloads, zero advisories ever — the strongest adoption-based safety evidence in the set. Tarball unpacked and read: 10 files, 8.5 KB, plain string-concatenation implementation, no network/filesystem/eval. Caveats are structural: solo publisher (lukeed), no provenance (predates adoption), and no release in 2+ years — a future account takeover would land directly in the runtime tree.

**`tailwind-merge@3.6.0` — 🟡** 99 days old, ~70M weekly downloads, provenance-attested, zero runtime dependencies, no advisories; release content (Tailwind v4.3 support, +30.6 KB) matches the notes, and the release itself included a CI-hardening change. Caveat: solo publisher (dcastil).

### Development dependencies

**`vite@8.2.1` — 🟡** 11 days old at audit — the youngest core pin — so the diff was read in full: a routine weekly patch (7 fixes, each with a linked PR), no new dependencies (only `postcss`/`rolldown` range bumps), identical 36-file count, +11.5 KB. Full SLSA provenance traceable to the `v8.2.1` tag via `publish.yml`. All four 2026 vite dev-server advisories are patched well below 8.2.x.

**`@vitejs/plugin-react@6.0.5` — ✅** Single-fix patch (React Compiler preset filter made linear), provenance-attested, one unchanged runtime dependency, tarball _shrank_ 97 bytes. Advisory disambiguation verified: the advisories in the `vitejs/vite-plugin-react` repo affect the separate `@vitejs/plugin-rsc` package, not this one.

**`typescript@6.0.3` — 🟡** 123-day-old Microsoft stabilization release; zero runtime dependencies, no install hooks, no advisories against the `typescript` package at any version, near-universal adoption since April. Caveats: **no provenance attestation** (published by the token-based `typescript-bot`, not OIDC), and the 6.0 line is a maintained generation behind 7.x — security fixes now land primarily on 7.x (§2.3).

**`tailwindcss@4.3.3` / `@tailwindcss/vite@4.3.3` — ✅ / ✅** Lockstep monorepo releases published 31 seconds apart by Tailwind Labs, both provenance-attested, zero runtime dependencies (core) and a pinned three-dependency set (adapter), no install scripts, no advisories at any version, weekday-only release cadence. Core's 14 documented fixes account for a +9.5 KB delta; the adapter's single fix for +328 bytes.

**`prettier@3.9.6` — 🟡** Three small documented formatter changes, zero runtime dependencies, no `scripts` field, +2.7 KB at identical file count. Caveats: **no provenance attestation** (registry endpoint 404s); and the Prettier _ecosystem_ has real incident history — the July 2025 phishing compromise (CVE-2025-54313) hit `eslint-config-prettier`/`eslint-plugin-prettier`, though never the core `prettier` package (§8.1).

**`vitest@4.1.10` — 🟡, security floor** The coordinated embargoed fix release for CVE-2026-73653 (§5.2), shipped in an 18-minute window alongside 3.2.7 and 5.0.0-beta.6 two days before disclosure. Provenance-attested OIDC publish with a human approver gate; diff is minimal (+183 bytes, internal version bumps only). Caveat: the 4.x line has absorbed four critical browser/UI advisories in its lifetime — keep current within the line.

**`msw@2.15.0` — 🟡** The set's only consumer-executed `postinstall` hook — extracted and read: benign, long-standing, byte-identical to the predecessor's, and a no-op unless `msw.workerDirectory` is configured (§5.5). Provenance-attested OIDC publish; dependency set unchanged; the eight added files map exactly onto the one documented SSE feature; no advisory has ever been published for msw. Caveat: solo publisher (kettanaito), who also maintains several of msw's direct dependencies.

**`jsdom@30.0.1` — 🟡** Two-day fast-follow patch on a new major, fixing a `getComputedStyle()` regression from 30.0.0 — taking .1 over .0 is the right call. Provenance-attested; no consumer install hooks; no advisories ever against jsdom; six long-tenured maintainers. Notes: 19 days old at audit; the 30.x major raises the Node floor to ^22.22.2 || ^24.15.0 || ≥26 (satisfied by this project's Node 24 LTS).

**`@testing-library/react@16.3.2` — ✅** 210-day-old release whose entire change is one TypeScript type fix (+1 byte, identical dependencies). Provenance-attested OIDC publish, 17-maintainer org, no advisory at any version. Requires `@testing-library/dom` as an explicit peer — satisfied in this manifest.

**`@testing-library/dom@10.4.1` — 🟡** Three stacked anomalies (no provenance, 370-day gap, Sunday bot-token publish) individually investigated and cleared (§5.4); the release replaces `chalk ^4.1.0` with exact-pinned `picocolors 1.1.1` — a supply-chain _hardening_ change, verified in the registry dependency diff. 386 days of exposure since, zero advisories.

**`eslint@10.8.1` — 🟡** 10 days old at audit, so the full 705-line tarball diff was read: it maps 1:1 onto the five rule fixes in the release notes; runtime dependencies byte-identical to 10.8.0. OpenJS Foundation institutional ownership with a biweekly cadence. Notes: no provenance attestation (eslintbot token publishing); its only-ever advisory was withdrawn (§5.3).

**`@eslint/js@10.0.1` — ✅** Config-data package with zero runtime dependencies and one test script. The odd-looking registry artifact — a `10.0.0` timestamped 2024, eighteen months before 10.0.1 — is the documented accidental 2024 publish that the team deprecated; 10.0.1 is the real v10-line release, cut four minutes after `eslint@10.0.0` in the same automated run.

**`typescript-eslint@8.65.0` — ✅** Provenance-attested OIDC publish on the project's weekly-Monday cadence; the release's notable feature is itself defensive (a TS 7 detection guard). No advisory has ever named the package or its scope.

**`eslint-plugin-react-hooks@7.1.1` — 🟡** A one-day fast-follow to 7.1.0 — scrutinized accordingly: the verified diff is 17 lines re-adding a deprecated no-op rule for config compatibility. Caveats: no provenance (Meta `react-bot` token); and the heaviest runtime dependency surface in the set (~4 MB: `@babel/core`, `hermes-parser`, `zod`, etc., because the React Compiler is bundled).

**`eslint-plugin-react-refresh@0.5.4` — 🟡** 7 days old at audit — the youngest pin — so the entire `npm diff` vs 0.5.3 was read: two content lines (adds `"instant"` to the Next.js `allowExportNames` list). 5 files, 21.9 KB, zero dependencies, no `scripts` field, SLSA provenance via OIDC. Caveat: solo maintainer (arnaud-barre), largely neutralized by trusted publishing plus a two-line auditable diff.

**`globals@17.7.0` — ✅** Pure data package (a JSON list of global identifiers + generated types) — no executable code shipped, zero dependencies, no advisories, four maintainers including the ESLint lead. Verified diff touches only `globals.json`/`index.d.ts`.

**`@types/node@24.13.3`, `@types/react@19.2.18`, `@types/react-dom@19.2.4` — ✅ ✅ ✅** DefinitelyTyped declaration-only packages: no executable code, no `scripts` field, zero dependencies, no advisories at any version. Published by the Microsoft-operated `types` bot from reviewed monorepo PRs. Verified diffs are each a single documented type change (an fs/promises widening; the two halves of the coordinated `RendererUsable`/`use()` registry addition). The 8.5-month gap on `@types/react-dom` is normal DT behavior — republish only when types change.

---

## 8. Threat landscape 2025 – August 2026, checked against this stack

For the initial audit, every incident below was checked against the then-current 32 `package@version` pairs (OSV/MAL feeds plus Datadog `shai-hulud-2.0.csv` (537 rows), `consolidated_iocs.csv` (796 rows, deduped across Koi/StepSecurity/Aikido/Wiz/ReversingLabs/HelixGuard), and `teampcp/iocs.csv` (80 rows)). That initial set produced **zero matches**. The four later additions received the checks recorded in Addendum A; `react-hook-form` has the historical malicious-release exception described there, while its current pin is clean.

### 8.1 Incident register

| Date               | Incident                                                     | Vector                                                               | Key malicious versions                                             | Relevance to this stack                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2025-07-18         | ESLint/Prettier tooling phish (`npnjs.com`, CVE-2025-54313)  | Maintainer phishing → token theft                                    | `eslint-config-prettier@10.1.6/.7` + 4 packages                    | Core `prettier`/`eslint` never affected. This project deliberately omits `eslint-config-prettier`; if ever added, require ≥10.1.8                                        |
| 2025-09-08         | chalk/debug "Qix" incident (`npmjs.help` phish)              | Maintainer phishing; payload in bundle, **no install script**        | `debug@4.4.2`, `chalk@5.6.1` + 17 more (~2.6B weekly downloads)    | **Was transitively reachable**: `eslint` declares `debug ^4.3.2`; an unlocked install in the ~2h window would have resolved 4.4.2. Now blocked by the committed lockfile |
| 2025-09-15         | Shai-Hulud 1.0 worm                                          | Install-hook credential harvesting, self-propagation                 | `@ctrl/tinycolor@4.1.1/.2` + ~200 packages                         | No overlap                                                                                                                                                               |
| 2025-11-21         | Shai-Hulud 2.0 ("Second Coming") — largest npm event to date | `preinstall` hook, runner persistence                                | 796 backdoored packages (Zapier, ENS, PostHog, Postman scopes)     | Zero name matches; nearest misses are name-adjacent only (`@ensdomains/vite-plugin-i18next-loader`, `@lui-ui/lui-tailwindcss`, `okta-react-router-6`)                    |
| 2026-03-31         | `axios` account takeover (UNC1069 / Sapphire Sleet)          | Token theft; RAT via planted dependency                              | `axios@1.14.1`, `@0.30.4`                                          | axios absent from this tree                                                                                                                                              |
| 2026-04-22         | Shai-Hulud "Third Coming" (Bitwarden CLI)                    | Poisoned GitHub Actions workflow; targeted AI-tool credentials       | `@bitwarden/cli@2026.4.0`                                          | No overlap                                                                                                                                                               |
| 2026-05-11         | TanStack pipeline hijack                                     | CI compromise; **first malware with valid SLSA Build L3 provenance** | 42 `@tanstack/*` packages, 373 versions                            | No TanStack in this stack (RTK Query chosen instead); constrains how much weight provenance can carry (§10)                                                              |
| 2026-05-21         | `xuxingfeng` typosquat campaign (2 years undetected)         | Typosquats of Vite plugins                                           | `vite-plugin-react-extend@1.0.4` (lure for `@vitejs/plugin-react`) | Exact scoped name `@vitejs/plugin-react` verified in manifest                                                                                                            |
| 2026-06-29 → 07-03 | ViteVenom (PolinRider)                                       | **Scoped** typosquats of the `@vitejs/*` namespace; blockchain C2    | `@vitets/vite-ts` + 6 more                                         | Highest-relevance pattern for a Vite project: one transposed character from the real scope. Defeats the "scoped = safe" heuristic                                        |
| 2026-08-04         | `keyv`/`cacheable` worm (most recent; still settling)        | GitHub account hijack → `preinstall` hook, smart-contract C2         | `keyv@6.0.0` + 400+ packages                                       | Not in tree — verified by reading the dependency manifests of `vitest`, `msw`, `jsdom`, `@testing-library/dom`, `vite`, `eslint`: none declares keyv/cacheable           |

Also checked, no overlap: `node-ipc` (May 2026), SAP CAP / `@antv` / `@redhat-cloud-services` "mini Shai-Hulud" waves (Apr–Jun 2026), Microsoft-reported dependency-confusion campaigns (May 2026, OpenSearch/Elastic-themed).

### 8.2 Pattern lessons applied to this project

1. **Malicious releases ship as patch bumps on trusted names** → exact pins + lockfile (§3).
2. **Install hooks are the dominant execution vector** (Shai-Hulud waves, keyv) → this stack has exactly one install hook, read and verified (§5.5). Note the counter-example: the chalk/debug payload ran with _no_ install script, so `--ignore-scripts` alone is not sufficient.
3. **Provenance proves origin, not intent** (TanStack wave shipped SLSA-attested malware) → provenance is treated here as tamper-detection, never as a safety verdict.
4. **Registry-ahead-of-git is the recurring detection signal** (versions on npm with no matching commits) → the audit verified changelog-to-artifact correspondence for every recent release.

---

## 9. Transitive tree verification

- **Lockfile:** `package-lock.json` is committed and currently contains 438 non-root dependency entries with integrity metadata. Reproducible installs use `npm ci`.
- **Installed tree:** on 2026-08-18, `npm ls --all --parseable` exited 0 and returned 394 lines: the project root plus 393 installed package paths.
- **`npm audit --json`:** connected verification on 2026-08-18 reported 0 vulnerabilities and 438 total dependency entries (`prod`: 105, `dev`: 334, `optional`: 49; npm's categories overlap, so they are not summed independently).
- **`npm audit signatures`:** connected verification on 2026-08-18 audited 393 installed packages; all 393 had verified registry signatures and 183 had verified attestations.
- **Initial audit baseline:** before Addendum A, the 2026-08-17 tree had 304 verified packages, 0 vulnerabilities, 304/304 verified signatures, and 114 verified attestations.
- **Historical exposure, now closed:** `eslint@10.8.1 → debug ^4.3.2` would have resolved the malicious `debug@4.4.2` during its ~2-hour window on 2025-09-08 under an unlocked install. The committed lockfile is the control that closes this class.
- **Watch item (no action):** `vitest` depends on `obug` (a `debug` fork by `sxzz`, first published 2025-11-11) — clean in OSV, provenance-attested, legitimate; recorded because young forks adjacent to famous names are plausible future impersonation targets.

---

## 10. Residual risks (accepted)

| Risk                          | Detail                                                                            | Mitigation in place                                                                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Solo-publisher packages       | `zod`, `date-fns`, `clsx`, `tailwind-merge`, `msw`, `eslint-plugin-react-refresh` | Four of six use OIDC trusted publishing with provenance (`date-fns`, `clsx` do not); exact pins + lockfile prevent silent uptake of a hijacked release |
| No provenance attestation     | 17 of 36 direct releases (§5.6)                                                   | Institutional publishers or long-established accounts, exact pins, and verified registry signatures reduce—but do not eliminate—the risk               |
| Dormant high-download package | `clsx` — no release in 2+ years                                                   | Artifact read in full (8.5 KB, no I/O); pinned exactly                                                                                                 |
| Provenance ceiling            | SLSA-attested malware exists (TanStack wave)                                      | Provenance treated as origin evidence only; changelog-to-artifact verification performed instead                                                       |
| Advisory velocity             | `react-router` (~10 advisories 2025–26), `vitest` 4.x (4 critical)                | Pinned at patched floors (§5.2); keep current within these lines on every bump                                                                         |
| TS 6.0 line aging             | Security fixes land primarily on 7.x                                              | Deliberate bridge decision (§2.3); revisit at typescript-eslint TS 7 support                                                                           |

## 11. Hardening roadmap (optional, not yet applied)

1. **`min-release-age` cooldown** (`.npmrc`, npm ≥11.10, value in days): refuses versions younger than the threshold. Every fast-response incident in §8 was pulled within hours; a 24-hour gate neutralizes the smash-and-grab class. Trade-off: delays legitimate hotfixes equally.
2. **`ignore-scripts=true` with an explicit allowlist:** blocks the dominant execution vector. Trade-off: breaks msw's worker-refresh hook and native-build packages, and does not stop bundle-resident payloads (chalk/debug pattern). After `npm ci`, regenerate the worker only with the audited local CLI: `npm exec --offline -- msw init public`. If local dependencies are unavailable, stop; never download an ad hoc MSW version or edit the generated worker.
3. **`npm audit signatures` in CI** on every install, as tamper-detection between build and registry.
4. **Renovate/Dependabot with minor-only update PRs** to operationalize the deliberate-upgrade policy (§3.1.4).

## 12. Limitations

- OSV/GHSA coverage of malicious packages is strong but not exhaustive; packages removed by npm before an advisory was filed may be absent. A clean result is strong evidence, not proof.
- The `keyv`/`cacheable` incident was 13 days old at audit time and vendor IOC lists were still being amended; re-check before adding any `got`/`cacheable`/`cache-manager` transitive in the near term.
- Version strings for the TanStack, `@antv`, and `@redhat-cloud-services` waves are vendor-reported (Unit 42) and were not individually re-verified in OSV.
- This audit is a point-in-time assessment of the exact pinned versions. Any version bump re-opens the question and should repeat the §4 checks for the changed packages.

## 13. References

Primary sources: the npm registry (dependency manifests, `dist` integrity/attestation records, publish timestamps) and the OSV.dev query API. The initial audit queried its 32 pairs plus nine positive controls; Addendum A records equivalent follow-up checks for the four later additions.

Incident reporting and vendor analysis:
[CISA alert (Shai-Hulud)](https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem) · [CERT/CC VU#534320](https://www.kb.cert.org/vuls/id/534320) · [Datadog: Shai-Hulud 2.0](https://securitylabs.datadoghq.com/articles/shai-hulud-2.0-npm-worm/) · [Datadog IOC repository](https://github.com/DataDog/indicators-of-compromise/tree/main/shai-hulud-2.0) · [Wiz: Shai-Hulud 2.0](https://www.wiz.io/blog/shai-hulud-2-0-ongoing-supply-chain-attack) · [Microsoft: Shai-Hulud 2.0 guidance](https://www.microsoft.com/en-us/security/blog/2025/12/09/shai-hulud-2-0-guidance-for-detecting-investigating-and-defending-against-the-supply-chain-attack/) · [Wiz: chalk/debug](https://www.wiz.io/blog/widespread-npm-supply-chain-attack-breaking-down-impact-scope-across-debug-chalk) · [Semgrep: chalk/debug](https://semgrep.dev/blog/2025/chalk-debug-and-color-on-npm-compromised-in-new-supply-chain-attack/) · [Socket: Prettier tooling phish](https://socket.dev/blog/npm-phishing-campaign-leads-to-prettier-tooling-packages-compromise) · [Google GTIG: axios](https://cloud.google.com/blog/topics/threat-intelligence/north-korea-threat-actor-targets-axios-npm-package) · [Microsoft: axios mitigation](https://www.microsoft.com/en-us/security/blog/2026/04/01/mitigating-the-axios-npm-supply-chain-compromise/) · [Wiz: keyv/cacheable](https://www.wiz.io/blog/keyv-and-cacheable-npm-supply-chain-attack) · [Socket: Bitwarden CLI](https://socket.dev/blog/bitwarden-cli-compromised) · [Socket: React/Vue/Vite typosquats](https://socket.dev/blog/malicious-npm-packages-target-react-vue-and-vite-ecosystems-with-destructive-payloads) · [ViteVenom / PolinRider](https://opensourcemalware.com/blog/polinrider-jumps-the-fence) · [Unit 42: npm threat landscape tracker](https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/) · [Datadog: React2Shell](https://securitylabs.datadoghq.com/articles/cve-2025-55182-react2shell-remote-code-execution-react-server-components/) · [GitHub: npm security roadmap](https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/) · [npm trusted publishers](https://docs.npmjs.com/trusted-publishers/) · [pnpm supply-chain security](https://pnpm.io/supply-chain-security)

Full per-package evidence trails (per-finding source URLs, tarball hashes, diff line counts) are preserved in revision 2 of this document: git history, commit `3f57b97`.

## Addendum A — dependencies added after the initial audit

**`radix-ui@1.6.7` — 🟡 Approve with notes** (runtime; added 2026-08-17, same day as the audit)

Unstyled, accessible UI component primitives (Radix UI), developed by the WorkOS-backed Radix team. The unified `radix-ui` package was chosen over the individual `@radix-ui/react-*` packages (single dependency, tree-shakeable) and over `@radix-ui/themes` (a styled system that would conflict with the Tailwind-first stack). §4 checks performed at install time:

- **Registry:** published 2026-07-24 (24 days old); registry `latest`; maintainers `chancestrickland` + `mark-workos` (2).
- **Provenance:** SLSA v1 attestation present. **Install scripts:** none (dev-only scripts).
- **Advisories:** OSV query returns empty — no advisory at this or any version.
- **Tree impact at this addendum step:** +74 packages (internal `@radix-ui/*` workspace packages), bringing the then-installed tree to 379 packages. Post-install `npm audit`: 0 vulnerabilities; `npm audit signatures`: all packages verified, 179 attested.
- **Note:** brings the runtime direct-dependency count to 13 and adds the largest transitive surface of any runtime dependency in the project; all of it is same-monorepo Radix code.

**`react-hook-form@7.85.0` — 🟡 Approve with notes** (runtime; added 2026-08-17)

Form state management. §4 checks at install time: 9 days old on an unbroken weekly Friday-release cadence; OSV confirms the audited version is clean. **Recorded incident history:** `react-hook-form@7.73.0` (2026-04-18) was a malicious release (MAL-2026-2853 / GHSA-w8j3-qvc3-h56f) — flagged by GHSA within 17 minutes of publish, affected exactly that one version, cleanly superseded by 7.73.1 two days later. 7.85.0 is 12 releases past the incident. Additional caveat: releases carry no npm provenance attestation. No install scripts.

**`@hookform/resolvers@5.9.0` — 🟡 Approve with notes** (runtime; added 2026-08-17)

Bridges react-hook-form to zod schemas. Deliberately pinned at 5.9.0 rather than 5.9.1: 5.9.1 was published **hours before** this install (2026-08-17 07:36 UTC), inside the recency window this project treats as highest-risk. The 5.9.0→5.9.1 tarball diff was read anyway — a one-line field-path regex fix repeated across its bundle formats, benign — so bumping to 5.9.1 via the normal deliberate-upgrade flow is pre-cleared once it has settled. No advisories at any version; no install scripts; note the project's rapid-fire release style (for example, 9 patches within ~30 hours in July 2026) as a cadence baseline, not an anomaly.

**`@vitest/coverage-v8@4.1.10` — 🟢 Approve** (dev; added 2026-08-17)

V8 code-coverage provider for Vitest, from the Vitest core team — the same already-audited maintainer set as `vitest@4.1.10`, and version-locked to it (the provider must match the vitest version exactly). §4 checks performed at install time:

- **Registry:** published 2026-07-06 (six weeks before adoption, same day as `vitest@4.1.10`); maintainers `ariperkkio`, `antfu`, `hiogawa`, `oreanno`, `yyx990803` (5).
- **Provenance:** attestation present. **Install scripts:** none (the package's `scripts` are the maintainers' own `dev`/`build`; nothing executes on consumer install).
- **Advisories:** OSV returns empty for the package **and for each of its 10 direct dependencies** (no advisory at any version), including the unfamiliar `obug` — verified as a TypeScript/ESM fork of `debug` maintained by sxzz (Kevin Deng, Vue core team).
- **Tree impact at this addendum step:** +13 packages (the istanbul reporting family, `@bcoe/v8-coverage`, `ast-v8-to-istanbul`, `magicast`, `obug`), bringing the then-installed tree to 394 packages including the project root.
- **Note:** dev-only, loaded solely by `npm run test:coverage`; unreachable from the production bundle.

Addendum-era post-install state (2026-08-17): 394 `npm ls --parseable` lines including the project root, `npm audit` 0 vulnerabilities, and `npm audit signatures` 393 verified registry signatures / 183 verified attestations. The fresh revision-7 accounting is in §9.

## Revision history

| Rev | Date       | Change                                                                                                                                                                                                                                                                                                                         |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 2026-08-17 | Initial audit report compiled from the 7-agent workflow output (32 packages + ecosystem sweep)                                                                                                                                                                                                                                 |
| 2   | 2026-08-17 | Corrections: audit-artifact files misidentified as vendored tarballs; manifest migrated from `~` ranges to exact pins (`save-exact=true`)                                                                                                                                                                                      |
| 3   | 2026-08-17 | Full editorial restructure into this document; added post-install tree verification (lockfile, `npm audit`, signature verification), stack rationale, and threat-pattern lessons                                                                                                                                               |
| 4   | 2026-08-17 | Addendum A: `radix-ui@1.6.7` added to the runtime dependencies after §4-equivalent checks                                                                                                                                                                                                                                      |
| 5   | 2026-08-17 | Addendum A: `react-hook-form@7.85.0` (noting the 7.73.0 malicious-release incident history) and `@hookform/resolvers@5.9.0` (5.9.1 skipped for recency) added                                                                                                                                                                  |
| 6   | 2026-08-18 | Addendum A: `@vitest/coverage-v8@4.1.10` (dev) added after §4-equivalent checks incl. an OSV batch sweep of all its direct dependencies                                                                                                                                                                                        |
| 7   | 2026-08-18 | Reconciled the current 36-package verdicts and RHF history; added fresh Node/npm, lockfile, vulnerability, signature, and attestation evidence while preserving initial-audit facts                                                                                                                                            |
| 8   | 2026-08-18 | Revision-7 connected checks (originally run by a third-party review agent in its own sandbox) re-executed by the maintainer on the owner machine — all figures confirmed identical (0 vulnerabilities, 438 lockfile entries, 393 installed / 393 verified signatures, 183 attestations); environment row restamped accordingly |
