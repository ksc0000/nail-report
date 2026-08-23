# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task contributes to the "Test coverage" objective by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (for Vitest configuration, if necessary, but keep changes minimal)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or folders not explicitly listed in "Allowed Scope"

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`.
- Write unit tests for the functions within `src/lib/firestore.ts`.
- Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`).
- Focus on testing the logic of the helper functions, not the Firebase SDK itself.
- Ensure tests cover typical success cases and basic error handling where applicable.
- Keep diff ≤ 150 lines.
- Run `npm run test` (to ensure new tests pass) and `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
