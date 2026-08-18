# AGENTS.md

AI-agent instructions for this repository live in [CLAUDE.md](./CLAUDE.md).

Read that file and follow it in full. In particular:

- If its **First-clone setup** section still contains a checklist (rather than a
  "completed on <date>" marker), this clone is still the raw template — surface the setup
  to the user in your first session.
- `src/features/counter` and `src/features/notes` are **permanent reference
  implementations** — never delete them; new features copy their shape.
- Before writing any code that touches a library, read
  [LIBRARY_PATTERNS.md](./LIBRARY_PATTERNS.md) — this repo uses current (2026) APIs that
  may postdate your training data.
