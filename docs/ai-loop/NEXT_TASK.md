# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The current focus area is `2.1 Test coverage`, specifically adding unit tests. Vitest is already established as the test runner, and Firebase SDK mocking is a stated goal.

## Objective

Add unit tests for core Firestore helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary)
- `src/__tests__/` (new test files for firestore helpers)
- `src/setupTests.ts` (if a global setup for Firebase mocking is needed and not already present)

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

## Worker Prompt

Implement unit tests for the following key functions in `src/lib/firestore.ts`:
1.  `addNailItem`
2.  `getNailItems`
3.  `deleteNailItem`

These tests should reside in a new file, e.g., `src/__tests__/firestore.test.ts`. Focus on mocking Firebase Firestore SDK methods (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) to ensure tests are isolated and do not interact with a live Firebase project. Use `vi.mock` from Vitest for mocking. Ensure the tests verify correct data transformation, function calls, and error handling for these specific functions.

## Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` is created.
- Unit tests cover the `addNailItem`, `getNailItems`, and `deleteNailItem` functions.
- Firebase SDK interactions are fully mocked within the tests.
- All new tests pass successfully.
- Code style and linting checks pass.

## Required Test Commands

```bash
npm test
npm run build
npm run lint
```
