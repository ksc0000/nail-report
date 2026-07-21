# Worker Prompt Template

## Context

The project is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test Coverage, by adding unit tests for core Firebase helper functions. Vitest is the designated test runner.

## Objective

Implement Vitest unit tests for the `addNailItem` and `getNailItems` helper functions located in `src/lib/firestore.ts`. These tests should effectively mock the Firebase SDK to ensure isolation and rapid execution.

## Allowed Scope

- `src/lib/firestore.ts` (minimal modifications allowed if necessary for testability, e.g., exporting a helper function, but prefer to keep existing code untouched)
- `src/__tests__/firestore.test.ts` (new file for test cases)
- `vitest.config.ts` (only for essential mocking configuration if not already present; assume Vitest is set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Implement unit tests for `addNailItem` and `getNailItems` functions within `src/lib/firestore.ts`.
- Ensure tests correctly mock Firebase Firestore SDK calls (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `query`, `orderBy`, etc.) using Vitest's mocking capabilities.
- Verify that `addNailItem` successfully calls `addDoc` with correct data.
- Verify that `getNailItems` correctly queries and returns data as expected.
- Keep the overall diff (added, modified, deleted lines) ≤ 150 lines.
- Run `npm test` and ensure all new tests pass.
- Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
