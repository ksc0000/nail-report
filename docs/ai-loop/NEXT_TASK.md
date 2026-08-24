# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. A key area for stability is adding comprehensive unit test coverage, starting with the core Firebase utility functions. This task specifically targets the Firestore helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, ensuring Firebase SDK methods are properly mocked.

## Allowed Scope

-   `src/lib/firestore.ts` (no functional changes, potentially type imports only)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   `src/setupTests.ts` (if global Vitest setup is needed for Firebase mocks)
-   `vite.config.ts` (if Vitest configuration needs adjustment for test setup or aliases)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside `src/` and configuration files directly related to Vitest setup.

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   A new test file `src/__tests__/lib/firestore.test.ts` must be created.
-   Unit tests must cover at least two functions from `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
-   Firebase Firestore SDK functions (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) must be mocked using `vi.mock('firebase/firestore')` to ensure tests are isolated and do not interact with a live Firebase project.
-   Assertions should verify that the helper functions correctly call the mocked Firebase methods with the expected arguments and return the expected values.
-   All new tests must pass when running `npm test`.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
