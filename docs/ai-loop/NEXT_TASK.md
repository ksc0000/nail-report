# Worker Prompt Template

## Context

The product roadmap for nail-report is focused on improving stability, test coverage, and UX in Phase 2. The immediate goal is to enhance test coverage for core utility functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on covering at least one key function with basic CRUD-related operations or data transformation.

## Allowed Scope

- `src/lib/firestore.ts` (for inspection of functions to test)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (to verify Vitest scripts are present, but **do not add new dependencies or modify existing ones unless explicitly for a test script**)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest should already be configured)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least one function in `src/lib/firestore.ts`. Good candidates include functions related to adding, getting, updating, or deleting `nailItems`.
- Mock Firebase SDK dependencies as needed using `vi.mock` to isolate the unit under test.
- Ensure the tests are clear, readable, and cover basic functionality.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
