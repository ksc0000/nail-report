# Worker Prompt Template

## Context

The `nail-report` application requires improved test coverage to enhance stability. The core Firebase helper functions are a good starting point for adding unit tests. `src/lib/firestore.ts` contains critical functions for interacting with Firebase Firestore.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. This will involve setting up appropriate mocks for the Firebase SDK dependencies to isolate the functions under test.

## Allowed Scope

- `src/lib/firestore.ts` (for minor, test-enabling refactoring if strictly necessary, but mainly for understanding target functions)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration or aliases are needed for testing setup, but prefer `vi.mock` directly in test files)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except `vite.config.ts` if strictly necessary for test setup.

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/app`) as necessary using `vitest`'s mocking utilities (`vi.mock`).
- Cover at least two key functions within `src/lib/firestore.ts` with unit tests, focusing on their logic rather than actual Firebase calls.
- Ensure the tests are isolated and do not require a live Firebase connection.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
