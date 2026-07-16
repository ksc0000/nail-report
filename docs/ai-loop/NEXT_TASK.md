# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. A key objective for Phase 2.1 is to enhance test coverage for core utility functions. This task specifically targets the `firestore.ts` helper functions. Vitest is already configured for the project.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (for reference)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/mocks/firestore.mock.ts` (new file for Firebase SDK mocks, if needed)

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

Your task is to add a new test file, `src/__tests__/firestore.test.ts`, and write unit tests for a selection of functions in `src/lib/firestore.ts`.

Focus on testing the following functions, ensuring you mock the Firebase Firestore SDK appropriately using `vitest.mock`:

1.  `addNailItem`
2.  `getNailItem`
3.  `updateNailItem`
4.  `deleteNailItem`
5.  `getNailItems`
6.  `addShare`
7.  `getShare`
8.  `updateShare`
9.  `deleteShare`

*   **Mocking:** Create mock implementations for Firestore methods (e.g., `getFirestore`, `collection`, `doc`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `query`, `onSnapshot`). You may create a dedicated mock file, e.g., `src/__tests__/mocks/firestore.mock.ts`, if it helps organize the mocks.
*   **Assertions:** Assert that the Firestore SDK methods are called with the correct arguments and that the helper functions return the expected values or handle errors as appropriate.
*   **Coverage:** Aim for at least basic happy-path coverage for each specified function. Error path testing can be a follow-up task.

## Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` is created.
- Unit tests are implemented for `addNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `addShare`, `getShare`, `updateShare`, `deleteShare` functions from `src/lib/firestore.ts`.
- The Firebase Firestore SDK is mocked correctly using `vitest.mock`.
- All added tests pass successfully.

## Required Test Commands

```bash
npm test
npm run build
npm run lint
```

## Suggested next task

Add loading skeleton to nail item list (`src/App.tsx`).
