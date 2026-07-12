# Worker Prompt Template

## Context

The current phase focuses on improving stability, test coverage, and UX. This task contributes to Phase 2.1 (Test coverage) by adding unit tests for core Firebase Firestore helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`, focusing on mocking the Firebase SDK correctly.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability, but the primary goal is adding tests)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest configuration is needed, but typically it should be ready)
- `package.json` (only to confirm Vitest scripts are present, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two key CRUD helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem` or similar functions that interact with Firestore).
- Mock the Firebase Firestore SDK using `vi.mock` to ensure tests are isolated and do not require a live Firebase connection.
- Ensure the tests cover basic success cases for the chosen functions.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
