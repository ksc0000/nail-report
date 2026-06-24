# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. This task initiates the test coverage improvements by adding unit tests for core Firebase Firestore helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer not to alter core logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only for adding `test` script or vitest config if absolutely necessary, but generally prefer to use existing setup)
- `vite.config.ts` (if Vitest configuration is missing or needs adjustment)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx` or other UI components

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Implement unit tests for a few key Firestore helper functions, such as `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vitest`'s `vi.mock` to ensure tests run in isolation without actual Firebase calls.
- Cover basic success scenarios for the selected functions.
- Keep the diff ≤ 150 lines. Focus on a subset of functions if testing all of them exceeds the line limit.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
