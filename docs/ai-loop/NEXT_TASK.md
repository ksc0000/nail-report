# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The current state shows that initial AI Loop setup is complete, and a substantive task is pending. This task initiates the test coverage efforts outlined in Phase 2.1 by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter core logic)
- `src/__tests__/lib/firestore.test.ts` (new test file)
- `vitest.config.ts` (if minor configuration is strictly necessary for mocking, but prefer to keep it minimal)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or folders outside of the `Allowed Scope`.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using Vitest's mocking capabilities.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`).
- Ensure tests cover basic success cases and error handling where applicable.
- Run `npm run build && npm run lint` before finishing.
- Run `npm run test` and ensure all tests pass.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker prompt

Jules, your task is to implement Vitest unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: `src/__tests__/lib/firestore.test.ts`.
2.  **Set up Vitest mocking**: Mock the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `query`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) as necessary within `src/__tests__/lib/firestore.test.ts` to isolate the `firestore.ts` functions.
3.  **Write unit tests**: Implement tests for at least two functions from `src/lib/firestore.ts`. Focus on essential CRUD operations like `getNailItems` and `addNailItem`.
    *   For `getNailItems`, test that it correctly fetches and processes data from a mocked Firestore.
    *   For `addNailItem`, test that it correctly calls the underlying Firestore `addDoc` with the provided data.
    *   Consider both success paths and basic error handling (e.g., if a mock Firestore operation throws an error).
4.  **Ensure no core logic changes**: The modifications to `src/lib/firestore.ts` should be minimal, ideally none, unless necessary for testing (e.g., exporting an internal helper).
5.  **Verify**:
    *   Run `npm run build && npm run lint` and confirm no errors.
    *   Run `npm run test` and confirm all new tests pass.

This task is a foundational step in improving test coverage for the application's core logic.
