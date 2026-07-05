# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses test coverage by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This will improve the reliability and maintainability of the Firestore integration.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor adjustments for mocking, if strictly necessary, but prefer in-test mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx`
- Any files outside of `src/lib/firestore.ts` and `src/__tests__/`

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least one core function within `src/lib/firestore.ts` (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use `vitest` for testing and `vi.mock` to mock Firebase SDK dependencies (Firestore instances, document references, etc.) to ensure tests are isolated and fast.
- The tests should verify the correct interaction with the mocked Firestore SDK (e.g., `addDoc`, `updateDoc`, `deleteDoc`, `getDocs` calls with correct arguments).
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` to verify the new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
