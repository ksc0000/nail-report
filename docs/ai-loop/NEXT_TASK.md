# Worker Prompt Template

## Context

The current phase is 2.1: Test coverage. The roadmap prioritizes adding unit tests for Firebase helper functions. This task focuses on `src/lib/firestore.ts`.

## Objective

Implement unit tests for one or more helper functions in `src/lib/firestore.ts` using Vitest, with appropriate mocking of Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments if refactoring aids testability)
- `src/__tests__/firestore.test.ts` (new test file)
- `vite.config.ts` (if Vitest configuration is needed, e.g., setupFiles)
- `package.json` (only for adding a `test` script if not already present, do not add new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, beyond Vitest itself if not already installed as a dev dep)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Add unit tests for at least one or two core functions within `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`).
- Utilize `vitest` and mock Firebase SDK functionalities (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) to isolate the helper functions during testing.
- Ensure all new tests pass.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Acceptance Criteria

1.  A new file `src/__tests__/firestore.test.ts` exists and contains unit tests.
2.  At least one significant function from `src/lib/firestore.ts` is covered by tests.
3.  Firebase SDK dependencies are properly mocked within the tests.
4.  All tests in `src/__tests__/firestore.test.ts` pass when `npm run test` is executed.
5.  `npm run build` and `npm run lint` execute without errors.
