# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2 of its roadmap, with a strong focus on improving stability, test coverage, and UX. The current task is to address the "2.1 Test coverage" goal by adding unit tests to the core Firebase helper functions. This is the first substantive task for the AI Loop.

## Objective

Add Vitest unit tests for the helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if absolutely necessary for testability, but focus is on testing)
- `src/__tests__/firestore.test.ts` (create this new file for tests)
- `src/__tests__/` (other new test files as needed for mocking setup)
- `vite.config.ts` (for Vitest configuration, if not already configured)
- `package.json` (to add `test` script if missing or configure test command)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (do not add new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Ensure the newly added tests provide good coverage for the functions in `src/lib/firestore.ts`.
- Utilize Vitest for testing.
- Mock Firebase SDK dependencies as necessary to ensure tests are isolated and run efficiently without actual Firebase calls.
- Run tests with `npm test` or `vitest` and ensure they pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to implement unit tests for the functions in `src/lib/firestore.ts`.

1.  **Examine `src/lib/firestore.ts`**: Understand the functions and their dependencies.
2.  **Set up testing environment (if necessary)**: Ensure Vitest is configured in `vite.config.ts` and there's an `npm test` script that runs Vitest. If not, add basic configuration.
3.  **Create `src/__tests__/firestore.test.ts`**: This file will contain your unit tests.
4.  **Mock Firebase SDK**: Use `vi.mock` to mock Firebase SDK methods (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) to prevent actual database calls during tests. Ensure mocks return expected values for successful operations and throw errors for failure scenarios to test error handling.
5.  **Write unit tests**:
    *   Test each public function in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`).
    *   Cover both successful execution paths and error handling paths (e.g., what happens if a Firestore operation fails).
    *   Use `expect` assertions to verify the behavior of the functions and their interactions with mocked Firebase methods.
6.  **Run tests**: Execute `npm test` to confirm all new tests pass.
7.  **Run lint and build**: Execute `npm run lint` and `npm run build` to ensure no new errors are introduced.

Focus on mocking only what's necessary to test the `firestore.ts` logic, not the Firebase SDK itself.

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains tests that mock Firebase SDK dependencies.
- The tests cover the main CRUD operations and helper functions in `src/lib/firestore.ts`.
- All tests pass when running `npm test`.
- `npm run build && npm run lint` completes without errors.
