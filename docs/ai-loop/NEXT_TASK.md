# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "Test coverage" goal by adding unit tests for the Firebase Firestore helper functions. Establishing a robust testing suite for core library functions is crucial for future development and refactoring.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. The tests should effectively mock the Firebase Firestore SDK to ensure isolation and predictability.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to facilitate testing, if necessary, but primarily for understanding)
- `src/__tests__/firestore.test.ts` (new file for the unit tests)
- `package.json` (only for adding a `test` script entry for Vitest, if not already present, do NOT add new dependencies)
- `vite.config.ts` (minor configuration for Vitest, if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, ensure Vitest is already configured)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Identify and write unit tests for the primary helper functions within `src/lib/firestore.ts` that interact with Firestore (e.g., functions for adding, retrieving, updating, and deleting `nailItems` or `publicShares`).
- Utilize Vitest and `vi.mock` to mock the Firebase Firestore SDK (`firebase/firestore`) to isolate `src/lib/firestore.ts` functions from actual Firebase calls during tests.
- Ensure tests cover both successful operations and gracefully handling potential errors returned by the mocked Firestore SDK.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
