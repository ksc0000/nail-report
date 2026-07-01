# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key initial step in Phase 2.1 is to add unit tests for Firebase helper functions. This task specifically targets the `firestore.ts` helpers.

## Objective

Implement Vitest unit tests for selected helper functions in `src/lib/firestore.ts`, focusing on a few straightforward functions to establish the testing pattern.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize testing existing exports)
- `src/__tests__/` (new test file, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration is required for mocks, but prefer minimal changes)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx` or other UI components

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two simple, exportable functions within `src/lib/firestore.ts`. Examples might include `getNailItem` or `createNailItem` (mocking Firebase SDK calls).
- Use `vitest` for testing and `vi.mock` for mocking Firebase dependencies (e.g., `firebase/firestore`).
- Ensure tests cover basic success cases for the chosen functions.
- Keep the overall diff size ≤ 150 lines, including the new test file and any minor changes to `firestore.ts` if necessary for testability.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Suggested next task:** Add Vitest unit tests for `src/lib/storage.ts` helper functions.
