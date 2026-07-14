# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase Firestore helper functions. Vitest has been selected as the test runner for this phase.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. The focus should be on covering the primary CRUD operations related to nail items.

## Allowed Scope

- `src/lib/firestore.ts` (for inspection of functions to be tested)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only for adding/modifying test scripts, e.g., `test` command, if not already configured for Vitest; **no new npm dependencies**)
- `vite.config.ts` (if minor Vitest configuration is needed, assuming Vitest is already installed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least the `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts`.
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
- The tests should verify correct interaction with the mocked Firebase functions, not the actual Firebase service.
- Ensure the diff for this PR is ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Assume Vitest is already installed and configured in the project; do not add new npm dependencies. If `npm run test` does not work, attempt to configure the `test` script in `package.json` to run `vitest`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
