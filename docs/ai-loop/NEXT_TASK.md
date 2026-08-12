# Worker Prompt Template

## Context

The application is in Phase 2, focusing on stability, test coverage, and UX. The immediate goal is to improve test coverage for core utility functions. This task specifically addresses adding unit tests for Firestore helper functions.

## Objective

Implement unit tests for key helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts` (for understanding functions to test)
- `src/__tests__/` (for new test files)
- `package.json` (only for script commands if absolutely necessary for test execution, but no dependency changes)

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

1.  **Create a new test file:** In `src/__tests__/`, create `firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock the Firebase Firestore SDK (e.g., `firebase/firestore`) to prevent actual database calls during tests. Focus on mocking the necessary functions (e.g., `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`).
3.  **Implement Unit Tests:** Add tests for the following functions from `src/lib/firestore.ts`:
    *   `createNailItem`: Test its ability to correctly call `addDoc` with the expected data.
    *   `getNailItemsForUser`: Test its ability to correctly call `getDocs` and transform the snapshot into the expected array of `NailItem` objects.
4.  **Assertions:** Use Vitest's assertion library (`expect`) to verify that the mocked Firebase functions are called with the correct arguments and that the helper functions return the expected results.
5.  **Clean up:** Ensure no console logs or commented-out code remain.

## Acceptance Criteria

- A new file `src/__tests__/firestore.test.ts` exists.
- The `firestore.test.ts` file contains unit tests for `createNailItem` and `getNailItemsForUser` from `src/lib/firestore.ts`.
- Firebase Firestore SDK interactions are properly mocked using `vi.mock`.
- Tests assert correct function calls and return values.
- All tests pass when running `npm test`.

## Required Test Commands

```bash
npm test
npm run build
npm run lint
```
