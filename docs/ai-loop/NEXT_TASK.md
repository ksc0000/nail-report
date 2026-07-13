# Worker Prompt Template

## Context

The application relies heavily on helper functions in `src/lib/firestore.ts` for all interactions with the Firebase Firestore database, including managing `nailItems` and `publicShares`. Phase 2 of the roadmap prioritizes improving stability and test coverage. This task aims to establish foundational unit test coverage for these critical Firestore helper functions.

## Objective

Implement comprehensive unit tests for the functions within `src/lib/firestore.ts` using Vitest. This involves setting up appropriate mocks for the Firebase Firestore SDK to ensure isolated and reliable testing of the helper functions without actual database calls.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments for testability might be acceptable, but the primary focus is testing this file)
-   `src/__tests__/firestore.test.ts` (new file for unit tests)
-   `vite.config.ts` (if specific Vitest configuration is needed for mocking Firebase modules)

## Forbidden Scope

-   `src/main.tsx`
-   `commands/`
-   `firestore.rules`, `storage.rules`
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files or directories not explicitly listed in "Allowed Scope".

## Requirements

-   Keep the total diff (including new files) ≤ 150 lines.
-   Ensure the tests cover the primary CRUD operations (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, and functions related to `publicShares`) as defined in `src/lib/firestore.ts`.
-   Utilize `vi.mock()` effectively to mock Firebase Firestore SDK functions (e.g., `collection`, `query`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `doc`, `setDoc`) to test `src/lib/firestore.ts` in isolation.
-   Run `npm run build && npm run lint` successfully before finishing the task.
-   Report follow-up items or identified limitations as comments in the PR, not as additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
