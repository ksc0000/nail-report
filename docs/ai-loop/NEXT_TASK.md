# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses Phase 2.1: "Test coverage". The application uses Vitest for testing.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This task should specifically target the core CRUD operations for nail items.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally not changing logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if adding `vitest` or `jsdom` configuration; no new npm dependencies)
- `vite.config.ts` (only if adding Vitest configuration)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no *new* npm packages without human approval, can adjust existing test-related configs)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker Prompt

Your task is to add unit tests for the core Firestore helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock('firebase/firestore')` and `vi.mock('firebase/auth')` as necessary to isolate the functions under test. Focus on mocking the Firestore specific methods like `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc` and `query`. You will need to mock these to simulate successful and failed operations.
3.  **Test `addNailItem`**: Verify that it calls `addDoc` with the correct arguments and returns the expected result.
4.  **Test `getNailItems`**: Verify that it calls `getDocs` with the correct query and processes the snapshot correctly, returning an array of nail items. Include tests for empty results.
5.  **Test `updateNailItem`**: Verify that it calls `updateDoc` with the correct arguments.
6.  **Test `deleteNailItem`**: Verify that it calls `deleteDoc` with the correct arguments.
7.  **Error Handling**: If `firestore.ts` has explicit `try...catch` blocks for Firestore operations, ensure to write tests that assert correct error propagation or handling when the mocked Firestore functions throw errors.
8.  **Setup Vitest configuration**: Ensure `vite.config.ts` has the necessary Vitest setup for running these tests, if not already configured.

**Acceptance Criteria**:

*   A new file `src/__tests__/firestore.test.ts` exists.
*   The tests in `src/__tests__/firestore.test.ts` pass successfully.
*   The `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` functions have at least one passing unit test each.
*   Firebase Firestore SDK interactions are effectively mocked.

**Required Test Commands**:

```bash
npm run test
npm run build && npm run lint
```
