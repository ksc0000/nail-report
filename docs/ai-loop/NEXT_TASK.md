# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts outlined in Phase 2.1 by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, but unlikely)

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

Your task is to create a new test file `src/__tests__/firestore.test.ts` and implement unit tests for the functions in `src/lib/firestore.ts`.

Specifically, you should:
1.  **Create `src/__tests__/firestore.test.ts`**: This will be the home for your new unit tests.
2.  **Mock Firebase SDK**: Use `vi.mock('firebase/firestore')` to mock the necessary Firestore functions (e.g., `collection`, `doc`, `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`) to ensure tests are isolated from actual Firebase calls.
3.  **Test key helper functions**: Implement tests for at least the following functions from `src/lib/firestore.ts`:
    *   `addNailItem`
    *   `getNailItem`
    *   `getNailItems` (ensure it handles a list of documents)
    *   `updateNailItem`
    *   `deleteNailItem`
4.  **Use Vitest assertions**: Write clear assertions to verify the correct behavior of the functions, including error handling where applicable.
5.  **Clean up**: Ensure no actual Firebase calls are made during the tests.

## Acceptance Criteria

-   A new file `src/__tests__/firestore.test.ts` exists.
-   The tests in `src/__tests__/firestore.test.ts` cover the main CRUD operations (`addNailItem`, `getNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`) from `src/lib/firestore.ts`.
-   The Firebase Firestore SDK is correctly mocked using `vi.mock` to prevent actual network calls.
-   All tests pass when running `npm test`.
-   `npm run build && npm run lint` execute successfully without errors or warnings.

## Commands run and results

```bash
# To be filled by the worker
```

## Known issues or limitations

-   None yet.

## Suggested next task

Add Vitest + unit tests for `src/lib/storage.ts` helpers.
