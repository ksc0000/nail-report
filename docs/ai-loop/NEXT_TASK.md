```markdown
# Worker Prompt Template

## Context

The current roadmap focuses on improving stability, test coverage, and UX in Phase 2. The immediate goal is to enhance test coverage for core utility functions. Vitest is the chosen test runner, and Firebase SDK mocking is a key part of this effort.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on ensuring the basic CRUD operations for `nailItems` and `publicShares` are correctly tested. This involves setting up Firebase SDK mocking to isolate `firestore.ts` functions from actual Firebase calls during tests.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if necessary for testing, e.g., to allow injecting mocks, but prefer non-invasive testing)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `package.json` (only to confirm Vitest setup, no new dependencies)
- `vite.config.ts` (if Vitest configuration is needed, e.g., for global mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any other files outside the allowed scope.

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for the main helper functions in `src/lib/firestore.ts` related to `nailItems` and `publicShares`.
- Use `vitest` and `vi.mock` to mock the Firebase Firestore SDK to prevent actual database calls during tests.
- Ensure test coverage for scenarios like adding, getting, updating, and deleting items.
- Keep the diff for the PR ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
