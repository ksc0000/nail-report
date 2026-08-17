# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "Test coverage" objective (2.1) by adding unit tests for core Firebase helper functions. Vitest is already part of the project's testing strategy.

## Objective

Implement unit tests for key helper functions within `src/lib/firestore.ts` using Vitest, specifically mocking the Firebase SDK as needed.

## Allowed Scope

- `src/lib/firestore.ts` (for minor modifications to enable testing, e.g., exporting non-exported functions if necessary, but prioritize testing existing public exports)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (to ensure `test` script runs Vitest correctly, if not already configured)

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

## Worker prompt

Your task is to add unit tests for the `src/lib/firestore.ts` module.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Utilize `vi.mock` from Vitest to mock the Firebase Firestore SDK methods that `src/lib/firestore.ts` interacts with. Focus on mocking the `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc` functions/chains as they relate to `firestore.ts`.
3.  **Test `addNailItem`:** Write a unit test for the `addNailItem` function to ensure it correctly calls the mocked Firestore `addDoc` with the expected data and collection path.
4.  **Test `getNailItems`:** Write a unit test for the `getNailItems` function to ensure it correctly calls the mocked Firestore `getDocs` and transforms the snapshot data into the expected format.
5.  **Test other relevant functions (if time/line budget allows):** If the above two tests are completed well within the line limit, consider adding tests for `getNailItem` or `updateNailItem`.
6.  **Ensure tests are isolated:** Each test should only assert the behavior of the `firestore.ts` function being tested, relying on mocks for external dependencies.

**Acceptance Criteria:**

*   A new file `src/__tests__/firestore.test.ts` exists.
*   `addNailItem` and `getNailItems` functions in `src/lib/firestore.ts` have corresponding unit tests.
*   The Firebase Firestore SDK is appropriately mocked for these tests using `vi.mock`.
*   Running `npm test` passes all new tests.

**Required Test Commands:**

```bash
npm run build
npm run lint
npm test
```
