# Worker Prompt Template

## Context

The current phase of the roadmap (Phase 2) focuses on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core helper functions.

## Objective

Add unit tests for the Firestore helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to implement unit tests for the `src/lib/firestore.ts` helper functions.

1.  **Create a new test file:** `src/lib/__tests__/firestore.test.ts`.
2.  **Set up Vitest mocks:** You will need to mock Firebase SDK functions, particularly those imported from `firebase/firestore`, such as `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, and any other Firestore-related functions used in `src/lib/firestore.ts`. Use `vi.mock` to achieve this.
3.  **Write unit tests for core CRUD operations:** Focus on the main functions for managing `nailItems`. Examples include:
    *   `addNailItem` (or similar function for creating a new document)
    *   `getNailItems` (or similar for fetching a collection)
    *   `updateNailItem` (or similar for updating a document)
    *   `deleteNailItem` (or similar for deleting a document)
    *   If `src/lib/firestore.ts` contains other critical helper functions (e.g., for tags or public shares), also cover those with tests.
4.  **Isolate tests:** Ensure each test focuses on a single function's logic. Mock external dependencies to prevent actual Firebase calls during tests.
5.  **Assert expected behavior:** Verify that the helper functions correctly interact with the mocked Firebase methods (e.g., `addDoc` was called with the correct data) and return expected results.

**Acceptance Criteria:**

*   A new file `src/lib/__tests__/firestore.test.ts` exists.
*   The file contains `describe` blocks and `it`/`test` cases covering the primary functions in `src/lib/firestore.ts`.
*   Firebase SDK functions are properly mocked using Vitest.
*   Tests demonstrate that the `firestore.ts` functions correctly call their underlying Firebase SDK counterparts with the expected arguments and handle return values appropriately.
*   All tests pass when running `npm test`.

**Required test commands:**
```bash
npm install # if new dependencies were somehow needed, though they shouldn't be for this task
npm test
npm run lint
npm run build
```
