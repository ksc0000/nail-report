# Worker Prompt Template

## Context

The current development phase (Phase 2) focuses on improving stability, test coverage, and UX. This task addresses the "2.1 Test coverage" goal by adding unit tests for core Firebase utility functions.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK interactions to test the logic of the helper functions independently.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize adding tests in a new file)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if `vitest` needs to be added as a *devDependency*, which should already be present per roadmap Phase 2.1; *do not add other new dependencies*)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages *other than vitest dev dependency if absolutely necessary and not already present*)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Ensure tests effectively mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`).
- Cover primary CRUD operations or data retrieval/manipulation functions present in `src/lib/firestore.ts`.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` or `vitest` to confirm tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
