# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage, by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Create a new test file for these tests.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments to make functions testable, e.g., exports)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, minimal changes)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any other files not explicitly listed in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file at `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, or similar data manipulation functions).
- Ensure Firebase SDK calls are appropriately mocked using `vitest` and `vi.mock` to prevent actual Firebase interactions during tests.
- Run `npm run test` (or `npx vitest`) to verify tests pass.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Implement unit tests for `src/lib/firestore.ts`.

1.  **Create a new test file**: Add `src/__tests__/firestore.test.ts`.
2.  **Import dependencies**: In the new test file, import the functions from `src/lib/firestore.ts` that you intend to test, as well as `vi` and `describe`, `it`, `expect` from `vitest`.
3.  **Mock Firebase SDK**: Set up `vi.mock` for any Firebase SDK imports (e.g., `firebase/firestore`) that `src/lib/firestore.ts` depends on. Ensure mock return values simulate successful operations (e.g., resolving promises with mock data).
4.  **Write tests**: Implement `describe` blocks for `src/lib/firestore.ts` and `it` blocks for individual helper functions.
    *   Focus on testing at least `addNailItem` and `getNailItems` if they exist, or similar core CRUD operations.
    *   Verify that the functions correctly interact with the mocked Firebase methods (e.g., `collection`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
    *   Assert that functions return expected data or handle errors gracefully (e.g., returning `null` or throwing a specific error for a failed operation, if applicable in the current implementation).
5.  **Run tests**: Execute `npm run test` (or `npx vitest`) to confirm your tests pass.
6.  **Lint and Build**: Run `npm run build && npm run lint` to ensure no new errors are introduced.
