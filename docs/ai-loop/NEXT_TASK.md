# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the Firestore helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (only for essential Vitest configuration related to mocks, if absolutely necessary, but assume Vitest is generally configured)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker prompt

Your task is to add comprehensive unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: `src/__tests__/lib/firestore.test.ts`.
2.  **Implement `vi.mock`**: Use `vi.mock` to mock the Firebase Firestore SDK functions (e.g., `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `collection`, `query`, etc.) that are used within `src/lib/firestore.ts`. This ensures tests are isolated and don't make actual network calls.
3.  **Write unit tests**:
    *   Identify all exported helper functions in `src/lib/firestore.ts` that interact with Firestore.
    *   Write unit tests for each of these functions, covering their expected behavior.
    *   Ensure tests verify that the functions correctly call the mocked Firebase SDK methods with the appropriate arguments.
    *   Test both successful execution paths and error handling paths (e.g., what happens if a mocked Firestore call throws an error).
    *   Focus on functions related to CRUD operations for nail items (e.g., adding, retrieving, updating, deleting items).

**Acceptance Criteria**:
- A new file `src/__tests__/lib/firestore.test.ts` exists.
- This file contains `describe` and `test` blocks using Vitest syntax.
- The tests effectively mock Firebase Firestore SDK calls.
- Key Firestore helper functions are tested for their core logic and interaction with the mocked SDK.
- All tests pass when `npm test` is run.

**Required test commands**:
```bash
npm install # Ensure dependencies are up-to-date, if needed. No new deps will be added.
npm run build
npm run lint
npm test
```
