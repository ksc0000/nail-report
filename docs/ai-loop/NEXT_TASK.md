# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage improvements by adding unit tests for core utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal changes to logic)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `src/App.css` (no changes expected for this task)
- `vite.config.ts` (add test configuration if not already present)
- `package.json` (add Vitest scripts if not already present)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add unit tests for at least two key functions in `src/lib/firestore.ts`. Examples include `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, or `generateShareLink`.
- Use Vitest for testing. If Vitest is not already configured, add the necessary configuration to `vite.config.ts` and `package.json` scripts.
- Mock Firebase SDK dependencies as needed to ensure isolated unit tests.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Ensure the new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Jules, your task is to add unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Set up Vitest (if not already done):**
    *   Verify `package.json` has `vitest` as a dev dependency and a `test` script (e.g., `"test": "vitest"`).
    *   Verify `vite.config.ts` is configured for Vitest (e.g., `test: { environment: 'jsdom' }`). If not, add basic setup.
2.  **Create a new test file:**
    *   Create `src/__tests__/lib/firestore.test.ts`.
3.  **Write unit tests:**
    *   Identify at least two functions in `src/lib/firestore.ts` to test (e.g., `addNailItem`, `getNailItems`).
    *   Write isolated unit tests for these functions.
    *   Use `vi.mock('firebase/firestore', ...)` to mock Firebase Firestore SDK functions and simulate their behavior (e.g., `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
    *   Ensure the tests cover success cases and potential error handling where applicable.
4.  **Verify:**
    *   Run `npm run build`.
    *   Run `npm run lint`.
    *   Run `npm run test` and ensure your new tests pass.

This task is complete once at least two functions in `src/lib/firestore.ts` have passing unit tests with mocked Firebase dependencies, and all checks (`build`, `lint`, `test`) pass.
