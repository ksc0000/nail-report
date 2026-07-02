# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key area is adding unit tests for core helper functions.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest. Focus on covering the main CRUD operations (add, get, update, delete) and their respective success and error paths.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, or adding utility functions for mocking)
- `src/__tests__/lib/firestore.test.ts` (new test file)
- `vitest.config.ts` (minor additions for path aliases or globals if strictly necessary for testing `firestore.ts`, but prefer not to touch)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least the `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts`.
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
- Ensure tests cover both successful operations and error handling.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
