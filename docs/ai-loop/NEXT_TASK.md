# Worker Prompt Template

## Context

The current roadmap prioritizes improving stability, test coverage, and UX. This task focuses on test coverage for core Firebase interaction logic.

## Objective

Add unit tests for the helper functions in `src/lib/firestore.ts` using Vitest, specifically targeting the CRUD operations for `nailItems`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability are allowed)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `vitest.config.ts` (if minimal configuration changes are required for tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx`, `src/App.css`, or other UI components not directly related to `firestore.ts`

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase Firestore SDK interactions using `vi.mock` as necessary to isolate `firestore.ts` logic.
- Implement tests for at least the `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` functions.
- Ensure tests verify successful operations and handle potential error paths (e.g., failed add, item not found for update/delete).
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
