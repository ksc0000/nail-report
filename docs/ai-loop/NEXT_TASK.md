# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage objective by adding unit tests for core Firebase utility functions.

## Objective

Add Vitest unit tests for the helper functions defined in `src/lib/firestore.ts`.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but primarily testing existing exports)
- `src/__tests__/firestore.test.ts` (new test file)
- `vitest.config.ts` (if minor configuration is required for mocking)

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

Your task is to implement unit tests for the helper functions located in `src/lib/firestore.ts`.

**Detailed Steps:**

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` from Vitest to mock the Firebase Firestore SDK (e.g., `firebase/firestore`). Ensure that calls to `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDoc`, `getDocs`, `query`, `where`, etc., are mocked appropriately to control their behavior and verify interactions.
3.  **Test helper functions:** Write tests for the public-facing functions exported from `src/lib/firestore.ts`. Examples might include:
    *   `addNailItem`
    *   `updateNailItem`
    *   `deleteNailItem`
    *   `getNailItems`
    *   `getPublicShare` (if present)
    *   Any other CRUD or data retrieval functions.
4.  **Verify interactions:** Use Vitest's `toHaveBeenCalledWith` or similar matchers to assert that your helper functions correctly call the mocked Firebase SDK methods with the expected arguments.
5.  **Test return values/errors:** Ensure that functions handle successful operations and potential errors as expected, returning correct data or throwing appropriate errors.

**Acceptance Criteria:**

*   A new test file `src/__tests__/firestore.test.ts` exists.
*   The `firestore.test.ts` file contains unit tests for at least 3-4 key helper functions from `src/lib/firestore.ts`.
*   Firebase Firestore SDK dependencies are effectively mocked using `vi.mock`.
*   Tests verify correct interactions with the mocked SDK and expected function outcomes.
*   All new tests pass.

**Required Test Commands:**

```bash
npm install # Ensure dev dependencies are installed
npm test    # Run Vitest tests
npm run build
npm run lint
```
