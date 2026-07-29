# Worker Prompt Template

## Context

The product roadmap indicates Phase 2 is active, focusing on stability, test coverage, and UX. The first priority in Phase 2.1 is "Test coverage," specifically unit tests for Firestore helper functions using Vitest. This task initiates the process of improving test coverage for core application logic.

## Objective

Implement unit tests for helper functions in `src/lib/firestore.ts`.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts` (modifications to support testing, if necessary, but focus on testing)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (only if Vitest setup is incomplete, but prefer to assume it's ready)

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

## Worker prompt

Your task is to add unit tests for the core helper functions responsible for interacting with the `nailItems` collection in Firebase Firestore, located in `src/lib/firestore.ts`.

**Specific steps:**

1.  Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
2.  Set up Vitest and mock the Firebase SDK (e.g., `firebase/firestore`, `firebase/app`) as needed for unit testing the functions in `src/lib/firestore.ts`. Refer to the roadmap's mention of `vitest + vi.mock` for mocking Firebase SDK.
3.  Write unit tests for at least two key functions in `src/lib/firestore.ts` that perform CRUD operations on `nailItems`. Examples include:
    *   `getNailItems` (fetching items)
    *   `addNailItem` (creating an item)
    *   `updateNailItem` (updating an item)
    *   `deleteNailItem` (deleting an item)
    *   `getPublicShare` (if applicable and directly related to `firestore.ts` helpers).
    Prioritize testing functions that handle data fetching and manipulation.
4.  Ensure tests cover successful execution and, where appropriate, error handling paths for these functions.
5.  All tests should be self-contained and not interact with actual Firebase services.

**Acceptance Criteria:**

*   A new test file `src/__tests__/firestore.test.ts` (or similar) is added.
*   The new file contains unit tests for at least two Firestore helper functions from `src/lib/firestore.ts`.
*   Firebase SDK dependencies are correctly mocked using Vitest.
*   All new tests pass successfully when `npm test` is run.

**Required test commands:**

```bash
npm install # Ensure dev dependencies are installed if running for the first time
npm run build
npm run lint
npm test # To run the new unit tests
```
