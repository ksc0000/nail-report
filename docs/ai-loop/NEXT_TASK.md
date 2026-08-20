# Worker Prompt Template

## Context

The current phase is "2.0", focusing on improving stability, test coverage, and UX. This task addresses "2.1 Test coverage" by adding unit tests for a critical helper module.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on mocking Firebase SDK interactions and testing at least two key functions.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes for testability if strictly necessary, but prefer not to alter core logic)
- `src/lib/__tests__/firestore.test.ts` (new file)
- `src/setupTests.ts` (if needed for global Vitest setup, unlikely for a small task)
- `package.json` (only for adding a `test` script if missing, but assume Vitest is runnable)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create `src/lib/__tests__/firestore.test.ts`.
- Implement mocks for Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `doc`, `updateDoc`, `deleteDoc`) as needed to test `firestore.ts` functions in isolation.
- Write unit tests for at least two functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure tests cover basic success cases.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
