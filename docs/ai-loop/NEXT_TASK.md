# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses the "2.1 Test coverage" goal. The codebase currently lacks unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (for minor refactoring to enable testing, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only to add a `test` script if not already present, do not add new dependencies)
- `vite.config.ts` (only for Vitest configuration if necessary, but assume Vitest is already set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, Vitest is assumed to be part of the existing setup)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) as needed to isolate `firestore.ts` logic.
- Ensure at least one test covers `getNailItems` and `addNailItem` (or equivalent CRUD operations present in `firestore.ts`).
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` (or `vitest`) to confirm tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
