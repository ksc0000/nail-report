# Worker Prompt Template

## Context

The product roadmap for nail-report is focused on improving stability, test coverage, and UX in Phase 2. The immediate next step is to address test coverage for core utility functions. Vitest is already set up as the test runner.

## Objective

Add comprehensive unit tests for the helper functions within `src/lib/firestore.ts`. Focus on ensuring coverage for basic CRUD operations and error handling if present in these helpers.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally not)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor configuration is absolutely necessary for mocking, but prefer to mock within the test file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or directories outside the explicitly allowed scope.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using Vitest's `vi.mock()`.
- Cover functions for adding, getting, updating, and deleting documents, or any other core helpers present in `src/lib/firestore.ts`.
- Include tests for successful operations and relevant error scenarios.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
