```markdown
# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by targeting foundational helper functions.

## Objective

Add Vitest unit tests for the helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (for minor adjustments to improve testability, if necessary, though unlikely for these helpers)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (for Vitest configuration, if needed)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except `vite.config.ts`.

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Prefer adding tests when touching `src/lib/` files (this task is explicitly about tests).

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Your task is to implement unit tests for the Firebase Firestore helper functions within `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Set up Vitest mocking:** Configure Vitest to mock the Firebase SDK (`firebase/firestore` and potentially `firebase/app`) to isolate the `firestore.ts` functions from actual Firebase calls during tests. Focus on mocking the necessary Firestore methods (e.g., `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`).
3.  **Write unit tests:**
    *   Implement tests for key functions in `src/lib/firestore.ts`, such as `createNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
    *   Ensure tests cover typical successful execution paths for these functions.
    *   Focus on verifying that the functions correctly interact with the mocked Firebase SDK (e.g., `addDoc` was called with the correct collection and data).
4.  **Run tests:** Execute `npm run test` to ensure all new tests pass.

**Acceptance Criteria:**
-   A new file `src/__tests__/firestore.test.ts` exists.
-   `src/__tests__/firestore.test.ts` contains unit tests for at least `createNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
-   The Firebase SDK is mocked to prevent actual network calls during tests.
-   All tests in `src/__tests__/firestore.test.ts` pass when `npm run test` is executed.
-   The `npm run build` and `npm run lint` commands complete without errors.
```
