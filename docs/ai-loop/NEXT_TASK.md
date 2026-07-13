# Worker Prompt Template

## Context

The application is in Phase 2, with a focus on improving stability and test coverage. This task initiates the test coverage effort by adding unit tests for core Firebase utility functions. Vitest is already configured as the test runner.

## Objective

Add comprehensive unit tests for the helper functions located in `src/lib/firestore.ts`. This involves mocking Firebase SDK interactions to test the functions in isolation.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, e.g., exporting unexported functions if necessary for testing)
- `src/__tests__/lib/firestore.test.ts` (new file for unit tests)
- `vite.config.ts` (if Vitest configuration for `src/__tests__/` needs adjustment, but this should be minimal or unnecessary)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for all exported helper functions in `src/lib/firestore.ts`.
- Use `vitest` and `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore` functions like `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`).
- Ensure tests cover typical success cases, edge cases, and error handling paths for these functions.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
