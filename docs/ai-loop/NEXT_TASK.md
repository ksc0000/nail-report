```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage. The application uses Vitest for testing. The current state indicates that no substantive roadmap tasks are in progress yet, making this a suitable first functional task.

## Objective

Implement unit tests for selected helper functions within `src/lib/firestore.ts` using Vitest. The goal is to establish initial test coverage for our Firestore utility functions.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if necessary, but primarily for understanding functions to test)
- `src/__tests__/` (create a new test file, e.g., `src/__tests__/firestore.test.ts`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Focus on adding tests for 1-2 simple, pure helper functions within `src/lib/firestore.ts`. Examples might include functions that transform data or build queries, *not* functions that directly interact with Firestore SDK for CRUD operations (unless they are very simple data transformations before a call).
- Mock Firebase SDK dependencies as needed using `vitest`'s mocking capabilities (`vi.mock`).
- Run `npm run build && npm run lint` before finishing.
- The new test file should reside in `src/__tests__/`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
