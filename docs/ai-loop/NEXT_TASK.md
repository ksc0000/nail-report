# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. This task specifically targets enhancing test coverage for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of Firebase SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, e.g., exporting non-exported functions if necessary, but prefer to test public interfaces)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `package.json` (no new dependencies, but ensure `test` script runs Vitest)
- `vite.config.ts` (minor modifications for Vitest setup if absolutely required for mocking, though Vitest is assumed to be configured)

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

## Worker Prompt

Your task is to add comprehensive unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Set up the Test File:** Create a new test file at `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock('firebase/firestore')` to mock Firestore functions like `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, etc. Focus on mocking their return values and verifying their calls.
3.  **Test `addNailItem`:**
    *   Verify that `addDoc` is called with the correct `collection` reference and data.
    *   Test successful addition.
    *   Test error handling if `addDoc` throws.
4.  **Test `getNailItems`:**
    *   Verify `collection` and `getDocs` are called correctly.
    *   Mock `getDocs` to return a snapshot with mocked documents (e.g., `id`, `data()`).
    *   Test successful retrieval and mapping of items.
    *   Test error handling.
5.  **Test `updateNailItem`:**
    *   Verify `doc` and `updateDoc` are called with the correct `doc` reference and data.
    *   Test successful update.
    *   Test error handling.
6.  **Test `deleteNailItem`:**
    *   Verify `doc` and `deleteDoc` are called with the correct `doc` reference.
    *   Test successful deletion.
    *   Test error handling.
7.  **Run Tests:** Execute `npm test` to ensure all new tests pass.
8.  **Lint and Build:** Run `npm run build && npm run lint` to confirm no new errors are introduced.

Focus on clear, isolated unit tests for each function's core logic and error paths. Do not introduce any new npm dependencies.

### Acceptance Criteria

- A new file `src/__tests__/lib/firestore.test.ts` exists.
- This file contains at least one test suite with individual tests for `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
- Firebase SDK functions are correctly mocked using `vi.mock('firebase/firestore')`.
- All tests in `src/__tests__/lib/firestore.test.ts` pass when running `npm test`.

### Required test commands
```bash
npm test
npm run build && npm run lint
```
