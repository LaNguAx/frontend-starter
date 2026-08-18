# Task: End-to-end alignment audit of this repository (read-only)

You are auditing the repository in your working directory: a public "best-practice frontend
starter" template designed to be safely used by AI coding agents — including agents with
OLDER training data and NO internet access. Your job is to find every contradiction and
every missing piece of information that could cause such an agent to drift from the repo's
documented conventions.

## Ground rules

1. **READ-ONLY.** Do not create, modify, or delete any file in the repository. You may run
   the verification scripts (`npm run test:run`, `npm run build`, `npm run lint`,
   `npm run format:check`) to check claims, but nothing else that mutates state.
2. **The repository is the authority on library APIs — not your training data.** This repo
   deliberately uses current (2026) APIs that may postdate your knowledge (documented in
   `LIBRARY_PATTERNS.md`). If any code looks wrong, outdated-incompatible, or "missing
   setup" to you, do NOT report it as a bug. Instead: check whether `LIBRARY_PATTERNS.md`
   (or another doc) explicitly preempts that exact confusion. If it does — no finding. If
   it does NOT — report it as a **documentation gap** ("a stale agent would conclude X
   here, and no doc corrects them"). Your own confusion is the test instrument.
3. Work only from repository contents. No internet needed — that is the point.
4. Every finding must cite exact locations (`file:line`) and, for contradictions, quote
   both conflicting texts verbatim. No speculation: if you cannot verify a suspicion from
   the repo alone, list it under "Open questions", not as a finding.

## What to read (all of it)

- Docs: `README.md`, `CLAUDE.md`, `AGENTS.md`, `LIBRARY_PATTERNS.md`, `SECURITY_AUDIT.md`,
  `src/features/notes/README.md`, `src/features/counter/README.md`, comments in
  `.env.example`
- Config: `package.json` (scripts, pins, engines), `vite.config.ts`, `tsconfig*.json`,
  `eslint.config.js`, `.prettierrc`, `.prettierignore`, `.npmrc`, `.nvmrc`,
  `.gitattributes`, `.gitignore`, `index.html`, `.vscode/settings.json`
- All of `src/` — every file

## Checks to perform

**A. Doc ↔ doc contradictions.** Any rule, convention, version, path, or claim stated in
more than one document must agree everywhere (e.g., conventions in CLAUDE.md vs README vs
feature READMEs; setup instructions in CLAUDE.md vs AGENTS.md; version floors; the
permanence of the counter/notes reference features).

**B. Doc ↔ code contradictions.** Every file path, symbol, script, i18n key, command, and
described behavior in the docs must exist and match reality (e.g., scripts tables vs
`package.json`; described patterns vs actual code in the referenced files; the API
tolerance policy vs the zod schemas and their tests; ignore-file consistency across
`.gitignore` / `.prettierignore` / ESLint `globalIgnores`).

**C. Convention violations in the code itself.** Audit every source file against the
documented conventions: PascalCase `.tsx` / kebab-case everything else; tests ONLY under
`src/tests/` mirroring `src/`; no JSX in router files; Tailwind logical utilities only
(search for `pl-`, `pr-`, `ml-`, `mr-`, `text-left`, `text-right`); no hardcoded
user-facing strings (everything through `t()`); `he.json` and `en.json` key sets
identical; typed Redux hooks only (never raw `useSelector`/`useDispatch`); composed class
strings through `cn()`; fire-and-forget promises marked with `void`; features never
importing another feature's internals; `@/` alias imports.

**D. Stale-agent confusion gaps (the most important check).** Read the code as if your
knowledge ends in 2024. List EVERY place where such an agent would think something is
broken, missing, or should be "fixed" — then check whether a doc explicitly preempts it.
Hunt beyond the obvious: build config, TS compiler options, package entry points, test
setup, i18n wiring, store wiring, anything. Each unpreempted confusion is a finding:
where, what the stale agent would wrongly do, and which doc should say what to stop them.

**E. Task-completeness.** Could an agent, using only this repo, correctly: add a new
feature end-to-end; add a translated string; write a test for a new component; add or
upgrade a dependency per policy; run the app with and without mocks; know what to do on a
fresh clone? Walk each task mentally against the docs and flag any step that requires
knowledge the repo does not contain.

## Report format (deliver as your final message — do not write it to a file)

Markdown, in this order:

1. **Summary** — counts per category, overall alignment verdict.
2. **Contradictions** (A + B) — most severe first. Each: location(s), both quotes, why it
   misleads, suggested one-line fix.
3. **Code convention violations** (C) — location, rule broken, suggested fix.
4. **Stale-agent gaps** (D) — the confusion, where it strikes, what a stale agent would do
   wrong, which doc should preempt it and with what sentence.
5. **Task-completeness gaps** (E).
6. **Open questions** — suspicions you could not verify from the repo alone.
7. **Verified-consistent list** — the major claims you checked that DID hold, so silence
   is evidence of checking, not skipping.
