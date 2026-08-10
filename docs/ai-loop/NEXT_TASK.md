# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. This task addresses `2.1 Test coverage` by adding unit tests for a core utility file.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on testing the primary CRUD operations and data transformations.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize creating a test file)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration is needed for mock setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least the `getNailItems`, `addNailItem`, `updateNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts`.
- Use `vitest` for the test runner and mock Firebase SDK functionalities as needed (e.g., `firebase/firestore`).
- Aim for good test coverage for the specified functions.
- Keep diff ≤ 150 lines.
- Run `npm run test`, `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
