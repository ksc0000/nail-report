# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. This task focuses on adding foundational unit tests for core Firebase operations to ensure data integrity and reliability.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for minor refactoring to improve testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if Vitest configuration specifically for this file is needed)

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

Implement unit tests for the Firebase Firestore helper functions in `src/lib/firestore.ts`.

1.  **Inspect `src/lib/firestore.ts`**: Identify the primary exported functions that interact with Firestore (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, etc.).
2.  **Create `src/__tests__/firestore.test.ts`**: This new file will house your unit tests.
3.  **Mock Firebase SDK**: Use `vitest`'s mocking capabilities (`vi.mock`) to mock the Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) to isolate the `firestore.ts` logic. You should mock these to return predictable values or throw specific errors to test different scenarios.
4.  **Write Unit Tests**: For at least two key functions identified in step 1, write unit tests that cover:
    *   Successful execution with expected data.
    *   Error handling (e.g., if a Firestore operation fails).
5.  **Ensure Test Isolation**: Tests should not interact with a live Firebase project.
6.  **Code Quality**: Ensure the new test file adheres to existing code style and linting rules.

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` is created.
- At least two key functions from `src/lib/firestore.ts` have mocked unit tests covering success and error paths.
- All tests pass when `npm test` is run.
- The `firestore.ts` file remains functional and passes existing linting/build checks.

**Required Test Commands:**
```bash
npm test src/__tests__/firestore.test.ts
npm run build
npm run lint
```
