# Project Context

This is an AI-assisted tool for tailoring pasted resume content to a pasted job description while keeping the user in control of every change. Product scope is defined in [`docs/mvp.md`](docs/mvp.md), and the technical direction is defined in [`docs/technical-design.md`](docs/technical-design.md). Treat both as the source of truth.

# Engineering Constraints

- Use TypeScript throughout, with React and Next.js.
- Do not add a separate backend service for the MVP.
- Do not add authentication, a database, persistent storage, or saved sessions.
- Keep secret-dependent work, including AI API calls, server-side.
- Do not add features explicitly listed as out of scope in `docs/mvp.md`.

# Working Rules

- Prefer the simplest implementation that satisfies the requirement.
- Do not make unrelated refactors or expand scope.
- Preserve existing product and architecture decisions.
- Surface ambiguities that materially affect implementation instead of silently inventing behavior.
- Keep changes focused and reviewable.

# Verification Expectations

- For implementation changes, run these standard checks:
  - `pnpm lint`
  - `pnpm exec tsc --noEmit`
  - `pnpm build`
- Run any additional relevant tests when they exist.
- Summarize what changed.
- State assumptions made.
- Report unresolved issues, risks, or limitations.
