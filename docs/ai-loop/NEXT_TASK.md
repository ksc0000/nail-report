# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for a core utility file.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if necessary for testing)
- `src/__tests__/lib/firestore.test.ts` (new test file)
- `package.json` (only if adding a `test` script or modifying existing `test` related scripts; no new dependencies)
- `vite.config.ts` (only if adding or modifying Vitest configuration, e.g., for `vi.mock`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, beyond Vitest setup which is already part of the roadmap)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

You are tasked with adding unit tests for the helper functions in `src/lib/firestore.ts`. These functions interact directly with Firebase Firestore to manage nail items and public shares.

1.  **Create a new test file:** Create `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK:** Utilize `vi.mock` to mock the Firebase Firestore SDK (e.g., `firebase/firestore`). Ensure that your mocks allow you to control the responses of Firestore operations (e.g., `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`).
3.  **Test core `nailItems` CRUD operations:** Write unit tests for the following functions in `src/lib/firestore.ts`:
    *   `getNailItems` (test successful retrieval and handling of empty collections)
    *   `addNailItem` (test successful addition and error handling)
    *   `updateNailItem` (test successful update and error handling)
    *   `deleteNailItem` (test successful deletion and error handling)
4.  **Test `publicShares` CRUD operations:**
    *   `addPublicShare` (test successful addition)
    *   `deletePublicShare` (test successful deletion)
    *   `getPublicShare` (test successful retrieval)
5.  **Consider edge cases:** Test both successful execution paths and error scenarios (e.g., Firestore throwing an error).
6.  **Keep tests focused:** Each test should verify a single, specific behavior of a function.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
