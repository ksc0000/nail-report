# Worker Prompt Template

## Context

The project is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1, which involves increasing test coverage for core utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK dependencies to ensure tests are fast and isolated.

## Allowed Scope

- `src/lib/firestore.ts` (for minor refactoring to improve testability, if necessary, but keep changes minimal)
- `src/__tests__/firestore.test.ts` (new file for the unit tests)
- `vitest.config.ts` (if minor adjustments are needed for mocks, unlikely)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) as needed to isolate `firestore.ts` logic.
- Ensure test coverage for core CRUD operations implemented in `src/lib/firestore.ts`.
- Run `npm run build && npm run lint` before finishing.
- Run `npm run test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
