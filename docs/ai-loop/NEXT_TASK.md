# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses "Phase 2.1 Test coverage" by adding unit tests for core helper functions. Vitest is already designated as the test runner.

## Objective

Implement unit tests for the helper functions defined in `src/lib/firestore.ts`. This task involves creating a new test file and writing tests that ensure the correct behavior of the Firestore-related utility functions, utilizing Vitest for execution and mocking Firebase SDK dependencies as necessary.

## Allowed Scope

- `src/lib/firestore.ts` (for reading existing code)
- `src/__tests__/` (for creating new test files, e.g., `src/__tests__/firestore.test.ts`)
- `src/lib/` (for other helper function imports if required by tests)
- `vitest.config.ts` (if minor configuration is needed for mocking, but prefer to keep changes within test files)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest is assumed to be already installed as a dev dependency)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep the total diff size for the PR under 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`, for the unit tests.
- Write tests that cover at least two distinct helper functions within `src/lib/firestore.ts`.
- Mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) as required by the tests using `vi.mock` or similar Vitest features to isolate the unit under test.
- Ensure all tests pass.
- Run `npm run build && npm run lint` before finishing and ensure no errors or warnings are reported.
- Report any follow-up items or assumptions as comments in the PR, not as additional code changes.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
