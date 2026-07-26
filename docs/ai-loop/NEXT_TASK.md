# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task addresses the "Test coverage" goal by adding unit tests for a critical helper module. Vitest is the chosen test runner for the project.

## Objective

Implement unit tests for one or more helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications if needed to make functions testable, e.g., exporting a non-exported helper for direct testing, but prioritize minimal changes)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/App.css` (no changes expected for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest is assumed to be already configured)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least one core helper function in `src/lib/firestore.ts` (e.g., a function for fetching a list of items or adding a new item).
- Mock Firebase SDK dependencies as needed using `vi.mock` to isolate the unit under test.
- Ensure the tests are self-contained and do not make actual calls to Firebase services.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items (e.g., "more tests needed for X function") as comments in the PR description, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
