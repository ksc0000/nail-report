# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, which focuses on improving stability, test coverage, and UX. This task specifically targets "2.1 Test coverage" by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the `nailItems` CRUD operations within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability)
- `src/__tests__/` (new test file, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor config adjustments are needed for mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, `src/__tests__/firestore.test.ts`.
- Focus on testing the following functions from `src/lib/firestore.ts` for the `nailItems` collection:
    - `addNailItem`
    - `getNailItems` (ensure it handles various query options/sorting correctly)
    - `updateNailItem`
    - `deleteNailItem`
- Mock the Firebase SDK (`firebase/firestore`) using `vi.mock` to prevent actual database calls. Mock `getFirestore`, `collection`, `addDoc`, `getDocs`, `query`, `orderBy`, `limit`, `doc`, `updateDoc`, `deleteDoc`.
- Ensure tests cover successful operations and basic error scenarios (e.g., trying to update/delete non-existent items if easily mockable).
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
