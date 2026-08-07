# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. The current state indicates that test coverage is a priority. This task will initiate unit testing for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK interactions to test the logic within the helpers.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest setup is needed, though it should be already configured for basic usage)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (e.g., `getFirestore`, `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`).
- Write tests for at least two functions within `src/lib/firestore.ts`, such as `getNailItem` and `addNailItem`.
- Ensure the tests assert expected outcomes (e.g., successful data retrieval, correct data updates, error handling).
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
