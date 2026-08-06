# Worker Prompt Template

## Context

The `nail-report` application needs improved stability and test coverage. This task initiates the test coverage effort by focusing on core Firebase Firestore helper functions. Adding unit tests for these functions will ensure their reliability and provide a safety net for future refactors, aligning with Phase 2.1 of the product roadmap.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testability if necessary, but primarily for understanding what to test)
- `src/__tests__/firestore.test.ts` (new file for the tests)
- `src/__mocks__/firebase-firestore.ts` (or similar, if specific Firebase mocking utilities are created)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `vite.config.ts` (unless absolutely necessary for Vitest configuration, keep changes minimal)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to add Vitest unit tests for the helper functions defined in `src/lib/firestore.ts`.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock the Firebase Firestore SDK (e.g., `firebase/firestore`) to isolate the `firestore.ts` helpers from actual database interactions. You may need to create a dedicated mock file if the mocks become complex.
3.  **Identify key functions:** Focus on testing the primary CRUD-related helper functions in `src/lib/firestore.ts` that interact with `collection`, `doc`, `addDoc`, `getDoc`, `updateDoc`, and `deleteDoc`. Prioritize functions that abstract common Firestore operations.
4.  **Write unit tests:**
    *   For each selected helper function, write tests to verify its behavior under typical success conditions.
    *   Ensure the tests assert that the Firebase SDK methods are called with the correct arguments.
    *   Aim for good functional coverage of a few core helper functions, rather than shallow coverage of all functions.
5.  **Verify test execution:** Ensure the new tests run successfully using `npm test`.

**Example of functions to target:**
*   `addNailItem`
*   `getNailItem`
*   `updateNailItem`
*   `deleteNailItem`
*   Any helper functions related to fetching collections or specific documents.

The goal is to establish a robust testing foundation for our Firestore integration.
