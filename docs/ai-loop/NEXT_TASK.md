# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. This task focuses on beginning to add unit tests for Firebase helper functions. `src/lib/firestore.ts` contains core CRUD operations for nail items, making it a critical module to cover with tests.

## Objective

Implement unit tests for selected helper functions in `src/lib/firestore.ts` using Vitest, specifically focusing on `addNailItem` and `getNailItems`. This will involve setting up Firebase SDK mocking within the test environment.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactoring for testability, if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file for unit tests)
- `src/__mocks__/firebase/firestore.ts` (new file for Firebase Firestore SDK mocks, if needed)
- `src/setupTests.ts` (for Vitest global setup, if needed for mocking)
- `vite.config.ts` or `vitest.config.ts` (for Vitest configuration, if needed to integrate test files or mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; `vitest` should already be a dev dependency)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/lib/firestore.test.ts` for the unit tests.
- Mock Firebase Firestore SDK dependencies (`getFirestore`, `collection`, `addDoc`, `getDocs`, etc.) to isolate `firestore.ts` logic.
- Write unit tests that verify the correct behavior of at least `addNailItem` and `getNailItems` functions, including their interaction with the mocked Firebase SDK.
- Ensure tests run successfully.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
