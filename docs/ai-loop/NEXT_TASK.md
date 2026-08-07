# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" goal. The current state indicates that the first substantive task is pending.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on a few core functions to establish the testing pattern for this file.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to enable testability if necessary, e.g., exporting non-default functions)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only for adding a `test` script if not already present, no new dependencies)
- `vite.config.ts` (only for Vitest setup if necessary)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Implement unit tests for at least two core helper functions in `src/lib/firestore.ts` (e.g., `createNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem`).
- Use Vitest for testing. Mock Firebase SDK dependencies as needed (e.g., `firebase/firestore`).
- Ensure `npm run build && npm run lint` pass before finishing.
- Run `npm run test` to confirm tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Jules,

Your task is to add unit tests for the `src/lib/firestore.ts` helper functions.

1.  **Create a test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Configure Vitest (if needed):** Ensure Vitest is set up. If there's no `test` script in `package.json`, add `"test": "vitest"` to the `scripts` section. If `vite.config.ts` needs `test` configuration, add minimal setup for Vitest.
3.  **Implement tests:** Write unit tests for at least two functions from `src/lib/firestore.ts`.
    *   Focus on isolated testing, meaning you should mock any external dependencies like Firebase Firestore SDK calls.
    *   Use `vi.mock` from Vitest for mocking Firebase modules.
    *   Ensure the tests cover basic success cases for the chosen functions.
4.  **Verify:**
    *   Run `npm run test` and ensure your new tests pass.
    *   Run `npm run build && npm run lint` to ensure no build or linting errors are introduced.

This task should establish a pattern for testing `src/lib/firestore.ts`. Keep the scope limited to a few functions to adhere to the PR size constraint.
