```markdown
# Worker Prompt Template

## Context

The current focus is on improving stability, test coverage, and UX in Phase 2. This task specifically targets adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for helper functions in `src/lib/firestore.ts` using Vitest, with appropriate mocking of the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes might be needed for testability, but prioritize adding tests)
- `src/__tests__/firestore.test.ts` (or similar new test file(s))
- `vite.config.ts` (if Vitest configuration is missing for mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (CSS improvements - not relevant for this task)
- `src/lib/storage.ts`, `src/lib/auth.ts`, `src/lib/publicShares.ts` (test these in later tasks)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to add unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Add a new test file, for example, `src/__tests__/firestore.test.ts`.
2.  **Focus on mocking Firebase SDK:** Utilize `vitest` and `vi.mock` to mock the Firebase Firestore SDK calls (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, etc.).
3.  **Test at least two functions:** Implement unit tests for at least two of the core helper functions in `src/lib/firestore.ts`. Good candidates include `addItem`, `updateItem`, or `deleteItem`.
4.  **Ensure tests pass:** Verify that all new tests pass when running `npm test`.
5.  **Do not add new dependencies:** Ensure no new npm packages are added to `package.json`.

## Acceptance Criteria

-   A new test file (`src/__tests__/firestore.test.ts` or similar) exists.
-   At least two helper functions from `src/lib/firestore.ts` have comprehensive unit tests.
-   Firebase Firestore SDK interactions within these tests are properly mocked using `vi.mock`.
-   All new tests pass when `npm test` is executed.
-   The line diff is within the 150-line limit.

## Required Test Commands

```bash
npm install
npm test
npm run build
npm run lint
```
```
