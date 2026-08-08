# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. The first priority within Phase 2 is enhancing test coverage. This task will initiate that effort by adding unit tests for a critical utility file.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on covering the main CRUD operations or utility functions present in the file.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments to make functions testable if necessary, but primarily adding tests)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration is needed for mocking, unlikely but allowed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or any other UI-related CSS files.

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts` to house the new tests.
- Mock Firebase SDK dependencies (Firestore, Auth, Storage) using `vi.mock` as needed for isolation.
- Write unit tests for at least 2-3 key helper functions in `src/lib/firestore.ts`. Examples include functions for adding, getting, or updating nail items/tags.
- Ensure tests cover basic success cases and ideally some error cases for the mocked functions.
- Run `npm run build && npm run lint` before finishing.
- Run `npm run test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
