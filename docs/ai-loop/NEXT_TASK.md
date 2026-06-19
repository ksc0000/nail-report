# Worker Prompt Template

## Context

The application needs improved test coverage, starting with core Firebase helper functions. `src/lib/firestore.ts` contains critical data manipulation logic that requires unit tests to ensure stability and correctness. This task addresses Phase 2.1 (Test coverage) of the product roadmap.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to export functions for testing if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/lib/firebase.ts` (only if absolutely necessary for test setup, e.g., mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Focus on testing key CRUD operations such as `addNailItem`, `updateNailItem`, `deleteNailItem`, and `getNailItems` (or similar core helpers) within `src/lib/firestore.ts`.
- Mock Firebase Firestore SDK methods (e.g., `doc`, `collection`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) using `vi.mock` to ensure tests are isolated unit tests.
- Ensure tests cover both successful operations and basic error scenarios (e.g., a failed add operation).
- Do NOT modify the existing application logic in `src/lib/firestore.ts` unless it's to export a function for testing purposes.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
