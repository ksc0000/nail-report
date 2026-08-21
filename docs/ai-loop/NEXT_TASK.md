# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2.1 "Test coverage" is active, with the goal of adding unit tests using Vitest. The current task is to begin implementing these tests for core helper functions.

## Objective

Add comprehensive unit tests for the functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting non-exported functions, but prefer not to change production code for testing)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration is needed for mocking Firebase, but prefer not to change unless strictly necessary)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant to this task)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.
- Ensure tests effectively mock Firebase SDK calls to isolate `firestore.ts` logic.
- Cover major functions and edge cases within `src/lib/firestore.ts` (e.g., `addDocument`, `getDocuments`, `updateDocument`, `deleteDocument`).

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
