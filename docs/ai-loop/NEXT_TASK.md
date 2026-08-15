```markdown
# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2 is active, with a focus on improving stability, test coverage, and UX. Specifically, 2.1 (Test coverage) lists "Unit tests for Firestore helper functions (`src/lib/firestore.ts`)" as a key item. This task is also the first item in the "Jules-ready Tasks" list. This task will initiate the testing effort for the application's core logic.

## Objective

Implement Vitest unit tests for a few core helper functions within `src/lib/firestore.ts`. The goal is to establish the testing pattern for Firestore interactions and ensure basic helpers are covered.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability, but primarily adding tests)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only to add a `test` or `vitest` script if missing, but no new dependencies)
- `vite.config.ts` (minor adjustments for Vitest configuration if absolutely necessary, but assume Vitest is largely set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval – Vitest is assumed to be installed)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Implement unit tests for at least 1-2 existing helper functions in `src/lib/firestore.ts`.
- Focus on functions that involve basic Firestore operations or data transformations (e.g., `addNailItem`, `getNailItems`, or any utility functions that construct queries/documents).
- Use `vitest` for the test runner and `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
- Ensure the new tests run successfully.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` or `npm run vitest` to confirm tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Set up `vi.mock('firebase/firestore')` and any other necessary Firebase modules to isolate the functions under test from actual Firebase calls. Mock common functions like `doc`, `collection`, `getDocs`, `setDoc`, `updateDoc`, `deleteDoc`, etc., as needed for the helpers you choose to test.
3.  **Select functions to test**: Identify 1-2 relatively straightforward helper functions in `src/lib/firestore.ts` that interact with Firestore or transform data, such as `addNailItem`, `getNailItems`, or any utility functions related to document/collection references.
4.  **Write unit tests**: Implement unit tests for the selected functions. Ensure your tests cover successful execution paths and basic error handling if applicable to the function's logic.
5.  **Run tests**: Execute `npm run test` (or `npm run vitest` if configured differently) to verify your tests pass.
6.  **Lint and Build**: Ensure the project still builds and passes linting checks with `npm run build && npm run lint`.

Remember to keep the scope tight, focusing on demonstrating how to test these functions effectively without overcomplicating the initial implementation. The overall diff should remain under 150 lines.
```
