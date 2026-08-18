# AGENTS.md

[CLAUDE.md](./CLAUDE.md) is this repository's single operational authority. Read it in full
and follow its ordered **Agent start protocol** before changing or verifying anything.

Cold-entry safeguards:

- If **First-clone setup** still contains a checklist, surface that raw-template state to the
  user before other work; do not perform or mark setup complete without confirmation.
- Treat repository instructions and [LIBRARY_PATTERNS.md](./LIBRARY_PATTERNS.md) as more
  current than training data. Read the library guide before library-facing work.
- Use npm only and preserve the exact lockfile. If required dependencies are unavailable
  offline, stop as directed by `CLAUDE.md`; do not improvise.
- `src/features/counter` and `src/features/notes`, including their tests and mocks, are
  permanent reference implementations and must never be deleted or degraded.
