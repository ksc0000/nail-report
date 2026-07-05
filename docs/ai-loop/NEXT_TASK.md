# Worker Prompt Template

## Context

The current roadmap focuses on improving stability, test coverage, and UX. Phase 2.1 specifically targets unit tests for helper functions. This task aims to kickstart the test coverage for core utility files.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This involves creating a new test file and mocking Firebase SDK dependencies as necessary.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications to make functions testable if needed, e.g., exports)
- `src/__tests__/firestore.test.ts` (new test file for `firestore.ts` helpers)
- `vitest.config.ts` (if mocking setup is required)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file named `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two significant helper functions within `src/lib/firestore.ts`.
- Effectively mock Firebase SDK (Firestore) calls using `vi.mock` to ensure tests are isolated and run without actual Firebase interaction.
- Ensure the new tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
