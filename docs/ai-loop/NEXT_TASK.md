# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. This task specifically targets "2.1 Test coverage" by adding unit tests for Firebase helper functions. Vitest is identified as the test runner, implying it's already set up and ready for use.

## Objective

Add comprehensive unit tests for the functions within `src/lib/firestore.ts` using Vitest and mock the Firebase SDK as needed to isolate tests.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if strictly necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if essential for Vitest configuration, e.g., aliasing for mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts`.
- Write unit tests for the core functions in `src/lib/firestore.ts` (e.g., functions for adding, getting, updating, deleting nail items or related data).
- Effectively mock the Firebase Firestore SDK using `vitest` and `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure all tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
